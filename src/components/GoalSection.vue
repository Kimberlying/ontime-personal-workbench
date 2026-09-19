<template>
  <div class="bg-white rounded-2xl p-6 border-2 border-slate-900 shadow-hard mb-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-3 flex-wrap gap-2">
      <div class="flex items-center gap-2">
        <h2 class="text-base font-black text-slate-900 flex items-center gap-2">
          <span>🎯 目标倒推</span>
          <span class="font-mono text-[10px] bg-teal-100 text-[#0d9488] font-black px-2 py-0.5 rounded border border-slate-900">
            SMART BACKWARD
          </span>
        </h2>
      </div>
      <span class="text-xs font-mono text-slate-500 font-bold">
        {{ activeGoals.length }} 个进行中
        <span v-if="todayTotalQuota > 0" class="text-amber-700">· 今天共需推进 {{ todayTotalQuota }} 个节点</span>
      </span>
    </div>

    <!-- Quick Add Goal Form -->
    <form @submit.prevent="handleQuickAddGoal" class="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-slate-50 p-3 rounded-xl border border-slate-200 mb-2">
      <div class="md:col-span-6">
        <input
          v-model="newGoalTitle"
          type="text"
          placeholder="例如：AWS 认证架构师备考 / 景观方案深化"
          class="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none font-bold text-slate-900 focus:border-[#0d9488]"
          required
        />
      </div>
      <div class="md:col-span-3">
        <input
          v-model="newGoalDeadline"
          type="date"
          :min="todayStr"
          class="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none font-mono font-bold text-slate-800 focus:border-[#0d9488]"
          required
        />
      </div>
      <div class="md:col-span-3">
        <button
          type="submit"
          class="w-full py-2 px-3 bg-[#0d9488] hover:bg-[#0f766e] active:translate-x-[1px] active:translate-y-[1px] text-white font-bold font-mono text-xs rounded-lg border border-slate-900 shadow-[1px_1px_0px_0px_#0f172a] transition-all cursor-pointer flex items-center justify-center gap-1"
        >
          <span>+</span>
          <span>添加目标</span>
        </button>
      </div>
    </form>

    <div class="text-[11px] text-slate-400 font-mono mb-4 flex items-center gap-1">
      <span>💡</span>
      <span>只填目标 + 最终完成时间。系统按剩余天数倒推，算出「今天该推进多少」，自动计算推进配额。</span>
    </div>

    <!-- Goal Cards Grid -->
    <div v-if="projectStore.goals.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
      <div
        v-for="goal in projectStore.goals"
        :key="goal.id"
        class="bg-slate-50 rounded-xl p-4 border-2 border-slate-900 shadow-hard-sm hover:border-[#0d9488] transition-all flex flex-col justify-between"
        :class="{ 'opacity-60 bg-slate-100': goal.done }"
      >
        <div>
          <!-- Title & Status Badge -->
          <div class="flex items-start justify-between gap-2 mb-2">
            <h4 class="font-black text-xs text-slate-900 leading-snug truncate" :title="goal.title">
              {{ goal.title }}
            </h4>
            <span
              v-if="goal.done"
              class="text-[9px] font-mono font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300 shrink-0"
            >
              已达成
            </span>
          </div>

          <!-- Progress Bar -->
          <div class="w-full bg-slate-200 h-2 rounded-md overflow-hidden border border-slate-900 mb-2">
            <div
              class="h-full bg-purple-600 transition-all duration-300"
              :class="{ 'bg-emerald-500': goal.done }"
              :style="{ width: `${goalProgress(goal)}%` }"
            ></div>
          </div>

          <!-- Meta -->
          <div class="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-2">
            <span>{{ goalDoneCount(goal) }}/{{ (goal.nodes || []).length }} 节点</span>
            <span :class="{ 'text-rose-600 font-bold': isGoalUrgent(goal) }">
              {{ goal.deadline ? formatGoalDue(goal.deadline) : '无截止日' }}
            </span>
          </div>

          <!-- Daily Quota Badge -->
          <div
            class="text-[11px] font-bold px-2.5 py-1 rounded-lg border font-mono mb-3"
            :class="quotaBadgeClass(goal)"
          >
            {{ quotaText(goal) }}
          </div>

          <!-- Nodes Checklist (First 3-4 nodes) -->
          <div v-if="(goal.nodes || []).length > 0" class="space-y-1.5 pt-2 border-t border-slate-200/80">
            <div
              v-for="(node, idx) in (goal.nodes || []).slice(0, 3)"
              :key="idx"
              class="flex items-center gap-2 text-xs"
            >
              <input
                type="checkbox"
                :checked="node.done"
                @change="handleToggleNode(goal.id, idx)"
                class="w-3.5 h-3.5 rounded border-2 border-slate-900 accent-purple-600 cursor-pointer shrink-0"
              />
              <span
                class="truncate text-[11px]"
                :class="node.done ? 'line-through text-slate-400 font-normal' : 'text-slate-800 font-semibold'"
              >
                {{ node.text }}
              </span>
            </div>
            <div v-if="(goal.nodes || []).length > 3" class="text-[10px] text-slate-400 font-mono">
              …还有 {{ goal.nodes.length - 3 }} 个节点
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="pt-3 mt-3 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono">
          <div class="flex items-center gap-2">
            <button
              @click="openEditModal(goal)"
              class="text-slate-600 hover:text-slate-900 hover:underline font-bold cursor-pointer"
            >
              编辑节点
            </button>
            <button
              @click="$emit('log-goal', goal)"
              class="text-[#0d9488] hover:text-[#0f766e] hover:underline font-bold cursor-pointer"
            >
              记录进度
            </button>
          </div>
          <button
            @click="handleDeleteGoal(goal.id)"
            class="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer"
            title="删除目标"
          >
            &times;
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-6 text-slate-400 text-xs font-mono">
      还没有长线目标。在上方填入一个，系统会替你把它按剩余天数拆到每天。
    </div>

    <!-- Edit Goal Modal -->
    <div v-if="showEditModal && editingGoal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div class="bg-white rounded-2xl max-w-md w-full p-6 border-2 border-slate-900 shadow-hard space-y-4">
        <h3 class="font-black text-sm text-slate-900">编辑目标与节点</h3>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">目标内容</label>
          <input
            v-model="editGoalTitle"
            type="text"
            class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg outline-none font-bold text-slate-900"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">最终完成时间</label>
          <input
            v-model="editGoalDeadline"
            type="date"
            class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg outline-none font-mono font-bold text-slate-800"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">节点清单（拆成具体可勾选的动作）</label>
          <div class="space-y-1.5 max-h-40 overflow-y-auto bg-slate-50 p-2 rounded-xl border border-slate-200">
            <div
              v-for="(n, i) in editGoalNodes"
              :key="i"
              class="flex items-center justify-between gap-2 p-1 bg-white rounded border border-slate-200 text-xs"
            >
              <span class="truncate font-medium text-slate-800">{{ n.text }}</span>
              <button @click="editGoalNodes.splice(i, 1)" class="text-rose-500 hover:text-rose-700 font-bold px-1">&times;</button>
            </div>
            <div v-if="editGoalNodes.length === 0" class="text-[11px] text-slate-400 p-1 font-mono">
              暂无节点，在下方输入添加
            </div>
          </div>
          <div class="flex gap-2 mt-2">
            <input
              v-model="newNodeText"
              type="text"
              placeholder="输入一个节点（如：完成第二章学习）"
              class="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg outline-none text-slate-800 font-medium"
              @keydown.enter.prevent="handleAddNode"
            />
            <button
              @click="handleAddNode"
              type="button"
              class="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold font-mono cursor-pointer"
            >
              添加
            </button>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
          <button @click="showEditModal = false" class="px-3.5 py-1.5 bg-slate-100 rounded-lg text-xs font-bold">取消</button>
          <button @click="handleSaveEditGoal" class="px-4 py-1.5 bg-[#0d9488] text-white rounded-lg text-xs font-bold">保存修改</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import { useProjectStore } from '../stores/projectStore'

