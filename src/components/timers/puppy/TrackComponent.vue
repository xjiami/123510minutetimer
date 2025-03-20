<template>
  <div class="race-track">
    <div class="track-ground"></div>
    <div class="start-line"></div>
    <div class="finish-line"></div>
    <div class="track-markers">
      <div class="marker" v-for="i in 10" :key="i" :style="{ left: `${i * 10}%` }">{{ i * 10 }}</div>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// 无需复杂逻辑
</script>

<style scoped>
@import '@/assets/styles/puppyVariables.css';

.race-track {
  position: relative;
  width: 100%;
  height: 200px;
  margin: 20px 0;
  background-color: #f0f8ff;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid #333;
}

.track-ground {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80%;
  background: linear-gradient(to bottom, #90ee90, #228b22);
}

.start-line {
  position: absolute;
  top: 0;
  left: 5%;
  width: 2px;
  height: 100%;
  background: repeating-linear-gradient(
    to bottom,
    #fff,
    #fff 10px,
    #000 10px,
    #000 20px
  );
  z-index: 2;
}

.finish-line {
  position: absolute;
  top: 0;
  right: 5%;
  width: 2px;
  height: 100%;
  background: repeating-linear-gradient(
    to bottom,
    #fff,
    #fff 10px,
    #000 10px,
    #000 20px
  );
  z-index: 2;
}

.track-markers {
  position: absolute;
  bottom: 5px;
  left: 0;
  width: 100%;
  height: 20px;
  z-index: 3;
}

.marker {
  position: absolute;
  bottom: 0;
  transform: translateX(-50%);
  font-size: 12px;
  color: white;
  text-shadow: 1px 1px 1px black;
}
</style> 