export enum AppScreen {
  SPLASH = 'SPLASH',
  HISTORY = 'HISTORY',
  CONNECT = 'CONNECT',
  SETTINGS = 'SETTINGS',
  PROFILE = 'PROFILE',
  COMMUNITY = 'COMMUNITY',
  CHARACTER_SELECT = 'CHARACTER_SELECT',
  INPUT = 'INPUT',
  LOADING = 'LOADING',
  GAMEPLAY = 'GAMEPLAY',
  RESULT_LOADING = 'RESULT_LOADING',
  RESULT = 'RESULT'
}

export enum ScenarioId {
  A = 'A', // Abandoned Classroom
  B = 'B', // Endless Forest
  C = 'C', // Abyss/Fall
  D = 'D'  // Lonely Room
}

export interface CharacterOption {
  id: string;
  name: string;
  reason: string; // Why this character is recommended
  image: string;
}

export interface TransformationRecord {
  badItem: string;           // What was transformed (e.g., "broken chair")
  goodItem: string;          // What it became (e.g., "comfortable bed")
  reason: string;            // Why they wanted to transform it
  recentEvent: string;       // Recent unhappy event they shared
  timestamp: number;         // When this transformation happened
}

export interface DreamAnalysis {
  scenarioId: ScenarioId;
  healingMessage: string;
  keywords: string[];
  recommendedCharacters: CharacterOption[]; // AI-recommended characters based on dream
}

export interface DeepAnalysis {
  psychologicalInsight: string;    // Deep psychological analysis
  emotionalPattern: string;        // Identified emotional patterns
  healingGuidance: string;         // Personalized healing suggestions
  transformationSummary: string;   // Summary of what transformations reveal
}

export type GameSceneMode = 'workspace' | 'scenario';
export type BreakSource = 'ui' | 'keyboard' | 'sensor' | 'collision';

export interface GameSummary {
  sceneMode: GameSceneMode;
  scenarioId: ScenarioId;
  selectedCharacterId?: string;

  startedAtMs: number;
  endedAtMs: number;
  durationMs: number;

  // Player interaction stats
  breakCount: number;
  breakBySource: Partial<Record<BreakSource, number>>;
  destroyedCount: number;
  transformedCount: number;

  // High-signal traces for AI to reason about
  destroyedObjects: string[]; // e.g. ["Wall Clock", "File Cabinet"]
  transformedObjects: Array<{ from: string; to: string }>; // to = texture key (good item)
  enteredOutdoorAtMs?: number;
}

export interface LevelConfig {
  scenarioId: ScenarioId;
  gravity: number;
  lightColor: number;
  obstacleTag: string;
  backgroundColors: number[]; // [Sky, Mid, Fore]
  playerCharacter?: string; // Selected character texture key
}

// Event types for communicating between React and Phaser
export type GameEvent = 'JUMP' | 'DASH' | 'MOVE_LEFT' | 'MOVE_RIGHT' | 'STOP_MOVE';
