import { ref, computed, onMounted, onUnmounted, reactive } from 'vue'
import { PUPPY_POSITIONS, PUPPY_SPEEDS, TIMER_CONSTANTS } from '@/constants/puppyRace'
import type { PuppyPosition, RaceState } from '@/types/puppyRace'
import { formatTimeWithCentiseconds } from '@/utils/timeFormatter'
import { checkFinishLine, adjustPuppyPosition } from '@/utils/puppyCollision'
import { createTimer, clearTimer, startCountdown } from '@/utils/raceTimer'

/**
 * 小狗赛跑逻辑钩子函数
 * @returns 赛跑相关的状态和方法
 */
export function usePuppyRace() {
  // 状态
  const raceState = ref<RaceState>({
    isRunning: false,
    isFinished: false,
    startTime: null,
    endTime: null,
    winner: null
  })
  
  const countdown = ref<number>(0)
  const isCountdownActive = ref<boolean>(false)
  const currentTime = ref<number>(0)
  const timerId = ref<number | null>(null)
  const countdownId = ref<number | null>(null)
  
  // 小狗位置状态 - 使用单独的ref数组确保每个小狗状态的变更都被追踪
  const puppyPositions = ref<PuppyPosition[]>([
    { position: 0, state: 'idle', speed: PUPPY_SPEEDS.DEFAULT, previousPosition: 0 },
    { position: 0, state: 'idle', speed: PUPPY_SPEEDS.DEFAULT, previousPosition: 0 },
    { position: 0, state: 'idle', speed: PUPPY_SPEEDS.DEFAULT, previousPosition: 0 },
    { position: 0, state: 'idle', speed: PUPPY_SPEEDS.DEFAULT, previousPosition: 0 }
  ])
  
  // 调试辅助 - 强制状态更新计数器
  const updateCounter = ref(0)
  
  // 计算属性
  const formattedTime = computed(() => {
    return formatTimeWithCentiseconds(currentTime.value)
  })
  
  const formattedCountdown = computed(() => {
    const seconds = Math.ceil(countdown.value / 1000)
    return seconds > 0 ? seconds.toString() : '开始!'
  })
  
  // 获取小狗状态类
  const getPuppyStateClasses = (index: number) => {
    const state = puppyPositions.value[index].state
    return {
      idle: state === 'idle',
      running: state === 'running',
      finished: state === 'finished'
    }
  }
  
  // 获取小狗位置样式
  const getPuppyPositionStyle = (index: number) => {
    return {
      left: `${puppyPositions.value[index].position}%`
    }
  }
  
  // 初始化小狗位置
  const initializePuppyPositions = () => {
    console.log('初始化小狗位置...');
    
    // 创建全新的数组，以确保响应式更新
    const newPositions = [
      { position: PUPPY_POSITIONS.START.BROWN, state: 'running' as const, speed: PUPPY_SPEEDS.DEFAULT + (Math.random() * (PUPPY_SPEEDS.MAX - PUPPY_SPEEDS.MIN)), previousPosition: PUPPY_POSITIONS.START.BROWN },
      { position: PUPPY_POSITIONS.START.WHITE, state: 'idle' as const, speed: PUPPY_SPEEDS.DEFAULT + (Math.random() * (PUPPY_SPEEDS.MAX - PUPPY_SPEEDS.MIN)), previousPosition: PUPPY_POSITIONS.START.WHITE },
      { position: PUPPY_POSITIONS.START.BLACK, state: 'idle' as const, speed: PUPPY_SPEEDS.DEFAULT + (Math.random() * (PUPPY_SPEEDS.MAX - PUPPY_SPEEDS.MIN)), previousPosition: PUPPY_POSITIONS.START.BLACK },
      { position: PUPPY_POSITIONS.START.SPOTTED, state: 'idle' as const, speed: PUPPY_SPEEDS.DEFAULT + (Math.random() * (PUPPY_SPEEDS.MAX - PUPPY_SPEEDS.MIN)), previousPosition: PUPPY_POSITIONS.START.SPOTTED }
    ];
    
    // 替换整个数组以触发响应式更新
    puppyPositions.value = newPositions;
    updateCounter.value++;
    console.log('小狗位置已初始化:', puppyPositions.value);
  }
  
  // 更新小狗位置
  const updatePuppyPositions = () => {
    if (!raceState.value.isRunning) return
    
    const delta = TIMER_CONSTANTS.UPDATE_INTERVAL / 1000
    
    // 创建新的数组以确保触发响应式更新
    const newPositions = [...puppyPositions.value];
    let hasChanges = false;
    
    // 处理每只小狗
    for (let index = 0; index < newPositions.length; index++) {
      const puppy = newPositions[index];
      
      // 跳过非运行状态的小狗
      if (puppy.state !== 'running') continue;
      
      // 复制并更新小狗状态
      puppy.previousPosition = puppy.position;
      
      // 添加一点随机性
      const randomFactor = 0.8 + Math.random() * 0.4;
      puppy.position += puppy.speed * delta * randomFactor;
      hasChanges = true;
      
      // 检查是否到达终点
      if (checkFinishLine(puppy.position)) {
        console.log(`小狗 ${index} 到达终点!`);
        puppy.position = 100;
        puppy.state = 'finished';
        
        // 如果没有获胜者，设置当前小狗为获胜者
        if (!raceState.value.winner) {
          const winners = ['brown', 'white', 'black', 'spotted'];
          raceState.value.winner = winners[index];
          console.log(`${winners[index]} 获胜!`);
          finishRace();
        }
      }
    }
    
    // 只有在有变化时才更新数组
    if (hasChanges) {
      puppyPositions.value = newPositions;
      updateCounter.value++;
    }
  }
  
  // 更新计时器
  const updateTimer = () => {
    if (!raceState.value.isRunning) return
    
    const now = Date.now()
    if (raceState.value.startTime) {
      currentTime.value = now - raceState.value.startTime
    }
    
    updatePuppyPositions()
  }
  
  // 开始比赛
  const startRace = () => {
    if (raceState.value.isRunning) return
    
    console.log('开始比赛...');
    
    // 启动倒计时
    isCountdownActive.value = true
    countdownId.value = startCountdown(
      TIMER_CONSTANTS.COUNTDOWN_DURATION,
      (remaining) => {
        countdown.value = remaining
      },
      () => {
        // 倒计时结束，开始比赛
        console.log('倒计时结束，比赛开始!');
        isCountdownActive.value = false
        countdown.value = 0
        
        // 设置比赛状态
        raceState.value = {
          ...raceState.value,
          isRunning: true,
          isFinished: false,
          startTime: Date.now(),
          winner: null
        }
        
        // 创建新的小狗状态数组，所有小狗开始奔跑
        const newPositions = puppyPositions.value.map(puppy => ({
          ...puppy,
          state: 'running'
        }));
        
        // 替换整个数组以触发响应式更新
        puppyPositions.value = newPositions;
        updateCounter.value++;
        
        console.log('所有小狗开始奔跑:', puppyPositions.value);
        
        // 启动计时器
        timerId.value = createTimer(updateTimer);
      }
    )
  }
  
  // 暂停比赛
  const pauseRace = () => {
    if (!raceState.value.isRunning) return
    
    raceState.value.isRunning = false
    
    if (timerId.value !== null) {
      clearTimer(timerId.value)
      timerId.value = null
    }
  }
  
  // 继续比赛
  const resumeRace = () => {
    if (raceState.value.isRunning || raceState.value.isFinished) return
    
    raceState.value.isRunning = true
    timerId.value = createTimer(updateTimer)
  }
  
  // 完成比赛
  const finishRace = () => {
    raceState.value.isRunning = false
    raceState.value.isFinished = true
    raceState.value.endTime = Date.now()
    
    if (timerId.value !== null) {
      clearTimer(timerId.value)
      timerId.value = null
    }
    
    console.log('比赛结束:', raceState.value);
  }
  
  // 重置比赛
  const resetRace = () => {
    console.log('重置比赛...');
    
    // 清除计时器
    if (timerId.value !== null) {
      clearTimer(timerId.value)
      timerId.value = null
    }
    
    if (countdownId.value !== null) {
      clearTimer(countdownId.value)
      countdownId.value = null
    }
    
    // 重置状态
    raceState.value = {
      isRunning: false,
      isFinished: false,
      startTime: null,
      endTime: null,
      winner: null
    }
    
    isCountdownActive.value = false
    countdown.value = 0
    currentTime.value = 0
    
    // 重置小狗位置
    initializePuppyPositions()
  }
  
  // 组件挂载时初始化
  onMounted(() => {
    console.log('赛跑组件已挂载，初始化小狗位置');
    initializePuppyPositions()
  })
  
  // 组件卸载时清理
  onUnmounted(() => {
    console.log('赛跑组件已卸载，清理资源');
    
    if (timerId.value !== null) {
      clearTimer(timerId.value)
    }
    
    if (countdownId.value !== null) {
      clearTimer(countdownId.value)
    }
  })
  
  return {
    // 状态
    raceState,
    puppyPositions,
    currentTime,
    countdown,
    isCountdownActive,
    updateCounter,
    
    // 计算属性
    formattedTime,
    formattedCountdown,
    
    // 方法
    getPuppyStateClasses,
    getPuppyPositionStyle,
    startRace,
    pauseRace,
    resumeRace,
    resetRace
  }
} 