import { advancedPythonLessons } from "./python-advanced.js";
import { dataStructureLessons } from "./data-structures.js";
import { databaseLessons } from "./database-lessons.js";

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
    chapters: ["程序、值与变量", "运算符与表达式", "分支", "循环", "字符串与容器", "函数", "文件与异常", "面向对象", "模块、包与环境", "高级语法与迭代", "并发与 GIL", "网络、HTTP 与正则", "工程化与毕业考核"],
    available: true
  },
  {
    id: "algorithm",
    icon: "◇",
    title: "算法迷宫",
    source: "算法与数据结构",
    description: "学习数据如何组织、算法如何衡量，并能解释每一步复杂度。",
    chapters: ["复杂度与增长率", "数组", "单向与双向链表", "栈", "队列与双端队列", "哈希表", "二叉树", "二叉搜索树", "堆与优先队列", "图", "排序", "二分查找", "递归", "回溯", "动态规划", "工程选型与面试"],
    available: true
  },
  {
    id: "database",
    icon: "DB",
    title: "数据矿井",
    source: "MySQL",
    description: "从表、行、列理解持久化数据，再学习查询、约束、事务与索引。",
    chapters: ["数据库与关系模型", "SQL 基础", "条件与聚合", "多表查询", "约束", "事务", "索引", "数据库设计"],
    available: true
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
    id: "architecture-decisions",
    icon: "ADR",
    title: "架构决策峰",
    source: "工程架构补充路线",
    description: "根据公司阶段、团队、流量、风险、预算和运维成熟度选择架构与工具，并规划演进触发点。",
    chapters: ["约束与质量属性", "单体与模块化单体", "微服务", "事件驱动", "Serverless", "数据与存储选型", "缓存与消息", "容器与编排", "可观测性", "架构演进与 ADR", "全局工具选择", "宏观情景考核"]
  },
  {
    id: "web-api",
    icon: "API",
    title: "服务接口站",
    source: "AI 工程补充路线",
    description: "理解 HTTP、REST、后端服务、身份认证和数据库如何组成可调用的 AI 产品。",
    chapters: ["网络与 HTTP", "REST API", "FastAPI", "参数与校验", "数据库访问", "认证与权限", "移动端 API", "进度同步与冲突", "异步任务", "接口测试"]
  },
  {
    id: "deployment",
    icon: "Ops",
    title: "部署云港",
    source: "AI 工程补充路线",
    description: "把本地程序封装、配置、发布并稳定运行在服务器和云环境。",
    chapters: ["Docker", "镜像与容器", "Compose", "环境变量", "响应式 Web", "PWA 与离线缓存", "反向代理", "CI/CD", "云部署", "监控与回滚"]
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
    error: `TypeError: can only concatenate str (not "int") to str`,
    fix: `print("当前能量：" + str(energy))`,
    result: `当前能量：80`,
    explanation: "加号两边分别是 str 和 int。Python 不会猜测你想做文本拼接还是数值相加，需要先用 str(energy) 显式转换，或者使用 f 字符串。"
  },
  explanationChallenge: "为什么 level = level + 1 在程序里成立，而在数学等式里看起来不成立？",
  referenceAnswer: "程序中的等号表示赋值，不是数学中的恒等关系。执行时先读取 level 的旧值，例如 1；再计算旧值 + 1，得到 2；最后让变量 level 指向新值 2。因此这条语句描述的是“读取 → 计算 → 更新”的时间过程。",
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
    error: `TypeError: can only concatenate str (not "int") to str`,
    fix: `next_year = int(age_text) + 1`,
    result: `int("18") → 18；18 + 1 → 19；next_year = 19（int）`,
    explanation: "字符串 \"18\" 代表文本。原代码让 str 与 int 使用加号，因此抛出 TypeError。int(age_text) 先得到整数 18，再加 1，最终明确得到整数 19；如果拼接 \"1\"，得到的会是字符串 \"181\"。"
  },
  explanationChallenge: "为什么从 input() 得到的“18”不能直接加 1？请讲清值、类型、运算意图和修复方式。",
  referenceAnswer: "input() 返回的始终是字符串，所以“18”的类型是 str，而 1 的类型是 int。加号无法确定你想做文本拼接还是数值加法，因此 str 与 int 直接相加会触发 TypeError。若目的是计算下一岁，应先验证输入可以转换，再执行 int(age_text) + 1，最终得到整数 19；无效文本需要捕获 ValueError。",
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
    error: `没有抛出异常，但逻辑结果错误：grade = "及格"`,
    fix: `if score >= 80:\n    grade = "优秀"\nelif score >= 60:\n    grade = "及格"`,
    result: `grade = "优秀"`,
    explanation: "85 同时满足 >= 60 和 >= 80，但程序只执行第一个命中的分支。应先检查更严格、更窄的 >= 80，再检查 >= 60。"
  },
  explanationChallenge: "为什么 if score >= 60 写在 if score >= 80 前面会导致“优秀”分支不可达？如何系统检查这类问题？",
  referenceAnswer: "if/elif 链从上到下检查，只执行第一个为 True 的分支。所有大于等于 80 的分数也都大于等于 60，因此会先被“及格”条件截获，后面的“优秀”条件永远没有机会执行。应先检查更窄、更严格的 >= 80，再检查 >= 60，并使用 59、60、79、80 等边界值验证每条路径。",
  explanationHint: "建议提到：从上到下、第一个 True、区间包含、边界测试……",
  evaluationGroups: [
    ["从上到下", "顺序"],
    ["第一个", "命中"],
    ["包含", "范围", "区间"],
    ["不可达", "跳过"],
    ["边界", "测试"]
  ]
};

