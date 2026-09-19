<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
    <div class="bg-white rounded-3xl shadow-[6px_6px_0px_0px_#0d9488] max-w-2xl w-full overflow-hidden border-2 border-slate-900 animate-pop-in flex flex-col max-h-[92vh]">
      
      <!-- Modal Header -->
      <div class="p-5 border-b-2 border-slate-900 bg-[#f0fdfa] flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-[#0d9488] border-2 border-slate-900 text-white flex items-center justify-center text-xl shadow-hard-sm">
            📦
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-black text-sm sm:text-base text-slate-900">
                {{ $t('dataHub.modalTitle') }}
              </h3>
              <span class="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-slate-900 font-bold">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>MCP v2.0</span>
              </span>
            </div>
            <p class="text-xs text-slate-600 font-mono mt-0.5">
              {{ $t('dataHub.modalSubtitle') }}
            </p>
          </div>
        </div>
        <button 
          @click="close" 
          class="text-slate-400 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-200 cursor-pointer transition-colors"
          title="关闭 / Close"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Tab Switcher (Tactile Frame) -->
      <div class="flex border-b-2 border-slate-900 bg-slate-50 text-xs font-mono font-bold select-none overflow-x-auto">
        <!-- 1. 导入 -->
        <button
          @click="activeTab = 'import'"
          class="flex-1 py-3 px-3 text-center border-r-2 border-slate-900 transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
          :class="activeTab === 'import' ? 'bg-white text-slate-900 font-black border-b-2 border-b-white -mb-0.5 shadow-xs' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'"
        >
          <span>{{ $t('dataHub.tabImport') }}</span>
        </button>

        <!-- 2. 导出 -->
        <button
          @click="activeTab = 'export'"
          class="flex-1 py-3 px-3 text-center border-r-2 border-slate-900 transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
          :class="activeTab === 'export' ? 'bg-white text-slate-900 font-black border-b-2 border-b-white -mb-0.5 shadow-xs' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'"
        >
          <span>{{ $t('dataHub.tabExport') }}</span>
        </button>

        <!-- 3. MCP 智能体接入 -->
        <button
          @click="activeTab = 'mcp'"
          class="flex-1 py-3 px-3 text-center border-r-2 border-slate-900 transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
          :class="activeTab === 'mcp' ? 'bg-white text-slate-900 font-black border-b-2 border-b-white -mb-0.5 shadow-xs' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'"
        >
          <span>{{ $t('dataHub.tabMcp') }}</span>
        </button>

        <!-- 4. Web API -->
        <button
          @click="activeTab = 'api'"
          class="flex-1 py-3 px-3 text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
          :class="activeTab === 'api' ? 'bg-white text-slate-900 font-black border-b-2 border-b-white -mb-0.5 shadow-xs' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'"
        >
          <span>{{ $t('dataHub.tabApi') }}</span>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs">
        
        <!-- ============================================== -->
        <!-- TAB 1: 📥 智能导入 (IMPORT) -->
        <!-- ============================================== -->
        <div v-if="activeTab === 'import'" class="space-y-4">
          <!-- 1.1 Paste Outline Box -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="font-bold text-slate-800 flex items-center gap-1">
                <span>📝</span>
                <span>{{ $t('dataHub.import.pasteTitle') }}</span>
              </label>
              <span class="text-slate-400 font-mono text-[10px]">
                {{ $t('dataHub.import.pasteTip') }}
              </span>
            </div>
            <textarea
              v-model="smartText"
              rows="6"
              :placeholder="$t('dataHub.import.pastePlaceholder')"
              class="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-2xl focus:bg-white outline-none font-mono text-xs leading-relaxed text-slate-900 transition-colors"
              @input="updatePreview"
            ></textarea>
            <p class="text-[11px] text-teal-800 bg-teal-50/80 p-2.5 rounded-xl border border-teal-200 font-sans leading-relaxed">
              💡 {{ $t('dataHub.import.archiveNotice') }}
            </p>
          </div>

          <!-- Live Preview Box -->
          <div v-if="parsedStats" class="p-3.5 bg-emerald-50 rounded-2xl border-2 border-emerald-300 text-xs font-mono text-emerald-950 space-y-1.5 shadow-2xs">
            <div class="font-bold flex items-center gap-1.5">
              <span>🔍</span>
              <span>
                {{ isEnglish ? 'Detected:' : '解析统计：' }} 
                <b>{{ parsedStats.projects.length }}</b> {{ isEnglish ? 'projects' : '个项目' }}, 
                <b>{{ parsedStats.tasks.length }}</b> {{ isEnglish ? 'tasks' : '个任务' }}, 
                <b>{{ parsedStats.goals.length }}</b> {{ isEnglish ? 'goals' : '个目标' }}
              </span>
            </div>
            <ul class="text-[11px] text-emerald-800 list-disc pl-4 space-y-0.5">
              <li v-if="parsedStats.projects.length">
                {{ isEnglish ? 'Projects' : '项目' }}：{{ parsedStats.projects.map(p => p.name).join('、') }}
              </li>
              <li v-if="parsedStats.tasks.length">
                {{ isEnglish ? 'Tasks' : '任务' }}：{{ parsedStats.tasks.slice(0, 4).map(t => t.title).join('、') }} {{ parsedStats.tasks.length > 4 ? `…等 ${parsedStats.tasks.length} 项` : '' }}
              </li>
              <li v-if="parsedStats.goals.length">
                {{ isEnglish ? 'Goals' : '目标' }}：{{ parsedStats.goals.map(g => g.title).join('、') }}
              </li>
            </ul>
          </div>

          <!-- Format Guide Details -->
          <details class="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-[11px] font-mono">
            <summary class="cursor-pointer font-bold text-slate-700">📖 {{ $t('dataHub.import.formatHelper') }}</summary>
            <div class="pt-2 text-slate-600 whitespace-pre-wrap leading-relaxed border-t border-slate-200 mt-2 font-mono text-[10px]">
