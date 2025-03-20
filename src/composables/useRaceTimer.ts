import { ref, computed } from 'vue'

/**
 * 赛跑计时器逻辑组合式函数
 */
export function useRaceTimer(initialMinutes: number = 5, initialSeconds: number = 0) {
  // 计时状态
  const initialTimeInMs = ref((initialMinutes * 60 + initialSeconds) * 1000)
  const remainingTime = ref(initialTimeInMs.value)
  const countdown = ref(0)
  const isCountdownActive = ref(false)
  const timerId = ref<number | null>(null)

  // 格式化时间显示 - 显示剩余时间
  const formattedTime = computed(() => {
    const minutes = Math.floor(remainingTime.value / 60000)
    const seconds = Math.floor((remainingTime.value % 60000) / 1000)
    const centiseconds = Math.floor((remainingTime.value % 1000) / 10)
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`
  })

  // 倒计时文本
  const formattedCountdown = computed(() => {
    return countdown.value.toString()
  })

  /**
   * 设置初始时间
   */
  const setInitialTime = (minutes: number, seconds: number) => {
    initialTimeInMs.value = (minutes * 60 + seconds) * 1000
    remainingTime.value = initialTimeInMs.value
  }

  /**
   * 开始计时器，包括初始倒计时和主要倒计时
   * @param onCountdownComplete 倒计时完成后的回调函数
   */
  const startTimer = (onCountdownComplete: () => void) => {
    // 开始3秒倒计时
    isCountdownActive.value = true
    countdown.value = 3
    
    const countdownInterval = setInterval(() => {
      countdown.value--
      
      if (countdown.value <= 0) {
        clearInterval(countdownInterval)
        isCountdownActive.value = false
        
        // 3秒倒计时结束，开始主倒计时
        const startTime = Date.now()
        
        // 启动倒计时
        timerId.value = setInterval(() => {
          const elapsed = Date.now() - startTime
          remainingTime.value = Math.max(0, initialTimeInMs.value - elapsed)

          // 如果倒计时到达10秒以下，激活倒计时特效
          if (remainingTime.value <= 10000 && remainingTime.value > 0) {
            isCountdownActive.value = true
          }
          
          // 如果倒计时结束
          if (remainingTime.value <= 0) {
            pauseTimer()
            remainingTime.value = 0
          }
        }, 10) as unknown as number
        
        // 执行回调
        onCountdownComplete()
      }
    }, 1000)
  }

  /**
   * 暂停计时器
   */
  const pauseTimer = () => {
    if (timerId.value) {
      clearInterval(timerId.value)
      timerId.value = null
    }
  }

  /**
   * 重置计时器
   */
  const resetTimer = () => {
    pauseTimer()
    remainingTime.value = initialTimeInMs.value
    countdown.value = 0
    isCountdownActive.value = false
  }

  return {
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
  }
} 