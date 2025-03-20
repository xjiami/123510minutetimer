<template>
  <minecraft-layout>
    <template #title>像素蜡烛计时器</template>
    
    <template #controls>
      <button class="minecraft-button" @click="startTimer" :disabled="isRunning">
        点燃
      </button>
      <button class="minecraft-button" @click="stopTimer" :disabled="!isRunning">
        熄灭
      </button>
      <button class="minecraft-button" @click="resetTimer" :disabled="isRunning">
        重置
      </button>
    </template>

    <div class="candle-timer-container">
      <!-- 蜡烛显示 -->
      <div class="candle-display" :class="{ 'candle-active': isRunning }">
        <div class="candle">
          <div class="flame" v-if="isRunning">
            <div class="flame-core"></div>
            <div class="flame-outer"></div>
            <div class="glow"></div>
          </div>
          <div class="wick"></div>
          <div class="candle-body">
            <div class="wax-drip" v-for="n in 3" :key="n"
                 :style="{ '--delay': `${n * 0.5}s` }">
            </div>
          </div>
          <div class="candle-holder"></div>
        </div>
      </div>

      <!-- 时间显示 -->
      <div class="minecraft-display">{{ formatTime }}</div>

      <!-- 设置区域 -->
      <div class="settings-area" v-if="!isRunning">
        <div class="setting-item">
          <label class="minecraft-label">燃烧时间（分钟）</label>
          <input type="number" 
                 v-model="duration" 
                 class="minecraft-input"
                 min="1" 
                 max="60" />
        </div>
        <div class="redstone-indicators">
          <div v-for="n in 5" :key="n"
               class="redstone-lamp"
               :class="{ active: timeLeft > (duration * 60 * (6-n) / 5) }">
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
const duration = ref(10)
const timeLeft = ref(0)
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
.candle-timer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.candle-display {
  width: 200px;
  height: 300px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.candle {
  width: 64px;
  height: 160px;
  position: relative;
}

.flame {
  position: absolute;
  top: -32px;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 32px;
  z-index: 2;
}

.flame-core {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 24px;
  background-color: #FFD700;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  animation: flicker 0.2s infinite alternate;
}

.flame-outer {
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 32px;
  background-color: #FF4500;
  opacity: 0.6;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  animation: flicker 0.3s infinite alternate;
}

.glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 32px;
  height: 32px;
  background: radial-gradient(circle, rgba(255, 69, 0, 0.4) 0%, transparent 70%);
  animation: glow 1s infinite alternate;
}

.wick {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 8px;
  background-color: #333333;
}

.candle-body {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  height: 128px;
  background-color: #FFFFFF;
  border: 4px solid #EEEEEE;
  clip-path: polygon(
    0% 0%,
    100% 0%,
    90% 100%,
    10% 100%
  );
}

.wax-drip {
  position: absolute;
  top: 0;
  left: calc(50% + var(--offset, 0px));
  width: 8px;
  height: 16px;
  background-color: rgba(255, 255, 255, 0.8);
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  animation: drip 3s infinite;
  animation-delay: var(--delay);
}

.candle-holder {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 64px;
  height: 16px;
  background-color: #666666;
  border: 4px solid #444444;
  clip-path: polygon(
    0% 0%,
    100% 0%,
    90% 100%,
    10% 100%
  );
}

@keyframes flicker {
  0% {
    transform: translateX(-50%) scaleY(1);
  }
  100% {
    transform: translateX(-50%) scaleY(0.9);
  }
}

@keyframes glow {
  0% {
    opacity: 0.4;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

@keyframes drip {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0.8;
  }
  100% {
    transform: translateY(100px) scale(0);
    opacity: 0;
  }
}

.settings-area {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.redstone-indicators {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}
</style> 