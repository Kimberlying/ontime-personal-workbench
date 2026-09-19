import { defineStore } from 'pinia'
import dayjs from 'dayjs'

const STORAGE_GEMINI_KEY = 'ontime_master_gemini_key'
const STORAGE_DAILY_USAGE = 'ontime_gemini_daily_usage'

export const useGeminiStore = defineStore('gemini', {
  state: () => ({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem(STORAGE_GEMINI_KEY) || '',
    model: 'gemini-2.0-flash', // Gemini 2.0 Flash (Fast & Free tier eligible)
    dailyAllowance: Infinity,
    todayUsage: 0,
    lastUsageDate: dayjs().format('YYYY-MM-DD'),
    isTestingKey: false,
    testResult: null, // { success: boolean, message: string }
  }),

  getters: {
    hasMasterKey: (state) => Boolean(state.apiKey && state.apiKey.trim().length > 10),
    remainingDailyCalls: () => Infinity,
    canCallGemini: () => true,
  },

  actions: {
    initUsage() {
      const today = dayjs().format('YYYY-MM-DD')
      const saved = localStorage.getItem(STORAGE_DAILY_USAGE)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (parsed.date === today) {
            this.todayUsage = parsed.count || 0
            this.lastUsageDate = today
          } else {
            this.todayUsage = 0
            this.lastUsageDate = today
            this.saveUsage()
          }
        } catch (e) {
          this.todayUsage = 0
        }
      }
    },

    saveApiKey(newKey) {
      this.apiKey = newKey.trim()
      localStorage.setItem(STORAGE_GEMINI_KEY, this.apiKey)
      this.testResult = null
    },

    saveUsage() {
      const payload = {
        date: this.lastUsageDate,
        count: this.todayUsage,
      }
      localStorage.setItem(STORAGE_DAILY_USAGE, JSON.stringify(payload))
    },

    incrementUsage() {
      const today = dayjs().format('YYYY-MM-DD')
      if (this.lastUsageDate !== today) {
        this.todayUsage = 0
        this.lastUsageDate = today
      }
      this.todayUsage++
      this.saveUsage()
    },

    async testConnection(testKey = null) {
      const keyToTest = (testKey || this.apiKey || '').trim()
      if (!keyToTest) {
        this.testResult = { success: false, message: '请输入 Google Gemini API Key (以 AIza 开头)' }
        return this.testResult
      }

      this.isTestingKey = true
      this.testResult = null

      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${keyToTest}`
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: 'Hello, please reply with "Gemini API Connected Successfully!"' }]
            }]
          }),
        })

        const data = await response.json()
        if (response.ok && data.candidates && data.candidates.length > 0) {
          this.testResult = {
            success: true,
            message: '🎉 连接成功！Google Gemini API 已顺利就绪，智能排期与任务拆解已全面解锁！',
          }
          this.saveApiKey(keyToTest)
        } else {
          const errMsg = data.error?.message || 'API Key 校验失败，请检查密钥是否有效或网络畅通。'
          this.testResult = { success: false, message: `❌ 校验未通过: ${errMsg}` }
        }
      } catch (err) {
        this.testResult = {
          success: false,
          message: `⚠️ 连接异常 (${err.message})。若在特定网络环境下，建议检查网络可达性。`,
        }
      } finally {
        this.isTestingKey = false
      }

      return this.testResult
    },
  },
})
