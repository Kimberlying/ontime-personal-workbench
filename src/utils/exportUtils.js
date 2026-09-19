import dayjs from 'dayjs'

/**
 * Utility to format projects, tasks, goals, and notes into structured Markdown
 */
export function generateMarkdownExport({
  projects = [],
  tasks = [],
  goals = [],
  notes = [],
  scope = 'all', // 'all' or specific projectId
  includeCompleted = true,
  includeGoals = true,
  includeNotes = false,
  isEnglish = false,
}) {
  const lines = []
  const nowStr = dayjs().format('YYYY-MM-DD HH:mm')

  // Header
  if (isEnglish) {
    lines.push(`# 📋 OnTime Workbench · Project & Task Export`)
    lines.push(`> Exported at: ${nowStr} | Scope: ${scope === 'all' ? 'All Projects' : 'Selected Project'}`)
  } else {
    lines.push(`# 📋 如期工作台 · 项目与任务清单导出`)
    lines.push(`> 导出时间：${nowStr} | 范围：${scope === 'all' ? '全部项目' : '选定项目'}`)
  }
  lines.push('')

  // Filter projects
  const targetProjects = scope === 'all' 
    ? projects 
    : projects.filter(p => p.id === scope)

  // Goals Section (if requested and scope is all)
  if (includeGoals && goals.length > 0 && scope === 'all') {
    lines.push(isEnglish ? `## 🎯 Strategic Goals` : `## 🎯 长线目标 (Strategic Goals)`)
    goals.forEach(goal => {
      const remainingDays = goal.deadline ? dayjs(goal.deadline).diff(dayjs(), 'day') : null
      const statusMark = goal.status === 'completed' ? 'x' : ' '
      const meta = []
      if (goal.deadline) meta.push(isEnglish ? `Due: ${goal.deadline}` : `截止: ${goal.deadline}`)
      if (remainingDays !== null) meta.push(isEnglish ? `${remainingDays}d left` : `剩余 ${remainingDays} 天`)
      const metaStr = meta.length ? ` (${meta.join(' | ')})` : ''

      lines.push(`- [${statusMark}] **${goal.title}**${metaStr}`)
      if (goal.nodes && goal.nodes.length) {
        goal.nodes.forEach(node => {
          const nMark = node.done ? 'x' : ' '
          lines.push(`  - [${nMark}] ${node.text || node.title}`)
        })
      }
    })
    lines.push('')
  }

  // Projects & Tasks Section
  const projectMap = new Map()
  projects.forEach(p => projectMap.set(p.id, p))

  // Group tasks by project
  const tasksByProject = new Map()
  tasks.forEach(t => {
    if (!includeCompleted && t.status === 'completed') return
    const pid = t.project_id || 'unassigned'
    if (!tasksByProject.has(pid)) {
      tasksByProject.set(pid, [])
    }
    tasksByProject.get(pid).push(t)
  })

  targetProjects.forEach(proj => {
    const projTasks = tasksByProject.get(proj.id) || []
    const totalCount = projTasks.length
    const doneCount = projTasks.filter(t => t.status === 'completed').length
    const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : (proj.progress || 0)

    lines.push(`## 📁 ${proj.name}`)
    const catLabel = proj.category === 'daily' 
      ? (isEnglish ? 'Habit / Daily' : '日常习惯') 
      : proj.category === 'short' 
        ? (isEnglish ? 'Short-term' : '短期冲刺') 
        : (isEnglish ? 'Long-term' : '长期项目')
    
    const projMeta = [
      isEnglish ? `Type: ${catLabel}` : `类型: ${catLabel}`,
      isEnglish ? `Progress: ${pct}%` : `进度: ${pct}%`
    ]
    if (proj.deadline) {
      projMeta.push(isEnglish ? `Due: ${proj.deadline}` : `截止: ${proj.deadline}`)
    }
    lines.push(`> ${projMeta.join(' | ')}`)
    lines.push('')

    // Pending tasks
    const pending = projTasks.filter(t => t.status !== 'completed')
    if (pending.length > 0) {
      lines.push(isEnglish ? `### Pending Tasks (${pending.length})` : `### 待办任务 (${pending.length})`)
      pending.forEach(t => {
        formatTaskMarkdown(lines, t, false, isEnglish)
      })
      lines.push('')
    }

    // Completed tasks
    if (includeCompleted) {
      const completed = projTasks.filter(t => t.status === 'completed')
      if (completed.length > 0) {
        lines.push(isEnglish ? `### Completed Tasks (${completed.length})` : `### 已完成任务 (${completed.length})`)
        completed.forEach(t => {
          formatTaskMarkdown(lines, t, true, isEnglish)
        })
        lines.push('')
      }
    }
  })

  // Standalone / Unassigned tasks
  const unassigned = tasksByProject.get('unassigned') || []
  if (unassigned.length > 0 && scope === 'all') {
    lines.push(isEnglish ? `## 📌 Standalone Tasks` : `## 📌 独立待办任务`)
    unassigned.forEach(t => {
      formatTaskMarkdown(lines, t, t.status === 'completed', isEnglish)
    })
    lines.push('')
  }

  // Notes & Artifacts (if requested)
  if (includeNotes && notes.length > 0 && scope === 'all') {
    lines.push(isEnglish ? `## 📚 Knowledge Base & Notes` : `## 📚 知识库与沉淀文档`)
    notes.forEach(n => {
      const kindLabel = n.kind === 'plan' 
        ? (isEnglish ? 'Plan Document' : '计划文档') 
        : (isEnglish ? 'Retrospective' : '复盘思考')
      lines.push(`### [${kindLabel}] ${n.title}`)
      if (n.created_at) {
        lines.push(`> ${isEnglish ? 'Created' : '记录于'}: ${n.created_at}`)
      }
      lines.push('')
      lines.push(n.body)
      lines.push('')
    })
  }

  return lines.join('\n')
}

