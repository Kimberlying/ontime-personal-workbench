<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
    <div class="bg-white rounded-3xl shadow-[6px_6px_0px_0px_#0d9488] max-w-xl w-full overflow-hidden border-2 border-slate-900 animate-pop-in flex flex-col max-h-[92vh]">
      
      <!-- Header -->
      <div class="px-6 py-4 border-b-2 border-slate-900 flex items-center justify-between bg-slate-50">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-amber-400 border-2 border-slate-900 text-slate-900 flex items-center justify-center text-xl font-bold shadow-hard-sm">
            🎁
          </div>
          <div>
            <h3 class="text-base font-black text-slate-900">
              {{ isEn ? 'Beta Invite & Pro Gift Center' : '好友内测邀请 & 7天 Pro 赠送中枢' }}
            </h3>
            <p class="text-xs text-slate-500 font-mono mt-0.5">
              {{ isEn ? 'Gift 7-Day Pro Access & Share Gemini AI Quota with Friends' : '送好友 7 天 Pro 体验卡，共享 Google Gemini 每日 12 次 AI 算力' }}
            </p>
          </div>
        </div>

        <button @click="close" class="text-slate-400 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Navigation Tabs -->
      <div class="px-6 pt-3 border-b-2 border-slate-900 bg-slate-100 flex items-center gap-2 text-xs font-mono font-bold">
        <button
          @click="activeTab = 'invite'"
          class="px-3.5 py-2 rounded-t-xl border-t-2 border-x-2 transition-all cursor-pointer flex items-center gap-1.5"
          :class="activeTab === 'invite' 
            ? 'bg-white border-slate-900 text-slate-900 font-black -mb-[2px] pb-2.5 shadow-xs' 
            : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'"
        >
          <span>🎟️</span>
          <span>{{ isEn ? 'Gift Pro Trial' : '赠送 7天 Pro 邀请卡' }}</span>
        </button>

        <button
          @click="activeTab = 'gemini'"
          class="px-3.5 py-2 rounded-t-xl border-t-2 border-x-2 transition-all cursor-pointer flex items-center gap-1.5"
          :class="activeTab === 'gemini' 
            ? 'bg-white border-slate-900 text-slate-900 font-black -mb-[2px] pb-2.5 shadow-xs' 
            : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'"
        >
          <span>⚡</span>
          <span>{{ isEn ? 'Host Gemini API Pool' : '主机 Google Gemini 算力池' }}</span>
        </button>

        <button
          @click="activeTab = 'redeem'"
          class="px-3.5 py-2 rounded-t-xl border-t-2 border-x-2 transition-all cursor-pointer flex items-center gap-1.5"
          :class="activeTab === 'redeem' 
            ? 'bg-white border-slate-900 text-slate-900 font-black -mb-[2px] pb-2.5 shadow-xs' 
            : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'"
        >
          <span>💎</span>
          <span>{{ isEn ? 'Redeem VIP Code' : '兑换内测礼品码' }}</span>
        </button>
      </div>

      <!-- Tab Content Area -->
      <div class="p-6 overflow-y-auto space-y-4 flex-1 text-sm font-sans">
        
        <!-- ============================================================== -->
        <!-- TAB 1: GIFT PRO INVITE CARD                                    -->
        <!-- ============================================================== -->
        <div v-if="activeTab === 'invite'" class="space-y-4">
          <!-- VIP Pass Card Preview -->
          <div class="bg-gradient-to-br from-amber-200 via-amber-100 to-yellow-300 rounded-3xl p-5 border-2 border-slate-900 shadow-hard space-y-3 relative overflow-hidden">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-2xl">👑</span>
                <div>
                  <h4 class="font-black text-slate-900 text-sm">
                    「如期」7 天 Pro 尊享内测体验卡
                  </h4>
                  <p class="text-[10px] font-mono text-amber-950 font-bold">
                    ONTIME VIP PRO 7-DAY INVITATION PASS
                  </p>
                </div>
              </div>
              <span class="px-2 py-0.5 rounded-full bg-slate-900 text-white font-mono font-bold text-[10px]">
                VIP GIFT
              </span>
            </div>

            <!-- Features List on Card -->
            <div class="grid grid-cols-2 gap-2 text-xs font-sans text-slate-900 pt-2 border-t border-amber-400">
              <div class="flex items-center gap-1.5 font-bold">
                <span class="text-emerald-700">✓</span>
                <span>每日 12 次 Gemini 智能倒排</span>
              </div>
              <div class="flex items-center gap-1.5 font-bold">
                <span class="text-emerald-700">✓</span>
                <span>2 GB 专属极速云空间</span>
              </div>
              <div class="flex items-center gap-1.5 font-bold">
                <span class="text-emerald-700">✓</span>
                <span>全阶段关键子任务实时联动</span>
              </div>
              <div class="flex items-center gap-1.5 font-bold">
                <span class="text-emerald-700">✓</span>
                <span>小狗全屏跑动撒欢与荣耀勋章</span>
              </div>
            </div>

            <!-- Invite Code & Copy Button -->
            <div class="pt-2 flex items-center justify-between bg-white/80 backdrop-blur p-2.5 rounded-2xl border border-slate-900">
              <div>
                <div class="text-[10px] font-mono text-slate-500 font-bold">专属兑换码 (Invite Code):</div>
                <div class="text-base font-black font-mono text-[#0d9488] tracking-wider">{{ inviteCode }}</div>
              </div>
              <button
                @click="copyInviteShareText"
                class="px-4 py-2 bg-[#0d9488] hover:bg-[#0f766e] active:translate-x-[1px] active:translate-y-[1px] text-white font-black rounded-xl border-2 border-slate-900 shadow-hard-sm cursor-pointer text-xs font-mono flex items-center gap-1"
              >
                <span>{{ hasCopied ? '✓ 已复制口令' : '📋 复制微信/好友邀请语' }}</span>
              </button>
            </div>
          </div>

          <!-- Direct Invite URL -->
          <div class="space-y-1.5 text-xs font-mono">
            <div class="text-slate-500 font-bold flex items-center justify-between">
              <span>🔗 好友直达注册免密链接 (Direct Link):</span>
              <span @click="copyDirectLink" class="text-[#0d9488] hover:underline cursor-pointer font-bold">
                {{ hasCopiedLink ? '✓ 已复制链接' : '复制链接' }}
              </span>
            </div>
            <div class="p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-[11px] text-slate-700 break-all select-all font-mono">
              {{ directInviteUrl }}
            </div>
            <p class="text-[10px] text-slate-400 font-sans">
              * 好友点击链接打开后，系统会自动填充内测兑换码并直接激活 7 天 Pro 权限与每日 12 次额度。
            </p>
          </div>
        </div>

        <!-- ============================================================== -->
        <!-- TAB 2: HOST GEMINI API POOL                                    -->
        <!-- ============================================================== -->
        <div v-if="activeTab === 'gemini'" class="space-y-4">
          <div class="bg-teal-50/80 p-3.5 rounded-2xl border-2 border-slate-900 shadow-hard-sm text-xs font-sans space-y-1.5">
            <div class="font-black text-slate-900 flex items-center gap-1.5">
              <span>⚡</span>
              <span>{{ isEn ? 'Google Gemini Master API Pool for Friends:' : '主机端 Google Gemini 算力共享设置：' }}</span>
            </div>
            <p class="text-slate-600 leading-relaxed">
              您在此处填入您的 Google Gemini API Key 后，所有受邀好友在「如期」中进行 AI 倒排拆解与 Hermes 对话时，均可自动共享该算力池（每位好友每日限制 12 次，既省心又防止超额）。
            </p>
          </div>

          <!-- Key Input Form -->
          <div class="space-y-3 font-mono text-xs">
            <div>
              <label class="block font-black text-slate-900 mb-1 font-sans">
                Google Gemini API Key (以 AIza 开头):
              </label>
              <div class="flex gap-2">
                <input
                  v-model="inputApiKey"
                  type="password"
                  placeholder="AIzaSy..."
                  class="flex-1 px-3.5 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-[#0d9488]"
                />
                <button
                  @click="handleSaveAndTestKey"
                  :disabled="geminiStore.isTestingKey"
                  class="px-4 py-2 bg-[#0d9488] hover:bg-[#0f766e] disabled:opacity-50 text-white font-bold rounded-xl border-2 border-slate-900 shadow-hard-sm active:translate-x-[1px] active:translate-y-[1px] cursor-pointer text-xs font-mono shrink-0"
                >
                  {{ geminiStore.isTestingKey ? '测试中...' : '保存并验证' }}
                </button>
              </div>
            </div>

            <!-- Model Selection & Rate Limit Setting -->
            <div class="grid grid-cols-2 gap-3 text-xs">
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-300 space-y-1">
                <div class="text-[10px] text-slate-500 font-bold">默认推荐模型:</div>
                <div class="font-bold text-slate-900 font-mono text-[11px] flex items-center gap-1">
                  <span>🚀</span>
                  <span>gemini-2.0-flash</span>
                </div>
                <div class="text-[9px] text-emerald-700 font-sans">每日 1500 次完全免费额度</div>
              </div>

              <div class="p-3 bg-slate-50 rounded-xl border border-slate-300 space-y-1">
                <div class="text-[10px] text-slate-500 font-bold">内测好友每日限额:</div>
                <div class="font-bold text-[#0d9488] font-mono text-[11px]">
                  12 次 / 人 / 天
                </div>
                <div class="text-[9px] text-slate-400 font-sans">每天 00:00 自动重置刷新</div>
              </div>
            </div>

            <!-- Test Result Banner -->
            <div 
              v-if="geminiStore.testResult" 
              class="p-3 rounded-xl border-2 text-xs font-mono font-bold"
              :class="geminiStore.testResult.success ? 'bg-emerald-50 text-emerald-950 border-emerald-800' : 'bg-rose-50 text-rose-950 border-rose-800'"
            >
              {{ geminiStore.testResult.message }}
            </div>
          </div>
        </div>

        <!-- ============================================================== -->
        <!-- TAB 3: REDEEM VIP CODE                                         -->
        <!-- ============================================================== -->
        <div v-if="activeTab === 'redeem'" class="space-y-4">
          <div class="p-4 bg-slate-50 rounded-2xl border-2 border-slate-900 shadow-hard-sm space-y-3">
            <h4 class="font-black text-xs text-slate-900">
              💎 输入内测邀请码 / 礼品卡兑换码
            </h4>
            <div class="flex gap-2">
              <input
                v-model="inputRedeemCode"
                type="text"
                placeholder="例如：PRO7VIP"
                class="flex-1 px-3.5 py-2.5 bg-white border-2 border-slate-900 rounded-xl text-xs font-mono font-black text-slate-900 outline-none uppercase focus:ring-2 focus:ring-[#0d9488]"
              />
              <button
                @click="handleRedeem"
                class="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-black rounded-xl border-2 border-slate-900 shadow-hard-sm active:translate-x-[1px] active:translate-y-[1px] cursor-pointer text-xs font-mono shrink-0"
              >
                立即激活 7 天 Pro
              </button>
            </div>

            <div v-if="redeemMsg" class="p-3 rounded-xl border-2 text-xs font-mono font-bold"
                 :class="redeemSuccess ? 'bg-emerald-100 text-emerald-900 border-slate-900' : 'bg-rose-100 text-rose-900 border-slate-900'">
              {{ redeemMsg }}
            </div>
          </div>

          <!-- Current Account Status -->
          <div class="p-3.5 bg-white rounded-2xl border border-slate-300 text-xs font-mono space-y-1">
            <div class="flex justify-between items-center text-slate-500">
              <span>当前账号身份:</span>
              <span class="font-black px-2 py-0.5 rounded bg-slate-100 border border-slate-900 text-slate-900">
                {{ auth.planType.toUpperCase() }} {{ auth.isBetaTrial ? '(7天尊享内测)' : '' }}
              </span>
            </div>
            <div v-if="auth.isBetaTrial" class="flex justify-between items-center text-[#0d9488] font-bold">
              <span>试用剩余天数:</span>
              <span>{{ auth.trialDaysRemaining }} 天</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="p-4 border-t-2 border-slate-900 bg-slate-50 flex items-center justify-between">
        <span class="text-[11px] font-mono text-slate-500 font-bold">
          // 定下截止日，万事皆如期
        </span>
        <button
          @click="close"
          class="px-5 py-2 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 border-2 border-slate-900 rounded-xl shadow-hard-sm active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer font-mono"
        >
          {{ isEn ? 'Close' : '关闭' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/authStore'
import { useGeminiStore } from '../stores/geminiStore'
import confetti from 'canvas-confetti'

const props = defineProps({
  isOpen: Boolean,
})

const emit = defineEmits(['close'])

const { locale } = useI18n()
const auth = useAuthStore()
const geminiStore = useGeminiStore()

const isEn = computed(() => locale.value === 'en')
const activeTab = ref('invite')
const inviteCode = ref('PRO7VIP')
const inputApiKey = ref('')
const inputRedeemCode = ref('')
const redeemMsg = ref('')
const redeemSuccess = ref(false)
const hasCopied = ref(false)
const hasCopiedLink = ref(false)

onMounted(() => {
  geminiStore.initUsage()
  inputApiKey.value = geminiStore.apiKey
})

const directInviteUrl = computed(() => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/login?code=${inviteCode.value}`
  }
  return `http://localhost:5173/login?code=${inviteCode.value}`
})

const copyInviteShareText = () => {
  const shareText = `🎁 送你一张「如期 OnTime」7 天 Pro 尊享内测体验卡！\n\n输入专属兑换码 [${inviteCode.value}] 即可解锁 2GB 空间与每日 12 次 Google Gemini 2.0 Flash 智能工期倒排与小狗全屏跑动撒欢！\n\n👉 立即体验: ${directInviteUrl.value}`
  navigator.clipboard.writeText(shareText)
  hasCopied.value = true
  setTimeout(() => { hasCopied.value = false }, 2500)
}

const copyDirectLink = () => {
  navigator.clipboard.writeText(directInviteUrl.value)
  hasCopiedLink.value = true
  setTimeout(() => { hasCopiedLink.value = false }, 2500)
}

const handleSaveAndTestKey = async () => {
  geminiStore.saveApiKey(inputApiKey.value)
  const res = await geminiStore.testConnection(inputApiKey.value)
  if (res.success) {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    })
  }
}

const handleRedeem = () => {
  if (!inputRedeemCode.value.trim()) return
  const res = auth.redeemBetaCode(inputRedeemCode.value)
  redeemMsg.value = res.message
  redeemSuccess.value = res.success
  if (res.success) {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 }
    })
  }
}

const close = () => {
  emit('close')
}
</script>
