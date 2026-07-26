# Project Showcase Shell

一个无第三方依赖、内容驱动的通用项目展示框架。它适合展示学习项目、开源工具、业务系统、架构方案或作品集。

## 快速使用

```bash
npm run dev
```

访问 <http://localhost:4180>。

只需要重点修改：

- `project.config.js`：名称、摘要、状态、版本、主题和指标。
- `data/modules.js`：模块、架构、决策、流程、交互、测验和交付证据。

框架核心：

- `app.js`：通用渲染和本地状态，不放具体项目文案。
- `lib/schema.js`：内容协议验证。
- `styles.css`：响应式视觉系统。

## 内容协议

每个模块包含：

1. `problem/outcome`：为什么做和完成后得到什么。
2. `architecture`：节点、职责和有向数据流。
3. `decisions`：问题、选择、原因和代价。
4. `walkthrough`：运行步骤与验收证据。
5. `interaction`：纯配置的场景选择与结果。
6. `assessment`：理解度测验和反馈。
7. `deliverables`：可勾选、可持久化的交付清单。

新增内容后运行：

```bash
npm run check
npm test
```

不要在 `app.js` 中硬编码新项目内容；如果需要全新的交互类型，应先把它设计成可复用协议，再扩展框架。
