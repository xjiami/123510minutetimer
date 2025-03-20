<template>
  <base-timer 
    :time="time" 
    :progress="progress" 
    :is-running="isRunning" 
    :is-finished="isFinished"
    @timer-end="handleTimerEnd"
  >
    <div class="clock-timer">
      <!-- 放在顶部的计时显示和控制区域 -->
      <div class="top-control-panel">
        <div class="timer-display">{{ Math.floor(time / 60) }}:{{ (time % 60).toString().padStart(2, '0') }}</div>
        <div class="progress-indicator">
          剩余: {{ Math.round(100 - progress * 100) }}%
        </div>
      </div>

      <!-- 放在底部的时钟动画 -->
      <div class="clock-animation">
        <div class="clock" ref="clockRef">
          <div class="clock-face">
            <!-- 时钟刻度 -->
            <div 
              v-for="minute in 60" 
              :key="`minute-${minute}`" 
              class="minute-mark"
              :class="{ 'hour-position': minute % 5 === 0 }"
              :style="{ transform: `rotate(${minute * 6}deg)` }"
            ></div>
            
            <!-- 时钟数字 -->
            <div 
              v-for="hour in 12" 
              :key="`hour-${hour}`" 
              class="hour-mark"
              :style="{ transform: `rotate(${hour * 30}deg) translateY(-80px)` }"
            >
              <span :style="{ transform: `rotate(${-hour * 30}deg)` }">{{ hour }}</span>
            </div>
            
            <!-- 时钟指针 -->
            <div 
              class="clock-hand hour-hand" 
              :style="{ transform: `rotate(${hourRotation}deg)` }"
              ref="hourHandRef"
            ></div>
            <div 
              class="clock-hand minute-hand" 
              :style="{ transform: `rotate(${minuteRotation}deg)` }"
              ref="minuteHandRef"
            ></div>
            <div 
              class="clock-hand second-hand" 
              :style="{ transform: `rotate(${secondRotation}deg)` }"
              ref="secondHandRef"
            ></div>
            
            <!-- 中心点 -->
            <div class="clock-center"></div>
            <div class="clock-center-inner"></div>
          </div>
        </div>
      </div>
    </div>
  </base-timer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
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

const clockRef = ref(null);
const hourHandRef = ref(null);
const minuteHandRef = ref(null);
const secondHandRef = ref(null);

// 计算时针旋转角度
const hourRotation = computed(() => {
  // 一小时30度，12小时一圈
  return 360 - (props.progress * 360);
});

// 计算分针旋转角度
const minuteRotation = computed(() => {
  // 一分钟6度，60分钟一圈
  return 360 - (props.progress * 360 * 12);
});

// 计算秒针旋转角度
const secondRotation = computed(() => {
  // 一秒6度，60秒一圈
  return 360 - (props.progress * 360 * 60);
});

// 当进度变化时，应用GSAP动画使指针移动更平滑
watch(() => props.progress, (newVal, oldVal) => {
  if (props.isRunning && oldVal !== undefined) {
    // 设置GSAP动画，确保指针移动平滑
    gsap.to(hourHandRef.value, {
      rotation: 360 - (newVal * 360),
      duration: 0.2,
      ease: "power1.out",
      transformOrigin: "left center"
    });
    
    gsap.to(minuteHandRef.value, {
      rotation: 360 - (newVal * 360 * 12),
      duration: 0.2,
      ease: "power1.out",
      transformOrigin: "left center"
    });
    
    gsap.to(secondHandRef.value, {
      rotation: 360 - (newVal * 360 * 60),
      duration: 0.2,
      ease: "power1.out", 
      transformOrigin: "left center"
    });
  }
});

// 计时结束的动画
const handleTimerEnd = () => {
  emit('timer-end');
  // 计时结束时，添加时钟振动动画效果
  gsap.to(clockRef.value, {
    rotation: 5,
    duration: 0.1,
    repeat: 8,
    yoyo: true,
    ease: "power2.inOut"
  });
  
  // 指针随机跳动效果
  const randomJump = () => {
    gsap.to([hourHandRef.value, minuteHandRef.value, secondHandRef.value], {
      rotation: "+=" + (Math.random() * 40 - 20),
      duration: 0.2,
      stagger: 0.1,
      repeat: 3,
      yoyo: true,
      ease: "power1.inOut",
      transformOrigin: "left center",
      onComplete: () => {
        // 动画完成后恢复到原始位置
        gsap.to(hourHandRef.value, {
          rotation: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.3)",
          transformOrigin: "left center"
        });
        
        gsap.to(minuteHandRef.value, {
          rotation: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.3)",
          transformOrigin: "left center"
        });
        
        gsap.to(secondHandRef.value, {
          rotation: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.3)",
          transformOrigin: "left center"
        });
      }
    });
  };
  
  setTimeout(randomJump, 1000);
};
</script>

<style scoped>
.clock-timer {
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.top-control-panel {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.timer-display {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.progress-indicator {
  font-size: 1.2rem;
  color: #666;
}

.clock-animation {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.clock {
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background-color: #f8f8f8;
  border: 10px solid #333;
  position: relative;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.1);
  background-image: radial-gradient(circle, #fff 0%, #f0f0f0 70%, #e0e0e0 100%);
}

.clock-face {
  width: 100%;
  height: 100%;
  position: relative;
}

/* 中心点样式 */
.clock-center {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 14px;
  height: 14px;
  background-color: #333;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 6;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

.clock-center-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  background-color: #999;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 7;
}

/* 时钟指针样式 */
.clock-hand {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: left center;
  z-index: 3;
  border-radius: 6px 0 0 6px;
}

.hour-hand {
  width: 60px;
  height: 8px;
  background-color: #333;
  border-radius: 4px;
  transform: rotate(0deg);
  z-index: 3;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
}

.minute-hand {
  width: 85px;
  height: 6px;
  background-color: #555;
  border-radius: 3px;
  transform: rotate(0deg);
  z-index: 4;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
}

.second-hand {
  width: 95px;
  height: 2px;
  background-color: var(--primary-color, #f44336);
  border-radius: 1px;
  transform: rotate(0deg);
  z-index: 5;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* 时钟刻度 */
.minute-mark {
  position: absolute;
  top: 0;
  left: 50%;
  width: 2px;
  height: 8px;
  background-color: #999;
  transform-origin: bottom center;
  transform: translateX(-50%);
}

.minute-mark.hour-position {
  width: 3px;
  height: 14px;
  background-color: #333;
}

/* 刻度线位置调整 */
.minute-mark {
  position: absolute;
  top: 10px;
  left: 50%;
  transform-origin: center 115px;
}

/* 时钟数字 */
.hour-mark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center;
  font-weight: bold;
  font-size: 18px;
  color: #333;
  z-index: 2;
}

.hour-mark span {
  display: block;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
}

/* 添加时钟边框渐变效果 */
.clock::before {
  content: '';
  position: absolute;
  top: -13px;
  left: -13px;
  right: -13px;
  bottom: -13px;
  border-radius: 50%;
  background: linear-gradient(135deg, #333, #555);
  z-index: -1;
}
</style> 