export const fourthLesson = {
  id: "python-loops",
  trackId: "python",
  title: "04 · 循环、状态与终止条件",
  duration: "60–80 分钟",
  objectives: [
    "区分 for 遍历与 while 条件循环的适用场景",
    "逐轮追踪循环变量、累计值和剩余资源",
    "说明循环终止条件为何最终会变为 False",
    "识别死循环、边界遗漏和错误的状态更新"
  ],
  concepts: [
    {
      term: "重复规则",
      detail: "循环不是复制粘贴代码，而是描述“对一组数据逐个处理”或“条件成立时重复处理”的规则。"
    },
    {
      term: "循环状态",
      detail: "每一轮开始前，变量构成当前状态；循环体读取状态、执行操作，再产生下一轮状态。调试时应把每轮状态列成表。"
    },
    {
      term: "终止条件",
      detail: "while 循环必须有机会让条件变为 False。需要指出哪个变量在变化、变化方向是什么，以及它何时跨过边界。"
    },
    {
      term: "循环不变量",
      detail: "循环不变量是在每轮前后都保持为真的事实，例如“已消耗能量 + 剩余能量 = 初始能量”，它能帮助证明逻辑正确。"
    }
  ],
  types: [
    ["for", "遍历序列", "for item in items:", "次数通常由数据数量决定"],
    ["range", "整数序列", "range(1, 4)", "包含 1，不包含 4"],
    ["while", "条件重复", "while energy >= cost:", "必须证明条件最终为 False"],
    ["控制", "break / continue", "提前结束 / 跳过本轮", "优先写清正常终止逻辑"]
  ],
  referenceTitle: "循环的四个观察角度",
  referenceDescription: "每次都写出初始状态、执行动作、新状态和终止判断。",
  prediction: {
    code: `energy = 10\nfor step in range(1, 4):\n    energy = energy - step\n    print(step, energy)`,
    choices: ["1 9 / 2 7 / 3 4", "1 9 / 2 8 / 3 7", "1 10 / 2 9 / 3 7"],
    answer: "1 9 / 2 7 / 3 4",
    explanation: "range(1, 4) 依次产生 1、2、3。energy 会保留上一轮结果：10-1=9，9-2=7，7-3=4。"
  },
  quiz: [
    {
      question: "range(2, 6) 会产生哪些整数？",
      options: ["2、3、4、5", "2、3、4、5、6", "3、4、5、6"],
      answer: 0,
      reason: "range 的结束值不包含在序列中，所以从 2 到 5。"
    },
    {
      question: "什么时候更适合使用 while？",
      options: ["明确遍历一个列表", "重复到某个动态条件不再成立", "任何循环都必须使用 while"],
      answer: 1,
      reason: "while 适用于次数事先不明确、由运行状态决定是否继续的情况。"
    },
    {
      question: "while energy > 0 中，循环体没有改变 energy，主要风险是什么？",
      options: ["语法错误", "循环可能永远不结束", "energy 自动变成字符串"],
      answer: 1,
      reason: "如果 energy 初始大于 0 且永不变化，条件始终为 True，会形成死循环。"
    },
    {
      question: "初始能量 12，每轮消耗 3，循环条件 energy >= 3，会执行几轮？",
      options: ["3", "4", "5"],
      answer: 1,
      reason: "状态依次为 12、9、6、3，四次执行后变为 0，下一次检查条件为 False。"
    }
  ],
  lab: {
    kind: "loops",
    title: "循环追踪器",
    subtitle: "逐轮观察资源消耗，并证明循环一定会停止"
  },
  debugChallenge: {
    code: `energy = 3\nwhile energy > 0:\n    print(energy)\n    energy - 1`,
    question: "为什么这个循环不会停止？",
    choices: ["print 会恢复 energy", "energy - 1 只计算但没有更新变量", "while 不能使用大于号"],
    answer: 1,
    error: `没有抛出异常，但程序持续输出 3，无法终止`,
    fix: `energy = energy - 1`,
    result: `依次输出 3、2、1，然后 energy = 0，循环结束`,
    explanation: "energy - 1 是一个表达式，它得到新值但没有保存。energy 始终是 3，条件永远为 True。需要赋值更新状态。"
  },
  explanationChallenge: "如何证明 while energy >= cost 的循环一定会停止？请说明前提、状态变化、边界和异常输入。",
  referenceAnswer: "首先必须验证 cost > 0，并且初始 energy 是非负有限数。每轮执行后 energy 都减少固定的正数 cost，所以状态严格向下变化；energy 又以 0 为下界，不可能无限下降而始终满足 energy >= cost。经过有限轮后 energy 必然小于 cost，条件变为 False，循环结束。cost 为 0 或负数必须在循环前拒绝。",
  explanationHint: "建议提到：cost > 0、每轮递减、下界、最终小于 cost……",
  evaluationGroups: [
    ["cost > 0", "正数"],
    ["每轮", "递减", "减少"],
    ["下界", "不能无限"],
    ["小于", "条件为 False", "终止"],
    ["异常", "验证", "零"]
  ],
  moduleProject: {
    title: "L2 模块项目 · 资源探险模拟器",
    brief: "把变量、表达式、分支和循环组合起来：探险家每轮消耗资源，遇到危险天气时增加消耗，资源不足时安全停止。",
    requirements: [
      "每轮开始前判断资源是否足够",
      "更新轮数、剩余能量和行动记录",
      "暴风天气每轮额外消耗 2 点",
      "输入消耗必须大于 0，避免死循环",
      "输出终止原因，并通过正常、边界、异常三类测试"
    ]
  }
};

