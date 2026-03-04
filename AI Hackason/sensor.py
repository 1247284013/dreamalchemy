import socket
import json
import re
import time
import math
import subprocess
import os
import sys
import signal
import errno
from collections import deque

# 必须与 ZIGSIM 中的 PORT NUMBER 一致
UDP_PORT = 5000

# 监听本机所有网卡（推荐）
UDP_IP = "0.0.0.0"

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# Helpful: print PID so you can find/kill it if needed
print(f"[sensor.py] pid={os.getpid()}", flush=True)

def _print_port_owner():
    try:
        out = subprocess.check_output(["lsof", "-nP", f"-iUDP:{UDP_PORT}"], stderr=subprocess.STDOUT)
        text = out.decode("utf-8", errors="replace").strip()
        if text:
            print("当前占用 UDP 端口的进程：", flush=True)
            print(text, flush=True)
    except Exception:
        # if lsof not available, skip
        pass

try:
    sock.bind((UDP_IP, UDP_PORT))
except OSError as e:
    if getattr(e, "errno", None) == errno.EADDRINUSE:
        print(f"❌ UDP {UDP_IP}:{UDP_PORT} 端口被占用（Address already in use）", flush=True)
        _print_port_owner()
        print("\n你可以用下面命令释放端口：", flush=True)
        print(f"  lsof -nP -iUDP:{UDP_PORT}", flush=True)
        print("  kill <PID>", flush=True)
    raise

def _shutdown(*_args):
    try:
        sock.close()
    except Exception:
        pass
    sys.exit(0)

signal.signal(signal.SIGINT, _shutdown)
signal.signal(signal.SIGTERM, _shutdown)

print(f"正在等待接收 UDP 数据... bind={UDP_IP}:{UDP_PORT}", flush=True)

ACCEL_Y_RE = re.compile(r"^\s*accel\s*:\s*y\s*:\s*([+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)\s*$", re.I)

"""
Accel-only shake-to-break

你的描述：
- 静止时 accel 趋向于“直线”，几乎没波动
- 上下摇动时会出现明显的上下波形

策略（只看 accel，默认优先用 y 轴）：
- 用一个滑动时间窗收集 accel_y
- 触发条件 = 窗口内峰峰值(peak-to-peak) + 标准差(std) + 零交叉次数(波形往返)
- 加上迟滞 + 冷却，避免静止噪声误触发和连续连发
"""

last_fire = 0.0
last_debug = 0.0

# 迟滞 + 冷却：避免小幅度/静止误触发 & 避免连发
COOLDOWN_S = 0.55

# 滑动窗口：只用加速度波形判断
WINDOW_S = 0.90
MIN_SAMPLES = 12
MIN_ZERO_CROSSINGS = 3
MIN_ACTIVE_S = 0.10  # 必须满足 ON 条件至少这么久才触发（过滤瞬间尖峰）

# 绝对最小阈值（不同设备单位可能不同；这里偏保守，后续可看 debug 调整）
ABS_ON_STD = 0.08
ABS_ON_P2P = 0.25
ABS_OFF_STD = 0.05
ABS_OFF_P2P = 0.16

# 自适应：基于静止噪声估计的倍率阈值（静止越“直”，阈值越低）
NOISE_EMA_ALPHA = 0.05
ON_MULT = 6.0
OFF_MULT = 3.0

accel_win = deque()  # (t, y)
accel_armed = True
accel_active_since = None  # type: float | None
noise_std_ema = None       # type: float | None
noise_p2p_ema = None       # type: float | None

