<template>
  <div class="minecraft-race-track">
    <div class="minecraft-sky"></div>
    <div class="minecraft-sun"></div>
    <div class="minecraft-clouds">
      <div class="minecraft-cloud cloud-1"></div>
      <div class="minecraft-cloud cloud-2"></div>
      <div class="minecraft-cloud cloud-3"></div>
    </div>
    
    <!-- 添加小鸟到天空中 -->
    <div class="minecraft-birds">
      <div class="minecraft-bird bird-1"></div>
      <div class="minecraft-bird bird-2"></div>
      <div class="minecraft-bird bird-3"></div>
      <div class="minecraft-bird bird-4"></div>
      <div class="minecraft-bird bird-5"></div>
      <div class="minecraft-bird bird-6"></div>
      <div class="minecraft-bird bird-7"></div>
      <div class="minecraft-bird bird-8"></div>
    </div>
    
    <div class="minecraft-ground">
      <div class="minecraft-grass-overlay"></div>
      <div class="minecraft-dirt-blocks"></div>
      <div class="minecraft-start-line"></div>
      <div class="minecraft-finish-line"></div>
      
      <div class="minecraft-track-markers">
        <div class="minecraft-marker" v-for="i in 9" :key="i" 
             :style="{ left: `${i * 10}%` }">{{ i * 10 }}m</div>
      </div>
      
      <div class="minecraft-puppies-container">
        <puppy-component 
          v-for="puppy in puppies.filter(p => p.color === 'brown')" 
          :key="'puppy-brown'"
          :color="puppy.color"
          :position="puppy.position"
          :state="puppy.state"
          :style="{ top: '20px', zIndex: 131 }"
        />
        
        <puppy-component 
          v-for="puppy in puppies.filter(p => p.color === 'white')" 
          :key="'puppy-white'"
          :color="puppy.color"
          :position="puppy.position"
          :state="puppy.state"
          :style="{ top: '65px', zIndex: 132 }"
        />
        
        <puppy-component 
          v-for="puppy in puppies.filter(p => p.color === 'spotted')" 
          :key="'puppy-spotted'"
          :color="puppy.color"
          :position="puppy.position"
          :state="puppy.state"
          :style="{ top: '110px', zIndex: 133 }"
        />
        
        <puppy-component 
          v-for="puppy in puppies.filter(p => p.color === 'black')" 
          :key="'puppy-black'"
          :color="puppy.color"
          :position="puppy.position"
          :state="puppy.state"
          :style="{ top: '155px', zIndex: 134 }"
        />
      </div>
    </div>
    
    <!-- 添加更多树木 -->
    <div class="minecraft-trees">
      <div class="minecraft-tree tree-1"></div>
      <div class="minecraft-tree tree-2"></div>
      <div class="minecraft-tree tree-3"></div>
      <div class="minecraft-tree tree-4"></div>
      <div class="minecraft-tree tree-5"></div>
      <div class="minecraft-tree tree-6"></div>
      <div class="minecraft-tree tree-7"></div>
      <div class="minecraft-tree tree-8"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import PuppyComponent from './PuppyComponent.vue'

// 小狗数据类型
interface Puppy {
  color: 'brown' | 'white' | 'black' | 'spotted'
  position: number
  state: 'idle' | 'running' | 'finished'
  speed: number
}

// 赛跑状态类型
interface RaceState {
  isRunning: boolean
  isFinished: boolean
  winner: string | null
}

const props = defineProps<{
  puppies: Puppy[]
  raceState: RaceState
}>()
</script>

<style scoped>
/* 增强3D像素风格赛道 */
.minecraft-race-track {
  position: relative;
  width: 100%;
  height: 600px;
  margin: 30px 0;
  border: 4px solid #3A3A3A;
  overflow: hidden;
  box-shadow: 0 20px 30px rgba(0, 0, 0, 0.4);
  image-rendering: pixelated;
  transform-style: preserve-3d;
  perspective: 800px;
  transform: rotateX(5deg);
}

