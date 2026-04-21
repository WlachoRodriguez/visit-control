<script setup lang="ts">
import { ref, watch, computed, onMounted, type PropType } from 'vue'
import { message } from 'ant-design-vue'
import { createUser, updateUser } from '@/services/user.service'
import { getDistricts } from '@/services/district.service'
import { UserRole, type User } from '@/types/user'
import { type District } from '@/types/district'

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  user: {
    type: Object as PropType<User | null>,
    default: null,
  },
})

const emit = defineEmits(['close', 'success'])

const isEdit = computed(() => !!props.user)

const loading = ref(false)

const districts = ref<District[]>([])

type UserForm = {
  id?: string
  name: string
  lastName: string
  email: string
  password?: string
  role: UserRole
  isActive: boolean
  districtId?: string
}

const form = ref<UserForm>({
  id: '',
  name: '',
  lastName: '',
  email: '',
  password: '',
  role: UserRole.USER,
  isActive: true,
  districtId: '',
})

// cargar distritos
onMounted(async () => {
  districts.value = await getDistricts()
})

// cargar usuario a editar
watch(
  () => props.user,
  (val) => {
    if (val) {
      form.value = {
        ...(val as User),
        password: '',
      }
    }
  },
  { immediate: true },
)

// se pone en blanco el formulario
watch(
  () => props.open,
  (val) => {
    if (val && !props.user) {
      form.value = {
        id: '',
        name: '',
        lastName: '',
        email: '',
        password: '',
        role: UserRole.USER,
        isActive: true,
        districtId: '',
      }
    }
  },
)

const handleSubmit = async () => {
  try {
    loading.value = true

    if (isEdit.value && props.user) {
      await updateUser(props.user.id, form.value as User)
      message.success('Usuario actualizado')
    } else {
      await createUser(form.value as User)
      message.success('Usuario creado')
    }

    emit('success')
    emit('close')
  } catch (e) {
    message.error(
      e instanceof Error ? `Error al guardar usuario, ${e.message}` : 'Error al guardar usuario',
    )
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <a-modal
    :open="open"
    :title="isEdit ? 'Editar Usuario' : 'Crear Usuario'"
    @cancel="$emit('close')"
    @ok="handleSubmit"
    :confirm-loading="loading"
  >
    <a-form :model="form" :label-col="{ style: { width: '150px' } }" :wrapper-col="{ span: 14 }">
      <a-form-item label="Nombre">
        <a-input v-model:value="form.name" placeholder="Nombre" />
      </a-form-item>
      <a-form-item label="Apellido">
        <a-input v-model:value="form.lastName" placeholder="Apellido" />
      </a-form-item>
      <a-form-item label="Email">
        <a-input v-model:value="form.email" placeholder="Email" />
      </a-form-item>
      <a-form-item label="Contraseña">
        <a-input-password v-if="!isEdit" v-model:value="form.password" placeholder="Password" />
      </a-form-item>
      <a-form-item label="Rol">
        <a-select v-model:value="form.role">
          <a-select-option value="ADMIN">Admin</a-select-option>
          <a-select-option value="USER">User</a-select-option>
          <a-select-option value="SECRETARY">Secretary</a-select-option>
          <a-select-option value="OFFICE">Office</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="Activo">
        <a-switch :checked="form.isActive" @change="(val: boolean) => (form.isActive = val)" />
      </a-form-item>
      <a-form-item
        v-if="form.isActive && (form.role === UserRole.USER || form.role === UserRole.SECRETARY)"
        label="Distrito"
      >
        <a-select v-model:value="form.districtId" placeholder="Seleccione distrito">
          <a-select-option v-for="d in districts" :key="d.id" :value="d.id">
            {{ d.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
