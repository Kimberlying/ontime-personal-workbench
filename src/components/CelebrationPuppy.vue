<template>
  <div>
    <!-- ========================================================== -->
    <!-- 1. FULL-SCREEN RUNNING / FLYING PUPPY OVERLAY              -->
    <!-- ========================================================== -->
    <div 
      v-if="isScreenRunning || isFlyingAngel || isBowingThanks" 
      class="fixed inset-0 z-50 pointer-events-none overflow-hidden"
    >
      <!-- Running Puppy Across the Screen (Left to Right) -->
      <div 
        v-if="isScreenRunning"
        class="absolute bottom-16 left-0 animate-run-across flex items-center gap-2 pointer-events-auto cursor-pointer"
        @click="petPuppy"
        title="抓到跑动的小狗啦！"
      >
        <!-- Trail Footprints & Dust -->
        <div class="flex items-center gap-2 text-base select-none opacity-80">
          <span class="animate-pulse">💨</span>
          <span class="animate-bounce">🐾</span>
          <span class="animate-pulse">✨</span>
          <span class="font-mono text-xs font-black bg-white px-2 py-0.5 rounded-full border border-slate-900 shadow-2xs">
            {{ isEn ? 'Woof! Running for you!' : '汪汪！奔跑庆祝中！' }}
          </span>
        </div>

        <!-- Rigged Animated Trotting Dog SVG -->
        <div class="w-24 h-24 relative">
          <!-- Party Hat / Crown -->
          <div v-if="petCount >= 30" class="absolute -top-4 left-6 text-2xl z-20 animate-bounce">
            👑
          </div>
          <div v-else class="absolute -top-3 left-6 text-xl z-20 animate-wiggle">
            🎉
          </div>

          <svg class="w-full h-full animate-trot-bob" viewBox="0 0 200 160" fill="none">
            <!-- Back Left Leg (Running) -->
            <path class="animate-leg-bl" d="M130 110 Q145 135 150 145" stroke="#0f172a" stroke-width="7" stroke-linecap="round" />
            <ellipse class="animate-leg-bl" cx="150" cy="145" rx="7" ry="5" fill="#FDFEFE" stroke="#0f172a" stroke-width="3" />

            <!-- Back Right Leg (Running) -->
            <path class="animate-leg-br" d="M120 110 Q110 135 105 145" stroke="#0f172a" stroke-width="7" stroke-linecap="round" />
            <ellipse class="animate-leg-br" cx="105" cy="145" rx="7" ry="5" fill="#FDFEFE" stroke="#0f172a" stroke-width="3" />

            <!-- Wagging Tail -->
            <path class="animate-wag-fast origin-left" d="M140 85 C165 70 175 50 160 35 C145 25 135 50 130 75 Z" fill="#E59866" stroke="#0f172a" stroke-width="5" />

            <!-- Torso -->
            <ellipse cx="95" cy="85" rx="45" ry="32" fill="#E59866" stroke="#0f172a" stroke-width="5" />
            <ellipse cx="95" cy="90" rx="25" ry="18" fill="#FDFEFE" />

            <!-- Front Left Leg (Running) -->
            <path class="animate-leg-fl" d="M65 105 Q50 130 40 145" stroke="#0f172a" stroke-width="7" stroke-linecap="round" />
            <ellipse class="animate-leg-fl" cx="40" cy="145" rx="7" ry="5" fill="#FDFEFE" stroke="#0f172a" stroke-width="3" />

            <!-- Front Right Leg (Running) -->
            <path class="animate-leg-fr" d="M75 105 Q90 130 95 145" stroke="#0f172a" stroke-width="7" stroke-linecap="round" />
            <ellipse class="animate-leg-fr" cx="95" cy="145" rx="7" ry="5" fill="#FDFEFE" stroke="#0f172a" stroke-width="3" />

            <!-- Head & Ears -->
            <circle cx="50" cy="55" r="32" fill="#E59866" stroke="#0f172a" stroke-width="5" />
            <!-- Left Ear -->
            <path class="animate-ear-left" d="M30 40 L15 10 L45 25 Z" fill="#E59866" stroke="#0f172a" stroke-width="4" />
            <!-- Right Ear -->
            <path class="animate-ear-right" d="M65 40 L80 10 L50 25 Z" fill="#E59866" stroke="#0f172a" stroke-width="4" />
            <!-- Snout & Face Mask -->
            <ellipse cx="40" cy="62" rx="18" ry="14" fill="#FDFEFE" />
            <!-- Smiling Eyes -->
            <path d="M32 50 Q40 42 46 50" stroke="#0f172a" stroke-width="4" stroke-linecap="round" />
            <path d="M54 50 Q62 42 68 50" stroke="#0f172a" stroke-width="4" stroke-linecap="round" />
            <!-- Nose & Tongue -->
            <circle cx="40" cy="60" r="5" fill="#0f172a" />
            <path d="M37 65 Q40 73 43 65" fill="#F1948A" stroke="#0f172a" stroke-width="2.5" />
          </svg>
        </div>
      </div>

      <!-- 30-Pet Easter Egg: Puppy Bowing Down & Somervault in Screen Center -->
      <div 
        v-if="isBowingThanks"
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3 animate-pop-in"
      >
        <div class="bg-amber-300 border-2 border-slate-900 px-5 py-2.5 rounded-2xl shadow-hard text-slate-900 font-black text-sm text-center animate-bounce-subtle">
          <span>🙇‍♂️ 汪！30次亲密度大感谢！小狗给主人鞠躬致谢啦！</span>
        </div>

        <div class="w-36 h-36 relative animate-bow-spin">
          <span class="text-4xl absolute -top-8 left-12 animate-bounce">👑</span>
          <span class="text-3xl absolute -left-8 top-10">🥩</span>
          <span class="text-3xl absolute -right-8 top-10">🍖</span>
          <span class="text-3xl absolute bottom-0 left-12">💖</span>

          <!-- Bowing Dog Figure -->
          <div class="w-full h-full bg-amber-100 rounded-3xl border-2 border-slate-900 shadow-hard flex items-center justify-center p-3">
            <span class="text-6xl animate-pulse">🐕</span>
          </div>
        </div>
      </div>

      <!-- 50-Pet Easter Egg: Flying Angel Sky Flight -->
      <div 
        v-if="isFlyingAngel"
        class="absolute animate-flying-angel flex items-center gap-3"
      >
        <div class="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-100 border-2 border-slate-900 px-5 py-2.5 rounded-2xl shadow-hard text-slate-900 font-black text-sm animate-pulse flex items-center gap-2">
          <span>👼</span>
          <span>{{ isEn ? 'Angel Pup is Flying to Thank You!' : '🪽 50次达成！天使小狗飞天巡游，谢谢主人！' }}</span>
        </div>

        <div class="w-32 h-32 relative">
          <!-- Wings & Halo -->
          <div class="absolute -top-4 left-10 text-3xl animate-bounce">😇</div>
          <div class="absolute -left-6 top-8 text-4xl animate-wing-left">🪽</div>
          <div class="absolute -right-6 top-8 text-4xl animate-wing-right">🪽</div>
          
          <div class="w-full h-full bg-amber-100 rounded-3xl border-2 border-slate-900 shadow-hard flex items-center justify-center text-6xl">
            🐕
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================== -->
    <!-- 2. CORNER PUPPY COMPANION & INTERACTIVE SPEECH DIALOG      -->
    <!-- ========================================================== -->
    <transition
      enter-active-class="transform ease-out duration-500 transition"
      enter-from-class="translate-y-24 opacity-0 scale-75"
      enter-to-class="translate-y-0 opacity-100 scale-100"
      leave-active-class="transform ease-in duration-300 transition"
      leave-from-class="translate-y-0 opacity-100 scale-100"
      leave-to-class="translate-y-24 opacity-0 scale-75"
    >
      <div
        v-if="milestoneStore.showPuppyCelebration && !isScreenRunning && !isFlyingAngel && !isBowingThanks"
        class="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto select-none"
      >
        <!-- Puppy Speech Bubble -->
        <div 
          class="mb-3 max-w-xs sm:max-w-sm bg-white border-2 border-slate-900 rounded-3xl p-4 shadow-hard relative animate-bounce-subtle"
          :class="{ 'ring-4 ring-amber-300 border-amber-500': petCount >= 50, 'ring-2 ring-teal-400': petCount >= 30 && petCount < 50 }"
        >
          <!-- Speech triangle pointer -->
          <div class="absolute -bottom-2 right-12 w-4 h-4 bg-white border-r-2 border-b-2 border-slate-900 transform rotate-45"></div>

          <!-- Header of bubble with Level Badge & Actions -->
          <div class="flex items-start justify-between gap-2 pb-1.5 border-b border-slate-100">
            <div class="flex items-center gap-1.5">
              <span class="text-base">{{ tierInfo.emoji }}</span>
              <span class="font-black text-xs text-slate-900">{{ isEn ? tierInfo.titleEn : tierInfo.titleZh }}</span>
              <span class="px-1.5 py-0.2 rounded text-[9px] font-mono font-black border border-slate-900 bg-amber-200 text-amber-950">
                Lv.{{ currentLevel }}
              </span>
            </div>
            <div class="flex items-center gap-1">
              <button
                @click="triggerScreenRun"
                class="text-[10px] font-mono font-bold bg-amber-100 hover:bg-amber-200 text-amber-950 px-2 py-0.5 rounded border border-slate-900 cursor-pointer"
                title="让小狗全屏跑一圈撒欢！"
              >
                🏃‍♂️ 跑一圈
              </button>
              <button
                @click="closePuppy"
                class="text-slate-400 hover:text-slate-900 p-0.5 rounded hover:bg-slate-100 cursor-pointer"
                title="关闭小狗"
              >
                ✕
              </button>
            </div>
          </div>

          <!-- Dynamic Speech Text (changes with tier and milestones) -->
          <p class="text-xs text-slate-800 font-sans font-bold leading-relaxed my-2">
            {{ currentSpeech }}
          </p>

          <!-- Interactive Affinity Level Progress Bar -->
          <div class="space-y-1 pt-1.5 border-t border-slate-100 font-mono text-[10px]">
            <div class="flex items-center justify-between text-slate-500 font-bold">
              <span>{{ isEn ? 'Affinity Progress' : '小狗亲密度' }}:</span>
              <span class="text-[#0d9488] font-black">{{ petCount }} {{ isEn ? 'pets' : '次摸摸' }}</span>
            </div>

            <!-- Progress Bar -->
            <div class="w-full bg-slate-100 h-2 rounded-full border border-slate-900 overflow-hidden relative">
              <div 
                class="h-full transition-all duration-300 bg-gradient-to-r from-teal-400 via-amber-400 to-rose-500"
                :style="{ width: `${progressPercentage}%` }"
              ></div>
            </div>

            <div class="flex items-center justify-between text-[9px] text-slate-400 font-sans">
              <span class="truncate">{{ nextUnlockHint }}</span>
              <span @click="petPuppy" class="text-amber-600 hover:underline cursor-pointer font-bold shrink-0 ml-1">
                {{ isEn ? '🐾 Pet (+1)' : '🐾 点击摸摸' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Animated Puppy Avatar (Interactive on click) -->
        <div
          @click="petPuppy"
          class="relative cursor-pointer group transition-transform duration-300 hover:scale-105 active:scale-95"
          :class="{ 'animate-pup-jump': isJumping, 'animate-spin-jump': isSpinning }"
          title="摸摸庆祝小狗！点击互动"
        >
          <!-- Floating hearts/bones/steaks/crowns on tap -->
          <div 
            v-for="f in floatingIcons" 
            :key="f.id"
            class="absolute pointer-events-none text-2xl animate-float-fade"
            :style="{ left: `${f.x}px`, top: `${f.y}px` }"
          >
            {{ f.icon }}
          </div>

          <!-- Golden Aura Ring for Level 50+ -->
          <div 
            v-if="petCount >= 50" 
            class="absolute -inset-2 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-200 rounded-full blur-sm opacity-70 animate-pulse pointer-events-none"
          ></div>

          <!-- Angel Wings for Level 50+ -->
          <div v-if="petCount >= 50" class="absolute -left-7 top-4 text-3xl animate-wing-left z-0 pointer-events-none">
            🪽
          </div>
          <div v-if="petCount >= 50" class="absolute -right-7 top-4 text-3xl animate-wing-right z-0 pointer-events-none transform -scale-x-100">
            🪽
          </div>

          <!-- SVG Shiba Inu Puppy with Animated Tail, Ears, and Outfits -->
          <div class="w-28 h-28 bg-amber-100 rounded-3xl border-2 border-slate-900 shadow-hard p-2 flex items-center justify-center relative overflow-visible bg-gradient-to-b from-amber-50 to-amber-100 z-10">
            
            <!-- Golden Crown for Level 30+ -->
            <div v-if="petCount >= 30" class="absolute -top-6 left-8 z-30 transform animate-bounce-subtle text-3xl drop-shadow-md">
              👑
            </div>

            <!-- Birthday Party Hat 🎉 (Level 0 ~ 29) -->
            <div v-else class="absolute -top-4 left-7 z-20 transform -rotate-12 animate-wiggle">
              <svg class="w-8 h-8 drop-shadow-sm" viewBox="0 0 100 100">
                <polygon points="50,10 20,85 80,85" fill="#f59e0b" stroke="#0f172a" stroke-width="6" />
                <polygon points="50,10 35,85 65,85" fill="#0d9488" />
                <circle cx="50" cy="10" r="8" fill="#ef4444" stroke="#0f172a" stroke-width="4" />
              </svg>
            </div>

            <!-- Sunglasses 🕶️ for Level 10+ -->
            <div v-if="petCount >= 10 && petCount < 30" class="absolute top-8 left-6 z-20 text-xl pointer-events-none">
              🕶️
            </div>

            <!-- Sitting/Standing Puppy Body SVG with Wagging Tail & Perky Ears -->
            <svg class="w-24 h-24" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- Animated Wagging Tail -->
              <path
                class="animate-wag"
                d="M150 140 C175 120 185 100 170 85 C155 75 145 100 140 125 Z"
                fill="#E59866"
                stroke="#0f172a"
                stroke-width="5"
              />

              <!-- Body -->
              <ellipse cx="100" cy="135" rx="55" ry="45" fill="#E59866" stroke="#0f172a" stroke-width="5" />
              <!-- White Chest Fur -->
              <ellipse cx="100" cy="142" rx="32" ry="28" fill="#FDFEFE" />

              <!-- Red Bowtie 🎀 for Level 10+ -->
              <path
                v-if="petCount >= 10"
                d="M85 130 L115 140 M115 130 L85 140"
                stroke="#ef4444"
                stroke-width="8"
                stroke-linecap="round"
              />

              <!-- Left Ear (Bouncing) -->
              <path
                class="animate-ear-left origin-bottom-right"
                d="M60 70 L40 25 L85 45 Z"
                fill="#E59866"
                stroke="#0f172a"
                stroke-width="5"
              />
              <path d="M58 60 L46 33 L75 46 Z" fill="#FADBD8" />

              <!-- Right Ear (Bouncing) -->
              <path
                class="animate-ear-right origin-bottom-left"
                d="M140 70 L160 25 L115 45 Z"
                fill="#E59866"
                stroke="#0f172a"
                stroke-width="5"
              />
              <path d="M142 60 L154 33 L125 46 Z" fill="#FADBD8" />

              <!-- Head -->
              <circle cx="100" cy="85" r="45" fill="#E59866" stroke="#0f172a" stroke-width="5" />

              <!-- Face White Mask -->
              <path
                d="M70 85 C70 115 130 115 130 85 C120 70 80 70 70 85 Z"
                fill="#FDFEFE"
              />

              <!-- Blinking Happy Eyes (◠ ‿ ◠) -->
              <path d="M75 80 Q85 70 95 80" stroke="#0f172a" stroke-width="5" stroke-linecap="round" fill="none" />
              <path d="M105 80 Q115 70 125 80" stroke="#0f172a" stroke-width="5" stroke-linecap="round" fill="none" />

              <!-- Cute Snout & Nose -->
              <ellipse cx="100" cy="94" rx="8" ry="6" fill="#0f172a" />
              <!-- Smiling Mouth with Tongue -->
              <path d="M94 98 Q100 105 106 98" stroke="#0f172a" stroke-width="4" stroke-linecap="round" fill="none" />
              <path d="M97 101 Q100 112 103 101" fill="#F1948A" stroke="#0f172a" stroke-width="3" />

              <!-- Cheeks Blush -->
              <circle cx="72" cy="90" r="5" fill="#F1948A" opacity="0.6" />
              <circle cx="128" cy="90" r="5" fill="#F1948A" opacity="0.6" />

              <!-- Paws -->
              <circle cx="75" cy="155" r="14" fill="#FDFEFE" stroke="#0f172a" stroke-width="4" />
              <circle cx="125" cy="155" r="14" fill="#FDFEFE" stroke="#0f172a" stroke-width="4" />
            </svg>

            <!-- Floating Badge in Puppy's Paw -->
            <div class="absolute -bottom-2 bg-amber-400 border-2 border-slate-900 px-2 py-0.5 rounded-full text-[10px] font-black font-mono shadow-2xs">
              {{ petCount >= 50 ? '👑 ANGEL PUP' : petCount >= 30 ? '✨ KING PUP' : '🏆 ON TIME' }}
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMilestoneStore } from '../stores/milestoneStore'
import confetti from 'canvas-confetti'

const STORAGE_AFFINITY_KEY = 'orderly_puppy_pet_count'

const { t, locale } = useI18n()
const milestoneStore = useMilestoneStore()

const isEn = computed(() => locale.value === 'en')
const isJumping = ref(false)
const isSpinning = ref(false)
const isScreenRunning = ref(false)
const isBowingThanks = ref(false)
const isFlyingAngel = ref(false)

const petCount = ref(0)
const floatingIcons = ref([])
const customCheerMessage = ref('')

onMounted(() => {
  const saved = parseInt(localStorage.getItem(STORAGE_AFFINITY_KEY) || '0', 10)
  petCount.value = isNaN(saved) ? 0 : saved
})

const savePetCount = () => {
  localStorage.setItem(STORAGE_AFFINITY_KEY, petCount.value.toString())
}

const currentLevel = computed(() => {
  if (petCount.value >= 50) return 4
  if (petCount.value >= 30) return 3
  if (petCount.value >= 10) return 2
  return 1
})

const tierInfo = computed(() => {
  if (petCount.value >= 50) {
    return {
      emoji: '👼',
      titleZh: '守护天使小神犬',
      titleEn: 'Angel Guardian Pup',
    }
  }
  if (petCount.value >= 30) {
    return {
      emoji: '👑',
      titleZh: '狂欢王冠小狗',
      titleEn: 'Royal Champion Pup',
    }
  }
  if (petCount.value >= 10) {
    return {
      emoji: '🕶️',
      titleZh: '默契搭档小狗',
      titleEn: 'Cool Partner Pup',
    }
  }
  return {
    emoji: '🐕',
    titleZh: '如期庆祝小狗',
    titleEn: 'Doggie Cheerleader',
  }
})

const progressPercentage = computed(() => {
  if (petCount.value >= 50) return 100
  if (petCount.value >= 30) {
    return Math.round(((petCount.value - 30) / 20) * 100)
  }
  if (petCount.value >= 10) {
    return Math.round(((petCount.value - 10) / 20) * 100)
  }
  return Math.round((petCount.value / 10) * 100)
})

const nextUnlockHint = computed(() => {
  if (petCount.value >= 50) {
    return isEn.value ? '🌟 Max Affinity Reached! You are the ultimate partner!' : '🌟 已达最高亲密度！终极默契搭档！'
  }
  if (petCount.value >= 30) {
    const remain = 50 - petCount.value
    return isEn.value ? `Next: Angel Wings in ${remain} pets` : `距 50 次解锁【金色天使光翼】还差 ${remain} 次`
  }
  if (petCount.value >= 10) {
    const remain = 30 - petCount.value
    return isEn.value ? `Next: Royal Crown in ${remain} pets` : `距 30 次解锁【金色王冠 & 狂欢暴击】还差 ${remain} 次`
  }
  const remain = 10 - petCount.value
  return isEn.value ? `Next: Cool Sunglasses in ${remain} pets` : `距 10 次解锁【酷炫墨镜】还差 ${remain} 次`
})

const currentSpeech = computed(() => {
  if (customCheerMessage.value) {
    return customCheerMessage.value
  }
  if (milestoneStore.puppyMessage) {
    return milestoneStore.puppyMessage
  }

  // Tier-based default speech lines
  if (petCount.value >= 50) {
    return isEn.value
      ? '✨ (Floating happily!) 50+ Pets! You unlocked Angel Wings! I promise to guard your deadlines forever! Deliver on time! 🪽👑'
      : '✨（嗷呜~ 开心到起飞！）50次亲密达成！小狗长出金色天使翅膀啦！发誓一辈子守护主人的工期！万事皆如期！🪽👑'
  }
  if (petCount.value >= 30) {
    return isEn.value
      ? '🎉 (Doing joyful spins!) 30 Pets! Royal Crown unlocked! Huge energy boost, let us conquer all goals today! 👑🍖'
      : '🎉（汪汪汪！狂喜转圈圈！）30次好感大爆发！小狗戴上金王冠啦！充满力量陪主人冲刺结项！👑🍖'
  }
  if (petCount.value >= 10) {
    return isEn.value
      ? '🕶️ Woof! Cool partner mode on! Today is another productive day, keep your cadence! 🥩✨'
      : '🕶️ 汪！默契搭档已就位！戴上墨镜陪主人冲刺，今天也一定要如期交付哦！🥩✨'
  }
  return isEn.value
    ? '🐾 Woof! Happy to cheer for you! Pet me more to unlock special outfits and celebrations! 💖'
    : '🐾 汪汪！摸摸小狗好舒服~ 持续摸摸小狗会解锁不一样的惊喜装扮与狂欢彩蛋哦！💖'
})

// Web Audio API Sound Synthesizer with Tier-based Arpeggios & Fanfares
const playSoundForTier = (tier) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()
    
    let freqs = [523.25, 659.25, 783.99] // Level 1
    if (tier === 2) freqs = [523.25, 659.25, 783.99, 1046.50]
    if (tier === 3) freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51] // Level 30 (Majestic)
    if (tier >= 4) freqs = [659.25, 783.99, 987.77, 1318.51, 1567.98] // Level 50 (Heavenly Fanfare)

    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = tier >= 3 ? 'sine' : 'triangle'
      osc.frequency.setValueAtTime(f, ctx.currentTime + idx * 0.07)
      
      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.07)
      gain.gain.linearRampToValueAtTime(tier >= 3 ? 0.25 : 0.15, ctx.currentTime + idx * 0.07 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.35)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(ctx.currentTime + idx * 0.07)
      osc.stop(ctx.currentTime + idx * 0.07 + 0.4)
    })
  } catch (e) {
    // Ignore audio restrictions
  }
}

