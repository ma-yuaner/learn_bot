export const tracks = [
  {
    id: "environment",
    icon: "◫",
    title: "装备营地",
    source: "VMware / Ubuntu / XShell / XFTP",
    description: "认识主机、虚拟机、操作系统和远程连接，搭好不会互相污染的实验环境。",
    chapters: ["计算机与操作系统", "虚拟化原理", "安装 Ubuntu", "网络与远程连接", "文件传输与环境验收"]
  },
  {
    id: "linux",
    icon: "⌘",
    title: "Linux 荒原",
    source: "Linux（Ubuntu）",
    description: "从目录、文件和权限出发，真正理解命令在操作什么对象。",
    chapters: ["目录树与路径", "文件操作", "文本查看与搜索", "用户与权限", "进程与服务", "软件安装", "网络与故障排查"]
  },
  {
    id: "shell",
    icon: ">_",
    title: "Shell 峡谷",
    source: "Shell",
    description: "把重复命令组织成可靠脚本，理解输入、输出、变量、分支和循环。",
    chapters: ["Shell 与终端", "变量与引用", "管道与重定向", "条件判断", "循环与函数", "脚本工程化"]
  },
  {
    id: "python",
    icon: "Py",
    title: "Python 平原",
    source: "Python",
    description: "从值和变量开始，逐步建立程序执行、数据建模与模块化思维。",
    chapters: ["程序、值与变量", "运算符与表达式", "分支", "循环", "字符串", "容器", "函数", "文件与异常", "面向对象", "模块与包"],
    available: true
  },
  {
    id: "algorithm",
    icon: "◇",
    title: "算法迷宫",
    source: "算法与数据结构",
    description: "学习数据如何组织、算法如何衡量，并能解释每一步复杂度。",
    chapters: ["复杂度", "数组与链表", "栈与队列", "哈希表", "树与堆", "图", "排序与查找", "递归与动态规划"]
  },
  {
    id: "database",
    icon: "DB",
    title: "数据矿井",
    source: "MySQL",
    description: "从表、行、列理解持久化数据，再学习查询、约束、事务与索引。",
    chapters: ["数据库与关系模型", "SQL 基础", "条件与聚合", "多表查询", "约束", "事务", "索引", "数据库设计"]
  },
  {
    id: "data",
    icon: "∑",
    title: "数据群岛",
    source: "NumPy 与 Pandas",
    description: "用数组和表格表达数据，掌握选择、清洗、统计与变换。",
    chapters: ["环境与数组", "维度与形状", "索引与切片", "广播", "Series 与 DataFrame", "清洗", "聚合", "合并与时间序列"]
  },
  {
    id: "math",
    icon: "∫",
    title: "数学山脉",
    source: "数学基础",
    description: "把导数、向量、矩阵和概率连接到模型训练中的真实作用。",
    chapters: ["函数与导数", "偏导与梯度", "向量", "矩阵", "概率", "统计量", "最优化直觉"]
  },
  {
    id: "ml",
    icon: "ML",
    title: "机器学习森林",
    source: "机器学习",
    description: "完成从问题定义、数据准备、训练、验证到解释结果的完整流程。",
    chapters: ["学习问题", "特征与标签", "数据划分", "回归", "分类", "聚类", "指标", "过拟合", "调参与流水线"]
  },
  {
    id: "pytorch",
    icon: "T",
    title: "PyTorch 火山",
    source: "深度学习 - PyTorch",
    description: "理解张量、自动微分、网络、损失和优化器如何共同完成训练。",
    chapters: ["张量", "计算图与梯度", "数据集", "神经网络模块", "损失函数", "优化器", "训练循环", "保存与推理"]
  },
  {
    id: "deep-learning",
    icon: "NN",
    title: "深度学习遗迹",
    source: "CNN / RNN",
    description: "从神经网络基础走向图像与序列建模，并能定位训练问题。",
    chapters: ["神经网络基础", "卷积与特征图", "CNN 架构", "序列数据", "RNN", "LSTM / GRU", "训练诊断", "综合任务"]
  },
  {
    id: "git",
    icon: "Git",
    title: "版本控制港",
    source: "AI 工程补充路线",
    description: "用 Git 保存演进历史，通过分支、评审与 CI 建立可靠协作流程。",
    chapters: ["版本与仓库", "提交", "分支与合并", "远程仓库", "冲突处理", "Pull Request", "GitHub Actions"]
  },
  {
    id: "engineering",
    icon: "SE",
    title: "工程实践城",
    source: "AI 工程补充路线",
    description: "学习项目结构、测试、日志、配置、调试、依赖管理与代码质量。",
    chapters: ["项目结构", "依赖与环境", "单元测试", "集成测试", "调试", "日志与配置", "重构与评审"]
  },
  {
    id: "web-api",
    icon: "API",
    title: "服务接口站",
    source: "AI 工程补充路线",
    description: "理解 HTTP、REST、后端服务、身份认证和数据库如何组成可调用的 AI 产品。",
    chapters: ["网络与 HTTP", "REST API", "FastAPI", "参数与校验", "数据库访问", "认证与权限", "异步任务", "接口测试"]
  },
  {
    id: "deployment",
    icon: "Ops",
    title: "部署云港",
    source: "AI 工程补充路线",
    description: "把本地程序封装、配置、发布并稳定运行在服务器和云环境。",
    chapters: ["Docker", "镜像与容器", "Compose", "环境变量", "反向代理", "CI/CD", "云部署", "监控与回滚"]
  },
  {
    id: "security",
    icon: "Sec",
    title: "安全边境",
    source: "AI 工程补充路线",
    description: "保护密钥、数据、接口与代码执行环境，建立威胁意识和最小权限原则。",
    chapters: ["密钥管理", "输入校验", "认证与授权", "依赖安全", "代码沙箱", "隐私与脱敏", "提示注入防御"]
  },
  {
    id: "mlops",
    icon: "MLO",
    title: "MLOps 中枢",
    source: "AI 工程补充路线",
    description: "管理数据、实验、模型、部署和漂移，让机器学习系统可以持续迭代。",
    chapters: ["实验追踪", "数据版本", "特征流水线", "模型注册", "训练编排", "服务部署", "漂移监控", "再训练"]
  },
  {
    id: "llm",
    icon: "LLM",
    title: "大模型天文台",
    source: "生成式 AI 补充路线",
    description: "理解 Token、Transformer、上下文、推理参数、提示设计和结构化输出。",
    chapters: ["Token 与上下文", "Transformer 直觉", "模型调用", "提示设计", "结构化输出", "工具调用", "缓存与成本"]
  },
  {
    id: "rag",
    icon: "RAG",
    title: "知识检索深井",
    source: "生成式 AI 补充路线",
    description: "构建从文档处理、向量检索到有依据回答的完整知识系统。",
    chapters: ["文档解析", "切分", "Embedding", "向量数据库", "召回", "重排", "生成", "引用与评估"]
  },
  {
    id: "agent",
    icon: "Agt",
    title: "智能体工坊",
    source: "生成式 AI 补充路线",
    description: "设计具备工具、状态、计划、记忆和安全边界的可控 Agent。",
    chapters: ["Agent 循环", "工具协议", "状态与记忆", "规划", "多步骤执行", "失败恢复", "权限边界", "人工确认"]
  },
  {
    id: "ai-evaluation",
    icon: "Eval",
    title: "评估观测塔",
    source: "生成式 AI 补充路线",
    description: "用数据集、指标、追踪和人工标准证明 AI 系统是否正确、稳定且值得上线。",
    chapters: ["评估目标", "测试集", "确定性指标", "LLM 评审", "人工评审", "链路追踪", "回归测试", "线上反馈"]
  }
];

