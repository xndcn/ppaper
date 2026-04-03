# CLAUDE.md — PPaper 项目 Agent 开发规范

> 本文件适用于所有在此项目中工作的 AI Agent（包括 Claude Code）和人类开发者。
> 每次修改代码前请先阅读本文件。

---

## 项目概述

**PPaper（折翼传说）** 是一款 Roguelike 2D 像素风纸飞机比赛浏览器游戏。

| 属性 | 说明 |
|------|------|
| 语言 | TypeScript 5.x（strict 模式） |
| 框架 | Phaser 3 |
| 构建工具 | Vite 6 |
| 测试框架 | Vitest（单元/集成）+ Playwright（E2E）|
| 文档语言 | 中文 |
| 代码标识符 | 英文（变量/函数/类名） |
| 部署 | Cloudflare Pages（静态） |

**关键文档：**
- 游戏设计：`docs/game-design.md`
- 系统架构：`docs/system-architecture.md`
- 开发路线图：`docs/roadmap.md`
- 技术选型：`docs/tech-selection.md`

---

## 开发工作流

### 每次代码变更必须遵循以下完整流程

```
1. 阅读文档
   → 确认需求在 docs/game-design.md 中有设计依据
   → 确认模块位置符合 docs/system-architecture.md 中的目录结构

2. 测试先行（TDD）
   → 先写测试：vitest，测试文件放在 tests/unit/ 或与实现文件同目录
   → 运行测试，确认测试失败（RED）

3. 实现功能
   → 写最小化实现，让测试通过（GREEN）
   → 遵循本文件所有代码规范

4. 重构优化
   → 消除重复，提升可读性（REFACTOR）
   → 确认测试仍通过

5. 质量检查（全部通过才继续）
   → npm test                 # 所有测试通过
   → npm run lint             # 无 ESLint 错误
   → npm run typecheck        # 无 TypeScript 错误
   → npm run test:coverage    # 本模块覆盖率 ≥ 80%
   → Playwright MCP 验证      # 使用 Playwright MCP 工具在浏览器中交互验证关键流程，截图保存到 tests/e2e/artifacts/

6. 代码审查
   → 使用 code-reviewer Agent 进行审查
   → 修复所有 CRITICAL 和 HIGH 级别问题
   → 尽量修复 MEDIUM 级别问题

7. 更新文档
   → 在 docs/changelog.md 的 [未发布] 章节下添加本次变更
   → 在 docs/roadmap.md 中勾选已完成的任务项（✅）
   → 如果涉及架构变更，更新 docs/system-architecture.md
   → 如果涉及游戏机制变更，更新 docs/game-design.md

8. 提交
   → git add <具体文件>（不使用 git add -A 或 git add .）
   → 使用规范 commit 格式提交
```

---

## 代码规范

### TypeScript 规范（CRITICAL）

```typescript
// ❌ 禁止：any 类型
function process(data: any) {}

// ✅ 正确：明确类型
function process(data: AirplaneData) {}

// ❌ 禁止：直接修改对象（变异）
runState.paperCoins += 100;

// ✅ 正确：返回新对象（不可变模式）
const newState: RunState = {
  ...runState,
  paperCoins: runState.paperCoins + 100
};

// ❌ 禁止：console.log
console.log('debug info');

// ✅ 正确：使用 logger 工具
import { logger } from '@/utils/logger';
logger.debug('debug info');  // 生产环境自动静默
```

### Phaser 场景规范

```typescript
// 每个场景独立一个文件，继承 Phaser.Scene
export class CompetitionScene extends Phaser.Scene {
  // 场景数据类型明确
  private physicsState!: PhysicsState;

  constructor() {
    super({ key: 'CompetitionScene' });
  }

  init(data: CompetitionSceneData): void {
    // 接收来自上一场景的数据（只读快照）
  }

  preload(): void {
    // 只加载本场景专属资源
  }

  create(): void {
    // 初始化场景对象
  }

  update(time: number, delta: number): void {
    // 物理更新、输入处理
  }
}
```

### 物理系统规范（纯函数，无副作用）

```typescript
// src/systems/physics/ 下的所有函数必须：
// 1. 无 Phaser 导入
// 2. 无外部状态依赖
// 3. 相同输入始终得到相同输出
// 4. 返回新对象，不修改参数

// ✅ 正确：纯函数
export function computeLift(
  velocity: Vector2,
  attackAngle: number,
  wingArea: number
): Vector2 {
  const speed = Math.hypot(velocity.x, velocity.y);
  const cl = computeLiftCoefficient(attackAngle);
  const liftMagnitude = 0.5 * AIR_DENSITY * speed * speed * cl * wingArea;
  // ... 返回新 Vector2，不修改任何外部状态
  return { x: ..., y: ... };
}
```

