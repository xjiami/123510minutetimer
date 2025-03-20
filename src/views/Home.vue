<template>
  <div class="home-container">
    <div class="hero-section">
      <div class="hero-content">
        <div class="logo-container">
          <img src="/images/timer-logo.svg" alt="123510 Minute Timer Logo" class="animated-logo" />
        </div>
        <h1 class="main-title">123510 Minute Timer</h1>
        <p class="subtitle">{{ $t('app.timersDescription') }}</p>
        <div class="cta-buttons">
          <router-link to="/timers" class="cta-button primary">
            <span class="icon">⏱️</span>
            <span>{{ $t('app.timers') }}</span>
          </router-link>
          <router-link to="/pickers" class="cta-button secondary">
            <span class="icon">🎲</span>
            <span>{{ $t('app.pickers') }}</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- 直接集成小狗计时器 -->
    <div class="puppy-timer-section">
      <h2 class="section-title">{{ $t('timers.puppy') }}</h2>
      <div class="puppy-timer-container">
        <puppy-run-timer />
      </div>
    </div>

    <!-- 固定数值计时器区块 -->
    <div class="quick-timers-section">
      <div class="quick-timers-container">
        <!-- 秒级计时器 -->
        <div class="timer-column">
          <h3 class="timer-column-title">{{ $t('common.seconds') }} {{ $t('timers.title') }}</h3>
          <div class="timer-links">
            <router-link to="/timer/second/23" class="timer-link">23 Second Timer - Online Countdown</router-link>
            <router-link to="/timer/second/24" class="timer-link">24 Second Timer - Online Countdown</router-link>
            <router-link to="/timer/second/25" class="timer-link">25 Second Timer - Online Countdown</router-link>
            <router-link to="/timer/second/26" class="timer-link">26 Second Timer - Online Countdown</router-link>
            <router-link to="/timer/second/27" class="timer-link">27 Second Timer - Online Countdown</router-link>
            <router-link to="/timer/second/28" class="timer-link">28 Second Timer - Online Countdown</router-link>
            <router-link to="/timer/second/29" class="timer-link">29 Second Timer - Online Countdown</router-link>
            <router-link to="/timer/second/30" class="timer-link">30 Second Timer - Online Countdown</router-link>
            <router-link to="/timer/second/31" class="timer-link">31 Second Timer - Online Countdown</router-link>
            <router-link to="/timer/second/32" class="timer-link">32 Second Timer - Online Countdown</router-link>
            <router-link to="/timer/second/33" class="timer-link">33 Second Timer - Online Countdown</router-link>
            <router-link to="/timer/second/34" class="timer-link">34 Second Timer - Online Countdown</router-link>
            <router-link to="/timer/second/35" class="timer-link">35 Second Timer - Online Countdown</router-link>
            <router-link to="/timer/second/36" class="timer-link">36 Second Timer - Online Countdown</router-link>
            <router-link to="/timer/second/37" class="timer-link">37 Second Timer - Online Countdown</router-link>
          </div>
        </div>

        <!-- 单位秒计时器 -->
        <div class="timer-column">
          <h3 class="timer-column-title">{{ $t('common.seconds') }} {{ $t('timers.title') }}</h3>
          <div class="timer-links">
            <router-link to="/timer/second/1" class="timer-link">1 Second Timer - Quick Countdown</router-link>
            <router-link to="/timer/second/2" class="timer-link">2 Second Timer - Quick Countdown</router-link>
            <router-link to="/timer/second/3" class="timer-link">3 Second Timer - Quick Countdown</router-link>
            <router-link to="/timer/second/5" class="timer-link">5 Second Timer - Quick Countdown</router-link>
            <router-link to="/timer/second/10" class="timer-link">10 Second Timer - Quick Countdown</router-link>
            <router-link to="/timer/second/15" class="timer-link">15 Second Timer - Quick Countdown</router-link>
            <router-link to="/timer/second/20" class="timer-link">20 Second Timer - Quick Countdown</router-link>
            <router-link to="/timer/second/25" class="timer-link">25 Second Timer - Quick Countdown</router-link>
            <router-link to="/timer/second/30" class="timer-link">30 Second Timer - Quick Countdown</router-link>
            <router-link to="/timer/second/35" class="timer-link">35 Second Timer - Quick Countdown</router-link>
            <router-link to="/timer/second/40" class="timer-link">40 Second Timer - Quick Countdown</router-link>
            <router-link to="/timer/second/45" class="timer-link">45 Second Timer - Quick Countdown</router-link>
            <router-link to="/timer/second/50" class="timer-link">50 Second Timer - Quick Countdown</router-link>
            <router-link to="/timer/second/60" class="timer-link">60 Second Timer - Quick Countdown</router-link>
            <router-link to="/timer/second/90" class="timer-link">90 Second Timer - Quick Countdown</router-link>
          </div>
        </div>

        <!-- 分钟计时器 -->
        <div class="timer-column">
          <h3 class="timer-column-title">{{ $t('common.minutes') }} {{ $t('timers.title') }}</h3>
          <div class="timer-links">
            <router-link to="/timer/minute/1" class="timer-link">1 Minute Timer - Free Online Timer</router-link>
            <router-link to="/timer/minute/2" class="timer-link">2 Minute Timer - Free Online Timer</router-link>
            <router-link to="/timer/minute/3" class="timer-link">3 Minute Timer - Free Online Timer</router-link>
            <router-link to="/timer/minute/5" class="timer-link">5 Minute Timer - Free Online Timer</router-link>
            <router-link to="/timer/minute/10" class="timer-link">10 Minute Timer - Free Online Timer</router-link>
            <router-link to="/timer/minute/15" class="timer-link">15 Minute Timer - Free Online Timer</router-link>
            <router-link to="/timer/minute/20" class="timer-link">20 Minute Timer - Free Online Timer</router-link>
            <router-link to="/timer/minute/25" class="timer-link">25 Minute Timer - Free Online Timer</router-link>
            <router-link to="/timer/minute/30" class="timer-link">30 Minute Timer - Free Online Timer</router-link>
            <router-link to="/timer/minute/35" class="timer-link">35 Minute Timer - Free Online Timer</router-link>
            <router-link to="/timer/minute/40" class="timer-link">40 Minute Timer - Free Online Timer</router-link>
            <router-link to="/timer/minute/45" class="timer-link">45 Minute Timer - Free Online Timer</router-link>
            <router-link to="/timer/minute/50" class="timer-link">50 Minute Timer - Free Online Timer</router-link>
            <router-link to="/timer/minute/60" class="timer-link">60 Minute Timer - Free Online Timer</router-link>
            <router-link to="/timer/minute/90" class="timer-link">90 Minute Timer - Free Online Timer</router-link>
          </div>
        </div>

        <!-- 小时计时器 -->
        <div class="timer-column">
          <h3 class="timer-column-title">{{ $t('education.hours') }} {{ $t('timers.title') }}</h3>
          <div class="timer-links">
            <router-link to="/timer/hour/1" class="timer-link">1 Hour Timer - Countdown Clock</router-link>
            <router-link to="/timer/hour/2" class="timer-link">2 Hour Timer - Countdown Clock</router-link>
            <router-link to="/timer/hour/3" class="timer-link">3 Hour Timer - Countdown Clock</router-link>
            <router-link to="/timer/hour/4" class="timer-link">4 Hour Timer - Countdown Clock</router-link>
            <router-link to="/timer/hour/5" class="timer-link">5 Hour Timer - Countdown Clock</router-link>
            <router-link to="/timer/hour/6" class="timer-link">6 Hour Timer - Countdown Clock</router-link>
            <router-link to="/timer/hour/7" class="timer-link">7 Hour Timer - Countdown Clock</router-link>
            <router-link to="/timer/hour/8" class="timer-link">8 Hour Timer - Countdown Clock</router-link>
            <router-link to="/timer/hour/9" class="timer-link">9 Hour Timer - Countdown Clock</router-link>
            <router-link to="/timer/hour/10" class="timer-link">10 Hour Timer - Countdown Clock</router-link>
            <router-link to="/timer/hour/12" class="timer-link">12 Hour Timer - Countdown Clock</router-link>
            <router-link to="/timer/hour/18" class="timer-link">18 Hour Timer - Countdown Clock</router-link>
            <router-link to="/timer/hour/24" class="timer-link">24 Hour Timer - Countdown Clock</router-link>
            <router-link to="/timer/hour/48" class="timer-link">48 Hour Timer - Countdown Clock</router-link>
            <router-link to="/timer/hour/72" class="timer-link">72 Hour Timer - Countdown Clock</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import PuppyRunTimer from '@/components/timers/PuppyRunTimer.vue'

