<template>
  <div class="holidays-page">
    <div class="container">
      <h1 class="page-title">{{ $t('holidays.title') }}</h1>
      
      <!-- 下一个节日倒计时 -->
      <section class="next-holiday-section" v-if="nextHoliday">
        <div class="next-holiday-card">
          <div class="holiday-icon">🎉</div>
          <div class="holiday-info">
            <h2>{{ $t(`holidays.${nextHoliday.id}`) }}</h2>
            <div class="countdown">
              <div class="countdown-number">{{ nextHoliday.daysLeft }}</div>
              <div class="countdown-label">{{ $t('holidays.daysLeft') }}</div>
            </div>
            <div class="holiday-date">{{ formatDate(nextHoliday.date) }}</div>
          </div>
        </div>
      </section>
      
      <!-- 国家/地区选择器 -->
      <div class="country-selector">
        <button 
          v-for="country in countries" 
          :key="country.code"
          :class="['country-btn', { active: selectedCountry === country.code }]"
          @click="selectedCountry = country.code"
        >
          {{ $t(`holidays.countries.${country.code}`) }}
        </button>
      </div>
      
      <!-- 所有节日倒计时列表 -->
      <section class="all-holidays-section">
        <h2 class="section-title">{{ $t('holidays.upcoming') }}</h2>
        
        <div class="holidays-grid">
          <div 
            v-for="holiday in filteredHolidays" 
            :key="holiday.id"
            class="holiday-card"
          >
            <div class="holiday-card-content">
              <div class="holiday-name">{{ $t(`holidays.${holiday.id}`) }}</div>
              <div class="holiday-countdown">
                <span class="days-number">{{ holiday.daysLeft }}</span>
                <span class="days-label">{{ $t('holidays.days') }}</span>
              </div>
              <div class="holiday-date">{{ formatDate(holiday.date) }}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

interface Holiday {
  id: string;
  month: number;
  day: number;
  date?: Date;
  daysLeft?: number;
  year?: number;
  countries: string[];
  calculateDate?: (year: number) => { month: number; day: number, year?: number };
}

// 国家/地区列表
const countries = [
  { code: 'us', name: 'United States' },
  { code: 'uk', name: 'United Kingdom' },
  { code: 'au', name: 'Australia' },
  { code: 'ca', name: 'Canada' }
];

const selectedCountry = ref('us');

// 节假日数据 - 基于vclock.com/holidays的内容
const holidays = ref<Holiday[]>([
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
  { id: 'dayOfTheDead', month: 10, day: 2, year: 2025, countries: ['us'] },
  { id: 'veteransDay', month: 10, day: 11, year: 2025, countries: ['us'] },
  { id: 'thanksgiving', month: 10, day: 27, year: 2025, countries: ['us'] },
  { id: 'blackFriday', month: 10, day: 28, year: 2025, countries: ['us'] },
  { id: 'cyberMonday', month: 11, day: 1, year: 2025, countries: ['us'] },
  
  // 英国特有节假日
  { id: 'epiphany', month: 0, day: 6, year: 2026, countries: ['uk'] },
  { id: 'ashWednesday', month: 1, day: 18, year: 2026, countries: ['uk'] },
  { id: 'stDavidsDay', month: 2, day: 1, year: 2026, countries: ['uk'] },
  { id: 'motheringSunday', month: 2, day: 30, year: 2025, countries: ['uk'] },
  { id: 'palmSunday', month: 3, day: 13, year: 2025, countries: ['uk'] },
  { id: 'maundyThursday', month: 3, day: 17, year: 2025, countries: ['uk'] },
  { id: 'stGeorgesDay', month: 3, day: 23, year: 2025, countries: ['uk'] },
  { id: 'pentecost', month: 5, day: 8, year: 2025, countries: ['uk'] },
  { id: 'guyFawkesNight', month: 10, day: 5, year: 2025, countries: ['uk'] },
  { id: 'remembranceSunday', month: 10, day: 9, year: 2025, countries: ['uk'] },
  { id: 'boxingDay', month: 11, day: 26, year: 2025, countries: ['uk'] },
  
  // 澳大利亚特有节假日
  { id: 'australiaDay', month: 0, day: 26, year: 2026, countries: ['au'] },
  { id: 'harmonyDay', month: 2, day: 21, year: 2025, countries: ['au'] },
  { id: 'anzacDay', month: 3, day: 25, year: 2025, countries: ['au'] },
  { id: 'fathersDayAu', month: 8, day: 7, year: 2025, countries: ['au'] },
  { id: 'boxingDayAu', month: 11, day: 26, year: 2025, countries: ['au'] },
  
  // 加拿大特有节假日
  { id: 'victoriaDay', month: 4, day: 19, year: 2025, countries: ['ca'] },
  { id: 'canadaDay', month: 6, day: 1, year: 2025, countries: ['ca'] },
  { id: 'thanksgivingCa', month: 9, day: 13, year: 2025, countries: ['ca'] },
  { id: 'boxingDayCa', month: 11, day: 26, year: 2025, countries: ['ca'] }
]);

// 计算复活节日期（基于复活节算法）
function calculateEaster(year: number) {
  // 复活节算法
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  
  return { month, day, year };
}

