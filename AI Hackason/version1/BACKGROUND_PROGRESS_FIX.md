# 🌅 背景变化逻辑修复

## 问题

之前的背景stage变化是基于**玩家的行走距离**：

```typescript
// ❌ 旧逻辑 (错误):
const progress = Phaser.Math.Clamp(this.player.x / (worldWidth - 200), 0, 1);
```

这导致：
- 玩家向右走 → 背景从stage1渐变到stage8
- **与游戏机制无关** - 破坏物体不影响背景
- 玩家可以不破坏任何东西，只是走到终点，背景就变亮了

---

## 修复方案

背景变化现在基于**破坏/转换的物体数量**：

```typescript
// ✅ 新逻辑 (正确):
// 统计总物体数和已处理物体数
let totalItems = 0;
let processedItems = 0;

this.obstacles.forEach((obstacle) => {
  totalItems++;
  const health = obstacle.getData('health');
  const isTransformed = obstacle.getData('isTransformed');
  
  // 已破坏或已转换的都算作processed
  if (health !== undefined && health <= 0) {
    processedItems++; // 破坏的物体
  } else if (isTransformed) {
    processedItems++; // 转换的物体
  }
});

// 进度 = 已处理物体数 / 总物体数
const progress = totalItems > 0 ? processedItems / totalItems : 0;
```

---

## 背景变化规则

### 8个Stage层级
```
Stage 1 (顶层) - 最暗/最压抑
Stage 2
Stage 3
Stage 4
Stage 5
Stage 6
Stage 7
Stage 8 (底层) - 最亮/最治愈
```

### 变化逻辑

假设场景中有**9个物体**（maxObstacles）：

| 已处理物体 | 进度 | 可见Stage | 效果 |
|-----------|------|-----------|------|
| 0/9 | 0% | Stage 1 (全部可见) | 最黑暗 |
| 1/9 | 11% | Stage 1开始淡出 | 微微变化 |
| 2/9 | 22% | Stage 2开始显露 | 渐渐变亮 |
| 3/9 | 33% | Stage 3开始显露 | 继续变亮 |
| 4/9 | 44% | Stage 4开始显露 | 中等亮度 |
| 5/9 | 56% | Stage 5开始显露 | 较亮 |
| 6/9 | 67% | Stage 6开始显露 | 更亮 |
| 7/9 | 78% | Stage 7开始显露 | 很亮 |
| 8/9 | 89% | Stage 7-8可见 | 接近最亮 |
| 9/9 | 100% | 只有Stage 8可见 | 最亮/治愈 |

### 叠加Alpha计算

对于8层背景（index 0-7）：

```typescript
const layerFadeStart = index / 7;      // 层开始淡出的进度
const layerFadeEnd = (index + 1) / 7;  // 层完全淡出的进度

if (index === 7) {
  targetAlpha = 1; // Stage 8永远可见(底层)
} else if (progress < layerFadeStart) {
  targetAlpha = 1; // 还没到这层淡出的时候
} else if (progress >= layerFadeStart && progress < layerFadeEnd) {
  // 正在淡出中
  targetAlpha = 1 - ((progress - layerFadeStart) / (layerFadeEnd - layerFadeStart));
} else {
  targetAlpha = 0; // 已完全淡出
}
```

---

## 游戏机制整合

### 1. 破坏物体
- 物体被完全破坏（health = 0）
- `processedItems++`
- 背景向下一个stage过渡

### 2. 转换物体
- 玩家使用3颗星转换物体
- `obstacle.setData('isTransformed', true)`
- `processedItems++`
- 背景向下一个stage过渡

### 3. 进度可视化

控制台会显示：
```
🌅 Background transition: 0% (0/9 items processed)
🌅 Background transition: 10% (1/9 items processed)
🌅 Background transition: 20% (2/9 items processed)
...
🌅 Background transition: 100% (9/9 items processed)
```

**每10%进度变化时打印一次**，不会刷屏。

---

## 玩法意义

### 旧逻辑（错误）
- 玩家只要一直向右走就能看到光明
- 可以逃避所有障碍
- 背景变化与玩家行为无关

### 新逻辑（正确）
- 玩家必须**处理每个障碍**（破坏或转换）
- 每处理一个物体，世界就变亮一点
- 破坏 = 暴力但快速（不消耗星星）
- 转换 = 温和但需要资源（3颗星）
- **背景亮度 = 玩家的治愈进度**

---

## 代码修改位置

### MainScene.ts

**第24-26行** - 添加进度跟踪变量：
```typescript
private bgPhases: Phaser.GameObjects.Image[] = [];
private backgroundWidth: number = 0;
private lastBackgroundProgress: number = -1; // 新增
```

**第64-82行** - 初始化时重置：
```typescript
init(data: ...) {
  ...
  this.lastBackgroundProgress = -1; // 重置进度跟踪
  ...
}
```

**第1063-1100行** - 核心修改：
```typescript
private updateLightingAndBackground() {
  // 🎯 基于破坏/转换数量计算进度（不再基于玩家位置）
  let totalItems = 0;
  let processedItems = 0;
  
  this.obstacles.forEach((obstacle) => {
    totalItems++;
    const health = obstacle.getData('health');
    const isTransformed = obstacle.getData('isTransformed');
    
    if (health <= 0 || isTransformed) {
      processedItems++;
    }
  });
  
  const progress = totalItems > 0 ? processedItems / totalItems : 0;
  
  // 背景stage淡入淡出...
}
```

---

## 测试验证

1. 刷新游戏
2. 不要移动，只破坏第一个物体
3. 观察控制台：`🌅 Background transition: 10%`
4. 继续破坏第二个物体
5. 观察控制台：`🌅 Background transition: 20%`
6. 背景应该逐渐从stage1向stage2过渡

**预期效果**：
- ✅ 站在原地破坏物体 → 背景变化
- ✅ 转换物体 → 背景变化
- ❌ 只是走路不破坏 → 背景不变

---

## 游戏叙事

这个改动强化了游戏的核心隐喻：

- **黑暗** = 未处理的创伤/障碍
- **行动** = 破坏（宣泄）或转换（治愈）
- **光明** = 处理创伤后的心理状态

玩家必须**主动面对和处理**每个障碍，才能走向光明，而不是逃避绕过它们。

---

## 总结

✅ **背景变化现在正确反映玩家的治愈进度**
✅ **每处理1个物体，背景变亮 1/9**
✅ **破坏和转换都会推进背景变化**
✅ **玩家不能通过逃避来获得光明**

**这个改动让游戏机制与视觉叙事完美结合！** 🌅✨

