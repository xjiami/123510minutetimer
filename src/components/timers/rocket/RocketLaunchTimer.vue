<template>
  <minecraft-layout>
    <template #title>像素火箭发射</template>
    
    <template #controls>
      <button class="minecraft-button" @click="startLaunch" :disabled="isRunning">
        开始发射
      </button>
      <button class="minecraft-button" @click="abortLaunch" :disabled="!isRunning">
        中止发射
      </button>
      <button class="minecraft-button" @click="resetLaunch" :disabled="isRunning">
        重新准备
      </button>
    </template>

    <div class="rocket-launch-container">
      <!-- 发射场景 -->
      <div class="launch-scene">
        <!-- 背景层 -->
        <div class="sky-layer"></div>
        <div class="mountain-layer"></div>
        
        <!-- 发射台 -->
        <div class="launch-pad">
          <div class="platform">
            <div class="platform-block" v-for="n in 6" :key="n"></div>
          </div>
          <div class="support-beam left"></div>
          <div class="support-beam right"></div>
        </div>

        <!-- 火箭 -->
        <div class="rocket" :class="{ 'launching': isLaunching }"
             :style="{ '--progress': progress + '%' }">
          <div class="rocket-body">
            <div class="nose-cone"></div>
            <div class="main-body">
              <div class="window"></div>
            </div>
            <div class="fins">
              <div class="fin left"></div>
              <div class="fin right"></div>
            </div>
          </div>
          
          <!-- 火焰效果 -->
          <div class="engine-fire" v-if="isLaunching">
            <div class="fire-core"></div>
            <div class="fire-outer"></div>
            <div v-for="n in 8" :key="n" 
                 class="spark"
                 :style="{ '--delay': `${n * 0.1}s` }">
            </div>
          </div>

          <!-- 烟雾效果 -->
          <div class="smoke-particles" v-if="isLaunching">
            <div v-for="n in 12" :key="n"
                 class="smoke"
                 :style="{ '--delay': `${n * 0.2}s` }">
            </div>
          </div>
        </div>
      </div>

      <!-- 倒计时显示 -->
      <div class="minecraft-display" :class="{ 'warning': timeLeft <= 10 }">
        T-{{ formatTime }}
      </div>

      <!-- 控制面板 -->
      <div class="control-panel" v-if="!isRunning">
        <div class="setting-item">
          <label class="minecraft-label">倒计时时长（秒）</label>
          <input type="number" 
                 v-model="duration" 
                 class="minecraft-input"
                 min="10" 
                 max="120" />
        </div>
        
        <!-- 系统状态指示器 -->
        <div class="system-status">
          <div class="status-row" v-for="(system, index) in systems" :key="index">
            <span class="minecraft-label">{{ system.name }}</span>
            <div class="redstone-lamp" :class="{ active: system.ready }"></div>
          </div>
        </div>
      </div>

      <!-- 发射进度 -->
      <div class="launch-progress">
        <div class="stage-indicator" v-for="(stage, index) in stages" :key="index"
             :class="{ active: currentStage >= index }">
          {{ stage }}
        </div>
      </div>
    </div>
  </minecraft-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MinecraftLayout from '../../layout/MinecraftLayout.vue'

// 系统状态
const systems = ref([
  { name: '燃料系统', ready: false },
  { name: '导航系统', ready: false },
  { name: '推进系统', ready: false },
  { name: '通信系统', ready: false }
])

// 发射阶段
const stages = [
  '系统检查',
  '燃料注入',
  '引擎预热',
  '发射准备',
  '点火升空'
]

// 状态变量
const isRunning = ref(false)
const isLaunching = ref(false)
const duration = ref(30)
const timeLeft = ref(0)
const progress = ref(0)
const currentStage = ref(-1)
let launchInterval: number | null = null

// 计算属性
const formatTime = computed(() => {
  return timeLeft.value.toString().padStart(2, '0')
})

// 方法
function startLaunch() {
  if (isRunning.value) return
  
  // 重置系统状态
  systems.value.forEach(sys => sys.ready = false)
  currentStage.value = -1
  progress.value = 0
  
  timeLeft.value = duration.value
  isRunning.value = true
  
  // 开始系统检查序列
  initializeSystemCheck()
  
  if (!launchInterval) {
    launchInterval = window.setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
        updateLaunch()
      } else {
        completeLaunch()
      }
    }, 1000)
  }
}

function initializeSystemCheck() {
  let delay = 0
  systems.value.forEach((sys, index) => {
    setTimeout(() => {
      sys.ready = true
      if (index === systems.value.length - 1) {
        currentStage.value = 0
      }
    }, delay)
    delay += 1000
  })
}

function updateLaunch() {
  // 更新发射阶段
  const stageTime = duration.value / stages.length
  currentStage.value = Math.floor((duration.value - timeLeft.value) / stageTime)
  
  // 最后10秒开始发射动画
  if (timeLeft.value <= 10) {
    isLaunching.value = true
    progress.value = (10 - timeLeft.value) * 10
  }
}

