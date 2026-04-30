<script setup lang="ts">
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import { computed } from 'vue'
import { SmileOutlined, FrownOutlined } from '@ant-design/icons-vue'
import { getDashboard } from '@/services/dashboard.service'
import { getUsers } from '@/services/user.service'
import { useAuthStore } from '@/stores/auth'
import { UserRole, type User } from '@/types/user'
import { buildBarData, buildLineData, buildDoughnutData } from '@/utils/chart'

import BarChart from '@/components/BarChart.vue'
import LineChart from '@/components/LineChart.vue'
import DoughnutChart from '@/components/DoughnutChart.vue'

const auth = useAuthStore()
const isAdmin = auth.user?.role === UserRole.ADMIN

const startDate = ref()
const endDate = ref()
const userId = ref()
const users = ref<User[]>([])
const maxVisitUser = ref('')
const minVisitUser = ref('')
const avgVisitUser = ref(0)
const maxChurchVisits = ref('')

const barData = ref()
const lineData = ref()
const doughnutData = ref()

const rangeDate = computed({
  get() {
    if (!startDate.value || !endDate.value) return null

    return [dayjs(startDate.value), dayjs(endDate.value)]
  },
  set(value) {
    if (!value) return

    const [start, end] = value
    startDate.value = start?.startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZ')
    endDate.value = end?.endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZ')

    loadDashboard()
  },
})

const topsAdmin = () => {
  const data = barData.value.datasets[0].data
  const maxBar = Math.max(...data)
  const minBar = Math.min(...data)
  const indexMaxBar = data
    .map((value: number, index: number) => (value === maxBar ? index : -1))
    .filter((index: number) => index !== -1)
  const indexMinBar = data
    .map((value: number, index: number) => (value === minBar ? index : -1))
    .filter((index: number) => index !== -1)
  maxVisitUser.value = ''
  minVisitUser.value = ''
  if (indexMaxBar.length > 1) {
    indexMaxBar.forEach((index: number) => {
      maxVisitUser.value = `${maxVisitUser.value} ${barData.value.labels[index]},`
    })
  } else if (indexMaxBar.length > 0) {
    maxVisitUser.value = barData.value.labels[indexMaxBar[0]]
  }
  if (indexMinBar.length > 1) {
    indexMinBar.forEach((index: number) => {
      minVisitUser.value = `${minVisitUser.value} ${barData.value.labels[index]},`
    })
  } else if (indexMinBar.length > 0) {
    minVisitUser.value = barData.value.labels[indexMinBar[0]]
  }
}

const topsGeneral = () => {
  const data = lineData.value.datasets[0].data
  avgVisitUser.value =
    data.reduce((acumulador: number, valorActual: number) => acumulador + valorActual, 0) /
    data.length

  maxChurchVisits.value =
    doughnutData.value.labels[
      doughnutData.value.datasets[0].data.indexOf(
        Math.max(...(doughnutData.value.datasets[0].data as number[])),
      )
    ]
}

const loadDashboard = async () => {
  const data = await getDashboard({
    startDate: startDate.value,
    endDate: endDate.value,
    userId: userId.value || undefined,
  })

  if (isAdmin && data.visitsByUser) {
    barData.value = buildBarData(data.visitsByUser)
  }

  lineData.value = buildLineData(data.visitsByMonth)
  doughnutData.value = buildDoughnutData(data.visitsByChurch)
  if (isAdmin) topsAdmin()
  topsGeneral()
}

const centerTextPlugin = {
  id: 'centerText',
  beforeDraw(chart: {
    data: {
      datasets: {
        data: number[]
      }[]
    }
    ctx: CanvasRenderingContext2D
    width: number
    height: number
  }) {
    const { ctx, width, height } = chart

    const data = chart.data.datasets[0]?.data
    const total = data?.reduce((a: number, b: number) => a + b, 0)

    ctx.save()

    ctx.font = 'bold 40px sans-serif'
    ctx.textAlign = 'center'

    ctx.fillText(String(total ?? ''), width / 2 - 60, height / 2 + 30)

    ctx.restore()
  },
}

