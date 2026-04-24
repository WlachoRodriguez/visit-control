import { createRouter, createWebHistory } from 'vue-router'
import { UserRole } from '@/types/user'
import { useAuthStore } from '@/stores/auth'

import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import UsersView from '@/views/UsersView.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import DistrictView from '@/views/DistrictView.vue'
import ChurchView from '@/views/ChurchView.vue'
import MemberView from '@/views/MemberView.vue'
import VisitView from '@/views/VisitView.vue'
import UnauthorizedView from '@/views/UnauthorizedView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
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
          meta: {
            title: 'Usuarios',
            requiresAuth: true,
            roles: [UserRole.ADMIN],
          },
        },
        {
          path: 'district',
          component: DistrictView,
          meta: {
            title: 'Distritos',
            requiresAuth: true,
            roles: [UserRole.ADMIN],
          },
        },
        {
          path: 'church',
          component: ChurchView,
          meta: {
            title: 'Iglesias',
            requiresAuth: true,
            roles: [UserRole.ADMIN],
          },
        },
        {
          path: 'member',
          component: MemberView,
          meta: {
            title: 'Miembros',
            requiresAuth: true,
            roles: [UserRole.SECRETARY, UserRole.USER],
          },
        },
        {
          path: 'visit',
          component: VisitView,
          meta: {
            title: 'Visitas',
            requiresAuth: true,
            roles: [UserRole.USER],
          },
        },
        {
          path: 'unauthorized',
          component: UnauthorizedView,
          meta: { title: 'No autorizado' },
        },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  const token = auth.token

  if (to.meta.requiresAuth && !token) {
    return '/login'
  }

  if (to.meta.roles) {
    const hasAccess = to.meta.roles.includes(auth.user?.role)

    if (!hasAccess) {
      return '/unauthorized'
    }
  }
})

export default router
