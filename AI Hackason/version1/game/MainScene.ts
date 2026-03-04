
import Phaser from 'phaser';
import { LevelConfig, ScenarioId, BreakSource, GameSummary } from '../types';
import { SELECT_CHARACTERS } from '../characterCatalog';

type ObjectStageDef = {
  id: string;
  name: string;
  stageKeys: [string, string, string, string];
  stagePaths: [string, string, string, string];
  // Placement rule for spawning in scene
  placement?: 'ground' | 'top';
};

// Objects are updated to 4 stages each.
// NOTE: Spaces in folder/file names must be URL-encoded as %20.
const WORKSPACE_INDOOR_OBJECTS: ObjectStageDef[] = [
  {
    id: 'attendance_machine',
    name: 'Attendance Machine',
    stageKeys: ['obj_attend_1', 'obj_attend_2', 'obj_attend_3', 'obj_attend_4'],
    stagePaths: [
      'assets/objects/attendance%20machine/attend-18.png',
      'assets/objects/attendance%20machine/attend-19.png',
      'assets/objects/attendance%20machine/attend-20.png',
      'assets/objects/attendance%20machine/attend-21.png'
    ]
  },
  {
    id: 'computer',
    name: 'Computer',
    stageKeys: ['obj_computer_1', 'obj_computer_2', 'obj_computer_3', 'obj_computer_4'],
    stagePaths: [
      'assets/objects/computer/computer0.png',
      'assets/objects/computer/computer1.png',
      'assets/objects/computer/computer2.png',
      'assets/objects/computer/computer3.png'
    ]
  },
  {
    id: 'file_box',
    name: 'File Box',
    stageKeys: ['obj_filebox_1', 'obj_filebox_2', 'obj_filebox_3', 'obj_filebox_4'],
    stagePaths: [
      'assets/objects/File%20box/File%20box-01.png',
      'assets/objects/File%20box/File%20box-02.png',
      'assets/objects/File%20box/File%20box-03.png',
      'assets/objects/File%20box/File%20box-04.png'
    ]
  },
  {
    id: 'file_cabinet',
    name: 'File Cabinet',
    stageKeys: ['obj_filecab_1', 'obj_filecab_2', 'obj_filecab_3', 'obj_filecab_4'],
    stagePaths: [
      'assets/objects/file%20cabinet/file%20cabinet-01.png',
      'assets/objects/file%20cabinet/file%20cabinet-02.png',
      'assets/objects/file%20cabinet/file%20cabinet-03.png',
      'assets/objects/file%20cabinet/file%20cabinet-04.png'
    ]
  },
  {
    id: 'folder',
    name: 'Folder',
    stageKeys: ['obj_folder_1', 'obj_folder_2', 'obj_folder_3', 'obj_folder_4'],
    stagePaths: [
      'assets/objects/Folder/Folder-01.png',
      'assets/objects/Folder/Folder-02.png',
      'assets/objects/Folder/Folder-03.png',
      // NOTE: Folder currently has only 3 images in /public; use stage3 as stage4 fallback.
      'assets/objects/Folder/Folder-03.png'
    ]
  },
  {
    id: 'printer',
    name: 'Printer',
    stageKeys: ['obj_printer_1', 'obj_printer_2', 'obj_printer_3', 'obj_printer_4'],
    stagePaths: [
      'assets/objects/Printer/Printer-01.png',
      'assets/objects/Printer/Printer-02.png',
      'assets/objects/Printer/Printer-03.png',
      'assets/objects/Printer/Printer-04.png'
    ]
  },
  {
    id: 'table',
    name: 'Table',
    stageKeys: ['obj_table_1', 'obj_table_2', 'obj_table_3', 'obj_table_4'],
    stagePaths: [
      'assets/objects/Table/table-1.png',
      'assets/objects/Table/table-2.png',
      'assets/objects/Table/table-3.png',
      'assets/objects/Table/table-4.png'
    ]
  },
  {
    id: 'wall_clock',
    name: 'Wall Clock',
    stageKeys: ['obj_clock_1', 'obj_clock_2', 'obj_clock_3', 'obj_clock_4'],
    stagePaths: [
      'assets/objects/Wall-Clock/Clock-01.png',
      'assets/objects/Wall-Clock/Clock-02.png',
      'assets/objects/Wall-Clock/Clock-03.png',
      'assets/objects/Wall-Clock/Clock-04.png'
    ],
    placement: 'top'
  }
];

const WORKSPACE_OUTDOOR_OBJECTS: ObjectStageDef[] = [
  {
    id: 'ad_board',
    name: 'Ad Board',
    stageKeys: ['obj_ad_1', 'obj_ad_2', 'obj_ad_3', 'obj_ad_4'],
    stagePaths: [
      'assets/objects/outdoor%20things/ad%20board/ad-33%201.png',
      'assets/objects/outdoor%20things/ad%20board/ad-34%201.png',
      'assets/objects/outdoor%20things/ad%20board/ad-35%201.png',
      'assets/objects/outdoor%20things/ad%20board/ad-36%201.png'
    ]
  },
  {
    id: 'outdoor_chair',
    name: 'Outdoor Chair',
    stageKeys: ['obj_outchair_1', 'obj_outchair_2', 'obj_outchair_3', 'obj_outchair_4'],
    stagePaths: [
      'assets/objects/outdoor%20things/Chair/chair-01.png',
      'assets/objects/outdoor%20things/Chair/chair-02.png',
      'assets/objects/outdoor%20things/Chair/chair-03.png',
      'assets/objects/outdoor%20things/Chair/chair-04.png'
    ]
  },
  {
    id: 'light',
    name: 'Light',
    stageKeys: ['obj_light_1', 'obj_light_2', 'obj_light_3', 'obj_light_4'],
    stagePaths: [
      'assets/objects/outdoor%20things/Light/light-01.png',
      'assets/objects/outdoor%20things/Light/light-02.png',
      'assets/objects/outdoor%20things/Light/light-03.png',
      'assets/objects/outdoor%20things/Light/light-04.png'
    ]
  },
  {
    id: 'plant',
    name: 'Plant',
    stageKeys: ['obj_plant_1', 'obj_plant_2', 'obj_plant_3', 'obj_plant_4'],
    stagePaths: [
      'assets/objects/outdoor%20things/Plant/Plant-01.png',
      'assets/objects/outdoor%20things/Plant/Plant-02.png',
      'assets/objects/outdoor%20things/Plant/Plant-03.png',
      'assets/objects/outdoor%20things/Plant/Plant-04.png'
    ]
  },
  {
    id: 'traffic_lights',
    name: 'Traffic Lights',
    stageKeys: ['obj_traffic_1', 'obj_traffic_2', 'obj_traffic_3', 'obj_traffic_4'],
    stagePaths: [
      'assets/objects/outdoor%20things/Traffic%20lights/traffic%20lights-25.png',
      'assets/objects/outdoor%20things/Traffic%20lights/traffic%20lights-26.png',
      'assets/objects/outdoor%20things/Traffic%20lights/traffic%20lights-27.png',
      'assets/objects/outdoor%20things/Traffic%20lights/traffic%20lights-28.png'
    ]
  },
  {
    id: 'vending_machine',
    name: 'Vending Machine',
    stageKeys: ['obj_vend_1', 'obj_vend_2', 'obj_vend_3', 'obj_vend_4'],
    stagePaths: [
      'assets/objects/outdoor%20things/vending%20machine/vending%20machine-29.png',
      'assets/objects/outdoor%20things/vending%20machine/vending%20machine-30.png',
      'assets/objects/outdoor%20things/vending%20machine/vending%20machine-31.png',
      'assets/objects/outdoor%20things/vending%20machine/vending%20machine-32.png'
    ]
  }
];

export default class MainScene extends Phaser.Scene {
  declare scale: Phaser.Scale.ScaleManager;
  declare lights: Phaser.GameObjects.LightsManager;
  declare matter: Phaser.Physics.Matter.MatterPhysics;
  declare cameras: Phaser.Cameras.Scene2D.CameraManager;
  declare time: Phaser.Time.Clock;
  declare tweens: Phaser.Tweens.TweenManager;
  declare add: Phaser.GameObjects.GameObjectFactory;
  declare make: Phaser.GameObjects.GameObjectCreator;
  declare textures: Phaser.Textures.TextureManager;
  declare scene: Phaser.Scenes.ScenePlugin;
  declare load: Phaser.Loader.LoaderPlugin;

  private player!: Phaser.Physics.Matter.Sprite;
  private destructionCount: number = 0;
  private totalLevelObstacles: number = 1; // 🔧 Track total obstacles for progress calculation
  private maxDestruction: number = 10; // 10 items to reach full enlightenment
  private levelConfig!: LevelConfig;
  
  // Background System: 8 Superimposed Layers (updated from 7)
  private bgPhases: Phaser.GameObjects.Image[] = [];
  private backgroundWidth: number = 0; // Actual width of background image
  private lastBackgroundProgress: number = -1; // Track background progress to avoid spam logs

  // Workspace background system (indoor -> gate -> outdoor)
  private usingWorkspaceScene: boolean = false;
  private workspaceStage: 'indoor' | 'outdoor' = 'indoor';
  private workspaceTransitionInProgress: boolean = false;
  // Workspace door placement: door moves, indoor does NOT shrink.
  // doorX = indoorRightX - offsetPx
  // - smaller offset -> door closer to the right edge
  // - larger offset  -> door further left
  private readonly WS_DOOR_OFFSET_FROM_INDOOR_RIGHT_PX = 350;
  private wsIndoorWidth: number = 0; // scaled indoor width (world x of indoor right edge)
  private wsIndoorBg?: Phaser.GameObjects.Image;
  private wsOutdoorBgAttached?: Phaser.GameObjects.Image;
  private wsOutdoorBg?: Phaser.GameObjects.Image; // fixed at x=0 after transition
  private wsGate?: Phaser.Physics.Matter.Image;
  private ground?: Phaser.Physics.Matter.Image;
  
  // 🎮 iPhone 14 Pro Max 横屏优化 (约430px高度)
  // 角色和物体缩放到合适大小
  private readonly FIXED_SCALE = 1; // 调整为1.6倍
  // Workspace objects scale (assets/objects/**)
  private readonly OBJECTS_SCALE = 0.4;
  // Player scale (selected character)
  private readonly PLAYER_SCALE = 0.5;
  // Player feet vertical offset (px). +down / -up. Keeps feet aligned with obstacles.
  private readonly PLAYER_FEET_OFFSET_PX = 0;

  // --- Sensor (ZigSim) -> BREAK ---
  private sensorWs?: WebSocket;
  private sensorLastBreakAtMs = 0;
  private sensorShakeLastSign: -1 | 0 | 1 = 0;
  private sensorShakeLastHighAtMs = 0;
  private sensorShakeLastHighAbs = 0;
  private readonly SENSOR_SHAKE_WINDOW_MS = 450;
  private readonly SENSOR_BREAK_COOLDOWN_MS = 650;

  // --- Session summary for final AI analysis ---
  private sessionStartedAtMs = 0;
  private enteredOutdoorAtMs: number | undefined = undefined;
  private breakCount = 0;
  private breakBySource: Partial<Record<BreakSource, number>> = {};
  private destroyedObjects: string[] = [];
  private transformedObjects: Array<{ from: string; to: string }> = [];
  private transformedCount = 0;

  // Star collection system
  private starCount: number = 3; // Start with 3 stars
  private stars: Set<Phaser.GameObjects.Star> = new Set();
  
  private onGameOver: (success: boolean) => void;
  private onScoreUpdate: (score: number) => void;
  private onStarCollected?: (count: number) => void;
  private onObstacleClick?: (obstacleId: string, badItemName: string) => void;
  
  // Obstacle tracking for transformation
  private obstacles: Map<string, Phaser.Physics.Matter.Image> = new Map();
  
  // Input states
  private isMovingLeft: boolean = false;
  private isMovingRight: boolean = false;
  private lastDashTime: number = 0;
  private autoRunEnabled: boolean = true; // 跑酷：默认自动向右跑
  
  // Nearby obstacles tracking
  private nearbyObstacles: Set<Phaser.Physics.Matter.Image> = new Set();
  private detectionRadius: number = 100; // 检测距离（边缘到边缘），需要靠近物体才能变色和破坏
  
  // Keyboard input
  private spaceKey?: Phaser.Input.Keyboard.Key;
  private breakKey?: Phaser.Input.Keyboard.Key;
  
  // UI state
  private isUIDialogOpen: boolean = false;

  // End-zone hold-to-finish (ms since scene start)
  private endZoneHoldStartMs: number | null = null;
  
  // Debug UI for testing background transitions
  private debugPanel?: Phaser.GameObjects.Container;
  private debugText?: Phaser.GameObjects.Text;

  constructor() {
    super('MainScene');
    this.onGameOver = () => {};
    this.onScoreUpdate = () => {};
  }

  init(data: { config: LevelConfig, onGameOver: any, onScoreUpdate: any, onStarCollected?: any, onObstacleClick?: any }) {
    if (data && data.config) {
        this.levelConfig = data.config;
        this.onGameOver = data.onGameOver;
        this.onScoreUpdate = data.onScoreUpdate;
        this.onStarCollected = data.onStarCollected;
        this.onObstacleClick = data.onObstacleClick;
        this.destructionCount = 0;
        this.starCount = 3; // Start with 3 stars
        this.stars.clear();
        this.obstacles.clear();
        this.lastBackgroundProgress = -1; // Reset background progress tracking
        this.usingWorkspaceScene = false;
        this.workspaceStage = 'indoor';
        this.workspaceTransitionInProgress = false;
        this.wsIndoorBg = undefined;
        this.wsOutdoorBgAttached = undefined;
        this.wsOutdoorBg = undefined;
        this.wsGate = undefined;
        this.ground = undefined;
        this.wsIndoorWidth = 0;
        this.endZoneHoldStartMs = null;
        
        // Notify React component of initial star count
        if (this.onStarCollected) {
            this.onStarCollected(this.starCount);
        }
    }
  }

  private shouldUseWorkspaceScene(): boolean {
    // Default to workspace scene when assets exist.
    // (So the new workspace backgrounds are used regardless of ScenarioId.)
    return (
      !!this.levelConfig &&
      this.textures.exists('ws_indoor') &&
      this.textures.exists('ws_outdoor')
    );
  }

  preload() {
    // --- ASSET LOADING INSTRUCTION ---
    // User specified paths: assets/backgrounds/{folder}/stage{i}.png
    
    if (this.levelConfig) {
        const sid = this.levelConfig.scenarioId;
        
        // Map ScenarioId to folder names
        const folderMap: Record<string, string> = {
            [ScenarioId.A]: 'classroom',
            [ScenarioId.B]: 'forest',
            [ScenarioId.C]: 'abyss',
            [ScenarioId.D]: 'home'
        };

        const folderName = folderMap[sid] || 'home';

        // Try to load the 8 phase images for the current scenario
        for (let i = 1; i <= 8; i++) {
            // Note: We remove 'public/' because web servers serve public as root
            this.load.image(`bg_${sid}_${i}`, `assets/backgrounds/${folderName}/stage${i}.png`);
        }
    }

    // --- New objects (4-stage) ---
    [...WORKSPACE_INDOOR_OBJECTS, ...WORKSPACE_OUTDOOR_OBJECTS].forEach((def) => {
      def.stageKeys.forEach((key, idx) => {
        const path = def.stagePaths[idx];
        this.load.image(key, path);
      });
    });

    // Workspace scene assets (indoor -> gate -> outdoor)
    // NOTE: some filenames contain spaces and must be URL-encoded as %20
    // Disk file: public/assets/backgrounds/workspace/workspace-indoor.jpg
    this.load.image('ws_indoor', 'assets/backgrounds/workspace/workspace-indoor.jpg');
    this.load.image('ws_outdoor', 'assets/backgrounds/workspace/workspace-%20outdoor.jpg');
    // Use door sprites instead of old gate sprites
    // Map 4 stages to door-14~17
    this.load.image('ws_gate_01', 'assets/backgrounds/workspace/door/door-14.png');
    this.load.image('ws_gate_02', 'assets/backgrounds/workspace/door/door-15.png');
    this.load.image('ws_gate_03', 'assets/backgrounds/workspace/door/door-16.png');
    this.load.image('ws_gate_04', 'assets/backgrounds/workspace/door/door-17.png');

    // Load hammer for breaking animation
    this.load.image('hammer', 'assets/characters/break.png');
    
    // Load boom effect for destruction
    this.load.image('boom', 'assets/characters/boom.png');
    
    // Selectable characters (source of truth: characterCatalog.ts)
    SELECT_CHARACTERS.forEach((c) => {
      this.load.image(c.id, c.phaserPath);
    });

    // Load good items from dataset folder (public/assets/dataset/)
    // IMPORTANT: use "good_" prefix to avoid texture-key collisions with existing character/object ids.
    //
    // NOTE: keep this list in sync with the actual files present in:
    // - version1/public/assets/dataset/
    this.load.image('good_game', 'assets/dataset/game.png');
    this.load.image('good_magezine', 'assets/dataset/magezine.png');

    // Load sound effects (only existing files)
    this.load.audio('break_sound', 'assets/sounds/break.mp3'); // 破坏音效
    this.load.audio('boom_sound', 'assets/sounds/boom.mp3'); // 爆炸音效
    // Note: hit.mp3, reward.mp3, vanish.mp3 do not exist in assets/sounds/

    // Load generic assets for fallback
    if(!this.textures.exists('ground') || !this.textures.exists('particle')) {
        this.generateGenericTextures();
    }
  }

