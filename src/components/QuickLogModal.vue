<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
    <div class="bg-white rounded-3xl shadow-[6px_6px_0px_0px_#0d9488] max-w-md w-full overflow-hidden border-2 border-slate-900 animate-pop-in">
      
      <!-- Modal Header -->
      <div class="p-5 border-b-2 border-slate-900 bg-[#f0fdfa] flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-[#0d9488] border-2 border-slate-900 text-white flex items-center justify-center text-sm font-bold shadow-hard-sm">
            ✎
          </div>
          <div>
            <h3 class="font-black text-sm text-slate-900">{{ isGoal ? '推进目标 · 记录进展' : '记录任务进度' }}</h3>
            <p class="text-[11px] text-slate-500 font-mono">写下一句证据，留存为时间线记录</p>
          </div>
        </div>
        <button @click="close" class="text-slate-400 hover:text-slate-900 p-1 rounded-lg cursor-pointer">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Content Form -->
      <div class="p-6 space-y-4 text-xs font-sans">
        <div>
          <label class="block font-bold text-slate-700 mb-1 truncate" :title="targetTitle">
            正在推进：<span class="text-[#0d9488]">{{ targetTitle }}</span>
          </label>
          <input
            ref="inputRef"
            v-model="logText"
            type="text"
            placeholder="这次推进了什么？例如：画完施工图第 3 张 / 读完第二章"
            class="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0d9488]/20 outline-none text-slate-900 font-bold transition-all"
            @keydown.enter.prevent="save"
          />
          <p class="text-[11px] text-slate-400 font-mono mt-1.5">
            {{ isGoal ? '保存后将自动勾掉第一个未完成的节点并存入时间线。' : '可以跳过。写一句就行，它会留在任务下面，证明你一直在前进。' }}
          </p>
        </div>

        <!-- Recent Logs History -->
        <div v-if="recentLogs.length > 0" class="space-y-1.5 pt-2 border-t border-slate-100">
          <label class="block font-bold text-slate-500 font-mono text-[11px]">最近的推进记录：</label>
          <div class="space-y-1 max-h-32 overflow-y-auto bg-slate-50 p-2 rounded-xl border border-slate-200">
            <div
              v-for="(l, i) in recentLogs"
              :key="i"
              class="flex items-center gap-2 text-[11px] text-slate-700 py-0.5"
            >
              <span class="text-slate-400 font-mono shrink-0">{{ formatTime(l.at) }}</span>
              <span class="truncate">{{ l.text }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="p-4 bg-slate-50 border-t-2 border-slate-900 flex items-center justify-end gap-2">
        <button
          @click="close"
          class="px-4 py-2 bg-white hover:bg-slate-100 active:translate-x-[1px] active:translate-y-[1px] text-slate-700 rounded-xl border-2 border-slate-900 font-bold font-mono text-xs transition-all cursor-pointer"
        >
          取消 / 跳过
        </button>
        <button
          @click="save"
          :disabled="!logText.trim()"
          class="px-4 py-2 bg-[#0d9488] hover:bg-[#0f766e] active:translate-x-[1px] active:translate-y-[1px] disabled:opacity-50 text-white rounded-xl border-2 border-slate-900 font-bold font-mono text-xs shadow-hard-sm transition-all cursor-pointer"
        >
          保存记录
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import dayjs from 'dayjs'
import { useTaskStore } from '../stores/taskStore'
import { useProjectStore } from '../stores/projectStore'

const props = defineProps({
  isOpen: Boolean,
  targetItem: Object,
  isGoal: Boolean,
})

const emit = defineEmits(['close', 'logged'])

const taskStore = useTaskStore()
const projectStore = useProjectStore()

const logText = ref('')
const inputRef = ref(null)

watch(() => props.isOpen, (open) => {
  if (open) {
    logText.value = ''
    nextTick(() => inputRef.value?.focus())
  }
})

const targetTitle = computed(() => {
  if (!props.targetItem) return ''
  return props.targetItem.title || props.targetItem.name || ''
})

const recentLogs = computed(() => {
  if (!props.targetItem?.logs) return []
  return (props.targetItem.logs || []).slice(0, 3)
})

const formatTime = (ts) => {
  if (!ts) return ''
  return dayjs(ts).format('M/D HH:mm')
}

const close = () => {
  emit('close')
}

const save = async () => {
  if (!logText.value.trim() || !props.targetItem) return

  if (props.isGoal) {
    projectStore.addGoalLog(props.targetItem.id, logText.value.trim())
  } else {
    await taskStore.addLog(props.targetItem.id, logText.value.trim())
  }

  emit('logged', logText.value.trim())
  close()
}
</script>