# 项目：副业独立开发与上线
## 短期
- [ ] 核心 MVP 功能开发 | 高 | 9/20
  最小启动项：打开 VS Code，列出前 3 个接口
  行动点：实现数据库连接 / 编写验证逻辑
# 目标：AWS 架构师认证备考 | 2026-10-29
- [x] 完成第一阶段刷题
- [ ] 完成全真模拟模考
            </div>
          </details>

          <!-- 1.2 Restore from JSON Section -->
          <div class="pt-3 border-t-2 border-slate-100 space-y-2 font-mono">
            <label class="block font-bold text-slate-700">
              💾 {{ $t('dataHub.import.restoreTitle') }}
            </label>
            <textarea
              v-model="jsonText"
              rows="3"
              :placeholder="$t('dataHub.import.restorePlaceholder')"
              class="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-[11px] font-mono"
            ></textarea>
            <div class="flex items-center gap-2">
              <button
                @click="handleJSONImport('merge')"
                class="px-3.5 py-1.5 bg-[#0d9488] hover:bg-[#0f766e] text-white rounded-xl font-bold text-xs cursor-pointer shadow-hard-sm active:translate-x-[1px] active:translate-y-[1px]"
              >
                {{ $t('dataHub.import.btnMerge') }}
              </button>
              <button
                @click="handleJSONImport('replace')"
                class="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs cursor-pointer shadow-hard-sm active:translate-x-[1px] active:translate-y-[1px]"
              >
                {{ $t('dataHub.import.btnReplace') }}
              </button>
            </div>
          </div>
        </div>

        <!-- ============================================== -->
        <!-- TAB 2: 📤 数据导出 (EXPORT) - [NEW & COMPREHENSIVE] -->
        <!-- ============================================== -->
        <div v-else-if="activeTab === 'export'" class="space-y-5">
          <!-- 2.1 Scope & Filters Bar -->
          <div class="p-4 bg-slate-50 rounded-2xl border-2 border-slate-900 shadow-hard-sm space-y-3">
            <div class="flex items-center justify-between">
              <span class="font-black text-slate-800 text-xs flex items-center gap-1.5">
                <span>🎯</span>
                <span>{{ $t('dataHub.export.scopeTitle') }}</span>
              </span>
              <div class="text-[11px] font-mono text-[#0d9488] font-bold">
                {{ filteredTasksCount }} {{ isEnglish ? 'tasks selected' : '项任务就绪' }}
              </div>
            </div>

            <!-- Scope Dropdown -->
            <div class="flex flex-wrap items-center gap-2">
              <select
                v-model="exportScope"
                @change="refreshExportMarkdown"
                class="px-3 py-1.5 bg-white border-2 border-slate-900 rounded-xl font-bold text-xs text-slate-800 outline-none cursor-pointer"
              >
                <option value="all">📁 {{ $t('dataHub.export.allProjects') }} ({{ projectStore.projects.length }})</option>
                <option v-for="proj in projectStore.projects" :key="proj.id" :value="proj.id">
                  📁 {{ proj.name }}
                </option>
              </select>

              <!-- Checkbox: Include Completed -->
              <label class="flex items-center gap-1.5 text-xs text-slate-700 font-bold cursor-pointer select-none bg-white px-2.5 py-1.5 rounded-xl border border-slate-300 hover:border-slate-900">
                <input
                  type="checkbox"
                  v-model="exportIncludeCompleted"
                  @change="refreshExportMarkdown"
                  class="rounded border-slate-900 text-[#0d9488] focus:ring-0"
                />
                <span>{{ $t('dataHub.export.includeCompleted') }}</span>
              </label>

              <!-- Checkbox: Include Goals -->
              <label 
                v-if="exportScope === 'all'"
                class="flex items-center gap-1.5 text-xs text-slate-700 font-bold cursor-pointer select-none bg-white px-2.5 py-1.5 rounded-xl border border-slate-300 hover:border-slate-900"
              >
                <input
                  type="checkbox"
                  v-model="exportIncludeGoals"
                  @change="refreshExportMarkdown"
                  class="rounded border-slate-900 text-[#0d9488] focus:ring-0"
                />
                <span>{{ $t('dataHub.export.includeGoals') }}</span>
              </label>

              <!-- Checkbox: Include Notes -->
              <label 
                v-if="exportScope === 'all'"
                class="flex items-center gap-1.5 text-xs text-slate-700 font-bold cursor-pointer select-none bg-white px-2.5 py-1.5 rounded-xl border border-slate-300 hover:border-slate-900"
              >
                <input
                  type="checkbox"
                  v-model="exportIncludeNotes"
                  @change="refreshExportMarkdown"
                  class="rounded border-slate-900 text-[#0d9488] focus:ring-0"
                />
                <span>{{ $t('dataHub.export.includeNotes') }}</span>
              </label>
            </div>
          </div>

          <!-- 2.2 Three Export Action Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <!-- Card 1: Markdown Outline -->
            <div class="p-3.5 bg-teal-50/50 rounded-2xl border-2 border-slate-900 flex flex-col justify-between space-y-3 shadow-hard-sm">
              <div>
                <div class="flex items-center gap-1.5 font-black text-slate-900 text-xs">
                  <span>📄</span>
                  <span>{{ $t('dataHub.export.mdSectionTitle') }}</span>
                </div>
                <p class="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  {{ $t('dataHub.export.mdSectionDesc') }}
                </p>
              </div>
              <div class="space-y-1.5 pt-1">
                <button
                  @click="handleDownloadMarkdown"
                  class="w-full py-2 px-2 bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold rounded-xl border-2 border-slate-900 shadow-2xs active:translate-x-[1px] active:translate-y-[1px] cursor-pointer text-xs flex items-center justify-center gap-1"
                >
                  <span>{{ $t('dataHub.export.btnDownloadMd') }}</span>
                </button>
                <button
                  @click="handleCopyMarkdown"
                  class="w-full py-1.5 px-2 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-xl border border-slate-900 cursor-pointer text-[11px] flex items-center justify-center gap-1"
                >
                  <span>{{ copiedType === 'md' ? (isEnglish ? '✓ Copied' : '✓ 已复制') : $t('dataHub.export.btnCopyMd') }}</span>
                </button>
              </div>
            </div>

            <!-- Card 2: JSON Backup -->
            <div class="p-3.5 bg-amber-50/50 rounded-2xl border-2 border-slate-900 flex flex-col justify-between space-y-3 shadow-hard-sm">
              <div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5 font-black text-slate-900 text-xs">
                    <span>💾</span>
                    <span>{{ $t('dataHub.export.jsonSectionTitle') }}</span>
                  </div>
                  <span class="text-[10px] font-mono text-amber-900 font-bold bg-amber-200/60 px-1.5 py-0.5 rounded">
                    {{ storageKB }} KB
                  </span>
                </div>
                <p class="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  {{ $t('dataHub.export.jsonSectionDesc') }}
                </p>
              </div>
              <div class="space-y-1.5 pt-1">
                <button
                  @click="downloadJSON"
                  class="w-full py-2 px-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-black rounded-xl border-2 border-slate-900 shadow-2xs active:translate-x-[1px] active:translate-y-[1px] cursor-pointer text-xs flex items-center justify-center gap-1"
                >
                  <span>{{ $t('dataHub.export.btnDownloadJson') }}</span>
                </button>
                <button
                  @click="copyJSON"
                  class="w-full py-1.5 px-2 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-xl border border-slate-900 cursor-pointer text-[11px] flex items-center justify-center gap-1"
                >
                  <span>{{ copiedType === 'json' ? (isEnglish ? '✓ Copied' : '✓ 已复制') : $t('dataHub.export.btnCopyJson') }}</span>
                </button>
              </div>
            </div>

            <!-- Card 3: CSV Spreadsheet -->
            <div class="p-3.5 bg-blue-50/50 rounded-2xl border-2 border-slate-900 flex flex-col justify-between space-y-3 shadow-hard-sm">
              <div>
                <div class="flex items-center gap-1.5 font-black text-slate-900 text-xs">
                  <span>📊</span>
                  <span>{{ $t('dataHub.export.csvSectionTitle') }}</span>
                </div>
                <p class="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  {{ $t('dataHub.export.csvSectionDesc') }}
                </p>
              </div>
              <div class="space-y-1.5 pt-1">
                <button
                  @click="handleDownloadCSV"
                  class="w-full py-2 px-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl border-2 border-slate-900 shadow-2xs active:translate-x-[1px] active:translate-y-[1px] cursor-pointer text-xs flex items-center justify-center gap-1"
                >
                  <span>{{ $t('dataHub.export.btnDownloadCsv') }}</span>
                </button>
                <button
                  @click="handleCopyCSV"
                  class="w-full py-1.5 px-2 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-xl border border-slate-900 cursor-pointer text-[11px] flex items-center justify-center gap-1"
                >
                  <span>{{ copiedType === 'csv' ? (isEnglish ? '✓ Copied' : '✓ 已复制') : (isEnglish ? '📋 Copy CSV' : '📋 复制 CSV') }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 2.3 Live Markdown Preview Textarea -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="font-bold text-slate-700 flex items-center gap-1">
                <span>👁️</span>
                <span>{{ $t('dataHub.export.previewTitle') }}</span>
              </label>
              <button
                @click="handleCopyMarkdown"
                class="text-[11px] font-mono font-bold text-[#0d9488] hover:underline cursor-pointer"
              >
                {{ copiedType === 'md' ? (isEnglish ? '✓ Copied!' : '✓ 已复制到剪贴板！') : (isEnglish ? 'Copy text' : '点此快速复制') }}
              </button>
            </div>
            <textarea
              readonly
              :value="generatedMarkdownPreview"
              rows="6"
              class="w-full px-3.5 py-2.5 bg-slate-900 text-emerald-400 border-2 border-slate-900 rounded-2xl font-mono text-[11px] leading-relaxed select-all outline-none"
            ></textarea>
          </div>
        </div>

        <!-- ============================================== -->
        <!-- TAB 3: 🔌 MCP 智能体接入 (MCP INTEGRATION) - [BILINGUAL & INTEGRATED] -->
        <!-- ============================================== -->
        <div v-else-if="activeTab === 'mcp'" class="space-y-4">
          <!-- 3.1 Status & Protocol Endpoint Card -->
          <div class="bg-slate-50 p-4 rounded-2xl border-2 border-slate-900 shadow-hard-sm space-y-3 font-mono text-xs">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="font-bold text-slate-800 font-sans flex items-center gap-1.5">
                  <span>🔌</span>
                  <span>{{ $t('dataHub.mcp.endpointLabel') }}</span>
                </span>
                <span class="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-slate-900 font-bold font-mono">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>{{ $t('dataHub.mcp.statusConnected') }}</span>
                </span>
              </div>
              <button
                @click="copyText('http://localhost:8644/mcp', 'mcp_endpoint')"
                class="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-900 font-black rounded-lg border border-slate-900 shadow-2xs active:translate-x-[1px] active:translate-y-[1px] cursor-pointer text-[11px] flex items-center gap-1"
              >
                <span>{{ copiedType === 'mcp_endpoint' ? $t('dataHub.mcp.copied') : $t('dataHub.mcp.btnCopyEndpoint') }}</span>
              </button>
            </div>
            <div class="px-3 py-2 bg-white rounded-xl border border-slate-300 text-teal-800 font-bold break-all select-all">
              http://localhost:8644/mcp
            </div>

            <div class="flex items-center justify-between pt-1 border-t border-slate-200">
              <span class="font-bold text-slate-800 font-sans flex items-center gap-1.5">
                <span>🔑</span>
                <span>{{ $t('dataHub.mcp.tokenLabel') }}</span>
              </span>
              <button
                @click="copyText('ontime_live_sk_mcp_8888', 'mcp_token')"
                class="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-900 font-black rounded-lg border border-slate-900 shadow-2xs active:translate-x-[1px] active:translate-y-[1px] cursor-pointer text-[11px] flex items-center gap-1"
              >
                <span>{{ copiedType === 'mcp_token' ? $t('dataHub.mcp.copied') : $t('dataHub.mcp.btnCopyToken') }}</span>
              </button>
            </div>
            <div class="px-3 py-1.5 bg-white rounded-xl border border-slate-300 text-slate-800 font-bold flex items-center justify-between select-all">
              <span>ontime_live_sk_mcp_8888</span>
              <span class="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold font-sans">
                {{ $t('dataHub.mcp.permanentValid') }}
              </span>
            </div>
          </div>

          <!-- 3.2 Client Configuration Snippet (Claude Desktop / Cursor) -->
          <details class="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs font-mono">
            <summary class="cursor-pointer font-bold text-slate-800 flex items-center justify-between">
              <span>⚙️ {{ $t('dataHub.mcp.clientConfigTitle') }}</span>
              <span class="text-[10px] text-slate-500 font-mono">Claude Desktop / Cursor</span>
            </summary>
            <div class="pt-2 text-slate-600 leading-relaxed border-t border-slate-200 mt-2 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-[10px] text-slate-400">claude_desktop_config.json:</span>
                <button
                  @click="copyText(mcpConfigSnippet, 'mcp_config')"
                  class="text-[10px] text-[#0d9488] font-bold hover:underline cursor-pointer"
                >
                  {{ copiedType === 'mcp_config' ? $t('dataHub.mcp.copied') : $t('dataHub.mcp.copyConfig') }}
                </button>
              </div>
              <pre class="p-3 bg-slate-900 text-emerald-400 rounded-xl text-[10px] overflow-x-auto leading-relaxed">{{ mcpConfigSnippet }}</pre>
            </div>
          </details>

          <!-- 3.3 Interactive Command Test Console (Live Workbench Sync) -->
          <div class="space-y-2.5">
            <div class="flex items-center justify-between">
              <span class="font-black text-xs text-slate-900 flex items-center gap-1.5 font-sans">
                <span>💬</span>
                <span>{{ $t('dataHub.mcp.testConsoleTitle') }}</span>
              </span>
              <span class="text-[10px] text-slate-500 font-mono">
                {{ $t('dataHub.mcp.testConsoleTip') }}
              </span>
            </div>

            <!-- Quick Presets -->
            <div class="flex flex-wrap gap-1.5 text-xs font-mono">
              <button
                v-for="(preset, i) in quickPresets"
                :key="i"
                @click="sendPreset(preset)"
                class="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 rounded-xl border border-slate-300 hover:border-slate-900 transition-all cursor-pointer font-medium text-[11px]"
              >
                {{ preset }}
              </button>
            </div>

            <!-- Console Log Box -->
            <div class="bg-slate-900 rounded-2xl p-3.5 border-2 border-slate-900 shadow-hard-sm min-h-[140px] max-h-[200px] overflow-y-auto space-y-2 font-mono text-xs text-white">
              <div
                v-for="(msg, idx) in chatMessages"
                :key="idx"
                class="flex flex-col gap-1"
                :class="msg.role === 'user' ? 'items-end' : 'items-start'"
              >
                <div class="flex items-center gap-1 text-[10px] text-slate-400">
                  <span>{{ msg.role === 'user' ? '👤 YOU' : '🤖 MCP AGENT' }}</span>
                  <span>{{ msg.time }}</span>
                </div>
                <div
                  class="max-w-[90%] px-3 py-2 rounded-xl whitespace-pre-wrap leading-relaxed border text-[11px]"
                  :class="msg.role === 'user' 
                    ? 'bg-[#0d9488] text-white border-teal-400 rounded-tr-none' 
                    : 'bg-slate-800 text-slate-100 border-slate-700 rounded-tl-none'"
                >
                  {{ msg.text }}
                </div>
              </div>

              <div v-if="isThinking" class="flex items-center gap-2 text-slate-400 text-xs py-1">
                <span class="animate-spin">⚙️</span>
                <span>{{ $t('dataHub.mcp.thinking') }}</span>
              </div>
            </div>

            <!-- Input Bar -->
            <div class="flex items-center gap-2">
              <input
                v-model="inputQuery"
                @keyup.enter="handleSendMessage"
                type="text"
                :placeholder="$t('dataHub.mcp.inputPlaceholder')"
                class="flex-1 px-3.5 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-sans font-bold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-[#0d9488]"
              />
              <button
                @click="handleSendMessage"
                :disabled="!inputQuery.trim() || isThinking"
                class="px-4 py-2 bg-[#0d9488] hover:bg-[#0f766e] disabled:opacity-50 text-white font-bold rounded-xl border-2 border-slate-900 shadow-hard-sm active:translate-x-[1px] active:translate-y-[1px] cursor-pointer text-xs font-mono"
              >
                {{ $t('dataHub.mcp.btnSend') }}
              </button>
            </div>
          </div>
        </div>

        <!-- ============================================== -->
        <!-- TAB 4: 🤖 开放编程接口 (API) -->
        <!-- ============================================== -->
        <div v-else-if="activeTab === 'api'" class="space-y-3 font-mono text-xs">
          <div class="p-3.5 bg-slate-900 text-emerald-400 rounded-2xl text-[11px] leading-relaxed overflow-x-auto max-h-72">
<pre>▍读取 API
window.Workbench.getState()      // 获取全部数据状态
window.Workbench.getTasks()      // 任务列表
window.Workbench.getProjects()   // 项目列表
window.Workbench.getGoals()      // 目标列表
window.Workbench.getNotes()      // 沉淀笔记列表
window.Workbench.getLogs()       // 推进流水时间线

▍写入 API
window.Workbench.addTask({ title, type, projectName, priority, due, starter })
window.Workbench.addGoal({ title, deadline, nodes })
window.Workbench.addNote({ title, body, kind, tags })
window.Workbench.log(taskId, '这次推进了什么')

▍批量导入与导出
window.Workbench.importText(markdownString)
window.Workbench.exportJSON()
window.Workbench.exportMarkdown()</pre>
          </div>
          <p class="text-[11px] text-slate-500 font-sans leading-relaxed">
            {{ $t('dataHub.api.tip') }}
          </p>
        </div>

      </div>

      <!-- Modal Footer -->
      <div class="p-4 bg-slate-50 border-t-2 border-slate-900 flex items-center justify-between">
        <div>
          <button
            v-if="activeTab === 'import'"
            @click="fillSample"
            class="text-xs font-mono font-bold text-[#0d9488] hover:underline cursor-pointer"
          >
            {{ $t('dataHub.import.btnSample') }}
          </button>
          <span v-else-if="activeTab === 'mcp'" class="text-xs font-mono text-slate-500">
            {{ $t('dataHub.mcp.status') }}: <strong class="text-emerald-700">{{ $t('dataHub.mcp.statusReady') }}</strong>
          </span>
          <span v-else></span>
        </div>

        <div class="flex items-center gap-2">
          <button @click="close" class="px-4 py-2 bg-white rounded-xl border-2 border-slate-900 font-bold text-xs cursor-pointer hover:bg-slate-100">
            {{ isEnglish ? 'Close' : '关闭' }}
          </button>
          <button
            v-if="activeTab === 'import'"
            @click="handleDoImport"
            class="px-5 py-2 bg-[#0d9488] hover:bg-[#0f766e] text-white rounded-xl border-2 border-slate-900 font-bold text-xs shadow-hard-sm cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
          >
            {{ $t('dataHub.import.btnConfirm') }}
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import { parseSmartText, SMART_SAMPLE } from '../utils/markdownParser'
import { generateMarkdownExport, generateCSVExport, downloadFile } from '../utils/exportUtils'
import { executeHermesCommand } from '../utils/hermesBridge'
import { useTaskStore } from '../stores/taskStore'
import { useProjectStore } from '../stores/projectStore'
import { useMilestoneStore } from '../stores/milestoneStore'
import confetti from 'canvas-confetti'

const props = defineProps({
  isOpen: Boolean,
  initialTab: {
    type: String,
    default: 'import' // 'import' | 'export' | 'mcp' | 'api'
  }
})

const emit = defineEmits(['close', 'imported'])

const { t, locale } = useI18n()
const isEnglish = computed(() => locale.value === 'en')

const taskStore = useTaskStore()
const projectStore = useProjectStore()
const milestoneStore = useMilestoneStore()

const activeTab = ref('import')

watch(() => props.initialTab, (newTab) => {
  if (newTab) {
    if (newTab === 'smart') activeTab.value = 'import'
    else if (newTab === 'data') activeTab.value = 'export'
    else activeTab.value = newTab
  }
}, { immediate: true })

// -------------------------------------------------------------
// TAB 1: 导入状态
// -------------------------------------------------------------
const smartText = ref('')
const jsonText = ref('')
const parsedStats = ref(null)

const updatePreview = () => {
  if (!smartText.value.trim()) {
    parsedStats.value = null
    return
  }
  const res = parseSmartText(smartText.value)
  parsedStats.value = {
    projects: res.projects,
    tasks: res.tasks,
    goals: res.goals
  }
}

const fillSample = () => {
  smartText.value = SMART_SAMPLE
  updatePreview()
}

const handleDoImport = async () => {
  if (!smartText.value.trim()) return
  const res = parseSmartText(smartText.value)

  // 1. Projects
  for (const p of res.projects) {
    const exists = projectStore.projects.find(x => x.name === p.name)
    if (!exists) {
      await projectStore.createProject(p)
    }
  }

  // 2. Tasks
  for (const t of res.tasks) {
    let pid = null
    if (t.projectName) {
      const p = projectStore.projects.find(x => x.name === t.projectName)
      if (p) pid = p.id
    }
    await taskStore.addTask({
      title: t.title,
      type: t.type || 'short',
      priority: t.priority || 'mid',
      due: t.due || '',
      assigned_date: t.due || dayjs().format('YYYY-MM-DD'),
      starter: t.starter || '',
      steps: t.steps || [],
      project_id: pid
    })
  }

  // 3. Goals
  for (const g of res.goals) {
    const exists = projectStore.goals.find(x => x.title === g.title)
    if (!exists) {
      await projectStore.addGoal(g)
    }
  }

  // 4. Archive original text as a Plan Document in Knowledge Base
  const planTitle = res.projects[0]?.name 
    ? (isEnglish.value ? `Plan: ${res.projects[0].name}` : `大纲计划：${res.projects[0].name}`)
    : (isEnglish.value ? `Batch Import Plan (${dayjs().format('MM-DD')})` : `批量导入计划 (${dayjs().format('MM-DD HH:mm')})`)
  
  await projectStore.addNote({
    title: planTitle,
    kind: 'plan',
    tags: ['大纲导入', '规划原文'],
    body: smartText.value
  })

  confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } })
  emit('imported')
  smartText.value = ''
  parsedStats.value = null
  close()
}

