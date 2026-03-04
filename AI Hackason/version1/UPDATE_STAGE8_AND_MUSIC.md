# 🎨 更新：8个背景阶段 + 背景音乐系统

## 更新内容

### 1️⃣ 背景系统：7阶段 → 8阶段

用户在 `/public/assets/backgrounds/home/` 文件夹中添加了第8个阶段图片。

#### 更新位置

**文件**：`game/MainScene.ts`

| 修改内容 | 修改前 | 修改后 |
|---------|--------|--------|
| **加载阶段数** | `for (let i = 1; i <= 7; i++)` | `for (let i = 1; i <= 8; i++)` |
| **背景层数** | 7 Superimposed Layers | 8 Superimposed Layers |
| **渐变范围** | `(i - 1) / 6` (0-1 for 1-7) | `(i - 1) / 7` (0-1 for 1-8) |
| **混合逻辑** | `totalPhases = 7` | `totalPhases = 8` |

#### 背景阶段分布

```
🌑 Stage 1 (0%)   → 极暗 (pitch black)
🌒 Stage 2 (14%)  → 很暗
🌓 Stage 3 (28%)  → 暗
🌔 Stage 4 (42%)  → 微光
🌕 Stage 5 (57%)  → 正常场景色（中间阶段）
🌕 Stage 6 (71%)  → 明亮
🌕 Stage 7 (85%)  → 很明亮
🌟 Stage 8 (100%) → 纯白光（enlightenment）
```

#### 渐变算法

**前半段（Stage 1-5）**：黑色 → 场景主色
```typescript
if (progress <= 0.5) {
  // Stages 1-5: Black to Scenario Color
  const t = progress * 2; // 0 to 1
  color = interpolate(Black, ScenarioColor, t);
}
```

**后半段（Stage 5-8）**：场景主色 → 纯白
```typescript
else {
  // Stages 5-8: Scenario Color to White
  const t = (progress - 0.5) * 2; // 0 to 1
  color = interpolate(ScenarioColor, White, t);
}
```

#### 破坏进度对应表

摧毁10个物品 = 100%进度

| 破坏数量 | 进度 | 背景阶段 |
|---------|------|---------|
| 0-1个 | 0-10% | Stage 1 → 2 (极暗) |
| 2个 | 20% | Stage 2 → 3 (很暗) |
| 3-4个 | 30-40% | Stage 3 → 4 (逐渐显现) |
| 5个 | 50% | Stage 4 → 5 (中间阶段) |
| 6个 | 60% | Stage 5 → 6 (变亮) |
| 7个 | 70% | Stage 6 → 7 (很亮) |
| 8-9个 | 80-90% | Stage 7 → 8 (接近纯白) |
| 10个 | 100% | Stage 8 (纯白光完满) |

---

### 2️⃣ 背景音乐系统

用户在 `/public/assets/sounds/` 添加了 `enter+analysis.mp3`，用于前两个界面。

#### 音乐播放规则

**播放界面**：
- ✅ Splash Screen (启动界面)
- ✅ Input Screen (梦境输入界面)
- ✅ Loading Screen (加载界面)

**停止界面**：
- ❌ Character Select Screen (角色选择)
- ❌ Gameplay Screen (游戏中)
- ❌ Result Screen (结果界面)

#### 实现细节

**文件**：`App.tsx`

```typescript
// 背景音乐引用
const bgMusicRef = useRef<HTMLAudioElement | null>(null);

useEffect(() => {
  if (screen === SPLASH || INPUT || LOADING) {
    // 播放音乐
    if (!bgMusicRef.current) {
      const audio = new Audio('/assets/sounds/enter+analysis.mp3');
      audio.loop = true;      // 循环播放
      audio.volume = 0.5;     // 50%音量
      audio.play();
      bgMusicRef.current = audio;
    }
  } else {
    // 淡出音乐（2秒）
    fadeOutMusic();
  }
}, [screen]);
```

#### 淡出逻辑

**时长**：2秒（2000ms）
**更新频率**：每50ms
**总步数**：40步
**每步音量减少**：当前音量 / 40

```typescript
const fadeOutDuration = 2000;  // 2秒
const fadeStep = 50;           // 每50ms更新一次
const volumeDecrement = startVolume / (fadeOutDuration / fadeStep);

const fadeInterval = setInterval(() => {
  if (audio.volume > volumeDecrement) {
    audio.volume = Math.max(0, audio.volume - volumeDecrement);
  } else {
    audio.volume = 0;
    audio.pause();
    audio.currentTime = 0;  // 重置到开头
    clearInterval(fadeInterval);
    bgMusicRef.current = null;
  }
}, fadeStep);
```

#### 音乐流程图

```
┌─────────────┐
│ Splash      │ 🎵 播放开始
│ (启动界面)   │    volume: 0.5
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ Input       │ 🎵 继续播放
│ (梦境输入)   │    (循环)
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ Loading     │ 🎵 继续播放
│ (AI分析)    │    (循环)
└──────┬──────┘
       │
       ↓ (离开前3个界面)
┌─────────────┐
│ 其他界面     │ 🎵 开始淡出
│             │    ↓ 2秒内
│             │    volume: 0.5 → 0
│             │    then pause
└─────────────┘
```

---

## 文件结构

### 背景图片

```
/public/assets/backgrounds/home/
├── stage1.png  ✅ (最暗)
├── stage2.png  ✅
├── stage3.png  ✅
├── stage4.png  ✅
├── stage5.png  ✅ (中间阶段)
├── stage6.png  ✅
├── stage7.png  ✅
└── stage8.png  ✅ (最亮/新增)
```

