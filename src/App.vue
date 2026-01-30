<template>
  <div class="min-h-screen bg-base-200">
    <!-- 顶部导航 -->
    <div class="navbar bg-base-100 shadow-lg">
      <div class="navbar-start">
        <router-link to="/" class="btn btn-ghost normal-case text-xl gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          电耗计算器
        </router-link>
      </div>
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1">
          <li><router-link to="/instant">即时计算</router-link></li>
          <li><router-link to="/phone">手机计算</router-link></li>
          <li><router-link to="/cumulative">家电计算</router-link></li>
          <li><router-link to="/results">批量汇总</router-link></li>
          <li><router-link to="/about">关于</router-link></li>
        </ul>
      </div>
      <div class="navbar-end">
        <label class="swap swap-rotate btn btn-ghost btn-circle">
          <input type="checkbox" v-model="isDark" @change="toggleTheme" />
          <svg xmlns="http://www.w3.org/2000/svg" class="swap-on fill-current w-6 h-6" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/></svg>
          <svg xmlns="http://www.w3.org/2000/svg" class="swap-off fill-current w-6 h-6" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/></svg>
        </label>
      </div>
    </div>

    <!-- 移动端导航 -->
    <div class="lg:hidden navbar bg-base-100 border-b">
      <div class="flex-1">
        <ul class="menu menu-horizontal gap-1 overflow-x-auto">
          <li><router-link to="/instant" class="whitespace-nowrap">即时</router-link></li>
          <li><router-link to="/phone" class="whitespace-nowrap">手机</router-link></li>
          <li><router-link to="/cumulative" class="whitespace-nowrap">家电</router-link></li>
          <li><router-link to="/results" class="whitespace-nowrap">汇总</router-link></li>
          <li><router-link to="/about" class="whitespace-nowrap">关于</router-link></li>
        </ul>
      </div>
    </div>

    <!-- 主内容 -->
    <main class="container mx-auto px-4 py-8">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- 底部 -->
    <footer class="footer footer-center p-10 bg-base-300 text-base-content">
      <aside>
        <p class="font-bold">
          电耗计算器
          <br />
          免费在线工具，估算家电耗电量、电费和碳排放
        </p>
      </aside>
      <nav>
        <div class="grid grid-flow-col gap-4">
          <router-link to="/about" class="link link-hover">关于</router-link>
          <span class="text-sm">隐私：所有数据保存在本地浏览器</span>
        </div>
      </nav>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isDark = ref(false)

const toggleTheme = () => {
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