const { t } = useI18n()

// SEO优化 - 设置页面标题和描述
onMounted(() => {
  document.title = t('app.title') + ' - ' + t('app.timersDescription');
  
  // 更新meta描述
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  
  metaDescription.setAttribute('content', t('app.timersDescription'));
})
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  gap: 4rem;
  padding-bottom: 2rem;
}

.hero-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 1rem;
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%);
  border-radius: 0 0 30px 30px;
  color: white;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  margin-top: -2rem;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/images/pattern-dots.svg');
  background-size: 30px;
  opacity: 0.1;
  animation: slide 20s linear infinite;
}

@keyframes slide {
  from { background-position: 0 0; }
  to { background-position: 100px 100px; }
}

.hero-content {
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
  z-index: 1;
}

.logo-container {
  width: 140px;
  height: 140px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;
}

.logo-container::after {
  content: '';
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.5), transparent);
  transform: rotate(45deg);
  animation: shine 4s infinite linear;
}

@keyframes shine {
  0% { transform: translateX(-200%) rotate(45deg); }
  100% { transform: translateX(200%) rotate(45deg); }
}

.animated-logo {
  width: 90px;
  height: 90px;
  animation: pulse 2s infinite ease-in-out;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.main-title {
  font-size: 3.5rem;
  margin: 0;
  text-shadow: 3px 3px 0 rgba(0, 0, 0, 0.15);
  background-image: linear-gradient(to right, #FFFFFF, #F0F8FF);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  position: relative;
}

.main-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 6px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.subtitle {
  font-size: 1.4rem;
  margin: 1rem 0 0;
  max-width: 600px;
  opacity: 0.9;
  font-weight: 400;
}

.cta-buttons {
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.cta-button {
  display: flex;
  align-items: center;
  padding: 0.85rem 1.75rem;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  gap: 0.7rem;
}

.cta-button.primary {
  background-color: white;
  color: var(--primary-color);
  box-shadow: 0 6px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  top: 0;
}

.cta-button.primary:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 0 rgba(0, 0, 0, 0.1);
}

.cta-button.primary:active {
  top: 6px;
  box-shadow: 0 0 0 rgba(0, 0, 0, 0.1);
}

.cta-button.secondary {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  position: relative;
  top: 0;
}

.cta-button.secondary:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-4px);
}

