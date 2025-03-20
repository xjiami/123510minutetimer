<template>
  <minecraft-layout>
    <template #title>像素蜗牛赛跑</template>
    
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

    <div class="snail-race-container">
      <!-- 赛道显示 -->
      <div class="race-track">
        <div class="grass-block"></div>
        <div class="dirt-path"></div>
        <div class="finish-line"></div>
        
        <!-- 蜗牛们 -->
        <div v-for="snail in snails" :key="snail.id"
             class="snail"
             :class="{ 'winner': snail.isWinner }"
             :style="{ 
               '--lane': snail.lane,
               '--progress': `${snail.progress}%`
             }">
          <div class="snail-body">
            <div class="shell">
              <div class="shell-pattern"></div>
            </div>
            <div class="head">
              <div class="eye"></div>
              <div class="antenna" v-for="n in 2" :key="n"></div>
            </div>
          </div>
          <div class="slime-trail"></div>
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
          <label class="minecraft-label">蜗牛数量</label>
          <input type="number" 
                 v-model="snailCount" 
                 class="minecraft-input"
                 min="2" 
                 max="5" />
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

interface Snail {
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
const snailCount = ref(3)
const snails = ref<Snail[]>([])
const progress = ref(0)
let raceInterval: number | null = null

// 计算属性
const formatTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// 方法
function initializeSnails() {
  snails.value = Array.from({ length: snailCount.value }, (_, i) => ({
    id: i + 1,
    lane: i + 1,
    progress: 0,
    speed: 0.1 + Math.random() * 0.2,
    isWinner: false
  }))
}

function startRace() {
  if (isRunning.value) return
  
  initializeSnails()
  timeLeft.value = duration.value * 60
  isRunning.value = true
  progress.value = 0
  
  if (!raceInterval) {
    raceInterval = window.setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
        updateSnails()
      } else {
        endRace()
      }
    }, 1000)
  }
}

function updateSnails() {
  let hasWinner = false
  snails.value.forEach(snail => {
    if (!snail.isWinner) {
      snail.progress += snail.speed
      if (snail.progress >= 100 && !hasWinner) {
        snail.isWinner = true
        hasWinner = true
      }
    }
  })
  
  progress.value = Math.min(100, Math.max(...snails.value.map(s => s.progress)))
  
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
  snails.value = []
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
.snail-race-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
}

.race-track {
  width: 100%;
  height: 300px;
  position: relative;
  background-color: #8B4513;
  border: 4px solid #654321;
  overflow: hidden;
}

.grass-block {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 32px;
  background-color: #567D46;
  border-bottom: 4px solid #3B5323;
  image-rendering: pixelated;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAPUlEQVQYlWNgQAP/////z4AJGBkZGRnRJZmQOYyMjP8ZGBj+MyADdD4jAyYgzgADjOgSyIpwaiAqQFcAADxeJpjvZkMRAAAAAElFTkSuQmCC');
  background-repeat: repeat;
}

.dirt-path {
  position: absolute;
  top: 32px;
  left: 0;
  width: 100%;
  height: calc(100% - 32px);
  background-color: #8B4513;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAOElEQVQYlWNgQAP/////z4AJGBkZGRnRJZmQOYyMjP8ZGBj+MyADdD4jAyYgzgADjOgSyIpwagAAP14mmO9mQ1EAAAAASUVORK5CYII=');
  background-repeat: repeat;
}

.finish-line {
  position: absolute;
  right: 32px;
  top: 0;
  width: 16px;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    #000000 0px,
    #000000 16px,
    #FFFFFF 16px,
    #FFFFFF 32px
  );
}

.snail {
  position: absolute;
  left: 0;
  width: 48px;
  height: 32px;
  transform: translateX(calc(var(--progress) * 1%));
  transition: transform 0.5s linear;
  top: calc(64px + (var(--lane) - 1) * 48px);
}

.snail-body {
  position: relative;
  width: 100%;
  height: 100%;
}

.shell {
  position: absolute;
  right: 8px;
  top: 4px;
  width: 24px;
  height: 24px;
  background-color: #8B4513;
  border: 2px solid #654321;
  border-radius: 50%;
  overflow: hidden;
}

.shell-pattern {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 16px;
  height: 16px;
  background-color: #654321;
  transform: translate(-50%, -50%) rotate(45deg);
}

.head {
  position: absolute;
  left: 4px;
  top: 12px;
  width: 16px;
  height: 12px;
  background-color: #8B4513;
  border: 2px solid #654321;
  border-radius: 8px 0 0 8px;
}

.eye {
  position: absolute;
  left: 2px;
  top: 2px;
  width: 4px;
  height: 4px;
  background-color: #000000;
  border-radius: 50%;
}

.antenna {
  position: absolute;
  left: -4px;
  width: 2px;
  height: 8px;
  background-color: #654321;
}

.antenna:nth-child(2) {
  top: -4px;
  transform: rotate(-45deg);
}

.antenna:nth-child(3) {
  bottom: -4px;
  transform: rotate(45deg);
}

.slime-trail {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3));
}

.winner {
  animation: celebrate 0.5s infinite alternate;
}

@keyframes celebrate {
  0% {
    transform: translateX(calc(var(--progress) * 1%)) translateY(0);
  }
  100% {
    transform: translateX(calc(var(--progress) * 1%)) translateY(-8px);
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