  create() {
    if (!this.levelConfig) return;

    // Ensure cleanup runs when scene shuts down or is destroyed
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);
    this.events.once(Phaser.Scenes.Events.DESTROY, this.shutdown, this);

    // Safety check for particle texture
    if (!this.textures.exists('particle')) {
        console.log('⚠️ Particle texture missing in create, generating...');
        const graphics = this.make.graphics({ x: 0, y: 0 });
        graphics.fillStyle(0xffaa88);
        graphics.fillCircle(4, 4, 4);
        graphics.generateTexture('particle', 8, 8);
        graphics.clear();
        graphics.destroy();
    }

    const { width, height } = this.scale;
    this.sessionStartedAtMs = Date.now();

    // Check if audio files are loaded
    console.log('🔊 Checking audio files:');
    console.log('  - break_sound:', this.cache.audio.exists('break_sound'));
    console.log('  - boom_sound:', this.cache.audio.exists('boom_sound'));

    // 1. Setup Lights (Starts Dark) - DISABLED to prevent WebGL crashes
    // this.lights.enable();
    // this.lights.setAmbientColor(0x333333); // Start darker

    // 2. Create the 4-Phase Background System
    this.createBackgroundSystem(width, height);

    // 3. Matter Physics World Bounds - Use background width if available, fallback to screen width
    const worldWidth = this.backgroundWidth > 0 ? this.backgroundWidth : width;
    this.matter.world.setBounds(0, 0, worldWidth, height);
    
    // 4. Player (The Selected Character)
    const playerTexture = this.levelConfig.playerCharacter || 'chair';
    console.log('🎮 Creating player with texture:', playerTexture);
    
    // Ground line (shared with objects)
    const playerFeetY = this.getUnifiedGroundY() + this.PLAYER_FEET_OFFSET_PX;
    
    // 玩家起始在屏幕左侧约8%位置
    this.player = this.matter.add.sprite(width * 0.08, 0, playerTexture, undefined, {
      friction: 0.05,
      frictionAir: 0.01,
      density: 0.01
    });
    
    // Reset and apply desired player scale (0.5x)
    this.player.setScale(this.FIXED_SCALE * this.PLAYER_SCALE);

    // Use centered origin so physics body and render align.
    // Then place the *feet* (bottom edge) onto the shared ground line.
    this.player.setOrigin(0.5, 0.5);
    this.setPlayerFeetY(playerFeetY);

    console.log(`✅ Player: ${this.player.displayWidth.toFixed(0)}x${this.player.displayHeight.toFixed(0)} (scale: ${this.FIXED_SCALE * this.PLAYER_SCALE})`);
    console.log(`📍 Player X: ${this.player.x.toFixed(1)}px (${((this.player.x/width)*100).toFixed(1)}% from left)`);
    console.log(`📍 Player Y: ${this.player.y.toFixed(1)}px (feet aligned to ground line)`);
    
    this.player.setFixedRotation();
    this.player.setDepth(6); // Player depth above obstacles
    // this.player.setPipeline('Light2D'); // DISABLED to prevent WebGL crashes

    // 5. Camera Follow - Keep player at 65% from left (6.5:3.5 position, 35% from right)
    this.cameras.main.setBounds(0, 0, worldWidth, height);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    // Set follow offset to keep player at 65% position from left edge (35% from right)
    // Negative offset moves camera focus left, making player appear on right side
    this.cameras.main.setFollowOffset(width * -0.15, 0);

    // 6. Level Generation
    this.generateLevel(width, height);

    // 7. Collision Handling
    this.matter.world.on('collisionstart', (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
      event.pairs.forEach((pair) => {
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;
        const isPlayerA = bodyA.gameObject === this.player;
        const isPlayerB = bodyB.gameObject === this.player;
        
        if (isPlayerA || isPlayerB) {
            const otherBody = isPlayerA ? bodyB : bodyA;
            if (otherBody.label === 'destructible') {
                this.handleObstacleCollision(otherBody);
            }
        }
      });
    });

    // 8. Player Light (The small hope inside) - DISABLED to prevent WebGL crashes
    // // 🎮 Images pre-sized for 930x430, use fixed pixel values
    // const playerLightRadius = 800; // Fixed radius in pixels
    // this.lights.addLight(this.player.x, this.player.y, playerLightRadius, 0xffffff, 1);
    // console.log(`💡 Player light radius: ${playerLightRadius}px`);
    
    // 9. iPhone 14 Pro Max 检测和收集半径优化
    this.detectionRadius = 120; // 攻击检测距离（边缘到边缘）- 约玩家宽度的2倍
    console.log(`🎯 Detection radius: ${this.detectionRadius}px (edge-to-edge distance)`);

    // 10. Keyboard Input Setup (space key removed - now using UI button)
    // Local-only alternative: Press "B" to BREAK (useful for sensor.py key injection)
    if (this.input && this.input.keyboard) {
      this.breakKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
      this.breakKey.on('down', () => {
        if (this.isUIDialogOpen) return;
        this.registerBreak('keyboard');
        this.showBreakFeedback('BREAK');
        this.destroyNearbyObstacle();
      });
    }

    // Local sensor bridge (UDP -> WS -> browser): shake phone up/down to BREAK.
    this.setupSensorBreak();

    // 11. Handle Resize
    this.scale.on('resize', this.handleResize, this);
    
    // Check texture loading for backgrounds
    this.checkBackgroundTextures();
    
    // Check critical game textures
    console.log('🔍 Checking critical textures...');
    console.log('Hammer texture exists:', this.textures.exists('hammer'));
    console.log('Player texture exists:', this.textures.exists(this.levelConfig.playerCharacter || 'goods'));

    // Initial Lighting Update
    this.updateLightingAndBackground();
    
    // Create debug UI panel for testing background transitions
    // this.createDebugPanel();
    
