<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import MemberModal from '@/components/MemberModal.vue'
import { getMembers, deleteMember } from '@/services/member.service'
import type { Member } from '@/types/member'

const members = ref<Member[]>([])
const loading = ref(false)

const openModal = ref(false)
const selectedMember = ref<Member | null>(null)

const columns = [
  { title: 'Nombre', dataIndex: 'name', key: 'name' },
  { title: 'Teléfono', dataIndex: 'phone' },
  { title: 'Dirección', dataIndex: 'address', responsive: ['lg'] },
  { title: 'Iglesia', dataIndex: 'churchId', key: 'churchId', responsive: ['md'] },
  { title: '', key: 'actions' },
]

const refreshMembers = async () => {
  try {
    loading.value = true
    members.value = await getMembers()
  } catch (e) {
    message.error(e instanceof Error ? e.message : 'Error al cargar los miembros')
  } finally {
    loading.value = false
  }
}

onMounted(refreshMembers)

const openCreate = () => {
  selectedMember.value = null
  openModal.value = true
}

const openEdit = (record: Member) => {
  selectedMember.value = record
  openModal.value = true
}

const handleDelete = async (id: string) => {
  try {
    await deleteMember(id)
    message.success('Miembro eliminado')
    await refreshMembers()
  } catch (e) {
    message.error(e instanceof Error ? e.message : 'Error al eliminar el miembro')
  }
}
</script>

<template>
  <a-card>
    <a-button type="primary" @click="openCreate" style="margin-bottom: 16px">
      Crear Miembro
    </a-button>

    <a-table :columns="columns" :data-source="members" :loading="loading" rowKey="id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'"> {{ record.name }} {{ record.lastName }} </template>
        <template v-else-if="column.key === 'churchId'">
          {{ record.church?.name || 'Sin iglesia' }}
        </template>
        <template v-else-if="column.key === 'actions'">
          <a-button type="link" @click="openEdit(record)"> <EditOutlined /></a-button>

          <a-popconfirm title="¿Eliminar miembro?" @confirm="handleDelete(record.id)">
            <a-button type="link" danger> <DeleteOutlined /></a-button>
          </a-popconfirm>
        </template>
      </template>
    </a-table>
  </a-card>

  <MemberModal
    :open="openModal"
    :member="selectedMember"
    @close="openModal = false"
    @success="refreshMembers"
  />
</template>
