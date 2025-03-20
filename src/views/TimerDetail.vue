<template>
  <div class="timer-detail">
    <div class="container" :class="{'puppy-run-container': isPuppyRunTimer}">
      <div class="timer-header">
        <router-link to="/timers" class="back-link">
          &larr; {{ $t('common.back') }}
        </router-link>
        <h1 class="timer-title">{{ getPageTitle }}</h1>
        <button 
          v-if="timer" 
          class="favorite-button"
          @click="toggleFavorite"
          :class="{ 'is-favorite': isFavorite }"
        >
          <i :class="['fas', isFavorite ? 'fa-star' : 'fa-star-o']"></i>
          {{ isFavorite ? ($t('timers.removeFromFavorites') || '取消收藏') : ($t('timers.addToFavorites') || '收藏') }}
        </button>
      </div>
      
      <div v-if="timer" class="timer-content" :class="{'puppy-run-content': isPuppyRunTimer}">
        <!-- 左侧计时器控制面板，对小狗跑步计时器隐藏 -->
        <div class="timer-controls card" v-if="!isPuppyRunTimer">
          <div class="time-input">
            <div class="time-field">
              <label>{{ $t('common.minutes') }}</label>
              <input 
                type="number" 
                v-model="minutes" 
                min="0" 
                max="60" 
                :disabled="isRunning"
              >
            </div>
            <div class="time-separator">:</div>
            <div class="time-field">
              <label>{{ $t('common.seconds') }}</label>
              <input 
                type="number" 
                v-model="seconds" 
                min="0" 
                max="59" 
                :disabled="isRunning"
              >
            </div>
          </div>
          
          <!-- 学习目标选择 -->
          <div class="learning-goal-selector" v-if="learningGoals.length > 0">
            <div class="selector-label">
              <i class="fas fa-graduation-cap"></i>
              {{ $t('education.selectGoal') || '选择学习目标' }}
            </div>
            <select v-model="selectedGoal" :disabled="isRunning">
              <option value="">{{ $t('education.noGoal') || '无' }}</option>
              <option v-for="(goal, index) in learningGoals" :key="index" :value="index">
                {{ goal.title }} ({{ formatDuration(goal.duration) }})
              </option>
            </select>
            <div v-if="selectedGoal !== ''" class="selected-goal-info">
              <p class="goal-description">{{ currentGoal.description }}</p>
              <button 
                class="apply-goal-button" 
                @click="applyGoalTime" 
                :disabled="isRunning"
              >
                <i class="fas fa-clock"></i>
                {{ $t('education.applyTime') || '应用时间' }}
              </button>
            </div>
          </div>
          
          <!-- 音效设置 -->
          <div class="sound-settings">
            <div class="setting-section-title">
              <i class="fas fa-volume-up"></i>
              {{ $t('timers.soundSettings') || '音效设置' }}
            </div>
            
            <div class="sound-toggle">
              <label class="toggle">
                <input type="checkbox" v-model="isSoundEnabled" @change="toggleSound">
                <span class="toggle-slider"></span>
              </label>
              <span class="toggle-label">{{ isSoundEnabled ? ($t('timers.soundOn') || '开启音效') : ($t('timers.soundOff') || '关闭音效') }}</span>
            </div>
            
            <div class="sound-selector" v-if="isSoundEnabled">
              <label>{{ $t('timers.selectSound') || '选择音效' }}:</label>
              <div class="sound-options">
                <button 
                  v-for="sound in soundOptions" 
                  :key="sound.id"
                  class="sound-option"
                  :class="{ active: selectedSound === sound.id }"
                  @click="changeSound(sound.id)"
                >
                  {{ sound.name }}
                </button>
              </div>
            </div>
          </div>
          
          <div class="control-buttons">
            <button 
              v-if="!isRunning" 
              class="btn btn-large" 
              @click="startTimer"
              :disabled="totalSeconds === 0"
            >
              开始
            </button>
            <button 
              v-else 
              class="btn btn-large" 
              @click="pauseTimer"
            >
              暂停
            </button>
            <button 
              class="btn btn-large btn-secondary" 
              @click="resetTimer"
            >
              重置
            </button>
            <button 
              class="btn btn-large" 
              @click="toggleFullscreen"
            >
              {{ isFullscreen ? '退出全屏' : '全屏模式' }}
            </button>
          </div>
        </div>
        
        <!-- 右侧计时器显示区 -->
        <div class="timer-display-container card" :class="{ 'fullscreen': isFullscreen }">
          <!-- 计时器组件 -->
          <component 
            v-if="timerComponent" 
            :is="timerComponent" 
            :time="displayTime" 
            :progress="progress"
            :is-running="isRunning"
            :is-finished="isFinished"
            @timer-end="onTimerEnd"
          ></component>
          
          <div class="time-display" v-if="!isPuppyRunTimer">
            {{ formattedTime }}
          </div>
        </div>
        
        <!-- 活动提醒模态框 -->
        <div class="reminder-modal" v-if="showReminderModal && currentReminder">
          <div class="reminder-content">
            <div class="reminder-icon">
              <i class="fas fa-bell"></i>
            </div>
            <h3 class="reminder-title">{{ $t('education.activityReminder') || '活动提醒' }}</h3>
            <p class="reminder-message">{{ currentReminder.message }}</p>
            <button class="close-reminder" @click="closeReminderModal">
              {{ $t('common.gotIt') || '知道了' }}
            </button>
          </div>
        </div>
      </div>
      
      <div v-else class="loading-state">
        <p>正在加载计时器...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useSettingsStore } from '../store/settingsStore';

