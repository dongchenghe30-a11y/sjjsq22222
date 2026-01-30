import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'
import Instant from '@/views/Instant.vue'
import Phone from '@/views/Phone.vue'
import Cumulative from '@/views/Cumulative.vue'
import Results from '@/views/Results.vue'
import About from '@/views/About.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '电耗计算器 - 免费估算家电耗电量、电费和碳排放',
      description: '在线计算手机、电视、冰箱等家电累计耗电量、电费和碳排放。基于电池容量和充电习惯估算，无需注册，纯前端工具。'
    }
  },
  {
    path: '/instant',
    name: 'Instant',
    component: Instant,
    meta: {
      title: '即时耗电计算 - 电耗计算器',
      description: '快速计算家电即时耗电量、电费和碳排放'
    }
  },
  {
    path: '/phone',
    name: 'Phone',
    component: Phone,
    meta: {
      title: '手机累计耗电计算 - 电耗计算器',
      description: '估算手机从购买到现在累计用了多少电、电费和碳排放'
    }
  },
  {
    path: '/cumulative',
    name: 'Cumulative',
    component: Cumulative,
    meta: {
      title: '家电累计耗电计算 - 电耗计算器',
      description: '计算电视、冰箱、空调等家电累计耗电量、电费和碳排放'
    }
  },
  {
    path: '/results',
    name: 'Results',
    component: Results,
    meta: {
      title: '批量汇总 - 电耗计算器',
      description: '查看所有家电的总耗电量、电费和碳排放统计'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: {
      title: '关于 - 电耗计算器',
      description: '了解电耗计算器的计算逻辑、数据来源和免责声明'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 更新页面标题和meta
router.afterEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  if (to.meta.description) {
    const meta = document.querySelector('meta[name="description"]')
    if (meta) {
      meta.setAttribute('content', to.meta.description as string)
    }
  }
})

export default router
