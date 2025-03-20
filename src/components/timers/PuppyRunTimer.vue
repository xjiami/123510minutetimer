<template>
  <div class="puppy-run-timer" ref="puppyRunTimerRef">
    <!-- 不在此处显示标题，避免重复 -->
    
    <!-- 时间输入区域 -->
    <div class="time-input-container" v-if="!raceState.isRunning && !raceState.isFinished">
      <div class="time-input">
        <div class="input-group">
          <label>{{ $t('common.minutes') }}</label>
          <input type="number" v-model="inputMinutes" min="0" max="60" />
        </div>
        <div class="separator">:</div>
        <div class="input-group">
          <label>{{ $t('common.seconds') }}</label>
          <input type="number" v-model="inputSeconds" min="0" max="59" />
        </div>
      </div>
      
      <!-- 主要控制按钮 -->
      <div class="control-buttons-main">
        <button class="start-button" @click="startRace">{{ $t('common.start') }}</button>
        <button class="reset-button" @click="resetRace">{{ $t('common.reset') }}</button>
        <button class="fullscreen-button" @click="toggleFullScreen">{{ $t('common.fullscreen') }}</button>
      </div>
      </div>
      
    <!-- 比赛中控制按钮 -->
    <div class="race-controls" v-if="raceState.isRunning || raceState.isFinished">
      <race-controls
        :is-running="raceState.isRunning"
        :is-finished="raceState.isFinished"
        @start="startRace"
        @pause="pauseRace"
        @resume="resumeRace"
        @reset="resetRace"
      />
      <button class="fullscreen-button" @click="toggleFullScreen">
        {{ isFullScreen ? $t('common.back') : $t('common.fullscreen') }}
        </button>
      </div>
    
    <!-- 计时器显示 -->
    <timer-display
      :time="formattedTime"
      :countdown="formattedCountdown"
      :is-countdown-active="isCountdownActive"
      class="timer-display"
    />
    
    <!-- 比赛场景区域 -->
    <div class="race-scene" :class="{ 'fullscreen-scene': isFullScreen }">
      <race-track
        :puppies="puppies"
        :race-state="raceState"
      />
    </div>
    
    <!-- 获胜者公告 -->
    <winner-announcement
      v-if="raceState.winner"
      :winner="raceState.winner"
      class="winner-announcement"
    />
    
    <button class="debug-button" @click="forceRefreshPuppies">{{ $t('common.reset') }}</button>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import TimerDisplay from './puppy/TimerDisplay.vue'
import RaceTrack from './puppy/RaceTrack.vue'
import RaceControls from './puppy/RaceControls.vue'
import WinnerAnnouncement from './puppy/WinnerAnnouncement.vue'
import { useRaceTimer } from '@/composables/useRaceTimer'
import { debugPuppyAnimations } from '@/utils/debug'
import { usePuppies } from '@/composables/usePuppies'

// 国际化
const { t } = useI18n()

// 组件引用
const puppyRunTimerRef = ref<HTMLElement | null>(null)
const isFullScreen = ref(false)

// 时间输入
const inputMinutes = ref(5)
const inputSeconds = ref(0)

// 使用计时器逻辑 - 默认5分钟
const {
  remainingTime,
  countdown,
  isCountdownActive,
  formattedTime,
  formattedCountdown,
  timerId,
  setInitialTime,
  startTimer,
  pauseTimer,
  resetTimer
} = useRaceTimer(inputMinutes.value, inputSeconds.value)

// 使用小狗逻辑
const {
  puppies,
  raceState,
  updatePuppyPositions,
  resetPuppies
} = usePuppies()

// 强制刷新计数器
const refreshCounter = ref(0)

// 设置自定义倒计时时间
const setCustomTime = () => {
  // 确保输入有效
  const mins = Math.max(0, Math.min(60, inputMinutes.value || 0))
  const secs = Math.max(0, Math.min(59, inputSeconds.value || 0))
  
  inputMinutes.value = mins
  inputSeconds.value = secs
  
  // 如果总时间为0，设置为至少1秒
  if (mins === 0 && secs === 0) {
    inputSeconds.value = 1
  }
  
  // 设置倒计时时间
  setInitialTime(mins, secs)
}

// 监听剩余时间变化，更新小狗位置
watch(remainingTime, (newValue) => {
  if (raceState.value.isRunning && !raceState.value.isFinished) {
    // 计算进度百分比
    const progress = Math.max(0, Math.min(100, 100 - (newValue / (inputMinutes.value * 60000 + inputSeconds.value * 1000) * 100)))

// 更新小狗位置
    updatePuppyPositions(progress)
    
    // 检查是否有小狗到达终点
    const finishedPuppy = puppies.value.find(p => p.position >= 90)
    if (finishedPuppy) {
      finishRace(finishedPuppy.color)
    }
    
    // 检查是否时间已到
    if (newValue <= 0) {
      // 如果时间到了，但没有小狗到达终点，找出跑得最远的小狗作为获胜者
      if (!raceState.value.winner) {
        let furthestPuppy = puppies.value[0]
        
        puppies.value.forEach(puppy => {
          if (puppy.position > furthestPuppy.position) {
            furthestPuppy = puppy
          }
        })
        
        finishRace(furthestPuppy.color)
      }
    }
  }
})

