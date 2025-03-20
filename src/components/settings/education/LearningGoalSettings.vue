<template>
  <div class="learning-goals-settings">
    <div class="section-title">{{ $t('education.learningGoals') || '学习目标设置' }}</div>
    
    <div class="goals-list" v-if="learningGoals.length > 0">
      <div 
        v-for="(goal, index) in learningGoals" 
        :key="index" 
        class="goal-item"
      >
        <div class="goal-content">
          <div class="goal-header">
            <h3 class="goal-title">{{ goal.title }}</h3>
            <div class="goal-actions">
              <button class="edit-button" @click="editGoal(index)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="delete-button" @click="removeGoal(index)">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
          <p class="goal-description">{{ goal.description }}</p>
          <div class="goal-meta">
            <span class="goal-duration">
              <i class="fas fa-clock"></i> {{ formatDuration(goal.duration) }}
            </span>
            <span class="goal-subject" v-if="goal.subject">
              <i class="fas fa-book"></i> {{ goal.subject }}
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="empty-goals" v-else>
      <div class="empty-icon">
        <i class="fas fa-tasks"></i>
      </div>
      <p class="empty-text">{{ $t('education.noGoalsYet') || '暂无学习目标' }}</p>
    </div>
    
    <button class="add-goal-button" @click="showAddGoalModal = true">
      <i class="fas fa-plus"></i>
      {{ $t('education.addGoal') || '添加学习目标' }}
    </button>
    
    <!-- 添加/编辑目标模态框 -->
    <div class="modal-overlay" v-if="showAddGoalModal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">
            {{ isEditing ? ($t('education.editGoal') || '编辑学习目标') : ($t('education.addGoal') || '添加学习目标') }}
          </h2>
          <button class="close-button" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label for="goal-title">{{ $t('education.goalTitle') || '目标标题' }} *</label>
            <input 
              type="text" 
              id="goal-title" 
              v-model="currentGoal.title" 
              :placeholder="$t('education.enterTitle') || '输入目标标题'"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="goal-description">{{ $t('education.goalDescription') || '目标描述' }}</label>
            <textarea 
              id="goal-description" 
              v-model="currentGoal.description" 
              :placeholder="$t('education.enterDescription') || '输入目标描述'"
              rows="3"
            ></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group half">
              <label for="goal-duration">{{ $t('education.duration') || '持续时间(分钟)' }} *</label>
              <input 
                type="number" 
                id="goal-duration" 
                v-model="currentGoal.duration" 
                min="1" 
                max="120"
                required
              />
            </div>
            
            <div class="form-group half">
              <label for="goal-subject">{{ $t('education.subject') || '学科' }}</label>
              <input 
                type="text" 
                id="goal-subject" 
                v-model="currentGoal.subject" 
                :placeholder="$t('education.enterSubject') || '输入学科'"
              />
            </div>
          </div>
          
          <div class="form-group">
            <label for="goal-timer-type">{{ $t('education.timerType') || '计时器类型' }}</label>
            <select id="goal-timer-type" v-model="currentGoal.timerType">
              <option value="">{{ $t('education.selectTimer') || '选择计时器' }}</option>
              <option value="egg">{{ $t('timers.egg') }}</option>
              <option value="clock">{{ $t('timers.clock') }}</option>
              <option value="candle">{{ $t('timers.candle') }}</option>
              <option value="snail">{{ $t('timers.snail') }}</option>
              <option value="duck">{{ $t('timers.duck') }}</option>
              <option value="puppy">{{ $t('timers.puppy') }}</option>
              <option value="rocket">{{ $t('timers.rocket') }}</option>
              <option value="running">{{ $t('timers.running') }}</option>
            </select>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="cancel-button" @click="closeModal">
            {{ $t('common.cancel') }}
          </button>
          <button 
            class="save-button" 
            @click="saveGoal" 
            :disabled="!isGoalValid"
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

// 学习目标列表
const learningGoals = ref([]);

// 当前编辑的目标
const currentGoal = ref({
  title: '',
  description: '',
  duration: 5,
  subject: '',
  timerType: ''
});

// 状态控制
const showAddGoalModal = ref(false);
const isEditing = ref(false);
const editingIndex = ref(-1);

// 检查目标是否有效
const isGoalValid = computed(() => {
  return (
    currentGoal.value.title.trim() !== '' && 
    currentGoal.value.duration > 0
  );
});

// 格式化持续时间
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

// 添加新目标
const saveGoal = () => {
  if (!isGoalValid.value) return;
  
  const goalToSave = { ...currentGoal.value };
  
  if (isEditing.value) {
    // 更新现有目标
    learningGoals.value[editingIndex.value] = goalToSave;
  } else {
    // 添加新目标
    learningGoals.value.push(goalToSave);
  }
  
  // 保存到本地存储
  localStorage.setItem('learningGoals', JSON.stringify(learningGoals.value));
  
  // 关闭模态框并重置表单
  closeModal();
};

// 编辑目标
const editGoal = (index) => {
  isEditing.value = true;
  editingIndex.value = index;
  currentGoal.value = { ...learningGoals.value[index] };
  showAddGoalModal.value = true;
};

// 删除目标
const removeGoal = (index) => {
  if (confirm(t('education.confirmDeleteGoal') || '确定要删除此学习目标吗？')) {
    learningGoals.value.splice(index, 1);
    localStorage.setItem('learningGoals', JSON.stringify(learningGoals.value));
  }
};

// 关闭模态框
const closeModal = () => {
  showAddGoalModal.value = false;
  isEditing.value = false;
  editingIndex.value = -1;
  // 重置表单
  currentGoal.value = {
    title: '',
    description: '',
    duration: 5,
    subject: '',
    timerType: ''
  };
};

// 从本地存储加载学习目标
onMounted(() => {
  const savedGoals = localStorage.getItem('learningGoals');
  if (savedGoals) {
    learningGoals.value = JSON.parse(savedGoals);
  }
});
</script>

<style scoped>
.learning-goals-settings {
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

.goals-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.goal-item {
  background-color: var(--bg-light, #f5f5f5);
  border-radius: var(--border-radius, 8px);
  padding: 1rem;
  border-left: 4px solid var(--primary-color, #2196F3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.goal-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.goal-title {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-primary, #333333);
}

.goal-actions {
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

.goal-description {
  margin: 0.5rem 0;
  color: var(--text-secondary, #666666);
  font-size: 0.9rem;
}

.goal-meta {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.goal-duration,
.goal-subject {
  font-size: 0.8rem;
  color: var(--text-tertiary, #888888);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.empty-goals {
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

.add-goal-button {
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

.add-goal-button:hover {
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
  margin-bottom: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group.half {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-primary, #333333);
}

input[type="text"],
input[type="number"],
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
  .form-row {
    flex-direction: column;
    gap: 1rem;
  }
}
</style> 