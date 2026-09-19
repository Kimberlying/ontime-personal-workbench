<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
    <div class="bg-white rounded-3xl shadow-[6px_6px_0px_0px_#0d9488] max-w-lg w-full overflow-hidden border-2 border-slate-900 animate-pop-in flex flex-col max-h-[92vh]">
      
      <!-- Modal Header -->
      <div class="p-5 border-b-2 border-slate-900 bg-[#f0fdfa] flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-[#0d9488] border-2 border-slate-900 text-white flex items-center justify-center text-xl shadow-hard-sm">
            ⚡
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-black text-sm text-slate-900">{{ $t('adhd.modalTitle') }}</h3>
              <span class="px-2 py-0.5 rounded-md bg-teal-100 border border-slate-900 text-[#0d9488] text-[10px] font-mono font-black">5-MIN RULE</span>
            </div>
            <p class="text-xs text-slate-600 font-mono mt-0.5">{{ $t('adhd.modalSubtitle') }}</p>
          </div>
        </div>
        <button @click="close" class="text-slate-400 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-200 cursor-pointer transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Tab Switcher (微步粉碎 vs 5分钟无压冲刺) -->
      <div class="flex border-b-2 border-slate-900 bg-slate-50 text-xs font-mono font-bold">
        <button
          @click="activeTab = 'breakdown'"
          class="flex-1 py-3 text-center border-r-2 border-slate-900 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          :class="activeTab === 'breakdown' ? 'bg-white text-slate-900 font-black shadow-inner border-b-2 border-b-white -mb-0.5' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'"
        >
          <span>🧩</span>
          <span>{{ $t('adhd.tabBreakdown') }}</span>
        </button>
        <button
          @click="activeTab = 'timer'"
          class="flex-1 py-3 text-center transition-all cursor-pointer flex items-center justify-center gap-1.5"
          :class="activeTab === 'timer' ? 'bg-white text-slate-900 font-black shadow-inner border-b-2 border-b-white -mb-0.5' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'"
        >
          <span>⏱️</span>
          <span>{{ $t('adhd.tabTimer') }}</span>
        </button>
      </div>

      <!-- Current Task Banner -->
      <div class="px-6 py-3 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between text-xs">
        <span class="text-slate-500 font-mono font-bold">{{ $t('adhd.currentTask') }}:</span>
        <span class="font-black text-slate-900 max-w-[280px] truncate text-right">
          {{ taskTitle }}
        </span>
      </div>

      <!-- Modal Body Content -->
      <div class="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
        
        <!-- ============================================== -->
        <!-- TAB 1: 🧩 微步粉碎拆解 (Micro-Step Atomizer) -->
        <!-- ============================================== -->
        <div v-if="activeTab === 'breakdown'" class="space-y-4 animate-fade-in">
          
          <!-- Psychology Box: 5-Min Commitment Rule -->
          <div class="p-4 rounded-2xl bg-[#f0fdfa] border-2 border-slate-900 shadow-hard-sm space-y-1.5">
            <h4 class="font-black text-slate-900 flex items-center gap-1.5 text-xs">
              <span>{{ $t('adhd.magicRuleTitle') }}</span>
            </h4>
            <p class="text-slate-700 leading-relaxed font-sans">
              {{ $t('adhd.magicRuleDesc') }}
            </p>
          </div>

          <!-- 3-Step Micro Atomization Checklist -->
          <div class="space-y-3">
            <div class="flex items-center justify-between font-mono font-bold text-slate-700">
              <span>{{ $t('adhd.presetTitle') }}</span>
            </div>

            <!-- Step 1 -->
            <div class="p-3.5 bg-slate-50 rounded-xl border-2 border-slate-900 shadow-hard-sm space-y-1">
              <div class="flex items-center justify-between font-mono text-[11px] font-black text-[#0d9488]">
                <span>1. {{ $t('adhd.step1Label') }}</span>
                <span class="text-[10px] bg-teal-100 px-1.5 py-0.5 rounded border border-slate-900 text-teal-900 font-mono font-black">
                  {{ $t('adhd.zeroFriction') }}
                </span>
              </div>
              <input
                v-model="microSteps[0]"
                type="text"
                class="w-full bg-white px-3 py-1.5 rounded-lg border border-slate-300 font-bold text-slate-800 text-xs outline-none focus:border-[#0d9488]"
              />
            </div>

            <!-- Step 2 -->
            <div class="p-3.5 bg-slate-50 rounded-xl border-2 border-slate-900 shadow-hard-sm space-y-1">
              <div class="flex items-center justify-between font-mono text-[11px] font-black text-amber-700">
                <span>2. {{ $t('adhd.step2Label') }}</span>
                <span class="text-[10px] bg-amber-100 px-1.5 py-0.5 rounded border border-slate-900 text-amber-900 font-mono font-black">
                  {{ $t('adhd.zeroFriction') }}
                </span>
              </div>
              <input
                v-model="microSteps[1]"
                type="text"
                class="w-full bg-white px-3 py-1.5 rounded-lg border border-slate-300 font-bold text-slate-800 text-xs outline-none focus:border-[#0d9488]"
              />
            </div>

            <!-- Step 3 -->
            <div class="p-3.5 bg-slate-50 rounded-xl border-2 border-slate-900 shadow-hard-sm space-y-1">
              <div class="flex items-center justify-between font-mono text-[11px] font-black text-emerald-700">
                <span>3. {{ $t('adhd.step3Label') }}</span>
                <span class="text-[10px] bg-emerald-100 px-1.5 py-0.5 rounded border border-slate-900 text-emerald-900 font-mono font-black">
                  {{ $t('adhd.zeroFriction') }}
                </span>
              </div>
              <input
                v-model="microSteps[2]"
                type="text"
                class="w-full bg-white px-3 py-1.5 rounded-lg border border-slate-300 font-bold text-slate-800 text-xs outline-none focus:border-[#0d9488]"
              />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="pt-2 space-y-2 font-mono font-bold">
            <button
              @click="handleAddMicroSubtasks"
              class="w-full py-3 bg-[#0d9488] hover:bg-[#0f766e] active:translate-x-[1px] active:translate-y-[1px] text-white rounded-xl border-2 border-slate-900 shadow-hard-sm hover:shadow-hard transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              <span>🧩</span>
              <span>{{ $t('adhd.addAsSubtasks') }}</span>
            </button>
            <button
              @click="activeTab = 'timer'; startTimer()"
              class="w-full py-2.5 bg-white hover:bg-slate-100 active:translate-x-[1px] active:translate-y-[1px] text-slate-900 rounded-xl border-2 border-slate-900 shadow-hard-sm transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              <span>⏱️</span>
              <span>{{ $t('adhd.directStartStep1') }}</span>
            </button>
          </div>

        </div>

        <!-- ============================================== -->
        <!-- TAB 2: ⏱️ 5 分钟无压冲刺计时器 (5-Min Focus Sprint) -->
        <!-- ============================================== -->
        <div v-else class="space-y-6 text-center animate-fade-in py-2">
          
          <!-- Timer Display Card -->
          <div class="bg-slate-50 border-2 border-slate-900 rounded-3xl p-6 shadow-hard-sm relative overflow-hidden space-y-3">
            
            <div class="text-xs font-mono font-bold text-slate-500">
              {{ isFinished ? $t('adhd.timerDoneTitle') : isRunning ? $t('adhd.timerRunningTitle') : isPaused ? $t('adhd.timerPausedTitle') : $t('adhd.timerReadyTitle') }}
            </div>

            <!-- Big Digits Display -->
            <div class="font-mono text-5xl sm:text-6xl font-black text-slate-900 tracking-tight py-2 flex items-center justify-center gap-1">
              <span :class="isRunning ? 'text-[#0d9488]' : 'text-slate-900'">{{ formattedMinutes }}</span>
              <span>:</span>
              <span :class="isRunning ? 'text-[#0d9488]' : 'text-slate-900'">{{ formattedSeconds }}</span>
            </div>

            <!-- Subtle Pulse Ring Bar -->
            <div class="w-full bg-slate-200 h-2.5 rounded-lg border border-slate-900 overflow-hidden">
              <div 
                class="bg-[#0d9488] h-full transition-all duration-1000"
                :style="{ width: `${((300 - remainingSeconds) / 300) * 100}%` }"
              ></div>
            </div>

            <p class="text-[11px] text-slate-600 font-sans leading-relaxed">
              {{ isFinished ? $t('adhd.timerDoneSubtitle') : $t('adhd.timerSubHint') }}
            </p>
          </div>

          <!-- Finished Celebration CTAs -->
          <div v-if="isFinished" class="space-y-2.5 font-mono font-bold animate-pop-in">
            <button
              @click="handleContinueFlow"
              class="w-full py-3 bg-[#0d9488] hover:bg-[#0f766e] text-white rounded-xl border-2 border-slate-900 shadow-hard hover:shadow-hard-teal transition-all cursor-pointer text-xs flex items-center justify-center gap-2"
            >
              <span>🔥</span>
              <span>{{ $t('adhd.continueFlow') }}</span>
            </button>
            <button
              @click="handleCompleteAndClose"
              class="w-full py-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 rounded-xl border-2 border-slate-900 shadow-hard-sm transition-all cursor-pointer text-xs flex items-center justify-center gap-2"
            >
              <span>✅</span>
              <span>{{ $t('adhd.markDoneRest') }}</span>
            </button>
          </div>

          <!-- Timer Controls -->
          <div v-else class="flex items-center justify-center gap-3 font-mono font-bold">
            <button
              v-if="!isRunning"
              @click="startTimer"
              class="px-6 py-3 bg-[#0d9488] hover:bg-[#0f766e] active:translate-x-[1px] active:translate-y-[1px] text-white rounded-xl border-2 border-slate-900 shadow-hard-sm hover:shadow-hard transition-all cursor-pointer text-xs flex items-center gap-2"
            >
              <span>▶️</span>
              <span>{{ isPaused ? $t('adhd.resumeTimer') : $t('adhd.startTimer') }}</span>
            </button>
            <button
              v-if="isRunning"
              @click="pauseTimer"
              class="px-6 py-3 bg-amber-400 hover:bg-amber-500 active:translate-x-[1px] active:translate-y-[1px] text-slate-900 rounded-xl border-2 border-slate-900 shadow-hard-sm transition-all cursor-pointer text-xs flex items-center gap-2"
            >
              <span>⏸️</span>
              <span>{{ $t('adhd.pauseTimer') }}</span>
            </button>
            <button
              @click="resetTimer"
              class="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border-2 border-slate-900 shadow-hard-sm transition-all cursor-pointer text-xs"
            >
              {{ $t('adhd.resetTimer') }}
            </button>
            <button
              @click="handleFinishEarly"
              class="px-4 py-3 bg-white hover:bg-slate-50 text-[#0d9488] rounded-xl border-2 border-slate-900 shadow-hard-sm transition-all cursor-pointer text-xs"
              :title="$t('adhd.finishEarly')"
            >
              {{ $t('adhd.finishEarly') }}
            </button>
          </div>

        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import { useTaskStore } from '../stores/taskStore'
