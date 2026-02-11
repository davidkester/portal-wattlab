import { createRouter, createWebHistory } from 'vue-router'

// Import your views
import Dashboard from '/src/views/DashboardView.vue'
import Login from '/src/views/LoginView.vue'
import Tool from '/src/views/ToolView.vue'
//import NotFound from '@/views/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/tool',
    name: 'Tool',
    component: Tool,
  }
]

const router = createRouter({
  history: createWebHistory(), // use createWebHashHistory() if needed
  routes,
})

export default router

