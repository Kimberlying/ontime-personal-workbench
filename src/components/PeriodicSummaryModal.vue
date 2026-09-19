<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
    <div class="bg-white rounded-3xl shadow-[6px_6px_0px_0px_#0d9488] max-w-2xl w-full overflow-hidden border-2 border-slate-900 animate-pop-in flex flex-col max-h-[92vh]">
      
      <!-- Top Banner in Festive & Warm Sage/Amber -->
      <div class="p-6 border-b-2 border-slate-900 bg-[#f0fdfa] relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3.5 relative z-10">
          <div class="w-12 h-12 rounded-2xl bg-amber-400 border-2 border-slate-900 text-slate-900 flex items-center justify-center text-2xl shadow-hard-sm shrink-0">
            📊
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-black text-lg text-slate-900 tracking-tight">{{ periodTitle }}</h3>
              <span class="px-2 py-0.5 rounded-md bg-[#0d9488] text-white text-[10px] font-mono font-black border border-slate-900 shadow-2xs">
                {{ $t('summary.reviewBadge') }}
              </span>
            </div>
            <p class="text-xs text-slate-600 font-mono mt-0.5">{{ periodSubtitle }}</p>
          </div>
        </div>

        <!-- Period Switcher Tabs -->
        <div class="flex items-center bg-white p-1 rounded-xl border-2 border-slate-900 shadow-hard-sm text-xs font-mono font-bold shrink-0">
          <button
            @click="activePeriod = 'monthly'"
            class="px-2.5 py-1 rounded-lg transition-all cursor-pointer"
            :class="activePeriod === 'monthly' ? 'bg-[#0d9488] text-white font-black' : 'text-slate-600 hover:text-slate-900'"
          >
            {{ $t('summary.monthlyTab') }}
          </button>
          <button
            @click="activePeriod = 'quarterly'"
            class="px-2.5 py-1 rounded-lg transition-all cursor-pointer"
            :class="activePeriod === 'quarterly' ? 'bg-[#0d9488] text-white font-black' : 'text-slate-600 hover:text-slate-900'"
          >
            {{ $t('summary.quarterlyTab') }}
          </button>
          <button
            @click="activePeriod = 'yearly'"
            class="px-2.5 py-1 rounded-lg transition-all cursor-pointer"
            :class="activePeriod === 'yearly' ? 'bg-amber-400 text-slate-900 font-black' : 'text-slate-600 hover:text-slate-900'"
          >
            {{ $t('summary.yearlyTab') }}
          </button>
        </div>
      </div>

      <!-- Scrollable Review Body -->
      <div class="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
        
        <!-- 1. Warm Psychological Affirmation Box (正向激励评语) -->
        <div class="p-4 rounded-2xl bg-amber-50 border-2 border-slate-900 shadow-hard-sm space-y-1.5">
          <div class="flex items-center gap-1.5 text-xs font-black text-amber-900">
            <span>✨</span>
            <span>{{ affirmationHeadline }}</span>
          </div>
          <p class="text-slate-800 leading-relaxed font-sans text-xs">
            {{ affirmationText }}
          </p>
        </div>

        <!-- 2. Core Delivery Stats Grid (4 Metrics) -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
          <div class="bg-slate-50 border-2 border-slate-900 rounded-2xl p-3.5 shadow-hard-sm">
            <span class="text-[10px] text-slate-500 font-bold block font-sans">{{ $t('summary.statShort') }}</span>
            <div class="flex items-baseline gap-1 mt-1">
              <span class="text-2xl font-black text-[#0d9488]">{{ displayStats.shortProjects }}</span>
              <span class="text-xs text-slate-400">{{ isEn ? 'goals' : '个' }}</span>
            </div>
          </div>

          <div class="bg-slate-50 border-2 border-slate-900 rounded-2xl p-3.5 shadow-hard-sm">
            <span class="text-[10px] text-slate-500 font-bold block font-sans">{{ $t('summary.statLong') }}</span>
            <div class="flex items-baseline gap-1 mt-1">
              <span class="text-2xl font-black text-amber-600">{{ displayStats.longProjects }}</span>
              <span class="text-xs text-slate-400">{{ isEn ? 'goals' : '个' }}</span>
            </div>
          </div>

          <div class="bg-slate-50 border-2 border-slate-900 rounded-2xl p-3.5 shadow-hard-sm">
            <span class="text-[10px] text-slate-500 font-bold block font-sans">{{ $t('summary.statTasks') }}</span>
            <div class="flex items-baseline gap-1 mt-1">
              <span class="text-2xl font-black text-emerald-600">{{ displayStats.tasks }}</span>
              <span class="text-xs text-slate-400">{{ isEn ? 'items' : '项' }}</span>
            </div>
          </div>

          <div class="bg-slate-50 border-2 border-slate-900 rounded-2xl p-3.5 shadow-hard-sm">
            <span class="text-[10px] text-slate-500 font-bold block font-sans">{{ $t('summary.statRate') }}</span>
            <div class="flex items-baseline gap-1 mt-1">
              <span class="text-2xl font-black text-rose-600">98%</span>
              <span class="text-xs text-slate-400">{{ isEn ? 'on-time' : '如期' }}</span>
            </div>
          </div>
        </div>

        <!-- 3. Completed Strategic Projects List (本周期结项高光) -->
        <div class="space-y-3">
          <div class="flex items-center justify-between border-b-2 border-slate-900 pb-1.5">
            <h4 class="font-black text-xs text-slate-900 flex items-center gap-1.5">
              <span>🎯</span>
              <span>{{ $t('summary.completedListTitle', { count: completedProjects.length }) }}</span>
            </h4>
            <span class="text-[10px] font-mono text-slate-500 font-bold">100% DONE</span>
          </div>

          <div v-if="completedProjects.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div
              v-for="p in completedProjects"
              :key="p.id"
              class="p-3 bg-white border-2 border-slate-900 rounded-xl shadow-2xs flex items-center justify-between"
            >
              <div class="truncate pr-2">
                <span class="font-bold text-slate-900 block truncate text-xs">{{ p.name }}</span>
                <span class="text-[10px] text-slate-500 font-mono">{{ $t('projects.deadlineLabel') }}: {{ p.deadline }}</span>
              </div>
              <span class="px-2 py-0.5 rounded text-[10px] font-mono font-black border border-slate-900 shrink-0"
                    :class="p.type === 'long' ? 'bg-amber-200 text-amber-950' : 'bg-teal-100 text-teal-900'">
                {{ p.type === 'long' ? $t('app.longTermProjects') : $t('app.shortTermProjects') }}
              </span>
            </div>
          </div>

          <div v-else class="p-4 bg-slate-50 rounded-xl border border-slate-300 text-center text-slate-500 text-xs font-mono">
            {{ $t('summary.noCompleted') }}
          </div>
        </div>

        <!-- 4. High-Light Badges Unlocked in this period (斩获勋章) -->
        <div class="space-y-3">
          <div class="flex items-center justify-between border-b-2 border-slate-900 pb-1.5">
            <h4 class="font-black text-xs text-slate-900 flex items-center gap-1.5">
              <span>🏅</span>
              <span>{{ $t('summary.badgesEarnedTitle', { count: unlockedBadges.length }) }}</span>
            </h4>
            <span class="text-[10px] font-mono text-[#0d9488] font-bold">ACHIEVEMENTS</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div
              v-for="b in unlockedBadges.slice(0, 8)"
              :key="b.id"
              class="p-2.5 bg-white border-2 border-slate-900 rounded-xl shadow-2xs flex items-center gap-2"
            >
              <div class="w-8 h-8 rounded-lg bg-amber-300 border border-slate-900 text-base flex items-center justify-center shrink-0">
                {{ b.icon }}
              </div>
              <div class="truncate">
                <span class="font-black text-slate-900 text-[11px] block truncate">
                  {{ isEn ? b.titleEn : b.titleZh }}
                </span>
                <span class="text-[9px] text-slate-500 font-mono truncate block">
                  {{ isEn ? b.descEn : b.descZh }}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Modal Footer -->
      <div class="p-4 border-t-2 border-slate-900 bg-slate-50 flex items-center justify-between font-mono text-xs font-bold">
        <span class="text-slate-500 text-[11px]">
          // {{ isEn ? 'Clear Cadence · Deliver On Time' : '定下截止日 · 万事皆如期' }}
        </span>
        <div class="flex gap-2">
          <button
            @click="handleCopyReport"
            class="px-4 py-2 bg-white hover:bg-slate-100 active:translate-x-[1px] active:translate-y-[1px] text-slate-900 rounded-xl border-2 border-slate-900 shadow-hard-sm transition-all cursor-pointer flex items-center gap-1"
          >
            <span>📋</span>
            <span>{{ copySuccess ? $t('summary.copied') : $t('summary.copyReport') }}</span>
          </button>
          <button
            @click="close"
            class="px-5 py-2 bg-[#0d9488] hover:bg-[#0f766e] active:translate-x-[1px] active:translate-y-[1px] text-white rounded-xl border-2 border-slate-900 shadow-hard-sm hover:shadow-hard transition-all cursor-pointer"
          >
            {{ $t('summary.keepGoing') }}
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMilestoneStore, BADGE_DEFINITIONS } from '../stores/milestoneStore'
import { useProjectStore } from '../stores/projectStore'
import { useTaskStore } from '../stores/taskStore'
import confetti from 'canvas-confetti'