const triggerScreenRun = () => {
  isScreenRunning.value = true
  playSoundForTier(currentLevel.value)
  setTimeout(() => {
    isScreenRunning.value = false
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { x: 0.85, y: 0.85 }
    })
  }, 2800)
}

// Watch for milestone store events (Trigger full-screen trot on first appearance!)
watch(() => milestoneStore.showPuppyCelebration, (val) => {
  if (val) {
    triggerScreenRun()
  }
})

const petPuppy = () => {
  petCount.value++
  savePetCount()

  // Check 30-pet Milestone Easter Egg Blast: Bowing Thanks & Somersault
  if (petCount.value === 30) {
    isBowingThanks.value = true
    customCheerMessage.value = isEn.value
      ? '🙇‍♂️ WOOF!! 30 Pets reached! The puppy is bowing down to thank you from the bottom of its heart! 👑🥩'
      : '🙇‍♂️ 汪汪汪！！！30次亲密达成！小狗给主人鞠躬致谢啦！今天有任何大项目，小狗陪你冲刺！👑🥩'
    
    playSoundForTier(3)
    confetti({
      particleCount: 150,
      spread: 120,
      origin: { x: 0.5, y: 0.5 },
      colors: ['#f59e0b', '#0d9488', '#ec4899', '#8b5cf6', '#3b82f6']
    })

    setTimeout(() => {
      isBowingThanks.value = false
    }, 3200)

    setTimeout(() => { customCheerMessage.value = '' }, 10000)
    return
  }

  // Check 50-pet Milestone Easter Egg Blast: Flying Angel Sky Parade
  if (petCount.value === 50) {
    isFlyingAngel.value = true
    customCheerMessage.value = isEn.value
      ? '👼🪽 INCREDIBLE!! 50 Pets reached! Guardian Angel Pup takes to the sky to thank you! 🪽✨'
      : '👼🪽 嗷呜！！！50次终极达成！天使小狗飞天巡游，发誓守护主人如期交付！谢谢主人！🪽✨'
    
    playSoundForTier(4)
    confetti({
      particleCount: 220,
      spread: 140,
      origin: { x: 0.5, y: 0.4 },
      colors: ['#ffd700', '#f59e0b', '#10b981', '#6366f1', '#f43f5e']
    })

    setTimeout(() => {
      isFlyingAngel.value = false
    }, 3600)

    setTimeout(() => { customCheerMessage.value = '' }, 12000)
    return
  }

  // Normal click bounce & items drop
  isJumping.value = true
  setTimeout(() => { isJumping.value = false }, 500)
  
  playSoundForTier(currentLevel.value)

  // Floating items tailored to tier
  let iconsPool = ['💖', '🦴', '🐾']
  if (petCount.value >= 10) iconsPool = ['💖', '🦴', '🥩', '🍗', '✨']
  if (petCount.value >= 30) iconsPool = ['👑', '🥩', '🍗', '💎', '🪙', '✨', '💖']
  if (petCount.value >= 50) iconsPool = ['🪽', '👑', '🌈', '🥩', '💎', '⚡', '✨', '💖']

  const randomIcon = iconsPool[Math.floor(Math.random() * iconsPool.length)]
  const id = Date.now() + Math.random()
  floatingIcons.value.push({
    id,
    icon: randomIcon,
    x: (Math.random() - 0.5) * 60,
    y: -20 - Math.random() * 40,
  })

  confetti({
    particleCount: petCount.value >= 30 ? 30 : 15,
    spread: 40,
    origin: { x: 0.88, y: 0.85 }
  })

  setTimeout(() => {
    floatingIcons.value = floatingIcons.value.filter(item => item.id !== id)
  }, 1200)
}

