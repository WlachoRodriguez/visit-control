<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { UserRole } from '@/types/user'
import {
  DesktopOutlined,
  TeamOutlined,
  LogoutOutlined,
  ShareAltOutlined,
  ContactsOutlined,
  HomeOutlined,
  ApartmentOutlined,
  CalendarOutlined,
} from '@ant-design/icons-vue'
import logo from '../assets/images/logo.png'
import miniLogo from '../assets/images/miniLogo.png'

const collapsed = ref(false)
const isMobile = ref(false)
const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const selectedKey = computed(() => route.path.replace('/', ''))

const title = computed(() => route.meta.title || 'Dashboard')

onMounted(() => {
  const check = () => {
    isMobile.value = window.innerWidth < 768
  }

  check()
  window.addEventListener('resize', check)
})

const logout = () => {
  auth.logout()
  router.push('/login')
}

const layoutStyle = computed(() => ({
  marginLeft: '0px',
}))

const headerStyle = computed(() => ({
  position: 'fixed',
  top: 0,
  right: 0,
  left: isMobile.value ? '80px' : collapsed.value ? '80px' : '200px',
  zIndex: 10,
  background: '#fff',
  display: 'flex',
  justifyContent: 'space-between',
  transition: 'all 0.5s',
}))

const can = (roles?: UserRole[]) => {
  if (!roles) return true
  return roles.includes(auth.user?.role)
}
</script>

<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider
      v-model:collapsed="collapsed"
      :collapsible="!isMobile"
      :trigger="isMobile ? null : undefined"
      :breakpoint="'lg'"
      :collapsedWidth="80"
      :width="200"
      :style="{ transition: 'all 0.5s' }"
    >
      <div style="color: white; padding: 10px 0px; text-align: center">
        <img v-if="!collapsed" :src="logo" style="width: 150px" />
        <img v-else :src="miniLogo" style="width: 50px" />
      </div>

      <a-menu theme="dark" mode="inline" :selectedKeys="[selectedKey]">
        <a-menu-item key="dashboard">
          <DesktopOutlined />
          <span>
            <router-link to="/dashboard">Dashboard</router-link>
          </span>
        </a-menu-item>
        <a-sub-menu
          key="sub1"
          v-if="can([UserRole.ADMIN]) || can([UserRole.SECRETARY, UserRole.USER])"
        >
          <template #title>
            <ApartmentOutlined />
            <span> Esquema </span>
          </template>
          <a-menu-item key="district" v-if="can([UserRole.ADMIN])">
            <ShareAltOutlined />
            <span>
              <router-link to="/district">Distritos</router-link>
            </span>
          </a-menu-item>
          <a-menu-item key="church" v-if="can([UserRole.ADMIN])">
            <HomeOutlined />
            <span>
              <router-link to="/church">Iglesias</router-link>
            </span>
          </a-menu-item>
          <a-menu-item key="member" v-if="can([UserRole.SECRETARY, UserRole.USER])">
            <ContactsOutlined />
            <span>
              <router-link to="/member">Miembros</router-link>
            </span>
          </a-menu-item>
        </a-sub-menu>
        <a-menu-item key="users" v-if="can([UserRole.ADMIN])">
          <TeamOutlined />
          <span>
            <router-link to="/users">Usuarios</router-link>
          </span>
        </a-menu-item>
        <a-menu-item key="visit" v-if="can([UserRole.USER])">
          <CalendarOutlined />
          <span>
            <router-link to="/visit">Visitas</router-link>
          </span>
        </a-menu-item>
        <a-menu-item key="register" @click="logout">
          <LogoutOutlined />
          <span>Cerrar sesión</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <a-layout class="prueba-mundo" :style="layoutStyle">
      <a-layout-header :style="headerStyle">
        <a-typography-title
          :level="2"
          style="margin: 0px !important; display: flex; align-items: center; color: #1677ff"
          >{{ title }}</a-typography-title
        >
      </a-layout-header>

      <a-layout-content
        style="margin-top: 64px; padding: 16px; overflow-y: auto; height: calc(100vh - 64px - 70px)"
      >
        <div :style="{ padding: isMobile ? '8px' : '16px' }">
          <router-view />
        </div>
      </a-layout-content>

      <a-layout-footer style="text-align: center; height: 70px">
        © 2026 Control de visitas
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
