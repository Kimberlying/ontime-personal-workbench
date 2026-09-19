import dayjs from 'dayjs'

export const DOMAIN_TEMPLATES = {
  cert_it: {
    nameZh: 'IT技能/专业认证 (AWS / CCA / CCNA / PMP)',
    nameEn: 'IT & Professional Cert (AWS / CCA / CCNA / PMP)',
    keywords: ['aws', 'cca', 'ccna', 'ccnp', 'pmp', 'cpa', '软考', '思科', '微软', '华为认证', 'hcip', 'hcia', 'hcie', 'rhce', 'rhcsa', 'cisp', 'it认证', '架构师认证', '认证'],
    stages: [
      {
        name: '考纲拆解与实验环境准备',
        nameEn: 'Syllabus Breakdown & Lab Setup',
        weight: 2,
        subtasks: [
          '梳理官方考纲 Domain 章节权重分布与及格线标准',
          '准备官方教材/精讲网课并搭建动手实验环境 (Lab)',
          '制定分章节打卡时间表与每日刷题量化目标',
        ],
        subtasksEn: [
          'Review official exam domains, weight distribution & passing score',
          'Gather official study guides, video course & set up cloud lab environment',
          'Set up daily chapter roadmap & question quota target',
        ],
      },
      {
        name: '核心章节精读与动手实验',
        nameEn: 'Chapter Deep-Dive & Hands-on Labs',
        weight: 4,
        subtasks: [
          '精读核心架构/网络章节，整理结构化脑图笔记',
          '动手完成核心服务配置、命令操作与故障排查实验',
          '专项攻坚高可用、安全策略与容灾等高频必考设计',
        ],
        subtasksEn: [
          'Deep-dive into core architecture & network chapters with mind maps',
          'Complete hands-on configuration, CLI commands & troubleshooting labs',
          'Master high-availability, security policies & disaster recovery designs',
        ],
      },
      {
        name: '题库分类刷题与错题深度复盘',
        nameEn: 'Question Bank Practice & Error Analysis',
        weight: 4,
        subtasks: [
          '按章节完成高频题库刷题，标记易混淆与陷阱题目',
          '建立错题本，逐题深挖官方解析与题干关键触发词',
          '针对正确率低的薄弱章节二次重刷，确保正确率达 90%+',
        ],
        subtasksEn: [
          'Practice topical question dumps & flag tricky distractor questions',
          'Build error review notebook & analyze official explanation keywords',
          'Re-practice weak chapters until achieving 90%+ accuracy',
        ],
      },
      {
        name: '全真限时模考与答题节奏强化',
        nameEn: 'Full-Length Timed Mock Exam Sprints',
        weight: 3,
        subtasks: [
          '严格按真实考试时间完成 3~5 套全真限时模拟卷',
          '评估模考得分走势，优化审题速度与不确定题目标记策略',
          '针对模考暴露出的知识盲区进行最后一轮扫盲攻坚',
        ],
        subtasksEn: [
          'Complete 3~5 full-length timed mock exams under real test conditions',
          'Analyze score trends, optimize pacing & review flagging strategy',
          'Conduct targeted review on lingering blind spots from mocks',
        ],
      },
      {
        name: '考前重点速记与考试预约准备',
        nameEn: 'Final Cheat-Sheet Review & Exam Booking',
        weight: 1,
        subtasks: [
          '快速通读核心考点口诀表、端口/服务对比表与错题集',
          '确认官方考试预约时间、有效双证件与考场网络环境',
          '调整心态与作息，自信赴考一次如期通关',
        ],
        subtasksEn: [
          'Quickly review cheat sheets, port/service matrices & error log',
          'Confirm exam appointment, double IDs & test center guidelines',
          'Calibrate rest and mindset for confident test day success',
        ],
      },
    ],
  },

  cert_lang: {
    nameZh: '语言类考试 (雅思 / 托福 IELTS / TOEFL)',
    nameEn: 'Language Exams (IELTS / TOEFL / Duolingo)',
    keywords: ['雅思', '托福', 'ielts', 'toefl', 'gre', 'gmat', '四六级', 'cet4', 'cet6', '英语', '专四', '专八', '日语', 'jlpt', 'n1', 'n2', '韩语', 'topik', '多邻国', 'duolingo'],
    stages: [
      {
        name: '核心词汇积累与题型摸底',
        nameEn: 'Core Vocabulary & Diagnostic Baseline',
        weight: 2,
        subtasks: [
          '背诵高频学术核心词汇与同义替换词表',
          '完成 1 套官方真题摸底测试，明确各单项薄弱点',
          '制定听、说、读、写四大模块每日倒排训练计划',
        ],
        subtasksEn: [
          'Master high-frequency academic vocabulary & synonym tables',
          'Take 1 official diagnostic practice test to pinpoint weak sections',
          'Establish daily schedule across Listening, Reading, Writing & Speaking',
        ],
      },
      {
        name: '听力精听抓词与阅读长难句精读',
        nameEn: 'Listening Dictation & Reading Speed Drilling',
        weight: 4,
        subtasks: [
          '听力真题逐句精听磨耳朵，总结高频连读与考点词',
          '阅读真题限时精读，攻坚同义替换定位与长难句剖析',
          '整理高频学术生词库，提炼题干出题逻辑与干扰陷阱',
        ],
        subtasksEn: [
          'Perform sentence-by-sentence listening dictation & catch keywords',
          'Timed reading drills, focus on synonym locating & complex syntax',
          'Curate academic vocabulary bank & deconstruct question trap patterns',
        ],
      },
      {
        name: '写作逻辑框架与口语题库对练',
        nameEn: 'Writing Structure & Speaking Topic Drills',
        weight: 4,
        subtasks: [
          '精读大作文高分范文，提炼论证逻辑链与连接词句式',
          '针对小作文图表/流程图归纳必备句型模板与趋势表达',
          '口语 Part 1/2/3 当季高频题库录音对练与纠音润色',
        ],
        subtasksEn: [
          'Analyze band 8+ model essays & extract argumentation logical chains',
          'Master Task 1 chart/diagram trend descriptors & templates',
          'Practice and record Part 1/2/3 current speaking pool with feedback',
        ],
      },
      {
        name: '全真限时模考与弱项深度精批',
        nameEn: 'Full-Length Timed Mocks & Essay Feedback',
        weight: 3,
        subtasks: [
          '每周严格按正式考试时间完成 1 套全真模考',
          '大作文与小作文找老师/AI 精批修改，优化表达细节',
          '严格计时进行口语全流程模考演练，消除卡顿',
        ],
        subtasksEn: [
          'Complete weekly full-length timed mock exams under exam conditions',
          'Get professional/AI feedback on writing grammar, cohesion & task response',
          'Run full timed speaking mock simulations to build natural fluency',
        ],
      },
      {
        name: '错题通读与考前语感状态保温',
        nameEn: 'Error Notebook Review & Warm-up',
        weight: 1,
        subtasks: [
          '重温大作文高分语料库与小作文核心句型',
          '快速通读当季口语高频话题笔记，保持听说语感',
          '准备准考证与有效身份证件，沉着应试发挥最佳水平',
        ],
        subtasksEn: [
          'Review writing topic vocabulary & Task 1 core structure templates',
          'Skim speaking topical notes to maintain active language warm-up',
          'Prepare exam admission ticket & ID, stay calm for peak performance',
        ],
      },
    ],
  },

  cert_general: {
    nameZh: '通用考试备考 (精读 ➔ 刷题 ➔ 模考 ➔ 冲刺)',
    nameEn: 'General Exam Framework (Study -> Practice -> Mock -> Cram)',
    keywords: ['考试', '备考', '考研', '考公', '公考', '事业编', '期末', '复习', '考证', '建造师', '教师资格证', '法考', '刷题', '真题', '中考', '高考', 'exam', 'test', 'study'],
    stages: [
      {
        name: '教材通读与全书知识框架梳理',
        nameEn: 'Textbook Deep-Dive & Knowledge Framework',
        weight: 3,
        subtasks: [
          '对照考试大纲通读全书教材，建立全科知识图谱',
          '标注重难点章节与各题型分值权重分布',
          '整理手写/电子版结构化章节核心笔记',
        ],
        subtasksEn: [
          'Read through textbook against syllabus and build concept map',
          'Flag high-weight core chapters and key exam topics',
          'Structure comprehensive chapter-by-chapter summary notes',
        ],
      },
      {
        name: '章节针对性刷题与错题深度总结',
        nameEn: 'Chapter Practice & Error Notebook',
        weight: 4,
        subtasks: [
          '每完成一章精读立即配套刷章节练习题',
          '建立错题本，深挖概念盲区与解题技巧套路',
          '针对正确率低于 70% 的薄弱章节进行二次强化攻坚',
        ],
        subtasksEn: [
          'Complete dedicated practice questions right after each chapter',
          'Maintain an error notebook to diagnose weak concepts & tricks',
          'Conduct secondary targeted practice on chapters below 70% accuracy',
        ],
      },
      {
        name: '历年真题限时演练与命题规律剖析',
        nameEn: 'Past Papers & Timed Simulation',
        weight: 4,
        subtasks: [
          '严格掐表限时完成近 5 年历年真题全卷',
          '对照标准答案剖析命题规律与主观题采分点',
          '统计历次模考得分，调整做题策略与时间分配',
        ],
        subtasksEn: [
          'Complete past 5 years real exam papers under strict time limits',
          'Analyze marking rubrics & scoring point logic for subjective questions',
          'Track score trajectories & optimize overall question time management',
        ],
      },
      {
        name: '考前重点背诵与押题冲刺',
        nameEn: 'Final Cram & Readiness Check',
        weight: 1,
        subtasks: [
          '集中背诵核心公式、必背考点与易错题型口诀',
          '快速通读错题本，进行最后一轮考点全面扫盲',
          '备齐考试文具、准考证与证件，从容赴考如期拿下',
        ],
        subtasksEn: [
          'Memorize essential formulas, core definitions & mnemonic rules',
          'Quickly scan error notebook for final blind spot eradication',
          'Prepare stationery, admission tickets & ID for a confident test day',
        ],
      },
    ],
  },

  design: {
    nameZh: '建筑/室内/景观/设计工程',
    nameEn: 'Architecture / Interior / Landscape / Design',
    keywords: ['图', '设计', '方案', '景观', '施工', '效果图', '建筑', '室内', '装修', 'cad', '3d', 'su', 'bim', 'render', 'drawing', 'plan'],
    stages: [
      {
        name: '现场勘测与资料复核',
        nameEn: 'Site Survey & Data Verification',
        weight: 2,
        subtasks: [
          '梳理现场红线与实测尺寸数据',
          '收集业主意向图与功能需求清单',
          '整理现状地貌、管线与边界资料',
        ],
        subtasksEn: [
          'Verify site dimensions and boundary data',
          'Collect client reference images & requirement checklist',
          'Organize terrain, pipeline, and constraint documents',
        ],
      },
      {
        name: '概念草图与平面布置',
        nameEn: 'Concept Sketch & Layout Planning',
        weight: 3,
        subtasks: [
          '绘制 2~3 套平面流线手绘草案',
          '确定主选定平面与动线功能布局',
          '制作概念意向与氛围汇报材料',
        ],
        subtasksEn: [
          'Draft 2~3 layout & circulation concept sketches',
          'Confirm preferred master plan & functional zoning',
          'Create concept moodboard & presentation slides',
        ],
      },
      {
        name: '深化图纸与大样绘制',
        nameEn: 'Detail Drawings & Node Construction',
        weight: 4,
        subtasks: [
          '绘制平立剖主体深化图纸',
          '细化节点构造大样与收口详图',
          '校验主要尺寸与标高闭合体系',
        ],
        subtasksEn: [
          'Produce detailed plans, elevations, and sections',
          'Refine key junction nodes & construction detail sheets',
          'Verify primary dimensions, elevations & coordinate grid',
        ],
      },
      {
        name: '材料选样与商务清单',
        nameEn: 'Material Sampling & Bill of Quantities',
        weight: 2,
        subtasks: [
          '编制材料封样板与规格说明书',
          '统计主要工程量并初拟预算清单',
          '组织内部图纸联合交叉校对',
        ],
        subtasksEn: [
          'Compile material board & specification sheet',
          'Estimate quantities and preliminary budget sheet',
          'Conduct internal cross-disciplinary drawing review',
        ],
      },
      {
        name: '成果审定与交付归档',
        nameEn: 'Final Review & Deliverable Handover',
        weight: 1,
        subtasks: [
          '最终图纸签字盖章与电子版归档',
          '召开方案最终交付成果汇报会',
          '整理交底备忘录与后续跟进计划',
        ],
        subtasksEn: [
          'Sign, stamp and archive final PDF/DWG package',
          'Host final delivery presentation meeting',
          'Draft handover memo & follow-up roadmap',
        ],
      },
    ],
  },

  dev: {
    nameZh: '软件开发/小程序/独立产品',
    nameEn: 'Software Development / Web App / SaaS',
    keywords: ['开发', '代码', '系统', '小程序', 'app', '软件', 'api', '前端', '后端', 'dev', 'code', 'web', 'program', 'build'],
    stages: [
      {
        name: '需求梳理与原型架构',
        nameEn: 'Requirements & Prototype Architecture',
        weight: 2,
        subtasks: [
          '梳理核心功能需求与 MVP 用户故事',
          '制作高保真交互原型与页面流转图',
          '确定技术栈选型与数据模型表结构',
        ],
        subtasksEn: [
          'Define core scope & MVP user stories',
          'Design interactive Figma prototype & page flow',
          'Select tech stack & design database schema',
        ],
      },
      {
        name: '核心业务与接口联调',
        nameEn: 'Core Backend & API Integration',
        weight: 4,
        subtasks: [
          '搭建工程脚手架与用户鉴权服务',
          '编写核心业务逻辑与 REST/GraphQL 接口',
          '跑通前后端核心交互通路与状态流转',
        ],
        subtasksEn: [
          'Initialize repository & authentication service',
          'Implement core business logic & API endpoints',
          'Wire frontend state management with backend APIs',
        ],
      },
      {
        name: 'UI精细化与交互体验',
        nameEn: 'UI Polish & Responsive Polish',
        weight: 3,
        subtasks: [
          '还原响应式界面布局与组件封装',
          '优化表单交互校验与空状态/加载动效',
          '完善全局异常拦截与友好提示机制',
        ],
        subtasksEn: [
          'Build responsive layouts & reusable components',
          'Optimize form validation, loading states & micro-interactions',
          'Implement robust error boundaries & user notifications',
        ],
      },
      {
        name: '全流程测试与Bug攻坚',
        nameEn: 'Full-flow Testing & Bug Fixing',
        weight: 2,
        subtasks: [
          '全链路端到端核心流程冒烟测试',
          '排查多端兼容性与极端输入边界场景',
          '修复已知阻断级与显示交互缺陷',
        ],
        subtasksEn: [
          'Conduct end-to-end smoke tests on critical paths',
          'Check cross-browser compatibility & edge cases',
          'Fix known blocking bugs & polish performance',
        ],
      },
      {
        name: '上线部署与发布验收',
        nameEn: 'Deployment & Production Release',
        weight: 1,
        subtasks: [
          '配置生产环境 CI/CD 与域名 SSL 解析',
          '线上生产环境全流程最终冒烟验收',
          '发布正式版本并监测系统错误日志',
        ],
        subtasksEn: [
          'Configure production CI/CD, domain & SSL certificates',
          'Run final live production verification check',
          'Publish official release & monitor error logs',
        ],
      },
    ],
  },

  media: {
    nameZh: '自媒体/视频剪辑/内容运营',
    nameEn: 'Content Creation / Video / Social Media',
    keywords: ['小红书', '视频', '公众号', '文章', '自媒体', '剪辑', '文案', '发布', '账号', 'media', 'post', 'video', 'tiktok', 'youtube'],
    stages: [
      {
        name: '选题策划与爆款调研',
        nameEn: 'Topic Research & Hook Ideation',
        weight: 2,
        subtasks: [
          '搜集对标爆款数据并提炼核心选题',
          '锁定受众痛点与前 3 秒黄金悬念钩子',
          '拟定全篇内容主线大纲与观点结构',
        ],
        subtasksEn: [
          'Research trending benchmarks & pick high-resonance topic',
          'Identify audience pain points & 3-second hook',
          'Outline narrative structure & key takeaways',
        ],
      },
      {
        name: '脚本撰写与分镜准备',
        nameEn: 'Script Writing & Storyboarding',
        weight: 3,
        subtasks: [
          '撰写口语化逐字稿与分镜头脚本',
          '准备拍摄场地、道具或演示素材',
          '构思 3 款高点击率封面主标题与视觉',
        ],
        subtasksEn: [
          'Write conversational script & scene breakdown',
          'Gather props, recording environment & demo assets',
          'Brainstorm 3 high-CTR title & thumbnail concepts',
        ],
      },
      {
        name: '拍摄录制与剪辑包装',
        nameEn: 'Recording & Video Editing',
        weight: 4,
        subtasks: [
          '完成主体音视频素材高清录制',
          '粗剪主线节奏，剔除废话与口误气口',
          '精剪添加背景音效、字幕花字与转场动效',
        ],
        subtasksEn: [
          'Record high-quality video & audio footage',
          'Rough cut for pacing, eliminate filler words',
          'Fine edit with sound effects, subtitles & animated overlays',
        ],
      },
      {
        name: '校对发布与互动复盘',
        nameEn: 'Review, Publishing & Engagement',
        weight: 1,
        subtasks: [
          '多端预览核对错别字与敏感词过滤',
          '多平台排版发布并配置话题标签',
          '发布前 2 小时置顶评论并积极回复互动',
        ],
        subtasksEn: [
          'Review spelling, formatting & compliance checks',
          'Publish across channels with targeted hashtags',
          'Pin top comment & engage with audience in first 2 hours',
        ],
      },
    ],
  },

  research: {
    nameZh: '学术论文/调研报告/开题答辩',
    nameEn: 'Academic Paper / Research / Report',
    keywords: ['论文', '报告', '研究', '开题', '调研', '毕业', '期刊', '答辩', 'thesis', 'paper', 'research', 'report', 'study'],
    stages: [
      {
        name: '文献检索与选题论证',
        nameEn: 'Literature Review & Topic Validation',
        weight: 2,
        subtasks: [
          '研读近 3 年核心顶刊文献并提取综述',
          '提炼核心研究空白点与理论创新思路',
          '撰写开题报告并确定整体技术路线图',
        ],
        subtasksEn: [
          'Review top-tier recent literature & synthesize insights',
          'Identify research gap & conceptual innovation',
          'Draft proposal outline & research methodology roadmap',
        ],
      },
      {
        name: '实验设计与数据采集',
        nameEn: 'Experimental Design & Data Gathering',
        weight: 4,
        subtasks: [
          '设计实验流程或问卷量表并小样预试',
          '规范采集并记录第一手实测原始数据',
          '进行数据清洗、异常值剔除与标准化处理',
        ],
        subtasksEn: [
          'Formulate experimental protocol / survey instrument',
          'Gather primary empirical data accurately',
          'Clean, normalize and structure dataset',
        ],
      },
      {
        name: '模型分析与正文撰写',
        nameEn: 'Statistical Modeling & Chapter Drafting',
        weight: 4,
        subtasks: [
          '运行统计模型分析并导出高清图表',
          '完成 Methodology 与 Results 章节撰写',
          '结合前人成果深入展开 Discussion 与结论',
        ],
        subtasksEn: [
          'Execute statistical analysis & render high-res charts',
          'Draft Methodology and Findings sections',
          'Write comprehensive Discussion & Conclusion chapters',
        ],
      },
      {
        name: '规范校对与润色查重',
        nameEn: 'Formatting, Proofreading & Finalization',
        weight: 2,
        subtasks: [
          '核查参考文献格式与公式图表编号规范',
          '学术语言润色与逻辑严密性通读',
          '官方系统查重降重并最终排版定稿',
        ],
        subtasksEn: [
          'Check citation styles, figure captions & equation numbering',
          'Polish academic tone & logical coherence',
          'Perform plagiarism check & format final manuscript',
        ],
      },
    ],
  },

  general: {
    nameZh: '通用目标/商务策划/攻坚项目',
    nameEn: 'General Project / Business Milestone',
    keywords: [],
    stages: [
      {
        name: '目标对齐与需求梳理',
        nameEn: 'Goal Alignment & Scoping',
        weight: 2,
        subtasks: [
          '明确最终验收交付标准与关键成果物',
          '梳理时间节点约束与核心资源依赖',
          '制定分阶段时间倒排与责任分工表',
        ],
        subtasksEn: [
          'Clarify final deliverables & acceptance criteria',
          'Map out timeline constraints & critical dependencies',
          'Draft backward milestones & accountability breakdown',
        ],
      },
      {
        name: '方案构思与骨架搭建',
        nameEn: 'Solution Framing & Outline',
        weight: 3,
        subtasks: [
          '完成主体行动方案第一版骨架草案',
          '组织核心成员进行头脑风暴与可行性论证',
          '锁定关键实施路径与备选风险预案',
        ],
        subtasksEn: [
          'Draft first-pass outline & execution framework',
          'Host brainstorm & feasibility review session',
          'Lock in primary execution pathway & contingency plans',
        ],
      },
      {
        name: '细节攻坚与内容推进',
        nameEn: 'Deep Execution & Production',
        weight: 4,
        subtasks: [
          '全力集中推进核心模块的具体制作交付',
          '汇总各环节产出并统一质量与规范标准',
          '攻克卡点难点问题，确保进度如期推进',
        ],
        subtasksEn: [
          'Drive dedicated production on primary modules',
          'Consolidate outputs & maintain quality standards',
          'Tackle bottlenecks to keep timeline on track',
        ],
      },
      {
        name: '评审校对与细节修改',
        nameEn: 'Review, Feedback & Refinement',
        weight: 2,
        subtasks: [
          '组织阶段性成果评审并收集各方反馈',
          '针对反馈意见进行针对性精细化修改',
          '完善配套文档、说明附件与交付准备',
        ],
        subtasksEn: [
          'Conduct stakeholder review & gather feedback',
          'Implement targeted revisions & refinements',
          'Finalize supplementary docs & handover assets',
        ],
      },
      {
        name: '最终验收与结项复盘',
        nameEn: 'Final Acceptance & Handover',
        weight: 1,
        subtasks: [
          '完成最终成果物交付与签字确认',
          '召开结项复盘会议，沉淀方法论经验',
          '将项目成果有序归档并载入里程碑',
        ],
        subtasksEn: [
          'Complete final deliverable handover & sign-off',
          'Hold project retrospective & document key learnings',
          'Archive deliverables & celebrate milestone achievement',
        ],
      },
    ],
  },
}