const closePuppy = () => {
  milestoneStore.closePuppyCelebration()
}
</script>

<style scoped>
/* Full screen running animation across viewport */
@keyframes runAcross {
  0% {
    transform: translateX(-160px);
  }
  85% {
    transform: translateX(calc(100vw - 260px));
  }
  100% {
    transform: translateX(calc(100vw - 220px));
  }
}

/* 4-leg trotting cycle keyframes */
@keyframes legFL {
  0%, 100% {
    transform: rotate(20deg);
    transform-origin: 65px 105px;
  }
  50% {
    transform: rotate(-25deg);
    transform-origin: 65px 105px;
  }
}

@keyframes legFR {
  0%, 100% {
    transform: rotate(-25deg);
    transform-origin: 75px 105px;
  }
  50% {
    transform: rotate(20deg);
    transform-origin: 75px 105px;
  }
}

@keyframes legBL {
  0%, 100% {
    transform: rotate(-25deg);
    transform-origin: 130px 110px;
  }
  50% {
    transform: rotate(20deg);
    transform-origin: 130px 110px;
  }
}

@keyframes legBR {
  0%, 100% {
    transform: rotate(20deg);
    transform-origin: 120px 110px;
  }
  50% {
    transform: rotate(-25deg);
    transform-origin: 120px 110px;
  }
}

