# Good Items Dataset

This folder is used by the in-game **"Transform bad item → good item"** feature.

## Current Images (sync with code)

The game currently loads these images from this folder:

1. **game.png** - Game
2. **magezine.png** - Magazine (filename kept as-is)

If you rename/add files, you also need to update:
- `version1/game/MainScene.ts` (preload `this.load.image(...)`)
- `version1/services/geminiService.ts` (`AVAILABLE_ITEMS` ids/keywords)

