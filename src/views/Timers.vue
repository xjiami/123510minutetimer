<template>
  <div class="timers-page">
    <div class="container">
      <h1 class="page-title text-center">趣味计时器</h1>
      <p class="page-description text-center">选择一个有趣的计时器开始使用</p>
      
      <div class="timer-categories">
        <div class="category-tabs">
          <button 
            v-for="category in categories" 
            :key="category.id"
            :class="['category-tab', { active: activeCategory === category.id }]"
            @click="activeCategory = category.id"
          >
            {{ category.name }}
          </button>
        </div>
        
        <div class="timer-grid">
          <div 
            v-for="timer in filteredTimers" 
            :key="timer.id" 
            class="timer-card card"
          >
            <div class="favorite-btn" @click.stop="toggleFavorite(timer.id)">
              <i :class="['fas', isTimerFavorite(timer.id) ? 'fa-star' : 'fa-star-o']"></i>
            </div>
            <div class="timer-content" @click="navigateToTimer(timer.id)">
              <div class="timer-icon">{{ timer.icon }}</div>
              <h3 class="timer-title">{{ timer.name }}</h3>
              <p class="timer-description">{{ timer.description }}</p>
              <button class="btn">{{ $t('timers.useThisTimer') || '使用此计时器' }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useSettingsStore } from '../store/settingsStore';

const router = useRouter();
const settingsStore = useSettingsStore();

// 计时器分类
const categories = [
  { id: 'all', name: '全部' },
  { id: 'favorites', name: '收藏夹' },
  { id: 'animals', name: '动物主题' }
];

// 计时器数据
const timers = [
  {
    id: 'puppy-run',
    name: '小狗跑步',
    description: '可爱的小狗跑步计时器',
    icon: '🐕',
    category: 'animals'
  }
];

// 当前选中的分类
const activeCategory = ref('all');

// 根据分类筛选计时器
const filteredTimers = computed(() => {
  if (activeCategory.value === 'all') {
    return timers;
  }
  if (activeCategory.value === 'favorites') {
    return timers.filter(timer => settingsStore.isTimerFavorite(timer.id));
  }
  return timers.filter(timer => timer.category === activeCategory.value);
});

// 导航到计时器详情页
const navigateToTimer = (timerId) => {
  // 添加到最近使用
  settingsStore.addToLastUsedTimers(timerId);
  router.push(`/timer/${timerId}`);
};

// 添加/移除收藏
const toggleFavorite = (timerId) => {
  settingsStore.toggleFavoriteTimer(timerId);
};

// 检查计时器是否已收藏
const isTimerFavorite = (timerId) => {
  return settingsStore.isTimerFavorite(timerId);
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

.category-tabs {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}

.category-tab {
  padding: 0.5rem 1.5rem;
  background-color: var(--white);
  border: 2px solid var(--gray);
  border-radius: var(--border-radius-medium);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.category-tab:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.category-tab.active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: var(--white);
}

.timer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.timer-card {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  position: relative;
  cursor: pointer;
  transition: transform var(--transition-medium);
}

.timer-card:hover {
  transform: translateY(-5px);
}

.timer-content {
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
</style> 