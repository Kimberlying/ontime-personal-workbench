<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
    <div class="bg-white rounded-2xl shadow-modal max-w-md w-full overflow-hidden border border-slate-100 animate-pop-in">
      <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
        <div>
          <h3 class="font-bold text-sm text-slate-800">{{ $t('modals.inviteTitle') }}</h3>
          <p class="text-xs text-slate-500 mt-0.5 truncate max-w-xs">{{ project?.name }}</p>
        </div>
        <button @click="close" class="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <div class="p-5 space-y-4 text-xs">
        <!-- Ultimate Tier Badge / Notice -->
        <div v-if="auth.planType !== 'ultimate'" class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800">
          {{ $t('modals.inviteUltimateBadge') }}
        </div>

        <div>
          <label class="block font-medium text-slate-700 mb-1">{{ $t('modals.inviteEmailLabel') }}</label>
          <div class="flex gap-2">
            <input
              v-model="email"
              type="email"
              :placeholder="$t('modals.inviteEmailPlaceholder')"
              class="flex-1 px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-slate-800"
            />
            <button
              @click="handleInvite"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm transition-all"
            >
              {{ $t('modals.inviteBtn') }}
            </button>
          </div>
        </div>

        <!-- Members List -->
        <div class="pt-2">
          <div class="font-semibold text-slate-700 mb-2">{{ $t('modals.joinedMembers') }}</div>
          <div class="space-y-1.5 max-h-40 overflow-y-auto">
            <div class="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span class="text-slate-700 font-medium">{{ auth.user?.email || $t('modals.currentOwner') }} {{ $t('modals.creatorLabel') }}</span>
              <span class="text-[11px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold">Owner</span>
            </div>
            <div 
              v-for="m in projectMembers" 
              :key="m.id"
              class="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-100"
            >
              <span class="text-slate-600">{{ m.user_email }}</span>
              <span class="text-[11px] text-indigo-600 font-medium">{{ $t('modals.collaboratorLabel') }}</span>
            </div>
          </div>
        </div>

        <div class="pt-2 flex justify-end">
          <button
            @click="close"
            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors"
          >
            {{ $t('modals.close') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useProjectStore } from '../stores/projectStore'

const props = defineProps({
  isOpen: Boolean,
  project: Object,
})

const emit = defineEmits(['close'])

const auth = useAuthStore()
const projectStore = useProjectStore()

const email = ref('')

const projectMembers = computed(() => {
  if (!props.project) return []
  return projectStore.members.filter(m => m.project_id === props.project.id)
})

const close = () => {
  emit('close')
}

const handleInvite = async () => {
  if (!email.value || !props.project) return
  const res = await projectStore.inviteMember(props.project.id, email.value)
  if (res.success) {
    email.value = ''
  }
}
</script>
