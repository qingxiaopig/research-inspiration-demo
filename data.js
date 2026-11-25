/* 科研灵感平台 · 内容数据
 * 纯静态 GitHub Pages 演示：无登录、无访问统计服务、无后端。
 */

window.RI_DATA = {
  product: {
    name: "科研灵感",
    en: "RESEARCH INSPIRATION",
    demoAccount: "inspire",
    demoName: "林知远",
    demoRole: "科研探索者",
    hero: {
      pill: "面向 AI4S 的科研灵感平台",
      title: "让科研灵感，成为可验证的路径",
      highlight: "可验证",
      enLine: "Inspiration becomes evidence.",
      sub: "知识 · 假说 · 仿真 · 实验 · 沉淀，沿着一条可回溯的科研闭环不断生长。"
    }
  },

  steps: [
    {
      id: "knowledge",
      no: 1,
      title: "知识与数据",
      en: "Knowledge & Data",
      icon: "database",
      tagline: "把文献与数据编译成可检索、可追溯的知识底座。",
      summary: "从原始文献与科研数据出发，建立分层解耦的知识引擎，并以智能文献检索获得领域洞察，为后续推理提供高质量知识基座。",
      output: "三层知识库与文献洞察",
      sources: ["中科大项目"],
      modules: [
        {
          id: "knowledge-service",
          title: "知识引擎 KnowledgeService",
          kicker: "KnowledgeService",
          category: "知识引擎",
          source: "中科大项目",
          icon: "database",
          intro: "编译—存储—检索分层解耦，文献编译为三层知识库后级联检索。",
          onlineDemo: { hint: "查看知识引擎说明", url: "knowledge.html", badge: "架构说明" },
          blocks: [
            {
              type: "arch",
              label: "分层架构",
              compile: "知识编译服务",
              compileText: "原始文献 → 结构化知识",
              storeTitle: "三层知识库",
              store: ["文献切片", "Wiki 概念条目", "实体与知识图谱"],
              retrieve: "知识检索服务",
              retrieveText: "基于三层知识库级联检索"
            },
            {
              type: "list",
              label: "服务职责",
              items: [
                { title: "知识编译服务", text: "把原始文献编译为文献切片、Wiki 概念条目、实体与知识图谱三层知识库。" },
                { title: "知识检索服务", text: "基于三层知识库执行级联检索。" }
              ]
            }
          ],
          points: ["编译—存储—检索 分层解耦", "知识编译 + 知识检索 双服务", "三层知识库", "级联检索"]
        },
        {
          id: "deepdiver",
          title: "文献检索 deepdiver",
          kicker: "deepdiver",
          category: "文献检索",
          source: "中科大项目",
          icon: "search",
          intro: "对接 Web of Science、PubMed、arXiv，自动完成多维检索与洞察提取。",
          blocks: [
            {
              type: "tags",
              label: "数据源",
              items: ["Web of Science", "PubMed", "arXiv", "等全球学术数据库"]
            },
            {
              type: "list",
              label: "能力链",
              items: [
                { title: "多维度文献检索与智能分类", text: "围绕研究主题自动展开检索，并对文献结果进行智能分类。" },
                { title: "摘要与核心观点提取", text: "从文献中提取摘要与核心观点，降低海量阅读成本。" },
                { title: "研究热点演进趋势", text: "识别研究热点的演进方向，把握领域发展脉络。" },
                { title: "关键技术瓶颈", text: "定位关键技术瓶颈，为后续假说构建提供问题线索。" }
              ]
            },
            {
              type: "note",
              label: "价值",
              text: "为后续假说构建与实验设计提供高质量知识基座，实现从海量文献到科研洞察的智能化跃迁。"
            }
          ],
          points: ["多维度检索与智能分类", "摘要与核心观点提取", "热点演进与瓶颈识别", "高质量知识基座"]
        }
      ]
    },
    {
      id: "hypothesis",
      no: 2,
      title: "假说与推理",
      en: "Hypothesis & Reasoning",
      icon: "spark",
      tagline: "把分散知识收敛成有证据链的科学假说。",
      summary: "以多模型辩论、联网循证与协调仲裁完成假说生成，并把能力延伸到计算可验证领域，形成带证据链的 L4 假说生成系统。",
      output: "结构化假说与证据链",
      sources: ["中科大项目"],
      modules: [
        {
          id: "scientific-hypothesis",
          title: "科学假说生成",
          kicker: "DebateClaw MCP-WS · L4",
          category: "假说推理",
          source: "中科大项目",
          icon: "spark",
          onlineDemo: { hint: "打开静态辩论演示", url: "debate.html" },
          intro: "多模型辩论 + 联网循证 + 仲裁，面向材料化学、能源、催化生成证据链假说。",
          blocks: [
            {
              type: "flow",
              label: "通用辩论框架",
              items: ["多模型并行辩论", "联网搜索循证", "协调者仲裁", "结构化假说结论"]
            },
            {
              type: "list",
              label: "框架价值与落地",
              items: [
                { title: "高质量推理起点", text: "将分散、异构的领域知识汇聚为结构化假说结论，为后续实验设计提供高质量的推理起点。" },
                { title: "首个落地版本", text: "该版本在各学科领域通用性较强，可作为场景建立的首个版本率先落地。" },
                { title: "后续能力深挖", text: "后续可基于学科属性进行改造，并持续深挖科研 L4 能力。" }
              ]
            },
            {
              type: "flow",
              label: "L4 证据链生成",
              items: ["科学问题", "证据检索与推理", "带证据链的假说"]
            },
            {
              type: "list",
              label: "L4 适用边界",
              items: [
                { title: "计算可验证领域", text: "面向但不局限于材料化学、能源、催化等计算可验证领域。" },
                { title: "自动化生成能力", text: "从科学问题出发，自动生成带证据链的假说。" }
              ]
            }
          ],
          points: ["多模型并行辩论", "联网搜索循证", "协调者仲裁", "材料化学 / 能源 / 催化", "带证据链假说"]
        },
        {
          id: "molecule",
          title: "分子生成拓展模块",
          kicker: "Molecule Generation",
          category: "分子探索",
          source: "中科大项目",
          icon: "atom",
          intro: "面向分子晶体探索的可插拔生成模块，经 CSP 验证驱动多轮修正收敛。",
          blocks: [
            {
              type: "flow",
              label: "生成—验证—收敛",
              items: ["分子生成", "CSP 计算验证", "多轮修正", "收敛"]
            },
            {
              type: "note",
              label: "落地状态",
              text: "生成的结果可进一步通过 CSP 计算验证驱动多轮修正收敛，已将其作为科研 L4 能力沉淀至科研假说生成系统的首个落地版本。"
            }
          ],
          points: ["分子晶体探索", "可插拔模块", "L4 首个落地版本", "CSP 计算验证", "多轮修正收敛"]
        }
      ]
    },
    {
      id: "simulation",
      no: 3,
      title: "理论与仿真",
      en: "Theory & Simulation",
      icon: "atom",
      tagline: "用 HPC 与材料模型，给假说一个可计算的答案。",
      summary: "连接材料物质科学的 HPC 软件与模型生态，用第一性原理、分子动力学和机器学习势完成理论计算与仿真验证。",
      output: "可计算、可验证的仿真结果",
      sources: ["中科大项目", "浙江大学"],
      modules: [
        {
          id: "hpc",
          title: "材料物质科学 HPC",
          kicker: "HPC Software Stack",
          category: "计算工具",
          source: "中科大项目",
          icon: "cpu",
          intro: "50–80 个主流 HPC 软件，以 DFT、MD 与后处理三类负载为主。",
          blocks: [
            {
              type: "stats",
              label: "软件规模",
              items: [
                { value: "50–80", label: "主流软件" },
                { value: "100–200", label: "全量量级" }
              ]
            },
            {
              type: "list",
              label: "三类工作负载",
              items: [
                { title: "DFT", text: "密度泛函理论，第一性原理电子结构计算。" },
                { title: "MD", text: "分子动力学，模拟原子 / 分子随时间运动演化。" },
                { title: "后处理", text: "面向计算结果的后处理与分析。" }
              ]
            },
            {
              type: "top5",
              label: "常用 Top 5",
              items: [
                { name: "VASP", desc: "平面波 DFT" },
                { name: "ORCA", desc: "分子体系量子化学" },
                { name: "Quantum ESPRESSO", alias: "QE", desc: "开源平面波 DFT" },
                { name: "LAMMPS", desc: "大规模分子动力学" },
                { name: "CP2K", desc: "混合基组 DFT / MD" }
              ]
            }
          ],
          points: ["DFT / MD / 后处理", "50–80 主流软件", "100–200 全量量级", "Top 5 工具链"]
        },
        {
          id: "models",
          title: "材料物质科学模型",
          kicker: "Materials Models",
          category: "模型生态",
          source: "中科大项目",
          icon: "network",
          intro: "30–50 个主流模型，以原子势、结构与性能模型为主。",
          blocks: [
            {
              type: "stats",
              label: "模型规模",
              items: [
                { value: "30–50", label: "主流模型" },
                { value: "100+", label: "总量" }
              ]
            },
            {
              type: "list",
              label: "模型类型",
              items: [
                { title: "原子势模型", text: "描述原子间相互作用，支撑大规模分子动力学。" },
                { title: "结构模型", text: "面向材料与分子结构的表征、预测与生成。" },
                { title: "性能模型", text: "预测材料性能，连接结构信息与目标属性。" }
              ]
            },
            {
              type: "top5",
              label: "常用 Top 5",
              items: [
                { name: "DeePMD", desc: "深度势能模型" },
                { name: "MACE", desc: "等变图神经网络势" },
                { name: "M3GNet", desc: "图神经网络通用势" },
                { name: "NEP", desc: "神经演化势" },
                { name: "PaiNN", desc: "等变神经网络势" }
              ]
            }
          ],
          points: ["原子势 / 结构 / 性能模型", "30–50 主流模型", "100+ 总量", "Top 5 模型"]
        },
        {
          id: "skillnet",
          title: "skills 筛选",
          kicker: "skillnet",
          category: "技能筛选",
          source: "浙江大学",
          icon: "layers",
          intro: "由浙江大学提供的 skills 筛选模块，服务科研流程中的技能选择。",
          blocks: [
            {
              type: "note",
              label: "能力定位",
              text: "承担 skills 筛选职能，为理论与仿真环节的技能与工具选择提供支持。"
            }
          ],
          points: ["skills 筛选", "浙江大学", "第 3 步能力模块"]
        }
      ]
    },
    {
      id: "experiment",
      no: 4,
      title: "实验执行",
      en: "Experiment Execution",
      icon: "flask",
      tagline: "把实验经验变成可生成、可下发的方案。",
      summary: "将分散、异构、经验依赖的化学实验知识转化为 SKILL 技能，让实验方案能够被智能生成、审核、下发并自动执行。",
      output: "可执行实验方案与工作站 SKILL",
      sources: ["中科大项目"],
      modules: [
        {
          id: "experiment-plan",
          title: "机器实验方案生成",
          kicker: "Experiment Plan",
          category: "方案生成",
          source: "中科大项目",
          icon: "flask",
          intro: "把实验知识转化为可生成、可下发的 SKILL 方案资产。",
          blocks: [
            {
              type: "flow",
              label: "知识到 SKILL",
              items: ["分散 / 异构 / 经验依赖的实验知识", "实验方案智能生成", "SKILL 技能资产", "智能体决策与自动化执行"]
            },
            {
              type: "list",
              label: "转化目标",
              items: [
                { title: "智能体决策", text: "把实验知识转化为智能体可理解、可调用的方案资产。" },
                { title: "自动化执行", text: "让高质量实验方案直接进入自动化实验执行环节。" }
              ]
            }
          ],
          points: ["实验方案智能生成", "自动化执行路径", "实验知识 SKILL 化", "高质量方案资产"]
        },
        {
          id: "jiuwenclaw",
          title: "基于 JiuwenClaw 构建智能实验方案生成系统",
          kicker: "JiuwenClaw",
          category: "实验系统",
          source: "中科大项目",
          icon: "branch",
          intro: "覆盖方案设计、流程规划、工作站对接与任务全生命周期管理。",
          blocks: [
            {
              type: "list",
              label: "系统能力",
              numbered: true,
              items: [
                { title: "自动化化学实验方案设计与生成", text: "面向化学实验场景自动完成方案设计与生成。" },
                { title: "实验流程的智能规划与优化", text: "对实验流程进行智能规划，并持续优化执行路径。" },
                { title: "与实验室自动化工作站的无缝对接", text: "连接实验室自动化工作站，打通方案到执行。" },
                { title: "实验任务的全生命周期管理", text: "覆盖实验生成 / 审核 / 下发 / 执行全过程。" }
              ]
            },
            {
              type: "flow",
              label: "任务生命周期",
              items: ["实验生成", "审核", "下发", "执行"]
            }
          ],
          points: ["JiuwenClaw", "方案设计与生成", "流程规划优化", "工作站无缝对接", "全生命周期管理"]
        },
        {
          id: "labbridge",
          title: "LabBridge · 工作站 Skill Creator 工具",
          kicker: "LabBridge",
          category: "工作站适配",
          source: "中科大项目",
          icon: "link",
          intro: "一键将工作站文档 SKILL 化，端到端转换为可执行实验方案。",
          blocks: [
            {
              type: "flow",
              label: "端到端转换",
              items: ["工作站原始文档", "Skill Creator", "可执行实验方案"]
            },
            {
              type: "note",
              label: "核心价值",
              text: "一键执行将工作站 SKILL 化，把原始文档直接转换为可执行实验方案。"
            }
          ],
          points: ["工作站智能适配", "一键 SKILL 化", "原始文档 → 可执行方案", "端到端自动化"]
        }
      ]
    },
    {
      id: "feedback",
      no: 5,
      title: "反馈与沉淀",
      en: "Feedback & Reuse",
      icon: "refresh",
      tagline: "让每一轮结果，都成为下一轮的起点。",
      summary: "统一结果处理与数据治理，自动沉淀 skills / prompt，并通过强化学习把闭环反馈变成持续优化的能力。",
      output: "可复用资产与下一轮优化信号",
      sources: ["平台沉淀"],
      sourceNote: "本阶段原始资料未标注机构来源，卡片统一以“平台沉淀”标识。",
      modules: [
        {
          id: "result-processing",
          title: "结果处理和分析",
          kicker: "Result Processing",
          category: "数据治理",
          source: "平台沉淀",
          icon: "chart",
          intro: "统一格式与协议，完成清洗、标注、质检、版本溯源与多源打通。",
          blocks: [
            {
              type: "list",
              label: "治理流程",
              numbered: true,
              items: [
                { title: "统一数据格式、元数据和实验协议", text: "让不同来源的结果可以放在同一套数据语境中处理。" },
                { title: "清洗、标注、质量校验与版本溯源", text: "建立完整的数据治理流程，保证结果可复核、可追溯。" },
                { title: "打通仿真、实验和分析数据", text: "连接三类数据，形成可流转的科研数据链路。" },
                { title: "为下一轮优化与模型训练提供依据", text: "让处理后的结果成为优化与训练的可信输入。" }
              ]
            },
            {
              type: "flow",
              label: "数据闭环",
              items: ["仿真数据", "实验数据", "分析数据", "统一数据资产"]
            }
          ],
          points: ["统一格式与协议", "清洗 / 标注 / 质检", "版本溯源", "多源数据打通", "支撑下一轮优化"]
        },
        {
          id: "auto-archive",
          title: "自动化沉淀 skills / prompt",
          kicker: "Skills & Prompt",
          category: "能力沉淀",
          source: "平台沉淀",
          icon: "layers",
          intro: "把验证有效的流程与方法自动沉淀为可复用的 skills 与 prompt。",
          blocks: [
            {
              type: "list",
              items: [
                { title: "skills 沉淀", text: "把可复用的操作与流程固化为可调用的技能。" },
                { title: "prompt 沉淀", text: "把有效的提示与推理模板沉淀为可复用的提示资产。" }
              ]
            }
          ],
          points: ["skills 沉淀", "prompt 沉淀", "自动化沉淀", "能力复用"]
        },
        {
          id: "reinforcement-learning",
          title: "强化学习",
          kicker: "Reinforcement Learning",
          category: "持续优化",
          source: "平台沉淀",
          icon: "refresh",
          intro: "以闭环反馈为训练信号，持续优化智能体策略与实验方案。",
          blocks: [
            {
              type: "flow",
              label: "反馈驱动",
              items: ["闭环反馈", "策略更新", "下一轮实验"]
            },
            {
              type: "note",
              label: "闭环作用",
              text: "让第 5 步的沉淀结果回流到下一轮方案优化，使五步法持续进化。"
            }
          ],
          points: ["闭环反馈", "策略优化", "持续迭代"]
        }
      ]
    }
  ],

  featured: ["knowledge-service", "scientific-hypothesis", "labbridge"],

  /* 友情链接与 linggan.top 页脚保持一致，图标已下载到 assets/friend-links/。 */
  friendLinks: [
    {
      name: "昇腾生态",
      desc: "昇腾开源项目与开发者生态",
      href: "https://atomgit.com/?tn=6a55a84dcbe9c05bd87c4c6f",
      icon: "assets/friend-links/ascend.png",
      alt: "昇腾生态 logo"
    },
    {
      name: "openJiuwen",
      desc: "开放工具与应用生态",
      href: "https://openjiuwen.com/",
      icon: "assets/friend-links/openjiuwen.png",
      alt: "openJiuwen logo"
    },
    {
      name: "AgentArts",
      desc: "华为云 AI 开发与模型平台",
      href: "https://www.huaweicloud.com/product/versatile.html",
      icon: "assets/friend-links/agentarts.png",
      alt: "AgentArts logo"
    },
    {
      name: "小艺",
      desc: "智能助手与对话入口",
      href: "https://xiaoyi.huawei.com/chat/",
      icon: "assets/friend-links/xiaoyi.png",
      alt: "小艺 logo"
    }
  ]
};