const { t, locale } = useI18n()
const milestoneStore = useMilestoneStore()
const projectStore = useProjectStore()
const taskStore = useTaskStore()

const isEn = computed(() => locale.value === 'en')
const activePeriod = ref('monthly') // 'monthly' | 'quarterly' | 'yearly'
const copySuccess = ref(false)

const isOpen = computed(() => milestoneStore.showSummaryModal)

const periodTitle = computed(() => {
  if (activePeriod.value === 'monthly') return t('summary.monthlyTitle')
  if (activePeriod.value === 'quarterly') return t('summary.quarterlyTitle')
  return t('summary.yearlyTitle')
})

const periodSubtitle = computed(() => {
  if (activePeriod.value === 'monthly') return t('summary.monthlySubtitle')
  if (activePeriod.value === 'quarterly') return t('summary.quarterlySubtitle')
  return t('summary.yearlySubtitle')
})

const affirmationHeadline = computed(() => {
  if (activePeriod.value === 'monthly') return t('summary.monthlyHeadline')
  if (activePeriod.value === 'quarterly') return t('summary.quarterlyHeadline')
  return t('summary.yearlyHeadline')
})

const affirmationText = computed(() => {
  const shortCount = projectStore.projects.filter(p => p.type === 'short' && (p.progress >= 100 || p.is_archived)).length
  const longCount = projectStore.projects.filter(p => p.type === 'long' && (p.progress >= 100 || p.is_archived)).length
  
  if (activePeriod.value === 'monthly') {
    return t('summary.monthlyQuote', { short: shortCount, long: longCount })
  }
  if (activePeriod.value === 'quarterly') {
    return t('summary.quarterlyQuote')
  }
  return t('summary.yearlyQuote')
})

