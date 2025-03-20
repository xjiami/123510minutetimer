import { defineStore } from 'pinia';

export const useTimerStore = defineStore('timer', {
  state: () => ({
    // 计时器设置
    minutes: 5,
    seconds: 0,
    
    // 计时器状态
    isRunning: false,
    isFinished: false,
    remainingSeconds: 300, // 默认5分钟
    
    // 音效设置
    soundEnabled: true,
    
    // 上次使用的计时器类型
    lastTimerType: null,
    
    // 历史记录
    history: [],
    
    // 计时器间隔
    timerInterval: null
  }),
  
  getters: {
    // 总秒数
    totalSeconds: (state) => state.minutes * 60 + state.seconds,
    
    // 进度
    progress: (state) => {
      const total = state.minutes * 60 + state.seconds;
      if (total === 0) return 0;
      return 1 - (state.remainingSeconds / total);
    },
    
    // 格式化时间
    formattedTime: (state) => {
      const mins = Math.floor(state.remainingSeconds / 60);
      const secs = state.remainingSeconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  },
  
  actions: {
    // 设置时间
    setTime(minutes, seconds) {
      this.minutes = minutes;
      this.seconds = seconds;
      this.resetTimer();
    },
    
    // 开始计时器
    startTimer() {
      if (this.isFinished) {
        this.resetTimer();
      }
      
      this.isRunning = true;
      this.isFinished = false;
      
      // 创建计时器间隔，每秒更新一次
      if (typeof window !== 'undefined') {
        // 清除可能存在的旧计时器
        if (this.timerInterval) {
          clearInterval(this.timerInterval);
        }
        
        this.timerInterval = setInterval(() => {
          this.decrementTime();
        }, 1000);
      }
    },
    
    // 暂停计时器
    pauseTimer() {
      this.isRunning = false;
      
      // 清除计时器间隔
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    },
    
    // 重置计时器
    resetTimer() {
      this.isRunning = false;
      this.isFinished = false;
      this.remainingSeconds = this.totalSeconds;
      
      // 清除计时器间隔
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    },
    
    // 计时器结束
    finishTimer() {
      this.isRunning = false;
      this.isFinished = true;
      this.remainingSeconds = 0;
      
      // 清除计时器间隔
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
      
      // 添加到历史记录
      this.addToHistory();
    },
    
    // 减少剩余时间
    decrementTime() {
      if (this.remainingSeconds > 0) {
        this.remainingSeconds--;
      } else {
        this.finishTimer();
      }
    },
    
    // 切换音效
    toggleSound() {
      this.soundEnabled = !this.soundEnabled;
    },
    
    // 设置上次使用的计时器类型
    setLastTimerType(type) {
      this.lastTimerType = type;
    },
    
    // 添加到历史记录
    addToHistory() {
      const historyItem = {
        id: Date.now(),
        type: this.lastTimerType,
        duration: this.totalSeconds,
        timestamp: new Date().toISOString()
      };
      
      this.history.unshift(historyItem);
      
      // 限制历史记录数量
      if (this.history.length > 10) {
        this.history.pop();
      }
    },
    
    // 清空历史记录
    clearHistory() {
      this.history = [];
    }
  }
}); 