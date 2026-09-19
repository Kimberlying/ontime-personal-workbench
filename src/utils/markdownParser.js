// ==========================================
// Smart Markdown Outline Parser for Workbench
// ==========================================

const TYPE_KEYWORDS = {
  daily: ['日常', '每日', '每天'],
  short: ['短期', '本周', '近期'],
  long: ['长期', '长远']
}

const PRIORITY_KEYWORDS = {
  '高': 'high', '中': 'mid', '低': 'low',
  '高优先': 'high', '中优先': 'mid', '低优先': 'low',
  high: 'high', mid: 'mid', low: 'low'
}

export function normalizeDate(str) {
  if (!str) return ''
  const s = String(str).trim()
  if (!s) return ''
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const fmt = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
  const shift = n => { const d = new Date(today); d.setDate(d.getDate() + n); return fmt(d) }

  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(s)) {
    const [y, m, d] = s.split('-').map(Number)
    return fmt(new Date(y, m - 1, d))
  }
  if (/^\d{1,2}\/\d{1,2}$/.test(s)) {
    const [m, d] = s.split('/').map(Number)
    return fmt(new Date(today.getFullYear(), m - 1, d))
  }
  const cn = s.match(/^(\d{1,2})月(\d{1,2})日?$/)
  if (cn) return fmt(new Date(today.getFullYear(), Number(cn[1]) - 1, Number(cn[2])))
  if (s === '今天') return fmt(today)
  if (s === '明天') return shift(1)
  if (s === '后天') return shift(2)
  const rd = s.match(/^(\d+)\s*天后$/)
  if (rd) return shift(Number(rd[1]))
  const rw = s.match(/^(\d+)\s*周后$/)
  if (rw) return shift(Number(rw[1]) * 7)
  return ''
}

export function parseTaskLine(body) {
  const parts = body.split('|').map(s => s.trim())
  let title = parts[0] || ''
  let priority = 'mid'
  let due = ''
  let project = null

  for (let i = 1; i < parts.length; i++) {
    const p = parts[i]
    if (!p) continue
    if (PRIORITY_KEYWORDS[p]) { priority = PRIORITY_KEYWORDS[p]; continue }
    const d = normalizeDate(p)
    if (d) { due = d; continue }
  }

  const bm = title.match(/^[\[【(（]\s*(高|中|低)\s*[\]】)）]\s*/)
  if (bm) { priority = PRIORITY_KEYWORDS[bm[1]] || 'mid'; title = title.replace(bm[0], '') }
  const am = title.match(/@([^\s@|]+)/)
  if (am) { project = am[1]; title = title.replace(am[0], '') }

  return { title: title.trim(), priority, due, project }
}

function attachDetail(task, content) {
  const m = content.match(/^([^：:]{1,8})\s*[：:]\s*(.*)$/)
  const key = m ? m[1].trim() : ''
  const val = m ? m[2].trim() : content

  if (/^(最小启动项|启动项|最小启动|starter)$/.test(key)) {
    task.starter = val
    return
  }
  if (/^(行动点|步骤|子任务|steps?)$/.test(key)) {
    val.split(/[\/、,，;；]/).map(s => s.trim()).filter(Boolean)
       .forEach(t => task.steps.push({ text: t, done: false }))
    return
  }
  if (/^(里程碑|节点|milestones?)$/.test(key)) {
    val.split(/[\/、,，;；]/).map(s => s.trim()).filter(Boolean)
       .forEach(t => task.milestones.push({ text: t, done: false }))
    return
  }
  if (/^(描述|说明|备注|desc)$/.test(key)) {
    task.desc = val
    return
  }
  task.desc = task.desc ? task.desc + ' ' + content : content
}

