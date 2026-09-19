import { defineStore } from 'pinia'
import { supabase, isRealSupabaseConfigured, mockClient } from '../utils/supabase'
import { useAuthStore } from './authStore'

export const useProjectStore = defineStore('projects', {
  state: () => ({
    projects: [],
    members: [],
    goals: [],
    notes: [],
    loading: false,
    selectedProjectId: null,
  }),

  getters: {
    activeProjects: (state) => state.projects.filter(p => !p.is_archived),
    archivedProjects: (state) => state.projects.filter(p => p.is_archived),
    shortTermProjects: (state) => state.projects.filter(p => !p.is_archived && p.type === 'short'),
    longTermProjects: (state) => state.projects.filter(p => !p.is_archived && p.type === 'long'),
    activeCount: (state) => state.projects.filter(p => !p.is_archived).length,
    activeGoals: (state) => state.goals.filter(g => !g.done),
    canAddMore: () => true,
    maxAllowedProjects: () => Infinity,
  },

  actions: {
    async fetchProjects() {
      this.loading = true
      try {
        if (isRealSupabaseConfigured && supabase) {
          const auth = useAuthStore()
          if (!auth.user) return

          const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('user_id', auth.user.id)
            .order('created_at', { ascending: false })

          if (data) this.projects = data
          if (error) console.error('Error fetching projects:', error)

          const { data: memberData } = await supabase
            .from('project_members')
            .select('*')
          if (memberData) this.members = memberData
        } else {
          this.projects = mockClient.getProjects()
          this.members = mockClient.getMembers()
        }
        this.goals = mockClient.getGoals()
        this.notes = mockClient.getNotes()
      } catch (err) {
        console.error('Failed to load projects:', err)
      } finally {
        this.loading = false
      }
    },

    async createProject({ name, deadline, type = 'short', next_step = '', initialProgress = 0 }) {
      const auth = useAuthStore()

      const newProject = {
        id: isRealSupabaseConfigured ? undefined : `proj_${Date.now()}`,
        user_id: auth.user?.id || 'mock-user-001',
        name,
        deadline,
        type,
        progress: initialProgress,
        next_step: next_step || '方案启动与第一阶段推进',
        is_archived: false,
        created_at: new Date().toISOString(),
      }

      try {
        if (isRealSupabaseConfigured && supabase) {
          const { data, error } = await supabase
            .from('projects')
            .insert([newProject])
            .select()
            .single()

          if (error) throw error
          if (data) {
            this.projects.unshift(data)
            return { success: true, project: data }
          }
        } else {
          this.projects.unshift(newProject)
          mockClient.setProjects(this.projects)
          return { success: true, project: newProject }
        }
      } catch (err) {
        console.error('Failed to create project:', err)
        return { success: false, error: err.message }
      }
    },

    async updateProgress(projectId, { progress, next_step }) {
      const proj = this.projects.find(p => p.id === projectId)
      if (proj) {
        if (progress !== undefined) proj.progress = Number(progress)
        if (next_step !== undefined) proj.next_step = next_step
      }

      if (isRealSupabaseConfigured && supabase) {
        await supabase
          .from('projects')
          .update({ progress, next_step, updated_at: new Date().toISOString() })
          .eq('id', projectId)
      } else {
        mockClient.setProjects(this.projects)
      }
    },

    async toggleArchive(projectId) {
      const proj = this.projects.find(p => p.id === projectId)
      if (!proj) return

      const newArchived = !proj.is_archived
      proj.is_archived = newArchived

      if (isRealSupabaseConfigured && supabase) {
        await supabase
          .from('projects')
          .update({ is_archived: newArchived, updated_at: new Date().toISOString() })
          .eq('id', projectId)
      } else {
        mockClient.setProjects(this.projects)
      }
      return true
    },

    async deleteProject(projectId) {
      this.projects = this.projects.filter(p => p.id !== projectId)
      if (isRealSupabaseConfigured && supabase) {
        await supabase.from('projects').delete().eq('id', projectId)
      } else {
        mockClient.setProjects(this.projects)
      }
    },

    async inviteMember(projectId, memberEmail) {
      const newMember = {
        id: isRealSupabaseConfigured ? undefined : `mem_${Date.now()}`,
        project_id: projectId,
        member_email: memberEmail,
        role: 'editor',
        created_at: new Date().toISOString(),
      }

      if (isRealSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('project_members')
          .insert([newMember])
          .select()
          .single()
        if (data) this.members.push(data)
        if (error) return { success: false, error: error.message }
      } else {
        this.members.push(newMember)
        mockClient.setMembers(this.members)
      }
      return { success: true }
    },

    exportCsv(allTasks = []) {
      // Generate CSV string
      const headers = ['项目名称', '类型', '截止日期', '完成进度(%)', '下一步行动', '是否归档', '关联任务数']
      const rows = this.projects.map(p => {
        const pTasks = allTasks.filter(t => t.project_id === p.id)
        return [
          `"${p.name.replace(/"/g, '""')}"`,
          p.type === 'short' ? '短期项目' : '长期项目',
          p.deadline || '',
          p.progress || 0,
          `"${(p.next_step || '').replace(/"/g, '""')}"`,
          p.is_archived ? '已归档' : '进行中',
          pTasks.length,
        ]
      })

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', `工作台_项目数据_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      return true
    },

    // ==========================================
    // GOALS (目标倒推 SMART Backward)
    // ==========================================
    goalQuota(goal) {
      if (!goal) return { total: 0, done: 0, remaining: 0, daysLeft: 0, quota: 0 }
      const total = (goal.nodes || []).length
      const done = (goal.nodes || []).filter(n => n.done).length
      const remaining = total - done
      let daysLeft = 0
      if (goal.deadline) {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const d = new Date(goal.deadline)
        d.setHours(0, 0, 0, 0)
        daysLeft = Math.max(0, Math.round((d - today) / 86400000))
      }
      let quota = 0
      if (remaining > 0) {
        quota = daysLeft > 0 ? Math.ceil(remaining / daysLeft) : remaining
      }
      return { total, done, remaining, daysLeft, quota }
    },

    addGoal({ title, deadline, nodes = [] }) {
      if (!title || !title.trim()) return null
      const newGoal = {
        id: `goal_${Date.now()}`,
        title: title.trim(),
        deadline: deadline || '',
        nodes: nodes.map(n => typeof n === 'string' ? { text: n, done: false } : { text: n.text || '', done: !!n.done }),
        done: false,
        createdAt: Date.now(),
        logs: []
      }
      this.goals.unshift(newGoal)
      mockClient.setGoals(this.goals)
      return newGoal
    },

    toggleGoalNode(goalId, nodeIndex) {
      const g = this.goals.find(x => x.id === goalId)
      if (!g || !g.nodes || !g.nodes[nodeIndex]) return
      g.nodes[nodeIndex].done = !g.nodes[nodeIndex].done
      g.done = g.nodes.length > 0 && g.nodes.every(n => n.done)
      mockClient.setGoals(this.goals)
    },

    updateGoal(goalId, { title, deadline, nodes }) {
      const g = this.goals.find(x => x.id === goalId)
      if (!g) return
      if (title !== undefined) g.title = title.trim()
      if (deadline !== undefined) g.deadline = deadline
      if (nodes !== undefined) {
        g.nodes = nodes
        g.done = nodes.length > 0 && nodes.every(n => n.done)
      }
      mockClient.setGoals(this.goals)
    },

    deleteGoal(goalId) {
      this.goals = this.goals.filter(x => x.id !== goalId)
      mockClient.setGoals(this.goals)
    },

    addGoalLog(goalId, text) {
      const g = this.goals.find(x => x.id === goalId)
      if (!g || !text || !text.trim()) return
      if (!g.logs) g.logs = []
      const newLog = { text: text.trim(), at: Date.now() }
      g.logs.unshift(newLog)
      // Automatically complete the first undone node if any
      const firstUndone = (g.nodes || []).find(n => !n.done)
      if (firstUndone) firstUndone.done = true
      g.done = (g.nodes || []).length > 0 && g.nodes.every(n => n.done)
      mockClient.setGoals(this.goals)
      return newLog
    },

    // ==========================================
    // NOTES & PLANS (知识沉淀)
    // ==========================================
    addNote({ title, body, kind = 'note', projectId = null, tags = [] }) {
      const newNote = {
        id: `note_${Date.now()}`,
        kind: ['plan', 'note'].includes(kind) ? kind : 'note',
        title: (title || body?.slice(0, 40) || '未命名沉淀').trim(),
        body: (body || '').trim(),
        projectId: projectId || null,
        tags: Array.isArray(tags) ? tags : [],
        at: Date.now()
      }
      this.notes.unshift(newNote)
      mockClient.setNotes(this.notes)
      return newNote
    },

    updateNote(noteId, updateData) {
      const n = this.notes.find(x => x.id === noteId)
      if (!n) return
      if (updateData.title !== undefined) n.title = updateData.title.trim()
      if (updateData.body !== undefined) n.body = updateData.body.trim()
      if (updateData.kind !== undefined) n.kind = updateData.kind
      if (updateData.projectId !== undefined) n.projectId = updateData.projectId
      if (updateData.tags !== undefined) n.tags = updateData.tags
      mockClient.setNotes(this.notes)
    },

    deleteNote(noteId) {
      this.notes = this.notes.filter(x => x.id !== noteId)
      mockClient.setNotes(this.notes)
    }
  }
})
