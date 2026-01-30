'use client'

import { useState, useEffect } from 'react'
import type { Appliance } from '@/types'
import { calculatePhone, calculateAppliance, DEFAULT_PRICE } from './calculations'

const STORAGE_KEY = 'power-calculator-appliances'
const PRICE_KEY = 'power-calculator-price'

export function useStorage() {
  const [appliances, setAppliances] = useState<Appliance[]>([])
  const [defaultPrice, setDefaultPrice] = useState<number>(DEFAULT_PRICE)

  // 从 localStorage 加载数据
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setAppliances(JSON.parse(stored))
      }
      
      const storedPrice = localStorage.getItem(PRICE_KEY)
      if (storedPrice) {
        setDefaultPrice(parseFloat(storedPrice))
      }
    } catch (error) {
      console.error('Failed to load from storage:', error)
    }
  }, [])

  // 保存到 localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appliances))
      localStorage.setItem(PRICE_KEY, defaultPrice.toString())
    } catch (error) {
      console.error('Failed to save to storage:', error)
    }
  }, [appliances, defaultPrice])

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
        defaultPrice
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
        defaultPrice
      )
      kWh = result.kWh
      cost = result.cost
      co2 = result.co2
    }

    setAppliances(prev => [
      ...prev,
      { ...appliance, id, kWh, cost, co2 }
    ])
  }

  const removeAppliance = (id: string) => {
    setAppliances(prev => prev.filter(a => a.id !== id))
  }

  const clearAll = () => {
    setAppliances([])
  }

  const totals = appliances.reduce(
    (acc, a) => ({
      kWh: acc.kWh + a.kWh,
      cost: acc.cost + a.cost,
      co2: acc.co2 + a.co2
    }),
    { kWh: 0, cost: 0, co2: 0 }
  )

  return {
    appliances,
    defaultPrice,
    totals,
    addAppliance,
    removeAppliance,
    clearAll
  }
}
