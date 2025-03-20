<template>
  <div class="education-page">
    <div class="education-header">
      <button class="back-button" @click="goBack">
        <i class="fas fa-arrow-left"></i>
        {{ $t('common.back') }}
      </button>
      <h1 class="education-title">{{ $t('education.title') || '教育设置' }}</h1>
    </div>
    
    <div class="education-content">
      <div class="education-intro">
        <div class="intro-icon">
          <i class="fas fa-graduation-cap"></i>
        </div>
        <div class="intro-text">
          <h2>{{ $t('education.introTitle') || '教学助手' }}</h2>
          <p>{{ $t('education.introText') || '管理学习目标和活动提醒，帮助您更好地组织教学活动' }}</p>
        </div>
      </div>
      
      <div class="education-sections">
        <!-- 学习目标设置 -->
        <LearningGoalSettings />
        
        <!-- 活动提醒设置 -->
        <ActivityReminder />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import LearningGoalSettings from '../components/settings/education/LearningGoalSettings.vue';
import ActivityReminder from '../components/settings/education/ActivityReminder.vue';

const router = useRouter();
const { t } = useI18n();

// 返回上一页
const goBack = () => {
  router.go(-1);
};
</script>

<style scoped>
.education-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--bg-color, #f5f5f5);
  color: var(--text-primary, #333333);
}

.education-header {
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

.education-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  flex-grow: 1;
  text-align: center;
}

.education-content {
  flex-grow: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.education-intro {
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

.education-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (max-width: 600px) {
  .education-intro {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem 1rem;
  }
  
  .intro-icon {
    margin-bottom: 1rem;
  }
}
</style> 