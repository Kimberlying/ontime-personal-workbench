<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Clean Header Summary Banner -->
    <div class="bg-white border-2 border-slate-900 rounded-2xl p-5 md:p-6 text-slate-900 shadow-hard relative overflow-hidden">
      <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#0d9488] text-white text-[10px] font-mono font-bold uppercase tracking-wider border border-slate-900 shadow-2xs">
            <span>✨</span>
            <span>MILESTONES</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            {{ $t('milestones.pageTitle') }}
          </h1>
          <p class="text-xs text-slate-600 font-medium leading-relaxed font-sans">
            {{ $t('milestones.pageSubtitle') }}
          </p>
        </div>

        <!-- Actions: Puppy & Growth Summary -->
        <div class="flex items-center gap-2 shrink-0">
          <button
            @click="milestoneStore.triggerPuppyCelebration()"
            class="px-3.5 py-2.5 bg-white hover:bg-amber-50 active:translate-x-[1px] active:translate-y-[1px] text-slate-900 font-mono font-bold text-xs rounded-xl border-2 border-slate-900 shadow-hard-sm hover:shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            title="让庆祝小狗出来互动打气！"
          >
            <span>🐕</span>
            <span>{{ isEn ? 'Call Doggie Cheer' : '呼唤庆祝小狗' }}</span>
          </button>

          <!-- Growth Summary Button (月度/季度成长复盘报告) -->
          <button
            @click="milestoneStore.openSummaryModal('monthly')"
            class="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 active:translate-x-[1px] active:translate-y-[1px] text-slate-900 font-mono font-black text-xs rounded-xl border-2 border-slate-900 shadow-hard-sm hover:shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>📊</span>
            <span>{{ $t('summary.btnTitle') }}</span>
          </button>
        </div>
      </div>

      <!-- 4 Core Metrics Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-5 relative z-10 font-mono">
        <div class="bg-slate-50 border-2 border-slate-900 rounded-xl p-3 shadow-2xs">
          <span class="text-[10px] text-slate-500 font-bold block font-sans">{{ $t('milestones.statShortProjects') }}</span>
          <div class="flex items-baseline gap-1 mt-0.5">
            <span class="text-xl font-black text-[#0d9488]">{{ stats.completedShortProjects }}</span>
            <span class="text-[10px] text-slate-400 font-bold">{{ isEn ? 'goals' : '个' }}</span>
          </div>
        </div>

        <div class="bg-slate-50 border-2 border-slate-900 rounded-xl p-3 shadow-2xs">
          <span class="text-[10px] text-slate-500 font-bold block font-sans">{{ $t('milestones.statLongProjects') }}</span>
          <div class="flex items-baseline gap-1 mt-0.5">
            <span class="text-xl font-black text-amber-600">{{ stats.completedLongProjects }}</span>
            <span class="text-[10px] text-slate-400 font-bold">{{ isEn ? 'goals' : '个' }}</span>
          </div>
        </div>

        <div class="bg-slate-50 border-2 border-slate-900 rounded-xl p-3 shadow-2xs">
          <span class="text-[10px] text-slate-500 font-bold block font-sans">{{ $t('milestones.statTasks') }}</span>
          <div class="flex items-baseline gap-1 mt-0.5">
            <span class="text-xl font-black text-emerald-600">{{ stats.totalCompletedTasks }}</span>
            <span class="text-[10px] text-slate-400 font-bold">{{ isEn ? 'tasks' : '项' }}</span>
          </div>
        </div>

        <div class="bg-slate-50 border-2 border-slate-900 rounded-xl p-3 shadow-2xs">
          <span class="text-[10px] text-slate-500 font-bold block font-sans">{{ $t('milestones.statDays') }}</span>
          <div class="flex items-baseline gap-1 mt-0.5">
            <span class="text-xl font-black text-rose-600">{{ stats.focusDays }}</span>
            <span class="text-[10px] text-slate-400 font-bold">{{ isEn ? 'days' : '天' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Milestones Wall Section -->
    <div class="space-y-3.5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b-2 border-slate-900 pb-2">
        <div class="flex items-center gap-2">
          <h2 class="text-base font-black text-slate-900 tracking-tight">
            {{ $t('milestones.badgeWallTitle') }}
          </h2>
          <span class="text-[11px] text-slate-500 font-mono font-bold">
            ({{ milestoneStore.unlockedCount }} / {{ milestoneStore.totalBadgesCount }})
          </span>
        </div>
        
        <!-- Category Filter Tabs -->
        <div class="flex items-center gap-1 bg-white p-0.5 rounded-xl border-2 border-slate-900 shadow-2xs text-[11px] font-mono font-bold overflow-x-auto">
          <button
            @click="selectedCategory = 'all'"
            class="px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            :class="selectedCategory === 'all' ? 'bg-[#0d9488] text-white font-black' : 'text-slate-600 hover:text-slate-900'"
          >
            {{ isEn ? 'All' : '全部' }}
          </button>
          <button
            @click="selectedCategory = 'time'"
            class="px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            :class="selectedCategory === 'time' ? 'bg-rose-500 text-white font-black' : 'text-slate-600 hover:text-slate-900'"
          >
            {{ isEn ? 'Time Horizons' : '时间里程碑' }}
          </button>
          <button
            @click="selectedCategory = 'short'"
            class="px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            :class="selectedCategory === 'short' ? 'bg-[#0d9488] text-white font-black' : 'text-slate-600 hover:text-slate-900'"
          >
            {{ isEn ? 'Short-term' : '短期攻坚' }}
          </button>
          <button
            @click="selectedCategory = 'long'"
            class="px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            :class="selectedCategory === 'long' ? 'bg-amber-400 text-slate-900 font-black' : 'text-slate-600 hover:text-slate-900'"
          >
            {{ isEn ? 'Long-term' : '长期战略' }}
          </button>
          <button
            @click="selectedCategory = 'task'"
            class="px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            :class="selectedCategory === 'task' ? 'bg-emerald-600 text-white font-black' : 'text-slate-600 hover:text-slate-900'"
          >
            {{ isEn ? 'Tasks' : '待办突破' }}
          </button>
        </div>
      </div>

      <!-- Milestones Grid (Clean 4-column layout) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div
          v-for="badge in filteredBadges"
          :key="badge.id"
          class="rounded-xl p-3.5 border-2 border-slate-900 transition-all duration-200 flex flex-col justify-between"
          :class="badge.unlocked 
            ? 'bg-white shadow-[3px_3px_0px_0px_#0d9488] hover:-translate-y-0.5' 
            : 'bg-slate-50 shadow-2xs opacity-85'"
        >
          <!-- Badge Icon & Info -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <div 
                class="w-9 h-9 rounded-lg border-2 border-slate-900 flex items-center justify-center text-lg shadow-2xs shrink-0"
                :class="badge.unlocked ? 'bg-amber-300 text-slate-900' : 'bg-slate-200 text-slate-400 grayscale'"
              >
                {{ badge.icon }}
              </div>
              <span 
                class="text-[9px] px-1.5 py-0.5 rounded font-mono font-black uppercase border border-slate-900"
                :class="badge.unlocked ? 'bg-emerald-100 text-emerald-950' : 'bg-slate-200 text-slate-600'"
              >
                {{ badge.unlocked ? $t('milestones.unlocked') : $t('milestones.locked') }}
              </span>
            </div>

            <div>
              <h3 class="font-black text-xs text-slate-900 leading-tight">
                {{ isEn ? badge.titleEn : badge.titleZh }}
              </h3>
              <p class="text-[11px] text-slate-500 mt-1 leading-snug line-clamp-2">
                {{ isEn ? badge.descEn : badge.descZh }}
              </p>
            </div>
          </div>

          <!-- Progress Bar if Locked -->
          <div class="pt-2.5 mt-2 border-t border-slate-200">
            <div v-if="badge.unlocked" class="flex items-center gap-1 text-[10px] font-mono font-bold text-[#0d9488]">
              <span>✓</span>
              <span>{{ $t('milestones.achieved') }}</span>
            </div>
            <div v-else class="space-y-0.5 font-mono">
              <div class="flex justify-between text-[9px] font-bold text-slate-500">
                <span>{{ $t('projects.currentProgress') }}</span>
                <span>{{ Math.min(stats[badge.currentKey] || 0, badge.target) }} / {{ badge.target }}</span>
              </div>
              <div class="w-full bg-slate-200 h-1.5 rounded-md border border-slate-900 overflow-hidden">
                <div 
                  class="bg-[#0d9488] h-full transition-all"
                  :style="{ width: `${Math.min(100, ((stats[badge.currentKey] || 0) / badge.target) * 100)}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMilestoneStore, BADGE_DEFINITIONS } from '../stores/milestoneStore'
import { useProjectStore } from '../stores/projectStore'
import { useTaskStore } from '../stores/taskStore'

const { t, locale } = useI18n()
const milestoneStore = useMilestoneStore()
const projectStore = useProjectStore()
const taskStore = useTaskStore()

const isEn = computed(() => locale.value === 'en')
const selectedCategory = ref('all') // 'all' | 'long' | 'habit' | 'short' | 'task'

const stats = ref({
  completedShortProjects: 0,
  completedLongProjects: 0,
  archivedProjects: 0,
  focusDays: 1,
  totalCompletedTasks: 0,
})

const badgesList = computed(() => {
  return BADGE_DEFINITIONS.map(b => ({
    ...b,
    unlocked: milestoneStore.unlockedBadgeIds.includes(b.id),
  }))
})

const filteredBadges = computed(() => {
  if (selectedCategory.value === 'all') return badgesList.value
  return badgesList.value.filter(b => b.category === selectedCategory.value)
})

onMounted(() => {
  stats.value = milestoneStore.checkStatsAndBadges(projectStore.projects, taskStore.tasks)
})
</script>
