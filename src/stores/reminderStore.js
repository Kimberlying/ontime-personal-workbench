import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import {
  downloadCalendarICS,
  sendTelegramNotification,
  sendDiscordNotification,
  sendFeishuNotification,
  sendEmailDigestNotification
} from '../utils/webhookIntegrations'

const STORAGE_KEY = 'orderly_reminder_settings'
const DISMISSED_KEY = 'orderly_dismissed_reminders'

export const useReminderStore = defineStore('reminder', {
  state: () => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    return {
      enabled: saved.enabled ?? true,
      // 短期项目提醒频率: 'daily' (每天) | 'every_2_days' (每隔1-2天) | 'off' (关闭)
      shortTermFreq: saved.shortTermFreq || 'daily',
      shortTermTime: saved.shortTermTime || '09:00',
      
      // 长期项目提醒频率: 'weekly_mon' (每周一) | 'weekly_fri' (每周五) | 'weekly' (每周一次) | 'off' (关闭)
      longTermFreq: saved.longTermFreq || 'weekly_mon',
      longTermTime: saved.longTermTime || '09:00',

      // 温和陪伴语气 (不强推): true
      gentleMode: saved.gentleMode ?? true,
      
      // 桌面系统通知开关
      browserNotification: saved.browserNotification || false,
      notificationPermission: typeof Notification !== 'undefined' ? Notification.permission : 'default',

      // 外部渠道配置
      emailAddress: saved.emailAddress || '',
      emailEnabled: saved.emailEnabled || false,

      tgBotToken: saved.tgBotToken || '',
      tgChatId: saved.tgChatId || '',
      tgEnabled: saved.tgEnabled || false,

      discordWebhook: saved.discordWebhook || '',
      discordEnabled: saved.discordEnabled || false,

      feishuWebhook: saved.feishuWebhook || '',
      feishuEnabled: saved.feishuEnabled || false,

      // 今日已暂时关闭/稍后提醒的项目ID列表
      dismissedToday: JSON.parse(localStorage.getItem(DISMISSED_KEY) || '[]'),
      dismissDate: localStorage.getItem('orderly_dismiss_date') || '',
      
      showSettingsModal: false,
    }
  },

  getters: {
    isShortTermEnabled: (state) => state.enabled && state.shortTermFreq !== 'off',
    isLongTermEnabled: (state) => state.enabled && state.longTermFreq !== 'off',
  },

  actions: {
    saveSettings() {
      const data = {
        enabled: this.enabled,
        shortTermFreq: this.shortTermFreq,
        shortTermTime: this.shortTermTime,
        longTermFreq: this.longTermFreq,
        longTermTime: this.longTermTime,
        gentleMode: this.gentleMode,
        browserNotification: this.browserNotification,
        emailAddress: this.emailAddress,
        emailEnabled: this.emailEnabled,
        tgBotToken: this.tgBotToken,
        tgChatId: this.tgChatId,
        tgEnabled: this.tgEnabled,
        discordWebhook: this.discordWebhook,
        discordEnabled: this.discordEnabled,
        feishuWebhook: this.feishuWebhook,
        feishuEnabled: this.feishuEnabled,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    },

    setSettings(newSettings) {
      Object.assign(this, newSettings)
      this.saveSettings()
    },

    async requestNotificationPermission() {
      if (typeof Notification === 'undefined') {
        alert('当前浏览器不支持桌面通知功能')
        return false
      }

      const perm = await Notification.requestPermission()
      this.notificationPermission = perm
      if (perm === 'granted') {
        this.browserNotification = true
        this.saveSettings()
        this.sendNotification(
          '🌱 有序工作台 - 温和提醒已开启',
          '系统将在设定的时间为您推送今日待办与项目回顾，陪伴您的每一步成长。'
        )
        return true
      } else {
        this.browserNotification = false
        this.saveSettings()
        return false
      }
    },

    sendNotification(title, body) {
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted' && this.browserNotification) {
        try {
          new Notification(title, {
            body,
            icon: '/favicon.svg',
            badge: '/favicon.svg',
          })
        } catch (e) {
          console.error('Failed to trigger notification:', e)
        }
      }
    },

    // 导出日历
    exportCalendar(projects = [], tasks = []) {
      downloadCalendarICS(projects, tasks)
    },

    // 测试 Telegram 推送
    async testTelegramMessage(customMsg = null) {
      const msg = customMsg || `🌱 <b>有序工作台 - Telegram 连通测试成功！</b>\n\n您已成功绑定 Telegram 机器人，后续系统将在设定时间向您推送每日待办清单与短期/长期工期提醒。\n\n<i>时间：${dayjs().format('YYYY-MM-DD HH:mm:ss')}</i>`
      return await sendTelegramNotification({
        botToken: this.tgBotToken,
        chatId: this.tgChatId,
        message: msg,
      })
    },

    // 测试 Discord 推送
    async testDiscordMessage() {
      return await sendDiscordNotification({
        webhookUrl: this.discordWebhook,
        title: '🌱 有序工作台 - Discord 连通测试成功！',
        description: '您的 Discord 频道已成功接入有序工作台。系统将按设定的温和节奏推送每日清单与项目里程碑。',
        fields: [
          { name: '📅 测试时间', value: dayjs().format('YYYY-MM-DD HH:mm:ss'), inline: true },
          { name: '⚡ 状态', value: '连通正常 ✓', inline: true },
        ],
      })
    },

    // 测试飞书推送
    async testFeishuMessage() {
      return await sendFeishuNotification({
        webhookUrl: this.feishuWebhook,
        title: '🌱 有序工作台 - 飞书机器人连通测试成功',
        text: `**连通状态**：正常 ✅\n**推送时间**：${dayjs().format('YYYY-MM-DD HH:mm:ss')}\n\n您已成功在飞书群接入有序工作台。每日待办与项目倒排节奏将按时送达！`,
      })
    },

    // 测试邮件发送
    async testEmailDigest(email) {
      const targetEmail = email || this.emailAddress
      return await sendEmailDigestNotification({
        email: targetEmail,
        subject: '🌱 有序工作台 - 今日待办与晨间进度简报',
      })
    },

    // 检查今天已忽略的提醒列表 (如果是新的一天则重置)
    checkDismissDate() {
      const today = dayjs().format('YYYY-MM-DD')
      if (this.dismissDate !== today) {
        this.dismissedToday = []
        this.dismissDate = today
        localStorage.setItem(DISMISSED_KEY, JSON.stringify([]))
        localStorage.setItem('orderly_dismiss_date', today)
      }
    },

    dismissForToday(projectId) {
      this.checkDismissDate()
      if (!this.dismissedToday.includes(projectId)) {
        this.dismissedToday.push(projectId)
        localStorage.setItem(DISMISSED_KEY, JSON.stringify(this.dismissedToday))
      }
    },

    /**
     * 智能提取「当前最需要温和关怀与回顾」的项目
     */
    getGentleProjectReminder(projects = []) {
      if (!this.enabled) return null
      this.checkDismissDate()

      const activeProjects = projects.filter(p => !p.is_archived && !this.dismissedToday.includes(p.id))
      if (activeProjects.length === 0) return null

      const today = dayjs().startOf('day')
      const dayOfWeek = today.day() // 0 is Sunday, 1 is Monday, 5 is Friday

      // 1. 检查短期项目 (Short-term)
      if (this.isShortTermEnabled) {
        const shortProjects = activeProjects.filter(p => p.type === 'short')
        for (const proj of shortProjects) {
          const deadline = dayjs(proj.deadline).startOf('day')
          const daysLeft = deadline.diff(today, 'day')
          
          return {
            type: 'short',
            project: proj,
            daysLeft,
            title: proj.name,
            progress: proj.progress || 0,
            nextStep: proj.next_step,
            reason: daysLeft <= 3 
              ? '临近交付节点，保持从容节奏' 
              : '短期目标推进中，今天来看看最新进展吧',
            reasonEn: daysLeft <= 3 
              ? 'Deadline approaching soon. Steady pace wins the race!' 
              : 'Short-term goal in progress. Ready to log a small update?',
          }
        }
      }

      // 2. 检查长期项目 (Long-term) - 每周关怀
      if (this.isLongTermEnabled) {
        const isLongReminderDay = 
          this.longTermFreq === 'weekly_mon' ? dayOfWeek === 1 :
          this.longTermFreq === 'weekly_fri' ? dayOfWeek === 5 : true

        if (isLongReminderDay) {
          const longProjects = activeProjects.filter(p => p.type === 'long')
          if (longProjects.length > 0) {
            const proj = longProjects[0]
            return {
              type: 'long',
              project: proj,
              title: proj.name,
              progress: proj.progress || 0,
              nextStep: proj.next_step,
              reason: '🌱 本周里程碑回顾：长期项目更需要温和的恒心，今天需要微调方向吗？',
              reasonEn: '🌱 Weekly Rhythm Check: Long-term goals thrive with gentle consistency. Care to review progress?',
            }
          }
        }
      }

      return null
    }
  },
})