/**
 * Identify matching domain template from target title
 */
export function detectDomainKey(targetTitle = '') {
  const lower = targetTitle.toLowerCase()
  for (const [key, tpl] of Object.entries(DOMAIN_TEMPLATES)) {
    if (key === 'general') continue
    if (tpl.keywords.some(k => lower.includes(k))) {
      return key
    }
  }
  return 'general'
}

/**
 * Generate intelligent stages and subtasks breakdown based on title
 */
export function generateSmartBreakdown(targetTitle = '', domainKey = null, isEnglish = false) {
  const selectedKey = domainKey || detectDomainKey(targetTitle)
  const template = DOMAIN_TEMPLATES[selectedKey] || DOMAIN_TEMPLATES.general

  return template.stages.map((stage) => ({
    name: isEnglish ? stage.nameEn : stage.name,
    weight: stage.weight || 2,
    subtasks: (isEnglish ? stage.subtasksEn : stage.subtasks).map(sub => ({
      title: sub,
      done: false,
    })),
  }))
}

/**
 * Calculate scheduled date ranges for preview
 */
export function calculateBackwardSchedule({ targetTitle, deadline, stages = [] }) {
  const today = dayjs().startOf('day')
  const targetDay = dayjs(deadline).startOf('day')
  let totalDays = Math.max(1, targetDay.diff(today, 'day') + 1)

  const stageList = stages.length > 0 ? stages : DOMAIN_TEMPLATES.general.stages
  const totalWeight = stageList.reduce((sum, s) => sum + (s.weight || 1), 0)

  let currentDayOffset = 0
  return stageList.map((stage, idx) => {
    const isLast = idx === stageList.length - 1
    const rawDays = Math.round(((stage.weight || 1) / totalWeight) * totalDays)
    const stageDays = isLast ? Math.max(1, totalDays - currentDayOffset) : Math.max(1, rawDays)

    const startDate = today.add(currentDayOffset, 'day').format('YYYY-MM-DD')
    const endDate = today.add(Math.min(totalDays - 1, currentDayOffset + stageDays - 1), 'day').format('YYYY-MM-DD')
    
    currentDayOffset += stageDays

    return {
      stageName: stage.name,
      subtasks: stage.subtasks || [],
      startDate,
      endDate,
      durationDays: stageDays,
    }
  })
}
