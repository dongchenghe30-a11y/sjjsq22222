<template>
  <div class="text-center space-y-8">
    <!-- 标题区 -->
    <div class="space-y-4">
      <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        电耗计算器
      </h1>
      <p class="text-lg md:text-xl text-base-content/80 max-w-2xl mx-auto">
        免费估算你的手机/家电用了多少度电
      </p>
      <p class="text-sm text-base-content/60">
        在线计算手机、电视、冰箱等家电累计耗电量、电费和碳排放。基于电池容量和充电习惯估算，无需注册，纯前端工具。
      </p>
    </div>

    <!-- 功能卡片网格 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      <!-- 即时计算 -->
      <router-link to="/instant" class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer">
        <div class="card-body items-center text-center">
          <div class="text-6xl mb-4">⚡</div>
          <h2 class="card-title text-xl">即时耗电计算</h2>
          <p class="text-sm text-base-content/70">快速查询家电即时耗电量<br/>例如：热水器200W用1小时多少度电</p>
          <div class="card-actions justify-end">
            <span class="badge badge-primary">开始计算</span>
          </div>
        </div>
      </router-link>

      <!-- 手机累计 -->
      <router-link to="/phone" class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer">
        <div class="card-body items-center text-center">
          <div class="text-6xl mb-4">📱</div>
          <h2 class="card-title text-xl">手机累计计算</h2>
          <p class="text-sm text-base-content/70">估算手机从购买到现在<br/>累计用了多少电费</p>
          <div class="card-actions justify-end">
            <span class="badge badge-secondary">开始计算</span>
          </div>
        </div>
      </router-link>

      <!-- 家电累计 -->
      <router-link to="/cumulative" class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer">
        <div class="card-body items-center text-center">
          <div class="text-6xl mb-4">🏠</div>
          <h2 class="card-title text-xl">家电累计计算</h2>
          <p class="text-sm text-base-content/70">计算电视、冰箱、空调等<br/>家电累计耗电量</p>
          <div class="card-actions justify-end">
            <span class="badge badge-accent">开始计算</span>
          </div>
        </div>
      </router-link>

      <!-- 批量汇总 -->
      <router-link to="/results" class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer">
        <div class="card-body items-center text-center">
          <div class="text-6xl mb-4">📊</div>
          <h2 class="card-title text-xl">批量汇总</h2>
          <p class="text-sm text-base-content/70">查看所有家电的总耗电量<br/>电费和碳排放统计</p>
          <div class="card-actions justify-end">
            <span class="badge badge-info">查看统计</span>
          </div>
        </div>
      </router-link>

      <!-- 关于 -->
      <router-link to="/about" class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer">
        <div class="card-body items-center text-center">
          <div class="text-6xl mb-4">ℹ️</div>
          <h2 class="card-title text-xl">关于</h2>
          <p class="text-sm text-base-content/70">了解计算逻辑、数据来源<br/>和免责声明</p>
          <div class="card-actions justify-end">
            <span class="badge badge-neutral">了解更多</span>
          </div>
        </div>
      </router-link>
    </div>

    <!-- 特性说明 -->
    <div class="max-w-4xl mx-auto">
      <div class="flex flex-wrap justify-center gap-4 text-sm">
        <div class="badge badge-lg gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          无需注册
        </div>
        <div class="badge badge-lg gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          纯前端计算
        </div>
        <div class="badge badge-lg gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          数据本地存储
        </div>
        <div class="badge badge-lg gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          支持暗黑模式
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 首页不需要额外逻辑
</script>
