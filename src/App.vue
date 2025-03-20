<template>
  <div id="app" :class="{ 'dark-mode': isDarkMode }">
    <Header />
    <router-view />
    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-links">
          <router-link to="/contact" class="footer-link">{{ $t('footer.contact') }}</router-link>
          <router-link to="/terms" class="footer-link">{{ $t('footer.terms') }}</router-link>
          <router-link to="/privacy" class="footer-link">{{ $t('footer.privacy') }}</router-link>
        </div>
        <p class="copyright">© {{ currentYear }} 123510 Minute Timer. {{ $t('common.allRightsReserved') }}</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Header from '@/components/layout/Header.vue'

const { t, locale } = useI18n()

// 当前年份
const currentYear = new Date().getFullYear()

// 深色模式
const isDarkMode = computed(() => {
  return false; // 暂时默认使用浅色模式
})

// 监听语言变化
watch(() => locale.value, (newLocale) => {
  localStorage.setItem('appLanguage', newLocale)
  document.documentElement.lang = newLocale
})

onMounted(() => {
  // 从存储加载语言
  const savedLang = localStorage.getItem('appLanguage')
  if (savedLang) {
    locale.value = savedLang
  }
  
  // 设置文档语言
  document.documentElement.lang = locale.value
})
</script>

<style>
/* 浏览器重置和基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  /* 基础颜色 */
  --primary-color: #3498db;
  --primary-dark: #2980b9;
  --primary-light: #5faee3;
  --secondary-color: #e74c3c;
  --secondary-dark: #c0392b;
  --warning-color: #f39c12;
  --warning-dark: #e67e22;
  --success-color: #2ecc71;
  --success-dark: #27ae60;
  --info-color: #3498db;
  --info-dark: #2980b9;
  
  /* 中性色 */
  --black: #333333;
  --dark-gray: #555555;
  --gray: #777777;
  --light-gray: #dddddd;
  --border-color: #eeeeee;
  --white: #ffffff;
  --bg-light: #f5f7fa;
  --bg-dark: #2c3e50;
  --text: #484848;
  
  /* 交互颜色 */
  --hover-color: rgba(0, 0, 0, 0.05);
  --active-color: rgba(0, 0, 0, 0.1);
  
  /* 阴影 */
  --shadow-light: 0 2px 5px rgba(0, 0, 0, 0.1);
  --shadow-medium: 0 5px 15px rgba(0, 0, 0, 0.1);
  --shadow-hard: 0 10px 25px rgba(0, 0, 0, 0.15);
  
  /* 圆角 */
  --border-radius-small: 4px;
  --border-radius-medium: 8px;
  --border-radius-large: 16px;
  
  /* 动画速度 */
  --transition-fast: 0.2s;
  --transition-medium: 0.3s;
  --transition-slow: 0.5s;
  
  /* 字体 */
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-size-small: 0.875rem;
  --font-size-normal: 1rem;
  --font-size-medium: 1.125rem;
  --font-size-large: 1.25rem;
  --font-weight-normal: 400;
  --font-weight-bold: 700;
  --line-height: 1.5;
}

/* 暗色模式变量 */
.dark-mode {
  --primary-color: #3498db;
  --primary-dark: #2980b9;
  --primary-light: #5faee3;
  --secondary-color: #e74c3c;
  --warning-color: #f39c12;
  --success-color: #2ecc71;
  --info-color: #3498db;
  
  --black: #f8f8f8;
  --dark-gray: #dddddd;
  --gray: #aaaaaa;
  --light-gray: #555555;
  --border-color: #444444;
  --white: #333333;
  --bg-light: #222222;
  --bg-dark: #111111;
  --text: #f0f0f0;
  
  --shadow-light: 0 2px 5px rgba(0, 0, 0, 0.2);
  --shadow-medium: 0 5px 15px rgba(0, 0, 0, 0.25);
  --shadow-hard: 0 10px 25px rgba(0, 0, 0, 0.3);
  
  --hover-color: rgba(255, 255, 255, 0.05);
  --active-color: rgba(255, 255, 255, 0.1);
}

html {
  font-size: 16px;
}

