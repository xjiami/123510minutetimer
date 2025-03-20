<template>
  <base-timer 
    :time="time" 
    :progress="progress" 
    :is-running="isRunning" 
    :is-finished="isFinished"
    @timer-end="handleTimerEnd"
  >
    <div class="candle-timer">
      <div class="candle-container" ref="candleContainerRef">
        <div class="candle" ref="candleRef">
          <!-- 火焰部分 -->
          <div class="flame-container" v-if="!isFinished">
            <div class="flame-glow"></div>
            <div class="flame">
              <div class="flame-inner"></div>
              <div class="flame-core"></div>
            </div>
            <!-- 烟雾效果 -->
            <div class="smoke-container" v-if="isRunning">
              <div class="smoke" v-for="n in 5" :key="`smoke-${n}`"></div>
            </div>
          </div>
          
          <!-- 烟雾效果（熄灭时） -->
          <div class="extinguished-smoke-container" v-if="isFinished">
            <div class="extinguished-smoke" v-for="n in 8" :key="`ext-smoke-${n}`"></div>
          </div>
          
          <!-- 蜡烛芯 -->
          <div class="wick" :class="{ 'burnt': isFinished }"></div>
          
          <!-- 蜡烛体 -->
          <div class="wax" :style="{ height: `${(1 - progress) * 200}px` }">
            <!-- 蜡油滴落痕迹 -->
            <div class="wax-drips-container">
              <div 
                v-for="n in 5" 
                :key="`wax-drip-${n}`" 
                class="wax-drip"
                :style="{
                  left: `${10 + n * 15}%`,
                  height: `${20 + n * 5}px`,
                  width: `${8 + (n % 3) * 2}px`,
                  transform: `rotate(${(n % 2 === 0 ? -1 : 1) * (3 + n)}deg)`
                }"
              ></div>
            </div>
          </div>
          
          <!-- 蜡油滴落动画 -->
          <div class="drips-container" v-if="isRunning && progress > 0.05">
            <div 
              class="drip" 
              v-for="n in 5" 
              :key="`drip-${n}`"
              :style="{
                left: `${10 + ((n * 17) % 80)}%`,
                animationDelay: `${n * 1.2}s`,
                animationDuration: `${3 + (n % 3)}s`
              }"
            >
              <div class="drop"></div>
            </div>
          </div>
        </div>
        
        <!-- 蜡烛座 -->
        <div class="candle-holder">
          <div class="candle-holder-inner"></div>
          <!-- 蜡油积累 -->
          <div class="wax-pool" :style="{ opacity: Math.min(progress * 2, 1) }"></div>
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

const candleRef = ref(null);
const candleContainerRef = ref(null);

// 处理计时结束事件
const handleTimerEnd = () => {
  emit('timer-end');
  animateCandleExtinguish();
};

// 蜡烛熄灭动画
const animateCandleExtinguish = () => {
  // 蜡烛微微震动
  gsap.to(candleContainerRef.value, {
    x: 2,
    duration: 0.05,
    repeat: 6,
    yoyo: true,
    ease: "power1.inOut"
  });
  
  // 火焰消失效果
  gsap.to('.flame', {
    height: 0,
    opacity: 0,
    duration: 0.3,
    ease: "power2.in"
  });
  
  gsap.to('.flame-glow', {
    opacity: 0,
    scale: 0.5,
    duration: 0.5,
    ease: "power2.in"
  });
  
  // 烟雾效果增强
  gsap.to('.extinguished-smoke', {
    opacity: 1,
    y: -50,
    stagger: 0.08,
    duration: 2,
    ease: "power1.out"
  });
};
</script>

