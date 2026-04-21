<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import UserModal from '@/components/UserModal.vue'
import { getUsers, deleteUser } from '@/services/user.service'

const users = ref([])
const loading = ref(false)
const isMobile = ref(false)

const page = ref(1)
const limit = ref(10)
const total = ref(0)

const openModal = ref(false)
const selectedUser = ref(null)

const columns = [
  { title: 'Nombre', dataIndex: 'name' },
  { title: 'Apellido', dataIndex: 'lastName', responsive: ['md'] },
  { title: 'Email', dataIndex: 'email', responsive: ['lg'] },
  { title: 'Rol', dataIndex: 'role' },
  { title: 'Acciones', key: 'actions' },
]

const refreshUsers = async () => {
  loading.value = true

  try {
    const res = await getUsers(page.value, limit.value)

    users.value = res.data
    total.value = res.meta.total
  } catch (err) {
    message.error(err instanceof Error ? err.message : 'Error al cargar usuarios')
  }

  loading.value = false
}

const handlePageChange = (p: number) => {
  page.value = p
  refreshUsers()
}

const openCreate = () => {
  selectedUser.value = null
  openModal.value = true
}

const openEdit = (user: null) => {
  selectedUser.value = user
  openModal.value = true
}

const handleDelete = async (id: string) => {
  try {
    await deleteUser(id)
    message.success('Usuario eliminado')

    await refreshUsers()
  } catch (e) {
    message.error(e instanceof Error ? e.message : 'Error al eliminar usuario')
  }
}

onMounted(() => {
  refreshUsers()
  const check = () => {
    isMobile.value = window.innerWidth < 768
  }

  check()
  window.addEventListener('resize', check)
})
</script>

<template>
  <a-card>
    <a-button type="primary" @click="openCreate" style="margin-bottom: 16px" :block="isMobile">
      Crear usuario
    </a-button>

    <a-table
      :columns="columns"
      :data-source="users"
      :loading="loading"
      :pagination="false"
      rowKey="id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'actions'">
          <a-button type="link" @click="openEdit(record)">
            <EditOutlined />
          </a-button>

          <a-popconfirm
            title="¿Eliminar usuario?"
            ok-text="Sí"
            cancel-text="No"
            @confirm="handleDelete(record.id)"
          >
            <a-button type="link" danger> <DeleteOutlined /> </a-button>
          </a-popconfirm>
        </template>
      </template>
    </a-table>
    <a-pagination
      :current="page"
      :pageSize="limit"
      :total="total"
      @change="handlePageChange"
      style="margin-top: 16px"
    />

    <UserModal
      :open="openModal"
      :user="selectedUser"
      @close="openModal = false"
      @success="refreshUsers"
    />
  </a-card>
</template>
