<template>
  <div class="mb-6">
    <!-- Active Push Target Bar -->
    <div
      v-if="currentTask"
      class="bg-white rounded-2xl p-5 border-2 border-slate-900 shadow-hard hover:shadow-hard-teal transition-all flex items-center justify-between gap-4 flex-wrap"
    >
      <div class="space-y-1.5 min-w-[260px] flex-1">
        <!-- Eyebrow Tag -->
        <div class="flex items-center gap-2">
          <span class="font-mono text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border" :class="urgencyBadgeClass">
            ⚡ {{ reasonText }}
          </span>
          <span v-if="project" class="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 border border-slate-900 text-slate-800">
            <span class="w-2 h-2 rounded-full bg-[#0d9488]"></span>
            {{ project.name }}
          </span>
          <span v-if="currentTask.priority === 'high'" class="text-[10px] font-mono font-bold text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
            高优先
          </span>
        </div>

        <!-- Task Title -->
        <div class="flex items-center gap-2">
          <h2 class="text-base sm:text-lg font-black text-slate-900 truncate">
            {{ currentTask.title }}
          </h2>
        </div>

        <!-- Next Action Prompt -->
        <div class="text-xs text-slate-600 flex items-center gap-1.5 font-sans">
          <span class="text-slate-400 font-mono font-bold">下一步:</span>
          <b class="text-slate-900 bg-teal-50/80 px-2 py-0.5 rounded border border-teal-200 text-xs font-bold truncate max-w-[500px]">
            {{ nextActionText }}
          </b>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2.5 shrink-0 flex-wrap">
        <button
          @click="$emit('start-starter', currentTask)"
          class="px-4 py-2 bg-[#0d9488] hover:bg-[#0f766e] active:translate-x-[1px] active:translate-y-[1px] text-white rounded-xl border-2 border-slate-900 font-bold font-mono text-xs shadow-hard-sm hover:shadow-hard transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>⚡</span>
          <span>5 分钟启动</span>
        </button>

        <button
          @click="$emit('log-progress', currentTask)"
          class="px-3.5 py-2 bg-white hover:bg-slate-100 active:translate-x-[1px] active:translate-y-[1px] text-slate-900 rounded-xl border-2 border-slate-900 font-bold font-mono text-xs shadow-hard-sm transition-all flex items-center gap-1 cursor-pointer"
        >
          <span>✎</span>
          <span>记录进度</span>
        </button>

        <button
          v-if="targets.length > 1"
          @click="handleNext"
          class="px-3 py-2 bg-slate-50 hover:bg-slate-200 active:translate-x-[1px] active:translate-y-[1px] text-slate-700 rounded-xl border-2 border-slate-900 font-bold font-mono text-xs transition-all cursor-pointer"
          title="切换下一个候选任务"
        >
          换一个 ({{ currentIdx + 1 }}/{{ targets.length }})
        </button>
      </div>
    </div>

    <!-- Empty State when no pending tasks -->
    <div
      v-else
      class="bg-white rounded-2xl p-5 border-2 border-slate-300 text-slate-500 flex items-center justify-between gap-4"
    >
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 text-[#0d9488] flex items-center justify-center font-bold">
          ✓
        </div>
        <div>
          <h4 class="text-sm font-bold text-slate-800">没有待推进的任务</h4>
          <p class="text-xs text-slate-400 font-mono mt-0.5">今天的清单已经完成。新的工作在明天 0 点重新刷新。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import { useTaskStore } from '../stores/taskStore'
import { useProjectStore } from '../stores/projectStore'

defineEmits(['start-starter', 'log-progress'])

const taskStore = useTaskStore()
const projectStore = useProjectStore()

const currentIdx = ref(0)

const targets = computed(() => taskStore.pushTargets)

const currentTask = computed(() => {
  if (targets.value.length === 0) return null
  return targets.value[currentIdx.value % targets.value.length]
})

const project = computed(() => {
  if (!currentTask.value?.project_id) return null
  return projectStore.projects.find(p => p.id === currentTask.value.project_id)
})

const reasonText = computed(() => {
  if (!currentTask.value) return ''
  const today = dayjs().format('YYYY-MM-DD')
  const due = currentTask.value.due || currentTask.value.assigned_date

  if (due && due < today) return '推进提示 · 已逾期'
  if (due && due === today) return '推进提示 · 今日到期'
  if (due) {
    const diff = dayjs(due).diff(dayjs(today), 'day')
    if (diff >= 0 && diff <= 3) return `推进提示 · 剩余 ${diff} 天`
  }
  if (currentTask.value.priority === 'high') return '推进提示 · 高优先级'
  return '推进提示 · 待推进'
})

const urgencyBadgeClass = computed(() => {
  const r = reasonText.value
  if (r.includes('已逾期')) return 'bg-rose-100 text-rose-800 border-rose-300'
  if (r.includes('今日到期') || r.includes('剩余')) return 'bg-amber-100 text-amber-900 border-amber-300'
  return 'bg-teal-100 text-[#0d9488] border-teal-300'
})

const nextActionText = computed(() => {
  const t = currentTask.value
  if (!t) return ''
  if (t.starter && t.starter.trim()) return t.starter.trim()
  if (t.steps && t.steps.length) {
    const undone = t.steps.find(s => !s.done)
    if (undone) return undone.text
  }
  return t.title
})

const handleNext = () => {
  if (targets.value.length > 0) {
    currentIdx.value = (currentIdx.value + 1) % targets.value.length
  }
}
</script>
