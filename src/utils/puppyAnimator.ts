/**
 * puppyAnimator.ts - 小狗动画工具函数
 */
import { ANIMATION_DURATION } from '@/constants/puppyRace'
import type { PuppyState, PuppyStyle } from '@/types/puppyRace'

/**
 * 获取小狗动画样式
 * @param state 小狗状态
 * @returns 动画样式对象
 */
export function getPuppyAnimationStyle(state: PuppyState): PuppyStyle {
  const baseStyle: PuppyStyle = {
    transition: `all ${ANIMATION_DURATION.RUN}ms ease-in-out`
  }

  switch (state) {
    case 'running':
      return {
        ...baseStyle,
        transform: 'translateX(0)'
      }
    case 'finished':
      return {
        ...baseStyle,
        transform: 'translateX(100%)'
      }
    default:
      return baseStyle
  }
}

/**
 * 获取小狗腿部动画样式
 * @param state 小狗状态
 * @returns 动画样式对象
 */
export function getLegAnimationStyle(state: PuppyState): PuppyStyle {
  const baseStyle: PuppyStyle = {
    transition: `transform ${ANIMATION_DURATION.LEG_RUN}ms ease-in-out`
  }

  if (state === 'running') {
    return {
      ...baseStyle,
      transform: 'rotate(45deg)'
    }
  }

  return baseStyle
}

/**
 * 获取小狗尾巴动画样式
 * @param state 小狗状态
 * @returns 动画样式对象
 */
export function getTailAnimationStyle(state: PuppyState): PuppyStyle {
  const baseStyle: PuppyStyle = {
    transition: `transform ${ANIMATION_DURATION.TAIL_WAG}ms ease-in-out`
  }

  if (state === 'running') {
    return {
      ...baseStyle,
      transform: 'rotate(30deg)'
    }
  }

  return baseStyle
}

/**
 * 获取小狗耳朵动画样式
 * @param state 小狗状态
 * @returns 动画样式对象
 */
export function getEarAnimationStyle(state: PuppyState): PuppyStyle {
  const baseStyle: PuppyStyle = {
    transition: `transform ${ANIMATION_DURATION.EAR_FLOP}ms ease-in-out`
  }

  if (state === 'running') {
    return {
      ...baseStyle,
      transform: 'rotate(-15deg)'
    }
  }

  return baseStyle
}

/**
 * 获取小狗庆祝动画样式
 * @returns 动画样式对象
 */
export function getCelebrateAnimationStyle(): PuppyStyle {
  return {
    transition: `transform ${ANIMATION_DURATION.CELEBRATE}ms ease-in-out`,
    transform: 'translateY(-20px)'
  }
}

/**
 * 获取小狗脉冲动画样式
 * @returns 动画样式对象
 */
export function getPulseAnimationStyle(): PuppyStyle {
  return {
    transition: `transform ${ANIMATION_DURATION.PULSE}ms ease-in-out`,
    transform: 'scale(1.1)'
  }
}

/**
 * 获取小狗位置样式
 * @param position 位置百分比
 * @returns 位置样式对象
 */
export function getPuppyPositionStyle(position: number): PuppyStyle {
  return {
    left: `${position}%`,
    transition: 'left 0.3s ease-out'
  }
}

/**
 * 获取小狗旋转样式
 * @param angle 旋转角度
 * @returns 旋转样式对象
 */
export function getPuppyRotationStyle(angle: number): PuppyStyle {
  return {
    transform: `rotate(${angle}deg)`,
    transition: 'transform 0.3s ease-out'
  }
}

/**
 * 获取小狗缩放样式
 * @param scale 缩放比例
 * @returns 缩放样式对象
 */
export function getPuppyScaleStyle(scale: number): PuppyStyle {
  return {
    transform: `scale(${scale})`,
    transition: 'transform 0.3s ease-out'
  }
}

/**
 * 获取小狗阴影样式
 * @param blur 模糊半径
 * @param spread 扩散半径
 * @param color 阴影颜色
 * @returns 阴影样式对象
 */
export function getPuppyShadowStyle(
  blur: number = 5,
  spread: number = 0,
  color: string = 'rgba(0, 0, 0, 0.3)'
): PuppyStyle {
  return {
    boxShadow: `0 0 ${blur}px ${spread}px ${color}`,
    transition: 'box-shadow 0.3s ease-out'
  }
}

/**
 * 获取小狗透明度样式
 * @param opacity 透明度
 * @returns 透明度样式对象
 */
export function getPuppyOpacityStyle(opacity: number): PuppyStyle {
  return {
    opacity: opacity.toString(),
    transition: 'opacity 0.3s ease-out'
  }
}

/**
 * 合并多个样式对象
 * @param styles 样式对象数组
 * @returns 合并后的样式对象
 */
export function mergePuppyStyles(...styles: PuppyStyle[]): PuppyStyle {
  return styles.reduce((merged, style) => ({
    ...merged,
    ...style
  }), {})
} 