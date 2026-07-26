const makeQuiz = (items) => items.map(([question, correct, wrongA, wrongB, reason], index) => {
  const answer = index % 3;
  const options = [wrongA, wrongB];
  options.splice(answer, 0, correct);
  return { question, options, answer, reason };
});

const makeLesson = ({
  id,
  number,
  title,
  duration = "100–140 分钟",
  objectives,
  concepts,
  types,
  referenceDescription,
  prediction,
  quiz,
  lab,
  debugChallenge,
  explanationChallenge,
  referenceAnswer,
  evaluationGroups,
  codeChallenge,
  graduation
}) => ({
  id,
  trackId: "algorithm",
  title: `DS${String(number).padStart(2, "0")} · ${title}`,
  duration,
  objectives,
  concepts: concepts.map(([term, detail]) => ({ term, detail })),
  types,
  referenceTitle: `${title}的操作、状态与边界`,
  referenceDescription,
  prediction,
  quiz: makeQuiz(quiz),
  lab: {
    kind: "algorithm-studio",
    ...lab
  },
  debugChallenge,
  explanationChallenge,
  referenceAnswer,
  explanationHint: `建议覆盖：${evaluationGroups.map((group) => group[0]).join("、")}……`,
  evaluationGroups,
  codeChallenge,
  graduation
});

