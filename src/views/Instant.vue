<template>
  <div class="max-w-4xl mx-auto">
    <Breadcrumb />
    
    <h1 class="text-3xl font-bold mb-6">即时耗电计算</h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 输入区 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title mb-4">输入参数</h2>
          
          <!-- 家电名称 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">家电名称（可选）</span>
            </label>
            <input 
              v-model="applianceName" 
              type="text" 
              placeholder="例如：电热水器"
              class="input input-bordered w-full"
            />
          </div>
          
          <!-- 功率 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">功率（W）</span>
            </label>
            <div class="join w-full">
              <input 
                v-model="powerW" 
                type="number" 
                placeholder="输入功率"
                class="input input-bordered join-item flex-1"
                min="1"
              />
              <select v-model="selectedPreset" class="select select-bordered join-item">
                <option value="">预设...</option>
                <option v-for="preset in INSTANT_PRESETS" :key="preset.name" :value="preset.name">
                  {{ preset.name }} ({{ preset.powerW }}W)
                </option>
              </select>
            </div>
          </div>
          
          <!-- 使用时间 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">使用时间</span>
            </label>
            <div class="join w-full">
              <input 
                v-model.number="timeValue" 
                type="number" 
                placeholder="输入数值"
                class="input input-bordered join-item flex-1"
                min="0"
                step="0.1"
              />
              <select v-model="timeUnit" class="select select-bordered join-item">
                <option value="hour">小时</option>
                <option value="minute">分钟</option>
              </select>
            </div>
          </div>
          
          <!-- 电价 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">电价（USD/kWh）</span>
            </label>
            <input 
              v-model.number="price" 
              type="number" 
              step="0.01"
              class="input input-bordered w-full"
              min="0"
            />
            <label class="label">
              <span class="label-text-alt">默认香港/美国电价 1.5 USD/kWh</span>
            </label>
          </div>
          
          <!-- 计算按钮 -->
          <button class="btn btn-primary mt-4" @click="calculate">
            计算耗电量
          </button>
        </div>
      </div>
      
      <!-- 结果区 -->
      <div class="card bg-base-100 shadow-xl" v-if="calculated">
        <div class="card-body">
          <div class="flex justify-between items-center mb-4">
            <h2 class="card-title">计算结果</h2>
            <ShareButton 
              :kWh="result.kWh" 
              :cost="result.cost" 
              :co2="result.co2"
              :applianceName="applianceName || '未知家电'"
            />
          </div>
          
          <!-- 核心数据 -->
          <div class="stats stats-vertical shadow w-full">
            <div class="stat">
              <div class="stat-figure text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div class="stat-title">耗电量</div>
              <div class="stat-value text-primary">{{ result.kWh.toFixed(3) }}</div>
              <div class="stat-desc">kWh（度）</div>
            </div>
            
            <div class="stat">
              <div class="stat-figure text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="stat-title">电费</div>
              <div class="stat-value text-secondary">${{ result.cost.toFixed(2) }}</div>
              <div class="stat-desc">USD</div>
            </div>
            
            <div class="stat">
              <div class="stat-figure text-accent">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
              </div>
              <div class="stat-title">碳排放</div>
              <div class="stat-value text-accent">{{ result.co2.toFixed(2) }}</div>
              <div class="stat-desc">kg CO₂</div>
            </div>
          </div>
          
          <!-- 趣味对比 -->
          <div class="alert alert-info mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm">{{ result.description }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import ShareButton from '@/components/ShareButton.vue'
import { useCalculation } from '@/composables/useCalculation'
import { INSTANT_PRESETS } from '@/types'

const applianceName = ref('')
const powerW = ref<number>(0)
const timeValue = ref<number>(0)
const timeUnit = ref<'hour' | 'minute'>('hour')
const price = ref<number>(1.5)
const selectedPreset = ref('')
const calculated = ref(false)

const { result, calculateInstant } = useCalculation()

const hours = computed(() => {
  return timeUnit.value === 'hour' ? timeValue.value : timeValue.value / 60
})

// 监听预设选择
watch(selectedPreset, (value) => {
  if (value) {
    const preset = INSTANT_PRESETS.find(p => p.name === value)
    if (preset) {
      powerW.value = preset.powerW
      // 自动设置名称
      if (!applianceName.value) {
        applianceName.value = preset.name
      }
    }
  }
})

const calculate = () => {
  if (!powerW.value || !hours.value) {
    alert('请输入有效的功率和使用时间')
    return
  }
  
  calculateInstant(powerW.value, hours.value, price.value)
  calculated.value = true
}
</script>
