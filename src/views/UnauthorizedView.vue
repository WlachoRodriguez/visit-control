<script setup lang="ts"></script>

<template>
  <div style="padding: 24px">
    <a-result
      status="403"
      title="Acceso denegado"
      sub-title="No tienes permisos para acceder a esta sección"
    >
      <template #extra>
        <a-button type="primary" @click="$router.push('/dashboard')">
          Volver al Dashboard
        </a-button>
      </template>
    </a-result>
  </div>
</template>
