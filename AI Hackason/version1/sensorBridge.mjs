import dgram from 'node:dgram';
import { WebSocketServer } from 'ws';

// UDP must match ZigSim / your phone sender.
const UDP_PORT = Number(process.env.UDP_PORT || 50000);
const UDP_HOST = process.env.UDP_HOST || '0.0.0.0';

// WebSocket for browser to subscribe.
const WS_PORT = Number(process.env.WS_PORT || 5174);
const WS_HOST = process.env.WS_HOST || '0.0.0.0';

const wss = new WebSocketServer({ port: WS_PORT, host: WS_HOST });
const udp = dgram.createSocket('udp4');
let udpCount = 0;
let lastUdpLogAt = 0;

function broadcast(obj) {
  const msg = JSON.stringify(obj);
  for (const client of wss.clients) {
    // 1 === OPEN
    if (client.readyState === 1) client.send(msg);
  }
}

function tryParseJsonLines(text) {
  const out = [];
  const trimmed = (text || '').trim();
  if (!trimmed) return out;

  // First try as single JSON
  try {
    out.push(JSON.parse(trimmed));
    return out;
  } catch {}

  // Fallback: parse "accel:x:0.123" style lines into an object
  // Example:
  // accel:x:-0.03
  // accel:y:0.01
  // accel:z:0.04
  // gyro:x:...
  // quaternion:w:...
  const parsed = {};
  let anyKv = false;
  const numRe = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i;
  for (const line of trimmed.split(/\r?\n/)) {
    const s = line.trim();
    if (!s) continue;
    const parts = s.split(':');
    if (parts.length < 3) continue;
    const group = parts[0]?.trim();
    const key = parts[1]?.trim();
    const valueStr = parts.slice(2).join(':').trim();
    if (!group || !key || !valueStr) continue;
    if (!numRe.test(valueStr)) continue;
    const v = Number(valueStr);
    if (!Number.isFinite(v)) continue;
    anyKv = true;
    parsed[group] ||= {};
    parsed[group][key] = v;
  }
  if (anyKv) {
    out.push(parsed);
    return out;
  }

  // Fallback: try per-line JSON
  for (const line of trimmed.split(/\r?\n/)) {
    const s = line.trim();
    if (!s) continue;
    try {
      out.push(JSON.parse(s));
    } catch {
      // ignore non-JSON line
    }
  }
  return out;
}

wss.on('connection', (ws, req) => {
  const ip = req.socket?.remoteAddress;
  console.log(`🟢 WS client connected: ${ip || 'unknown'}`);
  ws.send(
    JSON.stringify({
      type: 'status',
      ok: true,
      udp: { host: UDP_HOST, port: UDP_PORT },
      ws: { host: WS_HOST, port: WS_PORT },
      ts: Date.now()
    })
  );
  ws.on('close', () => console.log(`⚪️ WS client disconnected: ${ip || 'unknown'}`));
});

udp.on('listening', () => {
  const addr = udp.address();
  console.log(`📡 UDP listening on ${addr.address}:${addr.port}`);
  console.log(`🌐 WS server on ws://localhost:${WS_PORT}`);
});

udp.on('message', (buf, rinfo) => {
  const text = buf.toString('utf8');
  udpCount += 1;
  const now = Date.now();
  if (now - lastUdpLogAt > 1500) {
    lastUdpLogAt = now;
    const sample = text.replace(/\s+/g, ' ').slice(0, 160);
    console.log(`📥 UDP#${udpCount} from ${rinfo.address}:${rinfo.port} sample="${sample}"`);
  }
  const payloads = tryParseJsonLines(text);
  if (payloads.length === 0) return;

  for (const payload of payloads) {
    broadcast({ type: 'sensor', from: { address: rinfo.address, port: rinfo.port }, payload, ts: Date.now() });
  }
});

udp.bind(UDP_PORT, UDP_HOST);