<style scoped>
.candle-timer {
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.candle-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.candle {
  width: 80px;
  height: 200px;
  background-color: #fff;
  border-radius: 10px 10px 0 0;
  position: relative;
  overflow: visible;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.wax {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to bottom, #f8f8f8, #eeeeee);
  border-radius: 10px 10px 0 0;
  transition: height 0.5s linear;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
}

/* 蜡油痕迹 */
.wax-drips-container {
  position: absolute;
  top: -10px;
  width: 100%;
  height: 100%;
}

.wax-drip {
  position: absolute;
  top: 0;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 5px 5px 10px 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.05);
}

/* 蜡烛芯 */
.wick {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 20px;
  background: linear-gradient(to bottom, #333, #666);
  z-index: 2;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
}

.wick.burnt {
  background: #555;
  height: 10px;
  border-radius: 0 0 2px 2px;
  top: -5px;
}

/* 火焰容器 */
.flame-container {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
}

/* 火焰光晕 */
.flame-glow {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  background-color: rgba(255, 160, 10, 0.2);
  border-radius: 50%;
  filter: blur(10px);
  animation: glow 2s infinite alternate;
}

/* 火焰 */
.flame {
  position: relative;
  width: 20px;
  height: 40px;
  background: linear-gradient(to top, #ff9800, #ffeb3b);
  border-radius: 50% 50% 20% 20%;
  transform-origin: center bottom;
  animation: flicker 0.5s infinite alternate;
  box-shadow: 0 0 10px rgba(255, 152, 0, 0.5);
}

.flame-inner {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 25px;
  background: linear-gradient(to top, #ffeb3b, #fff);
  border-radius: 50% 50% 20% 20%;
  animation: flicker-inner 0.3s infinite alternate;
}

.flame-core {
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background-color: #fff;
  border-radius: 50%;
  filter: blur(1px);
}

/* 滴落的蜡油 */
.drips-container {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.drip {
  position: absolute;
  top: 0;
  animation: drip-move 4s ease-in infinite;
}

.drop {
  width: 12px;
  height: 18px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 6px 6px 12px 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  animation: drop-form 0.3s ease-out;
}

/* 蜡烛座 */
.candle-holder {
  width: 140px;
  height: 25px;
  background: linear-gradient(to bottom, #b0bec5, #90a4ae);
  border-radius: 5px;
  margin-top: 5px;
  position: relative;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.candle-holder-inner {
  position: absolute;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: 90px;
  height: 15px;
  background-color: #78909c;
  border-radius: 3px;
}

/* 蜡油池 */
.wax-pool {
  position: absolute;
  top: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 1s ease;
}

/* 烟雾效果 */
.smoke-container {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 10px;
  z-index: 1;
}

.smoke {
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: rgba(200, 200, 200, 0.3);
  border-radius: 50%;
  animation: smoke-rise 3s ease-out infinite;
  opacity: 0;
}

.smoke:nth-child(1) { animation-delay: 0s; }
.smoke:nth-child(2) { animation-delay: 0.6s; }
.smoke:nth-child(3) { animation-delay: 1.2s; }
.smoke:nth-child(4) { animation-delay: 1.8s; }
.smoke:nth-child(5) { animation-delay: 2.4s; }

/* 熄灭后的烟雾 */
.extinguished-smoke-container {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  z-index: 3;
}

.extinguished-smoke {
  position: absolute;
  width: 15px;
  height: 15px;
  background-color: rgba(150, 150, 150, 0.6);
  border-radius: 50%;
  opacity: 0;
  filter: blur(3px);
}

.extinguished-smoke:nth-child(1) { left: 0; top: 0; }
.extinguished-smoke:nth-child(2) { left: 15px; top: -5px; }
.extinguished-smoke:nth-child(3) { left: 25px; top: 0; }
.extinguished-smoke:nth-child(4) { left: 5px; top: -10px; }
.extinguished-smoke:nth-child(5) { left: 20px; top: -15px; }
.extinguished-smoke:nth-child(6) { left: 10px; top: -20px; }
.extinguished-smoke:nth-child(7) { left: 25px; top: -25px; }
.extinguished-smoke:nth-child(8) { left: 15px; top: -30px; }

/* 动画定义 */
@keyframes flicker {
  0%, 100% {
    transform: translateX(-50%) scale(1.0, 1.0) rotate(0deg);
  }
  25% {
    transform: translateX(-51%) scale(1.1, 0.9) rotate(1deg);
  }
  50% {
    transform: translateX(-49%) scale(0.9, 1.1) rotate(-1deg);
  }
  75% {
    transform: translateX(-52%) scale(1.05, 0.95) rotate(2deg);
  }
}

@keyframes flicker-inner {
  0%, 100% {
    transform: translateX(-50%) scale(1.0, 1.0);
  }
  50% {
    transform: translateX(-50%) scale(1.1, 0.9);
  }
}

@keyframes glow {
  0% {
    opacity: 0.5;
    filter: blur(10px);
  }
  100% {
    opacity: 0.8;
    filter: blur(15px);
  }
}

@keyframes drip-move {
  0% {
    top: 0;
    opacity: 0;
  }
  10% {
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    top: 180px;
    opacity: 0;
  }
}

@keyframes drop-form {
  0% {
    height: 0;
    border-radius: 50%;
  }
  100% {
    height: 18px;
    border-radius: 6px 6px 12px 12px;
  }
}

@keyframes smoke-rise {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 0.3;
  }
  50% {
    transform: translateY(-20px) scale(2);
    opacity: 0.2;
  }
  100% {
    transform: translateY(-40px) scale(3);
    opacity: 0;
  }
}
</style> 