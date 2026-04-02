# 系统架构文档

> PPaper（折翼传说）— 技术架构设计

## 目录

- [一、项目结构](#一项目结构)
- [二、场景管理](#二场景管理)
- [三、物理引擎架构](#三物理引擎架构)
- [四、数据流设计](#四数据流设计)
- [五、资源管线](#五资源管线)
- [六、LLM 集成架构](#六llm-集成架构)
- [七、构建与部署](#七构建与部署)
- [八、性能优化策略](#八性能优化策略)

---

## 一、项目结构

```
ppaper/
├── src/                           # 源代码
│   ├── main.ts                    # 入口：Phaser 游戏配置与启动
│   ├── config/
│   │   ├── game.config.ts         # 游戏常量（画布尺寸、物理参数、版本号）
│   │   └── assets.config.ts       # 资源清单（统一管理资源 key 和路径）
│   │
│   ├── scenes/                    # Phaser 场景（每个场景一个文件）
│   │   ├── BootScene.ts           # 启动：加载共享资源（字体、UI 图集）
│   │   ├── PreloadScene.ts        # 预加载：显示进度条，加载场景专属资源
│   │   ├── MainMenuScene.ts       # 主菜单：标题、按钮
│   │   ├── OverworldScene.ts      # 大世界地图：俯视角城镇
│   │   ├── WorkshopScene.ts       # 折纸工坊：纸飞机参数调节
│   │   ├── CompetitionScene.ts    # 比赛场景：横版物理竞赛
│   │   ├── ResultsScene.ts        # 结算：分数、奖励、下一步选择
│   │   └── CollectionScene.ts     # 图鉴：纸飞机/技能/对手集合
│   │
│   ├── systems/                   # 游戏系统（纯逻辑，与 Phaser 解耦）
│   │   ├── physics/
│   │   │   ├── AerodynamicsEngine.ts   # 主循环：逐帧计算气动力
│   │   │   ├── ForceCalculator.ts      # 纯函数：升力/阻力/重力计算
│   │   │   └── WindSystem.ts           # 风场：生成赛道风力参数
│   │   ├── roguelike/
│   │   │   ├── CourseGenerator.ts      # 赛道生成：障碍/风向/热气流
│   │   │   ├── LootTable.ts            # 掉落表：随机奖励计算
│   │   │   └── SeedManager.ts          # 种子：RNG 种子管理与分享
│   │   ├── progression/
│   │   │   ├── MetaProgression.ts      # 元进度：永久解锁、金折、图鉴
│   │   │   ├── RunState.ts             # 局内状态：本局技能/物品/回合
│   │   │   └── TournamentManager.ts    # 赛事：锦标赛层级与解锁
│   │   ├── ai/
│   │   │   ├── OpponentAI.ts           # AI：对手发射决策
│   │   │   └── DifficultyScaler.ts     # 难度：动态难度参数
│   │   └── llm/
│   │       ├── LLMService.ts           # LLM 抽象层：WebLLM/API 统一接口
│   │       ├── ContentGenerator.ts     # 生成：名称/描述/对话
│   │       └── ContentValidator.ts     # 校验：格式/内容/范围
│   │
│   ├── entities/                  # 游戏实体（Phaser GameObject 子类）
│   │   ├── PaperAirplane.ts       # 纸飞机：精灵 + 物理状态
│   │   ├── Player.ts              # 玩家角色：大世界移动
│   │   ├── NPC.ts                 # NPC 基类：对话/行走
│   │   └── Opponent.ts            # 比赛对手：AI 控制的纸飞机
│   │
│   ├── data/                      # 静态数据定义（JSON 风格的 TS 常量）
│   │   ├── airplanes.ts           # 纸飞机图纸数据（四大类型 + 稀有变体）
│   │   ├── skills.ts              # 技能定义（主动 + 被动）
│   │   ├── items.ts               # 物品定义（消耗品 + 装备）
│   │   ├── opponents.ts           # 对手定义（普通 + Boss）
│   │   ├── tournaments.ts         # 赛事定义（层级 + 规则）
│   │   └── generated/             # LLM 预生成内容（JSON 文件，构建时生成）
│   │       ├── airplane-names.json
│   │       └── skill-flavors.json
│   │
│   ├── ui/                        # UI 组件（依赖 Phaser，场景无关）
│   │   ├── HUD.ts                 # 比赛 HUD：风速、技能按钮、进度
│   │   ├── LaunchControls.ts      # 发射 UI：拖动角度/力度
│   │   ├── InventoryPanel.ts      # 技能/物品管理面板
│   │   ├── DialogBox.ts           # NPC 对话框
│   │   ├── RewardSelector.ts      # 3选1奖励界面
│   │   └── components/            # 基础 UI 组件（Button, Panel, ProgressBar）
│   │
│   ├── utils/                     # 工具函数
│   │   ├── math.ts                # 向量运算、插值、角度转换
│   │   ├── storage.ts             # localStorage 存档/读取
│   │   ├── i18n.ts                # 国际化（中文优先，预留扩展）
│   │   └── logger.ts              # 日志工具（生产环境静默）
│   │
│   └── types/                     # TypeScript 类型定义
│       ├── airplane.types.ts      # 纸飞机相关接口
│       ├── physics.types.ts       # 物理状态接口
│       ├── game.types.ts          # 游戏状态接口
│       ├── skill.types.ts         # 技能/物品接口
│       └── events.types.ts        # Phaser 事件类型
│
├── assets/                        # 游戏资源（不进入 src）
│   ├── sprites/                   # Aseprite 导出的精灵图集
│   │   ├── airplanes/             # 纸飞机精灵（16×16）
│   │   ├── characters/            # 角色精灵（32×48）
│   │   ├── tileset/               # 地图方块（32×32）
│   │   ├── ui/                    # UI 元素图集
│   │   └── effects/               # 特效粒子
│   ├── tilemaps/                  # Tiled 导出的地图（JSON）
│   │   ├── overworld.json         # 大世界地图
│   │   └── courses/               # 比赛赛道模板
│   ├── audio/
│   │   ├── music/                 # 背景音乐（ogg + mp3 双格式）
│   │   └── sfx/                   # 音效
│   └── fonts/                     # 像素字体
│       └── pixel-zh.fnt           # 中文像素字体（Bitmap Font）
│
├── public/
│   └── index.html                 # HTML 入口
│
├── tests/
│   ├── unit/                      # 单元测试（Vitest）
│   │   ├── physics/
│   │   │   ├── ForceCalculator.test.ts
│   │   │   └── AerodynamicsEngine.test.ts
│   │   ├── roguelike/
│   │   │   ├── CourseGenerator.test.ts
│   │   │   └── LootTable.test.ts
│   │   └── utils/
│   │       └── math.test.ts
│   ├── integration/               # 集成测试
│   │   ├── progression.test.ts    # 进度存档/读取
│   │   └── run-state.test.ts      # 局内状态流转
│   └── e2e/                       # E2E 测试（Playwright）
│       ├── main-menu.spec.ts
│       ├── competition-flow.spec.ts
│       └── save-load.spec.ts
│
├── docs/                          # 文档
│   ├── tech-selection.md
│   ├── game-design.md
│   ├── system-architecture.md     # 本文档
│   ├── roadmap.md
│   └── changelog.md
│
├── CLAUDE.md                      # Agent 开发规范
├── README.md                      # 项目说明
├── package.json
├── tsconfig.json                  # TypeScript 配置（strict 模式）
├── vite.config.ts                 # Vite 构建配置
├── vitest.config.ts               # Vitest 测试配置
├── playwright.config.ts           # Playwright E2E 配置
├── .eslintrc.json
└── .prettierrc
```

---

## 二、场景管理

### 2.1 Phaser Scene 生命周期

```
init(data)    → 接收来自上一场景的数据参数
preload()     → 加载本场景专属资源（已在 BootScene 加载共享资源）
create()      → 初始化场景对象、UI、事件监听
update(t, dt) → 每帧更新（物理、动画、输入）
shutdown()    → 场景退出时清理（移除监听器、销毁临时对象）
```

### 2.2 场景切换流程

```
启动
  ↓
BootScene（共享资源预加载）
  ↓
MainMenuScene
  ↓（新游戏/继续）
OverworldScene ←──────────────────────────────┐
  ↓（进入竞技场）                               │
WorkshopScene（选择纸飞机）                    │
  ↓（开始比赛）                                │
CompetitionScene（逐回合）                    │
  ↓（每回合结束）                              │
ResultsScene（奖励选择）                      │
  ↓（比赛结束 / 失败）                         │
OverworldScene ──────────────────────────────┘
  ↓（任意时刻）
CollectionScene（查看图鉴）
```

### 2.3 场景间数据传递

```typescript
// 传递数据到下一场景
this.scene.start('CompetitionScene', {
  airplane: selectedAirplane,    // 只读快照，不传引用
  runState: currentRunState,
  tournamentId: 'district-round-2'
});

// 接收数据
class CompetitionScene extends Phaser.Scene {
  init(data: CompetitionSceneData) {
    this.airplane = data.airplane;
    this.runState = data.runState;
  }
}
```

### 2.4 全局共享数据（Phaser Registry）

```typescript
// 永久数据存放在 Registry（整个游戏生命周期）
this.registry.set('metaProgression', metaState);
this.registry.get<MetaProgression>('metaProgression');

// 局内数据使用 RunState 传递（不用 Registry）
```

---

## 三、物理引擎架构

### 3.1 设计原则

**物理计算与 Phaser 完全解耦：**
- `ForceCalculator`、`AerodynamicsEngine`、`WindSystem` 不导入任何 Phaser 模块
- 接受纯数据对象（`PhysicsState`），返回新状态（不可变模式）
- 可在 Vitest 中直接单元测试，无需模拟 Phaser

### 3.2 核心模块

```
CompetitionScene（Phaser Scene）
    │
    │ 每帧调用 update(dt)
    ▼
AerodynamicsEngine
    │
    ├── 读取 PhysicsState（只读）
    ├── 调用 WindSystem.getWindAtPosition(x, y)
    ├── 调用 ForceCalculator.computeForces(state, wind)
    │       ├── computeLift(velocity, attackAngle, wingArea) → Vector2
    │       ├── computeDrag(velocity, attackAngle, wingArea) → Vector2
    │       └── computeGravity(mass) → Vector2
    ├── 积分：新速度 = 旧速度 + 合力/质量 × dt
    ├── 积分：新位置 = 旧位置 + 新速度 × dt
    └── 返回新 PhysicsState（不可变）
    │
    ▼
CompetitionScene 更新精灵位置
（将物理坐标映射到 Phaser 世界坐标）
```

### 3.3 类型定义

```typescript
// src/types/physics.types.ts
export interface Vector2 {
  readonly x: number;
  readonly y: number;
}

export interface PhysicsState {
  readonly position: Vector2;
  readonly velocity: Vector2;
  readonly pitchAngle: number;      // 机身俯仰角（弧度）
  readonly attackAngle: number;     // 攻角 = pitchAngle - velocityAngle
  readonly mass: number;
  readonly wingArea: number;
  readonly aspectRatio: number;
  readonly cd0: number;             // 零升阻力系数
}

export interface WindState {
  readonly base: Vector2;           // 基础恒定风
  readonly gusts: readonly GustState[];
  readonly thermals: readonly ThermalZone[];
}
```

### 3.4 Matter.js 集成（碰撞）

Matter.js 仅用于碰撞检测（障碍物、地面边界），不参与飞行力学：

```typescript
// CompetitionScene.create()
this.matter.world.setGravity(0, 0);  // 关闭 Matter 重力，由自定义物理处理

// 障碍物为静态刚体
const obstacle = this.matter.add.rectangle(x, y, w, h, { isStatic: true });

// 纸飞机使用 Matter sensor（只检测碰撞，不施加力）
const planeSensor = this.matter.add.rectangle(planeX, planeY, 16, 8, {
  isSensor: true,
  label: 'player-plane'
});

// 碰撞事件
this.matter.world.on('collisionstart', (event) => {
  // 触发耐久损耗，由 RunState 处理
});
```

---

## 四、数据流设计

### 4.1 状态层级

```
MetaState（永久状态，存于 localStorage）
  ├── unlockedAirplanes: AirplaneId[]
  ├── unlockedSkills: SkillId[]
  ├── goldFolds: number
  ├── tournamentProgress: TournamentProgress
  └── achievements: AchievementId[]

RunState（局内状态，局结束后清空）
  ├── currentAirplane: AirplaneSnapshot
  ├── equippedSkills: Skill[]
  ├── inventory: Item[]
  ├── paperCoins: number
  ├── currentRound: number
  └── seed: string

SceneState（场景内临时状态，场景切换时销毁）
  ├── physicsState: PhysicsState
  ├── opponentStates: OpponentState[]
  ├── courseData: CourseData
  └── windState: WindState
```

### 4.2 不可变更新模式

```typescript
// 错误：直接修改状态
runState.paperCoins += 100;

// 正确：返回新状态对象
const newRunState: RunState = {
  ...runState,
  paperCoins: runState.paperCoins + 100
};
```

### 4.3 事件通信

使用 Phaser 内置 EventEmitter，通过类型安全的事件键：

```typescript
// src/types/events.types.ts
export const GameEvents = {
  ROUND_COMPLETE: 'round_complete',
  AIRPLANE_CRASHED: 'airplane_crashed',
  SKILL_ACTIVATED: 'skill_activated',
  REWARD_SELECTED: 'reward_selected',
} as const;

// 发布
this.events.emit(GameEvents.ROUND_COMPLETE, { score: 350, round: 2 });

// 订阅
this.events.on(GameEvents.ROUND_COMPLETE, (data: RoundCompleteData) => {
  this.handleRoundComplete(data);
});
```

### 4.4 存档系统

```typescript
// src/utils/storage.ts
export const saveMetaProgression = (state: MetaState): void => {
  localStorage.setItem('ppaper_meta', JSON.stringify(state));
};

export const loadMetaProgression = (): MetaState | null => {
  const raw = localStorage.getItem('ppaper_meta');
  if (!raw) return null;
  // 版本迁移：检查 schemaVersion 字段
  return migrateIfNeeded(JSON.parse(raw));
};
```

---

## 五、资源管线

### 5.1 Aseprite → Phaser 流程

```bash
# 手动导出（开发时）
# 在 Aseprite 中：File > Export Sprite Sheet
# 设置：Layout=Packed, 勾选 Merge Duplicates
# 输出：assets/sprites/airplanes/dart.png + dart.json

# 批量导出脚本（可选自动化）
aseprite --batch src-art/airplanes/*.aseprite \
  --sheet assets/sprites/airplanes/{basename}.png \
  --data assets/sprites/airplanes/{basename}.json \
  --sheet-type packed
```

```typescript
// BootScene.ts 加载
this.load.aseprite('airplane-dart', 'sprites/airplanes/dart.png', 'sprites/airplanes/dart.json');

// CompetitionScene.ts 使用
this.anims.createFromAseprite('airplane-dart');
const plane = this.add.sprite(x, y, 'airplane-dart');
plane.play('fly');
```

### 5.2 资源清单（集中管理）

```typescript
// src/config/assets.config.ts
export const Assets = {
  Sprites: {
    DART: { key: 'airplane-dart', png: 'sprites/airplanes/dart.png', json: 'sprites/airplanes/dart.json' },
    GLIDER: { key: 'airplane-glider', png: 'sprites/airplanes/glider.png', json: 'sprites/airplanes/glider.json' },
    PLAYER: { key: 'player', png: 'sprites/characters/player.png', json: 'sprites/characters/player.json' },
    UI: { key: 'ui-atlas', png: 'sprites/ui/ui.png', json: 'sprites/ui/ui.json' },
  },
  Tilemaps: {
    OVERWORLD: { key: 'map-overworld', json: 'tilemaps/overworld.json' },
  },
  Audio: {
    MUSIC_MENU: { key: 'music-menu', ogg: 'audio/music/menu.ogg', mp3: 'audio/music/menu.mp3' },
    SFX_THROW: { key: 'sfx-throw', ogg: 'audio/sfx/throw.ogg', mp3: 'audio/sfx/throw.mp3' },
  },
} as const;
```

---

## 六、LLM 集成架构

### 6.1 模块结构

```
LLMService（抽象层）
  ├── isAvailable(): boolean      // 检查 WebGPU 是否可用
  ├── initialize(): Promise<void>  // 下载/初始化模型
  └── generate(prompt, schema): Promise<T>  // 生成内容

ContentGenerator（业务层）
  ├── generateAirplaneName(attributes): Promise<AirplaneName>
  ├── generateSkillFlavor(skill): Promise<SkillFlavor>
  └── generateBossDialogue(boss, context): Promise<Dialogue>

ContentValidator（校验层）
  └── validate<T>(data, schema): ValidationResult<T>
```

### 6.2 降级策略实现

```typescript
// src/systems/llm/ContentGenerator.ts
export async function generateAirplaneName(
  attributes: AirplaneAttributes
): Promise<AirplaneName> {
  // 1. 尝试 WebLLM
  if (llmService.isAvailable()) {
    const result = await llmService.generate(buildPrompt(attributes), NAME_SCHEMA);
    const validated = contentValidator.validate(result, NAME_SCHEMA);
    if (validated.success) return validated.data;
  }
  // 2. 降级：从静态预生成内容中随机选取
  return pickRandom(STATIC_AIRPLANE_NAMES[attributes.type]);
}
```

### 6.3 提示模板

```typescript
// 纸飞机命名提示
const AIRPLANE_NAME_PROMPT = (attrs: AirplaneAttributes) => `
你是一个充满诗意的折纸大师。请为一架纸飞机起一个中文名字。

纸飞机类型：${attrs.type}
主要特点：${attrs.description}
速度：${attrs.speed}/10，升力：${attrs.lift}/10，稳定性：${attrs.stability}/10

请输出 JSON：{ "name": "名字（不超过6字）", "subtitle": "副标题（不超过12字）" }
`;
```

---

## 七、构建与部署

### 7.1 Vite 配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser'],             // ~500KB，缓存复用
          webllm: ['@mlc-ai/web-llm'],   // ~2MB，按需加载
        }
      }
    },
    // 资源哈希命名，防止浏览器缓存旧版本
    assetsDir: 'assets',
    chunkSizeWarningLimit: 1000,
  },
  assetsInclude: ['**/*.json', '**/*.fnt'],
});
```

### 7.2 package.json 脚本

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix",
    "format": "prettier --write src",
    "typecheck": "tsc --noEmit"
  }
}
```

### 7.3 Cloudflare Pages 部署

```yaml
# _redirects（放在 public/ 目录）
/*  /index.html  200
```

```
构建设置：
  框架预设：None（自定义）
  构建命令：npm run build
  输出目录：dist
  环境变量：VITE_LLM_API_KEY=（可选）
```

---

## 八、性能优化策略

### 8.1 对象池（粒子/特效）

```typescript
// 风力粒子使用对象池，避免频繁 GC
const windParticles = this.add.particles(0, 0, 'sfx-particle', {
  speed: { min: 10, max: 30 },
  lifespan: 1500,
  quantity: 2,
  frequency: 100,
});
```

### 8.2 纹理图集

所有 UI 元素合并到单张 `ui.png` 图集，最小化 Draw Call：
- BootScene 一次性加载整个 UI 图集
- 所有按钮/面板/图标从同一纹理渲染

### 8.3 固定物理时间步长

```typescript
// CompetitionScene.update()
const PHYSICS_STEP = 1 / 60; // 固定 60fps 物理步长
this.physicsAccumulator += delta / 1000;
while (this.physicsAccumulator >= PHYSICS_STEP) {
  this.physicsState = this.aerodynamicsEngine.step(this.physicsState, PHYSICS_STEP);
  this.physicsAccumulator -= PHYSICS_STEP;
}
// 渲染插值（流畅视觉）
const alpha = this.physicsAccumulator / PHYSICS_STEP;
this.planeSprite.setPosition(
  lerp(prevState.position.x, this.physicsState.position.x, alpha),
  lerp(prevState.position.y, this.physicsState.position.y, alpha),
);
```

### 8.4 懒加载场景

非关键场景（CollectionScene、WorkshopScene）按需加载：

```typescript
// 需要时才启动，Phaser 自动处理资源加载
this.scene.launch('CollectionScene');  // 后台启动
this.scene.start('WorkshopScene');     // 前台切换
```

### 8.5 移动端适配

```typescript
// src/config/game.config.ts
export const GAME_CONFIG: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,          // 自动选择 WebGL/Canvas
  width: 480,
  height: 854,                // 9:16 竖屏优先
  pixelArt: true,             // 关闭抗锯齿，保持像素感
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'matter',
    matter: { gravity: { y: 0 }, debug: import.meta.env.DEV }
  },
};
```
