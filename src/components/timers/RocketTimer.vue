<template>
  <div class="rocket-timer">
    <div class="timer-container">
      <div class="launch-scene" ref="sceneRef">
        <!-- 星空背景 -->
        <div class="space-background">
          <div class="stars">
            <!-- 动态生成的星星 -->
            <div v-for="i in 50" :key="`star-${i}`" 
                class="star"
                :style="{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`
                }">
            </div>
            
            <!-- 添加流星效果 -->
            <div v-for="i in 3" :key="`meteor-${i}`" 
                class="meteor"
                :style="{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 30}%`,
                  animationDelay: `${Math.random() * 15 + 5}s`
                }">
            </div>
          </div>
          <div class="moon"></div>
          
          <!-- 添加行星装饰 -->
          <div class="planet planet-1"></div>
          <div class="planet planet-2"></div>
        </div>
        
        <!-- 发射台 -->
        <div class="launch-pad">
          <div class="launch-tower"></div>
          <div class="launch-base"></div>
          
          <!-- 添加支撑臂 -->
          <div class="support-arm left" :class="{ 'arm-release': isRunning && remainingSeconds <= 5 }"></div>
          <div class="support-arm right" :class="{ 'arm-release': isRunning && remainingSeconds <= 5 }"></div>
          
          <!-- 添加倒计时显示灯 -->
          <div class="countdown-lights">
            <div v-for="i in 5" :key="`light-${i}`" 
                class="light"
                :class="{ 'light-active': isRunning && remainingSeconds <= i }">
            </div>
          </div>
        </div>
        
        <!-- 火箭 -->
        <div 
          class="rocket" 
          :class="{ 
            'countdown': isRunning && !isFinished,
            'launch': isFinished,
            'idle': !isRunning && !isFinished
          }"
          :style="{ transform: `translateY(${rocketPosition}px)` }"
          ref="rocketRef"
        >
          <div class="rocket-body">
            <div class="rocket-nose"></div>
            <div class="rocket-window"></div>
            <div class="rocket-fins">
              <div class="fin fin-left"></div>
              <div class="fin fin-right"></div>
            </div>
            
            <!-- 添加舱口和航天员 -->
            <div class="rocket-hatch" :class="{ 'hatch-open': isFinished }">
              <div class="astronaut" v-if="isFinished"></div>
            </div>
          </div>
          
          <!-- 火箭尾焰 - 增强效果 -->
          <div class="engine-flames" v-if="isRunning || isFinished">
            <div class="flame flame-main" :class="{ 'flame-boost': isFinished || remainingSeconds <= 5 }"></div>
            <div class="flame flame-sec flame-left" :class="{ 'flame-boost': isFinished || remainingSeconds <= 5 }"></div>
            <div class="flame flame-sec flame-right" :class="{ 'flame-boost': isFinished || remainingSeconds <= 5 }"></div>
            <div class="flame flame-small" :class="{ 'flame-boost': isFinished || remainingSeconds <= 5 }"></div>
            
            <!-- 添加更多火焰粒子 -->
            <div class="flame-particles">
              <div v-for="i in 20" :key="`particle-${i}`" 
                  class="flame-particle"
                  :style="{
                    left: `${Math.random() * 20 - 10}px`,
                    animationDelay: `${Math.random() * 2}s`,
                    width: `${Math.random() * 4 + 2}px`,
                    height: `${Math.random() * 4 + 2}px`
                  }">
              </div>
            </div>
          </div>
          
          <!-- 烟雾效果 - 增强 -->
          <div class="smoke-container" v-if="isRunning || isFinished">
            <div v-for="i in 12" :key="`smoke-${i}`" 
                class="smoke-cloud"
                :style="{
                  left: `${Math.random() * 40 - 20}px`,
                  animationDelay: `${Math.random() * 3}s`,
                  width: `${Math.random() * 20 + 10}px`,
                  height: `${Math.random() * 20 + 10}px`
                }">
            </div>
          </div>
        </div>
        
        <!-- 添加震动效果容器 -->
        <div class="vibration-effect" :class="{ 'active': isRunning && remainingSeconds <= 10 }"></div>
        
        <!-- 发射后的痕迹 -->
        <div class="launch-trail" v-if="isFinished"></div>
      </div>
      
      <!-- 倒计时显示 -->
      <div class="countdown-display" :class="{ 
        'launch-mode': isFinished,
        'warning-pulse': isRunning && remainingSeconds <= 10 && remainingSeconds > 0
      }">
        <div class="time" v-if="!isFinished">{{ formattedTime }}</div>
        <div class="launch-text" v-if="isFinished">发射!</div>
        
        <!-- 添加倒计时声音提示 -->
        <div class="countdown-voice" v-if="isRunning && remainingSeconds <= 5 && !isFinished">
          {{ remainingSeconds }}
        </div>
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