export const fifthLesson = {
  id: "python-collections",
  trackId: "python",
  title: "05 · 字符串、列表与字典",
  duration: "70–90 分钟",
  objectives: [
    "根据数据关系选择字符串、列表或字典",
    "正确使用索引、切片、追加、更新和成员判断",
    "说明可变对象与不可变对象在修改时的差异",
    "避免遍历列表时直接删除元素造成的跳项问题"
  ],
  concepts: [
    {
      term: "字符串",
      detail: "字符串是按顺序排列的字符序列，支持索引、切片和遍历，但字符串本身不可变；所谓修改通常会创建新字符串。"
    },
    {
      term: "列表",
      detail: "列表保存有顺序的一组值，可以追加、删除和替换。索引从 0 开始，负索引从末尾开始。"
    },
    {
      term: "字典",
      detail: "字典使用唯一键查找对应值，适合表达“名称 → 属性”或“物品 → 数量”。查找通常比逐项扫描列表更直接。"
    },
    {
      term: "可变性",
      detail: "列表和字典可以原地改变，多个变量指向同一对象时会观察到同一变化；字符串、整数等不可变值不会原地修改。"
    }
  ],
  types: [
    ["str", "字符序列", `name[0] / name[:2]`, "有序、不可变"],
    ["list", "有序集合", `items.append("map")`, "可变、允许重复"],
    ["dict", "键值映射", `counts["map"] = 2`, "键唯一、按键访问"],
    ["in", "成员判断", `"map" in items`, "返回 bool，避免手写搜索循环"]
  ],
  referenceTitle: "按数据关系选择容器",
  referenceDescription: "先问数据是否有顺序、是否需要按键查找、是否允许重复，再选择结构。",
  prediction: {
    code: `items = ["torch", "map"]\nbackup = items\nbackup.append("rope")\nprint(len(items), items[-1])`,
    choices: ["2 map", "3 rope", "3 map"],
    answer: "3 rope",
    explanation: "backup 和 items 指向同一个列表。append 原地修改该列表，因此 items 长度也变为 3，最后一个元素是 rope。"
  },
  quiz: [
    {
      question: "需要记录每种物品的数量，最适合哪种结构？",
      options: ["字符串", "列表", "字典"],
      answer: 2,
      reason: "物品名称可以作为键，数量作为值，能够直接按名称查找和更新。"
    },
    {
      question: "items = [\"a\", \"b\", \"c\"]，items[-1] 是什么？",
      options: ["a", "b", "c"],
      answer: 2,
      reason: "负索引 -1 表示最后一个元素。"
    },
    {
      question: "为什么不能执行 name[0] = \"A\"？",
      options: ["字符串不可变", "索引只能从 1 开始", "字符串不能包含字母"],
      answer: 0,
      reason: "字符串是不可变对象。可以创建新字符串，但不能原地替换其中字符。"
    },
    {
      question: "遍历列表时直接 remove 当前元素的主要风险是？",
      options: ["一定语法错误", "索引移动导致部分元素被跳过", "列表会自动变成字典"],
      answer: 1,
      reason: "删除会让后续元素左移，而循环内部索引仍前进，可能跳过紧邻元素。"
    }
  ],
  lab: {
    kind: "collections",
    title: "容器观察站",
    subtitle: "把文本变成列表，再汇总为字典"
  },
  debugChallenge: {
    code: `items = ["broken", "broken", "map"]\nfor item in items:\n    if item == "broken":\n        items.remove(item)\nprint(items)`,
    question: "为什么结果里可能还留下一个 broken？",
    choices: ["remove 只能删除数字", "删除后元素左移，循环索引跳过了相邻元素", "for 不能遍历列表"],
    answer: 1,
    error: `没有抛出异常，但错误结果为 ["broken", "map"]`,
    fix: `items = [item for item in items if item != "broken"]`,
    result: `items = ["map"]`,
    explanation: "第一项删除后，第二个 broken 移到索引 0，但循环继续检查下一个索引，于是它被跳过。可以构造过滤后的新列表，或遍历列表副本。"
  },
  explanationChallenge: "为什么 backup = items 后，执行 backup.append(\"rope\") 会同时影响 items？它和字符串“修改”有什么不同？",
  referenceAnswer: "backup = items 没有复制列表，而是让两个变量指向同一个列表对象。列表是可变对象，append 会原地修改这个共享对象，所以通过 items 也能看到 rope。字符串不可变，任何看似修改字符串的操作都会创建新字符串，再让某个变量指向新值，不会原地改变原字符串对象。",
  explanationHint: "建议提到：同一对象、引用、列表可变、字符串不可变、新值……",
  evaluationGroups: [
    ["同一", "对象"],
    ["指向", "引用"],
    ["列表", "可变"],
    ["字符串", "不可变"],
    ["新值", "创建"]
  ],
  codeChallenge: {
    id: "inventory-summary",
    title: "真实代码验收 · 物品计数器",
    brief: "实现 summarize_inventory(items)，返回“物品名称 → 出现次数”的字典。不要修改输入列表。",
    starter: `def summarize_inventory(items):\n    counts = {}\n    # 在这里遍历 items 并更新 counts\n    return counts`,
    checks: ["正常列表", "空列表", "单个物品（隐藏）", "连续重复（隐藏）"]
  }
};

