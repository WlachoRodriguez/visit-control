<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { message } from 'ant-design-vue'

const router = useRouter()
const auth = useAuthStore()

const form = reactive({
  email: '',
  password: '',
})

const onFinish = async () => {
  try {
    await auth.login(form)

    message.success('Login exitoso')

    router.push('/dashboard')
  } catch (err) {
    message.error(err instanceof Error ? err.message : 'Error al iniciar sesión')
  }
}
</script>

<template>
  <a-row justify="center" align="middle" style="height: 100vh">
    <a-col :xs="12" :sm="12" :md="8" :lg="8">
      <a-card title="Inicio de sesión">
        <a-form :model="form" layout="vertical" @finish="onFinish">
          <a-form-item
            label="Email"
            name="email"
            :rules="[
              { required: true, message: 'Email requerido' },
              { type: 'email', message: 'Email inválido' },
            ]"
          >
            <a-input v-model:value="form.email" autocomplete="useremail" />
          </a-form-item>

          <a-form-item
            label="Password"
            name="password"
            :rules="[{ required: true, message: 'Password requerido' }]"
          >
            <a-input-password v-model:value="form.password" autocomplete="password" />
          </a-form-item>

          <a-form-item>
            <a-button type="primary" html-type="submit" block> Ingresar </a-button>
          </a-form-item>
        </a-form>
      </a-card>
    </a-col>
  </a-row>
</template>
