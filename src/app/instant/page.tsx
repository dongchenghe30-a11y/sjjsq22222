'use client'

import { useState, computed } from 'react'
import Link from 'next/link'
import { Zap, DollarSign, Leaf, ArrowLeft, Share2 } from 'lucide-react'
import { calculateInstant } from '@/lib/calculations'
import { INSTANT_PRESETS } from '@/types'

export default function InstantPage() {
  const [applianceName, setApplianceName] = useState('')
  const [powerW, setPowerW] = useState(0)
  const [timeValue, setTimeValue] = useState(0)
  const [timeUnit, setTimeUnit] = useState<'hour' | 'minute'>('hour')
  const [price, setPrice] = useState(1.5)
  const [selectedPreset, setSelectedPreset] = useState('')
  const [calculated, setCalculated] = useState(false)
  const [copied, setCopied] = useState(false)

  const hours = computed(() => {
    return timeUnit === 'hour' ? timeValue : timeValue / 60
  })

  const result = calculated ? calculateInstant(powerW, hours.value, price) : null

  const handleCalculate = () => {
    if (!powerW || !hours.value) {
      alert('请输入有效的功率和使用时间')
      return
    }
    setCalculated(true)
  }

  const handlePresetChange = (value: string) => {
    setSelectedPreset(value)
    if (value) {
      const preset = INSTANT_PRESETS.find(p => p.name === value)
      if (preset) {
        setPowerW(preset.powerW)
        if (!applianceName) {
          setApplianceName(preset.name)
        }
      }
    }
  }

  const copyText = () => {
    if (!result) return
    const text = `📱 电耗计算器结果\n家电: ${applianceName || '未知家电'}\n累计耗电: ${result.kWh.toFixed(3)} kWh\n电费: $${result.cost.toFixed(2)}\n碳排放: ${result.co2.toFixed(2)} kg CO2\n\n立即计算你的家电耗电`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareToTwitter = () => {
    if (!result) return
    const text = encodeURIComponent(`我的${applianceName || '家电'}累计用电 ${result.kWh.toFixed(2)} kWh，电费 $${result.cost.toFixed(2)}，碳排放 ${result.co2.toFixed(2)} kg CO2。用免费工具计算你的家电耗电吧！`)
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
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
            <span className="font-medium">即时耗电计算</span>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-6">即时耗电计算</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 输入区 */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">输入参数</h2>
            
            <div className="space-y-4">
              <div>
                <label className="label">家电名称（可选）</label>
                <input
                  type="text"
                  value={applianceName}
                  onChange={(e) => setApplianceName(e.target.value)}
                  placeholder="例如：电热水器"
                  className="input"
                />
              </div>
              
              <div>
                <label className="label">功率（W）</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={powerW || ''}
                    onChange={(e) => setPowerW(Number(e.target.value))}
                    placeholder="输入功率"
                    className="input flex-1"
                    min="1"
                  />
                  <select
                    value={selectedPreset}
                    onChange={(e) => handlePresetChange(e.target.value)}
                    className="select flex-shrink-0"
                  >
                    <option value="">预设...</option>
                    {INSTANT_PRESETS.map((preset) => (
                      <option key={preset.name} value={preset.name}>
                        {preset.name} ({preset.powerW}W)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="label">使用时间</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={timeValue || ''}
                    onChange={(e) => setTimeValue(Number(e.target.value))}
                    placeholder="输入数值"
                    className="input flex-1"
                    min="0"
                    step="0.1"
                  />
                  <select
                    value={timeUnit}
                    onChange={(e) => setTimeUnit(e.target.value as 'hour' | 'minute')}
                    className="select flex-shrink-0"
                  >
                    <option value="hour">小时</option>
                    <option value="minute">分钟</option>
                  </select>
                </div>
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
                <p className="text-xs text-gray-500 mt-1">默认香港/美国电价 1.5 USD/kWh</p>
              </div>
              
              <button onClick={handleCalculate} className="btn btn-primary w-full mt-4">
                计算耗电量
              </button>
            </div>
          </div>
          
          {/* 结果区 */}
          {result && (
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">计算结果</h2>
                <div className="relative">
                  <button
                    onClick={() => {}}
                    className="btn btn-secondary btn-sm flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    分享
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10">
                    <button
                      onClick={copyText}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between"
                    >
                      复制文本
                      {copied && <span className="text-green-500 text-xs">已复制</span>}
                    </button>
                    <button
                      onClick={shareToTwitter}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      分享到 Twitter
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Zap className="h-8 w-8 text-blue-500" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">耗电量</div>
                      <div className="text-2xl font-bold text-blue-500">{result.kWh.toFixed(3)}</div>
                      <div className="text-xs text-gray-500">kWh（度）</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-8 w-8 text-green-500" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">电费</div>
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
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
