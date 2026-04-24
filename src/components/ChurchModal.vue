<script setup lang="ts">
import { ref, watch, computed, onMounted, type PropType } from 'vue'
import { message } from 'ant-design-vue'
import { createChurch, updateChurch } from '@/services/church.service'
import { getDistricts } from '@/services/district.service'
import type { Church } from '@/types/church'
import type { District } from '@/types/district'

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  church: {
    type: Object as PropType<Church | null>,
    default: null,
  },
})

const emit = defineEmits(['close', 'success'])

const isEdit = computed(() => !!props.church)

const loading = ref(false)
const districts = ref<District[]>([])

const form = ref({
  name: '',
  districtId: '',
})

// se carga la lista de distritos
onMounted(async () => {
  districts.value = await getDistricts()
})

// se carga la iglesia a editar
watch(
  () => props.church,
  (val) => {
    if (val) {
      form.value = {
        name: val.name,
        districtId: val.districtId,
      }
    }
  },
  { immediate: true },
)

// se pone en blanco el formulario
watch(
  () => props.open,
  (val) => {
    if (val && !props.church) {
      form.value = {
        name: '',
        districtId: '',
      }
    }
  },
)

const handleSubmit = async () => {
  try {
    loading.value = true

    if (isEdit.value && props.church) {
      await updateChurch(props.church.id, form.value as Church)
      message.success('Iglesia actualizada')
    } else {
      await createChurch(form.value as Church)
      message.success('Iglesia creada')
    }

    emit('success')
    emit('close')
  } catch (e) {
    message.error(e instanceof Error ? e.message : 'Error de carga')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <a-modal
    :open="open"
    :title="isEdit ? 'Editar Iglesia' : 'Crear Iglesia'"
    @cancel="$emit('close')"
    @ok="handleSubmit"
    :confirm-loading="loading"
  >
    <a-form layout="vertical">
      <a-form-item label="Nombre">
        <a-input v-model:value="form.name" />
      </a-form-item>

      <a-form-item label="Distrito">
        <a-select
          v-model:value="form.districtId"
          :options="
            districts.map((d) => ({
              label: d.name,
              value: d.id,
            }))
          "
          placeholder="Seleccione distrito"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
