<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
    <div class="bg-white rounded-3xl shadow-[6px_6px_0px_0px_#0d9488] max-w-xl w-full overflow-hidden border-2 border-slate-900 animate-pop-in flex flex-col max-h-[90vh]">
      
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b-2 border-slate-900 flex items-center justify-between bg-slate-50">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 border-2 border-slate-900 text-white flex items-center justify-center text-xl font-bold shadow-hard-sm">
            🤖
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-base font-black text-slate-900">
                Hermes Agent 连接中枢
              </h3>
              <span class="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-slate-900 font-bold">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>已接通 · MCP 就绪</span>
              </span>
            </div>
            <p class="text-xs text-slate-500 font-mono mt-0.5">
              已与本地 Hermes Agent 桥接，支持通过外部指令管理工作台项目
            </p>
          </div>
        </div>

        <button @click="close" class="text-slate-400 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Main Content Area -->
      <div class="p-6 overflow-y-auto space-y-4 flex-1 text-sm font-sans">
        
        <!-- 1. Connection Info Card -->
        <div class="bg-slate-50 p-4 rounded-2xl border-2 border-slate-900 shadow-hard-sm space-y-3 font-mono text-xs">
          <div class="flex items-center justify-between">
            <span class="font-bold text-slate-700 flex items-center gap-1.5 font-sans">
              <span>🔌</span>
              <span>MCP 协议接入端点:</span>
            </span>
            <button
              @click="copyText('http://localhost:8644/mcp')"
              class="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-900 font-black rounded-lg border border-slate-900 shadow-2xs active:translate-x-[1px] active:translate-y-[1px] cursor-pointer text-[11px] flex items-center gap-1"
            >
              <span>{{ copiedItem === 'mcp' ? '✓ 已复制' : '复制端点' }}</span>
            </button>
          </div>
          <div class="px-3 py-2 bg-white rounded-xl border border-slate-300 text-teal-800 font-bold break-all">
            http://localhost:8644/mcp
          </div>

          <div class="flex items-center justify-between pt-1 border-t border-slate-200">
            <span class="font-bold text-slate-700 flex items-center gap-1.5 font-sans">
              <span>🔑</span>
              <span>访问密钥 (Token):</span>
            </span>
            <button
              @click="copyToken('ontime_live_sk_hermes_8888')"
              class="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-900 font-black rounded-lg border border-slate-900 shadow-2xs active:translate-x-[1px] active:translate-y-[1px] cursor-pointer text-[11px] flex items-center gap-1"
            >
              <span>{{ copiedItem === 'token' ? '✓ 已复制' : '复制 Token' }}</span>
            </button>
          </div>
          <div class="px-3 py-1.5 bg-white rounded-xl border border-slate-300 text-slate-800 font-bold flex items-center justify-between">
            <span>ontime_live_sk_hermes_8888</span>
            <span class="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">永久有效</span>
          </div>
        </div>

        <!-- 2. Direct Command Simulation & Verification -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="font-black text-xs text-slate-900 flex items-center gap-1.5">
              <span>💬</span>
              <span>指令联调测试 (实时联动工作台):</span>
            </span>
            <span class="text-[10px] text-slate-500 font-mono">发送指令即可直接查看看板变动</span>
          </div>

          <!-- Quick presets -->
          <div class="flex flex-wrap gap-1.5 text-xs font-mono">
            <button
              v-for="(preset, i) in quickPresets"
              :key="i"
              @click="sendPreset(preset)"
              class="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 rounded-xl border border-slate-300 hover:border-slate-900 transition-all cursor-pointer font-medium text-[11px]"
            >
              {{ preset }}
            </button>
          </div>

          <!-- Console Message Box -->
          <div class="bg-slate-900 rounded-2xl p-3.5 border-2 border-slate-900 shadow-hard-sm min-h-[160px] max-h-[220px] overflow-y-auto space-y-2.5 font-mono text-xs text-white">
            <div
              v-for="(msg, idx) in chatMessages"
              :key="idx"
              class="flex flex-col gap-1"
              :class="msg.role === 'user' ? 'items-end' : 'items-start'"
            >
              <div class="flex items-center gap-1 text-[10px] text-slate-400">
                <span>{{ msg.role === 'user' ? '👤 YOU' : '🤖 HERMES' }}</span>
                <span>{{ msg.time }}</span>
              </div>
              <div
                class="max-w-[90%] px-3 py-2 rounded-xl whitespace-pre-wrap leading-relaxed border text-[11px]"
                :class="msg.role === 'user' 
                  ? 'bg-[#0d9488] text-white border-teal-400 rounded-tr-none' 
                  : 'bg-slate-800 text-slate-100 border-slate-700 rounded-tl-none'"
              >
                {{ msg.text }}
              </div>
            </div>

            <div v-if="isThinking" class="flex items-center gap-2 text-slate-400 text-xs py-1">
              <span class="animate-spin">⚙️</span>
              <span>Hermes 正在调用工作台 MCP 接口...</span>
            </div>
          </div>

          <!-- Input Bar -->
          <div class="flex items-center gap-2">
            <input
              v-model="inputQuery"
              @keyup.enter="handleSendMessage"
              type="text"
              placeholder="输入指令，如：帮我建一个 9月20号 截止的备考项目..."
              class="flex-1 px-3.5 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-sans font-bold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-[#0d9488]"
            />
            <button
              @click="handleSendMessage"
              :disabled="!inputQuery.trim() || isThinking"
              class="px-4 py-2 bg-[#0d9488] hover:bg-[#0f766e] disabled:opacity-50 text-white font-bold rounded-xl border-2 border-slate-900 shadow-hard-sm active:translate-x-[1px] active:translate-y-[1px] cursor-pointer text-xs font-mono"
            >
              发送
            </button>
          </div>
        </div>

      </div>

      <!-- Modal Footer -->
      <div class="p-4 border-t-2 border-slate-900 bg-slate-50 flex items-center justify-between">
        <span class="text-xs font-mono text-slate-500">
          状态：<strong class="text-emerald-700">已就绪并接通</strong>
        </span>
        <button
          @click="close"
          class="px-5 py-2 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 border-2 border-slate-900 rounded-xl shadow-hard-sm active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer font-mono"
        >
          完成
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
import { useProjectStore } from '../stores/projectStore'
import { useTaskStore } from '../stores/taskStore'
import { useMilestoneStore } from '../stores/milestoneStore'
import { executeHermesCommand } from '../utils/hermesBridge'
import confetti from 'canvas-confetti'

