'use client'

import Link from 'next/link'
import { ArrowLeft, Trash2, Zap, DollarSign, Leaf, Home, Smartphone, Monitor, Snowflake, Wind, Waves, Laptop } from 'lucide-react'
import { useStorage } from '@/lib/storage'
import type { Appliance } from '@/types'
import { Pie, Bar } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import dayjs from 'dayjs'

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function ResultsPage() {
  const { appliances, totals, removeAppliance, clearAll } = useStorage()

  const getTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      phone: Smartphone,
      tv: Monitor,
      fridge: Snowflake,
      ac: Wind,
      'washing-machine': Waves,
      computer: Laptop,
      custom: Home
    }
    return icons[type] || Home
  }

  const getTypeName = (type: string) => {
    const names: Record<string, string> = {
      phone: '手机',
      tv: '电视',
      fridge: '冰箱',
      ac: '空调',
      'washing-machine': '洗衣机',
      computer: '电脑',
      custom: '自定义'
    }
    return names[type] || type
  }

  const sortedAppliances = [...appliances].sort((a, b) => b.kWh - a.kWh)

  const colors = [
    'rgba(59, 130, 246, 0.8)',
    'rgba(16, 185, 129, 0.8)',
    'rgba(245, 158, 11, 0.8)',
    'rgba(239, 68, 68, 0.8)',
    'rgba(139, 92, 246, 0.8)',
    'rgba(236, 72, 153, 0.8)',
    'rgba(14, 165, 233, 0.8)',
    'rgba(168, 162, 158, 0.8)'
  ]

  const pieData = {
    labels: appliances.map(a => a.name),
    datasets: [{
      data: appliances.map(a => a.kWh),
      backgroundColor: appliances.map((_, i) => colors[i % colors.length]),
      borderWidth: 0
    }]
  }

  const barData = {
    labels: appliances.map(a => a.name),
    datasets: [{
      label: '耗电量 (kWh)',
      data: appliances.map(a => a.kWh),
      backgroundColor: appliances.map((_, i) => colors[i % colors.length]),
      borderWidth: 0
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const
      }
    }
  }

  const handleClearAll = () => {
    if (confirm('确定要清空所有家电数据吗？此操作不可恢复。')) {
      clearAll()
    }
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
            <span className="font-medium">批量汇总</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-6">批量汇总</h1>
        
        {/* 总计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                <Zap className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">总耗电量</div>
                <div className="text-2xl font-bold text-blue-500">{totals.kWh.toFixed(2)}</div>
                <div className="text-xs text-gray-500">kWh（度）</div>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">总电费</div>
                <div className="text-2xl font-bold text-green-500">${totals.cost.toFixed(2)}</div>
                <div className="text-xs text-gray-500">USD</div>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                <Leaf className="h-8 w-8 text-red-500" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">总碳排放</div>
                <div className="text-2xl font-bold text-red-500">{totals.co2.toFixed(2)}</div>
                <div className="text-xs text-gray-500">kg CO₂</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 图表区 */}
        {appliances.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="card">
              <h3 className="text-lg font-bold mb-4">各家电占比</h3>
              <div className="h-64 flex justify-center items-center">
                <Pie data={pieData} options={chartOptions} />
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-bold mb-4">耗电量对比 (kWh)</h3>
              <div className="h-64 flex justify-center items-center">
                <Bar data={barData} options={chartOptions} />
              </div>
            </div>
          </div>
        )}
        
        {/* 家电列表 */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">家电列表 ({appliances.length})</h2>
            {appliances.length > 0 && (
              <button onClick={handleClearAll} className="btn btn-danger btn-sm">
                清空所有
              </button>
            )}
          </div>
          
          {appliances.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold mb-2">暂无数据</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                添加家电以查看汇总统计
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Link href="/phone" className="btn btn-primary">
                  添加手机
                </Link>
                <Link href="/cumulative" className="btn btn-secondary">
                  添加家电
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4">名称</th>
                      <th className="text-left py-3 px-4">类型</th>
                      <th className="text-left py-3 px-4">开始日期</th>
                      <th className="text-right py-3 px-4">耗电量</th>
                      <th className="text-right py-3 px-4">电费</th>
                      <th className="text-right py-3 px-4">CO₂</th>
                      <th className="text-center py-3 px-4">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedAppliances.map((appliance) => {
                      const Icon = getTypeIcon(appliance.type)
                      return (
                        <tr key={appliance.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">{appliance.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700">
                              {getTypeName(appliance.type)}
                            </span>
                          </td>
                          <td className="py-3 px-4">{dayjs(appliance.startDate).format('YYYY-MM-DD')}</td>
                          <td className="py-3 px-4 text-right font-medium">{appliance.kWh.toFixed(3)} kWh</td>
                          <td className="py-3 px-4 text-right">${appliance.cost.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right">{appliance.co2.toFixed(2)} kg</td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => removeAppliance(appliance.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* 占比说明 */}
              {appliances.length > 1 && (
                <div className="mt-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">各家电占比</h3>
                  <div className="space-y-2">
                    {sortedAppliances.map((appliance) => (
                      <div key={appliance.id} className="flex items-center gap-3">
                        <span className="w-24 truncate text-sm">{appliance.name}</span>
                        <div className="flex-1">
                          <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 transition-all duration-500"
                              style={{ width: `${(appliance.kWh / totals.kWh) * 100}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-mono w-16 text-right">
                          {((appliance.kWh / totals.kWh) * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