### 文件规模限制

| 限制 | 标准 | 强制最大值 |
|------|------|-----------|
| 文件行数 | ≤ 400 行（推荐） | 800 行 |
| 函数行数 | ≤ 30 行（推荐） | 50 行 |
| 嵌套深度 | ≤ 3 层（推荐） | 4 层 |
| 函数参数数 | ≤ 3 个（推荐） | 5 个 |

超出推荐值时应拆分模块/提取辅助函数。

---

## 文件组织规范

完整目录结构见 `docs/system-architecture.md` 第一章。

**关键规则：**

| 规则 | 说明 |
|------|------|
| 场景文件 | 放在 `src/scenes/`，文件名以 `Scene.ts` 结尾 |
| 类型定义 | 放在 `src/types/`，文件名以 `.types.ts` 结尾 |
| 静态数据 | 放在 `src/data/`，纯数据常量 |
| 物理系统 | 放在 `src/systems/physics/`，**无 Phaser 依赖** |
| 单元测试 | 放在 `tests/unit/`，与源文件目录结构对应 |
| E2E 测试 | 放在 `tests/e2e/`，文件名以 `.spec.ts` 结尾 |
| 资源文件 | 放在 `assets/`，按类型分子目录（sprites/tilemaps/audio）|

**禁止：**
- 在 `src/systems/physics/` 中导入 Phaser
- 在 `src/data/` 中包含任何逻辑（只有数据常量）
- 将类型定义散落在业务文件中（统一放 `src/types/`）

---

## 测试规范

### 覆盖率要求

| 模块 | 最低覆盖率 |
|------|-----------|
| `src/systems/physics/` | **90%+**（核心物理，错误代价高） |
| `src/systems/roguelike/` | **85%+** |
| `src/systems/progression/` | **85%+**（存档逻辑） |
| `src/utils/` | **80%+** |
| `src/data/` | **70%+**（主要验证数据格式） |
| `src/ui/` | **60%+**（UI 交互难以单元测试）|
| 整体项目 | **80%+** |

### 测试分层

```
单元测试（tests/unit/）
  → 覆盖所有纯函数（physics、utils、data 校验）
  → 不依赖 Phaser，不依赖 DOM
  → 每个函数至少 3 个测试用例（正常、边界、异常）

集成测试（tests/integration/）
  → 覆盖状态流转（RunState 变化、MetaProgression 存读）
  → 覆盖 LLM 降级逻辑

E2E 测试（tests/e2e/）
  → 主菜单 → 开始游戏
  → 完整一局比赛流程
  → 存档 → 刷新 → 读档验证
```

### Playwright MCP 验证（CRITICAL）

项目已配置 Playwright MCP 服务器（`.mcp.json`），**每次功能变更或 bug 修复后，必须使用 Playwright MCP 工具进行交互式浏览器验证**。

**工作流程：**
1. 启动开发服务器（`npm run dev`）
2. 使用 `browser_navigate` 打开 `http://localhost:5173`
3. 使用 `browser_snapshot` 获取页面可访问性快照
4. 使用 `browser_click`、`browser_type` 等工具模拟用户操作
5. 每步操作后使用 `browser_take_screenshot` 截图，保存到 `tests/e2e/artifacts/`
6. 确认相关 UI 状态符合预期

**强制要求：**
- 使用 MCP 工具（`browser_*`）而非仅依赖命令行测试
- 新增功能必须有对应的手动 MCP 交互验证
- 截图文件命名：`{功能描述}_{时间戳}.png`

### 运行命令

```bash
npm test                    # 运行所有单元和集成测试
npm run test:watch          # 监视模式（开发时使用）
npm run test:coverage       # 生成覆盖率报告
npm run test:e2e            # 运行 Playwright E2E 测试
```

---

## Git 提交规范

### Commit Message 格式

```
<type>: <description>

[可选 body：解释 "为什么" 而不是 "做了什么"]
```

### Type 列表

| Type | 用途 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `refactor` | 重构（无功能变化） |
| `test` | 添加/修改测试 |
| `docs` | 文档更新 |
| `chore` | 构建/依赖/配置变更 |
| `perf` | 性能优化 |
| `ci` | CI/CD 变更 |
| `art` | 美术资源更新 |
| `audio` | 音频资源更新 |

### 示例

