# 开发路线图

> PPaper（折翼传说）— 分阶段开发计划
>
> 每个子任务（X.Y）可由单个 Agent 会话独立执行，粒度控制在 5-15 个文件操作以内。

## 阶段概览

| 阶段 | 名称 | 核心交付物 | 子任务数 | 预估工作量 | 状态 |
|------|------|-----------|---------|-----------|------|
| Phase 0 | 项目初始化 | 可运行的 Phaser 骨架 + CI/CD | 8 | ~1-2 天 | ⬜ 待开始 |
| Phase 1 | 核心物理引擎 | 纸飞机可飞行的物理原型 | 10 | ~3-5 天 | ⬜ 待开始 |
| Phase 2 | 纸飞机系统 | 4 种类型纸飞机可选择和飞行 | 6 | ~3-4 天 | ⬜ 待开始 |
| Phase 3 | 比赛系统 | 完整的单局比赛流程 | 10 | ~5-7 天 | ⬜ 待开始 |
| Phase 4 | 大世界地图 | 可探索的城镇 + 场景切换 | 6 | ~5-6 天 | ⬜ 待开始 |
| Phase 5 | 进度与 Roguelike | 完整 Roguelike 循环 | 7 | ~5-7 天 | ⬜ 待开始 |
| Phase 6 | 折纸工坊 | 交互式纸飞机定制 | 4 | ~3-4 天 | ⬜ 待开始 |
| Phase 7 | 美术与音效 | 完整视听体验 | 6 | ~5-7 天 | ⬜ 待开始 |
| Phase 8 | LLM 动态内容 | AI 生成内容已集成 | 5 | ~3-5 天 | ⬜ 待开始 |
| Phase 9 | 测试与优化 | 80%+ 覆盖率 + 性能达标 | 4 | ~3-5 天 | ⬜ 待开始 |
| Phase 10 | 发布 | v1.0.0 公开上线 | 3 | ~1-2 天 | ⬜ 待开始 |
| **总计** | | | **69** | **~37-54 天** | |

---

## Phase 0 — 项目初始化

**交付物：** 可以在浏览器中打开的 Phaser 3 Hello World + 完整 CI/CD 管道。

### 任务列表

#### 0.1 创建 Vite+TS 骨架并安装依赖

- **创建/修改文件：** `package.json`、`tsconfig.json`、`vite.config.ts`、`.gitignore`、`public/index.html`
- **Agent：** —
- **验证：** `npm install` ✓，`npx tsc --noEmit` ✓，`npx vite build` ✓
- **依赖：** 无
- **状态：** [ ]

#### 0.2 配置 Vitest + Playwright 测试框架

- **创建/修改文件：** `vitest.config.ts`（覆盖率阈值 80%）、`playwright.config.ts`（Chrome + Firefox）、`tests/unit/example.test.ts`
- **Agent：** tdd-guide
- **验证：** `npm test` ✓，`npm run test:coverage` 生成报告
- **依赖：** 0.1
- **状态：** [ ]

#### 0.3 配置 ESLint + Prettier

- **创建/修改文件：** `eslint.config.mjs`（no-explicit-any: error，no-console: error）、`.prettierrc`
- **Agent：** —
- **验证：** `npm run lint` ✓，`npm run format` ✓
- **依赖：** 0.1
- **状态：** [ ]

#### 0.4 创建 main.ts + BootScene + logger

- **创建/修改文件：** `src/main.ts`、`src/config/game.config.ts`、`src/scenes/BootScene.ts`（显示 PPaper 标题）、`src/utils/logger.ts`（生产环境静默）
- **Agent：** tdd-guide（为 logger 写测试）
- **验证：** `npm run dev` 浏览器显示 "PPaper"，`npm run typecheck` ✓，`npm run lint` ✓
- **依赖：** 0.1, 0.3
- **状态：** [ ]

#### 0.5 创建类型定义骨架文件

- **创建/修改文件：** `src/types/physics.types.ts`、`src/types/airplane.types.ts`、`src/types/game.types.ts`、`src/types/skill.types.ts`、`src/types/events.types.ts`、`src/config/assets.config.ts`
- **Agent：** —
- **验证：** `npm run typecheck` ✓
- **依赖：** 0.1
- **状态：** [ ]

#### 0.6 配置 GitHub Actions CI

- **创建/修改文件：** `.github/workflows/ci.yml`（on: pull_request，steps: install + lint + typecheck + test）
- **Agent：** —
- **验证：** 推送分支创建 PR，CI 通过
- **依赖：** 0.2, 0.3, 0.4
- **状态：** [ ]

#### 0.7 GitHub Pages 首次部署