const timerStore = useTimerStore();
const isRunning = ref(false);
const isFinished = ref(false);
const minutes = ref(props.initialMinutes);
const seconds = ref(props.initialSeconds);
const rocketPosition = ref(0);
const rocketRef = ref(null);
const sceneRef = ref(null);

// 计算总时间（秒）
const totalTime = computed(() => {
  return minutes.value * 60 + seconds.value;
});

// 格式化时间显示
const formattedTime = computed(() => {
  return formatTime(minutes.value, seconds.value);
});

// 添加计算属性获取剩余秒数
const remainingSeconds = computed(() => {
  return minutes.value * 60 + seconds.value;
});

// 为倒计时添加振动效果
watch([minutes, seconds], ([newMin, newSec], [oldMin, oldSec]) => {
  if (isRunning.value && !isFinished.value) {
    // 每当秒数变化时
    if (newSec !== oldSec) {
      // 振动效果增强，接近发射时更强烈
      const remainingTime = newMin * 60 + newSec;
      const initialTotal = props.initialMinutes * 60 + props.initialSeconds;
      const vibrationIntensity = Math.min(5, Math.max(1, 5 * (1 - remainingTime / initialTotal)));
      
      if (rocketRef.value) {
        gsap.to(rocketRef.value, {
          x: vibrationIntensity,
          duration: 0.05,
          repeat: 3,
          yoyo: true,
          ease: "power1.inOut"
        });
      }
      
      // 每10秒增强一次振动效果
      if (remainingTime > 0 && remainingTime % 10 === 0) {
        enhanceShakeEffect();
      }
      
      // 最后10秒的倒计时特效
      if (remainingTime <= 10 && remainingTime > 0) {
        countdownEffect(remainingTime);
      }
    }
  }
});

// 增强振动效果
const enhanceShakeEffect = () => {
  if (sceneRef.value) {
    gsap.to(sceneRef.value, {
      scale: 1.01,
      duration: 0.2,
      yoyo: true,
      repeat: 1
    });
  }
  
  // 增强火焰效果
  gsap.to('.flame', {
    scaleY: 1.5,
    duration: 0.3,
    yoyo: true,
    repeat: 1
  });
};

// 倒计时特效
const countdownEffect = (secondsLeft) => {
  // 火焰效果增强
  gsap.to('.flame', {
    scaleY: 1 + (10 - secondsLeft) * 0.1,
    duration: 0.5,
    yoyo: true,
    repeat: 1
  });
  
  // 烟雾增多
  gsap.to('.smoke-cloud', {
    opacity: 0.8,
    scale: 1.2,
    duration: 0.5,
    stagger: 0.1
  });
  
  // 震动效果增强
  if (rocketRef.value) {
    gsap.to(rocketRef.value, {
      y: "-=2",
      duration: 0.1,
      repeat: 4,
      yoyo: true
    });
  }
};

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
    timerStore.setLastTimerType('rocket');
  }
};

