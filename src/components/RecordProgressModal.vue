<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
    <div class="bg-white rounded-3xl shadow-[6px_6px_0px_0px_#0d9488] max-w-md w-full overflow-hidden border-2 border-slate-900 animate-pop-in">
      <div class="p-5 border-b-2 border-slate-900 flex items-center justify-between bg-slate-50">
        <div>
          <h3 class="font-black text-sm text-slate-900">{{ $t('projects.progressModalTitle') }}</h3>
          <p class="text-xs text-slate-500 font-mono mt-0.5 truncate max-w-xs font-bold">{{ project?.name }}</p>
        </div>
        <button @click="close" class="text-slate-400 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-200 cursor-pointer">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <div class="p-6 space-y-5 text-xs">
        <!-- Progress Slider with Chunky Frame -->
        <div class="bg-slate-50 p-4 rounded-2xl border-2 border-slate-900 shadow-hard-sm space-y-2">
          <div class="flex justify-between items-center font-bold text-slate-900">
            <span>{{ $t('projects.currentProgress') }}</span>
            <span class="text-[#0d9488] font-mono font-black text-base">{{ progress }}%</span>
          </div>
          <input
            v-model.number="progress"
            type="range"
            min="0"
            max="100"
            step="5"
            class="w-full h-3 bg-white border-2 border-slate-900 rounded-lg appearance-none cursor-pointer accent-[#0d9488]"
          />
        </div>

        <!-- Next Step Input -->
        <div>
          <label class="block font-bold text-slate-900 mb-1.5 font-mono">
            {{ $t('projects.nextActionLabel') }}
          </label>
          <input
            v-model="nextStep"
            type="text"
            :placeholder="$t('projects.nextActionPlaceholder')"
            class="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0d9488]/20 outline-none text-slate-900 font-bold"
          />
        </div>

        <div class="pt-2 flex justify-end gap-2 font-mono font-bold">
          <button
            @click="close"
            class="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            {{ $t('scheduler.cancel') }}
          </button>
          <button
            @click="handleSave"
            class="px-5 py-2 bg-[#0d9488] hover:bg-[#0f766e] active:translate-x-[1px] active:translate-y-[1px] text-white rounded-xl border-2 border-slate-900 shadow-hard-sm hover:shadow-hard transition-all cursor-pointer"
          >
            {{ $t('projects.saveProgress') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useProjectStore } from '../stores/projectStore'
import { useMilestoneStore } from '../stores/milestoneStore'
import confetti from 'canvas-confetti'

const props = defineProps({
  isOpen: Boolean,
  project: Object,
})

const emit = defineEmits(['close'])
const projectStore = useProjectStore()
const milestoneStore = useMilestoneStore()

const progress = ref(0)
const nextStep = ref('')

watch(() => props.project, (newVal) => {
  if (newVal) {
    progress.value = newVal.progress || 0
    nextStep.value = newVal.next_step || ''
  }
}, { immediate: true })

const close = () => {
  emit('close')
}

const handleSave = async () => {
  if (!props.project) return
  const is100 = progress.value >= 100
  await projectStore.updateProgress(props.project.id, progress.value, nextStep.value)
  close()
  
  if (is100) {
    milestoneStore.triggerCelebration({
      ...props.project,
      progress: 100,
      next_step: nextStep.value,
    })
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.5 }
    })
  }
}
</script>
