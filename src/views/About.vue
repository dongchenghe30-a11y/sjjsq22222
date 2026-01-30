<template>
  <div class="max-w-4xl mx-auto">
    <Breadcrumb />
    
    <h1 class="text-3xl font-bold mb-6">关于电耗计算器</h1>
    
    <div class="space-y-6">
      <!-- 简介 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">简介</h2>
          <p class="text-base-content/80">
            电耗计算器是一个免费的在线工具，帮助用户估算家电（尤其是手机）从开始使用到现在累计耗电量、电费和碳排放。
            所有计算都在浏览器端进行，无需后端服务器、无需上传文件、无需API密钥，保护用户隐私。
          </p>
        </div>
      </div>
      
      <!-- 计算逻辑 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">计算逻辑</h2>
          
          <div class="space-y-4">
            <!-- 即时计算 -->
            <div class="collapse collapse-arrow bg-base-200">
              <input type="checkbox" />
              <div class="collapse-title font-medium">
                ⚡ 即时耗电计算
              </div>
              <div class="collapse-content">
                <div class="bg-base-100 p-4 rounded-lg space-y-2">
                  <p><strong>公式：</strong></p>
                  <code class="block bg-base-300 p-2 rounded">
                    kWh = (功率W / 1000) × 使用小时数
                  </code>
                  <code class="block bg-base-300 p-2 rounded">
                    电费 = kWh × 电价
                  </code>
                  <code class="block bg-base-300 p-2 rounded">
                    CO₂ = kWh × 0.6 kg/kWh
                  </code>
                  <p class="text-sm text-base-content/60 mt-2">
                    例如：2000W热水器使用1小时 = 2 kWh，电价1.5 USD/kWh时电费 = 3 USD
                  </p>
                </div>
              </div>
            </div>
            
            <!-- 手机累计计算 -->
            <div class="collapse collapse-arrow bg-base-200">
              <input type="checkbox" checked />
              <div class="collapse-title font-medium">
                📱 手机累计耗电计算
              </div>
              <div class="collapse-content">
                <div class="bg-base-100 p-4 rounded-lg space-y-2">
                  <p><strong>计算步骤：</strong></p>
                  <p>1. 单次充电能量：</p>
                  <code class="block bg-base-300 p-2 rounded">
                    单次Wh = 电池容量(mAh) × 3.85V / 1000
                  </code>
                  <p>2. 单次充电电量：</p>
                  <code class="block bg-base-300 p-2 rounded">
                    单次kWh = 单次Wh / 1000
                  </code>
                  <p>3. 考虑充电损失（默认20%）：</p>
                  <code class="block bg-base-300 p-2 rounded">
                    实际单次kWh = 单次kWh × (1 + 损失率)
                  </code>
                  <p>4. 日均耗电（含待机）：</p>
                  <code class="block bg-base-300 p-2 rounded">
                    日均kWh = 实际单次kWh × 日均充电次数 + 0.003 kWh
                  </code>
                  <p>5. 累计耗电：</p>
                  <code class="block bg-base-300 p-2 rounded">
                    累计kWh = 日均kWh × 使用天数
                  </code>
                  <p class="text-sm text-base-content/60 mt-2">
                    待机耗电按0.003 kWh/天估算，约等于手机24小时待机耗电
                  </p>
                </div>
              </div>
            </div>
            
            <!-- 家电累计计算 -->
            <div class="collapse collapse-arrow bg-base-200">
              <input type="checkbox" />
              <div class="collapse-title font-medium">
                🏠 家电累计耗电计算
              </div>
              <div class="collapse-content">
                <div class="bg-base-100 p-4 rounded-lg space-y-2">
                  <p><strong>计算步骤：</strong></p>
                  <p>1. 日均耗电：</p>
                  <code class="block bg-base-300 p-2 rounded">
                    日均kWh = (功率W / 1000) × 日均使用小时 + 待机kWh
                  </code>
                  <p>2. 累计耗电：</p>
                  <code class="block bg-base-300 p-2 rounded">
                    累计kWh = 日均kWh × 使用天数
                  </p>
                  <p class="text-sm text-base-content/60 mt-2">
                    冰箱等电器会自动考虑待机耗电（默认0.5 kWh/天）
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 数据来源 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">数据来源</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-base-200 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">📊 参数来源</h3>
              <ul class="list-disc list-inside space-y-1 text-sm">
                <li>平均电压：3.85V（锂电池标准）</li>
                <li>充电损失：20%（充电器效率+电池老化）</li>
                <li>CO₂系数：0.6 kg/kWh（全球平均）</li>
                <li>待机耗电：0.003 kWh/天（手机）</li>
              </ul>
            </div>
            <div class="bg-base-200 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">🔋 电池容量来源</h3>
              <ul class="list-disc list-inside space-y-1 text-sm">
                <li>各品牌官网参数</li>
                <li>第三方评测数据</li>
                <li>用户实测数据</li>
                <li>AccuBattery App参考</li>
              </ul>
            </div>
          </div>
          <div class="mt-4 bg-base-200 p-4 rounded-lg">
            <h3 class="font-semibold mb-2">💰 电价参考</h3>
            <ul class="list-disc list-inside space-y-1 text-sm">
              <li>默认电价：1.5 USD/kWh（香港/美国平均）</li>
              <li>用户可自定义电价</li>
              <li>电价保存在本地 localStorage</li>
            </ul>
          </div>
        </div>
      </div>
      
      <!-- 隐私声明 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-success">隐私声明</h2>
          <div class="space-y-2">
            <div class="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-success mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>所有数据保存在您的浏览器本地（localStorage）</span>
            </div>
            <div class="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-success mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>不收集任何个人数据</span>
            </div>
            <div class="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-success mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>不使用任何后端服务器</span>
            </div>
            <div class="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-success mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>不依赖任何第三方API</span>
            </div>
            <div class="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-success mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>清除浏览器数据将删除所有保存的家电信息</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 免责声明 -->
      <div class="card bg-base-100 shadow-xl border-2 border-warning">
        <div class="card-body">
          <h2 class="card-title text-warning">⚠️ 免责声明</h2>
          <div class="space-y-2 text-sm">
            <p>1. 所有计算结果均为估算值，仅供参考</p>
            <p>2. 实际耗电量可能因使用习惯、环境温度、设备老化等因素而有所不同</p>
            <p>3. 不同地区电价差异较大，请根据实际电价调整</p>
            <p>4. 电池容量数据来源于公开资料，可能与实际值存在偏差</p>
            <p>5. CO₂排放系数为全球平均值，不同地区实际排放系数可能不同</p>
            <p>6. 本工具不提供任何商业或法律保证</p>
          </div>
        </div>
      </div>
      
      <!-- 技术栈 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">技术栈</h2>
          <div class="flex flex-wrap gap-2">
            <span class="badge badge-primary">Vue 3</span>
            <span class="badge badge-secondary">TypeScript</span>
            <span class="badge badge-accent">Tailwind CSS</span>
            <span class="badge badge-info">DaisyUI</span>
            <span class="badge badge-neutral">Vite</span>
            <span class="badge badge-success">Vue Router</span>
            <span class="badge badge-warning">Pinia</span>
            <span class="badge badge-outline">dayjs</span>
            <span class="badge badge-outline">Chart.js</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from '@/components/Breadcrumb.vue'
</script>