// 重置计时器
const resetTimer = () => {
  isRunning.value = false;
  isFinished.value = false;
  minutes.value = props.initialMinutes;
  seconds.value = props.initialSeconds;
  rocketPosition.value = 0;
  
  // 重置火箭位置
  if (rocketRef.value) {
    gsap.to(rocketRef.value, {
      y: 0,
      duration: 0.5
    });
  }
  
  timerStore.resetTimer();
};

// 发射动画
const launchRocket = () => {
  // 火箭发射前的最后振动
  if (rocketRef.value) {
    gsap.to(rocketRef.value, {
      x: 3,
      duration: 0.05,
      repeat: 10,
      yoyo: true,
      ease: "power1.inOut",
      onComplete: () => {
        // 火箭发射
        gsap.to(rocketRef.value, {
          y: -500,
          duration: 3,
          ease: "power2.in"
        });
      }
    });
  }
  
  // 增强火焰效果
  gsap.to('.flame', {
    scaleY: 3,
    scaleX: 1.5,
    duration: 0.5
  });
  
  // 增加烟雾效果
  gsap.to('.smoke-cloud', {
    opacity: 1,
    scale: 3,
    y: 50,
    duration: 2,
    stagger: 0.1
  });
  
  // 发射台震动
  gsap.to('.launch-pad', {
    x: 5,
    duration: 0.1,
    repeat: 15,
    yoyo: true
  });
  
  // 整个场景效果
  gsap.to(sceneRef.value, {
    scale: 0.95,
    duration: 0.5,
    yoyo: true,
    repeat: 1
  });
};

// 计时器结束回调
const onTimerFinished = () => {
  isRunning.value = false;
  isFinished.value = true;
  launchRocket();
};

// 计时器滴答回调
const onTimerTick = (remainingMinutes, remainingSeconds) => {
  minutes.value = remainingMinutes;
  seconds.value = remainingSeconds;
};

