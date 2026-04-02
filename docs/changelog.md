# 更新日志

> 本项目遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/) 格式。
> 版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

---

## [未发布]（Unreleased）

### 新增（Added）

### 变更（Changed）

- 将 `docs/roadmap.md` 从粗粒度任务列表细化为 69 个 Agent 可执行子任务（X.Y 编号）
  - 每个子任务明确：创建/修改文件、使用 Agent、验证命令、依赖关系、工作量
  - 新增并行任务说明和关键路径分析
  - 新增阶段概览汇总表（含子任务数和预估工作量）
- 部署平台从 Cloudflare Pages 改为 GitHub Pages
  - `docs/roadmap.md`：子任务 0.7 / 10.2 更新为 GitHub Pages 配置（`vite base`、`deploy.yml`、`404.html`）
  - `docs/tech-selection.md`：第八章决策及第九章总结表更新
  - `docs/system-architecture.md`：7.3 节替换为 GitHub Actions workflow 配置

### 修复（Fixed）

### 移除（Removed）

---

## [0.1.0] — 2026-04-02

### 新增（Added）

- 项目文档初始化
  - `README.md`：项目总览和快速开始
  - `CLAUDE.md`：Agent 开发工作流规范
  - `docs/tech-selection.md`：技术选型对比与决策文档
  - `docs/game-design.md`：完整游戏设计规格文档
  - `docs/system-architecture.md`：系统架构设计文档
  - `docs/roadmap.md`：分阶段开发路线图（Phase 0-10）
  - `docs/changelog.md`：本文件
- 确定游戏名称：英文 PPaper，中文 折翼传说
- 确定技术栈：Phaser 3 + TypeScript + Vite + rot.js + WebLLM
- 确定部署方案：Cloudflare Pages 静态部署
- 确定许可证：MIT