/* 我的世界风格天空，带深度 */
.minecraft-sky {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60%;
  background: #7DAFFF;
  border-bottom: 2px solid #6D9FEF;
  z-index: 1;
  transform-style: preserve-3d;
  transform: translateZ(-50px);
  /* 像素化模式的天空纹理 */
  background-image: 
    linear-gradient(90deg, 
    rgba(255, 255, 255, 0.03) 1px, 
    transparent 1px),
    linear-gradient(0deg, 
    rgba(255, 255, 255, 0.03) 1px, 
    transparent 1px);
  background-size: 16px 16px;
}

/* 像素化太阳，带3D光芒 */
.minecraft-sun {
  position: absolute;
  top: 30px;
  right: 80px;
  width: 40px;
  height: 40px;
  background-color: #FFFF00;
  box-shadow: 
    5px 5px 0 0 #FFFF00,
    -5px 5px 0 0 #FFFF00,
    5px -5px 0 0 #FFFF00,
    -5px -5px 0 0 #FFFF00,
    10px 0 0 0 #FFFF00,
    -10px 0 0 0 #FFFF00,
    0 10px 0 0 #FFFF00,
    0 -10px 0 0 #FFFF00;
  z-index: 2;
  transform: translateZ(-30px);
  animation: minecraft-sun-glow 3s infinite alternate;
}

@keyframes minecraft-sun-glow {
  0% { box-shadow: 
    5px 5px 0 0 #FFFF00,
    -5px 5px 0 0 #FFFF00,
    5px -5px 0 0 #FFFF00,
    -5px -5px 0 0 #FFFF00,
    10px 0 0 0 #FFFF00,
    -10px 0 0 0 #FFFF00,
    0 10px 0 0 #FFFF00,
    0 -10px 0 0 #FFFF00; }
  100% { box-shadow: 
    5px 5px 0 0 #FFFF00,
    -5px 5px 0 0 #FFFF00,
    5px -5px 0 0 #FFFF00,
    -5px -5px 0 0 #FFFF00,
    12px 0 0 0 #FFFF00,
    -12px 0 0 0 #FFFF00,
    0 12px 0 0 #FFFF00,
    0 -12px 0 0 #FFFF00,
    0 0 20px 10px rgba(255, 255, 0, 0.3); }
}

/* 像素云朵 */
.minecraft-clouds {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60%;
  z-index: 2;
  transform-style: preserve-3d;
}

.minecraft-cloud {
  position: absolute;
  background-color: white;
  width: 64px;
  height: 16px;
  transform-style: preserve-3d;
}

.minecraft-cloud.cloud-1 {
  top: 50px;
  left: 100px;
  transform: translateZ(-40px);
  animation: cloud-drift-1 60s linear infinite;
}

.minecraft-cloud.cloud-2 {
  top: 90px;
  left: 300px;
  transform: translateZ(-40px);
  animation: cloud-drift-2 80s linear infinite;
}

.minecraft-cloud.cloud-3 {
  top: 40px;
  left: 500px;
  transform: translateZ(-45px);
  animation: cloud-drift-3 70s linear infinite;
}

.minecraft-cloud::before,
.minecraft-cloud::after {
  content: '';
  position: absolute;
  background-color: white;
  width: 32px;
  height: 24px;
}

.minecraft-cloud::before {
  top: -8px;
  left: 8px;
}

.minecraft-cloud::after {
  top: -16px;
  left: 24px;
  width: 24px;
  height: 16px;
}

@keyframes cloud-drift-1 {
  0% { transform: translateZ(-40px) translateX(0); }
  100% { transform: translateZ(-40px) translateX(calc(100vw + 100px)); }
}

@keyframes cloud-drift-2 {
  0% { transform: translateZ(-40px) translateX(-100px); }
  100% { transform: translateZ(-40px) translateX(calc(100vw)); }
}

@keyframes cloud-drift-3 {
  0% { transform: translateZ(-45px) translateX(-300px); }
  100% { transform: translateZ(-45px) translateX(calc(100vw + 200px)); }
}

/* 增强3D地面 */
.minecraft-ground {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  z-index: 3;
  transform-style: preserve-3d;
  transform: rotateX(5deg) translateZ(0);
}

/* 草方块层 */
.minecraft-grass-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 90%;
  background-color: #5AC54F;
  /* 增加草地纹理 */
  background-image: 
    linear-gradient(90deg, 
    rgba(0, 0, 0, 0.1) 1px, 
    transparent 1px),
    linear-gradient(0deg, 
    rgba(0, 0, 0, 0.1) 1px, 
    transparent 1px);
  background-size: 16px 16px;
  z-index: 3;
}

