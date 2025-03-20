<template>
  <div class="activity-reminder">
    <div class="section-title">{{ $t('education.activityReminder') || '活动计时提醒' }}</div>
    
    <div class="reminder-description">
      <p>{{ $t('education.reminderDescription') || '设置计时过程中的提醒，帮助更好地组织教学活动' }}</p>
    </div>
    
    <div class="reminders-list" v-if="activityReminders.length > 0">
      <div 
        v-for="(reminder, index) in activityReminders" 
        :key="index" 
        class="reminder-item"
      >
        <div class="reminder-content">
          <div class="reminder-time">
            <div class="time-icon">
              <i class="fas fa-bell"></i>
            </div>
            <div class="time-text">
              <span class="percentage">{{ reminder.percentage }}%</span>
              <span class="time-value">{{ formatTimeFromPercentage(reminder.percentage) }}</span>
            </div>
          </div>
          
          <div class="reminder-message">
            {{ reminder.message }}
          </div>
          
          <div class="reminder-actions">
            <button class="edit-button" @click="editReminder(index)">
              <i class="fas fa-edit"></i>
            </button>
            <button class="delete-button" @click="removeReminder(index)">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="empty-reminders" v-else>
      <div class="empty-icon">
        <i class="fas fa-bell-slash"></i>
      </div>
      <p class="empty-text">{{ $t('education.noRemindersYet') || '暂无活动提醒' }}</p>
    </div>
    
    <button class="add-reminder-button" @click="showAddReminderModal = true">
      <i class="fas fa-plus"></i>
      {{ $t('education.addReminder') || '添加提醒' }}
    </button>
    
    <!-- 添加/编辑提醒模态框 -->
    <div class="modal-overlay" v-if="showAddReminderModal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">
            {{ isEditing ? ($t('education.editReminder') || '编辑提醒') : ($t('education.addReminder') || '添加提醒') }}
          </h2>
          <button class="close-button" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label for="reminder-percentage">{{ $t('education.reminderTime') || '提醒时间点' }} (%)</label>
            <div class="percentage-input-wrapper">
              <input 
                type="range" 
                id="reminder-percentage" 
                v-model.number="currentReminder.percentage" 
                min="1" 
                max="99"
                class="percentage-slider"
              />
              <div class="percentage-value">{{ currentReminder.percentage }}%</div>
            </div>
            <div class="time-preview">
              {{ $t('education.triggerAt') || '将在剩余' }} {{ formatTimeFromPercentage(currentReminder.percentage) }} {{ $t('education.timeRemaining') || '时触发' }}
            </div>
          </div>
          
          <div class="form-group">
            <label for="reminder-message">{{ $t('education.reminderMessage') || '提醒消息' }} *</label>
            <textarea 
              id="reminder-message" 
              v-model="currentReminder.message" 
              :placeholder="$t('education.enterMessage') || '输入提醒消息'"
              rows="3"
              required
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="reminder-sound">{{ $t('education.reminderSound') || '提醒声音' }}</label>
            <select id="reminder-sound" v-model="currentReminder.sound">
              <option value="bell">{{ $t('education.bellSound') || '铃声' }}</option>
              <option value="chime">{{ $t('education.chimeSound') || '风铃声' }}</option>
              <option value="alert">{{ $t('education.alertSound') || '提示音' }}</option>
              <option value="none">{{ $t('education.noSound') || '无声音' }}</option>
            </select>
            <button class="preview-sound-button" @click="previewSound" :disabled="currentReminder.sound === 'none'">
              <i class="fas fa-play"></i>
              {{ $t('education.preview') || '预览' }}
            </button>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="cancel-button" @click="closeModal">
            {{ $t('common.cancel') }}
          </button>
          <button 
            class="save-button" 
            @click="saveReminder" 
            :disabled="!isReminderValid"
          >
            {{ $t('common.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// 活动提醒列表
const activityReminders = ref([]);

// 当前编辑的提醒
const currentReminder = ref({
  percentage: 50,
  message: '',
  sound: 'bell'
});

// 总计时时间（分钟）- 用于预览
const totalTime = ref(10);

// 状态控制
const showAddReminderModal = ref(false);
const isEditing = ref(false);
const editingIndex = ref(-1);

// 检查提醒是否有效
const isReminderValid = computed(() => {
  return currentReminder.value.message.trim() !== '';
});

// 根据百分比格式化时间
const formatTimeFromPercentage = (percentage) => {
  // 以10分钟为示例，计算对应的时间点
  const remainingPercentage = (100 - percentage) / 100;
  const totalSeconds = totalTime.value * 60;
  const remainingSeconds = Math.floor(totalSeconds * remainingPercentage);
  
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// 预览声音
const previewSound = () => {
  const sound = currentReminder.value.sound;
  if (sound === 'none') return;
  
  // 这里可以添加声音预览逻辑
  // 例如：播放对应的音频文件
  const audio = new Audio(`/sounds/${sound}.mp3`);
  audio.play().catch(error => {
    console.error('Failed to play sound:', error);
  });
};

// 添加新提醒
const saveReminder = () => {
  if (!isReminderValid.value) return;
  
  const reminderToSave = { ...currentReminder.value };
  
  if (isEditing.value) {
    // 更新现有提醒
    activityReminders.value[editingIndex.value] = reminderToSave;
  } else {
    // 添加新提醒
    activityReminders.value.push(reminderToSave);
  }
  
  // 按百分比排序（从最大到最小）
  activityReminders.value.sort((a, b) => b.percentage - a.percentage);
  
  // 保存到本地存储
  localStorage.setItem('activityReminders', JSON.stringify(activityReminders.value));
  
  // 关闭模态框并重置表单
  closeModal();
};

// 编辑提醒
const editReminder = (index) => {
  isEditing.value = true;
  editingIndex.value = index;
  currentReminder.value = { ...activityReminders.value[index] };
  showAddReminderModal.value = true;
};

// 删除提醒
const removeReminder = (index) => {
  if (confirm(t('education.confirmDeleteReminder') || '确定要删除此提醒吗？')) {
    activityReminders.value.splice(index, 1);
    localStorage.setItem('activityReminders', JSON.stringify(activityReminders.value));
  }
};

// 关闭模态框
const closeModal = () => {
  showAddReminderModal.value = false;
  isEditing.value = false;
  editingIndex.value = -1;
  // 重置表单
  currentReminder.value = {
    percentage: 50,
    message: '',
    sound: 'bell'
  };
};

// 从本地存储加载活动提醒
onMounted(() => {
  const savedReminders = localStorage.getItem('activityReminders');
  if (savedReminders) {
    activityReminders.value = JSON.parse(savedReminders);
  }
  
  // 获取默认计时时间
  const savedDefaultTime = localStorage.getItem('defaultTimerDuration');
  if (savedDefaultTime) {
    totalTime.value = parseInt(savedDefaultTime);
  }
});
</script>

<style scoped>
.activity-reminder {
  padding: 1rem;
  background-color: var(--card-bg, #ffffff);
  border-radius: var(--border-radius, 8px);
  box-shadow: var(--box-shadow, 0 2px 10px rgba(0, 0, 0, 0.1));
}

.section-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: var(--text-primary, #333333);
}

.reminder-description {
  margin-bottom: 1.5rem;
  color: var(--text-secondary, #666666);
  font-size: 0.9rem;
}

.reminders-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.reminder-item {
  background-color: var(--bg-light, #f5f5f5);
  border-radius: var(--border-radius, 8px);
  padding: 0.75rem 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.reminder-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.reminder-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.reminder-time {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 80px;
}

.time-icon {
  color: var(--warning-color, #ff9800);
  font-size: 1.2rem;
}

.time-text {
  display: flex;
  flex-direction: column;
}

.percentage {
  font-weight: bold;
  color: var(--text-primary, #333333);
}

.time-value {
  font-size: 0.8rem;
  color: var(--text-tertiary, #888888);
}

.reminder-message {
  flex-grow: 1;
  margin: 0 1rem;
  color: var(--text-primary, #333333);
}

.reminder-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-button,
.delete-button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.edit-button {
  color: var(--primary-color, #2196F3);
}

.delete-button {
  color: var(--danger-color, #f44336);
}

.edit-button:hover,
.delete-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.empty-reminders {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: var(--bg-light, #f5f5f5);
  border-radius: var(--border-radius, 8px);
  margin-bottom: 1.5rem;
}

.empty-icon {
  font-size: 2.5rem;
  color: var(--inactive-color, #cccccc);
  margin-bottom: 1rem;
}

.empty-text {
  color: var(--text-secondary, #666666);
  text-align: center;
}

.add-reminder-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  background-color: var(--primary-color, #2196F3);
  color: white;
  border: none;
  border-radius: var(--border-radius, 8px);
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-reminder-button:hover {
  background-color: var(--primary-dark, #1976D2);
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-width: 500px;
  background-color: var(--card-bg, #ffffff);
  border-radius: var(--border-radius, 8px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color, #eeeeee);
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-primary, #333333);
}

.close-button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--text-secondary, #666666);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.close-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.modal-body {
  padding: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-primary, #333333);
}

.percentage-input-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.percentage-slider {
  flex-grow: 1;
  height: 8px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--bg-light, #f5f5f5);
  border-radius: 4px;
  outline: none;
}

.percentage-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--primary-color, #2196F3);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.percentage-value {
  min-width: 50px;
  text-align: center;
  font-weight: bold;
  color: var(--primary-color, #2196F3);
}

.time-preview {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-tertiary, #888888);
  font-style: italic;
}

textarea,
select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color, #eeeeee);
  border-radius: var(--border-radius, 8px);
  background-color: var(--input-bg, #ffffff);
  color: var(--text-primary, #333333);
  font-size: 1rem;
}

textarea {
  resize: vertical;
}

.preview-sound-button {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--bg-light, #f5f5f5);
  border: 1px solid var(--border-color, #eeeeee);
  border-radius: var(--border-radius, 8px);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.preview-sound-button:hover:not(:disabled) {
  background-color: var(--bg-hover, #e9e9e9);
}

.preview-sound-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid var(--border-color, #eeeeee);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-button,
.save-button {
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius, 8px);
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.cancel-button {
  background-color: var(--bg-light, #f5f5f5);
  color: var(--text-primary, #333333);
  border: 1px solid var(--border-color, #eeeeee);
}

.save-button {
  background-color: var(--primary-color, #2196F3);
  color: white;
  border: none;
}

.cancel-button:hover {
  background-color: var(--bg-hover, #e9e9e9);
}

.save-button:hover {
  background-color: var(--primary-dark, #1976D2);
}

.save-button:disabled {
  background-color: var(--inactive-bg, #cccccc);
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .reminder-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .reminder-time {
    justify-content: space-between;
    width: 100%;
  }
  
  .reminder-message {
    margin: 0.5rem 0;
    width: 100%;
  }
  
  .reminder-actions {
    align-self: flex-end;
  }
}
</style> 