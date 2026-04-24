<script setup lang="ts">
import { ref, watch, computed, type PropType } from 'vue'
import { message } from 'ant-design-vue'
import { createDistrict, updateDistrict } from '@/services/district.service'
import type { District } from '@/types/district'

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  district: {
    type: Object as PropType<District | null>,
    default: null,
  },
})

const emit = defineEmits(['close', 'success'])

const isEdit = computed(() => !!props.district)

const loading = ref(false)

const form = ref({
  name: '',
})

// se carga distrito a editar
watch(
  () => props.district,
  (val) => {
    if (val) {
      form.value.name = val.name
    }
  },
  { immediate: true },
)

// se pone en blanco el formulario
watch(
  () => props.open,
  (val) => {
    if (val && !props.district) {
      form.value.name = ''
    }
  },
)

const handleSubmit = async () => {
  try {
    loading.value = true

    if (isEdit.value && props.district) {
      await updateDistrict(props.district.id, form.value)
      message.success('Distrito actualizado')
    } else {
      await createDistrict(form.value)
      message.success('Distrito creado')
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
    :title="isEdit ? 'Editar Distrito' : 'Crear Distrito'"
    @cancel="$emit('close')"
    @ok="handleSubmit"
    :confirm-loading="loading"
  >
    <a-form layout="vertical">
      <a-form-item label="Nombre">
        <a-input v-model:value="form.name" placeholder="Nombre del distrito" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
