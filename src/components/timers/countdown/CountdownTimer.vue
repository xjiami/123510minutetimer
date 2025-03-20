<template>
  <pixel-layout>
    <template #title>像素倒计时</template>
    
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
    <div class="countdown-container">
      <!-- 时钟显示 -->
      <div class="clock-display">
        <div class="clock" :class="{ 'clock-active': isRunning }">
          <div class="clock-face">
            <div class="clock-center"></div>
            <div class="clock-hand hour-hand" :style="hourHandStyle"></div>
            <div class="clock-hand minute-hand" :style="minuteHandStyle"></div>
            <div class="clock-hand second-hand" :style="secondHandStyle"></div>
            <div class="clock-marks">
              <div v-for="n in 12" :key="n" class="clock-mark"
                   :style="{ transform: `rotate(${n * 30}deg)` }">
                <div class="mark-line"></div>
                <div class="mark-number">{{ n }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 时间显示 -->
      <div class="pixel-display">{{ formatTime }}</div>

      <!-- 设置区域 -->
      <div class="settings-container" v-if="!isRunning">
        <div class="setting-item">
          <label class="pixel-label">小时</label>
          <input type="number" v-model="hours" class="pixel-input" min="0" max="23" />
        </div>
        <div class="setting-item">
          <label class="pixel-label">分钟</label>
          <input type="number" v-model="minutes" class="pixel-input" min="0" max="59" />
        </div>
        <div class="setting-item">
          <label class="pixel-label">秒钟</label>
          <input type="number" v-model="seconds" class="pixel-input" min="0" max="59" />
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
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)
const timeLeft = ref(0)
let timerInterval: number | null = null

// 计算属性
const formatTime = computed(() => {
  const h = Math.floor(timeLeft.value / 3600)
  const m = Math.floor((timeLeft.value % 3600) / 60)
  const s = timeLeft.value % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
})

// 时钟指针样式
const hourHandStyle = computed(() => {
  const h = Math.floor(timeLeft.value / 3600)
  const m = Math.floor((timeLeft.value % 3600) / 60)
  const deg = (h % 12 + m / 60) * 30
  return { transform: `rotate(${deg}deg)` }
})

const minuteHandStyle = computed(() => {
  const m = Math.floor((timeLeft.value % 3600) / 60)
  const s = timeLeft.value % 60
  const deg = (m + s / 60) * 6
  return { transform: `rotate(${deg}deg)` }
})

const secondHandStyle = computed(() => {
  const s = timeLeft.value % 60
  const deg = s * 6
  return { transform: `rotate(${deg}deg)` }
})

// 方法
function startTimer() {
  if (isRunning.value) return
  
  if (timeLeft.value === 0) {
    timeLeft.value = hours.value * 3600 + minutes.value * 60 + seconds.value
  }
  
  isRunning.value = true
  if (!timerInterval) {
    timerInterval = window.setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
      } else {
        stopTimer()
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
  timeLeft.value = hours.value * 3600 + minutes.value * 60 + seconds.value
}
</script>

<style scoped>
.countdown-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  padding: 20px;
}

.clock-display {
  width: 240px;
  height: 240px;
  position: relative;
  image-rendering: pixelated;
}

.clock {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #1a1a1a;
  border: 4px solid #3A3A3A;
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
  box-shadow: 
    inset -4px -4px 0 #000,
    inset 4px 4px 0 #555;
}

.clock-face {
  width: 100%;
  height: 100%;
  position: relative;
}

.clock-center {
  position: absolute;
  width: 16px;
  height: 16px;
  background-color: #5AC54F;
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
  border: 2px solid #458B3B;
  z-index: 10;
}

.clock-hand {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: left center;
  height: 4px;
  background-color: #5AC54F;
  border: 1px solid #458B3B;
}

.hour-hand {
  width: 60px;
  z-index: 8;
  clip-path: polygon(0% 0%, 100% 25%, 100% 75%, 0% 100%);
}

.minute-hand {
  width: 80px;
  height: 3px;
  z-index: 7;
  clip-path: polygon(0% 0%, 100% 25%, 100% 75%, 0% 100%);
}

.second-hand {
  width: 90px;
  height: 2px;
  background-color: #FF4500;
  border-color: #CC3700;
  z-index: 6;
  clip-path: polygon(0% 0%, 100% 25%, 100% 75%, 0% 100%);
}

.clock-marks {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.clock-mark {
  position: absolute;
  width: 100%;
  height: 100%;
  transform-origin: center;
}

.mark-line {
  position: absolute;
  top: 10px;
  left: 50%;
  width: 2px;
  height: 10px;
  background-color: #5AC54F;
  transform: translateX(-50%);
}

.mark-number {
  position: absolute;
  top: 25px;
  left: 50%;
  transform: translateX(-50%);
  color: #5AC54F;
  font-family: 'Minecraft', monospace;
  font-size: 14px;
  text-shadow: 1px 1px 0 #000;
}

.clock-active .second-hand {
  transition: transform 0.2s steps(60);
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

/* 继承基础布局的像素风格类 */
</style> 