<template>
  <minecraft-layout>
    <template #title>像素鸭子比赛</template>
    
    <template #controls>
      <button class="minecraft-button" @click="startRace" :disabled="isRunning">
        开始比赛
      </button>
      <button class="minecraft-button" @click="stopRace" :disabled="!isRunning">
        停止比赛
      </button>
      <button class="minecraft-button" @click="resetRace" :disabled="isRunning">
        重新开始
      </button>
    </template>

    <div class="duck-race-container">
      <!-- 水池显示 -->
      <div class="pool">
        <div class="water-surface">
          <div class="wave" v-for="n in 3" :key="n"
               :style="{ '--delay': `${n * 0.5}s` }">
          </div>
        </div>
        
        <!-- 鸭子们 -->
        <div v-for="duck in ducks" :key="duck.id"
             class="duck"
             :class="{ 'winner': duck.isWinner }"
             :style="{ 
               '--lane': duck.lane,
               '--progress': `${duck.progress}%`
             }">
          <div class="duck-body">
            <div class="head">
              <div class="eye"></div>
              <div class="beak"></div>
            </div>
            <div class="wing"></div>
            <div class="tail"></div>
          </div>
          <div class="ripple" v-for="n in 3" :key="n"
               :style="{ '--delay': `${n * 0.2}s` }">
          </div>
        </div>

        <!-- 终点线 -->
        <div class="finish-line">
          <div v-for="n in 8" :key="n" class="finish-block"
               :style="{ '--index': n }">
          </div>
        </div>
      </div>

      <!-- 计时显示 -->
      <div class="minecraft-display">{{ formatTime }}</div>

      <!-- 设置区域 -->
      <div class="settings-area" v-if="!isRunning">
        <div class="setting-item">
          <label class="minecraft-label">比赛时长（分钟）</label>
          <input type="number" 
                 v-model="duration" 
                 class="minecraft-input"
                 min="1" 
                 max="30" />
        </div>
        <div class="setting-item">
          <label class="minecraft-label">鸭子数量</label>
          <input type="number" 
                 v-model="duckCount" 
                 class="minecraft-input"
                 min="2" 
                 max="4" />
        </div>
      </div>

      <!-- 红石进度指示器 -->
      <div class="redstone-progress">
        <div v-for="n in 10" :key="n"
             class="redstone-lamp"
             :class="{ active: progress >= n * 10 }">
        </div>
      </div>
    </div>
  </minecraft-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MinecraftLayout from '../../layout/MinecraftLayout.vue'

interface Duck {
  id: number
  lane: number
  progress: number
  speed: number
  isWinner: boolean
}

// 状态变量
const isRunning = ref(false)
const duration = ref(5)
const timeLeft = ref(0)
const duckCount = ref(3)
const ducks = ref<Duck[]>([])
const progress = ref(0)
let raceInterval: number | null = null

// 计算属性
const formatTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// 方法
function initializeDucks() {
  ducks.value = Array.from({ length: duckCount.value }, (_, i) => ({
    id: i + 1,
    lane: i + 1,
    progress: 0,
    speed: 0.2 + Math.random() * 0.3,
    isWinner: false
  }))
}

function startRace() {
  if (isRunning.value) return
  
  initializeDucks()
  timeLeft.value = duration.value * 60
  isRunning.value = true
  progress.value = 0
  
  if (!raceInterval) {
    raceInterval = window.setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
        updateDucks()
      } else {
        endRace()
      }
    }, 1000)
  }
}

function updateDucks() {
  let hasWinner = false
  ducks.value.forEach(duck => {
    if (!duck.isWinner) {
      duck.progress += duck.speed
      if (duck.progress >= 100 && !hasWinner) {
        duck.isWinner = true
        hasWinner = true
      }
    }
  })
  
  progress.value = Math.min(100, Math.max(...ducks.value.map(d => d.progress)))
  
  if (hasWinner) {
    endRace()
  }
}

function stopRace() {
  isRunning.value = false
  if (raceInterval) {
    clearInterval(raceInterval)
    raceInterval = null
  }
}

function resetRace() {
  stopRace()
  timeLeft.value = duration.value * 60
  progress.value = 0
  ducks.value = []
}

function endRace() {
  stopRace()
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
.duck-race-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
}

.pool {
  width: 100%;
  height: 300px;
  position: relative;
  background-color: #0077BE;
  border: 4px solid #005C99;
  overflow: hidden;
}

.water-surface {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 119, 190, 0.3);
}

.wave {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 20px,
    rgba(255, 255, 255, 0.1) 20px,
    rgba(255, 255, 255, 0.1) 40px
  );
  animation: wave 3s linear infinite;
  animation-delay: var(--delay);
}

@keyframes wave {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.duck {
  position: absolute;
  left: 0;
  width: 48px;
  height: 48px;
  transform: translateX(calc(var(--progress) * 1%));
  transition: transform 0.5s linear;
  top: calc(48px + (var(--lane) - 1) * 64px);
}

.duck-body {
  position: relative;
  width: 100%;
  height: 100%;
  animation: float 1s infinite alternate ease-in-out;
}

.head {
  position: absolute;
  left: 24px;
  top: 8px;
  width: 16px;
  height: 16px;
  background-color: #FFD700;
  border: 2px solid #B8860B;
  border-radius: 8px;
}

.eye {
  position: absolute;
  right: 2px;
  top: 4px;
  width: 4px;
  height: 4px;
  background-color: #000000;
  border-radius: 50%;
}

.beak {
  position: absolute;
  left: -8px;
  top: 6px;
  width: 12px;
  height: 6px;
  background-color: #FFA500;
  clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
}

.wing {
  position: absolute;
  right: 8px;
  top: 16px;
  width: 16px;
  height: 24px;
  background-color: #FFD700;
  border: 2px solid #B8860B;
  border-radius: 50%;
  transform-origin: center top;
  animation: flap 0.5s infinite alternate ease-in-out;
}

.tail {
  position: absolute;
  right: 0;
  top: 24px;
  width: 12px;
  height: 12px;
  background-color: #FFD700;
  border: 2px solid #B8860B;
  clip-path: polygon(100% 0%, 0% 50%, 100% 100%);
}

.ripple {
  position: absolute;
  bottom: -8px;
  left: 50%;
  width: 32px;
  height: 32px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, 0) scale(0);
  animation: ripple 1.5s infinite;
  animation-delay: var(--delay);
}

@keyframes float {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-4px);
  }
}

@keyframes flap {
  0% {
    transform: rotate(-15deg);
  }
  100% {
    transform: rotate(15deg);
  }
}

@keyframes ripple {
  0% {
    transform: translate(-50%, 0) scale(0);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, 0) scale(2);
    opacity: 0;
  }
}

.finish-line {
  position: absolute;
  right: 32px;
  top: 0;
  width: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.finish-block {
  width: 100%;
  height: 32px;
  background-color: var(--color, #FFFFFF);
  border: 2px solid #000000;
}

.finish-block:nth-child(odd) {
  --color: #000000;
}

.winner {
  animation: celebrate 0.5s infinite alternate;
}

@keyframes celebrate {
  0% {
    transform: translateX(calc(var(--progress) * 1%)) rotate(0deg);
  }
  100% {
    transform: translateX(calc(var(--progress) * 1%)) rotate(10deg);
  }
}

.settings-area {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.redstone-progress {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.setting-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
</style> 