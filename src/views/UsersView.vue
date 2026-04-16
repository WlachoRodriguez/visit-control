<script setup>
import { ref, reactive, onMounted } from 'vue'
import { apiFetch } from '../api/api'
import { message } from 'ant-design-vue'

const users = ref([])
const loading = ref(false)
const isMobile = ref(false)

const page = ref(1)
const limit = ref(10)
const total = ref(0)

const open = ref(false)

const form = reactive({
  name: '',
  lastName: '',
  email: '',
  password: '',
})

// const columns = [
//   { title: 'Nombre', dataIndex: 'name' },
//   { title: 'Apellido', dataIndex: 'lastName' },
//   { title: 'Email', dataIndex: 'email' },
//   { title: 'Rol', dataIndex: 'role' },
// ]

const columns = [
  { title: 'Nombre', dataIndex: 'name' },
  { title: 'Apellido', dataIndex: 'lastName', responsive: ['md'] },
  { title: 'Email', dataIndex: 'email', responsive: ['lg'] },
  { title: 'Rol', dataIndex: 'role' },
]

const fetchUsers = async () => {
  loading.value = true

  try {
    const res = await apiFetch(`/users?page=${page.value}&limit=${limit.value}`)

    users.value = res.data
    total.value = res.meta.total
  } catch (err) {
    message.error(err.message)
  }

  loading.value = false
}

const handlePageChange = (p) => {
  page.value = p
  fetchUsers()
}

const openModal = () => {
  open.value = true
}

const createUser = async () => {
  try {
    await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(form),
    })

    message.success('Usuario creado 🚀')

    open.value = false
    fetchUsers()
  } catch (err) {
    message.error(err.message)
  }
}

onMounted(() => {
  fetchUsers()
  const check = () => {
    isMobile.value = window.innerWidth < 768
  }

  check()
  window.addEventListener('resize', check)
})
</script>

<template>
  <a-card>
    <!-- BOTÓN -->
    <a-button type="primary" @click="openModal" style="margin-bottom: 16px" :block="isMobile">
      Crear usuario
    </a-button>

    <!-- TABLA -->
    <a-table
      :columns="columns"
      :data-source="users"
      :loading="loading"
      :pagination="false"
      rowKey="id"
    />

    <!-- PAGINACIÓN -->
    <a-pagination
      :current="page"
      :pageSize="limit"
      :total="total"
      @change="handlePageChange"
      style="margin-top: 16px"
    />

    <!-- MODAL -->
    <a-modal
      v-model:open="open"
      title="Crear usuario"
      @ok="createUser"
      :width="isMobile ? '100%' : 500"
    >
      <a-form layout="vertical">
        <a-form-item label="Nombre">
          <a-input v-model:value="form.name" />
        </a-form-item>

        <a-form-item label="Apellido">
          <a-input v-model:value="form.lastName" />
        </a-form-item>

        <a-form-item label="Email">
          <a-input v-model:value="form.email" />
        </a-form-item>

        <a-form-item label="Password">
          <a-input-password v-model:value="form.password" />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>
