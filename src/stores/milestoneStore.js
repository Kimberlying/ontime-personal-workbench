import { defineStore } from 'pinia'
import dayjs from 'dayjs'

const STORAGE_KEY = 'orderly_milestones'

export const BADGE_DEFINITIONS = [
  // 1. 时间周期里程碑 (Time Horizon Milestones - 7天, 1月, 2月, 1季度, 半年, 1年, 2年, 3年, 5年)
  {
    id: 'focus_7_days',
    category: 'time',
    icon: '🔥',
    titleZh: '黄金周律 · 7天',
    titleEn: 'Golden Cadence (7 Days)',
    descZh: '累计 7 天稳定推进，完全掌握工作节奏自主权',
    descEn: 'Active focus for 7 days. You are fully in control of your cadence!',
    target: 7,
    currentKey: 'focusDays',
  },
  {
    id: 'focus_30_days',
    category: 'time',
    icon: '🗓️',
    titleZh: '满月之约 · 1个月 (30天)',
    titleEn: 'Moon Horizon · 1 Month',
    descZh: '累计专注推进 30 天 / 1 个月，让从容如期融入呼吸',
    descEn: 'Active focus for 30 days (1 month). Habit solidified!',
    target: 30,
    currentKey: 'focusDays',
  },
  {
    id: 'focus_60_days',
    category: 'time',
    icon: '⏳',
    titleZh: '双月稳进 · 2个月 (60天)',
    titleEn: 'Dual-Month · 2 Months',
    descZh: '累计专注推进 60 天 / 2 个月，波澜不惊，基石稳固',
    descEn: 'Active focus for 60 days (2 months). Solid foundation built!',
    target: 60,
    currentKey: 'focusDays',
  },
  {
    id: 'focus_90_days',
    category: 'time',
    icon: '🌟',
    titleZh: '季度成势 · 1季度 (90天)',
    titleEn: 'Quarterly Milestone · 1 Quarter',
    descZh: '累计专注推进 90 天 / 1 个季度，见证从量变到质变的蜕变',
    descEn: 'Active focus for 90 days (1 full quarter). True transformation!',
    target: 90,
    currentKey: 'focusDays',
  },
  {
    id: 'focus_180_days',
    category: 'time',
    icon: '🦅',
    titleZh: '半载蓄力 · 半年 (180天)',
    titleEn: 'Half-Year Cadence · Half Year',
    descZh: '累计专注推进 180 天 / 半年，高瞻远瞩，积淀深厚',
    descEn: 'Active focus for 180 days (half year). Enduring momentum!',
    target: 180,
    currentKey: 'focusDays',
  },
  {
    id: 'focus_365_days',
    category: 'time',
    icon: '👑',
    titleZh: '年度大成 · 1年 (365天)',
    titleEn: 'Annual Grand Slam · 1 Year',
    descZh: '累计专注推进 365 天 / 整整 1 年！万事皆如期',
    descEn: 'Active focus for 365 days (1 full year). Supreme mastery!',
    target: 365,
    currentKey: 'focusDays',
  },
  {
    id: 'focus_730_days',
    category: 'time',
    icon: '🗡️',
    titleZh: '两载深耕 · 2年 (730天)',
    titleEn: 'Two-Year Forge · 2 Years',
    descZh: '累计专注推进 730 天 / 整整 2 年！宝剑锋从磨砺出，沉着自若',
    descEn: 'Active focus for 730 days (2 full years). Deep craftsmanship forged!',
    target: 730,
    currentKey: 'focusDays',
  },
  {
    id: 'focus_1095_days',
    category: 'time',
    icon: '🏔️',
    titleZh: '三载如一 · 3年 (1095天)',
    titleEn: 'Three-Year Mastery · 3 Years',
    descZh: '累计专注推进 1095 天 / 整整 3 年！千帆过尽，初心不改',
    descEn: 'Active focus for 1095 days (3 full years). Unshakable strategic power!',
    target: 1095,
    currentKey: 'focusDays',
  },
  {
    id: 'focus_1825_days',
    category: 'time',
    icon: '🌌',
    titleZh: '五载基业 · 5年 (1825天)',
    titleEn: 'Five-Year Milestone · 5 Years',
    descZh: '累计专注推进 1825 天 / 整整 5 年！五年铸就终身宗师级交付基业',
    descEn: 'Active focus for 1825 days (5 full years). Master builder for a lifetime!',
    target: 1825,
    currentKey: 'focusDays',
  },

  // 2. 短期敏捷攻坚 (Short-term Sprints - 1, 3, 5, 10, 20, 50)
  {
    id: 'first_goal',
    category: 'short',
    icon: '🚀',
    titleZh: '启航者 · 1个短期',
    titleEn: 'First Horizon (1 Sprint)',
    descZh: '成功结项第 1 个短期项目，迈出清晰有序的第一步',
    descEn: 'Completed your very first short-term goal. Great start!',
    target: 1,
    currentKey: 'completedShortProjects',
  },
  {
    id: 'sprint_master_3',
    category: 'short',
    icon: '⚡',
    titleZh: '敏捷攻坚 · 3个短期',
    titleEn: 'Sprint Master (3 Sprints)',
    descZh: '累计结项 3 个短期项目，形成自如的日常推进手感',
    descEn: 'Completed 3 short-term projects. Solid rhythm established!',
    target: 3,
    currentKey: 'completedShortProjects',
  },
  {
    id: 'sprint_master_5',
    category: 'short',
    icon: '🎯',
    titleZh: '卓越执行 · 5个短期',
    titleEn: 'Excellence Pro (5 Sprints)',
    descZh: '累计结项 5 个短期项目，精准把控任务交付节点',
    descEn: 'Completed 5 short-term projects. Precision execution!',
    target: 5,
    currentKey: 'completedShortProjects',
  },
  {
    id: 'sprint_master_10',
    category: 'short',
    icon: '🏆',
    titleZh: '效率统领 · 10个短期',
    titleEn: 'Efficiency Commander (10 Sprints)',
    descZh: '累计结项 10 个短期项目，具备卓越的目标落地掌控力',
    descEn: 'Completed 10 short-term projects. Outstanding execution power!',
    target: 10,
    currentKey: 'completedShortProjects',
  },
  {
    id: 'sprint_master_20',
    category: 'short',
    icon: '👑',
    titleZh: '敏捷大师 · 20个短期',
    titleEn: 'Agile Master (20 Sprints)',
    descZh: '累计结项 20 个短期项目，高频冲刺游刃有余',
    descEn: 'Completed 20 short-term projects. Master of rapid iterations!',
    target: 20,
    currentKey: 'completedShortProjects',
  },
  {
    id: 'sprint_master_50',
    category: 'short',
    icon: '🌌',
    titleZh: '极速传奇 · 50个短期',
    titleEn: 'Sprint Legend (50 Sprints)',
    descZh: '累计结项 50 个短期项目，行动如风，所向披靡',
    descEn: 'Completed 50 short-term projects. Legendary delivery speed!',
    target: 50,
    currentKey: 'completedShortProjects',
  },

  // 3. 长期战略里程碑 (Long-term Strategy Milestones - 1, 3, 5, 10, 20)
  {
    id: 'horizon_pioneer_1',
    category: 'long',
    icon: '🌱',
    titleZh: '破浪初见 · 1个长期',
    titleEn: 'Horizon Pioneer (1 Goal)',
    descZh: '成功完成第 1 个长期战略项目，恒心见繁花',
    descEn: 'Finished your first long-term strategic goal. Consistency wins!',
    target: 1,
    currentKey: 'completedLongProjects',
  },
  {
    id: 'horizon_pioneer_3',
    category: 'long',
    icon: '🌳',
    titleZh: '稳扎稳打 · 3个长期',
    titleEn: 'Grand Visionary (3 Goals)',
    descZh: '累计结项 3 个长期战略项目，展现战略级的恒心与耐力',
    descEn: 'Completed 3 long-term projects. Master of long-range vision!',
    target: 3,
    currentKey: 'completedLongProjects',
  },
  {
    id: 'horizon_pioneer_5',
    category: 'long',
    icon: '🏔️',
    titleZh: '战略掌舵人 · 5个长期',
    titleEn: 'Strategic Helmsman (5 Goals)',
    descZh: '累计结项 5 个长期战略项目，具备从容统揽全局的气魄',
    descEn: 'Completed 5 long-term projects. Pillar of strategic strength!',
    target: 5,
    currentKey: 'completedLongProjects',
  },
  {
    id: 'horizon_pioneer_10',
    category: 'long',
    icon: '🏛️',
    titleZh: '筑城宗师 · 10个长期',
    titleEn: 'Master Builder (10 Goals)',
    descZh: '累计结项 10 个长期战略项目，铸就基业长青的交付壁垒',
    descEn: 'Completed 10 long-term projects. True master builder!',
    target: 10,
    currentKey: 'completedLongProjects',
  },
  {
    id: 'horizon_pioneer_20',
    category: 'long',
    icon: '👑',
    titleZh: '战略传奇 · 20个长期',
    titleEn: 'Strategic Legend (20 Goals)',
    descZh: '累计结项 20 个长期战略项目，千锤百炼，战略终极传奇',
    descEn: 'Completed 20 strategic projects. Ultimate legendary mastery!',
    target: 20,
    currentKey: 'completedLongProjects',
  },

  // 4. 任务与微步执行突破 (Task Volume & Execution)
  {
    id: 'task_volume_10',
    category: 'task',
    icon: '📝',
    titleZh: '步履生花 · 10项待办',
    titleEn: 'Micro Momentum (10 Tasks)',
    descZh: '累计打勾完成 10 项微步任务，享受每日小确幸',
    descEn: 'Completed 10 micro-step tasks. Savoring daily progress!',
    target: 10,
    currentKey: 'totalCompletedTasks',
  },
  {
    id: 'task_volume_50',
    category: 'task',
    icon: '🔨',
    titleZh: '千锤百炼 · 50项待办',
    titleEn: 'Steady Forge (50 Tasks)',
    descZh: '累计打勾完成 50 项微步任务，积跬步以至千里',
    descEn: 'Completed 50 daily tasks. Moving mountains step by step!',
    target: 50,
    currentKey: 'totalCompletedTasks',
  },
  {
    id: 'task_volume_100',
    category: 'task',
    icon: '💎',
    titleZh: '百炼成钢 · 100项待办',
    titleEn: 'Century Achiever (100 Tasks)',
    descZh: '累计打勾完成 100 项微步任务，执行力坚如磐石',
    descEn: 'Completed 100 daily tasks. Diamond-solid execution habit!',
    target: 100,
    currentKey: 'totalCompletedTasks',
  },

  // 5. 归档与秩序 (Orderly & Clean Workspace)
  {
    id: 'clarity_master',
    category: 'organize',
    icon: '📦',
    titleZh: '断舍离 · 3个归档',
    titleEn: 'Clarity Virtuoso (3 Archived)',
    descZh: '累计归档 3 个已完成项目，保持工作台干净有序',
    descEn: 'Archived 3 completed projects. Keeping your workspace focused.',
    target: 3,
    currentKey: 'archivedProjects',
  },
]

