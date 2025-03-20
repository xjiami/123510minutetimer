<template>
  <div class="sound-settings">
    <div class="section-title">{{ $t('settings.sound') }}</div>
    
    <div class="setting-row">
      <div class="setting-label">{{ $t('settings.enableSound') }}</div>
      <div class="setting-control">
        <label class="toggle-switch">
          <input 
            type="checkbox" 
            :checked="soundEnabled" 
            @change="toggleSound"
          >
          <span class="toggle-slider"></span>
        </label>
      </div>
    </div>
    
    <div class="setting-row" v-if="soundEnabled">
      <div class="setting-label">{{ $t('settings.volume') }}</div>
      <div class="setting-control volume-control">
        <div class="volume-icon" @click="toggleMute">
          <i :class="volumeIcon"></i>
        </div>
        <input 
          type="range" 
          min="0" 
          max="100" 
          step="1" 
          v-model="volume" 
          @input="updateVolume"
          class="volume-slider"
        >
        <div class="volume-value">{{ volume }}%</div>
      </div>
    </div>
    
    <div class="sound-preview" v-if="soundEnabled">
      <button 
        class="preview-button"
        @click="playPreviewSound"
      >
        {{ $t('settings.testSound') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// 添加到i18n文件中的新翻译
t('settings.testSound', '测试音效'); // 中文
// 英文和日文版本需在i18n配置文件中添加

// 声音设置状态
const soundEnabled = ref(true);
const volume = ref(80);
const isMuted = ref(false);
const previewAudio = ref(null);

// 计算音量图标
const volumeIcon = computed(() => {
  if (isMuted.value || volume.value === 0) {
    return 'fas fa-volume-mute';
  } else if (volume.value < 30) {
    return 'fas fa-volume-off';
  } else if (volume.value < 70) {
    return 'fas fa-volume-down';
  } else {
    return 'fas fa-volume-up';
  }
});

// 从localStorage获取保存的声音设置
onMounted(() => {
  const savedSoundEnabled = localStorage.getItem('soundEnabled');
  const savedVolume = localStorage.getItem('soundVolume');
  const savedMuted = localStorage.getItem('soundMuted');
  
  if (savedSoundEnabled !== null) {
    soundEnabled.value = savedSoundEnabled === 'true';
  }
  
  if (savedVolume !== null) {
    volume.value = parseInt(savedVolume);
  }
  
  if (savedMuted !== null) {
    isMuted.value = savedMuted === 'true';
  }
  
  // 创建音频元素用于预览
  previewAudio.value = new Audio('/sounds/timer-end.mp3');
});

// 切换声音开关
const toggleSound = (event) => {
  soundEnabled.value = event.target.checked;
  localStorage.setItem('soundEnabled', soundEnabled.value.toString());
  
  // 触发声音设置更改事件
  window.dispatchEvent(new CustomEvent('sound-setting-changed', { 
    detail: { 
      enabled: soundEnabled.value,
      volume: volume.value,
      muted: isMuted.value
    } 
  }));
};

// 更新音量
const updateVolume = () => {
  // 如果调整音量，取消静音状态
  if (volume.value > 0 && isMuted.value) {
    isMuted.value = false;
    localStorage.setItem('soundMuted', 'false');
  }
  
  localStorage.setItem('soundVolume', volume.value.toString());
  
  // 同步设置到音频预览
  if (previewAudio.value) {
    previewAudio.value.volume = volume.value / 100;
  }
  
  // 触发音量更改事件
  window.dispatchEvent(new CustomEvent('sound-volume-changed', { 
    detail: { volume: volume.value / 100 } 
  }));
};

// 切换静音
const toggleMute = () => {
  isMuted.value = !isMuted.value;
  localStorage.setItem('soundMuted', isMuted.value.toString());
  
  // 触发静音更改事件
  window.dispatchEvent(new CustomEvent('sound-mute-changed', { 
    detail: { muted: isMuted.value } 
  }));
};

// 播放预览音效
const playPreviewSound = () => {
  if (previewAudio.value && soundEnabled.value && !isMuted.value) {
    previewAudio.value.volume = volume.value / 100;
    previewAudio.value.currentTime = 0;
    previewAudio.value.play();
  }
};
</script>

<style scoped>
.sound-settings {
  padding: 1rem;
  background-color: var(--card-bg, #ffffff);
  border-radius: var(--border-radius, 8px);
  box-shadow: var(--box-shadow, 0 2px 10px rgba(0, 0, 0, 0.1));
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: var(--text-primary, #333333);
}

.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-color, #eeeeee);
}

.setting-row:last-child {
  border-bottom: none;
}

.setting-label {
  font-size: 1rem;
  color: var(--text-secondary, #666666);
}

.setting-control {
  display: flex;
  align-items: center;
}

/* 开关样式 */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 30px;
}

.toggle-switch input {
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
  background-color: var(--inactive-bg, #cccccc);
  transition: .3s;
  border-radius: 30px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .3s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: var(--primary-color, #2196F3);
}

input:checked + .toggle-slider:before {
  transform: translateX(30px);
}

/* 音量控制样式 */
.volume-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 180px;
}

.volume-icon {
  cursor: pointer;
  width: 24px;
  text-align: center;
}

.volume-slider {
  flex: 1;
  height: 5px;
  appearance: none;
  background: var(--inactive-bg, #cccccc);
  outline: none;
  border-radius: 5px;
  transition: background .3s;
}

.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: var(--primary-color, #2196F3);
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: var(--primary-color, #2196F3);
  cursor: pointer;
  border: none;
}

.volume-value {
  min-width: 40px;
  text-align: right;
  font-size: 0.9rem;
}

/* 音效预览按钮 */
.sound-preview {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}

.preview-button {
  padding: 0.5rem 1.5rem;
  background-color: var(--primary-color, #2196F3);
  color: white;
  border: none;
  border-radius: var(--border-radius, 8px);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.preview-button:hover {
  background-color: var(--primary-hover, #1E88E5);
  transform: translateY(-2px);
}
</style> 