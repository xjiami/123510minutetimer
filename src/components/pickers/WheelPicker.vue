<template>
  <div class="wheel-picker">
    <div class="wheel-container">
      <div 
        class="wheel" 
        :style="{ transform: `rotate(${rotation}deg)` }"
        :class="{ 'wheel-spinning': isSpinning }"
      >
        <div 
          v-for="(name, index) in names" 
          :key="index"
          class="wheel-segment"
          :style="getSegmentStyle(index)"
        >
          <div 
            class="segment-content"
            :style="getSegmentContentStyle(index)"
          >
            {{ name }}
          </div>
        </div>
      </div>
      <div class="wheel-pointer"></div>
    </div>
    
    <div class="wheel-controls">
      <button 
        class="btn btn-large" 
        @click="spin"
        :disabled="isSpinning || names.length < 2"
      >
        {{ $t('pickers.startSpinning') }}
      </button>
    </div>
    
    <div v-if="result" class="wheel-result">
      <h3>{{ $t('pickers.result') }}</h3>
      <div class="result-content">{{ result }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  names: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['pick']);

const rotation = ref(0);
const isSpinning = ref(false);
const result = ref('');

// 计算每个扇形的角度
const segmentAngle = computed(() => {
  return 360 / props.names.length;
});

// 获取扇形样式
const getSegmentStyle = (index) => {
  const angle = segmentAngle.value;
  const rotation = index * angle;
  const skew = 90 - angle;
  
  return {
    transform: `rotate(${rotation}deg) skew(${skew}deg)`,
    backgroundColor: getSegmentColor(index)
  };
};

// 获取扇形内容样式
const getSegmentContentStyle = (index) => {
  const angle = segmentAngle.value;
  const skew = angle - 90;
  const rotation = angle / 2;
  
  return {
    transform: `skew(${skew}deg) rotate(${rotation}deg)`
  };
};

// 获取扇形颜色
const getSegmentColor = (index) => {
  const colors = [
    '#4A90E2', // 蓝色
    '#7ED321', // 绿色
    '#F8E71C', // 黄色
    '#FF85C0', // 粉色
    '#BD10E0', // 紫色
    '#50E3C2', // 青色
    '#FF9500', // 橙色
    '#D0021B'  // 红色
  ];
  
  return colors[index % colors.length];
};

// 旋转轮盘
const spin = () => {
  if (isSpinning.value || props.names.length < 2) return;
  
  isSpinning.value = true;
  result.value = '';
  
  // 随机旋转角度（至少720度，最多1440度）
  const baseRotation = rotation.value % 360;
  const randomRotation = 720 + Math.random() * 720;
  const targetRotation = baseRotation + randomRotation;
  
  // 设置旋转角度
  rotation.value = targetRotation;
  
  // 旋转结束后计算结果
  setTimeout(() => {
    calculateResult();
    isSpinning.value = false;
  }, 5000);
};

// 计算结果
const calculateResult = () => {
  // 计算指针指向的扇形
  const normalizedRotation = 360 - (rotation.value % 360);
  const segmentIndex = Math.floor(normalizedRotation / segmentAngle.value) % props.names.length;
  
  // 设置结果
  result.value = props.names[segmentIndex];
  
  // 发送结果
  emit('pick', result.value);
};
</script>

<style scoped>
.wheel-picker {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.wheel-container {
  position: relative;
  width: 300px;
  height: 300px;
}

.wheel {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  transition: transform 5s cubic-bezier(0.25, 0.1, 0.25, 1);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.wheel-spinning {
  transition: transform 5s cubic-bezier(0.17, 0.67, 0.83, 0.67);
}

.wheel-segment {
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 50%;
  transform-origin: 0% 100%;
  overflow: hidden;
}

.segment-content {
  position: absolute;
  left: -100%;
  width: 200%;
  height: 200%;
  transform-origin: 100% 0%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 20px;
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.wheel-pointer {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 30px solid var(--primary-color);
  z-index: 10;
}

.wheel-controls {
  display: flex;
  justify-content: center;
}

.wheel-result {
  text-align: center;
}

.result-content {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-top: 0.5rem;
  padding: 1rem;
  background-color: var(--light-gray);
  border-radius: var(--border-radius-medium);
}
</style> 