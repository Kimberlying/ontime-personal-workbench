<template>
  <div class="min-h-screen bg-[#f5f8f6] text-slate-900 flex flex-col"
       style="background-image: radial-gradient(rgba(13, 148, 136, 0.045) 1px, transparent 1px), linear-gradient(to right, rgba(13, 148, 136, 0.015) 1px, transparent 1px), linear-gradient(to bottom, rgba(13, 148, 136, 0.015) 1px, transparent 1px); background-size: 28px 28px;">
    <AppHeader />

    <main class="flex-1 max-w-6xl w-full mx-auto px-4 py-12 md:py-16 space-y-12">
      <!-- Title & Slogan -->
      <div class="text-center max-w-2xl mx-auto space-y-3">
        <div class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-lg bg-[#0d9488] border-2 border-slate-900 text-white text-xs font-mono font-bold uppercase shadow-hard-sm">
          <span>✨</span>
          <span>{{ $t('pricing.badge') }}</span>
        </div>
        <h1 class="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
          {{ $t('pricing.title') }}
        </h1>
        <p class="text-sm md:text-base text-slate-600 font-medium">
          {{ $t('pricing.subtitle') }}
        </p>

        <!-- Billing Interval Switcher -->
        <div class="flex items-center justify-center pt-4">
          <div class="bg-white p-1 rounded-xl border-2 border-slate-900 shadow-hard-sm flex items-center gap-1 text-xs font-bold font-mono">
            <button
              @click="billingInterval = 'monthly'"
              class="px-4 py-2 rounded-lg transition-all cursor-pointer"
              :class="billingInterval === 'monthly' ? 'bg-[#0d9488] text-white border border-slate-900 font-black' : 'text-slate-600 hover:text-slate-900 border border-transparent'"
            >
              {{ $t('pricing.monthly') }}
            </button>
            <button
              @click="billingInterval = 'yearly'"
              class="px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
              :class="billingInterval === 'yearly' ? 'bg-[#0d9488] text-white border border-slate-900 font-black' : 'text-slate-600 hover:text-slate-900 border border-transparent'"
            >
              <span>{{ $t('pricing.yearly') }}</span>
              <span class="px-1.5 py-0.5 rounded bg-amber-300 text-slate-900 text-[10px] font-black border border-slate-900">
                {{ $t('pricing.yearlyDiscount') }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Pricing Cards 3 Columns -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch font-sans">
        
        <!-- 1. Free Plan -->
        <div class="bg-white rounded-3xl p-8 border-2 border-slate-900 shadow-hard-sm flex flex-col justify-between hover:shadow-hard hover:-translate-y-1 transition-all relative">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-black text-slate-900">{{ $t('pricing.freePlan') }}</h3>
              <span class="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-900 text-slate-700 text-xs font-mono font-bold">{{ $t('pricing.freeBadge') }}</span>
            </div>
            <p class="text-xs text-slate-500 min-h-[32px]">{{ $t('pricing.freeDesc') }}</p>
            
            <div class="flex items-baseline gap-1 pt-2 font-mono">
              <span class="text-4xl font-black text-slate-900">{{ $t('pricing.freePrice') }}</span>
              <span class="text-xs text-slate-500 font-bold">{{ $t('pricing.freePeriod') }}</span>
            </div>

            <ul class="space-y-3 pt-6 border-t-2 border-slate-900 text-xs text-slate-700 font-medium">
              <li class="flex items-center gap-2">
                <span class="text-[#0d9488] font-bold">✓</span>
                <span>{{ $t('pricing.freeFeat1') }}</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="text-[#0d9488] font-bold">✓</span>
                <span>{{ $t('pricing.freeFeat2') }}</span>
              </li>
              <li class="flex items-center gap-2 text-slate-400">
                <span>✕</span>
                <span class="line-through">{{ $t('pricing.freeFeat3') }}</span>
              </li>
              <li class="flex items-center gap-2 text-slate-400">
                <span>✕</span>
                <span class="line-through">{{ $t('pricing.freeFeat4') }}</span>
              </li>
            </ul>
          </div>

          <div class="pt-8">
            <button
              @click="handleSelectPlan('free')"
              class="w-full py-3 bg-slate-100 hover:bg-slate-200 active:translate-x-[1px] active:translate-y-[1px] text-slate-900 font-bold rounded-xl border-2 border-slate-900 shadow-hard-sm transition-all cursor-pointer text-xs font-mono"
            >
              {{ auth.planType === 'free' ? $t('pricing.currentPlanBtn') : $t('pricing.chooseFree') }}
            </button>
          </div>
        </div>

        <!-- 2. Pro Plan (Highlighted Teal Card) -->
        <div class="bg-white rounded-3xl p-8 border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0d9488] flex flex-col justify-between relative md:-translate-y-2 hover:-translate-y-3 transition-all">
          <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#0d9488] text-white text-[10px] font-mono font-black rounded-lg border-2 border-slate-900 shadow-hard-sm uppercase tracking-wider">
            ⭐ {{ $t('pricing.proPopular') }}
          </div>

          <div class="space-y-4 pt-1">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-black text-slate-900">{{ $t('pricing.proPlan') }}</h3>
              <span class="px-2.5 py-1 rounded-md bg-teal-50 border border-slate-900 text-[#0d9488] text-xs font-mono font-black">{{ $t('pricing.proBadge') }}</span>
            </div>
            <p class="text-xs text-slate-500 min-h-[32px]">{{ $t('pricing.proDesc') }}</p>
            
            <div class="flex items-baseline gap-1 pt-2 font-mono">
              <span class="text-4xl font-black text-[#0d9488]">
                {{ billingInterval === 'monthly' ? '$9.9' : '$7.9' }}
              </span>
              <span class="text-xs text-slate-500 font-bold">/ {{ $t('pricing.month') }}</span>
            </div>

            <ul class="space-y-3 pt-6 border-t-2 border-slate-900 text-xs text-slate-800 font-bold">
              <li class="flex items-center gap-2">
                <span class="text-[#0d9488]">✓</span>
                <span>{{ $t('pricing.proFeat1') }}</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="text-[#0d9488]">✓</span>
                <span>{{ $t('pricing.proFeat2') }}</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="text-[#0d9488]">✓</span>
                <span>{{ $t('pricing.proFeat3') }}</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="text-[#0d9488]">✓</span>
                <span>{{ $t('pricing.proFeat4') }}</span>
              </li>
              <li class="flex items-center gap-2 text-slate-400 font-normal">
                <span>✕</span>
                <span class="line-through">{{ $t('pricing.proFeat5') }}</span>
              </li>
            </ul>
          </div>

          <div class="pt-8">
            <button
              @click="handleSelectPlan('pro')"
              class="w-full py-3.5 bg-[#0d9488] hover:bg-[#0f766e] active:translate-x-[2px] active:translate-y-[2px] text-white font-black rounded-xl border-2 border-slate-900 shadow-hard hover:shadow-hard-teal transition-all cursor-pointer text-xs font-mono"
            >
              {{ auth.planType === 'pro' ? $t('pricing.currentPlanBtn') : $t('pricing.upgradeProBtn') }}
            </button>
          </div>
        </div>

        <!-- 3. Ultimate Plan (Amber Highlight Card) -->
        <div class="bg-white rounded-3xl p-8 border-2 border-slate-900 shadow-hard-amber flex flex-col justify-between hover:shadow-hard hover:-translate-y-1 transition-all relative">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-black text-slate-900">{{ $t('pricing.ultimatePlan') }}</h3>
              <span class="px-2.5 py-1 rounded-md bg-amber-200 border border-slate-900 text-amber-950 text-xs font-mono font-black">{{ $t('pricing.ultimateBadge') }}</span>
            </div>
            <p class="text-xs text-slate-500 min-h-[32px]">{{ $t('pricing.ultimateDesc') }}</p>
            
            <div class="flex items-baseline gap-1 pt-2 font-mono">
              <span class="text-4xl font-black text-slate-900">
                {{ billingInterval === 'monthly' ? '$19.9' : '$15.9' }}
              </span>
              <span class="text-xs text-slate-500 font-bold">/ {{ $t('pricing.month') }}</span>
            </div>

            <ul class="space-y-3 pt-6 border-t-2 border-slate-900 text-xs text-slate-700 font-medium">
              <li class="flex items-center gap-2">
                <span class="text-amber-600 font-bold">✓</span>
                <span class="font-bold text-slate-900">{{ $t('pricing.ultFeat1') }}</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="text-amber-600 font-bold">✓</span>
                <span class="font-bold text-slate-900">{{ $t('pricing.ultFeat2') }}</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="text-amber-600 font-bold">✓</span>
                <span>{{ $t('pricing.ultFeat3') }}</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="text-amber-600 font-bold">✓</span>
                <span>{{ $t('pricing.ultFeat4') }}</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="text-amber-600 font-bold">✓</span>
                <span>{{ $t('pricing.ultFeat5') }}</span>
              </li>
            </ul>
          </div>

          <div class="pt-8">
            <button
              @click="handleSelectPlan('ultimate')"
              class="w-full py-3 bg-amber-400 hover:bg-amber-500 active:translate-x-[1px] active:translate-y-[1px] text-slate-900 font-black rounded-xl border-2 border-slate-900 shadow-hard-sm hover:shadow-hard transition-all cursor-pointer text-xs font-mono"
            >
              {{ auth.planType === 'ultimate' ? $t('pricing.currentPlanBtn') : $t('pricing.upgradeUltBtn') }}
            </button>
          </div>
        </div>

      </div>

      <!-- Feature Comparison Matrix Table -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-900 shadow-hard-sm space-y-6">
        <h2 class="text-xl font-black text-slate-900 text-center tracking-tight">
          {{ $t('pricing.matrixTitle') }}
        </h2>

        <div class="overflow-x-auto">
          <table class="w-full text-xs text-left">
            <thead>
              <tr class="border-b-2 border-slate-900 font-mono font-bold">
                <th class="pb-3 text-slate-500">{{ $t('pricing.matrixColFeature') }}</th>
                <th class="pb-3 text-slate-700 text-center">Free</th>
                <th class="pb-3 text-[#0d9488] text-center font-black">Pro (推荐)</th>
                <th class="pb-3 text-amber-700 text-center font-black">Ultimate</th>
              </tr>
            </thead>
            <tbody class="divide-y border-b border-slate-200">
              <tr class="hover:bg-slate-50">
                <td class="py-3.5 font-bold text-slate-800">{{ $t('pricing.matrixRow1') }}</td>
                <td class="py-3.5 text-center font-mono font-bold">3 个</td>
                <td class="py-3.5 text-center font-mono font-black text-[#0d9488]">12 个</td>
                <td class="py-3.5 text-center font-mono font-black text-amber-700">无限 (Unlimited)</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="py-3.5 font-bold text-slate-800">{{ $t('pricing.matrixRow2') }}</td>
                <td class="py-3.5 text-center font-mono">5 次 / 天</td>
                <td class="py-3.5 text-center font-mono font-black text-[#0d9488]">12 次 / 天</td>
                <td class="py-3.5 text-center font-mono font-black text-amber-700">无限次</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="py-3.5 font-bold text-slate-800">{{ $t('pricing.matrixRow3') }}</td>
                <td class="py-3.5 text-center text-slate-400">✕</td>
                <td class="py-3.5 text-center font-mono font-bold">10 MB / 任务</td>
                <td class="py-3.5 text-center font-mono font-black text-amber-700">100 MB / 任务</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="py-3.5 font-bold text-slate-800">{{ $t('pricing.matrixRow4') }}</td>
                <td class="py-3.5 text-center text-slate-400">✕</td>
                <td class="py-3.5 text-center font-mono font-bold">2 GB</td>
                <td class="py-3.5 text-center font-mono font-black text-amber-700">10 GB</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="py-3.5 font-bold text-slate-800">{{ $t('pricing.matrixRow5') }}</td>
                <td class="py-3.5 text-center text-slate-400">仅个人</td>
                <td class="py-3.5 text-center font-mono">仅个人</td>
                <td class="py-3.5 text-center font-mono font-black text-amber-700">最多 20 位协作者</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="py-3.5 font-bold text-slate-800">{{ $t('pricing.matrixRow6') }}</td>
                <td class="py-3.5 text-center text-slate-400">✕</td>
                <td class="py-3.5 text-center text-emerald-600 font-bold">✓ 支持</td>
                <td class="py-3.5 text-center text-emerald-600 font-bold">✓ 支持</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </main>

    <footer class="p-6 text-center text-xs font-mono text-slate-500 font-bold border-t-2 border-slate-900 bg-white">
      &copy; 2026 {{ $t('app.title') }}. {{ $t('app.allRightsReserved') }}.
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { triggerStripeCheckout } from '../utils/stripe'
import AppHeader from '../components/AppHeader.vue'
import confetti from 'canvas-confetti'

const router = useRouter()
const auth = useAuthStore()
const billingInterval = ref('monthly')

const handleSelectPlan = async (plan) => {
  if (plan === 'free') {
    auth.setMockPlan('free')
    router.push('/app')
    return
  }

  if (auth.isMockMode) {
    auth.setMockPlan(plan)
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.5 }
    })
    router.push('/app')
  } else {
    const priceId = plan === 'pro'
      ? (billingInterval.value === 'monthly' ? 'price_pro_monthly' : 'price_pro_yearly')
      : (billingInterval.value === 'monthly' ? 'price_ultimate_monthly' : 'price_ultimate_yearly')

    await triggerStripeCheckout({
      priceId,
      userEmail: auth.user?.email || 'user@example.com',
      userId: auth.user?.id || 'mock-user-001',
    })
  }
}
</script>