// 导入计时器组件
import PuppyRunTimer from '@/components/timers/PuppyRunTimer.vue';
import BaseTimer from '@/components/timers/BaseTimer.vue';
import ClockTimer from '@/components/timers/ClockTimer.vue';
import CandleTimer from '@/components/timers/CandleTimer.vue';
import RocketTimer from '@/components/timers/RocketTimer.vue';
import RunningTimer from '@/components/timers/RunningTimer.vue';

// 注册为具名组件
const components = {
  'PuppyRunTimer': PuppyRunTimer,
  'BaseTimer': BaseTimer,
  'ClockTimer': ClockTimer,
  'CandleTimer': CandleTimer,
  'RocketTimer': RocketTimer,
  'RunningTimer': RunningTimer
};

// 定义计时器类型
interface Timer {
  id: string;
  name: string;
  description: string;
  icon: string;
  component: string;
}

// 可用的计时器列表
const availableTimers: Timer[] = [
  {
    id: 'puppy-run',
    name: '小狗跑步',
    description: '可爱的小狗跑步计时器',
    icon: '🐕',
    component: 'PuppyRunTimer'
  },
  {
    id: 'basic',
    name: '基础计时器',
    description: '简单的倒计时定时器',
    icon: '⏱️',
    component: 'BaseTimer'
  },
  {
    id: 'countdown',
    name: '倒计时',
    description: '模拟时钟的倒计时效果',
    icon: '⏰',
    component: 'ClockTimer'
  }
];

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const settingsStore = useSettingsStore();

// 当前计时器
const timer = computed(() => {
  // 如果是固定时间链接，默认使用基础计时器
  if (isFromFixedLink.value) {
    // 创建一个固定时间的计时器对象，并根据路由参数设置名称
    const unit = route.params.unit as string;
    const value = parseInt(route.params.value as string);
    let timerName = '';
    
    if (!isNaN(value)) {
      if (unit === 'second') {
        timerName = `${value} Second Timer`;
      } else if (unit === 'minute') {
        timerName = `${value} Minute Timer`;
      } else if (unit === 'hour') {
        timerName = `${value} Hour Timer`;
      }
    }
    
    return {
      id: 'basic',
      name: timerName || 'Basic Timer',
      description: 'Simple countdown timer',
      icon: '⏱️',
      component: 'BaseTimer'
    };
  }
  // 否则根据路由参数查找
  const foundTimer = availableTimers.find(t => t.id === route.params.type as string);
  console.log('Found timer:', foundTimer, 'for route param:', route.params.type);
  return foundTimer;
});

// 计时器组件
const timerComponent = computed(() => {
  if (!timer.value) {
    console.error('No timer found');
    return null;
  }
  
  const component = components[timer.value.component as keyof typeof components];
  if (!component) {
    console.error(`Component ${timer.value.component} not found`);
  }
  return component;
});

// 状态变量
const isRunning = ref(false);
const isPaused = ref(false);
const isFinished = ref(false);
const minutes = ref(5);
const seconds = ref(0);
const currentTime = ref(0);
const initialTime = ref(0);
const isFullscreen = ref(false);
let timerInterval: number | null = null;

// 检查是否是从固定时间链接进入
const isFromFixedLink = computed(() => {
  return route.name === 'fixedTimer' && route.params.unit && route.params.value;
});