// -------------------------------------------------------------
// TAB 2: 导出状态与逻辑
// -------------------------------------------------------------
const exportScope = ref('all')
const exportIncludeCompleted = ref(true)
const exportIncludeGoals = ref(true)
const exportIncludeNotes = ref(false)
const copiedType = ref('')

const filteredTasksCount = computed(() => {
  let list = taskStore.tasks
  if (exportScope.value !== 'all') {
    list = list.filter(t => t.project_id === exportScope.value)
  }
  if (!exportIncludeCompleted.value) {
    list = list.filter(t => t.status !== 'completed')
  }
  return list.length
})

const generatedMarkdownPreview = computed(() => {
  return generateMarkdownExport({
    projects: projectStore.projects,
    tasks: taskStore.tasks,
    goals: projectStore.goals,
    notes: projectStore.notes,
    scope: exportScope.value,
    includeCompleted: exportIncludeCompleted.value,
    includeGoals: exportIncludeGoals.value,
    includeNotes: exportIncludeNotes.value,
    isEnglish: isEnglish.value
  })
})

const refreshExportMarkdown = () => {
  // Computed property updates reactively
}

const handleDownloadMarkdown = () => {
  const md = generatedMarkdownPreview.value
  const dateStr = dayjs().format('YYYYMMDD')
  const filename = isEnglish.value 
    ? `OnTime_Workbench_Export_${dateStr}.md` 
    : `如期工作台_任务清单_${dateStr}.md`
  downloadFile(filename, md, 'text/markdown;charset=utf-8')
  confetti({ particleCount: 30, spread: 40 })
}

