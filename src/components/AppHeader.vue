<template>
  <header class="h-16 border-b-2 border-slate-900 bg-white/95 backdrop-blur sticky top-0 z-40 px-3 sm:px-6 md:px-8 flex items-center justify-between shadow-xs">
    <!-- Brand / Logo -->
    <div class="flex items-center gap-4 sm:gap-6">
      <router-link to="/" class="flex items-center gap-2.5 group">
        <!-- Blueprint Style Icon in Sage & Nordic Spruce Green -->
        <div class="w-8 h-8 rounded-lg bg-[#0d9488] border-2 border-slate-900 flex items-center justify-center text-white shadow-hard-sm group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] group-hover:shadow-hard transition-all shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="1" stroke-width="2.5"></rect>
            <path d="M16 2v4M8 2v4M3 10h18" stroke-width="2.5"></path>
            <path d="m9 16 2 2 4-4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="font-black text-base sm:text-lg text-slate-900 tracking-tight">{{ $t('app.title') }}</span>
          <span class="hidden sm:inline-block font-mono text-[10px] px-2 py-0.5 rounded bg-teal-50 text-[#0d9488] font-black border border-slate-900 shadow-[1px_1px_0px_0px_#0f172a]">v2.0</span>
        </div>
      </router-link>

      <!-- Navigation links -->
      <nav class="hidden md:flex items-center gap-2 text-xs font-bold text-slate-700">
        <button
          @click="$emit('open-import')"
          class="px-3.5 py-1.5 rounded-xl text-xs font-bold border-2 border-slate-900 bg-teal-50 text-slate-900 hover:bg-teal-100 transition-all flex items-center gap-2 cursor-pointer font-mono shadow-hard-sm active:translate-x-[1px] active:translate-y-[1px]"
          :title="$t('nav.dataAndMcpTip')"
        >
          <span>📦</span>
          <span>{{ $t('nav.dataAndMcp') }}</span>
          <span class="px-1.5 py-0.5 text-[9px] rounded-md bg-[#0d9488] text-white font-bold uppercase tracking-wider">MCP</span>
        </button>
      </nav>
    </div>

    <!-- Actions & User Profile & Language Switcher -->
    <div class="flex items-center gap-2 sm:gap-3">
      <!-- Mobile Data & MCP Hub Shortcut -->
      <button
        @click="$emit('open-import')"
        class="md:hidden px-2.5 py-1 rounded-lg text-xs font-bold border-2 border-slate-900 bg-teal-50 text-slate-900 font-mono shadow-hard-sm flex items-center gap-1"
        :title="$t('nav.dataAndMcpTip')"
      >
        <span>📦</span>
        <span>MCP</span>
      </button>

      <!-- Language Selector -->
      <button 
        @click="toggleLanguage" 
        class="px-2.5 py-1 text-xs font-bold font-mono text-slate-800 bg-white hover:bg-slate-100 rounded-lg border-2 border-slate-900 shadow-hard-sm flex items-center gap-1.5 transition-all active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
        :title="currentLocale === 'zh' ? 'Switch to English' : '切换为中文'"
      >
        <span>🌐</span>
        <span>{{ currentLocale === 'zh' ? 'EN' : '中' }}</span>
      </button>

      <!-- Auth Dropdown / Direct Workbench Link -->
      <div v-if="auth.isAuthenticated" class="relative group">
        <button class="flex items-center gap-2 p-1 rounded-xl border-2 border-slate-900 bg-white shadow-hard-sm hover:bg-slate-50 transition-all cursor-pointer">
          <div class="w-6 h-6 rounded-lg bg-[#0d9488] text-white font-mono font-bold text-xs flex items-center justify-center border border-slate-900">
            {{ userInitial }}
          </div>
          <span class="text-xs text-slate-800 font-bold hidden md:inline-block max-w-[140px] truncate px-1">
            {{ auth.user?.email || '个人工作台' }}
          </span>
        </button>

        <!-- Dropdown Menu -->
        <div class="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-hard-lg border-2 border-slate-900 py-1.5 hidden group-hover:block transition-all animate-pop-in z-50">
          <div class="px-4 py-2 border-b-2 border-slate-900">
            <p class="text-[10px] font-mono text-slate-400 uppercase tracking-wider">当前使用者</p>
            <p class="text-xs font-bold text-slate-900 truncate mt-0.5">
              {{ auth.user?.email || 'Local Owner' }}
            </p>
          </div>

          <button
            @click="$emit('open-import')"
            class="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
          >
            <span>📦</span>
            <span>{{ $t('nav.dataAndMcp') }}</span>
          </button>

          <button @click="handleSignOut" class="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-bold border-t border-slate-100 cursor-pointer">
            {{ $t('nav.logout') }}
          </button>
        </div>
      </div>

      <router-link
        v-else
        to="/login"
        class="text-xs font-bold text-slate-900 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border-2 border-slate-900 shadow-hard-sm transition-all"
      >
        {{ $t('nav.login') }}
      </router-link>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

defineEmits(['open-hermes', 'open-import'])

const { locale } = useI18n()
const router = useRouter()
const auth = useAuthStore()

const currentLocale = computed(() => locale.value)

const userInitial = computed(() => {
  if (!auth.user?.email) return 'U'
  return auth.user.email.charAt(0).toUpperCase()
})

const toggleLanguage = () => {
  locale.value = locale.value === 'zh' ? 'en' : 'zh'
  localStorage.setItem('orderly_locale', locale.value)
}

const handleSignOut = async () => {
  await auth.signOut()
  router.push('/login')
}
</script>
