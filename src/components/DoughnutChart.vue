<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import type { ChartData } from 'chart.js'

defineProps<{ data: ChartData<'doughnut'> }>()
</script>

<template>
  <Doughnut :data="data" />
</template>
