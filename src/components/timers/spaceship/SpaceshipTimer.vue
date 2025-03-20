<template>
  <minecraft-layout>
    <template #title>像素宇宙飞船</template>
    
    <!-- 计时显示和控制面板 - 添加top-panel类 -->
    <div class="top-panel">
      <!-- 计时显示 -->
      <div class="minecraft-display timer-display">{{ formatTime }}</div>

      <!-- 控制面板 -->
      <div class="mission-panel" v-if="!isRunning">
        <div class="setting-item">
          <label class="minecraft-label">任务时长（分钟）</label>
          <input type="number" 
                 v-model="duration" 
                 class="minecraft-input"
                 min="1" 
                 max="60" />
        </div>
        
        <!-- 资源状态 -->
        <div class="resource-status">
          <div class="resource-bar fuel">
            <span class="minecraft-label">燃料</span>
            <div class="bar-container">
              <div class="bar-fill" :style="{ width: `${resources.fuel}%` }"></div>
            </div>
            <span>{{ resources.fuel }}%</span>
          </div>
          <div class="resource-bar oxygen">
            <span class="minecraft-label">氧气</span>
            <div class="bar-container">
              <div class="bar-fill" :style="{ width: `${resources.oxygen}%` }"></div>
            </div>
            <span>{{ resources.oxygen }}%</span>
          </div>
          <div class="resource-bar energy">
            <span class="minecraft-label">能量</span>
            <div class="bar-container">
              <div class="bar-fill" :style="{ width: `${resources.energy}%` }"></div>
            </div>
            <span>{{ resources.energy }}%</span>
          </div>
        </div>
      </div>
    </div>
    
    <template #controls>
      <button class="minecraft-button" @click="startMission" :disabled="isRunning">
        开始任务
      </button>
      <button class="minecraft-button" @click="abortMission" :disabled="!isRunning">
        终止任务
      </button>
      <button class="minecraft-button" @click="resetMission" :disabled="isRunning">
        重置
      </button>
    </template>

    <!-- 任务阶段指示器 -->
    <div class="mission-stages">
      <div v-for="(stage, index) in missionStages" :key="index"
           class="stage-block"
           :class="{ 
             'completed': missionStage > index,
             'current': missionStage === index,
             'pending': missionStage < index
           }">
        <div class="stage-icon"></div>
        <span>{{ stage }}</span>
      </div>
    </div>
    
    <!-- 太空场景 - 现在放在底部，添加bottom-animation类 -->
    <div class="spaceship-container bottom-animation">
      <div class="space-scene">
        <!-- 星空背景 -->
        <div class="star-field">
          <div v-for="n in 50" :key="n" 
               class="star"
               :style="{ 
                 '--x': `${Math.random() * 100}%`, 
                 '--y': `${Math.random() * 100}%`,
                 '--size': `${Math.random() * 3 + 1}px`,
                 '--twinkle-delay': `${Math.random() * 5}s`
               }">
          </div>
        </div>
        
        <!-- 行星 -->
        <div class="planet earth" :class="{ 'departing': missionStage > 0 }"></div>
        <div class="planet mars" :class="{ 'approaching': missionStage > 3 }"></div>
        
        <!-- 宇宙飞船 -->
        <div class="spaceship" 
             :class="{
               'launching': missionStage === 1,
               'cruising': missionStage === 2 || missionStage === 3,
               'landing': missionStage === 4
             }"
             :style="{ '--progress': progress + '%' }">
          <div class="ship-body">
            <div class="cockpit"></div>
            <div class="main-hull"></div>
            <div class="wing left"></div>
            <div class="wing right"></div>
            <div class="thruster left"></div>
            <div class="thruster right"></div>
          </div>
          
          <!-- 推进器效果 -->
          <div class="engine-effect" v-if="isRunning && missionStage !== 5">
            <div class="thrust-core"></div>
            <div class="thrust-outer"></div>
            <div v-for="n in 6" :key="n" 
                 class="thrust-particle"
                 :style="{ '--delay': `${n * 0.1}s` }">
            </div>
          </div>
        </div>

        <!-- 任务完成标志 -->
        <div class="mission-complete" v-if="missionStage === 5">
          <div class="flag"></div>
          <div class="beacon-beam"></div>
        </div>
      </div>
    </div>
  </minecraft-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MinecraftLayout from '../../layout/MinecraftLayout.vue'

// 任务阶段
const missionStages = [
  '任务准备',
  '发射升空',
  '太空飞行',
  '接近目标',
  '着陆阶段',
  '任务完成'
]

// 状态变量
const isRunning = ref(false)
const duration = ref(10)
const timeLeft = ref(0)
const progress = ref(0)
const missionStage = ref(0)
const resources = ref({
  fuel: 100,
  oxygen: 100,
  energy: 100
})
let missionInterval: number | null = null

// 计算属性
const formatTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// 方法
function startMission() {
  if (isRunning.value) return
  
  resetResources()
  timeLeft.value = duration.value * 60
  isRunning.value = true
  missionStage.value = 0
  progress.value = 0
  
  if (!missionInterval) {
    missionInterval = window.setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
        updateMission()
      } else {
        completeMission()
      }
    }, 1000)
  }
}

