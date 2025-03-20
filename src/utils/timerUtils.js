/**
 * 格式化时间为 MM:SS 格式
 * @param {number} seconds - 总秒数
 * @returns {string} - 格式化后的时间字符串
 */
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * 计算进度百分比
 * @param {number} current - 当前值
 * @param {number} total - 总值
 * @returns {number} - 进度百分比（0-1之间）
 */
export const calculateProgress = (current, total) => {
  if (total === 0) return 0;
  return 1 - (current / total);
};

/**
 * 播放音效
 * @param {string} soundName - 音效名称
 * @returns {Promise} - 播放音效的Promise
 */
export const playSound = (soundName) => {
  return new Promise((resolve, reject) => {
    try {
      const audio = new Audio(`/sounds/${soundName}.mp3`);
      audio.addEventListener('ended', resolve);
      audio.addEventListener('error', reject);
      audio.play().catch(reject);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 生成随机整数
 * @param {number} min - 最小值（包含）
 * @param {number} max - 最大值（包含）
 * @returns {number} - 随机整数
 */
export const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * 随机打乱数组
 * @param {Array} array - 要打乱的数组
 * @returns {Array} - 打乱后的新数组
 */
export const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * 保存数据到本地存储
 * @param {string} key - 存储键名
 * @param {any} data - 要存储的数据
 */
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('保存到本地存储失败:', error);
  }
};

/**
 * 从本地存储获取数据
 * @param {string} key - 存储键名
 * @param {any} defaultValue - 默认值
 * @returns {any} - 获取的数据或默认值
 */
export const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error('从本地存储获取数据失败:', error);
    return defaultValue;
  }
}; 