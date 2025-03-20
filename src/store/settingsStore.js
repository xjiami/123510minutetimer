import { defineStore } from 'pinia';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/timerUtils';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    // 默认设置
    defaultTimer: getFromLocalStorage('defaultTimer', 'egg-timer'),
    defaultTimerDuration: getFromLocalStorage('defaultTimerDuration', 5 * 60), // 5分钟
    soundEnabled: getFromLocalStorage('soundEnabled', true),
    themeColor: getFromLocalStorage('themeColor', 'blue'), // 默认主题颜色
    lastUsedTimers: getFromLocalStorage('lastUsedTimers', []), // 最近使用的计时器
    lastUsedPickers: getFromLocalStorage('lastUsedPickers', []), // 最近使用的选择器
    favoriteTimers: getFromLocalStorage('favoriteTimers', []), // 收藏的计时器
    favoritePickers: getFromLocalStorage('favoritePickers', []), // 收藏的选择器
  }),
  
  actions: {
    // 保存设置
    saveSettings() {
      saveToLocalStorage('defaultTimer', this.defaultTimer);
      saveToLocalStorage('defaultTimerDuration', this.defaultTimerDuration);
      saveToLocalStorage('soundEnabled', this.soundEnabled);
      saveToLocalStorage('themeColor', this.themeColor);
      saveToLocalStorage('lastUsedTimers', this.lastUsedTimers);
      saveToLocalStorage('lastUsedPickers', this.lastUsedPickers);
      saveToLocalStorage('favoriteTimers', this.favoriteTimers);
      saveToLocalStorage('favoritePickers', this.favoritePickers);
    },
    
    // 更新默认计时器
    setDefaultTimer(timerId) {
      this.defaultTimer = timerId;
      this.saveSettings();
    },
    
    // 更新默认计时器时间（秒）
    setDefaultTimerDuration(seconds) {
      this.defaultTimerDuration = seconds;
      this.saveSettings();
    },
    
    // 更新声音设置
    toggleSound() {
      this.soundEnabled = !this.soundEnabled;
      this.saveSettings();
    },
    
    // 设置主题颜色
    setThemeColor(color) {
      this.themeColor = color;
      this.saveSettings();
    },
    
    // 添加最近使用的计时器
    addToLastUsedTimers(timerId) {
      // 移除已存在的相同ID
      this.lastUsedTimers = this.lastUsedTimers.filter(id => id !== timerId);
      
      // 添加到开头
      this.lastUsedTimers.unshift(timerId);
      
      // 限制数量为5个
      if (this.lastUsedTimers.length > 5) {
        this.lastUsedTimers = this.lastUsedTimers.slice(0, 5);
      }
      
      this.saveSettings();
    },
    
    // 添加最近使用的选择器
    addToLastUsedPickers(pickerId) {
      // 移除已存在的相同ID
      this.lastUsedPickers = this.lastUsedPickers.filter(id => id !== pickerId);
      
      // 添加到开头
      this.lastUsedPickers.unshift(pickerId);
      
      // 限制数量为5个
      if (this.lastUsedPickers.length > 5) {
        this.lastUsedPickers = this.lastUsedPickers.slice(0, 5);
      }
      
      this.saveSettings();
    },
    
    // 添加或移除收藏计时器
    toggleFavoriteTimer(timerId) {
      const index = this.favoriteTimers.indexOf(timerId);
      
      if (index === -1) {
        // 添加到收藏
        this.favoriteTimers.push(timerId);
      } else {
        // 从收藏中移除
        this.favoriteTimers.splice(index, 1);
      }
      
      this.saveSettings();
    },
    
    // 检查计时器是否已收藏
    isTimerFavorite(timerId) {
      return this.favoriteTimers.includes(timerId);
    },
    
    // 添加或移除收藏选择器
    toggleFavoritePicker(pickerId) {
      const index = this.favoritePickers.indexOf(pickerId);
      
      if (index === -1) {
        // 添加到收藏
        this.favoritePickers.push(pickerId);
      } else {
        // 从收藏中移除
        this.favoritePickers.splice(index, 1);
      }
      
      this.saveSettings();
    },
    
    // 检查选择器是否已收藏
    isPickerFavorite(pickerId) {
      return this.favoritePickers.includes(pickerId);
    },
    
    // 重置所有设置为默认值
    resetSettings() {
      this.defaultTimer = 'egg-timer';
      this.defaultTimerDuration = 5 * 60;
      this.soundEnabled = true;
      this.themeColor = 'blue';
      this.lastUsedTimers = [];
      this.lastUsedPickers = [];
      this.favoriteTimers = [];
      this.favoritePickers = [];
      this.saveSettings();
    }
  }
}); 