export const sixthLesson = {
  id: "python-functions",
  trackId: "python",
  title: "06 · 函数、参数与返回值",
  duration: "70–90 分钟",
  objectives: [
    "说明函数如何把一段规则封装成可复用接口",
    "区分形参、实参、返回值和局部变量",
    "使用单一职责拆分过长流程，并为函数设计边界",
    "识别遗漏 return、参数顺序和可变默认值等常见问题"
  ],
  concepts: [
    {
      term: "函数接口",
      detail: "函数名、参数和返回值共同构成接口。调用者只需要知道输入要求和输出保证，不应依赖函数内部临时变量。"
    },
    {
      term: "参数",
      detail: "定义函数时写的是形参，调用时传入的是实参。参数让同一规则可以处理不同数据，而不是依赖写死的全局值。"
    },
    {
      term: "返回值",
      detail: "return 把结果交还给调用者并结束本次函数调用。没有显式 return 的函数会返回 None，不等于返回内部最后计算的值。"
    },
    {
      term: "作用域",
      detail: "函数内部创建的局部变量通常只在本次调用中有效。局部状态减少意外影响，让函数更容易测试和复用。"
    }
  ],
  types: [
    ["def", "定义函数", `def add(a, b):`, "只定义，不会自动执行函数体"],
    ["参数", "接收输入", `add(2, 3)`, "2 和 3 是本次调用的实参"],
    ["return", "交还结果", `return a + b`, "返回后本次调用立即结束"],
    ["None", "没有结果值", `result is None`, "遗漏 return 时常见"]
  ],
  referenceTitle: "函数的四段契约",
  referenceDescription: "明确名称、输入、处理规则和输出，函数才真正可复用、可测试。",
  prediction: {
    code: `def consume(energy, cost=3):\n    remaining = energy - cost\n    return remaining\n\nenergy = 10\nenergy = consume(energy)\nprint(energy)`,
    choices: ["10", "7", "None"],
    answer: "7",
    explanation: "调用 consume(10) 时，默认 cost 为 3，局部变量 remaining 得到 7；return 把 7 交回，外部 energy 再更新为 7。"
  },
  quiz: [
    {
      question: "函数体计算出 result，但没有写 return，调用结果是什么？",
      options: ["result 的值", "None", "一定语法错误"],
      answer: 1,
      reason: "Python 函数没有显式 return 时会返回 None，内部变量不会自动成为返回值。"
    },
    {
      question: "定义 def add(a, b): 时，a 和 b 是什么？",
      options: ["实参", "形参", "返回值"],
      answer: 1,
      reason: "函数定义中的名字是形参；调用 add(2, 3) 时的 2、3 才是实参。"
    },
    {
      question: "哪种函数职责更清晰？",
      options: ["一个函数读取文件、训练模型、发邮件并部署", "一个函数只负责计算一组分数的平均值", "函数越长越容易复用"],
      answer: 1,
      reason: "单一职责让输入输出明确，也更容易单独测试、修改和组合。"
    },
    {
      question: "局部变量的主要价值是什么？",
      options: ["让所有代码都能随意修改它", "限制状态影响范围，降低意外耦合", "让变量永久保存"],
      answer: 1,
      reason: "局部变量把临时状态限制在函数调用内部，使行为更容易推理和测试。"
    }
  ],
  lab: {
    kind: "functions",
    title: "函数调用追踪器",
    subtitle: "观察实参进入、局部计算和返回值离开的全过程"
  },
  debugChallenge: {
    code: `def add_energy(current, supply):\n    result = current + supply\n\nenergy = add_energy(10, 5)\nprint(energy + 1)`,
    question: "为什么最后一行会报错？",
    choices: ["函数不能做加法", "函数遗漏 return，因此 energy 是 None", "参数必须写成字符串"],
    answer: 1,
    error: `TypeError: unsupported operand type(s) for +: 'NoneType' and 'int'`,
    fix: `def add_energy(current, supply):\n    result = current + supply\n    return result`,
    result: `add_energy(10, 5) → 15；energy + 1 → 16`,
    explanation: "函数内部虽然计算出 result，但没有 return。Python 自动返回 None，外部 energy 因此得到 None；None 与整数 1 不能相加。"
  },
  explanationChallenge: "为什么函数内部算出了 result，调用者仍然拿不到它？请讲清局部变量、return、None 和调用边界。",
  referenceAnswer: "result 是函数调用内部的局部变量，只在函数作用域内可见。计算出 result 并不等于把它交给调用者；函数必须通过 return 明确跨越调用边界返回结果。没有显式 return 时，Python 自动返回 None，因此外部变量接收到的是 None。函数接口应清楚规定参数要求和返回值保证。",
  explanationHint: "建议提到：局部作用域、显式 return、调用结果、None……",
  evaluationGroups: [
    ["局部", "作用域"],
    ["return", "返回"],
    ["调用", "交给"],
    ["None"],
    ["边界", "接口"]
  ],
  codeChallenge: {
    id: "score-analysis",
    title: "真实代码验收 · 成绩分析函数",
    brief: "实现 analyze_scores(scores)，返回包含 total、average、passed 的字典。空列表时 total 和 average 为 0，passed 为 False；平均分达到 60 才通过。",
    starter: `def analyze_scores(scores):\n    # 返回 {\"total\": ..., \"average\": ..., \"passed\": ...}\n    pass`,
    checks: ["普通分数列表", "空列表边界", "刚好 60 分（隐藏）", "小数平均值（隐藏）"]
  }
};