export function parseSmartText(text) {
  const projects = []
  const tasks = []
  const goals = []
  const seenProject = {}
  let curProjectName = null
  let curGoal = null
  let curType = 'short'
  let lastTask = null

  const headingRe = /^#{1,6}\s*(.+)$/
  const listRe = /^([ \t]*)(?:[-*+]|\d+[.、)])\s+(.*)$/

  String(text || '').split(/\r?\n/).forEach(raw => {
    const line = raw.replace(/\s+$/, '')
    if (!line.trim()) return

    const hm = line.trim().match(headingRe)
    if (hm) {
      const title = hm[1].trim()
      const pm = title.match(/^项目\s*[：:]\s*(.+)$/)
      if (pm) {
        const name = pm[1].trim()
        if (name && !seenProject[name]) { 
          seenProject[name] = true
          projects.push({ name, category: curType || 'short' }) 
        }
        curProjectName = name || null
        curGoal = null
        lastTask = null
        return
      }
      const gm = title.match(/^目标\s*[：:]\s*(.+)$/)
      if (gm) {
        let rest = gm[1].trim()
        let deadline = ''
        rest.split('|').slice(1).forEach(p => { const d = normalizeDate(p); if (d) deadline = d })
        rest = rest.split('|')[0].trim()
        const at = rest.match(/@\s*(\d{4}-\d{1,2}-\d{1,2}|\d{1,2}\/\d{1,2}|\d{1,2}月\d{1,2}日?)/)
        if (at) { const d = normalizeDate(at[1]); if (d) deadline = d; rest = rest.replace(at[0], '').trim() }
        curGoal = { title: rest || '未命名目标', deadline, nodes: [] }
        goals.push(curGoal)
        curProjectName = null
        lastTask = null
        return
      }
      for (const type of Object.keys(TYPE_KEYWORDS)) {
        if (TYPE_KEYWORDS[type].some(k => title.includes(k))) {
          curType = type
          if (curProjectName) {
            const p = projects.find(x => x.name === curProjectName)
            if (p) p.category = curType
          }
          curGoal = null
          lastTask = null
          return
        }
      }
      return
    }

    const lm = line.match(listRe)
    if (lm) {
      const indent = lm[1].replace(/\t/g, '  ').length
      const content = lm[2].trim()

      if (indent >= 2 && lastTask) {
        attachDetail(lastTask, content)
        return
      }

      const done = /^\[[xX]\]/.test(content)
      const body = content.replace(/^\[[ xX]\]\s*/, '').trim()

      if (curGoal) {
        const nodeTitle = body.split('|')[0].trim()
        if (nodeTitle) curGoal.nodes.push({ text: nodeTitle, done })
        return
      }
      const p = parseTaskLine(body)
      if (!p.title) return
      const task = {
        type: curType,
        title: p.title,
        desc: '',
        priority: p.priority,
        due: p.due,
        projectName: p.project || curProjectName,
        done,
        steps: [],
        starter: '',
        milestones: []
      }
      tasks.push(task)
      lastTask = task
      return
    }

    if (/^[ \t]{2,}/.test(line) && lastTask) {
      attachDetail(lastTask, line.trim())
    }
  })

  return { projects, tasks, goals }
}

export const SMART_SAMPLE = `# 项目：副业产品与独立开发

## 短期
- [ ] 完成竞品功能与痛点调研 | 高 | 3天后
  最小启动项：打开竞品官网，截 3 张核心流程图
  行动点：列出 5 个主要竞品 / 制作对比维度表
- [ ] 输出产品定位与定价文档 | 中 | 7天后
  最小启动项：新建文档，写下核心价值主张
  描述：明确目标用户与付费意愿

## 长期
- [ ] 上线 MVP 版本并开启公测 | 中 | 30天后
  最小启动项：初始化代码库与环境变量
  里程碑：完成核心功能 / 邀请 10 位种子用户 / 正式发布

# 目标：AWS 认证架构师备考 | 45天后
- [x] 快速通读考试大纲与考核重点
- [ ] 完成第一章云架构基础知识学习
- [ ] 完成高可用与容灾方案专项习题

## 日常
- [ ] 每天阅读 20 分钟行业技术资讯 | 低
  最小启动项：打开 RSS 订阅源只读 3 条标题
`
