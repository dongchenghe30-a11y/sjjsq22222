import { ref, watch } from 'vue'
import type { Appliance } from '@/types'
import { useCalculation } from './useCalculation'

const STORAGE_KEY = 'power-calculator-appliances'
const PRICE_KEY = 'power-calculator-price'

export function useStorage() {
  const appliances = ref<Appliance[]>([])
  const defaultPrice = ref<number>(1.5)
  const { calculatePhone, calculateAppliance } = useCalculation()

  // 从 localStorage 加载数据
  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        appliances.value = JSON.parse(stored)
      }
      
      const storedPrice = localStorage.getItem(PRICE_KEY)
      if (storedPrice) {
        defaultPrice.value = parseFloat(storedPrice)
      }
    } catch (error) {
      console.error('Failed to load from storage:', error)
    }
  }

  // 保存到 localStorage
  const saveToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appliances.value))
      localStorage.setItem(PRICE_KEY, defaultPrice.value.toString())
    } catch (error) {
      console.error('Failed to save to storage:', error)
    }
  }

  // 添加家电
  const addAppliance = (appliance: Omit<Appliance, 'id' | 'kWh' | 'cost' | 'co2'>) => {
    const id = Date.now().toString()
    let kWh = 0
    let cost = 0
    let co2 = 0

    if (appliance.type === 'phone' && appliance.capacitymAh && appliance.dailyCharges) {
      const result = calculatePhone(
        appliance.startDate,
        appliance.capacitymAh,
        appliance.dailyCharges,
        appliance.lossRate || 0.2,
        defaultPrice.value
      )
      kWh = result.kWh
      cost = result.cost
      co2 = result.co2
    } else if (appliance.dailyHours) {
      const result = calculateAppliance(
        appliance.startDate,
        appliance.powerW,
        appliance.dailyHours,
        0,
        defaultPrice.value
      )
      kWh = result.kWh
      cost = result.cost
      co2 = result.co2
    }

    appliances.value.push({
      ...appliance,
      id,
      kWh,
      cost,
      co2
    })
    
    saveToStorage()
  }

  // 删除家电
  const removeAppliance = (id: string) => {
    appliances.value = appliances.value.filter(a => a.id !== id)
    saveToStorage()
  }

  // 更新家电
  const updateAppliance = (id: string, updates: Partial<Appliance>) => {
    const index = appliances.value.findIndex(a => a.id === id)
    if (index !== -1) {
      appliances.value[index] = { ...appliances.value[index], ...updates }
      
      // 重新计算
      const appliance = appliances.value[index]
      let kWh = 0
      let cost = 0
      let co2 = 0

      if (appliance.type === 'phone' && appliance.capacitymAh && appliance.dailyCharges) {
        const result = calculatePhone(
          appliance.startDate,
          appliance.capacitymAh,
          appliance.dailyCharges,
          appliance.lossRate || 0.2,
          defaultPrice.value
        )
        kWh = result.kWh
        cost = result.cost
        co2 = result.co2
      } else if (appliance.dailyHours) {
        const result = calculateAppliance(
          appliance.startDate,
          appliance.powerW,
          appliance.dailyHours,
          0,
          defaultPrice.value
        )
        kWh = result.kWh
        cost = result.cost
        co2 = result.co2
      }

      appliances.value[index] = { ...appliance, kWh, cost, co2 }
      
      saveToStorage()
    }
  }

  // 清空所有
  const clearAll = () => {
    appliances.value = []
    saveToStorage()
  }

  // 计算总计
  const totals = computed(() => {
    return appliances.value.reduce(
      (acc, a) => ({
        kWh: acc.kWh + a.kWh,
        cost: acc.cost + a.cost,
        co2: acc.co2 + a.co2
      }),
      { kWh: 0, cost: 0, co2: 0 }
    )
  })

  // 监听变化自动保存
  watch(appliances, saveToStorage, { deep: true })
  watch(defaultPrice, saveToStorage)

  // 初始化加载
  loadFromStorage()

  return {
    appliances,
    defaultPrice,
    totals,
    addAppliance,
    removeAppliance,
    updateAppliance,
    clearAll,
    loadFromStorage
  }
}
