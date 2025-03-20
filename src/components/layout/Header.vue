<template>
  <header class="app-header">
    <div class="container">
      <div class="logo-container">
        <router-link to="/" class="logo">
          <img src="/images/timer-logo.svg" alt="Timer Logo" class="logo-img" />
          <span class="logo-text">123510 Minute Timer</span>
        </router-link>
      </div>
      
      <div class="header-right">
        <div class="holiday-countdown" v-if="nextHoliday">
          <router-link to="/holidays" class="holiday-link">
            <div class="holiday-info">
              <span class="holiday-icon">🎉</span>
              <span class="holiday-text">{{ $t('holidays.daysUntil', { holiday: $t(`holidays.${nextHoliday.id}`) }) }}: <strong>{{ nextHoliday.daysLeft }}</strong> {{ $t('holidays.days') }}</span>
            </div>
          </router-link>
        </div>
        
        <nav class="main-nav">
          <router-link to="/timers" class="nav-item">{{ $t('app.timers') }}</router-link>
          <router-link to="/pickers" class="nav-item">{{ $t('app.pickers') }}</router-link>
          <router-link to="/holidays" class="nav-item">{{ $t('app.holidays') }}</router-link>
          <router-link to="/settings" class="nav-item">{{ $t('common.settings') }}</router-link>
        </nav>
        
        <div class="tool-buttons">
          <!-- 背景图片上传 -->
          <div class="custom-bg-container">
            <button class="tool-button" @click="toggleBgPanel">
              <span class="icon">🖼️</span>
              <span class="tooltip">{{ $t('app.customBackground') || '自定义背景' }}</span>
            </button>
            
            <div v-if="showBgPanel" class="setting-panel bg-panel">
              <h3>{{ $t('app.customBackground') || '自定义背景图片' }}</h3>
              
              <div class="upload-container">
                <label for="bgImageUpload" class="upload-btn">
                  {{ $t('app.uploadImage') || '上传图片' }}
                </label>
                <input 
                  type="file" 
                  id="bgImageUpload" 
                  accept="image/*" 
                  @change="handleImageUpload"
                  class="file-input"
                />
              </div>
              
              <div class="slider-container">
                <label>{{ $t('app.opacity') || '透明度' }}</label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  v-model="bgOpacity" 
                  class="slider"
                />
                <span>{{ bgOpacity }}%</span>
              </div>
              
              <div class="slider-container">
                <label>{{ $t('app.blur') || '模糊度' }}</label>
                <input 
                  type="range" 
                  min="0" 
                  max="20" 
                  v-model="bgBlur" 
                  class="slider"
                />
                <span>{{ bgBlur }}px</span>
              </div>
            </div>
          </div>
          
          <!-- 语言切换 -->
          <div class="language-container">
            <button class="tool-button" @click="toggleLangPanel">
              <span class="icon">🌐</span>
              <span class="tooltip">{{ $t('app.language') || '切换语言' }}</span>
            </button>
            
            <div v-if="showLangPanel" class="setting-panel lang-panel">
              <h3>{{ $t('app.selectLanguage') || '选择语言' }}</h3>
              <div class="language-options">
                <button 
                  class="lang-btn" 
                  :class="{ active: currentLang === 'en' }"
                  @click="changeLanguage('en')"
                >
                  English
                </button>
                <button 
                  class="lang-btn" 
                  :class="{ active: currentLang === 'zh' }"
                  @click="changeLanguage('zh')"
                >
                  中文
                </button>
              </div>
              <div class="language-options">
                <button 
                  class="lang-btn" 
                  :class="{ active: currentLang === 'fr' }"
                  @click="changeLanguage('fr')"
                >
                  Français
                </button>
                <button 
                  class="lang-btn" 
                  :class="{ active: currentLang === 'es' }"
                  @click="changeLanguage('es')"
                >
                  Español
                </button>
              </div>
              <div class="language-options">
                <button 
                  class="lang-btn" 
                  :class="{ active: currentLang === 'de' }"
                  @click="changeLanguage('de')"
                >
                  Deutsch
                </button>
                <button 
                  class="lang-btn" 
                  :class="{ active: currentLang === 'ja' }"
                  @click="changeLanguage('ja')"
                >
                  日本語
                </button>
              </div>
              <div class="language-options">
                <button 
                  class="lang-btn" 
                  :class="{ active: currentLang === 'ru' }"
                  @click="changeLanguage('ru')"
                >
                  Русский
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

// 背景图片相关
const customBgImage = ref<string | null>(localStorage.getItem('customBgImage'));
const bgOpacity = ref(Number(localStorage.getItem('bgOpacity')) || 80);
const bgBlur = ref(Number(localStorage.getItem('bgBlur')) || 0);
const showBgPanel = ref(false);
const showLangPanel = ref(false);

// 当前语言
const currentLang = computed(() => locale.value);

// 切换背景面板显示
const toggleBgPanel = () => {
  showBgPanel.value = !showBgPanel.value;
  if (showBgPanel.value) {
    showLangPanel.value = false;
  }
};