def press_break_key():
    """
    macOS: simulate pressing "b" in the foreground app (your browser).
    Requires: System Settings -> Privacy & Security -> Accessibility:
      enable Terminal / Python (or your IDE) to control the computer.
    """
    def _frontmost_app_name():
        try:
            out = subprocess.check_output(
                [
                    "osascript",
                    "-e",
                    'tell application "System Events" to get name of first application process whose frontmost is true',
                ],
                stderr=subprocess.STDOUT,
            )
            return out.decode("utf-8", errors="replace").strip()
        except Exception:
            return "unknown"

    front_app = _frontmost_app_name()

    # Try 1: keystroke "b"
    try:
        r = subprocess.run(
            ["osascript", "-e", 'tell application "System Events" to keystroke "b"'],
            check=False,
            capture_output=True,
            text=True,
        )
        if r.returncode != 0:
            print(f"⚠️ osascript keystroke failed (frontApp={front_app}) rc={r.returncode} err={r.stderr.strip()}", flush=True)
    except Exception as e:
        print(f"⚠️ osascript keystroke exception (frontApp={front_app}): {e}", flush=True)

    # Try 2 (fallback): key code 11 ("b" on US keyboard layout)
    try:
        r2 = subprocess.run(
            ["osascript", "-e", 'tell application "System Events" to key code 11'],
            check=False,
            capture_output=True,
            text=True,
        )
        if r2.returncode != 0:
            print(f"⚠️ osascript keycode failed (frontApp={front_app}) rc={r2.returncode} err={r2.stderr.strip()}", flush=True)
    except Exception as e:
        print(f"⚠️ osascript keycode exception (frontApp={front_app}): {e}", flush=True)

def _std(vals):
    if not vals:
        return 0.0
    m = sum(vals) / len(vals)
    var = sum((v - m) * (v - m) for v in vals) / len(vals)
    return math.sqrt(var)

def _zero_crossings(centered_vals, eps=1e-6):
    # 统计符号变化次数（忽略接近 0 的点）
    s_prev = 0
    zc = 0
    for v in centered_vals:
        if abs(v) <= eps:
            continue
        s = 1 if v > 0 else -1
        if s_prev != 0 and s != s_prev:
            zc += 1
        s_prev = s
    return zc

def process_accel_wave(ay: float):
    """
    只用 accel_y 的波形触发：
    - 窗口内 std + p2p + 零交叉 达到 ON 条件并持续 MIN_ACTIVE_S -> 触发一次 BREAK
    - 触发后进入 unarmed，直到窗口强度回落到 OFF 条件以下再重新 armed
    """
    global last_fire, last_debug, accel_armed, accel_active_since
    global noise_std_ema, noise_p2p_ema

    now = time.time()
    accel_win.append((now, ay))
    while accel_win and (now - accel_win[0][0]) > WINDOW_S:
        accel_win.popleft()

    if len(accel_win) < MIN_SAMPLES:
        return

    ys = [v for (_t, v) in accel_win]
    m = sum(ys) / len(ys)
    centered = [v - m for v in ys]
    std = _std(ys)
    p2p = (max(ys) - min(ys)) if ys else 0.0
    zc = _zero_crossings(centered, eps=max(1e-6, std * 0.05))

    # 静止噪声估计：只在 armed 且“明显不是摇动”的时候更新
    if accel_armed:
        if noise_std_ema is None:
            noise_std_ema = std
            noise_p2p_ema = p2p
        else:
            # 如果强度不过大，则认为在“接近静止”状态，可用于更新噪声基线
            if std <= max(ABS_ON_STD, (noise_std_ema or std) * 2.0) and p2p <= max(ABS_ON_P2P, (noise_p2p_ema or p2p) * 2.0):
                noise_std_ema = (1.0 - NOISE_EMA_ALPHA) * noise_std_ema + NOISE_EMA_ALPHA * std
                noise_p2p_ema = (1.0 - NOISE_EMA_ALPHA) * noise_p2p_ema + NOISE_EMA_ALPHA * p2p

    on_std = max(ABS_ON_STD, (noise_std_ema or 0.0) * ON_MULT)
    on_p2p = max(ABS_ON_P2P, (noise_p2p_ema or 0.0) * ON_MULT)
    off_std = max(ABS_OFF_STD, (noise_std_ema or 0.0) * OFF_MULT)
    off_p2p = max(ABS_OFF_P2P, (noise_p2p_ema or 0.0) * OFF_MULT)

    # 0.5 Hz debug，便于你观察“静止 vs 摇动”的差
    if now - last_debug > 2.0:
        last_debug = now
        print(
            f"[accelY] y={ay:.4f} std={std:.4f} p2p={p2p:.4f} zc={zc} "
            f"armed={accel_armed} noiseStd={(0.0 if noise_std_ema is None else noise_std_ema):.4f} "
            f"on(std={on_std:.4f},p2p={on_p2p:.4f}) off(std={off_std:.4f},p2p={off_p2p:.4f})"
        , flush=True)

    # 冷却期不处理
    if now - last_fire <= COOLDOWN_S:
        return

    on_cond = (std >= on_std) and (p2p >= on_p2p) and (zc >= MIN_ZERO_CROSSINGS)
    off_cond = (std <= off_std) and (p2p <= off_p2p)

    if accel_armed:
        if on_cond:
            if accel_active_since is None:
                accel_active_since = now
            if (now - accel_active_since) >= MIN_ACTIVE_S:
                last_fire = now
                accel_armed = False
                accel_active_since = None
                print(f"💥 SHAKE detected -> BREAK (std={std:.4f}, p2p={p2p:.4f}, zc={zc})", flush=True)
                press_break_key()
        else:
            accel_active_since = None
    else:
        # unarmed: 回落到 OFF 条件再重新武装
        if off_cond:
            accel_armed = True
            accel_active_since = None