export const seventhLesson = {
  id: "python-files-errors",
  trackId: "python",
  title: "07 · 文件、异常与数据持久化",
  duration: "80–100 分钟",
  objectives: [
    "区分内存数据与持久化文件，并正确选择文本编码",
    "使用 with 管理文件资源，理解打开、读取、关闭的生命周期",
    "区分可预期异常与程序缺陷，进行最小范围捕获",
    "把文件内容拆成读取、解析、验证和汇总四个可测试步骤"
  ],
  concepts: [
    {
      term: "持久化",
      detail: "变量通常在程序结束后消失，文件把数据写入持久存储。文件内容只是字节，需要通过编码解释为文本。"
    },
    {
      term: "上下文管理",
      detail: "with open(...) as file 会在代码块结束时关闭文件，即使中途发生异常，也能可靠释放资源。"
    },
    {
      term: "异常",
      detail: "异常是程序无法按正常路径继续的信号。捕获异常前先识别可能失败的具体操作，不要用空 except 隐藏所有问题。"
    },
    {
      term: "分层处理",
      detail: "读取负责获得原始文本，解析负责转换格式，验证负责检查规则，汇总负责生成结果。分层后每一步都能单独测试。"
    }
  ],
  types: [
    ["open", "打开资源", `open(path, "r", encoding="utf-8")`, "明确模式和编码"],
    ["with", "管理生命周期", `with open(...) as file:`, "退出代码块自动关闭"],
    ["try", "尝试风险操作", `try: score = float(text)`, "范围越小，根因越清晰"],
    ["except", "处理特定异常", `except ValueError:`, "不要使用空 except 吞掉缺陷"]
  ],
  referenceTitle: "持久化处理的四层流水线",
  referenceDescription: "读取、解析、验证、汇总分开设计，错误才能被准确定位。",
  prediction: {
    code: `values = ["80", "bad", "60"]\nvalid = []\nfor text in values:\n    try:\n        valid.append(int(text))\n    except ValueError:\n        continue\nprint(sum(valid), len(valid))`,
    choices: ["140 2", "140 3", "ValueError"],
    answer: "140 2",
    explanation: "\"80\" 和 \"60\" 成功转换并进入列表；\"bad\" 触发 ValueError 后执行 continue，因此汇总为 140，共 2 个有效值。"
  },
  quiz: [
    {
      question: "为什么推荐使用 with open(...)？",
      options: ["让文件自动变成字典", "无论正常结束还是异常都能可靠关闭文件", "只有 with 才能读取文本"],
      answer: 1,
      reason: "上下文管理器负责资源生命周期，离开代码块时自动关闭文件。"
    },
    {
      question: "读取 UTF-8 文本时，为什么应明确 encoding？",
      options: ["避免依赖不同系统的默认编码", "让文件体积自动减半", "编码只影响数字"],
      answer: 0,
      reason: "不同系统默认编码可能不同，明确 UTF-8 能提高可移植性并减少乱码。"
    },
    {
      question: "哪种异常捕获更合理？",
      options: ["用 except: 包住整个程序", "只围绕 float(text) 捕获 ValueError", "忽略所有异常继续运行"],
      answer: 1,
      reason: "捕获范围和异常类型越具体，越不容易隐藏真正的程序缺陷。"
    },
    {
      question: "为什么把读取与解析拆成两个函数？",
      options: ["可以脱离真实文件单独测试解析逻辑", "Python 强制必须拆分", "拆分后不需要处理异常"],
      answer: 0,
      reason: "解析函数接收文本或文本行后可以直接测试，不必每次创建真实文件。"
    }
  ],
  lab: {
    kind: "files",
    title: "文本解析实验室",
    subtitle: "模拟文件内容，逐行解析并记录有效值与异常"
  },
  debugChallenge: {
    code: `score_text = "优秀"\nscore = float(score_text)\nprint("解析完成")`,
    question: "怎样修复才能保留错误证据并继续处理？",
    choices: ["删除 float()，假装它是分数", "捕获 ValueError 并记录这行无效", "使用空 except 且什么都不做"],
    answer: 1,
    error: `ValueError: could not convert string to float: '优秀'`,
    fix: `try:\n    score = float(score_text)\nexcept ValueError:\n    invalid_reason = f"无法解析分数：{score_text}"`,
    result: `程序不会崩溃，并留下 invalid_reason = "无法解析分数：优秀"`,
    explanation: "\"优秀\" 不符合浮点数字格式，float() 明确抛出 ValueError。正确做法是捕获这个具体异常并记录无效原因，而不是删除转换或吞掉错误。"
  },
  explanationChallenge: "为什么 except: pass 会让程序看似稳定却更难维护？怎样决定捕获范围和异常类型？",
  referenceAnswer: "except: pass 会捕获并丢弃几乎所有异常，既可能隐藏可预期的输入错误，也可能掩盖拼写、类型和程序逻辑缺陷，导致错误数据继续传播。应只把可能失败的最小操作放进 try，捕获已知且能够处理的具体异常，例如 float(text) 对应 ValueError，并记录输入、行号和原因。无法正确恢复的异常应继续抛出或终止流程。",
  explanationHint: "建议提到：隐藏缺陷、具体操作、具体异常、记录证据、继续或终止……",
  evaluationGroups: [
    ["隐藏", "吞掉"],
    ["缺陷", "根因"],
    ["范围", "具体操作"],
    ["异常类型", "ValueError"],
    ["记录", "证据"]
  ],
  codeChallenge: {
    id: "parse-score-lines",
    title: "真实代码验收 · 分数文本解析器",
    brief: "实现 parse_score_lines(lines)，忽略空行，把 0–100 的数字加入 scores；无法转换或超出范围的行计入 invalid。返回 {\"scores\": [...], \"invalid\": 数量}。",
    starter: `def parse_score_lines(lines):\n    scores = []\n    invalid = 0\n    # 逐行清理、转换、验证\n    return {\"scores\": scores, \"invalid\": invalid}`,
    checks: ["数字与非法文本混合", "空行与边界值", "超出范围（隐藏）", "小数分数（隐藏）"]
  }
};

export const pythonLessons = [
  firstLesson,
  secondLesson,
  thirdLesson,
  fourthLesson,
  fifthLesson,
  sixthLesson,
  seventhLesson,
  ...advancedPythonLessons
];

export { dataStructureLessons };
export { databaseLessons };

export const lessonCatalog = {
  python: pythonLessons,
  algorithm: dataStructureLessons,
  database: databaseLessons
};

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