defineEmits(['log-goal'])

const projectStore = useProjectStore()

const todayStr = dayjs().format('YYYY-MM-DD')
const newGoalTitle = ref('')
const newGoalDeadline = ref(dayjs().add(30, 'day').format('YYYY-MM-DD'))

// Edit modal state
const showEditModal = ref(false)
const editingGoal = ref(null)
const editGoalTitle = ref('')
const editGoalDeadline = ref('')
const editGoalNodes = ref([])
const newNodeText = ref('')

const activeGoals = computed(() => projectStore.activeGoals)

const todayTotalQuota = computed(() => {
  return activeGoals.value.reduce((sum, g) => sum + projectStore.goalQuota(g).quota, 0)
})

const goalProgress = (g) => {
  const q = projectStore.goalQuota(g)
  if (q.total === 0) return g.done ? 100 : 0
  return Math.round((q.done / q.total) * 100)
}

const goalDoneCount = (g) => {
  return (g.nodes || []).filter(n => n.done).length
}

const isGoalUrgent = (g) => {
  const q = projectStore.goalQuota(g)
  return q.daysLeft <= 3 && q.remaining > 0
}

const formatGoalDue = (dateStr) => {
  if (!dateStr) return ''
  const diff = dayjs(dateStr).diff(dayjs(), 'day')
  if (diff === 0) return '今天截止'
  if (diff > 0) return `剩 ${diff} 天`
  return `已逾期 ${Math.abs(diff)} 天`
}

