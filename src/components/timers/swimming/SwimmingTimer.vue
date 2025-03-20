<template>
  <minecraft-layout>
    <template #title>像素游泳计时器</template>
    
    <template #controls>
      <button class="minecraft-button" @click="startSwim" :disabled="isRunning">
        开始游泳
      </button>
      <button class="minecraft-button" @click="pauseSwim" :disabled="!isRunning">
        暂停
      </button>
      <button class="minecraft-button" @click="resetSwim" :disabled="isRunning">
        重置
      </button>
    </template>

    <div class="swimming-timer-container">
      <!-- 添加top-panel类 -->
      <div class="top-panel">
        <!-- 计时显示 -->
        <div class="stat-displays">
          <div class="minecraft-display time">
            {{ formatTime }}
          </div>
          <div class="minecraft-display laps">
            {{ laps }} 趟
          </div>
        </div>

        <!-- 配置面板 -->
        <div class="config-panel" v-if="!isRunning">
          <div class="setting-item">
            <label class="minecraft-label">游泳池长度（米）</label>
            <select v-model="poolLength" class="minecraft-input">
              <option value="25">25米</option>
              <option value="50">50米</option>
            </select>
          </div>
          <div class="setting-item">
            <label class="minecraft-label">目标趟数</label>
            <input type="number" 
                   v-model="targetLaps" 
                   class="minecraft-input"
                   min="2" 
                   max="40" />
          </div>
          
          <!-- 泳姿选择 -->
          <div class="stroke-selector">
            <button class="minecraft-button" 
                    :class="{ active: stroke === 'freestyle' }"
                    @click="setStroke('freestyle')">
              自由泳
            </button>
            <button class="minecraft-button"
                    :class="{ active: stroke === 'breaststroke' }"
                    @click="setStroke('breaststroke')">
              蛙泳
            </button>
            <button class="minecraft-button"
                    :class="{ active: stroke === 'butterfly' }"
                    @click="setStroke('butterfly')">
              蝶泳
            </button>
            <button class="minecraft-button"
                    :class="{ active: stroke === 'backstroke' }"
                    @click="setStroke('backstroke')">
              仰泳
            </button>
          </div>
        </div>

        <!-- 记录面板 -->
        <div class="records-panel" v-if="lapTimes.length > 0">
          <h3 class="minecraft-label">单趟记录</h3>
          <div class="lap-records">
            <div v-for="(time, index) in lapTimes" :key="index" 
                 class="lap-record"
                 :class="{ 'best-lap': time === bestLapTime }">
              <span>趟 {{ index + 1 }}</span>
              <span>{{ formatLapTime(time) }}</span>
            </div>
          </div>
        </div>

        <!-- 进度条 -->
        <div class="progress-container">
          <div class="lap-counter">
            <span>剩余: {{ targetLaps - laps }} 趟</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${(laps / targetLaps) * 100}%` }"></div>
          </div>
        </div>
      </div>
      
      <!-- 游泳池场景 - 添加bottom-animation类 -->
      <div class="pool-scene bottom-animation">
        <!-- 水面层 -->
        <div class="water-surface">
          <div class="wave-overlay"></div>
        </div>
        
        <!-- 泳道 -->
        <div class="lanes-container">
          <div v-for="n in 3" :key="n" class="lane-divider" :style="{ '--lane': n }"></div>
        </div>
        
        <!-- 泳池刻度 -->
        <div class="pool-markings">
          <div v-for="n in 10" :key="n" 
               class="distance-mark"
               :style="{ '--x': `${n * 10}%` }">
            <span class="mark-label">{{ n * 5 }}m</span>
          </div>
        </div>
        
        <!-- 游泳者 -->
        <div class="swimmer" 
             :class="{ 'swimming': isRunning, 'returning': isReturning }"
             :style="{ '--progress': progress + '%', '--lane': 2 }">
          <div class="swimmer-body">
            <div class="head"></div>
            <div class="body"></div>
            <div class="arm left"></div>
            <div class="arm right"></div>
            <div class="leg left"></div>
            <div class="leg right"></div>
          </div>
          
          <!-- 水花效果 -->
          <div class="splash-particles" v-if="isRunning">
            <div v-for="n in 5" :key="n" 
                 class="splash"
                 :style="{ '--delay': `${n * 0.1}s` }">
            </div>
          </div>
          
          <!-- 气泡效果 -->
          <div class="bubble-particles" v-if="isRunning">
            <div v-for="n in 3" :key="n" 
                 class="bubble"
                 :style="{ '--delay': `${n * 0.3}s` }">
            </div>
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
const isReturning = ref(false)
const elapsedTime = ref(0)
const progress = ref(0)
const laps = ref(0)
const poolLength = ref(25)
const targetLaps = ref(10)
const stroke = ref('freestyle')
const lapTimes = ref<number[]>([])
const currentLapStartTime = ref(0)
let swimInterval: number | null = null

// 计算属性
const formatTime = computed(() => {
  const minutes = Math.floor(elapsedTime.value / 60)
  const seconds = elapsedTime.value % 60
  const milliseconds = Math.floor((elapsedTime.value % 1) * 100)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`
})

