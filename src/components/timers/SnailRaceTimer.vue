<template>
  <base-timer 
    :time="time" 
    :progress="progress" 
    :is-running="isRunning" 
    :is-finished="isFinished"
    @timer-end="handleTimerEnd"
  >
    <div class="snail-race-timer">
      <div class="race-track" ref="trackRef">
        <div class="grass-bg"></div>
        <div class="finish-line"></div>
        
        <!-- 蜗牛移动的黏液痕迹 -->
        <div class="slime-trail" v-if="isRunning || isFinished">
          <div 
            v-for="i in 8" 
            :key="`slime-${i}`" 
            class="slime-spot"
            :style="{ 
              left: `${(progress * 80) - (i * 6)}%`, 
              opacity: Math.max(0, 1 - (i * 0.15)),
              width: `${Math.max(10, 20 - i * 2)}px`
            }"
          ></div>
        </div>
        
        <!-- 蜗牛本体 -->
        <div 
          class="snail"
          :class="{ 
            'snail-moving': isRunning, 
            'snail-finished': isFinished,
            'snail-celebration': isFinished
          }"
          :style="{ left: `${progress * 80}%` }"
          ref="snailRef"
        >
          <div class="snail-body"></div>
          <div class="snail-shell" :class="{ 'shell-wobble': isRunning }">
            <div class="shell-pattern"></div>
          </div>
          
          <!-- 眼睛 -->
          <div class="snail-eyes">
            <div class="snail-eye left-eye" :class="{ 'eye-blink': isRunning }">
              <div class="pupil"></div>
            </div>
            <div class="snail-eye right-eye" :class="{ 'eye-blink': isRunning }">
              <div class="pupil"></div>
            </div>
          </div>
          
          <!-- 触角 -->
          <div class="snail-antennas">
            <div 
              class="snail-antenna left-antenna" 
              :class="{ 'antenna-wobble': isRunning }"
            >
              <div class="antenna-tip"></div>
            </div>
            <div 
              class="snail-antenna right-antenna" 
              :class="{ 'antenna-wobble-delay': isRunning }"
            >
              <div class="antenna-tip"></div>
            </div>
          </div>
        </div>
        
        <!-- 完成线的旗帜 -->
        <div class="finish-flag" v-if="isFinished">
          <div class="flag-top"></div>
        </div>
      </div>
    </div>
  </base-timer>
</template>

<script setup>
import { ref } from 'vue';
import { gsap } from 'gsap';
import BaseTimer from './BaseTimer.vue';