export const firstLesson = {
  id: "python-values-variables",
  trackId: "python",
  title: "01 · 程序、值与变量",
  duration: "35–50 分钟",
  objectives: [
    "区分程序源代码、Python 解释器和程序输出",
    "说明字面量、变量名和值之间的关系",
    "判断 str、int、float、bool 四种基础类型",
    "写出赋值语句，并预测程序从上到下执行后的结果"
  ],
  concepts: [
    {
      term: "程序",
      detail: "程序是一组按规则写下的指令。源代码只是文本；Python 解释器读取这些文本，理解语法，再执行对应操作。"
    },
    {
      term: "值",
      detail: "值是程序处理的数据，例如 7、3.14、\"北京\"、True。不同值拥有不同类型，类型决定它能参与哪些操作。"
    },
    {
      term: "变量",
      detail: "变量是指向某个值的名字。执行 energy = 80 时，先得到整数 80，再让名字 energy 指向它；等号表示赋值，不是数学里的恒等。"
    },
    {
      term: "执行顺序",
      detail: "普通语句默认从上到下依次执行。后一次赋值可以让同一个变量名改为指向新值，因此预测输出时要逐行追踪状态。"
    }
  ],
  types: [
    ["str", "文本", "\"AI 探险家\"", "必须使用引号包围"],
    ["int", "整数", "42", "没有小数点"],
    ["float", "小数", "3.14", "适合表示连续数值"],
    ["bool", "真假", "True", "只有 True 与 False，首字母大写"]
  ],
  referenceTitle: "四种基础值，一次分清",
  referenceDescription: "类型不是标签装饰，它决定数据可以怎样被使用。",
  prediction: {
    code: `name = "探险家"\nlevel = 1\nlevel = level + 1\nprint(f"{name} Lv.{level}")`,
    choices: ["探险家 Lv.1", "探险家 Lv.2", "name Lv.level"],
    answer: "探险家 Lv.2",
    explanation: "第三行先读取 level 当前的值 1，与 1 相加得到 2，再把 level 更新为 2。f 字符串会把花括号中的变量值放入文本。"
  },
  quiz: [
    {
      question: "执行 score = 10 时，最准确的描述是什么？",
      options: ["判断 score 是否等于 10", "让名字 score 指向整数 10", "输出 10"],
      answer: 1,
      reason: "单个等号是赋值。比较是否相等使用两个等号 ==。"
    },
    {
      question: "下面哪个值的类型是 str？",
      options: ["18", "\"18\"", "18.0"],
      answer: 1,
      reason: "引号包围的是文本，即使文本内容看起来像数字。"
    },
    {
      question: "x = 2; x = x * 3; print(x) 的输出是什么？",
      options: ["2", "3", "6"],
      answer: 2,
      reason: "第二条语句读取旧值 2，乘 3 得到 6，再更新 x。"
    }
  ],
  lab: {
    kind: "variables",
    title: "变量工作台",
    subtitle: "修改数据，观察程序状态"
  },
  debugChallenge: {
    code: `energy = 80\nprint("当前能量：" + energy)`,
    question: "这段代码为什么会报错？",
    choices: ["energy 没有定义", "字符串不能直接与整数相加", "print 不能输出变量"],
    answer: 1,
    fix: `print("当前能量：" + str(energy))`,
    explanation: "加号两边分别是 str 和 int。Python 不会猜测你想做文本拼接还是数值相加，需要先用 str(energy) 显式转换，或者使用 f 字符串。"
  },
  explanationChallenge: "为什么 level = level + 1 在程序里成立，而在数学等式里看起来不成立？",
  explanationHint: "建议提到：旧值、计算、赋值、新值……",
  evaluationGroups: [
    ["赋值", "指向", "保存", "更新"],
    ["旧值", "原来", "当前"],
    ["加", "计算", "得到"],
    ["新值", "变成", "重新"]
  ]
};