- **创建/修改文件：** 修改 `vite.config.ts`（设置 `base: '/ppaper/'` 仓库路径）、`.github/workflows/deploy.yml`（GitHub Actions 自动构建并推送 gh-pages 分支）、`public/404.html`（SPA 路由 fallback）
- **Agent：** —
- **验证：** `npm run build` ✓，推送后 GitHub Pages URL 显示 "PPaper"
- **依赖：** 0.4
- **状态：** [ ]

#### 0.8 实现 math 工具函数 + 文档更新

- **创建/修改文件：** `src/utils/math.ts`（向量加减缩放归一化、lerp、角度转换）、`tests/unit/utils/math.test.ts`（每函数 ≥3 用例）、`docs/roadmap.md`（Phase 0 完成标记）、`docs/changelog.md`
- **Agent：** tdd-guide
- **验证：** `npm test` ✓，math 覆盖率 80%+
- **依赖：** 0.5
- **状态：** [ ]

> **可并行：** 0.2 与 0.3 可并行；0.5 可与 0.2/0.3 并行

### 验收标准

> 打开部署 URL，看到黑色背景上的像素风 "PPaper" 标题。所有 CI 检查通过。

---

## Phase 1 — 核心物理引擎

**交付物：** 可以发射纸飞机并看到真实飞行物理的调试原型。

### 依赖

- Phase 0 完成

### 任务列表

#### 1.1 ForceCalculator — 升力计算

- **创建/修改文件：** `tests/unit/physics/ForceCalculator.test.ts`（升力系数测试：线性区/失速过渡/完全失速，≥10 用例）、`src/systems/physics/ForceCalculator.ts`
- **Agent：** tdd-guide
- **验证：** 测试通过，文件中无 Phaser 导入
- **依赖：** 0.5, 0.8
- **状态：** [ ]

#### 1.2 ForceCalculator — 阻力+重力

- **创建/修改文件：** 追加阻力/重力测试（零速度、极大速度、不同攻角），追加 `computeDragCoefficient`、`computeDrag`、`computeGravity`
- **Agent：** tdd-guide
- **验证：** 全部测试通过，覆盖率 90%+
- **依赖：** 1.1
- **状态：** [ ]

#### 1.3 ForceCalculator — 合力+边界+常量

- **创建/修改文件：** 追加 `computeForces` 集成测试（合力平衡、极端输入、NaN 防护），追加 `computeForces` 函数，`src/systems/physics/constants.ts`（AIR_DENSITY、GRAVITY、MAX_VELOCITY 等物理常量）
- **Agent：** tdd-guide
- **验证：** 覆盖率 90%+
- **依赖：** 1.2
- **状态：** [ ]

#### 1.4 AerodynamicsEngine — 步进积分

- **创建/修改文件：** `tests/unit/physics/AerodynamicsEngine.test.ts`（位置/速度/攻角更新、多步积分精度）、`src/systems/physics/AerodynamicsEngine.ts`（`step` 函数：PhysicsState → 新 PhysicsState，不可变）
- **Agent：** tdd-guide
- **验证：** 测试通过，返回新对象（不可变），无 Phaser 导入
- **依赖：** 1.3
- **状态：** [ ]

#### 1.5 AerodynamicsEngine — 失速+边界行为

- **创建/修改文件：** 追加测试（大攻角失速、地面着陆、超出世界边界、速度钳制），追加边界处理逻辑
- **Agent：** tdd-guide
- **验证：** 覆盖率 90%+
- **依赖：** 1.4
- **状态：** [ ]

#### 1.6 WindSystem — 基础风+阵风+热气流

- **创建/修改文件：** `tests/unit/physics/WindSystem.test.ts`（恒定风、阵风触发/衰减、热气流区域、position 查询）、`src/systems/physics/WindSystem.ts`（`createWindState`、`getWindAtPosition`、`updateGusts` 纯函数）
- **Agent：** tdd-guide
- **验证：** 覆盖率 90%+，无 Phaser 导入
- **依赖：** 0.5, 0.8
- **状态：** [ ]

#### 1.7 CompetitionScene 最小化飞行原型

- **创建/修改文件：** `src/scenes/CompetitionScene.ts`（白色背景、矩形代替精灵、固定时间步长积分循环、渲染插值）、`src/scenes/PreloadScene.ts`
- **Agent：** —
- **验证：** `npm run dev` 矩形飞机在重力下落
- **依赖：** 1.5, 1.6
- **状态：** [ ]

#### 1.8 发射交互（拖动角度/力度）

- **创建/修改文件：** `src/ui/LaunchControls.ts`（拖动检测、角度/力度计算、视觉反馈线）
- **Agent：** —
- **验证：** 拖动鼠标可见调整线，松手发射矩形飞机
- **依赖：** 1.7
- **状态：** [ ]

