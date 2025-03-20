<template>
  <div class="puppy-container" :class="stateClasses" :style="positionStyle">
    <div class="puppy" :class="[`puppy-${color}`, stateClasses]">
      <!-- 小狗主体 -->
      <div class="puppy-shadow"></div>
      <div class="puppy-body"></div>
      <div class="puppy-head"></div>
      <div class="puppy-leg leg1"></div>
      <div class="puppy-leg leg2"></div>
      <div class="puppy-leg leg3"></div>
      <div class="puppy-leg leg4"></div>
      <div class="puppy-ear ear1"></div>
      <div class="puppy-ear ear2"></div>
      <div class="puppy-tail"></div>
      <div class="puppy-face">
        <div class="puppy-eye eye1"></div>
        <div class="puppy-eye eye2"></div>
        <div class="puppy-snout"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'

// 定义属性
const props = defineProps<{
  color: 'brown' | 'white' | 'black' | 'spotted'
  position: number
  state: 'idle' | 'running' | 'finished'
}>()

// 计算位置样式
const positionStyle = computed(() => {
  return {
    left: `${props.position}%`
  }
})

// 计算状态类名
const stateClasses = computed(() => {
  return {
    'running': props.state === 'running',
    'finished': props.state === 'finished',
    'idle': props.state === 'idle'
  }
})
</script>

<style scoped>
/* 小狗容器样式 */
.puppy-container {
  position: absolute;
  width: 60px;
  height: 60px;
  z-index: 120;
  transform-style: preserve-3d;
}

/* 小狗基本样式 */
.puppy {
  position: absolute;
  width: 48px; /* 增大尺寸 (原32px) */
  height: 36px; /* 增大尺寸 (原24px) */
  transform-style: preserve-3d;
  transform-origin: center bottom;
  transition: transform 0.3s ease;
  z-index: 100;
}

/* 小狗阴影 */
.puppy-shadow {
  position: absolute;
  width: 30px;
  height: 6px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  bottom: -4px;
  left: 7px;
  z-index: 1;
  filter: blur(2px);
  transform: rotateX(60deg); /* 旋转阴影增强3D感 */
}

/* 基础方块 */
.puppy-body, .puppy-head, .puppy-leg, .puppy-ear, .puppy-snout, .puppy-tail {
  position: absolute;
  background-color: #FFF;
  border: 1px solid #000; /* 保持细边框 */
  box-sizing: border-box;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.3); /* 增强阴影 */
  transform-style: preserve-3d; /* 3D空间 */
}

/* 身体 */
.puppy-body {
  width: 20px;
  height: 15px;
  bottom: 8px;
  left: 9px;
  z-index: 2;
  border-radius: 3px 3px 0 0; /* 增强圆角 */
  transform: translateZ(2px); /* Z轴位移，增强立体感 */
}

/* 头部 */
.puppy-head {
  width: 18px;
  height: 18px;
  bottom: 12px;
  left: 22px;
  z-index: 3;
  border-radius: 4px; /* 增强圆角 */
  transform: translateZ(3px); /* Z轴位移，增强立体感 */
}

/* 四肢 */
.puppy-leg {
  width: 4px;
  height: 8px;
  bottom: 0;
  z-index: 2;
}

.leg1 {
  left: 10px;
  transform: translateZ(1px) rotateX(-5deg); /* Z轴位移+旋转，增强立体感 */
}

.leg2 {
  left: 15px;
  transform: translateZ(1.5px) rotateX(-5deg);
}

.leg3 {
  left: 20px;
  transform: translateZ(1px) rotateX(-5deg);
}

.leg4 {
  left: 25px;
  transform: translateZ(1.5px) rotateX(-5deg);
}

/* 耳朵 */
.puppy-ear {
  width: 5px;
  height: 8px;
  z-index: 2;
  border-radius: 2px 2px 0 0; /* 增强圆角 */
}

.ear1 {
  bottom: 25px;
  left: 24px;
  transform: translateZ(4px) rotateZ(-15deg) rotateY(-10deg); /* 多方向旋转，增强立体感 */
}

.ear2 {
  bottom: 25px;
  left: 32px;
  transform: translateZ(4px) rotateZ(15deg) rotateY(10deg);
}

/* 尾巴 */
.puppy-tail {
  width: 9px;
  height: 4px;
  bottom: 13px;
  left: 2px;
  z-index: 2;
  transform-origin: right center;
  border-radius: 4px 0 0 4px; /* 增强圆角 */
  transform: translateZ(2px) rotateZ(-5deg); /* Z轴位移+旋转，增强立体感 */
}

/* 面部 */
.puppy-face {
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: 0;
  left: 0;
  z-index: 4;
  pointer-events: none;
  transform-style: preserve-3d;
}

.puppy-eye {
  position: absolute;
  width: 3px;
  height: 3px;
  background-color: #000;
  bottom: 18px;
  border-radius: 50%; /* 圆形眼睛 */
  transform: translateZ(5px); /* 确保眼睛位于最上层 */
}

.eye1 {
  left: 26px;
}

.eye2 {
  left: 32px;
}

.puppy-snout {
  position: absolute;
  width: 8px;
  height: 5px;
  background-color: #000;
  bottom: 13px;
  left: 30px;
  z-index: 5;
  border-radius: 4px; /* 增强圆角 */
  transform: translateZ(5px); /* 确保鼻子位于最上层 */
}

