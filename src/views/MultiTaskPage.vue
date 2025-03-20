<template>
  <div class="multitask-page">
    <div class="multitask-header">
      <button class="back-button" @click="goBack">
        <i class="fas fa-arrow-left"></i>
        {{ $t('common.back') }}
      </button>
      <h1 class="multitask-title">{{ $t('multitask.pageTitle') || '多任务计时' }}</h1>
    </div>
    
    <div class="multitask-content">
      <div class="multitask-intro">
        <div class="intro-icon">
          <i class="fas fa-tasks"></i>
        </div>
        <div class="intro-text">
          <h2>{{ $t('multitask.introTitle') || '同时管理多个计时器' }}</h2>
          <p>{{ $t('multitask.introText') || '添加多个计时任务，同时进行多个活动的计时，提高教学效率' }}</p>
        </div>
      </div>
      
      <div class="multitask-manager-wrapper">
        <MultiTaskManager />
      </div>
      
      <div class="multitask-features">
        <div class="feature-item">
          <div class="feature-icon">
            <i class="fas fa-clock"></i>
          </div>
          <div class="feature-text">
            <h3>{{ $t('multitask.featureParallel') || '并行计时' }}</h3>
            <p>{{ $t('multitask.featureParallelText') || '同时运行多个计时器，高效管理多个教学活动' }}</p>
          </div>
        </div>
        
        <div class="feature-item">
          <div class="feature-icon">
            <i class="fas fa-bell"></i>
          </div>
          <div class="feature-text">
            <h3>{{ $t('multitask.featureAlerts') || '独立提醒' }}</h3>
            <p>{{ $t('multitask.featureAlertsText') || '为每个计时器设置独立的提醒，不会互相干扰' }}</p>
          </div>
        </div>
        
        <div class="feature-item">
          <div class="feature-icon">
            <i class="fas fa-save"></i>
          </div>
          <div class="feature-text">
            <h3>{{ $t('multitask.featureSave') || '自动保存' }}</h3>
            <p>{{ $t('multitask.featureSaveText') || '计时状态自动保存，刷新页面或关闭后重新打开仍然保持' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import MultiTaskManager from '../components/multitask/MultiTaskManager.vue';

const router = useRouter();
const { t } = useI18n();

// 返回上一页
const goBack = () => {
  router.go(-1);
};
</script>

<style scoped>
.multitask-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--bg-color, #f5f5f5);
  color: var(--text-primary, #333333);
}

.multitask-header {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color, #eeeeee);
  background-color: var(--card-bg, #ffffff);
  position: relative;
}

.back-button {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  font-size: 1rem;
  color: var(--primary-color, #2196F3);
  cursor: pointer;
  padding: 0.5rem;
  margin-right: 1rem;
}

.back-button i {
  margin-right: 0.5rem;
}

.multitask-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  flex-grow: 1;
  text-align: center;
}

.multitask-content {
  flex-grow: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.multitask-intro {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background-color: var(--primary-color, #2196F3);
  border-radius: var(--border-radius, 8px);
  color: white;
  box-shadow: var(--box-shadow, 0 2px 10px rgba(0, 0, 0, 0.1));
}

.intro-icon {
  font-size: 2.5rem;
  opacity: 0.9;
}

.intro-text h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
}

.intro-text p {
  margin: 0;
  opacity: 0.9;
  font-size: 0.95rem;
}

.multitask-manager-wrapper {
  margin-bottom: 1rem;
}

.multitask-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background-color: var(--card-bg, #ffffff);
  border-radius: var(--border-radius, 8px);
  box-shadow: var(--box-shadow, 0 2px 10px rgba(0, 0, 0, 0.05));
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-5px);
  box-shadow: var(--box-shadow-hover, 0 5px 15px rgba(0, 0, 0, 0.1));
}

.feature-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-light, #E3F2FD);
  color: var(--primary-color, #2196F3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.feature-text h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: var(--text-primary, #333333);
}

.feature-text p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary, #666666);
  line-height: 1.5;
}

@media (max-width: 600px) {
  .multitask-intro {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem 1rem;
  }
  
  .intro-icon {
    margin-bottom: 1rem;
  }
  
  .multitask-features {
    grid-template-columns: 1fr;
  }
}
</style> 