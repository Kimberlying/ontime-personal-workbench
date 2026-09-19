import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isRealSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') &&
  !supabaseAnonKey.includes('your-supabase-anon-key')
)

export const supabase = isRealSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// ==========================================
// Local Mock Storage Engine for Instant Demo
// ==========================================

const STORAGE_KEYS = {
  USER: 'orderly_mock_user',
  PROFILE: 'orderly_mock_profile',
  PROJECTS: 'orderly_mock_projects',
  TASKS: 'orderly_mock_tasks',
  MEMBERS: 'orderly_mock_members',
  GOALS: 'orderly_mock_goals',
  NOTES: 'orderly_mock_notes',
}

const nowTs = Date.now()
const todayIso = new Date().toISOString().split('T')[0]
const inDaysIso = n => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

// Initial screenshot-matching mock data with enhanced fields
export const INITIAL_MOCK_DATA = {
  profile: {
    id: 'mock-user-001',
    email: 'creator@orderly.app',
    plan_type: 'pro',
    subscription_status: 'active',
    stripe_customer_id: null,
    used_storage: 0,
    created_at: new Date().toISOString(),
  },
  projects: [
    {
      id: 'proj-001',
      user_id: 'mock-user-001',
      name: '某三期滨江景观施工图',
      deadline: inDaysIso(14),
      type: 'short',
      progress: 50,
      next_step: '施工图绘制',
      is_archived: false,
      created_at: new Date().toISOString(),
    },
    {
      id: 'proj-002',
      user_id: 'mock-user-001',
      name: '某商业街效果图和施工图 (包括主材)',
      deadline: inDaysIso(10),
      type: 'short',
      progress: 25,
      next_step: '效果图绘制',
      is_archived: false,
      created_at: new Date().toISOString(),
    },
    {
      id: 'proj-003',
      user_id: 'mock-user-001',
      name: '某产业园方案深化',
      deadline: inDaysIso(5),
      type: 'short',
      progress: 50,
      next_step: '报价与商务清单',
      is_archived: false,
      created_at: new Date().toISOString(),
    },
    {
      id: 'proj-004',
      user_id: 'mock-user-001',
      name: '某秋季品牌新品活动策划',
      deadline: inDaysIso(45),
      type: 'long',
      progress: 67,
      next_step: '与甲方沟通初审会方案',
      is_archived: false,
      created_at: new Date().toISOString(),
    },
  ],
  tasks: [
    // Active tasks with starter & steps
    {
      id: 'task-active-1',
      user_id: 'mock-user-001',
      project_id: 'proj-001',
      type: 'short',
      title: '某三期滨江景观施工图 · 平面深化',
      desc: '处理甲方最新反馈的竖向标高与铺装分仓图纸',
      priority: 'high',
      assigned_date: todayIso,
      due: todayIso,
      status: 'pending',
      starter: '打开 CAD，先对照标高调整第一张剖面',
      starterDone: false,
      steps: [
        { text: '核对驳岸标高规范', done: true },
        { text: '调整硬质铺装详图', done: false },
        { text: '导出图纸给总工内审', done: false }
      ],
      milestones: [],
      logs: [
        { text: '完成了驳岸高程校核，修正了 2 处倒坡隐患', at: nowTs - 3600000 * 2 }
      ],
      lastTouched: nowTs - 3600000 * 2,
      attachments: [],
      created_at: new Date().toISOString(),
    },
    {
      id: 'task-daily-1',
      user_id: 'mock-user-001',
      project_id: 'proj-004',
      type: 'daily',
      title: '查看行业新闻与资讯',
      desc: '保持信息敏感度，不用读完全文',
      priority: 'low',
      assigned_date: todayIso,
      due: todayIso,
      status: 'pending',
      starter: '打开订阅源，只看 5 条标题',
      starterDone: false,
      steps: [
        { text: '打开订阅源，浏览标题', done: false },
        { text: '记下 1 条有启发的点', done: false }
      ],
      milestones: [],
      logs: [],
      lastTouched: 0,
      attachments: [],
      created_at: new Date().toISOString(),
    },
    {
      id: 'task-daily-2',
      user_id: 'mock-user-001',
      project_id: 'proj-003',
      type: 'daily',
      title: '回复重要邮件与消息',
      desc: '只处理真正需要你回复的',
      priority: 'mid',
      assigned_date: todayIso,
      due: todayIso,
      status: 'pending',
      starter: '打开收件箱，只挑最短的一封回复',
      starterDone: false,
      steps: [
        { text: '标出需要回复的 3 封', done: false },
        { text: '先回最短的那一封', done: false }
      ],
      milestones: [],
      logs: [],
      lastTouched: 0,
      attachments: [],
      created_at: new Date().toISOString(),
    },
    {
      id: 'task-c1',
      user_id: 'mock-user-001',
      project_id: 'proj-004',
      type: 'short',
      title: '开始: 完成 V1 版本',
      priority: 'mid',
      assigned_date: todayIso,
      status: 'completed',
      completed_at: new Date().toISOString(),
      attachments: [],
      created_at: new Date().toISOString(),
    },
    {
      id: 'task-c2',
      user_id: 'mock-user-001',
      project_id: 'proj-002',
      type: 'short',
      title: '开始: 预算',
      priority: 'high',
      assigned_date: todayIso,
      status: 'completed',
      completed_at: new Date().toISOString(),
      attachments: [],
      created_at: new Date().toISOString(),
    },
    {
      id: 'task-c3',
      user_id: 'mock-user-001',
      project_id: 'proj-001',
      type: 'short',
      title: '开始: 效果图修改',
      priority: 'mid',
      assigned_date: todayIso,
      status: 'completed',
      completed_at: new Date().toISOString(),
      attachments: [],
      created_at: new Date().toISOString(),
    },
  ],
  goals: [
    {
      id: 'goal-001',
      title: '景观方案深化交付',
      deadline: inDaysIso(14),
      done: false,
      createdAt: nowTs - 86400000 * 3,
      nodes: [
        { text: '现场踏勘与资料收集', done: true },
        { text: '概念草图与大样构想', done: true },
        { text: '效果图出图评审', done: false },
        { text: '施工图总图绘制', done: false },
        { text: '成果交付与汇报', done: false }
      ],
      logs: [
        { text: '与主创讨论确认了主入口构架草图尺寸', at: nowTs - 86400000 }
      ]
    },
    {
      id: 'goal-002',
      title: 'AWS 认证架构师备考',
      deadline: inDaysIso(45),
      done: false,
      createdAt: nowTs - 86400000 * 5,
      nodes: [
        { text: '过一遍考试大纲', done: true },
        { text: '完成第一章学习与笔记', done: true },
        { text: '完成第二章高可用架构', done: false },
        { text: '做完一套模拟真题', done: false },
        { text: '正式参加考试', done: false }
      ],
      logs: [
        { text: '学完 VPC 与子网划分规则，整理了思维导图', at: nowTs - 86400000 * 2 }
      ]
    }
  ],
  notes: [
    {
      id: 'note-001',
      kind: 'plan',
      title: '项目书 · 方案初稿',
      projectId: 'proj-001',
      tags: ['计划', '方案'],
      body: '目标：两周内完成方案初稿并内部评审。\n范围：需求梳理、框架设计、核心模块说明。\n不在范围内：视觉稿、开发排期。\n验收：能讲清楚每个模块解决什么问题。',
      at: nowTs - 86400000 * 3
    },
    {
      id: 'note-002',
      kind: 'note',
      title: '景观方案初稿 · 调研结论',
      projectId: 'proj-001',
      tags: ['调研', '结论'],
      body: '看了 5 家同类方案，共同短板是上手成本高。\n我们的切入点：把首次使用压缩到 3 分钟内完成一件事。',
      at: nowTs - 86400000 * 2
    },
    {
      id: 'note-003',
      kind: 'note',
      title: '关于「最小启动项」的一点心得',
      projectId: null,
      tags: ['方法', '效率'],
      body: '有效的启动项有个共同点：不需要做任何决定。\n凡是需要"先想一下"的动作，都不算启动项。',
      at: nowTs - 86400000
    }
  ],
  members: [
    {
      id: 'mem-001',
      project_id: 'proj-001',
      member_email: 'designer@team.com',
      role: 'editor',
      created_at: new Date().toISOString(),
    }
  ]
}

