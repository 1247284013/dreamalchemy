# AI-Driven Character Selection System

## 🎮 Game Flow

```
1. Splash Screen
   ↓
2. Dream Input Screen
   (User describes their dream)
   ↓
3. Loading & AI Analysis
   (Gemini analyzes dream and recommends characters)
   ↓
4. Character Selection Screen ⭐ NEW!
   (AI shows 3 recommended characters based on dream content)
   ↓
5. Gameplay
   (Player embodies selected character)
   ↓
6. Result Screen
```

## 🤖 AI Character Recommendation

### How It Works

When the user describes their dream, the AI:
1. Analyzes the emotional content and themes
2. Recommends **3 characters** that best match the dream
3. Provides a **reason** for each recommendation (max 10 words)
4. Orders them from **MOST relevant** to **LEAST relevant**

### Available Characters

| Character | Image | Themes |
|-----------|-------|--------|
| **Boxes (goods)** | `goods.png` | Storage, memories, burden, hidden things, moving |
| **Football** | `football.png` | Play, energy, freedom, childhood joy, sports |
| **Study Desk (studydesk)** | `studydesk.png` | Work, pressure, study, academic stress, focus |

### Example Recommendations

**Dream: "I was overwhelmed with homework and couldn't finish my exams"**
```
1. 🎓 Study Desk - "Embody the source of pressure"
2. 📦 Boxes - "Carry the weight of expectations"
3. ⚽ Football - "Remember the joy beyond grades"
```

**Dream: "I was playing in a field but couldn't run fast enough"**
```
1. ⚽ Football - "Move freely without limits"
2. 📦 Boxes - "Release what slows you down"
3. 🎓 Study Desk - "Leave responsibilities behind"
```

**Dream: "My room was filled with old memories I couldn't let go"**
```
1. 📦 Boxes - "Hold memories, then release them"
2. 🎓 Study Desk - "Organize your emotional space"
3. ⚽ Football - "Find lightness in movement"
```

## 🎨 Character Selection UI

- **3 cards** in a grid layout
- **⭐ BEST FIT** badge on the first (most relevant) character
- Each card shows:
  - Character image
  - Character name
  - AI-generated reason (in amber italic text)
- Selected character has:
  - Amber glowing border
  - ✓ checkmark in top-right corner
- Subtitle: *"Based on your dream, these forms resonate with your journey"*

## 🔄 Smart Obstacle Generation

The character you select **will NOT appear as an obstacle** in the game.

**Example:**
- Select **Football** as player → Obstacles will be: Boxes + Study Desk
- Select **Boxes** as player → Obstacles will be: Football + Study Desk
- Select **Study Desk** as player → Obstacles will be: Football + Boxes

## 📊 API Response Structure

```typescript
{
  scenarioId: "A" | "B" | "C" | "D",
  healingMessage: string,
  keywords: string[],
  recommendedCharacters: [
    {
      id: "football" | "goods" | "studydesk",
      name: "Display Name",
      reason: "Short reason (max 10 words)",
      image: "/assets/items/room/bad/xxx.png"
    },
    // ... 2 more characters
  ]
}
```

## 🎯 Design Philosophy

**Therapeutic Resonance**: The game asks "What form do you take in your nightmare?" By letting AI recommend characters based on dream content, players can:
- **Embody** the source of their stress (Study Desk for exam anxiety)
- **Become** what they're carrying (Boxes for emotional burden)
- **Transform into** what they wish they could be (Football for freedom/play)

This creates a more **personalized, meaningful** game experience where the character choice is tied to the player's actual dream narrative.

