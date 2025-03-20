<template>
  <div class="settings-page">
    <div class="settings-header">
      <button class="back-button" @click="goBack">
        <i class="fas fa-arrow-left"></i>
        {{ $t('common.back') }}
      </button>
      <h1 class="settings-title">{{ $t('settings.title') }}</h1>
    </div>
    
    <div class="settings-content">
      <!-- 声音设置 -->
      <SoundSettings class="settings-section" />
      
      <!-- 语言设置 -->
      <LanguageSelector class="settings-section" />
      
      <!-- 外观设置 -->
      <div class="settings-section appearance-settings">
        <div class="section-title">{{ $t('settings.appearance') }}</div>
        
        <div class="theme-options">
          <div 
            class="theme-option"
            :class="{ 'active': currentTheme === 'light' }"
            @click="setTheme('light')"
          >
            <div class="theme-icon light-icon">
              <i class="fas fa-sun"></i>
            </div>
            <div class="theme-label">{{ $t('settings.lightMode') }}</div>
          </div>
          
          <div 
            class="theme-option"
            :class="{ 'active': currentTheme === 'dark' }"
            @click="setTheme('dark')"
          >
            <div class="theme-icon dark-icon">
              <i class="fas fa-moon"></i>
            </div>
            <div class="theme-label">{{ $t('settings.darkMode') }}</div>
          </div>
        </div>
      </div>

      <!-- 自定义背景图片设置 -->
      <div class="settings-section background-settings">
        <div class="section-title">{{ $t('settings.backgroundImage') || '自定义背景图片' }}</div>
        
        <div class="background-options">
          <div class="background-upload">
            <label for="background-upload" class="upload-label">
              <i class="fas fa-upload"></i>
              <span>{{ $t('settings.uploadImage') || '上传图片' }}</span>
            </label>
            <input 
              type="file" 
              id="background-upload" 
              accept="image/*" 
              @change="handleBackgroundUpload" 
              class="upload-input"
            />
          </div>
          
          <div class="background-preview" v-if="backgroundPreview">
            <img :src="backgroundPreview" alt="Background preview" class="preview-image" />
            <button class="remove-background" @click="removeBackground">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="background-options-controls">
            <div class="background-opacity">
              <label>{{ $t('settings.opacity') || '不透明度' }}</label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                v-model="backgroundOpacity" 
                @input="updateBackgroundSettings"
              />
              <span>{{ backgroundOpacity }}%</span>
            </div>
            
            <div class="background-blur">
              <label>{{ $t('settings.blur') || '模糊度' }}</label>
              <input 
                type="range" 
                min="0" 
                max="20" 
                v-model="backgroundBlur" 
                @input="updateBackgroundSettings"
              />
              <span>{{ backgroundBlur }}px</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="settings-footer">
      <div class="version-info">v1.0.0</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import SoundSettings from '../components/settings/SoundSettings.vue';
import LanguageSelector from '../components/settings/LanguageSelector.vue';

const router = useRouter();
const { t } = useI18n();

const currentTheme = ref('light');
const backgroundPreview = ref('');
const backgroundOpacity = ref(80);
const backgroundBlur = ref(0);

// 返回上一页
const goBack = () => {
  router.go(-1);
};

// 设置主题
const setTheme = (theme) => {
  currentTheme.value = theme;
  localStorage.setItem('theme', theme);
  
  // 应用主题样式
  applyTheme(theme);
  
  // 触发主题更改事件
  window.dispatchEvent(new CustomEvent('theme-changed', { 
    detail: { theme: theme } 
  }));
};

// 应用主题
const applyTheme = (theme) => {
  const root = document.documentElement;
  
  if (theme === 'dark') {
    root.style.setProperty('--bg-color', '#121212');
    root.style.setProperty('--card-bg', '#1E1E1E');
    root.style.setProperty('--text-primary', '#FFFFFF');
    root.style.setProperty('--text-secondary', '#AAAAAA');
    root.style.setProperty('--border-color', '#333333');
    root.style.setProperty('--inactive-bg', '#555555');
    document.body.classList.add('dark-mode');
  } else {
    root.style.setProperty('--bg-color', '#F5F5F5');
    root.style.setProperty('--card-bg', '#FFFFFF');
    root.style.setProperty('--text-primary', '#333333');
    root.style.setProperty('--text-secondary', '#666666');
    root.style.setProperty('--border-color', '#EEEEEE');
    root.style.setProperty('--inactive-bg', '#CCCCCC');
    document.body.classList.remove('dark-mode');
  }
};

// 处理背景图片上传
const handleBackgroundUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      backgroundPreview.value = e.target.result;
      localStorage.setItem('backgroundImage', e.target.result);
      updateBackgroundSettings();
    };
    reader.readAsDataURL(file);
  }
};