defineProps({
  isOpen: Boolean,
})

const emit = defineEmits(['close'])

const projectStore = useProjectStore()
const taskStore = useTaskStore()
const milestoneStore = useMilestoneStore()

const inputQuery = ref('')
const isThinking = ref(false)
const copiedItem = ref('')

const quickPresets = [
  '帮我创建一个 9月20号 截止的备考冲刺项目',
  '查看我今天有哪些待办任务',
  '把今天第 1 项任务打勾完成',
]

const chatMessages = ref([
  {
    role: 'hermes',
    text: '👋 Hermes 已成功接通！在此发送指令，我将直接调用工作台接口为您排定项目或打卡。',
    time: dayjs().format('HH:mm:ss'),
  },
])

const close = () => {
  emit('close')
}

const copyText = (text) => {
  navigator.clipboard.writeText(text)
  copiedItem.value = 'mcp'
  setTimeout(() => { copiedItem.value = '' }, 2000)
}

const copyToken = (token) => {
  navigator.clipboard.writeText(token)
  copiedItem.value = 'token'
  setTimeout(() => { copiedItem.value = '' }, 2000)
}

const sendPreset = (presetText) => {
  inputQuery.value = presetText
  handleSendMessage()
}

const handleSendMessage = async () => {
  if (!inputQuery.value.trim() || isThinking.value) return

  const userQuery = inputQuery.value.trim()
  inputQuery.value = ''

  chatMessages.value.push({
    role: 'user',
    text: userQuery,
    time: dayjs().format('HH:mm:ss'),
  })

  isThinking.value = true

  setTimeout(async () => {
    const result = await executeHermesCommand(userQuery, {
      projectStore,
      taskStore,
      milestoneStore,
      isEnglish: false,
    })

    isThinking.value = false

    chatMessages.value.push({
      role: 'hermes',
      text: result.responseMessage,
      time: dayjs().format('HH:mm:ss'),
    })

    if (result.action === 'project_created' || result.action === 'task_completed') {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 }
      })
    }
  }, 500)
}
</script>
