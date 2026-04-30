<script setup lang="ts">
import { Line } from 'vue-chartjs'
import type { ChartData } from 'chart.js'

defineProps<{ data: ChartData<'line'> }>()
</script>

<template>
  <Line :data="data" />
</template>
