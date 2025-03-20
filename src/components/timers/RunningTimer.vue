<template>
  <div class="running-timer">
    <div class="timer-container">
      <div class="track-scene" ref="trackRef">
        <!-- 跑道背景 -->
        <div class="track-background">
          <div class="sky"></div>
          <div class="stadium">
            <div class="audience"></div>
            <div v-for="i in 20" :key="`person-${i}`" class="person" :style="{
              left: `${5 + i * 4.5}%`,
              animationDelay: `${Math.random() * 2}s`
            }"></div>
          </div>
          <div class="track">
            <div class="track-line"></div>
            <div v-for="i in 8" :key="`lane-${i}`" class="lane"></div>
          </div>
        </div>
        
        <!-- 起点线和终点线 -->
        <div class="start-line"></div>
        <div class="finish-line" :class="{ 'highlight': isFinished }"></div>
        
        <!-- 运动员 -->
        <div 
          class="runner" 
          :class="{ 
            'running': isRunning && !isFinished,
            'celebrating': isFinished,
            'ready': !isRunning && !isFinished
          }"
          :style="{ 
            left: `${runnerPosition}%`
          }"
          ref="runnerRef"
        >
          <div class="runner-body">
            <div class="head"></div>
            <div class="torso"></div>
            <div class="arm arm-left"></div>
            <div class="arm arm-right"></div>
            <div class="leg leg-left"></div>
            <div class="leg leg-right"></div>
          </div>
        </div>
        
        <!-- 进度指示器 -->
        <div class="progress-indicator" :style="{ width: `${progressPercentage}%` }"></div>
      </div>
      
      <!-- 计时显示 -->
      <div class="timer-display" :class="{ 'finished': isFinished }">
        <div class="time">{{ formattedTime }}</div>
        <div class="message" v-if="isFinished">完成!</div>
      </div>
      
      <div class="timer-controls">
        <button 
          class="control-button start-button" 
          @click="toggleTimer" 
          :disabled="isFinished"
        >
          {{ isRunning ? '暂停' : (isFinished ? '完成' : '开始') }}
        </button>
        <button 
          class="control-button reset-button" 
          @click="resetTimer" 
          :disabled="isRunning && !isFinished"
        >
          重置
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { gsap } from 'gsap';
import { useTimerStore } from '../../store/timerStore';
import { formatTime } from '../../utils/timerUtils';

