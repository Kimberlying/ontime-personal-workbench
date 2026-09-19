import dayjs from 'dayjs'

/**
 * Generate standard RFC 5545 iCalendar (.ics) format string
 * Compatible with Apple Calendar, Google Calendar, Outlook, etc.
 */
export function generateICalendar(projects = [], tasks = []) {
  const nowStr = dayjs().format('YYYYMMDDTHHmmss') + 'Z'
  
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Orderly Workbench//Smart Scheduler//CN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:有序工作台 (Orderly Workbench)',
    'X-WR-TIMEZONE:Asia/Shanghai',
  ]

  // Add tasks as calendar events
  tasks.forEach((task, idx) => {
    const taskDate = task.assigned_date ? dayjs(task.assigned_date) : dayjs()
    const startDateStr = taskDate.format('YYYYMMDD')
    const endDateStr = taskDate.add(1, 'day').format('YYYYMMDD')
    const proj = projects.find(p => p.id === task.project_id)
    const projName = proj ? proj.name : '日常待办'

    icsContent.push(
      'BEGIN:VEVENT',
      `UID:task-${task.id || idx}-${Date.now()}@orderly.app`,
      `DTSTAMP:${nowStr}`,
      `DTSTART;VALUE=DATE:${startDateStr}`,
      `DTEND;VALUE=DATE:${endDateStr}`,
      `SUMMARY:[有序待办] ${task.title}`,
      `DESCRIPTION:所属项目: ${projName}\\n状态: ${task.status === 'completed' ? '已完成' : '待推进'}\\n由「有序工作台」智能倒排生成`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT0H', // 09:00 AM on event day
      'ACTION:DISPLAY',
      `DESCRIPTION:今日有序待办: ${task.title}`,
      'END:VALARM',
      'END:VEVENT'
    )
  })

  // Add project deadlines
  projects.forEach((proj, idx) => {
    if (proj.deadline) {
      const dDate = dayjs(proj.deadline)
      const dStart = dDate.format('YYYYMMDD')
      const dEnd = dDate.add(1, 'day').format('YYYYMMDD')

      icsContent.push(
        'BEGIN:VEVENT',
        `UID:proj-${proj.id || idx}-${Date.now()}@orderly.app`,
        `DTSTAMP:${nowStr}`,
        `DTSTART;VALUE=DATE:${dStart}`,
        `DTEND;VALUE=DATE:${dEnd}`,
        `SUMMARY:🎯 [项目截止] ${proj.name}`,
        `DESCRIPTION:项目类型: ${proj.type === 'short' ? '短期项目' : '长期项目'}\\n当前进度: ${proj.progress || 0}%\\n下一步: ${proj.next_step || '推进中'}`,
        'STATUS:CONFIRMED',
        'BEGIN:VALARM',
        'TRIGGER:-P1D', // 1 day before deadline
        'ACTION:DISPLAY',
        `DESCRIPTION:项目截止提醒: ${proj.name} 即将到期`,
        'END:VALARM',
        'END:VEVENT'
      )
    }
  })

  icsContent.push('END:VCALENDAR')
  return icsContent.join('\r\n')
}

/**
 * Trigger download of .ics calendar file or open in system
 */
export function downloadCalendarICS(projects, tasks) {
  const icsText = generateICalendar(projects, tasks)
  const blob = new Blob([icsText], { type: 'text/calendar;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `有序工作台日程_${dayjs().format('YYYY-MM-DD')}.ics`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Send notification to Telegram Bot
 */
export async function sendTelegramNotification({ botToken, chatId, message }) {
  if (!botToken || !chatId) {
    throw new Error('请提供 Telegram Bot Token 和 Chat ID')
  }

  const url = `https://api.telegram.org/bot${botToken.trim()}/sendMessage`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId.trim(),
      text: message,
      parse_mode: 'HTML',
    }),
  })

  const result = await response.json()
  if (!result.ok) {
    throw new Error(result.description || 'Telegram 消息发送失败，请检查 Token 和 Chat ID')
  }
  return result
}

/**
 * Send notification to Discord Webhook
 */
export async function sendDiscordNotification({ webhookUrl, title, description, fields = [] }) {
  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    throw new Error('请提供有效的 Discord Webhook URL')
  }

  const payload = {
    username: '有序工作台 (Orderly Workbench)',
    avatar_url: 'https://cdn-icons-png.flaticon.com/512/9068/9068678.png',
    embeds: [
      {
        title: title || '🌱 今日有序工作台进度关怀',
        description: description || '保持清晰节奏，每一次微小推进都在向目标靠近！',
        color: 0x4f46e5, // Indigo brand color
        fields: fields,
        footer: {
          text: `有序工作台 · ${dayjs().format('YYYY-MM-DD HH:mm')}`,
        },
      },
    ],
  }

  const response = await fetch(webhookUrl.trim(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Discord Webhook 请求失败 (HTTP ${response.status})`)
  }
  return true
}

/**
 * Send notification to Feishu / Lark Webhook
 */
export async function sendFeishuNotification({ webhookUrl, title, text, elements = [] }) {
  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    throw new Error('请提供有效的飞书 Webhook URL')
  }

  const payload = {
    msg_type: 'interactive',
    card: {
      header: {
        title: {
          tag: 'plain_text',
          content: title || '🌱 有序工作台 - 今日进度与待办推送',
        },
        template: 'indigo',
      },
      elements: [
        {
          tag: 'div',
          text: {
            tag: 'lark_md',
            content: text || '从容倒排，目标清晰落地。',
          },
        },
        ...elements,
        {
          tag: 'hr',
        },
        {
          tag: 'note',
          elements: [
            {
              tag: 'plain_text',
              content: `推送时间: ${dayjs().format('YYYY-MM-DD HH:mm')} · 有序工作台`,
            },
          ],
        },
      ],
    },
  }

  const response = await fetch(webhookUrl.trim(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const resData = await response.json().catch(() => ({}))
  if (resData.code && resData.code !== 0) {
    throw new Error(resData.msg || '飞书消息发送失败')
  }
  return true
}

/**
 * Compose simulated or Resend email notification
 */
export async function sendEmailDigestNotification({ email, subject, contentHtml }) {
  if (!email) {
    throw new Error('请提供有效的接收邮箱')
  }
  // In demo mock mode, simulate immediate success
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, email })
    }, 600)
  })
}