function resetResources() {
  resources.value = {
    fuel: 100,
    oxygen: 100,
    energy: 100
  }
}

function updateMission() {
  // 计算当前任务阶段
  const stageTime = duration.value * 60 / missionStages.length
  const currentStage = Math.min(
    Math.floor((duration.value * 60 - timeLeft.value) / stageTime),
    missionStages.length - 1
  )
  
  if (currentStage !== missionStage.value) {
    missionStage.value = currentStage
    // 播放阶段变更音效或特效
    createBreakParticles()
  }
  
  // 计算阶段内的进度
  const stageElapsed = (duration.value * 60 - timeLeft.value) % stageTime
  progress.value = Math.min(100, (stageElapsed / stageTime) * 100)
  
  // 更新资源消耗
  updateResources()
}

function updateResources() {
  // 不同阶段消耗不同资源
  switch (missionStage.value) {
    case 1: // 发射阶段消耗更多燃料
      resources.value.fuel -= 0.2
      resources.value.oxygen -= 0.05
      resources.value.energy -= 0.1
      break
    case 2: // 飞行阶段平衡消耗
      resources.value.fuel -= 0.1
      resources.value.oxygen -= 0.1
      resources.value.energy -= 0.1
      break
    case 3: // 接近阶段消耗更多能量
      resources.value.fuel -= 0.05
      resources.value.oxygen -= 0.1
      resources.value.energy -= 0.2
      break
    case 4: // 着陆阶段再次消耗更多燃料
      resources.value.fuel -= 0.15
      resources.value.oxygen -= 0.05
      resources.value.energy -= 0.15
      break
  }
  
  // 确保资源不会低于0
  resources.value.fuel = Math.max(0, resources.value.fuel)
  resources.value.oxygen = Math.max(0, resources.value.oxygen)
  resources.value.energy = Math.max(0, resources.value.energy)
  
  // 如果任何资源耗尽，任务失败
  if (resources.value.fuel <= 0 || resources.value.oxygen <= 0 || resources.value.energy <= 0) {
    abortMission()
  }
}

function abortMission() {
  isRunning.value = false
  if (missionInterval) {
    clearInterval(missionInterval)
    missionInterval = null
  }
  createBreakParticles()
}

function resetMission() {
  abortMission()
  timeLeft.value = duration.value * 60
  missionStage.value = 0
  progress.value = 0
  resetResources()
}

function completeMission() {
  isRunning.value = false
  missionStage.value = 5
  progress.value = 100
  if (missionInterval) {
    clearInterval(missionInterval)
    missionInterval = null
  }
  createBreakParticles()
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
.spaceship-container.bottom-animation {
  order: 2;
}

.top-panel {
  order: 1;
}

.spaceship-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
  margin-top: 2rem;
}

.timer-display {
  font-size: 2rem;
  margin: 1rem 0;
}

.space-scene {
  width: 100%;
  height: 400px;
  position: relative;
  background-color: #000033;
  overflow: hidden;
}