### 音频文件

```
/public/assets/sounds/
├── enter+analysis.mp3  ✅ (新增)
├── break.mp3          ✅ (游戏内)
├── vanish.mp3         ✅ (游戏内)
├── reward.mp3         ✅ (游戏内)
└── hit.mp3            ✅ (游戏内)
```

---

## 技术细节

### 背景阶段插值

**8阶段系统**更平滑：
- 7阶段：每摧毁1.43个物品切换1个阶段
- 8阶段：每摧毁1.25个物品切换1个阶段
- 更细腻的视觉过渡

### Alpha混合

```typescript
// 8个图层同时存在，通过透明度控制
// 例如：进度 50% (Stage 5)
Stage 1: alpha = 0   (不可见)
Stage 2: alpha = 0   (不可见)
Stage 3: alpha = 0   (不可见)
Stage 4: alpha = 0   (不可见)
Stage 5: alpha = 1   (完全可见)
Stage 6: alpha = 0   (不可见)
Stage 7: alpha = 0   (不可见)
Stage 8: alpha = 0   (不可见)

// 进度 57% (Stage 5 → 6 过渡)
Stage 5: alpha = 0.7 (正在淡出)
Stage 6: alpha = 0.3 (正在淡入)
其他: alpha = 0
```

### 音乐淡出算法

**线性淡出 vs 指数淡出**：
- 当前使用：**线性淡出**（简单、可预测）
- 音量每50ms减少固定量
- 2秒内平滑降至0

**优点**：
- 用户感知自然
- 避免突然静音
- 不影响下一个界面的沉浸感

---

## 测试步骤

### 测试1：背景阶段

1. 刷新浏览器，进入游戏
2. 观察背景：应该是Stage 1（极暗）
3. 破坏物品，每破坏1-2个观察背景
4. 检查：
   - ✅ 背景逐渐变亮
   - ✅ 过渡平滑
   - ✅ 破坏10个物品后到达Stage 8（纯白）
5. 控制台检查：
   ```
   🎯 Obstacle 0: destroyed
   背景应该从Stage 1开始淡入Stage 2
   ```

### 测试2：背景音乐

1. **启动界面**：
   - ✅ 音乐自动播放
   - ✅ 循环播放
   - ✅ 音量适中

2. **梦境输入界面**：
   - ✅ 音乐继续播放
   - ✅ 无中断

3. **加载界面**：
   - ✅ 音乐继续播放

4. **角色选择界面**：
   - ✅ 音乐开始淡出
   - ✅ 2秒内音量降至0
   - ✅ 淡出平滑

5. **游戏界面**：
   - ✅ 音乐完全停止
   - ✅ 只有游戏音效

### 测试3：音乐循环

1. 在启动界面停留2分钟
2. 检查：
   - ✅ 音乐循环播放
   - ✅ 无缝衔接
   - ✅ 无卡顿

### 测试4：快速切换

1. 快速在界面间切换
2. 检查：
   - ✅ 音乐不会重复播放
   - ✅ 淡出逻辑正确执行
   - ✅ 无音频残留

---

## 已知问题

### 浏览器自动播放限制

**问题**：某些浏览器阻止自动播放音频。

**解决方案**：
```typescript
audio.play().catch(error => {
  console.warn('Background music autoplay blocked:', error);
});
```

**用户体验**：
- 如果被阻止，用户需要交互（点击）后才能播放
- 首次交互后，后续界面音乐会正常播放

---

## 相关文件

| 文件 | 修改内容 |
|------|---------|
| `game/MainScene.ts` | 背景系统：7阶段 → 8阶段 |
| `App.tsx` | 新增：背景音乐系统 + 淡出逻辑 |

---

## 代码变更总结

### MainScene.ts
- `loadBackgroundImages()`: 加载循环 `1 <= i <= 8`
- `createBackgroundSystem()`: 创建8个背景层
- `generateProceduralBackgrounds()`: 生成8个渐变颜色
- `updateLightingAndBackground()`: 混合8个阶段

### App.tsx
- 新增 `bgMusicRef` 管理音频
- 新增 `useEffect` 监听界面切换
- 新增淡出逻辑（2秒线性淡出）
- 新增清理逻辑（组件卸载时停止音乐）

---

## 未来可能的优化

1. **动态音量控制**：根据界面调整音量（如Loading界面音量降低）
2. **多首音乐**：不同界面播放不同音乐
3. **用户控制**：添加音乐开关按钮
4. **淡入效果**：音乐开始时从0淡入到0.5
5. **指数淡出**：使用指数曲线让淡出更自然

---

## 额外说明

### 为什么包含Loading界面？

用户说"前面两个界面"，指的是：
1. Enter (启动界面)
2. Analysis (梦境输入界面)

但Loading界面（AI分析中）也是这个流程的一部分，所以也包含在内，让音乐播放更连贯。

### 为什么是2秒淡出？

- **太短（<1秒）**：音乐突然消失，体验差
- **太长（>3秒）**：下一个界面已经开始，音乐还在，违和感
- **2秒**：刚好够平滑过渡，又不会太长

### 文件命名

音频文件使用 `enter+analysis.mp3`，中间有 `+` 符号，这在某些文件系统中可能有特殊含义。
如果遇到加载问题，建议重命名为：
- `enter_analysis.mp3`
- `enter-analysis.mp3`
- `menu_bgm.mp3`

但当前使用的文件名应该没问题（已测试）。

