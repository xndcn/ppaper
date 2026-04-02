# 开发路线图

> PPaper（折翼传说）— 分阶段开发计划

## 阶段概览

| 阶段 | 名称 | 核心交付物 | 预估工作量 | 状态 |
|------|------|-----------|-----------|------|
| Phase 0 | 项目初始化 | 可运行的 Phaser 骨架 + CI/CD | ~1 天 | ⬜ 待开始 |
| Phase 1 | 核心物理引擎 | 纸飞机可飞行的物理原型 | ~3-5 天 | ⬜ 待开始 |
| Phase 2 | 纸飞机系统 | 4 种类型纸飞机可选择和飞行 | ~3-5 天 | ⬜ 待开始 |
| Phase 3 | 比赛系统 | 完整的单局比赛流程 | ~5-7 天 | ⬜ 待开始 |
| Phase 4 | 大世界地图 | 可探索的城镇 + 场景切换 | ~5-7 天 | ⬜ 待开始 |
| Phase 5 | 进度与 Roguelike | 完整 Roguelike 循环 | ~5-7 天 | ⬜ 待开始 |
| Phase 6 | 折纸工坊 | 交互式纸飞机定制 | ~3-5 天 | ⬜ 待开始 |
| Phase 7 | 美术与音效 | 完整视听体验 | ~5-7 天 | ⬜ 待开始 |
| Phase 8 | LLM 动态内容 | AI 生成内容已集成 | ~3-5 天 | ⬜ 待开始 |
| Phase 9 | 测试与优化 | 80%+ 覆盖率 + 性能达标 | ~3-5 天 | ⬜ 待开始 |
| Phase 10 | 发布 | v1.0.0 公开上线 | ~1-2 天 | ⬜ 待开始 |

---

## Phase 0 — 项目初始化

**交付物：** 可以在浏览器中打开的 Phaser 3 Hello World + 完整 CI/CD 管道。

### 任务列表

- [ ] 初始化 git 仓库
- [ ] 使用 Vite 创建 TypeScript 项目骨架（`npm create vite@latest`）
- [ ] 安装核心依赖：`phaser`、`rot.js`
- [ ] 安装开发依赖：`vitest`、`@playwright/test`、`eslint`、`prettier`、`typescript`
- [ ] 配置 `tsconfig.json`（strict 模式，路径别名 `@/` → `src/`）
- [ ] 配置 `vite.config.ts`（分包策略：phaser 单独 chunk）
- [ ] 配置 `vitest.config.ts`（覆盖率阈值 80%）
- [ ] 配置 `playwright.config.ts`（Chrome + Firefox）
- [ ] 配置 ESLint + Prettier（`no-any`、`no-console`）
- [ ] 创建 `src/main.ts` 和 `BootScene.ts`（空场景，显示 PPaper 标题文字）
- [ ] 创建 `public/index.html` 和 `.gitignore`
- [ ] 验证 `npm run dev` 在浏览器中显示像素文字
- [ ] 验证 `npm run build` 成功生成 `dist/`
- [ ] 在 Cloudflare Pages 部署第一个版本（公开可访问的 URL）
- [ ] 创建 GitHub Actions 工作流（PR 时运行 lint + typecheck + unit test）

### 验收标准

> 打开部署 URL，看到黑色背景上的像素风 "PPaper" 标题。所有 CI 检查通过。

---

## Phase 1 — 核心物理引擎

**交付物：** 可以发射纸飞机并看到真实飞行物理的调试原型。

### 依赖

- Phase 0 完成

### 任务列表

- [ ] 定义 `src/types/physics.types.ts`（`Vector2`、`PhysicsState`、`WindState`）
- [ ] **TDD**：为 `ForceCalculator` 编写单元测试（覆盖升力、阻力、重力、失速）
- [ ] 实现 `src/systems/physics/ForceCalculator.ts`（纯函数，无 Phaser 依赖）
- [ ] **TDD**：为 `AerodynamicsEngine` 编写单元测试（验证位置/速度积分）
- [ ] 实现 `src/systems/physics/AerodynamicsEngine.ts`（固定时间步长积分）
- [ ] **TDD**：为 `WindSystem` 编写单元测试（基础风 + 阵风）
- [ ] 实现 `src/systems/physics/WindSystem.ts`
- [ ] 创建 `src/scenes/CompetitionScene.ts`（最小化实现：白色背景 + 矩形代替精灵）
- [ ] 在 CompetitionScene 集成物理引擎（update 循环中调用 AerodynamicsEngine.step）
- [ ] 实现发射交互：鼠标拖动调整角度/力度，松手发射（桌面版）
- [ ] 添加物理调试可视化（显示速度向量、升力向量、攻角角度）
- [ ] 验证飞行物理：平飞→逐渐下降，顺风→飞得更远，大攻角→失速翻滚
- [ ] 运行所有测试：`npm test` 通过，覆盖率 ≥ 80%（physics 模块）