export const secondLesson = {
  id: "python-expressions",
  trackId: "python",
  title: "02 · 运算符、表达式与类型转换",
  duration: "45–60 分钟",
  objectives: [
    "区分运算符、操作数和表达式",
    "按括号、乘除、加减、比较、逻辑的顺序预测结果",
    "区分数值运算、比较运算和逻辑运算的结果类型",
    "读懂 TypeError，并通过显式类型转换修复"
  ],
  concepts: [
    {
      term: "操作数",
      detail: "被运算的数据叫操作数。例如 price * count 中，price 和 count 是操作数，星号是运算符。"
    },
    {
      term: "表达式",
      detail: "值、变量和运算符可以组成表达式。表达式被执行后一定会得到一个值，这个值还拥有明确类型。"
    },
    {
      term: "优先级",
      detail: "一个表达式有多个运算符时，Python 按优先级决定先后。不要依赖记忆炫技；有歧义时主动加括号表达意图。"
    },
    {
      term: "类型转换",
      detail: "int()、float()、str() 和 bool() 会创建目标类型的值。外部输入通常是字符串，参与计算前必须先验证再转换。"
    }
  ],
  types: [
    ["算术", "+ - * / // % **", "数字 → 数字", "/ 总是得到 float"],
    ["比较", "== != > >= < <=", "任意可比较值 → bool", "比较不是赋值"],
    ["逻辑", "and or not", "条件 → bool/操作数", "not 优先于 and，and 优先于 or"],
    ["转换", "int float str bool", "旧类型 → 新类型", "转换失败会抛出异常"]
  ],
  referenceTitle: "四组操作，追踪结果类型",
  referenceDescription: "预测表达式时，同时写下计算结果和结果类型。",
  prediction: {
    code: `price = 19\ncount = 3\ncoupon = 5\ntotal = price * count - coupon\nprint(total >= 50 and count > 0)`,
    choices: ["52", "True", "False"],
    answer: "True",
    explanation: "先算 19 × 3 - 5 得到 52；52 >= 50 是 True，3 > 0 也是 True；True and True 最终得到 True。"
  },
  quiz: [
    {
      question: "7 / 2 的值和类型是什么？",
      options: ["3，int", "3.5，float", "3，float"],
      answer: 1,
      reason: "Python 中 / 是普通除法，结果为 3.5，类型是 float；// 才是向下取整除法。"
    },
    {
      question: "2 + 3 * 4 的结果是什么？",
      options: ["20", "14", "24"],
      answer: 1,
      reason: "乘法优先于加法，所以先算 3 * 4，再加 2。"
    },
    {
      question: "input() 得到的内容默认是什么类型？",
      options: ["str", "int", "由输入内容自动决定"],
      answer: 0,
      reason: "input() 的返回值始终是 str。需要计算时，应验证内容后显式转换。"
    },
    {
      question: "表达式 not False and 3 > 2 的结果是什么？",
      options: ["False", "True", "3"],
      answer: 1,
      reason: "not False 得到 True，3 > 2 也得到 True，所以结果为 True。"
    }
  ],
  lab: {
    kind: "expressions",
    title: "表达式实验台",
    subtitle: "拆分复杂计算，观察中间值和类型"
  },
  debugChallenge: {
    code: `age_text = "18"\nnext_year = age_text + 1`,
    question: "哪种修复既明确又能完成数值加法？",
    choices: ["next_year = age_text + \"1\"", "next_year = int(age_text) + 1", "next_year = str(1)"],
    answer: 1,
    fix: `next_year = int(age_text) + 1`,
    explanation: "字符串 \"18\" 代表文本。先用 int() 得到整数 18，再加 1 才是数值运算。拼接 \"1\" 会得到文本 \"181\"。"
  },
  explanationChallenge: "为什么从 input() 得到的“18”不能直接加 1？请讲清值、类型、运算意图和修复方式。",
  explanationHint: "建议提到：input、str、数值加法、int()、转换失败……",
  evaluationGroups: [
    ["input", "输入"],
    ["str", "字符串", "文本"],
    ["数值", "加法", "计算"],
    ["int", "转换"],
    ["异常", "失败", "验证"]
  ]
};

