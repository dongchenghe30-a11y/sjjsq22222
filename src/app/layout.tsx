import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '电耗计算器 - 免费估算家电耗电量、电费和碳排放',
  description: '在线计算手机、电视、冰箱等家电累计耗电量、电费和碳排放。基于电池容量和充电习惯估算，无需注册，纯前端工具。',
  keywords: '电耗计算器,耗电量计算,电费计算,碳排放计算,手机耗电,家电耗电',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
