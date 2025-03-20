<template>
  <div class="timer-display">
    <div class="time">{{ time }}</div>
    <div v-if="isCountdownActive" class="countdown">{{ countdown }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  time: string
  countdown: string
  isCountdownActive: boolean
}>()
</script>

<style scoped>
.timer-display {
  font-size: 5rem;
  font-weight: bold;
  text-align: center;
  color: #4285F4;
  margin-bottom: 20px;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  font-family: 'Digital', 'Courier New', monospace;
}

.countdown {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 10rem;
  color: #FF5252;
  z-index: 100;
  animation: countdown-pulse 1s infinite;
}

@keyframes countdown-pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.2); }
}
</style> 