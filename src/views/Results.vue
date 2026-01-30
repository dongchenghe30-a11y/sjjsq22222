<template>
  <div class="max-w-6xl mx-auto">
    <Breadcrumb />
    
    <h1 class="text-3xl font-bold mb-6">批量汇总</h1>
    
    <!-- 总计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div class="stat bg-base-100 shadow-lg rounded-box">
        <div class="stat-figure text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div class="stat-title">总耗电量</div>
        <div class="stat-value text-primary">{{ totals.kWh.toFixed(2) }}</div>
        <div class="stat-desc">kWh（度）</div>
      </div>
      
      <div class="stat bg-base-100 shadow-lg rounded-box">
        <div class="stat-figure text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="stat-title">总电费</div>
        <div class="stat-value text-secondary">${{ totals.cost.toFixed(2) }}</div>
        <div class="stat-desc">USD</div>
      </div>
      
      <div class="stat bg-base-100 shadow-lg rounded-box">
        <div class="stat-figure text-error">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
          </svg>
        </div>
        <div class="stat-title">总碳排放</div>
        <div class="stat-value text-error">{{ totals.co2.toFixed(2) }}</div>
        <div class="stat-desc">kg CO₂</div>
      </div>
    </div>
    
    <!-- 图表区 -->
    <div v-if="appliances.length > 0" class="mb-8">
      <ChartDisplay :appliances="appliances" />
    </div>
    
    <!-- 家电列表 -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="flex justify-between items-center mb-4">
          <h2 class="card-title">家电列表 ({{ appliances.length }})</h2>
          <button class="btn btn-sm btn-error" @click="confirmClear" v-if="appliances.length > 0">
            清空所有
          </button>
        </div>
        
        <div v-if="appliances.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">📭</div>
          <h3 class="text-xl font-semibold mb-2">暂无数据</h3>
          <p class="text-base-content/70 mb-4">
            添加家电以查看汇总统计
          </p>
          <div class="flex flex-wrap justify-center gap-2">
            <router-link to="/phone" class="btn btn-primary">
              添加手机
            </router-link>
            <router-link to="/cumulative" class="btn btn-secondary">
              添加家电
            </router-link>
          </div>
        </div>
        
        <div v-else class="overflow-x-auto">
          <table class="table table-zebra">
            <thead>
              <tr>
                <th>名称</th>
                <th>类型</th>
                <th>开始日期</th>
                <th>耗电量</th>
                <th>电费</th>
                <th>CO₂</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="appliance in appliances" :key="appliance.id">
                <td class="font-medium">{{ appliance.name }}</td>
                <td>
                  <span class="badge badge-outline">
                    {{ getTypeName(appliance.type) }}
                  </span>
                </td>
                <td>{{ formatDate(appliance.startDate) }}</td>
                <td>{{ appliance.kWh.toFixed(3) }} kWh</td>
                <td>${{ appliance.cost.toFixed(2) }}</td>
                <td>{{ appliance.co2.toFixed(2) }} kg</td>
                <td>
                  <button class="btn btn-sm btn-ghost btn-error" @click="removeAppliance(appliance.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- 占比说明 -->
        <div v-if="appliances.length > 1" class="mt-6 bg-base-200 rounded-lg p-4">
          <h3 class="font-semibold mb-3">各家电占比</h3>
          <div class="space-y-2">
            <div v-for="appliance in sortedAppliances" :key="appliance.id" class="flex items-center gap-3">
              <span class="w-24 truncate text-sm">{{ appliance.name }}</span>
              <div class="flex-1">
                <progress 
                  class="progress progress-primary" 
                  :value="appliance.kWh" 
                  :max="totals.kWh"
                ></progress>
              </div>
              <span class="text-sm font-mono w-16 text-right">
                {{ ((appliance.kWh / totals.kWh) * 100).toFixed(1) }}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import ChartDisplay from '@/components/ChartDisplay.vue'
import { useStorage } from '@/composables/useStorage'
import dayjs from 'dayjs'
import type { Appliance } from '@/types'

const { appliances, totals, removeAppliance, clearAll } = useStorage()

const getTypeName = (type: string): string => {
  const names: Record<string, string> = {
    phone: '手机',
    tv: '电视',
    fridge: '冰箱',
    ac: '空调',
    'washing-machine': '洗衣机',
    computer: '电脑',
    custom: '自定义'
  }
  return names[type] || type
}

const formatDate = (date: string): string => {
  return dayjs(date).format('YYYY-MM-DD')
}

const sortedAppliances = computed(() => {
  return [...appliances.value].sort((a, b) => b.kWh - a.kWh)
})

const confirmClear = () => {
  if (confirm('确定要清空所有家电数据吗？此操作不可恢复。')) {
    clearAll()
  }
}
</script>