#### 1.9 物理调试可视化

- **创建/修改文件：** `src/ui/DebugOverlay.ts`（力向量箭头、攻角/速度/高度数值显示）
- **Agent：** —
- **验证：** DEV 模式可见力向量；平飞下降、顺风更远、大攻角失速翻滚
- **依赖：** 1.8
- **状态：** [ ]

#### 1.10 Phase 1 收尾

- **创建/修改文件：** 补充 `tests/unit/physics/` 缺失用例，`docs/roadmap.md`（Phase 1 完成）、`docs/changelog.md`
- **Agent：** code-reviewer
- **验证：** physics 模块覆盖率 90%+，`npm test` ✓，`npm run lint` ✓
- **依赖：** 1.9
- **状态：** [ ]

> **可并行：** 1.6（WindSystem）可与 1.1-1.5 链并行

### 验收标准

> 在浏览器中用鼠标发射矩形"纸飞机"，看到真实的升力/阻力/重力飞行曲线。调试向量在开发模式下可见。

---

## Phase 2 — 纸飞机系统

**交付物：** 4 种类型的纸飞机各有不同的飞行特性，可以选择后体验差异。

### 依赖

- Phase 1 完成

### 任务列表

#### 2.1 定义纸飞机类型数据

- **创建/修改文件：** `src/types/airplane.types.ts`（完善：`AirplaneType`、`AirplaneData`、`AirplaneAttributes`、`FoldingParams`、`AirplaneRarity`）、`src/data/airplanes.ts`（4 种类型完整数据）、`tests/unit/data/airplanes.test.ts`（格式校验）
- **Agent：** tdd-guide
- **验证：** 测试通过，`npm run typecheck` ✓
- **依赖：** 0.5
- **状态：** [ ]

#### 2.2 属性到物理参数映射

- **创建/修改文件：** `src/entities/airplanePhysics.ts`（`createPhysicsStateFromAirplane` 纯函数）、`tests/unit/entities/airplanePhysics.test.ts`
- **Agent：** tdd-guide
- **验证：** 飞镖型速度参数最高、滑翔型升力参数最大
- **依赖：** 2.1, 1.3
- **状态：** [ ]

#### 2.3 PaperAirplane 实体类

- **创建/修改文件：** `src/entities/PaperAirplane.ts`（Phaser.GameObjects.Sprite 子类，Graphics 占位，旋转与物理同步）
- **Agent：** —
- **验证：** `npm run dev` 矩形替换为带颜色三角形
- **依赖：** 2.2
- **状态：** [ ]

#### 2.4 纸飞机选择 UI

- **创建/修改文件：** `src/ui/AirplaneSelector.ts`（4 选 1 面板，显示属性）、`src/ui/components/Button.ts`、`src/ui/components/Panel.ts`
- **Agent：** —
- **验证：** 发射前显示 4 种选择，选中后进入发射
- **依赖：** 2.3
- **状态：** [ ]

#### 2.5 集成验证四种飞行差异

- **创建/修改文件：** 修改 `CompetitionScene.ts`（传入选中 AirplaneData）、追加 `tests/unit/entities/airplanePhysics.test.ts`（模拟 100 步，比较四种类型飞行距离/高度/滞空时间）
- **Agent：** tdd-guide
- **验证：** 测试通过；手动验证飞镖快但短、滑翔远
- **依赖：** 2.4
- **状态：** [ ]

#### 2.6 Phase 2 收尾

- **创建/修改文件：** 补充缺失测试，`docs/roadmap.md`（Phase 2 完成）、`docs/changelog.md`
- **Agent：** code-reviewer
- **验证：** 整体覆盖率 80%+，`npm run lint` ✓
- **依赖：** 2.5
- **状态：** [ ]

### 验收标准

> 选择飞镖型发射明显比选择滑翔型速度更快但飞行时间更短；选择滑翔型在平静风中飞行距离最远。

---

## Phase 3 — 比赛系统

**交付物：** 完整的单局比赛流程（生成赛道 → 与 AI 竞争 → 得分 → 获得奖励）。

### 依赖

- Phase 2 完成

### 任务列表

#### 3.1 SeedManager — 种子系统

- **创建/修改文件：** `src/systems/roguelike/SeedManager.ts`（`generateSeed`、`createRNG`、`seedToString`、`stringToSeed`）、`tests/unit/roguelike/SeedManager.test.ts`
- **Agent：** tdd-guide
- **验证：** 种子复现性，格式正确
- **依赖：** 0.1（rot.js 依赖）
- **状态：** [ ]

#### 3.2 CourseGenerator — 赛道程序化生成

