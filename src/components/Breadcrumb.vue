<template>
  <div class="breadcrumbs text-sm mb-4">
    <ul>
      <li>
        <router-link to="/" class="link link-hover">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          首页
        </router-link>
      </li>
      <li v-if="currentRoute !== 'Home'">
        <span>{{ currentRouteName }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const currentRoute = computed(() => route.name as string)

const currentRouteName = computed(() => {
  const names: Record<string, string> = {
    'Instant': '即时耗电计算',
    'Phone': '手机累计计算',
    'Cumulative': '家电累计计算',
    'Results': '批量汇总',
    'About': '关于'
  }
  return names[currentRoute.value] || currentRoute.value
})
</script>