const bestLapTime = computed(() => {
  if (lapTimes.value.length === 0) return 0
  return Math.min(...lapTimes.value)
})

// 方法
function startSwim() {
  if (isRunning.value) return
  
  isRunning.value = true
  
  if (laps.value === 0) {
    currentLapStartTime.value = elapsedTime.value
  }
  
  if (!swimInterval) {
    swimInterval = window.setInterval(() => {
      elapsedTime.value += 0.1
      updateSwim()
    }, 100)
  }
}

function updateSwim() {
  // 计算进度，每趟从0到100再回到0
  let speedFactor = 1
  
  switch (stroke.value) {
    case 'freestyle':
      speedFactor = 1.2
      break
    case 'breaststroke':
      speedFactor = 0.8
      break
    case 'butterfly':
      speedFactor = 1.0
      break
    case 'backstroke':
      speedFactor = 0.9
      break
  }
  
  // 模拟疲劳
  if (laps.value > targetLaps.value * 0.7) {
    speedFactor *= 0.8
  }
  
  // 计算进度增量
  const progressIncrement = speedFactor * 2 // 每0.1秒增加的进度百分比
  
  if (!isReturning.value) {
    // 往前游
    progress.value += progressIncrement
    if (progress.value >= 100) {
      // 碰壁，转向
      progress.value = 100
      isReturning.value = true
    }
  } else {
    // 往回游
    progress.value -= progressIncrement
    if (progress.value <= 0) {
      // 完成一趟
      progress.value = 0
      isReturning.value = false
      laps.value++
      
      // 记录单趟时间
      const lapTime = elapsedTime.value - currentLapStartTime.value
      lapTimes.value.push(lapTime)
      currentLapStartTime.value = elapsedTime.value
      
      // 检查是否完成全部趟数
      if (laps.value >= targetLaps.value) {
        completeSwim()
      } else {
        // 创建粒子效果表示完成一趟
        createBreakParticles()
      }
    }
  }
}

function pauseSwim() {
  isRunning.value = false
  if (swimInterval) {
    clearInterval(swimInterval)
    swimInterval = null
  }
}

function resetSwim() {
  pauseSwim()
  elapsedTime.value = 0
  progress.value = 0
  laps.value = 0
  isReturning.value = false
  lapTimes.value = []
  currentLapStartTime.value = 0
}

function completeSwim() {
  pauseSwim()
  createBreakParticles()
}

function setStroke(newStroke: string) {
  stroke.value = newStroke
}

function formatLapTime(time: number) {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  const milliseconds = Math.floor((time % 1) * 100)
  return `${minutes > 0 ? minutes + ":" : ""}${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`
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
.pool-scene.bottom-animation {
  order: 2;
}

.top-panel {
  order: 1;
  width: 100%;
}

.swimming-timer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
}

.stat-displays {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
}

.minecraft-display.time {
  color: #039BE5;
  font-size: 1.5rem;
}

.minecraft-display.laps {
  color: #4CAF50;
  font-size: 1.5rem;
}

.config-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.8);
  border: 2px solid #404040;
  width: 100%;
  max-width: 500px;
  margin-bottom: 1rem;
}

.stroke-selector {
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

.records-panel {
  width: 100%;
  max-width: 500px;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.8);
  border: 2px solid #404040;
}

