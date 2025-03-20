<template>
  <minecraft-layout>
    <template #title>像素跑步计时器</template>
    
    <template #controls>
      <button class="minecraft-button" @click="startRun" :disabled="isRunning">
        开始跑步
      </button>
      <button class="minecraft-button" @click="pauseRun" :disabled="!isRunning">
        暂停
      </button>
      <button class="minecraft-button" @click="resetRun" :disabled="isRunning">
        重置
      </button>
    </template>

    <div class="running-timer-container">
      <!-- 添加top-panel类 -->
      <div class="top-panel">
        <!-- 计时显示 -->
        <div class="stat-displays">
          <div class="minecraft-display time">
            {{ formatTime }}
          </div>
          <div class="minecraft-display speed">
            {{ currentSpeed }} km/h
          </div>
        </div>

        <!-- 统计面板 -->
        <div class="stats-panel" v-if="!isRunning">
          <div class="setting-item">
            <label class="minecraft-label">目标距离（公里）</label>
            <input type="number" 
                  v-model="targetDistance" 
                  class="minecraft-input"
                  min="1" 
                  max="42" />
          </div>
          
          <!-- 成就展示 -->
          <div class="achievements">
            <div class="achievement-row">
              <div class="achievement-icon" 
                  :class="{ 'unlocked': bestTimes.fiveKm > 0 }">5K</div>
              <span v-if="bestTimes.fiveKm > 0">{{ formatBestTime(bestTimes.fiveKm) }}</span>
              <span v-else>未解锁</span>
            </div>
            <div class="achievement-row">
              <div class="achievement-icon"
                  :class="{ 'unlocked': bestTimes.tenKm > 0 }">10K</div>
              <span v-if="bestTimes.tenKm > 0">{{ formatBestTime(bestTimes.tenKm) }}</span>
              <span v-else>未解锁</span>
            </div>
            <div class="achievement-row">
              <div class="achievement-icon"
                  :class="{ 'unlocked': bestTimes.halfMarathon > 0 }">半马</div>
              <span v-if="bestTimes.halfMarathon > 0">{{ formatBestTime(bestTimes.halfMarathon) }}</span>
              <span v-else>未解锁</span>
            </div>
            <div class="achievement-row">
              <div class="achievement-icon"
                  :class="{ 'unlocked': bestTimes.marathon > 0 }">全马</div>
              <span v-if="bestTimes.marathon > 0">{{ formatBestTime(bestTimes.marathon) }}</span>
              <span v-else>未解锁</span>
            </div>
          </div>
        </div>

        <!-- 进度条 -->
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${distance}%` }"></div>
          <div class="milestone" v-for="milestone in milestones" :key="milestone.distance"
              :style="{ left: `${milestone.distance}%` }"
              :class="{ 'reached': distance >= milestone.distance }">
            <div class="milestone-label">{{ milestone.label }}</div>
          </div>
        </div>
      </div>
      
      <!-- 跑步场景 - 添加bottom-animation类 -->
      <div class="running-scene bottom-animation">
        <!-- 背景层 -->
        <div class="sky-layer"></div>
        <div class="clouds-layer">
          <div v-for="n in 5" :key="n" 
               class="cloud"
               :style="{ 
                 '--x': `${n * 20}%`, 
                 '--delay': `${n * 5}s`,
                 '--speed': `${20 + n * 5}s`
               }">
          </div>
        </div>
        <div class="ground-layer"></div>
        <div class="track-layer"></div>
        
        <!-- 赛道标记 -->
        <div class="track-markings">
          <div v-for="n in 10" :key="n" 
               class="track-mark"
               :style="{ '--x': `${n * 10}%` }">
          </div>
        </div>

        <!-- 跑步者 -->
        <div class="runner" :class="{ 'running': isRunning, 'tired': distance > 80 }">
          <div class="runner-body">
            <div class="head"></div>
            <div class="torso"></div>
            <div class="arm left"></div>
            <div class="arm right"></div>
            <div class="leg left"></div>
            <div class="leg right"></div>
          </div>
          
          <!-- 汗水粒子 -->
          <div class="sweat-particles" v-if="isRunning && distance > 50">
            <div v-for="n in 3" :key="n" 
                 class="sweat"
                 :style="{ '--delay': `${n * 0.3}s` }">
            </div>
          </div>
        </div>

        <!-- 距离指示器 -->
        <div class="distance-marker" :style="{ '--x': `${distance}%` }">
          <div class="marker-flag"></div>
          <div class="marker-label">{{ distanceFormat }}</div>
        </div>
      </div>
    </div>
  </minecraft-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MinecraftLayout from '../../layout/MinecraftLayout.vue'

// 里程碑
const milestones = [
  { distance: 25, label: '5公里' },
  { distance: 50, label: '10公里' },
  { distance: 75, label: '半程马拉松' },
  { distance: 100, label: '全程马拉松' }
]

// 状态变量
const isRunning = ref(false)
const elapsedTime = ref(0)
const distance = ref(0)
const targetDistance = ref(10)
const currentSpeed = ref(0)
const bestTimes = ref({
  fiveKm: 0,
  tenKm: 0,
  halfMarathon: 0,
  marathon: 0
})
let runInterval: number | null = null

// 计算属性
const formatTime = computed(() => {
  const hours = Math.floor(elapsedTime.value / 3600)
  const minutes = Math.floor((elapsedTime.value % 3600) / 60)
  const seconds = elapsedTime.value % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const distanceFormat = computed(() => {
  const km = (distance.value / 100) * targetDistance.value
  return `${km.toFixed(2)} 公里`
})

// 方法
function startRun() {
  if (isRunning.value) return
  
  isRunning.value = true
  
  if (!runInterval) {
    runInterval = window.setInterval(() => {
      elapsedTime.value++
      updateRun()
      checkMilestones()
    }, 1000)
  }
}

function updateRun() {
  // 模拟速度变化 - 开始较快，中间稳定，后面疲劳
  let speedFactor = 1
  if (distance.value < 20) {
    speedFactor = 1.2 // 开始冲刺
  } else if (distance.value > 80) {
    speedFactor = 0.8 // 后期疲劳
  }
  
  // 计算当前速度 (km/h)
  const distanceIncrement = (targetDistance.value / 100) * speedFactor / 360 // 每秒增加的距离
  distance.value = Math.min(100, distance.value + distanceIncrement * 100)
  currentSpeed.value = parseFloat((distanceIncrement * 3600).toFixed(1))
  
  // 检查是否完成
  if (distance.value >= 100) {
    completeRun()
  }
}

function checkMilestones() {
  // 检查并记录最佳时间
  if (distance.value >= 25 && (bestTimes.value.fiveKm === 0 || elapsedTime.value < bestTimes.value.fiveKm)) {
    bestTimes.value.fiveKm = elapsedTime.value
    createBreakParticles()
  }
  
  if (distance.value >= 50 && (bestTimes.value.tenKm === 0 || elapsedTime.value < bestTimes.value.tenKm)) {
    bestTimes.value.tenKm = elapsedTime.value
    createBreakParticles()
  }
  
  if (distance.value >= 75 && (bestTimes.value.halfMarathon === 0 || elapsedTime.value < bestTimes.value.halfMarathon)) {
    bestTimes.value.halfMarathon = elapsedTime.value
    createBreakParticles()
  }
  
  if (distance.value >= 100 && (bestTimes.value.marathon === 0 || elapsedTime.value < bestTimes.value.marathon)) {
    bestTimes.value.marathon = elapsedTime.value
    createBreakParticles()
  }
}

function pauseRun() {
  isRunning.value = false
  if (runInterval) {
    clearInterval(runInterval)
    runInterval = null
  }
}

function resetRun() {
  pauseRun()
  elapsedTime.value = 0
  distance.value = 0
  currentSpeed.value = 0
}

function completeRun() {
  pauseRun()
  createBreakParticles()
}

function formatBestTime(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
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
.running-scene.bottom-animation {
  order: 2;
}

.top-panel {
  order: 1;
  width: 100%;
}

.running-timer-container {
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
  color: #64B5F6;
  font-size: 1.5rem;
}

.minecraft-display.speed {
  color: #4CAF50;
  font-size: 1.5rem;
}

.stats-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.8);
  border: 2px solid #404040;
  width: 100%;
  max-width: 400px;
  margin-bottom: 1rem;
}

.progress-bar {
  width: 100%;
  height: 16px;
  background-color: #424242;
  border: 2px solid #616161;
  position: relative;
  margin-bottom: 2rem;
}

.running-scene {
  width: 100%;
  height: 300px;
  position: relative;
  overflow: hidden;
  margin-top: 1rem;
}

.sky-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60%;
  background-color: #64B5F6;
  background-image: linear-gradient(to bottom, #1976D2, #64B5F6);
}

.clouds-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40%;
  z-index: 1;
}

.cloud {
  position: absolute;
  left: var(--x);
  top: calc(20% + var(--y, 0%));
  width: 48px;
  height: 24px;
  background-color: white;
  border-radius: 12px;
  animation: cloud-move var(--speed, 20s) linear infinite;
  animation-delay: var(--delay, 0s);
}

.cloud::before,
.cloud::after {
  content: '';
  position: absolute;
  background-color: white;
  border-radius: 50%;
}

.cloud::before {
  width: 16px;
  height: 16px;
  top: -8px;
  left: 12px;
}

.cloud::after {
  width: 24px;
  height: 24px;
  top: -10px;
  left: 22px;
}

@keyframes cloud-move {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-120%);
  }
}

.ground-layer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40%;
  background-color: #8BC34A;
  image-rendering: pixelated;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAPElEQVQYlWNgQAP/////z4AJGBkZGRnRJZmQOYyMjP8ZGBj+MyADdD4jAyYgzgADjOgSyIpwagAA/l4mmE8ky4IAAAAASUVORK5CYII=');
  background-repeat: repeat;
}

.track-layer {
  position: absolute;
  bottom: 10%;
  left: 0;
  width: 100%;
  height: 16%;
  background-color: #A1887F;
}

.track-markings {
  position: absolute;
  bottom: 18%;
  left: 0;
  width: 100%;
  height: 4px;
  z-index: 2;
}

.track-mark {
  position: absolute;
  left: var(--x);
  width: 16px;
  height: 4px;
  background-color: white;
}

.runner {
  position: absolute;
  bottom: 26%;
  left: 20%;
  width: 32px;
  height: 48px;
  z-index: 3;
}

.runner-body {
  position: relative;
  width: 100%;
  height: 100%;
}

.head {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 16px;
  background-color: #FFA726;
  border: 2px solid #F57C00;
}

.torso {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 16px;
  background-color: #F44336;
  border: 2px solid #D32F2F;
}

.arm {
  position: absolute;
  top: 20px;
  width: 12px;
  height: 4px;
  background-color: #FFA726;
  border: 1px solid #F57C00;
}

.arm.left {
  left: 2px;
  transform-origin: left center;
}

.arm.right {
  right: 2px;
  transform-origin: right center;
}

.leg {
  position: absolute;
  top: 32px;
  width: 4px;
  height: 16px;
  background-color: #3F51B5;
  border: 1px solid #303F9F;
}

.leg.left {
  left: 8px;
  transform-origin: top center;
}

.leg.right {
  right: 8px;
  transform-origin: top center;
}

.runner.running .arm.left {
  animation: arm-swing-left 0.5s infinite alternate;
}

.runner.running .arm.right {
  animation: arm-swing-right 0.5s infinite alternate;
}

.runner.running .leg.left {
  animation: leg-swing-left 0.5s infinite alternate;
}

.runner.running .leg.right {
  animation: leg-swing-right 0.5s infinite alternate;
}

@keyframes arm-swing-left {
  0% {
    transform: rotate(-30deg);
  }
  100% {
    transform: rotate(30deg);
  }
}

@keyframes arm-swing-right {
  0% {
    transform: rotate(30deg);
  }
  100% {
    transform: rotate(-30deg);
  }
}

@keyframes leg-swing-left {
  0% {
    transform: rotate(-20deg);
  }
  100% {
    transform: rotate(20deg);
  }
}

@keyframes leg-swing-right {
  0% {
    transform: rotate(20deg);
  }
  100% {
    transform: rotate(-20deg);
  }
}

.runner.tired .arm.left,
.runner.tired .arm.right,
.runner.tired .leg.left,
.runner.tired .leg.right {
  animation-duration: 0.8s; /* 疲劳时动作变慢 */
}

.sweat {
  position: absolute;
  top: 8px;
  left: 16px;
  width: 4px;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  animation: sweat-drop 1s infinite;
  animation-delay: var(--delay);
}

@keyframes sweat-drop {
  0% {
    transform: translate(0, 0);
    opacity: 0.7;
  }
  100% {
    transform: translate(-10px, 20px);
    opacity: 0;
  }
}

.distance-marker {
  position: absolute;
  bottom: 30%;
  left: var(--x);
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
}

.marker-flag {
  width: 4px;
  height: 24px;
  background-color: #F44336;
}

.marker-label {
  margin-top: 4px;
  font-size: 12px;
  color: white;
  text-shadow: 1px 1px 0 #000000;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 2px 4px;
}

.achievements {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.achievement-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.achievement-icon {
  width: 32px;
  height: 32px;
  background-color: #424242;
  border: 2px solid #616161;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #AAAAAA;
}

.achievement-icon.unlocked {
  background-color: #FFD700;
  border-color: #FFA000;
  color: #000000;
}

.progress-fill {
  height: 100%;
  background-color: #4CAF50;
  transition: width 0.3s ease-out;
}

.milestone {
  position: absolute;
  top: -24px;
  width: 4px;
  height: 24px;
  background-color: #AAAAAA;
}

.milestone.reached {
  background-color: #FFD700;
}

.milestone-label {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  white-space: nowrap;
  color: #AAAAAA;
}

.milestone.reached .milestone-label {
  color: #FFD700;
}
</style> 