@keyframes trotBob {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-6px) rotate(-2deg);
  }
  50% {
    transform: translateY(0) rotate(0deg);
  }
  75% {
    transform: translateY(-6px) rotate(2deg);
  }
}

@keyframes wagFast {
  0%, 100% {
    transform: rotate(0deg);
    transform-origin: 130px 75px;
  }
  50% {
    transform: rotate(35deg);
    transform-origin: 130px 75px;
  }
}

/* 30-pet somersault and bow keyframes */
@keyframes bowSpin {
  0% {
    transform: scale(0.5) rotate(0deg);
  }
  40% {
    transform: scale(1.2) rotate(360deg) translateY(-20px);
  }
  70% {
    transform: scale(1) rotate(720deg) translateY(0);
  }
  100% {
    transform: scale(1) rotate(720deg) translateY(6px);
  }
}

/* 50-pet flying angel across the sky */
@keyframes flyingAngel {
  0% {
    bottom: 20%;
    right: -180px;
    transform: rotate(-10deg) scale(0.8);
  }
  40% {
    bottom: 60%;
    right: 40%;
    transform: rotate(10deg) scale(1.15);
  }
  75% {
    bottom: 45%;
    right: 70%;
    transform: rotate(-5deg) scale(1.1);
  }
  100% {
    bottom: 25%;
    right: calc(100vw + 100px);
    transform: rotate(5deg) scale(0.9);
  }
}

