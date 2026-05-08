<script setup lang="ts">
import { Form, message } from 'ant-design-vue'
import { computed, reactive, ref } from 'vue'
import { changePassword } from '@/services/user.service'

const rules = reactive({
  currentPassword: [
    {
      required: true,
      message: 'Campo requerido',
    },
    {
      min: 6,
      message: 'Se necesita un minimo de 6 caracteres',
    },
  ],
  newPassword: [
    {
      required: true,
      message: 'Campo requerido',
    },
    {
      min: 6,
      message: 'Se necesita un minimo de 6 caracteres',
    },
  ],
  confirmPassword: [
    {
      required: true,
      message: 'Campo requerido',
    },
    {
      min: 6,
      message: 'Se necesita un minimo de 6 caracteres',
    },
  ],
})

type ChangePasswordForm = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const form = ref<ChangePasswordForm>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const { validateInfos, validate } = Form.useForm(form, rules)

const isFormValid = computed(() => {
  const isFormFilledNotNull =
    form.value.currentPassword !== '' &&
    form.value.newPassword !== '' &&
    form.value.confirmPassword !== ''

  return (
    isFormFilledNotNull &&
    Object.keys(validateInfos).every(
      (key) =>
        !validateInfos[key]?.validateStatus || validateInfos[key]?.validateStatus === 'success',
    )
  )
})

const onSubmit = () => {
  validate()
    .then(async () => {
      await changePassword(
        form.value.currentPassword,
        form.value.newPassword,
        form.value.confirmPassword,
      )
      message.success('Contraseña actualizada')
    })
    .catch((error) => {
      message.error(error instanceof Error ? error.message : 'Error al actualizar contraseña')
      console.log('Error de validación:', error)
    })
}
</script>

<template>
  <a-card>
    <a-form :model="form" layout="vertical">
      <a-form-item
        label="Contraseña actual"
        name="currentPassword"
        :rules="[
          {
            required: true,
            message: 'Campo requerido',
          },
          {
            min: 6,
            message: 'Se necesita un minimo de 6 caracteres',
          },
        ]"
      >
        <a-input-password
          v-model:value="form.currentPassword"
          placeholder="Ingrese su contraseña actual"
          autocomplete="current-password"
        />
      </a-form-item>

      <a-form-item
        label="Nueva contraseña"
        name="newPassword"
        :rules="[
          {
            required: true,
            message: 'Campo requerido',
          },
          {
            min: 6,
            message: 'Se necesita un minimo de 6 caracteres',
          },
        ]"
      >
        <a-input-password
          :status="form.newPassword !== form.confirmPassword ? 'error' : undefined"
          v-model:value="form.newPassword"
          placeholder="Ingrese la nueva contraseña"
          autocomplete="new-password"
        />
      </a-form-item>

      <a-form-item
        label="Confirmar nueva contraseña"
        name="confirmPassword"
        :rules="[
          {
            required: true,
            message: 'Campo requerido',
          },
          {
            min: 6,
            message: 'Se necesita un minimo de 6 caracteres',
          },
        ]"
      >
        <a-input-password
          :status="form.newPassword !== form.confirmPassword ? 'error' : undefined"
          v-model:value="form.confirmPassword"
          placeholder="Confirme la nueva contraseña"
          autocomplete="confirm-password"
        />
      </a-form-item>

      <a-form-item>
        <div style="display: flex; justify-content: space-between; gap: 10px">
          <a-button type="primary" block :disabled="!isFormValid" @click="onSubmit">
            Realizar cambios
          </a-button>
        </div>
      </a-form-item>
    </a-form>
  </a-card>
</template>
