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

export const pythonLessons = [firstLesson, secondLesson];

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
