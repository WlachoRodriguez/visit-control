import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import UsersView from '@/views/UsersView.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import DistrictView from '@/views/DistrictView.vue'
import ChurchView from '@/views/ChurchView.vue'
import MemberView from '@/views/MemberView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      component: LoginView,
    },
    {
      path: '/',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          component: DashboardView,
          meta: { title: 'Dashboard' },
        },
        {
          path: 'users',
          component: UsersView,
          meta: { title: 'Usuarios' },
        },
        {
          path: 'district',
          component: DistrictView,
          meta: { title: 'Distritos' },
        },
        {
          path: 'church',
          component: ChurchView,
          meta: { title: 'Iglesias' },
        },
        {
          path: 'member',
          component: MemberView,
          meta: { title: 'Miembros' },
        },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    return '/login'
  }
})

export default router