/* Corner sitting animations */
@keyframes wag {
  0%, 100% {
    transform: rotate(0deg);
    transform-origin: 140px 130px;
  }
  50% {
    transform: rotate(26deg);
    transform-origin: 140px 130px;
  }
}

@keyframes earLeft {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(-12deg);
  }
}

@keyframes earRight {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(12deg);
  }
}

@keyframes wiggle {
  0%, 100% {
    transform: rotate(-12deg);
  }
  50% {
    transform: rotate(8deg);
  }
}

@keyframes pupJump {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  40% {
    transform: translateY(-16px) scale(1.08) rotate(-4deg);
  }
  70% {
    transform: translateY(-6px) scale(1.04) rotate(3deg);
  }
}

@keyframes spinJump {
  0% {
    transform: translateY(0) rotate(0deg) scale(1);
  }
  30% {
    transform: translateY(-28px) rotate(180deg) scale(1.15);
  }
  60% {
    transform: translateY(-20px) rotate(360deg) scale(1.1);
  }
  100% {
    transform: translateY(0) rotate(720deg) scale(1);
  }
}

@keyframes wingLeft {
  0%, 100% {
    transform: translateY(0) rotate(-5deg);
  }
  50% {
    transform: translateY(-6px) rotate(15deg);
  }
}

