export const modules = [
  {
    id: "discover",
    order: "01",
    eyebrow: "DISCOVERY",
    title: "问题与边界",
    summary: "先确认用户、痛点、数据归属和非目标，再决定是否写代码。",
    status: "ready",
    problem: "团队看不到工具使用过程，讨论容易停留在主观感受。",
    outcome: "形成可验证的问题定义、统一语言和明确非目标。",
    architecture: {
      nodes: [
        { id: "user", label: "User", role: "提出目标并拥有数据" },
        { id: "listener", label: "Listener", role: "收集原始事件" },
        { id: "server", label: "Server", role: "验证、聚合和查询" }
      ],
      edges: [
        { from: "user", to: "listener", label: "产生会话" },
        { from: "listener", to: "server", label: "提交事件" }
      ]
    },
    decisions: [
      { question: "为谁构建？", choice: "先服务一个明确团队", reason: "缩小权限和指标口径", tradeoff: "暂不覆盖公众 SaaS" },
      { question: "先写代码吗？", choice: "先固定统一语言", reason: "避免模块对同一词理解不同", tradeoff: "前期需要投入讨论时间" }
    ],
    walkthrough: [
      { title: "收集原始问题", detail: "只记录观察，不提前写解决方案。", evidence: "问题清单" },
      { title: "连续追问", detail: "确认用户、数据、部署和失败边界。", evidence: "决策日志" },
      { title: "定义语言", detail: "每个术语有定义、身份和生命周期。", evidence: "术语表" }
    ],
    interaction: {
      title: "项目阶段决策器",
      prompt: "选择团队规模和首要目标，观察推荐策略。",
      controls: [
        { id: "team", label: "团队", options: [["small", "小团队"], ["growth", "增长期"]] },
        { id: "goal", label: "目标", options: [["learn", "验证问题"], ["scale", "扩大吞吐"]] }
      ],
      outcomes: [
        { when: { team: "small", goal: "learn" }, result: "单体 + 最小数据模型", explanation: "优先缩短反馈路径并保留演进接口。" },
        { when: { team: "growth", goal: "scale" }, result: "拆分接入适配器和核心服务", explanation: "只有吞吐与团队边界同时出现证据时才增加部署单元。" }
      ],
      fallback: { result: "先建立可观测的单体边界", explanation: "没有足够证据时，选择最容易验证和回滚的方案。" }
    },
    assessment: [
      { question: "统一语言的主要价值是什么？", options: ["减少跨模块语义歧义", "让代码自动完成", "增加服务数量"], answer: 0, explanation: "共同语言让需求、模型和接口使用同一含义。" }
    ],
    deliverables: ["问题定义", "非目标", "统一语言", "首份架构决策记录"]
  },
  {
    id: "build",
    order: "02",
    eyebrow: "IMPLEMENTATION",
    title: "最小纵向切片",
    summary: "贯通一个真实输入到可验证输出，先证明架构边界能工作。",
    status: "building",
    problem: "只有分层目录，没有穿过所有边界的可运行证据。",
    outcome: "一条输入经过验证、领域处理和存储后可查询。",
    architecture: {
      nodes: [
        { id: "adapter", label: "Adapter", role: "转换外部格式" },
        { id: "domain", label: "Domain", role: "维护业务不变量" },
        { id: "store", label: "Store", role: "持久化事实" }
      ],
      edges: [
        { from: "adapter", to: "domain", label: "统一命令" },
        { from: "domain", to: "store", label: "领域事件" }
      ]
    },
    decisions: [
      { question: "先做多少接入？", choice: "只做一个真实来源", reason: "先验证核心契约", tradeoff: "兼容矩阵暂时较小" }
    ],
    walkthrough: [
      { title: "解析", detail: "保留原始事件并生成统一输入。", evidence: "契约测试" },
      { title: "处理", detail: "领域层验证身份和顺序。", evidence: "单元测试" },
      { title: "查询", detail: "从持久化结果生成一个用户可见答案。", evidence: "端到端测试" }
    ],
    interaction: {
      title: "失败策略实验",
      prompt: "选择事件状态。",
      controls: [{ id: "event", label: "事件", options: [["valid", "合法"], ["duplicate", "重复"], ["broken", "损坏"]] }],
      outcomes: [
        { when: { event: "valid" }, result: "接收并聚合", explanation: "通过模式和领域不变量后持久化。" },
        { when: { event: "duplicate" }, result: "幂等忽略", explanation: "相同事件键不能重复改变状态。" },
        { when: { event: "broken" }, result: "隔离并记录证据", explanation: "不能让单条坏记录阻断整个接入流。" }
      ],
      fallback: { result: "拒绝未知状态", explanation: "未知输入不得静默进入核心模型。" }
    },
    assessment: [
      { question: "纵向切片应证明什么？", options: ["一个真实用例贯通全部必要边界", "目录数量足够多", "所有未来功能已完成"], answer: 0, explanation: "可运行证据比空分层更能验证架构。" }
    ],
    deliverables: ["一个真实 adapter", "领域不变量", "持久化迁移", "端到端测试"]
  },
  {
    id: "operate",
    order: "03",
    eyebrow: "OPERATIONS",
    title: "部署与运行证据",
    summary: "让项目可以安装、观察、恢复和安全升级。",
    status: "planned",
    problem: "本地能运行不代表团队可以可靠使用。",
    outcome: "形成部署、监控、备份、恢复和升级闭环。",
    architecture: {
      nodes: [
        { id: "binary", label: "Application", role: "单一发布单元" },
        { id: "database", label: "Database", role: "持久化状态" },
        { id: "operator", label: "Operator", role: "部署与恢复" }
      ],
      edges: [
        { from: "operator", to: "binary", label: "配置/升级" },
        { from: "binary", to: "database", label: "事务读写" }
      ]
    },
    decisions: [
      { question: "怎样发布？", choice: "固定版本和可逆迁移", reason: "故障时可定位并回滚", tradeoff: "发布流程需要额外验证" }
    ],
    walkthrough: [
      { title: "部署", detail: "用最少步骤启动并通过健康检查。", evidence: "部署脚本" },
      { title: "观察", detail: "记录延迟、错误、容量和版本。", evidence: "运行面板" },
      { title: "恢复", detail: "从备份重建并验证数据。", evidence: "恢复演练" }
    ],
    interaction: {
      title: "故障响应演练",
      prompt: "选择故障类型。",
      controls: [{ id: "failure", label: "故障", options: [["latency", "延迟升高"], ["migration", "迁移失败"]] }],
      outcomes: [
        { when: { failure: "latency" }, result: "先定位链路与容量", explanation: "通过指标区分入口、业务和存储瓶颈。" },
        { when: { failure: "migration" }, result: "停止发布并执行回滚", explanation: "迁移必须具备兼容窗口和恢复路径。" }
      ],
      fallback: { result: "收集证据再行动", explanation: "未知故障禁止盲目重启掩盖现场。" }
    },
    assessment: [
      { question: "为什么必须演练恢复？", options: ["备份存在不等于能够成功恢复", "可以增加页面数量", "部署后不再需要数据"], answer: 0, explanation: "只有实际恢复和校验才能证明备份有效。" }
    ],
    deliverables: ["安装说明", "健康检查", "监控指标", "备份恢复演练", "升级回滚流程"]
  }
];
