<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Top Search & Stats Card -->
    <div class="bg-white rounded-2xl p-6 border-2 border-slate-900 shadow-hard space-y-4">
      <!-- Search & Main Actions -->
      <div class="flex items-center gap-3 flex-wrap">
        <div class="relative flex-1 min-w-[260px]">
          <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索任务、计划、复盘笔记、推进记录…"
            class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl focus:bg-white outline-none text-xs font-bold text-slate-900 transition-all"
          />
        </div>
        <button
          @click="openNewNoteModal"
          class="px-4 py-2.5 bg-[#0d9488] hover:bg-[#0f766e] active:translate-x-[1px] active:translate-y-[1px] text-white rounded-xl border-2 border-slate-900 font-bold font-mono text-xs shadow-hard-sm transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <span>+</span>
          <span>新建沉淀</span>
        </button>
        <button
          @click="exportMarkdown"
          class="px-4 py-2.5 bg-white hover:bg-slate-100 active:translate-x-[1px] active:translate-y-[1px] text-slate-900 rounded-xl border-2 border-slate-900 font-bold font-mono text-xs shadow-hard-sm transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <span>📥</span>
          <span>导出 Markdown 沉淀</span>
        </button>
      </div>

      <!-- Stats row -->
      <div class="flex items-center gap-4 sm:gap-6 flex-wrap text-xs font-mono text-slate-600 pt-1">
        <span>计划文档 <b class="text-[#0d9488]">{{ planCount }}</b> 份</span>
        <span>复盘笔记 <b class="text-[#0d9488]">{{ memoCount }}</b> 条</span>
        <span>推进记录 <b class="text-[#0d9488]">{{ allLogs.length }}</b> 条</span>
        <span>覆盖项目 <b class="text-[#0d9488]">{{ projectStore.projects.length }}</b> 个</span>
      </div>

      <!-- Project Filter Chips -->
      <div class="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100">
        <span class="text-xs font-mono text-slate-400 font-bold mr-1">项目:</span>
        <button
          @click="selectedProjectId = 'all'"
          class="px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer"
          :class="selectedProjectId === 'all' ? 'bg-teal-100 text-[#0d9488] border-slate-900 font-black' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-400'"
        >
          全部
        </button>
        <button
          v-for="p in projectStore.projects"
          :key="p.id"
          @click="selectedProjectId = p.id"
          class="px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5"
          :class="selectedProjectId === p.id ? 'bg-teal-100 text-[#0d9488] border-slate-900 font-black' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-400'"
        >
          <span class="w-2 h-2 rounded-full bg-[#0d9488]"></span>
          <span>{{ p.name }}</span>
        </button>
      </div>
    </div>

    <!-- Two Column Layout: Timeline (Left) & Notes/Memos (Right) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      <!-- LEFT: Timeline of Execution Logs (推进时间线) -->
      <div class="lg:col-span-7 bg-white rounded-2xl p-6 border-2 border-slate-900 shadow-hard space-y-4">
        <div class="flex items-center justify-between border-b-2 border-slate-900 pb-3">
          <h3 class="font-black text-base text-slate-900 flex items-center gap-2">
            <span>⏱️ 推进时间线</span>
            <span class="text-xs font-mono font-bold text-slate-400">流水账证据</span>
          </h3>
          <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-900">
            {{ filteredLogs.length }} 条
          </span>
        </div>

        <!-- Grouped Timeline Entries -->
        <div v-if="groupedLogs.length > 0" class="space-y-5 max-h-[600px] overflow-y-auto pr-2">
          <div v-for="group in groupedLogs" :key="group.date" class="space-y-2">
            <!-- Date header -->
            <div class="text-xs font-mono font-black text-slate-400 border-b border-slate-100 pb-1 flex items-center gap-2">
              <span>📅</span>
              <span>{{ group.date }}</span>
            </div>

            <!-- Entries -->
            <div class="space-y-2 pl-2 border-l-2 border-teal-200">
              <div
                v-for="(log, idx) in group.logs"
                :key="idx"
                class="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1 hover:border-[#0d9488] transition-colors"
              >
                <div class="flex items-center justify-between font-mono text-[11px] text-slate-500">
                  <span class="font-bold text-slate-700">{{ log.time }}</span>
                  <span class="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600 font-bold truncate max-w-[200px]">
                    {{ log.taskTitle || '任务推进' }}
                  </span>
                </div>
                <p class="font-bold text-slate-900 text-xs leading-relaxed">
                  {{ log.text }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12 text-slate-400 text-xs font-mono">
          暂无推进记录。做完任务或目标后使用「记录进度」，这里会自动按时间线汇总长出来。
        </div>
      </div>

      <!-- RIGHT: Knowledge Artifacts (沉淀：计划文档 & 复盘笔记) -->
      <div class="lg:col-span-5 bg-white rounded-2xl p-6 border-2 border-slate-900 shadow-hard space-y-4">
        <div class="flex items-center justify-between border-b-2 border-slate-900 pb-3">
          <h3 class="font-black text-base text-slate-900 flex items-center gap-2">
            <span>📚 沉淀</span>
            <span class="text-xs font-mono font-bold text-slate-400">计划与复盘</span>
          </h3>
          <div class="flex items-center gap-1 font-mono text-[11px]">
            <button
              @click="selectedKind = 'all'"
              class="px-2 py-0.5 rounded border cursor-pointer"
              :class="selectedKind === 'all' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 border-transparent hover:bg-slate-100'"
            >
              全部 ({{ projectStore.notes.length }})
            </button>
            <button
              @click="selectedKind = 'plan'"
              class="px-2 py-0.5 rounded border cursor-pointer"
              :class="selectedKind === 'plan' ? 'bg-[#0d9488] text-white font-bold' : 'text-slate-600 border-transparent hover:bg-slate-100'"
            >
              计划 ({{ planCount }})
            </button>
            <button
              @click="selectedKind = 'note'"
              class="px-2 py-0.5 rounded border cursor-pointer"
              :class="selectedKind === 'note' ? 'bg-slate-700 text-white font-bold' : 'text-slate-600 border-transparent hover:bg-slate-100'"
            >
              复盘 ({{ memoCount }})
            </button>
          </div>
        </div>

        <!-- Notes List -->
        <div v-if="filteredNotes.length > 0" class="space-y-3 max-h-[600px] overflow-y-auto pr-1">
          <div
            v-for="note in filteredNotes"
            :key="note.id"
            class="p-4 bg-slate-50 rounded-xl border-2 border-slate-900 shadow-hard-sm space-y-2 text-xs"
          >
            <!-- Note Header -->
            <div class="flex items-start justify-between gap-2">
              <div class="space-y-1 flex-1 min-w-0">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span
                    class="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border"
                    :class="note.kind === 'plan' ? 'bg-teal-100 text-[#0d9488] border-teal-300' : 'bg-slate-200 text-slate-700 border-slate-300'"
                  >
                    {{ note.kind === 'plan' ? '计划文档' : '复盘笔记' }}
                  </span>
                  <span v-if="getProjectName(note.projectId)" class="text-[10px] font-mono font-bold text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    {{ getProjectName(note.projectId) }}
                  </span>
                  <span v-for="tag in (note.tags || [])" :key="tag" class="text-[10px] text-slate-400 font-mono">
                    #{{ tag }}
                  </span>
                </div>
                <h4 class="font-black text-sm text-slate-900 truncate" :title="note.title">
                  {{ note.title }}
                </h4>
              </div>
              <span class="text-[10px] font-mono text-slate-400 shrink-0">{{ formatDate(note.at) }}</span>
            </div>

            <!-- Body -->
            <div class="text-slate-700 whitespace-pre-wrap leading-relaxed">
              <p v-if="note.body.length <= 160">{{ note.body }}</p>
              <details v-else class="space-y-1">
                <summary class="text-slate-500 hover:text-slate-900 cursor-pointer font-bold">
                  {{ note.body.slice(0, 120) }}… <span class="text-[#0d9488] underline">展开全文 ({{ note.body.length }}字)</span>
                </summary>
                <div class="pt-2 text-slate-800 border-t border-slate-200 font-mono text-[11px]">
                  {{ note.body }}
                </div>
              </details>
            </div>

            <!-- Note Actions -->
            <div class="flex items-center justify-end gap-2 pt-1 border-t border-slate-200 font-mono text-[11px]">
              <button @click="openEditNoteModal(note)" class="text-slate-600 hover:text-slate-900 font-bold hover:underline cursor-pointer">
                编辑
              </button>
              <button @click="handleDeleteNote(note.id)" class="text-rose-500 hover:text-rose-700 font-bold hover:underline cursor-pointer">
                删除
              </button>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12 text-slate-400 text-xs font-mono">
          暂无匹配的沉淀内容。点击上方「+ 新建沉淀」记录你的复盘心得或方案计划。
        </div>
      </div>

    </div>

    <!-- Note Modal -->
    <div v-if="showNoteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div class="bg-white rounded-3xl max-w-lg w-full p-6 border-2 border-slate-900 shadow-hard space-y-4 animate-pop-in">
        <h3 class="font-black text-sm text-slate-900">{{ editingNoteId ? '编辑沉淀' : '新建沉淀' }}</h3>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">标题</label>
          <input
            v-model="noteForm.title"
            type="text"
            placeholder="一句话说清这条是什么"
            class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg outline-none font-bold text-slate-900"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">内容</label>
          <textarea
            v-model="noteForm.body"
            rows="5"
            placeholder="计划原文、调研结论、决定、踩过的坑…"
            class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg outline-none text-slate-900 font-sans"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">类型</label>
            <select v-model="noteForm.kind" class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg outline-none font-bold">
              <option value="note">复盘笔记 (经验/心得)</option>
              <option value="plan">计划文档 (初始方案)</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">所属项目</label>
            <select v-model="noteForm.projectId" class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg outline-none font-bold">
              <option :value="null">无项目归属</option>
              <option v-for="p in projectStore.projects" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">标签 (逗号分隔)</label>
          <input
            v-model="noteForm.tagsInput"
            type="text"
            placeholder="调研, 方案, 思考"
            class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg outline-none font-mono text-slate-800"
          />
        </div>

        <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
          <button @click="showNoteModal = false" class="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold cursor-pointer">取消</button>
          <button @click="handleSaveNote" class="px-5 py-2 bg-[#0d9488] text-white rounded-xl text-xs font-bold shadow-hard-sm cursor-pointer">保存沉淀</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import { useTaskStore } from '../stores/taskStore'
import { useProjectStore } from '../stores/projectStore'

const taskStore = useTaskStore()
const projectStore = useProjectStore()

const searchQuery = ref('')
const selectedProjectId = ref('all')
const selectedKind = ref('all') // 'all' | 'plan' | 'note'

// Modal state
const showNoteModal = ref(false)
const editingNoteId = ref(null)
const noteForm = ref({
  title: '',
  body: '',
  kind: 'note',
  projectId: null,
  tagsInput: ''
})

const planCount = computed(() => projectStore.notes.filter(n => n.kind === 'plan').length)
const memoCount = computed(() => projectStore.notes.filter(n => n.kind === 'note').length)

// Aggregate all logs from tasks and goals
const allLogs = computed(() => {
  const out = []
  taskStore.tasks.forEach(t => {
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
  projectStore.goals.forEach(g => {
    (g.logs || []).forEach(l => {
      out.push({
        at: l.at,
        text: l.text,
        taskId: g.id,
        taskTitle: g.title,
        projectId: null,
        kind: 'goal'
      })
    })
  })
  return out.sort((a, b) => b.at - a.at)
})

const filteredLogs = computed(() => {
  let list = allLogs.value
  if (selectedProjectId.value !== 'all') {
    list = list.filter(l => l.projectId === selectedProjectId.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(l => l.text.toLowerCase().includes(q) || (l.taskTitle || '').toLowerCase().includes(q))
  }
  return list
})

const groupedLogs = computed(() => {
  const groups = []
  let currentGroup = null

  filteredLogs.value.forEach(l => {
    const dateStr = dayjs(l.at).format('YYYY年M月D日')
    const timeStr = dayjs(l.at).format('HH:mm')

    if (!currentGroup || currentGroup.date !== dateStr) {
      currentGroup = { date: dateStr, logs: [] }
      groups.push(currentGroup)
    }
    currentGroup.logs.push({ ...l, time: timeStr })
  })
  return groups
})

const filteredNotes = computed(() => {
  let list = projectStore.notes
  if (selectedKind.value !== 'all') {
    list = list.filter(n => n.kind === selectedKind.value)
  }
  if (selectedProjectId.value !== 'all') {
    list = list.filter(n => n.projectId === selectedProjectId.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(n => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q) || (n.tags || []).some(t => t.toLowerCase().includes(q)))
  }
  return list
})

const getProjectName = (pid) => {
  if (!pid) return ''
  const p = projectStore.projects.find(x => x.id === pid)
  return p ? p.name : ''
}

const formatDate = (ts) => {
  if (!ts) return ''
  return dayjs(ts).format('M月D日 HH:mm')
}

const openNewNoteModal = () => {
  editingNoteId.value = null
  noteForm.value = {
    title: '',
    body: '',
    kind: 'note',
    projectId: selectedProjectId.value === 'all' ? null : selectedProjectId.value,
    tagsInput: ''
  }
  showNoteModal.value = true
}

const openEditNoteModal = (note) => {
  editingNoteId.value = note.id
  noteForm.value = {
    title: note.title,
    body: note.body,
    kind: note.kind,
    projectId: note.projectId,
    tagsInput: (note.tags || []).join(', ')
  }
  showNoteModal.value = true
}

const handleSaveNote = () => {
  const tags = noteForm.value.tagsInput.split(/[,，、;；\s]+/).map(s => s.trim()).filter(Boolean)
  if (editingNoteId.value) {
    projectStore.updateNote(editingNoteId.value, {
      title: noteForm.value.title,
      body: noteForm.value.body,
      kind: noteForm.value.kind,
      projectId: noteForm.value.projectId,
      tags
    })
  } else {
    projectStore.addNote({
      title: noteForm.value.title,
      body: noteForm.value.body,
      kind: noteForm.value.kind,
      projectId: noteForm.value.projectId,
      tags
    })
  }
  showNoteModal.value = false
}

const handleDeleteNote = (noteId) => {
  if (confirm('确定删除该条沉淀吗？')) {
    projectStore.deleteNote(noteId)
  }
}

// Markdown Export Function
const exportMarkdown = () => {
  const dateStr = dayjs().format('YYYY-MM-DD')
  let md = `# 个人工作台 · 知识沉淀与执行复盘\n\n`
  md += `> 导出时间：${dayjs().format('YYYY-MM-DD HH:mm:ss')}\n\n`

  md += `## 概览统计\n\n`
  md += `| 活跃项目 | 任务总数 | 进行中目标 | 计划文档 | 复盘笔记 | 推进记录 |\n`
  md += `| :---: | :---: | :---: | :---: | :---: | :---: |\n`
  md += `| ${projectStore.activeProjects.length} | ${taskStore.tasks.length} | ${projectStore.activeGoals.length} | ${planCount.value} | ${memoCount.value} | ${allLogs.value.length} |\n\n`

  md += `## 计划文档 (当初打算做什么)\n\n`
  const plans = projectStore.notes.filter(n => n.kind === 'plan')
  if (plans.length === 0) md += `_暂无计划文档_\n\n`
  plans.forEach(p => {
    md += `### ${p.title}\n\n`
    md += `- 时间：${dayjs(p.at).format('YYYY-MM-DD HH:mm')}\n`
    if (p.projectId) md += `- 项目：${getProjectName(p.projectId)}\n`
    if (p.tags?.length) md += `- 标签：#${p.tags.join(' #')}\n`
    md += `\n${p.body}\n\n`
  })

  md += `## 推进时间线 (实际做了什么)\n\n`
  if (allLogs.value.length === 0) md += `_暂无推进记录_\n\n`
  groupedLogs.value.forEach(g => {
    md += `### ${g.date}\n\n`
    g.logs.forEach(l => {
      md += `- \`${l.time}\` **${l.taskTitle || '任务'}**：${l.text}\n`
    })
    md += `\n`
  })

  md += `## 复盘笔记 (后来想清楚了什么)\n\n`
  const memos = projectStore.notes.filter(n => n.kind === 'note')
  if (memos.length === 0) md += `_暂无复盘笔记_\n\n`
  memos.forEach(m => {
    md += `### ${m.title}\n\n`
    md += `- 时间：${dayjs(m.at).format('YYYY-MM-DD HH:mm')}\n`
    if (m.projectId) md += `- 项目：${getProjectName(m.projectId)}\n`
    if (m.tags?.length) md += `- 标签：#${m.tags.join(' #')}\n`
    md += `\n${m.body}\n\n`
  })

  md += `## 目标清单 (倒推配额)\n\n`
  if (projectStore.goals.length === 0) md += `_暂无目标_\n\n`
  projectStore.goals.forEach(g => {
    const q = projectStore.goalQuota(g)
    md += `### ${g.title}（截止日：${g.deadline || '无'}）\n\n`
    md += `进度：${q.done}/${q.total} 节点 (${Math.round((q.done / (q.total || 1)) * 100)}%)\n\n`
    (g.nodes || []).forEach(n => {
      md += `- [${n.done ? 'x' : ' '}] ${n.text}\n`
    })
    md += `\n`
  })

  // Trigger download
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `workbench-knowledge-${dateStr}.md`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
</script>