### 验收标准

> 在浏览器中用鼠标发射矩形"纸飞机"，看到真实的升力/阻力/重力飞行曲线。调试向量在开发模式下可见。

---

## Phase 2 — 纸飞机系统

**交付物：** 4 种类型的纸飞机各有不同的飞行特性，可以选择后体验差异。

### 依赖

- Phase 1 完成

### 任务列表

- [ ] 定义 `src/types/airplane.types.ts`（`AirplaneType`、`AirplaneData`、`AirplaneSnapshot`）
- [ ] 创建 `src/data/airplanes.ts`（飞镖/滑翔/特技/花式四种类型的完整数据定义）
- [ ] **TDD**：为属性到物理参数映射编写单元测试
- [ ] 实现 `src/entities/PaperAirplane.ts`（Phaser Sprite 子类，接收 AirplaneData）
- [ ] 将纸飞机属性（质量、翼面积、翼展比）映射到物理参数
- [ ] 创建占位像素精灵（用 Aseprite 或临时用 `this.make.graphics` 绘制）
- [ ] 实现纸飞机选择 UI（简单的 4 选 1 面板，显示属性数值）
- [ ] 在 CompetitionScene 中替换矩形为真实精灵
- [ ] 验证 4 种类型飞行特性差异：飞镖速度最快、滑翔飞行最远、特技可辅助翻滚
- [ ] 运行所有测试通过

### 验收标准

> 选择飞镖型发射明显比选择滑翔型速度更快但飞行时间更短；选择滑翔型在平静风中飞行距离最远。

---

## Phase 3 — 比赛系统

**交付物：** 完整的单局比赛流程（生成赛道 → 与 AI 竞争 → 得分 → 获得奖励）。

### 依赖

- Phase 2 完成

### 任务列表

- [ ] 定义 `src/types/game.types.ts`（`CourseData`、`ScoreResult`、`RewardItem`）
- [ ] **TDD**：为 `CourseGenerator` 编写单元测试（验证种子复现、参数范围）
- [ ] 实现 `src/systems/roguelike/CourseGenerator.ts`（使用 rot.js RNG，生成风向/障碍/热气流/精准落点）
- [ ] **TDD**：为 `LootTable` 编写单元测试（验证概率分布）
- [ ] 实现 `src/systems/roguelike/LootTable.ts`（按稀有度加权随机）
- [ ] 实现 `src/systems/roguelike/SeedManager.ts`（6 位种子码生成/恢复）
- [ ] 实现 `src/systems/ai/OpponentAI.ts`（初级 AI：带误差的最优角度计算）
- [ ] 实现 `src/systems/ai/DifficultyScaler.ts`（按回合数调整参数）
- [ ] 在 CompetitionScene 中渲染障碍物（静态 Matter.js 刚体 + 占位精灵）
- [ ] 渲染热气流区域（半透明涡旋粒子效果）
- [ ] 渲染多个 AI 对手纸飞机（同屏不同颜色）
- [ ] 实现计分系统（飞行距离 + 精准落点加分 + 特技加分）
- [ ] 创建 `src/scenes/ResultsScene.ts`（显示排名、得分、奖励选择）
- [ ] 实现 `src/ui/RewardSelector.ts`（3选1奖励面板）
- [ ] 多回合串联：结算后可继续下一回合或放弃
- [ ] 运行所有测试通过

### 验收标准

> 开始一次比赛，看到随机生成的赛道（障碍物/风向各不相同），与 AI 对手竞争，结算后可以选择奖励继续下一回合。

---

## Phase 4 — 大世界地图

**交付物：** 可以行走的像素风城镇，包含各主要地点，支持进入比赛。

### 依赖

- Phase 3 完成（需要比赛场景可进入）

### 任务列表

