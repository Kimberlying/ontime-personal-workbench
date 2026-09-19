<template>
  <div class="min-h-screen text-slate-900 font-sans p-4 sm:p-8 relative selection:bg-slate-800 selection:text-white transition-colors duration-300"
       :style="currentTheme.bgStyle">
    
    <div class="max-w-6xl mx-auto space-y-8">
      
      <!-- Top Navigation & Control Banner -->
      <div class="bg-white border-2 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-hard relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div class="space-y-2 max-w-2xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 text-white font-mono text-xs font-bold rounded-lg uppercase tracking-wider shadow-[2px_2px_0px_0px_#0f172a] transition-colors"
               :style="{ backgroundColor: currentTheme.primary }">
            <span>🎨</span>
            <span>「如期」主题调色盘与独立预览中心</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            主题配色独立预览与选择
          </h1>
          <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
            您可以在此<strong>无损预览不同主题的真实界面效果</strong>（切换预览不会影响主工作台）。如果您想将某套配色应用到全站，只需点击对应的【🌟 应用为全站主题】即可！
          </p>
        </div>

        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full sm:w-auto font-mono text-xs font-bold">
          <!-- Apply to whole app button -->
          <button
            @click="applyToWholeApp(previewThemeKey)"
            class="px-4 py-2.5 text-white rounded-xl border-2 border-slate-900 shadow-hard hover:shadow-hard-sm active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer flex items-center justify-center gap-1.5"
            :style="{ backgroundColor: currentTheme.primary }"
          >
            <span>🌟</span>
            <span>将「{{ currentTheme.name }}」应用为全站</span>
          </button>

          <!-- Back to Workbench -->
          <router-link
            to="/app"
            class="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-900 rounded-xl border-2 border-slate-900 shadow-hard-sm transition-all text-center flex items-center justify-center gap-1"
          >
            <span>🚀 返回主工作台</span>
          </router-link>
        </div>
      </div>

      <!-- 3 THEME SELECTOR TABS (清晰选择与当前状态提示) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <!-- Theme 1: 鼠尾草松针绿 (Sage & Nordic Spruce) -->
        <div
          @click="previewThemeKey = 'spruce'"
          class="p-5 rounded-2xl border-2 border-slate-900 text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 relative group"
          :class="previewThemeKey === 'spruce' 
            ? 'bg-white shadow-[5px_5px_0px_0px_#0d9488] -translate-y-1' 
            : 'bg-white/80 shadow-hard-sm opacity-80 hover:opacity-100'"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-4 h-4 rounded-full bg-[#0d9488] border border-slate-900"></span>
              <h3 class="font-black text-sm text-slate-900">选项 1：鼠尾草松针绿 🌿</h3>
            </div>
            <span v-if="themeStore.currentThemeId === 'spruce'" class="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-teal-100 text-[#0d9488] border border-slate-900">
              全站当前生效
            </span>
          </div>

          <p class="text-xs text-slate-600 leading-relaxed">
            <strong>Sage & Nordic Spruce</strong><br>
            北欧极简冷绿，光学上眼睫状肌最放松，零蓝光反光。
          </p>

          <div class="flex items-center justify-between pt-1 border-t border-slate-200 text-xs font-mono">
            <div class="flex gap-1">
              <span class="px-1.5 py-0.5 rounded bg-[#0d9488] text-white text-[10px] font-bold">#0D9488</span>
              <span class="px-1.5 py-0.5 rounded bg-[#f5f8f6] text-slate-700 text-[10px] font-bold border border-slate-300">#F5F8F6</span>
            </div>
            <span class="text-[11px] font-bold text-[#0d9488]">
              {{ previewThemeKey === 'spruce' ? '正在预览中 ✓' : '点击独立预览' }}
            </span>
          </div>
        </div>

        <!-- Theme 2: 温润骨白纸手账 (Warm Bone Paper & Charcoal) -->
        <div
          @click="previewThemeKey = 'bonepaper'"
          class="p-5 rounded-2xl border-2 border-slate-900 text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 relative group"
          :class="previewThemeKey === 'bonepaper' 
            ? 'bg-[#faf8f5] shadow-[5px_5px_0px_0px_#d97706] -translate-y-1' 
            : 'bg-white/80 shadow-hard-sm opacity-80 hover:opacity-100'"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-4 h-4 rounded-full bg-[#d97706] border border-slate-900"></span>
              <h3 class="font-black text-sm text-slate-900">选项 2：温润骨白纸手账 📜</h3>
            </div>
            <span v-if="themeStore.currentThemeId === 'bonepaper'" class="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-amber-100 text-[#d97706] border border-slate-900">
              全站当前生效
            </span>
          </div>

          <p class="text-xs text-slate-600 leading-relaxed">
            <strong>Bone Paper & Charcoal Slate</strong><br>
            经典 Moleskine 骨白纸手账质感，暖光零蓝光，复古沉静、极具质感。
          </p>

          <div class="flex items-center justify-between pt-1 border-t border-slate-200 text-xs font-mono">
            <div class="flex gap-1">
              <span class="px-1.5 py-0.5 rounded bg-[#334155] text-white text-[10px] font-bold">#334155</span>
              <span class="px-1.5 py-0.5 rounded bg-[#f4f1ea] text-slate-700 text-[10px] font-bold border border-slate-300">#F4F1EA</span>
              <span class="px-1.5 py-0.5 rounded bg-[#d97706] text-white text-[10px] font-bold">#D97706</span>
            </div>
            <span class="text-[11px] font-bold text-amber-700">
              {{ previewThemeKey === 'bonepaper' ? '正在预览中 ✓' : '点击独立预览' }}
            </span>
          </div>
        </div>

        <!-- Theme 3: 沉静深海黛蓝 (Prussian Navy & Slate) -->
        <div
          @click="previewThemeKey = 'prussian'"
          class="p-5 rounded-2xl border-2 border-slate-900 text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 relative group"
          :class="previewThemeKey === 'prussian' 
            ? 'bg-white shadow-[5px_5px_0px_0px_#1e40af] -translate-y-1' 
            : 'bg-white/80 shadow-hard-sm opacity-80 hover:opacity-100'"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-4 h-4 rounded-full bg-[#1e40af] border border-slate-900"></span>
              <h3 class="font-black text-sm text-slate-900">选项 3：沉静深海黛蓝 🌊</h3>
            </div>
            <span v-if="themeStore.currentThemeId === 'prussian'" class="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-indigo-100 text-[#1e40af] border border-slate-900">
              全站当前生效
            </span>
          </div>

          <p class="text-xs text-slate-600 leading-relaxed">
            <strong>Prussian Navy & Slate Grid</strong><br>
            严谨工程图纸蓝，低饱和无眩光，理性清晰。
          </p>

          <div class="flex items-center justify-between pt-1 border-t border-slate-200 text-xs font-mono">
            <div class="flex gap-1">
              <span class="px-1.5 py-0.5 rounded bg-[#1e40af] text-white text-[10px] font-bold">#1E40AF</span>
              <span class="px-1.5 py-0.5 rounded bg-[#f8fafc] text-slate-700 text-[10px] font-bold border border-slate-300">#F8FAFC</span>
            </div>
            <span class="text-[11px] font-bold text-blue-700">
              {{ previewThemeKey === 'prussian' ? '正在预览中 ✓' : '点击独立预览' }}
            </span>
          </div>
        </div>

      </div>

      <!-- ========================================================================= -->
      <!-- FULL-SCALE DEDICATED WORKBENCH SIMULATOR FOR CURRENT PREVIEW THEME -->
      <!-- ========================================================================= -->
      <div class="space-y-4">
        <div class="flex items-center justify-between border-b-2 border-slate-900 pb-2">
          <div>
            <h2 class="text-lg font-black text-slate-900 flex items-center gap-2">
              <span>🖼️</span>
              <span>「{{ currentTheme.name }}」完整工作台实景模拟</span>
            </h2>
            <p class="text-xs text-slate-500 font-mono mt-0.5">
              {{ currentTheme.desc }}
            </p>
          </div>
          
          <div class="flex items-center gap-2 font-mono text-xs font-bold">
            <span class="text-slate-500 hidden sm:inline">当前预览模式：</span>
            <span class="px-3 py-1 rounded-lg border-2 border-slate-900 bg-white shadow-hard-sm"
                  :style="{ color: currentTheme.primary }">
              {{ currentTheme.name }}
            </span>
          </div>
        </div>

        <!-- SIMULATOR CONTAINER (Authentic Theme Canvas) -->
        <div class="rounded-3xl p-6 sm:p-8 border-2 border-slate-900 transition-all duration-300 space-y-6"
             :style="{ 
               backgroundColor: currentTheme.bg,
               boxShadow: `6px 6px 0px 0px ${currentTheme.shadowColor}`,
               backgroundImage: currentTheme.bgStyle.backgroundImage,
               backgroundSize: currentTheme.bgStyle.backgroundSize
             }">

          <!-- Simulated App Bar -->
          <div class="bg-white/90 rounded-2xl p-4 border-2 border-slate-900 shadow-hard-sm flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg border-2 border-slate-900 text-white font-black text-sm flex items-center justify-center shadow-hard-sm"
                   :style="{ backgroundColor: currentTheme.primary }">
                如
              </div>
              <div>
                <span class="font-black text-sm text-slate-900">如期 · OnTime</span>
                <span class="ml-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-slate-900"
                      :style="{ backgroundColor: currentTheme.tagBg, color: currentTheme.tagText }">
                  {{ currentTheme.nameEn }}
                </span>
              </div>
            </div>

            <!-- Fake Navigation Tabs -->
            <div class="flex items-center gap-1.5 text-xs font-mono font-bold">
              <span class="px-3 py-1 rounded-lg text-white border border-slate-900 shadow-2xs"
                    :style="{ backgroundColor: currentTheme.primary }">
                工作台
              </span>
              <span class="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-300">
                定价方案
              </span>
            </div>
          </div>

          <!-- 3 Columns Workbench Simulation -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            <!-- Left: Smart Backward Scheduler Input Card (5 Cols) -->
            <div class="lg:col-span-5 bg-white/95 rounded-2xl p-5 border-2 border-slate-900 shadow-hard-sm space-y-4">
              <div class="flex items-center justify-between border-b-2 border-slate-900 pb-2">
                <span class="font-mono text-xs font-bold uppercase tracking-wider" :style="{ color: currentTheme.primary }">
                  ⚡ 智能倒排向导
                </span>
                <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-900">
                  SMART BACKWARD
                </span>
              </div>

              <div class="space-y-3 text-xs">
                <div>
                  <label class="block font-bold text-slate-900 mb-1">目标内容</label>
                  <input
                    type="text"
                    value="某三期滨江景观施工图"
                    readonly
                    class="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl font-bold text-slate-800 outline-none"
                  />
                </div>

                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="block font-bold text-slate-900 mb-1">最终完成时间</label>
                    <div class="px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl font-mono text-xs font-bold text-slate-800">
                      2026-08-30
                    </div>
                  </div>
                  <div class="flex items-end">
                    <button 
                      class="w-full py-2 text-white font-bold text-xs rounded-xl border-2 border-slate-900 shadow-hard-sm transition-all cursor-pointer font-mono active:translate-x-[1px] active:translate-y-[1px]"
                      :style="{ backgroundColor: currentTheme.primary }"
                    >
                      + 添加目标
                    </button>
                  </div>
                </div>

                <!-- Streamlined Gentle Reminder Mock -->
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-300 text-[11px] flex items-center justify-between">
                  <span class="font-bold text-slate-800">📌 推进提示：某三期滨江景观施工图 (50%)</span>
                  <button class="px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white border border-slate-900"
                          :style="{ backgroundColor: currentTheme.primary }">
                    ⚡ 5分启动
                  </button>
                </div>
              </div>
            </div>

            <!-- Center/Right: Today's Tasks & Project Meter (7 Cols) -->
            <div class="lg:col-span-7 space-y-4">
              
              <!-- Today Checklist in Selected Theme -->
              <div class="bg-white/95 rounded-2xl p-5 border-2 border-slate-900 shadow-hard-sm space-y-3">
                <div class="flex items-center justify-between border-b-2 border-slate-900 pb-2">
                  <h4 class="font-black text-xs text-slate-900 flex items-center gap-1.5">
                    <span>📋</span>
                    <span>今日待办清单 (Today's Tasks)</span>
                  </h4>
                  <span class="text-xs font-mono font-black" :style="{ color: currentTheme.primary }">
                    2 项未完成
                  </span>
                </div>

                <div class="space-y-2 text-xs">
                  <!-- Task 1: Pending with ADHD 5-Min button -->
                  <div class="p-3 bg-slate-50 border-2 border-slate-900 rounded-xl flex items-center justify-between shadow-2xs hover:bg-slate-100 transition-colors">
                    <div class="flex items-center gap-2.5 truncate">
                      <div class="w-5 h-5 rounded-md border-2 border-slate-900 bg-white flex items-center justify-center font-bold text-xs shrink-0 cursor-pointer">
                        
                      </div>
                      <span class="font-bold text-slate-900 truncate">开始: 施工图绘制与细节复核</span>
                      <span class="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-slate-900">
                        ⚡ 5min
                      </span>
                    </div>
                    <span class="font-mono text-[11px] text-slate-500 font-semibold shrink-0">8月24日</span>
                  </div>

                  <!-- Task 2: Completed -->
                  <div class="p-3 rounded-xl border-2 flex items-center justify-between"
                       :style="{ backgroundColor: currentTheme.tagBg, borderColor: currentTheme.primary }">
                    <div class="flex items-center gap-2.5 truncate">
                      <div class="w-5 h-5 rounded-md border-2 text-white flex items-center justify-center font-bold text-xs shrink-0"
                           :style="{ backgroundColor: currentTheme.success || '#10b981', borderColor: currentTheme.primary }">
                        ✓
                      </div>
                      <span class="font-bold text-slate-600 line-through truncate">开始: 预算与主材清单确认</span>
                    </div>
                    <span class="font-mono text-[10px] font-bold" :style="{ color: currentTheme.primary }">已如期达成</span>
                  </div>
                </div>
              </div>

              <!-- Project Progress Meter in Selected Theme -->
              <div class="bg-white/95 rounded-2xl p-5 border-2 border-slate-900 shadow-hard-sm space-y-3">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-xs text-slate-900">项目推进进度：某三期滨江景观施工图</span>
                  <span class="font-mono font-black text-sm" :style="{ color: currentTheme.primary }">50%</span>
                </div>
                
                <!-- Chunky Progress Bar -->
                <div class="w-full h-3 bg-slate-100 border-2 border-slate-900 rounded-lg overflow-hidden p-0.5">
                  <div class="h-full rounded-xs transition-all duration-500"
                       :style="{ width: '50%', backgroundColor: currentTheme.primary }"></div>
                </div>

                <div class="flex items-center justify-between text-xs text-slate-600 pt-1">
                  <span>下一步行动: <strong>施工图绘制</strong></span>
                  <button class="font-mono font-bold text-xs hover:underline cursor-pointer"
                          :style="{ color: currentTheme.primary }">
                    📝 记录进度 ∨
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      <!-- ========================================================================= -->
      <!-- COLOR TOKENS SWATCHES SPECIFICATION -->
      <!-- ========================================================================= -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-black text-slate-900 flex items-center gap-1.5 font-mono">
            <span>🎨</span>
            <span>「{{ currentTheme.name }}」核心色彩代码与视觉光学解析</span>
          </h3>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <!-- Swatch 1 -->
          <div class="bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-hard-sm space-y-2">
            <div class="h-14 rounded-xl border border-slate-900 shadow-inner flex items-end p-2 font-mono text-xs font-bold text-white"
                 :style="{ backgroundColor: currentTheme.primary }">
              {{ currentTheme.primary }}
            </div>
            <div class="text-xs">
              <span class="font-black text-slate-900 block">主功能与按键色</span>
              <span class="text-slate-500 text-[11px]">核心操作按钮与重要文字高光</span>
            </div>
          </div>

          <!-- Swatch 2 -->
          <div class="bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-hard-sm space-y-2">
            <div class="h-14 rounded-xl border border-slate-900 shadow-inner flex items-end p-2 font-mono text-xs font-bold text-slate-900"
                 :style="{ backgroundColor: currentTheme.bg }">
              {{ currentTheme.bg }}
            </div>
            <div class="text-xs">
              <span class="font-black text-slate-900 block">防眩光背景底色</span>
              <span class="text-slate-500 text-[11px]">柔光哑光纸底，消除冷白刺眼</span>
            </div>
          </div>

          <!-- Swatch 3 -->
          <div class="bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-hard-sm space-y-2">
            <div class="h-14 rounded-xl border border-slate-900 shadow-inner flex items-end p-2 font-mono text-xs font-bold text-white"
                 :style="{ backgroundColor: currentTheme.shadowColor }">
              {{ currentTheme.shadowColor }}
            </div>
            <div class="text-xs">
              <span class="font-black text-slate-900 block">微拟物硬阴影</span>
              <span class="text-slate-500 text-[11px]">积木触感 3px 投影与层次</span>
            </div>
          </div>

          <!-- Swatch 4 -->
          <div class="bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-hard-sm space-y-2">
            <div class="h-14 rounded-xl border border-slate-900 shadow-inner flex items-end p-2 font-mono text-xs font-bold text-white"
                 :style="{ backgroundColor: currentTheme.accent }">
              {{ currentTheme.accent }}
            </div>
            <div class="text-xs">
              <span class="font-black text-slate-900 block">高光与重点点缀</span>
              <span class="text-slate-500 text-[11px]">长期战略项目与徽章金光</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useThemeStore, THEME_CONFIGS } from '../stores/themeStore'
import confetti from 'canvas-confetti'

const themeStore = useThemeStore()

// Default preview set to 'bonepaper' if user wants to see it, or currentThemeId
const previewThemeKey = ref(themeStore.currentThemeId || 'spruce')

const currentTheme = computed(() => {
  return THEME_CONFIGS[previewThemeKey.value] || THEME_CONFIGS.spruce
})

const applyToWholeApp = (themeId) => {
  themeStore.setTheme(themeId)
  confetti({
    particleCount: 60,
    spread: 60,
    origin: { y: 0.3 }
  })
}
</script>
