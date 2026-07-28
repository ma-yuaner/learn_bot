const mysqlLesson = (lesson) => ({
  trackId: "database",
  duration: "90–120 分钟",
  ...lesson
});

export const databaseLessons = [
  {
    id: "db-relational-model",
    trackId: "database",
    title: "DB01 · 关系模型、表与约束",
    duration: "90–120 分钟",
    objectives: [
      "区分数据库、表、行、列、模式和具体数据",
      "根据业务语义选择字段类型并明确 NULL 的含义",
      "使用主键唯一标识一行，区分自然键与代理键",
      "通过 NOT NULL、UNIQUE、CHECK 等约束把业务不变量放入数据边界"
    ],
    concepts: [
      {
        term: "表、行与列",
        detail: "表描述同一类实体或事实；一行是一条记录，一列是所有记录共享的属性。列名和类型属于模式，具体单元格值属于数据。"
      },
      {
        term: "字段类型",
        detail: "类型表达允许保存的值和操作，例如整数、定长/变长文本、日期时间、布尔与精确小数。金额通常不能用二进制浮点随意保存。"
      },
      {
        term: "主键",
        detail: "主键必须唯一且非空，用来稳定标识一行。业务含义会变化的手机号不适合直接充当长期身份；常用代理 id，并另加 UNIQUE 约束。"
      },
      {
        term: "NULL 与约束",
        detail: "NULL 表示未知或不适用，不等于 0 或空字符串。NOT NULL、UNIQUE、CHECK 和外键把无效状态挡在数据库边界，而不是只依赖界面检查。"
      }
    ],
    types: [
      ["BIGINT", "整数标识/计数", "精确整数", "先评估范围，不保存小数"],
      ["VARCHAR", "有长度边界的文本", "名称、编码", "长度应来自业务约束"],
      ["DECIMAL", "精确小数", "金额、比率", "明确 precision 与 scale"],
      ["TIMESTAMP", "时间点", "创建/更新时间", "明确时区与数据库语义"]
    ],
    referenceTitle: "从业务事实到关系表",
    referenceDescription: "设计表不是把页面输入框照抄成列，而是识别身份、事实、约束和生命周期。",
    prediction: {
      code: `CREATE TABLE learners (\n  id BIGINT PRIMARY KEY,\n  name VARCHAR(50) NOT NULL\n);\n\nINSERT INTO learners VALUES (1, '小码');\nINSERT INTO learners VALUES (1, '小智');`,
      choices: ["第二条 INSERT 因主键重复失败", "两行都会成功", "第一行会被自动覆盖"],
      answer: "第二条 INSERT 因主键重复失败",
      explanation: "PRIMARY KEY 同时要求唯一且非空。数据库不会因为新值使用相同 id 就静默覆盖旧行，第二次写入违反唯一性约束。"
    },
    quiz: [
      {
        question: "表结构中的 VARCHAR(50) 属于什么？",
        options: ["模式定义", "某一行数据", "查询结果排序"],
        answer: 0,
        reason: "列名、类型和约束定义表的模式；具体名字才是数据。"
      },
      {
        question: "为什么手机号通常不适合作为唯一的长期主键？",
        options: ["手机号可能变更、复用或缺失", "手机号不能保存为文本", "主键只能使用偶数"],
        answer: 0,
        reason: "主键身份应稳定；手机号可作为带 UNIQUE 约束的业务字段，但生命周期可能变化。"
      },
      {
        question: "SQL 中 NULL 与空字符串的关系是什么？",
        options: ["两者完全相同", "NULL 表示未知/不适用，空字符串是已知的零长度文本", "NULL 永远等于 0"],
        answer: 1,
        reason: "NULL 参与比较时具有三值逻辑，必须使用 IS NULL，而空字符串仍是普通文本值。"
      },
      {
        question: "为什么约束不能只写在前端表单里？",
        options: ["其他客户端、脚本和并发写入可以绕过前端", "数据库不会保存数据", "前端约束会自动创建索引"],
        answer: 0,
        reason: "数据库是最终共享数据边界，关键不变量需要由数据库约束兜底。"
      }
    ],
    lab: {
      kind: "relational-model",
      title: "关系表模式检查台",
      subtitle: "定义列、主键和样例行，观察重复键、缺失值与列数错误"
    },
    codeChallenge: {
      id: "mysql-create-learners",
      language: "sql",
      title: "SQL 验收 · 创建学习者表",
      brief: "创建 learners(id, name, email) 表：id 为主键，name/email 必填，email 不可重复。可使用 MySQL 常见类型，判题只检查结构语义。",
      starter: `CREATE TABLE learners (\n  -- 在这里补全三个字段及约束\n);`,
      checks: ["三列名称与顺序正确", "id 是主键", "name、email 为 NOT NULL", "重复 email 会被数据库拒绝"]
    },
    debugChallenge: {
      code: `CREATE TABLE enrollment (\n  learner_name VARCHAR(50) PRIMARY KEY,\n  course_name VARCHAR(100),\n  score INT\n);`,
      question: "把 learner_name 作为选课记录主键，最主要的问题是什么？",
      choices: [
        "姓名可能重复且同一学习者可选多门课，不能稳定唯一标识一条选课关系",
        "VARCHAR 不能成为任何索引",
        "score 必须写在第一列"
      ],
      answer: 0,
      error: "身份与关系建模错误：姓名不稳定不唯一，单列主键还禁止同一学习者出现多门课程",
      fix: "使用 enrollment_id 代理主键，或使用稳定 learner_id 与 course_id 的联合唯一约束；姓名保留为学习者属性",
      result: "每条选课关系可稳定标识，同时阻止同一学习者重复选同一门课",
      explanation: "主键选择必须对应“这一行究竟代表什么”。选课表的一行代表学习者与课程之间的一次关系，不只是一个姓名。"
    },
    explanationChallenge: "为什么一个设计良好的数据库表不仅需要字段类型，还需要主键和约束？",
    referenceAnswer: "字段类型只能限制值的大类，不能完整表达一行的身份和业务不变量。主键保证每行可被稳定、唯一地引用；NOT NULL 防止必填事实缺失，UNIQUE 防止业务键重复，CHECK 限制合法范围，外键维护表之间的引用关系。应用层验证能提供友好反馈，但脚本、其他服务和并发写入可能绕过它，因此数据库约束必须作为最终一致的数据边界。",
    explanationHint: "建议提到：类型、身份、主键、唯一、非空、范围、应用层、数据库边界……",
    evaluationGroups: [
      ["类型", "值"],
      ["身份", "主键"],
      ["唯一", "UNIQUE"],
      ["非空", "NOT NULL"],
      ["范围", "CHECK"],
      ["应用层", "前端"],
      ["数据库边界", "兜底"]
    ]
  },
  mysqlLesson({
    id: "db-sql-basics",
    title: "DB02 · SQL 基础与安全增删改查",
    objectives: ["理解 DDL、DML、DQL、TCL 的职责", "写出 SELECT、INSERT、UPDATE、DELETE 基础语句", "掌握别名、表达式、去重与结果集概念", "在修改数据前用 WHERE 与事务控制影响范围"],
    concepts: [
      { term: "SQL 分类", detail: "CREATE/ALTER 属于 DDL，INSERT/UPDATE/DELETE 属于 DML，SELECT 常称 DQL，COMMIT/ROLLBACK 属于 TCL；分类帮助判断语句是否改结构、改数据或只读取。" },
      { term: "结果集", detail: "SELECT 返回由列和行构成的结果集。SELECT * 会扩大耦合与传输量，生产查询应明确列名并用 AS 给计算列稳定命名。" },
      { term: "写入语义", detail: "INSERT 新增事实，UPDATE 修改已有事实，DELETE 删除事实。写操作必须先确认 WHERE、预计影响行数、备份或回滚方案。" },
      { term: "MySQL 会话", detail: "连接选定实例与数据库后，字符集建议 utf8mb4。MySQL 默认 autocommit 开启；DDL 是否隐式提交要按 MySQL 8 规则判断。" }
    ],
    types: [["SELECT", "读取列与行", "SELECT id,name FROM users", "明确列与排序"], ["INSERT", "新增记录", "INSERT INTO ... VALUES", "写清列名"], ["UPDATE", "修改记录", "UPDATE ... SET ... WHERE", "先用同条件 SELECT"], ["DELETE", "删除记录", "DELETE FROM ... WHERE", "禁止无意全表删除"]],
    referenceTitle: "先读懂影响范围，再执行 SQL",
    referenceDescription: "SQL 的危险不在语法长，而在一句语句可能作用于成千上万行；写入前必须形成可验证、可回滚的操作习惯。",
    prediction: { code: `UPDATE orders SET status = 'cancelled';`, choices: ["所有订单都会被修改", "只修改第一行", "没有 WHERE 会语法报错"], answer: "所有订单都会被修改", explanation: "UPDATE 不要求 WHERE；缺少 WHERE 时作用于表中全部行，因此执行前应先用 SELECT 验证范围并准备事务或备份。" },
    lab: { kind: "mysql-scenario", title: "SQL 影响范围推演台", subtitle: "比较读取、精确更新和无条件更新", scenarios: [
      { label: "按主键读取一单", sql: "SELECT id,status FROM orders WHERE id = 101;", result: "1 行：101 | paid", conclusion: "条件唯一，读取范围明确", trace: ["解析 SELECT 列", "扫描或通过主键定位 WHERE", "形成结果集"] },
      { label: "安全修改一单", sql: "UPDATE orders SET status='cancelled' WHERE id=101;", result: "affected rows = 1", conclusion: "先 SELECT 同一条件并核对 1 行，再在事务中修改", trace: ["定位 id=101", "获取必要锁", "记录 undo/redo", "提交后其他会话可见"] },
      { label: "遗漏 WHERE", sql: "DELETE FROM orders;", result: "affected rows = 全表", conclusion: "语法合法但业务危险，应立即停止并回滚", trace: ["没有过滤条件", "所有可见行进入删除范围", "若已提交只能依靠备份/日志恢复"] }
    ] },
    debugChallenge: { code: `UPDATE customers SET city = '深圳';`, question: "需求是只修改 id=3 的客户，最关键的修复是什么？", choices: ["增加 WHERE id = 3，并先用 SELECT 验证", "改成 SELECT *", "删除 SET"], answer: 0, error: "缺失过滤条件导致全表更新", fix: "START TRANSACTION; SELECT ... WHERE id=3; UPDATE ... WHERE id=3; 核对影响行数后 COMMIT", result: "只修改目标客户，异常时可 ROLLBACK", explanation: "SQL 写操作首先要证明影响范围，而不是只追求语法能运行。" },
    quiz: [
      { question: "哪类语句修改表结构？", options: ["DDL", "DQL", "注释"], answer: 0, reason: "CREATE、ALTER、DROP 等 DDL 定义数据库对象结构。" },
      { question: "为什么业务查询不建议长期使用 SELECT *？", options: ["会扩大传输与字段耦合", "星号不能运行", "会自动删除索引"], answer: 0, reason: "表新增列会改变结果契约，且可能读取不需要的大字段。" },
      { question: "执行 UPDATE 前最稳妥的第一步？", options: ["用相同 WHERE 做 SELECT 并核对行数", "先关闭日志", "删掉主键"], answer: 0, reason: "相同过滤条件能提前暴露范围错误，事务再提供回滚窗口。" },
      { question: "MySQL 的 autocommit 开启意味着什么？", options: ["通常每条独立成功语句自动提交", "所有查询永不提交", "DDL 自动回滚"], answer: 0, reason: "未显式开启事务时，成功语句通常作为独立事务提交。" }
    ],
    codeChallenge: { id: "mysql-select-paid-orders", language: "sql", title: "SQL 验收 · 查询已支付大额订单", brief: "从 orders 查询 status='paid' 且 amount>=80 的 id、amount，按 amount 从高到低排序。", starter: `SELECT id, amount\nFROM orders\n-- 补充过滤与排序`, checks: ["只返回 paid", "金额至少 80", "列为 id、amount", "按金额降序"] },
    explanationChallenge: "为什么 UPDATE/DELETE 语法正确仍可能造成严重事故？你会怎样安全执行？",
    referenceAnswer: "SQL 写操作是集合操作，一条语句可能同时影响大量行；语法正确不代表业务范围正确。执行前应明确目标、用相同 WHERE 的 SELECT 核对记录与数量，优先按主键或稳定条件定位，在事务中执行并检查 affected rows，异常立即 ROLLBACK。高风险操作还要有审批、备份、审计和恢复演练，不能把回滚希望只寄托在一句口头确认上。",
    explanationHint: "提到集合操作、WHERE、SELECT 预检、事务、影响行数、回滚。",
    evaluationGroups: [["集合", "多行"], ["WHERE", "过滤"], ["SELECT", "预检"], ["事务", "ROLLBACK"], ["影响行数", "affected"], ["备份", "审计"]]
  }),
  mysqlLesson({
    id: "db-filter-aggregate",
    title: "DB03 · 条件、排序、聚合与 NULL",
    objectives: ["组合 WHERE、ORDER BY、LIMIT 条件", "正确处理 NULL 与三值逻辑", "使用 COUNT/SUM/AVG/MIN/MAX 聚合", "区分 WHERE 与 HAVING 并解释 SQL 逻辑执行顺序"],
    concepts: [
      { term: "过滤与三值逻辑", detail: "比较结果除 TRUE/FALSE 外还有 UNKNOWN。NULL 不能用 = NULL，应使用 IS NULL；NOT IN 遇到 NULL 也可能产生反直觉结果。" },
      { term: "排序与分页", detail: "没有 ORDER BY 就没有稳定顺序。LIMIT 分页必须配稳定且尽量唯一的排序；深分页常改用基于游标/上次主键的 keyset pagination。" },
      { term: "聚合与分组", detail: "GROUP BY 把行划成组，聚合函数对每组计算。COUNT(*) 数行，COUNT(column) 忽略 NULL；非分组列不可随意出现在 SELECT。" },
      { term: "逻辑顺序", detail: "可按 FROM/JOIN→WHERE→GROUP BY→HAVING→SELECT→DISTINCT→ORDER BY→LIMIT 理解，因此 WHERE 过滤行，HAVING 过滤聚合后的组。" }
    ],
    types: [["WHERE", "聚合前过滤行", "status='paid'", "不能直接引用聚合值"], ["HAVING", "聚合后过滤组", "SUM(amount)>100", "通常与 GROUP BY 配合"], ["COUNT(*)", "统计行数", "包含 NULL 行", "与 COUNT(col) 区分"], ["ORDER BY", "定义结果顺序", "DESC/ASC", "并列时补唯一键"]],
    referenceTitle: "从明细到可信指标",
    referenceDescription: "指标 SQL 必须明确数据范围、空值、去重粒度、分组维度、时间边界和排序，否则数字能算出来却不可解释。",
    prediction: { code: `SELECT COUNT(*), COUNT(refund_reason)\nFROM orders;`, choices: ["两者可能不同，后者忽略 NULL", "两者永远相等", "COUNT(*) 忽略所有行"], answer: "两者可能不同，后者忽略 NULL", explanation: "COUNT(*) 统计结果行数；COUNT(列) 只统计该列非 NULL 的行。" },
    lab: { kind: "mysql-scenario", title: "指标口径推演台", subtitle: "观察过滤、分组、空值和排序如何改变结果", scenarios: [
      { label: "WHERE 后再分组", sql: "SELECT city,SUM(amount) FROM ... WHERE status='paid' GROUP BY city;", result: "深圳 350；广州 80", conclusion: "取消单在进入分组前已被过滤", trace: ["JOIN 形成客户订单行", "WHERE 保留 paid", "按 city 分组", "每组 SUM"] },
      { label: "HAVING 过滤小组", sql: "... GROUP BY city HAVING SUM(amount)>=100;", result: "只保留深圳 350", conclusion: "HAVING 使用聚合结果过滤组", trace: ["先形成全部城市组", "计算 SUM", "再判断 HAVING"] },
      { label: "没有稳定排序的 LIMIT", sql: "SELECT id FROM orders LIMIT 2;", result: "可能得到任意两行", conclusion: "数据库不承诺自然顺序", trace: ["优化器选择访问路径", "达到两行即可停止", "计划变化时结果可能变化"] }
    ] },
    debugChallenge: { code: `SELECT customer_id, status, SUM(amount)\nFROM orders\nGROUP BY customer_id;`, question: "在 MySQL ONLY_FULL_GROUP_BY 下，问题是什么？", choices: ["status 既未聚合也不由分组键唯一决定", "SUM 不能计算金额", "GROUP BY 必须放第一行"], answer: 0, error: "分组粒度与输出列不一致，status 的值不确定", fix: "将 status 加入 GROUP BY，或按业务目标聚合/移除它", result: "每个输出列都与分组粒度一致，指标可解释", explanation: "聚合查询必须先说清一行结果代表什么，再选择维度和指标。" },
    quiz: [
      { question: "检查空值的正确写法？", options: ["IS NULL", "= NULL", "== NULL"], answer: 0, reason: "NULL 代表未知，普通等号比较得到 UNKNOWN。" },
      { question: "WHERE 与 HAVING 的核心差别？", options: ["前者过滤明细行，后者过滤分组结果", "完全相同", "HAVING 只能排序"], answer: 0, reason: "它们处在 SQL 逻辑执行链的不同阶段。" },
      { question: "COUNT(email) 会统计什么？", options: ["email 非 NULL 的行", "所有行含 NULL", "不同邮箱数量"], answer: 0, reason: "COUNT(列) 忽略 NULL；去重需 COUNT(DISTINCT email)。" },
      { question: "稳定分页至少需要什么？", options: ["确定且可打破并列的 ORDER BY", "只写 LIMIT", "关闭索引"], answer: 0, reason: "没有稳定排序，页与页之间可能重复或遗漏。" }
    ],
    codeChallenge: { id: "mysql-city-aggregation", language: "sql", title: "SQL 验收 · 城市支付汇总", brief: "关联 customers 与 orders，只统计 paid；输出 city、order_count、total_amount，按 total_amount 降序。", starter: `SELECT\n  -- city、订单量、总金额\nFROM customers c\nJOIN orders o ON o.customer_id = c.id\n-- 补全`, checks: ["只统计 paid", "按城市分组", "别名严格匹配", "总金额降序"] },
    explanationChallenge: "一个“按城市统计支付金额”的 SQL 要怎样证明口径可靠？",
    referenceAnswer: "先定义结果粒度是一行一个城市，再明确订单状态、时间范围、币种和退款是否计入；通过正确的关联键形成明细，WHERE 在聚合前过滤有效订单，GROUP BY city，使用 COUNT(*) 与 SUM(amount) 计算指标，并说明 NULL 的处理。最后用稳定排序、明细抽样、总分核对和边界日期验证，避免重复关联导致金额放大。",
    explanationHint: "提到粒度、过滤、关联、分组、NULL、重复、核对。",
    evaluationGroups: [["粒度", "一行"], ["状态", "时间"], ["JOIN", "关联"], ["GROUP BY", "分组"], ["NULL", "空值"], ["重复", "核对"]]
  }),
  mysqlLesson({
    id: "db-joins",
    title: "DB04 · 多表查询、子查询与 CTE",
    objectives: ["根据保留范围选择 INNER JOIN 与 LEFT JOIN", "识别一对多关联造成的重复放大", "正确放置 ON 与 WHERE 条件", "在 JOIN、子查询、EXISTS、CTE 之间做可读选择"],
    concepts: [
      { term: "连接语义", detail: "INNER JOIN 只保留匹配行；LEFT JOIN 保留左表全部行，右侧缺失补 NULL。先确定谁必须保留，再选择连接类型。" },
      { term: "基数与放大", detail: "一对多连接会把左侧行复制多次，多对多还会相乘。聚合前必须验证主键唯一性、连接键和连接前后行数。" },
      { term: "ON 与 WHERE", detail: "LEFT JOIN 时，把右表过滤条件放 WHERE 往往会剔除 NULL 行，使结果近似 INNER JOIN；放 ON 才是在匹配阶段过滤右表。" },
      { term: "EXISTS 与 CTE", detail: "只关心是否存在时 EXISTS 更直接；CTE 为复杂查询分阶段命名。MySQL 8 支持 WITH 与窗口函数，但是否物化由优化器决定。" }
    ],
    types: [["INNER JOIN", "只要匹配", "有订单的客户", "丢弃未匹配"], ["LEFT JOIN", "保留左侧全部", "所有客户及订单", "右列可为 NULL"], ["EXISTS", "判断存在性", "有支付单的客户", "避免无用列与重复"], ["CTE", "命名查询阶段", "WITH paid AS (...)", "提高可读性非性能承诺"]],
    referenceTitle: "连接前先写出关系基数",
    referenceDescription: "多表 SQL 最常见错误不是不会 JOIN，而是不知道每张表的一行代表什么、连接后会变成多少行。",
    prediction: { code: `SELECT c.name,o.id\nFROM customers c\nLEFT JOIN orders o ON o.customer_id=c.id\nWHERE o.status='paid';`, choices: ["没有 paid 订单的客户会被过滤", "所有客户一定保留", "会修改订单"], answer: "没有 paid 订单的客户会被过滤", explanation: "未匹配行的 o.status 为 NULL，在 WHERE 中不满足 paid，因此被去除；要保留所有客户应把状态条件放 ON。" },
    lab: { kind: "mysql-scenario", title: "JOIN 基数观察台", subtitle: "推演保留范围与重复放大", scenarios: [
      { label: "INNER JOIN", sql: "customers INNER JOIN orders", result: "3 位客户 → 5 条客户订单明细", conclusion: "只保留有订单的客户，客户会按订单数重复", trace: ["读取客户", "按 customer_id 匹配", "每个匹配组合输出一行"] },
      { label: "LEFT JOIN + ON 过滤", sql: "LEFT JOIN orders o ON ... AND o.status='paid'", result: "所有客户保留；无支付单者右侧为 NULL", conclusion: "过滤匹配对象但不删除左侧主体", trace: ["保留左表客户", "只匹配 paid 订单", "缺少匹配时补 NULL"] },
      { label: "订单再连接明细", sql: "orders JOIN order_items", result: "一单多商品导致订单行重复", conclusion: "不能直接 SUM orders.amount，否则订单金额被重复累计", trace: ["确认 order_items 是一对多", "连接后数行数", "先按订单聚合或用正确事实表指标"] }
    ] },
    debugChallenge: { code: `SELECT SUM(o.amount)\nFROM orders o\nJOIN order_items i ON i.order_id=o.id;`, question: "一单有多个商品时，为何总额可能放大？", choices: ["订单金额会随每个明细行重复", "SUM 只支持文本", "JOIN 自动除以商品数"], answer: 0, error: "事实粒度混用导致重复累计", fix: "从正确粒度的事实表汇总，或先将明细聚合到 order_id 再连接", result: "每笔订单金额只计一次，明细指标按明细粒度计算", explanation: "去重不是机械加 DISTINCT，而是修正模型、连接和指标粒度。" },
    quiz: [
      { question: "要列出没有订单的客户，应以什么为基础？", options: ["customers LEFT JOIN orders", "customers INNER JOIN orders", "只查 orders"], answer: 0, reason: "LEFT JOIN 保留全部客户，未匹配订单显示 NULL。" },
      { question: "LEFT JOIN 后把右表条件放 WHERE 的风险？", options: ["可能剔除未匹配行", "一定创建索引", "自动提交"], answer: 0, reason: "右表 NULL 通常无法通过 WHERE 条件。" },
      { question: "只判断客户是否有订单更适合？", options: ["EXISTS", "CROSS JOIN", "DROP"], answer: 0, reason: "EXISTS 直接表达存在性，不需要返回并复制订单列。" },
      { question: "发现 JOIN 后行数暴增首先检查？", options: ["两侧粒度、键唯一性与基数", "字体", "端口号"], answer: 0, reason: "重复通常来自一对多/多对多关系或不完整连接键。" }
    ],
    codeChallenge: { id: "mysql-left-join-summary", language: "sql", title: "SQL 验收 · 客户订单量", brief: "输出每位客户 name、order_count，包含零订单客户；按订单量降序、姓名升序。", starter: `SELECT c.name, COUNT(o.id) AS order_count\nFROM customers c\n-- 补全连接、分组与排序`, checks: ["使用左连接语义", "COUNT(o.id) 不把空匹配计为 1", "每客户一行", "排序稳定"] },
    explanationChallenge: "为什么多表查询必须先明确每张表的粒度和关系基数？",
    referenceAnswer: "JOIN 输出的是匹配组合，不会自动理解业务指标。一对多会复制一侧记录，多对多会进一步相乘；若把订单金额与订单明细直接相加就可能重复累计。编写前要定义每张表一行代表什么、连接键是否唯一、哪些主体必须保留，并预估连接后行数；编写后比较连接前后计数、检查未匹配和重复键，再在正确事实粒度上聚合。",
    explanationHint: "提到粒度、基数、一对多、重复、保留范围、验证。",
    evaluationGroups: [["粒度", "一行"], ["基数", "一对多"], ["重复", "放大"], ["LEFT", "保留"], ["连接键", "唯一"], ["验证", "行数"]]
  }),
  mysqlLesson({
    id: "db-constraints",
    title: "DB05 · 表结构、约束与数据类型",
    objectives: ["用 CREATE/ALTER TABLE 表达业务规则", "正确使用主键、外键、唯一、非空与检查约束", "为金额、时间、文本和状态选择 MySQL 类型", "评估级联、字符集、默认值与在线变更风险"],
    concepts: [
      { term: "完整性约束", detail: "实体完整性靠主键，引用完整性靠外键，域完整性靠类型、NOT NULL、CHECK、DEFAULT。约束失败应被处理，不能静默吞掉。" },
      { term: "MySQL 类型", detail: "金额用 DECIMAL(p,s)，标识按范围用 BIGINT，文本使用 utf8mb4，时间点明确 DATETIME/TIMESTAMP 与时区差异，状态优先可演进编码而非滥用 ENUM。" },
      { term: "外键策略", detail: "外键可阻止孤儿记录，但 ON DELETE CASCADE 可能扩大删除范围。高并发或分库场景也可能由应用保证引用并配套巡检，选择必须有证据。" },
      { term: "模式变更", detail: "ALTER 在大表上可能耗时、持锁或重建表。上线前检查 MySQL 版本的 online DDL 能力、磁盘、复制延迟、回滚与兼容窗口。" }
    ],
    types: [["PRIMARY KEY", "行身份", "稳定、唯一、非空", "代理键不替代业务 UNIQUE"], ["FOREIGN KEY", "引用完整性", "拒绝孤儿", "评估级联与索引"], ["DECIMAL(p,s)", "精确金额", "避免浮点误差", "范围由 p/s 决定"], ["utf8mb4", "完整 Unicode", "中文与 emoji", "统一库表连接排序规则"]],
    referenceTitle: "把关键不变量下沉到数据边界",
    referenceDescription: "应用校验负责体验，数据库约束负责最终兜底；二者并不冲突。",
    prediction: { code: `amount DECIMAL(10,2) CHECK (amount >= 0)`, choices: ["最多 10 位数字，其中 2 位小数且不能为负", "只能保存 10.2", "会自动换算币种"], answer: "最多 10 位数字，其中 2 位小数且不能为负", explanation: "precision 是总有效位数，scale 是小数位数；CHECK 约束金额下界，但币种仍需单独建模。" },
    lab: { kind: "mysql-scenario", title: "约束防线推演台", subtitle: "观察不同无效数据在哪一层被阻止", scenarios: [
      { label: "重复业务单号", sql: "INSERT order_no='A001'（已存在）", result: "UNIQUE constraint violation", conclusion: "并发请求也不能制造重复订单", trace: ["应用先校验", "并发仍可能同时通过", "数据库唯一索引做最终仲裁"] },
      { label: "不存在的订单付款", sql: "INSERT payments(order_id=999)", result: "FOREIGN KEY constraint violation", conclusion: "引用完整性阻止孤儿付款", trace: ["检查被引用 id", "未找到父记录", "整条写入失败"] },
      { label: "删除客户并级联", sql: "DELETE customer id=1 ON DELETE CASCADE", result: "相关子记录也会删除", conclusion: "便利但爆炸半径大，审计数据通常更适合软删除/限制删除", trace: ["定位父记录", "沿外键寻找子记录", "同一事务级联删除"] }
    ] },
    debugChallenge: { code: `price FLOAT NOT NULL`, question: "保存财务金额的主要风险是什么？", choices: ["二进制浮点可能产生精度误差，应评估 DECIMAL", "FLOAT 不能保存正数", "NOT NULL 会删除金额"], answer: 0, error: "类型无法精确表达十进制财务口径", fix: "按最大金额和小数位选择 DECIMAL(p,s)，币种单独存储", result: "金额运算与对账口径稳定可解释", explanation: "类型选择是业务规则，不只是节省几个字节。" },
    quiz: [
      { question: "代理主键之外为何常需业务 UNIQUE？", options: ["防止同一业务事实重复", "让主键允许 NULL", "代替所有索引"], answer: 0, reason: "自增 id 每次都不同，无法阻止重复业务单号。" },
      { question: "金额首选哪类？", options: ["DECIMAL", "FLOAT", "TEXT 随意"], answer: 0, reason: "DECIMAL 精确表示指定小数位的十进制数。" },
      { question: "ON DELETE CASCADE 的关键风险？", options: ["删除影响会沿关系扩大", "不能删除父表", "自动加密"], answer: 0, reason: "误删父行可能级联清除大量子数据。" },
      { question: "大表 ALTER 上线前必须评估？", options: ["锁、耗时、空间、复制与回滚", "只看 SQL 长度", "界面颜色"], answer: 0, reason: "模式变更可能影响在线读写和副本稳定性。" }
    ],
    codeChallenge: { id: "mysql-order-constraints", language: "sql", title: "SQL 验收 · 付款表约束", brief: "创建 payments(id, order_id, amount, status)：主键、订单外键、amount>0，status 只允许 pending/paid/failed。", starter: `CREATE TABLE payments (\n  -- 补全四列、主键、外键与 CHECK\n);`, checks: ["字段结构正确", "order_id 引用 orders(id)", "负金额被拒绝", "非法状态被拒绝"] },
    explanationChallenge: "应用已经做表单校验，为什么数据库还要有约束？",
    referenceAnswer: "前端和单个应用只能覆盖自己的入口，脚本、后台任务、其他服务、旧版本客户端及并发写入都可能绕过它。数据库是所有写入最终汇合的共享边界，主键、唯一、非空、检查与外键能以原子方式拒绝无效状态。应用校验仍应用于快速友好反馈，但关键业务不变量必须由数据库兜底，并对约束失败做好异常处理和监控。",
    explanationHint: "提到多入口、并发、最终边界、约束类别、异常处理。",
    evaluationGroups: [["入口", "脚本"], ["并发", "竞态"], ["数据库", "边界"], ["主键", "唯一"], ["外键", "CHECK"], ["异常", "监控"]]
  }),
  mysqlLesson({
    id: "db-transactions",
    title: "DB06 · 事务、隔离、锁与并发",
    objectives: ["用 ACID 解释事务保证", "正确使用 BEGIN/COMMIT/ROLLBACK", "理解脏读、不可重复读、幻读与隔离级别", "处理锁等待、死锁、重试和幂等"],
    concepts: [
      { term: "ACID", detail: "原子性保证全做或全不做，一致性由约束与事务共同维护，隔离性控制并发可见性，持久性保证提交结果在故障后可恢复。" },
      { term: "InnoDB 与 MVCC", detail: "InnoDB 用 undo 版本和 Read View 支持一致性读；普通 SELECT 与 SELECT ... FOR UPDATE 的锁定读语义不同。" },
      { term: "隔离级别", detail: "MySQL InnoDB 默认 REPEATABLE READ。级别越强不等于业务越正确；仍要识别写偏差、范围锁、长事务与并发需求。" },
      { term: "死锁与幂等", detail: "并发事务加锁顺序不同可能死锁，数据库会回滚其中一个。应用应缩短事务、统一顺序、建立合适索引并有限重试；外部请求还需幂等键。" }
    ],
    types: [["COMMIT", "确认事务", "结果对其他会话可见", "提交后不能普通回滚"], ["ROLLBACK", "撤销未提交写入", "异常恢复", "外部副作用不能自动撤销"], ["FOR UPDATE", "锁定将修改的行", "防止并发覆盖", "必须在事务内"], ["死锁", "循环等待", "自动牺牲一个事务", "捕获并有限重试"]],
    referenceTitle: "事务只包住必须一起成功的数据动作",
    referenceDescription: "长事务会占用版本、锁与连接；网络调用不要随意放在数据库事务内部。",
    prediction: { code: `START TRANSACTION;\nUPDATE accounts SET balance=balance-100 WHERE id=1;\n-- 程序崩溃，未 COMMIT`, choices: ["连接结束后未提交修改会回滚", "一定永久扣款", "自动转给 id=2"], answer: "连接结束后未提交修改会回滚", explanation: "事务未提交时更新不具备最终持久性，连接异常终止后 InnoDB 会回滚；真正转账还必须包含收款更新。" },
    lab: { kind: "mysql-scenario", title: "并发事务时间线", subtitle: "推演原子性、锁等待与死锁", scenarios: [
      { label: "转账中途失败", sql: "扣 A → 异常 → ROLLBACK", result: "A、B 余额均不改变", conclusion: "相关更新必须位于同一事务", trace: ["BEGIN", "A 产生未提交版本", "异常", "使用 undo 回滚"] },
      { label: "两个事务改同一行", sql: "T1 UPDATE id=1；T2 UPDATE id=1", result: "T2 等待 T1 提交或回滚", conclusion: "锁等待不是死锁，但长事务会放大延迟", trace: ["T1 获得行锁", "T2 请求冲突锁", "T2 等待", "T1 结束后继续"] },
      { label: "相反顺序加锁", sql: "T1 锁 A 等 B；T2 锁 B 等 A", result: "检测死锁并回滚一个事务", conclusion: "统一资源访问顺序并支持有限重试", trace: ["形成等待环", "InnoDB 检测死锁", "选择牺牲事务", "应用重新执行完整事务"] }
    ] },
    debugChallenge: { code: `UPDATE accounts SET balance=balance-100 WHERE id=1;\nUPDATE accounts SET balance=balance+100 WHERE id=2;`, question: "没有显式事务且第二句失败会怎样？", choices: ["autocommit 下第一句可能已提交，造成资金不守恒", "两句必然自动绑定", "余额自动归零"], answer: 0, error: "跨语句业务原子性缺失", fix: "显式开启事务，校验余额并锁定必要行，两次更新成功后 COMMIT，异常 ROLLBACK", result: "转出与转入全成或全败", explanation: "事务边界应该对应业务不变量，而不是每条 SQL 各自成功。" },
    quiz: [
      { question: "MySQL InnoDB 默认隔离级别？", options: ["REPEATABLE READ", "READ UNCOMMITTED", "SERIALIZABLE 永远"], answer: 0, reason: "InnoDB 默认是可重复读，但项目可按需求配置。" },
      { question: "死锁发生后应用应怎样？", options: ["回滚后有限重试完整事务", "忽略错误继续提交", "永久无限重试"], answer: 0, reason: "数据库会牺牲一个事务，应用需捕获错误并带退避重试。" },
      { question: "为什么避免长事务？", options: ["会长期占锁和旧版本并增加冲突", "SQL 会变中文", "主键消失"], answer: 0, reason: "长事务增加锁等待、undo 压力与复制风险。" },
      { question: "幂等键解决什么？", options: ["重试请求导致重复业务写入", "提高屏幕亮度", "替代所有事务"], answer: 0, reason: "唯一幂等键让同一业务请求重复到达仍只生效一次。" }
    ],
    codeChallenge: { id: "mysql-transfer-transaction", language: "sql", title: "SQL 验收 · 原子转账", brief: "accounts 已有 id=1 余额500、id=2 余额200。用显式事务从 1 转 100 给 2，并提交。", starter: `BEGIN;\n-- 扣减账户 1\n-- 增加账户 2\nCOMMIT;`, checks: ["显式事务边界", "余额变为 400/300", "总额仍为 700", "两次更新属于同一提交"] },
    explanationChallenge: "事务能保证什么，又不能替你保证什么？",
    referenceAnswer: "事务提供原子性、隔离性与提交后的持久性，使一组数据库修改全成或全败并控制并发可见性；约束和正确业务逻辑共同维持一致性。但事务不会自动判断业务规则是否写对，也不能自动撤销已经发送的邮件、支付接口等外部副作用，更不能替代幂等、超时、重试和补偿设计。事务应短小，锁定必要数据，处理死锁并留下审计证据。",
    explanationHint: "提到 ACID、业务逻辑、外部副作用、幂等、死锁、短事务。",
    evaluationGroups: [["原子", "全成"], ["隔离", "并发"], ["持久", "提交"], ["业务规则", "一致"], ["外部", "补偿"], ["幂等", "重试"], ["短事务", "锁"]]
  }),
  mysqlLesson({
    id: "db-indexes",
    title: "DB07 · 索引、EXPLAIN 与查询优化",
    objectives: ["解释 InnoDB B+Tree 与聚簇索引", "按最左前缀设计联合索引", "阅读 EXPLAIN 的访问类型、key、rows 与 Extra", "用测量而非猜测平衡读写、空间和维护成本"],
    concepts: [
      { term: "聚簇与二级索引", detail: "InnoDB 主键 B+Tree 叶子保存整行；二级索引叶子保存索引列和主键，查询其他列可能回表。因此主键过宽会放大所有二级索引。" },
      { term: "联合索引", detail: "索引 (a,b,c) 可支持从最左列开始的前缀。常按等值条件在前、范围/排序在后设计，但必须结合选择性、查询频率与真实计划。" },
      { term: "EXPLAIN", detail: "关注 type、possible_keys、key、key_len、rows、filtered、Extra；估算不是实际耗时。MySQL 8 可用 EXPLAIN ANALYZE 获取真实执行信息，但会执行查询。" },
      { term: "优化闭环", detail: "先定义慢查询和基线，查看数据量、分布与计划，再改 SQL/索引/模型并复测。索引会消耗磁盘、内存并增加写放大，不能越多越好。" }
    ],
    types: [["PRIMARY", "聚簇索引", "叶子为整行", "主键短、稳定、递增需权衡"], ["联合索引", "多列访问路径", "(customer_id,status,time)", "遵循最左前缀"], ["覆盖索引", "所需列均在索引", "减少回表", "不可盲目塞入大列"], ["EXPLAIN", "执行计划估算", "key/rows/Extra", "与真实耗时共同判断"]],
    referenceTitle: "查询优化是一套证据闭环",
    referenceDescription: "“加个索引试试”不是优化方法；要从工作负载、数据分布、执行计划和复测证据出发。",
    prediction: { code: `INDEX idx(a,b,c)\nWHERE b=2 AND c=3`, choices: ["通常无法直接利用缺失 a 的最左前缀完成精准查找", "一定完整使用三列", "索引会自动改成 (b,c)"], answer: "通常无法直接利用缺失 a 的最左前缀完成精准查找", explanation: "普通 B+Tree 联合索引按 a→b→c 排序，跳过最左 a 后不能像独立 (b,c) 索引那样定位；仍需以实际 EXPLAIN 为准。" },
    lab: { kind: "mysql-scenario", title: "索引选择实验室", subtitle: "根据查询形态推演访问路径", scenarios: [
      { label: "主键等值", sql: "WHERE id=101", result: "预计 const / PRIMARY / 1 row", conclusion: "高选择性唯一定位", trace: ["B+Tree 从根到叶", "定位聚簇记录", "无需回表"] },
      { label: "联合索引等值+范围", sql: "WHERE customer_id=? AND status=? AND created_at>=?", result: "索引 (customer_id,status,created_at) 可形成连续范围", conclusion: "范围后的列通常不能继续缩小索引扫描边界", trace: ["匹配 customer_id", "匹配 status", "created_at 范围扫描", "必要时回表"] },
      { label: "低选择性状态列", sql: "WHERE status='paid'（占 95%）", result: "优化器可能选择全表扫描", conclusion: "有索引不等于一定使用，回表成本可能更高", trace: ["估算命中比例", "比较索引回表与顺序扫描", "选择成本更低计划"] }
    ] },
    debugChallenge: { code: `CREATE INDEX idx_status ON orders(status);\n-- 查询仍然慢：SELECT * FROM orders WHERE status='paid';`, question: "索引存在却可能不用的主要原因？", choices: ["paid 占比很高且 SELECT * 需大量回表", "MySQL 不支持索引", "索引名太短"], answer: 0, error: "只看是否有索引，忽略选择性、回表与读取列", fix: "查看 EXPLAIN/ANALYZE 和数据分布，减少读取列，按真实高频组合设计索引或调整访问方式", result: "以实际扫描量和耗时验证优化，而非强迫使用单列索引", explanation: "优化器比较成本；低选择性索引可能比顺序扫描更贵。" },
    quiz: [
      { question: "InnoDB 二级索引叶子通常包含？", options: ["索引列与主键值", "整张数据库", "只有页码"], answer: 0, reason: "通过主键值可回到聚簇索引取得其他列。" },
      { question: "联合索引 (a,b,c) 可直接支持的前缀？", options: ["a 或 a,b 或 a,b,c", "只有 c", "任意顺序完全相同"], answer: 0, reason: "B+Tree 排序从最左列开始。" },
      { question: "EXPLAIN 的 rows 是什么？", options: ["优化器估算扫描行数", "绝对真实耗时", "返回列数"], answer: 0, reason: "它是基于统计信息的估算，需要结合实际测量。" },
      { question: "为什么不能给每列都建索引？", options: ["增加写入、空间和维护成本", "索引只能有一个", "会禁止 SELECT"], answer: 0, reason: "每次写入都要维护相关索引，过多索引也占缓存和磁盘。" }
    ],
    codeChallenge: { id: "mysql-composite-index", language: "sql", title: "SQL 验收 · 联合索引", brief: "为高频查询 WHERE customer_id=? AND status=? AND created_at>=? 建立一个名为 idx_orders_lookup 的联合索引。", starter: `CREATE INDEX idx_orders_lookup\nON orders (/* 按访问顺序补全三列 */);`, checks: ["建立联合索引", "customer_id 在最左", "status 作为第二个等值列", "created_at 范围列最后"] },
    explanationChallenge: "你会怎样证明新增索引真的改善了查询，而且没有制造更大问题？",
    referenceAnswer: "先记录代表性参数下的耗时、扫描行数、返回行数和执行计划，确认瓶颈来自访问路径而非锁等待或网络。依据过滤、排序、连接和数据分布设计最小索引，在接近生产的数据量上比较 EXPLAIN ANALYZE 与多次压测结果，同时观察写入延迟、索引空间、缓存命中和其他查询计划。上线后监控慢查询与复制延迟，若收益不足应可回滚。",
    explanationHint: "提到基线、执行计划、数据分布、复测、写成本、监控、回滚。",
    evaluationGroups: [["基线", "耗时"], ["EXPLAIN", "计划"], ["分布", "选择性"], ["压测", "复测"], ["写入", "空间"], ["监控", "回滚"]]
  }),
  mysqlLesson({
    id: "db-design",
    title: "DB08 · 数据库设计、治理与综合项目",
    objectives: ["从业务语言识别实体、关系、事实与生命周期", "运用 1NF/2NF/3NF 消除更新异常", "有证据地选择反范式、分区、读写分离与缓存", "完成从建模、SQL、事务、索引到备份安全的全链路设计"],
    concepts: [
      { term: "ER 与规范化", detail: "先统一业务术语，再识别实体和一对一/一对多/多对多关系。1NF 保证原子值，2NF 消除对联合键的部分依赖，3NF 消除非键属性之间的传递依赖。" },
      { term: "反范式与派生数据", detail: "为读性能复制字段或预聚合会增加一致性成本。必须定义数据来源、刷新延迟、校验、重建和所有者，而不是把重复列当免费缓存。" },
      { term: "容量与演进", detail: "根据数据量、增长率、读写比、延迟、可用性、团队能力和成本选择单库、主从、分区或分片。小规模系统不因大厂方案而自动需要分库分表。" },
      { term: "生产治理", detail: "最小权限、参数化查询、审计、备份与恢复演练、迁移版本、监控和数据字典同样属于数据库设计；只有备份没有恢复验证等于没有可靠备份。" }
    ],
    types: [["1NF", "列值原子", "不在一列塞多个 id", "原子性取决于使用方式"], ["2NF", "消除部分依赖", "针对联合候选键", "非键依赖完整键"], ["3NF", "消除传递依赖", "部门名不依赖员工 id 间接保存", "减少更新异常"], ["反范式", "用冗余换读取", "宽表/汇总表", "需刷新、校验与重建"]],
    referenceTitle: "从业务问题到可运营的数据系统",
    referenceDescription: "合理架构不是组件最多，而是在当前规模下最简单可靠，并为可观测的增长信号保留演进路径。",
    prediction: { code: `orders(id, customer_id, customer_name, customer_phone, ...)`, choices: ["客户信息重复会产生更新异常，应区分客户实体与下单快照", "所有重复字段都必须立即删除", "一张大表永远最优"], answer: "客户信息重复会产生更新异常，应区分客户实体与下单快照", explanation: "客户当前资料适合独立实体；若订单必须保留下单时姓名电话，可明确建模为历史快照，而非含义不清的重复字段。" },
    lab: { kind: "mysql-scenario", title: "架构决策推演台", subtitle: "按公司规模和证据选择数据库方案", scenarios: [
      { label: "内部工具：日增 1 万行", sql: "需求：5 人团队、单区域、可接受分钟级恢复", result: "MySQL 单库 + 自动备份 + 监控 + 恢复演练", conclusion: "先建立可靠基本盘，不引入分片复杂度", trace: ["量化容量和 SLO", "选择单实例/托管高可用", "定义备份恢复", "设置扩容触发器"] },
      { label: "读流量增长 20 倍", sql: "证据：读多写少，主库 CPU 高，允许秒级旧数据", result: "先优化查询/缓存，再评估只读副本", conclusion: "读写分离会带来复制延迟与读后写一致性问题", trace: ["排除慢 SQL", "评估缓存命中", "验证副本延迟", "路由可容忍陈旧的查询"] },
      { label: "单表逼近容量边界", sql: "证据：归档后仍超容量，访问天然按 tenant_id 隔离", result: "评估分区/分片及迁移方案", conclusion: "分片是最后的复杂度投资，需要路由、扩容和跨片事务设计", trace: ["先归档与索引优化", "选稳定分片键", "设计双写/校验/切换", "准备故障与回滚"] }
    ] },
    debugChallenge: { code: `users(id, name, course_ids VARCHAR(500))`, question: "把多个课程 id 用逗号塞进一列，主要破坏了什么？", choices: ["难以约束、关联和更新，应建 enrollments 关系表", "VARCHAR 不能有逗号", "用户不能选课"], answer: 0, error: "多值字段混入单列，关系没有被建模", fix: "建立 courses 与 enrollments，使用 learner_id/course_id 外键和联合唯一约束", result: "可查询、可约束、可扩展选课状态与时间", explanation: "规范化首先服务于一致性和可操作性，不是为了追求表数量。" },
    quiz: [
      { question: "多对多关系通常怎样建模？", options: ["独立关系表保存两侧外键", "逗号文本", "复制整张表"], answer: 0, reason: "关系表可增加唯一约束并承载关系自己的属性。" },
      { question: "什么时候反范式更合理？", options: ["有测量收益且有一致性与重建方案", "任何时候少表更好", "不想理解模型时"], answer: 0, reason: "冗余是有成本的性能优化，需证据和治理机制。" },
      { question: "备份可靠性的最终证据？", options: ["定期成功恢复演练并满足 RPO/RTO", "文件名叫 backup", "磁盘很大"], answer: 0, reason: "无法恢复的备份不能保障业务连续性。" },
      { question: "何时考虑分库分表？", options: ["单库经优化仍触及可验证容量/隔离边界", "项目第一天", "看到大厂使用"], answer: 0, reason: "分片引入路由、事务、扩容和运维复杂度，应由证据触发。" }
    ],
    codeChallenge: { id: "mysql-enrollment-design", language: "sql", title: "L2 项目 · 选课系统建模", brief: "创建 learners、courses、enrollments 三表；每表有主键，关系表含两个外键并阻止同一学习者重复选同一课程。", starter: `CREATE TABLE learners (\n  id INTEGER PRIMARY KEY,\n  name VARCHAR(50) NOT NULL\n);\n\n-- 继续创建 courses 与 enrollments`, checks: ["实体与关系拆分", "主键稳定", "两个外键完整", "联合唯一约束阻止重复选课"] },
    graduation: { title: "L3 · MySQL 数据矿井毕业考核", requirements: ["无提示解释关系模型、NULL 与约束", "现场编写安全 CRUD、聚合和多表查询", "定位重复关联与错误指标口径", "设计事务并处理死锁/幂等追问", "阅读 EXPLAIN 并以证据优化索引", "完成 1NF–3NF 建模与有理由反范式", "说明不同公司体量下的架构选择", "完成备份恢复、安全和变更演练"] },
    explanationChallenge: "为什么不能照搬大公司的数据库架构？你会怎样为当前公司做选择并留下演进空间？",
    referenceAnswer: "架构要匹配数据量与增长、读写模式、延迟和可用性目标、合规、预算以及团队运维能力。大公司的分片、多活和复杂平台解决的是其规模问题，照搬会增加开发、事务、排障和成本负担。应先用最简单可靠的 MySQL 方案，补齐约束、事务、索引、监控、备份恢复和变更流程；记录容量、慢查询、故障和组织瓶颈等触发指标，达到阈值后再以压测和迁移方案演进到缓存、只读副本、分区或分片。",
    explanationHint: "提到规模、SLO、团队、成本、简单可靠、监控证据、演进触发器。",
    evaluationGroups: [["规模", "增长"], ["读写", "SLO"], ["团队", "能力"], ["成本", "复杂"], ["简单", "可靠"], ["监控", "证据"], ["演进", "触发"]]
  })
];