// 处理固定时间链接
const handleFixedTimeLink = () => {
  if (!isFromFixedLink.value) return;
  
  const unit = route.params.unit as string;
  const value = parseInt(route.params.value as string);
  
  if (isNaN(value)) return;
  
  // 重置初始状态
  isRunning.value = false;
  isFinished.value = false;
  
  switch (unit) {
    case 'second':
      minutes.value = Math.floor(value / 60);
      seconds.value = value % 60;
      break;
    case 'minute':
      minutes.value = value;
      seconds.value = 0;
      break;
    case 'hour':
      minutes.value = value * 60;
      seconds.value = 0;
      break;
  }
  
  // 计算并更新时间
  currentTime.value = minutes.value * 60 + seconds.value;
  initialTime.value = currentTime.value;
  
  // 延迟一小段时间后自动开始计时
  setTimeout(() => {
    startTimer();
  }, 500);
};

// 学习目标和活动提醒
const learningGoals = ref([]);
const selectedGoal = ref('');
const activityReminders = ref([]);
const activeReminders = ref([]);
const showReminderModal = ref(false);
const currentReminder = ref(null);

// 计算总秒数
const totalSeconds = computed(() => {
  return minutes.value * 60 + seconds.value;
});

// 计算显示时间
const displayTime = computed(() => {
  return currentTime.value;
});

// 计算进度
const progress = computed(() => {
  if (initialTime.value === 0) return 0;
  return (initialTime.value - currentTime.value) / initialTime.value;
});

// 计算当前选择的学习目标
const currentGoal = computed(() => {
  if (selectedGoal.value === '' || !learningGoals.value[selectedGoal.value]) {
    return { title: '', description: '', duration: 0 };
  }
  return learningGoals.value[selectedGoal.value];
});

// 应用学习目标的时间
const applyGoalTime = () => {
  if (selectedGoal.value !== '' && !isRunning.value) {
    const goalDuration = currentGoal.value.duration;
    minutes.value = goalDuration;
    seconds.value = 0;
    currentTime.value = goalDuration * 60;
    initialTime.value = currentTime.value;
  }
};

