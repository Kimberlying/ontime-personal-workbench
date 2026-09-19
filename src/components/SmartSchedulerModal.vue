<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
    <div class="bg-white rounded-3xl shadow-[6px_6px_0px_0px_#0d9488] max-w-2xl w-full overflow-hidden border-2 border-slate-900 animate-pop-in flex flex-col max-h-[92vh]">
      
      <!-- Header -->
      <div class="px-6 py-4 border-b-2 border-slate-900 flex items-center justify-between bg-slate-50">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-[#0d9488] border-2 border-slate-900 text-white flex items-center justify-center text-lg font-bold shadow-hard-sm">
            ⚡
          </div>
          <div>
            <h3 class="text-base font-black text-slate-900 flex items-center gap-2">
              <span>{{ $t('scheduler.wizardTitle') }}</span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-100 border border-slate-900 text-[#0d9488] font-bold">
                GEMINI 2.0 FLASH AI
              </span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 border border-slate-900 text-amber-950 font-bold">
                今日额度: {{ geminiStore.remainingDailyCalls }}/{{ geminiStore.dailyAllowance }}
              </span>
            </h3>
            <p class="text-xs text-slate-500 font-mono mt-0.5">{{ isEn ? 'Auto-suggested stages & actionable subtasks' : '根据目标智能规划关键节点与子任务清单' }}</p>
          </div>
        </div>
        <button @click="close" class="text-slate-400 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-200 cursor-pointer">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Content Scrollable Area -->
      <div class="p-6 overflow-y-auto space-y-5 flex-1 text-sm font-sans">
        
        <!-- Target & Deadline Summary -->
        <div class="bg-slate-50 rounded-2xl p-4 border-2 border-slate-900 shadow-hard-sm flex items-center justify-between">
          <div>
            <div class="text-[10px] text-slate-500 font-mono uppercase font-bold">{{ $t('scheduler.targetName') }}</div>
            <div class="text-base font-black text-slate-900 mt-0.5 flex items-center gap-2">
              <span>{{ targetTitle }}</span>
            </div>
          </div>
          <div class="text-right font-mono">
            <div class="text-[10px] text-slate-500 uppercase font-bold">{{ $t('scheduler.deadline') }}</div>
            <div class="text-sm font-black text-slate-900 mt-0.5">{{ deadlineDate }}</div>
            <div class="text-xs text-[#0d9488] font-black mt-0.5">
              {{ $t('scheduler.remainingDays', { days: remainingDays }) }}
            </div>
          </div>
        </div>

        <!-- Template Chips (One-click switch domain breakdown) -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-xs font-mono font-bold text-slate-600">
            <span>🤖 {{ isEn ? 'Smart Domain Planning Template:' : 'AI 智能行业规划模板 (点击可一键切换)：' }}</span>
          </div>
          <div class="flex flex-wrap gap-1.5 font-mono text-[11px] font-bold">
            <button
              v-for="(tpl, key) in DOMAIN_TEMPLATES"
              :key="key"
              @click="applyDomainTemplate(key)"
              class="px-2.5 py-1 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-1"
              :class="activeDomainKey === key 
                ? 'bg-[#0d9488] text-white border-slate-900 shadow-hard-sm' 
                : 'bg-white text-slate-700 border-slate-300 hover:border-slate-900 hover:bg-slate-50'"
            >
              <span>{{ isEn ? tpl.nameEn : tpl.nameZh }}</span>
            </button>
          </div>
        </div>

        <!-- Stages & Subtasks Planning Section -->
        <div class="space-y-3 pt-2 border-t-2 border-slate-900">
          <div class="flex items-center justify-between">
            <label class="font-black text-xs text-slate-900 flex items-center gap-1.5">
              <span>📌</span>
              <span>{{ isEn ? 'Stages & Concrete Subtasks Breakdown (Editable):' : '关键阶段与具体子任务拆解 (可自由编辑与增删)：' }}</span>
            </label>
            <button
              @click="handleAddStage"
              class="text-xs font-mono font-bold text-[#0d9488] hover:text-[#0f766e] flex items-center gap-1 cursor-pointer"
            >
              + {{ $t('scheduler.addStage') }}
            </button>
          </div>

          <!-- Dynamic Stage & Subtasks List -->
          <div class="space-y-3">
            <div 
              v-for="(stage, sIdx) in stages" 
              :key="sIdx"
              class="bg-slate-50 rounded-2xl border-2 border-slate-900 p-3.5 shadow-hard-sm space-y-2.5"
            >
              <!-- Stage Header Row -->
              <div class="flex items-center gap-2">
                <span class="w-6 h-6 rounded-lg bg-[#0d9488] text-white font-mono font-black text-xs flex items-center justify-center shrink-0 border border-slate-900">
                  {{ sIdx + 1 }}
                </span>
                <input
                  v-model="stage.name"
                  type="text"
                  :placeholder="$t('scheduler.stagePlaceholder')"
                  class="flex-1 px-3 py-1.5 bg-white border-2 border-slate-900 rounded-lg text-xs font-black text-slate-900 outline-none focus:ring-2 focus:ring-[#0d9488]"
                />
                <div class="flex items-center gap-1 shrink-0 font-mono">
                  <span class="text-[10px] text-slate-400 font-bold">{{ isEn ? 'Weight:' : '权重:' }}</span>
                  <input
                    v-model.number="stage.weight"
                    type="number"
                    min="1"
                    max="10"
                    class="w-11 px-1.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-center outline-none"
                  />
                </div>
                <button 
                  v-if="stages.length > 1"
                  @click="handleRemoveStage(sIdx)"
                  class="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="删除阶段"
                >
                  ✕
                </button>
              </div>

              <!-- Nested Subtasks Checklist (Actionable Points) -->
              <div class="pl-8 space-y-1.5 border-l-2 border-teal-200 ml-3">
                <div class="text-[11px] font-bold text-slate-500 font-mono flex items-center justify-between">
                  <span>{{ isEn ? 'Actionable Subtasks:' : '阶段子任务 / 关键落地行动点:' }}</span>
                  <button
                    @click="handleAddSubtask(sIdx)"
                    class="text-[#0d9488] hover:underline font-bold text-[10px] cursor-pointer"
                  >
                    + {{ isEn ? 'Add Subtask' : '增加子任务' }}
                  </button>
                </div>

                <div 
                  v-for="(sub, subIdx) in stage.subtasks" 
                  :key="subIdx"
                  class="flex items-center gap-2"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
                  <input
                    v-model="sub.title"
                    type="text"
                    placeholder="输入子任务内容..."
                    class="flex-1 px-2.5 py-1 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-800 outline-none focus:border-[#0d9488]"
                  />
                  <button
                    v-if="stage.subtasks.length > 1"
                    @click="handleRemoveSubtask(sIdx, subIdx)"
                    class="text-slate-300 hover:text-rose-500 text-xs px-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ADHD Friendly Micro-step Option -->
        <div class="bg-amber-50/80 p-3 rounded-2xl border-2 border-slate-900 shadow-hard-sm flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <input
              id="adhd-toggle"
              v-model="enableAdhdMicroSteps"
              type="checkbox"
              class="w-4 h-4 rounded border-2 border-slate-900 accent-[#0d9488] cursor-pointer"
            />
            <label for="adhd-toggle" class="font-black text-xs text-slate-900 cursor-pointer select-none">
              <span>{{ $t('adhd.autoAdhdGen') }}</span>
            </label>
          </div>
          <span class="text-[10px] font-mono text-amber-900 font-bold bg-amber-200/80 px-2 py-0.5 rounded border border-slate-900">
            {{ $t('adhd.zeroFriction') }}
          </span>
        </div>

        <!-- Generated Backward Schedule Preview -->
        <div class="space-y-2 pt-1 border-t-2 border-slate-900">
          <div class="text-xs font-black text-slate-900 font-mono uppercase tracking-wider">
            📅 {{ $t('scheduler.previewTitle') }} ({{ calculatedSchedule.length }} {{ isEn ? 'Stages' : '阶段' }})
          </div>
          <div class="space-y-1.5 max-h-36 overflow-y-auto">
            <div
              v-for="(item, i) in calculatedSchedule"
              :key="i"
              class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono"
            >
              <div class="flex items-center gap-2 truncate pr-2">
                <span class="w-2 h-2 rounded-full bg-[#0d9488] shrink-0"></span>
                <span class="font-bold text-slate-900 truncate font-sans">{{ item.stageName }} ({{ item.subtasks?.length || 0 }} {{ isEn ? 'subtasks' : '项子任务' }})</span>
              </div>
              <span class="text-slate-500 font-bold text-[11px] shrink-0">{{ item.startDate }} ~ {{ item.endDate }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 border-t-2 border-slate-900 bg-slate-50 flex items-center justify-between">
        <span class="text-[11px] font-mono text-slate-500 font-bold">
          // {{ isEn ? 'Clear Cadence · Deliver On Time' : '定下截止日，万事皆如期' }}
        </span>
        <div class="flex gap-2">
          <button
            @click="close"
            class="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer font-mono"
          >
            {{ $t('scheduler.cancel') }}
          </button>
          <button
            @click="handleConfirm"
            class="px-5 py-2 text-xs font-bold text-white bg-[#0d9488] hover:bg-[#0f766e] active:translate-x-[1px] active:translate-y-[1px] rounded-xl border-2 border-slate-900 shadow-hard-sm hover:shadow-hard transition-all cursor-pointer font-mono"
          >
            {{ $t('scheduler.confirmGenerate') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import { useProjectStore } from '../stores/projectStore'
import { useTaskStore } from '../stores/taskStore'
import { useGeminiStore } from '../stores/geminiStore'
import { 
  DOMAIN_TEMPLATES, 
  detectDomainKey, 
  generateSmartBreakdown, 
  calculateBackwardSchedule 
} from '../utils/taskScheduler'
import confetti from 'canvas-confetti'

const props = defineProps({
  isOpen: Boolean,
  targetTitle: String,
  deadlineDate: String,
})

const emit = defineEmits(['close', 'success'])

const { t, locale } = useI18n()
const projectStore = useProjectStore()
const taskStore = useTaskStore()
const geminiStore = useGeminiStore()

const isEn = computed(() => locale.value === 'en')
const stages = ref([])
const activeDomainKey = ref('general')
const enableAdhdMicroSteps = ref(true)

watch(() => props.isOpen, (val) => {
  if (val) {
    activeDomainKey.value = detectDomainKey(props.targetTitle)
    stages.value = generateSmartBreakdown(props.targetTitle, activeDomainKey.value, isEn.value)
  }
})

const applyDomainTemplate = (domainKey) => {
  activeDomainKey.value = domainKey
  stages.value = generateSmartBreakdown(props.targetTitle, domainKey, isEn.value)
}

const remainingDays = computed(() => {
  if (!props.deadlineDate) return 0
  const today = dayjs().startOf('day')
  const target = dayjs(props.deadlineDate).startOf('day')
  return Math.max(1, target.diff(today, 'day'))
})

const calculatedSchedule = computed(() => {
  if (!props.deadlineDate || stages.value.length === 0) return []
  return calculateBackwardSchedule({
    targetTitle: props.targetTitle,
    deadline: props.deadlineDate,
    stages: stages.value,
  })
})

const handleAddStage = () => {
  stages.value.push({
    name: isEn.value ? 'New Stage' : '新阶段',
    weight: 2,
    subtasks: [
      { title: isEn.value ? 'Actionable item 1' : '落地行动项 1', done: false },
      { title: isEn.value ? 'Actionable item 2' : '落地行动项 2', done: false },
    ]
  })
}

const handleRemoveStage = (idx) => {
  stages.value.splice(idx, 1)
}

const handleAddSubtask = (sIdx) => {
  if (!stages.value[sIdx].subtasks) stages.value[sIdx].subtasks = []
  stages.value[sIdx].subtasks.push({
    title: isEn.value ? 'New Subtask' : '新子任务行动点',
    done: false,
  })
}

const handleRemoveSubtask = (sIdx, subIdx) => {
  stages.value[sIdx].subtasks.splice(subIdx, 1)
}

const close = () => {
  emit('close')
}

const handleConfirm = async () => {
  const isShort = remainingDays.value <= 14
  const newProjectRes = await projectStore.createProject({
    name: props.targetTitle,
    deadline: props.deadlineDate,
    type: isShort ? 'short' : 'long',
    progress: 0,
    next_step: stages.value[0]?.subtasks[0]?.title || stages.value[0]?.name || (isEn.value ? 'Kickoff' : '开始推进'),
  })

  const newProject = newProjectRes.project || newProjectRes

  // Insert generated daily tasks & concrete subtasks into taskStore
  for (const item of calculatedSchedule.value) {
    // 1. Insert Stage Subtasks
    if (item.subtasks && item.subtasks.length > 0) {
      for (const sub of item.subtasks) {
        if (sub.title && sub.title.trim()) {
          await taskStore.createTask({
            project_id: newProject.id,
            title: `[${item.stageName}] ${sub.title.trim()}`,
            assigned_date: item.startDate,
            status: 'pending',
            attachments: [],
          })
        }
      }
    } else {
      await taskStore.createTask({
        project_id: newProject.id,
        title: `${isEn.value ? 'Start: ' : '推进: '}${item.stageName}`,
        assigned_date: item.startDate,
        status: 'pending',
        attachments: [],
      })
    }

    // 2. ADHD 5-Minute Micro-start Task if enabled
    if (enableAdhdMicroSteps.value) {
      await taskStore.createTask({
        project_id: newProject.id,
        title: `[${isEn.value ? '5-Min Step' : '5分微步'}] ${isEn.value ? 'Open file & glance 5 mins: ' : '打开文件 & 浏览5分钟: '}${item.stageName}`,
        assigned_date: item.startDate,
        status: 'pending',
        attachments: [],
      })
    }
  }

  geminiStore.incrementUsage()

  confetti({
    particleCount: 60,
    spread: 70,
    origin: { y: 0.6 }
  })

  emit('success')
  close()
}
</script>
