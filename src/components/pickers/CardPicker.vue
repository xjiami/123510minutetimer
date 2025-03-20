<template>
  <div class="card-picker-container">
    <div class="card-deck" :class="{ 'shuffling': isShuffling }">
      <div 
        v-for="(card, index) in cards" 
        :key="index"
        class="card"
        :class="{ 
          'card-selected': selectedCardIndex === index,
          'card-flipped': flippedCards[index]
        }"
        :style="getCardStyle(index)"
        @click="selectCard(index)"
      >
        <div class="card-inner">
          <div class="card-front">
            <div class="card-pattern">
              <div class="card-symbol">🃏</div>
            </div>
          </div>
          <div class="card-back">
            <div class="card-content">
              {{ card.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="card-controls">
      <button 
        class="shuffle-button" 
        @click="shuffleCards" 
        :disabled="isShuffling || selectedCardIndex !== null"
      >
        {{ $t('pickers.shuffleCards') }}
      </button>
      <button 
        class="reset-button" 
        @click="resetCards"
        :disabled="isShuffling"
      >
        {{ $t('pickers.resetCards') }}
      </button>
    </div>
    
    <div class="card-result" v-if="selectedCard">
      <div class="result-title">{{ $t('pickers.selectedCard') }}</div>
      <div class="result-name">{{ selectedCard.name }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
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

const isShuffling = ref(false);
const selectedCardIndex = ref(null);
const flippedCards = ref({});
const cards = ref([]);

// 监听名单变化，更新卡片
watch(() => props.names, (newNames) => {
  resetCards();
}, { immediate: true, deep: true });

// 选中的卡片
const selectedCard = computed(() => {
  if (selectedCardIndex.value !== null) {
    return cards.value[selectedCardIndex.value];
  }
  return null;
});

// 初始化卡片
function initCards() {
  cards.value = props.names.map(name => ({ name }));
  
  // 如果名称不足7个，添加空卡片凑够7张
  const minCards = 7;
  if (cards.value.length < minCards) {
    for (let i = cards.value.length; i < minCards; i++) {
      cards.value.push({ name: `卡片 ${i + 1}`, isEmpty: true });
    }
  }
  
  // 重置翻转状态
  flippedCards.value = {};
}

// 获取卡片样式
function getCardStyle(index) {
  const totalCards = cards.value.length;
  const angle = (index - (totalCards - 1) / 2) * 8;
  const translateY = Math.abs(angle) * 0.8;
  
  if (selectedCardIndex.value === index) {
    return {
      transform: 'translateY(-100px) rotateZ(0deg)',
      zIndex: 100
    };
  }
  
  return {
    transform: `translateY(${translateY}px) rotateZ(${angle}deg)`,
    zIndex: index
  };
}

// 选择卡片
function selectCard(index) {
  if (isShuffling.value || selectedCardIndex.value !== null) return;
  
  // 播放选牌音效
  const audio = new Audio();
  audio.src = '/sounds/card.mp3';
  audio.play().catch(e => console.log('无法播放音效:', e));
  
  selectedCardIndex.value = index;
  
  // 翻转选中的卡片
  setTimeout(() => {
    flippedCards.value = { ...flippedCards.value, [index]: true };
    
    // 如果选中的不是空卡片，发出选择事件
    const card = cards.value[index];
    if (!card.isEmpty) {
      emit('pick', card.name);
    }
  }, 500);
}

// 洗牌
function shuffleCards() {
  if (isShuffling.value) return;
  
  isShuffling.value = true;
  selectedCardIndex.value = null;
  flippedCards.value = {};
  
  // 播放洗牌音效
  const audio = new Audio();
  audio.src = '/sounds/shuffle.mp3';
  audio.play().catch(e => console.log('无法播放音效:', e));
  
  // 洗牌动画
  setTimeout(() => {
    // 随机排序卡片
    cards.value = [...cards.value].sort(() => Math.random() - 0.5);
    isShuffling.value = false;
  }, 1500);
}

// 重置卡片
function resetCards() {
  selectedCardIndex.value = null;
  flippedCards.value = {};
  initCards();
}

// 初始化
initCards();
</script>

<style scoped>
.card-picker-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  height: 100%;
}

.card-deck {
  position: relative;
  width: 100%;
  height: 300px;
  margin-bottom: 2rem;
  perspective: 1000px;
}

.card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 160px;
  height: 220px;
  transition: all 0.5s ease;
  cursor: pointer;
  transform-style: preserve-3d;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.card-flipped .card-inner {
  transform: rotateY(180deg);
}

.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.card-front {
  background-color: #3498db;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 5px solid white;
}

.card-back {
  background-color: white;
  transform: rotateY(180deg);
  display: flex;
  justify-content: center;
  align-items: center;
  border: 5px solid #3498db;
}

.card-pattern {
  width: 80%;
  height: 80%;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-symbol {
  font-size: 3rem;
  color: white;
}

.card-content {
  font-size: 1.5rem;
  font-weight: bold;
  color: #3498db;
  text-align: center;
  padding: 1rem;
}

.card-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.shuffle-button, .reset-button {
  padding: 12px 24px;
  border: none;
  border-radius: 30px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.shuffle-button {
  background-color: #3498db;
  color: white;
}

.shuffle-button:hover:not(:disabled) {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.reset-button {
  background-color: #e74c3c;
  color: white;
}

.reset-button:hover:not(:disabled) {
  background-color: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.shuffle-button:disabled, .reset-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.card-result {
  margin-top: 1rem;
  text-align: center;
}

.result-title {
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-bottom: 0.5rem;
}

.result-name {
  font-size: 2rem;
  font-weight: bold;
  color: #3498db;
  padding: 1rem;
  background-color: rgba(52, 152, 219, 0.1);
  border-radius: 10px;
}

.shuffling .card {
  animation: shuffle 1.5s ease-in-out;
}

@keyframes shuffle {
  0%, 100% { transform: translate(-50%, -50%) rotateZ(0deg); }
  25% { transform: translate(-60%, -40%) rotateZ(-10deg) scale(0.9); }
  50% { transform: translate(-40%, -60%) rotateZ(10deg) scale(1.1); }
  75% { transform: translate(-30%, -50%) rotateZ(-5deg) scale(0.95); }
}
</style> 