<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import type { ChartData } from 'chart.js'

defineProps<{ data: ChartData<'bar'> }>()
</script>

<template>
  <Bar :data="data" />
</template>
