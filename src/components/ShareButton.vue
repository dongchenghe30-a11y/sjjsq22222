<template>
  <div class="dropdown dropdown-end">
    <label tabindex="0" class="btn btn-sm gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
      分享
    </label>
    <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52">
      <li>
        <a @click="copyText">
          复制文本
          <span v-if="copied" class="badge badge-success badge-xs">已复制</span>
        </a>
      </li>
      <li><a @click="shareToTwitter" class="flex items-center gap-2">
        <span class="text-blue-400">𝕏</span> 分享到Twitter
      </a></li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  kWh: number
  cost: number
  co2: number
  applianceName?: string
}>()

const copied = ref(false)

const generateShareText = () => {
  const lines = [
    '📱 电耗计算器结果',
    props.applianceName ? `家电: ${props.applianceName}` : '',
    `累计耗电: ${props.kWh.toFixed(3)} kWh`,
    `电费: $${props.cost.toFixed(2)}`,
    `碳排放: ${props.co2.toFixed(2)} kg CO2`,
    '',
    '立即计算你的家电耗电: '
  ].filter(Boolean).join('\n')
  
  return lines
}

const copyText = async () => {
  try {
    await navigator.clipboard.writeText(generateShareText())
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (error) {
    console.error('Copy failed:', error)
  }
}

const shareToTwitter = () => {
  const text = encodeURIComponent(`我的${props.applianceName || '家电'}累计用电 ${props.kWh.toFixed(2)} kWh，电费 $${props.cost.toFixed(2)}，碳排放 ${props.co2.toFixed(2)} kg CO2。用免费工具计算你的家电耗电吧！`)
  window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
}
</script>
