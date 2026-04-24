<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import ChurchModal from '@/components/ChurchModal.vue'
import { getChurches, deleteChurch } from '@/services/church.service'
import type { Church } from '@/types/church'

const churches = ref<Church[]>([])
const loading = ref(false)

const openModal = ref(false)
const selectedChurch = ref<Church | null>(null)

const refreshChurches = async () => {
  try {
    loading.value = true
    churches.value = await getChurches()
  } catch (e) {
    message.error(e instanceof Error ? e.message : 'Error al cargar las iglesias')
  } finally {
    loading.value = false
  }
}

onMounted(refreshChurches)

const openCreate = () => {
  selectedChurch.value = null
  openModal.value = true
}

const openEdit = (record: Church) => {
  selectedChurch.value = record
  openModal.value = true
}

const handleDelete = async (id: string) => {
  try {
    await deleteChurch(id)
    message.success('Iglesia eliminada')
    await refreshChurches()
  } catch (e) {
    message.error(e instanceof Error ? e.message : 'Error al eliminar la iglesia')
  }
}
</script>

<template>
  <a-card>
    <a-button type="primary" @click="openCreate" style="margin-bottom: 16px">
      Crear Iglesia
    </a-button>

    <a-table :data-source="churches" :loading="loading" rowKey="id">
      <a-table-column title="Nombre" dataIndex="name" />

      <a-table-column title="Distrito">
        <template #default="{ record }">
          {{ record.district?.name }}
        </template>
      </a-table-column>

      <a-table-column title="Acciones">
        <template #default="{ record }">
          <a-button type="link" @click="openEdit(record)">
            <EditOutlined />
          </a-button>

          <a-popconfirm title="¿Eliminar iglesia?" @confirm="handleDelete(record.id)">
            <a-button type="link" danger>
              <DeleteOutlined />
            </a-button>
          </a-popconfirm>
        </template>
      </a-table-column>
    </a-table>
  </a-card>

  <ChurchModal
    :open="openModal"
    :church="selectedChurch"
    @close="openModal = false"
    @success="refreshChurches"
  />
</template>