import confetti from 'canvas-confetti'

const props = defineProps({
  isOpen: Boolean,
  task: Object,
  project: Object,
})

const emit = defineEmits(['close', 'task-updated'])

const { t, locale } = useI18n()
const taskStore = useTaskStore()
const activeTab = ref('breakdown') // 'breakdown' | 'timer'

const taskTitle = computed(() => {
  if (props.task?.title) return props.task.title
  if (props.project?.name) return props.project.name
  return locale.value === 'en' ? 'Current Target Goal' : '当前目标任务'
})

// Dynamic 3 Micro Steps tailored to current language
const microSteps = ref([])

const generateMicroSteps = () => {
  const isEn = locale.value === 'en'
  const tTitle = props.task?.title || props.project?.name || ''

  if (tTitle.includes('图') || tTitle.includes('设计') || tTitle.toLowerCase().includes('design') || tTitle.toLowerCase().includes('draw')) {
    microSteps.value = [
      isEn ? `Open design software and open project file for "${tTitle}"` : `打开设计软件，找到并打开「${tTitle}」工程文件`,
      isEn ? "Just zoom in on yesterday's grid or title block, no rush to draw" : "只放大看一眼昨天的红线或图框，不用急着画",
      isEn ? "Roughly place 1 reference line or pick 1 template block" : "随便画出第 1 个参考轴网或抓取 1 个植物图块",
    ]
  } else if (tTitle.includes('清单') || tTitle.includes('预算') || tTitle.includes('文档') || tTitle.includes('报告') || tTitle.toLowerCase().includes('doc') || tTitle.toLowerCase().includes('report')) {
    microSteps.value = [
      isEn ? "Open document/sheet, take a sip of water and breathe" : "打开表格/文档，喝一口温水深呼吸",
      isEn ? "Glance through table headers or the first 3 items" : "只把表格的表头或前 3 个条目名称过一遍",
      isEn ? "Quickly fill in the first known number or rough paragraph" : "随手填入第 1 个已知的数字或段落，完成启动",
    ]
  } else {
    microSteps.value = [
      isEn ? "Put on headphones, sip water, open target folder or workspace" : "戴上降噪耳机，喝口温水，打开相关工作文件夹",
      isEn ? "Just glance at the last line, or draft a 1-sentence title" : "只看一眼上一版最后一段，或者新建空白草稿写下主标题",
      isEn ? "Don't aim for perfection; jot down 3 quick bullet points" : "不追求完美，随便写出 3 个核心要点或画出大致粗略框线",
    ]
  }
}