    // Update debug panel initially
    // this.updateDebugPanel();
  }

  private getUnifiedGroundY(): number {
    return this.scale.height - 10;
  }

  private setPlayerFeetY(feetY: number) {
    if (!this.player) return;
    this.player.y = feetY - this.player.displayHeight / 2;
    // Keep Matter body in sync (important after transitions/resets)
    // @ts-ignore
    if (this.player.body?.position) {
      // @ts-ignore
      this.player.body.position.y = this.player.y;
    }
  }

  private setupSensorBreak() {
    // Default: enabled in dev, disabled in prod unless explicitly enabled.
    const env: any = (import.meta as any).env || {};
    const enabled = (env.VITE_SENSOR_ENABLED ?? (env.DEV ? 'true' : 'false')) !== 'false';
    if (!enabled) return;
    if (typeof WebSocket === 'undefined') return;

    const wsUrl: string = env.VITE_SENSOR_WS_URL || 'ws://localhost:5174';

    try {
      const ws = new WebSocket(wsUrl);
      this.sensorWs = ws;

      ws.onopen = () => console.log(`📡 Sensor WS connected: ${wsUrl}`);
      ws.onclose = () => console.log('📡 Sensor WS disconnected');
      ws.onerror = () => console.log('📡 Sensor WS error');

      ws.onmessage = (ev) => {
        if (this.isUIDialogOpen) return;
        let msg: any;
        try {
          msg = JSON.parse(String(ev.data));
        } catch {
          return;
        }
        if (!msg || msg.type !== 'sensor') return;

        const raw = msg.payload ?? msg;
        const sens = raw?.sensordata ?? raw?.sensor ?? raw;
        const accel = sens?.accel ?? sens?.acceleration ?? raw?.accel;
        const gyro = sens?.gyro ?? sens?.gyroscope ?? raw?.gyro;

        const gyroX = Number(gyro?.x);
        const accelY = Number(accel?.y);

        const useGyro = Number.isFinite(gyroX);
        const signal = useGyro ? gyroX : Number.isFinite(accelY) ? accelY : 0;
        if (!Number.isFinite(signal)) return;

        const threshold = useGyro ? 2.0 : 0.8;
        const abs = Math.abs(signal);
        if (abs < threshold) return;

        const now = Date.now();
        if (now - this.sensorLastBreakAtMs < this.SENSOR_BREAK_COOLDOWN_MS) return;

        const sign: -1 | 0 | 1 = signal > 0 ? 1 : signal < 0 ? -1 : 0;
        if (sign === 0) return;

        // Require a strong swing to one side, then the opposite side within a short window.
        if (this.sensorShakeLastSign === 0) {
          this.sensorShakeLastSign = sign;
          this.sensorShakeLastHighAtMs = now;
          this.sensorShakeLastHighAbs = abs;
          return;
        }

        const withinWindow = now - this.sensorShakeLastHighAtMs <= this.SENSOR_SHAKE_WINDOW_MS;
        const opposite = sign !== this.sensorShakeLastSign;
        const prevStrong = this.sensorShakeLastHighAbs >= threshold;

        if (withinWindow && opposite && prevStrong) {
          this.sensorLastBreakAtMs = now;
          this.sensorShakeLastSign = 0;
          this.sensorShakeLastHighAtMs = 0;
          this.sensorShakeLastHighAbs = 0;
          this.registerBreak('sensor');
          this.showBreakFeedback('SHAKE');
          this.destroyNearbyObstacle();
          return;
        }

        // If window expired or same direction, reset baseline to the latest strong swing.
        this.sensorShakeLastSign = sign;
        this.sensorShakeLastHighAtMs = now;
        this.sensorShakeLastHighAbs = abs;
      };
    } catch (e) {
      console.log('📡 Sensor WS init failed', e);
    }
  }

  update(time: number, delta: number) {
    if (!this.player || !this.levelConfig) return;

    // Update Player Movement (0.7x slower for parkour)
    const speed = 4.2;
    if (this.autoRunEnabled) {
      // 跑酷：持续向右跑
      this.player.setVelocityX(speed);
    } else {
      if (this.isMovingLeft) {
        this.player.setVelocityX(-speed);
      } else if (this.isMovingRight) {
        this.player.setVelocityX(speed);
      }
    }

    // Health bars are disabled

    // Background parallax is now handled automatically by scrollFactor
    // The background images will scroll with the camera at 0.3x speed
    
    // Detect nearby obstacles for space key interaction
    this.detectNearbyObstacles();
      
    // Check for star collection
    this.checkStarCollection();

    // Update Lighting and Background based on player position (Time of Day)
    this.updateLightingAndBackground();
    
    // Update debug panel
    // this.updateDebugPanel();

    // End Game Logic - Check if player reached the end of background
    // Workspace rule: only allow auto-finish AFTER entering outdoor, and reaching outdoor end.
    const worldWidth = this.backgroundWidth > 0 ? this.backgroundWidth : this.scale.width;
    const endThreshold =
      this.usingWorkspaceScene && this.workspaceStage === 'outdoor'
        ? 600 // Workspace outdoor: last 600px triggers immediate finish
        : Math.max(300, this.scale.width * 0.25);

    const canAutoFinish =
      !this.usingWorkspaceScene ||
      (this.usingWorkspaceScene && this.workspaceStage === 'outdoor' && !this.workspaceTransitionInProgress);

    const inEndZone = this.player.x >= worldWidth - endThreshold;
    if (canAutoFinish && inEndZone) {
      console.log(`🏁 End zone reached (${endThreshold}px). Finishing...`);
      const endedAtMs = Date.now();
      const summary = this.buildGameSummary(endedAtMs);
      // Pass summary as 2nd arg; React handler can capture it
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.onGameOver as any)(true, summary);
      this.scene.pause(); // Pause immediately to prevent multiple triggers
      return;
    }

    // Not in end zone → reset hold timer (legacy)
    this.endZoneHoldStartMs = null;

    // Safety check: if player falls way off screen, reset position instead of restarting
    // iPhone 14 Pro Max 掉落检测阈值
    if (this.player.y > this.scale.height + 400) {
        console.warn('⚠️ Player fell off screen, resetting position');
        const feetY = this.getUnifiedGroundY() + this.PLAYER_FEET_OFFSET_PX;
        this.setPlayerFeetY(feetY); // Reset feet to ground line
        this.player.x = Math.max(this.player.x, this.scale.width * 0.08); // 确保不会太靠左
        // @ts-ignore
        if (this.player.body) {
          // @ts-ignore
          this.player.body.position.x = this.player.x;
          // @ts-ignore
          this.player.setVelocity(0, 0); // Stop any falling velocity
        }
    }
  }

  // --- External Control Methods ---

  public triggerJump() {
    // @ts-ignore
    if (this.player && this.player.body && Math.abs(this.player.body.velocity.y) < 2) {
        this.player.setVelocityY(-14);
    }
  }

  public triggerDash() {
    const now = this.time.now;
    if (now - this.lastDashTime > 1000) {
        const direction = this.isMovingLeft ? -1 : 1;
        this.player.applyForce(new Phaser.Math.Vector2(direction * 0.15, 0));
        this.lastDashTime = now;
        this.addDashEffect();
    }
  }

  public setAutoRun(enabled: boolean) {
    this.autoRunEnabled = enabled;
    if (enabled) {
      // 确保不会被旧输入状态影响
      this.isMovingLeft = false;
      this.isMovingRight = false;
    }
  }

  public setMoveLeft(isMoving: boolean) {
    if (this.autoRunEnabled) return;
    this.isMovingLeft = isMoving;
  }

  public setMoveRight(isMoving: boolean) {
    if (this.autoRunEnabled) return;
    this.isMovingRight = isMoving;
  }
  
  public setUIDialogOpen(isOpen: boolean) { 
    this.isUIDialogOpen = isOpen;
    console.log('🎮 UI Dialog state:', isOpen ? 'OPEN' : 'CLOSED');
  }
  
  public triggerDestroy() {
    this.registerBreak('ui');
    this.showBreakFeedback('BREAK');
    this.destroyNearbyObstacle();
  }

  private registerBreak(source: BreakSource) {
    this.breakCount += 1;
    this.breakBySource[source] = (this.breakBySource[source] || 0) + 1;
  }

  private buildGameSummary(endedAtMs: number): GameSummary {
    const startedAtMs = this.sessionStartedAtMs || endedAtMs;
    const durationMs = Math.max(0, endedAtMs - startedAtMs);
    const sceneMode = this.usingWorkspaceScene ? 'workspace' : 'scenario';
    return {
      sceneMode,
      scenarioId: this.levelConfig?.scenarioId ?? ScenarioId.D,
      selectedCharacterId: this.levelConfig?.playerCharacter,
      startedAtMs,
      endedAtMs,
      durationMs,
      breakCount: this.breakCount,
      breakBySource: this.breakBySource,
      destroyedCount: this.destructionCount,
      transformedCount: this.transformedCount,
      destroyedObjects: this.destroyedObjects.slice(),
      transformedObjects: this.transformedObjects.slice(),
      enteredOutdoorAtMs: this.enteredOutdoorAtMs
    };
  }

  private showBreakFeedback(label: string) {
    try {
      // Visual confirmation that BREAK reached the scene
      this.cameras.main.flash(80, 92, 255, 212);

      const x = this.scale.width / 2;
      const y = Math.max(40, this.scale.height * 0.12);
      const t = this.add
        .text(x, y, label, {
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
          fontSize: '20px',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 4,
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(999999)
        .setAlpha(0.95);

      this.tweens.add({
        targets: t,
        alpha: 0,
        duration: 350,
        onComplete: () => t.destroy(),
      });
    } catch {
      // ignore
    }
  }

  // One-click debug utility: clear all destructible items (keep gate/background/player)
  public clearAllItems() {
    console.log('🧹 Clearing all items...');

    this.nearbyObstacles.clear();

    // Destroy all obstacles except the workspace gate (kept for transition testing)
    const ids = Array.from(this.obstacles.keys());
    ids.forEach((id) => {
      const obstacle = this.obstacles.get(id);
      if (!obstacle || !obstacle.active) {
        this.obstacles.delete(id);
        return;
      }

      // Keep workspace gate
      if (obstacle.getData && obstacle.getData('isWorkspaceGate')) return;

      try {
        // Remove health bar components if present
        const healthBarShadow = obstacle.getData?.('healthBarShadow');
        const healthBarBg = obstacle.getData?.('healthBarBg');
        const healthBarInner = obstacle.getData?.('healthBarInner');
        const healthBarFill = obstacle.getData?.('healthBarFill');
        const healthBarGlow = obstacle.getData?.('healthBarGlow');
        if (healthBarShadow) healthBarShadow.destroy();
        if (healthBarBg) healthBarBg.destroy();
        if (healthBarInner) healthBarInner.destroy();
        if (healthBarFill) healthBarFill.destroy();
        if (healthBarGlow) healthBarGlow.destroy();

        obstacle.destroy();
      } catch (e) {
        console.warn('⚠️ Failed to destroy obstacle', id, e);
      } finally {
        this.obstacles.delete(id);
      }
    });

    console.log('✅ Items cleared');
  }

  public transformObstacle(obstacleId: string, goodItemKey: string) {
    try {
      console.log('🔄 Transform START');
      console.log('Step 0: Input params', { obstacleId, goodItemKey });
      
      const obstacle = this.obstacles.get(obstacleId);
      console.log('Step 1: Got obstacle from map', !!obstacle);
      
      if (!obstacle) {
        console.log('❌ Obstacle not found');
        return;
      }

      console.log('Step 2: Checking stars', this.starCount);
      if (this.starCount < 3) {
        console.log('❌ Not enough stars');
        return;
      }

      console.log('Step 3: Checking texture exists', goodItemKey);
      if (!this.textures.exists(goodItemKey)) {
        console.warn('⚠️ Texture not found, generating placeholder:', goodItemKey);
        this.ensurePlaceholderTexture(goodItemKey);
      }

      // If transforming the same obstacle multiple times, ensure the new result replaces the old one
      // (avoid stacking multiple lock icons / tweens / decorations).
      try {
        const existingLockIcon = obstacle.getData?.('lockIcon') as Phaser.GameObjects.Text | undefined;
        if (existingLockIcon) {
          this.tweens.killTweensOf(existingLockIcon);
          existingLockIcon.destroy();
          obstacle.setData?.('lockIcon', null);
        }
      } catch (e) {
        console.warn('⚠️ Failed to cleanup previous transform decorations', e);
      }

      console.log('Step 4: Consuming stars');
      this.starCount -= 3;
      if (this.onStarCollected) {
        this.onStarCollected(this.starCount);
      }

      console.log('Step 5: Marking as transformed');
      obstacle.setData('isTransformed', true);
      obstacle.setData('goodItem', goodItemKey);
      this.transformedCount += 1;
      try {
        const from = String(obstacle.getData?.('originalTexture') || obstacle.texture?.key || 'object');
        this.transformedObjects.push({ from, to: String(goodItemKey) });
      } catch {}
      
      // ✅ Transformed items should NOT block player movement.
      // Keep them visible/interactive, but remove physics blocking.
      this.makeObstaclePassThrough(obstacle);
      
      // Remove all health bar components for transformed items
      const healthBarShadow = obstacle.getData('healthBarShadow');
      const healthBarBg = obstacle.getData('healthBarBg');
      const healthBarInner = obstacle.getData('healthBarInner');
      const healthBarFill = obstacle.getData('healthBarFill');
      const healthBarGlow = obstacle.getData('healthBarGlow');
      
      if (healthBarShadow) {
        healthBarShadow.destroy();
        obstacle.setData('healthBarShadow', null);
      }
      if (healthBarBg) {
        healthBarBg.destroy();
        obstacle.setData('healthBarBg', null);
      }
      if (healthBarInner) {
        healthBarInner.destroy();
        obstacle.setData('healthBarInner', null);
      }
      if (healthBarFill) {
        healthBarFill.destroy();
        obstacle.setData('healthBarFill', null);
      }
      if (healthBarGlow) {
        healthBarGlow.destroy();
        obstacle.setData('healthBarGlow', null);
      }
      console.log('✅ Health bar removed');

      console.log('Step 6: Saving current state (MUST preserve size and position)');
      const currentX = obstacle.x;
      const currentY = obstacle.y;
      const currentDisplayWidth = obstacle.displayWidth;
      const currentDisplayHeight = obstacle.displayHeight;
      const currentDepth = obstacle.depth;
      console.log('Current position before transform:', currentX, currentY);
      console.log('Current display size:', currentDisplayWidth, 'x', currentDisplayHeight);
      console.log('Current depth:', currentDepth);
      
      console.log('Step 7: Changing texture');
      obstacle.setTexture(goodItemKey);
      console.log('✅ Texture changed to:', obstacle.texture.key);
      
      console.log('Step 8: Setting origin to bottom-center (same as original)');
      // Set origin to bottom-center so all objects align at the bottom
      obstacle.setOrigin(0.5, 1);
      console.log('Origin set to (0.5, 1) - bottom-center');
      
      console.log('Step 9: Restoring original display size');
      // Calculate scale needed to match original display size
      // 🎯 FIXED: Use FIXED_SCALE for transformed items (don't stretch to original size)
      obstacle.setScale(this.FIXED_SCALE);
      console.log('Scale reset to FIXED_SCALE:', this.FIXED_SCALE);
      
      // Safety check: if image is too large, scale down
      const maxSafeHeight = this.scale.height * 0.6; // Max 60% of screen height
      if (obstacle.displayHeight > maxSafeHeight) {
          const additionalScale = maxSafeHeight / obstacle.displayHeight;
          obstacle.setScale(this.FIXED_SCALE * additionalScale);
          console.log(`⚠️ Item too large, scaled down by ${additionalScale.toFixed(3)}`);
      }
      
      console.log('New display size:', obstacle.displayWidth, 'x', obstacle.displayHeight);
      
      console.log('Step 10: Restoring exact position');
      // Restore exact X and Y position
      obstacle.x = currentX;
      obstacle.y = currentY;
      console.log('Position restored to:', obstacle.x, obstacle.y);
      
      console.log('Step 11: Ensuring visibility and depth');
      obstacle.setDepth(currentDepth); // Keep same depth as original
      obstacle.setAlpha(1);
      obstacle.setVisible(true);
      obstacle.setActive(true);
      console.log('Visibility set, depth:', obstacle.depth);
      
      console.log('Step 12: Adding lock icon');
      try {
        const lockIcon = this.addLockIcon(obstacle);
        this.makeItemDraggable(obstacle, lockIcon);
        console.log('✅ Lock and drag added');
      } catch (error) {
        console.error('⚠️ Could not add lock/drag:', error);
      }
      
      console.log('Step 13: Adding sparkle effect');
      try {
        this.createSparkles(obstacle.x, obstacle.y);
      } catch (error) {
        console.error('⚠️ Could not add sparkles:', error);
      }

      // 🔧 FIX: Transformation should also increase Lucidity (progress)
      this.destructionCount++;
      if (this.onScoreUpdate) {
        this.onScoreUpdate(this.destructionCount);
      }
      // Update background lighting based on new progress
      this.updateLightingAndBackground();
      
      console.log('✅✅✅ TRANSFORM COMPLETE!');
      console.log('Final texture:', obstacle.texture.key);
      console.log('Final position:', obstacle.x, obstacle.y);
      console.log('Final scale:', obstacle.scaleX);
      console.log('Final alpha:', obstacle.alpha);
      console.log('Final visible:', obstacle.visible);
      console.log('Final depth:', obstacle.depth);
      
    } catch (error) {
      console.error('❌❌❌ ERROR:', error);
      console.error('Stack:', (error as Error).stack);
      throw error;
    }
  }

  private ensurePlaceholderTexture(key: string) {
    if (!key) return;
    if (this.textures.exists(key)) return;

    try {
      const w = 256;
      const h = 256;
      const tex = this.textures.createCanvas(key, w, h);
      const ctx = tex.getContext();
      const label = key.replace(/^good_/, '').replace(/_/g, ' ').slice(0, 18);

      // Background
      ctx.fillStyle = '#1b1b1f';
      ctx.fillRect(0, 0, w, h);

      // Border
      ctx.strokeStyle = '#5cffd4';
      ctx.lineWidth = 6;
      ctx.strokeRect(8, 8, w - 16, h - 16);

      // Simple sparkle dots
      ctx.fillStyle = '#ffd166';
      for (let i = 0; i < 14; i++) {
        const x = 30 + (i * 13) % (w - 60);
        const y = 40 + ((i * 29) % (h - 80));
        ctx.beginPath();
        ctx.arc(x, y, (i % 3) + 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Text label
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 28px Arial';
      ctx.fillText('GOOD', w / 2, h / 2 - 24);
      ctx.font = '22px Arial';
      ctx.fillText(label, w / 2, h / 2 + 18);

      tex.refresh();
    } catch (e) {
      console.warn('⚠️ Failed to generate placeholder texture', key, e);
    }
  }

  /**
   * Make an obstacle non-blocking in Matter so the player can pass through.
   * Keep it visible/interactive (lock icon, dragging), but disable collisions.
   */
  private makeObstaclePassThrough(
    obstacle: Phaser.Physics.Matter.Image | Phaser.Physics.Matter.Sprite | any
  ) {
    try {
      // Never change gate physics; it controls stage transition.
      if (obstacle?.getData?.('isWorkspaceGate')) return;

      // Prefer Phaser helper if available
      if (typeof obstacle?.setSensor === 'function') {
        obstacle.setSensor(true);
      }

      // Fallback: directly tweak Matter body/collision filter
      const body = obstacle?.body as any;
      if (body) {
        body.isSensor = true;
        // Disable collisions entirely
        if (body.collisionFilter) {
          body.collisionFilter.mask = 0;
        }
        // Ensure collision handler won't treat it as a destructible wall
        if (body.label === 'destructible') {
          body.label = 'decor';
        }
      }
    } catch (e) {
      console.warn('⚠️ makeObstaclePassThrough failed', e);
    }
  }

  private showTransformError(x: number, y: number, message: string) {
    const text = this.add.text(x, y - 50, message, {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ff0000',
      stroke: '#000000',
      strokeThickness: 4,
      align: 'center'
    });
    text.setOrigin(0.5);
    text.setDepth(100);

    this.tweens.add({
      targets: text,
      y: y - 100,
      alpha: 0,
      duration: 1500,
      ease: 'Power2',
      onComplete: () => text.destroy()
    });
  }

  private showLockedMessage(x: number, y: number) {
    const text = this.add.text(x, y - 50, '🔒 Locked!', {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#ffd700',
      stroke: '#000000',
      strokeThickness: 4,
      align: 'center'
    });
    text.setOrigin(0.5);
    text.setDepth(100);

    // Bounce animation
    this.tweens.add({
      targets: text,
      y: y - 80,
      scale: 1.2,
      duration: 200,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        this.tweens.add({
          targets: text,
          alpha: 0,
          duration: 500,
          onComplete: () => text.destroy()
        });
      }
    });
  }

  private showTransformSuccess(x: number, y: number) {
    const text = this.add.text(x, y - 50, '✨ Transformed!', {
      fontSize: '32px',
      fontFamily: 'Arial',
      color: '#00ff00',
      stroke: '#000000',
      strokeThickness: 5,
      align: 'center'
    });
    text.setOrigin(0.5);
    text.setDepth(100);

    // Float up and fade animation
    this.tweens.add({
      targets: text,
      y: y - 120,
      alpha: 0,
      scale: 1.5,
      duration: 2000,
      ease: 'Power2',
      onComplete: () => text.destroy()
    });
  }

  private addLockIcon(obstacle: Phaser.Physics.Matter.Sprite | Phaser.Physics.Matter.Image): Phaser.GameObjects.Text {
    console.log('🔒 Adding lock icon to obstacle at:', obstacle.x, obstacle.y);
    
    if (!obstacle || obstacle.displayHeight === undefined) {
      console.error('❌ Invalid obstacle for lock icon');
      return this.add.text(0, 0, '🔒', { fontSize: '8px' }); // Return dummy
    }
    
    // 🎮 iPhone 14 Pro Max 锁图标大小
    const lockFontSize = Math.max(this.FIXED_SCALE * 35, 12); // 适中大小，最小12px
    const lockIcon = this.add.text(
      obstacle.x, 
      obstacle.y - obstacle.displayHeight - 20, // origin is at bottom (0.5, 1), so y is bottom position
      '🔒', 
      {
        fontSize: `${lockFontSize}px`,
        fontFamily: 'Arial'
      }
    );
    lockIcon.setOrigin(0.5);
    lockIcon.setDepth(50);
    lockIcon.setAlpha(0.8);
    
    // Store reference to lock icon
    obstacle.setData('lockIcon', lockIcon);
    console.log('✅ Lock icon created at:', lockIcon.x, lockIcon.y);
    
    // Make lock icon float
    this.tweens.add({
      targets: lockIcon,
      y: lockIcon.y - 5,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut'
    });
    
    // Glow effect
    this.tweens.add({
      targets: lockIcon,
      alpha: 1,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut'
    });
    
    return lockIcon;
  }

  private makeItemDraggable(obstacle: Phaser.Physics.Matter.Sprite | Phaser.Physics.Matter.Image, lockIcon: Phaser.GameObjects.Text) {
    console.log('🖐️ Making item draggable...');
    
    if (!obstacle) {
      console.error('❌ Cannot make undefined obstacle draggable');
      return;
    }
    
    try {
      // Enable dragging (keeping existing interactive settings)
      if (!obstacle.input) {
        obstacle.setInteractive({ draggable: true, useHandCursor: true });
        console.log('✅ Interactive enabled with draggable');
      } else {
        obstacle.input.draggable = true;
        console.log('✅ Draggable enabled on existing input');
      }
      
      // Remove old drag events if they exist
      obstacle.off('dragstart');
      obstacle.off('drag');
      obstacle.off('dragend');
      console.log('✅ Old drag events removed');
      
      obstacle.on('dragstart', (pointer: Phaser.Input.Pointer) => {
        // Tint feedback disabled
        console.log('🖐️ Started dragging transformed item');
      });
      
      obstacle.on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        // Update obstacle position
        try {
          if (obstacle && obstacle.x !== undefined) {
            obstacle.x = dragX;
            obstacle.y = dragY;
            console.log('📍 Dragged to:', dragX, dragY);
            
            // Update lock icon position (origin is at bottom, so y is bottom position)
            if (lockIcon && lockIcon.x !== undefined) {
              lockIcon.x = dragX;
              lockIcon.y = dragY - obstacle.displayHeight - 20;
            }
          }
        } catch (error) {
          console.error('❌ Drag error:', error);
        }
      });
      
      obstacle.on('dragend', () => {
        // Ensure no tint remains
        if (obstacle.tintTopLeft !== 0xffffff) obstacle.clearTint();
        console.log('✅ Dropped transformed item at:', obstacle.x, obstacle.y);
        
        // Add a little bounce effect
        this.tweens.add({
          targets: obstacle,
          scaleX: obstacle.scaleX * 1.1,
          scaleY: obstacle.scaleY * 1.1,
          duration: 100,
          yoyo: true,
          ease: 'Back.out'
        });
      });
      
      console.log('✅ Dragging setup complete');
    } catch (error) {
      console.error('❌ Error in makeItemDraggable:', error);
    }
  }

  private createSparkles(x: number, y: number) {
    const sparkles = this.add.particles(x, y, 'particle', {
      speed: { min: 100, max: 200 },
      angle: { min: 0, max: 360 },
      scale: { start: 1.5, end: 0 },
      lifespan: 800,
      gravityY: -200,
      quantity: 20,
      blendMode: 'ADD',
      tint: [0xffff00, 0xff00ff, 0x00ffff, 0xffffff]
    });
    this.time.delayedCall(1000, () => sparkles.destroy());
  }

  private showStarRequirement(x: number, y: number) {
    // Create floating text showing star requirement
    const text = this.add.text(x, y - 50, '⭐ Need 3 Stars! ⭐', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ffff00',
      stroke: '#000000',
      strokeThickness: 4,
      align: 'center'
    });
    text.setOrigin(0.5);
    text.setDepth(100);

    // Floating animation
    this.tweens.add({
      targets: text,
      y: y - 100,
      alpha: 0,
      duration: 1500,
      ease: 'Power2',
      onComplete: () => {
        text.destroy();
      }
    });

    // Flash effect on the obstacle
    const obstacle = Array.from(this.obstacles.values()).find(obs => 
      Math.abs(obs.x - x) < 10 && Math.abs(obs.y - y) < 10
    );
    if (obstacle) {
      this.tweens.add({
        targets: obstacle,
        alpha: 0.5,
        duration: 100,
        yoyo: true,
        repeat: 3
      });
    }
  }

  // --- Nearby Obstacle Detection & Destruction ---

  private detectNearbyObstacles() {
    if (!this.player) return;

    // Clear previous nearby obstacles
    this.nearbyObstacles.clear();

    // Check all obstacles in our map
    this.obstacles.forEach((obstacle) => {
      // Always clear any leftover tint (no proximity highlight)
      if (obstacle.tintTopLeft !== 0xffffff) {
        obstacle.clearTint();
      }

      // Skip transformed (locked) obstacles
      if (obstacle.getData('isTransformed')) {
        return;
      }
      
      // Skip obstacles that are already destroyed (health <= 0)
      const health = obstacle.getData('health');
      if (health !== undefined && health <= 0) {
        return;
      }
      
      // Calculate the closest edge-to-edge distance (horizontal)
      const playerLeftEdge = this.player.x - this.player.displayWidth / 2;
      const playerRightEdge = this.player.x + this.player.displayWidth / 2;
      const obstacleLeftEdge = obstacle.x - obstacle.displayWidth / 2;
      const obstacleRightEdge = obstacle.x + obstacle.displayWidth / 2;
      
      // Calculate edge-to-edge distance
      let distance;
      if (playerRightEdge < obstacleLeftEdge) {
        // Player is to the left of obstacle
        distance = obstacleLeftEdge - playerRightEdge;
      } else if (playerLeftEdge > obstacleRightEdge) {
        // Player is to the right of obstacle
        distance = playerLeftEdge - obstacleRightEdge;
      } else {
        // Player is overlapping with obstacle
        distance = 0;
      }
      
      // If within detection radius, add to nearby set
      if (distance <= this.detectionRadius) {
        this.nearbyObstacles.add(obstacle);
      }
    });
  }

  private destroyNearbyObstacle() {
    console.log('🔨 ============ BREAK BUTTON PRESSED ============');
    console.log('Nearby obstacles count:', this.nearbyObstacles.size);
    
    if (this.nearbyObstacles.size === 0) {
      console.log('⚠️ No nearby obstacles detected');
      this.showBreakFeedback('NO TARGET');
      // Still show hammer swing so the player gets visible feedback
      try {
        const playerCenterY = this.player?.y ?? this.scale.height / 2;
        const targetX = (this.player?.x ?? this.scale.width / 2) + 90;
        const targetY = playerCenterY - 40;
        this.showHammerSwing(this.player?.x ?? this.scale.width / 2, playerCenterY, targetX, targetY);
      } catch {}
      return;
    }

    // Find the closest obstacle (using same distance calculation as detection)
    let closestObstacle: Phaser.Physics.Matter.Image | null = null;
    let minDistance = Infinity;

    this.nearbyObstacles.forEach(obstacle => {
      // Check if obstacle is valid and active before accessing properties
      if (!obstacle || !obstacle.active) return;

      // Calculate the closest edge-to-edge distance (same as detection)
      const playerLeftEdge = this.player.x - this.player.displayWidth / 2;
      const playerRightEdge = this.player.x + this.player.displayWidth / 2;
      const obstacleLeftEdge = obstacle.x - obstacle.displayWidth / 2;
      const obstacleRightEdge = obstacle.x + obstacle.displayWidth / 2;
      
      let distance;
      if (playerRightEdge < obstacleLeftEdge) {
        distance = obstacleLeftEdge - playerRightEdge;
      } else if (playerLeftEdge > obstacleRightEdge) {
        distance = playerLeftEdge - obstacleRightEdge;
      } else {
        distance = 0;
      }
      
      console.log('Checking obstacle at edge distance:', distance);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestObstacle = obstacle;
      }
    });

    // Damage the closest obstacle
    if (closestObstacle) {
      console.log(`🎯 Found closest obstacle at distance: ${minDistance.toFixed(0)}px`);
      
      // Check if it's a transformed (locked) item
      if (closestObstacle.getData('isTransformed')) {
        console.log('🔒 This is a transformed item - cannot destroy');
        // Show locked message - can't destroy transformed items
        this.showLockedMessage(closestObstacle.x, closestObstacle.y);
        console.log('🔒 Cannot destroy transformed item!');
        return;
      }
      
      // Damage the obstacle - showHammer=true for BREAK button attacks
      this.damageObstacle(closestObstacle, true);
    }
  }

  private checkStarCollection() {
    if (!this.player) return;

    // 🎮 iPhone 14 Pro Max 星星收集半径
    const collectionRadius = 150; // 星星收集距离 - 需要靠近一些才能收集

    this.stars.forEach(star => {
      if (!star.active) return;

      const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        star.x,
        star.y
      );

      if (distance <= collectionRadius) {
        // Collect the star
        this.collectStar(star);
      }
    });
  }

  private collectStar(star: Phaser.GameObjects.Star) {
    // Remove from collection
    this.stars.delete(star);
    
    // Increment count
    this.starCount++;
    
    // Collection animation (larger)
    this.tweens.add({
      targets: star,
      scale: 3.5, // Larger collection animation
      alpha: 0,
      y: star.y - 60,
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        star.destroy();
      }
    });

    // Update callback
    if (this.onStarCollected) {
      this.onStarCollected(this.starCount);
    }

    // Play collection sound effect (optional - if you have sound)
    // this.sound.play('collect');
  }

  // --- Background & Atmosphere System ---

  private createBackgroundSystem(width: number, height: number) {
      // Workspace special background flow
      if (this.shouldUseWorkspaceScene()) {
        this.createWorkspaceBackgroundSystem(width, height);
        return;
      }

      const sid = this.levelConfig.scenarioId;
      this.bgPhases = [];

      console.log(`🎮 iPhone 14 Pro Max 横屏模式 (约430px高度) - 优化布局`);
      console.log(`📚 Creating 8 stacked background layers (stage1=top, stage8=bottom)`);

      // Create 8 stacked layers - stage8 at bottom, stage1 at top
      for (let i = 1; i <= 8; i++) {
          const key = `bg_${sid}_${i}`;
          
          // Use Image for background
          const bg = this.add.image(0, height / 2, key);
          bg.setOrigin(0, 0.5); // Set origin to left-center for easier positioning
          
          // 🔧 FIX: Remove parallax scrolling to match game length with image length exactly
          // bg.setScrollFactor(0.3); 
          
          // Set depth: stage8 (i=8) at bottom (depth=-20), stage1 (i=1) at top (depth=-13)
          // Formula: depth = -20 + (8 - i), so stage8 = -20, stage1 = -13
          bg.setDepth(-20 + (8 - i));
          
          // Scale to fit screen height while maintaining aspect ratio
          if (this.textures.exists(key)) {
             const tex = this.textures.get(key);
             const frame = tex.getSourceImage();
             if (frame && frame.width && frame.height) {
                 // Scale to fit screen height, width will scale proportionally
                 const scale = height / frame.height;
                 bg.setScale(scale);
                 
                 // Store background width
                 if (i === 1) {
                     this.backgroundWidth = frame.width * scale;
                     console.log(`  Background width: ${this.backgroundWidth.toFixed(0)}px`);
                 }
             } else {
                 bg.setDisplaySize(width, height);
                 if (i === 1) {
                     this.backgroundWidth = width;
                 }
             }
          } else {
              // If texture doesn't exist, use screen width as fallback
              bg.setDisplaySize(width, height);
              if (i === 1) {
                  this.backgroundWidth = width;
             }
          }

          // Initial Alpha State: All layers start fully visible (stacked mode)
          // As the game progresses, upper layers will fade to reveal lower layers
          bg.setAlpha(1);
          console.log(`  ✅ Stage ${i}: depth=${-20 + (8 - i)}, alpha=1 (stacked)`);
          
          // Apply lighting pipeline - DISABLED to prevent WebGL crashes
          // bg.setPipeline('Light2D'); 
          
          this.bgPhases.push(bg);
      }
      console.log(`📚 All 8 stages loaded and stacked (1=top → 8=bottom)`);
  }

  private createWorkspaceBackgroundSystem(width: number, height: number) {
    this.usingWorkspaceScene = true;
    this.bgPhases = [];

    // Cleanup any previous workspace elements (in case of re-entry)
    this.wsIndoorBg?.destroy();
    this.wsOutdoorBgAttached?.destroy();
    this.wsOutdoorBg?.destroy();
    if (this.wsGate && this.wsGate.active) {
      try { this.wsGate.destroy(); } catch {}
    }
    this.wsIndoorBg = undefined;
    this.wsOutdoorBgAttached = undefined;
    this.wsOutdoorBg = undefined;
    this.wsGate = undefined;

    if (this.workspaceStage === 'outdoor') {
      // Outdoor fixed at left
      const bg = this.add.image(0, height / 2, 'ws_outdoor');
      bg.setOrigin(0, 0.5);
      bg.setDepth(-20);

      const frame: any = this.textures.get('ws_outdoor')?.getSourceImage();
      const scale = frame?.height ? height / frame.height : 1;
      bg.setScale(scale);

      this.wsOutdoorBg = bg;
      this.backgroundWidth = (frame?.width ? frame.width * scale : width);
      return;
    }

    // Indoor first, outdoor attached on the right (but not visible until transition)
    const indoor = this.add.image(0, height / 2, 'ws_indoor');
    indoor.setOrigin(0, 0.5);
    indoor.setDepth(-20);

    const indoorFrame: any = this.textures.get('ws_indoor')?.getSourceImage();
    const indoorScale = indoorFrame?.height ? height / indoorFrame.height : 1;
    indoor.setScale(indoorScale);
    const indoorWidth = indoorFrame?.width ? indoorFrame.width * indoorScale : width;

    const outdoor = this.add.image(indoorWidth, height / 2, 'ws_outdoor');
    outdoor.setOrigin(0, 0.5);
    outdoor.setDepth(-21);
    const outdoorFrame: any = this.textures.get('ws_outdoor')?.getSourceImage();
    const outdoorScale = outdoorFrame?.height ? height / outdoorFrame.height : 1;
    outdoor.setScale(outdoorScale);
    // Hide outdoor until transition completes
    outdoor.setAlpha(0);

    this.wsIndoorBg = indoor;
    this.wsOutdoorBgAttached = outdoor;
    this.wsIndoorWidth = indoorWidth;

    // Door placement: move DOOR only (indoor width unchanged)
    const gateX = Math.max(0, this.wsIndoorWidth - this.WS_DOOR_OFFSET_FROM_INDOOR_RIGHT_PX);
    const gateY = height - 10; // align with obstacles' unified ground

    // World ends at indoor edge (no artificial extension)
    this.backgroundWidth = this.wsIndoorWidth;

    const gate = this.matter.add.image(gateX, 0, 'ws_gate_01', undefined, {
      label: 'destructible',
      isStatic: true
    });
    gate.setOrigin(0.5, 1);
    gate.y = gateY;
    // Door scale (tweakable)
    gate.setScale(this.FIXED_SCALE * 0.5);
    gate.setDepth(7); // above bg, near obstacles

    // Mark as workspace gate and set 4-hit state machine
    gate.setData('id', 'workspace_gate');
    gate.setData('isWorkspaceGate', true);
    gate.setData('gateLocked', false);
    gate.setData('originalTexture', 'ws_gate_01');
    gate.setData('isTransformed', false);
    gate.setData('health', 4);
    gate.setData('maxHealth', 4);

    this.wsGate = gate;
    this.obstacles.set('workspace_gate', gate);
  }

  private createGroundForWorld(worldWidth: number, height: number) {
    // Recreate ground to match new world width
    if (this.ground && this.ground.active) {
      try { this.ground.destroy(); } catch {}
    }
    // Align physics ground to the visual ground line used by objects (height - 10)
    const groundTopY = height - 10;
    const groundCenterY = groundTopY + 20; // rectangle height is 40
    this.ground = this.matter.add.image(worldWidth / 2, groundCenterY, 'ground', undefined, { isStatic: true });
    this.ground.setRectangle(worldWidth, 40);
  }

  private startWorkspaceGateTransition() {
    if (!this.usingWorkspaceScene || this.workspaceTransitionInProgress) return;

    this.workspaceTransitionInProgress = true;
    console.log('🌑 Workspace gate reached stage 04 → starting transition');

    // Stop player input / movement
    this.isMovingLeft = false;
    this.isMovingRight = false;
    // @ts-ignore
    if (this.player?.body) {
      // @ts-ignore
      this.player.setVelocity(0, 0);
    }

    const cam = this.cameras.main;
    cam.once('camerafadeoutcomplete', () => {
      this.switchToWorkspaceOutdoorStage();
      cam.fadeIn(1200, 0, 0, 0);
    });
    cam.fadeOut(1200, 0, 0, 0);
  }

  private switchToWorkspaceOutdoorStage() {
    if (!this.usingWorkspaceScene) return;

    const { width, height } = this.scale;
    console.log('🌅 Switching to workspace OUTDOOR stage');

    // Mark stage
    this.workspaceStage = 'outdoor';
    this.endZoneHoldStartMs = null;
    this.enteredOutdoorAtMs = Date.now();

    // Remove indoor backgrounds and attached outdoor
    this.wsIndoorBg?.destroy();
    this.wsOutdoorBgAttached?.destroy();
    this.wsIndoorBg = undefined;
    this.wsOutdoorBgAttached = undefined;

    // Destroy gate
    if (this.wsGate && this.wsGate.active) {
      try { this.wsGate.destroy(); } catch {}
    }
    this.wsGate = undefined;

    // Clear obstacles & stars (indoor props should not persist)
    this.nearbyObstacles.clear();
    this.obstacles.forEach((obs) => {
      if (!obs || !obs.active) return;
      try { obs.destroy(); } catch {}
    });
    this.obstacles.clear();

    this.stars.forEach((star) => {
      if (!star || !star.active) return;
      try { star.destroy(); } catch {}
    });
    this.stars.clear();

    // Build outdoor background fixed at left
    this.createWorkspaceBackgroundSystem(width, height);

    // Update world bounds to outdoor width
    const worldWidth = this.backgroundWidth > 0 ? this.backgroundWidth : width;
    this.matter.world.setBounds(0, 0, worldWidth, height);
    this.cameras.main.setBounds(0, 0, worldWidth, height);

    // Recreate ground for the new world width
    this.createGroundForWorld(worldWidth, height);

    // Reset player to the left and prevent returning to indoor
    this.player.x = width * 0.08;
    this.setPlayerFeetY(this.getUnifiedGroundY() + this.PLAYER_FEET_OFFSET_PX);
    // @ts-ignore
    if (this.player.body) {
      // @ts-ignore
      this.player.setVelocity(0, 0);
    }
    this.cameras.main.centerOn(this.player.x, this.player.y);

    // Spawn outdoor things only in outdoor stage
    this.spawnObjectsForCurrentStage(width, height);

    // Transition complete
    this.workspaceTransitionInProgress = false;
  }

  private spawnObjectsForCurrentStage(width: number, height: number) {
    const worldWidth = this.backgroundWidth > 0 ? this.backgroundWidth : width;
    const unifiedGroundY = height - 10;
    const topMarginY = Math.max(16, Math.floor(height * 0.08)); // "wall" objects near top

    const defs: ObjectStageDef[] =
      this.usingWorkspaceScene && this.workspaceStage === 'outdoor'
        ? WORKSPACE_OUTDOOR_OBJECTS
        : WORKSPACE_INDOOR_OBJECTS;

    // Keep obstacles within indoor image during indoor stage
    const gameAreaWidth =
      this.usingWorkspaceScene && this.workspaceStage === 'indoor' && this.wsIndoorWidth > 0
        ? this.wsIndoorWidth
        : worldWidth;

    const numObstacles = Math.max(5, Math.floor(gameAreaWidth / 350));
    this.totalLevelObstacles = numObstacles;

    const playerStartX = this.player.x;
    const safeZoneRadius = width * 0.35;
    const obstacleZoneStart = playerStartX + safeZoneRadius;
    const obstacleZoneEnd = Math.max(obstacleZoneStart + 200, gameAreaWidth - (width * 0.15));

    const usedPositions: { x: number; type: string }[] = [];
    const minDistance = 200;
    let lastType: string | null = null;

    for (let i = 0; i < numObstacles; i++) {
      let x = 0;
      let attempts = 0;
      let ok = false;
      while (!ok && attempts < 50) {
        x = Phaser.Math.Between(obstacleZoneStart, obstacleZoneEnd);
        ok = true;
        if (Math.abs(x - playerStartX) < safeZoneRadius) ok = false;
        for (const pos of usedPositions) {
          if (Math.abs(x - pos.x) < minDistance) { ok = false; break; }
        }
        attempts++;
      }
      if (!ok) continue;

      let pool = defs;
      if (lastType && defs.length > 1) {
        pool = defs.filter(d => d.id !== lastType);
      }
      const def = Phaser.Math.RND.pick(pool);
      lastType = def.id;

      const obstacle = this.matter.add.image(x, 0, def.stageKeys[0], undefined, {
        label: 'destructible',
        isStatic: true
      });

      obstacle.setDepth(5);
      obstacle.setScale(this.FIXED_SCALE * this.OBJECTS_SCALE);
      obstacle.setOrigin(0.5, 1);

      const firstStagePath = def.stagePaths?.[0] ?? '';
      const shouldPlaceOnWall =
        def.placement === 'top' || def.id.startsWith('wall_') || /\/Wall-/i.test(firstStagePath);
      if (shouldPlaceOnWall) {
        // Keep bottom-origin so other code (topY = y - displayHeight) stays correct.
        // Place so the sprite's TOP edge sits near the top margin.
        obstacle.y = topMarginY + obstacle.displayHeight;
      } else {
        obstacle.y = unifiedGroundY;
      }

      const obstacleId = `obj_${this.workspaceStage}_${def.id}_${i}_${Date.now()}`;
      obstacle.setData('id', obstacleId);
      obstacle.setData('originalTexture', def.name);
      obstacle.setData('stageKeys', def.stageKeys);
      obstacle.setData('isTransformed', false);
      obstacle.setData('health', 4);
      obstacle.setData('maxHealth', 4);

      // Interactions
      obstacle.setInteractive({ useHandCursor: true });
      obstacle.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        const screenHeight = this.scale.height;
        const screenWidth = this.scale.width;
        const clickY = pointer.y;
        const clickX = pointer.x;
        const isInBottomUIArea = clickY > screenHeight - 150;
        const isInLeftButtons = clickX < 200;
        const isInRightButtons = clickX > screenWidth - 200;
        if (isInBottomUIArea && (isInLeftButtons || isInRightButtons)) return;

        if (this.starCount < 3) {
          const obstacleTopY = obstacle.y - obstacle.displayHeight;
          this.showStarRequirement(obstacle.x, obstacleTopY);
          return;
        }
        if (this.onObstacleClick) {
          const badItemName = obstacle.getData('originalTexture') || def.name;
          this.onObstacleClick(obstacleId, badItemName);
        }
      });

      usedPositions.push({ x, type: def.id });
      this.obstacles.set(obstacleId, obstacle);
    }
  }

  /**
   * Checks if external images loaded. If not, generates procedural fallbacks.
   */
  private checkBackgroundTextures() {
      const sid = this.levelConfig.scenarioId;
      // We check the first key. If it's the missing texture placeholder, we generate.
      if (!this.textures.exists(`bg_${sid}_1`)) {
          console.log("Assets not found. Generating procedural backgrounds.");
          this.generateProceduralBackgrounds(sid);
      }
  }

  private generateProceduralBackgrounds(sid: ScenarioId) {
    // Generate 8 phases: Dark -> gradually brighter
    const colors = this.levelConfig.backgroundColors || [0x000000, 0x555555, 0xffffff];
    const baseColor = colors[0]; 

    for (let i = 1; i <= 8; i++) {
        const key = `bg_${sid}_${i}`;
        if(this.textures.exists(key)) continue;

        const graphics = this.make.graphics({ x: 0, y: 0 });
        
        // Interpolate color from Black (stage 1) through Scenario Color (stage 4) to White (stage 8)
        // 8 stages: Very Dark -> Dark -> Dim -> Normal -> Bright -> Very Bright -> Blazing -> Pure White
        let color: number;
        const progress = (i - 1) / 7; // 0 to 1 for stages 1-8
        
        if (progress <= 0.5) {
            // Stages 1-4: Black to Scenario Color
            const t = progress * 2; // 0 to 1
            color = Phaser.Display.Color.Interpolate.ColorWithColor(
                Phaser.Display.Color.ValueToColor(0x050505),
            Phaser.Display.Color.ValueToColor(baseColor),
                100, Math.floor(t * 100)
        ).color;
        } else {
            // Stages 5-7: Scenario Color to White
            const t = (progress - 0.5) * 2; // 0 to 1
            color = Phaser.Display.Color.Interpolate.ColorWithColor(
            Phaser.Display.Color.ValueToColor(baseColor),
            Phaser.Display.Color.ValueToColor(0xffffff),
                100, Math.floor(t * 100)
            ).color;
        }

        // Draw Background
        graphics.fillStyle(color);
        graphics.fillRect(0, 0, 800, 600);

        // Add some shapes based on scenario to make it distinct
        graphics.fillStyle(0x000000, 0.2); // Shadows
        const count = 20;
        for(let j=0; j<count; j++) {
             const x = Math.random() * 800;
             const h = Math.random() * 200 + 50;
             if(sid === ScenarioId.B) { // Forest
                 graphics.fillTriangle(x, 600, x+20, 600-h, x+40, 600);
             } else if (sid === ScenarioId.C) { // Abyss
                 graphics.fillRect(x, 0, 10 + Math.random()*20, 600);
             } else { // Room
                 graphics.fillRect(x, 600-h, 40, h);
             }
        }

        graphics.generateTexture(key, 800, 600);
        graphics.destroy();
    }
  }

  private updateLightingAndBackground() {
    if (!this.player) return;

    // 🎯 Calculate progress based on DESTRUCTION COUNT (not player position)
    // Background changes as player destroys/transforms objects
    // Progress: 0 (no destruction) → 1 (all items destroyed/transformed)
    
    // 🔧 FIX: Use persistent counters instead of iterating map (which loses destroyed items)
    const processedItems = this.destructionCount;
    const totalItems = Math.max(this.totalLevelObstacles, 1); // Avoid division by zero
    
    // Calculate progress: 0 at start, 1 when all items processed
    const progress = Phaser.Math.Clamp(processedItems / totalItems, 0, 1);
    
    // Only log when progress changes significantly (every 10%)
    const progressPercent = Math.floor(progress * 10) * 10;
    if (progressPercent !== this.lastBackgroundProgress) {
      this.lastBackgroundProgress = progressPercent;
      console.log(`🌅 Background transition: ${progressPercent}% (${processedItems}/${totalItems} items processed)`);
    }

    // 1. Global Light Brightness (Ambient) - DISABLED to prevent WebGL crashes
    // // Starts at 0x333333 (51), ends at 0xAAAAAA (170)
    // const startVal = 51;
    // const endVal = 170;
    // const currentVal = Math.floor(startVal + (endVal - startVal) * progress);
    // const color = Phaser.Display.Color.GetColor(currentVal, currentVal, currentVal);
    // 
    // this.lights.setAmbientColor(color);

    // 2. Background Layer Blending (The 8-Photo Stack)
    // As player moves forward, upper layers fade out to reveal lower layers (later times of day)
    
    const totalStages = 8;
    
    this.bgPhases.forEach((bg, index) => {
        const stageNumber = index + 1; // Stage 1-8
        let targetAlpha = 1; // Default: fully visible
        
        // Calculate when this stage should start fading out based on position
        // We divide the journey into segments for each background transition
        const fadeStartProgress = (stageNumber - 1) / (totalStages - 1); 
        const fadeEndProgress = stageNumber / (totalStages - 1);
        
        // Stage 1 (Top) fades out first as we move. 
        // Logic: 
        // We want Stage 1 to be visible at start.
        // As progress goes 0 -> 1/7, Stage 1 alpha goes 1 -> 0.
        // As progress goes 1/7 -> 2/7, Stage 2 alpha goes 1 -> 0.
        // ...
        // Stage 8 is always at bottom.
        
        // Actually, simpler logic:
        // We only need to fade the layer ABOVE the current one being revealed.
        // If we have 8 layers stacked 1..8 (1 on top).
        // At progress 0: All layers alpha 1. (See 1).
        // At progress 1: Layers 1-7 alpha 0. (See 8).
        
        // Let's check each layer 'i' (where 1 is top).
        // It should fade out when progress passes its segment.
        // There are 7 transitions for 8 layers.
        
        const layerFadeStart = (index) / 7; // 0, 1/7, 2/7...
        const layerFadeEnd = (index + 1) / 7;
        
        if (index === 7) {
             // Stage 8 (bottom) never fades
             targetAlpha = 1;
        } else if (progress < layerFadeStart) {
            targetAlpha = 1;
        } else if (progress >= layerFadeStart && progress < layerFadeEnd) {
            // Fade out
            targetAlpha = 1 - ((progress - layerFadeStart) / (layerFadeEnd - layerFadeStart));
        } else {
            targetAlpha = 0;
        }

        // 🔧 FIX: Smooth transition using Lerp (Linear Interpolation)
        // Instead of setting alpha directly, move it gradually towards target
        // Factor 0.05 means it moves 5% of the difference per frame (~1-2 seconds for full transition)
        const currentAlpha = bg.alpha;
        if (Math.abs(currentAlpha - targetAlpha) > 0.001) {
            bg.setAlpha(currentAlpha + (targetAlpha - currentAlpha) * 0.05);
        } else {
            bg.setAlpha(targetAlpha);
        }
    });
  }

  // --- Game Logic ---

  private handleResize(gameSize: Phaser.Structs.Size) {
     const { width, height } = gameSize;
     this.cameras.main.setViewport(0, 0, width, height);

     // Workspace resize handling
     if (this.usingWorkspaceScene) {
       if (this.workspaceStage === 'indoor' && this.wsIndoorBg && this.textures.exists('ws_indoor')) {
         const indoorFrame: any = this.textures.get('ws_indoor')?.getSourceImage();
         const indoorScale = indoorFrame?.height ? height / indoorFrame.height : 1;
         this.wsIndoorBg.setScale(indoorScale);
         this.wsIndoorBg.y = height / 2;
         const indoorWidth = indoorFrame?.width ? indoorFrame.width * indoorScale : width;

         if (this.wsOutdoorBgAttached && this.textures.exists('ws_outdoor')) {
           const outdoorFrame: any = this.textures.get('ws_outdoor')?.getSourceImage();
           const outdoorScale = outdoorFrame?.height ? height / outdoorFrame.height : 1;
           this.wsOutdoorBgAttached.setScale(outdoorScale);
           this.wsOutdoorBgAttached.setPosition(indoorWidth, height / 2);
           this.wsOutdoorBgAttached.setAlpha(0);
         }

         this.wsIndoorWidth = indoorWidth;
         const gateX = Math.max(0, this.wsIndoorWidth - this.WS_DOOR_OFFSET_FROM_INDOOR_RIGHT_PX);
         this.backgroundWidth = this.wsIndoorWidth;
         const worldWidth = this.backgroundWidth > 0 ? this.backgroundWidth : width;
         this.matter.world.setBounds(0, 0, worldWidth, height);
         this.cameras.main.setBounds(0, 0, worldWidth, height);

         // Reposition gate relative to indoor right edge
         if (this.wsGate && this.wsGate.active) {
           this.wsGate.setPosition(gateX, height - 10);
         }

         // Resize/reposition ground
         if (this.ground && this.ground.active) {
          this.ground.setPosition(worldWidth / 2, (height - 10) + 20);
           this.ground.setRectangle(worldWidth, 40);
         }
         return;
       }

       if (this.workspaceStage === 'outdoor' && this.wsOutdoorBg && this.textures.exists('ws_outdoor')) {
         const outdoorFrame: any = this.textures.get('ws_outdoor')?.getSourceImage();
         const outdoorScale = outdoorFrame?.height ? height / outdoorFrame.height : 1;
         this.wsOutdoorBg.setScale(outdoorScale);
         this.wsOutdoorBg.y = height / 2;
         this.backgroundWidth = outdoorFrame?.width ? outdoorFrame.width * outdoorScale : width;

         const worldWidth = this.backgroundWidth > 0 ? this.backgroundWidth : width;
         this.matter.world.setBounds(0, 0, worldWidth, height);
         this.cameras.main.setBounds(0, 0, worldWidth, height);

         if (this.ground && this.ground.active) {
          this.ground.setPosition(worldWidth / 2, (height - 10) + 20);
           this.ground.setRectangle(worldWidth, 40);
         }
         return;
       }
     }

     // Default (8-layer) resize handling
     // Update camera bounds if background width is set
     const worldWidth = this.backgroundWidth > 0 ? this.backgroundWidth : width;
     this.cameras.main.setBounds(0, 0, worldWidth, height);
     
     // Rescale backgrounds to fit new screen height
     this.bgPhases.forEach((bg, index) => {
         const key = bg.texture.key;
         if (this.textures.exists(key)) {
             const tex = this.textures.get(key);
             const frame = tex.getSourceImage();
             if (frame) {
                 // Scale to fit screen height, width scales proportionally
                 const scale = height / frame.height;
                 bg.setScale(scale);
                 
                 // Update background width if this is the first layer
                 if (index === 0) {
                     this.backgroundWidth = frame.width * scale;
                 }
             }
         }
         // Keep left edge aligned
         bg.y = height / 2;
     });
  }

  private handleObstacleCollision(obstacleBody: any) {
    // @ts-ignore
    const playerVel = new Phaser.Math.Vector2(this.player.body.velocity.x, this.player.body.velocity.y);
    const speed = playerVel.length();

    if (speed > 8) {
        const gameObject = obstacleBody.gameObject as Phaser.GameObjects.Sprite;
        if (gameObject) {
            // Check if it's a transformed (locked) item
            if (gameObject.getData && gameObject.getData('isTransformed')) {
              // Show locked message - can't destroy transformed items
              this.showLockedMessage(gameObject.x, gameObject.y);
              console.log('🔒 Cannot destroy transformed item by collision!');
              return;
            }
            
            // Damage the obstacle (3-stage system)
            this.registerBreak('collision');
            this.damageObstacle(gameObject);
        }
    }
  }

  // --- Damage System (Multi-hit with health bar) ---
  
  private damageObstacle(obstacle: any, showHammer: boolean = false) {
    console.log('🎯 ============ DAMAGE OBSTACLE START ============');
    console.log('🔨 showHammer flag:', showHammer);
    
    // Get current health
    let health = obstacle.getData('health');
    const maxHealth = obstacle.getData('maxHealth');
    
    console.log('Current health:', health, '/', maxHealth);
    
    if (health === undefined || health === null) {
      console.warn('⚠️ Obstacle has no health data!');
      return;
    }
    
    // Safety check: if health is already 0 or below, don't damage again
    if (health <= 0) {
      console.warn('⚠️ Obstacle already destroyed, skipping damage');
      return;
    }

    // Prevent re-damaging workspace gate once transition started
    if (obstacle.getData && obstacle.getData('isWorkspaceGate') && obstacle.getData('gateLocked')) {
      console.warn('🚪 Workspace gate locked (transition in progress), skipping damage');
      return;
    }
    
    console.log(`💥 Damaging obstacle: ${health}/${maxHealth} HP`);
    
    // 🎯 LOCK PLAYER POSITION during attack to prevent being pushed away
    const playerOriginalX = this.player.x;
    const playerOriginalY = this.player.y;
    
    console.log('Player position locked at:', playerOriginalX, playerOriginalY);
    
    // Temporarily reduce player velocity to prevent sliding
    // @ts-ignore
    if (this.player.body) {
      // @ts-ignore
      this.player.setVelocity(0, 0);
    }
    
    // Calculate center Y for hammer animation
    const playerCenterY = this.player.y;
    const obstacleCenterY = obstacle.y - obstacle.displayHeight / 2;
    
    // Reduce health by 1
    health--;
    obstacle.setData('health', health);
    
    // 🔨 HAMMER ANIMATION LOGIC:
    // - If showHammer=true (BREAK button): Show hammer every time
    // - If showHammer=false (jump collision): Only show on final destruction (health <= 0)
    const shouldShowHammer = showHammer || (health <= 0);
    
    if (shouldShowHammer && health > 0) {
      // Show hammer for BREAK button attacks (non-final hits)
      console.log('🔨 Showing hammer for BREAK button attack!');
      this.showHammerSwing(this.player.x, playerCenterY, obstacle.x, obstacleCenterY);
    }
    
    // Health bars are disabled
    
    // Update texture based on damage stage
    const originalTexture = obstacle.getData('originalTexture');
    const healthPercent = health / maxHealth;
    
    // Get ORIGINAL display size (saved when obstacle was created)
    const originalDisplayWidth = obstacle.getData('originalDisplayWidth');
    const originalDisplayHeight = obstacle.getData('originalDisplayHeight');
    
    // Stage 1: Health 6, 5 - original texture (2 hits)
    // Stage 2: Health 4, 3 - damage1 texture (2 hits)
    // Stage 3: Health 2, 1 - damage2 texture (2 hits)
    // Stage 4: Health 0 - destroyed
    
    let textureChanged = false;

    // Workspace gate has its own 4-stage texture progression
    if (obstacle.getData && obstacle.getData('isWorkspaceGate')) {
      const desiredKey =
        health >= 4 ? 'ws_gate_01' :
        health === 3 ? 'ws_gate_02' :
        health === 2 ? 'ws_gate_03' :
        health === 1 ? 'ws_gate_04' :
        'ws_gate_04';

      if (this.textures.exists(desiredKey) && obstacle.texture.key !== desiredKey) {
        obstacle.setTexture(desiredKey);
        textureChanged = true;
        console.log(`🚪 Workspace gate texture → ${desiredKey} (health=${health})`);
      }

      // Trigger transition when reaching gate-04 (health==1)
      if (health === 1 && !this.workspaceTransitionInProgress) {
        obstacle.setData('gateLocked', true);
        this.startWorkspaceGateTransition();
      }
    } else {
      // New objects: 4 stage images stored on obstacle
      const stageKeys = obstacle.getData?.('stageKeys') as string[] | undefined;
      if (stageKeys && stageKeys.length === 4) {
        const desiredKey =
          health >= 4 ? stageKeys[0] :
          health === 3 ? stageKeys[1] :
          health === 2 ? stageKeys[2] :
          health === 1 ? stageKeys[3] :
          stageKeys[3];

        if (this.textures.exists(desiredKey) && obstacle.texture.key !== desiredKey) {
          obstacle.setTexture(desiredKey);
          textureChanged = true;
          obstacle.setScale(this.FIXED_SCALE * this.OBJECTS_SCALE);
        }
      } else {
        // Fallback: legacy 3-stage damage textures
        if (health > 4) {
          console.log(`💚 Stage 1: Normal (${health}/${maxHealth})`);
          if (obstacle.texture.key !== originalTexture) {
              obstacle.setTexture(originalTexture);
              textureChanged = true;
          }
        } else if (health > 2) {
          const dmg1Texture = `${originalTexture}_dmg1`;
          if (this.textures.exists(dmg1Texture)) {
            obstacle.setTexture(dmg1Texture);
            textureChanged = true;
          }
        } else if (health > 0) {
          const dmg2Texture = `${originalTexture}_dmg2`;
          if (this.textures.exists(dmg2Texture)) {
            obstacle.setTexture(dmg2Texture);
            textureChanged = true;
          }
        }
      }
    }
    
      // ALWAYS restore original display size after texture change
      // This ensures all damage stages have the same size
      // if (textureChanged && originalDisplayWidth && originalDisplayHeight) {
      //   obstacle.setDisplaySize(originalDisplayWidth, originalDisplayHeight);
      //   console.log(`📏 Restored original size: ${originalDisplayWidth.toFixed(0)} x ${originalDisplayHeight.toFixed(0)}`);
      // }
    
    // Play hit sound (delayed to sync with hammer hit)
    this.time.delayedCall(200, () => {
      try {
        if (this.cache.audio.exists('break_sound')) {
          const sound = this.sound.add('break_sound', { volume: 0.8 });
          sound.once('complete', () => {
            sound.destroy();
            console.log('🔊 Break sound completed and destroyed');
          });
          sound.play();
          console.log('🔊 Break sound playing...');
        } else {
          console.warn('⚠️ Break sound not in cache');
        }
      } catch (error) {
        console.error('❌ Error playing break sound:', error);
      }
    });
    
    // Health bars are disabled
    
    // Delay shake and effects to sync with hammer impact (200ms)
    this.time.delayedCall(200, () => {
      console.log('💥 Hammer impact at 200ms!');
      
      // Save original position to ensure it's restored
      const originalX = obstacle.x;
      const originalY = obstacle.y;
      
      // 🎯 Restore player position immediately
      this.player.x = playerOriginalX;
      this.player.y = playerOriginalY;
      // @ts-ignore
      if (this.player.body) {
        // @ts-ignore
        this.player.body.position.x = playerOriginalX;
        // @ts-ignore
        this.player.body.position.y = playerOriginalY;
      }
      
      // Shake effect on hit - USE SCALE instead of position to avoid displacement
      this.tweens.add({
        targets: obstacle,
        scaleX: obstacle.scaleX * 1.1,
        scaleY: obstacle.scaleY * 0.9,
        yoyo: true,
        repeat: 2,
        duration: 50,
        ease: 'Power2',
        onComplete: () => {
          // Ensure obstacle returns to exact original position
          obstacle.x = originalX;
          obstacle.y = originalY;
        }
      });
      
      // Rotation shake for visual feedback (doesn't change position)
      this.tweens.add({
        targets: obstacle,
        angle: obstacle.angle + Phaser.Math.Between(-5, 5),
        yoyo: true,
        repeat: 2,
        duration: 50,
        ease: 'Power2'
      });
      
      // Small screen shake
      this.cameras.main.shake(100, 0.005, true);
      
      // Small vibration
      this.triggerVibration(50);
      
      // Small particle burst on hit
      this.createHitEffect(obstacle.x, obstacle.y);
    });
    
    // 🎯 Additional position lock after effects complete
    this.time.delayedCall(350, () => {
      this.player.x = playerOriginalX;
      this.player.y = playerOriginalY;
    });
    
    // Check if destroyed
    if (health <= 0) {
      console.log('💥💥💥 OBSTACLE DESTROYED WITH MASSIVE EXPLOSION! 💥💥💥');
      
      // ✅ Let player pass immediately (do not wait for fade-out tween).
      // Keep visuals for explosion/animation, but remove physics blocking right away.
      this.makeObstaclePassThrough(obstacle);
      
      // 🔨 SHOW HAMMER ANIMATION - Always show on final destruction!
      console.log('🔨 Showing hammer for final destruction!');
      this.showHammerSwing(this.player.x, playerCenterY, obstacle.x, obstacleCenterY);
      
      // Delay explosion to sync with hammer impact (200ms)
      this.time.delayedCall(200, () => {
        // 🎯 Final position lock for player
        this.player.x = playerOriginalX;
        this.player.y = playerOriginalY;
        
        // MASSIVE EXPLOSION - align bottom with obstacle bottom
        // Since obstacle origin is at bottom (0.5, 1), obstacle.y is the bottom position
        this.createMassiveExplosion(obstacle.x, obstacle.y);
        
        // STRONG SCREEN SHAKE - Dramatic camera shake
        this.cameras.main.shake(500, 0.02, true);
        
        // STRONG DEVICE VIBRATION - Haptic feedback
        this.triggerVibration(200);
        
        // Flash effect for impact
        this.cameras.main.flash(200, 255, 150, 0, false);
        
        // Spawn heal effect (star) at center
        this.spawnHealEffect(obstacle.x, obstacleCenterY);
      });
      
      // Remove from nearby set
      this.nearbyObstacles.delete(obstacle);

      // Record destroyed object for final analysis (skip workspace gate)
      try {
        if (!(obstacle.getData && obstacle.getData('isWorkspaceGate'))) {
          const name = String(
            obstacle.getData?.('originalTexture') || obstacle.getData?.('name') || obstacle.texture?.key || 'object'
          );
          this.destroyedObjects.push(name);
        }
      } catch {}
      
      // 🔥 CRITICAL: Remove from obstacles map to prevent re-detection
      const obstacleId = obstacle.getData('id');
      if (obstacleId) {
        this.obstacles.delete(obstacleId);
        console.log(`🗑️ Removed obstacle ${obstacleId} from map`);
      }
      
      // Vanish sound removed as per user request
      
      // Destroy all health bar components immediately
      const healthBarShadow = obstacle.getData('healthBarShadow');
      const healthBarBg = obstacle.getData('healthBarBg');
      const healthBarInner = obstacle.getData('healthBarInner');
      const healthBarFill = obstacle.getData('healthBarFill');
      const healthBarGlow = obstacle.getData('healthBarGlow');
      
      if (healthBarShadow) healthBarShadow.destroy();
      if (healthBarBg) healthBarBg.destroy();
      if (healthBarInner) healthBarInner.destroy();
      if (healthBarFill) healthBarFill.destroy();
      if (healthBarGlow) healthBarGlow.destroy();
      
      // Delay destruction animation to happen after explosion (500ms total)
      this.time.delayedCall(500, () => {
        // Destroy the game object with dramatic effect
        this.tweens.add({
          targets: obstacle,
          alpha: 0,
          scale: 0,
          angle: obstacle.angle + 360,
          duration: 300,
          ease: 'Power2',
          onComplete: () => {
            obstacle.destroy();
          }
        });
      });
      
      // Update score immediately
      this.destructionCount++;
            
      if (this.onScoreUpdate) this.onScoreUpdate(this.destructionCount);
    }
    
    console.log('🎯 ============ DAMAGE OBSTACLE END ============');
  }

  // 🔨 HAMMER SWING ANIMATION - Shows hammer swinging from player to hit obstacle
  private showHammerSwing(playerX: number, playerY: number, targetX: number, targetY: number) {
    // Check if hammer texture exists
    if (!this.textures.exists('hammer')) {
      console.error('❌ Hammer texture not loaded!');
      return;
    }
    
    // Calculate position between player and target
    const hammerX = playerX + (targetX - playerX) * 0.3; // 30% of the way to target
    const hammerY = playerY + (targetY - playerY) * 0.3;
    
    console.log('🔨 Creating hammer at:', hammerX, hammerY);
    
    // Create hammer sprite
    const hammer = this.add.image(hammerX, hammerY, 'hammer');
    
    // Set origin to handle (left side for rotation)
    // Handle is now on the left middle, so origin should be near left edge
    hammer.setOrigin(0.15, 0.5); // Handle at left side (15% from left, middle vertically)
    
    // 🎮 Hammer uses original image size (pre-sized)
    hammer.setScale(this.FIXED_SCALE); // 1.0 = no scaling, use original size
    console.log('🔨 Hammer: original size');
    
    // Set depth to appear above player but below UI
    hammer.setDepth(this.player.depth + 1);
    
    // Calculate angle to face target
    const angleToTarget = Phaser.Math.Angle.Between(hammerX, hammerY, targetX, targetY);
    hammer.setRotation(angleToTarget - Math.PI / 2); // Start position (upright)
    
    // Initial rotation for wind-up
    const startAngle = hammer.rotation - Phaser.Math.DegToRad(30); // Wind back 30 degrees
    const swingAngle = hammer.rotation + Phaser.Math.DegToRad(60); // Swing forward 60 degrees
    
    hammer.setRotation(startAngle);
    hammer.setAlpha(0);
    
    // Animation sequence:
    // 1. Fade in quickly
    this.tweens.add({
      targets: hammer,
      alpha: 1,
      duration: 50,
      ease: 'Power1'
    });
    
    // 2. Swing down (rotate 90 degrees total: -30 to +60)
    this.tweens.add({
      targets: hammer,
      rotation: swingAngle,
      duration: 200,
      ease: 'Power2',
      onComplete: () => {
        // 3. Bounce back slightly
        this.tweens.add({
          targets: hammer,
          rotation: swingAngle - Phaser.Math.DegToRad(10),
          duration: 100,
          ease: 'Power1',
          onComplete: () => {
            // 4. Fade out and destroy
            this.tweens.add({
              targets: hammer,
              alpha: 0,
              duration: 100,
              ease: 'Power1',
              onComplete: () => {
                hammer.destroy();
              }
            });
          }
        });
      }
    });
  }
  
  // Create stylish health bar above obstacle (appears on first hit)
  private createHealthBar(obstacle: any) {
    const barWidth = obstacle.displayWidth * 0.7; // Slightly narrower
    const barHeight = 8; // Slightly taller
    // Since obstacle origin is now at bottom (0.5, 1), offsetY needs to account for full height
    const offsetY = -obstacle.displayHeight - 20;
    
    // Outer glow/shadow (dark with transparency)
    const healthBarShadow = this.add.rectangle(
      obstacle.x,
      obstacle.y + offsetY + 2,
      barWidth + 4,
      barHeight + 4,
      0x000000,
      0.4
    );
    healthBarShadow.setDepth(obstacle.depth + 1);
    
    // Background (dark with slight gradient effect using border)
    const healthBarBg = this.add.rectangle(
      obstacle.x,
      obstacle.y + offsetY,
      barWidth,
      barHeight,
      0x1a1a2e, // Dark blue-gray
      0.8
    );
    healthBarBg.setDepth(obstacle.depth + 2);
    healthBarBg.setStrokeStyle(1, 0x444466, 0.6); // Subtle border
    
    // Inner dark background (for empty portion)
    const healthBarInner = this.add.rectangle(
      obstacle.x,
      obstacle.y + offsetY,
      barWidth - 2,
      barHeight - 2,
      0x0a0a15,
      1
    );
    healthBarInner.setDepth(obstacle.depth + 3);
    
    // Foreground (gradient-like health fill with glow)
    const healthBarFill = this.add.rectangle(
      obstacle.x - (barWidth - 2) / 2,
      obstacle.y + offsetY,
      barWidth - 2,
      barHeight - 2,
      0x00ff88 // Bright cyan-green
    );
    healthBarFill.setOrigin(0, 0.5);
    healthBarFill.setDepth(obstacle.depth + 4);
    
    // Glow effect on health bar
    const healthBarGlow = this.add.rectangle(
      obstacle.x - (barWidth - 2) / 2,
      obstacle.y + offsetY,
      barWidth - 2,
      barHeight - 2,
      0xffffff,
      0.3
    );
    healthBarGlow.setOrigin(0, 0.5);
    healthBarGlow.setDepth(obstacle.depth + 5);
    healthBarGlow.setBlendMode(Phaser.BlendModes.ADD);
    
    // Pulse animation for glow
    this.tweens.add({
      targets: healthBarGlow,
      alpha: 0.1,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Store references
    obstacle.setData('healthBarShadow', healthBarShadow);
    obstacle.setData('healthBarBg', healthBarBg);
    obstacle.setData('healthBarInner', healthBarInner);
    obstacle.setData('healthBarFill', healthBarFill);
    obstacle.setData('healthBarGlow', healthBarGlow);
    obstacle.setData('healthBarOffsetY', offsetY);
    obstacle.setData('healthBarWidth', barWidth - 2);
    
    // Appear animation
    healthBarShadow.setAlpha(0);
    healthBarBg.setAlpha(0);
    healthBarInner.setAlpha(0);
    healthBarFill.setAlpha(0);
    healthBarGlow.setAlpha(0);
    
    this.tweens.add({
      targets: [healthBarShadow, healthBarBg, healthBarInner, healthBarFill, healthBarGlow],
      alpha: { from: 0, to: 1 },
      duration: 200,
      ease: 'Power2'
    });
  }
  
  // Update health bar to match current health
  private updateHealthBar(obstacle: any) {
    const health = obstacle.getData('health');
    const maxHealth = obstacle.getData('maxHealth');
    const healthBarShadow = obstacle.getData('healthBarShadow');
    const healthBarBg = obstacle.getData('healthBarBg');
    const healthBarInner = obstacle.getData('healthBarInner');
    const healthBarFill = obstacle.getData('healthBarFill');
    const healthBarGlow = obstacle.getData('healthBarGlow');
    const healthBarWidth = obstacle.getData('healthBarWidth');
    const offsetY = obstacle.getData('healthBarOffsetY');
    
    if (!healthBarFill || !healthBarBg) return;
    
    // Update position for all components (in case obstacle moved)
    const centerX = obstacle.x;
    const centerY = obstacle.y + offsetY;
    
    if (healthBarShadow) healthBarShadow.setPosition(centerX, centerY + 2);
    if (healthBarBg) healthBarBg.setPosition(centerX, centerY);
    if (healthBarInner) healthBarInner.setPosition(centerX, centerY);
    healthBarFill.setPosition(centerX - healthBarWidth / 2, centerY);
    if (healthBarGlow) healthBarGlow.setPosition(centerX - healthBarWidth / 2, centerY);
    
    // Update width based on health percentage
    const healthPercent = health / maxHealth;
    const newWidth = healthBarWidth * healthPercent;
    healthBarFill.width = newWidth;
    if (healthBarGlow) healthBarGlow.width = newWidth;
    
    // Update color based on health with smooth gradients
    let fillColor = 0x00ff88; // Bright cyan-green (full health)
    let glowIntensity = 0.3;
    
    if (healthPercent <= 0.25) {
      fillColor = 0xff3366; // Bright red (critical)
      glowIntensity = 0.5; // More intense glow when critical
    } else if (healthPercent <= 0.5) {
      fillColor = 0xff6644; // Orange-red (low health)
      glowIntensity = 0.4;
    } else if (healthPercent <= 0.75) {
      fillColor = 0xffcc44; // Yellow (medium health)
      glowIntensity = 0.35;
    }
    
    healthBarFill.setFillStyle(fillColor);
    
    // Pulse effect when health is critical
    if (healthPercent <= 0.25 && healthBarGlow) {
      this.tweens.killTweensOf(healthBarGlow);
      this.tweens.add({
        targets: healthBarGlow,
        alpha: { from: glowIntensity, to: 0.1 },
        duration: 400,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }
  
  // Small hit effect (particles on impact)
  private createHitEffect(x: number, y: number) {
    const hitParticles = this.add.particles(x, y, 'particle', {
      speed: { min: 100, max: 300 },
        angle: { min: 0, max: 360 },
        scale: { start: 1, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 400,
      gravityY: 200,
      quantity: 15,
      blendMode: 'ADD',
      tint: [0xffff00, 0xffaa00],
      emitting: false
    });
    hitParticles.explode(15, x, y);
    
    // 🔧 FIX: Destroy after lifespan to prevent memory leak
    this.time.delayedCall(600, () => hitParticles.destroy());
  }
  
  // MASSIVE EXPLOSION with fire and smoke particles
  private createMassiveExplosion(x: number, y: number) {
    try {
        console.log('💥 Starting explosion at:', x, y);
        
        // 🎵 BOOM SOUND with proper cleanup
        if (this.cache.audio.exists('boom_sound')) {
          try {
            const boomSound = this.sound.add('boom_sound', { volume: 0.8 });
            // 🔧 FIX: Destroy sound after playing to prevent memory leak
            boomSound.once('complete', () => {
              boomSound.destroy();
              console.log('🔊 Boom sound completed and destroyed');
            });
            boomSound.play();
            console.log('✅ Boom sound playing...');
          } catch (error) {
            console.warn('⚠️ Failed to play boom sound:', error);
          }
        } else {
          console.warn('⚠️ Boom sound not found in cache');
        }
        
        // 💥 BOOM IMAGE - Using original explosion graphic (sound disabled)
        if (this.textures.exists('boom')) {
          try {
            console.log('✅ Boom texture exists, creating image...');
            const boom = this.add.image(x, y, 'boom');
            boom.setOrigin(0.5, 1); // Set origin to bottom-center so y represents bottom position
            boom.setDepth(100); // Above everything
            boom.setAlpha(1); // Start visible
            boom.setScale(0.5); // Start at 0.5x size (缩小到50%)
            boom.setBlendMode(Phaser.BlendModes.ADD);
            console.log('✅ Boom image created successfully');
            
            // Boom animation: scale from 0.5 to 1.0, then fade out
            this.tweens.add({
              targets: boom,
              scale: { from: 0.5, to: 1.0 }, // 0.5x size to 1x size
              angle: { from: -5, to: 5 }, // Slight rotation
              duration: 400, // Grow for 400ms
              ease: 'Power2',
              onComplete: () => {
                // Fade out while continuing to grow slightly
                this.tweens.add({
                  targets: boom,
                  alpha: { from: 1, to: 0 },
                  scale: { from: 1.0, to: 1.1 }, // Continue growing slightly
                  duration: 300,
                  ease: 'Power2',
                  onComplete: () => {
                    try {
                      boom.destroy();
                    } catch (e) {
                      console.warn('⚠️ Error destroying boom:', e);
                    }
                  }
                });
              }
            });
          } catch (boomError) {
            console.error('❌ Error creating boom image:', boomError);
          }
        } else {
          console.warn('⚠️ Boom texture not found! Creating fallback...');
          // Simple fallback flash effect if image fails
          try {
            const flash = this.add.graphics();
            flash.fillStyle(0xffaa00, 1);
            flash.fillCircle(x, y - 40, 50);
            flash.setDepth(100);
            this.tweens.add({
              targets: flash,
              alpha: 0,
              scale: 2,
              duration: 500,
              onComplete: () => flash.destroy()
            });
          } catch (e) {
            console.warn('⚠️ Fallback flash also failed:', e);
          }
        }
        
        // Safety check for particle texture
        if (!this.textures.exists('particle')) {
            console.warn('⚠️ Particle texture missing, skipping particle effects');
            try {
              this.createShockwaveRing(x, y); // Still try to show shockwave
            } catch (e) {
              console.warn('⚠️ Error creating shockwave:', e);
            }
            return;
        }

        // 🔥 FIRE PARTICLES - Orange/Red/Yellow flames shooting out
        try {
          const fireParticles = this.add.particles(x, y, 'particle', {
          speed: { min: 200, max: 600 },
          angle: { min: 0, max: 360 },
          scale: { start: 3, end: 0 },
          alpha: { start: 1, end: 0 },
          lifespan: 800,
          gravityY: -100, // Fire rises
          quantity: 50,
          blendMode: 'ADD',
          tint: [0xff5500, 0xff8800, 0xffaa00, 0xffff00], // Orange to yellow gradient
          emitting: false
        });
          fireParticles.explode(50, x, y);
          // 🔧 FIX: Destroy after lifespan to prevent memory leak
          this.time.delayedCall(1000, () => fireParticles.destroy());
        } catch (fireError) {
          console.warn('⚠️ Error creating fire particles:', fireError);
        }
        
        // 💨 SMOKE PARTICLES - Dark gray/black smoke expanding
        try {
          const smokeParticles = this.add.particles(x, y, 'particle', {
          speed: { min: 50, max: 300 },
          angle: { min: 0, max: 360 },
          scale: { start: 2, end: 6 }, // Expands as it dissipates
          alpha: { start: 0.8, end: 0 },
          lifespan: 1500,
          gravityY: -50, // Smoke rises slowly
          quantity: 30,
          blendMode: 'NORMAL',
          tint: [0x333333, 0x555555, 0x666666], // Dark gray smoke
          emitting: false
        });
          smokeParticles.explode(30, x, y);
          // 🔧 FIX: Destroy after lifespan to prevent memory leak
          this.time.delayedCall(1700, () => smokeParticles.destroy());
        } catch (smokeError) {
          console.warn('⚠️ Error creating smoke particles:', smokeError);
        }
        
        // 💥 SHOCKWAVE PARTICLES - Bright white/yellow burst
        try {
          const shockwaveParticles = this.add.particles(x, y, 'particle', {
          speed: { min: 400, max: 800 },
          angle: { min: 0, max: 360 },
          scale: { start: 2, end: 0.5 },
          alpha: { start: 1, end: 0 },
          lifespan: 400,
          gravityY: 0,
          quantity: 40,
          blendMode: 'ADD',
          tint: [0xffffff, 0xffffaa, 0xffff88],
          emitting: false
        });
          shockwaveParticles.explode(40, x, y);
          // 🔧 FIX: Destroy after lifespan to prevent memory leak
          this.time.delayedCall(600, () => shockwaveParticles.destroy());
        } catch (shockwaveError) {
          console.warn('⚠️ Error creating shockwave particles:', shockwaveError);
        }
        
        // ✨ SPARKS - Small bright particles flying everywhere
        try {
          const sparkParticles = this.add.particles(x, y, 'particle', {
          speed: { min: 300, max: 700 },
          angle: { min: 0, max: 360 },
          scale: { start: 0.8, end: 0 },
          alpha: { start: 1, end: 0 },
          lifespan: 600,
          gravityY: 400, // Sparks fall
          quantity: 60,
          blendMode: 'ADD',
          tint: [0xffff00, 0xffaa00, 0xff5500],
          emitting: false
        });
          sparkParticles.explode(60, x, y);
          // 🔧 FIX: Destroy after lifespan to prevent memory leak
          this.time.delayedCall(800, () => sparkParticles.destroy());
        } catch (sparkError) {
          console.warn('⚠️ Error creating spark particles:', sparkError);
        }
        
        // Create radial shockwave ring effect
        try {
          this.createShockwaveRing(x, y);
        } catch (ringError) {
          console.warn('⚠️ Error creating shockwave ring:', ringError);
        }
        
        console.log('✅ Explosion effects completed');
        
    } catch (error) {
        console.error('❌ Error in createMassiveExplosion:', error);
    }
  }
  
  // Visual shockwave ring expanding from explosion
  private createShockwaveRing(x: number, y: number) {
    const ring = this.add.circle(x, y, 20, 0xffaa00, 0.8);
    ring.setBlendMode(Phaser.BlendModes.ADD);
    ring.setDepth(100);
    
    this.tweens.add({
      targets: ring,
      radius: 200,
      alpha: 0,
      duration: 500,
      ease: 'Power2',
      onComplete: () => ring.destroy()
    });
  }
  
  // Device vibration feedback (works on mobile/some browsers)
  private triggerVibration(duration: number = 200) {
    if ('vibrate' in navigator) {
      // Pattern: vibrate for duration ms
      navigator.vibrate(duration);
      console.log(`📳 Device vibration triggered: ${duration}ms`);
    } else {
      console.log('📳 Vibration API not supported on this device');
    }
  }

  private spawnHealEffect(x: number, y: number) {
      // Note: reward sound removed (file doesn't exist)
      
      // ✨ 自动获得星星（不再生成可收集实体）
      this.starCount++;
      if (this.onStarCollected) {
        this.onStarCollected(this.starCount);
      }
      
      // Visual feedback: Floating text instead of collectable star
      const text = this.add.text(x, y - 50, '+1 ⭐', {
          fontSize: `${Math.max(20, 30 * this.FIXED_SCALE)}px`, // 根据缩放调整字体大小
          fontFamily: 'Arial',
          color: '#ffff00',
          stroke: '#000000',
          strokeThickness: 4,
          align: 'center'
      });
      text.setOrigin(0.5);
      text.setDepth(100);
      
      // Floating animation
      this.tweens.add({
          targets: text,
          y: y - 150,
          scale: 1.5,
          alpha: 0,
          duration: 1500,
          ease: 'Power2',
          onComplete: () => text.destroy()
      });

      // Sparkle burst effect
      const sparkles = this.add.particles(x, y, 'particle', {
          speed: { min: 100, max: 200 },
          angle: { min: 0, max: 360 },
          scale: { start: 1.0, end: 0 },
          lifespan: 800,
          gravityY: -100,
          quantity: 20,
          blendMode: 'ADD',
          tint: [0xffff00, 0xffaa00]
      });
      this.time.delayedCall(1000, () => sparkles.destroy());
  }

  private addDashEffect() {
     const particle = this.add.particles(0, 0, 'particle', {
         follow: this.player,
         scale: { start: 0.5, end: 0 },
         lifespan: 200,
         blendMode: 'ADD',
         frequency: 20
     });
     this.time.delayedCall(300, () => particle.destroy());
  }

  private generateLevel(width: number, height: number) {
    // Use background width or fallback to screen width
    const worldWidth = this.backgroundWidth > 0 ? this.backgroundWidth : width;
    
    // 1. Ground - extends across entire background
    // Lower ground to align with new object positions
    // Create a physical rectangle for the ground to ensure it spans the full width
    // 🔧 FIX: Lower ground significantly to let player sink properly (Top edge at height + 40)
    // Recreate ground (also used by workspace stage transitions)
    this.createGroundForWorld(worldWidth, height);
    // ground.setPipeline('Light2D'); // DISABLED to prevent WebGL crashes

    // Workspace: objects are generated from assets/objects, not from player character textures.
    if (this.usingWorkspaceScene) {
      this.spawnObjectsForCurrentStage(width, height);
      return;
    }

    // 2. All available items (matching select folder characters)
    // These are the same items users can choose as player characters
    const allItems = [
      'bad_toy',    // damaged toy
      'bed',        // bed
      'football1',  // football (note: obstacle uses 'football' key, player uses 'football1')
      'goods',      // boxes/goods
      'studydesk',  // study desk
      'chair'       // chair
    ];
    
    // Exclude the player's character from obstacles
    const playerCharacter = this.levelConfig.playerCharacter || 'chair';
    
    // Map player character to obstacle key (football1 → football for obstacles)
    const characterToObstacleMap: Record<string, string> = {
      'bad_toy': 'bad_toy',
      'bed': 'bed',
      'football1': 'football', // Player is football1, obstacle is football
      'goods': 'goods',
      'studydesk': 'studydesk',
      'chair': 'chair'
    };
    
    const badItems = allItems
      .filter(item => item !== playerCharacter)
      .map(item => characterToObstacleMap[item] || item);
    
    console.log(`🎯 Player character: ${playerCharacter}`);
    console.log(`🎯 Available obstacles:`, badItems);

    // 3. Obstacles - for workspace indoor, keep obstacles within indoor image area
    const gameAreaWidth =
      this.usingWorkspaceScene && this.workspaceStage === 'indoor' && this.wsIndoorWidth > 0
        ? this.wsIndoorWidth
        : worldWidth;
    
    // 🔧 FIX: Dynamic obstacle count based on map length (one every ~300px)
    // This ensures consistent density regardless of image length
    const numObstacles = Math.max(5, Math.floor(gameAreaWidth / 300)); 
    
    // Set total obstacles for progress tracking
    this.totalLevelObstacles = numObstacles;
    console.log(`🎯 Total obstacles for this level: ${this.totalLevelObstacles}`);
    
    console.log(`📏 Background width: ${this.backgroundWidth.toFixed(0)}px`);
    console.log(`📏 World width: ${worldWidth.toFixed(0)}px`);
    console.log(`📏 Screen width: ${width.toFixed(0)}px`);
    console.log(`📏 Game area width: ${gameAreaWidth.toFixed(0)}px (${(gameAreaWidth / width).toFixed(1)}x screens)`);
    
    // 🚫 RULE: Keep obstacles away from player's starting position
    const playerStartX = this.player.x; // Get player's actual starting position
    const safeZoneRadius = width * 0.35; // Safe zone: 35% of screen width around player start
    const obstacleZoneStart = playerStartX + safeZoneRadius; // Start AFTER the safe zone
    const obstacleZoneEnd = gameAreaWidth - (width * 0.15); // End near the end of background (leave 15% margin)
    
    // Track used positions to avoid overlap
    // 🔧 CHANGE: Add 'type' to tracking to prevent duplicate items nearby
    const usedPositions: { x: number, y: number, width: number, type: string }[] = [];
    // 🎮 iPhone 14 Pro Max 障碍物间距优化
    const minDistance = 180; // 障碍物之间最小距离 - 适中的间隔
    // 🎯 Unified ground level for all objects (aligned to background ground)
    // 🔧 FIX: Raise obstacles up by 40px to prevent sinking
    const unifiedGroundY = height - 10; 
    
    console.log(`🎯 Player starts at: ${playerStartX.toFixed(0)}px`);
    console.log(`🚫 Safe zone around player: ${playerStartX.toFixed(0)}px ± ${safeZoneRadius.toFixed(0)}px`);
    console.log(`🎯 Obstacle zone: ${obstacleZoneStart.toFixed(0)} to ${obstacleZoneEnd.toFixed(0)} (game area: ${gameAreaWidth.toFixed(0)}px)`);
    
    // Track the last generated type to ensure variety
    let lastObstacleType: string | null = null;
    
    for (let i = 0; i < numObstacles; i++) {
        let x = 0;
        let isValidPosition = false;
        let attempts = 0;
        const maxAttempts = 50; // Prevent infinite loop
        
        // Try to find a non-overlapping position
        while (!isValidPosition && attempts < maxAttempts) {
            x = Phaser.Math.Between(obstacleZoneStart, obstacleZoneEnd);
            
            isValidPosition = true;
            
            // RULE 1: Check distance from player's starting position
            const distanceFromPlayer = Math.abs(x - playerStartX);
            if (distanceFromPlayer < safeZoneRadius) {
                isValidPosition = false;
                attempts++;
                continue;
            }
            
            // RULE 2: Check if this position is too close to existing obstacles
            for (const pos of usedPositions) {
                const distance = Math.abs(x - pos.x);
                if (distance < minDistance) {
                    isValidPosition = false;
                    break;
                }
            }
            
            attempts++;
        }
        
        // If we couldn't find a valid position after max attempts, skip this obstacle
        if (!isValidPosition) {
            console.log('⚠️ Could not find valid position for obstacle', i);
            continue;
        }
        
        // Randomly select a bad item
        // 🔧 NEW LOGIC: Force adjacent obstacles to be different types
        let availableTypes = badItems;
        
        // Filter out the last used type if possible
        if (lastObstacleType && badItems.length > 1) {
            availableTypes = badItems.filter(type => type !== lastObstacleType);
        }
        
        const randomItem = Phaser.Math.RND.pick(availableTypes);
        lastObstacleType = randomItem; // Update last type
        
        // 🎯 Create static obstacle with bottom aligned to ground
        const obstacle = this.matter.add.image(x, 0, randomItem, undefined, {
             label: 'destructible',
             isStatic: true // Static object - won't move or be affected by gravity
        });
        
        // Set origin to bottom-center so Y coordinate represents the bottom of the image
        obstacle.setOrigin(0.5, 1);
        obstacle.y = unifiedGroundY; // Bottom of obstacle at ground level
        
        // Record this position AND type
        usedPositions.push({ x, y: unifiedGroundY, width: 100, type: randomItem });
        
        // Assign unique ID
        const obstacleId = `obstacle_${i}_${Date.now()}`;
        obstacle.setData('id', obstacleId);
        obstacle.setData('originalTexture', randomItem);
        obstacle.setData('isTransformed', false);
        
        // Set health based on obstacle size (larger = more health)
        // NEW: Adjusted for 3-stage damage system (original -> dmg1 -> dmg2 -> destroyed)
        const obstacleSize = obstacle.displayWidth * obstacle.displayHeight;
        const screenSize = width * height;
        const sizeRatio = obstacleSize / screenSize;
        
    // Health calculation: Fixed 6 hits for all items
    // 2 hits: normal -> 2 hits: dmg1 -> 2 hits: dmg2 -> destroyed
    let maxHealth = 6;
    
    obstacle.setData('health', maxHealth);
    obstacle.setData('maxHealth', maxHealth);
        obstacle.setData('healthBarCreated', false); // Track if health bar has been created
        
        console.log(`🎯 Obstacle ${i}: size ratio ${(sizeRatio*100).toFixed(2)}%, health: ${maxHealth}`);
        
        // Set depth to ensure obstacles are clickable (above background, below UI)
        obstacle.setDepth(5);
        
        // Make obstacle interactive
        obstacle.setInteractive({ useHandCursor: true });
        obstacle.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            console.log('🖱️ Obstacle clicked!', obstacleId, 'at', pointer.x, pointer.y);
            // Ignore clicks in UI button areas (bottom 150px on left and right)
            const screenHeight = this.scale.height;
            const screenWidth = this.scale.width;
            const clickY = pointer.y;
            const clickX = pointer.x;
            
            // Check if click is in bottom UI area
            const isInBottomUIArea = clickY > screenHeight - 150;
            const isInLeftButtons = clickX < 200; // Left movement buttons
            const isInRightButtons = clickX > screenWidth - 200; // Right action buttons
            
            if (isInBottomUIArea && (isInLeftButtons || isInRightButtons)) {
                return; // Ignore clicks on UI buttons
            }
            
            // Check if player has enough stars to transform
            console.log('⭐ Current star count:', this.starCount);
            if (this.starCount < 3) {
                console.log('⚠️ Not enough stars! Need 3, have', this.starCount);
                // Show notification that more stars are needed
                // Since origin is now at bottom, pass top Y position
                const obstacleTopY = obstacle.y - obstacle.displayHeight;
                this.showStarRequirement(obstacle.x, obstacleTopY);
                return;
            }
            
            // Allow transformation of both bad items and already-transformed items
            console.log('✅ Enough stars! Calling onObstacleClick...');
            if (this.onObstacleClick) {
                const badItemName = obstacle.getData('originalTexture') || randomItem;
                console.log('🎯 Triggering transformation dialog for:', badItemName);
                this.onObstacleClick(obstacleId, badItemName);
            } else {
                console.error('❌ onObstacleClick callback not set!');
            }
        });
        
        // 🎮 Use original image size (images are pre-sized for 930x430)
        obstacle.setScale(this.FIXED_SCALE); // 1.0 = no scaling
        
        // Safety check: if image is too large, scale down
        const maxSafeHeight = height * 0.6; // Max 60% of screen height (430 * 0.6 = 258px)
        if (obstacle.displayHeight > maxSafeHeight) {
            const additionalScale = maxSafeHeight / obstacle.displayHeight;
            obstacle.setScale(additionalScale);
        }
        
        // 🎯 Y position already set during creation (bottom aligned to ground)
        
        // Store original display size for texture changes
        obstacle.setData('originalDisplayWidth', obstacle.displayWidth);
        obstacle.setData('originalDisplayHeight', obstacle.displayHeight);
        console.log(`📐 Original size: ${obstacle.displayWidth.toFixed(0)} x ${obstacle.displayHeight.toFixed(0)}`);
        
        // obstacle.setPipeline('Light2D'); // DISABLED to prevent WebGL crashes
        
        // Track obstacle
        this.obstacles.set(obstacleId, obstacle);
    }
  }

  private generateGenericTextures() {
    const graphics = this.make.graphics({ x: 0, y: 0 });

    // 1. Ground
    graphics.fillStyle(0x111111);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture('ground', 32, 32);
    graphics.clear();

    // 2. Particle
    graphics.fillStyle(0xffaa88);
    graphics.fillCircle(4, 4, 4);
    graphics.generateTexture('particle', 8, 8);
    graphics.clear();
  }

  // 🧪 Debug UI Panel for testing background transitions
  private createDebugPanel() {
    const { width, height } = this.scale;
    
    // Create container for debug panel (smaller, better positioned)
    this.debugPanel = this.add.container(width - 110, 90);
    this.debugPanel.setDepth(1000);
    this.debugPanel.setScrollFactor(0); // Fixed to camera
    
    // Background panel (smaller size)
    const panelBg = this.add.rectangle(0, 0, 200, 170, 0x000000, 0.85);
    panelBg.setStrokeStyle(1, 0x00ff00, 0.8);
    
    // Title (smaller font)
    const title = this.add.text(0, -70, '🧪 DEBUG', {
      fontSize: '12px',
      fontFamily: 'Arial',
      color: '#00ff00',
      fontStyle: 'bold'
    });
    title.setOrigin(0.5);
    
    // Debug text (smaller font, more compact)
    this.debugText = this.add.text(0, -30, '', {
      fontSize: '10px',
      fontFamily: 'Courier',
      color: '#ffffff',
      align: 'center',
      lineSpacing: -2
    });
    this.debugText.setOrigin(0.5);
    
    // Buttons (more compact)
    const buttonY = 50;
    const buttonSpacing = 28;
    
    // Destroy 1 button
    const destroyBtn = this.createDebugButton(0, buttonY - buttonSpacing, '💥 Destroy', () => {
      const firstObstacle = Array.from(this.obstacles.values())[0];
      if (firstObstacle && !firstObstacle.getData('isTransformed')) {
        firstObstacle.setData('health', 0);
        this.damageObstacle(firstObstacle);
      }
    });
    
    // Transform 1 button  
    const transformBtn = this.createDebugButton(0, buttonY, '✨ Transform', () => {
      const firstObstacle = Array.from(this.obstacles.values()).find(obs => !obs.getData('isTransformed'));
      if (firstObstacle) {
        // Force transform without star requirement
        firstObstacle.setData('isTransformed', true);
        this.updateLightingAndBackground();
      }
    });
    
    // Reset button
    const resetBtn = this.createDebugButton(0, buttonY + buttonSpacing, '🔄 Reset', () => {
      this.scene.restart();
    });
    
    // Add all to container
    this.debugPanel.add([panelBg, title, this.debugText, destroyBtn, transformBtn, resetBtn]);
  }
  
  private createDebugButton(x: number, y: number, text: string, callback: () => void): Phaser.GameObjects.Container {
    const btn = this.add.container(x, y);
    
    // Smaller button size
    const bg = this.add.rectangle(0, 0, 180, 22, 0x333333, 1);
    bg.setStrokeStyle(1, 0x00ff00, 0.8);
    bg.setInteractive({ useHandCursor: true });
    
    const label = this.add.text(0, 0, text, {
      fontSize: '11px',
      fontFamily: 'Arial',
      color: '#ffffff'
    });
    label.setOrigin(0.5);
    
    btn.add([bg, label]);
    
    // Hover effect
    bg.on('pointerover', () => {
      bg.setFillStyle(0x555555);
    });
    bg.on('pointerout', () => {
      bg.setFillStyle(0x333333);
    });
    bg.on('pointerdown', () => {
      bg.setFillStyle(0x00ff00);
      callback();
      this.time.delayedCall(100, () => bg.setFillStyle(0x333333));
    });
    
    return btn;
  }
  
  private updateDebugPanel() {
    if (!this.debugText) return;
    
    // Count items
    let totalItems = 0;
    let destroyedItems = 0;
    let transformedItems = 0;
    
    this.obstacles.forEach((obstacle) => {
      totalItems++;
      const health = obstacle.getData('health');
      const isTransformed = obstacle.getData('isTransformed');
      
      if (health !== undefined && health <= 0) {
        destroyedItems++;
      } else if (isTransformed) {
        transformedItems++;
      }
    });
    
    const processedItems = destroyedItems + transformedItems;
    const progress = totalItems > 0 ? (processedItems / totalItems) : 0;
    const progressPercent = Math.floor(progress * 100);
    
    // Update text (more compact format)
    const debugInfo = [
      `Items: ${processedItems}/${totalItems}`,
      `💥${destroyedItems} ✨${transformedItems}`,
      `Progress: ${progressPercent}%`,
      `Stage: ${Math.floor(progress * 7) + 1}/8`
    ].join('\n');
    
    this.debugText.setText(debugInfo);
  }

  // Clean up when scene is shut down
  shutdown() {
    console.log('🔧 Shutting down scene - cleaning up all resources...');
    
    // 🔧 CRITICAL: Remove scale resize listener to prevent Framebuffer errors
    if (this.scale) {
      this.scale.off('resize', this.handleResize, this);
      console.log('✅ Scale resize listener removed');
    }
    
    // 🔧 Remove collision listeners
    if (this.matter && this.matter.world) {
      this.matter.world.off('collisionstart');
      console.log('✅ Collision listeners removed');
    }
    
    // Clear space key listeners
    if (this.spaceKey) {
      this.spaceKey.off('down', this.destroyNearbyObstacle, this);
    }

    // Clear break key listeners
    if (this.breakKey) {
      this.breakKey.off('down');
    }

    // Close sensor WS
    if (this.sensorWs) {
      try {
        this.sensorWs.onopen = null;
        this.sensorWs.onclose = null;
        this.sensorWs.onerror = null;
        this.sensorWs.onmessage = null;
        this.sensorWs.close();
      } catch {}
      this.sensorWs = undefined;
    }
    
      // Clear collections
      this.nearbyObstacles.clear();
      this.obstacles.clear();
      this.stars.clear();
      
      // Destroy debug panel
      if (this.debugPanel) {
        this.debugPanel.destroy();
        this.debugPanel = undefined;
        this.debugText = undefined;
      }
    
    // 🔧 FIX: Clear ALL pending time events to prevent accessing destroyed WebGL resources
    // This is critical to prevent Framebuffer errors when scene restarts
    if (this.time) {
      this.time.removeAllEvents();
      console.log('✅ All time events cleared');
    }
    
    // Stop all sounds
    if (this.sound) {
      this.sound.stopAll();
      console.log('✅ All sounds stopped');
    }
    
    // 🔧 Remove all scene event listeners
    this.events.off(Phaser.Scenes.Events.SHUTDOWN);
    this.events.off(Phaser.Scenes.Events.DESTROY);
    console.log('✅ Scene events cleared');
    
    console.log('✅ Scene shutdown complete');
  }
}
