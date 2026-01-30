<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h3 class="card-title">各家电占比</h3>
        <div class="h-64 flex justify-center items-center">
          <Pie
            v-if="appliances.length > 0"
            :data="pieData"
            :options="chartOptions"
          />
          <div v-else class="text-center text-gray-400">
            暂无数据
          </div>
        </div>
      </div>
    </div>
    
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h3 class="card-title">耗电量对比 (kWh)</h3>
        <div class="h-64 flex justify-center items-center">
          <Bar
            v-if="appliances.length > 0"
            :data="barData"
            :options="chartOptions"
          />
          <div v-else class="text-center text-gray-400">
            暂无数据
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Pie, Bar } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import type { Appliance } from '@/types'

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const props = defineProps<{
  appliances: Appliance[]
}>()

const colors = [
  'rgba(59, 130, 246, 0.8)',
  'rgba(16, 185, 129, 0.8)',
  'rgba(245, 158, 11, 0.8)',
  'rgba(239, 68, 68, 0.8)',
  'rgba(139, 92, 246, 0.8)',
  'rgba(236, 72, 153, 0.8)',
  'rgba(14, 165, 233, 0.8)',
  'rgba(168, 162, 158, 0.8)'
]

const pieData = computed(() => ({
  labels: props.appliances.map(a => a.name),
  datasets: [{
    data: props.appliances.map(a => a.kWh),
    backgroundColor: props.appliances.map((_, i) => colors[i % colors.length]),
    borderWidth: 0
  }]
}))

const barData = computed(() => ({
  labels: props.appliances.map(a => a.name),
  datasets: [{
    label: '耗电量 (kWh)',
    data: props.appliances.map(a => a.kWh),
    backgroundColor: props.appliances.map((_, i) => colors[i % colors.length]),
    borderWidth: 0
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const
    }
  }
}
</script>