const props = defineProps({
  initialMinutes: {
    type: Number,
    default: 1
  },
  initialSeconds: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['timer-end']);

const timerStore = useTimerStore();
const isRunning = ref(false);
const isFinished = ref(false);
const minutes = ref(props.initialMinutes);
const seconds = ref(props.initialSeconds);
const runnerPosition = ref(10); // 起始位置为10%
const runnerRef = ref(null);
const trackRef = ref(null);

// 计算总时间（秒）
const totalTime = computed(() => {
  return props.initialMinutes * 60 + props.initialSeconds;
});

// 计算剩余时间（秒）
const remainingTime = computed(() => {
  return minutes.value * 60 + seconds.value;
});

// 计算进度百分比
const progressPercentage = computed(() => {
  if (totalTime.value === 0) return 0;
  return Math.min(100, Math.max(0, (1 - remainingTime.value / totalTime.value) * 100));
});

// 格式化时间显示
const formattedTime = computed(() => {
  return formatTime(minutes.value, seconds.value);
});

// 根据计时进度更新运动员位置
watch(progressPercentage, (newValue) => {
  // 运动员从10%位置（起点）跑到90%位置（终点）
  runnerPosition.value = 10 + (newValue / 100) * 80;
});

// 为计时添加动态效果
watch([minutes, seconds], ([newMin, newSec], [oldMin, oldSec]) => {
  if (isRunning.value && !isFinished.value) {
    // 每当秒数变化时
    if (newSec !== oldSec) {
      // 根据剩余时间调整运动员动画速度
      const currentTime = newMin * 60 + newSec;
      const totalInitialTime = props.initialMinutes * 60 + props.initialSeconds;
      const timeRatio = currentTime / totalInitialTime;
      
      // 接近终点时速度加快
      if (timeRatio < 0.2 && runnerRef.value) {
        gsap.to(runnerRef.value.style, {
          '--running-speed': '0.25s',
          duration: 1
        });
      }
    }
  }
});

// 开始/暂停计时器
const toggleTimer = () => {
  if (isRunning.value) {
    // 暂停
    isRunning.value = false;
    timerStore.pauseTimer();
  } else {
    // 开始
    if (isFinished.value) {
      resetTimer();
    }
    isRunning.value = true;
    timerStore.setTime(minutes.value, seconds.value);
    timerStore.startTimer();
    timerStore.setLastTimerType('running');
    
    // 设置运动员跑步动画速度
    if (runnerRef.value) {
      gsap.to(runnerRef.value.style, {
        '--running-speed': '0.5s',
        duration: 0.5
      });
    }
  }
};

// 重置计时器
const resetTimer = () => {
  isRunning.value = false;
  isFinished.value = false;
  minutes.value = props.initialMinutes;
  seconds.value = props.initialSeconds;
  
  // 重置运动员位置和状态
  runnerPosition.value = 10;
  
  // 重置动画速度
  if (runnerRef.value) {
    gsap.to(runnerRef.value.style, {
      '--running-speed': '0.6s',
      duration: 0.5
    });
  }
  
  timerStore.resetTimer();
};

// 冲线庆祝动画
const celebrateFinish = () => {
  if (!runnerRef.value) return;
  
  // 观众欢呼效果
  gsap.to('.person', {
    y: -10,
    duration: 0.2,
    stagger: {
      each: 0.05,
      from: "center",
      grid: "auto"
    },
    repeat: 3,
    yoyo: true
  });
  
  // 冲刺加速
  gsap.to(runnerRef.value.style, {
    '--running-speed': '0.2s',
    duration: 0.5
  });
  
  // 终点线效果
  gsap.to('.finish-line', {
    opacity: 1,
    scaleY: 1.2,
    duration: 0.3,
    repeat: 3,
    yoyo: true
  });
  
  // 庆祝动画
  setTimeout(() => {
    gsap.to(runnerRef.value, {
      y: -20,
      duration: 0.3,
      repeat: 2,
      yoyo: true,
      onComplete: () => {
        gsap.to(runnerRef.value, {
          rotation: 360,
          duration: 1,
          ease: "power1.inOut"
        });
      }
    });
  }, 500);
  
  // 通知父组件
  emit('timer-end');
};

// 计时器结束回调
const onTimerFinished = () => {
  isRunning.value = false;
  isFinished.value = true;
  celebrateFinish();
};

// 计时器滴答回调
const onTimerTick = (remainingMinutes, remainingSeconds) => {
  minutes.value = remainingMinutes;
  seconds.value = remainingSeconds;
};

// 组件挂载
onMounted(() => {
  // 初始化运动员动画速度
  if (runnerRef.value) {
    runnerRef.value.style.setProperty('--running-speed', '0.6s');
  }
});

// 订阅计时器事件
timerStore.$subscribe((mutation, state) => {
  if (isRunning.value) {
    if (state.isFinished) {
      onTimerFinished();
    } else {
      onTimerTick(state.minutes, state.seconds);
    }
  }
});
</script>

<style scoped>
.running-timer {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.timer-container {
  width: 100%;
  background-color: var(--white, #ffffff);
  border-radius: var(--border-radius, 8px);
  box-shadow: var(--box-shadow, 0 2px 10px rgba(0, 0, 0, 0.1));
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.track-scene {
  position: relative;
  width: 100%;
  height: 250px;
  background-color: #f5f5f5;
  border-radius: 10px;
  overflow: hidden;
}

/* 跑道背景 */
.track-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.sky {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40%;
  background: linear-gradient(to bottom, #87CEEB, #B0E0E6);
  z-index: 1;
}

.stadium {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 30%;
  background-color: #9E9E9E;
  z-index: 2;
}

.audience {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    #BDBDBD,
    #BDBDBD 3px,
    #9E9E9E 3px,
    #9E9E9E 6px
  );
}

.person {
  position: absolute;
  top: 50%;
  width: 6px;
  height: 10px;
  background-color: #424242;
  border-radius: 50% 50% 0 0;
  z-index: 3;
  animation: cheer 2s infinite;
}

.track {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60%;
  background-color: #E57373;
  z-index: 4;
}

.track-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background-color: #FFFFFF;
}

.lane {
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: rgba(255, 255, 255, 0.5);
}

.lane:nth-child(2) { top: 12.5%; }
.lane:nth-child(3) { top: 25%; }
.lane:nth-child(4) { top: 37.5%; }
.lane:nth-child(5) { top: 50%; }
.lane:nth-child(6) { top: 62.5%; }
.lane:nth-child(7) { top: 75%; }
.lane:nth-child(8) { top: 87.5%; }
.lane:nth-child(9) { top: 100%; }

.start-line {
  position: absolute;
  bottom: 0;
  left: 10%;
  width: 2px;
  height: 60%;
  background-color: #FFFFFF;
  z-index: 6;
}

.finish-line {
  position: absolute;
  bottom: 0;
  left: 90%;
  width: 4px;
  height: 60%;
  background-color: #FFFFFF;
  z-index: 6;
  background: repeating-linear-gradient(
    to bottom,
    #000000,
    #000000 5px,
    #FFFFFF 5px,
    #FFFFFF 10px
  );
}

.finish-line.highlight {
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.7);
}

/* 进度指示器 */
.progress-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 5px;
  background-color: rgba(33, 150, 243, 0.5);
  z-index: 5;
  transition: width 0.3s linear;
}

/* 运动员 */
.runner {
  --running-speed: 0.6s;
  position: absolute;
  bottom: 30%;
  width: 30px;
  height: 60px;
  z-index: 10;
  transition: left 0.3s linear;
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
  width: 15px;
  height: 15px;
  background-color: #795548;
  border-radius: 50%;
}

.torso {
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 20px;
  background-color: #FF5722;
  border-radius: 3px;
}

.arm {
  position: absolute;
  top: 18px;
  width: 12px;
  height: 3px;
  background-color: #795548;
  border-radius: 3px;
  transform-origin: 0 50%;
}

.arm-left {
  left: 5px;
}

.arm-right {
  right: 5px;
  transform-origin: 100% 50%;
}

.leg {
  position: absolute;
  top: 35px;
  width: 3px;
  height: 20px;
  background-color: #795548;
  border-radius: 3px;
  transform-origin: top center;
}

.leg-left {
  left: 40%;
}

.leg-right {
  right: 40%;
}

/* 运动员状态动画 */
.runner.ready .arm-left {
  transform: rotate(-30deg);
}

.runner.ready .arm-right {
  transform: rotate(30deg);
}

.runner.ready .leg-left {
  transform: rotate(-5deg);
}

.runner.ready .leg-right {
  transform: rotate(5deg);
}

.runner.running .arm-left {
  animation: swing-arm-left var(--running-speed) infinite alternate;
}

.runner.running .arm-right {
  animation: swing-arm-right var(--running-speed) infinite alternate;
}

.runner.running .leg-left {
  animation: swing-leg-left var(--running-speed) infinite alternate;
}

.runner.running .leg-right {
  animation: swing-leg-right var(--running-speed) infinite alternate;
}

.runner.running .head {
  animation: head-bob var(--running-speed) infinite alternate;
}

.runner.running .torso {
  animation: torso-tilt var(--running-speed) infinite alternate;
}

.runner.celebrating .arm-left {
  animation: celebrate-arm-left 0.5s infinite alternate;
}

.runner.celebrating .arm-right {
  animation: celebrate-arm-right 0.5s infinite alternate;
}

.runner.celebrating .leg-left,
.runner.celebrating .leg-right {
  animation: celebrate-leg 1s infinite alternate;
}

/* 计时显示 */
.timer-display {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 3rem;
  font-weight: bold;
  color: var(--primary-color, #2196F3);
  padding: 1rem 0;
  transition: all 0.5s ease;
}

.timer-display.finished {
  color: #4CAF50;
}

.timer-display .message {
  font-size: 1.5rem;
  color: #4CAF50;
  margin-top: 0.5rem;
  animation: pulse 0.5s infinite alternate;
}

/* 控制按钮 */
.timer-controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.control-button {
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: var(--border-radius, 8px);
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
}

.control-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.start-button {
  background-color: var(--primary-color, #2196F3);
  color: white;
}

.start-button:not(:disabled):hover {
  background-color: var(--primary-hover, #1E88E5);
  transform: translateY(-2px);
}

.reset-button {
  background-color: var(--secondary-color, #f5f5f5);
  color: var(--text-dark, #333333);
}

.reset-button:not(:disabled):hover {
  background-color: var(--secondary-hover, #e0e0e0);
  transform: translateY(-2px);
}

/* 动画关键帧 */
@keyframes swing-arm-left {
  0% {
    transform: rotate(45deg);
  }
  100% {
    transform: rotate(-45deg);
  }
}

@keyframes swing-arm-right {
  0% {
    transform: rotate(-45deg);
  }
  100% {
    transform: rotate(45deg);
  }
}

@keyframes swing-leg-left {
  0% {
    transform: rotate(30deg);
  }
  100% {
    transform: rotate(-30deg);
  }
}

@keyframes swing-leg-right {
  0% {
    transform: rotate(-30deg);
  }
  100% {
    transform: rotate(30deg);
  }
}

@keyframes head-bob {
  0% {
    transform: translateX(-50%) translateY(0);
  }
  100% {
    transform: translateX(-50%) translateY(2px);
  }
}

@keyframes torso-tilt {
  0% {
    transform: translateX(-50%) rotate(-3deg);
  }
  100% {
    transform: translateX(-50%) rotate(3deg);
  }
}

@keyframes celebrate-arm-left {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(120deg);
  }
}

@keyframes celebrate-arm-right {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-120deg);
  }
}

@keyframes celebrate-leg {
  0% {
    transform: rotate(-5deg);
  }
  100% {
    transform: rotate(5deg);
  }
}

@keyframes cheer {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
  }
}
</style> 