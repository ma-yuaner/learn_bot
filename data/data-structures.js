export const dataStructureLessons = [
  {
    id: "ds-complexity",
    trackId: "algorithm",
    title: "DS01 · 复杂度与增长率",
    duration: "80–110 分钟",
    objectives: [
      "区分实际运行时间、基本操作次数和渐进复杂度",
      "识别 O(1)、O(log n)、O(n)、O(n log n)、O(n²) 的增长差异",
      "分析最好、平均和最坏情况，并明确所选口径",
      "通过操作计数而不是机器快慢解释算法扩展性"
    ],
    concepts: [
      {
        term: "输入规模 n",
        detail: "n 是描述问题规模的量，例如列表长度、节点数或数据位数。分析前必须明确 n 代表什么。"
      },
      {
        term: "基本操作",
        detail: "选择最能代表主要成本的操作进行计数，例如比较、数组访问或节点遍历。不同合理模型可能得到相同增长级别。"
      },
      {
        term: "增长率",
        detail: "复杂度关注 n 增大时成本如何增长，忽略不改变增长级别的常数倍和低阶项，但工程中这些因素仍可能影响实际性能。"
      },
      {
        term: "情况口径",
        detail: "最好、平均、最坏情况回答不同问题。没有说明输入分布就声称“平均 O(n)”通常是不完整的。"
      }
    ],
    types: [
      ["O(1)", "常数", "数组按索引访问", "成本不随 n 增长"],
      ["O(log n)", "对数", "有序数据二分查找", "每步缩小固定比例"],
      ["O(n)", "线性", "最坏情况线性查找", "n 翻倍，操作约翻倍"],
      ["O(n²)", "平方", "比较所有元素对", "n 翻倍，操作约四倍"]
    ],
    referenceTitle: "五种增长级别放在同一尺度",
    referenceDescription: "复杂度比较的是规模扩大后的趋势，不是一次运行谁快几毫秒。",
    prediction: {
      code: `checks = 0\nfor left in range(4):\n    for right in range(left + 1, 4):\n        checks += 1\nprint(checks)`,
      choices: ["4", "6", "16"],
      answer: "6",
      explanation: "left 为 0、1、2、3 时，内层分别执行 3、2、1、0 次，共 6 次。一般为 n(n-1)/2，忽略常数和低阶项后是 O(n²)。"
    },
    quiz: [
      {
        question: "为什么不能只用一次运行毫秒数判断算法复杂度？",
        options: ["毫秒不能表示数字", "结果受机器、语言、输入和环境影响，且不能说明增长趋势", "所有算法运行时间都相同"],
        answer: 1,
        reason: "复杂度关注输入扩大后的增长趋势；计时适合做工程基准，但需要控制变量和多种规模。"
      },
      {
        question: "n 从 100 变为 200，O(n²) 操作量大约怎样变化？",
        options: ["不变", "约 2 倍", "约 4 倍"],
        answer: 2,
        reason: "平方增长满足 (2n)² = 4n²。"
      },
      {
        question: "二分查找达到 O(log n) 的关键前提是什么？",
        options: ["数据有序且支持中间位置访问", "数据必须全部相同", "只能有两个元素"],
        answer: 0,
        reason: "有序性让一次比较可以排除一半范围；缺少前提就不能直接套用复杂度。"
      },
      {
        question: "O(2n + 10) 通常简化为什么？",
        options: ["O(1)", "O(n)", "O(n²)"],
        answer: 1,
        reason: "渐进分析忽略常数倍和低阶常数项，保留主导增长项 n。"
      }
    ],
    lab: {
      kind: "complexity",
      title: "操作计数观测台",
      subtitle: "改变输入规模，比较五类算法的操作增长"
    },
    debugChallenge: {
      code: `# n = 10 时测试一次\n# 算法 A：0.02 ms\n# 算法 B：0.04 ms\n# 结论：A 的复杂度永远优于 B`,
      question: "这个结论为什么不成立？",
      choices: ["0.02 不是数字", "单一小规模计时无法推出渐进增长率", "运行更快的一定复杂度更差"],
      answer: 1,
      error: "没有程序异常，但推理证据不足：把一次常数时间测量误当成复杂度证明",
      fix: "选择多个成倍增长的 n，重复基准并统计基本操作；控制机器和输入分布，再比较增长倍数",
      result: "得到运行时间与操作次数两类证据，并能区分常数优势和增长率优势",
      explanation: "小规模下常数、缓存、解释器开销可能占主导。复杂度必须观察规模变化趋势，并说明最好、平均或最坏输入。"
    },
    explanationChallenge: "为什么一个 O(n) 的 Python 算法在小数据上可能比 O(log n) 更快，但我们仍然关心 O(log n)？",
    referenceAnswer: "大 O 描述输入规模增长时成本的趋势，不包含语言实现、函数调用、缓存和常数倍等全部现实因素。小数据上，O(n) 算法可能结构简单、常数很小，而 O(log n) 算法存在排序前提或更高固定开销，所以实际更快。随着 n 持续增大，线性成本增长速度最终可能超过对数成本。工程选择应同时使用复杂度判断扩展性，并用代表性数据基准验证当前范围。",
    explanationHint: "建议提到：增长趋势、常数、固定开销、小规模、扩展性、基准……",
    evaluationGroups: [
      ["趋势", "增长"],
      ["常数", "固定开销"],
      ["小数据", "小规模"],
      ["扩展", "n 增大"],
      ["基准", "实际测量"]
    ],
    codeChallenge: {
      id: "linear-search-count",
      title: "真实代码验收 · 带证据的线性查找",
      brief: "实现 linear_search_with_count(items, target)，从左到右查找。返回 index 和 checks；找到时 index 为位置，未找到为 -1。checks 必须等于实际比较次数。",
      starter: `def linear_search_with_count(items, target):\n    # 返回 {\"index\": ..., \"checks\": ...}\n    pass`,
      checks: ["目标在中间", "目标不存在", "目标在第一项（隐藏）", "空列表（隐藏）"]
    }
  }
];
