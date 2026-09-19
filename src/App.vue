<template>
  <div id="root-app" class="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 font-sans selection:bg-indigo-500 selection:text-white">
    <router-view />

    <!-- Global Toast Notification -->
    <transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="toast.show"
        class="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-medium backdrop-blur-md"
        :class="toast.type === 'error' ? 'bg-rose-50/95 border-rose-200 text-rose-800' : 'bg-slate-900/90 border-slate-700 text-white'"
      >
        <span class="text-base">{{ toast.type === 'error' ? '⚠️' : '✨' }}</span>
        <span>{{ toast.message }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { reactive, onMounted, provide } from 'vue'
import { useAuthStore } from './stores/authStore'
import { useProjectStore } from './stores/projectStore'
import { useTaskStore } from './stores/taskStore'

const authStore = useAuthStore()
const projectStore = useProjectStore()
const taskStore = useTaskStore()

const toast = reactive({
  show: false,
  message: '',
  type: 'success',
  timeoutId: null,
})

function showToast(message, type = 'success', duration = 3000) {
  if (toast.timeoutId) clearTimeout(toast.timeoutId)
  toast.message = message
  toast.type = type
  toast.show = true
  toast.timeoutId = setTimeout(() => {
    toast.show = false
  }, duration)
}

provide('showToast', showToast)

onMounted(async () => {
  await authStore.initAuth()
  await projectStore.fetchProjects()
  await taskStore.fetchTasks()
})
</script>
