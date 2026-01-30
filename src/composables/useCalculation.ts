import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import type { CalculationResult } from '@/types'

export function useCalculation() {
  const VOLTAGE = 3.85 // 平均电压 V
  const CO2_FACTOR = 0.6 // kg/kWh 碳排放系数
  const DEFAULT_PRICE = 1.5 // USD/kWh

  const result = ref<CalculationResult>({
    days: 0,
    kWh: 0,
    cost: 0,
    co2: 0,
    description: ''
  })

  // 即时计算
  const calculateInstant = (powerW: number, hours: number, price: number = DEFAULT_PRICE) => {
    const kWh = (powerW / 1000) * hours
    const cost = kWh * price
    const co2 = kWh * CO2_FACTOR
    
    result.value = {
      days: 0,
      kWh,
      cost,
      co2,
      description: generateFunFacts(kWh)
    }
    
    return result.value
  }

  // 手机累计计算
  const calculatePhone = (
    startDate: string,
    capacitymAh: number,
    dailyCharges: number = 1.2,
    lossRate: number = 0.2,
    price: number = DEFAULT_PRICE
  ) => {
    const days = dayjs().diff(dayjs(startDate), 'day') || 1
    
    // 单次充电 kWh
    const singleWh = (capacitymAh * VOLTAGE) / 1000
    const singleKWh = singleWh / 1000
    const actualSingleKWh = singleKWh * (1 + lossRate)
    
    // 日均 kWh（含待机）
    const dailyKWh = actualSingleKWh * dailyCharges + 0.003
    const totalKWh = dailyKWh * days
    const cost = totalKWh * price
    const co2 = totalKWh * CO2_FACTOR
    
    result.value = {
      days,
      kWh: totalKWh,
      cost,
      co2,
      description: generateFunFacts(totalKWh)
    }
    
    return result.value
  }

  // 家电累计计算
  const calculateAppliance = (
    startDate: string,
    powerW: number,
    dailyHours: number,
    standbyKWh: number = 0,
    price: number = DEFAULT_PRICE
  ) => {
    const days = dayjs().diff(dayjs(startDate), 'day') || 1
    
    // 日均 kWh
    const dailyKWh = (powerW / 1000) * dailyHours + standbyKWh
    const totalKWh = dailyKWh * days
    const cost = totalKWh * price
    const co2 = totalKWh * CO2_FACTOR
    
    result.value = {
      days,
      kWh: totalKWh,
      cost,
      co2,
      description: generateFunFacts(totalKWh)
    }
    
    return result.value
  }

  // 生成趣味对比
  const generateFunFacts = (kWh: number): string => {
    const facts: string[] = []
    
    // 相当于充满多少次手机（按 18Wh 计算）
    const phoneCharges = Math.round((kWh * 1000) / 18)
    if (phoneCharges > 0) {
      facts.push(`相当于充满 ${phoneCharges.toLocaleString()} 次手机`)
    }
    
    // 相当于多少升汽油（1L汽油 ≈ 8.9 kWh）
    const gasoline = (kWh / 8.9).toFixed(2)
    if (parseFloat(gasoline) > 0.01) {
      facts.push(`相当于 ${gasoline} 升汽油`)
    }
    
    // 相当于多少公里电动车行驶（按 0.15 kWh/km）
    const evKm = Math.round(kWh / 0.15)
    if (evKm > 0) {
      facts.push(`可供电动车行驶 ${evKm.toLocaleString()} 公里`)
    }
    
    // 相当于多少棵树年吸收量（1棵树 ≈ 20 kg CO2/年）
    const trees = (kWh * CO2_FACTOR / 20).toFixed(1)
    if (parseFloat(trees) > 0.01) {
      facts.push(`需要 ${trees} 棵树一年才能吸收这些 CO2`)
    }
    
    return facts.join('，')
  }

  return {
    result,
    calculateInstant,
    calculatePhone,
    calculateAppliance,
    generateFunFacts
  }
}
