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
  }
];