const displayStats = computed(() => {
  const shortProjects = projectStore.projects.filter(p => p.type === 'short' && (p.progress >= 100 || p.is_archived)).length
  const longProjects = projectStore.projects.filter(p => p.type === 'long' && (p.progress >= 100 || p.is_archived)).length
  const tasks = taskStore.tasks.filter(t => t.status === 'completed').length

  return {
    shortProjects,
    longProjects,
    tasks,
  }
})

const completedProjects = computed(() => {
  return projectStore.projects.filter(p => p.progress >= 100 || p.is_archived)
})

const unlockedBadges = computed(() => {
  return BADGE_DEFINITIONS.filter(b => milestoneStore.unlockedBadgeIds.includes(b.id))
})

const close = () => {
  milestoneStore.closeSummaryModal()
}

const handleCopyReport = () => {
  const text = `【OnTime · ${periodTitle.value}】\n` +
    `🎯 ${t('summary.statShort')}: ${displayStats.value.shortProjects}\n` +
    `🏔️ ${t('summary.statLong')}: ${displayStats.value.longProjects}\n` +
    `✅ ${t('summary.statTasks')}: ${displayStats.value.tasks}\n` +
    `💡 ${affirmationText.value}\n\n` +
    `Generated by OnTime Workbench`

  navigator.clipboard.writeText(text).then(() => {
    copySuccess.value = true
    confetti({ particleCount: 30, spread: 40, origin: { y: 0.8 } })
    setTimeout(() => { copySuccess.value = false }, 3000)
  })
}
</script>
