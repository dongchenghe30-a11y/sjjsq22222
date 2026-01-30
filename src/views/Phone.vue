<template>
  <div class="max-w-4xl mx-auto">
    <Breadcrumb />
    
    <h1 class="text-3xl font-bold mb-6">手机累计耗电计算</h1>
    
    <!-- 引导提示 -->
    <div class="alert alert-info mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div class="text-sm">
        <strong>不知道电池容量？</strong>
        <br />iPhone：设置 > 电池 > 电池健康
        <br />Android：设置 > 关于手机 > 电池信息，或下载 AccuBattery App
      </div>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 输入区 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title mb-4">输入参数</h2>
          
          <!-- 购买日期 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">购买/首次使用日期</span>
            </label>
            <input 
              v-model="startDate" 
              type="date" 
              class="input input-bordered w-full"
              :max="today"
            />
          </div>
          
          <!-- 手机型号 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">手机型号</span>
            </label>
            <select v-model="selectedModel" class="select select-bordered w-full">
              <option v-for="model in PHONE_MODELS" :key="model.name" :value="model.name">
                {{ model.name }} {{ model.capacity > 0 ? `(${model.capacity} mAh)` : '' }}
              </option>
            </select>
          </div>
          
          <!-- 自定义容量 -->
          <div class="form-control" v-if="showCustomCapacity">
            <label class="label">
              <span class="label-text">电池容量 (mAh)</span>
            </label>
            <input 
              v-model.number="customCapacity" 
              type="number" 
              placeholder="输入容量"
              class="input input-bordered w-full"
              min="1000"
            />
          </div>
          
          <!-- 日均充电次数 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">日均充电次数</span>
            </label>
            <div class="join w-full">
              <input 
                v-model.number="dailyCharges" 
                type="number" 
                step="0.1"
                class="input input-bordered join-item flex-1"
                min="0.1"
              />
              <select v-model="chargeLevel" class="select select-bordered join-item">
                <option value="">预设...</option>
                <option value="light">轻度 (0.8)</option>
                <option value="medium">中度 (1.2)</option>
                <option value="heavy">重度 (2.0)</option>
              </select>
            </div>
            <label class="label">
              <span class="label-text-alt">轻度=不玩游戏，中度=正常使用，重度=重度游戏/视频</span>
            </label>
          </div>
          
          <!-- 充电损失率 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">充电损失率 (%)</span>
            </label>
            <input 
              v-model.number="lossRate" 
              type="range" 
              min="0" 
              max="50" 
              step="5"
              class="range range-primary"
            />
            <div class="flex justify-between text-xs">
              <span>0%</span>
              <span>{{ lossRate }}%</span>
              <span>50%</span>
            </div>
            <label class="label">
              <span class="label-text-alt">考虑充电器效率、电池老化等损耗</span>
            </label>
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
          </div>
          
          <!-- 计算按钮 -->
          <div class="flex gap-2 mt-4">
            <button class="btn btn-primary flex-1" @click="calculate">
              计算耗电量
            </button>
            <button class="btn btn-secondary flex-1" @click="saveToResults" v-if="calculated">
              保存到汇总
            </button>
          </div>
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
              :applianceName="selectedModel || '手机'"
            />
          </div>
          
          <!-- 核心数据 -->
          <div class="stats stats-vertical shadow w-full">
            <div class="stat">
              <div class="stat-figure text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="stat-title">已用天数</div>
              <div class="stat-value text-primary">{{ result.days }}</div>
              <div class="stat-desc">天</div>
            </div>
            
            <div class="stat">
              <div class="stat-figure text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div class="stat-title">累计耗电</div>
              <div class="stat-value text-secondary">{{ result.kWh.toFixed(3) }}</div>
              <div class="stat-desc">kWh（度）</div>
            </div>
            
            <div class="stat">
              <div class="stat-figure text-accent">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="stat-title">累计电费</div>
              <div class="stat-value text-accent">${{ result.cost.toFixed(2) }}</div>
              <div class="stat-desc">USD</div>
            </div>
            
            <div class="stat">
              <div class="stat-figure text-error">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
              </div>
              <div class="stat-title">碳排放</div>
              <div class="stat-value text-error">{{ result.co2.toFixed(2) }}</div>
              <div class="stat-desc">kg CO₂</div>
            </div>
          </div>
          
          <!-- 趣味对比 -->
          <div class="alert alert-success mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm">{{ result.description }}</span>
          </div>
          
          <!-- 详细数据 -->
          <div class="bg-base-200 rounded-lg p-4 mt-4">
            <h3 class="font-semibold mb-2">详细计算</h3>
            <div class="text-sm space-y-1">
              <p>• 电池容量: {{ finalCapacity }} mAh</p>
              <p>• 单次充电: {{ singleKWh.toFixed(4) }} kWh</p>
              <p>• 损失后单次: {{ (singleKWh * (1 + lossRate / 100)).toFixed(4) }} kWh</p>
              <p>• 日均耗电: {{ dailyKWh.toFixed(4) }} kWh</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import Breadcrumb from '@/components/Breadcrumb.vue'
import ShareButton from '@/components/ShareButton.vue'
import { useCalculation } from '@/composables/useCalculation'
import { useStorage } from '@/composables/useStorage'
import { PHONE_MODELS } from '@/types'
import dayjs from 'dayjs'

const router = useRouter()
const startDate = ref(dayjs().subtract(365, 'day').format('YYYY-MM-DD'))
const selectedModel = ref('iPhone 16')
const customCapacity = ref(4000)
const dailyCharges = ref(1.2)
const chargeLevel = ref('')
const lossRate = ref(20)
const price = ref(1.5)
const calculated = ref(false)

const today = computed(() => dayjs().format('YYYY-MM-DD'))

const { result, calculatePhone } = useCalculation()
const { addAppliance, defaultPrice } = useStorage()

const showCustomCapacity = computed(() => selectedModel.value === '自定义容量')

const finalCapacity = computed(() => {
  if (showCustomCapacity.value) {
    return customCapacity.value
  }
  const model = PHONE_MODELS.find(m => m.name === selectedModel.value)
  return model?.capacity || 4000
})

const singleKWh = computed(() => {
  const wh = (finalCapacity.value * 3.85) / 1000
  return wh / 1000
})

const dailyKWh = computed(() => {
  return singleKWh.value * (1 + lossRate.value / 100) * dailyCharges.value + 0.003
})

// 监听预设选择
watch(chargeLevel, (value) => {
  if (value === 'light') dailyCharges.value = 0.8
  if (value === 'medium') dailyCharges.value = 1.2
  if (value === 'heavy') dailyCharges.value = 2.0
})

const calculate = () => {
  if (!startDate.value || !finalCapacity.value) {
    alert('请填写完整信息')
    return
  }
  
  calculatePhone(
    startDate.value,
    finalCapacity.value,
    dailyCharges.value,
    lossRate.value / 100,
    price.value
  )
  calculated.value = true
}

const saveToResults = () => {
  addAppliance({
    name: selectedModel.value,
    type: 'phone',
    startDate: startDate.value,
    powerW: 0,
    capacitymAh: finalCapacity.value,
    dailyCharges: dailyCharges.value,
    lossRate: lossRate.value / 100
  })
  
  router.push('/results')
}
</script>
