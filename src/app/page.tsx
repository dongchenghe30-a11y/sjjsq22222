'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* 顶部导航 */}
      <nav className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-blue-500">
              <Zap className="h-6 w-6" />
              电耗计算器
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link href="/instant" className="hover:text-blue-500 transition-colors">即时计算</Link>
              <Link href="/phone" className="hover:text-blue-500 transition-colors">手机计算</Link>
              <Link href="/cumulative" className="hover:text-blue-500 transition-colors">家电计算</Link>
              <Link href="/results" className="hover:text-blue-500 transition-colors">批量汇总</Link>
              <Link href="/about" className="hover:text-blue-500 transition-colors">关于</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 标题区 */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            电耗计算器
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            免费估算你的手机/家电用了多少度电
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            在线计算手机、电视、冰箱等家电累计耗电量、电费和碳排放。基于电池容量和充电习惯估算，无需注册，纯前端工具。
          </p>
        </div>

        {/* 功能卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* 即时计算 */}
          <Link href="/instant" className="card hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer">
            <div className="flex flex-col items-center text-center h-full">
              <div className="text-6xl mb-4">⚡</div>
              <h2 className="text-xl font-bold mb-2">即时耗电计算</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">快速查询家电即时耗电量<br/>例如：热水器200W用1小时多少度电</p>
              <span className="btn btn-primary mt-auto">开始计算</span>
            </div>
          </Link>

          {/* 手机累计 */}
          <Link href="/phone" className="card hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer">
            <div className="flex flex-col items-center text-center h-full">
              <div className="text-6xl mb-4">📱</div>
              <h2 className="text-xl font-bold mb-2">手机累计计算</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">估算手机从购买到现在<br/>累计用了多少电费</p>
              <span className="btn btn-secondary mt-auto">开始计算</span>
            </div>
          </Link>

          {/* 家电累计 */}
          <Link href="/cumulative" className="card hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer">
            <div className="flex flex-col items-center text-center h-full">
              <div className="text-6xl mb-4">🏠</div>
              <h2 className="text-xl font-bold mb-2">家电累计计算</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">计算电视、冰箱、空调等<br/>家电累计耗电量</p>
              <span className="btn btn-primary mt-auto">开始计算</span>
            </div>
          </Link>

          {/* 批量汇总 */}
          <Link href="/results" className="card hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer">
            <div className="flex flex-col items-center text-center h-full">
              <div className="text-6xl mb-4">📊</div>
              <h2 className="text-xl font-bold mb-2">批量汇总</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">查看所有家电的总耗电量<br/>电费和碳排放统计</p>
              <span className="btn btn-secondary mt-auto">查看统计</span>
            </div>
          </Link>

          {/* 关于 */}
          <Link href="/about" className="card hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer">
            <div className="flex flex-col items-center text-center h-full">
              <div className="text-6xl mb-4">ℹ️</div>
              <h2 className="text-xl font-bold mb-2">关于</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">了解计算逻辑、数据来源<br/>和免责声明</p>
              <span className="btn btn-primary mt-auto">了解更多</span>
            </div>
          </Link>
        </div>

        {/* 特性说明 */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full flex items-center gap-2">
              <Check className="h-4 w-4" />
              无需注册
            </div>
            <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-full flex items-center gap-2">
              <Check className="h-4 w-4" />
              纯前端计算
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-full flex items-center gap-2">
              <Check className="h-4 w-4" />
              数据本地存储
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-4 py-2 rounded-full flex items-center gap-2">
              <Check className="h-4 w-4" />
              支持暗黑模式
            </div>
          </div>
        </div>
      </main>

      {/* 底部 */}
      <footer className="bg-gray-200 dark:bg-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="font-bold text-lg">电耗计算器</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              免费在线工具，估算家电耗电量、电费和碳排放
            </p>
            <div className="mt-4 text-sm">
              <Link href="/about" className="text-blue-500 hover:underline">关于</Link>
              <span className="mx-2">|</span>
              <span className="text-gray-500">隐私：所有数据保存在本地浏览器</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

import { Zap, Check } from 'lucide-react'
