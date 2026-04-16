<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { DesktopOutlined, TeamOutlined, LogoutOutlined } from '@ant-design/icons-vue'
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

      <a-menu theme="dark" mode="inline" :selectedKeys="[{ selectedKey }]">
        <a-menu-item key="dashboard">
          <DesktopOutlined />
          <span>
            <router-link to="/dashboard">Dashboard</router-link>
          </span>
        </a-menu-item>
        <a-menu-item key="users">
          <TeamOutlined />
          <span>
            <router-link to="/users">Usuarios</router-link>
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
        <div>{{ title }}</div>
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