// 切换语言面板显示
const toggleLangPanel = () => {
  showLangPanel.value = !showLangPanel.value;
  if (showLangPanel.value) {
    showBgPanel.value = false;
  }
};

// 处理图片上传
const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        customBgImage.value = e.target.result;
        localStorage.setItem('customBgImage', e.target.result);
        // 通知 App.vue 更新背景
        document.dispatchEvent(new CustomEvent('background-updated'));
      }
    };
    
    reader.readAsDataURL(file);
  }
};

// 监听背景透明度变化
watch(bgOpacity, (newValue: number) => {
  localStorage.setItem('bgOpacity', newValue.toString());
  // 通知背景更新
  document.dispatchEvent(new CustomEvent('background-updated'));
});

// 监听背景模糊度变化
watch(bgBlur, (newValue: number) => {
  localStorage.setItem('bgBlur', newValue.toString());
  // 通知背景更新
  document.dispatchEvent(new CustomEvent('background-updated'));
});

// 切换语言
const changeLanguage = (lang: string) => {
  locale.value = lang;
  localStorage.setItem('appLanguage', lang);
  showLangPanel.value = false;
};

// 节假日数据
const holidays = ref([
  // 共同节假日
  { id: 'newYear', month: 0, day: 1, year: 2026, countries: ['us', 'uk', 'au', 'ca'] },
  { id: 'valentinesDay', month: 1, day: 14, year: 2026, countries: ['us', 'uk', 'au', 'ca'] },
  { id: 'stPatricksDay', month: 2, day: 17, year: 2025, countries: ['us', 'uk', 'au', 'ca'] },
  { id: 'goodFriday', month: 3, day: 18, year: 2025, countries: ['us', 'uk', 'au', 'ca'] },
  { id: 'easter', month: 3, day: 20, year: 2025, countries: ['us', 'uk', 'au', 'ca'] },
  { id: 'easterMonday', month: 3, day: 21, year: 2025, countries: ['us', 'uk', 'au', 'ca'] },
  { id: 'christmas', month: 11, day: 25, year: 2025, countries: ['us', 'uk', 'au', 'ca'] },
  { id: 'chineseNewYear', month: 1, day: 17, year: 2026, countries: ['us', 'uk', 'au', 'ca'] },
  { id: 'halloween', month: 9, day: 31, year: 2025, countries: ['us', 'uk', 'au', 'ca'] },
  
  // 美国特有节假日
  { id: 'martinLutherKingDay', month: 0, day: 19, year: 2026, countries: ['us'] },
  { id: 'groundhogDay', month: 1, day: 2, year: 2026, countries: ['us'] },
  { id: 'presidentsDay', month: 1, day: 16, year: 2026, countries: ['us'] },
  { id: 'aprilFoolsDay', month: 3, day: 1, year: 2025, countries: ['us'] },
  { id: 'taxDay', month: 3, day: 15, year: 2025, countries: ['us'] },
  { id: 'mothersDay', month: 4, day: 11, year: 2025, countries: ['us'] },
  { id: 'memorialDay', month: 4, day: 26, year: 2025, countries: ['us'] },
  { id: 'fathersDay', month: 5, day: 15, year: 2025, countries: ['us'] },
  { id: 'juneteenth', month: 5, day: 19, year: 2025, countries: ['us'] },
  { id: 'independenceDay', month: 6, day: 4, year: 2025, countries: ['us'] },
  { id: 'laborDay', month: 8, day: 1, year: 2025, countries: ['us'] },
  { id: 'programmersDay', month: 8, day: 13, year: 2025, countries: ['us'] },
  { id: 'columbusDay', month: 9, day: 13, year: 2025, countries: ['us'] },
  { id: 'thanksgiving', month: 10, day: 27, year: 2025, countries: ['us'] }
]);

// 计算距离特定日期的天数
function getDaysUntil(targetMonth: number, targetDay: number, targetYear?: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const year = targetYear || today.getFullYear();
  let targetDate = new Date(year, targetMonth, targetDay);
  
  // 如果目标日期已经过了，计算到明年的天数（除非指定了年份）
  if (targetDate < today && !targetYear) {
    targetDate = new Date(today.getFullYear() + 1, targetMonth, targetDay);
  }
  
  // 计算天数差异
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

// 获取所有节假日的剩余天数
const holidaysWithDays = computed(() => {
  return holidays.value.map(holiday => {
    // 使用指定的年份或当前年份
    const year = holiday.year || new Date().getFullYear();
    const daysLeft = getDaysUntil(holiday.month, holiday.day, year);
    
    return {
      ...holiday,
      daysLeft
    };
  });
});

// 获取最近的节日（仅考虑美国节日，因为是在header上显示）
const nextHoliday = computed(() => {
  const usHolidays = holidaysWithDays.value.filter(h => h.countries.includes('us'));
  const upcomingHolidays = usHolidays.filter(h => h.daysLeft > 0);
  const sortedHolidays = [...upcomingHolidays].sort((a, b) => a.daysLeft - b.daysLeft);
  
  return sortedHolidays[0];
});

onMounted(() => {
  // 设置初始语言
  const savedLang = localStorage.getItem('appLanguage');
  if (savedLang) {
    locale.value = savedLang;
  } else {
    // 如果没有存储语言设置，默认使用英语
    locale.value = 'en';
    localStorage.setItem('appLanguage', 'en');
  }
  
  // 点击其他区域关闭面板
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.custom-bg-container') && !target.closest('.language-container')) {
      showBgPanel.value = false;
      showLangPanel.value = false;
    }
  });
});
</script>

