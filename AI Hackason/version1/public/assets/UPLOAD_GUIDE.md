# 📁 音效和损伤图片上传指南

## 🔊 音效文件 (Sound Effects)

请将以下3个音效文件放到：
**`/public/assets/sounds/`**

### 需要的音效文件：

1. **`hit.mp3`** - 攻击/打击音效
   - 当玩家第1次或第2次攻击物品时播放
   - 建议：短促的打击声、碰撞声
   - 音量会自动调整（第1次 50%，第2次 70%）

2. **`break.mp3`** - 破坏音效
   - 当物品完全破坏时播放
   - 建议：玻璃破碎声、物体碎裂声
   - 音量：80%

3. **`reward.mp3`** - 奖励/收集音效
   - 当破坏物品后，星星出现时播放
   - 建议：清脆的铃声、治愈的音效、魔法音效
   - 音量：60%

---

## 🖼️ 损伤图片 (Damaged Stages)

请将损伤图片放到：
**`/public/assets/items/room/bad/damaged/`**

### 三阶段损伤系统：

每个物品需要**2张损伤图片**（原始图片已经有了）：

#### 格式：`{物品名}_dmg1.png` 和 `{物品名}_dmg2.png`

---

### 需要的物品损伤图片：

#### 1. **Bad Toy（坏玩具）**
- `bad_toy_dmg1.png` - 轻微损伤（裂缝、轻微破损）
- `bad_toy_dmg2.png` - 严重损伤（大裂缝、部分破碎）

#### 2. **Bed（床）**
- `bed_dmg1.png` - 轻微损伤（床单褶皱、轻微破损）
- `bed_dmg2.png` - 严重损伤（床架断裂、严重破损）

#### 3. **Chair（椅子）**
- `chair_dmg1.png` - 轻微损伤（划痕、轻微裂纹）
- `chair_dmg2.png` - 严重损伤（椅腿断裂、大裂口）

#### 4. **Dining Table（餐桌）**
- `dining_table_dmg1.png` - 轻微损伤（桌面划痕）
- `dining_table_dmg2.png` - 严重损伤（桌腿断裂、桌面破损）

#### 5. **Football（足球）**
- `football_dmg1.png` - 轻微损伤（球面划痕、轻微漏气）
- `football_dmg2.png` - 严重损伤（大破口、严重变形）

#### 6. **Goods（物品）**
- `goods_dmg1.png` - 轻微损伤
- `goods_dmg2.png` - 严重损伤

#### 7. **Kitchen（厨房用品）**
- `kitchen_dmg1.png` - 轻微损伤
- `kitchen_dmg2.png` - 严重损伤

#### 8. **Study Desk（书桌）**
- `study_desk_dmg1.png` - 轻微损伤（抽屉松动、轻微裂纹）
- `study_desk_dmg2.png` - 严重损伤（桌腿断裂、抽屉脱落）

#### 9. **Teddy Toy（泰迪熊）**
- `teddy_toy_dmg1.png` - 轻微损伤（毛发脱落、轻微破损）
- `teddy_toy_dmg2.png` - 严重损伤（四肢破损、严重撕裂）

---

## 📊 工作流程

### 三阶段破坏系统：

```
原始物品 (Health: 3)
    ↓ [第1次攻击]
轻微损伤 (Health: 2) → dmg1.png + hit.mp3 🔨
    ↓ [第2次攻击]
严重损伤 (Health: 1) → dmg2.png + hit.mp3 💥
    ↓ [第3次攻击]
完全破坏 (Health: 0) → 销毁 + break.mp3 + 星星 💀⭐ + reward.mp3 🎵
```

---

## ✅ 文件夹结构总览

```
/public/assets/
├── sounds/                    ← 音效文件
│   ├── hit.mp3               ← 打击音效
│   ├── break.mp3             ← 破坏音效
│   └── reward.mp3            ← 奖励音效
│
└── items/room/bad/
    ├── bad toy.png           ← 原始图片（已有）
    ├── bed.png               ← 原始图片（已有）
    ├── chair.png             ← 原始图片（已有）
    ├── ...
    │
    └── damaged/              ← 损伤图片文件夹（新建）
        ├── bad_toy_dmg1.png
        ├── bad_toy_dmg2.png
        ├── bed_dmg1.png
        ├── bed_dmg2.png
        ├── chair_dmg1.png
        ├── chair_dmg2.png
        ├── dining_table_dmg1.png
        ├── dining_table_dmg2.png
        ├── football_dmg1.png
        ├── football_dmg2.png
        ├── goods_dmg1.png
        ├── goods_dmg2.png
        ├── kitchen_dmg1.png
        ├── kitchen_dmg2.png
        ├── study_desk_dmg1.png
        ├── study_desk_dmg2.png
        ├── teddy_toy_dmg1.png
        └── teddy_toy_dmg2.png
```

---

## 🎮 游戏效果

1. **第1次攻击/碰撞**：
   - 物品变成 `_dmg1.png`（轻微损伤）
   - 播放 `hit.mp3`
   - 小幅震动

2. **第2次攻击/碰撞**：
   - 物品变成 `_dmg2.png`（严重损伤）
   - 播放 `hit.mp3`（更大声）
   - 大幅震动 + 少量粒子效果

3. **第3次攻击/碰撞**：
   - 物品完全破坏并消失
   - 播放 `break.mp3`
   - 大量粒子爆炸效果
   - 生成星星 + 播放 `reward.mp3`

---

## 📝 注意事项

- 音效文件格式：`.mp3`（推荐）或 `.ogg`, `.wav`
- 图片文件格式：`.png`（透明背景）
- 文件名必须**完全匹配**上面的命名
- 损伤图片尺寸应与原始图片相同
- 建议损伤程度递进明显，玩家能清楚看到变化

---

## 🚀 完成后

上传完所有文件后，刷新游戏页面，就可以体验：
- ✅ 三阶段渐进式破坏
- ✅ 攻击音效
- ✅ 破坏音效
- ✅ 奖励音效
- ✅ 视觉损伤反馈

祝创作愉快！🎨🎵

