<template>
  <div class="duck-race-timer">
    <div class="timer-container">
      <div class="pond" ref="pondRef">
        <!-- 水面波纹背景 -->
        <div class="water-surface">
          <div class="water-waves"></div>
          <!-- 添加更多水波纹层 -->
          <div class="water-waves water-waves-2"></div>
          <div class="water-waves water-waves-3"></div>
          
          <!-- 添加泡泡效果 -->
          <div class="bubbles-container">
            <div v-for="i in 15" :key="`bubble-${i}`" 
                class="bubble"
                :style="{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  width: `${Math.random() * 10 + 5}px`,
                  height: `${Math.random() * 10 + 5}px`
                }">
            </div>
          </div>
        </div>
        
        <!-- 植物装饰 -->
        <div class="water-plants">
          <div class="plant plant-1"></div>
          <div class="plant plant-2"></div>
          <div class="plant plant-3"></div>
          <!-- 添加更多水草和装饰 -->
          <div class="plant plant-4"></div>
          <div class="plant plant-5"></div>
          <div class="lily-pad"></div>
          
          <!-- 添加小鱼 -->
          <div class="fish fish-1"></div>
          <div class="fish fish-2"></div>
        </div>
        
        <!-- 终点线 -->
        <div class="finish-line"></div>
        <div class="finish-flag" v-if="isFinished">
          <div class="flag-pole"></div>
          <div class="flag"></div>
        </div>
        
        <!-- 鸭子 -->
        <div 
          class="duck" 
          :class="{ 
            'duck-swim': isRunning && !isFinished,
            'duck-finished': isFinished
          }"
          :style="{ left: `${duckPosition}%` }"
          ref="duckRef"
        >
          <!-- 鸭子身体 -->
          <div class="duck-body">
            <div class="duck-head">
              <div class="duck-eye"></div>
              <div class="duck-bill"></div>
            </div>
            <div class="duck-wing" :class="{ 'wing-flap': isRunning && !isFinished }"></div>
            <div class="duck-tail" :class="{ 'tail-wag': isRunning && !isFinished }"></div>
          </div>
          
          <!-- 水波纹效果 -->
          <div class="ripples">
            <div class="ripple ripple-1"></div>
            <div class="ripple ripple-2"></div>
            <div class="ripple ripple-3"></div>
          </div>
          
          <!-- 水花效果 -->
          <div class="splashes" v-if="isRunning && !isFinished">
            <div class="splash splash-1"></div>
            <div class="splash splash-2"></div>
            <!-- 添加更多水花效果 -->
            <div class="splash splash-3"></div>
            <div class="splash splash-4"></div>
          </div>
        </div>
        
        <!-- 添加计时里程碑标记 -->
        <div class="milestone-markers">
          <div v-for="i in 4" :key="`marker-${i}`"
               class="milestone"
               :style="{ left: `${i * 20}%` }">
            {{ i * 20 }}%
          </div>
        </div>
        
        <!-- 添加加油助威动画 -->
        <div class="cheer-container" v-if="isRunning && !isFinished">
          <div class="cheer-bubble" v-if="duckPosition > 25 && duckPosition < 30">加油!</div>
          <div class="cheer-bubble" v-if="duckPosition > 50 && duckPosition < 55">继续!</div>
          <div class="cheer-bubble" v-if="duckPosition > 75 && duckPosition < 80">快到了!</div>
        </div>
      </div>
      
      <!-- 更新计时显示，添加动画效果 -->
      <div class="timer-display" :class="{'pulse-animation': seconds <= 10 && isRunning}">
        <div class="time">{{ formattedTime }}</div>
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
import { ref, computed, watch } from 'vue';
import { gsap } from 'gsap';
import { useTimerStore } from '../../store/timerStore';
import { formatTime } from '../../utils/timerUtils';

const props = defineProps({
  initialMinutes: {
    type: Number,
    default: 5
  },
  initialSeconds: {
    type: Number,
    default: 0
  }
});

const timerStore = useTimerStore();
const isRunning = ref(false);
const isFinished = ref(false);
const minutes = ref(props.initialMinutes);
const seconds = ref(props.initialSeconds);
const duckPosition = ref(0);
const duckRef = ref(null);
const pondRef = ref(null);

// 计算总时间（秒）
const totalTime = computed(() => {
  return minutes.value * 60 + seconds.value;
});

