# PPaper — 折翼传说

> 一款 Roguelike 2D 像素风纸飞机比赛浏览器游戏

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Phaser 3](https://img.shields.io/badge/Phaser-3.90-orange)](https://phaser.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 游戏简介

**折翼传说（PPaper）** 是一款以纸飞机为核心的 Roguelike 浏览器游戏。玩家从一个普通的校园少年出发，收集各种折法的纸飞机，挑战来自全国各地的对手，在一次次随机生成的赛道中磨练技术，最终登上世界纸飞机大赛的舞台。

- **无需安装** — 直接在手机或桌面浏览器中游玩
- **碎片时间** — 单局 5-15 分钟，随时开始随时结束
- **每局不同** — Roguelike 机制保证每次比赛都有新体验

*（游戏截图占位）*

---

## 游戏特色

- **真实飞行物理** — 基于升力/阻力/重力/风力的二维气动力学模型，飞镖型速度奔放，滑翔型轻盈持久
- **Roguelike 循环** — 程序化生成的赛道（风向、障碍、热气流）+ 随机技能/物品掉落，每局不重复
- **收集与养成** — 数十种纸飞机图纸、技能和装备，稀有度从普通到传说
- **折纸知识** — 解锁新纸飞机的同时学习真实的纸飞机折法
- **AI 动态内容** — 由 WebLLM 在客户端生成独特的纸飞机名称和故事背景（零服务器成本）
- **像素风美术** — 暖色调 GBA 风格像素画，视差滚动比赛场景
- **移动端优化** — 触控友好设计，支持虚拟摇杆操作

---

## 快速开始

### 环境要求

- Node.js 20+
- npm 10+

### 安装与运行

```bash
git clone https://github.com/xndcn/ppaper.git
cd ppaper
npm install
npm run dev
```

打开浏览器访问 `http://localhost:5173`。

### 构建发布版本

```bash
npm run build
# 生成 dist/ 目录，可直接上传至静态托管平台
```

---

## 技术栈

| 领域 | 技术 | 选型理由 |
|------|------|----------|
| 游戏框架 | [Phaser 3](https://phaser.io/) | 最成熟的 H5 游戏框架，内置物理引擎，Aseprite 原生支持 |
| 飞行物理 | 自定义气动力学模型 | 精确控制升力/阻力/攻角，与 Phaser 解耦可单元测试 |
| 碰撞物理 | Matter.js（Phaser 内置） | 障碍物碰撞检测 |
| Roguelike 工具 | [rot.js](https://ondras.github.io/rot.js/) | 成熟的过程化生成算法库（地图/RNG/FOV）|
| AI 内容生成 | [WebLLM](https://github.com/mlc-ai/web-llm) | 客户端推理，零服务器成本，离线可用 |
| 构建工具 | [Vite 6](https://vite.dev/) | 极速 HMR，TypeScript 原生支持 |
| 测试框架 | [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/) | 单元/集成/E2E 覆盖 |
| 像素美术 | [Aseprite](https://www.aseprite.org/) | 行业标准，Phaser 原生兼容 |
| 部署 | [Cloudflare Pages](https://pages.cloudflare.com/) | 免费无限带宽，全球 CDN |

详细选型依据见 [技术选型文档](docs/tech-selection.md)。

---

## 项目文档

| 文档 | 说明 |
|------|------|
| [📋 技术选型](docs/tech-selection.md) | 框架/工具对比与最终决策 |
| [🎮 游戏设计](docs/game-design.md) | 完整游戏机制、系统、物理模型 |
| [🏗️ 系统架构](docs/system-architecture.md) | 代码模块设计、数据流、文件结构 |
| [🗺️ 开发路线图](docs/roadmap.md) | Phase 0-10 分阶段任务清单 |
| [📝 更新日志](docs/changelog.md) | 版本历史记录 |

---

## 开发指南

所有开发规范（工作流程、代码规范、测试要求、提交格式）请阅读 **[CLAUDE.md](CLAUDE.md)**。

该文件同时作为 AI Agent 的工作指南，规范了代码审查、文档更新和质量门禁流程。

### 常用命令

```bash
npm run dev              # 开发服务器
npm test                 # 运行测试
npm run test:coverage    # 测试覆盖率报告
npm run test:e2e         # E2E 测试
npm run lint             # 代码检查
npm run build            # 生产构建
```

---

## 当前进度

> 🚧 **Phase 0 — 项目初始化** 进行中

详细进度见 [开发路线图](docs/roadmap.md)。

---

## 贡献

欢迎 Issue 和 Pull Request！提交前请阅读 [CLAUDE.md](CLAUDE.md) 中的开发规范。

---

## 致谢

- [Phaser](https://phaser.io/) — 强大的 HTML5 游戏框架
- [rot.js](https://ondras.github.io/rot.js/) — Roguelike 算法工具库
- [WebLLM](https://github.com/mlc-ai/web-llm) — 浏览器端 LLM 推理框架
- [Princeton Paper Airplane Research](https://stengel.mycpanel.princeton.edu/PaperPlane.html) — 纸飞机气动力学参考
- [Fold 'N Fly](https://www.foldnfly.com) — 折纸飞机设计参考

---

## 许可证

本项目采用 [MIT License](LICENSE)。
