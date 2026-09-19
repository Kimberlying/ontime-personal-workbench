import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import zh from './locales/zh.json'
import en from './locales/en.json'
import './styles/index.css'

const savedLocale = localStorage.getItem('orderly_locale') || 'zh'

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'zh',
  messages: {
    zh,
    en,
  },
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)

app.mount('#app')

// ==========================================
// Expose window.Workbench programmatic API
// ==========================================
import { useTaskStore } from './stores/taskStore'
import { useProjectStore } from './stores/projectStore'
import { parseSmartText } from './utils/markdownParser'

window.Workbench = {
  version: '2.0',
  getState: () => {
    const taskStore = useTaskStore()
    const projectStore = useProjectStore()
    return {
      tasks: JSON.parse(JSON.stringify(taskStore.tasks)),
      projects: JSON.parse(JSON.stringify(projectStore.projects)),
      goals: JSON.parse(JSON.stringify(projectStore.goals)),
      notes: JSON.parse(JSON.stringify(projectStore.notes)),
    }
  },
  getTasks: () => JSON.parse(JSON.stringify(useTaskStore().tasks)),
  getProjects: () => JSON.parse(JSON.stringify(useProjectStore().projects)),
  getGoals: () => JSON.parse(JSON.stringify(useProjectStore().goals)),
  getNotes: () => JSON.parse(JSON.stringify(useProjectStore().notes)),
  getLogs: () => {
    const taskStore = useTaskStore()
    const projectStore = useProjectStore()
    const logs = []
    taskStore.tasks.forEach(t => (t.logs || []).forEach(l => logs.push({ ...l, taskId: t.id, taskTitle: t.title, kind: 'task' })))
    projectStore.goals.forEach(g => (g.logs || []).forEach(l => logs.push({ ...l, taskId: g.id, taskTitle: g.title, kind: 'goal' })))
    return logs.sort((a, b) => b.at - a.at)
  },
  addTask: (taskData) => useTaskStore().addTask(taskData),
  addGoal: (goalData) => useProjectStore().addGoal(goalData),
  addNote: (noteData) => useProjectStore().addNote(noteData),
  log: (taskId, text) => useTaskStore().addLog(taskId, text),
  importText: (text) => parseSmartText(text),
}