function abortLaunch() {
  isRunning.value = false
  isLaunching.value = false
  if (launchInterval) {
    clearInterval(launchInterval)
    launchInterval = null
  }
  createBreakParticles()
}

function resetLaunch() {
  abortLaunch()
  timeLeft.value = duration.value
  progress.value = 0
  currentStage.value = -1
  systems.value.forEach(sys => sys.ready = false)
}

function completeLaunch() {
  isRunning.value = false
  if (launchInterval) {
    clearInterval(launchInterval)
    launchInterval = null
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
.rocket-launch-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
}

.launch-scene {
  width: 100%;
  height: 400px;
  position: relative;
  overflow: hidden;
  background-color: #000000;
}

.sky-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 70%;
  background: linear-gradient(to bottom, #000033, #000066);
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIklEQVQImWNgYGD4z8DAwMDEwMDAwMjAwMDAxMDAwMDIwAAAJgUEBHg4gqwAAAAASUVORK5CYII=');
  background-repeat: repeat;
}

.mountain-layer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30%;
  background-color: #1B1B1B;
  clip-path: polygon(
    0% 100%,
    20% 40%,
    40% 70%,
    60% 30%,
    80% 60%,
    100% 20%,
    100% 100%
  );
}

.launch-pad {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 160px;
  height: 120px;
}

.platform {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 16px;
  display: flex;
}

.platform-block {
  flex: 1;
  height: 100%;
  background-color: #4C4C4C;
  border: 2px solid #333333;
  image-rendering: pixelated;
}

.support-beam {
  position: absolute;
  bottom: 16px;
  width: 8px;
  height: 80px;
  background-color: #666666;
  border: 2px solid #4C4C4C;
}

.support-beam.left {
  left: 20%;
  transform: rotate(-15deg);
}

.support-beam.right {
  right: 20%;
  transform: rotate(15deg);
}

.rocket {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: 48px;
  height: 160px;
  transition: transform 0.5s ease-out;
}

.rocket.launching {
  transform: translateX(-50%) translateY(calc(var(--progress) * -1%));
}

.rocket-body {
  position: relative;
  width: 100%;
  height: 100%;
}

.nose-cone {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  height: 48px;
  background-color: #FF4444;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

.main-body {
  position: absolute;
  top: 48px;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  height: 80px;
  background-color: #FFFFFF;
  border: 2px solid #CCCCCC;
}

.window {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 16px;
  background-color: #00FFFF;
  border: 2px solid #00CCCC;
  border-radius: 50%;
}

.fins {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 32px;
}

.fin {
  position: absolute;
  bottom: 0;
  width: 16px;
  height: 32px;
  background-color: #FF4444;
}

.fin.left {
  left: -8px;
  transform: skewX(30deg);
}

.fin.right {
  right: -8px;
  transform: skewX(-30deg);
}

.engine-fire {
  position: absolute;
  bottom: -32px;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 48px;
}

.fire-core {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 32px;
  background-color: #FFFFFF;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  animation: flicker 0.1s infinite alternate;
}

.fire-outer {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 48px;
  background-color: #FF4444;
  opacity: 0.8;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  animation: flicker 0.2s infinite alternate;
}

.spark {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 4px;
  height: 4px;
  background-color: #FFFF00;
  border-radius: 50%;
  animation: spark 1s infinite;
  animation-delay: var(--delay);
}

.smoke {
  position: absolute;
  bottom: -16px;
  left: 50%;
  width: 16px;
  height: 16px;
  background-color: rgba(128, 128, 128, 0.5);
  border-radius: 50%;
  animation: smoke 2s infinite;
  animation-delay: var(--delay);
}

@keyframes flicker {
  0% {
    transform: translateX(-50%) scaleY(0.8);
  }
  100% {
    transform: translateX(-50%) scaleY(1.2);
  }
}

@keyframes spark {
  0% {
    transform: translate(-50%, 0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translate(calc(-50% + var(--x, 20px)), var(--y, 20px)) rotate(360deg);
    opacity: 0;
  }
}

@keyframes smoke {
  0% {
    transform: translate(-50%, 0) scale(1);
    opacity: 0.5;
  }
  100% {
    transform: translate(-50%, -100px) scale(3);
    opacity: 0;
  }
}

.minecraft-display.warning {
  color: #FF4444;
  animation: warning-flash 0.5s infinite alternate;
}

@keyframes warning-flash {
  0% {
    text-shadow: 0 0 10px #FF0000;
  }
  100% {
    text-shadow: 0 0 20px #FF0000;
  }
}

.control-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.8);
  border: 2px solid #404040;
}

.system-status {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.status-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.launch-progress {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.stage-indicator {
  padding: 0.5rem;
  background-color: #4C4C4C;
  border: 2px solid #404040;
  color: #AAAAAA;
  font-size: 12px;
}

.stage-indicator.active {
  background-color: #55FF55;
  border-color: #338833;
  color: #FFFFFF;
}
</style> 