// 开始比赛
const startRace = () => {
  if (raceState.value.isRunning) return
  
  console.log('开始比赛...')
  
  // 确保时间正确设置
  setCustomTime()
  
  startTimer(() => {
    // 倒计时结束后开始比赛
    raceState.value.isRunning = true
    raceState.value.isFinished = false
    raceState.value.winner = null
    
    // 使所有小狗开始奔跑
    puppies.value.forEach(puppy => {
      puppy.state = 'running'
    })
  })
}

// 暂停比赛
const pauseRace = () => {
  if (!raceState.value.isRunning) return
  
  raceState.value.isRunning = false
  pauseTimer()
}

// 继续比赛
const resumeRace = () => {
  if (raceState.value.isRunning || raceState.value.isFinished) return
  
  raceState.value.isRunning = true
  startRace()
}

// 完成比赛
const finishRace = (winnerColor: string) => {
  raceState.value.isRunning = false
  raceState.value.isFinished = true
  raceState.value.winner = winnerColor
  
  // 设置所有小狗状态
  puppies.value.forEach(puppy => {
    if (puppy.color === winnerColor) {
      puppy.state = 'finished'
    } else {
      puppy.state = 'idle'
    }
  })
  
  pauseTimer()
}

// 重置比赛
const resetRace = () => {
  resetTimer()
  resetPuppies()
  raceState.value = {
    isRunning: false,
    isFinished: false,
    winner: null
  }
}

// 切换全屏模式
const toggleFullScreen = () => {
  if (!isFullScreen.value) {
    // 进入全屏模式
    if (puppyRunTimerRef.value && puppyRunTimerRef.value.requestFullscreen) {
      puppyRunTimerRef.value.requestFullscreen().catch(err => {
        console.error(`无法进入全屏模式: ${err.message}`)
      }).then(() => {
        isFullScreen.value = true
      })
    }
  } else {
    // 退出全屏模式
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(err => {
        console.error(`无法退出全屏模式: ${err.message}`)
      }).then(() => {
        isFullScreen.value = false
      })
    }
  }
}

// 强制刷新小狗组件
const forceRefreshPuppies = () => {
  console.log('强制刷新小狗组件...')
  refreshCounter.value++
  
  // 手动调用小狗调试函数
  setTimeout(debugPuppyAnimations, 100)
}

// 处理全屏事件
const handleFullScreenChange = () => {
  isFullScreen.value = !!document.fullscreenElement
}

// 组件挂载时
onMounted(() => {
  // 初始化计时器
  setCustomTime()
  
  // 调试小狗动画
  setTimeout(debugPuppyAnimations, 1000)
  
  // 添加全屏事件监听
  document.addEventListener('fullscreenchange', handleFullScreenChange)
})

// 组件卸载时
onUnmounted(() => {
  // 清理计时器
  pauseTimer()
  
  // 移除全屏事件监听
  document.removeEventListener('fullscreenchange', handleFullScreenChange)
  
  // 确保退出全屏
  if (document.fullscreenElement && document.exitFullscreen) {
    document.exitFullscreen().catch(err => {
      console.error(`无法退出全屏模式: ${err.message}`)
    })
  }
})
</script>

<style scoped>
.puppy-run-timer {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px;
  box-sizing: border-box;
}

.time-input-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
}

.time-input {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  padding: 15px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
}

.control-buttons-main {
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 10px;
  margin-bottom: 10px;
}

.race-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 10px;
  margin-bottom: 5px;
}

.start-button, .reset-button, .fullscreen-button {
  flex: 1;
  max-width: 120px;
  height: 40px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.start-button {
  background-color: #4a86e8;
  color: white;
}

.start-button:hover {
  background-color: #3a76d8;
}

.reset-button {
  background-color: #f44336;
  color: white;
}

.reset-button:hover {
  background-color: #e53935;
}

.fullscreen-button {
  background-color: #5c6bc0;
  color: white;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fullscreen-button:hover {
  background-color: #4c5bb0;
}

.input-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 5px;
}

.input-group label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.input-group input {
  width: 80px;
  height: 40px;
  text-align: center;
  font-size: 24px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.separator {
  font-size: 28px;
  margin: 0 10px;
  padding-top: 15px;
}

.timer-display {
  margin-bottom: 10px;
}

.race-scene {
  width: 100%;
  height: auto;
  min-height: 600px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.fullscreen-scene {
  min-height: 85vh;
}

.winner-announcement {
  margin-top: 15px;
}

.debug-button {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  opacity: 0.6;
}

.debug-button:hover {
  opacity: 1;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .time-input {
    padding: 10px;
  }
  
  .input-group input {
    width: 60px;
    height: 35px;
    font-size: 20px;
  }
  
  .start-button, .reset-button, .fullscreen-button {
    height: 35px;
    font-size: 14px;
  }
  
  .race-scene {
    min-height: 500px;
  }
}

@media (max-width: 480px) {
  .time-input {
    flex-direction: row;
    padding: 8px;
  }
  
  .input-group input {
    width: 50px;
    height: 30px;
    font-size: 18px;
  }
  
  .separator {
    font-size: 24px;
  }
  
  .start-button, .reset-button, .fullscreen-button {
    height: 40px;
    font-size: 14px;
  }
  
  .race-scene {
    min-height: 350px;
  }
}

/* 全屏模式样式 */
:fullscreen .puppy-run-timer {
  width: 100%;
  height: 100vh;
  padding: 20px;
  background-color: #f9f9f9;
}

:fullscreen .race-scene {
  min-height: 85vh;
  flex: 1;
}

:fullscreen .timer-display {
  font-size: 1.5em;
}
</style> 