const handleCopyMarkdown = () => {
  navigator.clipboard.writeText(generatedMarkdownPreview.value)
  copiedType.value = 'md'
  setTimeout(() => { copiedType.value = '' }, 2000)
}

const handleDownloadCSV = () => {
  let targetTasks = taskStore.tasks
  if (exportScope.value !== 'all') {
    targetTasks = targetTasks.filter(t => t.project_id === exportScope.value)
  }
  if (!exportIncludeCompleted.value) {
    targetTasks = targetTasks.filter(t => t.status !== 'completed')
  }

  const csv = generateCSVExport({
    tasks: targetTasks,
    projects: projectStore.projects,
    isEnglish: isEnglish.value
  })
  const dateStr = dayjs().format('YYYYMMDD')
  const filename = isEnglish.value 
    ? `OnTime_Tasks_${dateStr}.csv` 
    : `如期工作台_任务明细_${dateStr}.csv`
  downloadFile(filename, csv, 'text/csv;charset=utf-8;')
  confetti({ particleCount: 30, spread: 40 })
}

const handleCopyCSV = () => {
  let targetTasks = taskStore.tasks
  if (exportScope.value !== 'all') {
    targetTasks = targetTasks.filter(t => t.project_id === exportScope.value)
  }
  const csv = generateCSVExport({
    tasks: targetTasks,
    projects: projectStore.projects,
    isEnglish: isEnglish.value
  })
  navigator.clipboard.writeText(csv)
  copiedType.value = 'csv'
  setTimeout(() => { copiedType.value = '' }, 2000)
}

