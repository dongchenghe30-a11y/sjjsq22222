<template>
  <div class="max-w-4xl mx-auto">
    <Breadcrumb />
    
    <h1 class="text-3xl font-bold mb-6">家电累计耗电计算</h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 输入区 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title mb-4">输入参数</h2>
          
          <!-- 家电名称 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">家电名称</span>
            </label>
            <input 
              v-model="applianceName" 
              type="text" 
              placeholder="例如：客厅电视"
              class="input input-bordered w-full"
            />
          </div>
          
          <!-- 家电类型 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">家电类型</span>
            </label>
            <select v-model="selectedType" class="select select-bordered w-full">
              <option value="custom">自定义</option>
              <option value="tv">电视</option>
              <option value="fridge">冰箱</option>
              <option value="ac">空调</option>
              <option value="washing-machine">洗衣机</option>
              <option value="computer">电脑</option>
            </select>
          </div>
          
          <!-- 开始日期 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">开始使用日期</span>
            </label>
            <input 
              v-model="startDate" 
              type="date" 
              class="input input-bordered w-full"
              :max="today"
            />
          </div>
          
          <!-- 功率 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">功率（W）</span>
            </label>
            <input 
              v-model.number="powerW" 
              type="number" 
              placeholder="输入功率"
              class="input input-bordered w-full"
              min="1"
            />
            <label class="label">
              <span class="label-text-alt" v-if="selectedType !== 'custom'">
                预设功率: {{ getPowerPreset(selectedType) }}W
              </span>
            </label>
          </div>
          
          <!-- 日均使用小时 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">日均使用小时</span>
            </label>
            <div class="join w-full">
              <input 
                v-model.number="dailyHours" 
                type="number" 
                step="0.5"
                class="input input-bordered join-item flex-1"
                min="0"
                max="24"
              />
              <select v-model="usageLevel" class="select select-bordered join-item">
                <option value="">预设...</option>
                <option value="low">轻度 ({{ getUsageHours('low') }}h)</option>
                <option value="medium">中度 ({{ getUsageHours('medium') }}h)</option>
                <option value="high">重度 ({{ getUsageHours('high') }}h)</option>
              </select>
            </div>
            <label class="label">
              <span class="label-text-alt">{{ getUsageDescription() }}</span>
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
              :applianceName="applianceName || '家电'"
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
              <p>• 功率: {{ powerW }}W</p>
              <p>• 日均使用: {{ dailyHours }}小时</p>
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
import dayjs from 'dayjs'

const router = useRouter()
const applianceName = ref('')
const selectedType = ref('tv')
const startDate = ref(dayjs().subtract(365, 'day').format('YYYY-MM-DD'))
const powerW = ref(150)
const dailyHours = ref(4)
const usageLevel = ref('')
const price = ref(1.5)
const calculated = ref(false)

const today = computed(() => dayjs().format('YYYY-MM-DD'))

const { result, calculateAppliance } = useCalculation()
const { addAppliance } = useStorage()

const dailyKWh = computed(() => {
  return (powerW.value / 1000) * dailyHours.value
})

// 获取功率预设
const getPowerPreset = (type: string): number => {
  const presets: Record<string, number> = {
    tv: 150,
    fridge: 200,
    ac: 3000,
    'washing-machine': 500,
    computer: 300
  }
  return presets[type] || 0
}

// 获取使用小时预设
const getUsageHours = (level: string): number => {
  const hours: Record<string, number> = {
    low: selectedType.value === 'ac' ? 2 : 2,
    medium: selectedType.value === 'ac' ? 6 : 6,
    high: selectedType.value === 'ac' ? 12 : 10
  }
  return hours[level] || 4
}

// 获取使用描述
const getUsageDescription = (): string => {
  const descriptions: Record<string, string> = {
    tv: '轻度: 偶尔观看 | 中度: 每天几小时 | 重度: 全天开启',
    fridge: '24小时运行，考虑压缩机间歇',
    ac: '轻度: 夏季偶尔 | 中度: 夏季每天6h | 重度: 长期开启',
    'washing-machine': '每次约1-2小时',
    computer: '轻度: 办公使用 | 中度: 日常+娱乐 | 重度: 游戏/渲染'
  }
  return descriptions[selectedType.value] || '根据实际使用习惯选择'
}

// 监听类型变化
watch(selectedType, (value) => {
  if (value !== 'custom') {
    powerW.value = getPowerPreset(value)
  }
})

// 监听使用等级
watch(usageLevel, (value) => {
  if (value) {
    dailyHours.value = getUsageHours(value)
  }
})

const calculate = () => {
  if (!applianceName.value || !startDate.value || !powerW.value) {
    alert('请填写完整信息')
    return
  }
  
  calculateAppliance(
    startDate.value,
    powerW.value,
    dailyHours.value,
    selectedType.value === 'fridge' ? 0.5 : 0,
    price.value
  )
  calculated.value = true
}

const saveToResults = () => {
  addAppliance({
    name: applianceName.value,
    type: selectedType.value as any,
    startDate: startDate.value,
    powerW: powerW.value,
    dailyHours: dailyHours.value
  })
  
  router.push('/results')
}
</script>
