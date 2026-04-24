<script setup lang="ts">
import { ref, watch, computed, onMounted, type PropType } from 'vue'
import { message } from 'ant-design-vue'
import { useAuthStore } from '@/stores/auth'
import { createVisit, updateVisit } from '@/services/visit.service'
import { getMembers } from '@/services/member.service'
import type { Visit } from '@/types/visit'
import type { Member } from '@/types/member'

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  visit: {
    type: Object as PropType<Visit | null>,
    default: null,
  },
})

const auth = useAuthStore()
const emit = defineEmits(['close', 'success'])

const isEdit = computed(() => !!props.visit)

const loading = ref(false)
const members = ref<Member[]>([])

const form = ref({
  date: '',
  type: '',
  schedule: 'MORNING',
  comments: '',
  members: [] as string[],
})

// se carga la lista de miembros
onMounted(async () => {
  members.value = await getMembers()
})

// se carga la visita a editar
watch(
  () => props.visit,
  (val) => {
    if (val) {
      form.value = {
        date: val.date,
        type: val.type,
        schedule: val.schedule,
        comments: val.comments || '',
        members: val.members?.map((m) => m.id) || [],
      }
    }
  },
  { immediate: true },
)

// se pone en blanco el formulario
watch(
  () => props.open,
  (val) => {
    if (val && !props.visit) {
      form.value = {
        date: '',
        type: '',
        schedule: 'MORNING',
        comments: '',
        userId: '',
        members: [],
      }
    }
  },
)

const handleSubmit = async () => {
  try {
    loading.value = true
    const data = {
      ...form.value,
      userId: auth.user?.id,
    } as Visit

    if (isEdit.value && props.visit) {
      await updateVisit(props.visit.id, data)
      message.success('Visita actualizada')
    } else {
      await createVisit(data)
      message.success('Visita creada')
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
    :title="isEdit ? 'Editar Visita' : 'Crear Visita'"
    @cancel="$emit('close')"
    @ok="handleSubmit"
    :confirm-loading="loading"
  >
    <a-form layout="vertical">
      <a-form-item label="Fecha">
        <a-input type="date" v-model:value="form.date" />
      </a-form-item>

      <a-form-item label="Tipo">
        <a-input v-model:value="form.type" />
      </a-form-item>

      <a-form-item label="Horario">
        <a-select v-model:value="form.schedule">
          <a-select-option value="MORNING">Mañana</a-select-option>
          <a-select-option value="AFTERNOON">Tarde</a-select-option>
          <a-select-option value="NIGHT">Noche</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="Miembros">
        <a-select
          mode="multiple"
          v-model:value="form.members"
          :options="
            members.map((m) => ({
              label: m.name + ' ' + m.lastName,
              value: m.id,
            }))
          "
          placeholder="Seleccione miembros"
        />
      </a-form-item>

      <a-form-item label="Comentarios">
        <a-input v-model:value="form.comments" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
