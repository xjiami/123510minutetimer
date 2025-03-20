<template>
  <div class="winner-announcement">
    {{ $t('pickers.result') }}: <span class="winner-name">{{ winnerName }}</span>
    <audio ref="victorySound" src="/sounds/chime.mp3" preload="auto"></audio>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  winner: string
}>()

// 音效引用
const victorySound = ref<HTMLAudioElement | null>(null)

// 获取获胜者名称
const winnerName = computed(() => {
  const names: Record<string, string> = {
    brown: t('timers.puppy') + ' (' + t('settings.darkMode') + ')',
    white: t('timers.puppy') + ' (' + t('settings.lightMode') + ')',
    black: t('timers.puppy') + ' (' + t('settings.darkMode') + ')',
    spotted: t('timers.puppy') + ' (' + t('settings.theme') + ')'
  }
  return names[props.winner] || t('common.loading')
})

// 组件挂载时播放胜利音效
onMounted(() => {
  // 确保浏览器支持Audio API
  if (victorySound.value) {
    // 设置音量并播放
    victorySound.value.volume = 0.7
    victorySound.value.play().catch(error => {
      console.error('播放胜利音效失败:', error)
    })
  }
})
</script>

<style scoped>
.winner-announcement {
  margin-top: 30px;
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  color: #4285F4;
  animation: winner-pulse 2s infinite;
}

@keyframes winner-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.winner-name {
  color: #4CAF50;
  text-transform: capitalize;
}
</style> 