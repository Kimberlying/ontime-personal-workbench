<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
    <div class="bg-white rounded-3xl shadow-modal max-w-xl w-full overflow-hidden border border-slate-100 animate-pop-in flex flex-col max-h-[85vh]">
      
      <!-- Modal Header -->
      <div class="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold shadow-xs">
            ⏰
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-800">{{ $t('reminders.modalTitle') }}</h3>
            <p class="text-xs text-slate-500 mt-0.5">{{ $t('reminders.modalSubtitle') }}</p>
          </div>
        </div>
        <button @click="close" class="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Navigation Tabs (4 Channels) -->
      <div class="px-6 pt-3 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-xs font-semibold select-none bg-white">
        <button
          @click="activeTab = 'cadence'"
          class="pb-3 px-2 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          :class="activeTab === 'cadence' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'"
        >
          <span>⏰</span>
          <span>{{ $t('reminders.tabCadence') }}</span>
        </button>
        <button
          @click="activeTab = 'calendar'"
          class="pb-3 px-2 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          :class="activeTab === 'calendar' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'"
        >
          <span>📅</span>
          <span>{{ $t('reminders.tabCalendar') }}</span>
        </button>
        <button
          @click="activeTab = 'email'"
          class="pb-3 px-2 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          :class="activeTab === 'email' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'"
        >
          <span>📧</span>
          <span>{{ $t('reminders.tabEmail') }}</span>
        </button>
        <button
          @click="activeTab = 'bots'"
          class="pb-3 px-2 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          :class="activeTab === 'bots' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'"
        >
          <span>🤖</span>
          <span>{{ $t('reminders.tabBots') }}</span>
        </button>
      </div>

      <!-- Tab Content Area -->
      <div class="p-6 space-y-5 text-xs overflow-y-auto flex-1">
        
        <!-- ========================================== -->
        <!-- TAB 1: CADENCE & RHYTHM -->
        <!-- ========================================== -->
        <div v-if="activeTab === 'cadence'" class="space-y-5 animate-fade-in">
          <!-- Gentle Philosophy Banner -->
          <div class="p-3.5 bg-emerald-50/80 border border-emerald-200/70 rounded-2xl flex items-start gap-2.5 text-emerald-800">
            <span class="text-base shrink-0">🌱</span>
            <div class="leading-relaxed">
              <p class="font-bold text-[12px]">{{ $t('reminders.gentleTitle') }}</p>
              <p class="text-[11px] text-emerald-700/90 mt-0.5">{{ $t('reminders.gentleDesc') }}</p>
            </div>
          </div>

          <!-- Short-term Project Reminders -->
          <div class="space-y-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-sm">📚</span>
                <span class="font-bold text-slate-800 text-sm">{{ $t('reminders.shortTermSection') }}</span>
              </div>
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold">
                {{ $t('reminders.shortTermTag') }}
              </span>
            </div>
            <p class="text-slate-500 text-[11px]">
              {{ $t('reminders.shortTermDesc') }}
            </p>

            <div class="grid grid-cols-3 gap-2 pt-1">
              <button
                @click="localShortTermFreq = 'daily'"
                class="py-2 px-3 rounded-xl border text-center font-medium transition-all cursor-pointer"
                :class="localShortTermFreq === 'daily' ? 'bg-indigo-600 border-indigo-600 text-white font-bold shadow-xs' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'"
              >
                {{ $t('reminders.freqDaily') }}
              </button>
              <button
                @click="localShortTermFreq = 'every_2_days'"
                class="py-2 px-3 rounded-xl border text-center font-medium transition-all cursor-pointer"
                :class="localShortTermFreq === 'every_2_days' ? 'bg-indigo-600 border-indigo-600 text-white font-bold shadow-xs' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'"
              >
                {{ $t('reminders.freq2Days') }}
              </button>
              <button
                @click="localShortTermFreq = 'off'"
                class="py-2 px-3 rounded-xl border text-center font-medium transition-all cursor-pointer"
                :class="localShortTermFreq === 'off' ? 'bg-slate-800 border-slate-800 text-white font-bold shadow-xs' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'"
              >
                {{ $t('reminders.freqOff') }}
              </button>
            </div>

            <!-- Time Picker -->
            <div v-if="localShortTermFreq !== 'off'" class="flex items-center justify-between pt-2">
              <span class="text-slate-600 font-medium">{{ $t('reminders.preferredTime') }}:</span>
              <input
                v-model="localShortTermTime"
                type="time"
                class="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 font-mono text-xs outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <!-- Long-term Project Reminders -->
          <div class="space-y-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-sm">📁</span>
                <span class="font-bold text-slate-800 text-sm">{{ $t('reminders.longTermSection') }}</span>
              </div>
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-semibold">
                {{ $t('reminders.longTermTag') }}
              </span>
            </div>
            <p class="text-slate-500 text-[11px]">
              {{ $t('reminders.longTermDesc') }}
            </p>

            <div class="grid grid-cols-3 gap-2 pt-1">
              <button
                @click="localLongTermFreq = 'weekly_mon'"
                class="py-2 px-2.5 rounded-xl border text-center font-medium transition-all cursor-pointer"
                :class="localLongTermFreq === 'weekly_mon' ? 'bg-indigo-600 border-indigo-600 text-white font-bold shadow-xs' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'"
              >
                {{ $t('reminders.freqWeeklyMon') }}
              </button>
              <button
                @click="localLongTermFreq = 'weekly_fri'"
                class="py-2 px-2.5 rounded-xl border text-center font-medium transition-all cursor-pointer"
                :class="localLongTermFreq === 'weekly_fri' ? 'bg-indigo-600 border-indigo-600 text-white font-bold shadow-xs' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'"
              >
                {{ $t('reminders.freqWeeklyFri') }}
              </button>
              <button
                @click="localLongTermFreq = 'off'"
                class="py-2 px-2.5 rounded-xl border text-center font-medium transition-all cursor-pointer"
                :class="localLongTermFreq === 'off' ? 'bg-slate-800 border-slate-800 text-white font-bold shadow-xs' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'"
              >
                {{ $t('reminders.freqOff') }}
              </button>
            </div>

            <!-- Time Picker -->
            <div v-if="localLongTermFreq !== 'off'" class="flex items-center justify-between pt-2">
              <span class="text-slate-600 font-medium">{{ $t('reminders.preferredTime') }}:</span>
              <input
                v-model="localLongTermTime"
                type="time"
                class="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 font-mono text-xs outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <!-- Desktop / Browser Push Notification -->
          <div class="flex items-center justify-between p-3.5 bg-slate-50/70 border border-slate-100 rounded-2xl">
            <div class="space-y-0.5">
              <div class="font-bold text-slate-800">{{ $t('reminders.browserNotificationTitle') }}</div>
              <div class="text-[11px] text-slate-400">{{ $t('reminders.browserNotificationDesc') }}</div>
            </div>
            <button
              @click="handleToggleBrowserNotification"
              class="px-3 py-1.5 rounded-xl font-bold transition-all text-xs cursor-pointer"
              :class="reminderStore.browserNotification ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'"
            >
              {{ reminderStore.browserNotification ? $t('reminders.enabled') : $t('reminders.enable') }}
            </button>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- TAB 2: CALENDAR SYNC (.ics / Apple / Google) -->
        <!-- ========================================== -->
        <div v-if="activeTab === 'calendar'" class="space-y-4 animate-fade-in">
          <div class="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl space-y-2">
            <div class="flex items-center gap-2 text-indigo-900 font-bold text-sm">
              <span>📅</span>
              <span>{{ $t('reminders.calTitle') }}</span>
            </div>
            <p class="text-[11px] text-indigo-700/90 leading-relaxed">
              {{ $t('reminders.calDesc') }}
            </p>
          </div>

          <div class="p-5 bg-slate-50/70 border border-slate-100 rounded-2xl space-y-4 text-center">
            <div class="w-12 h-12 bg-white rounded-2xl shadow-xs border border-slate-200 flex items-center justify-center text-2xl mx-auto">
              🗓️
            </div>
            <div>
              <h4 class="font-bold text-slate-800 text-sm">{{ $t('reminders.calActionTitle') }}</h4>
              <p class="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                {{ $t('reminders.calActionSub') }}
              </p>
            </div>

            <button
              @click="handleExportCalendar"
              class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold rounded-xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer text-xs"
            >
              <span>📥</span>
              <span>{{ $t('reminders.calDownloadBtn') }} (.ics)</span>
            </button>
          </div>

          <div class="grid grid-cols-3 gap-2 text-center text-[11px] text-slate-500 pt-1">
            <div class="p-2.5 bg-white rounded-xl border border-slate-100">
              <span class="font-bold text-slate-700 block mb-0.5">🍎 Apple 日历</span>
              <span>iPhone/Mac 直接打开</span>
            </div>
            <div class="p-2.5 bg-white rounded-xl border border-slate-100">
              <span class="font-bold text-slate-700 block mb-0.5">🌐 Google 日历</span>
              <span>网页端导入日程</span>
            </div>
            <div class="p-2.5 bg-white rounded-xl border border-slate-100">
              <span class="font-bold text-slate-700 block mb-0.5">📫 Outlook 日历</span>
              <span>邮件客户端直接加载</span>
            </div>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- TAB 3: EMAIL DIGEST -->
        <!-- ========================================== -->
        <div v-if="activeTab === 'email'" class="space-y-4 animate-fade-in">
          <div class="p-4 bg-slate-50/70 border border-slate-100 rounded-2xl space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-sm">📧</span>
                <span class="font-bold text-slate-800 text-sm">{{ $t('reminders.emailSectionTitle') }}</span>
              </div>
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
                {{ $t('reminders.freeDigest') }}
              </span>
            </div>
            <p class="text-[11px] text-slate-500 leading-relaxed">
              {{ $t('reminders.emailSectionDesc') }}
            </p>

            <div class="pt-2 space-y-2">
              <label class="block font-semibold text-slate-700 text-xs">
                {{ $t('reminders.emailAddressLabel') }}
              </label>
              <input
                v-model="localEmailAddress"
                type="email"
                placeholder="your-email@company.com"
                class="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-xs text-slate-800"
              />
            </div>

            <div class="pt-2 flex items-center justify-between">
              <button
                @click="handleTestEmail"
                :disabled="isTestingEmail"
                class="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl border border-indigo-200 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>✉️</span>
                <span>{{ isTestingEmail ? $t('auth.processing') : $t('reminders.testSendEmail') }}</span>
              </button>

              <span v-if="emailTestStatus" class="text-emerald-600 font-semibold text-xs animate-fade-in">
                {{ emailTestStatus }}
              </span>
            </div>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- TAB 4: BOTS & WEBHOOKS (TG / Discord / 飞书) -->
        <!-- ========================================== -->
        <div v-if="activeTab === 'bots'" class="space-y-4 animate-fade-in">
          <p class="text-slate-500 text-[11px]">
            {{ $t('reminders.botsIntro') }}
          </p>

          <!-- 1. Telegram Bot Card -->
          <div class="p-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-base">✈️</span>
                <span class="font-bold text-slate-800 text-sm">Telegram 机器人</span>
              </div>
              <span class="text-[10px] text-slate-400">TG Bot API</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <label class="block text-slate-600 font-medium mb-1">Bot Token</label>
                <input
                  v-model="localTgBotToken"
                  type="password"
                  placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                  class="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label class="block text-slate-600 font-medium mb-1">Chat ID</label>
                <input
                  v-model="localTgChatId"
                  type="text"
                  placeholder="987654321"
                  class="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div class="flex items-center justify-between pt-1">
              <button
                @click="handleTestTelegram"
                :disabled="isTestingTg"
                class="px-3.5 py-1.5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 text-[11px]"
              >
                <span>✈️</span>
                <span>{{ isTestingTg ? $t('auth.processing') : $t('reminders.testSendTg') }}</span>
              </button>
              <span v-if="tgTestStatus" :class="tgTestStatus.success ? 'text-emerald-600' : 'text-rose-600'" class="text-[11px] font-semibold">
                {{ tgTestStatus.msg }}
              </span>
            </div>
          </div>

          <!-- 2. Discord Webhook Card -->
          <div class="p-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-base">🎮</span>
                <span class="font-bold text-slate-800 text-sm">Discord Webhook 频道</span>
              </div>
              <span class="text-[10px] text-slate-400">Embed Card</span>
            </div>

            <div>
              <label class="block text-slate-600 font-medium mb-1">Webhook URL</label>
              <input
                v-model="localDiscordWebhook"
                type="text"
                placeholder="https://discord.com/api/webhooks/..."
                class="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500 font-mono text-[11px]"
              />
            </div>

            <div class="flex items-center justify-between pt-1">
              <button
                @click="handleTestDiscord"
                :disabled="isTestingDiscord"
                class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 text-[11px]"
              >
                <span>🎮</span>
                <span>{{ isTestingDiscord ? $t('auth.processing') : $t('reminders.testSendDiscord') }}</span>
              </button>
              <span v-if="discordTestStatus" :class="discordTestStatus.success ? 'text-emerald-600' : 'text-rose-600'" class="text-[11px] font-semibold">
                {{ discordTestStatus.msg }}
              </span>
            </div>
          </div>

          <!-- 3. Feishu / Lark Bot Card -->
          <div class="p-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-base">🕊️</span>
                <span class="font-bold text-slate-800 text-sm">飞书 / Lark 自定义群机器人</span>
              </div>
              <span class="text-[10px] text-slate-400">Interactive Card</span>
            </div>

            <div>
              <label class="block text-slate-600 font-medium mb-1">飞书 Webhook 地址</label>
              <input
                v-model="localFeishuWebhook"
                type="text"
                placeholder="https://open.feishu.cn/open-apis/bot/v2/hook/..."
                class="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500 font-mono text-[11px]"
              />
            </div>

            <div class="flex items-center justify-between pt-1">
              <button
                @click="handleTestFeishu"
                :disabled="isTestingFeishu"
                class="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 text-[11px]"
              >
                <span>🕊️</span>
                <span>{{ isTestingFeishu ? $t('auth.processing') : $t('reminders.testSendFeishu') }}</span>
              </button>
              <span v-if="feishuTestStatus" :class="feishuTestStatus.success ? 'text-emerald-600' : 'text-rose-600'" class="text-[11px] font-semibold">
                {{ feishuTestStatus.msg }}
              </span>
            </div>
          </div>

        </div>

      </div>

      <!-- Modal Footer -->
      <div class="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2">
        <button
          @click="close"
          class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium cursor-pointer"
        >
          {{ $t('scheduler.cancel') }}
        </button>
        <button
          @click="handleSave"
          class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>💾</span>
          <span>{{ $t('projects.saveProgress') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useReminderStore } from '../stores/reminderStore'
import { useProjectStore } from '../stores/projectStore'
import { useTaskStore } from '../stores/taskStore'
import confetti from 'canvas-confetti'

const props = defineProps({
  isOpen: Boolean,
})

const emit = defineEmits(['close'])

const reminderStore = useReminderStore()
const projectStore = useProjectStore()
const taskStore = useTaskStore()

const activeTab = ref('cadence') // 'cadence' | 'calendar' | 'email' | 'bots'

const localShortTermFreq = ref(reminderStore.shortTermFreq)
const localShortTermTime = ref(reminderStore.shortTermTime)
const localLongTermFreq = ref(reminderStore.longTermFreq)
const localLongTermTime = ref(reminderStore.longTermTime)

const localEmailAddress = ref(reminderStore.emailAddress)
const localTgBotToken = ref(reminderStore.tgBotToken)
const localTgChatId = ref(reminderStore.tgChatId)
const localDiscordWebhook = ref(reminderStore.discordWebhook)
const localFeishuWebhook = ref(reminderStore.feishuWebhook)

// Testing status states
const isTestingEmail = ref(false)
const emailTestStatus = ref('')

const isTestingTg = ref(false)
const tgTestStatus = ref(null)

const isTestingDiscord = ref(false)
const discordTestStatus = ref(null)

const isTestingFeishu = ref(false)
const feishuTestStatus = ref(null)

watch(() => props.isOpen, (val) => {
  if (val) {
    localShortTermFreq.value = reminderStore.shortTermFreq
    localShortTermTime.value = reminderStore.shortTermTime
    localLongTermFreq.value = reminderStore.longTermFreq
    localLongTermTime.value = reminderStore.longTermTime
    localEmailAddress.value = reminderStore.emailAddress
    localTgBotToken.value = reminderStore.tgBotToken
    localTgChatId.value = reminderStore.tgChatId
    localDiscordWebhook.value = reminderStore.discordWebhook
    localFeishuWebhook.value = reminderStore.feishuWebhook
    emailTestStatus.value = ''
    tgTestStatus.value = null
    discordTestStatus.value = null
    feishuTestStatus.value = null
  }
})

const close = () => {
  emit('close')
}

const handleToggleBrowserNotification = async () => {
  if (reminderStore.browserNotification) {
    reminderStore.browserNotification = false
    reminderStore.saveSettings()
  } else {
    await reminderStore.requestNotificationPermission()
  }
}

const handleExportCalendar = () => {
  reminderStore.exportCalendar(projectStore.projects, taskStore.tasks)
  confetti({
    particleCount: 40,
    spread: 50,
    origin: { y: 0.6 }
  })
}

const handleTestEmail = async () => {
  if (!localEmailAddress.value) {
    alert('请先输入接收邮箱地址')
    return
  }
  isTestingEmail.value = true
  try {
    await reminderStore.testEmailDigest(localEmailAddress.value)
    emailTestStatus.value = '✓ 简报邮件测试成功已发送！'
  } catch (err) {
    emailTestStatus.value = '❌ 发送失败: ' + err.message
  } finally {
    isTestingEmail.value = false
  }
}

const handleTestTelegram = async () => {
  reminderStore.tgBotToken = localTgBotToken.value
  reminderStore.tgChatId = localTgChatId.value
  isTestingTg.value = true
  tgTestStatus.value = null
  try {
    await reminderStore.testTelegramMessage()
    tgTestStatus.value = { success: true, msg: '✓ TG 消息推送成功！请在 Telegram 查看' }
    confetti({ particleCount: 30, spread: 40 })
  } catch (err) {
    tgTestStatus.value = { success: false, msg: '❌ 失败: ' + err.message }
  } finally {
    isTestingTg.value = false
  }
}

const handleTestDiscord = async () => {
  reminderStore.discordWebhook = localDiscordWebhook.value
  isTestingDiscord.value = true
  discordTestStatus.value = null
  try {
    await reminderStore.testDiscordMessage()
    discordTestStatus.value = { success: true, msg: '✓ Discord 卡片推送成功！请在频道查看' }
    confetti({ particleCount: 30, spread: 40 })
  } catch (err) {
    discordTestStatus.value = { success: false, msg: '❌ 失败: ' + err.message }
  } finally {
    isTestingDiscord.value = false
  }
}

const handleTestFeishu = async () => {
  reminderStore.feishuWebhook = localFeishuWebhook.value
  isTestingFeishu.value = true
  feishuTestStatus.value = null
  try {
    await reminderStore.testFeishuMessage()
    feishuTestStatus.value = { success: true, msg: '✓ 飞书卡片推送成功！请在群聊查看' }
    confetti({ particleCount: 30, spread: 40 })
  } catch (err) {
    feishuTestStatus.value = { success: false, msg: '❌ 失败: ' + err.message }
  } finally {
    isTestingFeishu.value = false
  }
}

const handleSave = () => {
  reminderStore.setSettings({
    shortTermFreq: localShortTermFreq.value,
    shortTermTime: localShortTermTime.value,
    longTermFreq: localLongTermFreq.value,
    longTermTime: localLongTermTime.value,
    emailAddress: localEmailAddress.value,
    tgBotToken: localTgBotToken.value,
    tgChatId: localTgChatId.value,
    discordWebhook: localDiscordWebhook.value,
    feishuWebhook: localFeishuWebhook.value,
  })

  confetti({
    particleCount: 40,
    spread: 50,
    origin: { y: 0.6 }
  })

  close()
}
</script>