export class MockSupabaseClient {
  constructor() {
    this.initStorage()
  }

  initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.PROFILE)) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(INITIAL_MOCK_DATA.profile))
    }
    if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_MOCK_DATA.projects))
    }
    if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_MOCK_DATA.tasks))
    }
    if (!localStorage.getItem(STORAGE_KEYS.MEMBERS)) {
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(INITIAL_MOCK_DATA.members))
    }
    if (!localStorage.getItem(STORAGE_KEYS.GOALS)) {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(INITIAL_MOCK_DATA.goals))
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTES)) {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(INITIAL_MOCK_DATA.notes))
    }
  }

  getProfile() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILE) || '{}')
  }

  setProfile(profile) {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile))
    return profile
  }

  getProjects() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]')
  }

  setProjects(projects) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects))
    return projects
  }

  getTasks() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]')
  }

  setTasks(tasks) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks))
    return tasks
  }

  getGoals() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.GOALS) || '[]')
  }

  setGoals(goals) {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals))
    return goals
  }

  getNotes() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTES) || '[]')
  }

  setNotes(notes) {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes))
    return notes
  }

  getMembers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.MEMBERS) || '[]')
  }

  setMembers(members) {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members))
    return members
  }

  resetToDefault() {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(INITIAL_MOCK_DATA.profile))
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_MOCK_DATA.projects))
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_MOCK_DATA.tasks))
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(INITIAL_MOCK_DATA.members))
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(INITIAL_MOCK_DATA.goals))
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(INITIAL_MOCK_DATA.notes))
  }
}

export const mockClient = new MockSupabaseClient()
