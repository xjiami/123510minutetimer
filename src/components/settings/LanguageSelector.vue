<template>
  <div class="language-selector cartoon-card">
    <h3 class="section-title">{{ t('settings.language') }}</h3>
    
    <div class="language-options">
      <div 
        v-for="lang in languages" 
        :key="lang.code" 
        class="language-option"
        :class="{ active: locale === lang.code }"
        @click="changeLanguage(lang.code)"
      >
        <div class="language-flag">{{ lang.flag }}</div>
        <div class="language-info">
          <span class="language-name">{{ lang.name }}</span>
          <span v-if="locale === lang.code" class="active-indicator">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale, t } = useI18n();

// 语言选项
const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' }
];

// 切换语言
const changeLanguage = (langCode) => {
  locale.value = langCode;
  localStorage.setItem('appLanguage', langCode);
};
</script>

<style scoped>
.language-selector {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--primary-color);
  text-align: center;
}

.language-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.language-option {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  background-color: var(--background);
}

.language-option:hover {
  transform: translateX(5px);
  border-color: var(--primary-light);
}

.language-option.active {
  background-color: var(--primary-light);
  border-color: var(--primary-color);
  color: white;
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.3);
}

.language-flag {
  font-size: 1.5rem;
  margin-right: 1rem;
}

.language-info {
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.language-name {
  font-weight: 500;
}

.active-indicator {
  color: white;
}
</style> 