const props = defineProps({
  time: {
    type: Number,
    required: true
  },
  progress: {
    type: Number,
    required: true
  },
  isRunning: {
    type: Boolean,
    default: false
  },
  isFinished: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['timer-end']);

const snailRef = ref(null);
const trackRef = ref(null);

// 处理计时结束事件
const handleTimerEnd = () => {
  emit('timer-end');
  
  // 蜗牛到达终点的庆祝动画
  if (snailRef.value) {
    // 上下跳跃
    gsap.to(snailRef.value, {
      y: -20,
      duration: 0.3,
      repeat: 4,
      yoyo: true,
      ease: "power1.inOut"
    });
    
    // 眼睛变大
    gsap.to('.snail-eye', {
      scale: 1.3,
      duration: 0.2,
      repeat: 1,
      yoyo: true,
      delay: 0.3
    });
    
    // 触角快速摆动
    gsap.to('.snail-antenna', {
      rotation: 15,
      duration: 0.2,
      repeat: 6,
      yoyo: true,
      stagger: 0.1,
      delay: 0.1
    });
  }
  
  // 赛道庆祝效果
  if (trackRef.value) {
    gsap.to(trackRef.value, {
      backgroundColor: '#e8f5e9',
      duration: 0.5,
      yoyo: true,
      repeat: 2
    });
  }
};
</script>

<style scoped>
.snail-race-timer {
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.race-track {
  width: 100%;
  height: 120px;
  background-color: #e0e0e0;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s;
}

/* 草地背景 */
.grass-bg {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40px;
  background: linear-gradient(to bottom, transparent, rgba(139, 195, 74, 0.3));
  z-index: 1;
}

/* 完成线 */
.finish-line {
  position: absolute;
  top: 0;
  right: 10%;
  width: 5px;
  height: 100%;
  background: repeating-linear-gradient(
    to bottom,
    #000,
    #000 10px,
    #fff 10px,
    #fff 20px
  );
  z-index: 3;
}

/* 完成旗帜 */
.finish-flag {
  position: absolute;
  top: 5px;
  right: calc(10% - 15px);
  width: 30px;
  height: 25px;
  background-color: #f44336;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 70%);
  z-index: 4;
  animation: flag-wave 1s infinite alternate;
}

.flag-top {
  position: absolute;
  top: -30px;
  left: 2px;
  width: 3px;
  height: 30px;
  background-color: #795548;
  z-index: 4;
}

/* 黏液痕迹 */
.slime-trail {
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 100%;
  height: 10px;
  z-index: 2;
}

.slime-spot {
  position: absolute;
  bottom: 0;
  height: 5px;
  background-color: rgba(176, 235, 150, 0.6);
  border-radius: 50%;
  filter: blur(2px);
  transition: left 0.5s linear;
}

/* 蜗牛 */
.snail {
  position: absolute;
  bottom: 20px;
  left: 0;
  width: 90px;
  height: 60px;
  transition: left 0.5s linear;
  z-index: 4;
}

.snail-body {
  position: absolute;
  bottom: 0;
  left: 25px;
  width: 65px;
  height: 25px;
  background: linear-gradient(to right, #8bc34a, #9ccc65);
  border-radius: 20px 30px 30px 20px;
  transition: transform 0.3s;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
}

.snail-shell {
  position: absolute;
  bottom: 15px;
  left: 0;
  width: 45px;
  height: 45px;
  background: radial-gradient(circle at 30% 30%, #ffb74d, #ff9800);
  border-radius: 50%;
  border: 2px solid #e65100;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.shell-pattern {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 75%;
  height: 75%;
  border: 3px solid rgba(230, 81, 0, 0.5);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.shell-pattern::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50%;
  height: 50%;
  border: 2px solid rgba(230, 81, 0, 0.5);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

/* 眼睛 */
.snail-eyes {
  position: absolute;
  bottom: 35px;
  left: 70px;
  display: flex;
  gap: 6px;
}

.snail-eye {
  width: 12px;
  height: 12px;
  background-color: #fff;
  border-radius: 50%;
  border: 1px solid #555;
  position: relative;
}

.pupil {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background-color: #333;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.left-eye {
  transform: translateY(-5px);
}

.right-eye {
  transform: translateY(2px);
}

/* 触角 */
.snail-antennas {
  position: absolute;
  bottom: 38px;
  left: 74px;
  z-index: 3;
}

.snail-antenna {
  position: absolute;
  bottom: 0;
  width: 2px;
  height: 20px;
  background-color: #8bc34a;
  transform-origin: bottom center;
}

.left-antenna {
  left: -2px;
  transform: rotate(-25deg);
}

.right-antenna {
  left: 8px;
  transform: rotate(-5deg);
}

.antenna-tip {
  position: absolute;
  top: -3px;
  left: -3px;
  width: 8px;
  height: 8px;
  background-color: #8bc34a;
  border-radius: 50%;
}

/* 动画类 */
.snail-moving .snail-body {
  animation: body-stretch 1.5s infinite alternate ease-in-out;
}

.shell-wobble {
  animation: shell-wobble 3s infinite alternate ease-in-out;
}

.eye-blink {
  animation: eye-blink 4s infinite;
}

.antenna-wobble {
  animation: antenna-wobble 2s infinite alternate ease-in-out;
}

.antenna-wobble-delay {
  animation: antenna-wobble 2s infinite alternate-reverse ease-in-out;
}

.snail-finished {
  transition: transform 0.5s ease-out;
  transform-origin: center bottom;
}

.snail-celebration {
  animation: celebrate 1s ease-in-out;
}

/* 关键帧动画 */
@keyframes body-stretch {
  0% {
    transform: scaleX(1) translateY(0);
  }
  50% {
    transform: scaleX(0.95) translateY(1px);
  }
  100% {
    transform: scaleX(1.05) translateY(-1px);
  }
}

@keyframes shell-wobble {
  0% {
    transform: rotate(-3deg);
  }
  100% {
    transform: rotate(3deg);
  }
}

@keyframes eye-blink {
  0%, 95%, 100% {
    transform: scaleY(1);
  }
  97% {
    transform: scaleY(0.1);
  }
}

@keyframes antenna-wobble {
  0% {
    transform: rotate(-30deg);
  }
  100% {
    transform: rotate(-15deg);
  }
}

@keyframes celebrate {
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
</style> 