- [ ] 安装 Tiled 地图编辑器，创建 `assets/tilemaps/overworld.json`（80×60 方块）
- [ ] 绘制基础地图：家、学校、后山、商店、竞技场、公园、工坊
- [ ] **TDD**：为场景切换数据传递编写集成测试
- [ ] 创建 `src/scenes/OverworldScene.ts`（Tiled 地图加载 + 玩家行走）
- [ ] 实现 `src/entities/Player.ts`（方向键/虚拟摇杆移动，4 方向动画）
- [ ] 实现 `src/entities/NPC.ts`（随机漫步，碰撞触发对话）
- [ ] 实现 `src/ui/DialogBox.ts`（逐字显示对话，确认键推进）
- [ ] 各地点触发区域（进入触发区 → 弹出进入确认 → 切换场景）
- [ ] 主菜单 → 大世界地图 → 比赛场景 → 结算 → 大世界地图 完整流程
- [ ] 移动端触控支持（虚拟摇杆，点击地点进入）
- [ ] 运行所有测试通过，包含场景切换集成测试

### 验收标准

> 在手机浏览器中可以通过虚拟摇杆在城镇中行走，走到竞技场后进入比赛，比赛结束后返回城镇。

---

## Phase 5 — 进度与 Roguelike 系统

**交付物：** 完整的 Roguelike 循环，包含元进度、技能系统、物品系统、存档。

### 依赖

- Phase 4 完成

### 任务列表

- [ ] 定义 `src/types/game.types.ts` 补全（`MetaState`、`RunState`、`TournamentProgress`）
- [ ] **TDD**：为 `MetaProgression` 编写单元测试（解锁/存档/读档）
- [ ] 实现 `src/systems/progression/MetaProgression.ts`（金折管理、解锁记录、localStorage 持久化）
- [ ] **TDD**：为 `RunState` 编写单元测试（局内状态流转）
- [ ] 实现 `src/systems/progression/RunState.ts`（技能槽、物品栏、纸币、回合数）
- [ ] 实现 `src/systems/progression/TournamentManager.ts`（赛事层级解锁、条件判断）
- [ ] 实现永久死亡机制：比赛失败 → RunState 清空，金折保留
- [ ] 定义 `src/data/skills.ts`（6 个主动技能 + 6 个被动技能完整数据）
- [ ] 定义 `src/data/items.ts`（消耗品 + 装备完整数据）
- [ ] 实现技能激活逻辑（在 CompetitionScene 中响应技能使用）
- [ ] 实现物品使用逻辑（在 CompetitionScene 中响应物品使用）
- [ ] 创建 `src/ui/InventoryPanel.ts`（技能/物品管理界面）
- [ ] 实现 `src/ui/HUD.ts`（比赛中显示：风速/风向、当前技能、回合数）
- [ ] 实现商店功能（在 OverworldScene 的商店地点）
- [ ] 实现 `src/utils/storage.ts` 版本迁移（schemaVersion 字段）
- [ ] 运行所有测试通过（覆盖率 ≥ 80%）

### 验收标准

> 完成一局比赛，金折保留；关闭浏览器再打开，存档正确恢复；失败后 RunState 清空但金折不变；技能在比赛中有明显效果。

---

## Phase 6 — 折纸工坊

**交付物：** 玩家可以可视化调节纸飞机参数，并看到实时飞行预览，同时展示真实折法步骤。

### 依赖

- Phase 5 完成（需要 RunState 和 MetaProgression）

### 任务列表

- [ ] 创建 `src/scenes/WorkshopScene.ts`
- [ ] 实现参数调节 UI（鼻锥重量、翼展、翼弦角、尾翼角度，各有滑动条）
- [ ] 实现实时飞行曲线预览（小型物理仿真，显示预期轨迹）
- [ ] 实现折法步骤展示（文字 + 像素图解，覆盖至少 4 种基础折法）
- [ ] 将调整后的参数持久化到当前飞机的 AirplaneSnapshot
- [ ] 工坊中消耗「纸张」资源（防止无限调整）
- [ ] 运行所有测试通过

### 验收标准

> 调整滑动条，右侧预览曲线实时变化（鼻锥变重 → 轨迹更快速下降）；点击「查看折法步骤」可以看到该类型纸飞机的真实折纸教程。

---

## Phase 7 — 美术与音效

**交付物：** 完整的视听体验，替换所有占位资源。

### 依赖

- Phase 6 完成（游戏逻辑全部就绪）

### 任务列表

**视觉：**
- [ ] 绘制 4 种纸飞机精灵（16×16，含飞行动画帧）
- [ ] 绘制玩家角色精灵（32×48，4 方向行走动画）
- [ ] 绘制 4-6 个 NPC 精灵
- [ ] 绘制城镇方块集（32×32，含房屋/树木/地面/道路）
- [ ] 绘制比赛背景层（天空/远景/地面，3 层视差）
- [ ] 绘制障碍物精灵（树/建筑/气球）
- [ ] 绘制 UI 图集（按钮/面板/图标/箭头/边框）
- [ ] 绘制特效精灵（风粒子/发射烟雾/撞击粉碎）
- [ ] 配置像素字体（确保中文可正确渲染）