watch(() => [props.task, props.isOpen, locale.value], () => {
  if (props.isOpen) {
    generateMicroSteps()
  }
}, { immediate: true })

// 5-Min Timer State (300 seconds)
const remainingSeconds = ref(300)
const isRunning = ref(false)
const isPaused = ref(false)
const isFinished = ref(false)
let timerInterval = null

const formattedMinutes = computed(() => {
  const m = Math.floor(remainingSeconds.value / 60)
  return m < 10 ? `0${m}` : `${m}`
})

const formattedSeconds = computed(() => {
  const s = remainingSeconds.value % 60
  return s < 10 ? `0${s}` : `${s}`
})

const startTimer = () => {
  if (isRunning.value) return
  isRunning.value = true
  isPaused.value = false
  isFinished.value = false

  timerInterval = setInterval(() => {
    if (remainingSeconds.value > 0) {
      remainingSeconds.value--
    } else {
      clearInterval(timerInterval)
      isRunning.value = false
      isFinished.value = true
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      })
    }
  }, 1000)
}

const pauseTimer = () => {
  clearInterval(timerInterval)
  isRunning.value = false
  isPaused.value = true
}

const resetTimer = () => {
  clearInterval(timerInterval)
  remainingSeconds.value = 300
  isRunning.value = false
  isPaused.value = false
  isFinished.value = false
}

