/**
 * puppyRace.ts - 小狗赛跑相关的类型定义
 */

/**
 * 小狗状态类型
 */
export type PuppyState = 'idle' | 'running' | 'finished'

/**
 * 小狗位置接口
 */
export interface PuppyPosition {
  position: number
  state: PuppyState
  speed: number
  previousPosition: number
}

/**
 * 比赛状态接口
 */
export interface RaceState {
  isRunning: boolean
  isFinished: boolean
  startTime: number | null
  endTime: number | null
  winner: string | null
}

/**
 * 小狗样式接口
 */
export interface PuppyStyle {
  transform?: string
  transition?: string
  animation?: string
  opacity?: number
  filter?: string
}

/**
 * 小狗状态类名接口
 */
export interface PuppyStateClass {
  idle: string
  running: string
  finished: string
}

/**
 * 小狗配置接口
 */
export interface PuppyConfig {
  color: string
  startPosition: number
  speed: number
  size: {
    width: string
    height: string
  }
}

/**
 * 赛道配置接口
 */
export interface TrackConfig {
  width: string
  height: string
  background: string
  groundColor: string
  lineColor: string
  lineWidth: string
  lineSpacing: string
}

/**
 * 动画配置接口
 */
export interface AnimationConfig {
  running: number
  legMovement: number
  tailWagging: number
  earMovement: number
  celebration: number
  pulse: number
}

/**
 * 计时器配置接口
 */
export interface TimerConfig {
  updateInterval: number
  countdownDuration: number
  countdownSteps: number
}

/**
 * 小狗组件属性接口
 */
export interface PuppyProps {
  color: string
  position: number
  state: PuppyState
  size: {
    width: string
    height: string
  }
}

/**
 * 小狗组件事件接口
 */
export interface PuppyEvents {
  onStateChange: (state: PuppyState) => void
  onPositionChange: (position: number) => void
  onFinish: () => void
}

/**
 * 计时器组件属性接口
 */
export interface TimerProps {
  duration: number
  isRunning: boolean
  isFinished: boolean
  onFinish: () => void
}

/**
 * 计时器组件事件接口
 */
export interface TimerEvents {
  onStart: () => void
  onPause: () => void
  onReset: () => void
}

/**
 * 比赛组件属性接口
 */
export interface RaceProps {
  puppies: PuppyConfig[]
  track: TrackConfig
  animation: AnimationConfig
  timer: TimerConfig
}

/**
 * 比赛组件事件接口
 */
export interface RaceEvents {
  onStart: () => void
  onFinish: (winner: string) => void
  onReset: () => void
} 