/* 泥土方块层 */
.minecraft-dirt-blocks {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20%;
  background-color: #8B6914;
  /* 增加泥土纹理 */
  background-image: 
    linear-gradient(90deg, 
    rgba(0, 0, 0, 0.15) 1px, 
    transparent 1px),
    linear-gradient(0deg, 
    rgba(0, 0, 0, 0.15) 1px, 
    transparent 1px);
  background-size: 16px 16px;
  z-index: 3;
}

/* 起点线和终点线 - 增强3D感并区分颜色和宽度 */
.minecraft-start-line {
  position: absolute;
  top: 0;
  left: 5%;
  width: 6px; /* 增加宽度 */
  height: 100%;
  background: repeating-linear-gradient(
    to bottom,
    #FFFFFF, /* 白色 */
    #FFFFFF 8px,
    #32CD32, /* 绿色 */
    #32CD32 16px
  );
  z-index: 4;
  transform-style: preserve-3d;
  transform: translateZ(2px);
  box-shadow: 0 0 8px rgba(50, 205, 50, 0.7); /* 绿色光晕 */
}

.minecraft-finish-line {
  position: absolute;
  top: 0;
  right: 5%;
  width: 8px; /* 比起点线更宽 */
  height: 100%;
  background: repeating-linear-gradient(
    to bottom,
    #FFFFFF, /* 白色 */
    #FFFFFF 8px,
    #FF4500, /* 红色 */
    #FF4500 16px
  );
  z-index: 4;
  transform-style: preserve-3d;
  transform: translateZ(3px); /* 更突出 */
  box-shadow: 0 0 12px rgba(255, 69, 0, 0.7); /* 红色光晕 */
}

/* 赛道标记 - 增强3D感 */
.minecraft-track-markers {
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 100%;
  height: 20px;
  z-index: 5;
  transform-style: preserve-3d;
}

.minecraft-marker {
  position: absolute;
  font-family: 'Minecraft', monospace;
  font-size: 14px;
  color: white;
  font-weight: bold;
  text-shadow: 2px 2px 0 #000;
  transform: translateZ(5px);
}

/* 小狗容器 - 提高z-index */
.minecraft-puppies-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 30;
  transform-style: preserve-3d;
  transform: translateZ(50px);
  pointer-events: none;
}

/* 修改小狗大小 */
.minecraft-puppies-container :deep(.puppy-container) {
  transform: scale(1.7); /* 将小狗整体放大至1.7倍 */
  transform-origin: center bottom; /* 从底部中心放大 */
}

/* 像素房子 */
.minecraft-buildings {
  position: absolute;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  z-index: 4;
}

.minecraft-house {
  position: absolute;
  transform-style: preserve-3d;
}

/* 基本房子 */
.minecraft-house::before {
  /* 房子主体 */
  content: '';
  position: absolute;
  width: 48px;
  height: 40px;
  background-color: #BC9862; /* 木屋颜色 */
  border: 2px solid #8B6914;
}

