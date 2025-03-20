<template>
  <div class="minecraft-layout">
    <!-- 标题栏 -->
    <div class="minecraft-title-bar">
      <div class="title-text">
        <slot name="title">Minecraft 计时器</slot>
      </div>
    </div>

    <!-- 控制按钮区域 -->
    <div class="minecraft-controls">
      <slot name="controls"></slot>
    </div>

    <!-- 主内容区域 - 分为上部控制区和下部动画区 -->
    <div class="minecraft-content">
      <div class="content-frame">
        <!-- 默认插槽内容按照新的结构组织 -->
        <slot></slot>
      </div>
    </div>

    <!-- 粒子效果容器 -->
    <div class="particles-container"></div>
  </div>
</template>

<script setup lang="ts">
// 无需额外逻辑
</script>

<style>
/* Minecraft 字体 */
@font-face {
  font-family: 'Minecraft';
  src: url('https://fonts.cdnfonts.com/css/minecraft-4') format('woff2');
}

.minecraft-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-image: 
    linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABUSURBVDiNY2CgEDBC6f9UwI8YGBj+wzCxamEmskxnYGD4z8DAwEh1FyBjqhqAzxCKDSDGELINIGQIVQwgZAhVDcBnCNUNwGUI1Q3AZQjNDEAHAL7AD+XKB5GPAAAAAElFTkSuQmCC');
  background-repeat: repeat;
  image-rendering: pixelated;
  color: #fff;
  font-family: 'Minecraft', monospace;
}

.minecraft-title-bar {
  background-color: rgba(0, 0, 0, 0.8);
  padding: 1rem;
  border-bottom: 4px solid #1B1B1B;
  text-align: center;
}

.title-text {
  font-size: 24px;
  color: #55FF55;
  text-shadow: 2px 2px #000000;
  letter-spacing: 1px;
}

.minecraft-controls {
  padding: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
  background-color: rgba(0, 0, 0, 0.6);
}

.minecraft-content {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content-frame {
  background-color: rgba(0, 0, 0, 0.8);
  border: 2px solid #404040;
  padding: 2rem;
  border-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABUSURBVDiNY2CgEDBC6f9UwI8YGBj+wzCxamEmskxnYGD4z8DAwEh1FyBjqhqAzxCKDSDGELINIGQIVQwgZAhVDcBnCNUNwGUI1Q3AZQjNDEAHAL7AD+XKB5GPAAAAAElFTkSuQmCC') 2;
  width: 100%;
  max-width: 800px;
}

/* 动画和控制面板的新样式 */
.top-panel {
  order: 1;
  width: 100%;
  margin-bottom: 2rem;
}

.bottom-animation {
  order: 2;
  width: 100%;
  margin-top: 1rem;
}

/* Minecraft 风格按钮 */
.minecraft-button {
  background-color: #4C4C4C;
  border: 2px solid #404040;
  border-bottom: 4px solid #404040;
  padding: 8px 16px;
  color: #ffffff;
  font-family: 'Minecraft', monospace;
  font-size: 16px;
  text-shadow: 2px 2px #000000;
  cursor: pointer;
  transition: all 0.1s;
  image-rendering: pixelated;
}

.minecraft-button:hover {
  background-color: #5C5C5C;
  border-bottom-width: 4px;
  transform: translateY(-2px);
}

.minecraft-button:active {
  background-color: #3C3C3C;
  border-bottom-width: 2px;
  transform: translateY(2px);
}

.minecraft-button:disabled {
  background-color: #2C2C2C;
  border-color: #202020;
  color: #808080;
  cursor: not-allowed;
}

/* Minecraft 风格输入框 */
.minecraft-input {
  background-color: #000000;
  border: 2px solid #404040;
  padding: 8px;
  color: #ffffff;
  font-family: 'Minecraft', monospace;
  font-size: 16px;
  width: 100px;
  text-align: center;
}

.minecraft-input:focus {
  outline: none;
  border-color: #55FF55;
}

/* Minecraft 风格标签 */
.minecraft-label {
  color: #AAAAAA;
  font-size: 14px;
  text-shadow: 1px 1px #000000;
  margin-bottom: 4px;
}

/* Minecraft 风格数字显示 */
.minecraft-display {
  background-color: #000000;
  border: 2px solid #404040;
  padding: 16px;
  color: #55FF55;
  font-family: 'Minecraft', monospace;
  font-size: 32px;
  text-shadow: 2px 2px #003300;
  letter-spacing: 2px;
  text-align: center;
  min-width: 200px;
}

/* 粒子效果 */
@keyframes break-particle {
  0% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translate(var(--x, 20px), var(--y, 20px)) rotate(var(--r, 180deg));
    opacity: 0;
  }
}

.break-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background-color: currentColor;
  animation: break-particle 0.5s ease-out forwards;
}

/* 红石灯效果 */
.redstone-lamp {
  width: 32px;
  height: 32px;
  background-color: #3C1F1F;
  border: 2px solid #2C1F1F;
  position: relative;
}

.redstone-lamp.active {
  background-color: #FF5555;
  box-shadow: 0 0 10px #FF5555;
}

/* 方块数字 */
.pixel-number {
  display: inline-block;
  position: relative;
}

.pixel-number::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: currentColor;
  mask-repeat: no-repeat;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: contain;
}
</style> 