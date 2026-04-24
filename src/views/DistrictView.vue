<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import DistrictModal from '@/components/DistrictModal.vue'
import { getDistricts, deleteDistrict } from '@/services/district.service'
import type { District } from '@/types/district'

const districts = ref<District[]>([])
const loading = ref(false)

const openModal = ref(false)
const selectedDistrict = ref<District | null>(null)

const refreshDistricts = async () => {
  try {
    loading.value = true
    districts.value = await getDistricts()
  } catch (e) {
    message.error(e instanceof Error ? e.message : 'Error al cargar los distritos')
  } finally {
    loading.value = false
  }
}

onMounted(refreshDistricts)

const openCreate = () => {
  selectedDistrict.value = null
  openModal.value = true
}

const openEdit = (record: District) => {
  selectedDistrict.value = record
  openModal.value = true
}

const handleDelete = async (id: string) => {
  try {
    await deleteDistrict(id)
    message.success('Distrito eliminado')
    await refreshDistricts()
  } catch (e) {
    message.error(e instanceof Error ? e.message : 'Error al eliminar el distrito')
  }
}
</script>

<template>
  <a-card>
    <a-button type="primary" @click="openCreate" style="margin-bottom: 16px">
      Crear Distrito
    </a-button>

    <a-table :data-source="districts" :loading="loading" rowKey="id">
      <a-table-column title="Nombre" dataIndex="name" key="name" />

      <a-table-column title="Acciones" key="actions">
        <template #default="{ record }">
          <a-button type="link" @click="openEdit(record)">
            <EditOutlined />
          </a-button>

          <a-popconfirm
            title="¿Eliminar distrito?"
            ok-text="Sí"
            cancel-text="No"
            @confirm="handleDelete(record.id)"
          >
            <a-button type="link" danger>
              <DeleteOutlined />
            </a-button>
          </a-popconfirm>
        </template>
      </a-table-column>
    </a-table>
  </a-card>

  <DistrictModal
    :open="openModal"
    :district="selectedDistrict"
    @close="openModal = false"
    @success="refreshDistricts"
  />
</template>