// -------------------------------------------------------------
// JSON 备份与恢复
// -------------------------------------------------------------
const storageKB = ref(0)

const calculateStorage = () => {
  let total = 0
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += (localStorage[key].length * 2)
    }
  }
  storageKB.value = Math.round(total / 1024)
}

const getFullBackupObject = () => {
  return {
    version: '2.0',
    exportedAt: new Date().toISOString(),
    projects: projectStore.projects,
    tasks: taskStore.tasks,
    goals: projectStore.goals,
    notes: projectStore.notes,
    milestones: milestoneStore.milestones
  }
}

const downloadJSON = () => {
  const jsonStr = JSON.stringify(getFullBackupObject(), null, 2)
  const filename = `orderly_workbench_backup_${dayjs().format('YYYYMMDD')}.json`
  downloadFile(filename, jsonStr, 'application/json;charset=utf-8')
  copiedType.value = 'json'
  setTimeout(() => { copiedType.value = '' }, 2000)
}

const copyJSON = () => {
  const jsonStr = JSON.stringify(getFullBackupObject(), null, 2)
  navigator.clipboard.writeText(jsonStr)
  copiedType.value = 'json'
  setTimeout(() => { copiedType.value = '' }, 2000)
}

const handleJSONImport = (mode) => {
  if (!jsonText.value.trim()) return
  try {
    const data = JSON.parse(jsonText.value)
    if (mode === 'replace') {
      if (confirm(isEnglish.value ? 'Are you sure you want to replace and clear existing data?' : '确定要清空现有数据并完全按此备份覆盖重建吗？')) {
        if (data.projects) projectStore.projects = data.projects
        if (data.tasks) taskStore.tasks = data.tasks
        if (data.goals) projectStore.goals = data.goals
        if (data.notes) projectStore.notes = data.notes
        alert(isEnglish.value ? 'Restored successfully!' : '覆盖恢复成功！')
        close()
      }
    } else {
      // Merge
      if (data.projects) {
        data.projects.forEach(p => {
          if (!projectStore.projects.some(x => x.name === p.name)) {
            projectStore.projects.push(p)
          }
        })
      }
      if (data.tasks) {
        data.tasks.forEach(t => {
          if (!taskStore.tasks.some(x => x.title === t.title)) {
            taskStore.tasks.push(t)
          }
        })
      }
      if (data.goals) {
        data.goals.forEach(g => {
          if (!projectStore.goals.some(x => x.title === g.title)) {
            projectStore.goals.push(g)
          }
        })
      }
      if (data.notes) {
        data.notes.forEach(n => {
          if (!projectStore.notes.some(x => x.title === n.title)) {
            projectStore.notes.push(n)
          }
        })
      }
      alert(isEnglish.value ? 'Merged successfully!' : '合并导入成功！')
      close()
    }
  } catch (err) {
    alert(isEnglish.value ? 'Invalid JSON format: ' + err.message : 'JSON 格式解析失败：' + err.message)
  }
}

