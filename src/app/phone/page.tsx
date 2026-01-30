'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Smartphone, Zap, DollarSign, Leaf, ArrowLeft, Share2, Save } from 'lucide-react'
import { calculatePhone } from '@/lib/calculations'
import { PHONE_MODELS } from '@/types'
import { useStorage } from '@/lib/storage'
import dayjs from 'dayjs'

export default function PhonePage() {
  const [startDate, setStartDate] = useState(dayjs().subtract(365, 'day').format('YYYY-MM-DD'))
  const [selectedModel, setSelectedModel] = useState('iPhone 16')
  const [customCapacity, setCustomCapacity] = useState(4000)
  const [dailyCharges, setDailyCharges] = useState(1.2)
  const [chargeLevel, setChargeLevel] = useState('')
  const [lossRate, setLossRate] = useState(20)
  const [price, setPrice] = useState(1.5)
  const [calculated, setCalculated] = useState(false)
  
  const { addAppliance } = useStorage()

  const today = dayjs().format('YYYY-MM-DD')
  const showCustomCapacity = selectedModel === '自定义容量'

  const finalCapacity = showCustomCapacity ? customCapacity : PHONE_MODELS.find(m => m.name === selectedModel)?.capacity || 4000

  useEffect(() => {
    if (chargeLevel === 'light') setDailyCharges(0.8)
    if (chargeLevel === 'medium') setDailyCharges(1.2)
    if (chargeLevel === 'heavy') setDailyCharges(2.0)
  }, [chargeLevel])

  const singleKWh = (finalCapacity * 3.85 / 1000) / 1000
  const dailyKWh = singleKWh * (1 + lossRate / 100) * dailyCharges + 0.003

  const result = calculated ? calculatePhone(
    startDate,
    finalCapacity,
    dailyCharges,
    lossRate / 100,
    price
  ) : null

  const handleCalculate = () => {
    if (!startDate || !finalCapacity) {
      alert('请填写完整信息')
      return
    }
    setCalculated(true)
  }

  const handleSaveToResults = () => {
    if (!result) return
    addAppliance({
      name: selectedModel,
      type: 'phone',
      startDate,
      powerW: 0,
      capacitymAh: finalCapacity,
      dailyCharges,
      lossRate: lossRate / 100
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
            <span className="font-medium">手机累计耗电计算</span>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 引导提示 */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 mb-6">
          <div className="flex gap-3">
            <div className="text-2xl">💡</div>
            <div className="text-sm">
              <strong>不知道电池容量？</strong>
              <br />iPhone：设置 > 电池 > 电池健康
              <br />Android：设置 > 关于手机 > 电池信息，或下载 AccuBattery App
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-6">手机累计耗电计算</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 输入区 */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">输入参数</h2>
            
            <div className="space-y-4">
              <div>
                <label className="label flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  购买/首次使用日期
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
                <label className="label flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  手机型号
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="select"
                >
                  {PHONE_MODELS.map((model) => (
                    <option key={model.name} value={model.name}>
                      {model.name} {model.capacity > 0 ? `(${model.capacity} mAh)` : ''}
                    </option>
                  ))}
                </select>
              </div>
              
              {showCustomCapacity && (
                <div>
                  <label className="label">电池容量 (mAh)</label>
                  <input
                    type="number"
                    value={customCapacity}
                    onChange={(e) => setCustomCapacity(Number(e.target.value))}
                    placeholder="输入容量"
                    className="input"
                    min="1000"
                  />
                </div>
              )}
              
              <div>
                <label className="label">日均充电次数</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={dailyCharges}
                    onChange={(e) => setDailyCharges(Number(e.target.value))}
                    step="0.1"
                    className="input flex-1"
                    min="0.1"
                  />
                  <select
                    value={chargeLevel}
                    onChange={(e) => setChargeLevel(e.target.value)}
                    className="select flex-shrink-0"
                  >
                    <option value="">预设...</option>
                    <option value="light">轻度 (0.8)</option>
                    <option value="medium">中度 (1.2)</option>
                    <option value="heavy">重度 (2.0)</option>
                  </select>
                </div>
                <p className="text-xs text-gray-500 mt-1">轻度=不玩游戏，中度=正常使用，重度=重度游戏/视频</p>
              </div>
              
              <div>
                <label className="label">充电损失率 (%)</label>
                <input
                  type="range"
                  value={lossRate}
                  onChange={(e) => setLossRate(Number(e.target.value))}
                  min="0"
                  max="50"
                  step="5"
                  className="w-full"
                />
                <div className="flex justify-between text-xs">
                  <span>0%</span>
                  <span className="font-bold">{lossRate}%</span>
                  <span>50%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">考虑充电器效率、电池老化等损耗</p>
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
                    <p>• 电池容量: {finalCapacity} mAh</p>
                    <p>• 单次充电: {singleKWh.toFixed(4)} kWh</p>
                    <p>• 损失后单次: {(singleKWh * (1 + lossRate / 100)).toFixed(4)} kWh</p>
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