body {
  font-family: var(--font-family);
  line-height: var(--line-height);
  color: var(--text);
  background-color: var(--bg-light);
  transition: background-color var(--transition-medium);
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 通用样式 */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.card {
  background-color: var(--white);
  border-radius: var(--border-radius-medium);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05), 0 1px 8px rgba(0, 0, 0, 0.03);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.02);
}

.card:hover {
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.07), 0 3px 10px rgba(0, 0, 0, 0.05);
  transform: translateY(-5px);
}

.section {
  margin-bottom: 3rem;
}

h1, h2, h3, h4, h5, h6 {
  color: var(--black);
  font-weight: var(--font-weight-bold);
  margin-bottom: 1rem;
}

p {
  margin-bottom: 1rem;
}

a {
  color: var(--primary-color);
  text-decoration: none;
  transition: color var(--transition-fast);
}

a:hover {
  color: var(--primary-dark);
}

/* 按钮样式 */
.btn {
  display: inline-block;
  background: linear-gradient(145deg, var(--primary-color), var(--primary-dark));
  color: var(--white);
  border: none;
  border-radius: var(--border-radius-medium);
  padding: 0.75rem 1.5rem;
  font-size: var(--font-size-normal);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08);
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn:hover {
  background: linear-gradient(145deg, var(--primary-light), var(--primary-color));
  transform: translateY(-3px);
  box-shadow: 0 7px 14px rgba(0,0,0,0.12), 0 3px 6px rgba(0,0,0,0.08);
}

.btn:active {
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.08);
}

.btn::after {
  content: "";
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  background-image: radial-gradient(circle, #fff 10%, transparent 10.01%);
  background-repeat: no-repeat;
  background-position: 50%;
  transform: scale(10, 10);
  opacity: 0;
  transition: transform .5s, opacity 1s;
}

.btn:active::after {
  transform: scale(0, 0);
  opacity: 0.3;
  transition: 0s;
}

.btn-secondary {
  background: linear-gradient(145deg, var(--gray), var(--dark-gray));
}

.btn-secondary:hover {
  background: linear-gradient(145deg, var(--light-gray), var(--gray));
}

.btn-success {
  background: linear-gradient(145deg, var(--success-color), var(--success-dark));
}

.btn-success:hover {
  background: linear-gradient(145deg, #3ddb7f, var(--success-color));
}

.btn-warning {
  background: linear-gradient(145deg, var(--warning-color), var(--warning-dark));
}

.btn-warning:hover {
  background: linear-gradient(145deg, #f7b541, var(--warning-color));
}

.btn-danger {
  background: linear-gradient(145deg, var(--secondary-color), var(--secondary-dark));
}

.btn-danger:hover {
  background: linear-gradient(145deg, #ee6256, var(--secondary-color));
}

.btn-large {
  padding: 1rem 2rem;
  font-size: var(--font-size-medium);
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: var(--font-size-small);
  text-transform: none;
  letter-spacing: normal;
}

.btn-rounded {
  border-radius: 50px;
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-icon i, .btn-icon span {
  margin-right: 0.5rem;
}

.btn:disabled {
  background: var(--light-gray);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 表单样式 */
input, select, textarea {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: var(--font-size-normal);
  border: 2px solid var(--light-gray);
  border-radius: var(--border-radius-medium);
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  background-color: var(--white);
  color: var(--text);
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1), inset 0 1px 3px rgba(0,0,0,0.05);
}

input::placeholder {
  color: var(--gray);
  opacity: 0.7;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--dark-gray);
  font-weight: 500;
}

/* 页脚样式 */
.app-footer {
  background-color: var(--white);
  padding: 1.5rem 0;
  margin-top: auto;
  border-top: 1px solid var(--border-color);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.footer-links {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.footer-link {
  color: var(--gray);
  margin: 0 1rem;
  font-size: 0.9rem;
  transition: color var(--transition-fast);
}

.footer-link:hover {
  color: var(--primary-color);
}

.copyright {
  color: var(--gray);
  font-size: 0.9rem;
  text-align: center;
}

@media (max-width: 768px) {
  .footer-links {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
}
</style> 