.star-field {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.star {
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: var(--size);
  height: var(--size);
  background-color: #FFFFFF;
  animation: twinkle 3s infinite alternate;
  animation-delay: var(--twinkle-delay);
}

@keyframes twinkle {
  0% {
    opacity: 0.2;
  }
  100% {
    opacity: 1;
  }
}

.planet {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  transition: all 5s ease-in-out;
}

.planet.earth {
  bottom: 10%;
  left: 10%;
  background-color: #1E88E5;
  box-shadow: inset -10px -10px 0 0 rgba(0, 0, 0, 0.3);
  /* 像素效果 */
  background-image: linear-gradient(90deg, 
    transparent 50%, rgba(255, 255, 255, 0.1) 50%),
    linear-gradient(rgba(255, 255, 255, 0.1) 50%, transparent 50%);
  background-size: 8px 8px;
}

.planet.earth.departing {
  transform: scale(0.2) translateX(-200px);
  opacity: 0.5;
}

.planet.mars {
  top: 20%;
  right: -100px;
  background-color: #FF5722;
  box-shadow: inset -10px -10px 0 0 rgba(0, 0, 0, 0.3);
  /* 像素效果 */
  background-image: linear-gradient(90deg, 
    transparent 50%, rgba(255, 255, 255, 0.1) 50%),
    linear-gradient(rgba(255, 255, 255, 0.1) 50%, transparent 50%);
  background-size: 6px 6px;
}

.planet.mars.approaching {
  transform: translateX(-120px);
}

.spaceship {
  position: absolute;
  width: 80px;
  height: 48px;
  left: 20%;
  top: 50%;
  transform: translateY(-50%);
  transition: all 2s ease-in-out;
}

.spaceship.launching {
  transform: translateY(-200%) rotate(-15deg);
}

.spaceship.cruising {
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
}

.spaceship.landing {
  left: 70%;
  top: 50%;
  transform: translateX(calc(var(--progress) * 0.5%)) translateY(-50%) rotate(15deg);
}

.ship-body {
  position: relative;
  width: 100%;
  height: 100%;
}

.cockpit {
  position: absolute;
  top: 8px;
  left: 8px;
  width: 16px;
  height: 16px;
  background-color: #00BFFF;
  border: 2px solid #0091EA;
  border-radius: 50%;
}

.main-hull {
  position: absolute;
  top: 8px;
  left: 16px;
  width: 48px;
  height: 32px;
  background-color: #BDBDBD;
  border: 2px solid #9E9E9E;
  clip-path: polygon(0% 50%, 20% 0%, 100% 0%, 100% 100%, 20% 100%);
}

.wing {
  position: absolute;
  width: 24px;
  height: 8px;
  background-color: #FF5722;
  border: 2px solid #E64A19;
}

.wing.left {
  top: 4px;
  left: 24px;
  transform: skewX(-20deg);
}

.wing.right {
  bottom: 4px;
  left: 24px;
  transform: skewX(20deg);
}

.thruster {
  position: absolute;
  width: 16px;
  height: 12px;
  right: 0;
  background-color: #424242;
  border: 2px solid #212121;
  border-radius: 0 6px 6px 0;
}

.thruster.left {
  top: 4px;
}

.thruster.right {
  bottom: 4px;
}

.engine-effect {
  position: absolute;
  right: -16px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 24px;
}

.thrust-core {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  background-color: #FFFFFF;
  border-radius: 50%;
}

.thrust-outer {
  position: absolute;
  top: 50%;
  left: 4px;
  transform: translateY(-50%);
  width: 12px;
  height: 16px;
  background-color: #2196F3;
  clip-path: polygon(0% 50%, 33% 0%, 100% 0%, 100% 100%, 33% 100%);
  animation: thrust-pulse 0.2s infinite alternate;
}

.thrust-particle {
  position: absolute;
  top: calc(50% - 2px);
  right: -4px;
  width: 4px;
  height: 4px;
  background-color: #2196F3;
  border-radius: 50%;
  animation: thrust-particle 1s infinite;
  animation-delay: var(--delay);
}

@keyframes thrust-pulse {
  0% {
    transform: translateY(-50%) scaleX(0.8);
    opacity: 0.8;
  }
  100% {
    transform: translateY(-50%) scaleX(1.2);
    opacity: 1;
  }
}

@keyframes thrust-particle {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(30px);
    opacity: 0;
  }
}

.mission-complete {
  position: absolute;
  right: 20%;
  bottom: 20%;
}

.flag {
  width: 24px;
  height: 32px;
  position: relative;
}

.flag::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 32px;
  background-color: #BDBDBD;
}

.flag::after {
  content: '';
  position: absolute;
  top: 4px;
  left: 4px;
  width: 16px;
  height: 12px;
  background-color: #F44336;
  animation: flag-wave 2s infinite alternate;
}

.beacon-beam {
  position: absolute;
  top: -80px;
  left: 12px;
  width: 2px;
  height: 80px;
  background: linear-gradient(to top, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.8));
  animation: beacon-pulse 2s infinite;
}

@keyframes flag-wave {
  0% {
    transform: skewX(0deg);
  }
  100% {
    transform: skewX(-10deg);
  }
}

@keyframes beacon-pulse {
  0%, 100% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
}

.mission-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.8);
  border: 2px solid #404040;
  width: 100%;
  max-width: 500px;
}

.resource-status {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.resource-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.resource-bar span {
  width: 80px;
  text-align: right;
}

.bar-container {
  flex: 1;
  height: 12px;
  background-color: #212121;
  border: 2px solid #424242;
}

.bar-fill {
  height: 100%;
  transition: width 0.3s ease-out;
}

.fuel .bar-fill {
  background-color: #FF9800;
}

.oxygen .bar-fill {
  background-color: #2196F3;
}

.energy .bar-fill {
  background-color: #4CAF50;
}

.mission-stages {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 600px;
  margin: 1rem 0 2rem 0;
}

.stage-block {
  width: 90px;
  height: 90px;
  background-color: #424242;
  border: 2px solid #616161;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  padding: 0.5rem;
  font-size: 12px;
  text-align: center;
}

.stage-block.completed {
  background-color: #4CAF50;
  border-color: #388E3C;
}

.stage-block.current {
  background-color: #FFC107;
  border-color: #FFA000;
  animation: current-stage-pulse 1s infinite alternate;
}

.stage-icon {
  width: 24px;
  height: 24px;
  margin-bottom: 0.5rem;
  background-color: #BDBDBD;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

.completed .stage-icon {
  background-color: #FFFFFF;
  clip-path: polygon(20% 40%, 0% 60%, 40% 100%, 100% 20%, 80% 0%, 40% 60%);
}

.current .stage-icon {
  background-color: #FF5722;
  animation: spin 3s linear infinite;
}

@keyframes current-stage-pulse {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.05);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style> 