@keyframes wingRight {
  0%, 100% {
    transform: translateY(0) scaleX(-1) rotate(-5deg);
  }
  50% {
    transform: translateY(-6px) scaleX(-1) rotate(15deg);
  }
}

@keyframes floatFade {
  0% {
    opacity: 1;
    transform: translateY(0) scale(0.8);
  }
  100% {
    opacity: 0;
    transform: translateY(-60px) scale(1.4);
  }
}

@keyframes bounceSubtle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

.animate-run-across {
  animation: runAcross 2.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

.animate-leg-fl {
  animation: legFL 0.22s ease-in-out infinite;
}

.animate-leg-fr {
  animation: legFR 0.22s ease-in-out infinite;
}

.animate-leg-bl {
  animation: legBL 0.22s ease-in-out infinite;
}

.animate-leg-br {
  animation: legBR 0.22s ease-in-out infinite;
}

.animate-trot-bob {
  animation: trotBob 0.22s ease-in-out infinite;
}

.animate-wag-fast {
  animation: wagFast 0.2s ease-in-out infinite;
}

.animate-bow-spin {
  animation: bowSpin 3.2s ease-in-out forwards;
}

.animate-flying-angel {
  animation: flyingAngel 3.6s ease-in-out forwards;
}

.animate-wag {
  animation: wag 0.3s ease-in-out infinite;
}

.animate-ear-left {
  animation: earLeft 1.1s ease-in-out infinite;
}

.animate-ear-right {
  animation: earRight 1.1s ease-in-out infinite 0.2s;
}

.animate-wiggle {
  animation: wiggle 0.9s ease-in-out infinite;
}

.animate-pup-jump {
  animation: pupJump 0.5s ease-out;
}

.animate-spin-jump {
  animation: spinJump 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.animate-wing-left {
  animation: wingLeft 0.7s ease-in-out infinite;
}

.animate-wing-right {
  animation: wingRight 0.7s ease-in-out infinite;
}

.animate-float-fade {
  animation: floatFade 1.2s ease-out forwards;
}

.animate-bounce-subtle {
  animation: bounceSubtle 2.5s ease-in-out infinite;
}
</style>
