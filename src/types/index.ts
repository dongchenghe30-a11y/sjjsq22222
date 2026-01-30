export interface Appliance {
  id: string
  name: string
  type: 'phone' | 'tv' | 'fridge' | 'ac' | 'washing-machine' | 'custom'
  startDate: string
  powerW: number
  dailyHours?: number
  capacitymAh?: number
  dailyCharges?: number
  lossRate?: number
  kWh: number
  cost: number
  co2: number
}

export interface CalculationResult {
  days: number
  kWh: number
  cost: number
  co2: number
  description: string
}

export interface PhoneModel {
  name: string
  capacity: number
}

export const PHONE_MODELS: PhoneModel[] = [
  { name: 'iPhone 16', capacity: 4685 },
  { name: 'iPhone 16 Pro', capacity: 4676 },
  { name: 'iPhone 15 Pro Max', capacity: 4441 },
  { name: 'Galaxy S26', capacity: 5000 },
  { name: 'Pixel 10', capacity: 5200 },
  { name: '华为 Mate 70', capacity: 5000 },
  { name: '小米 15', capacity: 4610 },
  { name: 'OPPO Find X8', capacity: 5000 },
  { name: 'vivo X200', capacity: 5800 },
  { name: '自定义容量', capacity: 0 }
]

export const APPLIANCE_PRESETS = {
  tv: { name: '电视', powerW: 150 },
  fridge: { name: '冰箱', powerW: 200, standbyKWh: 0.5 },
  ac: { name: '空调', powerW: 3000 },
  'washing-machine': { name: '洗衣机', powerW: 500 },
  custom: { name: '自定义', powerW: 0 }
}

export const INSTANT_PRESETS = [
  { name: '电热水器', powerW: 2000 },
  { name: '电热水壶', powerW: 1500 },
  { name: '空调', powerW: 3000 },
  { name: '微波炉', powerW: 1000 },
  { name: '电视', powerW: 150 },
  { name: '冰箱', powerW: 200 },
  { name: '洗衣机', powerW: 500 },
  { name: '台式电脑', powerW: 300 },
  { name: '笔记本电脑', powerW: 60 },
  { name: '灯泡(LED)', powerW: 10 },
  { name: '自定义', powerW: 0 }
]