// 计算第n个特定星期几的日期
function nthDayOfWeek(year: number, month: number, dayOfWeek: number, n: number) {
  // 获取当月第一天
  const firstDay = new Date(year, month, 1);
  // 计算第一个特定星期几的日期
  let dayOfMonth = 1 + (dayOfWeek - firstDay.getDay() + 7) % 7;
  // 计算第n个特定星期几
  dayOfMonth += (n - 1) * 7;
  return { month, day: dayOfMonth, year };
}

// 计算距离特定日期的天数
function getDaysUntil(targetDate: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let futureDate = new Date(targetDate);
  
  // 如果目标日期已经过了，计算到未来年份的天数（如果年份已指定）
  if (futureDate < today) {
    const currentYear = today.getFullYear();
    futureDate.setFullYear(currentYear + 1);
  }
  
  // 计算天数差异
  const diffTime = futureDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

// 格式化日期显示
function formatDate(date: Date | undefined) {
  if (!date) return '';
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  return date.toLocaleDateString(locale.value, options);
}

// 获取所有节假日的日期和剩余天数
const holidaysWithDates = computed(() => {
  return holidays.value.map(holiday => {
    // 使用指定的年份或当前年份
    const year = holiday.year || new Date().getFullYear();
    
    // 创建日期对象
    const date = new Date(year, holiday.month, holiday.day);
    const daysLeft = getDaysUntil(date);
    
    return {
      ...holiday,
      date,
      daysLeft
    };
  });
});

// 按剩余天数排序的节假日
const sortedHolidays = computed(() => {
  return [...holidaysWithDates.value].sort((a, b) => {
    if (a.daysLeft && b.daysLeft) {
      return a.daysLeft - b.daysLeft;
    }
    return 0;
  });
});

// 按照所选国家筛选节假日
const filteredHolidays = computed(() => {
  return sortedHolidays.value.filter(holiday => 
    holiday.countries.includes(selectedCountry.value)
  );
});

// 获取最近的节日
const nextHoliday = computed(() => {
  if (filteredHolidays.value.length > 0) {
    return filteredHolidays.value[0];
  }
  return null;
});

onMounted(() => {
  // SEO优化
  document.title = `${t('holidays.title')} - ${t('app.title')}`;
  
  // 更新meta描述
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  
  metaDescription.setAttribute('content', t('holidays.title'));
});
</script>

<style scoped>
.holidays-page {
  padding: 2rem 1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  color: var(--primary-color);
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
}

/* 国家选择器 */
.country-selector {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.country-btn {
  background-color: var(--white);
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-medium);
  padding: 0.5rem 1.2rem;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.country-btn:hover {
  border-color: var(--primary-light);
  transform: translateY(-2px);
}

.country-btn.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

/* 下一个节日部分 */
.next-holiday-section {
  margin-bottom: 3rem;
}

.next-holiday-card {
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%);
  color: white;
  border-radius: var(--border-radius-large);
  padding: 2rem;
  display: flex;
  align-items: center;
  box-shadow: var(--shadow-medium);
  position: relative;
  overflow: hidden;
}

.next-holiday-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/images/confetti-pattern.svg');
  background-size: 200px;
  opacity: 0.1;
  z-index: 0;
}

.holiday-icon {
  font-size: 4rem;
  margin-right: 2.5rem;
  z-index: 1;
}

.holiday-info {
  z-index: 1;
  flex-grow: 1;
}

.holiday-info h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: white;
}

.countdown {
  display: flex;
  align-items: baseline;
  margin-bottom: 0.5rem;
}

.countdown-number {
  font-size: 3rem;
  font-weight: bold;
  margin-right: 0.5rem;
}

.countdown-label {
  font-size: 1.2rem;
}

.holiday-date {
  font-size: 1.1rem;
  opacity: 0.9;
}

/* 所有节日部分 */
.section-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: var(--primary-color);
  position: relative;
  padding-bottom: 0.5rem;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background-color: var(--primary-color);
  border-radius: 1.5px;
}

.holidays-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-left: 2rem;
}

.holiday-card {
  background-color: var(--white);
  border-radius: var(--border-radius-medium);
  box-shadow: var(--shadow-light);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.holiday-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-medium);
}

.holiday-card-content {
  padding: 1.5rem;
}

.holiday-name {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: var(--black);
}

.holiday-countdown {
  display: flex;
  align-items: baseline;
  margin-bottom: 0.5rem;
}

.days-number {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-right: 0.5rem;
}

.days-label {
  color: var(--gray);
}

.holiday-date {
  font-size: 0.9rem;
  color: var(--gray);
}

@media (max-width: 768px) {
  .holiday-icon {
    font-size: 3rem;
    margin-right: 1.5rem;
  }
  
  .holiday-info h2 {
    font-size: 1.5rem;
  }
  
  .countdown-number {
    font-size: 2.5rem;
  }
  
  .countdown-label {
    font-size: 1rem;
  }
  
  .holidays-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
}

@media (max-width: 576px) {
  .next-holiday-card {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }
  
  .holiday-icon {
    margin-right: 0;
    margin-bottom: 1rem;
  }
  
  .countdown {
    justify-content: center;
  }
  
  .holidays-grid {
    grid-template-columns: 1fr;
  }
  
  .country-selector {
    flex-direction: column;
    align-items: center;
  }
  
  .country-btn {
    width: 100%;
    max-width: 250px;
  }
}
</style> 