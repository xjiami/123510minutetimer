<template>
  <div class="dice-picker-container">
    <div class="dice-area">
      <div 
        class="dice" 
        :class="{ 'rolling': isRolling }"
        :style="diceTransform"
      >
        <div class="dice-face face-1">
          <div class="dot center"></div>
        </div>
        <div class="dice-face face-2">
          <div class="dot top-left"></div>
          <div class="dot bottom-right"></div>
        </div>
        <div class="dice-face face-3">
          <div class="dot top-left"></div>
          <div class="dot center"></div>
          <div class="dot bottom-right"></div>
        </div>
        <div class="dice-face face-4">
          <div class="dot top-left"></div>
          <div class="dot top-right"></div>
          <div class="dot bottom-left"></div>
          <div class="dot bottom-right"></div>
        </div>
        <div class="dice-face face-5">
          <div class="dot top-left"></div>
          <div class="dot top-right"></div>
          <div class="dot center"></div>
          <div class="dot bottom-left"></div>
          <div class="dot bottom-right"></div>
        </div>
        <div class="dice-face face-6">
          <div class="dot top-left"></div>
          <div class="dot top-right"></div>
          <div class="dot middle-left"></div>
          <div class="dot middle-right"></div>
          <div class="dot bottom-left"></div>
          <div class="dot bottom-right"></div>
        </div>
      </div>
    </div>
    
    <div class="dice-controls">
      <div class="dice-settings">
        <div class="dice-count">
          <label>{{ $t('pickers.diceCount') }}:</label>
          <select v-model="diceCount">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>
        
        <div class="dice-sides">
          <label>{{ $t('pickers.diceSides') }}:</label>
          <select v-model="diceSides">
            <option value="6">6</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>
      
      <button 
        class="roll-button" 
        @click="rollDice" 
        :disabled="isRolling"
      >
        {{ $t('pickers.roll') }}
      </button>
    </div>
    
    <div class="dice-result" v-if="result">
      <div class="result-number">{{ result }}</div>
      <div class="result-text">
        <template v-if="props.names.length >= result">
          {{ $t('pickers.result') }}: <span class="selected-name">{{ props.names[result - 1] }}</span>
        </template>
        <template v-else>
          <span class="warning">{{ $t('pickers.noMatchingName') }}</span>
        </template>
      </div>
    </div>
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

const isRolling = ref(false);
const result = ref(null);
const diceCount = ref(1);
const diceSides = ref(6);

// 骰子3D变换样式
const diceTransform = computed(() => {
  if (!isRolling.value && result.value) {
    // 根据结果设置骰子朝向
    switch (result.value % 6 || 6) {
      case 1: return { transform: 'rotateX(0deg) rotateY(0deg)' }; // 1朝上
      case 2: return { transform: 'rotateX(0deg) rotateY(-90deg)' }; // 2朝上
      case 3: return { transform: 'rotateX(-90deg) rotateY(0deg)' }; // 3朝上
      case 4: return { transform: 'rotateX(90deg) rotateY(0deg)' }; // 4朝上
      case 5: return { transform: 'rotateX(0deg) rotateY(90deg)' }; // 5朝上
      case 6: return { transform: 'rotateX(180deg) rotateY(0deg)' }; // 6朝上
    }
  }
  return {};
});

// 掷骰子
function rollDice() {
  if (isRolling.value) return;
  
  isRolling.value = true;
  result.value = null;
  
  // 播放骰子音效
  const audio = new Audio();
  audio.src = '/sounds/dice.mp3';
  audio.play().catch(e => console.log('无法播放音效:', e));
  
  // 骰子动画
  setTimeout(() => {
    // 根据骰子数量和面数计算结果
    let total = 0;
    for (let i = 0; i < diceCount.value; i++) {
      total += Math.floor(Math.random() * diceSides.value) + 1;
    }
    
    result.value = total;
    isRolling.value = false;
    
    // 如果结果对应名单中的某个名称，则发出选择事件
    if (props.names.length >= total) {
      emit('pick', props.names[total - 1]);
    }
  }, 2000);
}
</script>

<style scoped>
.dice-picker-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.dice-area {
  width: 200px;
  height: 200px;
  perspective: 600px;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dice {
  width: 100px;
  height: 100px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.5s ease-out;
}

.dice.rolling {
  animation: rolling 2s ease-in-out;
}

.dice-face {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: white;
  border: 2px solid #333;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.1);
}

.dot {
  width: 16px;
  height: 16px;
  background-color: #333;
  border-radius: 50%;
  position: absolute;
}

.center { top: 42px; left: 42px; }
.top-left { top: 20%; left: 20%; }
.top-right { top: 20%; right: 20%; }
.middle-left { top: 42%; left: 20%; }
.middle-right { top: 42%; right: 20%; }
.bottom-left { bottom: 20%; left: 20%; }
.bottom-right { bottom: 20%; right: 20%; }

.face-1 { transform: translateZ(50px); }
.face-2 { transform: rotateY(90deg) translateZ(50px); }
.face-3 { transform: rotateX(-90deg) translateZ(50px); }
.face-4 { transform: rotateX(90deg) translateZ(50px); }
.face-5 { transform: rotateY(-90deg) translateZ(50px); }
.face-6 { transform: rotateX(180deg) translateZ(50px); }

.dice-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 400px;
}

.dice-settings {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 1.5rem;
}

.dice-count, .dice-sides {
  display: flex;
  align-items: center;
}

.dice-count label, .dice-sides label {
  margin-right: 0.5rem;
}

select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.roll-button {
  padding: 12px 24px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.roll-button:hover:not(:disabled) {
  background-color: #388e3c;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.roll-button:disabled {
  background-color: #a5d6a7;
  cursor: not-allowed;
}

.dice-result {
  margin-top: 2rem;
  text-align: center;
}

.result-number {
  font-size: 3rem;
  font-weight: bold;
  color: #4caf50;
  margin-bottom: 0.5rem;
}

.result-text {
  font-size: 1.2rem;
}

.selected-name {
  font-weight: bold;
  color: #4caf50;
}

.warning {
  color: #f44336;
}

@keyframes rolling {
  0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
  20% { transform: rotateX(180deg) rotateY(90deg) rotateZ(180deg); }
  40% { transform: rotateX(360deg) rotateY(180deg) rotateZ(90deg); }
  60% { transform: rotateX(90deg) rotateY(270deg) rotateZ(180deg); }
  80% { transform: rotateX(180deg) rotateY(360deg) rotateZ(270deg); }
  100% { transform: rotateX(360deg) rotateY(450deg) rotateZ(360deg); }
}
</style> 