'use client'

import Link from 'next/link'
import { ArrowLeft, Zap, Smartphone, Home, CheckCircle, AlertTriangle } from 'lucide-react'

export default function AboutPage() {
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
            <span className="font-medium">关于</span>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-6">关于电耗计算器</h1>
        
        <div className="space-y-6">
          {/* 简介 */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">简介</h2>
            <p className="text-gray-600 dark:text-gray-400">
              电耗计算器是一个免费的在线工具，帮助用户估算家电（尤其是手机）从开始使用到现在累计耗电量、电费和碳排放。
              所有计算都在浏览器端进行，无需后端服务器、无需上传文件、无需API密钥，保护用户隐私。
            </p>
          </div>
          
          {/* 计算逻辑 */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">计算逻辑</h2>
            
            <div className="space-y-4">
              {/* 即时计算 */}
              <details className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4" open>
                <summary className="cursor-pointer font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  ⚡ 即时耗电计算
                </summary>
                <div className="mt-4 space-y-2">
                  <p><strong>公式：</strong></p>
                  <code className="block bg-white dark:bg-gray-800 p-3 rounded text-sm">
                    kWh = (功率W / 1000) × 使用小时数
                  </code>
                  <code className="block bg-white dark:bg-gray-800 p-3 rounded text-sm">
                    电费 = kWh × 电价
                  </code>
                  <code className="block bg-white dark:bg-gray-800 p-3 rounded text-sm">
                    CO₂ = kWh × 0.6 kg/kWh
                  </code>
                  <p className="text-sm text-gray-500 mt-2">
                    例如：2000W热水器使用1小时 = 2 kWh，电价1.5 USD/kWh时电费 = 3 USD
                  </p>
                </div>
              </details>
              
              {/* 手机累计计算 */}
              <details className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4" open>
                <summary className="cursor-pointer font-medium flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  📱 手机累计耗电计算
                </summary>
                <div className="mt-4 space-y-2">
                  <p><strong>计算步骤：</strong></p>
                  <p>1. 单次充电能量：</p>
                  <code className="block bg-white dark:bg-gray-800 p-3 rounded text-sm">
                    单次Wh = 电池容量(mAh) × 3.85V / 1000
                  </code>
                  <p>2. 单次充电电量：</p>
                  <code className="block bg-white dark:bg-gray-800 p-3 rounded text-sm">
                    单次kWh = 单次Wh / 1000
                  </code>
                  <p>3. 考虑充电损失（默认20%）：</p>
                  <code className="block bg-white dark:bg-gray-800 p-3 rounded text-sm">
                    实际单次kWh = 单次kWh × (1 + 损失率)
                  </code>
                  <p>4. 日均耗电（含待机）：</p>
                  <code className="block bg-white dark:bg-gray-800 p-3 rounded text-sm">
                    日均kWh = 实际单次kWh × 日均充电次数 + 0.003 kWh
                  </code>
                  <p>5. 累计耗电：</p>
                  <code className="block bg-white dark:bg-gray-800 p-3 rounded text-sm">
                    累计kWh = 日均kWh × 使用天数
                  </code>
                  <p className="text-sm text-gray-500 mt-2">
                    待机耗电按0.003 kWh/天估算，约等于手机24小时待机耗电
                  </p>
                </div>
              </details>
              
              {/* 家电累计计算 */}
              <details className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <summary className="cursor-pointer font-medium flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  🏠 家电累计耗电计算
                </summary>
                <div className="mt-4 space-y-2">
                  <p><strong>计算步骤：</strong></p>
                  <p>1. 日均耗电：</p>
                  <code className="block bg-white dark:bg-gray-800 p-3 rounded text-sm">
                    日均kWh = (功率W / 1000) × 日均使用小时 + 待机kWh
                  </code>
                  <p>2. 累计耗电：</p>
                  <code className="block bg-white dark:bg-gray-800 p-3 rounded text-sm">
                    累计kWh = 日均kWh × 使用天数
                  </code>
                  <p className="text-sm text-gray-500 mt-2">
                    冰箱等电器会自动考虑待机耗电（默认0.5 kWh/天）
                  </p>
                </div>
              </details>
            </div>
          </div>
          
          {/* 数据来源 */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">数据来源</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">📊 参数来源</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>平均电压：3.85V（锂电池标准）</li>
                  <li>充电损失：20%（充电器效率+电池老化）</li>
                  <li>CO₂系数：0.6 kg/kWh（全球平均）</li>
                  <li>待机耗电：0.003 kWh/天（手机）</li>
                </ul>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">🔋 电池容量来源</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>各品牌官网参数</li>
                  <li>第三方评测数据</li>
                  <li>用户实测数据</li>
                  <li>AccuBattery App参考</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">💰 电价参考</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>默认电价：1.5 USD/kWh（香港/美国平均）</li>
                <li>用户可自定义电价</li>
                <li>电价保存在本地 localStorage</li>
              </ul>
            </div>
          </div>
          
          {/* 隐私声明 */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4 text-green-600">隐私声明</h2>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>所有数据保存在您的浏览器本地（localStorage）</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>不收集任何个人数据</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>不使用任何后端服务器</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>不依赖任何第三方API</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>清除浏览器数据将删除所有保存的家电信息</span>
              </div>
            </div>
          </div>
          
          {/* 免责声明 */}
          <div className="card border-2 border-yellow-400">
            <h2 className="text-xl font-bold mb-4 text-yellow-600 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              ⚠️ 免责声明
            </h2>
            <div className="space-y-2 text-sm">
              <p>1. 所有计算结果均为估算值，仅供参考</p>
              <p>2. 实际耗电量可能因使用习惯、环境温度、设备老化等因素而有所不同</p>
              <p>3. 不同地区电价差异较大，请根据实际电价调整</p>
              <p>4. 电池容量数据来源于公开资料，可能与实际值存在偏差</p>
              <p>5. CO₂排放系数为全球平均值，不同地区实际排放系数可能不同</p>
              <p>6. 本工具不提供任何商业或法律保证</p>
            </div>
          </div>
          
          {/* 技术栈 */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">技术栈</h2>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">Next.js 14</span>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">React 18</span>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">TypeScript</span>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">Tailwind CSS</span>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">Chart.js</span>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">dayjs</span>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">Lucide React</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
