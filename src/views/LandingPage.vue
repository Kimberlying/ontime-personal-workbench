<template>
  <div class="min-h-screen bg-[#f5f8f6] text-slate-900 flex flex-col selection:bg-[#0d9488] selection:text-white"
       style="background-image: radial-gradient(rgba(13, 148, 136, 0.045) 1px, transparent 1px), linear-gradient(to right, rgba(13, 148, 136, 0.015) 1px, transparent 1px), linear-gradient(to bottom, rgba(13, 148, 136, 0.015) 1px, transparent 1px); background-size: 28px 28px;">
    <AppHeader />

    <!-- Hero Section -->
    <section class="max-w-6xl mx-auto px-4 pt-16 pb-20 text-center space-y-8">
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#0d9488] text-white text-xs font-mono font-bold uppercase tracking-wider border-2 border-slate-900 shadow-hard-sm">
        <span class="flex h-2 w-2 rounded-full bg-amber-400 animate-ping"></span>
        <span>{{ $t('landing.badge') }}</span>
      </div>

      <h1 class="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
        {{ $t('landing.heroTitle1') }}<br />
        {{ $t('landing.heroTitle2') }}<span class="text-[#0d9488] underline decoration-4 decoration-amber-400 underline-offset-8">{{ $t('landing.heroHighlight') }}</span>
      </h1>

      <p class="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
        {{ $t('landing.heroSubtitle') }}
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 font-mono font-bold">
        <router-link
          to="/app"
          class="w-full sm:w-auto px-8 py-4 bg-[#0d9488] hover:bg-[#0f766e] active:translate-x-[2px] active:translate-y-[2px] text-white font-black text-sm rounded-2xl border-2 border-slate-900 shadow-hard hover:shadow-hard-teal transition-all flex items-center justify-center gap-2"
        >
          <span>{{ $t('landing.ctaWorkbench') }}</span>
          <span>&rarr;</span>
        </router-link>
        <router-link
          to="/login"
          class="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-100 active:translate-x-[1px] active:translate-y-[1px] border-2 border-slate-900 text-slate-900 font-black text-sm rounded-2xl shadow-hard-sm hover:shadow-hard transition-all"
        >
          {{ $t('nav.login') }} / 快速体验
        </router-link>
      </div>

      <!-- Interactive UI Preview Showcase -->
      <div class="pt-10 max-w-5xl mx-auto">
        <div class="bg-white rounded-3xl p-2 shadow-[6px_6px_0px_0px_#0d9488] border-2 border-slate-900 overflow-hidden group">
          <div class="bg-slate-100 px-4 py-2.5 border-b-2 border-slate-900 flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-rose-500 border border-slate-900"></div>
            <div class="w-3 h-3 rounded-full bg-amber-400 border border-slate-900"></div>
            <div class="w-3 h-3 rounded-full bg-emerald-500 border border-slate-900"></div>
            <span class="text-xs text-slate-600 font-mono font-bold ml-2">ontime-workbench.app · sage-v2.0</span>
          </div>

          <!-- Preview Content Snippet -->
          <div class="p-6 md:p-8 bg-slate-50 grid grid-cols-1 md:grid-cols-12 gap-6 text-left font-sans">
            <div class="md:col-span-8 space-y-4">
              <div class="bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-hard-sm flex items-center justify-between">
                <div>
                  <div class="text-[10px] text-slate-500 font-mono font-bold uppercase">{{ $t('landing.sampleGoalLabel') }}</div>
                  <div class="font-black text-sm text-slate-900">{{ $t('landing.sampleGoalVal') }}</div>
                </div>
                <div class="text-right font-mono">
                  <div class="text-[10px] text-slate-500 font-bold uppercase">{{ $t('landing.sampleDeadlineLabel') }}</div>
                  <div class="font-black text-xs text-[#0d9488]">{{ $t('landing.sampleDeadlineVal') }}</div>
                </div>
              </div>

              <!-- Checklist item mock -->
              <div class="p-3.5 bg-white rounded-xl border-2 border-slate-900 shadow-hard-sm flex items-center justify-between text-xs">
                <div class="flex items-center gap-3">
                  <div class="w-5 h-5 rounded-md border-2 border-[#0d9488] bg-[#0d9488] text-white flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <span class="font-bold text-slate-700 line-through">开始: 预算与主材清单确认</span>
                </div>
                <span class="font-mono text-[10px] font-bold text-[#0d9488] bg-teal-50 px-2 py-0.5 rounded border border-teal-300">DONE</span>
              </div>
            </div>

            <!-- Right progress mock -->
            <div class="md:col-span-4 bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-hard-sm space-y-3">
              <div class="flex justify-between font-bold text-xs">
                <span class="text-slate-900">某三期滨江景观施工图</span>
                <span class="text-[#0d9488] font-mono font-black">50%</span>
              </div>
              <div class="w-full bg-slate-100 h-2 rounded border border-slate-900 overflow-hidden">
                <div class="bg-[#0d9488] h-full" style="width: 50%;"></div>
              </div>
              <div class="text-[11px] text-slate-600">
                <span class="text-slate-400 font-mono">下一步:</span> <span class="font-bold">施工图绘制</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section 3 Columns -->
    <section class="max-w-6xl mx-auto px-4 py-16 border-t-2 border-slate-900 space-y-12">
      <div class="text-center max-w-xl mx-auto space-y-2">
        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {{ $t('landing.featureSectionTitle') }}
        </h2>
        <p class="text-xs sm:text-sm text-slate-600 font-medium">
          {{ $t('landing.featureSectionSub') }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Feature 1 -->
        <div class="bg-white rounded-2xl p-6 border-2 border-slate-900 shadow-hard hover:shadow-hard-teal hover:-translate-y-1 transition-all space-y-3">
          <div class="w-12 h-12 bg-[#0d9488] text-white border-2 border-slate-900 rounded-xl flex items-center justify-center text-xl shadow-hard-sm font-bold">
            📐
          </div>
          <h3 class="font-black text-base text-slate-900">{{ $t('landing.feat1Title') }}</h3>
          <p class="text-xs text-slate-600 leading-relaxed font-medium">{{ $t('landing.feat1Desc') }}</p>
        </div>

        <!-- Feature 2 -->
        <div class="bg-white rounded-2xl p-6 border-2 border-slate-900 shadow-hard hover:shadow-hard-teal hover:-translate-y-1 transition-all space-y-3">
          <div class="w-12 h-12 bg-amber-400 text-slate-900 border-2 border-slate-900 rounded-xl flex items-center justify-center text-xl shadow-hard-sm font-bold">
            ⏰
          </div>
          <h3 class="font-black text-base text-slate-900">{{ $t('landing.feat2Title') }}</h3>
          <p class="text-xs text-slate-600 leading-relaxed font-medium">{{ $t('landing.feat2Desc') }}</p>
        </div>

        <!-- Feature 3 -->
        <div class="bg-white rounded-2xl p-6 border-2 border-slate-900 shadow-hard hover:shadow-hard-teal hover:-translate-y-1 transition-all space-y-3">
          <div class="w-12 h-12 bg-[#059669] text-white border-2 border-slate-900 rounded-xl flex items-center justify-center text-xl shadow-hard-sm font-bold">
            🏆
          </div>
          <h3 class="font-black text-base text-slate-900">{{ $t('landing.feat3Title') }}</h3>
          <p class="text-xs text-slate-600 leading-relaxed font-medium">{{ $t('landing.feat3Desc') }}</p>
        </div>
      </div>
    </section>

    <!-- Bottom CTA Banner -->
    <section class="max-w-5xl mx-auto px-4 pb-20">
      <div class="bg-slate-900 rounded-3xl p-8 md:p-12 text-center text-white border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0d9488] space-y-6">
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
          {{ $t('landing.ctaBannerTitle') }}
        </h2>
        <p class="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto font-normal leading-relaxed">
          {{ $t('landing.ctaBannerSub') }}
        </p>
        <div class="pt-2">
          <router-link
            to="/app"
            class="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0d9488] hover:bg-[#0f766e] active:translate-x-[2px] active:translate-y-[2px] text-white font-mono font-black text-sm rounded-2xl border-2 border-white shadow-hard transition-all cursor-pointer"
          >
            <span>{{ $t('landing.ctaStartNow') }}</span>
            <span>&rarr;</span>
          </router-link>
        </div>
      </div>
    </section>

    <footer class="p-6 text-center text-xs font-mono text-slate-500 font-bold border-t-2 border-slate-900 bg-white">
      &copy; 2026 {{ $t('app.title') }}. {{ $t('app.allRightsReserved') }}.
    </footer>
  </div>
</template>

<script setup>
import AppHeader from '../components/AppHeader.vue'
</script>
