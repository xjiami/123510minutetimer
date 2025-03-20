<template>
  <div class="multi-task-manager">
    <div class="task-header">
      <h2 class="task-title">{{ $t('multitask.title') || '多任务计时' }}</h2>
      <div class="task-actions">
        <button 
          class="add-task-button" 
          @click="showAddTaskModal = true"
          v-tooltip="$t('multitask.addTask') || '添加任务'"
        >
          <i class="fas fa-plus"></i>
        </button>
      </div>
    </div>
    
    <div class="task-list" v-if="tasks.length > 0">
      <div 
        v-for="(task, index) in tasks" 
        :key="task.id" 
        class="task-item"
        :class="{ 
          'task-running': task.status === 'running',
          'task-paused': task.status === 'paused',
          'task-finished': task.status === 'finished'
        }"
      >
        <div class="task-content">
          <div class="task-info">
            <div class="task-icon">
              <i :class="getTimerIcon(task.timerType)"></i>
            </div>
            <div class="task-details">
              <h3 class="task-name">{{ task.name }}</h3>
              <div class="task-meta">
                <span class="timer-type">{{ getTimerName(task.timerType) }}</span>
                <span class="task-time">{{ formatTime(task.remainingSeconds) }}</span>
              </div>
            </div>
          </div>
          
          <div class="task-progress">
            <div 
              class="progress-bar" 
              :style="{ width: `${calculateProgress(task)}%` }"
            ></div>
          </div>
          
          <div class="task-controls">
            <button 
              v-if="task.status !== 'running'" 
              class="task-start" 
              @click="startTask(index)"
              :disabled="task.status === 'finished'"
              v-tooltip="$t('common.start')"
            >
              <i class="fas fa-play"></i>
            </button>
            <button 
              v-else 
              class="task-pause" 
              @click="pauseTask(index)"
              v-tooltip="$t('common.pause')"
            >
              <i class="fas fa-pause"></i>
            </button>
            <button 
              class="task-reset" 
              @click="resetTask(index)"
              v-tooltip="$t('common.reset')"
            >
              <i class="fas fa-sync-alt"></i>
            </button>
            <button 
              class="task-delete" 
              @click="removeTask(index)"
              v-tooltip="$t('multitask.removeTask') || '移除任务'"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        
        <div class="task-status-badge" v-if="task.status === 'finished'">
          {{ $t('common.finished') }}
        </div>
      </div>
    </div>
    
    <div class="empty-tasks" v-else>
      <div class="empty-icon">
        <i class="fas fa-tasks"></i>
      </div>
      <p class="empty-text">{{ $t('multitask.noTasks') || '暂无任务' }}</p>
      <button class="add-first-task" @click="showAddTaskModal = true">
        <i class="fas fa-plus"></i>
        {{ $t('multitask.addFirstTask') || '添加第一个任务' }}
      </button>
    </div>
    
    <!-- 添加任务模态框 -->
    <div class="modal-overlay" v-if="showAddTaskModal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">
            {{ $t('multitask.addTask') || '添加计时任务' }}
          </h2>
          <button class="close-button" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label for="task-name">{{ $t('multitask.taskName') || '任务名称' }} *</label>
            <input 
              type="text" 
              id="task-name" 
              v-model="newTask.name" 
              :placeholder="$t('multitask.enterTaskName') || '输入任务名称'"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="timer-type">{{ $t('multitask.timerType') || '计时器类型' }} *</label>
            <select id="timer-type" v-model="newTask.timerType" required>
              <option value="">{{ $t('multitask.selectTimer') || '选择计时器' }}</option>
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
          
          <div class="form-group time-input-group">
            <label>{{ $t('multitask.duration') || '持续时间' }} *</label>
            <div class="time-inputs">
              <div class="time-field">
                <input 
                  type="number" 
                  v-model="newTask.minutes" 
                  min="0" 
                  max="60"
                  required
                />
                <span>{{ $t('common.minutes') }}</span>
              </div>
              <div class="time-separator">:</div>
              <div class="time-field">
                <input 
                  type="number" 
                  v-model="newTask.seconds" 
                  min="0" 
                  max="59"
                  required
                />
                <span>{{ $t('common.seconds') }}</span>
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="task-goal">{{ $t('multitask.learningGoal') || '学习目标' }}</label>
            <select id="task-goal" v-model="newTask.goalId">
              <option value="">{{ $t('education.noGoal') || '无' }}</option>
              <option 
                v-for="goal in learningGoals" 
                :key="goal.id" 
                :value="goal.id"
              >
                {{ goal.title }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="cancel-button" @click="closeModal">
            {{ $t('common.cancel') }}
          </button>
          <button 
            class="save-button" 
            @click="addTask" 
            :disabled="!isTaskValid"
          >
            {{ $t('common.add') || '添加' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// 任务列表
const tasks = ref([]);

// 新任务对象
const newTask = ref({
  name: '',
  timerType: '',
  minutes: 5,
  seconds: 0,
  goalId: '',
  status: 'paused',
  remainingSeconds: 0,
  totalSeconds: 0,
  id: ''
});

// 学习目标
const learningGoals = ref([]);

// 状态控制
const showAddTaskModal = ref(false);
const taskIntervals = ref({});

// 检查新任务是否有效
const isTaskValid = computed(() => {
  return (
    newTask.value.name.trim() !== '' && 
    newTask.value.timerType !== '' &&
    (newTask.value.minutes > 0 || newTask.value.seconds > 0)
  );
});

// 获取计时器图标
const getTimerIcon = (timerType) => {
  const icons = {
    egg: 'fas fa-egg',
    clock: 'fas fa-clock',
    candle: 'fas fa-fire',
    snail: 'fas fa-bug',
    duck: 'fas fa-feather',
    puppy: 'fas fa-dog',
    rocket: 'fas fa-rocket',
    running: 'fas fa-running'
  };
  
  return icons[timerType] || 'fas fa-hourglass';
};

// 获取计时器名称
const getTimerName = (timerType) => {
  return t(`timers.${timerType}`) || timerType;
};

// 格式化时间显示
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// 计算进度百分比
const calculateProgress = (task) => {
  if (task.totalSeconds === 0) return 0;
  return 100 - ((task.remainingSeconds / task.totalSeconds) * 100);
};

// 添加新任务
const addTask = () => {
  if (!isTaskValid.value) return;
  
  const totalSeconds = (newTask.value.minutes * 60) + parseInt(newTask.value.seconds);
  
  const taskToAdd = {
    ...newTask.value,
    id: Date.now().toString(),
    remainingSeconds: totalSeconds,
    totalSeconds: totalSeconds,
    status: 'paused'
  };
  
  tasks.value.push(taskToAdd);
  saveTasks();
  closeModal();
};

// 开始任务
const startTask = (index) => {
  const task = tasks.value[index];
  
  if (task.status === 'finished') {
    resetTask(index);
  }
  
  task.status = 'running';
  saveTasks();
  
  // 清除可能存在的旧定时器
  if (taskIntervals.value[task.id]) {
    clearInterval(taskIntervals.value[task.id]);
  }
  
  // 设置新定时器
  taskIntervals.value[task.id] = setInterval(() => {
    if (task.remainingSeconds > 0) {
      task.remainingSeconds--;
      saveTasks();
    } else {
      finishTask(index);
    }
  }, 1000);
};

// 暂停任务
const pauseTask = (index) => {
  const task = tasks.value[index];
  task.status = 'paused';
  
  if (taskIntervals.value[task.id]) {
    clearInterval(taskIntervals.value[task.id]);
  }
  
  saveTasks();
};

// 重置任务
const resetTask = (index) => {
  const task = tasks.value[index];
  
  // 停止任务
  if (task.status === 'running') {
    pauseTask(index);
  }
  
  task.remainingSeconds = task.totalSeconds;
  task.status = 'paused';
  saveTasks();
};

// 完成任务
const finishTask = (index) => {
  const task = tasks.value[index];
  
  // 清除定时器
  if (taskIntervals.value[task.id]) {
    clearInterval(taskIntervals.value[task.id]);
  }
  
  task.status = 'finished';
  task.remainingSeconds = 0;
  
  // 播放完成声音
  playTaskFinishSound();
  
  saveTasks();
};

// 移除任务
const removeTask = (index) => {
  if (confirm(t('multitask.confirmRemoveTask') || '确定要移除此任务吗？')) {
    const task = tasks.value[index];
    
    // 清除定时器
    if (taskIntervals.value[task.id]) {
      clearInterval(taskIntervals.value[task.id]);
      delete taskIntervals.value[task.id];
    }
    
    tasks.value.splice(index, 1);
    saveTasks();
  }
};

// 播放任务完成声音
const playTaskFinishSound = () => {
  const audio = new Audio('/sounds/task-complete.mp3');
  audio.play().catch(error => {
    console.error('Failed to play sound:', error);
  });
};

// 保存任务到本地存储
const saveTasks = () => {
  // 保存不包含定时器的任务数据
  const tasksToSave = tasks.value.map(task => ({
    id: task.id,
    name: task.name,
    timerType: task.timerType,
    minutes: task.minutes,
    seconds: task.seconds,
    goalId: task.goalId,
    status: task.status,
    remainingSeconds: task.remainingSeconds,
    totalSeconds: task.totalSeconds
  }));
  
  localStorage.setItem('multiTasks', JSON.stringify(tasksToSave));
};

// 关闭模态框
const closeModal = () => {
  showAddTaskModal.value = false;
  
  // 重置表单
  newTask.value = {
    name: '',
    timerType: '',
    minutes: 5,
    seconds: 0,
    goalId: '',
    status: 'paused',
    remainingSeconds: 0,
    totalSeconds: 0,
    id: ''
  };
};

// 从本地存储加载任务和学习目标
onMounted(() => {
  // 加载任务
  const savedTasks = localStorage.getItem('multiTasks');
  if (savedTasks) {
    tasks.value = JSON.parse(savedTasks);
    
    // 恢复运行中的任务
    tasks.value.forEach((task, index) => {
      if (task.status === 'running') {
        startTask(index);
      }
    });
  }
  
  // 加载学习目标
  const savedGoals = localStorage.getItem('learningGoals');
  if (savedGoals) {
    const parsedGoals = JSON.parse(savedGoals);
    learningGoals.value = parsedGoals.map((goal, index) => ({
      ...goal,
      id: goal.id || `goal-${index}`
    }));
  }
});

// 组件销毁前清除所有定时器
onBeforeUnmount(() => {
  Object.values(taskIntervals.value).forEach(interval => {
    clearInterval(interval);
  });
});
</script>

<style scoped>
.multi-task-manager {
  padding: 1rem;
  background-color: var(--card-bg, #ffffff);
  border-radius: var(--border-radius, 8px);
  box-shadow: var(--box-shadow, 0 2px 10px rgba(0, 0, 0, 0.1));
  margin-bottom: 2rem;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.task-title {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-primary, #333333);
}

.add-task-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--primary-color, #2196F3);
  color: white;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-task-button:hover {
  background-color: var(--primary-dark, #1976D2);
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-item {
  background-color: var(--bg-light, #f5f5f5);
  border-radius: var(--border-radius, 8px);
  padding: 1rem;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
}

.task-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.task-running {
  border-left: 4px solid var(--success-color, #4CAF50);
}

.task-paused {
  border-left: 4px solid var(--warning-color, #FF9800);
}

.task-finished {
  border-left: 4px solid var(--primary-color, #2196F3);
  opacity: 0.8;
}

.task-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.task-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-light, #E3F2FD);
  color: var(--primary-color, #2196F3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.task-details {
  flex-grow: 1;
}

.task-name {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  color: var(--text-primary, #333333);
}

.task-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--text-secondary, #666666);
}

.task-progress {
  height: 8px;
  background-color: var(--inactive-bg, #CCCCCC);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: var(--primary-color, #2196F3);
  transition: width 0.3s ease;
}

.task-running .progress-bar {
  background-color: var(--success-color, #4CAF50);
}

.task-finished .progress-bar {
  background-color: var(--primary-dark, #1976D2);
}

.task-controls {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.task-start,
.task-pause,
.task-reset,
.task-delete {
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

.task-start {
  color: var(--success-color, #4CAF50);
}

.task-pause {
  color: var(--warning-color, #FF9800);
}

.task-reset {
  color: var(--primary-color, #2196F3);
}

.task-delete {
  color: var(--danger-color, #F44336);
}

.task-start:hover,
.task-pause:hover,
.task-reset:hover,
.task-delete:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.task-start:disabled,
.task-pause:disabled,
.task-reset:disabled,
.task-delete:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.task-status-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.25rem 0.5rem;
  background-color: var(--success-color, #4CAF50);
  color: white;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.empty-tasks {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: var(--bg-light, #f5f5f5);
  border-radius: var(--border-radius, 8px);
}

.empty-icon {
  font-size: 2.5rem;
  color: var(--inactive-color, #CCCCCC);
  margin-bottom: 1rem;
}

.empty-text {
  color: var(--text-secondary, #666666);
  text-align: center;
  margin-bottom: 1.5rem;
}

.add-first-task {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color, #2196F3);
  color: white;
  border: none;
  border-radius: var(--border-radius, 8px);
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-first-task:hover {
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

.time-input-group {
  margin-bottom: 1.5rem;
}

.time-inputs {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.time-field {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.time-field input {
  width: 70px;
  padding: 0.75rem;
  border: 1px solid var(--border-color, #eeeeee);
  border-radius: var(--border-radius, 8px);
  background-color: var(--input-bg, #ffffff);
  color: var(--text-primary, #333333);
  font-size: 1rem;
}

.time-separator {
  font-size: 1.5rem;
  color: var(--text-secondary, #666666);
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-primary, #333333);
}

input[type="text"],
select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color, #eeeeee);
  border-radius: var(--border-radius, 8px);
  background-color: var(--input-bg, #ffffff);
  color: var(--text-primary, #333333);
  font-size: 1rem;
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
  .task-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .task-icon {
    margin-bottom: 0.5rem;
  }
  
  .time-inputs {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .time-separator {
    display: none;
  }
}
</style> 