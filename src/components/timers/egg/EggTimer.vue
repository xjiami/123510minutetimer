<template>
  <minecraft-layout>
    <template #title>像素蛋计时器</template>
    
    <template #controls>
      <button class="minecraft-button" @click="startTimer" :disabled="isRunning">
        开始
      </button>
      <button class="minecraft-button" @click="stopTimer" :disabled="!isRunning">
        停止
      </button>
      <button class="minecraft-button" @click="resetTimer" :disabled="isRunning">
        重置
      </button>
    </template>

    <div class="egg-timer-container">
      <!-- 顶部控制面板 -->
      <div class="top-panel">
        <!-- 时间显示 -->
        <div class="minecraft-display">{{ formatTime }}</div>

        <!-- 设置区域 -->
        <div class="settings-area" v-if="!isRunning">
          <div class="setting-item">
            <label class="minecraft-label">煮蛋时间（分钟）</label>
            <input type="number" 
                   v-model="duration" 
                   class="minecraft-input"
                   min="1" 
                   max="30" />
          </div>
          <div class="egg-type-selector">
            <button class="minecraft-button" 
                    :class="{ active: eggType === 'soft' }"
                    @click="setEggType('soft')">
              溏心蛋
            </button>
            <button class="minecraft-button"
                    :class="{ active: eggType === 'medium' }"
                    @click="setEggType('medium')">
              半熟蛋
            </button>
            <button class="minecraft-button"
                    :class="{ active: eggType === 'hard' }"
                    @click="setEggType('hard')">
              全熟蛋
            </button>
          </div>
        </div>
      </div>

      <!-- 底部动画显示 -->
      <div class="egg-display bottom-animation" :class="{ 'egg-active': isRunning }">
        <div class="egg">
          <div class="egg-top"></div>
          <div class="egg-bottom"></div>
          <div class="egg-yolk"></div>
          <div class="egg-shine"></div>
        </div>
        <div class="cooking-plate">
          <div class="plate-surface"></div>
          <div v-for="n in 4" :key="n" 
               class="steam-particle"
               :style="{ '--delay': `${n * 0.2}s` }">
          </div>
        </div>
      </div>
    </div>
  </minecraft-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MinecraftLayout from '../../layout/MinecraftLayout.vue'

// 状态变量
const isRunning = ref(false)
const duration = ref(5)
const timeLeft = ref(0)
const eggType = ref('medium')
let timerInterval: number | null = null

// 计算属性
const formatTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// 方法
function startTimer() {
  if (isRunning.value) return
  
  timeLeft.value = duration.value * 60
  isRunning.value = true
  
  if (!timerInterval) {
    timerInterval = window.setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
      } else {
        stopTimer()
        createBreakParticles()
      }
    }, 1000)
  }
}

function stopTimer() {
  isRunning.value = false
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

function resetTimer() {
  stopTimer()
  timeLeft.value = duration.value * 60
}

function setEggType(type: 'soft' | 'medium' | 'hard') {
  eggType.value = type
  switch (type) {
    case 'soft':
      duration.value = 3
      break
    case 'medium':
      duration.value = 5
      break
    case 'hard':
      duration.value = 7
      break
  }
}

function createBreakParticles() {
  const container = document.querySelector('.particles-container')
  if (!container) return

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div')
    particle.className = 'break-particle'
    particle.style.setProperty('--x', `${(Math.random() - 0.5) * 100}px`)
    particle.style.setProperty('--y', `${(Math.random() - 0.5) * 100}px`)
    particle.style.setProperty('--r', `${Math.random() * 360}deg`)
    container.appendChild(particle)
    setTimeout(() => particle.remove(), 1000)
  }
}
</script>

<style scoped>
/* 确保顶级容器正确显示Flexbox顺序 */
.egg-display.bottom-animation {
  order: 2;
  margin-top: 2rem;
}

.top-panel {
  order: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.egg-timer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
}

.egg-display {
  width: 200px;
  height: 240px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.egg {
  width: 120px;
  height: 160px;
  position: relative;
  transform-style: preserve-3d;
}

.egg-active .egg {
  animation: egg-shake 2s infinite ease-in-out;
}

@keyframes egg-shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

.egg-top,
.egg-bottom {
  position: absolute;
  width: 100%;
  height: 50%;
  background-color: #FFFFFF;
  border: 4px solid #CCCCCC;
}

.egg-top {
  top: 0;
  border-radius: 50% 50% 0 0;
  transform: translateZ(2px);
}

.egg-bottom {
  bottom: 0;
  border-radius: 0 0 50% 50%;
  transform: translateZ(2px);
}

.egg-yolk {
  position: absolute;
  width: 40px;
  height: 40px;
  background-color: #FFD700;
  border: 4px solid #FFA500;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.egg-shine {
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  top: 30%;
  right: 30%;
}

.cooking-plate {
  position: absolute;
  bottom: 0;
  width: 160px;
  height: 20px;
}

.plate-surface {
  width: 100%;
  height: 100%;
  background-color: #666666;
  border: 4px solid #444444;
  border-radius: 4px;
}

.steam-particle {
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  bottom: 100%;
  animation: steam 2s infinite;
  animation-delay: var(--delay);
}

@keyframes steam {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0.6;
  }
  100% {
    transform: translateY(-40px) scale(2);
    opacity: 0;
  }
}

.settings-area {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.8);
  border: 2px solid #404040;
  width: 100%;
  max-width: 400px;
}

.egg-type-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.minecraft-button.active {
  background-color: #55FF55;
  border-color: #338833;
  color: #FFFFFF;
  text-shadow: 1px 1px #338833;
}
</style> 