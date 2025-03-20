<template>
  <div class="pixel-layout">
    <!-- 顶部区域 -->
    <div class="pixel-header">
      <div class="pixel-title">
        <slot name="title">像素计时器</slot>
      </div>
      <div class="pixel-controls">
        <slot name="controls"></slot>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="pixel-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// 无需额外逻辑
</script>

<style>
/* 像素字体 */
@import url('https://fonts.cdnfonts.com/css/minecraft-4');

.pixel-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #333;
  font-family: 'Minecraft', monospace;
  color: white;
  image-rendering: pixelated;
}

.pixel-header {
  background-color: #1a1a1a;
  padding: 20px;
  border-bottom: 4px solid #3A3A3A;
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 100;
}

.pixel-title {
  font-size: 24px;
  text-align: center;
  text-shadow: 2px 2px 0 #000;
  color: #5AC54F;
}

.pixel-controls {
  display: flex;
  justify-content: center;
  gap: 20px;
}

/* 像素风格按钮 */
.pixel-button {
  background-color: #5AC54F;
  border: none;
  padding: 10px 20px;
  color: white;
  font-family: 'Minecraft', monospace;
  font-size: 16px;
  cursor: pointer;
  text-shadow: 1px 1px 0 #000;
  box-shadow: 
    inset -2px -2px 0 #458B3B,
    inset 2px 2px 0 #7CE872;
  transition: all 0.1s;
}

.pixel-button:hover {
  background-color: #7CE872;
}

.pixel-button:active {
  transform: translateY(2px);
  box-shadow: 
    inset -1px -1px 0 #458B3B,
    inset 1px 1px 0 #7CE872;
}

.pixel-button.red {
  background-color: #FF4500;
  box-shadow: 
    inset -2px -2px 0 #CC3700,
    inset 2px 2px 0 #FF6A33;
}

.pixel-button.red:hover {
  background-color: #FF6A33;
}

.pixel-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  overflow-y: auto;
}

/* 像素风格输入框 */
.pixel-input {
  background-color: #1a1a1a;
  border: 2px solid #3A3A3A;
  padding: 8px 12px;
  color: white;
  font-family: 'Minecraft', monospace;
  font-size: 16px;
  outline: none;
  width: 100px;
}

.pixel-input:focus {
  border-color: #5AC54F;
  box-shadow: 0 0 0 2px rgba(90, 197, 79, 0.3);
}

/* 像素风格数字显示 */
.pixel-display {
  background-color: #1a1a1a;
  border: 4px solid #3A3A3A;
  padding: 20px;
  font-size: 48px;
  font-family: 'Minecraft', monospace;
  color: #5AC54F;
  text-shadow: 2px 2px 0 #000;
  min-width: 200px;
  text-align: center;
  box-shadow: 
    inset -2px -2px 0 #000,
    inset 2px 2px 0 #555;
}

/* 像素风格标签 */
.pixel-label {
  font-family: 'Minecraft', monospace;
  color: white;
  text-shadow: 1px 1px 0 #000;
  font-size: 16px;
}

/* 禁用状态 */
.pixel-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #666;
  box-shadow: none;
}
</style> 