// 创建星星
const createStars = () => {
  const starsContainer = document.querySelector('.stars');
  if (starsContainer) {
    for (let i = 0; i < 100; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 5}s`;
      starsContainer.appendChild(star);
    }
  }
};

// 组件挂载后
onMounted(() => {
  createStars();
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
.rocket-timer {
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

.launch-scene {
  position: relative;
  width: 100%;
  height: 300px;
  background-color: #263238;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.5);
}

/* 星空背景 */
.space-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, #0f0f2d, #1a1a3a);
  overflow: hidden;
}

/* 动态星星 */
.star {
  position: absolute;
  background-color: white;
  border-radius: 50%;
  animation: twinkle 3s infinite alternate;
}

/* 流星效果 */
.meteor {
  position: absolute;
  width: 2px;
  height: 15px;
  background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.8));
  transform: rotate(45deg);
  animation: meteor-fall 10s ease-in infinite;
}

/* 行星装饰 */
.planet {
  position: absolute;
  border-radius: 50%;
}

.planet-1 {
  top: 20%;
  right: 15%;
  width: 20px;
  height: 20px;
  background: radial-gradient(circle at 30% 30%, #e4c59a, #ad7b36);
  box-shadow: 0 0 10px rgba(173, 123, 54, 0.5);
}

.planet-2 {
  top: 60%;
  left: 10%;
  width: 15px;
  height: 15px;
  background: radial-gradient(circle at 30% 30%, #9ac4e4, #366ead);
  box-shadow: 0 0 8px rgba(54, 110, 173, 0.5);
}

/* 月亮增强 */
.moon {
  position: absolute;
  top: 20px;
  right: 30px;
  width: 40px;
  height: 40px;
  background-color: #f0f0f0;
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
  overflow: hidden;
}

.moon:after {
  content: '';
  position: absolute;
  top: 8px;
  left: 8px;
  width: 10px;
  height: 10px;
  background-color: rgba(200, 200, 200, 0.8);
  border-radius: 50%;
  box-shadow: 
    15px 6px 0 -2px rgba(200, 200, 200, 0.6),
    5px 20px 0 -3px rgba(200, 200, 200, 0.7);
}

/* 支撑臂 */
.support-arm {
  position: absolute;
  bottom: 50px;
  width: 10px;
  height: 60px;
  background-color: #777;
  transition: transform 1s ease;
}

.left {
  left: 45%;
  transform-origin: bottom left;
  transform: rotate(15deg);
}

.right {
  right: 45%;
  transform-origin: bottom right;
  transform: rotate(-15deg);
}

.arm-release {
  transform: rotate(90deg);
}

/* 倒计时灯 */
.countdown-lights {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 5px;
}

.light {
  width: 8px;
  height: 8px;
  background-color: #333;
  border-radius: 50%;
  border: 1px solid #555;
  transition: all 0.3s ease;
}

.light-active {
  background-color: #f44336;
  box-shadow: 0 0 8px #f44336;
}

/* 火箭舱口 */
.rocket-hatch {
  position: absolute;
  top: 40%;
  right: 0;
  width: 10px;
  height: 10px;
  background-color: #555;
  border-radius: 50%;
  transition: all 0.5s ease;
}

.hatch-open {
  transform: translateX(8px);
}

.astronaut {
  position: absolute;
  width: 5px;
  height: 8px;
  background-color: white;
  border-radius: 50% 50% 0 0;
  animation: astronaut-float 5s infinite alternate;
}

/* 火焰增强 */
.flame-boost {
  animation-duration: 0.2s !important;
  height: 200% !important;
}

.flame-particles {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 30px;
}

.flame-particle {
  position: absolute;
  bottom: 0;
  background-color: rgba(255, 150, 0, 0.8);
  border-radius: 50%;
  animation: particle-rise 2s ease-out infinite;
}

/* 发射痕迹 */
.launch-trail {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 0;
  background: linear-gradient(to top, rgba(255,255,255,0), rgba(255,255,255,0.5));
  animation: trail-grow 3s forwards;
}

/* 震动效果容器 */
.vibration-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  background: radial-gradient(circle at center, 
    rgba(255,255,255,0.1) 0%, 
    rgba(255,255,255,0) 70%);
  pointer-events: none;
}

.vibration-effect.active {
  animation: vibration-pulse 1s infinite;
}

/* 倒计时显示增强 */
.warning-pulse {
  animation: warning-flash 0.5s infinite alternate;
}

.countdown-voice {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 24px;
  font-weight: bold;
  color: #f44336;
  text-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
  animation: voice-appear 1s ease-out;
}

/* 新增动画关键帧 */
@keyframes twinkle {
  0% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1.2);
  }
}

@keyframes meteor-fall {
  0% {
    transform: translate(0, 0) rotate(45deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  40% {
    opacity: 1;
  }
  60% {
    opacity: 0;
  }
  100% {
    transform: translate(200px, 200px) rotate(45deg);
    opacity: 0;
  }
}

@keyframes astronaut-float {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(10px, -5px) rotate(10deg);
  }
  100% {
    transform: translate(15px, -10px) rotate(-10deg);
  }
}

@keyframes particle-rise {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-50px) scale(0);
    opacity: 0;
  }
}

@keyframes trail-grow {
  0% {
    height: 0;
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  100% {
    height: 100%;
    opacity: 0.7;
  }
}

@keyframes vibration-pulse {
  0%, 100% {
    opacity: 0;
  }
  50% {
    opacity: 0.3;
  }
}

@keyframes warning-flash {
  from {
    background-color: rgba(255, 0, 0, 0.1);
    color: #ff5722;
  }
  to {
    background-color: rgba(255, 0, 0, 0.3);
    color: #ffffff;
  }
}

@keyframes voice-appear {
  0% {
    opacity: 0;
    transform: translateX(-50%) scale(0);
  }
  50% {
    opacity: 1;
    transform: translateX(-50%) scale(1.5);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
}
</style> 