export const advancedAlgorithmLessons = [
  makeLesson({
    id: "ds-stack",
    number: 4,
    title: "栈、调用栈与撤销",
    objectives: ["解释 LIFO、栈顶和栈底", "实现 push、pop、peek 与空栈检查", "用栈完成括号匹配和撤销", "区分显式数据栈与函数调用栈"],
    concepts: [
      ["LIFO", "后进入的元素先离开。所有受控操作集中在栈顶，不能把栈误解成可以任意取值的普通列表。"],
      ["push / pop / peek", "push 入栈、pop 移除并返回栈顶、peek 只查看不删除；对空栈 pop 必须定义错误或哨兵策略。"],
      ["调用栈", "每次函数调用建立栈帧，保存参数、局部状态和返回位置；递归深度过大会触发栈溢出。"],
      ["应用模型", "括号匹配保存尚未闭合的左括号；撤销系统保存历史命令或状态快照，redo 通常需要第二个栈。"]
    ],
    types: [["push", "栈顶加入", "O(1) 摊还", "底层动态数组偶尔扩容"], ["pop", "栈顶移除", "O(1)", "先检查非空"], ["peek", "查看栈顶", "O(1)", "不改变 size"], ["查找任意元素", "遍历", "O(n)", "不是栈的核心能力"]],
    referenceDescription: "栈的价值来自受限访问顺序；若业务需要队首先出，选栈会直接颠倒语义。",
    prediction: { code: `stack = []\nstack.append("A")\nstack.append("B")\nprint(stack.pop())\nstack.append("C")\nprint(stack[-1], stack)`, choices: [`B C ['A', 'C']`, `A C ['B', 'C']`, `B A ['A', 'C']`], answer: `B C ['A', 'C']`, explanation: "B 最后入栈所以先弹出；C 随后成为栈顶，peek 不删除它。" },
    quiz: [
      ["浏览器“后退”最直接对应哪种结构？", "栈", "队列", "哈希桶", "最近访问的页面最先返回，符合 LIFO。"],
      ["遇到右括号时，匹配算法应先做什么？", "检查栈非空并比较栈顶左括号", "无条件 pop", "把右括号压栈后结束", "空栈右括号和类型不匹配都必须判错。"],
      ["peek 与 pop 的核心差异是什么？", "peek 不移除元素", "peek 只能用于数字", "pop 不返回值", "两者都访问栈顶，但只有 pop 改变栈状态。"],
      ["递归为什么与栈有关？", "每次调用会保存一个栈帧", "递归会自动创建队列", "递归不保存局部变量", "调用栈保存尚未返回的调用状态。"]
    ],
    lab: { scenario: "stack", title: "栈与撤销实验台", subtitle: "执行 push/pop/undo，观察栈顶和历史状态", defaultInput: "open,edit,save", defaultTarget: "publish", modes: [["push", "压入新操作"], ["pop", "弹出栈顶"], ["undo", "执行一次撤销"]] },
    debugChallenge: { code: `stack = []\nfor char in text:\n    if char == "(":\n        stack.append(char)\n    elif char == ")":\n        stack.pop()`, question: "输入以右括号开头时会发生什么？", choices: ["空栈 pop 触发 IndexError，必须先判断 stack", "自动忽略右括号", "右括号会变成左括号"], answer: 0, error: "空栈执行 pop 触发 IndexError，并且结束后还必须检查是否残留左括号", fix: "右括号分支先判断栈非空且类型匹配；扫描结束再确认栈为空", result: "多余右括号、类型错配和未闭合左括号都能被识别", explanation: "正确性来自每一步维护“栈中只保存尚未匹配的左括号”这一不变量。" },
    explanationChallenge: "为什么括号匹配适合栈，而不适合普通 FIFO 队列？",
    referenceAnswer: "右括号必须优先匹配最近出现且尚未闭合的左括号，这正是后进先出的顺序。栈顶保存当前最内层左括号，匹配后立即弹出；若使用 FIFO 队列，会先取最早的外层括号，破坏嵌套结构。算法还必须处理空栈右括号、括号类型不一致以及扫描结束仍有左括号三类失败。",
    evaluationGroups: [["最近", "最内层"], ["后进先出", "LIFO"], ["栈顶", "pop"], ["嵌套", "层次"], ["空栈", "未闭合"]],
    codeChallenge: { id: "stack-brackets", title: "真实代码验收 · 括号匹配器", brief: "实现 check_brackets(text)，只处理 ()[]{}；返回 valid 和 max_depth。错配或多余括号 valid=False，max_depth 是扫描期间最大未闭合深度。", starter: `def check_brackets(text):\n    stack = []\n    max_depth = 0\n    return {"valid": False, "max_depth": max_depth}`, checks: ["正确嵌套", "类型错配", "多余右括号（隐藏）", "空文本与最大深度（隐藏）"] }
  }),
  makeLesson({
    id: "ds-queue-deque", number: 5, title: "队列与双端队列",
    objectives: ["解释 FIFO 与队首队尾", "避免列表头删导致的线性搬移", "使用双端队列表达滑动窗口", "分析生产消费中的背压与容量"],
    concepts: [
      ["FIFO", "先进入的任务先离开，enqueue 在队尾加入，dequeue 从队首取出；顺序表达公平到达语义。"],
      ["头索引队列", "数组实现可维护 head 索引而不是 pop(0)，避免每次把剩余元素全部左移；需要周期性压缩已消费空间。"],
      ["deque", "双端队列支持两端 O(1) 加入和移除，适合滑动窗口、0-1 BFS 和任务窃取。"],
      ["背压", "生产速度超过消费速度时队列会持续增长；有界队列必须定义等待、拒绝、丢弃或降级策略。"]
    ],
    types: [["enqueue", "队尾加入", "O(1) 摊还", "满容量时可能扩容"], ["dequeue", "队首取出", "O(1)", "链式/环形/双端队列"], ["list.pop(0)", "数组头删", "O(n)", "剩余引用整体搬移"], ["deque 两端操作", "append/popleft", "O(1)", "不提供高效随机访问"]],
    referenceDescription: "队列不仅是容器，也是流量、顺序与故障策略的边界。",
    prediction: { code: `queue = ["A", "B", "C"]\nhead = 0\nprint(queue[head]); head += 1\nqueue.append("D")\nprint(queue[head:])`, choices: [`A ['B', 'C', 'D']`, `C ['A', 'B', 'D']`, `A ['A', 'B', 'C', 'D']`], answer: `A ['B', 'C', 'D']`, explanation: "读取 head=0 的 A 后只推进头索引，不搬移底层数组；D 加到队尾。" },
    quiz: [
      ["BFS 为什么使用队列？", "按发现先后逐层处理", "需要后进先出", "需要排序全部节点", "FIFO 保证距离较小的层先扩展。"],
      ["为什么不建议高频使用 list.pop(0)？", "它会搬移剩余元素，单次 O(n)", "它不能返回元素", "它会自动排序", "动态数组头部删除需要填补空位。"],
      ["有界队列满时最重要的设计是什么？", "明确背压或拒绝策略", "无限增加内存", "把 FIFO 改成随机", "系统必须决定如何处理超过消费能力的流量。"],
      ["滑动窗口为何常用 deque？", "需要高效移除过期队首并加入新队尾", "需要按索引二分", "只能保存两个元素", "窗口两端变化正好匹配双端操作。"]
    ],
    lab: { scenario: "queue", title: "队列与背压实验台", subtitle: "改变入队出队与容量，观察 FIFO 和积压", defaultInput: "task-1,task-2,task-3", defaultTarget: "task-4", modes: [["enqueue", "队尾入队"], ["dequeue", "队首出队"], ["bounded", "容量 3 的有界入队"]] },
    debugChallenge: { code: `queue = []\nwhile True:\n    task = receive()\n    queue.append(task)\n    # 消费速度始终低于生产速度`, question: "即使每次 append 都很快，系统为何仍会失败？", choices: ["队列无界增长最终耗尽内存，需要背压", "FIFO 会自动删除任务", "append 只能调用一次"], answer: 0, error: "容量与到达率没有约束，积压持续增长，最终造成内存耗尽和延迟失控", fix: "使用有界队列并配置阻塞、拒绝、降级或扩容消费者策略，同时监控队列深度", result: "过载变成可观测、可控制的系统状态", explanation: "数据结构选择必须连同容量和生产消费速率一起设计。" },
    explanationChallenge: "队列、栈和双端队列分别适合什么访问顺序？",
    referenceAnswer: "栈限制在同一端加入和移除，提供 LIFO，适合撤销和嵌套解析；队列从尾部加入、头部移除，提供 FIFO，适合公平任务调度和 BFS；双端队列允许两端 O(1) 操作，适合滑动窗口和需要两端策略的算法。选择时还要考虑随机访问、容量、背压和并发安全，不能只看方法名称。",
    evaluationGroups: [["LIFO", "栈"], ["FIFO", "队列"], ["两端", "deque"], ["BFS", "调度"], ["背压", "容量"]],
    codeChallenge: { id: "queue-events", title: "真实代码验收 · 头索引队列", brief: "实现 run_queue(operations)。操作为 enqueue:value 或 dequeue；不得用 pop(0)。返回 dequeued 和 remaining。空队列 dequeue 记录 None。", starter: `def run_queue(operations):\n    data = []\n    head = 0\n    dequeued = []\n    return {"dequeued": dequeued, "remaining": data[head:]}`, checks: ["交错入队出队", "空队列出队", "只入队（隐藏）", "全部消费（隐藏）"] }
  }),
  makeLesson({
    id: "ds-hash-table", number: 6, title: "哈希表、冲突与扩容",
    objectives: ["解释哈希值到桶索引的映射", "区分拉链法与开放寻址", "分析负载因子和扩容", "说明平均 O(1) 的前提和最坏情况"],
    concepts: [
      ["哈希函数", "把键稳定映射为整数，再压缩到桶范围；相等键必须得到相等哈希，但不同键允许冲突。"],
      ["冲突", "多个键落入同一桶。拉链法在桶内保存条目集合；开放寻址按探测序列寻找其他空槽。"],
      ["负载因子", "条目数与桶数的比值反映拥挤程度；过高会增加冲突和探测长度，通常通过扩容重新散列。"],
      ["键约束", "键在存放期间必须保持哈希和相等语义稳定；Python 的可变 list 不能直接作为 dict 键。"]
    ],
    types: [["查找/插入/删除", "分布良好", "平均 O(1)", "包含哈希与短桶成本"], ["最坏冲突", "全部进入同桶", "O(n)", "不能说永远常数"], ["扩容", "重新分配并散列", "O(n)", "摊还到多次插入"], ["有序遍历", "非核心能力", "不保证按键排序", "需要额外结构"]],
    referenceDescription: "哈希表用额外空间和无序性换取按键快速定位，性能依赖分布与负载。",
    prediction: { code: `buckets = [[], [], []]\nfor key in ["ab", "ba", "ad"]:\n    index = sum(ord(c) for c in key) % 3\n    buckets[index].append(key)\nprint(buckets)`, choices: [`[['ab', 'ba'], [], ['ad']]`, `[['ab'], ['ba'], ['ad']]`, `[[], ['ab', 'ba'], ['ad']]`], answer: `[['ab', 'ba'], [], ['ad']]`, explanation: "ab 与 ba 的字符码和都是 195，落在桶 0 发生冲突；ad 的字符码和是 197，197 % 3 = 2，落在桶 2。" },
    quiz: [
      ["两个不同键哈希值相同意味着什么？", "发生冲突，仍需用相等性区分键", "两个键必然相等", "必须删除其中一个", "哈希值只用于缩小候选范围。"],
      ["负载因子过高通常导致什么？", "冲突或探测成本增加", "键自动排序", "空间变成零", "桶更拥挤会增加桶内比较。"],
      ["为什么扩容后要重新散列？", "桶数变化会改变取模后的索引", "键值已经丢失", "哈希函数不能再次调用", "旧桶索引通常不适用于新桶数量。"],
      ["平均 O(1) 不等于什么？", "不等于每次和最坏情况都严格 O(1)", "不等于可以查找", "不等于使用额外空间", "冲突攻击或退化分布可使操作达到 O(n)。"]
    ],
    lab: { scenario: "hash", title: "哈希冲突实验台", subtitle: "改变桶数量，观察冲突、负载因子和查找桶", defaultInput: "ab,ba,ad,map,torch", defaultTarget: "3", modes: [["chain", "拉链分桶"], ["lookup", "查找第一个键"], ["resize", "桶数翻倍重散列"]] },
    debugChallenge: { code: `index = hash(key) % len(buckets)\nbuckets[index] = (key, value)  # 直接覆盖`, question: "两个键冲突时会发生什么？", choices: ["后写键覆盖先写键，需要桶内保存多个条目并比较键", "哈希保证绝不冲突", "取模会自动扩容"], answer: 0, error: "桶只保存一个条目，冲突键写入会破坏已有映射", fix: "使用拉链桶列表或开放寻址，并在查找、更新、删除时同时比较哈希与键", result: "冲突键可以共存，更新只影响相等键", explanation: "冲突不是异常，而是哈希表协议必须正确处理的正常情况。" },
    explanationChallenge: "为什么 dict 查找通常是 O(1)，却不能承诺永远 O(1)？",
    referenceAnswer: "哈希表先计算键的哈希并定位桶，分布均匀且负载受控时桶内候选很少，所以平均查找接近 O(1)。不同键可能冲突，极端情况下许多键集中在同一桶或形成长探测序列，查找会退化到 O(n)。扩容本身也需要 O(n) 重新散列，但可摊还到多次插入。工程上还应考虑哈希攻击、键不可变性和内存成本。",
    evaluationGroups: [["哈希", "桶"], ["冲突", "探测"], ["平均", "O(1)"], ["最坏", "O(n)"], ["负载", "扩容"], ["键", "不可变"]],
    codeChallenge: { id: "hash-buckets", title: "真实代码验收 · 拉链分桶", brief: "实现 bucketize(keys, bucket_count)，用每个字符 ord 之和对桶数取模，保持输入顺序，返回 buckets、collisions 和 load。", starter: `def bucketize(keys, bucket_count):\n    buckets = [[] for _ in range(bucket_count)]\n    collisions = 0\n    return {"buckets": buckets, "collisions": collisions, "load": 0}`, checks: ["存在冲突", "空键列表", "单桶退化（隐藏）", "多桶分布（隐藏）"] }
  }),
  makeLesson({
    id: "ds-binary-tree", number: 7, title: "二叉树与遍历",
    objectives: ["理解根、边、叶子、深度与高度", "推演前中后序和层序遍历", "区分递归调用栈与显式栈", "处理空树和缺失子节点"],
    concepts: [
      ["层级关系", "树由根和互不相交的子树组成；深度从根向下计数，高度从节点到最深叶子计数，必须先声明边数或节点数口径。"],
      ["深度优先遍历", "前序是根-左-右，中序是左-根-右，后序是左-右-根；差异只是处理根的时机。"],
      ["层序遍历", "使用队列按深度从小到大访问，适合最短层数、逐层统计和序列化。"],
      ["数组表示", "完全二叉树可用索引 i 的左右孩子 2i+1、2i+2 表示；一般稀疏树会浪费空槽。"]
    ],
    types: [["前序", "根左右", "结构复制/表达式", "DFS"], ["中序", "左根右", "BST 得到有序键", "DFS"], ["后序", "左右根", "释放/目录大小", "DFS"], ["层序", "逐层", "最短层数", "BFS 队列"]],
    referenceDescription: "遍历顺序决定节点何时被处理；同一棵树可以产生完全不同但都有意义的序列。",
    prediction: { code: `#       A\n#      / \\\n#     B   C\n# 前序：先根，再左子树，再右子树`, choices: ["A B C", "B A C", "B C A"], answer: "A B C", explanation: "前序在进入节点时立即处理根 A，再完整处理 B 子树，最后 C 子树。" },
    quiz: [
      ["BST 的中序遍历通常得到什么？", "按键非降序序列", "层序序列", "随机序列", "左子树键小、右子树键大，使中序有序。"],
      ["层序遍历使用什么核心结构？", "队列", "栈", "哈希集合即可", "按发现顺序处理同层节点需要 FIFO。"],
      ["后序为何适合计算目录总大小？", "先得到子树结果再处理父节点", "总是先访问根", "不需要遍历叶子", "父结果依赖孩子结果，符合左右根。"],
      ["空树高度为什么容易出错？", "高度口径可能按边或节点计数，必须统一", "空树有无限高度", "空树一定高度为 1", "不同定义会让基例相差 1。"]
    ],
    lab: { scenario: "tree", title: "二叉树遍历观测台", subtitle: "输入层序数组，对比四种遍历和高度", defaultInput: "A,B,C,D,E,null,F", defaultTarget: "A", modes: [["preorder", "前序"], ["inorder", "中序"], ["postorder", "后序"], ["level", "层序"]] },
    debugChallenge: { code: `def height(node):\n    return 1 + max(height(node.left), height(node.right))`, question: "遇到叶子后为何无法停止？", choices: ["缺少 node is None 的递归基例", "max 不能接收数字", "二叉树没有叶子"], answer: 0, error: "递归继续访问 None.left，触发 AttributeError 或无限错误链", fix: "先定义空树高度口径，例如 node is None 时返回 0，再递归左右子树", result: "叶子高度为 1，空树为 0，整树高度正确返回", explanation: "递归树算法必须先定义最小子问题和返回值语义。" },
    explanationChallenge: "前序、中序、后序和层序的状态结构为什么不同？",
    referenceAnswer: "前三种是深度优先遍历，需要记住尚未完成的祖先和另一棵子树，可由递归调用栈或显式栈保存；它们根据根节点处理时机产生前序、中序和后序。层序是广度优先遍历，需要保存已经发现但尚未处理的同层节点，因此使用 FIFO 队列。所有遍历都是 O(n) 时间，但辅助空间受树高或最大层宽影响。",
    evaluationGroups: [["深度优先", "DFS"], ["调用栈", "显式栈"], ["根", "处理时机"], ["层序", "BFS"], ["队列", "层宽"], ["O(n)", "空间"]],
    codeChallenge: { id: "tree-height", title: "真实代码验收 · 数组二叉树高度", brief: "实现 array_tree_height(values)。values 是含 None 空位的层序数组，根索引 0，孩子为 2i+1/2i+2；返回按节点数计算的最大高度。", starter: `def array_tree_height(values):\n    if not values or values[0] is None:\n        return 0\n    # 用栈保存 (index, depth)\n    return 0`, checks: ["非完整树", "空树", "单节点（隐藏）", "只有右链的稀疏树（隐藏）"] }
  }),
  makeLesson({
    id: "ds-bst", number: 8, title: "二叉搜索树",
    objectives: ["掌握 BST 顺序不变量", "实现查找和插入路径", "理解删除的三种节点情况", "解释退化与平衡的必要性"],
    concepts: [
      ["顺序不变量", "对每个节点，左子树键小于节点，右子树键大于节点；重复键必须预先定义计数、固定方向或拒绝策略。"],
      ["查找路径", "每次比较后只进入一棵子树；平衡时路径长度约 log n，退化链时达到 n。"],
      ["删除", "叶子直接移除；单孩子用孩子替代；双孩子通常用中序后继或前驱替换，再删除替代节点。"],
      ["平衡", "普通 BST 不自动平衡，有序插入会退化。AVL、红黑树等用旋转约束高度，标准库选择取决于操作需求。"]
    ],
    types: [["查找/插入", "平衡树", "O(log n)", "取决于高度 h"], ["查找/插入", "退化链", "O(n)", "有序输入可触发"], ["中序遍历", "访问全部键", "O(n)", "得到有序结果"], ["删除双孩子", "找后继并改线", "O(h)", "维持顺序不变量"]],
    referenceDescription: "BST 的复杂度本质是 O(h)；没有高度保证就不能直接写 O(log n)。",
    prediction: { code: `values = [8, 3, 10, 1, 6]\ntarget = 6\n# 从 8 开始按 BST 规则查找`, choices: ["8 → 3 → 6", "8 → 10 → 6", "1 → 3 → 6"], answer: "8 → 3 → 6", explanation: "6<8 进入左子树；6>3 进入右子树并命中。" },
    quiz: [
      ["普通 BST 查找为何可能是 O(n)？", "树可能退化成单链", "比较操作不存在", "中序遍历会删除节点", "复杂度是 O(h)，h 最坏可等于 n。"],
      ["删除双孩子节点常用什么方法？", "用中序后继/前驱替换后再删除", "直接丢弃整棵树", "交换左右子树即可", "替代键可保持顺序关系。"],
      ["重复键应如何处理？", "在接口中明确策略并始终维持不变量", "每次随机放置", "假装重复不存在", "计数、固定方向或拒绝都可，但必须一致。"],
      ["平衡树旋转的目的是什么？", "控制高度同时保持中序顺序", "把树变成哈希表", "删除所有叶子", "局部旋转不改变有序序列，却能调整高度。"]
    ],
    lab: { scenario: "bst", title: "BST 路径实验台", subtitle: "按输入顺序建树，观察查找路径和退化高度", defaultInput: "8,3,10,1,6,14,4,7,13", defaultTarget: "7", modes: [["search", "查找目标"], ["insert", "插入目标"], ["sorted", "有序输入退化对比"]] },
    debugChallenge: { code: `if target < node.key:\n    node = node.right\nelse:\n    node = node.left`, question: "查找路径有什么逻辑错误？", choices: ["左右方向写反，破坏顺序不变量的使用", "比较必须改成字符串", "BST 只能向左"], answer: 0, error: "较小目标进入右子树，较大目标进入左子树，可能错误报告不存在", fix: "target < key 进入 left，target > key 进入 right，相等时返回命中", result: "每次比较排除不可能的另一棵子树", explanation: "代码分支必须与树建立时采用的顺序不变量完全一致。" },
    explanationChallenge: "为什么说 BST 查找是 O(h)，而不是无条件 O(log n)？",
    referenceAnswer: "BST 每次比较只沿一条根到节点的路径前进，所以成本由树高 h 决定。若树保持近似平衡，h≈log n，查找是 O(log n)；普通 BST 不保证平衡，有序插入可能让每个节点只有一个孩子，h=n，查找退化为 O(n)。因此工程中要结合输入分布选择平衡树、随机化结构或其他索引。",
    evaluationGroups: [["高度", "h"], ["路径", "比较"], ["平衡", "log n"], ["退化", "链"], ["有序输入", "最坏"], ["结构选择", "索引"]],
    codeChallenge: { id: "bst-search-path", title: "真实代码验收 · 数组 BST 查找路径", brief: "实现 bst_search(values, target)。values 是含 None 的层序 BST；返回 path 中访问的键和 found。", starter: `def bst_search(values, target):\n    path = []\n    index = 0\n    return {"path": path, "found": False}`, checks: ["命中深层节点", "目标不存在", "空树（隐藏）", "根节点命中（隐藏）"] }
  }),
  makeLesson({
    id: "ds-heap", number: 9, title: "堆与优先队列",
    objectives: ["区分堆序与全局有序", "掌握数组父子索引", "推演上浮、下沉和建堆", "用优先队列表达 Top K 与调度"],
    concepts: [
      ["完全二叉树", "除最后一层外全部填满，最后一层从左到右填，因此适合紧凑数组表示。"],
      ["堆序", "最小堆只保证父节点不大于孩子，根是全局最小；兄弟和不同子树之间并不整体有序。"],
      ["上浮/下沉", "插入放末尾后与父比较上浮；删除根后用末尾替代并与较优孩子交换下沉。"],
      ["优先队列", "按优先级而非到达顺序取任务；相同优先级若需稳定性，应加入递增序号作为次级键。"]
    ],
    types: [["peek min/max", "读取根", "O(1)", "不删除"], ["push", "末尾加入后上浮", "O(log n)", "路径不超过树高"], ["pop root", "替换后下沉", "O(log n)", "恢复堆序"], ["heapify", "自底向上建堆", "O(n)", "不是 O(n log n) 的逐个插入"]],
    referenceDescription: "堆只维护解决优先级问题所需的局部顺序，不支付完整排序成本。",
    prediction: { code: `heap = [2, 5, 4, 9]\nheap.append(1)\n# 1 与父节点依次交换直到堆序恢复`, choices: ["[1, 2, 4, 9, 5]", "[1, 5, 4, 9, 2]", "[2, 5, 4, 9, 1]"], answer: "[1, 2, 4, 9, 5]", explanation: "1 先与索引 1 的 5 交换，再与根 2 交换；其他位置保持。" },
    quiz: [
      ["最小堆数组是否整体升序？", "不是，只保证父不大于孩子", "是，所有相邻项有序", "只有叶子有序", "堆序只约束父子局部关系，不约束兄弟或不同子树的全局顺序。"],
      ["索引 i 的父索引是什么？", "(i-1)//2", "2*i+1", "i+1", "零基数组父节点由整数除法计算。"],
      ["heapify 为什么可达 O(n)？", "多数底层节点下沉距离很短", "因为不比较", "因为数组长度固定为 1", "按高度汇总工作量形成线性总成本。"],
      ["稳定优先队列如何处理相同优先级？", "加入递增序号作为次级比较键", "随机弹出", "删除重复任务", "序号保留先到先服务顺序。"]
    ],
    lab: { scenario: "heap", title: "堆序修复实验台", subtitle: "执行 push/pop，逐步观察上浮和下沉", defaultInput: "2,5,4,9", defaultTarget: "1", modes: [["push", "插入并上浮"], ["pop", "弹出根并下沉"], ["heapify", "自底向上建堆"]] },
    debugChallenge: { code: `left = 2 * i\nright = 2 * i + 1  # 用于零基数组`, question: "孩子索引为什么错误？", choices: ["零基数组应为 2*i+1 和 2*i+2", "孩子必须用字符串索引", "根没有孩子"], answer: 0, error: "把一基公式用于零基数组，根 i=0 的 left 仍为 0，指向自己", fix: "零基数组使用 left=2*i+1、right=2*i+2，父索引为 (i-1)//2", result: "父子关系与完全二叉树数组布局一致", explanation: "索引公式必须先明确零基还是一基，边界检查应在访问之前。" },
    explanationChallenge: "为什么求 Top K 常用大小为 K 的堆，而不是把全部数据排序？",
    referenceAnswer: "对 n 个元素完整排序通常需要 O(n log n) 时间和保存全部排序关系。维护大小为 K 的最小堆时，每个候选只需与堆顶比较，必要时执行 O(log K) 的替换，总时间 O(n log K)，额外空间 O(K)。当 K 远小于 n 或数据流无法一次装入内存时优势明显；若最终需要全部有序，排序可能更合适。",
    evaluationGroups: [["Top K", "K"], ["堆顶", "比较"], ["O(n log K)", "log K"], ["O(K)", "空间"], ["K 远小于 n", "数据流"], ["完整排序", "取舍"]],
    codeChallenge: { id: "heap-push", title: "真实代码验收 · 最小堆上浮", brief: "实现 min_heap_push(heap, value)，复制输入，在末尾加入 value 并上浮；返回 heap 和 swaps。输入已满足最小堆。", starter: `def min_heap_push(heap, value):\n    data = heap[:]\n    data.append(value)\n    swaps = 0\n    return {"heap": data, "swaps": swaps}`, checks: ["上浮到根", "无需交换", "空堆（隐藏）", "上浮一层（隐藏）"] }
  }),
  makeLesson({
    id: "ds-graph", number: 10, title: "图、BFS 与 DFS",
    objectives: ["建模顶点、边、方向和权重", "比较邻接表与邻接矩阵", "手工推演 BFS/DFS", "处理 visited、连通分量和环"],
    concepts: [
      ["图模型", "顶点表示实体，边表示关系；必须明确有向/无向、带权/无权以及自环和重复边策略。"],
      ["存储", "邻接表空间 O(V+E)，适合稀疏图；邻接矩阵空间 O(V²)，边存在性查询 O(1)，适合稠密图。"],
      ["BFS", "队列逐层扩展；无权图中第一次到达节点的边数距离最短。visited 应在入队时标记，避免重复入队。"],
      ["DFS", "递归或显式栈沿路径深入，适合连通性、拓扑/环检测和回溯；深图需注意递归深度。"]
    ],
    types: [["邻接表", "稀疏图", "O(V+E) 空间", "遍历邻居高效"], ["邻接矩阵", "稠密图", "O(V²) 空间", "查边 O(1)"], ["BFS", "队列", "无权最短边数", "O(V+E)"], ["DFS", "栈/递归", "路径与结构分析", "O(V+E)"]],
    referenceDescription: "图算法的第一步不是套 BFS/DFS，而是确认边语义和所需答案。",
    prediction: { code: `graph = {"A": ["B", "C"], "B": ["D"], "C": ["D"], "D": []}\n# 从 A BFS，邻居按列表顺序入队`, choices: ["A B C D", "A B D C", "D B C A"], answer: "A B C D", explanation: "A 先发现 B、C；FIFO 先处理 B，再处理 C，D 只入队一次。" },
    quiz: [
      ["无权图最短边数为什么用 BFS？", "它按距离层逐层扩展", "它总选最大权重", "它不需要 visited", "首次发现节点时路径边数最少。"],
      ["visited 最好何时标记？", "节点入队/入栈时", "从队列取出很久以后", "永不标记", "发现时标记可避免同一节点被多次加入前沿。"],
      ["邻接矩阵适合什么场景？", "顶点不多且图较稠密、常查边", "海量稀疏关系", "完全不需要内存", "O(V²) 空间换取 O(1) 查边。"],
      ["遍历非连通图全部顶点需要什么？", "对每个未访问顶点再次启动遍历", "只从 0 开始一次", "删除孤立点", "一次遍历只能覆盖起点所在连通分量。"]
    ],
    lab: { scenario: "graph", title: "图搜索前沿实验台", subtitle: "输入边，比较 BFS 队列与 DFS 栈的访问顺序", defaultInput: "A-B,A-C,B-D,C-E,D-E", defaultTarget: "A", modes: [["bfs", "广度优先"], ["dfs", "深度优先"], ["components", "连通分量"]] },
    debugChallenge: { code: `queue.append(start)\nwhile queue:\n    node = queue.pop(0)\n    for neighbor in graph[node]:\n        if neighbor not in visited:\n            queue.append(neighbor)\n    visited.add(node)`, question: "为什么同一节点可能被大量重复入队？", choices: ["visited 标记太晚，应在入队时标记", "BFS 不允许队列", "邻居不能遍历"], answer: 0, error: "一个节点在首次入队到出队之间，可能被多个前驱再次发现并重复入队", fix: "起点入队前标记，邻居通过检查后立即标记再入队", result: "每个顶点最多入队一次，复杂度保持 O(V+E)", explanation: "visited 的时机是算法不变量的一部分，不只是代码风格。" },
    explanationChallenge: "BFS 和 DFS 都是 O(V+E)，为什么实际用途和空间风险不同？",
    referenceAnswer: "两者在邻接表上都会访问每个可达顶点和边，因此时间同为 O(V+E)，但保存的前沿不同。BFS 队列可能同时保存一整层，空间与最大层宽相关，并保证无权最短边数；DFS 只保存当前路径及待处理分支，空间与深度相关，适合结构探索和回溯，但递归实现可能栈溢出。选择取决于目标答案和图形状。",
    evaluationGroups: [["O(V+E)", "顶点"], ["队列", "层宽"], ["最短", "无权"], ["栈", "深度"], ["递归", "溢出"], ["目标", "图形状"]],
    codeChallenge: { id: "graph-bfs", title: "真实代码验收 · BFS 距离", brief: "实现 bfs_distances(adjacency, start)。adjacency 是 0..n-1 的邻接表；返回每个顶点距 start 的最少边数，不可达为 -1。", starter: `def bfs_distances(adjacency, start):\n    distances = [-1] * len(adjacency)\n    queue = [start]\n    head = 0\n    return distances`, checks: ["分叉图最短距离", "含不可达点", "单节点（隐藏）", "环图（隐藏）"] }
  }),
  makeLesson({
    id: "ds-sorting", number: 11, title: "排序算法与稳定性",
    objectives: ["比较选择、插入、归并和快速排序", "区分稳定性、原地性和最坏复杂度", "追踪比较、搬移与分区", "根据规模和数据分布选排序"],
    concepts: [
      ["稳定性", "相等键排序后保持原相对顺序；多字段分阶段排序和业务记录排序可能依赖这一性质。"],
      ["插入/选择", "插入排序对近乎有序数据友好且稳定；选择排序交换少但通常不稳定，二者最坏 O(n²)。"],
      ["归并", "分治后合并有序序列，稳定且最坏 O(n log n)，通常需要 O(n) 辅助空间。"],
      ["快速排序", "围绕枢轴分区，平均 O(n log n)，朴素枢轴在坏输入上最坏 O(n²)；工程实现会混合策略。"]
    ],
    types: [["插入排序", "稳定/原地", "最坏 O(n²)", "近乎有序时接近 O(n)"], ["选择排序", "通常不稳定/原地", "O(n²)", "交换次数少"], ["归并排序", "稳定/额外空间", "O(n log n)", "外部排序友好"], ["快速排序", "通常不稳定/原地分区", "平均 O(n log n)", "最坏 O(n²)"]],
    referenceDescription: "排序选择不只看大 O，还包括稳定性、内存、数据分布和实现常数。",
    prediction: { code: `items = [4, 2, 3]\n# 插入排序处理 2：4 右移，再把 2 写到索引 0\n# 接着处理 3`, choices: ["[2, 3, 4]", "[4, 2, 3]", "[3, 2, 4]"], answer: "[2, 3, 4]", explanation: "第二轮 4 再右移一格，3 插入 2 与 4 之间。" },
    quiz: [
      ["稳定排序保证什么？", "相等键元素保持原相对顺序", "任何输入都 O(n)", "不使用内存", "稳定性关注相等键记录的顺序。"],
      ["近乎有序小数组常适合什么？", "插入排序", "总是堆排序", "图 BFS", "插入元素只需少量搬移。"],
      ["归并排序的主要空间代价是什么？", "合并通常需要 O(n) 辅助数组", "需要 O(V²) 矩阵", "没有任何额外空间", "标准数组归并要暂存合并结果。"],
      ["为什么不能手写排序替代语言内置排序用于生产？", "内置实现经过优化和边界验证，应先用库并基准", "内置排序没有测试", "手写必然 O(1)", "教学实现用于理解，工程默认选择成熟库。"]
    ],
    lab: { scenario: "sorting", title: "排序轨迹比较台", subtitle: "比较插入、选择和归并排序的步骤与稳定性", defaultInput: "5,2,4,2,1", defaultTarget: "0", modes: [["insertion", "插入排序"], ["selection", "选择排序"], ["merge", "归并排序"]] },
    debugChallenge: { code: `for i in range(1, len(items)):\n    j = i\n    while j > 0 and items[j - 1] > items[j]:\n        items[j - 1] = items[j]\n        j -= 1`, question: "为什么元素会丢失？", choices: ["只覆盖左元素却未保存/交换原值", "while 不能排序", "j 不应该改变"], answer: 0, error: "把右值写到左侧后，原左值被覆盖，没有移动到右侧", fix: "保存 key 并右移较大元素，最后写入 key；或正确交换两项", result: "所有输入元素数量保持不变且序列有序", explanation: "排序不变量除了局部有序，还包括元素多重集合不变。" },
    explanationChallenge: "为什么“都是 O(n log n)”不足以决定生产环境排序选择？",
    referenceAnswer: "相同渐进复杂度的算法仍可能在稳定性、额外空间、缓存局部性、最坏情况、常数开销和数据分布上不同。归并排序稳定且最坏 O(n log n) 但需要辅助空间；快速排序缓存友好、平均很快但需防坏分区；语言内置排序通常采用混合算法并针对真实数据优化。工程上应先使用成熟库，再根据稳定性和资源约束基准验证。",
    evaluationGroups: [["稳定", "相等键"], ["空间", "内存"], ["最坏", "平均"], ["缓存", "常数"], ["数据分布", "近乎有序"], ["内置", "混合算法"], ["基准", "验证"]],
    codeChallenge: { id: "insertion-sort-shifts", title: "真实代码验收 · 插入排序搬移计数", brief: "实现 insertion_sort_with_shifts(values)，返回新排序列表和把较大元素向右搬移的总 shifts，不修改输入。", starter: `def insertion_sort_with_shifts(values):\n    data = values[:]\n    shifts = 0\n    return {"values": data, "shifts": shifts}`, checks: ["逆序搬移", "已排序零搬移", "重复值稳定边界（隐藏）", "空列表（隐藏）"] }
  }),
  makeLesson({
    id: "ds-binary-search", number: 12, title: "二分查找与边界",
    objectives: ["说明有序与随机访问前提", "维护闭区间或半开区间不变量", "实现精确查找和左右边界", "诊断死循环与越界"],
    concepts: [
      ["前提", "二分查找依赖可按顺序排除一半候选的单调性；普通无序数组不能直接二分。"],
      ["区间不变量", "闭区间 [left,right] 与半开区间 [left,right) 都可正确实现，但更新和循环条件不能混用。"],
      ["中点与收缩", "每轮必须排除 mid 或明确保留它，保证区间严格缩小；固定宽整数语言还要避免 left+right 溢出。"],
      ["边界版本", "查找第一个不小于 target、最后一个不大于 target 可统一解决重复值插入点和范围查询。"]
    ],
    types: [["精确查找", "命中任意相等项", "O(log n)", "重复值位置不固定"], ["lower_bound", "首个 ≥ target", "O(log n)", "可作为插入点"], ["upper_bound", "首个 > target", "O(log n)", "与 lower 组成范围"], ["链表二分", "中点定位昂贵", "通常不合适", "随机访问前提缺失"]],
    referenceDescription: "二分最难的不是除以二，而是始终说清候选区间包含什么。",
    prediction: { code: `data = [2, 4, 6, 8, 10]\nleft, right = 0, 4\n# 查找 8：依次记录 mid`, choices: ["2 → 3", "0 → 1 → 3", "4 → 3"], answer: "2 → 3", explanation: "mid=2 值 6 偏小，left=3；mid=3 命中 8。" },
    quiz: [
      ["二分查找最核心的前提是什么？", "候选空间具有可利用的单调性", "数据必须是字符串", "只能有偶数个元素", "比较结果必须能排除一侧。"],
      ["闭区间未命中且 data[mid]<target 时如何更新？", "left=mid+1", "left=mid", "right=mid+1", "mid 已确定不可能，应排除。"],
      ["为什么 left=mid 可能死循环？", "两元素区间中 mid 可能一直等于 left", "mid 会变字符串", "循环最多一次", "当 mid 等于 left 时赋回原值，候选区间长度没有严格缩小，循环状态会重复。"],
      ["重复值范围查询常用什么？", "lower_bound 与 upper_bound", "随机抽样", "只看第一个元素", "两个边界给出半开范围。"]
    ],
    lab: { scenario: "binary-search", title: "二分区间审计台", subtitle: "逐轮显示 left、mid、right 和被排除的区间", defaultInput: "2,4,6,8,10,12,14", defaultTarget: "10", modes: [["exact", "精确查找"], ["lower", "第一个 ≥ target"], ["upper", "第一个 > target"]] },
    debugChallenge: { code: `while left <= right:\n    mid = (left + right) // 2\n    if data[mid] < target:\n        left = mid\n    else:\n        right = mid - 1`, question: "何时会死循环？", choices: ["left 与 mid 相等且目标更大时区间不缩小", "数组有序时", "target 是整数时"], answer: 0, error: "例如 left=0,right=1 时 mid=0，left=mid 仍为 0，状态重复", fix: "闭区间排除 mid 时使用 left=mid+1；或改用一致的半开区间模板", result: "每轮候选区间严格缩小并最终终止", explanation: "终止证明需要一个严格下降的区间长度，而不是凭经验写循环。" },
    explanationChallenge: "为什么二分查找的区间定义必须从循环条件一直保持一致？",
    referenceAnswer: "闭区间 [left,right] 表示两个端点都可能是答案，循环条件通常是 left<=right，排除 mid 后用 mid±1；半开区间 [left,right) 不包含 right，循环通常是 left<right，更新规则不同。若把两套模板混合，就会遗漏边界、越界或区间不缩小而死循环。每轮应能说明答案仍在候选区间内且区间长度严格下降。",
    evaluationGroups: [["闭区间", "半开"], ["循环条件", "端点"], ["mid", "排除"], ["边界", "遗漏"], ["严格缩小", "终止"], ["不变量", "候选"]],
    codeChallenge: { id: "binary-search-trace", title: "真实代码验收 · 可解释二分查找", brief: "实现 binary_search_trace(values,target)，使用闭区间，返回 index（未找到 -1）和每轮访问的 mid 索引 probes。", starter: `def binary_search_trace(values, target):\n    left = 0\n    right = len(values) - 1\n    probes = []\n    return {"index": -1, "probes": probes}`, checks: ["命中", "未命中", "空列表（隐藏）", "单元素（隐藏）"] }
  }),
  makeLesson({
    id: "ds-recursion", number: 13, title: "递归、调用栈与分治",
    objectives: ["定义递归基例和递归规模", "追踪入栈与返回阶段", "证明递归终止", "识别重复子问题与栈深风险"],
    concepts: [
      ["基例", "直接返回的最小问题，阻止继续调用；基例必须覆盖所有可能到达的边界状态。"],
      ["规模缩小", "递归调用必须朝基例严格推进，例如 n-1 或子数组；仅写 self-call 不构成正确递归。"],
      ["调用栈", "每层保存自己的参数和局部变量，返回时按相反顺序恢复；空间通常与最大递归深度相关。"],
      ["分治", "把问题分成独立子问题、递归求解再合并；若子问题重叠，记忆化或动态规划可能更合适。"]
    ],
    types: [["线性递归", "规模 n-1", "O(n) 深度", "注意栈限制"], ["二分递归", "规模减半", "O(log n) 深度", "如二分分治"], ["分治", "多个独立子问题", "主定理分析", "需要合并成本"], ["重叠递归", "重复计算", "可能指数时间", "考虑记忆化"]],
    referenceDescription: "递归是用调用栈保存未完成状态；正确性必须同时说明基例、缩小和组合。",
    prediction: { code: `def f(n):\n    if n == 0:\n        return\n    print(n)\n    f(n - 1)\n    print(n)\nf(2)`, choices: ["2 1 1 2", "2 1 2 1", "1 2 2 1"], answer: "2 1 1 2", explanation: "进入阶段打印 2、1；到基例后按调用栈返回，打印 1、2。" },
    quiz: [
      ["递归终止需要证明什么？", "每次调用严格接近可达基例", "函数名足够长", "必须使用全局变量", "下降度量和基例共同保证终止。"],
      ["递归空间复杂度通常看什么？", "最大同时存在的栈帧数", "总打印字符", "返回值类型名称", "调用返回前栈帧不会释放。"],
      ["朴素 Fibonacci 为什么慢？", "相同子问题被反复计算", "加法是 O(n²)", "没有基例", "递归树含大量重叠分支。"],
      ["何时显式栈可能优于递归？", "深度可能超过语言递归限制或需控制状态", "任何函数都不能递归", "只有空输入", "显式状态更可控且避免调用栈溢出。"]
    ],
    lab: { scenario: "recursion", title: "递归栈帧实验台", subtitle: "观察调用、基例和返回阶段的状态", defaultInput: "5", defaultTarget: "1", modes: [["factorial", "阶乘调用链"], ["fibonacci", "朴素斐波那契调用数"], ["divide", "二分递归深度"]] },
    debugChallenge: { code: `def countdown(n):\n    if n == 0:\n        print("done")\n    countdown(n - 1)`, question: "为什么到 0 后仍继续递归？", choices: ["基例缺少 return 或 else，执行会继续向下", "n 不能比较", "递归只能从负数开始"], answer: 0, error: "打印 done 后没有终止当前调用，继续调用 -1、-2，最终 RecursionError", fix: "基例执行后立即 return，并根据输入约束处理 n<=0", result: "递归规模到达基例后开始正常返回", explanation: "基例既要识别状态，也要切断递归路径。" },
    explanationChallenge: "如何证明一个递归函数会终止并返回正确结果？",
    referenceAnswer: "先定义可度量的问题规模和基例，说明基例结果正确；再证明每次递归调用都让规模严格减小且不会越过基例，因此最终终止。正确性可用归纳思想：假设更小子问题返回正确结果，再证明当前层组合这些结果能得到当前问题答案。还要分析最大递归深度、重复子问题和异常输入。",
    evaluationGroups: [["规模", "度量"], ["基例", "直接返回"], ["严格减小", "终止"], ["归纳", "假设"], ["组合", "正确"], ["深度", "栈"], ["重复子问题", "记忆化"]],
    codeChallenge: { id: "recursive-sum", title: "真实代码验收 · 递归求和", brief: "实现 recursive_sum(values)，必须用自身递归调用处理切片；空列表返回 0。", starter: `def recursive_sum(values):\n    if not values:\n        return 0\n    # 当前首项 + 更小列表的结果\n    return 0`, checks: ["普通列表", "空列表", "含负数（隐藏）", "单元素（隐藏）"] }
  }),
  makeLesson({
    id: "ds-backtracking", number: 14, title: "回溯、决策树与剪枝",
    objectives: ["识别选择、约束和目标", "维护选择路径并正确撤销", "画出决策树", "用剪枝减少无效搜索"],
    concepts: [
      ["决策树", "每层代表一个决策位置，分支代表候选选择；叶子可能是完整解或失败状态。"],
      ["做选择/撤销", "进入递归前修改路径，返回后恢复原状态，保证兄弟分支从同一父状态出发。"],
      ["约束剪枝", "一旦部分路径已违反约束，就不再扩展其后代；剪枝不应删除仍可能形成答案的状态。"],
      ["复杂度", "搜索空间常为 2^n、n! 等指数或阶乘规模；回溯改善枚举组织方式，但不会自动变成多项式。"]
    ],
    types: [["子集", "选/不选", "2^n 个结果", "每层二分"], ["排列", "选择未使用元素", "n! 个结果", "需 used 状态"], ["组合", "递增起点", "避免顺序重复", "可按剩余量剪枝"], ["约束问题", "合法性检查", "最坏仍指数", "剪枝影响实际规模"]],
    referenceDescription: "回溯的核心不是递归模板，而是让每个分支拥有干净、可恢复的状态。",
    prediction: { code: `# 对 [A,B] 依次做“不选/选”\n# 叶子按该顺序记录 path`, choices: ["[], [B], [A], [A,B]", "[], [A], [B], [A,B]", "[A,B]"], answer: "[], [B], [A], [A,B]", explanation: "先对 A 不选，再对 B 不选/选；然后回到根选择 A，再处理 B。" },
    quiz: [
      ["回溯中撤销选择的目的是什么？", "恢复父状态，避免污染兄弟分支", "删除所有答案", "强制变成 BFS", "共享路径对象必须在返回后复原。"],
      ["剪枝必须满足什么条件？", "被剪状态不可能产生合法答案", "看起来运行慢", "随机删除一半分支", "剪枝条件必须可证明安全，否则会把仍能产生合法答案的子树一起删除。"],
      ["n 个不同元素有多少排列？", "n!", "2n", "log n", "第一位 n 种、第二位 n-1 种依次相乘。"],
      ["记录 path 时为何常需复制？", "后续回溯会继续修改同一个路径对象", "列表不能读取", "复制能降低结果数", "保存引用会让历史答案随路径变化。"]
    ],
    lab: { scenario: "backtracking", title: "回溯决策树实验台", subtitle: "生成子集或排列，观察选择、撤销与剪枝", defaultInput: "A,B,C", defaultTarget: "2", modes: [["subsets", "生成全部子集"], ["permutations", "生成排列"], ["choose-k", "只选 K 项剪枝"]] },
    debugChallenge: { code: `path.append(choice)\nbacktrack(next_state)\n# 忘记 path.pop()`, question: "为什么后续分支包含前一个分支的选择？", choices: ["缺少撤销，路径共享状态被污染", "append 会自动清空", "递归没有返回值"], answer: 0, error: "返回父层后 path 仍保留刚才的 choice，兄弟分支起点错误", fix: "递归调用返回后执行与选择相反的撤销操作；记录答案时复制 path", result: "每个分支从正确父状态展开，答案互不污染", explanation: "做选择和撤销必须成对出现，可用进入/退出栈帧来理解。" },
    explanationChallenge: "回溯为什么通常仍是指数复杂度，剪枝又有什么价值？",
    referenceAnswer: "回溯系统地遍历决策树，子集有 2^n 个候选、排列有 n! 个候选，若题目本身要求输出全部结果，结果规模已经决定至少需要相应时间。剪枝利用约束提前停止不可能成功的子树，不能改变所有问题的最坏复杂度，但能显著减少实际访问节点。正确剪枝必须证明不会排除合法答案。",
    evaluationGroups: [["决策树", "分支"], ["2^n", "n!"], ["输出规模", "下界"], ["剪枝", "提前"], ["最坏", "指数"], ["证明", "不漏解"]],
    codeChallenge: { id: "generate-subsets", title: "真实代码验收 · 递归生成子集", brief: "实现 generate_subsets(values)，返回顺序固定为先不选首项的结果，再选首项的结果；不得使用 itertools。", starter: `def generate_subsets(values):\n    if not values:\n        return [[]]\n    # 递归处理 values[1:]\n    return []`, checks: ["两个元素顺序", "空列表", "单元素（隐藏）", "三个元素（隐藏）"] }
  }),
  makeLesson({
    id: "ds-dynamic-programming", number: 15, title: "动态规划与状态转移",
    objectives: ["识别重叠子问题与最优子结构", "定义状态及其语义", "写出转移、基例和计算顺序", "比较记忆化、表格和空间压缩"],
    concepts: [
      ["状态", "dp[i] 必须用完整句子定义，例如“到达第 i 阶的方法数”；含义不清会让转移和答案位置都出错。"],
      ["转移", "用已解决的更小状态表达当前状态，并说明每一项对应的最后一步选择。"],
      ["基例与顺序", "基例为递推提供起点；计算顺序必须保证依赖状态已经可用。"],
      ["记忆化/表格", "自顶向下记忆化按需计算，自底向上表格控制顺序；只依赖有限前项时可压缩空间。"]
    ],
    types: [["记忆化递归", "按需搜索+缓存", "易从递归改造", "有调用栈"], ["自底向上", "表格迭代", "顺序明确", "便于空间压缩"], ["一维 DP", "单索引状态", "O(n) 常见", "如爬楼梯"], ["二维 DP", "两个维度", "O(nm) 常见", "如网格/序列"]],
    referenceDescription: "动态规划不是背公式，而是把重复决策压缩成有明确语义的状态。",
    prediction: { code: `dp = [0, 1, 2]\nfor i in range(3, 6):\n    dp.append(dp[i-1] + dp[i-2])\nprint(dp[5])`, choices: ["8", "5", "13"], answer: "8", explanation: "dp[3]=3、dp[4]=5、dp[5]=8，表示每步走 1 或 2 阶的方法数。" },
    quiz: [
      ["设计 DP 首先应写清什么？", "状态的精确定义", "变量名必须叫 dp", "先压缩空间", "状态语义决定转移和答案。"],
      ["爬楼梯转移 dp[i]=dp[i-1]+dp[i-2] 表示什么？", "最后一步来自 i-1 或 i-2，两类方案互斥且完整", "必须走三步", "两项永远相等", "按照最后一步来自哪一阶划分方案，两类来源互斥并覆盖所有到达方式。"],
      ["空间压缩的前提是什么？", "当前状态只依赖有限旧状态且不再需要更早值", "任何 DP 都 O(1) 空间", "删除基例", "压缩前必须确认更早状态不会被未来转移再次依赖，否则会覆盖仍有用途的数据。"],
      ["何时不适合强行使用 DP？", "子问题没有重叠或状态空间比直接方法更大", "存在整数输入", "需要返回答案", "DP 的缓存只有在复用子问题时有价值。"]
    ],
    lab: { scenario: "dp", title: "动态规划状态表", subtitle: "选择问题，逐格观察基例、转移和空间压缩", defaultInput: "7", defaultTarget: "1,2", modes: [["climb", "爬楼梯"], ["fibonacci", "斐波那契"], ["coin", "最少硬币（目标 n）"]] },
    debugChallenge: { code: `dp = [0] * (n + 1)\nfor i in range(2, n + 1):\n    dp[i] = dp[i - 1] + dp[i - 2]`, question: "为什么所有状态可能一直是 0？", choices: ["缺少非零基例，递推没有信息来源", "列表不能保存整数", "循环次数太多"], answer: 0, error: "dp[0]、dp[1] 都为 0，后续只会把零相加", fix: "根据状态语义设置基例，例如爬楼梯 dp[0]=1、dp[1]=1", result: "转移从正确起点逐步生成后续状态", explanation: "基例不是模板装饰，而是递推证明的起点。" },
    explanationChallenge: "如何从题目推导动态规划，而不是背状态转移公式？",
    referenceAnswer: "先识别决策过程中的重复子问题，用一句话定义状态及变量范围；再按最后一步或最后一个选择划分所有方案，确保互斥且完整，从而写出转移。随后确定最小问题的基例、依赖方向和计算顺序，最后定位题目答案并分析时间空间复杂度。只有确认旧状态不再使用后才能空间压缩，还应测试空输入和最小边界。",
    evaluationGroups: [["重复子问题", "复用"], ["状态", "定义"], ["最后一步", "划分"], ["互斥", "完整"], ["基例", "起点"], ["顺序", "依赖"], ["空间压缩", "旧状态"]],
    codeChallenge: { id: "climb-ways", title: "真实代码验收 · 爬楼梯 DP", brief: "实现 climb_ways(n)，每次走 1 或 2 阶，返回到达 n 的方法数；规定 n=0 返回 1，负数返回 0。", starter: `def climb_ways(n):\n    if n < 0:\n        return 0\n    # 定义并迭代状态\n    return 0`, checks: ["n=5", "n=0", "负数（隐藏）", "n=10（隐藏）"] }
  }),
  makeLesson({
    id: "ds-structure-selection", number: 16, title: "工程选型与面试官关卡",
    duration: "140–180 分钟",
    objectives: ["从操作比例和约束选择数据结构", "比较时间、空间、顺序与实现成本", "根据公司规模选择库、服务与治理强度", "完成跨结构系统设计和面试追问"],
    concepts: [
      ["工作负载", "选择结构前量化读写比例、数据规模、延迟目标、顺序要求、内存限制和并发方式，而不是从喜欢的结构出发。"],
      ["组合结构", "真实系统常组合结构：LRU 使用哈希表+双向链表，任务调度使用哈希索引+优先队列，图搜索使用邻接表+队列。"],
      ["公司阶段", "原型/小团队优先标准库、单进程和可调试性；增长期补监控、持久化队列和容量治理；大规模才按证据引入分片、分布式索引和专门平台。"],
      ["证据演进", "架构升级应由容量、可靠性、组织边界或合规指标触发，并保留基准、压测、故障演练和回滚证据。"]
    ],
    types: [["随机索引+遍历", "动态数组", "访问 O(1)", "中间改动 O(n)"], ["按键查找", "哈希表", "平均 O(1)", "无序且占额外空间"], ["优先级", "堆", "push/pop O(log n)", "只保证堆顶"], ["关系与路径", "图+搜索", "O(V+E)", "先定义边语义"]],
    referenceDescription: "不存在脱离规模、团队和约束的“最好架构”；只有证据充分、复杂度匹配的选择。",
    prediction: { code: `需求：缓存 get/put 平均 O(1)，容量满时淘汰最久未使用项\n候选：数组、单哈希表、哈希表 + 双向链表`, choices: ["哈希表 + 双向链表", "只用排序数组", "只用栈"], answer: "哈希表 + 双向链表", explanation: "哈希表 O(1) 定位，双向链表 O(1) 移到队首和淘汰队尾；单一结构难同时满足。" },
    quiz: [
      ["小团队低流量任务队列首先应考虑什么？", "标准库/数据库队列表加清晰失败策略，按证据演进", "直接建设跨地域消息平台", "不做任何持久化分析", "复杂基础设施会带来运营成本。"],
      ["LRU 为什么组合哈希表和双向链表？", "同时获得按键定位和 O(1) 顺序调整", "为了让所有操作 O(0)", "哈希表不能存值", "两种结构分别承担不同访问模式。"],
      ["何时值得引入分布式结构？", "单机容量、可靠性或组织边界有可观测证据", "看到大公司使用时", "项目第一天", "升级必须由容量、可靠性或组织协作等真实约束触发，并通过指标验证。"],
      ["面试回答数据结构选型应包含什么？", "需求约束、候选比较、复杂度、边界和验证", "只报一个结构名", "只背平均复杂度", "完整推理比孤立结论更能证明理解。"]
    ],
    lab: { scenario: "selection", title: "全局数据结构决策台", subtitle: "输入主要操作和公司阶段，得到候选、风险与演进触发器", defaultInput: "key-lookup,recency-update,evict-oldest", defaultTarget: "100000", modes: [["prototype", "原型/小团队"], ["growth", "增长期团队"], ["scale", "大规模/多团队"]] },
    debugChallenge: { code: `# 因为某大厂使用微服务 + 分布式缓存\n# 所以 3 人团队的新项目第一天照搬全部架构`, question: "这个架构推理缺少什么？", choices: ["本项目规模、工作负载、团队能力和演进证据", "更多技术名词", "把所有结构都换成数组"], answer: 0, error: "把他人的约束与解法直接复制，忽略当前系统的成本和真实瓶颈", fix: "先用决策矩阵比较最小可行方案，定义容量/可靠性触发器，再渐进引入复杂组件", result: "架构复杂度与业务阶段匹配，升级路径可验证可回滚", explanation: "先进不是组件数量多，而是在约束下以最低总成本达成目标。" },
    explanationChallenge: "同一个任务调度需求，在 3 人团队、增长期公司和大型平台中，数据结构与工具选择为什么会不同？",
    referenceAnswer: "核心优先级语义可能都由堆或队列承担，但系统约束不同。3 人团队应优先标准库、单体进程或数据库持久化队列，降低运维和排错成本；增长期需要有界队列、指标、重试、死信和多消费者；大型平台可能因跨团队隔离、海量吞吐、跨地域容灾和合规引入分区消息系统、分布式调度与统一治理。演进应由容量、可靠性和组织指标触发，并用压测与故障演练验证。",
    evaluationGroups: [["堆", "队列"], ["小团队", "标准库"], ["增长", "监控"], ["大型", "分布式"], ["运维", "成本"], ["容量", "可靠性"], ["压测", "故障演练"], ["演进", "触发"]],
    codeChallenge: { id: "recommend-structure", title: "真实代码验收 · 结构决策器", brief: "实现 recommend_structure(requirements)。按优先级规则：priority→heap，key_lookup+recency→hash+doubly-linked-list，fifo→queue，lifo→stack，random_index→dynamic-array，否则 list。", starter: `def recommend_structure(requirements):\n    # requirements 是字符串列表\n    return "list"`, checks: ["优先级最高", "LRU 组合", "FIFO/LIFO（隐藏）", "随机索引和默认（隐藏）"] },
    graduation: {
      title: "算法迷宫 L3 · 框架毕业考核",
      requirements: [
        "面对一个新需求，先写数据规模、读写比例、顺序语义、延迟和内存约束",
        "至少比较三种候选结构，并推导关键操作的最好、平均、最坏或摊还复杂度",
        "画出数组槽位、链表引用、树层级或图邻接关系，逐步解释状态变化",
        "独立完成一个跨结构功能，例如哈希索引 + 双向链表 LRU，或图 + 堆路径调度",
        "通过正常、空输入、单元素、重复值、退化结构和规模边界测试",
        "注入越界、断链、死循环、错误 visited 或错误状态转移并根据证据定位",
        "解释标准库、教学实现与生产组件的选择边界，不盲目重复造轮子",
        "根据小团队、增长期和大规模公司的约束提出渐进架构及升级触发器",
        "接受复杂度追问、现场编码、结构选型和系统设计四类面试官连续追问"
      ]
    }
  })
];