const handleFinishEarly = () => {
  clearInterval(timerInterval)
  remainingSeconds.value = 0
  isRunning.value = false
  isFinished.value = true
  confetti({
    particleCount: 50,
    spread: 50,
    origin: { y: 0.6 }
  })
}

const handleContinueFlow = () => {
  close()
}

const handleCompleteAndClose = async () => {
  if (props.task?.id) {
    await taskStore.toggleTaskStatus(props.task.id)
  }
  close()
}

const handleAddMicroSubtasks = async () => {
  const todayStr = dayjs().format('YYYY-MM-DD')
  const pId = props.task?.project_id || props.project?.id || null
  const prefix = locale.value === 'en' ? '5-Min Step' : '5分微步'

  for (let i = 0; i < microSteps.value.length; i++) {
    const text = microSteps.value[i]
    if (text.trim()) {
      await taskStore.createTask({
        project_id: pId,
        title: `[${prefix} ${i+1}] ${text}`,
        assigned_date: todayStr,
        status: 'pending',
        attachments: [],
      })
    }
  }

  confetti({
    particleCount: 40,
    spread: 50,
    origin: { y: 0.7 }
  })

  emit('task-updated')
  close()
}

const close = () => {
  clearInterval(timerInterval)
  resetTimer()
  emit('close')
}

onUnmounted(() => {
  clearInterval(timerInterval)
})
</script>