```bash
# 功能开发
feat: 实现纸飞机气动力学引擎

实现 ForceCalculator 和 AerodynamicsEngine，使用固定时间步长积分。
物理模块与 Phaser 完全解耦，可独立单元测试。

# Bug 修复
fix: 修复滑翔型纸飞机在大攻角时升力计算错误

失速角临界值应为 25°，原代码误写为 15°。

# 文档更新
docs: 更新 roadmap 标记 Phase 1 完成

# 美术资源
art: 添加飞镖型纸飞机飞行动画（8帧）
```

### 禁止行为

- 不使用 `git add -A` 或 `git add .`（防止提交敏感文件）
- 不使用 `--no-verify`（不跳过 hooks）
- 不在 commit 中包含 `.env` 文件或 API Key
- 不修改他人的历史 commit（不使用 `git amend` 修改已推送的提交）

---

## 文档更新规范

### 每次变更必须更新的文档

| 变更类型 | 必须更新 |
|----------|----------|
| 任何功能/修复 | `docs/changelog.md` 的 `[未发布]` 章节 |
| 完成 roadmap 任务 | `docs/roadmap.md` 对应任务 `[ ]` → `[x]` |
| 新增模块/文件 | `docs/system-architecture.md` 目录树 |
| 修改游戏机制 | `docs/game-design.md` 对应章节 |
| 修改技术选型 | `docs/tech-selection.md` |

### Changelog 格式

```markdown
## [未发布]（Unreleased）

### 新增（Added）
- 实现 ForceCalculator：升力/阻力/重力纯函数计算

### 变更（Changed）
- AerodynamicsEngine 改用固定时间步长 1/60s

### 修复（Fixed）
- 修复滑翔型纸飞机失速角临界值错误

### 移除（Removed）
- 删除废弃的 OldPhysicsSystem.ts
```

---

## 质量门禁（Check Gates）

### 提交前必须通过

```
[ ] npm test          → 所有测试通过（0 failures）
[ ] npm run typecheck → 无 TypeScript 错误
[ ] npm run lint      → 无 ESLint 错误
[ ] 无硬编码的 API Key 或密码
[ ] docs/changelog.md 已更新
[ ] 不包含调试用的临时代码（`TODO: remove`, `console.log`）
```

### 阶段里程碑前必须通过

```
[ ] npm run test:coverage → 整体覆盖率 ≥ 80%
[ ] npm run test:e2e      → E2E 测试全部通过
[ ] docs/roadmap.md 中本阶段所有任务已勾选
[ ] code-reviewer Agent 审查完成，无 CRITICAL/HIGH 问题
[ ] npm run build 成功，dist/ 可正常运行
```

---

## 常用命令

```bash
# 开发
npm run dev              # 启动开发服务器（热重载）
npm run build            # 生产构建（先 typecheck 再 build）
npm run preview          # 预览生产构建

# 测试
npm test                 # 运行所有测试
npm run test:watch       # 监视模式
npm run test:coverage    # 覆盖率报告
npm run test:e2e         # Playwright E2E

# 代码质量
npm run lint             # ESLint 检查
npm run lint:fix         # ESLint 自动修复
npm run format           # Prettier 格式化
npm run typecheck        # TypeScript 类型检查（不输出文件）
```

---

## Agent 调用规范

### 何时必须调用 Agent

| 场景 | 调用方式 |
|------|----------|
| 完成代码编写/修改后 | `code-reviewer` Agent |
| 开始新功能实现前 | `everything-claude-code:planner` Agent |
| 测试失败时 | `everything-claude-code:tdd-guide` Agent |
| 构建失败时 | `everything-claude-code:build-error-resolver` Agent |
| 存在潜在安全问题时 | `everything-claude-code:security-reviewer` Agent |
| 功能变更/bug 修复后 | Playwright MCP 工具（`browser_*`），交互验证 + 截图 |

### 并行调用（提高效率）

独立任务尽量并行执行：
```
# 例：同时进行代码审查和测试
并行：
  - 运行 npm run test:coverage
  - 调用 code-reviewer Agent
```

---

## 安全规范

- **禁止在代码中硬编码任何密钥/密码/Token**
- 环境变量通过 `.env.local` 管理（已在 `.gitignore` 中排除）
- 可选的 LLM API Key 使用 `VITE_LLM_API_KEY` 环境变量
- 所有 LLM 生成内容必须通过 `ContentValidator` 校验后才能展示
- localStorage 数据不存储任何敏感信息（仅游戏进度）

---

## 中文优先原则

| 内容 | 语言 |
|------|------|
| 文档（README、docs/）| **中文** |
| 代码注释 | **中文**（解释"为什么"） |
| 变量/函数/类名 | **英文**（驼峰命名） |
| 游戏内 UI 文字 | **中文**（通过 `i18n.ts` 管理） |
| Commit Message 描述 | 中英文均可 |
| Git Issue/PR 标题 | **中文** |