// 格式化持续时间显示
const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes} ${t('common.minutes')}`;
  } else {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) {
      return `${hours} ${t('education.hours') || '小时'}`;
    } else {
      return `${hours} ${t('education.hours') || '小时'} ${mins} ${t('common.minutes')}`;
    }
  }
};

// 处理活动提醒
const processReminders = () => {
  // 重置激活的提醒
  activeReminders.value = [];
  
  // 如果没有提醒或计时器未运行，则返回
  if (activityReminders.value.length === 0 || !isRunning.value) return;
  
  // 计算当前进度百分比
  const currentProgress = progress.value * 100;
  
  // 检查每个提醒
  activityReminders.value.forEach(reminder => {
    // 检查当前进度是否达到提醒的百分比（允许1%的误差）
    const reminderPercentage = 100 - reminder.percentage;
    if (
      Math.abs(currentProgress - reminderPercentage) < 1 &&
      !activeReminders.value.some(r => r.id === reminder.id)
    ) {
      // 激活提醒
      showReminder(reminder);
    }
  });
};

// 显示提醒
const showReminder = (reminder) => {
  // 添加到激活提醒列表
  activeReminders.value.push({
    ...reminder,
    id: Date.now() // 添加唯一ID
  });
  
  // 显示提醒模态框
  currentReminder.value = reminder;
  showReminderModal.value = true;
  
  // 播放提醒声音
  if (reminder.sound && reminder.sound !== 'none') {
    const audio = new Audio(`/sounds/${reminder.sound}.mp3`);
    audio.play().catch(error => {
      console.error('Failed to play reminder sound:', error);
    });
  }
  
  // 自动关闭提醒模态框
  setTimeout(() => {
    if (currentReminder.value === reminder) {
      closeReminderModal();
    }
  }, 5000);
};

// 关闭提醒模态框
const closeReminderModal = () => {
  showReminderModal.value = false;
  currentReminder.value = null;
};

// 开始计时器
const startTimer = () => {
  console.log('TimerDetail: 开始计时器');
  
  if (isFinished.value) {
    resetTimer();
  }
  
  if (!isRunning.value) {
    isRunning.value = true;
    isFinished.value = false;
    
    // 重置激活的提醒
    activeReminders.value = [];
    
    if (currentTime.value === 0) {
      currentTime.value = totalSeconds.value;
    }
    
    // 保存默认时间设置
    localStorage.setItem('timerDefaultTime', JSON.stringify({
      minutes: minutes.value,
      seconds: seconds.value
    }));
    
    timerInterval = setInterval(() => {
      if (currentTime.value > 0) {
        currentTime.value--;
        // 处理活动提醒
        processReminders();
      } else {
        handleTimerEnd();
      }
    }, 1000);
  }
};

// 暂停计时器
const pauseTimer = () => {
  console.log('TimerDetail: 暂停计时器');
  isRunning.value = false;
  clearInterval(timerInterval);
};

// 重置计时器
const resetTimer = () => {
  console.log('TimerDetail: 重置计时器');
  pauseTimer();
  currentTime.value = totalSeconds.value;
  initialTime.value = currentTime.value;
  isFinished.value = false;
};

// 处理计时结束
const handleTimerEnd = () => {
  pauseTimer();
  isFinished.value = true;
  playEndSound();
};

// 播放结束音效
const playEndSound = () => {
  if (!isSoundEnabled.value) return;
  
  try {
    // 如果存在之前的音频实例，停止播放并释放
    if (audio.value) {
      audio.value.pause();
      audio.value.currentTime = 0;
    }
    
    // 创建新的音频实例
    const selectedSoundOption = soundOptions.find(s => s.id === selectedSound.value);
    if (selectedSoundOption) {
      audio.value = new Audio(selectedSoundOption.file);
      audio.value.volume = 0.7; // 设置音量
      audio.value.play().catch(error => {
        console.error('播放音效失败:', error);
      });
    }
  } catch (error) {
    console.error('音效播放错误:', error);
  }
};

// 切换音效开关
const toggleSound = () => {
  isSoundEnabled.value = !isSoundEnabled.value;
  localStorage.setItem('timerSoundEnabled', isSoundEnabled.value.toString());
};

// 改变选择的音效
const changeSound = (soundId: string) => {
  selectedSound.value = soundId;
  localStorage.setItem('selectedTimerSound', soundId);
  
  // 播放音效预览
  if (isSoundEnabled.value) {
    playEndSound();
  }
};

// 切换全屏模式
const toggleFullscreen = () => {
  if (!isFullscreen.value) {
    // 进入全屏模式
    const timerEl = document.querySelector('.timer-display');
    if (timerEl && timerEl.requestFullscreen) {
      timerEl.requestFullscreen().then(() => {
        isFullscreen.value = true;
      }).catch(err => {
        console.error('全屏模式错误:', err);
      });
    } else if (timerEl && timerEl.webkitRequestFullscreen) {
      // Safari
      timerEl.webkitRequestFullscreen();
      isFullscreen.value = true;
    } else if (timerEl && timerEl.msRequestFullscreen) {
      // IE11
      timerEl.msRequestFullscreen();
      isFullscreen.value = true;
    } else {
      // 如果原生全屏API不可用，使用之前的模拟全屏方式
      isFullscreen.value = true;
    }
  } else {
    // 退出全屏模式
    if (document.exitFullscreen) {
      document.exitFullscreen().then(() => {
        isFullscreen.value = false;
      }).catch(err => {
        console.error('退出全屏错误:', err);
      });
    } else if (document.webkitExitFullscreen) {
      // Safari
      document.webkitExitFullscreen();
      isFullscreen.value = false;
    } else if (document.msExitFullscreen) {
      // IE11
      document.msExitFullscreen();
      isFullscreen.value = false;
    } else {
      // 如果原生全屏API不可用，使用之前的模拟全屏方式
      isFullscreen.value = false;
    }
  }
};

// 监听全屏状态变化
const handleFullscreenChange = () => {
  // 当用户按ESC键退出全屏时更新状态
  isFullscreen.value = !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
};

// 监听总时间变化
watch(totalSeconds, (newValue) => {
  if (!isRunning.value) {
    currentTime.value = newValue;
  }
});

// 组件挂载
onMounted(() => {
  // 获取URL中的计时器类型
  const timerType = route.params.type as string;
  
  // 如果找不到计时器，设置默认值
  if (!timer.value) {
    console.warn('计时器不存在，使用默认计时器');
    router.replace('/timers');
  }
  
  // 从本地存储加载默认时间
  const savedTime = localStorage.getItem('timerDefaultTime');
  if (savedTime) {
    const time = JSON.parse(savedTime);
    minutes.value = time.minutes || 5;
    seconds.value = time.seconds || 0;
  }
  
  currentTime.value = minutes.value * 60 + seconds.value;
  initialTime.value = currentTime.value;
  
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  
  // 加载学习目标
  const savedGoals = localStorage.getItem('learningGoals');
  if (savedGoals) {
    learningGoals.value = JSON.parse(savedGoals);
    
    // 如果当前计时器类型匹配某个学习目标，自动选择它
    if (timer.value) {
      const timerComponentName = timer.value.component;
      const matchingGoalIndex = learningGoals.value.findIndex(
        goal => goal.timerType === timerComponentName.replace('Timer', '').toLowerCase()
      );
      
      if (matchingGoalIndex !== -1) {
        selectedGoal.value = matchingGoalIndex.toString();
      }
    }
  }
  
  // 加载活动提醒
  const savedReminders = localStorage.getItem('activityReminders');
  if (savedReminders) {
    activityReminders.value = JSON.parse(savedReminders);
  }
  
  // 检查是否从固定时间链接进入
  handleFixedTimeLink();
  
  // 设置页面标题
  updatePageTitle();
  
  // 加载音效设置
  const savedSoundEnabled = localStorage.getItem('timerSoundEnabled');
  if (savedSoundEnabled !== null) {
    isSoundEnabled.value = savedSoundEnabled === 'true';
  }
  
  const savedSound = localStorage.getItem('selectedTimerSound');
  if (savedSound && soundOptions.some(s => s.id === savedSound)) {
    selectedSound.value = savedSound;
  }
});

// 更新页面标题和描述
const updatePageTitle = () => {
  try {
    // 使用setTimeout确保在下一个时间片段中执行，避免在计算属性初始化之前访问
    setTimeout(() => {
      // 设置文档标题
      if (getPageTitle && getPageTitle.value) {
        document.title = getPageTitle.value;
      }
      
      // 更新meta描述
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }

      // 生成描述文本
      let description = '';
      if (route.params.unit && route.params.value) {
        const unit = route.params.unit as string;
        const value = route.params.value as string;
        
        if (unit === 'second') {
          description = `Use our free ${value} second timer online. Easy to use countdown clock with alarm.`;
        } else if (unit === 'minute') {
          description = `Free online ${value} minute timer with alarm. Perfect for classroom activities.`;
        } else if (unit === 'hour') {
          description = `Set a ${value} hour countdown timer online for free. Large display with alarm sound.`;
        }
      } else if (timer.value) {
        description = `${timer.value.name} - Free online timer with fun animations.`;
      }

      metaDescription.setAttribute('content', description);
    }, 0);
  } catch (error) {
    console.error('Error updating page title:', error);
  }
};

// 监听路由和计时器变化
watch([() => route.params.unit, () => route.params.value, timer], () => {
  updatePageTitle();
});

// 组件卸载前
onBeforeUnmount(() => {
  // 清除计时器
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  // 移除事件监听
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
  
  // 确保退出全屏
  if (isFullscreen.value && document.exitFullscreen) {
    document.exitFullscreen().catch(() => {});
  }
});

// 处理键盘事件
const handleKeydown = (event) => {
  if (event.code === 'Space') {
    // 空格键开始/暂停计时器
    if (isRunning.value) {
      pauseTimer();
    } else {
      startTimer();
    }
    event.preventDefault();
  } else if (event.code === 'Escape' && isFullscreen.value) {
    // ESC键退出全屏
    isFullscreen.value = false;
    event.preventDefault();
  }
};

// 计算当前计时器是否已收藏
const isFavorite = computed(() => {
  if (!timer.value) return false;
  return settingsStore.isTimerFavorite(timer.value.id);
});

// 添加/取消收藏
const toggleFavorite = () => {
  if (timer.value) {
    settingsStore.toggleFavoriteTimer(timer.value.id);
  }
};

// 判断是否是小狗跑步计时器
const isPuppyRunTimer = computed(() => {
  return timer.value?.id === 'puppy-run';
});

// 计算页面标题，用于SEO优化
const getPageTitle = computed(() => {
  if (!timer.value) {
    return $t('common.loading');
  }

  // 根据计时器类型生成更有意义的标题
  const timerName = timer.value.name || '';
  let suffix = '';

  if (route.params.unit && route.params.value) {
    const unit = route.params.unit as string;
    const value = route.params.value as string;
    
    if (unit === 'second') {
      suffix = ' - Online Countdown Clock';
    } else if (unit === 'minute') {
      suffix = ' - Free Online Timer';
    } else if (unit === 'hour') {
      suffix = ' - Countdown Clock Timer';
    }
    
    return `${value} ${unit.charAt(0).toUpperCase() + unit.slice(1)} Timer${suffix}`;
  }
  
  return `${timerName} - 123510 Minute Timer`;
});

// 音效相关
const isSoundEnabled = ref(true); // 默认开启音效
const audio = ref<HTMLAudioElement | null>(null);
const soundOptions = [
  { id: 'bell', name: '铃声', file: '/sounds/bell.mp3' },
  { id: 'alarm', name: '闹钟', file: '/sounds/alarm.mp3' },
  { id: 'beep', name: '哔声', file: '/sounds/beep.mp3' },
  { id: 'chime', name: '风铃', file: '/sounds/chime.mp3' },
  { id: 'digital', name: '电子', file: '/sounds/digital.mp3' }
];
const selectedSound = ref('bell'); // 默认选择铃声
</script>

<style scoped>
.timer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.back-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  transition: color var(--transition-fast);
}

.back-link:hover {
  color: var(--primary-dark);
}

.timer-title {
  margin: 0;
  font-size: 2rem;
  color: var(--primary-color);
  flex-grow: 1;
  text-align: center;
}

.favorite-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--bg-light, #f5f5f5);
  border: 1px solid var(--border-color, #eeeeee);
  border-radius: var(--border-radius, 8px);
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-fast, 0.3s);
}

.favorite-button:hover {
  background-color: var(--bg-hover, #e9e9e9);
}

.favorite-button.is-favorite {
  background-color: var(--warning-light, #FFF3D6);
  border-color: var(--warning-color, #FFB20C);
  color: var(--warning-dark, #B27800);
}

.favorite-button.is-favorite:hover {
  background-color: var(--warning-lighter, #FFF8E8);
}

.favorite-button i {
  color: var(--warning-color, #FFB20C);
}

.timer-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
}

.timer-controls {
  padding: 2rem;
}

.time-input {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
}

.time-field {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.time-field label {
  margin-bottom: 0.5rem;
  color: var(--dark-gray);
}

.time-field input {
  width: 80px;
  height: 60px;
  font-size: 2rem;
  text-align: center;
  border: 2px solid var(--gray);
  border-radius: var(--border-radius-medium);
  padding: 0.5rem;
}

.time-separator {
  font-size: 2rem;
  margin: 0 1rem;
  padding-top: 1.5rem;
}

.control-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.timer-display-container {
  background-color: var(--white);
  border-radius: var(--border-radius-medium);
  box-shadow: var(--shadow-medium);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 400px;
}

.timer-display-container.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  border-radius: 0;
  padding: 0;
}

.time-display {
  font-size: 4rem;
  font-weight: bold;
  margin-top: 2rem;
}

.loading-state {
  text-align: center;
  padding: 3rem;
  color: var(--dark-gray);
}

.reminder-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.reminder-content {
  background-color: var(--white);
  padding: 2rem;
  border-radius: var(--border-radius-medium);
  box-shadow: var(--shadow-medium);
  max-width: 80%;
  width: 400px;
}

.reminder-icon {
  text-align: center;
  margin-bottom: 1rem;
}

.reminder-title {
  text-align: center;
  margin-bottom: 1rem;
}

.reminder-message {
  text-align: center;
  margin-bottom: 2rem;
}

.close-reminder {
  display: block;
  margin: 0 auto;
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  border-radius: var(--border-radius-medium);
  cursor: pointer;
}

@media (max-width: 768px) {
  .timer-content {
    grid-template-columns: 1fr;
  }
  
  .time-display {
    font-size: 3rem;
  }
}

/* 小狗跑步计时器特殊样式 */
.puppy-run-container {
  max-width: 100%;
  padding: 0;
}

.puppy-run-content {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.puppy-run-display {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 75vh; /* 增加最小高度 */
}

/* 全屏模式下的特殊样式 */
:fullscreen {
  background-color: #f9f9f9;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

:fullscreen .timer-display-container {
  height: 90vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0;
}

:fullscreen .timer-content {
  width: 100%;
  height: 100%;
}

/* 音效设置样式 */
.sound-settings {
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: var(--bg-light);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.setting-section-title {
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary-color);
}

.sound-toggle {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.toggle {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  margin-right: 10px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: var(--primary-color);
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

.toggle-label {
  font-size: 0.9rem;
  color: var(--text);
}

.sound-selector {
  margin-top: 1rem;
}

.sound-selector label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: var(--text);
}

.sound-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.sound-option {
  padding: 6px 12px;
  background-color: #fff;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.sound-option:hover {
  background-color: var(--bg-hover);
}

.sound-option.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

@media (max-width: 768px) {
  .sound-options {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style> 