// 格式化时间显示
const formattedTime = computed(() => {
  return formatTime(minutes.value, seconds.value);
});

// 更新鸭子位置
const updateDuckPosition = () => {
  const initialTotalTime = props.initialMinutes * 60 + props.initialSeconds;
  const remainingTime = minutes.value * 60 + seconds.value;
  const progress = initialTotalTime === 0 ? 0 : (initialTotalTime - remainingTime) / initialTotalTime;
  
  // 使用GSAP制作更平滑的动画
  if (isRunning.value && !isFinished.value) {
    gsap.to(duckRef.value, {
      left: `${Math.min(98, progress * 98)}%`,
      duration: 0.5,
      ease: "power1.out"
    });
  } else {
    duckPosition.value = Math.min(98, progress * 98);
  }
};

// 监听计时状态变化
watch(() => isRunning.value, (newValue) => {
  if (newValue) {
    // 计时器开始时添加额外的duck-swim类
    gsap.to(duckRef.value, {
      y: -5,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  } else {
    // 计时器暂停时停止动画
    gsap.killTweensOf(duckRef.value);
  }
});

// 监听时间变化，更新鸭子位置
watch([minutes, seconds], () => {
  updateDuckPosition();
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
    timerStore.setLastTimerType('duck-race');
  }
};

// 重置计时器
const resetTimer = () => {
  isRunning.value = false;
  isFinished.value = false;
  minutes.value = props.initialMinutes;
  seconds.value = props.initialSeconds;
  duckPosition.value = 0;
  timerStore.resetTimer();
};

// 计时结束时的庆祝动画
const celebrateFinish = () => {
  if (duckRef.value) {
    // 鸭子庆祝动画
    gsap.to(duckRef.value, {
      y: -20,
      duration: 0.4,
      repeat: 3,
      yoyo: true,
      ease: "power1.inOut"
    });
    
    // 眼睛动画
    gsap.to('.duck-eye', {
      scale: 1.5,
      duration: 0.2,
      repeat: 2,
      yoyo: true
    });
    
    // 水面波纹震动
    gsap.to('.water-waves', {
      scaleY: 1.2,
      duration: 0.3,
      repeat: 5,
      yoyo: true
    });
  }
  
  // 池塘颜色变化
  if (pondRef.value) {
    gsap.to(pondRef.value, {
      backgroundColor: '#a1d6ff',
      duration: 0.5,
      repeat: 3,
      yoyo: true
    });
  }
};

// 计时器结束回调
const onTimerFinished = () => {
  isRunning.value = false;
  isFinished.value = true;
  duckPosition.value = 98; // 确保鸭子到达终点
  celebrateFinish();
};

// 计时器滴答回调
const onTimerTick = (remainingMinutes, remainingSeconds) => {
  minutes.value = remainingMinutes;
  seconds.value = remainingSeconds;
};

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
.duck-race-timer {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.timer-container {
  width: 100%;
  background-color: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.pond {
  position: relative;
  width: 100%;
  height: 150px;
  background-color: #b3e0ff;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid #85c6ff;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.1);
}

/* 水面波纹 */
.water-surface {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.water-waves {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0.1) 0%, 
    rgba(255, 255, 255, 0.2) 10%, 
    rgba(255, 255, 255, 0.1) 20%,
    rgba(255, 255, 255, 0.2) 30%,
    rgba(255, 255, 255, 0.1) 40%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.1) 60%,
    rgba(255, 255, 255, 0.2) 70%,
    rgba(255, 255, 255, 0.1) 80%,
    rgba(255, 255, 255, 0.2) 90%,
    rgba(255, 255, 255, 0.1) 100%
  );
  background-size: 100% 100%;
  animation: water-wave 20s linear infinite;
}

/* 水草装饰 */
.water-plants {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.plant {
  position: absolute;
  bottom: 0;
  width: 15px;
  height: 30px;
  background-color: rgba(0, 150, 50, 0.6);
  border-radius: 30% 30% 0 0;
  transform-origin: bottom center;
  animation: plant-sway 5s ease-in-out infinite alternate;
}

.plant-1 {
  left: 10%;
  height: 40px;
  animation-delay: 0s;
}

.plant-2 {
  left: 40%;
  height: 35px;
  animation-delay: 1s;
}

.plant-3 {
  right: 20%;
  height: 45px;
  animation-delay: 2s;
}

/* 终点线和旗帜 */
.finish-line {
  position: absolute;
  top: 0;
  right: 0;
  width: 5px;
  height: 100%;
  background: repeating-linear-gradient(
    45deg,
    black,
    black 10px,
    white 10px,
    white 20px
  );
  z-index: 10;
}

.finish-flag {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 11;
}

.flag-pole {
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 40px;
  background-color: #555;
}

.flag {
  position: absolute;
  top: 0;
  left: 3px;
  width: 25px;
  height: 15px;
  background-color: #f44336;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 50%);
  animation: flag-wave 1s infinite alternate;
}

/* 鸭子样式 */
.duck {
  position: absolute;
  bottom: 30px;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: left 0.5s ease-in-out;
  z-index: 5;
}

.duck-body {
  position: relative;
  width: 50px;
  height: 40px;
  background-color: #ffeb3b;
  border-radius: 50% 60% 60% 40%;
  z-index: 6;
}

.duck-head {
  position: absolute;
  top: -15px;
  right: -10px;
  width: 25px;
  height: 25px;
  background-color: #ffeb3b;
  border-radius: 50%;
}

.duck-eye {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 6px;
  height: 6px;
  background-color: #333;
  border-radius: 50%;
}

.duck-bill {
  position: absolute;
  top: 12px;
  right: -8px;
  width: 15px;
  height: 10px;
  background-color: #ff9800;
  border-radius: 50% 50% 50% 50% / 30% 30% 70% 70%;
}

.duck-wing {
  position: absolute;
  top: 5px;
  left: 10px;
  width: 20px;
  height: 15px;
  background-color: #ffd54f;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  transform-origin: top left;
}

.duck-tail {
  position: absolute;
  bottom: 5px;
  left: -5px;
  width: 15px;
  height: 12px;
  background-color: #ffd54f;
  border-radius: 30% 10% 10% 40%;
  transform-origin: right center;
}

/* 水波纹效果 */
.ripples {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 30px;
  z-index: 4;
}

.ripple {
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  opacity: 0.7;
}

.ripple-1 {
  width: 35px;
  animation: ripple 2s infinite;
}

.ripple-2 {
  width: 45px;
  animation: ripple 2s 0.5s infinite;
}

.ripple-3 {
  width: 55px;
  animation: ripple 2s 1s infinite;
}

/* 水花效果 */
.splashes {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.splash {
  position: absolute;
  width: 8px;
  height: 12px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50% 50% 0 0;
}

.splash-1 {
  left: -15px;
  animation: splash 2s infinite;
}

.splash-2 {
  left: 15px;
  animation: splash 2s 0.7s infinite;
}

/* 动画类 */
.duck-swim {
  animation: duck-swim 1.2s infinite ease-in-out;
}

.wing-flap {
  animation: wing-flap 0.6s infinite ease-in-out;
}

.tail-wag {
  animation: tail-wag 0.8s infinite ease-in-out;
}

.duck-finished {
  animation: duck-happy 0.8s ease-in-out;
}

/* 动画关键帧 */
@keyframes duck-swim {
  0% {
    transform: translateY(0) rotate(-3deg);
  }
  50% {
    transform: translateY(-8px) rotate(0deg);
  }
  100% {
    transform: translateY(0) rotate(3deg);
  }
}

@keyframes wing-flap {
  0% {
    transform: rotate(0deg) scaleY(1);
  }
  50% {
    transform: rotate(20deg) scaleY(0.8);
  }
  100% {
    transform: rotate(0deg) scaleY(1);
  }
}

@keyframes tail-wag {
  0% {
    transform: rotate(-15deg);
  }
  50% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(15deg);
  }
}

@keyframes ripple {
  0% {
    transform: translateX(-50%) scale(0.8);
    opacity: 0.8;
  }
  50% {
    transform: translateX(-50%) scale(1.5);
    opacity: 0.6;
  }
  100% {
    transform: translateX(-50%) scale(0.8);
    opacity: 0.8;
  }
}

@keyframes splash {
  0% {
    transform: translateY(0) scale(0);
    opacity: 0;
  }
  20% {
    transform: translateY(-20px) scale(1.2);
    opacity: 0.9;
  }
  80% {
    transform: translateY(-25px) scale(0.5);
    opacity: 0;
  }
  100% {
    transform: translateY(-30px) scale(0);
    opacity: 0;
  }
}

@keyframes water-wave {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

@keyframes plant-sway {
  0% {
    transform: rotate(-5deg);
  }
  100% {
    transform: rotate(5deg);
  }
}

@keyframes duck-happy {
  0%, 100% {
    transform: scale(1.2) rotate(0deg);
  }
  25% {
    transform: scale(1.2) rotate(-5deg);
  }
  75% {
    transform: scale(1.2) rotate(5deg);
  }
}

@keyframes flag-wave {
  0% {
    transform: skewY(-5deg);
  }
  100% {
    transform: skewY(5deg);
  }
}

.timer-display {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
  font-weight: bold;
  color: var(--primary-color);
  padding: 1rem 0;
}

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
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
}

.control-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.start-button {
  background-color: var(--primary-color);
  color: white;
}

.start-button:not(:disabled):hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
}

.reset-button {
  background-color: var(--secondary-color);
  color: var(--text-dark);
}

.reset-button:not(:disabled):hover {
  background-color: var(--secondary-hover);
  transform: translateY(-2px);
}

/* 添加更多水波纹层 */
.water-waves-2 {
  opacity: 0.6;
  top: 20%;
  animation: water-wave 18s linear infinite reverse;
}

.water-waves-3 {
  opacity: 0.4;
  top: 40%;
  animation: water-wave 22s linear infinite;
}

/* 泡泡效果 */
.bubbles-container {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.bubble {
  position: absolute;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: bubble-rise 5s ease-in infinite;
}

/* 添加更多植物 */
.plant-4 {
  left: 70%;
  height: 30px;
  animation-delay: 1.5s;
}

.plant-5 {
  left: 85%;
  height: 25px;
  animation-delay: 0.5s;
}

.lily-pad {
  position: absolute;
  bottom: 20px;
  left: 60%;
  width: 30px;
  height: 25px;
  background-color: rgba(0, 120, 0, 0.7);
  border-radius: 50%;
  animation: lily-pad-float 4s ease-in-out infinite;
}

/* 小鱼动画 */
.fish {
  position: absolute;
  width: 15px;
  height: 8px;
  background-color: #ff9800;
  border-radius: 50% 0 0 50%;
  opacity: 0.8;
  animation: fish-swim 10s linear infinite;
}

.fish:after {
  content: '';
  position: absolute;
  top: 0;
  right: -5px;
  width: 8px;
  height: 8px;
  background-color: #ff9800;
  clip-path: polygon(0 0, 0 100%, 100% 50%);
}

.fish-1 {
  bottom: 30px;
  left: -30px;
}

.fish-2 {
  bottom: 50px;
  left: -50px;
  animation-delay: 5s;
}

/* 里程碑标记 */
.milestone-markers {
  position: absolute;
  bottom: 5px;
  width: 100%;
  height: 10px;
}

.milestone {
  position: absolute;
  bottom: 0;
  font-size: 8px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.7);
}

/* 加油助威泡泡 */
.cheer-container {
  position: absolute;
  top: 20px;
  width: 100%;
  pointer-events: none;
}

.cheer-bubble {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: bold;
  color: #ff5722;
  animation: cheer-pop 2s ease-out;
}

/* 计时器脉动动画 */
.pulse-animation {
  animation: pulse 0.5s infinite alternate;
}

/* 新动画关键帧 */
@keyframes bubble-rise {
  0% {
    transform: scale(0.5) translateY(0);
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    transform: scale(1.2) translateY(-120px);
    opacity: 0;
  }
}

@keyframes fish-swim {
  0% {
    transform: translateX(-30px) scaleX(1);
  }
  45% {
    transform: translateX(120%) scaleX(1);
  }
  50% {
    transform: translateX(120%) scaleX(-1);
  }
  95% {
    transform: translateX(-30px) scaleX(-1);
  }
  100% {
    transform: translateX(-30px) scaleX(1);
  }
}

@keyframes lily-pad-float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes cheer-pop {
  0% {
    transform: translateX(-50%) scale(0);
    opacity: 0;
  }
  20% {
    transform: translateX(-50%) scale(1.2);
    opacity: 1;
  }
  80% {
    transform: translateX(-50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateX(-50%) scale(0.8);
    opacity: 0;
  }
}

@keyframes pulse {
  from {
    transform: scale(1);
    color: var(--primary-color);
  }
  to {
    transform: scale(1.1);
    color: #ff0000;
  }
}
</style> 