export const useMilestoneStore = defineStore('milestones', {
  state: () => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    return {
      unlockedBadgeIds: saved.unlockedBadgeIds || ['first_goal', 'task_volume_10'],
      celebratingProject: null,
      showCelebrationModal: false,
      showSummaryModal: false,
      showPuppyCelebration: false,
      puppyMessage: '',
      summaryPeriod: 'monthly', // 'monthly' | 'quarterly' | 'yearly'
    }
  },

  getters: {
    badges: (state) => {
      return BADGE_DEFINITIONS.map(b => ({
        ...b,
        unlocked: state.unlockedBadgeIds.includes(b.id),
      }))
    },
    unlockedCount: (state) => state.unlockedBadgeIds.length,
    totalBadgesCount: () => BADGE_DEFINITIONS.length,
  },

  actions: {
    saveMilestones() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        unlockedBadgeIds: this.unlockedBadgeIds,
      }))
    },

    triggerCelebration(project) {
      this.celebratingProject = project
      this.showCelebrationModal = true
      this.triggerPuppyCelebration(`汪汪！恭喜主人项目「${project?.name || ''}」100% 达成结项！🐾🎉`)
    },

    closeCelebration() {
      this.showCelebrationModal = false
      this.celebratingProject = null
    },

    triggerPuppyCelebration(message = '') {
      this.puppyMessage = message
      this.showPuppyCelebration = true
    },

    closePuppyCelebration() {
      this.showPuppyCelebration = false
      this.puppyMessage = ''
    },

    openSummaryModal(period = 'monthly') {
      this.summaryPeriod = period
      this.showSummaryModal = true
    },

    closeSummaryModal() {
      this.showSummaryModal = false
    },

    checkStatsAndBadges(projects = [], tasks = []) {
      const completedShortProjects = projects.filter(p => p.type === 'short' && (p.progress >= 100 || p.is_archived)).length
      const completedLongProjects = projects.filter(p => p.type === 'long' && (p.progress >= 100 || p.is_archived)).length
      const archivedProjects = projects.filter(p => p.is_archived).length
      
      // Calculate active days with completed tasks
      const completedTasks = tasks.filter(t => t.status === 'completed')
      const activeDaysSet = new Set(completedTasks.map(t => (t.completed_at || t.assigned_date || '').split('T')[0]).filter(Boolean))
      const focusDays = Math.max(activeDaysSet.size, 1)

      const currentStats = {
        completedShortProjects,
        completedLongProjects,
        archivedProjects,
        focusDays,
        totalCompletedTasks: completedTasks.length,
      }

      // Check unlocks
      let newlyUnlocked = false
      let latestUnlockedBadge = null
      for (const b of BADGE_DEFINITIONS) {
        const val = currentStats[b.currentKey] || 0
        if (val >= b.target && !this.unlockedBadgeIds.includes(b.id)) {
          this.unlockedBadgeIds.push(b.id)
          newlyUnlocked = true
          latestUnlockedBadge = b
        }
      }

      if (newlyUnlocked) {
        this.saveMilestones()
        if (latestUnlockedBadge) {
          this.triggerPuppyCelebration(`汪！主人解锁了全新里程碑【${latestUnlockedBadge.titleZh}】！太棒啦！✨`)
        }
      }

      return currentStats
    }
  }
})