- **创建/修改文件：** `src/systems/roguelike/CourseGenerator.ts`（`generateCourse`: seed + round → CourseData）、`src/types/game.types.ts`（完善：CourseData、ObstacleData、ThermalData、PrecisionZone）、`tests/unit/roguelike/CourseGenerator.test.ts`
- **Agent：** tdd-guide
- **验证：** 种子复现性，参数范围合法，难度随回合递增；覆盖率 85%+
- **依赖：** 3.1, 0.5
- **状态：** [ ]

#### 3.3 LootTable — 掉落表

- **创建/修改文件：** `src/systems/roguelike/LootTable.ts`（按稀有度加权随机，`rollReward` 返回 3 选 1 列表）、`src/types/game.types.ts`（RewardItem、RewardType）、`tests/unit/roguelike/LootTable.test.ts`
- **Agent：** tdd-guide
- **验证：** 大样本概率分布正确，保底机制有效
- **依赖：** 3.1
- **状态：** [ ]

#### 3.4 ScoreCalculator — 计分系统

- **创建/修改文件：** `src/systems/roguelike/ScoreCalculator.ts`（距离基础分 + 精准落点加分 + 特技加分）、`src/types/game.types.ts`（ScoreResult、FlightData）、`tests/unit/roguelike/ScoreCalculator.test.ts`
- **Agent：** tdd-guide
- **验证：** 计分公式正确
- **依赖：** 0.5
- **状态：** [ ]

#### 3.5 OpponentAI + DifficultyScaler

- **创建/修改文件：** `src/systems/ai/OpponentAI.ts`（最优角度 + 随机误差）、`src/systems/ai/DifficultyScaler.ts`（难度系数随回合递增）、`src/data/opponents.ts`（4 普通 + 3 Boss 数据）、对应测试
- **Agent：** tdd-guide
- **验证：** AI 有误差，难度随回合正确递增
- **依赖：** 0.5, 1.3
- **状态：** [ ]

#### 3.6 CompetitionScene — 渲染赛道

- **创建/修改文件：** `src/entities/Obstacle.ts`（静态刚体 + 占位精灵）、`src/entities/ThermalZone.ts`（半透明涡旋视觉）、修改 `CompetitionScene.ts`（根据 CourseData 渲染）
- **Agent：** —
- **验证：** `npm run dev` 看到随机障碍物和热气流
- **依赖：** 3.2, 1.7
- **状态：** [ ]

#### 3.7 AI 对手渲染 + 碰撞处理

- **创建/修改文件：** `src/entities/Opponent.ts`（不同颜色精灵，OpponentAI 发射决策，共享 AerodynamicsEngine）、修改 `CompetitionScene.ts`（1-4 个 AI 对手、碰撞回调、落点记录）
- **Agent：** —
- **验证：** 同屏多颜色纸飞机，碰撞障碍物后响应
- **依赖：** 3.5, 3.6
- **状态：** [ ]

#### 3.8 ResultsScene — 结算画面

- **创建/修改文件：** `src/scenes/ResultsScene.ts`（排名列表、得分、继续/放弃）、`src/ui/RewardSelector.ts`（3 选 1 奖励面板）
- **Agent：** —
- **验证：** 飞行结束自动切换到结算，可选奖励
- **依赖：** 3.3, 3.4, 3.7
- **状态：** [ ]

#### 3.9 多回合串联

- **创建/修改文件：** `src/systems/roguelike/RunManager.ts`（回合计数、累计奖励、局内状态流转）、`tests/unit/roguelike/RunManager.test.ts`、修改 `CompetitionScene.ts` 和 `ResultsScene.ts`
- **Agent：** tdd-guide
- **验证：** `npm test -- RunManager` ✓，`npm run dev` 可连续完成 3 回合
- **依赖：** 3.8
- **状态：** [ ]

#### 3.10 Phase 3 收尾

- **创建/修改文件：** 补充缺失测试，`docs/roadmap.md`（Phase 3 完成）、`docs/changelog.md`
- **Agent：** code-reviewer
- **验证：** roguelike 模块覆盖率 85%+，ai 模块 80%+，`npm test` ✓
- **依赖：** 3.9
- **状态：** [ ]

> **可并行：** 3.2/3.3 可并行（均依赖 3.1）；3.4 独立可提前；3.5 独立可提前

### 验收标准

> 开始一次比赛，看到随机生成的赛道（障碍物/风向各不相同），与 AI 对手竞争，结算后可以选择奖励继续下一回合。

---

## Phase 4 — 大世界地图

**交付物：** 可以行走的像素风城镇，包含各主要地点，支持进入比赛。

### 依赖

- Phase 3 完成