// -------------------------------------------------------------
// TAB 3: MCP 智能体接入
// -------------------------------------------------------------
const inputQuery = ref('')
const isThinking = ref(false)

const copyText = (text, typeKey) => {
  navigator.clipboard.writeText(text)
  copiedType.value = typeKey
  setTimeout(() => { copiedType.value = '' }, 2000)
}

const quickPresets = computed(() => [
  t('dataHub.mcp.preset1'),
  t('dataHub.mcp.preset2'),
  t('dataHub.mcp.preset3'),
])

const chatMessages = ref([])

// Initialize or update welcome message when locale changes
watch(locale, () => {
  if (chatMessages.value.length <= 1) {
    chatMessages.value = [
      {
        role: 'hermes',
        text: t('dataHub.mcp.welcomeMessage'),
        time: dayjs().format('HH:mm:ss')
      }
    ]
  }
}, { immediate: true })

const mcpConfigSnippet = computed(() => {
  return JSON.stringify({
    mcpServers: {
      "ontime-workbench": {
        "url": "http://localhost:8644/mcp",
        "headers": {
          "Authorization": "Bearer ontime_live_sk_mcp_8888"
        }
      }
    }
  }, null, 2)
})

const sendPreset = (presetText) => {
  inputQuery.value = presetText
  handleSendMessage()
}

const handleSendMessage = async () => {
  if (!inputQuery.value.trim() || isThinking.value) return

  const userQuery = inputQuery.value.trim()
  inputQuery.value = ''

  chatMessages.value.push({
    role: 'user',
    text: userQuery,
    time: dayjs().format('HH:mm:ss'),
  })

  isThinking.value = true

  setTimeout(async () => {
    const result = await executeHermesCommand(userQuery, {
      projectStore,
      taskStore,
      milestoneStore,
      isEnglish: isEnglish.value,
    })

    isThinking.value = false

    chatMessages.value.push({
      role: 'hermes',
      text: result.responseMessage,
      time: dayjs().format('HH:mm:ss'),
    })

    if (result.action === 'project_created' || result.action === 'task_completed') {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 }
      })
    }
  }, 500)
}

const close = () => {
  emit('close')
}

onMounted(() => {
  calculateStorage()
})
</script>
