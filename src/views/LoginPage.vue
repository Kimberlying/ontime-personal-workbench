<template>
  <div class="min-h-screen bg-[#f5f8f6] text-slate-900 flex flex-col justify-between"
       style="background-image: radial-gradient(rgba(13, 148, 136, 0.045) 1px, transparent 1px), linear-gradient(to right, rgba(13, 148, 136, 0.015) 1px, transparent 1px), linear-gradient(to bottom, rgba(13, 148, 136, 0.015) 1px, transparent 1px); background-size: 28px 28px;">
    <AppHeader />

    <div class="flex-1 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-[6px_6px_0px_0px_#0d9488] border-2 border-slate-900 animate-pop-in space-y-6">
        
        <!-- Header -->
        <div class="text-center space-y-2">
          <div class="w-12 h-12 bg-[#0d9488] border-2 border-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto text-xl font-bold shadow-hard-sm">
            ✨
          </div>
          <h2 class="text-2xl font-black text-slate-900 tracking-tight">
            {{ isRegister ? $t('auth.registerTitle') : $t('auth.loginTitle') }}
          </h2>
          <p class="text-xs font-mono text-slate-500 font-bold">
            {{ isRegister ? '创建您的个人工作台账号' : '登录进入您的个人生产力空间' }}
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4 text-xs font-mono">
          <div>
            <label class="block font-black text-slate-900 mb-1 font-sans">
              {{ $t('auth.emailLabel') }}
            </label>
            <input
              v-model="email"
              type="email"
              placeholder="user@example.com"
              class="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0d9488]/20 outline-none transition-all text-slate-900 font-bold"
              required
            />
          </div>

          <div>
            <label class="block font-black text-slate-900 mb-1 font-sans">
              {{ $t('auth.passwordLabel') }}
            </label>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0d9488]/20 outline-none transition-all text-slate-900 font-bold"
              required
            />
          </div>

          <div v-if="errorMsg" class="p-3 bg-rose-100 text-rose-900 rounded-xl border-2 border-rose-900 text-xs font-bold font-mono">
            {{ errorMsg }}
          </div>

          <button
            type="submit"
            :disabled="auth.loading"
            class="w-full py-3 bg-[#0d9488] hover:bg-[#0f766e] active:translate-x-[2px] active:translate-y-[2px] text-white font-black rounded-xl border-2 border-slate-900 shadow-hard hover:shadow-hard-teal transition-all disabled:opacity-50 cursor-pointer text-sm font-sans"
          >
            <span v-if="auth.loading">{{ $t('auth.processing') }}</span>
            <span v-else>{{ isRegister ? $t('auth.registerBtn') : $t('auth.loginBtn') }}</span>
          </button>
        </form>

        <div class="pt-1 text-center">
          <button
            @click="isRegister = !isRegister"
            class="text-xs text-[#0d9488] hover:text-[#0f766e] font-bold font-mono hover:underline cursor-pointer"
          >
            {{ isRegister ? $t('auth.switchToLogin') : $t('auth.switchToRegister') }}
          </button>
        </div>

        <!-- Direct Workbench Quick Entry (Self-hosted / Local) -->
        <div class="pt-4 border-t-2 border-slate-900 space-y-2">
          <button
            @click="handleDirectWorkbench"
            class="w-full py-3 px-4 bg-amber-400 hover:bg-amber-500 active:translate-x-[1px] active:translate-y-[1px] text-slate-900 font-black rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border-2 border-slate-900 shadow-hard-sm"
          >
            <span class="text-base">🚀</span>
            <span>直接进入工作台 (本地免密体验)</span>
          </button>
          <p class="text-[11px] text-slate-500 text-center font-mono">
            自用部署开箱即用，所有数据完整保存在本地或已连接的云端
          </p>
        </div>
      </div>
    </div>

    <footer class="p-6 text-center text-xs font-mono text-slate-500 font-bold">
      &copy; 2026 {{ $t('app.title') }}. {{ $t('app.allRightsReserved') }}.
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/authStore'
import AppHeader from '../components/AppHeader.vue'

const router = useRouter()
const auth = useAuthStore()
const { t } = useI18n()

const isRegister = ref(false)
const email = ref('')
const password = ref('')
const errorMsg = ref('')

const handleSubmit = async () => {
  errorMsg.value = ''
  let res
  if (isRegister.value) {
    res = await auth.signUp(email.value, password.value)
  } else {
    res = await auth.signIn(email.value, password.value)
  }

  if (res.success) {
    router.push('/')
  } else {
    errorMsg.value = res.error || t('auth.errorDefault')
  }
}

const handleDirectWorkbench = async () => {
  await auth.signInWithMock('me@workspace.local')
  router.push('/')
}
</script>
