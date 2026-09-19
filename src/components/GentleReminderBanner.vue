<template>
  <transition
    enter-active-class="transform ease-out duration-200 transition"
    enter-from-class="-translate-y-1 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100"
    leave-to-class="-translate-y-1 opacity-0"
  >
    <!-- Simplified, Clean Gentle Reminder Banner (No Sprout Icon, Minimal & Streamlined) -->
    <div 
      v-if="reminderItem" 
      class="mb-5 rounded-xl px-4 py-3 bg-white border-2 border-slate-900 shadow-hard-sm text-slate-900 animate-fade-in flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative"
    >
      <!-- Left: Ultra-concise Text -->
      <div class="flex items-center gap-2 text-xs truncate">
        <span class="font-bold text-slate-900 shrink-0">📌 {{ locale === 'en' ? 'Pace Reminder:' : '推进提示：' }}</span>
        <span class="font-black text-slate-900 truncate">「{{ reminderItem.title }}」</span>
        <span class="text-slate-500 font-mono text-[11px] shrink-0 font-semibold">
          ({{ reminderItem.progress }}%<span v-if="reminderItem.nextStep" class="hidden md:inline"> · {{ $t('projects.nextStep') }}: {{ reminderItem.nextStep }}</span>)
        </span>
      </div>

      <!-- Right: Concise Action Buttons -->
      <div class="flex items-center gap-2 shrink-0 self-end sm:self-center">
        <!-- 5-min Quick Start -->
        <button
          @click="handleAdhdStart"
          class="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 active:translate-x-[1px] active:translate-y-[1px] text-amber-900 font-bold text-xs rounded-lg border border-slate-900 shadow-2xs transition-all flex items-center gap-1 cursor-pointer font-mono"
          :title="$t('adhd.modalSubtitle')"
        >
          <span>{{ $t('adhd.btnShort') }}</span>
        </button>

        <!-- Record Progress -->
        <button
          @click="handleRecordProgress"
          class="px-2.5 py-1 bg-[#0d9488] hover:bg-[#0f766e] active:translate-x-[1px] active:translate-y-[1px] text-white font-bold text-xs rounded-lg border border-slate-900 shadow-2xs transition-all flex items-center gap-1 cursor-pointer font-mono"
        >
          <span>📝 {{ $t('projects.recordProgress') }}</span>
        </button>

        <!-- Close / Dismiss for Today -->
        <button
          @click="handleDismissToday"
          class="p-1 text-slate-400 hover:text-slate-800 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
          :title="$t('reminders.dismissHint')"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useReminderStore } from '../stores/reminderStore'
import { useProjectStore } from '../stores/projectStore'

const emit = defineEmits(['open-progress', 'open-settings', 'open-adhd'])

const { locale } = useI18n()
const reminderStore = useReminderStore()
const projectStore = useProjectStore()

const isEn = computed(() => locale.value === 'en')

const reminderItem = computed(() => {
  return reminderStore.getGentleProjectReminder(projectStore.projects)
})

const handleAdhdStart = () => {
  if (reminderItem.value?.project) {
    emit('open-adhd', {
      title: `${reminderItem.value.title} - ${reminderItem.value.nextStep || '启动第一步'}`
    }, reminderItem.value.project)
  }
}

const handleRecordProgress = () => {
  if (reminderItem.value?.project) {
    emit('open-progress', reminderItem.value.project)
  }
}

const handleDismissToday = () => {
  if (reminderItem.value?.project) {
    reminderStore.dismissForToday(reminderItem.value.project.id)
  }
}
</script>