<style scoped>
.app-header {
  background-color: var(--white);
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
}

.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  color: var(--black);
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.logo-img {
  height: 40px;
  margin-right: 2.5rem;
}

.logo-text {
  font-weight: 700;
  background: linear-gradient(45deg, var(--primary-color), var(--success-color));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.main-nav {
  display: flex;
  gap: 1.2rem;
}

.nav-item {
  color: var(--dark-gray);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: var(--border-radius-small);
  transition: all 0.3s ease;
  position: relative;
}

.nav-item::after {
  content: '';
  position: absolute;
  width: 0;
  height: 3px;
  bottom: 0;
  left: 50%;
  background: linear-gradient(90deg, var(--primary-color), var(--success-color));
  transition: all 0.3s ease;
  transform: translateX(-50%);
  opacity: 0;
  border-radius: 3px;
}

.nav-item:hover {
  color: var(--primary-color);
}

.nav-item:hover::after,
.nav-item.router-link-exact-active::after {
  width: 80%;
  opacity: 1;
}

.nav-item.router-link-exact-active {
  color: var(--primary-color);
  font-weight: 600;
}

.tool-buttons {
  display: flex;
  gap: 1rem;
}

.tool-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.08);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.tool-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  background: linear-gradient(145deg, #ffffff, #f5f5f5);
}

.tool-button:active {
  transform: translateY(0);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05);
}

.icon {
  font-size: 1.2rem;
}

.tooltip {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--dark-gray);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: var(--border-radius-small);
  font-size: 0.8rem;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  white-space: nowrap;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  pointer-events: none;
}

.tooltip::before {
  content: '';
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 0 6px 6px 6px;
  border-style: solid;
  border-color: transparent transparent var(--dark-gray) transparent;
}

.tool-button:hover .tooltip {
  opacity: 1;
  visibility: visible;
  bottom: -40px;
}

.setting-panel {
  position: absolute;
  top: 120%;
  right: 0;
  background: white;
  padding: 1.5rem;
  border-radius: var(--border-radius-medium);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  width: 300px;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.setting-panel h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: var(--black);
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.75rem;
}

.language-container, .custom-bg-container {
  position: relative;
}

.lang-panel {
  min-width: 280px;
}

.language-options {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.lang-btn {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-small);
  background: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.lang-btn:hover {
  background-color: var(--bg-light);
}

.lang-btn.active {
  background: linear-gradient(145deg, var(--primary-light), var(--primary-color));
  color: white;
  border-color: var(--primary-color);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.holiday-countdown {
  padding: 0.5rem 1rem;
  background: linear-gradient(45deg, rgba(248, 160, 96, 0.15), rgba(252, 208, 149, 0.15));
  border-radius: 30px;
  margin-right: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(248, 160, 96, 0.2);
}

.holiday-link {
  text-decoration: none;
  color: var(--text);
  display: block;
}

.holiday-countdown:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.holiday-info {
  display: flex;
  align-items: center;
}

.holiday-icon {
  margin-right: 0.5rem;
  font-size: 1.2rem;
}

.holiday-text {
  font-size: 0.9rem;
}

.holiday-text strong {
  color: #ff9933;
  font-weight: 700;
}

.upload-container {
  margin-bottom: 1rem;
}

.upload-btn {
  display: inline-block;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(145deg, var(--primary-light), var(--primary-color));
  border-radius: var(--border-radius-medium);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.upload-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15);
}

.file-input {
  display: none;
}

.slider-container {
  margin-bottom: 1rem;
}

.slider-container label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: var(--dark-gray);
}

.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 5px;
  background: var(--light-gray);
  outline: none;
  margin-bottom: 0.5rem;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--primary-color);
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  background: var(--primary-dark);
}

@media (max-width: 992px) {
  .header-right {
    gap: 1rem;
  }
  
  .holiday-countdown {
    display: none;
  }
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
    gap: 1rem;
    padding: 0 1rem;
  }
  
  .logo-container {
    margin-bottom: 0.5rem;
  }
  
  .logo {
    font-size: 1.2rem;
  }
  
  .logo-img {
    height: 30px;
    margin-right: 1.5rem;
  }
  
  .header-right {
    width: 100%;
    flex-direction: column;
    gap: 1rem;
  }
  
  .main-nav {
    width: 100%;
    justify-content: space-between;
  }
  
  .tool-buttons {
    width: 100%;
    justify-content: center;
  }
}
</style> 