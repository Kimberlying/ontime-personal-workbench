<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
    <div class="bg-white rounded-2xl shadow-modal max-w-md w-full overflow-hidden border border-slate-100 animate-pop-in">
      <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
        <div>
          <h3 class="font-bold text-sm text-slate-800">{{ $t('modals.attachmentTitle') }}</h3>
          <p class="text-xs text-slate-500 mt-0.5 truncate max-w-xs">{{ task?.title }}</p>
        </div>
        <button @click="close" class="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <div class="p-5 space-y-4 text-xs">
        <!-- Storage Quota Status -->
        <div class="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between">
          <span class="text-slate-500">{{ $t('modals.storageUsed') }}</span>
          <span class="font-semibold text-slate-800">
            {{ formatBytes(auth.usedStorage) }} / {{ auth.planType === 'free' ? '0 MB' : auth.planType === 'pro' ? '2 GB' : '10 GB' }}
          </span>
        </div>

        <!-- Existing Attachments -->
        <div v-if="task?.attachments && task.attachments.length > 0" class="space-y-2">
          <div class="font-semibold text-slate-700">{{ $t('modals.uploadedAttachments') }}</div>
          <div 
            v-for="(att, i) in task.attachments" 
            :key="i"
            class="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100/50 transition-colors"
          >
            <div class="flex items-center gap-2 truncate">
              <span class="text-sm">📄</span>
              <div class="truncate">
                <p class="font-medium text-slate-800 truncate max-w-[180px]">{{ att.name }}</p>
                <p class="text-[10px] text-slate-400">{{ formatBytes(att.size) }}</p>
              </div>
            </div>
            <a 
              :href="att.url" 
              target="_blank" 
              class="text-indigo-600 hover:text-indigo-800 font-semibold text-[11px] px-2 py-1 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              {{ $t('modals.viewFile') }}
            </a>
          </div>
        </div>
        <div v-else class="text-center py-4 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          {{ $t('modals.noAttachments') }}
        </div>

        <!-- Upload Dropzone / Button -->
        <div class="pt-2">
          <label 
            class="w-full flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl cursor-pointer bg-slate-50/50 hover:bg-indigo-50/30 transition-all text-center group"
          >
            <span class="text-2xl mb-1 group-hover:scale-110 transition-transform">📤</span>
            <span class="font-medium text-slate-700">{{ $t('modals.uploadDrop') }}</span>
            <span class="text-[10px] text-slate-400 mt-0.5">
              {{ auth.planType === 'free' ? $t('modals.uploadHintFree') : auth.planType === 'pro' ? $t('modals.uploadHintPro') : $t('modals.uploadHintUltimate') }}
            </span>
            <input type="file" class="hidden" @change="handleFileUpload" />
          </label>
        </div>

        <!-- Plan limits notice -->
        <div v-if="auth.planType === 'free'" class="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-amber-800 text-[11px]">
          ⚡ {{ $t('modals.uploadHintFree') }}
        </div>

        <div class="pt-2 flex justify-end">
          <button
            @click="close"
            class="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-xl transition-colors"
          >
            {{ $t('modals.done') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore'
import { useTaskStore } from '../stores/taskStore'
import { formatBytes } from '../utils/planLimits'

const props = defineProps({
  isOpen: Boolean,
  task: Object,
})

const emit = defineEmits(['close'])

const auth = useAuthStore()
const taskStore = useTaskStore()

const close = () => {
  emit('close')
}

const handleFileUpload = async (e) => {
  const file = e.target.files?.[0]
  if (!file || !props.task) return

  await taskStore.uploadAttachment(props.task.id, file)
  e.target.value = ''
}
</script>