.cta-button.secondary:active {
  top: 4px;
}

.icon {
  font-size: 1.4rem;
}

/* 小狗计时器部分 */
.puppy-timer-section {
  padding: 2rem 1rem 3rem;
  margin: 0 1rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf8 100%);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

.puppy-timer-section::before {
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

.puppy-timer-section .section-title {
  text-align: center;
  font-size: 2.4rem;
  margin-bottom: 2.5rem;
  color: var(--primary-color);
  position: relative;
  display: inline-block;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  z-index: 1;
  font-weight: 700;
}

.puppy-timer-section .section-title:after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 6px;
  background: var(--primary-color);
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.puppy-timer-container {
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
  background-color: var(--surface);
  padding: 1.5rem;
  z-index: 1;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

/* 固定数值计时器样式 */
.quick-timers-section {
  padding: 2rem 1rem;
  background-color: var(--surface);
  border-radius: 20px;
  margin: 0 1rem;
  box-shadow: var(--shadow-md);
}

.quick-timers-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.timer-column {
  display: flex;
  flex-direction: column;
}

.timer-column-title {
  color: var(--primary-color);
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  text-align: center;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--primary-color);
}

.timer-links {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.timer-link {
  color: var(--primary-color);
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.timer-link:hover {
  color: var(--primary-light);
  transform: translateX(5px);
}

@media (max-width: 1024px) {
  .quick-timers-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .main-title {
    font-size: 2.5rem;
  }
  
  .subtitle {
    font-size: 1.1rem;
  }
  
  .cta-button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
  
  .quick-timers-container {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  
  .timer-column-title {
    margin-bottom: 1rem;
  }
}
</style> 