/* 颜色变体 - 为每种颜色增加层次感 */
.puppy-brown .puppy-body,
.puppy-brown .puppy-head,
.puppy-brown .puppy-leg,
.puppy-brown .puppy-ear,
.puppy-brown .puppy-tail {
  background-color: #A67C52;
  border-color: #8B5A2B;
  /* 渐变增加立体感 */
  background-image: linear-gradient(to bottom, #B68E62, #A67C52);
}

.puppy-brown .puppy-snout {
  background-color: #8B5A2B;
  background-image: linear-gradient(to bottom, #9B6A3B, #8B5A2B);
}

.puppy-white .puppy-body,
.puppy-white .puppy-head,
.puppy-white .puppy-leg,
.puppy-white .puppy-ear,
.puppy-white .puppy-tail {
  background-color: #F4F4F4;
  border-color: #CCCCCC;
  /* 渐变增加立体感 */
  background-image: linear-gradient(to bottom, #FFFFFF, #F4F4F4);
}

.puppy-white .puppy-snout {
  background-color: #666;
  background-image: linear-gradient(to bottom, #777, #666);
}

.puppy-black .puppy-body,
.puppy-black .puppy-head,
.puppy-black .puppy-leg,
.puppy-black .puppy-ear,
.puppy-black .puppy-tail {
  background-color: #333;
  border-color: #000;
  box-shadow: 1px 1px 0 rgba(255, 255, 255, 0.2); /* 亮色阴影 */
  /* 渐变增加立体感 */
  background-image: linear-gradient(to bottom, #444, #333);
}

.puppy-black .puppy-snout {
  background-color: #222;
  background-image: linear-gradient(to bottom, #333, #222);
}

.puppy-black .puppy-eye {
  background-color: #FFF;
  box-shadow: 0 0 3px rgba(255, 255, 255, 0.5); /* 发光效果 */
}

/* 斑点小狗 */
.puppy-spotted .puppy-body,
.puppy-spotted .puppy-head,
.puppy-spotted .puppy-leg,
.puppy-spotted .puppy-ear,
.puppy-spotted .puppy-tail {
  background-color: #F4F4F4;
  border-color: #CCCCCC;
  background-image: linear-gradient(to bottom, #FFFFFF, #F4F4F4);
}

.puppy-spotted .puppy-body:after {
  content: '';
  position: absolute;
  width: 9px;
  height: 7px;
  background-color: #A67C52;
  top: 3px;
  left: 6px;
  border: none;
  border-radius: 3px; /* 增强圆角 */
  background-image: linear-gradient(to bottom, #B68E62, #A67C52); /* 斑点渐变 */
  transform: translateZ(0.5px); /* 轻微浮起，增强立体感 */
}

.puppy-spotted .puppy-head:after {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: #A67C52;
  top: 3px;
  left: 4px;
  border: none;
  border-radius: 3px; /* 增强圆角 */
  background-image: linear-gradient(to bottom, #B68E62, #A67C52); /* 斑点渐变 */
  transform: translateZ(0.5px); /* 轻微浮起，增强立体感 */
}

/* 状态动画 */
.puppy-container.running .puppy-leg.leg1 {
  animation: run-leg 0.15s steps(2) infinite;
}

.puppy-container.running .puppy-leg.leg2 {
  animation: run-leg 0.15s steps(2) infinite 0.075s;
}

.puppy-container.running .puppy-leg.leg3 {
  animation: run-leg 0.15s steps(2) infinite 0.0375s;
}

.puppy-container.running .puppy-leg.leg4 {
  animation: run-leg 0.15s steps(2) infinite 0.1125s;
}

.puppy-container.running .puppy-tail {
  animation: wag-tail 0.2s steps(2) infinite;
}

.puppy-container.running .puppy-ear.ear1 {
  animation: flop-ear 0.2s steps(2) infinite;
}

.puppy-container.running .puppy-ear.ear2 {
  animation: flop-ear-right 0.2s steps(2) infinite;
}

/* 完成动画 */
.puppy-container.finished .puppy {
  animation: celebrate 0.4s infinite alternate;
}

.puppy-container.finished .puppy-tail {
  animation: fast-wag 0.15s infinite alternate;
}

@keyframes run-leg {
  0% { height: 6px; }
  50% { height: 4px; }
  100% { height: 6px; }
}

@keyframes wag-tail {
  0% { transform: translateZ(2px) rotateZ(-5deg); }
  50% { transform: translateZ(2px) rotateZ(-25deg); }
  100% { transform: translateZ(2px) rotateZ(-5deg); }
}

@keyframes flop-ear {
  0% { transform: translateZ(4px) rotateZ(-10deg) rotateY(-10deg); }
  50% { transform: translateZ(4px) rotateZ(-25deg) rotateY(-10deg); }
  100% { transform: translateZ(4px) rotateZ(-10deg) rotateY(-10deg); }
}

@keyframes flop-ear-right {
  0% { transform: translateZ(4px) rotateZ(10deg) rotateY(10deg); }
  50% { transform: translateZ(4px) rotateZ(25deg) rotateY(10deg); }
  100% { transform: translateZ(4px) rotateZ(10deg) rotateY(10deg); }
}

@keyframes celebrate {
  0% { transform: translateY(0); }
  100% { transform: translateY(-4px); }
}

@keyframes fast-wag {
  0% { transform: translateZ(2px) rotateZ(-5deg); }
  100% { transform: translateZ(2px) rotateZ(-35deg); }
}
</style> 