### 任务列表

#### 4.1 OverworldScene + 地图加载

- **创建/修改文件：** `src/scenes/OverworldScene.ts`（Tiled 地图加载、摄像机跟随、碰撞层）、`assets/tilemaps/overworld.json`（占位地图，80x60 方块）
- **验证：** `npm run dev` 看到网格地图
- **依赖：** 0.4
- **状态：** [ ]

#### 4.2 Player 行走 + 虚拟摇杆

- **创建/修改文件：** `src/entities/Player.ts`（方向键移动、4 方向动画、碰撞）、`src/ui/VirtualJoystick.ts`（移动端虚拟摇杆）
- **验证：** 键盘移动角色，摄像机跟随
- **依赖：** 4.1
- **状态：** [ ]

#### 4.3 NPC + 对话系统

- **创建/修改文件：** `src/entities/NPC.ts`（随机漫步、碰撞对话触发）、`src/ui/DialogBox.ts`（逐字显示、确认键推进）
- **验证：** 走近 NPC 触发对话框
- **依赖：** 4.2
- **状态：** [ ]

#### 4.4 地点触发 + 场景切换

- **创建/修改文件：** `src/entities/LocationTrigger.ts`（触发区、确认弹窗、场景切换）、`tests/integration/scene-transition.test.ts`
- **Agent：** tdd-guide（集成测试）
- **验证：** 集成测试通过，走到竞技场进入比赛后返回
- **依赖：** 4.3, 3.9
- **状态：** [ ]

#### 4.5 MainMenuScene

- **创建/修改文件：** `src/scenes/MainMenuScene.ts`（标题动画、新游戏/继续/图鉴/设置按钮、背景粒子飞机）
- **验证：** 显示主菜单，点新游戏进入大世界
- **依赖：** 4.4
- **状态：** [ ]

#### 4.6 Phase 4 收尾

- **创建/修改文件：** 修复触控交互问题，`docs/roadmap.md`（Phase 4 完成）、`docs/changelog.md`、`docs/system-architecture.md`（更新场景切换流程图）
- **Agent：** code-reviewer
- **验证：** `npm test` ✓，移动端虚拟摇杆流畅
- **依赖：** 4.5
- **状态：** [ ]

### 验收标准

> 在手机浏览器中可以通过虚拟摇杆在城镇中行走，走到竞技场后进入比赛，比赛结束后返回城镇。

---

## Phase 5 — 进度与 Roguelike 系统

**交付物：** 完整的 Roguelike 循环，包含元进度、技能系统、物品系统、存档。

### 依赖

- Phase 4 完成

### 任务列表

#### 5.1 MetaProgression — 元进度

- **创建/修改文件：** `src/systems/progression/MetaProgression.ts`（金折、图鉴解锁）、`src/utils/storage.ts`（存读 + schemaVersion 迁移）、`tests/unit/progression/MetaProgression.test.ts`、`tests/unit/utils/storage.test.ts`
- **Agent：** tdd-guide
- **验证：** 覆盖率 85%+
- **依赖：** 0.5
- **状态：** [ ]

#### 5.2 RunState — 局内状态

- **创建/修改文件：** `src/systems/progression/RunState.ts`（技能槽、物品栏、纸币、回合数）、`tests/unit/progression/RunState.test.ts`、`tests/integration/run-state.test.ts`
- **Agent：** tdd-guide
- **验证：** 覆盖率 85%+
- **依赖：** 5.1
- **状态：** [ ]

#### 5.3 TournamentManager — 赛事层级

- **创建/修改文件：** `src/systems/progression/TournamentManager.ts`、`src/data/tournaments.ts`（5 层赛事数据）、`tests/unit/progression/TournamentManager.test.ts`
- **Agent：** tdd-guide
- **验证：** 测试通过
- **依赖：** 5.1
- **状态：** [ ]

#### 5.4 技能 + 物品数据和激活逻辑

- **创建/修改文件：** `src/data/skills.ts`（6 主动 + 6 被动）、`src/data/items.ts`（4 消耗品 + 4 装备）、`src/systems/roguelike/SkillSystem.ts`（技能激活、被动效果、协同效果）、`tests/unit/roguelike/SkillSystem.test.ts`、完善 `src/types/skill.types.ts`
- **Agent：** tdd-guide
- **验证：** 测试通过
- **依赖：** 5.2, 2.1
- **状态：** [ ]

#### 5.5 HUD + InventoryPanel

- **创建/修改文件：** `src/ui/HUD.ts`（风向/风速、技能按钮 x3、回合数、纸币）、`src/ui/InventoryPanel.ts`（技能装备/卸下、物品使用）
- **验证：** 比赛中 HUD 可见，技能可使用
- **依赖：** 5.4, 3.7
- **状态：** [ ]

