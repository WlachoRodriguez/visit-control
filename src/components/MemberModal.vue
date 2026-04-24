<script setup lang="ts">
import { ref, watch, computed, onMounted, type PropType } from 'vue'
import { message } from 'ant-design-vue'
import { createMember, updateMember } from '@/services/member.service'
import { getChurches } from '@/services/church.service'
import type { Member } from '@/types/member'
import type { Church } from '@/types/church'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  member: {
    type: Object as PropType<Member | null>,
    default: null,
  },
})

const emit = defineEmits(['close', 'success'])

const isEdit = computed(() => !!props.member)

const loading = ref(false)
const churches = ref<Church[]>([])

const form = ref({
  name: '',
  lastName: '',
  phone: '',
  address: '',
  churchId: '',
})

// se carga la lista de iglesias
onMounted(async () => {
  churches.value = await getChurches()
})

// se carga el miembro a editar
watch(
  () => props.member,
  (val) => {
    if (val) {
      form.value = {
        name: val.name,
        lastName: val.lastName,
        phone: val.phone,
        address: val.address,
        churchId: val.churchId,
      }
    }
  },
  { immediate: true },
)

// se pone en blanco el formulario
watch(
  () => props.open,
  (val) => {
    if (val && !props.member) {
      form.value = {
        name: '',
        lastName: '',
        phone: '',
        address: '',
        churchId: '',
      }
    }
  },
)

const handleSubmit = async () => {
  try {
    loading.value = true

    if (isEdit.value && props.member) {
      await updateMember(props.member.id, form.value as Member)
      message.success('Miembro actualizado')
    } else {
      await createMember(form.value as Member)
      message.success('Miembro creado')
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
    :title="isEdit ? 'Editar Miembro' : 'Crear Miembro'"
    @cancel="$emit('close')"
    @ok="handleSubmit"
    :confirm-loading="loading"
  >
    <a-form layout="vertical">
      <a-form-item label="Nombre">
        <a-input v-model:value="form.name" />
      </a-form-item>

      <a-form-item label="Apellido">
        <a-input v-model:value="form.lastName" />
      </a-form-item>

      <a-form-item label="Teléfono">
        <a-input v-model:value="form.phone" />
      </a-form-item>

      <a-form-item label="Dirección">
        <a-input v-model:value="form.address" />
      </a-form-item>

      <a-form-item label="Iglesia">
        <a-select
          v-model:value="form.churchId"
          :options="
            churches.map((c) => ({
              label: c.name,
              value: c.id,
            }))
          "
          placeholder="Seleccione iglesia"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