.lap-records {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.lap-record {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  background-color: #424242;
  border: 1px solid #616161;
  font-size: 12px;
}

.lap-record.best-lap {
  background-color: #4CAF50;
  border-color: #388E3C;
}

.progress-container {
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.lap-counter {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #AAAAAA;
}

.progress-bar {
  width: 100%;
  height: 16px;
  background-color: #424242;
  border: 2px solid #616161;
}

.progress-fill {
  height: 100%;
  background-color: #039BE5;
  transition: width 0.3s ease-out;
}

.pool-scene {
  width: 100%;
  height: 250px;
  position: relative;
  background-color: #039BE5;
  border: 4px solid #0277BD;
  overflow: hidden;
  margin-top: 1rem;
}

.water-surface {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #039BE5;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.3);
}

.wave-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0) 50%,
    rgba(255, 255, 255, 0.1) 100%
  );
  animation: wave-move 8s linear infinite;
  pointer-events: none;
}

@keyframes wave-move {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.lanes-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.lane-divider {
  position: absolute;
  top: calc((var(--lane) * 33.33%) - 16px);
  left: 0;
  width: 100%;
  height: 4px;
  background: repeating-linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.6),
    rgba(255, 255, 255, 0.6) 20px,
    rgba(0, 0, 0, 0.1) 20px,
    rgba(0, 0, 0, 0.1) 40px
  );
}

.pool-markings {
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 100%;
  height: 20px;
}

.distance-mark {
  position: absolute;
  bottom: 0;
  left: var(--x);
  width: 2px;
  height: 20px;
  background-color: rgba(255, 255, 255, 0.8);
}

.mark-label {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: white;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
  white-space: nowrap;
}

.swimmer {
  position: absolute;
  top: calc((var(--lane) * 33.33%) - 8px);
  left: var(--progress);
  width: 48px;
  height: 24px;
  transform: translateX(-50%) scaleX(1);
}

.swimmer.returning {
  transform: translateX(-50%) scaleX(-1);
}

.swimmer-body {
  position: relative;
  width: 100%;
  height: 100%;
}

.head {
  position: absolute;
  left: 0;
  top: 4px;
  width: 12px;
  height: 12px;
  background-color: #FFA726;
  border: 2px solid #F57C00;
  border-radius: 50%;
}

.body {
  position: absolute;
  left: 10px;
  top: 8px;
  width: 24px;
  height: 8px;
  background-color: #3F51B5;
  border: 2px solid #303F9F;
}

.arm {
  position: absolute;
  width: 16px;
  height: 4px;
  background-color: #FFA726;
  border: 1px solid #F57C00;
  transform-origin: left center;
}

.arm.left {
  left: 12px;
  top: 6px;
}

.arm.right {
  left: 12px;
  top: 14px;
}

.leg {
  position: absolute;
  left: 30px;
  width: 12px;
  height: 4px;
  background-color: #FFA726;
  border: 1px solid #F57C00;
  transform-origin: left center;
}

.leg.left {
  top: 6px;
}

.leg.right {
  top: 14px;
}

.swimmer.swimming .arm.left {
  animation: swim-arm-up 0.5s infinite alternate;
}

.swimmer.swimming .arm.right {
  animation: swim-arm-down 0.5s infinite alternate;
}

.swimmer.swimming .leg.left {
  animation: swim-leg-up 0.5s infinite alternate;
}

.swimmer.swimming .leg.right {
  animation: swim-leg-down 0.5s infinite alternate;
}

@keyframes swim-arm-up {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-45deg);
  }
}

@keyframes swim-arm-down {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(45deg);
  }
}

@keyframes swim-leg-up {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-15deg);
  }
}

@keyframes swim-leg-down {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(15deg);
  }
}

.splash {
  position: absolute;
  top: 0;
  left: 12px;
  width: 8px;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: splash 0.5s infinite;
  animation-delay: var(--delay);
}

.bubble {
  position: absolute;
  top: 12px;
  left: 6px;
  width: 4px;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: bubble 1s infinite;
  animation-delay: var(--delay);
}

@keyframes splash {
  0% {
    transform: translate(0, 0) scale(0.5);
    opacity: 0.8;
  }
  100% {
    transform: translate(0, -12px) scale(1.5);
    opacity: 0;
  }
}

@keyframes bubble {
  0% {
    transform: translate(0, 0) scale(0.5);
    opacity: 0.6;
  }
  100% {
    transform: translate(-10px, -15px) scale(1.5);
    opacity: 0;
  }
}
</style> 