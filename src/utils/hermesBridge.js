import dayjs from 'dayjs'
import { generateSmartBreakdown, calculateBackwardSchedule, detectDomainKey } from './taskScheduler'

/**
 * Hermes Agent MCP (Model Context Protocol) Tool Manifest
 * Defines the tools that Hermes Agent exposes to interact with the OnTime Dashboard.
 */
export const HERMES_MCP_TOOLS = [
  {
    name: 'ontime_create_project',
    description: 'Create a new goal or project in OnTime with intelligent backward scheduling, stages, and actionable subtasks.',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'The title or goal of the project (e.g., "AWS Solutions Architect SAA-C03 Prep" or "Landscape Master Plan").',
        },
        deadline: {
          type: 'string',
          description: 'Target completion deadline in YYYY-MM-DD format.',
        },
        domain: {
          type: 'string',
          enum: ['cert_cloud_ai', 'cert_lang', 'cert_general', 'design', 'dev', 'media', 'research', 'general'],
          description: 'Optional domain key for stage templates. If omitted, it will be auto-detected.',
        },
        enable_adhd_micro_steps: {
          type: 'boolean',
          description: 'Whether to automatically generate 5-minute ADHD zero-friction starter tasks.',
        },
      },
      required: ['title', 'deadline'],
    },
  },
  {
    name: 'ontime_get_today_tasks',
    description: 'Fetch all pending and completed tasks assigned for today, including linked projects and next action steps.',
    parameters: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['all', 'pending', 'completed'],
          description: 'Filter tasks by completion status.',
        },
      },
    },
  },
  {
    name: 'ontime_toggle_task',
    description: 'Mark a task as completed or toggle its status. Automatically advances the linked project progress and milestones.',
    parameters: {
      type: 'object',
      properties: {
        task_id: {
          type: 'string',
          description: 'ID of the task to mark completed/pending.',
        },
        task_title: {
          type: 'string',
          description: 'Optional fallback search query for task title if ID is not directly known.',
        },
      },
    },
  },
  {
    name: 'ontime_get_project_progress',
    description: 'Get real-time milestone progress percentage, active stage, and subtasks breakdown for a project.',
    parameters: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'ID of the project.',
        },
      },
    },
  },
  {
    name: 'ontime_adhd_micro_start',
    description: 'Generate or trigger a 5-minute ADHD friction-free micro-starter sequence for difficult tasks or executive dysfunction.',
    parameters: {
      type: 'object',
      properties: {
        task_title: {
          type: 'string',
          description: 'Task or project name to create a 5-minute micro starter for.',
        },
      },
      required: ['task_title'],
    },
  },
  {
    name: 'ontime_get_milestones_summary',
    description: 'Get current milestone achievements, unlocked badge counts, streak days, and celebration doggie status.',
    parameters: {
      type: 'object',
      properties: {},
    },
  },
]

/**
 * Ready-to-use Hermes Agent Configuration Snippets
 */
export function getHermesConfigYaml(apiKey = 'ontime_live_sk_hermes_demo_8888', gatewayPort = 8644) {
  return `# ==============================================================================
# Hermes Agent Configuration (~/.hermes/config.yaml)
# Integrated with 「如期 (OnTime)」 Smart Backward Scheduling Dashboard
# ==============================================================================

agent:
  name: "Hermes Assistant"
  system_prompt: |
    You are Hermes, a persistent autonomous assistant connected to the user's
    「如期 (OnTime)」Backward Scheduling Dashboard.
    Whenever the user mentions deadlines, tasks, studying, projects, or feeling
    stuck, actively call ontime_* tools to schedule, track, or trigger ADHD 5-minute
    micro starters. Always prioritize realistic cadence and celebrate on-time delivery!

# Model Context Protocol (MCP) Server Setup
mcp_servers:
  ontime_dashboard:
    command: "npx"
    args:
      - "-y"
      - "@ontime/mcp-server"
      - "--endpoint=http://localhost:5173/api/hermes/mcp"
    env:
      ONTIME_API_KEY: "${apiKey}"
      ONTIME_DASHBOARD_URL: "http://localhost:5173"

# Messaging Gateway Adapters (Manage projects from anywhere via chat!)
gateways:
  telegram:
    enabled: true
    bot_token: "\${TELEGRAM_BOT_TOKEN}"
    allowed_chat_ids: ["\${YOUR_TELEGRAM_CHAT_ID}"]
  
  whatsapp:
    enabled: false
    phone_number: "+86..."
    
  discord:
    enabled: true
    bot_token: "\${DISCORD_BOT_TOKEN}"

# Webhook Adapter for Inbound & Outbound Sync
webhooks:
  enabled: true
  port: ${gatewayPort}
  secret: "hermes_ontime_secret_key"
  endpoints:
    - route: "/ontime/events"
      actions: ["project_created", "milestone_unlocked", "daily_morning_briefing"]
`
}

/**
 * Execute natural language commands simulated from Hermes Bot via Telegram/Discord/Voice
 */
