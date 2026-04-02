# 技术选型文档

> 本文档记录 PPaper（折翼传说）的技术选型过程、各方案对比及最终决策依据。

## 目录

- [一、项目技术需求](#一项目技术需求)
- [二、游戏框架选型](#二游戏框架选型)
- [三、物理引擎选型](#三物理引擎选型)
- [四、Roguelike 工具选型](#四roguelike-工具选型)
- [五、像素美术管线](#五像素美术管线)
- [六、LLM 集成方案](#六llm-集成方案)
- [七、开发工具链](#七开发工具链)
- [八、部署方案](#八部署方案)
- [九、决策总结](#九决策总结)

---

## 一、项目技术需求

| 需求 | 说明 |
|------|------|
| 跨端支持 | 手机浏览器 + 桌面浏览器，无需安装 |
| 静态部署 | 支持 Cloudflare Pages / GitHub Pages 等静态托管，无需后端服务器 |
| 2D 像素风 | 像素艺术风格，16x16 / 32x32 方块，无抗锯齿缩放 |
| 物理仿真 | 重力、风力、纸飞机气动力学（升力/阻力）实时模拟 |
| 过程化生成 | Roguelike 赛道、掉落物、随机事件的程序化生成 |
| LLM 集成 | 动态生成纸飞机名称/描述、技能文案，客户端优先（零服务器成本） |
| TypeScript | 团队偏好强类型，便于 AI Agent 理解和维护代码 |
| 碎片时间 | 单局 5-15 分钟，流畅的移动端触控交互 |

---

## 二、游戏框架选型

### 候选方案

| 框架 | 版本 | 语言 | 物理引擎 | 像素支持 | 移动端 | 静态部署 | 社区规模 |
|------|------|------|----------|----------|--------|----------|----------|
| **Phaser 3** | 3.90（v4 RC6） | JS/TS | Matter.js 内置 | ✅ 原生 pixelArt 模式 | ✅ 触控 API | ✅ 纯 HTML/JS | ⭐⭐⭐⭐⭐ ~38k stars |
| Godot 4 + HTML5 | 4.x | GDScript | 内置 2D | ✅ | ✅（Safari 有坑） | ✅ WASM | ⭐⭐⭐⭐⭐ ~93k stars |
| PixiJS | 8.x | JS/TS | ❌ 无内置 | ✅ | ✅ | ✅ | ⭐⭐⭐⭐ ~46k stars |
| KAPLAY | 3001.x | JS/TS | Arcade 内置 | ✅ | ✅ | ✅ | ⭐⭐⭐ ~5k stars |
| Excalibur.js | 0.29.x | TypeScript | 自研 | ✅ | ✅ | ✅ | ⭐⭐ ~2.2k stars |
| Macroquad (Rust) | 0.4.x | Rust | ❌ 需自实现 | ✅ | ✅ | ✅ WASM | ⭐⭐ ~3k stars |

### 关键对比维度

**Phaser 3 的核心优势：**

1. **内置 Matter.js**：零配置即可使用完整 2D 刚体物理，适合纸飞机的重力/碰撞仿真
2. **原生 Aseprite 支持**：`this.load.aseprite()` 直接加载精灵图和 JSON 动画数据，无需额外中间件
3. **场景系统**：天然支持大世界地图（俯视）与横版比赛场景（侧视）的切换，场景间数据传递简洁
4. **移动端优化**：Phaser 4 的 Beam 渲染器针对移动端提升性能最高 16x，虚拟摇杆 API 完善
5. **静态部署**：构建产物是纯 HTML/JS/Assets，兼容所有静态托管平台
6. **成熟的 Roguelike 生态**：与 rot.js、mikewesthad/dungeon 等库无缝配合
7. **LLM 集成**：标准 `fetch()` 调用 LLM API，已有社区案例（obanb/llm-phaser-game）

**Godot 4 排除原因：**
- C# 项目无法导出 HTML5（只能用 GDScript）
- Safari/iOS 的 WASM 存在兼容性问题，需要大量额外测试
- 工具链更重（需要安装 Godot 编辑器），不适合纯代码流程

**PixiJS 排除原因：**
- 纯渲染库，无物理/场景管理/输入处理，需自行组装，开发成本高

### ✅ 决策：Phaser 3（TypeScript）

当前使用 Phaser 3.90 稳定版；Phaser 4 RC 阶段完成后可平滑升级（API 兼容）。

---

## 三、物理引擎选型

### 候选方案

| 引擎 | 类型 | 集成方式 | 适用场景 |
|------|------|----------|----------|
| **Matter.js**（Phaser 内置） | 2D 刚体 | 零配置 | 碰撞检测、障碍物、世界边界 |
| **自定义气动力学模型** | 航空力学 | 手写 | 纸飞机飞行仿真（升力/阻力/风力） |
| Planck.js | Box2D JS 移植 | 手动集成 | 更高精度刚体 |
| p2.js | 完整 2D 物理 | 手动集成 | 复杂约束/弹簧 |

### 纸飞机物理模型

纸飞机飞行涉及四个力：

```
重力 (Gravity):   F_g = m × g                            （恒定向下）
升力 (Lift):      F_l = 0.5 × ρ × v² × C_l(α) × A       （垂直于速度向量）
阻力 (Drag):      F_d = 0.5 × ρ × v² × C_d(α) × A       （反向于速度向量）
推力 (Thrust):    仅初始投掷冲量，释放后为零
```

其中：
- `ρ`：空气密度（1.225 kg/m³）
- `v`：速度
- `C_l(α)`：升力系数，是攻角 α 的函数（小角度近似：`C_l ≈ 2π × α`）
- `C_d(α)`：阻力系数，攻角函数
- `A`：翼面积
- 最优攻角约 9.3°，此时升阻比 L/D ≈ 5.2

**设计决策：**
- **Matter.js** 处理世界中的碰撞（障碍物、地面、边界）
- **自定义气动力学模块** `AerodynamicsEngine` 逐帧计算四力，与 Phaser 完全解耦（纯函数，可单独单元测试）
- 风力系统：恒定风向 + 程序化阵风 + 局部热气流区域

### ✅ 决策：Matter.js（碰撞）+ 自定义气动力学模型（飞行）

---

## 四、Roguelike 工具选型

### 候选方案

| 工具 | Stars | 功能 |
|------|-------|------|
| **rot.js** | ~2k | RNG、地图生成（BSP/Cellular/Digger）、FOV、路径寻径、调度器 |
| mikewesthad/dungeon | ~600 | Phaser 专用地牢生成 |
| 自研 | — | 完全可控，开发成本高 |

### 选择 rot.js 的理由

- TypeScript 原生支持
- 包含 Roguelike 所需的全套算法（噪声、RNG 种子、地图生成、FOV、路径）
- 与 Phaser 3 完美配合（纯逻辑库，不依赖 DOM）
- 文档完善，社区案例丰富

### ✅ 决策：rot.js

---

## 五、像素美术管线

### 工具选型

| 工具 | 类型 | 价格 | 推荐理由 |
|------|------|------|----------|
| **Aseprite** | 桌面应用 | $20 | 行业标准，原生导出 Phaser 兼容的 JSON 精灵图集，支持 CLI 批处理 |
| Piskel | 浏览器 | 免费 | 快速原型，功能受限 |
| PixelLab | 浏览器 + 插件 | 免费/付费 | AI 生成像素图，早期占位用 |

### 管线流程

```
Aseprite 创建精灵 + 动画
    ↓
导出：File > Export Sprite Sheet
    - 格式：Packed 布局
    - 输出：sprite.png + sprite.json
    ↓
放入 assets/sprites/
    ↓
Phaser 加载：
    this.load.aseprite('name', 'sprite.png', 'sprite.json')
    this.anims.createFromAseprite('name')
```

CLI 批量导出：
```bash
aseprite --batch sprite.aseprite --sheet sprite.png --data sprite.json
```

### ✅ 决策：Aseprite → JSON+PNG 精灵图集 → Phaser 原生加载

---

## 六、LLM 集成方案

### 候选方案

| 方案 | 成本 | 延迟 | 离线支持 | 适用场景 |
|------|------|------|----------|----------|
| **WebLLM**（客户端 WASM） | 零 | 中等（首次下载模型） | ✅ | 实时生成名称/描述 |
| OpenAI / Anthropic API | 按 token 计费 | 低 | ❌ | 复杂叙事生成 |
| 预生成静态内容 | 零 | 零 | ✅ | 兜底方案 |
| MediaPipe LLM | 零 | 低（设备推理） | ✅ | Chrome 优先 |

### WebLLM 技术细节

- 基于 WebGPU + WASM，4-bit 量化 3B 模型在 M3 上约 90 tok/s
- 支持结构化 JSON 输出（通过 WASM 语法引擎），保证输出格式正确
- OpenAI 兼容 API，代码迁移成本低
- 支持 Web Worker，不阻塞主线程
- 适合的模型：Phi-3 mini、Qwen 2.5-1.5B、Gemma 2B

### 集成策略

```
优先级 1：静态预生成内容（src/data/ 目录下的 JSON 文件）
优先级 2：WebLLM 客户端生成（设备支持 WebGPU 时）
优先级 3：API 调用（可选，用户配置 API Key 时）
```

### 内容生成场景

| 场景 | 模型大小 | 输出格式 |
|------|----------|----------|
| 纸飞机命名 | 1.5B | `{ "name": "...", "description": "..." }` |
| 技能文案 | 1.5B | `{ "name": "...", "flavor": "..." }` |
| 赛事故事 | 3B | `{ "story": "...", "npc_dialogue": "..." }` |
| 新纸飞机设计参数 | 3B | `{ "type": "...", "attributes": {...} }` |

### ✅ 决策：WebLLM（客户端）+ 静态内容兜底，可选 API 扩展

---

## 七、开发工具链

| 工具 | 版本 | 用途 |
|------|------|------|
| **TypeScript** | 5.x（strict 模式） | 主开发语言 |
| **Vite** | 6.x | 构建工具（热重载、代码分割、资源处理） |
| **ESLint** | 9.x | 代码静态检查 |
| **Prettier** | 3.x | 代码格式化 |
| **Vitest** | 2.x | 单元测试 + 集成测试 |
| **Playwright** | 1.x | E2E 测试 |
| **Phaser 3** | 3.90 | 游戏框架 |
| **rot.js** | 2.x | Roguelike 算法库 |
| **WebLLM** | 0.2.x | 客户端 LLM 推理 |

### Vite 关键配置

```typescript
// vite.config.ts（示例）
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser'],    // Phaser 单独分包，充分利用浏览器缓存
          webllm: ['@mlc-ai/web-llm'],
        }
      }
    }
  }
}
```

---

## 八、部署方案

### 候选平台对比

| 平台 | 费用 | 带宽 | 单文件大小 | 特点 |
|------|------|------|------------|------|
| **Cloudflare Pages** | 免费 | 无限制 | 25MB | 全球 CDN，零带宽费用，最适合游戏 |
| Netlify | 免费起 | 100GB/月 | 50MB | 开发体验好，部署预览 |
| GitHub Pages | 免费 | ~100GB/月 | 100MB | 最简单，适合早期 |
| itch.io | 免费 | — | — | 游戏专属平台，自带受众 |

### ✅ 决策：GitHub Pages（主部署） + itch.io（游戏发现）

**部署流程：**
```bash
npm run build          # 生成 dist/ 目录
# 推送到 GitHub main 分支 → GitHub Actions 自动构建部署到 gh-pages 分支
```

---

## 九、决策总结

| 技术领域 | 选型决策 | 核心理由 |
|----------|----------|----------|
| 游戏框架 | **Phaser 3 (TypeScript)** | 内置物理、Aseprite 支持、最大社区、静态部署 |
| 碰撞物理 | **Matter.js**（Phaser 内置） | 零配置，适合世界碰撞 |
| 飞行物理 | **自定义气动力学模型** | 精确控制升力/阻力/风力，纯函数可单元测试 |
| Roguelike 工具 | **rot.js** | 成熟算法库，TypeScript 支持 |
| 像素美术 | **Aseprite** | 行业标准，Phaser 原生兼容 |
| LLM（客户端） | **WebLLM** | 零服务器成本，离线可用 |
| 构建工具 | **Vite 6** | 最快 HMR，TypeScript 原生 |
| 测试框架 | **Vitest + Playwright** | 与 Vite 生态无缝集成 |
| 部署平台 | **GitHub Pages** | 免费，与 GitHub Actions CI/CD 原生集成 |
| 许可证 | **MIT** | 最宽松，允许社区贡献 |
