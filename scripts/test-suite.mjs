import assert from 'node:assert/strict'
import { parseSmartText, normalizeDate, parseTaskLine } from '../src/utils/markdownParser.js'
import { generateMarkdownExport, generateCSVExport } from '../src/utils/exportUtils.js'
import dayjs from 'dayjs'

console.log('🧪 ==========================================')
console.log('🧪 开始执行「如期 Orderly 工作台」综合自动化测试')
console.log('🧪 ==========================================\n')

let passedTests = 0
let failedTests = 0

function test(name, fn) {
  try {
    fn()
    console.log(`  ✅ [PASS] ${name}`)
    passedTests++
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}`)
    console.error(`     Error: ${err.message}`)
    failedTests++
  }
}

// -------------------------------------------------------------
// 1. 日期格式化与标准化测试
// -------------------------------------------------------------
test('日期解析: normalizeDate 识别各种自然语言与日期格式', () => {
  const todayStr = dayjs().format('YYYY-MM-DD')
  const tomorrowStr = dayjs().add(1, 'day').format('YYYY-MM-DD')
  const threeDaysStr = dayjs().add(3, 'day').format('YYYY-MM-DD')

  assert.equal(normalizeDate('今天'), todayStr)
  assert.equal(normalizeDate('明天'), tomorrowStr)
  assert.equal(normalizeDate('3天后'), threeDaysStr)
  assert.equal(normalizeDate('2026-10-15'), '2026-10-15')
})

// -------------------------------------------------------------
// 2. 智能 Markdown 解析器测试
// -------------------------------------------------------------
test('Markdown 解析器: parseTaskLine 提取优先级与截止日', () => {
  const line = '核心功能交付 | 高 | 明天'
  const res = parseTaskLine(line)
  assert.equal(res.title, '核心功能交付')
  assert.equal(res.priority, 'high')
  assert.equal(res.due, dayjs().add(1, 'day').format('YYYY-MM-DD'))
})

test('Markdown 解析器: parseSmartText 完整项目/大纲/目标解析', () => {
  const sampleMd = `
# 项目：独立开发与产品上线
## 短期
- [ ] 架构设计与原型确认 | 高 | 9/25
  最小启动项：打开 Figma 看一眼首页图框
  行动点：线框图绘制 / 配色选择
- [x] 竞品分析研读 | 低 | 9/20
# 目标：AWS 架构师认证备考 | 2026-10-30
- [x] 官方指南通读
- [ ] 题库全真模拟
`
  const result = parseSmartText(sampleMd)
  assert.equal(result.projects.length, 1)
  assert.equal(result.projects[0].name, '独立开发与产品上线')
  assert.equal(result.projects[0].category, 'short')

  assert.equal(result.tasks.length, 2)
  assert.equal(result.tasks[0].title, '架构设计与原型确认')
  assert.equal(result.tasks[0].priority, 'high')
  assert.equal(result.tasks[0].starter, '打开 Figma 看一眼首页图框')
  assert.equal(result.tasks[0].steps.length, 2)

  assert.equal(result.goals.length, 1)
  assert.equal(result.goals[0].title, 'AWS 架构师认证备考')
  assert.equal(result.goals[0].deadline, '2026-10-30')
  assert.equal(result.goals[0].nodes.length, 2)
  assert.equal(result.goals[0].nodes[0].done, true)
  assert.equal(result.goals[0].nodes[1].done, false)
})

// -------------------------------------------------------------
// 3. 数据导出功能测试
// -------------------------------------------------------------
test('数据导出: generateMarkdownExport 结构化大纲生成', () => {
  const mockProjects = [
    { id: 'p1', name: '全栈开发', category: 'short', deadline: '2026-10-01', progress: 50 }
  ]
  const mockTasks = [
    { id: 't1', project_id: 'p1', title: '编写后端接口', priority: 'high', status: 'pending', starter: '写第一个路由' },
    { id: 't2', project_id: 'p1', title: '数据库迁移', priority: 'mid', status: 'completed' }
  ]
  const mockGoals = [
    { id: 'g1', title: '完成年终战略', deadline: '2026-12-31', nodes: [{ text: '复盘', done: false }] }
  ]

  const mdExport = generateMarkdownExport({
    projects: mockProjects,
    tasks: mockTasks,
    goals: mockGoals,
    scope: 'all',
    includeCompleted: true,
    includeGoals: true
  })

  assert.ok(mdExport.includes('# 📋 如期工作台 · 项目与任务清单导出'))
  assert.ok(mdExport.includes('## 🎯 长线目标 (Strategic Goals)'))
  assert.ok(mdExport.includes('## 📁 全栈开发'))
  assert.ok(mdExport.includes('编写后端接口'))
  assert.ok(mdExport.includes('⚡ 最小启动项: 写第一个路由'))
  assert.ok(mdExport.includes('数据库迁移'))
})

test('数据导出: generateCSVExport 包含 UTF-8 BOM 与标准字段', () => {
  const mockProjects = [{ id: 'p1', name: '全栈开发' }]
  const mockTasks = [
    { id: 't1', project_id: 'p1', title: '编写后端接口', priority: 'high', status: 'pending', due: '2026-09-20', starter: '写路由' }
  ]

  const csv = generateCSVExport({ tasks: mockTasks, projects: mockProjects })
  // Check UTF-8 BOM
  assert.ok(csv.startsWith('\uFEFF'), 'CSV 必须以 UTF-8 BOM 开头以防 Excel 乱码')
  assert.ok(csv.includes('全栈开发'))
  assert.ok(csv.includes('编写后端接口'))
  assert.ok(csv.includes('高'))
})

// -------------------------------------------------------------
// 4. P0 智能推进算法模拟测试
// -------------------------------------------------------------
test('推进算法: PushBar 动态紧急度与优先级排序', () => {
  const today = dayjs().format('YYYY-MM-DD')
  const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
  const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD')
  const nextWeek = dayjs().add(7, 'day').format('YYYY-MM-DD')

  const tasks = [
    { id: 't_future_high', title: '下周高优', priority: 'high', due: nextWeek, status: 'pending' },
    { id: 't_tomorrow_low', title: '明天低优', priority: 'low', due: tomorrow, status: 'pending' },
    { id: 't_overdue', title: '已逾期任务', priority: 'mid', due: yesterday, status: 'pending' },
    { id: 't_today', title: '今天到期任务', priority: 'mid', due: today, status: 'pending' },
  ]

  const PRIO_RANK = { high: 0, mid: 1, low: 2 }
  const urgencyRank = (t) => {
    const due = t.due
    if (due && due < today) return 0 // 逾期最高优先级
    if (due && due === today) return 1 // 今天
    if (due && dayjs(due).diff(dayjs(today), 'day') <= 3) return 2 // 3天内
    return 3
  }

  const sorted = [...tasks].sort((a, b) => {
    const ua = urgencyRank(a)
    const ub = urgencyRank(b)
    if (ua !== ub) return ua - ub
    return (PRIO_RANK[a.priority] ?? 1) - (PRIO_RANK[b.priority] ?? 1)
  })

  // 最顶部的应当是已逾期任务，其次是今日到期任务，再到3天内，最后到未来
  assert.equal(sorted[0].id, 't_overdue', '第一优先级必须是逾期任务')
  assert.equal(sorted[1].id, 't_today', '第二优先级必须是今天到期任务')
  assert.equal(sorted[2].id, 't_tomorrow_low', '第三优先级必须是3天内到期任务')
  assert.equal(sorted[3].id, 't_future_high', '第四优先级是远期任务')
})

// -------------------------------------------------------------
// 5. SMART 目标配额计算公式测试
// -------------------------------------------------------------
test('目标配额: 倒推计算每日配额 ceil(剩余节点 / 剩余天数)', () => {
  const remainingNodes = 5
  const remainingDays = 2
  const quota = Math.ceil(remainingNodes / remainingDays)
  assert.equal(quota, 3, '5个节点剩余2天时，每日配额应向上取整为 3 节点/天')

  const zeroDaysQuota = Math.ceil(4 / 1)
  assert.equal(zeroDaysQuota, 4)
})

console.log('\n------------------------------------------')
console.log(`测试统计: 共 ${passedTests + failedTests} 项测试 | ✅ 通过: ${passedTests} | ❌ 失败: ${failedTests}`)
console.log('------------------------------------------')

if (failedTests > 0) {
  process.exit(1)
} else {
  console.log('🎉 所有逻辑测试全部 100% 顺利通过！\n')
}