onMounted(async () => {
  const end = dayjs()
  const start = dayjs().subtract(3, 'month')

  startDate.value = start.format('YYYY-MM-DD') + 'T00:00:00.000Z'
  endDate.value = end.format('YYYY-MM-DD') + 'T23:59:59.999Z'
  if (isAdmin) {
    users.value = (await getUsers(1, 50)).data
      .filter((u: { role: UserRole }) => u.role === UserRole.USER)
      .map((u: { id: string; name: string; lastName: string }) => ({
        id: u.id,
        name: u.name,
        lastName: u.lastName,
      }))
    userId.value = users.value[0]?.id || ''
  } else {
    userId.value = auth.user?.id || ''
  }
  loadDashboard()
})
</script>

<template>
  <div>
    <div
      :style="{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: '20px',
      }"
    >
      <a-range-picker v-model:value="rangeDate" />
    </div>
    <a-row v-if="isAdmin && barData" :gutter="[16, 16]" :style="{ marginBottom: '10px' }">
      <a-col :xs="24" :sm="12" :md="12" :lg="12">
        <a-card>
          <a-statistic
            title="Pastor con más visitas"
            :value="maxVisitUser"
            :value-style="{ color: '#3f8600' }"
          >
            <template #prefix>
              <SmileOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="12" :lg="12">
        <a-card>
          <a-statistic
            title="Pastor con menos visitas"
            :value="minVisitUser"
            :value-style="{ color: '#cf1322' }"
          >
            <template #prefix>
              <FrownOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="[16, 16]" :style="{ marginBottom: '10px' }">
      <a-col :xs="24" :md="24" :lg="24">
        <div v-if="isAdmin && barData" :style="{ height: '300px' }">
          <BarChart
            :data="barData"
            :options="{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Visitas totales por usuario en el período de tiempo',
                },
              },
            }"
            :style="{ width: '100%' }"
          />
        </div>
      </a-col>
    </a-row>
    <div
      v-if="isAdmin"
      :style="{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: '20px',
      }"
    >
      <a-select
        v-model:value="userId"
        :options="
          users.map((u: { id: string; name: string; lastName: string }) => ({
            label: `${u.name} ${u.lastName}`,
            value: u.id,
          }))
        "
        placeholder="Seleccione el pastor"
        @change="loadDashboard"
        :style="{ width: '200px' }"
      />
    </div>
    <a-row v-if="lineData && doughnutData" :gutter="[16, 16]" :style="{ marginBottom: '10px' }">
      <a-col :xs="24" :sm="12" :md="12" :lg="12">
        <a-card>
          <a-statistic
            title="Promedio de visita por mes"
            :value="avgVisitUser"
            :value-style="{ color: '#ff8000' }"
          >
            <template #prefix>
              <SmileOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="12" :lg="12">
        <a-card>
          <a-statistic
            title="Iglesia con más visitas"
            :value="maxChurchVisits"
            :value-style="{ color: '#3f8600' }"
          >
            <template #prefix>
              <SmileOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="[16, 16]" :style="{ marginTop: '10px' }">
      <a-col :xs="24" :md="12" :lg="12">
        <div v-if="lineData" :style="{ maxHeight: '400px' }">
          <LineChart
            :data="lineData"
            :options="{
              responsive: true,
              maintainAspectRatio: false,

              elements: {
                point: {
                  radius: 4,
                  hoverRadius: 6,
                  borderWidth: 2,
                },
                line: {
                  tension: 0,
                },
              },
              plugins: {
                legend: { display: false },
                title: {
                  display: true,
                  text: 'Visitas totales por mes en el período de tiempo',
                },
                tooltip: {
                  mode: 'index',
                  intersect: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
                x: {
                  grid: { display: false },
                },
              },
            }"
            :style="{ width: '100%', aspectRatio: 1 / 1 }"
          />
        </div>
      </a-col>
      <a-col :xs="24" :md="12" :lg="12">
        <div v-if="doughnutData" :style="{ maxHeight: '400px' }">
          <DoughnutChart
            :data="doughnutData"
            :options="{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: 'right',
                },
                title: {
                  display: true,
                  text: 'Cantidad de miembros visitados por iglesia en el período de tiempo',
                },
              },
            }"
            :plugins="[centerTextPlugin]"
            :style="{ width: '100%', aspectRatio: 1 / 1 }"
          />
        </div>
      </a-col>
    </a-row>
  </div>
</template>
