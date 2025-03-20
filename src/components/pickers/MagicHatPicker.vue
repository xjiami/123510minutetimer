<template>
  <div class="magic-hat-container">
    <div class="hat-wrapper" @click="startSelection" :class="{ 'hat-active': isSelecting }">
      <div class="hat">
        <div class="hat-top"></div>
        <div class="hat-band"></div>
        <div class="hat-bottom"></div>
      </div>
      <div class="hat-stars" v-if="isSelecting">
        <div v-for="i in 10" :key="i" class="star" :style="getRandomStyle()">✨</div>
      </div>
    </div>
    
    <div class="name-cloud" v-if="isSelecting">
      <div v-for="(name, index) in props.names" :key="index" class="cloud-name" :style="getRandomStyle()">
        {{ name }}
      </div>
    </div>
    
    <div class="selection-text">
      {{ isSelecting ? $t('pickers.pickingAnimation') : $t('pickers.drawFromHat') }}
    </div>
    
    <div v-if="selectedName" class="selected-result">
      <div class="result-announcement">{{ $t('pickers.resultAnnouncement') }}</div>
      <div class="result-name">{{ selectedName }}</div>
    </div>
    
    <button 
      class="magic-button" 
      @click="startSelection" 
      :disabled="isSelecting || names.length < 2"
    >
      {{ $t('pickers.drawFromHat') }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  names: {
    type: Array,
    required: true,
    default: () => []
  }
});

const emit = defineEmits(['pick']);

const isSelecting = ref(false);
const selectedName = ref('');

const canSelect = computed(() => {
  return props.names.length >= 2 && !isSelecting.value;
});

function startSelection() {
  if (!canSelect.value) return;
  
  isSelecting.value = true;
  selectedName.value = '';
  
  // 播放魔法音效
  const audio = new Audio();
  audio.src = '/sounds/magic.mp3';
  audio.play().catch(e => console.log('无法播放音效:', e));
  
  // 魔法选择动画
  setTimeout(() => {
    const randomIndex = Math.floor(Math.random() * props.names.length);
    selectedName.value = props.names[randomIndex];
    isSelecting.value = false;
    
    // 发出选择事件
    emit('pick', selectedName.value);
  }, 2000);
}

function getRandomStyle() {
  const size = Math.floor(Math.random() * 10) + 14; // 14px - 24px
  const opacity = Math.random() * 0.5 + 0.3; // 0.3 - 0.8
  const top = Math.floor(Math.random() * 80) + 10; // 10% - 90%
  const left = Math.floor(Math.random() * 80) + 10; // 10% - 90%
  const delay = Math.random() * 0.5; // 0 - 0.5s
  
  return {
    fontSize: `${size}px`,
    opacity: opacity,
    top: `${top}%`,
    left: `${left}%`,
    animationDelay: `${delay}s`
  };
}
</script>

<style scoped>
.magic-hat-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: relative;
}

.hat-wrapper {
  position: relative;
  width: 200px;
  height: 200px;
  margin-bottom: 30px;
}

.hat {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 160px;
  height: 120px;
  transition: transform 0.3s ease;
}

.hat-active {
  transform: translateX(-50%) translateY(-10px);
}

.hat-top {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background-color: #2c3e50;
  border-radius: 50% 50% 0 0;
  clip-path: polygon(0 40%, 100% 40%, 100% 100%, 0 100%);
}

.hat-band {
  position: absolute;
  top: 70px;
  left: -5px;
  width: 110%;
  height: 15px;
  background-color: #9b59b6;
  border-radius: 2px;
  z-index: 2;
}

.hat-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background-color: #2c3e50;
  border-radius: 0 0 50% 50%;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}

.hat-stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
}

.star {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #f1c40f;
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  animation: twinkle 1s infinite alternate;
}

.star:nth-child(1) { top: 20%; left: 20%; animation-delay: 0.1s; }
.star:nth-child(2) { top: 30%; left: 70%; animation-delay: 0.3s; }
.star:nth-child(3) { top: 60%; left: 40%; animation-delay: 0.5s; }
.star:nth-child(4) { top: 50%; left: 80%; animation-delay: 0.7s; }
.star:nth-child(5) { top: 70%; left: 10%; animation-delay: 0.9s; }

.wand {
  position: absolute;
  bottom: 20px;
  right: 20px;
  transform: rotate(-30deg);
  transform-origin: bottom right;
  cursor: pointer;
  transition: transform 0.3s ease;
  z-index: 4;
}

.wand-active {
  transform: rotate(10deg);
}

.wand-handle {
  width: 80px;
  height: 10px;
  background-color: #8e44ad;
  border-radius: 5px;
}

.wand-tip {
  position: absolute;
  top: -5px;
  left: -10px;
  width: 20px;
  height: 20px;
  background-color: #f1c40f;
  border-radius: 50%;
  box-shadow: 0 0 10px #f1c40f;
}

.result-container {
  position: relative;
  width: 100%;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.selected-name {
  font-size: 28px;
  font-weight: bold;
  color: #8e44ad;
  text-align: center;
  padding: 10px 20px;
  background-color: rgba(241, 196, 15, 0.2);
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(241, 196, 15, 0.5);
}

.name-cloud {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.floating-name {
  position: absolute;
  color: #8e44ad;
  animation: float 2s infinite alternate;
  white-space: nowrap;
}

.magic-button {
  padding: 12px 24px;
  background-color: #9b59b6;
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.magic-button:hover:not(:disabled) {
  background-color: #8e44ad;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.magic-button:disabled {
  background-color: #d2b4de;
  cursor: not-allowed;
}

/* 动画 */
@keyframes twinkle {
  0% { opacity: 0.3; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1.2); }
}

@keyframes float {
  0% { transform: translateY(0) rotate(-5deg); }
  100% { transform: translateY(-20px) rotate(5deg); }
}

.float-enter-active,
.float-leave-active {
  transition: all 0.5s ease;
}

.float-enter-from,
.float-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style> 