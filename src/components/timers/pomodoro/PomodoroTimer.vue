<template>
  <pixel-layout>
    <template #title>像素番茄钟</template>
    
    <template #controls>
      <button class="pixel-button" @click="startTimer" :disabled="isRunning">
        开始
      </button>
      <button class="pixel-button red" @click="stopTimer" :disabled="!isRunning">
        停止
      </button>
      <button class="pixel-button" @click="resetTimer" :disabled="isRunning">
        重置
      </button>
    </template>

    <!-- 主要内容 -->
    <div class="pomodoro-container">
      <!-- 番茄状态显示 -->
      <div class="tomato-display">
        <div class="tomato" :class="{ 'tomato-active': isRunning }">
          <div class="tomato-body"></div>
          <div class="tomato-leaf"></div>
          <div class="tomato-shine"></div>
        </div>
      </div>

      <!-- 时间显示 -->
      <div class="pixel-display">{{ formatTime }}</div>

      <!-- 状态显示 -->
      <div class="pixel-label">{{ currentPhase }}</div>

      <!-- 设置区域 -->
      <div class="settings-container" v-if="!isRunning">
        <div class="setting-item">
          <label class="pixel-label">工作时间 (分钟)</label>
          <input type="number" v-model="workDuration" class="pixel-input" min="1" max="60" />
        </div>
        <div class="setting-item">
          <label class="pixel-label">休息时间 (分钟)</label>
          <input type="number" v-model="breakDuration" class="pixel-input" min="1" max="30" />
        </div>
      </div>
    </div>
  </pixel-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PixelLayout from '../../layout/PixelLayout.vue'

// 状态变量
const isRunning = ref(false)
const timeLeft = ref(25 * 60) // 默认25分钟
const isWorkPhase = ref(true)
const workDuration = ref(25)
const breakDuration = ref(5)
let timerInterval: number | null = null

// 计算属性
const formatTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const currentPhase = computed(() => {
  return isWorkPhase.value ? '工作中...' : '休息中...'
})

// 方法
function startTimer() {
  if (isRunning.value) return
  
  isRunning.value = true
  if (!timerInterval) {
    timerInterval = window.setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
      } else {
        // 切换阶段
        isWorkPhase.value = !isWorkPhase.value
        timeLeft.value = (isWorkPhase.value ? workDuration.value : breakDuration.value) * 60
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
  isWorkPhase.value = true
  timeLeft.value = workDuration.value * 60
}
</script>

<style scoped>
.pomodoro-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  padding: 20px;
}

.tomato-display {
  width: 120px;
  height: 120px;
  position: relative;
}

.tomato {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  image-rendering: pixelated;
}

.tomato-body {
  width: 64px;
  height: 64px;
  background-color: #FF6B6B;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  clip-path: polygon(
    0% 25%,
    25% 0%,
    75% 0%,
    100% 25%,
    100% 75%,
    75% 100%,
    25% 100%,
    0% 75%
  );
  border: 4px solid #E74C3C;
  box-shadow: 
    inset -4px -4px 0 #D63031,
    inset 4px 4px 0 #FF8787;
}

.tomato-leaf {
  width: 24px;
  height: 12px;
  background-color: #27AE60;
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  clip-path: polygon(0% 100%, 50% 0%, 100% 100%);
  border: 2px solid #219A52;
  box-shadow: 
    inset -2px -2px 0 #1E8449,
    inset 2px 2px 0 #2ECC71;
}

.tomato-shine {
  width: 12px;
  height: 12px;
  background-color: rgba(255, 255, 255, 0.6);
  position: absolute;
  top: 40%;
  left: 60%;
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
}

.tomato-active {
  animation: tomato-bounce 0.5s infinite alternate;
}

@keyframes tomato-bounce {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-10px);
  }
}

.settings-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.3);
  border: 2px solid #3A3A3A;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style> 