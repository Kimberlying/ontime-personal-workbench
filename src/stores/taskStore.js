import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import { supabase, isRealSupabaseConfigured, mockClient } from '../utils/supabase'
import { useAuthStore } from './authStore'
import { useProjectStore } from './projectStore'

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    loading: false,
    todayDecompositionsCount: 0,
  }),

  getters: {
    todayStr: () => dayjs().format('YYYY-MM-DD'),
    
    // Tasks assigned for today that are not yet completed
    todayPendingTasks: (state) => {
      const today = dayjs().format('YYYY-MM-DD')
      return state.tasks.filter(t => t.assigned_date === today && t.status === 'pending')
    },

    // Tasks completed today
    todayCompletedTasks: (state) => {
      const today = dayjs().format('YYYY-MM-DD')
      return state.tasks.filter(t => {
        if (t.status !== 'completed') return false
        if (t.completed_at && t.completed_at.startsWith(today)) return true
        return t.assigned_date === today
      })
    },

    // All completed tasks across time
    allCompletedTasks: (state) => {
      return state.tasks.filter(t => t.status === 'completed')
    },

    isTodayAllDone: (state) => {
      const today = dayjs().format('YYYY-MM-DD')
      const todayTasks = state.tasks.filter(t => t.assigned_date === today)
      return todayTasks.length > 0 && todayTasks.every(t => t.status === 'completed')
    },

    totalTodayCount: (state) => {
      const today = dayjs().format('YYYY-MM-DD')
      return state.tasks.filter(t => t.assigned_date === today).length
    },

    // Dynamic Urgency & Priority ranking for Push Bar
    pushTargets: (state) => {
      const today = dayjs().format('YYYY-MM-DD')
      const active = state.tasks.filter(t => t.status !== 'completed')

      const PRIO_RANK = { high: 0, mid: 1, low: 2 }

      const urgencyRank = (t) => {
        const due = t.due || t.assigned_date
        if (due && due < today) return 0 // Overdue
        if (due && due === today) return 1 // Due today
        if (due) {
          const diff = dayjs(due).diff(dayjs(today), 'day')
          if (diff >= 0 && diff <= 3) return 2 // Due in 3 days
        }
        return 3 // Normal
      }

      return active.slice().sort((a, b) => {
        const urga = urgencyRank(a)
        const urgb = urgencyRank(b)
        if (urga !== urgb) return urga - urgb

        const prioa = PRIO_RANK[a.priority] !== undefined ? PRIO_RANK[a.priority] : 1
        const priob = PRIO_RANK[b.priority] !== undefined ? PRIO_RANK[b.priority] : 1
        if (prioa !== priob) return prioa - priob

        const duea = a.due || a.assigned_date || '9999-99-99'
        const dueb = b.due || b.assigned_date || '9999-99-99'
        if (duea !== dueb) return duea.localeCompare(dueb)

        return (a.lastTouched || 0) - (b.lastTouched || 0)
      })
    },

    // All execution logs aggregated from tasks
    allTaskLogs: (state) => {
      const out = []
      state.tasks.forEach(t => {
        (t.logs || []).forEach(l => {
          out.push({
            at: l.at,
            text: l.text,
            taskId: t.id,
            taskTitle: t.title,
            projectId: t.project_id,
            kind: 'task'
          })
        })
      })
      return out.sort((a, b) => b.at - a.at)
    }
  },

  actions: {
    async fetchTasks() {
      this.loading = true
      try {
        if (isRealSupabaseConfigured && supabase) {
          const auth = useAuthStore()
          if (!auth.user) return

          const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', auth.user.id)
            .order('created_at', { ascending: false })

          if (data) this.tasks = data
          if (error) console.error('Error fetching tasks:', error)
        } else {
          this.tasks = mockClient.getTasks()
        }
        this.resetDailyTasksIfNeeded()
      } catch (err) {
        console.error('Failed to load tasks:', err)
      } finally {
        this.loading = false
      }
    },

    async addBatchScheduledTasks(tasksArray) {
      const auth = useAuthStore()
      this.todayDecompositionsCount++

      const preparedTasks = tasksArray.map(t => ({
        ...t,
        user_id: auth.user?.id || 'mock-user-001',
      }))

      if (isRealSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('tasks')
          .insert(preparedTasks)
          .select()

        if (error) throw error
        if (data) {
          this.tasks = [...data, ...this.tasks]
          return { success: true, tasks: data }
        }
      } else {
        const generatedTasks = preparedTasks.map((t, idx) => ({
          ...t,
          id: `task_${Date.now()}_${idx}`,
          created_at: new Date().toISOString(),
        }))
        this.tasks = [...generatedTasks, ...this.tasks]
        mockClient.setTasks(this.tasks)
        return { success: true, tasks: generatedTasks }
      }
    },

    async addTask(taskData) {
      const auth = useAuthStore()
      const newTask = {
        ...taskData,
        id: isRealSupabaseConfigured ? undefined : `task_${Date.now()}`,
        user_id: auth.user?.id || 'mock-user-001',
        created_at: new Date().toISOString(),
      }

      if (isRealSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('tasks')
          .insert([newTask])
          .select()
          .single()

        if (error) throw error
        if (data) this.tasks.unshift(data)
      } else {
        this.tasks.unshift(newTask)
        mockClient.setTasks(this.tasks)
      }
    },

    async toggleTaskStatus(taskId) {
      const task = this.tasks.find(t => t.id === taskId)
      if (!task) return

      const isCompleting = task.status !== 'completed'
      task.status = isCompleting ? 'completed' : 'pending'
      task.completed_at = isCompleting ? new Date().toISOString() : null

      if (isRealSupabaseConfigured && supabase) {
        await supabase
          .from('tasks')
          .update({
            status: task.status,
            completed_at: task.completed_at,
          })
          .eq('id', taskId)
      } else {
        mockClient.setTasks(this.tasks)
      }

      // Auto update linked project progress slightly if all project tasks are completing
      if (task.project_id) {
        const projectStore = useProjectStore()
        const proj = projectStore.projects.find(p => p.id === task.project_id)
        if (proj) {
          const projectTasks = this.tasks.filter(t => t.project_id === task.project_id)
          const completedProjectTasks = projectTasks.filter(t => t.status === 'completed')
          if (projectTasks.length > 0) {
            const calculatedProgress = Math.round((completedProjectTasks.length / projectTasks.length) * 100)
            projectStore.updateProgress(task.project_id, { progress: calculatedProgress })
          }
        }
      }
    },

    async addAttachment(taskId, fileMeta) {
      const auth = useAuthStore()
      const task = this.tasks.find(t => t.id === taskId)
      if (!task) return { success: false }

      if (!task.attachments) task.attachments = []
      task.attachments.push({
        id: `att_${Date.now()}`,
        name: fileMeta.name,
        size: fileMeta.size,
        url: fileMeta.url || URL.createObjectURL(fileMeta.rawFile || new Blob()),
        created_at: new Date().toISOString(),
      })

      // Increase used storage
      await auth.updateStorageUsage(fileMeta.size)

      if (isRealSupabaseConfigured && supabase) {
        await supabase
          .from('tasks')
          .update({ attachments: task.attachments })
          .eq('id', taskId)
      } else {
        mockClient.setTasks(this.tasks)
      }

      return { success: true }
    },

    async deleteTask(taskId) {
      const task = this.tasks.find(t => t.id === taskId)
      if (task && task.attachments && task.attachments.length > 0) {
        const auth = useAuthStore()
        const totalAttachmentBytes = task.attachments.reduce((sum, a) => sum + (a.size || 0), 0)
        await auth.updateStorageUsage(-totalAttachmentBytes)
      }

      this.tasks = this.tasks.filter(t => t.id !== taskId)

      if (isRealSupabaseConfigured && supabase) {
        await supabase.from('tasks').delete().eq('id', taskId)
      } else {
        mockClient.setTasks(this.tasks)
      }
    },

    async addLog(taskId, logText) {
      if (!logText || !logText.trim()) return
      const task = this.tasks.find(t => t.id === taskId)
      if (!task) return

      if (!task.logs) task.logs = []
      const newLog = { text: logText.trim(), at: Date.now() }
      task.logs.unshift(newLog)
      task.lastTouched = Date.now()

      if (isRealSupabaseConfigured && supabase) {
        await supabase.from('tasks').update({ logs: task.logs, lastTouched: task.lastTouched }).eq('id', taskId)
      } else {
        mockClient.setTasks(this.tasks)
      }
      return newLog
    },

    async toggleStep(taskId, stepIndex) {
      const task = this.tasks.find(t => t.id === taskId)
      if (!task || !task.steps || !task.steps[stepIndex]) return

      task.steps[stepIndex].done = !task.steps[stepIndex].done
      task.lastTouched = Date.now()

      // If all steps done, mark task done
      if (task.steps.length > 0 && task.steps.every(s => s.done)) {
        task.status = 'completed'
        task.completed_at = new Date().toISOString()
      } else if (task.steps.some(s => !s.done) && task.status === 'completed') {
        task.status = 'pending'
        task.completed_at = null
      }

      if (isRealSupabaseConfigured && supabase) {
        await supabase.from('tasks').update({
          steps: task.steps,
          status: task.status,
          completed_at: task.completed_at,
          lastTouched: task.lastTouched
        }).eq('id', taskId)
      } else {
        mockClient.setTasks(this.tasks)
      }
    },

    async toggleMilestone(taskId, milestoneIndex) {
      const task = this.tasks.find(t => t.id === taskId)
      if (!task || !task.milestones || !task.milestones[milestoneIndex]) return

      task.milestones[milestoneIndex].done = !task.milestones[milestoneIndex].done
      task.lastTouched = Date.now()

      if (task.milestones.length > 0 && task.milestones.every(m => m.done)) {
        task.status = 'completed'
        task.completed_at = new Date().toISOString()
      }

      if (isRealSupabaseConfigured && supabase) {
        await supabase.from('tasks').update({
          milestones: task.milestones,
          status: task.status,
          completed_at: task.completed_at,
          lastTouched: task.lastTouched
        }).eq('id', taskId)
      } else {
        mockClient.setTasks(this.tasks)
      }
    },

    // Daily 00:00 midnight habit reset
    resetDailyTasksIfNeeded() {
      const today = dayjs().format('YYYY-MM-DD')
      const lastReset = localStorage.getItem('orderly_last_daily_reset')
      if (lastReset === today) return false

      let changed = false
      this.tasks.forEach(t => {
        if (t.type === 'daily') {
          t.status = 'pending'
          t.completed_at = null
          t.starterDone = false
          if (t.steps) t.steps.forEach(s => s.done = false)
          changed = true
        }
      })

      localStorage.setItem('orderly_last_daily_reset', today)
      if (changed && !isRealSupabaseConfigured) {
        mockClient.setTasks(this.tasks)
      }
      return changed
    }
  }
})