#### 5.6 商店 + 永久死亡

- **创建/修改文件：** `src/ui/ShopPanel.ts`（商品列表、购买、金折/纸币切换）、修改 `RunState.ts`（死亡清空逻辑）、`tests/integration/progression.test.ts`
- **Agent：** tdd-guide
- **验证：** 失败后 RunState 清空但金折保留
- **依赖：** 5.5, 5.1
- **状态：** [ ]

#### 5.7 Phase 5 收尾

- **创建/修改文件：** 补充测试，`docs/roadmap.md`（Phase 5 完成）、`docs/changelog.md`
- **Agent：** code-reviewer
- **验证：** progression 模块覆盖率 85%+，`npm test` ✓
- **依赖：** 5.6
- **状态：** [ ]

### 验收标准

> 完成一局比赛，金折保留；关闭浏览器再打开，存档正确恢复；失败后 RunState 清空但金折不变；技能在比赛中有明显效果。

---

## Phase 6 — 折纸工坊

**交付物：** 玩家可以可视化调节纸飞机参数，并看到实时飞行预览，同时展示真实折法步骤。

### 依赖

- Phase 5 完成

### 任务列表

#### 6.1 WorkshopScene 基础框架

- **创建/修改文件：** `src/scenes/WorkshopScene.ts`（布局：纸飞机预览 + 参数滑动条 + 按钮）、`src/ui/components/Slider.ts`、`src/ui/components/ProgressBar.ts`
- **验证：** 从大世界进入工坊，看到参数调节界面
- **依赖：** 5.2
- **状态：** [ ]

#### 6.2 实时飞行曲线预览

- **创建/修改文件：** `src/systems/physics/TrajectoryPredictor.ts`（参数 → 轨迹点数组，纯函数）、`tests/unit/physics/TrajectoryPredictor.test.ts`、修改 `WorkshopScene.ts`（绘制预测轨迹）
- **Agent：** tdd-guide
- **验证：** 调整滑动条时轨迹实时变化
- **依赖：** 6.1, 1.5
- **状态：** [ ]

#### 6.3 折法步骤 + 纸张消耗

- **创建/修改文件：** `src/data/foldingTutorials.ts`（4 种折法步骤文字 + ASCII 图解）、`src/ui/FoldingTutorial.ts`（步骤浏览组件）、修改 `WorkshopScene.ts`（纸张消耗、参数持久化到 AirplaneSnapshot）
- **验证：** 可浏览折法步骤，调整消耗纸张
- **依赖：** 6.2
- **状态：** [ ]

#### 6.4 Phase 6 收尾

- **创建/修改文件：** `docs/roadmap.md`（Phase 6 完成）、`docs/changelog.md`
- **Agent：** code-reviewer
- **验证：** `npm test` ✓
- **依赖：** 6.3
- **状态：** [ ]

### 验收标准

> 调整滑动条，右侧预览曲线实时变化（鼻锥变重 → 轨迹更快速下降）；点击「查看折法步骤」可以看到该类型纸飞机的真实折纸教程。

---

## Phase 7 — 美术与音效

**交付物：** 完整的视听体验，替换所有占位资源。

### 依赖

- Phase 6 完成（游戏逻辑全部就绪）

### 任务列表

#### 7.1 纸飞机精灵（4 种类型）

- **创建/修改文件：** `assets/sprites/airplanes/{dart,glider,acrobatic,stunt}.png + .json`（16x16，含飞行动画帧）、修改 `assets.config.ts`、修改 `PaperAirplane.ts`（加载真实精灵）
- **验证：** 比赛中显示像素精灵
- **依赖：** 2.3
- **状态：** [ ]

#### 7.2 角色/NPC/城镇方块集

- **创建/修改文件：** `assets/sprites/characters/player.png + .json`（32x48，4 方向行走）、`assets/sprites/characters/npc-*.png`、`assets/sprites/tileset/overworld.png`、重绘 `assets/tilemaps/overworld.json`
- **验证：** 大世界地图有完整像素画城镇
- **依赖：** 4.2
- **状态：** [ ]

#### 7.3 比赛背景 + 障碍物 + UI 图集

- **创建/修改文件：** `assets/sprites/backgrounds/{sky,buildings,ground}.png`（3 层视差）、`assets/sprites/obstacles/{tree,building,balloon}.png`、`assets/sprites/ui/ui.png + .json`、`assets/sprites/effects/{wind-particle,smoke}.png`、修改 `CompetitionScene.ts`（3 层视差滚动）
- **验证：** 比赛场景有完整视差滚动背景
- **依赖：** 3.6
- **状态：** [ ]

