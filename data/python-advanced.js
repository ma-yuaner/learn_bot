export const advancedPythonLessons = [
  {
    id: "python-oop",
    trackId: "python",
    title: "08 · 面向对象：类、对象与三大特性",
    duration: "100–130 分钟",
    objectives: ["区分类与实例，说明属性和方法属于谁", "使用 __init__ 建立合法初始状态", "理解封装、继承和多态解决的问题", "识别共享类属性和错误继承造成的状态污染"],
    concepts: [
      { term: "类与对象", detail: "类描述一类对象共同的数据和行为，对象是按该描述创建的具体实例。类是模型，不是现实数据本身。" },
      { term: "封装", detail: "对象把状态与维护状态的操作放在一起，通过方法保护不变量，而不是让外部任意修改内部数据。" },
      { term: "继承", detail: "子类复用父类的稳定接口并补充差异。继承表达“是一种”，不能只为了少写几行代码而滥用。" },
      { term: "多态", detail: "不同对象实现相同方法接口，调用者可以用统一方式使用它们，减少针对具体类型的条件分支。" }
    ],
    types: [["class", "定义类型", "class Explorer:", "创建类对象"], ["__init__", "初始化实例", "self.energy = energy", "每个实例独立状态"], ["实例方法", "操作对象", "explorer.move()", "第一个参数是 self"], ["继承", "扩展接口", "class Mage(Explorer):", "优先组合，谨慎继承"]],
    referenceTitle: "对象模型的四个问题",
    referenceDescription: "对象是谁、拥有什么状态、能做什么、必须维持什么规则。",
    prediction: {
      code: `class Explorer:\n    team = "AI"\n    def __init__(self, name):\n        self.name = name\n\na = Explorer("甲")\nb = Explorer("乙")\na.name = "新甲"\nprint(b.name, b.team)`,
      choices: ["新甲 AI", "乙 AI", "乙 乙"], answer: "乙 AI",
      explanation: "name 是每个实例自己的属性，修改 a.name 不影响 b.name；team 是类属性，两个实例都可通过类找到 AI。"
    },
    quiz: [
      { question: "__init__ 的主要职责是什么？", options: ["销毁对象", "建立实例的合法初始状态", "导入模块"], answer: 1, reason: "创建实例时 __init__ 接收参数并设置实例属性。" },
      { question: "什么时候更适合组合而不是继承？", options: ["表达“拥有一个能力组件”", "表达稳定的“是一种”关系", "任何时候都必须继承"], answer: 0, reason: "组合表达“拥有”，耦合通常更低，也更容易替换。" },
      { question: "多态的关键是什么？", options: ["所有类属性完全相同", "不同对象遵守相同调用接口", "只允许一个类"], answer: 1, reason: "调用者依赖共同接口，而非每个具体实现。" }
    ],
    lab: { kind: "oop", title: "对象状态实验室", subtitle: "创建两个实例，观察独立状态和共享类属性" },
    debugChallenge: {
      code: `class Bag:\n    items = []\n    def add(self, item):\n        self.items.append(item)\n\na = Bag(); b = Bag()\na.add("map")\nprint(b.items)`,
      question: "为什么 b 的背包里也出现 map？",
      choices: ["append 会修改所有变量", "items 是所有实例共享的类属性", "b 自动复制了 a"], answer: 1,
      error: `没有异常，但错误结果为 b.items == ["map"]`,
      fix: `class Bag:\n    def __init__(self):\n        self.items = []`,
      result: `a.items == ["map"]；b.items == []`,
      explanation: "类体中的列表只创建一次，所有实例经由类共享它。每个背包应在 __init__ 中创建自己的实例列表。"
    },
    explanationChallenge: "为什么把可变列表写成类属性会污染多个实例？如何判断状态应该属于类还是实例？",
    referenceAnswer: "类属性存放在类对象上，只创建一次；实例未找到同名属性时会继续到类上查找，因此多个实例会操作同一个可变列表。若状态描述某个具体对象，例如每个人的背包，就应在 __init__ 中创建实例属性；只有所有实例真正共享且修改应全局可见的状态，才适合作为类属性。",
    explanationHint: "建议提到：类只创建一次、实例查找、共享可变对象、__init__……",
    evaluationGroups: [["类属性", "类对象"], ["共享", "同一个"], ["可变", "列表"], ["实例", "__init__"], ["状态", "属于"]]
  },
  {
    id: "python-modules",
    trackId: "python",
    title: "09 · 模块、包、虚拟环境与依赖",
    duration: "90–120 分钟",
    objectives: ["说明模块和包如何组织命名空间", "追踪 import 搜索顺序与模块缓存", "使用 __name__ 保护脚本入口", "理解虚拟环境、pip 与可复现依赖"],
    concepts: [
      { term: "模块", detail: "一个 .py 文件就是模块，可以包含变量、函数和类；导入模块会执行其顶层语句并建立命名空间。" },
      { term: "包", detail: "包使用目录组织相关模块，形成分层命名空间。清晰边界比把所有文件塞进一个目录更重要。" },
      { term: "导入系统", detail: "Python 根据模块缓存和搜索路径查找名称。本地文件与标准库同名会产生遮蔽，导致难以理解的导入错误。" },
      { term: "虚拟环境", detail: "虚拟环境为项目隔离解释器和第三方依赖。依赖清单与锁定版本帮助另一台机器复现运行环境。" }
    ],
    types: [["import", "导入模块", "import math", "通过模块名访问"], ["from", "导入成员", "from x import y", "避免星号导入"], ["__name__", "入口保护", "if __name__ == '__main__':", "导入时不执行入口"], ["venv", "隔离依赖", "python -m venv .venv", "项目环境独立"]],
    referenceTitle: "可复现项目的四层",
    referenceDescription: "模块边界、包命名空间、运行入口、隔离依赖缺一不可。",
    prediction: {
      code: `# helper.py\nprint("load")\nvalue = 7\n\n# main.py\nimport helper\nimport helper\nprint(helper.value)`,
      choices: ["load load 7", "load 7", "7"], answer: "load 7",
      explanation: "第一次导入执行 helper 顶层代码并缓存模块；同一进程再次导入直接复用缓存，不重复输出 load。"
    },
    quiz: [
      { question:"为什么本地文件不应命名为 random.py？", options:["文件名太长","可能遮蔽标准库 random","Python 不允许英文"], answer:1, reason:"当前目录通常在搜索路径前部，同名文件会被优先导入。" },
      { question:"if __name__ == '__main__' 的作用是？", options:["只在直接运行文件时执行入口","加快所有函数","安装依赖"], answer:0, reason:"作为脚本运行时 __name__ 为 __main__，被导入时不是。" },
      { question:"虚拟环境解决什么问题？", options:["项目依赖相互污染","自动编写业务代码","替代测试"], answer:0, reason:"每个项目可以拥有独立依赖集合和版本。" }
    ],
    lab: { kind: "modules", title: "导入路径侦察台", subtitle: "观察名称遮蔽、模块缓存和脚本入口" },
    debugChallenge: {
      code: `# 当前项目存在 random.py\nimport random\nprint(random.randint(1, 6))`,
      question: "为什么可能提示 random 没有 randint？",
      choices: ["randint 只能处理字符串", "本地 random.py 遮蔽了标准库模块", "import 不能放在顶部"], answer: 1,
      error: `AttributeError: module 'random' has no attribute 'randint'`,
      fix: `把本地 random.py 改为 nonstandard_random.py，并清理对应缓存文件后重新运行`,
      result: `导入标准库 random，randint(1, 6) 返回 1–6 的整数`,
      explanation: "导入系统在搜索路径中先找到了项目内同名模块，程序得到的不是预期标准库。"
    },
    explanationChallenge: "为什么虚拟环境和依赖版本清单必须同时存在，才能让项目在另一台电脑可靠运行？",
    referenceAnswer: "虚拟环境提供依赖隔离，防止不同项目互相升级或覆盖包，但环境目录本身通常不提交，也不能跨操作系统直接复制。依赖清单记录包名和兼容版本，使另一台电脑可以创建新的隔离环境并重新安装同一组依赖。只有隔离而没有清单无法复现，只有清单而没有隔离仍可能受到全局包污染。",
    explanationHint: "建议提到：隔离、不提交环境目录、版本清单、重新安装、复现……",
    evaluationGroups: [["隔离", "污染"], ["版本", "清单"], ["另一台", "复现"], ["安装", "创建"], ["环境目录", "不提交"]]
  },
  {
    id: "python-advanced",
    trackId: "python",
    title: "10 · 高级语法、拷贝、迭代器与生成器",
    duration: "110–140 分钟",
    objectives: ["使用推导式、解包和 lambda 表达简短转换", "区分赋值、浅拷贝和深拷贝", "说明可迭代对象、迭代器和生成器关系", "理解装饰器在不修改原函数时增加行为"],
    concepts: [
      { term: "表达式工具", detail: "推导式、解包和 lambda 能压缩简单转换，但复杂逻辑应优先使用具名函数和清晰循环。" },
      { term: "拷贝", detail: "浅拷贝只复制最外层容器，内部可变对象仍共享；深拷贝递归创建独立对象图。" },
      { term: "迭代协议", detail: "可迭代对象能产生迭代器；迭代器保存当前位置并逐项返回，耗尽后抛出 StopIteration。" },
      { term: "生成器与装饰器", detail: "yield 按需产生值并保存执行状态；装饰器接收函数并返回增强后的可调用对象。" }
    ],
    types: [["推导式", "转换筛选", "[x*x for x in xs]", "复杂时改普通循环"], ["浅拷贝", "复制外层", "copy.copy(data)", "内部对象仍共享"], ["yield", "惰性生成", "yield item", "节省一次性内存"], ["decorator", "包装函数", "@timer", "保持单一横切关注点"]],
    referenceTitle: "高级语法的判断标准",
    referenceDescription: "是否更清晰、是否共享状态、是否惰性计算、是否隐藏控制流。",
    prediction: {
      code: `a = [[1], [2]]\nb = a.copy()\nb[0].append(9)\nprint(a)`,
      choices: ["[[1], [2]]", "[[1, 9], [2]]", "[[9], [2]]"], answer: "[[1, 9], [2]]",
      explanation: "copy() 只复制外层列表，a[0] 和 b[0] 仍指向同一个内部列表，因此追加会同时可见。"
    },
    quiz: [
      { question:"生成器的主要特点是？", options:["一次创建全部结果","按需产生值并保存状态","只能返回字符串"], answer:1, reason:"yield 暂停并保存位置，下次继续执行。" },
      { question:"什么时候浅拷贝足够？", options:["内部只有不可变值且不需独立修改","存在嵌套可变列表且要完全隔离","任何情况都不够"], answer:0, reason:"内部不可变值无法原地修改，共享引用通常不会造成污染。" },
      { question:"推导式何时应改普通循环？", options:["逻辑包含多层分支和副作用","只做简单平方","任何时候"], answer:0, reason:"可读性优先，复杂控制流不宜塞进单行表达式。" }
    ],
    lab: { kind: "advanced", title: "引用与惰性实验室", subtitle: "观察浅拷贝共享和生成器逐项消费" },
    debugChallenge: {
      code: `def add_item(item, items=[]):\n    items.append(item)\n    return items\nprint(add_item("map"))\nprint(add_item("rope"))`,
      question: "为什么第二次结果包含 map？",
      choices: ["列表会自动读取历史", "默认列表只在函数定义时创建一次", "return 会合并结果"], answer:1,
      error: `没有异常，但第二次错误结果为 ["map", "rope"]`,
      fix: `def add_item(item, items=None):\n    if items is None:\n        items = []\n    items.append(item)\n    return items`,
      result: `两次独立调用分别得到 ["map"] 和 ["rope"]`,
      explanation: "可变默认参数在定义函数时创建一次，后续调用复用同一列表。使用 None 作为哨兵并在调用内创建新列表。"
    },
    explanationChallenge: "浅拷贝为什么能复制外层列表，却仍让内部列表的修改互相可见？什么时候需要深拷贝？",
    referenceAnswer: "浅拷贝创建新的外层容器，并把原容器中的元素引用逐个放入新容器；如果元素是内部列表，两个外层容器仍指向同一个内部可变对象，所以原地修改会互相可见。只有确实需要整棵嵌套对象图独立变化时才使用深拷贝；深拷贝成本更高，对文件、连接等资源也未必有合理语义。",
    explanationHint: "建议提到：外层新对象、内部引用、可变对象、成本、语义……",
    evaluationGroups: [["外层", "新容器"], ["内部", "引用"], ["共享", "可变"], ["深拷贝", "独立"], ["成本", "语义"]]
  },
  {
    id: "python-concurrency",
    trackId: "python",
    title: "11 · 进程、线程、异步与 GIL",
    duration: "100–130 分钟",
    objectives: ["区分并发与并行以及 CPU/IO 密集任务", "说明进程、线程和协程的隔离与切换代价", "理解 CPython GIL 对 CPU 多线程的影响", "识别竞态条件并使用锁、队列或消息传递"],
    concepts: [
      { term:"并发与并行", detail:"并发是多个任务在时间上推进，并行是同一时刻真正执行多个任务。并发不保证更快。" },
      { term:"进程", detail:"进程拥有独立内存，隔离较强，可利用多核，创建和数据交换成本较高。" },
      { term:"线程与异步", detail:"线程共享进程内存，适合阻塞 IO；asyncio 用事件循环协作切换大量 IO 任务。" },
      { term:"GIL 与竞态", detail:"CPython GIL 不等于业务状态线程安全；复合读改写仍可能交错，必须设计同步边界。" }
    ],
    types: [["process", "CPU 并行", "multiprocessing", "独立内存"], ["thread", "阻塞 IO", "threading", "共享状态需同步"], ["async", "大量协作 IO", "asyncio", "不能阻塞事件循环"], ["queue/lock", "协调状态", "Queue / Lock", "优先减少共享"]],
    referenceTitle:"并发模型选择表",
    referenceDescription:"先判断任务性质、共享需求、隔离要求和失败影响，再选工具。",
    prediction: {
      code:`# 100 个主要等待网络响应的独立请求\n# 每个请求 CPU 计算很少\n# 需要在单进程内高并发处理`,
      choices:["asyncio 协程","100 个 CPU 进程","只写一个同步循环"], answer:"asyncio 协程",
      explanation:"任务主要等待 IO，且数量大、CPU 计算少，事件循环可以在等待期间切换其他请求，避免大量线程/进程开销。"
    },
    quiz:[
      {question:"CPU 密集型纯 Python 任务想利用多核，通常优先？",options:["多进程","大量线程","只加锁"],answer:0,reason:"独立进程各有解释器和 GIL，可在多个核心并行。"},
      {question:"GIL 是否保证 balance += 1 业务逻辑绝对安全？",options:["是","否，复合操作仍可能竞态","只在网络请求时保证"],answer:1,reason:"GIL 保护解释器内部，不替代业务同步与原子设计。"},
      {question:"异步函数中调用长时间阻塞函数会怎样？",options:["阻塞整个事件循环","自动变多进程","没有影响"],answer:0,reason:"协作式并发依赖主动让出控制权，阻塞调用会卡住其他任务。"}
    ],
    lab:{kind:"concurrency",title:"并发模型决策台",subtitle:"根据 CPU、IO、共享状态和隔离要求选择执行模型"},
    debugChallenge:{
      code:`balance = 0\n# 两个线程同时执行：\nvalue = balance\nvalue = value + 1\nbalance = value`,
      question:"为什么最终 balance 可能只增加 1？",
      choices:["整数不能相加","两个线程可能读取同一个旧值并互相覆盖","线程总会串行"],answer:1,
      error:"没有固定异常，但发生丢失更新：期望 2，实际可能为 1",
      fix:"使用 Lock 保护完整读改写临界区，或把更新发送到单一消费者队列",
      result:"每次更新都有明确顺序，最终 balance 稳定增加 2",
      explanation:"读取、计算、写回是多个步骤；线程可在步骤间切换，两个线程都基于旧值计算并后写覆盖前写。"
    },
    explanationChallenge:"为什么 GIL 存在时仍会出现业务竞态？如何在锁、队列、不可变消息和进程隔离之间选择？",
    referenceAnswer:"GIL 只保证某一时刻一个线程执行 CPython 字节码并保护解释器内部状态，但一项业务更新通常包含多条字节码和可能释放 GIL 的操作，线程可在读、计算、写回之间交错。小型共享临界区可用锁；希望明确所有权时使用队列和单一消费者；跨进程隔离或 CPU 并行使用进程；不可变消息能减少共享可变状态和锁复杂度。",
    explanationHint:"建议提到：字节码、复合操作、交错、锁、队列、隔离……",
    evaluationGroups:[["GIL","字节码"],["复合","读改写"],["交错","竞态"],["锁","临界区"],["队列","隔离"]]
  },
  {
    id: "python-network",
    trackId: "python",
    title: "12 · Socket、HTTP、JSON 与正则表达式",
    duration: "110–140 分钟",
    objectives: ["说明客户端、服务器、IP、端口和 Socket 的关系", "拆解 HTTP 请求、响应、状态码与 JSON 数据", "为网络调用设置超时并处理失败", "使用原始字符串和正则完成受控文本匹配"],
    concepts:[
      {term:"Socket",detail:"Socket 是进程通过网络通信的端点，通常由协议、IP 和端口共同定位。TCP 提供有序可靠字节流。"},
      {term:"HTTP",detail:"HTTP 在请求与响应间传递方法、路径、头和正文；状态码表达协议层结果，业务结果仍需解析正文。"},
      {term:"JSON",detail:"JSON 是跨语言文本数据格式，只有对象、数组、字符串、数字、布尔和 null 等类型，不等同于 Python 对象。"},
      {term:"正则",detail:"正则适合结构明确的文本模式；原始字符串减少反斜杠转义。复杂语法或嵌套结构应使用专用解析器。"}
    ],
    types:[["TCP Socket","可靠字节流","host + port","需处理断开和超时"],["HTTP","应用协议","GET /path","检查状态与正文"],["JSON","数据格式","json.loads(text)","验证字段和类型"],["regex","模式匹配","r'\\d+'","避免灾难性回溯"]],
    referenceTitle:"网络请求的四层证据",
    referenceDescription:"连接到谁、发了什么、收到什么、失败如何处理。",
    prediction:{
      code:`status = 404\nbody = {"detail": "not found"}\nif 200 <= status < 300:\n    result = body["data"]\nelse:\n    result = body["detail"]\nprint(result)`,
      choices:["data","not found","KeyError"],answer:"not found",
      explanation:"404 不在 2xx 成功范围，程序进入 else 并读取存在的 detail 字段，因此输出 not found。"
    },
    quiz:[
      {question:"网络请求为什么必须设置超时？",options:["防止永久等待耗尽资源","让 JSON 自动正确","隐藏所有错误"],answer:0,reason:"网络可能断开或对端无响应，无限等待会占住线程、连接和用户请求。"},
      {question:"HTTP 200 是否保证业务数据一定有效？",options:["是","否，还需验证正文结构和业务字段","只有手机端保证"],answer:1,reason:"状态成功不代表字段齐全、类型正确或业务语义有效。"},
      {question:"正则模式常写成 r'\\d+' 的原因？",options:["原始字符串减少 Python 转义干扰","提高网络速度","自动匹配中文"],answer:0,reason:"反斜杠直接交给正则引擎，可读性更好。"}
    ],
    lab:{kind:"network",title:"请求与模式分析台",subtitle:"拆解 URL、状态码和文本匹配结果"},
    debugChallenge:{
      code:`response = request(url)  # 没有 timeout\nreturn response.json()["data"]`,
      question:"这段网络代码遗漏了哪些关键失败路径？",
      choices:["只缺少 print","缺少超时、状态检查、JSON/字段验证","HTTP 永远成功"],answer:1,
      error:"可能永久等待，或在非 JSON、非 2xx、缺少 data 时分别失败",
      fix:"设置 timeout；检查状态码；捕获网络/JSON异常；验证 data 字段和类型；记录可诊断上下文",
      result:"请求在有限时间内成功返回已验证数据，或给出明确、分层的失败原因",
      explanation:"网络、协议、格式和业务结构是不同失败层，不能假设一次调用后所有条件都成立。"
    },
    explanationChallenge:"为什么 HTTP 2xx、JSON 解析成功和业务数据有效是三种不同保证？应怎样分层处理错误？",
    referenceAnswer:"2xx 只说明 HTTP 协议层认为请求成功；JSON 解析成功只说明正文语法符合 JSON；业务数据有效还要求必要字段存在、类型正确、取值满足规则。程序应分别处理连接和超时错误、非 2xx 状态、JSON 解码错误、字段与业务校验错误，并在每层保留状态码、请求标识等可诊断信息，同时避免泄露敏感内容。",
    explanationHint:"建议提到：协议、格式、业务规则、分层异常、诊断信息……",
    evaluationGroups:[["2xx","协议"],["JSON","格式"],["字段","业务"],["分层","异常"],["诊断","状态码"]]
  },
  {
    id: "python-engineering",
    trackId: "python",
    title: "13 · 工程化、测试与 Python 区域毕业",
    duration: "120–180 分钟",
    objectives:["组织 src、tests、配置和入口边界", "使用类型提示、日志和测试建立可验证接口", "区分单元、集成和端到端测试", "从空目录重建可运行、可测试、可解释的 Python 项目"],
    concepts:[
      {term:"项目边界",detail:"入口负责接收外部输入，业务模块负责规则，基础设施负责文件、网络和数据库；依赖方向应保持清晰。"},
      {term:"测试",detail:"测试不是证明永远无错，而是把重要行为、边界和历史缺陷变成可重复检查的证据。"},
      {term:"配置与日志",detail:"配置描述环境差异，不应散落硬编码；日志记录事件与上下文，不用 print 冒充可观测性。"},
      {term:"类型与文档",detail:"类型提示和接口文档让输入输出契约更明确，但仍需运行时校验和测试。"}
    ],
    types:[["src/", "业务源码", "领域模块与入口分离", "避免根目录堆文件"],["tests/", "行为证据", "单元/集成/端到端", "覆盖边界和错误"],["config", "环境差异", "环境变量/配置对象", "密钥不入库"],["logging", "运行证据", "级别+上下文", "敏感字段脱敏"]],
    referenceTitle:"可交付 Python 项目的四条主线",
    referenceDescription:"代码结构、依赖环境、自动测试、运行诊断共同构成工程完成度。",
    prediction:{
      code:`# service.py\ndef calculate(data): ...\n\n# test_service.py\ndef test_empty_data():\n    assert calculate([]) == 0`,
      choices:["这是针对空输入的单元行为证据","这是部署脚本","这是模块导入错误"],answer:"这是针对空输入的单元行为证据",
      explanation:"测试直接调用单个业务函数，并声明空输入应返回 0，属于快速、隔离的单元测试。"
    },
    quiz:[
      {question:"密钥应放在哪里？",options:["提交到源码常量","运行环境的安全配置中","写进测试截图"],answer:1,reason:"密钥必须与源码分离，由安全配置注入并避免日志泄露。"},
      {question:"单元测试最适合验证？",options:["单个业务规则和边界","完整公网部署","人工界面美观"],answer:0,reason:"单元测试快速隔离，聚焦一个函数或类的行为。"},
      {question:"日志与 print 的主要差异？",options:["日志具有级别、结构和上下文，可统一收集","print 永远更安全","日志不需要脱敏"],answer:0,reason:"工程日志支持过滤、关联和采集，但仍需保护敏感数据。"}
    ],
    lab:{kind:"architecture",title:"Python 架构组装台",subtitle:"把入口、业务、存储、测试和配置放到正确边界"},
    debugChallenge:{
      code:`# main.py 同时包含：\n# 读取参数、业务计算、SQL、HTTP、密钥、重试、打印日志\n# 共 1200 行`,
      question:"为什么这个文件即使能运行也很难维护？",
      choices:["Python 文件不能超过 100 行","职责、依赖和失败边界全部耦合，无法独立测试","注释不够多"],answer:1,
      error:"修改数据库可能破坏业务，测试必须启动所有外部资源，故障难以定位",
      fix:"拆分入口、领域服务、仓储/客户端、配置与日志适配器；通过接口注入依赖，并为业务规则编写单元测试",
      result:"核心规则可脱离网络和数据库测试，外部失败有清晰边界，入口只负责组装",
      explanation:"问题不在行数本身，而在变化原因和依赖方向混杂；任何修改都可能影响整个系统。"
    },
    explanationChallenge:"一个 Python 项目从命令行输入到数据库写入，应如何划分模块、传递错误并建立测试证据？",
    referenceAnswer:"命令行入口只负责解析和校验外部参数，再调用应用服务；应用服务组织用例并调用领域规则；仓储接口隔离数据库细节，具体适配器负责 SQL 和事务；配置在启动时注入，日志携带请求标识并脱敏。可恢复错误转换成明确结果，不可恢复错误在边界记录后继续传播。领域规则使用单元测试，数据库适配器使用集成测试，完整命令流程使用少量端到端测试。",
    explanationHint:"建议提到：入口、应用服务、领域规则、仓储、依赖注入、分层测试……",
    evaluationGroups:[["入口","参数"],["服务","领域"],["仓储","数据库"],["错误","边界"],["单元","集成","端到端"]],
    graduation: {
      title:"Python 平原 L3 毕业考核",
      requirements:["不看答案画出项目模块与依赖方向","从空目录建立虚拟环境、src 和 tests","实现资源探险 CLI 并通过正常/边界/异常测试","解释变量到对象、模块、异常和并发的完整关系","修复一次状态污染、导入遮蔽和竞态故障","根据个人项目、小团队和企业场景分别选择结构与工具","提交复盘：哪些决策可替换，何时必须演进，迁移代价是什么"]
    }
  }
];
