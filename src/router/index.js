import { createRouter, createWebHistory } from 'vue-router'
import WorkbenchApp from '../views/WorkbenchApp.vue'
import LoginPage from '../views/LoginPage.vue'
import { useAuthStore } from '../stores/authStore'

const routes = [
  {
    path: '/',
    name: 'Workbench',
    component: WorkbenchApp,
  },
  {
    path: '/app',
    redirect: '/',
  },
  {
    path: '/pricing',
    redirect: '/',
  },
  {
    path: '/theme-preview',
    redirect: '/',
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// Auto init auth on every route navigation
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  if (!auth.profile) {
    await auth.initAuth()
  }
  next()
})

export default router