def _get_obj(payload: dict, key: str):
    if not isinstance(payload, dict):
        return None
    v = payload.get(key)
    return v

def extract_accel(payload: dict):
    # ZigSim doc often uses top-level accel.{x,y,z}
    sens = payload.get("sensordata") or payload.get("sensor") or {}
    accel = (sens.get("accel") if isinstance(sens, dict) else None) or (sens.get("acceleration") if isinstance(sens, dict) else None)
    if accel is None and isinstance(payload, dict):
        accel = payload.get("accel") or payload.get("acceleration")
    return accel

def extract_gyro(payload: dict):
    sens = payload.get("sensordata") or payload.get("sensor") or {}
    gyro = (sens.get("gyro") if isinstance(sens, dict) else None) or (sens.get("gyroscope") if isinstance(sens, dict) else None)
    if gyro is None and isinstance(payload, dict):
        gyro = payload.get("gyro") or payload.get("gyroscope")
    return gyro

def pick_axis_dict(d: dict, axis: str):
    if not isinstance(d, dict):
        return None
    if axis not in d:
        return None
    try:
        v = float(d[axis])
    except Exception:
        return None
    return v

def dominant_axis(d: dict):
    best = None
    best_abs = -1.0
    for a in ("x", "y", "z"):
        v = pick_axis_dict(d, a)
        if v is None:
            continue
        if abs(v) > best_abs:
            best_abs = abs(v)
            best = a
    return best

try:
    while True:
        data, addr = sock.recvfrom(65535)

        text = data.decode("utf-8", errors="replace").strip()
        if not text:
            continue

        try:
            payload = json.loads(text)
        except json.JSONDecodeError:
            # 非 JSON：支持 ZigSim 文本行格式，例如 "accel:y:0.0123"
            for line in text.splitlines():
                m = ACCEL_Y_RE.match(line)
                if not m:
                    continue
                try:
                    y = float(m.group(1))
                except ValueError:
                    continue
                process_accel_wave(y)
            continue

        # 常见字段示例（字段名以你实际收到的 JSON 为准）
        accel = extract_accel(payload)
        gyro = extract_gyro(payload)

        # 只看 accel（优先 y 轴；如果 y 不存在则回退到“绝对值最大轴”）
        if isinstance(accel, dict):
            ay = pick_axis_dict(accel, "y")
            if ay is None:
                ax_name = dominant_axis(accel)
                ay = pick_axis_dict(accel, ax_name) if ax_name is not None else None
            if ay is not None:
                process_accel_wave(ay)

        # Keep original prints but avoid spam if you want:
        # (Leaving them on is okay; they confirm data is arriving.)
        # if accel is not None:
        #     print("Accel:", accel)
        quat = (payload.get("sensordata") or payload.get("sensor") or {}).get("quat") if isinstance(payload, dict) else None
        if quat is None and isinstance(payload, dict):
            sens2 = payload.get("sensordata") or payload.get("sensor") or {}
            quat = (sens2.get("quat") or sens2.get("quaternion")) if isinstance(sens2, dict) else None
        if quat is None and isinstance(payload, dict):
            quat = payload.get("quat") or payload.get("quaternion")
        if quat is not None:
            print("Quaternion:", quat)
finally:
    try:
        sock.close()
    except Exception:
        pass