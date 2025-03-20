<template>
  <div class="controls">
    <button 
      class="btn btn-start" 
      @click="emit('start')" 
      :disabled="isRunning"
    >
      {{ isFinished ? $t('common.reset') : $t('common.start') }}
    </button>
    
    <button 
      class="btn btn-pause" 
      @click="isRunning ? emit('pause') : emit('resume')" 
      :disabled="isFinished"
    >
      {{ isRunning ? $t('common.pause') : $t('common.start') }}
    </button>
    
    <button 
      class="btn btn-reset" 
      @click="emit('reset')" 
      :disabled="!isFinished && !isRunning"
    >
      {{ $t('common.reset') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  isRunning: boolean
  isFinished: boolean
}>()

const emit = defineEmits<{
  (e: 'start'): void
  (e: 'pause'): void
  (e: 'resume'): void
  (e: 'reset'): void
}>()
</script>

<style scoped>
.controls {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.btn {
  padding: 12px 25px;
  font-size: 18px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.btn:active {
  transform: translateY(1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn-start {
  background-color: #4CAF50;
  color: white;
}

.btn-pause {
  background-color: #FFC107;
  color: #333;
}

.btn-reset {
  background-color: #F44336;
  color: white;
}
</style> 