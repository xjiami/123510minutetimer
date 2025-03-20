<template>
  <div class="timers-view">
    <h1>{{ $t('timers.title') }}</h1>
    <p class="page-description">{{ $t('app.timersDescription') }}</p>
    
    <!-- 特色计时器 -->
    <section class="timer-section featured-timers">
      <h2 class="section-title">{{ $t('timers.favorites') }}</h2>
      <div class="timers-grid featured-grid">
        <div 
          class="timer-card featured-card"
          @click="selectTimer(timers[0])"
        >
          <div class="timer-icon">{{ timers[0].icon }}</div>
          <div class="timer-info">
            <h3>{{ $t(timers[0].nameKey) }}</h3>
            <p>{{ $t(timers[0].descriptionKey) }}</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 标准计时器 -->
    <section class="timer-section">
      <h2 class="section-title">{{ $t('timers.title') }}</h2>
      <div class="timers-grid">
        <div 
          v-for="timer in standardTimers" 
          :key="timer.id"
          class="timer-card"
          @click="selectTimer(timer)"
        >
          <div class="timer-icon">{{ timer.icon }}</div>
          <div class="timer-info">
            <h3>{{ $t(timer.nameKey) }}</h3>
            <p>{{ $t(timer.descriptionKey) }}</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 快速秒级计时器 -->
    <section class="timer-section quick-timers-section">
      <h2 class="section-title">{{ $t('common.seconds') }} {{ $t('timers.title') }}</h2>
      <div class="quick-timers-grid">
        <router-link 
          v-for="duration in secondDurations" 
          :key="`second-${duration.value}`"
          :to="`/timer/second/${duration.value}`"
          class="quick-timer-link"
        >
          {{ duration.value }} {{ $t('common.seconds') }}
        </router-link>
      </div>
    </section>
    
    <!-- 快速分钟计时器 -->
    <section class="timer-section quick-timers-section">
      <h2 class="section-title">{{ $t('common.minutes') }} {{ $t('timers.title') }}</h2>
      <div class="quick-timers-grid">
        <router-link 
          v-for="duration in minuteDurations" 
          :key="`minute-${duration.value}`"
          :to="`/timer/minute/${duration.value}`"
          class="quick-timer-link"
        >
          {{ duration.value }} {{ $t('common.minutes') }}
        </router-link>
      </div>
    </section>
    
    <!-- 快速小时计时器 -->
    <section class="timer-section quick-timers-section">
      <h2 class="section-title">{{ $t('education.hours') }} {{ $t('timers.title') }}</h2>
      <div class="quick-timers-grid">
        <router-link 
          v-for="duration in hourDurations" 
          :key="`hour-${duration.value}`"
          :to="`/timer/hour/${duration.value}`"
          class="quick-timer-link"
        >
          {{ duration.value }} {{ $t('education.hours') }}
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n();

// 定义计时器类型
interface Timer {
  id: string;
  nameKey: string;
  descriptionKey: string;
  icon: string;
  featured?: boolean;
}

// 可用的计时器列表
const timers = ref<Timer[]>([
  {
    id: 'puppy-run',
    nameKey: 'timers.puppy',
    descriptionKey: 'app.timersDescription',
    icon: '🐕',
    featured: true
  },
  {
    id: 'basic',
    nameKey: 'timers.clock',
    descriptionKey: 'app.timersDescription',
    icon: '⏱️'
  },
  {
    id: 'countdown',
    nameKey: 'timers.running',
    descriptionKey: 'app.timersDescription',
    icon: '⏰'
  }
]);

// 计算属性：标准计时器（非特色）
const standardTimers = computed(() => {
  return timers.value.filter(timer => !timer.featured);
});

// 秒级计时器持续时间选项
const secondDurations = [
  { unit: 'second', value: 5 },
  { unit: 'second', value: 10 },
  { unit: 'second', value: 15 },
  { unit: 'second', value: 20 },
  { unit: 'second', value: 30 },
  { unit: 'second', value: 45 },
  { unit: 'second', value: 60 },
  { unit: 'second', value: 90 }
];

// 分钟计时器持续时间选项
const minuteDurations = [
  { unit: 'minute', value: 1 },
  { unit: 'minute', value: 2 },
  { unit: 'minute', value: 3 },
  { unit: 'minute', value: 5 },
  { unit: 'minute', value: 10 },
  { unit: 'minute', value: 15 },
  { unit: 'minute', value: 20 },
  { unit: 'minute', value: 25 },
  { unit: 'minute', value: 30 },
  { unit: 'minute', value: 45 },
  { unit: 'minute', value: 60 }
];

