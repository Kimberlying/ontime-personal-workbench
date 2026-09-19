<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
    <div class="bg-white rounded-2xl shadow-modal max-w-lg w-full overflow-hidden border border-slate-100 animate-pop-in">
      <!-- Header Banner -->
      <div class="bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 p-6 text-white text-center relative">
        <button 
          @click="close" 
          class="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl backdrop-blur">
          ⚡
        </div>
        <h3 class="text-xl font-bold tracking-tight">{{ $t('upgradeModal.title') }}</h3>
        <p class="text-xs text-indigo-100 mt-1 max-w-sm mx-auto">
          {{ reason || $t('upgradeModal.reachedLimit', { plan: auth.planType.toUpperCase() }) }}
        </p>
      </div>

      <!-- Body Content -->
      <div class="p-6 space-y-4">
        <div class="bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs space-y-2">
          <div class="flex justify-between items-center text-slate-600">
            <span>{{ $t('pricing.features.projects') }}:</span>
            <span class="font-semibold text-slate-800">{{ $t('upgradeModal.freeLimitSummary') }}</span>
          </div>
          <div class="flex justify-between items-center text-slate-600">
            <span>{{ $t('pricing.features.attachmentSize') }}:</span>
            <span class="font-semibold text-slate-800">{{ $t('upgradeModal.attachLimitSummary') }}</span>
          </div>
          <div class="flex justify-between items-center text-slate-600">
            <span>{{ $t('pricing.features.collaborators') }}:</span>
            <span class="font-semibold text-slate-800">{{ $t('upgradeModal.collabSummary') }}</span>
          </div>
          <div class="flex justify-between items-center text-slate-600">
            <span>{{ $t('pricing.features.csvExport') }}:</span>
            <span class="font-semibold text-slate-800">{{ $t('upgradeModal.exportSummary') }}</span>
          </div>
        </div>

        <div class="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            @click="goToPricing"
            class="flex-1 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
          >
            {{ $t('upgradeModal.viewPlans') }}
          </button>
          <button
            @click="handleInstantUpgrade"
            class="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <span>{{ auth.planType === 'pro' ? $t('upgradeModal.ultimateBtnText') : $t('upgradeModal.proBtnText') }}</span>
          </button>
        </div>

        <p class="text-[11px] text-center text-slate-400">
          {{ $t('upgradeModal.orArchive') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useProjectStore } from '../stores/projectStore'
import { useTaskStore } from '../stores/taskStore'
import confetti from 'canvas-confetti'

const router = useRouter()
const auth = useAuthStore()
const projectStore = useProjectStore()
const taskStore = useTaskStore()

const isOpen = computed(() => projectStore.showUpgradeModal || taskStore.showUpgradeModal)
const reason = computed(() => projectStore.upgradeModalReason || taskStore.upgradeModalReason)

const close = () => {
  projectStore.showUpgradeModal = false
  taskStore.showUpgradeModal = false
}

const goToPricing = () => {
  close()
  router.push('/pricing')
}

const handleInstantUpgrade = () => {
  const nextPlan = auth.planType === 'pro' ? 'ultimate' : 'pro'
  auth.setMockPlan(nextPlan)
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 }
  })
  close()
}
</script>