.minecraft-house::after {
  /* 房顶 */
  content: '';
  position: absolute;
  top: -20px;
  left: -5px;
  width: 60px;
  height: 20px;
  background-color: #B22222; /* 屋顶颜色 */
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

/* 窗户和门装饰 */
.minecraft-house .window {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #ADD8E6; /* 窗户颜色 */
  border: 2px solid #8B6914;
}

.minecraft-house .door {
  position: absolute;
  width: 14px;
  height: 20px;
  background-color: #8B4513; /* 门颜色 */
  border: 1px solid #5E2605;
}

/* 每栋房子的不同位置和样式 - 放在跑道上 */
.minecraft-house.house-1 {
  bottom: 40%;
  left: 20%;
  transform: translateZ(10px) scale(0.7);
  z-index: 20; /* 确保在地面上方，但在小狗下方 */
}

.minecraft-house.house-1::before {
  background-color: #D2B48C;
}

.minecraft-house.house-2 {
  bottom: 35%;
  right: 35%;
  transform: translateZ(10px) scale(0.65);
  z-index: 20;
}

.minecraft-house.house-2::before {
  background-color: #BC8F8F;
}

.minecraft-house.house-2::after {
  background-color: #A0522D;
}

.minecraft-house.house-3 {
  bottom: 45%;
  left: 65%;
  transform: translateZ(10px) scale(0.6);
  z-index: 20;
}

.minecraft-house.house-3::before {
  background-color: #F5DEB3;
}

.minecraft-house.house-3::after {
  background-color: #708090;
}

.minecraft-house.house-4 {
  bottom: 42%;
  right: 10%;
  transform: translateZ(10px) scale(0.75);
  z-index: 20;
}

.minecraft-house.house-4::before {
  background-color: #E6E6FA;
}

.minecraft-house.house-4::after {
  background-color: #4682B4;
}

/* 像素树 */
.minecraft-trees {
  position: absolute;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  z-index: 2; /* 进一步降低z-index确保在小狗下方 */
}

.minecraft-tree {
  position: absolute;
  width: 32px;
  height: 64px;
  transform-style: preserve-3d;
}

.minecraft-tree::before {
  /* 树干 */
  content: '';
  position: absolute;
  bottom: 0;
  left: 12px;
  width: 8px;
  height: 24px;
  background-color: #8B4513;
  z-index: 1;
}

.minecraft-tree::after {
  /* 树叶 */
  content: '';
  position: absolute;
  bottom: 16px;
  left: 0;
  width: 32px;
  height: 32px;
  background-color: #2E8B57;
  z-index: 2;
  box-shadow: 
    0 -8px 0 0 #2E8B57,
    -8px 0 0 0 #2E8B57,
    8px 0 0 0 #2E8B57;
}

/* 重新定位部分树木，避免遮挡小狗 */
.minecraft-tree.tree-1 {
  bottom: 41%;
  left: 25%;
  transform: translateZ(-30px) scale(0.8);
}

.minecraft-tree.tree-2 {
  bottom: 50%;
  right: 15%;
  transform: translateZ(-15px) scale(0.7);
}

.minecraft-tree.tree-3 {
  bottom: 45%;
  left: 70%;
  transform: translateZ(-25px) scale(0.9);
}

.minecraft-tree.tree-4 {
  bottom: 48%;
  left: 30%;
  transform: translateZ(-22px) scale(0.85);
}

.minecraft-tree.tree-5 {
  bottom: 45%;
  right: 55%;
  transform: translateZ(-28px) scale(0.75);
}

/* 添加更多树的样式 */
.minecraft-tree.tree-6 {
  bottom: 52%;
  left: 85%;
  transform: translateZ(-18px) scale(0.95);
}

.minecraft-tree.tree-7 {
  bottom: 51%;
  left: 60%;
  transform: translateZ(-22px) scale(0.75);
}

.minecraft-tree.tree-8 {
  bottom: 47%;
  right: 45%;
  transform: translateZ(-15px) scale(0.85);
}

/* 像素字体 */
@font-face {
  font-family: 'Minecraft';
  src: url('https://fonts.cdnfonts.com/css/minecraft-4') format('woff2');
  font-weight: normal;
  font-style: normal;
}

/* 添加像素小鸟 */
.minecraft-birds {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40%;
  z-index: 2;
  transform-style: preserve-3d;
  pointer-events: none;
}

.minecraft-bird {
  position: absolute;
  width: 16px;
  height: 12px;
  transform-style: preserve-3d;
}

.minecraft-bird::before {
  /* 小鸟身体 */
  content: '';
  position: absolute;
  width: 16px;
  height: 8px;
  background-color: #36648B; /* 鸟身体颜色 */
  border-radius: 50%;
  z-index: 3;
}

.minecraft-bird::after {
  /* 小鸟翅膀 */
  content: '';
  position: absolute;
  top: -3px;
  left: 3px;
  width: 10px;
  height: 4px;
  background-color: #4682B4; /* 翅膀颜色 */
  z-index: 4;
  animation: bird-flap 0.5s infinite alternate;
}

@keyframes bird-flap {
  0% { transform: rotateZ(0deg); }
  100% { transform: rotateZ(20deg); }
}

.minecraft-bird.bird-1 {
  top: 60px;
  left: 150px;
  transform: translateZ(-35px);
  animation: bird-fly-1 30s linear infinite;
}

.minecraft-bird.bird-2 {
  top: 40px;
  left: 400px;
  transform: translateZ(-40px) scale(0.8);
  animation: bird-fly-2 40s linear infinite;
}

.minecraft-bird.bird-3 {
  top: 80px;
  left: 280px;
  transform: translateZ(-45px) scale(1.2);
  animation: bird-fly-3 35s linear infinite;
}

.minecraft-bird.bird-4 {
  top: 90px;
  left: 100px;
  transform: translateZ(-38px) scale(0.9);
  animation: bird-fly-4 25s linear infinite;
}

@keyframes bird-fly-1 {
  0% { transform: translateZ(-35px) translateX(0); }
  50% { transform: translateZ(-35px) translateX(calc(50vw)) translateY(20px); }
  100% { transform: translateZ(-35px) translateX(calc(100vw + 50px)); }
}

@keyframes bird-fly-2 {
  0% { transform: translateZ(-40px) scale(0.8) translateX(-100px); }
  40% { transform: translateZ(-40px) scale(0.8) translateX(calc(40vw)) translateY(-15px); }
  100% { transform: translateZ(-40px) scale(0.8) translateX(calc(100vw + 100px)); }
}

@keyframes bird-fly-3 {
  0% { transform: translateZ(-45px) scale(1.2) translateX(100vw); }
  50% { transform: translateZ(-45px) scale(1.2) translateX(calc(50vw)) translateY(10px); }
  100% { transform: translateZ(-45px) scale(1.2) translateX(-50px); }
}

@keyframes bird-fly-4 {
  0% { transform: translateZ(-38px) scale(0.9) translateX(-30px); }
  60% { transform: translateZ(-38px) scale(0.9) translateX(calc(60vw)) translateY(-20px); }
  100% { transform: translateZ(-38px) scale(0.9) translateX(calc(100vw + 80px)); }
}

/* 添加新小鸟的样式和动画 */
.minecraft-bird.bird-5 {
  top: 50px;
  left: 250px;
  transform: translateZ(-42px) scale(1.1);
  animation: bird-fly-5 32s linear infinite;
}

.minecraft-bird.bird-6 {
  top: 70px;
  left: 500px;
  transform: translateZ(-38px) scale(0.85);
  animation: bird-fly-6 38s linear infinite;
}

.minecraft-bird.bird-7 {
  top: 30px;
  left: 350px;
  transform: translateZ(-35px) scale(1.0);
  animation: bird-fly-7 28s linear infinite;
}

.minecraft-bird.bird-8 {
  top: 100px;
  left: 200px;
  transform: translateZ(-40px) scale(0.95);
  animation: bird-fly-8 34s linear infinite;
}

/* 为新增的小鸟添加飞行动画 */
@keyframes bird-fly-5 {
  0% { transform: translateZ(-42px) scale(1.1) translateX(100vw); }
  45% { transform: translateZ(-42px) scale(1.1) translateX(calc(55vw)) translateY(-10px); }
  100% { transform: translateZ(-42px) scale(1.1) translateX(-60px); }
}

@keyframes bird-fly-6 {
  0% { transform: translateZ(-38px) scale(0.85) translateX(-40px); }
  55% { transform: translateZ(-38px) scale(0.85) translateX(calc(45vw)) translateY(15px); }
  100% { transform: translateZ(-38px) scale(0.85) translateX(calc(100vw + 60px)); }
}

@keyframes bird-fly-7 {
  0% { transform: translateZ(-35px) scale(1.0) translateX(-80px); }
  50% { transform: translateZ(-35px) scale(1.0) translateX(calc(60vw)) translateY(-5px); }
  100% { transform: translateZ(-35px) scale(1.0) translateX(calc(100vw + 40px)); }
}

@keyframes bird-fly-8 {
  0% { transform: translateZ(-40px) scale(0.95) translateX(50vw); }
  40% { transform: translateZ(-40px) scale(0.95) translateX(calc(20vw)) translateY(10px); }
  100% { transform: translateZ(-40px) scale(0.95) translateX(-100px); }
}
</style> 