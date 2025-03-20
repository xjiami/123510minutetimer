/**
 * puppyRace.ts - 小狗赛跑相关的常量定义
 */

/**
 * 小狗尺寸常量
 */
export const PUPPY_SIZE = {
  WIDTH: '8%',
  HEIGHT: '12%',
  LEG_LENGTH: '3%',
  TAIL_LENGTH: '2%',
  EAR_LENGTH: '1.5%'
} as const

/**
 * 小狗颜色常量
 */
export const PUPPY_COLORS = {
  BROWN: '#8B4513',
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  SPOTTED: {
    BASE: '#F5F5F5',
    SPOTS: '#8B4513'
  }
} as const

/**
 * 小狗位置常量
 */
export const PUPPY_POSITIONS = {
  START: {
    BROWN: 5,
    WHITE: 15,
    BLACK: 25,
    SPOTTED: 35
  },
  FINISH: 100
} as const

/**
 * 小狗速度常量
 */
export const PUPPY_SPEEDS = {
  MIN: 0.5,
  MAX: 2.0,
  DEFAULT: 1.0
} as const

/**
 * 小狗动画时间常量
 */
export const PUPPY_ANIMATION_DURATIONS = {
  RUNNING: 0.5,
  LEG_MOVEMENT: 0.3,
  TAIL_WAGGING: 0.4,
  EAR_MOVEMENT: 0.3,
  CELEBRATION: 1.0,
  PULSE: 0.5
} as const

/**
 * 小狗状态常量
 */
export const PUPPY_STATES = {
  IDLE: 'idle',
  RUNNING: 'running',
  FINISHED: 'finished'
} as const

/**
 * 赛道常量
 */
export const TRACK_CONSTANTS = {
  WIDTH: '100%',
  HEIGHT: '200px',
  BACKGROUND: 'linear-gradient(to bottom, #87CEEB, #E0F6FF)',
  GROUND_COLOR: '#90EE90',
  LINE_COLOR: '#FFFFFF',
  LINE_WIDTH: '2px',
  LINE_SPACING: '10px'
} as const

/**
 * 计时器常量
 */
export const TIMER_CONSTANTS = {
  UPDATE_INTERVAL: 16, // 约60fps
  COUNTDOWN_DURATION: 3000,
  COUNTDOWN_STEPS: 3
} as const

/**
 * 碰撞检测常量
 */
export const COLLISION_CONSTANTS = {
  SAFE_DISTANCE_MULTIPLIER: 1.5,
  MIN_DISTANCE: 0,
  MAX_DISTANCE: 100
} as const

// 动画持续时间（毫秒）
export const ANIMATION_DURATION = {
  RUN: 1000,
  LEG_RUN: 500,
  TAIL_WAG: 800,
  EAR_FLOP: 600,
  CELEBRATE: 1200,
  PULSE: 1000
}

// 赛道配置
export const TRACK_CONFIG = {
  HEIGHT: '300px',
  LINE_HEIGHT: '200px',
  PERSPECTIVE_DEPTH: '1000px',
  GROUND_ROTATE_X: '60deg',
  LINE_ROTATE_Y: '30deg',
  START_LINE_POSITION: '5%',
  FINISH_LINE_POSITION: '5%'
}

// 赛道颜色配置
export const TRACK_COLORS = {
  GROUND: '#90EE90',
  GROUND_SHADE: '#228B22',
  LINE: '#FFFFFF',
  SKY_START: '#87CEEB',
  SKY_END: '#E0FFFF',
  MARKER: '#FFFFFF',
  SHADOW: 'rgba(0, 0, 0, 0.3)'
}

// 圆角配置
export const BORDER_RADIUS = {
  SMALL: '4px',
  MEDIUM: '8px',
  LARGE: '16px',
  FULL: '50%'
}

// z-index层级配置
export const Z_INDEX = {
  TRACK_BG: 1,
  TRACK_GROUND: 2,
  TRACK_LINES: 3,
  TRACK_MARKERS: 4,
  START_FINISH: 5,
  PUPPIES: 6,
  PUPPY_HEAD: 7,
  PUPPY_EAR: 8,
  PUPPY_TRUNK: 9,
  PUPPY_LEG: 10,
  PUPPY_TAIL: 11
}

// 小狗斑点配置
export const SPOT_CONFIG = {
  POSITION: '50% 50%',
  SIZE: '30%',
  SIZE_END: '60%'
}

// 比赛状态配置
export const RACE_STATES = {
  INACTIVE: false,
  ACTIVE: true,
  FINISHED: true
}

// 计时器配置
export const TIMER_CONFIG = {
  UPDATE_INTERVAL: 1000, // 更新间隔（毫秒）
  MAX_TIME: 999999, // 最大时间（毫秒）
  MIN_TIME: 0 // 最小时间（毫秒）
} 