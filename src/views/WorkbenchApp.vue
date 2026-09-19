<template>
  <div class="min-h-screen bg-[#f5f8f6] text-slate-900 flex flex-col antialiased"
       style="background-image: radial-gradient(rgba(13, 148, 136, 0.045) 1px, transparent 1px), linear-gradient(to right, rgba(13, 148, 136, 0.015) 1px, transparent 1px), linear-gradient(to bottom, rgba(13, 148, 136, 0.015) 1px, transparent 1px); background-size: 28px 28px;">
    <!-- Global Header -->
    <AppHeader
      @open-hermes="openDataHub('mcp')"
      @open-import="openDataHub('import')"
    />

    <!-- 3-Column Workbench Body -->
    <div class="flex-1 flex overflow-hidden max-w-[1700px] w-full mx-auto">
      
      <!-- ========================================== -->
      <!-- 1. LEFT SIDEBAR: Navigation & Reminders -->
      <!-- ========================================== -->
      <aside class="w-64 border-r-2 border-slate-900 bg-white/90 backdrop-blur flex flex-col justify-between shrink-0 select-none p-5 hidden md:flex shadow-xs">
        <div class="space-y-6">
          <!-- Sidebar App Brand title in screenshot style -->
          <div class="flex items-center gap-2.5 px-2">
            <div class="w-3 h-3 rounded-full bg-rose-500 border border-slate-900 shadow-[1px_1px_0px_0px_#0f172a]"></div>
            <div class="w-3 h-3 rounded-full bg-amber-400 border border-slate-900 shadow-[1px_1px_0px_0px_#0f172a]"></div>
            <div class="w-3 h-3 rounded-full bg-[#0d9488] border border-slate-900 shadow-[1px_1px_0px_0px_#0f172a]"></div>
            <span class="ml-2 font-black text-slate-900 text-base tracking-tight">{{ $t('app.title') }}</span>
          </div>

          <!-- Main Nav Menu (Tactile Block Frame Buttons) -->
          <nav class="space-y-2 text-xs font-bold font-mono">
            <!-- 今天 (Today) -->
            <button
              @click="currentView = 'today'"
              class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border-2 transition-all cursor-pointer"
              :class="currentView === 'today' ? 'bg-[#0d9488] text-white border-slate-900 shadow-hard-sm' : 'border-transparent text-slate-700 hover:bg-slate-100 hover:border-slate-900'"
            >
              <div class="flex items-center gap-3">
                <span class="text-sm">📅</span>
                <span class="font-sans font-bold text-sm">{{ $t('app.today') }}</span>
              </div>
              <span 
                v-if="taskStore.todayPendingTasks.length > 0"
                class="px-2 py-0.5 text-xs rounded-lg bg-white text-slate-900 border border-slate-900 font-bold"
              >
                {{ taskStore.todayPendingTasks.length }}
              </span>
            </button>

            <!-- 知识库与沉淀 (Knowledge Base) -->
            <button
              @click="currentView = 'kb'"
              class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border-2 transition-all cursor-pointer"
              :class="currentView === 'kb' ? 'bg-[#0d9488] text-white border-slate-900 shadow-hard-sm' : 'border-transparent text-slate-700 hover:bg-slate-100 hover:border-slate-900'"
            >
              <div class="flex items-center gap-3">
                <span class="text-sm">📚</span>
                <span class="font-sans font-bold text-sm">{{ $t('nav.knowledgeBase') }}</span>
              </div>
              <span class="text-xs font-bold" :class="currentView === 'kb' ? 'text-white' : 'text-slate-500'">
                {{ projectStore.notes.length }}
              </span>
            </button>

            <!-- 短期项目 (Short-term Projects) -->
            <button
              @click="currentView = 'short'"
              class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border-2 transition-all cursor-pointer"
              :class="currentView === 'short' ? 'bg-[#0d9488] text-white border-slate-900 shadow-hard-sm' : 'border-transparent text-slate-700 hover:bg-slate-100 hover:border-slate-900'"
            >
              <div class="flex items-center gap-3">
                <span class="text-sm">📚</span>
                <span class="font-sans font-bold text-sm">{{ $t('app.shortTermProjects') }}</span>
              </div>
              <span class="text-xs font-bold" :class="currentView === 'short' ? 'text-white' : 'text-slate-500'">
                {{ projectStore.shortTermProjects.length }}
              </span>
            </button>

            <!-- 长期项目 (Long-term Projects) -->
            <button
              @click="currentView = 'long'"
              class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border-2 transition-all cursor-pointer"
              :class="currentView === 'long' ? 'bg-[#0d9488] text-white border-slate-900 shadow-hard-sm' : 'border-transparent text-slate-700 hover:bg-slate-100 hover:border-slate-900'"
            >
              <div class="flex items-center gap-3">
                <span class="text-sm">📁</span>
                <span class="font-sans font-bold text-sm">{{ $t('app.longTermProjects') }}</span>
              </div>
              <span class="text-xs font-bold" :class="currentView === 'long' ? 'text-white' : 'text-slate-500'">
                {{ projectStore.longTermProjects.length }}
              </span>
            </button>

            <!-- 里程碑与成就 (Milestones & Badges) -->
            <button
              @click="currentView = 'milestones'"
              class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border-2 transition-all cursor-pointer"
              :class="currentView === 'milestones' ? 'bg-amber-400 text-slate-900 border-slate-900 shadow-hard-sm font-black' : 'border-transparent text-slate-700 hover:bg-slate-100 hover:border-slate-900'"
            >
              <div class="flex items-center gap-3">
                <span class="text-sm">🏆</span>
                <span class="font-sans font-bold text-sm">{{ $t('milestones.pageTitle') }}</span>
              </div>
              <span class="px-2 py-0.5 text-[10px] rounded-lg bg-slate-900 text-white font-bold">
                {{ milestoneStore.unlockedCount }}/{{ milestoneStore.totalBadgesCount }}
              </span>
            </button>

            <!-- 已完成 (Completed) -->
            <button
              @click="currentView = 'completed'"
              class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border-2 transition-all cursor-pointer"
              :class="currentView === 'completed' ? 'bg-[#0d9488] text-white border-slate-900 shadow-hard-sm' : 'border-transparent text-slate-700 hover:bg-slate-100 hover:border-slate-900'"
            >
              <div class="flex items-center gap-3">
                <span class="text-sm">✅</span>
                <span class="font-sans font-bold text-sm">{{ $t('app.completed') }}</span>
              </div>
              <span class="text-xs font-bold" :class="currentView === 'completed' ? 'text-white' : 'text-slate-500'">
                {{ taskStore.allCompletedTasks.length }}
              </span>
            </button>

            <!-- 已归档项目 (Archived) -->
            <button
              v-if="projectStore.archivedProjects.length > 0"
              @click="currentView = 'archived'"
              class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border-2 transition-all cursor-pointer"
              :class="currentView === 'archived' ? 'bg-[#0d9488] text-white border-slate-900 shadow-hard-sm' : 'border-transparent text-slate-700 hover:bg-slate-100 hover:border-slate-900'"
            >
              <div class="flex items-center gap-3">
                <span class="text-sm">📦</span>
                <span class="font-sans font-bold text-sm">{{ $t('projects.archived') }}</span>
              </div>
              <span class="text-xs font-bold" :class="currentView === 'archived' ? 'text-white' : 'text-slate-500'">
                {{ projectStore.archivedProjects.length }}
              </span>
            </button>
          </nav>
        </div>

        <!-- Bottom Reminder & Storage Status -->
        <div class="space-y-3 pt-4 border-t-2 border-slate-900">
          <!-- Clickable Reminder Settings Widget -->
          <button
            @click="showReminderModal = true"
            class="w-full flex items-center justify-between text-xs font-bold text-slate-800 px-3 py-2 rounded-xl bg-white border-2 border-slate-900 shadow-hard-sm hover:shadow-hard transition-all cursor-pointer group text-left"
            :title="$t('reminders.settingsTitle')"
          >
            <span class="flex items-center gap-1.5 font-mono">
              <span>⏰</span>
              <span class="truncate font-sans font-bold">{{ reminderSummaryText }}</span>
            </span>
            <span class="flex items-center gap-1 shrink-0">
              <span class="w-2 h-2 rounded-full border border-slate-900" :class="reminderStore.enabled ? 'bg-[#0d9488]' : 'bg-slate-300'"></span>
              <span class="text-[10px] text-slate-500 group-hover:text-slate-900 transition-colors">⚙️</span>
            </span>
          </button>

          <!-- Active Projects Stat -->
          <div class="bg-white p-3 rounded-xl border-2 border-slate-900 shadow-hard-sm text-xs font-mono flex items-center justify-between">
            <span class="font-sans text-slate-700 font-bold">📁 活跃项目:</span>
            <span class="text-[#0d9488] font-black">{{ projectStore.activeCount }} 个</span>
          </div>

          <!-- Smart Import / Data Backup Button -->
          <button
            @click="showSmartImportModal = true"
            class="w-full flex items-center justify-between text-xs font-bold font-mono text-[#0d9488] px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 border-2 border-slate-900 shadow-hard-sm hover:shadow-hard transition-all cursor-pointer"
          >
            <span>📥 导入 / 导出 / API</span>
            <span class="text-xs">⚡</span>
          </button>
        </div>
      </aside>

      <!-- ========================================== -->
      <!-- 2. CENTER MAIN WORK AREA -->
      <!-- ========================================== -->
      <main class="flex-1 p-6 md:p-8 overflow-y-auto max-w-4xl">

        <!-- VIEW: KNOWLEDGE BASE -->
        <KnowledgeBaseView v-if="currentView === 'kb'" />

        <!-- VIEW: MILESTONES & ACHIEVEMENTS -->
        <section v-else-if="currentView === 'milestones'">
          <MilestoneDashboard />
        </section>

        <!-- VIEW: WORKBENCH CONTENT -->
        <div v-else class="space-y-6">

          <!-- P0: PUSH BAR (智能推进提示条) -->
          <PushBar
            @start-starter="openAdhdModal"
            @log-progress="openQuickLog"
          />

          <!-- P0: GOAL SECTION (目标倒推 SMART BACKWARD) -->
          <GoalSection
            @log-goal="openQuickLogGoal"
          />

          <!-- TOP CARD: Smart Backward Scheduler Input Card (Sage Nordic Spruce Style) -->
          <div class="bg-white rounded-2xl p-6 border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0d9488] mb-6 relative">
            <form @submit.prevent="handleOpenWizard" class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <!-- 目标内容 -->
              <div class="md:col-span-6">
                <label class="block text-xs font-black text-slate-900 mb-1.5 flex items-center justify-between">
                  <span>{{ $t('scheduler.targetLabel') }}</span>
                  <span class="font-mono text-[10px] text-[#0d9488] font-bold">SMART BACKWARD</span>
                </label>
                <input
                  v-model="targetInput"
                  type="text"
                  :placeholder="$t('scheduler.targetPlaceholder')"
                  class="w-full px-4 py-2.5 text-sm bg-slate-50 border-2 border-slate-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0d9488]/20 outline-none transition-all text-slate-900 font-medium"
                  required
                />
              </div>

              <!-- 最终完成时间 -->
              <div class="md:col-span-3">
                <label class="block text-xs font-black text-slate-900 mb-1.5">
                  {{ $t('scheduler.deadlineLabel') }}
                </label>
                <input
                  v-model="deadlineInput"
                  type="date"
                  :min="todayStr"
                  class="w-full px-3 py-2.5 text-sm bg-slate-50 border-2 border-slate-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0d9488]/20 outline-none text-slate-900 font-mono font-bold transition-all"
                  required
                />
              </div>

              <!-- 添加目标 按钮 -->
              <div class="md:col-span-3">
                <button
                  type="submit"
                  class="w-full py-2.5 px-4 bg-[#0d9488] hover:bg-[#0f766e] active:translate-x-[2px] active:translate-y-[2px] text-white font-bold text-sm rounded-xl border-2 border-slate-900 shadow-hard hover:shadow-hard-teal transition-all flex items-center justify-center gap-1.5 cursor-pointer font-mono"
                >
                  <span class="text-base font-black">+</span>
                  <span>{{ $t('scheduler.addTargetBtn') }}</span>
                </button>
              </div>
            </form>

            <!-- Prompt Hint Subtitle with ADHD Micro Starter Tip -->
            <div class="flex items-center justify-between mt-3 text-xs text-slate-500 font-mono text-[11px]">
              <p class="flex items-start gap-1 leading-relaxed">
                <span>💡</span>
                <span>{{ $t('scheduler.tip') }}</span>
              </p>
              <button
                type="button"
                @click="openAdhdModal({ title: targetInput.trim() || (locale === 'en' ? 'New Target Goal' : '新目标任务') })"
                class="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-[#0d9488] border border-slate-900 font-bold shrink-0 cursor-pointer shadow-[1px_1px_0px_0px_#0f172a] transition-all active:translate-x-[1px] active:translate-y-[1px]"
                :title="$t('adhd.modalSubtitle')"
              >
                <span>⚡</span>
                <span>{{ $t('adhd.btnTitle') }}</span>
              </button>
            </div>
          </div>

          <!-- GENTLE PROGRESS REMINDER BANNER -->
          <GentleReminderBanner
            @open-progress="openProgressModal"
            @open-settings="showReminderModal = true"
            @open-adhd="openAdhdModal"
          />

        <!-- ========================================== -->
        <!-- VIEW: MILESTONES & ACHIEVEMENTS (里程碑看板) -->
        <!-- ========================================== -->
        <section v-if="currentView === 'milestones'">
          <MilestoneDashboard />
        </section>

        <!-- ========================================== -->
        <!-- VIEW: TODAY'S TASKS (今天要完成) -->
        <!-- ========================================== -->
        <section v-else-if="currentView === 'today'" class="space-y-6">
          
          <!-- Section Title & Meta Header -->
          <div class="flex items-baseline justify-between border-b-2 border-slate-900 pb-3">
            <div>
              <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>{{ $t('tasks.todayTitle') }}</span>
                <span class="w-2.5 h-2.5 rounded-full bg-[#0d9488] border border-slate-900"></span>
              </h1>
              <p class="text-xs text-slate-500 mt-1 font-mono font-bold">
                {{ formattedTodayDate }}
              </p>
            </div>
            <div class="text-xs font-mono font-bold px-2.5 py-1 bg-white border-2 border-slate-900 rounded-lg shadow-hard-sm">
              {{ $t('tasks.uncompletedCount', { count: taskStore.todayPendingTasks.length }) }}
            </div>
          </div>

          <!-- Tasks Table Header -->
          <div class="grid grid-cols-12 text-xs font-mono font-bold text-slate-500 px-4 py-1">
            <div class="col-span-6">{{ $t('tasks.colTask') }}</div>
            <div class="col-span-3">{{ $t('tasks.colProject') }}</div>
            <div class="col-span-2 text-right">{{ $t('tasks.colDeadline') }}</div>
            <div class="col-span-1 text-right">{{ $t('tasks.colProgress') }}</div>
          </div>

          <!-- Pending Tasks List (Sage Block Frame Card) -->
          <div v-if="taskStore.todayPendingTasks.length > 0" class="space-y-2.5">
            <div
              v-for="task in taskStore.todayPendingTasks"
              :key="task.id"
              class="group bg-white rounded-xl p-4 border-2 border-slate-900 shadow-hard-sm hover:shadow-hard hover:-translate-y-[1px] transition-all grid grid-cols-12 items-center gap-3"
            >
              <!-- Checkbox & Task Title & ADHD 5-Min Launcher -->
              <div class="col-span-6 flex items-center gap-3 truncate">
                <button
                  @click="handleCompleteTask(task)"
                  class="w-5 h-5 rounded-md border-2 border-slate-900 hover:bg-[#0d9488] hover:text-white flex items-center justify-center text-transparent transition-all shrink-0 cursor-pointer shadow-2xs font-mono font-bold text-xs"
                >
                  ✓
                </button>
                <span class="text-sm font-bold text-slate-900 truncate group-hover:text-[#0d9488] transition-colors">
                  {{ task.title }}
                </span>
                
                <!-- ADHD 5-Min Starter Button (Inviting & Helpful) -->
                <button
                  @click="openAdhdModal(task)"
                  class="px-2 py-0.5 text-[10px] font-mono font-black rounded-md bg-amber-50 text-amber-900 border border-slate-900 hover:bg-amber-200 transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                  title="难启动？点击开启 5 分钟微步冲刺"
                >
                  <span>⚡ 5min</span>
                </button>

                <!-- Attachments Badge -->
                <button
                  @click="openAttachmentModal(task)"
                  class="text-xs text-slate-500 hover:text-[#0d9488] font-mono flex items-center gap-0.5 ml-0.5 shrink-0 cursor-pointer"
                  :title="$t('tasks.manageAttachments')"
                >
                  <span>📎</span>
                  <span v-if="task.attachments?.length">({{ task.attachments.length }})</span>
                </button>
              </div>

              <!-- Project Name -->
              <div class="col-span-3 text-xs text-slate-600 truncate font-semibold">
                {{ getProjectName(task.project_id) }}
              </div>

              <!-- Deadline / Remaining -->
              <div class="col-span-2 text-right text-xs font-mono text-slate-600 font-bold">
                {{ formatShortDate(task.assigned_date) }}
              </div>

              <!-- Action & Delete -->
              <div class="col-span-1 text-right flex items-center justify-end gap-1">
                <button 
                  @click="openQuickLog(task)" 
                  class="text-slate-400 hover:text-[#0d9488] p-1 cursor-pointer font-bold text-xs"
                  title="记录推进进度"
                >
                  ✎
                </button>
                <button 
                  @click="taskStore.deleteTask(task.id)" 
                  class="text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity p-1 cursor-pointer"
                  :title="$t('tasks.deleteTask')"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <!-- Minimum Starter Box (最小启动项常驻) -->
              <div v-if="task.starter" class="col-span-12 px-3 py-2 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-between text-xs">
                <div class="flex items-center gap-2 truncate">
                  <span class="text-[9px] font-mono font-black text-[#0d9488] bg-teal-100 px-1.5 py-0.5 rounded border border-teal-300 shrink-0">
                    最小启动项
                  </span>
                  <span class="font-bold text-slate-800 text-xs truncate">{{ task.starter }}</span>
                </div>
                <button
                  @click.stop="openAdhdModal(task)"
                  class="w-6 h-6 rounded-full bg-[#0d9488] hover:bg-[#0f766e] text-white flex items-center justify-center font-bold text-[10px] shrink-0 cursor-pointer shadow-xs active:scale-95 transition-transform"
                  title="5 分钟无压启动"
                >
                  ▶
                </button>
              </div>

              <!-- Sub-actions Steps Checklist -->
              <div v-if="task.steps && task.steps.length" class="col-span-12 space-y-1 pt-1.5 border-t border-slate-100">
                <div v-for="(step, sIdx) in task.steps" :key="sIdx" class="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    :checked="step.done"
                    @change.stop="taskStore.toggleStep(task.id, sIdx)"
                    class="w-3.5 h-3.5 rounded border-2 border-slate-900 accent-[#0d9488] cursor-pointer shrink-0"
                  />
                  <span :class="step.done ? 'line-through text-slate-400' : 'text-slate-700 font-medium'">{{ step.text }}</span>
                </div>
              </div>

              <!-- Recent Log Display -->
              <div v-if="task.logs && task.logs.length" class="col-span-12 flex items-center gap-2 text-[11px] font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded">
                <span class="text-slate-400">最新记录:</span>
                <span class="text-slate-700 truncate">{{ task.logs[0].text }}</span>
              </div>
            </div>
          </div>

          <!-- ALL DONE / EMPTY STATE -->
          <div 
            v-if="taskStore.todayPendingTasks.length === 0" 
            class="py-12 px-4 text-center bg-white rounded-2xl border-2 border-slate-900 shadow-hard my-6 flex flex-col items-center justify-center animate-fade-in"
          >
            <div class="w-12 h-12 rounded-2xl bg-teal-100 border-2 border-slate-900 text-teal-800 flex items-center justify-center mb-3 shadow-hard-sm text-xl font-bold">
              ✓
            </div>
            <h3 class="text-base font-black text-slate-900">
              {{ $t('tasks.allDoneTitle') }}
            </h3>
            <p class="text-xs text-slate-500 mt-1 font-mono">
              {{ $t('tasks.allDoneSubtitle') }}
            </p>
          </div>

          <!-- ========================================== -->
          <!-- TODAY COMPLETED SECTION (今天已完成) -->
          <!-- ========================================== -->
          <div v-if="taskStore.todayCompletedTasks.length > 0" class="pt-6 space-y-3">
            <h2 class="text-xs font-mono font-black text-slate-500 uppercase tracking-wider">
              {{ $t('tasks.todayCompletedTitle') }} ({{ taskStore.todayCompletedTasks.length }})
            </h2>

            <div class="space-y-2">
              <div
                v-for="task in taskStore.todayCompletedTasks"
                :key="task.id"
                class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border-2 border-slate-300 text-xs"
              >
                <div class="flex items-center gap-3 truncate">
                  <!-- Teal Check Icon -->
                  <div class="w-5 h-5 rounded-md border-2 border-[#0d9488] bg-[#0d9488] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    ✓
                  </div>
                  <span class="text-slate-500 font-semibold line-through truncate">{{ task.title }}</span>
                </div>

                <div class="flex items-center gap-4 shrink-0">
                  <span class="text-slate-400 max-w-[140px] truncate hidden sm:inline-block font-mono">
                    {{ getProjectName(task.project_id) }}
                  </span>
                  <button
                    @click="taskStore.toggleTaskStatus(task.id)"
                    class="text-[#0d9488] hover:text-[#0f766e] font-bold font-mono hover:underline cursor-pointer"
                  >
                    {{ $t('tasks.undo') }}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </section>

        <!-- ========================================== -->
        <!-- VIEW: PROJECT VIEWS (Short, Long, Archived) -->
        <!-- ========================================== -->
        <section v-else class="space-y-6">
          <div class="flex items-center justify-between border-b-2 border-slate-900 pb-3">
            <h1 class="text-xl font-black text-slate-900">
              {{ currentView === 'short' ? $t('projects.shortTerm') : currentView === 'long' ? $t('projects.longTerm') : currentView === 'archived' ? $t('projects.archived') : $t('app.completed') }}
            </h1>
            <div class="flex items-center gap-2">
              <button
                v-if="currentView !== 'completed'"
                @click="projectStore.exportCsv(taskStore.tasks)"
                class="px-3.5 py-1.5 text-xs font-bold text-slate-900 bg-white border-2 border-slate-900 rounded-xl shadow-hard-sm hover:shadow-hard active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center gap-1 cursor-pointer font-mono"
              >
                <span>📊</span>
                <span>{{ $t('pricing.exportCsv') }}</span>
              </button>
            </div>
          </div>

          <!-- Projects Grid for Selected Filter -->
          <div v-if="filteredProjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="p in filteredProjects"
              :key="p.id"
              class="bg-white rounded-2xl p-5 border-2 border-slate-900 shadow-hard-sm hover:shadow-hard transition-all space-y-3"
            >
              <div class="flex items-start justify-between">
                <div>
                  <h4 class="font-bold text-sm text-slate-900">{{ p.name }}</h4>
                  <p class="text-xs font-mono text-slate-500 mt-0.5">{{ $t('projects.deadlineLabel') }}: {{ p.deadline }}</p>
                </div>
                <span class="text-xs font-mono font-black text-[#0d9488] px-2 py-0.5 rounded bg-teal-50 border border-slate-900">{{ p.progress || 0 }}%</span>
              </div>

              <!-- Progress bar with chunky frame -->
              <div class="w-full bg-slate-100 h-2.5 rounded-md border border-slate-900 overflow-hidden">
                <div 
                  class="bg-[#0d9488] h-full transition-all duration-500"
                  :style="{ width: `${p.progress || 0}%` }"
                ></div>
              </div>

              <div class="text-xs text-slate-600 flex items-center justify-between">
                <div>
                  <span class="text-slate-400 font-mono">{{ $t('projects.nextStep') }}:</span>
                  <span class="font-bold text-slate-800 ml-1">{{ p.next_step || $t('projects.statusProgress') }}</span>
                </div>
                <button
                  @click="openAdhdModal({ title: `${p.name} - ${$t('projects.nextStep')}: ${p.next_step || (locale === 'en' ? 'Start' : '推进')}` }, p)"
                  class="text-[10px] px-2 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-slate-900 rounded font-mono font-bold cursor-pointer"
                >
                  {{ $t('adhd.btnShort') }}
                </button>
              </div>

              <!-- Subtasks Checklist Accordion for Filtered Projects -->
              <div v-if="getProjectTasks(p.id).length > 0" class="pt-2 border-t border-slate-100 space-y-1.5">
                <div class="flex items-center justify-between">
                  <button
                    @click="toggleExpandProject(p.id)"
                    class="text-[11px] font-mono font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>📋 {{ isEn ? 'Subtasks & Milestones' : '子任务与节点' }}</span>
                    <span class="text-[10px] px-1.5 py-0.2 rounded bg-teal-100 text-teal-900 font-black border border-slate-900">
                      {{ getProjectTasks(p.id).filter(t => t.status === 'completed').length }}/{{ getProjectTasks(p.id).length }}
                    </span>
                    <span class="text-[9px] text-slate-400">
                      {{ expandedProjectIds.has(p.id) ? '▲ 收起' : '▼ 展开勾选' }}
                    </span>
                  </button>
                </div>

                <div v-if="expandedProjectIds.has(p.id)" class="space-y-1 max-h-40 overflow-y-auto bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs font-sans animate-fade-in">
                  <div
                    v-for="task in getProjectTasks(p.id)"
                    :key="task.id"
                    class="flex items-center gap-2 p-1 rounded hover:bg-white transition-colors"
                  >
                    <input
                      type="checkbox"
                      :checked="task.status === 'completed'"
                      @change="handleToggleSubtask(task)"
                      class="w-3.5 h-3.5 rounded border-2 border-slate-900 accent-[#0d9488] cursor-pointer shrink-0"
                    />
                    <span
                      class="flex-1 truncate text-xs"
                      :class="task.status === 'completed' ? 'line-through text-slate-400 font-medium' : 'text-slate-800 font-bold'"
                      :title="task.title"
                    >
                      {{ task.title }}
                    </span>
                    <button
                      @click="openAdhdModal(task, p)"
                      class="text-[9px] font-mono font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-1 py-0.2 rounded border border-amber-300 cursor-pointer shrink-0"
                      title="5分钟启动"
                    >
                      ⚡ 5min
                    </button>
                  </div>
                </div>
              </div>

              <div class="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <button
                  @click="openProgressModal(p)"
                  class="text-[#0d9488] font-bold hover:underline flex items-center gap-1 cursor-pointer font-mono"
                >
                  {{ $t('projects.recordProgress') }} ∨
                </button>

                <div class="flex items-center gap-2 font-mono">
                  <button
                    @click="openMemberModal(p)"
                    class="text-slate-700 hover:text-slate-900 p-1 cursor-pointer"
                    :title="$t('projects.invite')"
                  >
                    👥
                  </button>
                  <button
                    @click="projectStore.toggleArchive(p.id)"
                    class="text-slate-700 hover:text-slate-900 px-2 py-1 bg-slate-100 border border-slate-300 rounded-md hover:bg-slate-200 cursor-pointer font-bold"
                  >
                    {{ p.is_archived ? $t('projects.unarchive') : $t('projects.archive') }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-16 bg-white rounded-2xl border-2 border-slate-900 shadow-hard-sm text-slate-500 text-sm font-mono">
            {{ $t('projects.noProjects') }}
          </div>
        </section>

        </div> <!-- End of View: WORKBENCH CONTENT -->
      </main>

      <!-- ========================================== -->
      <!-- 3. RIGHT SIDEBAR: Projects Progress Overview (Sage Nordic Spruce Style) -->
      <!-- ========================================== -->
      <aside class="w-80 border-l-2 border-slate-900 bg-white/90 backdrop-blur p-6 overflow-y-auto shrink-0 hidden lg:flex flex-col justify-between shadow-xs">
        <div class="space-y-6">
          
          <!-- SHORT TERM PROJECTS (短期项目) -->
          <div>
            <div class="flex items-center justify-between mb-4 border-b-2 border-slate-900 pb-2">
              <h3 class="font-black text-sm text-slate-900">
                {{ $t('projects.shortTerm') }}
              </h3>
              <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-900">
                {{ projectStore.shortTermProjects.length }}
              </span>
            </div>

            <div class="space-y-4">
              <div
                v-for="p in projectStore.shortTermProjects"
                :key="p.id"
                class="p-3 bg-white rounded-xl border-2 border-slate-900 shadow-hard-sm space-y-2 text-xs group"
              >
                <!-- Project Name & Deadline -->
                <div class="flex items-center justify-between font-bold">
                  <span class="text-slate-900 font-bold truncate max-w-[150px]" :title="p.name">
                    {{ p.name }}
                  </span>
                  <span class="text-slate-500 font-mono text-[10px] shrink-0 font-bold">{{ formatShortDate(p.deadline) }}</span>
                </div>

                <!-- Progress Bar + Percentage -->
                <div class="flex items-center gap-2 font-mono">
                  <span class="text-[11px] font-black text-[#0d9488] w-8">{{ p.progress || 0 }}%</span>
                  <div class="flex-1 bg-slate-100 h-2 rounded-md border border-slate-900 overflow-hidden">
                    <div 
                      class="bg-[#0d9488] h-full transition-all duration-300"
                      :style="{ width: `${p.progress || 0}%` }"
                    ></div>
                  </div>
                </div>

                <!-- Subtasks Checklist Accordion -->
                <div v-if="getProjectTasks(p.id).length > 0" class="pt-2 border-t border-slate-100 space-y-1.5">
                  <div class="flex items-center justify-between">
                    <button
                      @click="toggleExpandProject(p.id)"
                      class="text-[11px] font-mono font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>📋 {{ isEn ? 'Subtasks & Milestones' : '子任务与节点' }}</span>
                      <span class="text-[10px] px-1.5 py-0.2 rounded bg-teal-100 text-teal-900 font-black border border-slate-900">
                        {{ getProjectTasks(p.id).filter(t => t.status === 'completed').length }}/{{ getProjectTasks(p.id).length }}
                      </span>
                      <span class="text-[9px] text-slate-400">
                        {{ expandedProjectIds.has(p.id) ? '▲' : '▼' }}
                      </span>
                    </button>
                  </div>

                  <div v-if="expandedProjectIds.has(p.id)" class="space-y-1 max-h-36 overflow-y-auto bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs font-sans animate-fade-in">
                    <div
                      v-for="task in getProjectTasks(p.id)"
                      :key="task.id"
                      class="flex items-center gap-2 p-1 rounded hover:bg-white transition-colors"
                    >
                      <input
                        type="checkbox"
                        :checked="task.status === 'completed'"
                        @change="handleToggleSubtask(task)"
                        class="w-3.5 h-3.5 rounded border-2 border-slate-900 accent-[#0d9488] cursor-pointer shrink-0"
                      />
                      <span
                        class="flex-1 truncate text-xs"
                        :class="task.status === 'completed' ? 'line-through text-slate-400 font-medium' : 'text-slate-800 font-bold'"
                        :title="task.title"
                      >
                        {{ task.title }}
                      </span>
                      <button
                        @click="openAdhdModal(task, p)"
                        class="text-[9px] font-mono font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-1 py-0.2 rounded border border-amber-300 cursor-pointer shrink-0"
                        title="5分钟启动"
                      >
                        ⚡ 5min
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Next Step + Action Menu + ADHD 5-Min Starter -->
                <div class="flex items-center justify-between text-[11px] text-slate-600 pt-0.5 border-t border-slate-100">
                  <span class="truncate max-w-[120px]" :title="p.next_step">
                    <span class="text-slate-400 font-mono">{{ $t('projects.nextStep') }}:</span> {{ p.next_step || $t('projects.statusProgress') }}
                  </span>
                  <div class="flex items-center gap-1.5 shrink-0">
                    <button
                      @click="openAdhdModal({ title: `${p.name} - ${p.next_step || '推进'}` }, p)"
                      class="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300 cursor-pointer"
                      title="难启动？开启5分钟拆解"
                    >
                      ⚡ 5min
                    </button>
                    <button
                      @click="openProgressModal(p)"
                      class="text-[#0d9488] hover:text-[#0f766e] font-bold font-mono hover:underline flex items-center cursor-pointer"
                    >
                      {{ $t('projects.recordProgress') }} ∨
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- LONG TERM PROJECTS (长期项目) -->
          <div class="pt-2">
            <div class="flex items-center justify-between mb-4 border-b-2 border-slate-900 pb-2">
              <h3 class="font-black text-sm text-slate-900">
                {{ $t('projects.longTerm') }}
              </h3>
              <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-900">
                {{ projectStore.longTermProjects.length }}
              </span>
            </div>

            <div class="space-y-4">
              <div
                v-for="p in projectStore.longTermProjects"
                :key="p.id"
                class="p-3 bg-white rounded-xl border-2 border-slate-900 shadow-hard-sm space-y-2 text-xs group"
              >
                <!-- Project Name & Deadline -->
                <div class="flex items-center justify-between font-bold">
                  <span class="text-slate-900 font-bold truncate max-w-[150px]" :title="p.name">
                    {{ p.name }}
                  </span>
                  <span class="text-slate-500 font-mono text-[10px] shrink-0 font-bold">{{ formatShortDate(p.deadline) }}</span>
                </div>

                <!-- Progress Bar + Percentage -->
                <div class="flex items-center gap-2 font-mono">
                  <span class="text-[11px] font-black text-[#0d9488] w-8">{{ p.progress || 0 }}%</span>
                  <div class="flex-1 bg-slate-100 h-2 rounded-md border border-slate-900 overflow-hidden">
                    <div 
                      class="bg-[#0d9488] h-full transition-all duration-300"
                      :style="{ width: `${p.progress || 0}%` }"
                    ></div>
                  </div>
                </div>

                <!-- Subtasks Checklist Accordion for Long Term -->
                <div v-if="getProjectTasks(p.id).length > 0" class="pt-2 border-t border-slate-100 space-y-1.5">
                  <div class="flex items-center justify-between">
                    <button
                      @click="toggleExpandProject(p.id)"
                      class="text-[11px] font-mono font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>📋 {{ isEn ? 'Subtasks & Milestones' : '子任务与节点' }}</span>
                      <span class="text-[10px] px-1.5 py-0.2 rounded bg-teal-100 text-teal-900 font-black border border-slate-900">
                        {{ getProjectTasks(p.id).filter(t => t.status === 'completed').length }}/{{ getProjectTasks(p.id).length }}
                      </span>
                      <span class="text-[9px] text-slate-400">
                        {{ expandedProjectIds.has(p.id) ? '▲' : '▼' }}
                      </span>
                    </button>
                  </div>

                  <div v-if="expandedProjectIds.has(p.id)" class="space-y-1 max-h-36 overflow-y-auto bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs font-sans animate-fade-in">
                    <div
                      v-for="task in getProjectTasks(p.id)"
                      :key="task.id"
                      class="flex items-center gap-2 p-1 rounded hover:bg-white transition-colors"
                    >
                      <input
                        type="checkbox"
                        :checked="task.status === 'completed'"
                        @change="handleToggleSubtask(task)"
                        class="w-3.5 h-3.5 rounded border-2 border-slate-900 accent-[#0d9488] cursor-pointer shrink-0"
                      />
                      <span
                        class="flex-1 truncate text-xs"
                        :class="task.status === 'completed' ? 'line-through text-slate-400 font-medium' : 'text-slate-800 font-bold'"
                        :title="task.title"
                      >
                        {{ task.title }}
                      </span>
                      <button
                        @click="openAdhdModal(task, p)"
                        class="text-[9px] font-mono font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-1 py-0.2 rounded border border-amber-300 cursor-pointer shrink-0"
                        title="5分钟启动"
                      >
                        ⚡ 5min
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Next Step + Action Menu + ADHD 5-Min Starter -->
                <div class="flex items-center justify-between text-[11px] text-slate-600 pt-0.5 border-t border-slate-100">
                  <span class="truncate max-w-[120px]" :title="p.next_step">
                    <span class="text-slate-400 font-mono">{{ $t('projects.nextStep') }}:</span> {{ p.next_step || $t('projects.statusProgress') }}
                  </span>
                  <div class="flex items-center gap-1.5 shrink-0">
                    <button
                      @click="openAdhdModal({ title: `${p.name} - ${p.next_step || '推进'}` }, p)"
                      class="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300 cursor-pointer"
                      title="难启动？开启5分钟拆解"
                    >
                      ⚡ 5min
                    </button>
                    <button
                      @click="openProgressModal(p)"
                      class="text-[#0d9488] hover:text-[#0f766e] font-bold font-mono hover:underline flex items-center cursor-pointer"
                    >
                      {{ $t('projects.recordProgress') }} ∨
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Bottom Right Logo Pill -->
        <div class="pt-6 flex justify-center">
          <div class="px-4 py-1.5 rounded-xl bg-slate-900 border-2 border-slate-900 text-white font-mono font-bold text-xs shadow-hard-sm flex items-center gap-2">
            <span>🌿 {{ $t('app.title') }} · OnTime</span>
          </div>
        </div>
      </aside>

    </div>

    <!-- Modals -->
    <SmartSchedulerModal
      :is-open="showWizardModal"
      :target-title="targetInput"
      :deadline-date="deadlineInput"
      @close="showWizardModal = false"
      @success="handleWizardSuccess"
    />

    <RecordProgressModal
      :is-open="showProgressModal"
      :project="selectedProject"
      @close="showProgressModal = false"
    />

    <MemberInviteModal
      :is-open="showMemberModal"
      :project="selectedProject"
      @close="showMemberModal = false"
    />

    <AttachmentModal
      :is-open="showAttachmentModal"
      :task="selectedTask"
      @close="showAttachmentModal = false"
    />

    <ReminderSettingsModal
      :is-open="showReminderModal"
      @close="showReminderModal = false"
    />

    <ProjectCompletionModal
      @view-milestones="currentView = 'milestones'"
    />

    <!-- ADHD 5-Minute Micro Starter Modal -->
    <AdhdMicroStarterModal
      :is-open="showAdhdModal"
      :task="selectedAdhdTask"
      :project="selectedAdhdProject"
      @close="showAdhdModal = false"
      @task-updated="handleAdhdTaskUpdated"
    />

    <!-- Periodic Growth Summary & Celebration Review Modal -->
    <PeriodicSummaryModal />

    <!-- Cute Celebration Puppy Companion 🐕 -->
    <CelebrationPuppy />

    <!-- Quick Log Modal -->
    <QuickLogModal
      :is-open="showQuickLogModal"
      :target-item="logTargetItem"
      :is-goal="isLogGoal"
      @close="showQuickLogModal = false"
    />

    <!-- Data Hub: Smart Import, Export & MCP Gateway Modal -->
    <SmartImportModal
      :is-open="showSmartImportModal"
      :initial-tab="dataHubInitialTab"
      @close="showSmartImportModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/authStore'
import { useProjectStore } from '../stores/projectStore'
import { useTaskStore } from '../stores/taskStore'
import { useReminderStore } from '../stores/reminderStore'
import { useMilestoneStore } from '../stores/milestoneStore'
import AppHeader from '../components/AppHeader.vue'
import SmartSchedulerModal from '../components/SmartSchedulerModal.vue'
import RecordProgressModal from '../components/RecordProgressModal.vue'
import MemberInviteModal from '../components/MemberInviteModal.vue'
import AttachmentModal from '../components/AttachmentModal.vue'
import ReminderSettingsModal from '../components/ReminderSettingsModal.vue'
import GentleReminderBanner from '../components/GentleReminderBanner.vue'
import MilestoneDashboard from '../components/MilestoneDashboard.vue'
import ProjectCompletionModal from '../components/ProjectCompletionModal.vue'
import AdhdMicroStarterModal from '../components/AdhdMicroStarterModal.vue'
import PeriodicSummaryModal from '../components/PeriodicSummaryModal.vue'
import CelebrationPuppy from '../components/CelebrationPuppy.vue'
import PushBar from '../components/PushBar.vue'
import GoalSection from '../components/GoalSection.vue'
import QuickLogModal from '../components/QuickLogModal.vue'
import KnowledgeBaseView from './KnowledgeBaseView.vue'
import SmartImportModal from '../components/SmartImportModal.vue'
import { useGeminiStore } from '../stores/geminiStore'
import confetti from 'canvas-confetti'

const auth = useAuthStore()
const projectStore = useProjectStore()
const taskStore = useTaskStore()
const reminderStore = useReminderStore()
const milestoneStore = useMilestoneStore()
const geminiStore = useGeminiStore()
const { t, locale } = useI18n()

// State
const currentView = ref('today') // 'today' | 'short' | 'long' | 'completed' | 'archived' | 'milestones'
const targetInput = ref('')
const deadlineInput = ref('')
const todayStr = dayjs().format('YYYY-MM-DD')

// Modals
const showWizardModal = ref(false)
const showProgressModal = ref(false)
const showMemberModal = ref(false)
const showAttachmentModal = ref(false)
const showReminderModal = ref(false)
const showAdhdModal = ref(false)
const showQuickLogModal = ref(false)
const showSmartImportModal = ref(false)
const dataHubInitialTab = ref('import')

const openDataHub = (tab = 'import') => {
  dataHubInitialTab.value = tab
  showSmartImportModal.value = true
}
const selectedProject = ref(null)
const selectedTask = ref(null)
const selectedAdhdTask = ref(null)
const selectedAdhdProject = ref(null)
const logTargetItem = ref(null)
const isLogGoal = ref(false)

const openQuickLog = (task) => {
  logTargetItem.value = task
  isLogGoal.value = false
  showQuickLogModal.value = true
}

const openQuickLogGoal = (goal) => {
  logTargetItem.value = goal
  isLogGoal.value = true
  showQuickLogModal.value = true
}

onMounted(async () => {
  await auth.initAuth()
  geminiStore.initUsage()
  await projectStore.fetchProjects()
  await taskStore.fetchTasks()

  // Global drag-and-drop listener
  window.addEventListener('dragover', (e) => e.preventDefault())
  window.addEventListener('drop', (e) => {
    e.preventDefault()
    showSmartImportModal.value = true
  })

  // Update milestone stats
  milestoneStore.checkStatsAndBadges(projectStore.projects, taskStore.tasks)

  // Default target date suggestion (5 days from now)
  deadlineInput.value = dayjs().add(5, 'day').format('YYYY-MM-DD')

  // Check if Web Notification should send friendly check-in on first load
  reminderStore.checkDismissDate()
})

const reminderSummaryText = computed(() => {
  if (!reminderStore.enabled) return locale.value === 'en' ? 'Reminder Off' : '提醒已关闭'
  if (reminderStore.shortTermFreq === 'daily') {
    return locale.value === 'en' ? `Daily ${reminderStore.shortTermTime}` : `每天 ${reminderStore.shortTermTime} 提醒`
  }
  if (reminderStore.shortTermFreq === 'every_2_days') {
    return locale.value === 'en' ? 'Every 2 Days' : '每2天温和提醒'
  }
  return locale.value === 'en' ? 'Reminder Settings' : '提醒设置'
})

const formattedTodayDate = computed(() => {
  const now = dayjs()
  const weekdaysZh = ['日','一','二','三','四','五','六']
  const weekdaysEn = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  const monthsEn = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  
  if (locale.value === 'en') {
    return `${weekdaysEn[now.day()]}, ${monthsEn[now.month()]} ${now.date()}`
  } else {
    return `${now.format('M月D日')} 星期${weekdaysZh[now.day()]}`
  }
})

const formatShortDate = (dateStr) => {
  if (!dateStr) return ''
  const d = dayjs(dateStr)
  if (locale.value === 'en') {
    const monthsEn = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    return `${monthsEn[d.month()]} ${d.date()}`
  } else {
    return d.format('M月D日')
  }
}

const getProjectName = (projectId) => {
  if (!projectId) return t('tasks.defaultProjectName')
  const proj = projectStore.projects.find(p => p.id === projectId)
  return proj ? proj.name : t('tasks.unknownProject')
}

const filteredProjects = computed(() => {
  if (currentView.value === 'short') return projectStore.shortTermProjects
  if (currentView.value === 'long') return projectStore.longTermProjects
  if (currentView.value === 'archived') return projectStore.archivedProjects
  return projectStore.activeProjects
})

const handleOpenWizard = () => {
  if (!targetInput.value.trim() || !deadlineInput.value) return
  showWizardModal.value = true
}

const handleWizardSuccess = () => {
  targetInput.value = ''
  deadlineInput.value = dayjs().add(5, 'day').format('YYYY-MM-DD')
  currentView.value = 'today'
  milestoneStore.checkStatsAndBadges(projectStore.projects, taskStore.tasks)
}

const handleCompleteTask = async (task) => {
  await taskStore.toggleTaskStatus(task.id)
  milestoneStore.checkStatsAndBadges(projectStore.projects, taskStore.tasks)
  confetti({
    particleCount: 50,
    spread: 50,
    origin: { y: 0.7 }
  })
}

const openProgressModal = (project) => {
  selectedProject.value = project
  showProgressModal.value = true
}

const openMemberModal = (project) => {
  selectedProject.value = project
  showMemberModal.value = true
}

const openAttachmentModal = (task) => {
  selectedTask.value = task
  showAttachmentModal.value = true
}

const openAdhdModal = (task = null, project = null) => {
  selectedAdhdTask.value = task
  selectedAdhdProject.value = project
  showAdhdModal.value = true
}

const handleAdhdTaskUpdated = () => {
  currentView.value = 'today'
}

// Subtask interactive accordion state
const expandedProjectIds = ref(new Set())

const toggleExpandProject = (projectId) => {
  if (expandedProjectIds.value.has(projectId)) {
    expandedProjectIds.value.delete(projectId)
  } else {
    expandedProjectIds.value.add(projectId)
  }
}

const getProjectTasks = (projectId) => {
  return taskStore.tasks.filter(t => t.project_id === projectId)
}

const handleToggleSubtask = async (task) => {
  await taskStore.toggleTaskStatus(task.id)
  milestoneStore.checkStatsAndBadges(projectStore.projects, taskStore.tasks)
  confetti({
    particleCount: 30,
    spread: 45,
    origin: { y: 0.8 }
  })
}
</script>