// 小时计时器持续时间选项
const hourDurations = [
  { unit: 'hour', value: 1 },
  { unit: 'hour', value: 2 },
  { unit: 'hour', value: 3 },
  { unit: 'hour', value: 4 },
  { unit: 'hour', value: 5 },
  { unit: 'hour', value: 6 },
  { unit: 'hour', value: 8 },
  { unit: 'hour', value: 12 },
  { unit: 'hour', value: 24 }
];

// 选择计时器
const selectTimer = (timer: Timer) => {
  console.log(`Selected timer: ${timer.id}`);
  // 使用router.push导航到计时器详情页面
  router.push(`/timer/${timer.id}`);
};

onMounted(() => {
  // SEO优化
  document.title = t('timers.title') + ' | ' + t('app.title');
  
  // 更新meta描述
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  
  metaDescription.setAttribute('content', t('app.timersDescription'));
});
</script>

<style scoped>
.timers-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.timers-view h1 {
  text-align: center;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
  font-size: 2.5rem;
}

.page-description {
  text-align: center;
  margin-bottom: 2.5rem;
  color: var(--gray);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.timer-section {
  margin-bottom: 3rem;
}

.section-title {
  position: relative;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  padding-bottom: 0.8rem;
  font-weight: 600;
}

.section-title:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 80px;
  height: 4px;
  background: var(--primary-color);
  border-radius: 2px;
}

.timers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.featured-grid {
  grid-template-columns: 1fr;
  max-width: 500px;
}

.timer-card {
  background-color: var(--surface);
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: var(--shadow-light);
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(0,0,0,0.05);
}

.timer-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-medium);
}

.featured-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf8 100%);
  border: none;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  padding: 2rem;
  transition: all 0.4s ease;
}

.featured-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.featured-card::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-image: url('/images/paw-pattern.svg');
  background-size: 60px;
  opacity: 0.05;
  z-index: 0;
}

.timer-icon {
  font-size: 3rem;
  margin-right: 1.5rem;
  z-index: 1;
}

.featured-card .timer-icon {
  font-size: 4rem;
}

.timer-info {
  z-index: 1;
}

.timer-info h3 {
  margin: 0 0 0.5rem 0;
  color: var(--text);
  font-size: 1.3rem;
}

.featured-card .timer-info h3 {
  font-size: 1.7rem;
  font-weight: 700;
  color: var(--primary-color);
}

.timer-info p {
  margin: 0;
  color: var(--gray);
  font-size: 0.95rem;
  line-height: 1.5;
}

.featured-card .timer-info p {
  font-size: 1.1rem;
}

.quick-timers-section {
  margin-top: 2.5rem;
}

.quick-timers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
}

.quick-timer-link {
  display: block;
  text-align: center;
  padding: 0.8rem 0.5rem;
  background-color: var(--surface);
  border-radius: 12px;
  box-shadow: var(--shadow-light);
  color: var(--primary-color);
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid rgba(0,0,0,0.05);
  font-weight: 500;
}

.quick-timer-link:hover {
  background-color: var(--primary-light);
  color: var(--white);
  transform: translateY(-3px);
  box-shadow: var(--shadow-medium);
}

@media (max-width: 768px) {
  .timers-view {
    padding: 1.5rem 1rem;
  }
  
  .timers-view h1 {
    font-size: 2rem;
  }
  
  .page-description {
    font-size: 0.95rem;
    margin-bottom: 2rem;
  }
  
  .section-title {
    font-size: 1.5rem;
    margin-bottom: 1.2rem;
  }
  
  .section-title:after {
    width: 60px;
    height: 3px;
  }
  
  .timers-grid {
    grid-template-columns: 1fr;
  }
  
  .quick-timers-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 0.8rem;
  }
  
  .timer-card {
    padding: 1.2rem;
  }
  
  .timer-icon {
    font-size: 2.5rem;
    margin-right: 1rem;
  }
  
  .featured-card {
    padding: 1.5rem;
  }
  
  .featured-card .timer-icon {
    font-size: 3rem;
  }
  
  .featured-card .timer-info h3 {
    font-size: 1.4rem;
  }
  
  .featured-card .timer-info p {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .timers-view h1 {
    font-size: 1.8rem;
  }
  
  .page-description {
    font-size: 0.9rem;
  }
  
  .quick-timers-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.6rem;
  }
  
  .quick-timer-link {
    padding: 0.6rem 0.4rem;
    font-size: 0.85rem;
  }
}
</style> 