#### 7.4 音乐 + 音效

- **创建/修改文件：** `assets/audio/music/{menu,overworld,competition,boss}.ogg + .mp3`、`assets/audio/sfx/{throw,wind,skill,crash,victory,defeat,click}.ogg`、`src/utils/audio.ts`（音频管理器）、修改各场景加载/播放音频
- **验证：** 所有场景有背景音乐，主要操作有音效
- **依赖：** 7.1, 7.2, 7.3
- **状态：** [ ]

#### 7.5 像素字体（中文支持）

- **创建/修改文件：** `assets/fonts/pixel-zh.fnt + .png`（中文位图字体）、`src/utils/i18n.ts`（国际化文本集中管理）、修改 `BootScene.ts`（加载字体）、修改所有 UI 组件使用位图字体
- **验证：** 所有中文文字使用像素字体
- **依赖：** 7.4
- **状态：** [ ]

#### 7.6 Phase 7 收尾

- **创建/修改文件：** `docs/roadmap.md`（Phase 7 完成）、`docs/changelog.md`
- **Agent：** code-reviewer
- **验证：** 无占位矩形/纯色块；`npm run build` 资源总大小 < 5MB
- **依赖：** 7.5
- **状态：** [ ]

> **可并行：** 7.1、7.2、7.3 可完全并行

### 验收标准

> 游戏内无任何占位矩形或纯色块；所有场景均有背景音乐；所有主要操作均有音效反馈。

---

## Phase 8 — LLM 动态内容

**交付物：** WebLLM 集成完成，能动态生成纸飞机名称和技能文案，有完整兜底方案。

### 依赖

- Phase 7 完成

### 任务列表

#### 8.1 LLMService — 抽象层

- **创建/修改文件：** `src/systems/llm/LLMService.ts`（WebGPU 检测、模型下载/初始化、推理接口）、`tests/unit/llm/LLMService.test.ts`（mock WebGPU API，测试降级逻辑）
- **Agent：** tdd-guide
- **验证：** 测试通过
- **依赖：** 0.1
- **状态：** [ ]

#### 8.2 ContentGenerator + ContentValidator

- **创建/修改文件：** `src/systems/llm/ContentGenerator.ts`（纸飞机命名、技能文案、Boss 对话）、`src/systems/llm/ContentValidator.ts`（JSON Schema + 长度 + 敏感词校验）、对应测试
- **Agent：** tdd-guide
- **验证：** 测试通过
- **依赖：** 8.1
- **状态：** [ ]

#### 8.3 预生成静态内容库

- **创建/修改文件：** `src/data/generated/airplane-names.json`（≥50 条）、`src/data/generated/skill-flavors.json`（≥30 条）
- **验证：** JSON 格式校验通过
- **依赖：** 无（可提前并行）
- **状态：** [ ]

#### 8.4 集成 LLM 到游戏场景

- **创建/修改文件：** 修改 `ResultsScene.ts`（稀有/传说纸飞机触发生成名称）、`src/scenes/CollectionScene.ts`（展示生成描述）、`src/ui/LoadingIndicator.ts`（"AI 生成中..." 加载态）
- **验证：** 获得稀有纸飞机时看到动态名称；WebGPU 不可用时使用预设名称
- **依赖：** 8.2, 8.3, 3.8
- **状态：** [ ]

#### 8.5 Phase 8 收尾

- **创建/修改文件：** `tests/integration/llm-fallback.test.ts`（降级集成测试）、`docs/roadmap.md`（Phase 8 完成）、`docs/changelog.md`
- **Agent：** code-reviewer
- **验证：** `npm test` ✓
- **依赖：** 8.4
- **状态：** [ ]

> **可并行：** 8.3 可与 8.1-8.2 并行

### 验收标准

> 在支持 WebGPU 的浏览器中，首次获得传说纸飞机时看到 AI 生成的独特名称；在不支持 WebGPU 的浏览器中，自动使用预设名称，游戏正常运行。

---

## Phase 9 — 测试与优化

**交付物：** 80%+ 测试覆盖率，移动端 60fps 流畅运行。

### 依赖

- Phase 8 完成

### 任务列表

#### 9.1 补全单元测试覆盖率

- **创建/修改文件：** 补充 `tests/unit/` 下所有模块缺失测试
- **Agent：** tdd-guide
- **验证：** `npm run test:coverage` physics 90%+、roguelike 85%+、progression 85%+、utils 80%+、整体 80%+
- **依赖：** 8.5
- **状态：** [ ]

#### 9.2 E2E 测试（3 场景）