const quotaText = (g) => {
  const q = projectStore.goalQuota(g)
  if (q.remaining === 0) return '全部节点已完成 ✓'
  if (q.total > 0) {
    return `还剩 ${q.daysLeft} 天 · 今天推进 ${q.quota} 个节点`
  }
  return `还剩 ${q.daysLeft} 天 · 今天推进 1 次`
}

const quotaBadgeClass = (g) => {
  const q = projectStore.goalQuota(g)
  if (q.remaining === 0) return 'bg-emerald-50 text-emerald-800 border-emerald-200'
  if (q.daysLeft <= 3 && q.remaining > 0) return 'bg-rose-50 text-rose-800 border-rose-300 animate-pulse'
  return 'bg-purple-50 text-purple-900 border-purple-200'
}

const handleQuickAddGoal = () => {
  if (!newGoalTitle.value.trim() || !newGoalDeadline.value) return
  projectStore.addGoal({
    title: newGoalTitle.value.trim(),
    deadline: newGoalDeadline.value,
    nodes: [
      { text: '第一阶段调研与大纲梳理', done: false },
      { text: '主体核心模块设计制作', done: false },
      { text: '最终评审验收与交付', done: false },
    ]
  })
  newGoalTitle.value = ''
  newGoalDeadline.value = dayjs().add(30, 'day').format('YYYY-MM-DD')
}

const handleToggleNode = (goalId, nodeIdx) => {
  projectStore.toggleGoalNode(goalId, nodeIdx)
}

const handleDeleteGoal = (goalId) => {
  if (confirm('确定删除该目标吗？')) {
    projectStore.deleteGoal(goalId)
  }
}

const openEditModal = (goal) => {
  editingGoal.value = goal
  editGoalTitle.value = goal.title
  editGoalDeadline.value = goal.deadline || ''
  editGoalNodes.value = (goal.nodes || []).map(n => ({ text: n.text, done: n.done }))
  newNodeText.value = ''
  showEditModal.value = true
}

const handleAddNode = () => {
  if (!newNodeText.value.trim()) return
  editGoalNodes.value.push({ text: newNodeText.value.trim(), done: false })
  newNodeText.value = ''
}

const handleSaveEditGoal = () => {
  if (!editingGoal.value || !editGoalTitle.value.trim()) return
  projectStore.updateGoal(editingGoal.value.id, {
    title: editGoalTitle.value.trim(),
    deadline: editGoalDeadline.value,
    nodes: editGoalNodes.value
  })
  showEditModal.value = false
}
</script>
