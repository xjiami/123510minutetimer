<template>
  <div class="pickers-page">
    <div class="container">
      <h1 class="page-title text-center">{{ $t('pickers.title') }}</h1>
      <p class="page-description text-center">{{ $t('app.pickersDescription') }}</p>
      
      <div class="pickers-grid">
        <div 
          v-for="picker in pickersList" 
          :key="picker.id" 
          class="picker-card card"
          @click="selectPicker(picker.id)"
        >
          <div class="favorite-btn" @click.stop="toggleFavoritePicker($event, picker.id)">
            <i :class="['fas', isPickerFavorite(picker.id) ? 'fa-star' : 'fa-star-o']"></i>
          </div>
          <div class="picker-content">
            <div class="picker-icon">{{ picker.icon }}</div>
            <h3 class="picker-title">{{ picker.name }}</h3>
            <p class="picker-description">{{ picker.description }}</p>
            <button class="btn">{{ $t('common.use') || '使用此选择器' }}</button>
          </div>
        </div>
      </div>
      
      <!-- 轮盘选择器组件 -->
      <div v-if="activePicker === 'wheel'" class="picker-container">
        <wheel-picker :names="names" @pick="handlePick" />
      </div>
      
      <!-- 魔术帽选择器组件 -->
      <div v-if="activePicker === 'hat'" class="picker-container">
        <magic-hat-picker :names="names" @pick="handlePick" />
      </div>
      
      <!-- 骰子选择器组件 -->
      <div v-if="activePicker === 'dice'" class="picker-container">
        <dice-picker :names="names" @pick="handlePick" />
      </div>
      
      <!-- 抽卡选择器组件 -->
      <div v-if="activePicker === 'cards'" class="picker-container">
        <card-picker :names="names" @pick="handlePick" />
      </div>
      
      <!-- 名单管理 -->
      <div v-if="activePicker" class="names-manager">
        <h3>{{ $t('pickers.namesManager') }}</h3>
        <div class="names-input">
          <textarea 
            v-model="namesText" 
            :placeholder="$t('pickers.enterNames')"
            rows="5"
          ></textarea>
          <div class="names-actions">
            <button class="btn" @click="updateNames">{{ $t('pickers.updateList') }}</button>
            <button class="btn btn-secondary" @click="clearNames">{{ $t('pickers.clearList') }}</button>
          </div>
        </div>
        <div class="names-list">
          <div v-for="(name, index) in names" :key="index" class="name-item">
            {{ name }}
            <button class="name-remove" @click="removeName(index)">×</button>
          </div>
        </div>
      </div>
      
      <!-- 结果显示 -->
      <div v-if="pickedResult" class="result-display">
        <h2>{{ $t('pickers.result') }}</h2>
        <div class="result-content">
          {{ pickedResult }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import WheelPicker from '@/components/pickers/WheelPicker.vue';
import MagicHatPicker from '@/components/pickers/MagicHatPicker.vue';
import DicePicker from '@/components/pickers/DicePicker.vue';
import CardPicker from '@/components/pickers/CardPicker.vue';
import { useSettingsStore } from '../store/settingsStore';

const { t } = useI18n();
const settingsStore = useSettingsStore();

// 当前选中的选择器
const activePicker = ref('');

// 名单文本
const namesText = ref('小明\n小红\n小刚\n小丽\n小华');

// 名单数组
const names = computed(() => {
  return namesText.value.split('\n').filter(name => name.trim() !== '');
});

// 选择结果
const pickedResult = ref('');

// 选择选择器
const selectPicker = (picker) => {
  activePicker.value = picker;
};

// 处理选择结果
const handlePick = (result) => {
  pickedResult.value = result;
};

// 更新名单
const updateNames = () => {
  // 名单已通过计算属性自动更新
  pickedResult.value = '';
};

// 清空名单
const clearNames = () => {
  namesText.value = '';
  pickedResult.value = '';
};

// 移除单个名称
const removeName = (index) => {
  const namesList = names.value;
  namesList.splice(index, 1);
  namesText.value = namesList.join('\n');
  pickedResult.value = '';
};

// 选择器数据
const pickersList = [
  {
    id: 'wheel',
    name: t('pickers.wheel'),
    description: t('app.wheelDescription') || '旋转轮盘随机选择名称',
    icon: '🎡'
  },
  {
    id: 'hat',
    name: t('pickers.hat'),
    description: t('app.hatDescription') || '从魔术帽中抽取随机名称',
    icon: '🎩'
  },
  {
    id: 'dice',
    name: t('pickers.dice'),
    description: t('app.diceDescription') || '掷骰子随机选择数字',
    icon: '🎲'
  },
  {
    id: 'cards',
    name: t('pickers.card'),
    description: t('app.cardDescription') || '随机抽取卡片选择名称',
    icon: '🃏'
  }
];

// 检查选择器是否已收藏
const isPickerFavorite = (pickerId) => {
  return settingsStore.isPickerFavorite(pickerId);
};

// 添加/取消收藏
const toggleFavoritePicker = (event, pickerId) => {
  event.stopPropagation();
  settingsStore.toggleFavoritePicker(pickerId);
};
</script>

<style scoped>
.page-title {
  margin-top: 1rem;
  color: var(--primary-color);
}

.page-description {
  color: var(--dark-gray);
  margin-bottom: 2rem;
}

.pickers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.picker-card {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  cursor: pointer;
  transition: transform var(--transition-medium);
  position: relative;
}

.picker-card:hover {
  transform: translateY(-5px);
}

.picker-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.picker-title {
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.picker-description {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--dark-gray);
}

.picker-card .btn {
  margin-top: auto;
}

.picker-container {
  margin: 2rem 0;
  padding: 2rem;
  background-color: var(--white);
  border-radius: var(--border-radius-medium);
  box-shadow: var(--shadow-medium);
}

.placeholder {
  text-align: center;
  padding: 3rem;
  color: var(--dark-gray);
  font-style: italic;
}

.names-manager {
  margin: 2rem 0;
  padding: 2rem;
  background-color: var(--white);
  border-radius: var(--border-radius-medium);
  box-shadow: var(--shadow-small);
}

.names-input {
  margin: 1rem 0;
}

.names-input textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid var(--gray);
  border-radius: var(--border-radius-small);
  font-family: inherit;
  resize: vertical;
}

.names-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.names-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.name-item {
  background-color: var(--light-gray);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-small);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.name-remove {
  background: none;
  border: none;
  color: var(--dark-gray);
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
}

.name-remove:hover {
  color: #ff4d4f;
}

.result-display {
  margin: 2rem 0;
  padding: 2rem;
  background-color: var(--white);
  border-radius: var(--border-radius-medium);
  box-shadow: var(--shadow-medium);
  text-align: center;
}

.result-content {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-top: 1rem;
  padding: 1rem;
  background-color: var(--light-gray);
  border-radius: var(--border-radius-medium);
}

.picker-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.favorite-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: var(--warning-color, #FFB20C);
  cursor: pointer;
  z-index: 2;
  transition: transform 0.2s ease;
}

.favorite-btn:hover {
  transform: scale(1.2);
}

.favorite-btn .fa-star {
  color: var(--warning-color, #FFB20C);
}

.favorite-btn .fa-star-o {
  color: var(--text-secondary, #666666);
}

@media (max-width: 768px) {
  .names-actions {
    flex-direction: column;
  }
}
</style> 