**音频：**
- [ ] 制作主菜单音乐（轻快芯片音乐，约 1 分钟循环）
- [ ] 制作大世界地图音乐（悠闲田园，约 1 分钟循环）
- [ ] 制作比赛音乐（动感，约 1 分钟循环）
- [ ] 制作 Boss 战音乐（紧张，约 1 分钟循环）
- [ ] 制作胜利/失败结算音效
- [ ] 制作所有 SFX（参见游戏设计文档音效列表）

### 验收标准

> 游戏内无任何占位矩形或纯色块；所有场景均有背景音乐；所有主要操作均有音效反馈。

---

## Phase 8 — LLM 动态内容

**交付物：** WebLLM 集成完成，能动态生成纸飞机名称和技能文案，有完整兜底方案。

### 依赖

- Phase 7 完成

### 任务列表

- [ ] 安装 `@mlc-ai/web-llm` 依赖
- [ ] 实现 `src/systems/llm/LLMService.ts`（WebGPU 检测、模型下载、推理接口）
- [ ] 实现 `src/systems/llm/ContentGenerator.ts`（纸飞机命名、技能文案生成）
- [ ] 实现 `src/systems/llm/ContentValidator.ts`（JSON Schema 校验 + 范围检查）
- [ ] 创建 `src/data/generated/airplane-names.json`（预生成静态内容库，≥50 条）
- [ ] 创建 `src/data/generated/skill-flavors.json`（预生成静态技能文案，≥30 条）
- [ ] 在 ResultsScene 中触发：首次获得稀有/传说纸飞机时，生成名称
- [ ] 在 CollectionScene 中展示 LLM 生成的描述和故事
- [ ] 添加「AI 生成中...」加载态 UI
- [ ] 测试 WebGPU 不可用时自动降级到静态内容
- [ ] 运行所有测试通过

### 验收标准

> 在支持 WebGPU 的浏览器中，首次获得传说纸飞机时看到 AI 生成的独特名称（不同于其他玩家）；在不支持 WebGPU 的浏览器中，自动使用预设名称，游戏正常运行。

---

## Phase 9 — 测试与优化

**交付物：** 80%+ 测试覆盖率，移动端 60fps 流畅运行。

### 依赖

- Phase 8 完成

### 任务列表

- [ ] 运行覆盖率报告：`npm run test:coverage`，补全缺失测试
- [ ] 为 `systems/` 目录下所有模块达到 80%+ 覆盖率
- [ ] 补充集成测试：完整比赛流程、存档读档、LLM 降级
- [ ] 实现 E2E 测试（Playwright）：
  - [ ] `main-menu.spec.ts`：主菜单正确显示、可进入游戏
  - [ ] `competition-flow.spec.ts`：完成一局完整比赛
  - [ ] `save-load.spec.ts`：存档后刷新页面数据正确恢复
- [ ] 性能分析：Chrome DevTools Performance 录制比赛场景
- [ ] 优化对象池（如 GC 抖动明显）
- [ ] 移动端测试：iOS Safari、Android Chrome（确认 60fps）
- [ ] 修复所有 TypeScript 错误和 ESLint 警告
- [ ] 可访问性：确认触控目标大小 ≥ 44×44px

### 验收标准

> `npm run test:coverage` 显示 ≥80%；在 iPhone 12 上运行比赛场景 30 秒，帧率保持 ≥55fps；E2E 三个测试全部通过。

---

## Phase 10 — 发布

**交付物：** v1.0.0 公开发布，文档完善。

### 依赖

- Phase 9 完成

### 任务列表

- [ ] 最终版本号设置为 `1.0.0`（`package.json` + 游戏内显示）
- [ ] 生产环境构建：`npm run build`，检查 `dist/` 大小（目标 < 5MB，不含模型）
- [ ] Cloudflare Pages 生产部署验证（桌面 + 手机双端测试）
- [ ] itch.io 发布页面（游戏截图 3 张 + 简介文案）
- [ ] 更新 `docs/changelog.md`（v1.0.0 正式版本）
- [ ] 完善 `README.md`（添加游戏截图、部署 URL）
- [ ] 确认所有文档（README/技术选型/游戏设计/架构）与代码一致
- [ ] 打 git tag：`git tag v1.0.0`

### 验收标准

> 任何人通过 README 中的 URL 可以在手机浏览器中直接玩到游戏，无需安装任何软件。

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
