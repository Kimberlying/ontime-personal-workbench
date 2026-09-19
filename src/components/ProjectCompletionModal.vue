<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
    <div class="bg-white rounded-3xl shadow-[6px_6px_0px_0px_#0d9488] max-w-md w-full overflow-hidden border-2 border-slate-900 animate-pop-in text-center relative">
      
      <!-- Top Glow Gradient Banner in Amber/Teal -->
      <div class="bg-amber-400 border-b-2 border-slate-900 p-8 text-slate-900 relative overflow-hidden">
        <div class="absolute -right-6 -bottom-6 text-7xl opacity-20 select-none">
          🏆
        </div>

        <button 
          @click="close" 
          class="absolute top-4 right-4 text-slate-800 hover:text-slate-950 bg-white/40 hover:bg-white/70 p-1.5 rounded-xl border border-slate-900 transition-colors cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <div class="w-16 h-16 bg-white border-2 border-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl shadow-hard-sm">
          🎉
        </div>
        <h2 class="text-2xl font-black tracking-tight">{{ $t('milestones.congratsTitle') }}</h2>
        <p class="text-xs text-slate-800 mt-1 max-w-xs mx-auto font-medium font-sans">
          {{ project?.type === 'short' ? $t('milestones.shortQuote') : $t('milestones.longQuote') }}
        </p>
      </div>

      <!-- Card Body Content -->
      <div class="p-6 space-y-5 text-xs text-slate-800">
        <!-- Project Milestone Card -->
        <div class="bg-slate-50 rounded-2xl p-4 border-2 border-slate-900 shadow-hard-sm space-y-3 text-left">
          <div class="flex items-center justify-between border-b-2 border-slate-900 pb-2">
            <span class="text-[10px] font-mono text-slate-500 font-bold uppercase">{{ $t('scheduler.targetName') }}</span>
            <span class="px-2 py-0.5 rounded border border-slate-900 font-mono text-[10px] font-bold" :class="project?.type === 'short' ? 'bg-[#0d9488] text-white' : 'bg-amber-300 text-slate-900'">
              {{ project?.type === 'short' ? $t('app.shortTermProjects') : $t('app.longTermProjects') }}
            </span>
          </div>

          <h3 class="font-black text-sm text-slate-900 leading-snug">
            {{ project?.name }}
          </h3>

          <div class="grid grid-cols-2 gap-2 pt-1 font-mono">
            <div class="bg-white p-2.5 rounded-xl border-2 border-slate-900">
              <span class="text-slate-500 font-bold text-[10px] block mb-0.5">{{ $t('projects.currentProgress') }}</span>
              <span class="font-black text-[#10b981] text-xs">100% 达成 ✓</span>
            </div>
            <div class="bg-white p-2.5 rounded-xl border-2 border-slate-900">
              <span class="text-slate-500 font-bold text-[10px] block mb-0.5">{{ $t('projects.deadlineLabel') }}</span>
              <span class="font-bold text-slate-800 text-xs">{{ project?.deadline }}</span>
            </div>
          </div>
        </div>

        <!-- Action CTAs -->
        <div class="space-y-2 pt-1 font-mono font-bold">
          <button
            @click="handleArchive"
            class="w-full py-3 bg-[#10b981] hover:bg-[#059669] active:translate-x-[2px] active:translate-y-[2px] text-white rounded-xl border-2 border-slate-900 shadow-hard-sm hover:shadow-hard transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
          >
            <span>📦</span>
            <span>{{ $t('milestones.archiveToRelease') }}</span>
          </button>
          
          <button
            @click="handleViewMilestones"
            class="w-full py-2.5 bg-white hover:bg-slate-100 active:translate-x-[1px] active:translate-y-[1px] text-slate-900 rounded-xl border-2 border-slate-900 shadow-hard-sm transition-all cursor-pointer text-xs flex items-center justify-center gap-1.5"
          >
            <span>🏆</span>
            <span>{{ $t('milestones.viewAllBadges') }}</span>
          </button>
        </div>

        <p class="text-[10px] text-slate-500 font-mono leading-relaxed">
          {{ $t('projects.archiveTip') }}
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMilestoneStore } from '../stores/milestoneStore'
import { useProjectStore } from '../stores/projectStore'
import confetti from 'canvas-confetti'

const emit = defineEmits(['close', 'view-milestones'])

const milestoneStore = useMilestoneStore()
const projectStore = useProjectStore()

const isOpen = computed(() => milestoneStore.showCelebrationModal)
const project = computed(() => milestoneStore.celebratingProject)

const close = () => {
  milestoneStore.closeCelebration()
}

const handleArchive = async () => {
  if (project.value) {
    await projectStore.toggleArchive(project.value.id)
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 }
    })
  }
  close()
}

const handleViewMilestones = () => {
  close()
  emit('view-milestones')
}
</script>