// 移除背景图片
const removeBackground = () => {
  backgroundPreview.value = '';
  localStorage.removeItem('backgroundImage');
  document.body.style.backgroundImage = 'none';
};

// 更新背景设置
const updateBackgroundSettings = () => {
  localStorage.setItem('backgroundOpacity', backgroundOpacity.value);
  localStorage.setItem('backgroundBlur', backgroundBlur.value);
  
  applyBackgroundSettings();
};

// 应用背景设置
const applyBackgroundSettings = () => {
  const body = document.body;
  
  if (backgroundPreview.value) {
    body.style.backgroundImage = `url(${backgroundPreview.value})`;
    body.style.backgroundSize = 'cover';
    body.style.backgroundPosition = 'center';
    body.style.backgroundAttachment = 'fixed';
    body.style.backgroundRepeat = 'no-repeat';
    body.style.backgroundBlendMode = 'normal';
    
    // 创建半透明覆盖层
    const opacity = backgroundOpacity.value / 100;
    const blur = backgroundBlur.value;
    
    // 应用模糊和不透明度
    body.style.setProperty('--bg-overlay-opacity', 1 - opacity);
    body.style.setProperty('--bg-blur', `${blur}px`);
  } else {
    body.style.backgroundImage = 'none';
  }
};

// 从localStorage获取保存的主题设置
onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  currentTheme.value = savedTheme;
  applyTheme(savedTheme);
  
  // 加载保存的背景图片设置
  const savedBackground = localStorage.getItem('backgroundImage');
  if (savedBackground) {
    backgroundPreview.value = savedBackground;
  }
  
  const savedOpacity = localStorage.getItem('backgroundOpacity');
  if (savedOpacity) {
    backgroundOpacity.value = parseInt(savedOpacity);
  }
  
  const savedBlur = localStorage.getItem('backgroundBlur');
  if (savedBlur) {
    backgroundBlur.value = parseInt(savedBlur);
  }
  
  applyBackgroundSettings();
});
</script>

<style scoped>
.settings-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--bg-color, #f5f5f5);
  color: var(--text-primary, #333333);
}

.settings-header {
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

.settings-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  flex-grow: 1;
  text-align: center;
}

.settings-content {
  flex-grow: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.settings-section {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: var(--text-primary, #333333);
}

.appearance-settings {
  padding: 1rem;
  background-color: var(--card-bg, #ffffff);
  border-radius: var(--border-radius, 8px);
  box-shadow: var(--box-shadow, 0 2px 10px rgba(0, 0, 0, 0.1));
}

.theme-options {
  display: flex;
  gap: 1rem;
}

.theme-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  border-radius: var(--border-radius, 8px);
  background-color: var(--bg-light, #f5f5f5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.theme-option:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.theme-option.active {
  background-color: var(--primary-color, #2196F3);
  color: white;
}

.theme-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.light-icon {
  color: #FF9800;
}

.dark-icon {
  color: #3F51B5;
}

.theme-option.active .light-icon,
.theme-option.active .dark-icon {
  color: white;
}

.theme-label {
  font-size: 1rem;
  font-weight: 500;
}

.background-settings {
  padding: 1rem;
  background-color: var(--card-bg, #ffffff);
  border-radius: var(--border-radius, 8px);
  box-shadow: var(--box-shadow, 0 2px 10px rgba(0, 0, 0, 0.1));
}

.background-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.background-upload {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background-color: var(--bg-light, #f5f5f5);
  border: 2px dashed var(--border-color, #cccccc);
  border-radius: var(--border-radius, 8px);
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-label:hover {
  background-color: var(--bg-hover, #e9e9e9);
  border-color: var(--primary-color, #2196F3);
}

.upload-label i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: var(--primary-color, #2196F3);
}

.upload-input {
  display: none;
}

.background-preview {
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: var(--border-radius, 8px);
  overflow: hidden;
  margin-bottom: 1rem;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-background {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.remove-background:hover {
  background-color: rgba(0, 0, 0, 0.7);
}

.background-options-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.background-opacity,
.background-blur {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.background-opacity label,
.background-blur label {
  min-width: 80px;
}

.background-opacity input,
.background-blur input {
  flex-grow: 1;
  margin: 0;
}

.background-opacity span,
.background-blur span {
  min-width: 50px;
  text-align: right;
}

.settings-footer {
  padding: 1rem;
  text-align: center;
  border-top: 1px solid var(--border-color, #eeeeee);
  background-color: var(--card-bg, #ffffff);
}

.version-info {
  color: var(--text-secondary, #666666);
  font-size: 0.8rem;
}

@media (max-width: 600px) {
  .settings-content {
    padding: 1rem;
  }
  
  .theme-options {
    flex-direction: column;
  }
}
</style> 