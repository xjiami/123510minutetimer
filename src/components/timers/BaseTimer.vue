<template>
  <div class="base-timer" :class="{ finished: isFinished, running: isRunning }">
    <div class="timer-circle">
      <div class="timer-progress-circle" :style="{ backgroundImage: `conic-gradient(var(--primary-color) ${progress}%, transparent 0%)` }"></div>
      <div class="timer-inner">
        <div class="timer-digits">
          {{ formattedTime }}
        </div>
        <div class="timer-state">
          {{ isFinished ? 'Finished' : (isRunning ? 'Running' : 'Ready') }}
        </div>
      </div>
    </div>
    <div class="timer-progress">
      <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

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

// 计算格式化的时间显示
const formattedTime = computed(() => {
  const minutes = Math.floor(props.time / 60);
  const seconds = props.time % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

defineEmits(['timer-end']);
</script>

<style scoped>
.base-timer {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 2rem;
}

.timer-circle {
  width: 300px;
  height: 300px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: var(--bg-light, #f5f5f5);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.timer-progress-circle {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: transparent;
  transform: rotate(-90deg);
  transition: background-image 0.5s linear;
}

.timer-inner {
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 2;
}

.timer-digits {
  font-size: 4rem;
  font-weight: bold;
  color: var(--text-dark, #333);
}

.timer-state {
  margin-top: 1rem;
  font-size: 1.2rem;
  color: var(--text-light, #666);
}

.timer-progress {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 8px;
  background-color: var(--gray, #e0e0e0);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: var(--primary-color, #4caf50);
  transition: width 0.5s linear;
}

.base-timer.running .timer-inner {
  animation: pulse 2s infinite ease-in-out;
}

.base-timer.finished .progress-bar,
.base-timer.finished .timer-progress-circle {
  background-color: var(--secondary-color, #ff9800);
  background-image: conic-gradient(var(--secondary-color, #ff9800) 100%, transparent 0%);
}

.base-timer.finished .timer-digits {
  color: var(--secondary-color, #ff9800);
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

@media (max-width: 768px) {
  .timer-circle {
    width: 240px;
    height: 240px;
  }
  
  .timer-inner {
    width: 200px;
    height: 200px;
  }
  
  .timer-digits {
    font-size: 3rem;
  }
}
</style> 