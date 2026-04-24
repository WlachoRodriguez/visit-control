<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import VisitModal from '@/components/VisitModal.vue'
import { getVisits, deleteVisit } from '@/services/visit.service'
import type { Visit } from '@/types/visit'
import { formatDate } from '@/utils/date'

const visits = ref<Visit[]>([])
const loading = ref(false)

const openModal = ref(false)
const selectedVisit = ref<Visit | null>(null)

const columns = [
  { title: 'Fecha', dataIndex: 'date', key: 'date' },
  { title: 'Miembros', dataIndex: 'members', key: 'members' },
  { title: 'Pastor', dataIndex: 'user', key: 'userId' },
  { title: '', key: 'actions' },
]

const refreshVisits = async () => {
  try {
    loading.value = true
    visits.value = await getVisits()
  } catch (e) {
    message.error(e instanceof Error ? e.message : 'Error al cargar las visitas')
  } finally {
    loading.value = false
  }
}

onMounted(refreshVisits)

const openCreate = () => {
  selectedVisit.value = null
  openModal.value = true
}

const openEdit = (record: Visit) => {
  selectedVisit.value = record
  openModal.value = true
}

const handleDelete = async (id: string) => {
  try {
    await deleteVisit(id)
    message.success('Visita eliminada')
    await refreshVisits()
  } catch (e) {
    message.error(e instanceof Error ? e.message : 'Error al eliminar la visita')
  }
}
</script>

<template>
  <a-card>
    <a-button type="primary" @click="openCreate" style="margin-bottom: 16px">
      Crear Visita
    </a-button>

    <a-table :columns="columns" :data-source="visits" :loading="loading" rowKey="id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'date'">
          {{ formatDate(record.date) }}
        </template>
        <template v-else-if="column.key === 'members'">
          <span v-if="record.members?.length">
            {{ record.members.map((m) => m.name).join(', ') }}
          </span>
          <span v-else>{{ record }}</span>
        </template>
        <template v-else-if="column.key === 'userId'">
          <span v-if="record.user">
            {{ record.user.name }}
          </span>
          <span v-else>{{ record }}</span>
        </template>
        <template v-else-if="column.key === 'actions'">
          <a-button type="link" @click="openEdit(record)">
            <EditOutlined />
          </a-button>

          <a-popconfirm title="¿Eliminar visita?" @confirm="handleDelete(record.id)">
            <a-button type="link" danger>
              <DeleteOutlined />
            </a-button>
          </a-popconfirm>
        </template>
      </template>
    </a-table>
  </a-card>

  <VisitModal
    :open="openModal"
    :visit="selectedVisit"
    @close="openModal = false"
    @success="refreshVisits"
  />
</template>