export async function executeHermesCommand(userMessage, { projectStore, taskStore, milestoneStore, isEnglish = false }) {
  const query = userMessage.trim()
  const lower = query.toLowerCase()

  // 1. Create Project Intent (e.g. "创建AWS备考项目，9月20号截止" / "Create project AWS until 2026-09-20")
  if (lower.includes('创建') || lower.includes('新建') || lower.includes('添加项目') || lower.includes('create') || lower.includes('new project') || lower.includes('add goal')) {
    let title = query.replace(/(创建|新建|添加项目|添加目标|帮我做|帮我规划|create project|add goal|new project|plan for)/gi, '').trim()
    
    // Extract deadline if present (e.g. "9月20号", "2026-09-20", "5天后")
    let deadline = dayjs().add(14, 'day').format('YYYY-MM-DD')
    
    const dateMatch = query.match(/(\d{4}[-/年]\d{1,2}[-/月]\d{1,2}[日号]?|\d{1,2}月\d{1,2}[日号]?)/)
    if (dateMatch) {
      let rawDate = dateMatch[0].replace('年', '-').replace('月', '-').replace(/[日号]/, '')
      if (!rawDate.includes('-') && rawDate.length === 5) {
        rawDate = `${dayjs().year()}-${rawDate}`
      }
      const parsed = dayjs(rawDate)
      if (parsed.isValid()) {
        deadline = parsed.format('YYYY-MM-DD')
      }
      title = title.replace(dateMatch[0], '').replace(/(截止|前完成|之前|due|deadline|by)/gi, '').trim()
    } else if (lower.includes('天后') || lower.includes('days')) {
      const daysMatch = query.match(/(\d+)\s*(天后|days)/)
      if (daysMatch) {
        const days = parseInt(daysMatch[1], 10)
        deadline = dayjs().add(days, 'day').format('YYYY-MM-DD')
        title = title.replace(daysMatch[0], '').trim()
      }
    }

    if (!title) title = isEnglish ? 'New Hermes Autonomous Project' : 'Hermes 智能规划项目'

    const domainKey = detectDomainKey(title)
    const breakdown = generateSmartBreakdown(title, domainKey, isEnglish)
    const scheduledStages = calculateBackwardSchedule({
      targetTitle: title,
      deadline,
      stages: breakdown,
    })

    const newProjectRes = await projectStore.createProject({
      name: title,
      deadline,
      type: dayjs(deadline).diff(dayjs(), 'day') <= 14 ? 'short' : 'long',
      progress: 0,
      next_step: breakdown[0]?.subtasks[0]?.title || breakdown[0]?.name || (isEnglish ? 'Kickoff' : '开始推进'),
    })

    const createdProject = newProjectRes.project || newProjectRes

    let totalSubtasks = 0
    for (const st of scheduledStages) {
      if (st.subtasks && st.subtasks.length > 0) {
        for (const sub of st.subtasks) {
          await taskStore.createTask({
            project_id: createdProject.id,
            title: `[${st.stageName}] ${sub.title}`,
            assigned_date: st.startDate,
            status: 'pending',
            attachments: [],
          })
          totalSubtasks++
        }
      }
    }

    // Refresh badges
    milestoneStore.checkStatsAndBadges(projectStore.projects, taskStore.tasks)

    return {
      success: true,
      action: 'project_created',
      responseMessage: isEnglish
        ? `🤖 **Hermes Agent (via Gateway)**: Created project **"${title}"** successfully!\n\n📅 **Deadline**: ${deadline} (${dayjs(deadline).diff(dayjs(), 'day')} days remaining)\n📌 **Stages**: ${scheduledStages.length} phases\n📋 **Actionable Subtasks**: ${totalSubtasks} items generated and assigned across your calendar.\n\n👉 Your OnTime Dashboard has been updated in real-time!`
        : `🤖 **Hermes Agent（消息网关协同）**：已为您在「如期」创建项目 **“${title}”**！\n\n📅 **交付截止日**：${deadline}（剩余 ${dayjs(deadline).diff(dayjs(), 'day')} 天）\n📌 **阶段规划**：共拆解 ${scheduledStages.length} 大核心推进阶段\n📋 **落地子任务**：已自动生成 ${totalSubtasks} 项具体行动点并完成每日日程倒排！\n\n✨ 您的「如期」工作台看板已实时同步！`,
      data: { project: createdProject, totalSubtasks },
    }
  }

  // 2. Query Today's Tasks Intent (e.g. "今天有什么任务" / "今日待办" / "today tasks")
  if (lower.includes('今天') || lower.includes('待办') || lower.includes('today') || lower.includes('tasks') || lower.includes('清单')) {
    const todayStr = dayjs().format('YYYY-MM-DD')
    const pending = taskStore.tasks.filter(t => t.assigned_date === todayStr && t.status === 'pending')
    const completed = taskStore.tasks.filter(t => t.assigned_date === todayStr && t.status === 'completed')

    if (pending.length === 0 && completed.length === 0) {
      return {
        success: true,
        action: 'get_today_tasks',
        responseMessage: isEnglish
          ? `🤖 **Hermes Agent**: You have no tasks scheduled for today! Enjoy your free flow time or ask me to schedule a new project!`
          : `🤖 **Hermes Agent**：今天暂无排定待办任务！您可以尽情享受专注时间，或随时让我帮您规划新目标！🌿`,
        data: { pending: [], completed: [] },
      }
    }

    const taskListText = pending.map((t, idx) => `${idx + 1}. ⏳ **${t.title}**`).join('\n')
    const completedText = completed.length > 0 ? `\n✅ 已完成 ${completed.length} 项` : ''

    return {
      success: true,
      action: 'get_today_tasks',
      responseMessage: isEnglish
        ? `🤖 **Hermes Agent Daily Briefing**:\n\n📅 **Today's Pending Tasks (${pending.length})**:\n${taskListText}${completedText}\n\n💡 *Tip: Ready to start? Tell me "Mark task 1 as done" or "Start 5-min timer"!*`
        : `🤖 **Hermes Agent 每日晨报**：\n\n📅 **今日待办清单 (${pending.length} 项进行中)**：\n${taskListText}${completedText}\n\n💡 *提示：您可以随时在 Telegram/微信发送“把第1项标记完成”或“开启5分钟启动”！*`,
      data: { pending, completed },
    }
  }

  // 3. Complete Task Intent (e.g. "完成任务" / "做完了" / "把第一个打勾" / "complete task")
  if (lower.includes('完成') || lower.includes('搞定') || lower.includes('打勾') || lower.includes('做完了') || lower.includes('complete') || lower.includes('done') || lower.includes('check')) {
    const todayStr = dayjs().format('YYYY-MM-DD')
    const pending = taskStore.tasks.filter(t => t.status === 'pending')
    
    if (pending.length > 0) {
      const targetTask = pending[0]
      await taskStore.toggleTaskStatus(targetTask.id)
      milestoneStore.checkStatsAndBadges(projectStore.projects, taskStore.tasks)

      return {
        success: true,
        action: 'task_completed',
        responseMessage: isEnglish
          ? `🎉 **Hermes Agent**: Great job! Marked **"${targetTask.title}"** as completed!\n\n📈 Linked project progress updated in real-time on your dashboard. Doggie cheers for your cadence! 🐕✨`
          : `🎉 **Hermes Agent**：太棒了！已将 **“${targetTask.title}”** 标记为已完成！\n\n📈 关联项目的里程碑进度已同步向前推进，小狗在看板为您欢呼撒花！🐕✨`,
        data: { completedTask: targetTask },
      }
    }
  }

  // 4. ADHD 5-Minute Starter Intent (e.g. "难启动" / "拖延" / "5分钟" / "adhd" / "stuck")
  if (lower.includes('拖延') || lower.includes('启动') || lower.includes('5分') || lower.includes('难') || lower.includes('adhd') || lower.includes('stuck') || lower.includes('starter')) {
    return {
      success: true,
      action: 'adhd_starter',
      responseMessage: isEnglish
        ? `⚡ **Hermes ADHD 5-Min Zero-Friction Starter**:\n\n1. ☕ Take a deep breath.\n2. 📄 Only open the file and look at it for **5 minutes** without pressure.\n3. ⏱️ Once 5 minutes pass, you have total permission to stop or keep riding the momentum!\n\nShall I start your 5-minute countdown on the dashboard?`
        : `⚡ **Hermes 专属 ADHD 5分钟零阻力微启动**：\n\n1. ☕ 深呼吸，不要想整个大项目的复杂工期；\n2. 📄 只需要【打开文件/书本】并看 5 分钟，绝不强制继续；\n3. ⏱️ 5 分钟倒计时结束后，无论去留都是巨大胜利！\n\n是否为您在工作台立即激活 5 分钟微启动心流计时器？`,
    }
  }

  // 5. Default General Hermes Help Response
  return {
    success: true,
    action: 'general_help',
    responseMessage: isEnglish
      ? `🤖 **Hermes Agent Connected (OnTime Dashboard)**\n\nI can execute your commands across Telegram, WhatsApp, Discord, or MCP:\n• 📌 *"Plan AWS Cert prep project due Oct 15"*\n• 📋 *"What are my tasks for today?"*\n• ✅ *"Mark first task as completed"*\n• ⚡ *"I am feeling stuck, give me a 5-min starter"*`
      : `🤖 **Hermes Agent 智能助手已连接「如期」工作台**\n\n您可以通过 Telegram、微信、Discord 或 MCP 随时发号施令：\n• 📌 *“帮我规划一个 10月15号 截止的 AWS 架构师备考项目”*\n• 📋 *“查看我今天有哪些待办任务”*\n• ✅ *“把今天第 1 项子任务打勾完成”*\n• ⚡ *“有点拖延，帮我做 5 分钟微启动拆解”*`,
  }
}
