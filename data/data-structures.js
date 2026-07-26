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
  },
  {
    id: "ds-dynamic-array",
    trackId: "algorithm",
    title: "DS02 · 数组与动态数组",
    duration: "100–140 分钟",
    objectives: [
      "解释数组为什么能按索引 O(1) 访问，以及这一结论依赖的存储模型",
      "区分逻辑长度 size 与底层容量 capacity，推演扩容和元素复制",
      "计算尾部追加、任意位置插入与删除产生的搬移次数",
      "从零实现最小动态数组追加过程，并用摊还分析解释连续 append"
    ],
    concepts: [
      {
        term: "连续槽位与索引",
        detail: "数组把等宽槽位按顺序组织。已知起始位置和元素宽度后，可直接计算第 i 个槽位的位置，因此随机访问是 O(1)；Python list 实际连续保存的是对象引用。"
      },
      {
        term: "size 与 capacity",
        detail: "size 是当前有效元素数，capacity 是底层已申请槽位数，必须满足 0 ≤ size ≤ capacity。未使用槽位是预留空间，不属于逻辑内容。"
      },
      {
        term: "扩容与复制",
        detail: "容量用尽时不能凭空延长原存储区，通常要申请更大的新区域、复制旧元素引用、再释放旧区域。单次扩容可能是 O(n)。"
      },
      {
        term: "摊还复杂度",
        detail: "按倍数扩容时，昂贵复制不会每次追加都发生。把一系列追加的总成本平均到每次操作，尾部 append 的摊还时间是 O(1)，但单次最坏仍是 O(n)。"
      }
    ],
    types: [
      ["arr[i]", "随机访问", "O(1)", "直接计算槽位，仍需检查索引边界"],
      ["append", "尾部追加", "摊还 O(1)", "扩容发生时单次最坏 O(n)"],
      ["insert(i)", "中间插入", "O(n)", "为新元素从尾到头搬移后缀"],
      ["delete(i)", "中间删除", "O(n)", "向前填补空位并更新 size"]
    ],
    referenceTitle: "Python list 背后的动态数组模型",
    referenceDescription: "列表 API 很简单，但容量、复制、搬移和对象引用决定了它的性能边界。",
    prediction: {
      code: `items = ["A", "B", "C", None]\nsize = 3\nindex = 1\nfor i in range(size, index, -1):\n    items[i] = items[i - 1]\nitems[index] = "X"\nsize += 1\nprint(items, size)`,
      choices: [
        `["A", "X", "B", "C"] 4`,
        `["A", "X", "C", None] 4`,
        `IndexError`
      ],
      answer: `["A", "X", "B", "C"] 4`,
      explanation: "循环依次执行 i=3、2，把 C、B 从后向前移动，避免尚未复制的值被覆盖；随后 X 写入索引 1，逻辑长度变为 4。"
    },
    quiz: [
      {
        question: "动态数组 size=4、capacity=8 表示什么？",
        options: ["有 8 个有效元素", "有 4 个有效元素和 4 个预留槽位", "索引最大可以直接使用 8"],
        answer: 1,
        reason: "逻辑内容只包含索引 0 到 size-1；capacity 描述底层空间，不代表这些槽位已经有有效元素。"
      },
      {
        question: "容量已满时尾部 append 为什么单次可能是 O(n)？",
        options: ["需要排序全部元素", "需要申请新区域并复制已有元素", "索引访问会变成递归"],
        answer: 1,
        reason: "扩容通常要把 n 个已有引用复制到新区域，然后才能写入新元素。"
      },
      {
        question: "向索引 1 插入元素时，为什么应从后向前搬移？",
        options: ["避免覆盖还没有被搬走的旧元素", "因为索引只能倒序访问", "这样就一定不需要扩容"],
        answer: 0,
        reason: "若从前向后复制，前一次写入可能覆盖下一次仍需读取的源值。"
      },
      {
        question: "“append 是 O(1)”更严谨的表达是什么？",
        options: ["每一次 append 都严格只执行一步", "倍增扩容下摊还 O(1)，单次最坏 O(n)", "append 的空间复杂度永远是 O(0)"],
        answer: 1,
        reason: "大多数追加只写一个槽位，少数扩容会复制已有元素；对操作序列平均后为常数成本。"
      }
    ],
    lab: {
      kind: "dynamic-array",
      title: "动态数组内存工作台",
      subtitle: "亲手改变 size、capacity、插入位置，观察扩容复制与元素搬移"
    },
    debugChallenge: {
      code: `items = ["A", "B", "C", "D"]\nsize = 4\nindex = 1\n# 删除 items[index]，把后续元素左移\nfor i in range(index, size):\n    items[i] = items[i + 1]\nsize -= 1`,
      question: "这段删除代码会发生什么，正确边界是什么？",
      choices: [
        "正确删除 B，结果没有任何问题",
        "最后一次访问 items[4] 触发 IndexError；循环应到 size-2",
        "range 不能用于数组"
      ],
      answer: 1,
      error: "当 i=size-1=3 时读取 items[i+1]，也就是 items[4]，超过最后有效索引 3，触发 IndexError",
      fix: "使用 range(index, size - 1) 搬移索引 1 到 2；然后 size -= 1，并把 items[size] 清为 None，维持有效区与空闲区边界",
      result: "底层槽位变为 ['A', 'C', 'D', None]，逻辑 size 为 3，有效元素是 ['A', 'C', 'D']",
      explanation: "删除后需要搬移的源索引最大是 size-1，所以目标索引最大只能是 size-2。容量没有随逻辑删除自动减小。"
    },
    explanationChallenge: "为什么 Python list 的 append 通常很快，却不能说每一次 append 都是严格 O(1)？",
    referenceAnswer: "Python list 使用动态数组思想，size 小于 capacity 时，append 只需把新对象引用写入下一个空槽位，因此通常是 O(1)。当容量用尽时，需要申请更大的连续槽位并复制已有引用，单次成本会达到 O(n)。扩容预留额外容量，使昂贵复制只在少数操作发生；分析一长串追加的总成本，每次平均为摊还 O(1)。因此必须同时说明常见路径、单次最坏情况和摊还口径。",
    explanationHint: "建议提到：size、capacity、扩容、复制、单次最坏、操作序列、摊还……",
    evaluationGroups: [
      ["size", "长度"],
      ["capacity", "容量"],
      ["扩容", "新空间"],
      ["复制", "搬移"],
      ["最坏", "O(n)"],
      ["摊还", "操作序列"]
    ],
    codeChallenge: {
      id: "dynamic-array-append",
      title: "真实代码验收 · 从零模拟动态数组追加",
      brief: "实现 build_dynamic_array(values)。初始 capacity=1；容量满时严格翻倍，并逐项复制有效元素。返回 data、size、capacity、copies，其中 data 只包含有效元素，copies 是历次扩容复制旧元素的总次数。",
      starter: `def build_dynamic_array(values):\n    capacity = 1\n    size = 0\n    copies = 0\n    data = [None] * capacity\n    # 不要使用 list.append；手动扩容、复制和写入\n    return {\"data\": data[:size], \"size\": size, \"capacity\": capacity, \"copies\": copies}`,
      checks: ["三个元素触发两次扩容", "空输入", "单元素不扩容（隐藏）", "五个元素触发三次扩容（隐藏）"]
    }
  },
  {
    id: "ds-linked-list",
    trackId: "algorithm",
    title: "DS03 · 链表与引用改写",
    duration: "110–150 分钟",
    objectives: [
      "画出节点、数据域、next 引用和 head/tail 指针之间的关系",
      "推演头部、中间、尾部插入删除，并正确处理空链和单节点边界",
      "使用三指针反转链表，解释为什么必须先保存 next_node",
      "使用快慢指针检测环，并比较链表与动态数组的真实取舍"
    ],
    concepts: [
      {
        term: "节点与引用",
        detail: "单链表节点保存 value 和 next。节点不要求物理连续，next 保存的是下一个节点的引用；链的顺序由引用关系决定，而不是内存地址大小。"
      },
      {
        term: "head、tail 与不变量",
        detail: "head 指向首节点，tail 指向尾节点；无环单链表通常满足 tail.next is None。空链时 head 和 tail 都应为空，size 必须等于从 head 可达的节点数。"
      },
      {
        term: "局部改线",
        detail: "已持有目标位置引用时，插入或删除只需修改少量 next，可为 O(1)；但从 head 查找第 i 个节点仍需 O(n)，不能忽略定位成本。"
      },
      {
        term: "反转与环",
        detail: "反转会逐个改变边的方向，必须保存尚未处理的后继。环会让普通遍历无法到达 None，可用快慢指针是否相遇在 O(n) 时间、O(1) 额外空间内检测。"
      }
    ],
    types: [
      ["头部插入", "改 head 和一个 next", "O(1)", "空链时还要同步 tail"],
      ["已知节点后插入", "改两个 next", "O(1)", "若插到尾部要更新 tail"],
      ["按索引查找/删除", "先遍历定位", "O(n)", "删除本身改线是 O(1)"],
      ["反转/环检测", "遍历整条可达链", "O(n)", "可做到 O(1) 额外空间"]
    ],
    referenceTitle: "链表不是“更快的列表”",
    referenceDescription: "链表用引用换取局部改线能力，同时失去连续索引访问和缓存局部性。",
    prediction: {
      code: `# A -> B -> C -> None\nnext_index = [1, 2, -1]\nprevious = -1\ncurrent = 0\nwhile current != -1:\n    next_node = next_index[current]\n    next_index[current] = previous\n    previous = current\n    current = next_node\nprint(previous, next_index)`,
      choices: ["2 [-1, 0, 1]", "0 [1, 2, -1]", "IndexError"],
      answer: "2 [-1, 0, 1]",
      explanation: "三轮分别把 A、B、C 的 next 指向前驱；previous 最终为原尾节点 2，也就是新 head，链变为 C→B→A→None。"
    },
    quiz: [
      {
        question: "为什么链表按索引访问通常是 O(n)？",
        options: ["节点值不能读取", "没有可直接计算位置的连续槽位，必须从 head 沿 next 前进", "链表只能保存 n 个元素"],
        answer: 1,
        reason: "链表顺序编码在 next 引用中，要到第 i 个节点必须经过之前的链接。"
      },
      {
        question: "已拿到节点 current，在它后面插入 new_node 的正确顺序是什么？",
        options: ["先 current.next=new_node，再读取旧 next", "先 new_node.next=current.next，再 current.next=new_node", "只修改 head"],
        answer: 1,
        reason: "必须先让新节点保存旧后继，再把当前节点指向新节点，否则可能丢失后半条链。"
      },
      {
        question: "删除单节点链表的唯一节点后，应满足什么状态？",
        options: ["head 为空但 tail 保留旧节点", "head、tail 都为空且 size=0", "size 仍为 1"],
        answer: 1,
        reason: "空链不变量要求两个端点都为空，且可达节点数与 size 一致。"
      },
      {
        question: "快慢指针为什么能检测环？",
        options: ["快指针会修改节点", "存在环时两个不同速度的指针最终会在环内相遇", "慢指针总是停在 tail"],
        answer: 1,
        reason: "进入环后，快指针相对慢指针每轮接近一步，有限环长下必然相遇。"
      }
    ],
    lab: {
      kind: "linked-list",
      title: "链表指针调查台",
      subtitle: "观察节点身份不变时，next、head 和 tail 如何被重新连接"
    },
    debugChallenge: {
      code: `previous = None\ncurrent = head\nwhile current is not None:\n    current.next = previous\n    previous = current\n    current = current.next\nhead = previous`,
      question: "为什么这段反转通常只处理第一个节点？",
      choices: [
        "previous 不能设为 None",
        "覆盖 current.next 后再读取它，只会读到 previous，原后继已经丢失",
        "链表不能使用 while"
      ],
      answer: 1,
      error: "断链：current.next 被改写为 previous 后，原来的下一节点引用已经无法通过 current.next 取得",
      fix: "每轮先执行 next_node = current.next 保存原后继，再改 current.next = previous，最后依次推进 previous = current、current = next_node",
      result: "所有边逐条反向，原 tail 成为新 head，原 head 的 next 变为 None，节点没有丢失",
      explanation: "指针算法的关键不是语句能运行，而是每次改线前确认后续节点仍然可达；应画出修改前后引用图。"
    },
    explanationChallenge: "既然链表在已知位置插入是 O(1)，为什么真实项目中不能直接断言链表一定比 Python list 更适合频繁插入？",
    referenceAnswer: "链表只有在已经持有目标节点引用时，局部插入改线才是 O(1)；如果需求给的是索引或查找条件，定位节点仍可能需要 O(n)。Python list 的中间插入需要搬移引用，是 O(n)，但连续存储具有更好的缓存局部性、额外对象开销更小，并支持 O(1) 随机访问。还要考虑数据规模、插入位置分布、遍历频率、内存开销和标准库实现。因此应从完整操作组合与实际基准选择结构，不能只比较一项理论复杂度。",
    explanationHint: "建议提到：已知节点、定位成本、连续存储、缓存、内存、访问模式、基准……",
    evaluationGroups: [
      ["已知节点", "引用"],
      ["定位", "查找"],
      ["O(n)", "线性"],
      ["连续", "缓存"],
      ["内存", "对象开销"],
      ["访问模式", "操作组合"],
      ["基准", "实际"]
    ],
    codeChallenge: {
      id: "reverse-index-chain",
      title: "真实代码验收 · 反转索引链表",
      brief: "实现 reverse_index_chain(next_indices, head)。next_indices[i] 是节点 i 的后继索引，-1 表示 None；输入保证从 head 可达部分无环。请复制列表后只反转可达链，保留不可达节点的原引用，并返回新的 head、next 和从新 head 出发的 order。",
      starter: `def reverse_index_chain(next_indices, head):\n    links = next_indices[:]\n    previous = -1\n    current = head\n    # 先保存原后继，再改写当前链接\n    return {\"head\": previous, \"next\": links, \"order\": []}`,
      checks: ["三节点完整链", "空链", "单节点（隐藏）", "非零 head 且含不可达节点（隐藏）"]
    }
  }
];