export const thirdLesson = {
  id: "python-branches",
  trackId: "python",
  title: "03 · 条件判断与程序分支",
  duration: "50–65 分钟",
  objectives: [
    "说明条件表达式如何决定程序执行路径",
    "正确使用 if、elif 和 else，并理解互斥分支",
    "使用 and、or、not 组合边界条件",
    "通过真值表和路径追踪检查遗漏与不可达分支"
  ],
  concepts: [
    {
      term: "条件",
      detail: "if 后面需要一个能够判断真假的表达式。结果为真时进入缩进代码块，为假时跳过该块。"
    },
    {
      term: "分支",
      detail: "分支让同一程序根据状态选择不同路径。if/elif/else 链从上到下检查，命中第一个为真的条件后便不再检查后续分支。"
    },
    {
      term: "缩进",
      detail: "Python 使用缩进表示代码块。属于同一分支的语句必须保持一致缩进；缩进不是排版偏好，而是语法结构。"
    },
    {
      term: "边界",
      detail: "条件最容易在边界值出错。例如 60 分是否及格，必须明确使用 >= 60 还是 > 60，并测试边界两侧。"
    }
  ],
  types: [
    ["if", "首个条件", "if energy >= 60:", "条件为真时进入"],
    ["elif", "追加条件", "elif energy >= 30:", "前面未命中才检查"],
    ["else", "兜底路径", "else:", "前面全部为假时进入"],
    ["组合", "and / or / not", "sunny and energy > 0", "复杂条件建议拆成命名变量"]
  ],
  referenceTitle: "分支链的四个关键结构",
  referenceDescription: "先定义互斥区间，再从最严格条件向下排列。",
  prediction: {
    code: `energy = 60\nweather = "rain"\nif energy >= 80 and weather == "sunny":\n    action = "远征"\nelif energy >= 50:\n    action = "训练"\nelse:\n    action = "休息"\nprint(action)`,
    choices: ["远征", "训练", "休息"],
    answer: "训练",
    explanation: "第一个条件虽然能量比较失败，而且天气也不是 sunny，因此为 False；第二个条件 60 >= 50 为 True，进入“训练”分支，后续 else 不再执行。"
  },
  quiz: [
    {
      question: "score 恰好为 60，要求 60 分及以上及格，应使用哪个条件？",
      options: ["score > 60", "score >= 60", "score == 60"],
      answer: 1,
      reason: "“及以上”包含边界值 60，因此应使用 >=。"
    },
    {
      question: "if/elif/else 链中两个条件都为 True，会执行几个分支？",
      options: ["只执行第一个命中的分支", "两个都执行", "只执行最后一个"],
      answer: 0,
      reason: "这是互斥分支链。命中第一个 True 后，后续 elif 和 else 都会跳过。"
    },
    {
      question: "表示“有钥匙并且门没有锁”的条件是？",
      options: ["has_key or not locked", "has_key and not locked", "not has_key and locked"],
      answer: 1,
      reason: "两个要求必须同时满足，所以使用 and；“没有锁”写作 not locked。"
    },
    {
      question: "检查分支边界最有效的一组数据是什么？",
      options: ["只测一个正常值", "边界值及其前后相邻值", "只测最大值"],
      answer: 1,
      reason: "边界值、边界前和边界后能够暴露 > 与 >=、区间重叠或遗漏问题。"
    }
  ],
  lab: {
    kind: "conditions",
    title: "路径决策台",
    subtitle: "改变状态，追踪程序选择了哪条路径"
  },
  debugChallenge: {
    code: `score = 85\nif score >= 60:\n    grade = "及格"\nelif score >= 80:\n    grade = "优秀"\nprint(grade)`,
    question: "为什么 85 分只得到“及格”？",
    choices: ["elif 永远不能比较数字", "较宽的条件先命中，使优秀分支不可达", "score 应该写成字符串"],
    answer: 1,
    fix: `if score >= 80:\n    grade = "优秀"\nelif score >= 60:\n    grade = "及格"`,
    explanation: "85 同时满足 >= 60 和 >= 80，但程序只执行第一个命中的分支。应先检查更严格、更窄的 >= 80，再检查 >= 60。"
  },
  explanationChallenge: "为什么 if score >= 60 写在 if score >= 80 前面会导致“优秀”分支不可达？如何系统检查这类问题？",
  explanationHint: "建议提到：从上到下、第一个 True、区间包含、边界测试……",
  evaluationGroups: [
    ["从上到下", "顺序"],
    ["第一个", "命中"],
    ["包含", "范围", "区间"],
    ["不可达", "跳过"],
    ["边界", "测试"]
  ]
};

export const pythonLessons = [firstLesson, secondLesson, thirdLesson];

export const assessmentLevels = [
  {
    level: "L1",
    title: "知识点考核",
    evidence: "定义、辨析、代码预测、最小操作",
    pass: "核心测验 ≥ 80%，并完成对应实操"
  },
  {
    level: "L2",
    title: "模块考核",
    evidence: "把多个知识点组合成一个可运行功能",
    pass: "功能通过验收，能够解释输入、处理和输出"
  },
  {
    level: "L3",
    title: "框架考核",
    evidence: "架构图、模块边界、数据流、异常流和取舍",
    pass: "不看答案讲清全流程，并能从零搭出最小骨架"
  },
  {
    level: "L4",
    title: "综合项目考核",
    evidence: "跨区域项目、测试、排错、复盘和文档",
    pass: "独立完成需求，能够证明正确性并分析改进方向"
  },
  {
    level: "L5",
    title: "面试官关卡",
    evidence: "限时问答、追问、现场编码、系统设计和项目深挖",
    pass: "结论正确、推理透明、代码可验证、不会时能合理定位"
  }
];
