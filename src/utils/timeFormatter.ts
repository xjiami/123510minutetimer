/**
 * timeFormatter.ts - 时间格式化工具函数
 */

/**
 * 格式化时间（毫秒）为 MM:SS 格式
 * @param time 时间（毫秒）
 * @returns 格式化后的时间字符串
 */
export function formatTime(time: number): string {
  const minutes = Math.floor(time / 60000)
  const seconds = Math.floor((time % 60000) / 1000)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

/**
 * 格式化时间（毫秒）为 HH:MM:SS 格式
 * @param time 时间（毫秒）
 * @returns 格式化后的时间字符串
 */
export function formatTimeWithHours(time: number): string {
  const hours = Math.floor(time / 3600000)
  const minutes = Math.floor((time % 3600000) / 60000)
  const seconds = Math.floor((time % 60000) / 1000)
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

/**
 * 格式化时间（毫秒）为 MM:SS.CC 格式（包含百分秒）
 * @param time 时间（毫秒）
 * @returns 格式化后的时间字符串
 */
export function formatTimeWithCentiseconds(time: number): string {
  const minutes = Math.floor(time / 60000)
  const seconds = Math.floor((time % 60000) / 1000)
  const centiseconds = Math.floor((time % 1000) / 10)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`
}

/**
 * 格式化时间（毫秒）为 MM:SS.CC 格式（包含百分秒）
 * @param time 时间（毫秒）
 * @returns 格式化后的时间字符串
 */
export function formatTimeWithMilliseconds(time: number): string {
  const minutes = Math.floor(time / 60000)
  const seconds = Math.floor((time % 60000) / 1000)
  const milliseconds = time % 1000
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`
}

/**
 * 解析时间字符串为毫秒数
 * @param timeString 时间字符串（MM:SS 或 HH:MM:SS 格式）
 * @returns 毫秒数
 */
export function parseTime(timeString: string): number {
  const [minutes, seconds] = timeString.split(':').map(Number)
  return minutes * 60000 + seconds * 1000
}

/**
 * 解析时间字符串为毫秒数（包含小时）
  const parts = timeString.split(':')
  if (parts.length === 2) {
    // MM:SS 格式
    const minutes = parseInt(parts[0], 10)
    const seconds = parseInt(parts[1], 10)
    return (minutes * 60 + seconds) * 1000
  } else if (parts.length === 3) {
    // HH:MM:SS 格式
    const hours = parseInt(parts[0], 10)
    const minutes = parseInt(parts[1], 10)
    const seconds = parseInt(parts[2], 10)
    return (hours * 3600 + minutes * 60 + seconds) * 1000
  }
  return 0
}

/**
 * 获取当前时间戳（毫秒）
 * @returns 当前时间戳
 */
export function getCurrentTimestamp(): number {
  return Date.now()
}

/**
 * 计算时间差（毫秒）
 * @param startTime 开始时间（毫秒）
 * @param endTime 结束时间（毫秒）
 * @returns 时间差（毫秒）
 */
export function calculateTimeDifference(startTime: number, endTime: number): number {
  return endTime - startTime
}

/**
 * 检查时间是否有效
 * @param time 时间（毫秒）
 * @returns 是否有效
 */
export function isValidTime(time: number): boolean {
  return time >= 0 && time < Number.MAX_SAFE_INTEGER
}

/**
 * 限制时间在指定范围内
 * @param time 时间（毫秒）
 * @param min 最小值（毫秒）
 * @param max 最大值（毫秒）
 * @returns 限制后的时间
 */
export function clampTime(time: number, min: number, max: number): number {
  return Math.min(Math.max(time, min), max)
} 