- **创建/修改文件：** `tests/e2e/main-menu.spec.ts`（主菜单显示、进入游戏）、`tests/e2e/competition-flow.spec.ts`（完成一局完整比赛）、`tests/e2e/save-load.spec.ts`（存档后刷新数据恢复）
- **Agent：** e2e-runner
- **验证：** `npm run test:e2e` 3 个测试全部通过
- **依赖：** 9.1
- **状态：** [ ]

#### 9.3 性能优化

- **创建/修改文件：** 按需优化 `CompetitionScene.ts`（对象池、减少 GC），按需优化资源加载，修改 `vite.config.ts`（优化分包）
- **验证：** Chrome DevTools 无明显卡顿；移动端 30s 比赛 ≥55fps；触控目标 ≥44×44px
- **依赖：** 9.1
- **状态：** [ ]

#### 9.4 Phase 9 收尾

- **创建/修改文件：** 修复所有 lint/typecheck 问题，`docs/roadmap.md`（Phase 9 完成）、`docs/changelog.md`
- **Agent：** code-reviewer, security-reviewer
- **验证：** `npm run lint` 0 errors，`npm run typecheck` 0 errors，覆盖率 ≥80%，E2E 全通过
- **依赖：** 9.2, 9.3
- **状态：** [ ]

### 验收标准

> `npm run test:coverage` 显示 ≥80%；在 iPhone 12 上运行比赛场景 30 秒，帧率保持 ≥55fps；E2E 三个测试全部通过。

---

## Phase 10 — 发布

**交付物：** v1.0.0 公开发布，文档完善。

### 依赖

- Phase 9 完成

### 任务列表

#### 10.1 生产构建验证

- **创建/修改文件：** 修改 `package.json`（version: "1.0.0"）、修改 `src/config/game.config.ts`（版本号显示）
- **验证：** `npm run build` ✓，`du -sh dist/` < 5MB
- **依赖：** 9.4
- **状态：** [ ]

#### 10.2 GitHub Pages 生产部署

- **验证：** 推送 main 分支触发 deploy workflow，桌面 + 手机双端浏览器访问 GitHub Pages URL 可正常游玩
- **依赖：** 10.1
- **状态：** [ ]

#### 10.3 itch.io + 最终文档 + git tag

- **创建/修改文件：** 修改 `README.md`（游戏截图 3 张、部署 URL）、修改 `docs/changelog.md`（v1.0.0 正式版本）、确认所有文档与代码一致
- **Agent：** doc-updater
- **验证：** itch.io 页面可公开访问，`git tag v1.0.0` 打标
- **依赖：** 10.2
- **状态：** [ ]

### 验收标准

> 任何人通过 README 中的 URL 可以在手机浏览器中直接玩到游戏，无需安装任何软件。

---

## 关键路径与并行机会

### 关键路径

```
0.1 → 0.4 → 0.8
           ↓
      1.1 → 1.2 → 1.3 → 1.4 → 1.5 → 1.7 → 1.8 → 1.9
      1.6 ─────────────────────────────────↗
           ↓
      2.1 → 2.2 → 2.3 → 2.4 → 2.5
           ↓
      3.1 → 3.2 → 3.6 → 3.7 → 3.8 → 3.9
      3.3 ─────────────↗
      3.4 ─────────────↗
      3.5 ─────────────↗
           ↓
      Phase 4 → Phase 5 → Phase 6 → Phase 7 → Phase 8 → Phase 9 → Phase 10
```

### 可并行工作总结

| Phase | 可并行的任务 |
|-------|------------|
| Phase 0 | 0.2、0.3、0.5 可并行 |
| Phase 1 | 1.6（WindSystem）与 1.1-1.5 并行 |
| Phase 3 | 3.2/3.3 并行；3.4/3.5 可提前 |
| Phase 7 | 7.1/7.2/7.3 完全并行 |
| Phase 8 | 8.3 与 8.1-8.2 并行 |

---

## 未来方向（v1.x 及以后）

| 功能 | 说明 | 优先级 |
|------|------|--------|
| 更多折纸模型 | 引入纸船、纸青蛙等折纸模型，作为特殊比赛项目 | ⭐⭐⭐ |
| 社区种子分享 | 玩家上传种子到排行榜，对比成绩 | ⭐⭐⭐ |
| 更多 LLM 内容 | LLM 生成新纸飞机设计参数（不只是名称） | ⭐⭐⭐ |
| 排行榜 | 全球最佳飞行距离/时间排行 | ⭐⭐ |
| 多人对战 | WebSocket 实时双人竞技 | ⭐⭐ |
| 剧情 DLC | 深度主线故事，揭开「折翼传说」背后的秘密 | ⭐⭐ |
| 本地化 | 英文、日文版本 | ⭐ |