function formatTaskMarkdown(lines, t, isDone, isEnglish) {
  const mark = isDone ? 'x' : ' '
  const prioText = t.priority === 'high' 
    ? (isEnglish ? 'High' : '高') 
    : t.priority === 'low' 
      ? (isEnglish ? 'Low' : '低') 
      : (isEnglish ? 'Mid' : '中')
  
  const meta = [`${isEnglish ? 'Priority' : '优先级'}: ${prioText}`]
  if (t.due || t.assigned_date) {
    meta.push(`${isEnglish ? 'Due' : '截止'}: ${t.due || t.assigned_date}`)
  }

  lines.push(`- [${mark}] **${t.title}** | ${meta.join(' | ')}`)
  
  // Starter
  if (t.starter && !isDone) {
    lines.push(`  - ⚡ ${isEnglish ? '5-Min Starter' : '最小启动项'}: ${t.starter}`)
  }

  // Sub-steps
  if (t.steps && t.steps.length) {
    t.steps.forEach(step => {
      const sMark = step.done ? 'x' : ' '
      lines.push(`  - [${sMark}] ${step.text || step.title}`)
    })
  }
}

/**
 * Generate CSV text with UTF-8 BOM for Excel / Numbers compatibility
 */
export function generateCSVExport({ tasks = [], projects = [], isEnglish = false }) {
  const projectMap = new Map()
  projects.forEach(p => projectMap.set(p.id, p.name))

  const headers = isEnglish
    ? ['Project', 'Task Title', 'Status', 'Priority', 'Due Date', 'Assigned Date', 'Starter Action', 'Sub-steps Count']
    : ['所属项目', '任务标题', '状态', '优先级', '截止日期', '安排日期', '最小启动项', '子行动点数']

  const escapeCSV = (field) => {
    if (field === null || field === undefined) return '""'
    const str = String(field).replace(/"/g, '""')
    return `"${str}"`
  }

  const rows = [headers.map(escapeCSV).join(',')]

  tasks.forEach(t => {
    const projName = projectMap.get(t.project_id) || (isEnglish ? 'Standalone' : '独立任务')
    const statusText = t.status === 'completed' 
      ? (isEnglish ? 'Completed' : '已完成') 
      : (isEnglish ? 'Pending' : '进行中')
    const prioText = t.priority === 'high' 
      ? (isEnglish ? 'High' : '高') 
      : t.priority === 'low' 
        ? (isEnglish ? 'Low' : '低') 
        : (isEnglish ? 'Mid' : '中')

    const stepsCount = t.steps ? t.steps.length : 0

    rows.push([
      escapeCSV(projName),
      escapeCSV(t.title),
      escapeCSV(statusText),
      escapeCSV(prioText),
      escapeCSV(t.due || ''),
      escapeCSV(t.assigned_date || ''),
      escapeCSV(t.starter || ''),
      escapeCSV(stepsCount),
    ].join(','))
  })

  // Prepend UTF-8 BOM for Microsoft Excel compatibility
  return '\uFEFF' + rows.join('\r\n')
}

/**
 * Trigger client-side file download
 */
export function downloadFile(filename, content, mimeType = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
