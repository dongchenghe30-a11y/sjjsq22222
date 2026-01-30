'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Zap, DollarSign, Leaf, ArrowLeft, Share2, Save, Home } from 'lucide-react'
import { calculateAppliance } from '@/lib/calculations'
import { APPLIANCE_PRESETS } from '@/types'
import { useStorage } from '@/lib/storage'
import dayjs from 'dayjs'

export default function CumulativePage() {
  const [applianceName, setApplianceName] = useState('')
  const [selectedType, setSelectedType] = useState('tv')
  const [startDate, setStartDate] = useState(dayjs().subtract(365, 'day').format('YYYY-MM-DD'))
  const [powerW, setPowerW] = useState(150)
  const [dailyHours, setDailyHours] = useState(4)
  const [usageLevel, setUsageLevel] = useState('')
  const [price, setPrice] = useState(1.5)
  const [calculated, setCalculated] = useState(false)
  
  const { addAppliance } = useStorage()

  const today = dayjs().format('YYYY-MM-DD')

  const dailyKWh = (powerW / 1000) * dailyHours

  useEffect(() => {
    if (usageLevel === 'low') setDailyHours(selectedType === 'ac' ? 2 : 2)
    if (usageLevel === 'medium') setDailyHours(selectedType === 'ac' ? 6 : 6)
    if (usageLevel === 'high') setDailyHours(selectedType === 'ac' ? 12 : 10)
  }, [usageLevel, selectedType])

  useEffect(() => {
    if (selectedType !== 'custom') {
      const preset = APPLIANCE_PRESETS[selectedType as keyof typeof APPLIANCE_PRESETS]
      if (preset) {
        setPowerW(preset.powerW)
      }
    }
  }, [selectedType])

  const result = calculated ? calculateAppliance(
    startDate,
    powerW,
    dailyHours,
    selectedType === 'fridge' ? 0.5 : 0,
    price
  ) : null

  const getUsageDescription = () => {
    const descriptions: Record<string, string> = {
      tv: '轻度: 偶尔观看 | 中度: 每天几小时 | 重度: 全天开启',
      fridge: '24小时运行，考虑压缩机间歇',
      ac: '轻度: 夏季偶尔 | 中度: 夏季每天6h | 重度: 长期开启',
      'washing-machine': '每次约1-2小时',
      computer: '轻度: 办公使用 | 中度: 日常+娱乐 | 重度: 游戏/渲染'
    }
    return descriptions[selectedType] || '根据实际使用习惯选择'
  }

  const handleCalculate = () => {
    if (!applianceName || !startDate || !powerW) {
      alert('请填写完整信息')
      return
    }
    setCalculated(true)
  }

  const handleSaveToResults = () => {
    if (!result) return
    addAppliance({
      name: applianceName,
      type: selectedType as any,
      startDate,
      powerW,
      dailyHours
    })
    window.location.href = '/results'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500">
              <ArrowLeft className="h-5 w-5" />
              返回首页
            </Link>
            <span className="text-gray-400">/</span>
            <span className="font-medium">家电累计耗电计算</span>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-6">家电累计耗电计算</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 输入区 */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">输入参数</h2>
            
            <div className="space-y-4">
              <div>
                <label className="label flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  家电名称
                </label>
                <input
                  type="text"
                  value={applianceName}
                  onChange={(e) => setApplianceName(e.target.value)}
                  placeholder="例如：客厅电视"
                  className="input"
                />
              </div>
              
              <div>
                <label className="label">家电类型</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="select"
                >
                  <option value="custom">自定义</option>
                  <option value="tv">电视</option>
                  <option value="fridge">冰箱</option>
                  <option value="ac">空调</option>
                  <option value="washing-machine">洗衣机</option>
                  <option value="computer">电脑</option>
                </select>
              </div>
              
              <div>
                <label className="label flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  开始使用日期
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input"
                  max={today}
                />
              </div>
              
              <div>
                <label className="label">功率（W）</label>
                <input
                  type="number"
                  value={powerW}
                  onChange={(e) => setPowerW(Number(e.target.value))}
                  placeholder="输入功率"
                  className="input"
                  min="1"
                />
                {selectedType !== 'custom' && (
                  <p className="text-xs text-gray-500 mt-1">
                    预设功率: {APPLIANCE_PRESETS[selectedType as keyof typeof APPLIANCE_PRESETS]?.powerW}W
                  </p>
                )}
              </div>
              
              <div>
                <label className="label">日均使用小时</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={dailyHours}
                    onChange={(e) => setDailyHours(Number(e.target.value))}
                    step="0.5"
                    className="input flex-1"
                    min="0"
                    max="24"
                  />
                  <select
                    value={usageLevel}
                    onChange={(e) => setUsageLevel(e.target.value)}
                    className="select flex-shrink-0"
                  >
                    <option value="">预设...</option>
                    <option value="low">轻度 (2h)</option>
                    <option value="medium">中度 (6h)</option>
                    <option value="high">重度 (10h)</option>
                  </select>
                </div>
                <p className="text-xs text-gray-500 mt-1">{getUsageDescription()}</p>
              </div>
              
              <div>
                <label className="label">电价（USD/kWh）</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  step="0.01"
                  className="input"
                  min="0"
                />
              </div>
              
              <div className="flex gap-2 mt-4">
                <button onClick={handleCalculate} className="btn btn-primary flex-1">
                  计算耗电量
                </button>
                {calculated && (
                  <button onClick={handleSaveToResults} className="btn btn-secondary flex-1 flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    保存到汇总
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* 结果区 */}
          {result && (
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">计算结果</h2>
                <button className="btn btn-secondary btn-sm flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  分享
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-8 w-8 text-blue-500" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">已用天数</div>
                      <div className="text-2xl font-bold text-blue-500">{result.days}</div>
                      <div className="text-xs text-gray-500">天</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Zap className="h-8 w-8 text-blue-500" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">累计耗电</div>
                      <div className="text-2xl font-bold text-blue-500">{result.kWh.toFixed(3)}</div>
                      <div className="text-xs text-gray-500">kWh（度）</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-8 w-8 text-green-500" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">累计电费</div>
                      <div className="text-2xl font-bold text-green-500">${result.cost.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">USD</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Leaf className="h-8 w-8 text-red-500" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">碳排放</div>
                      <div className="text-2xl font-bold text-red-500">{result.co2.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">kg CO₂</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <div className="text-sm">
                    <strong>趣味对比：</strong>
                    {result.description}
                  </div>
                </div>
                
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">详细计算</h3>
                  <div className="text-sm space-y-1">
                    <p>• 功率: {powerW}W</p>
                    <p>• 日均使用: {dailyHours}小时</p>
                    <p>• 日均耗电: {dailyKWh.toFixed(4)} kWh</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
