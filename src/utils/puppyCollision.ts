/**
 * puppyCollision.ts - 小狗碰撞检测工具函数
 */
import { PUPPY_SIZE } from '@/constants/puppyRace'
import type { PuppyPosition } from '@/types/puppyRace'

/**
 * 检查两个小狗是否发生碰撞
 * @param puppy1 第一个小狗的位置信息
 * @param puppy2 第二个小狗的位置信息
 * @returns 是否发生碰撞
 */
export function checkPuppyCollision(puppy1: PuppyPosition, puppy2: PuppyPosition): boolean {
  // 将百分比位置转换为像素位置
  const puppy1Left = puppy1.position
  const puppy2Left = puppy2.position

  // 计算小狗的宽度（基于百分比）
  const puppyWidth = parseFloat(PUPPY_SIZE.WIDTH) / 100

  // 检查是否重叠
  return (
    puppy1Left < puppy2Left + puppyWidth &&
    puppy1Left + puppyWidth > puppy2Left
  )
}

/**
 * 调整小狗位置以避免碰撞
 * @param puppies 所有小狗的位置信息数组
 * @param index 当前小狗的索引
 * @returns 调整后的位置
 */
export function adjustPuppyPosition(
  puppies: PuppyPosition[],
  index: number
): number {
  const currentPuppy = puppies[index]
  const puppyWidth = parseFloat(PUPPY_SIZE.WIDTH) / 100
  let newPosition = currentPuppy.position

  // 检查与前面的小狗的碰撞
  for (let i = 0; i < index; i++) {
    const otherPuppy = puppies[i]
    if (checkPuppyCollision(currentPuppy, otherPuppy)) {
      newPosition = otherPuppy.position - puppyWidth
    }
  }

  // 检查与后面的小狗的碰撞
  for (let i = index + 1; i < puppies.length; i++) {
    const otherPuppy = puppies[i]
    if (checkPuppyCollision(currentPuppy, otherPuppy)) {
      newPosition = otherPuppy.position + puppyWidth
    }
  }

  // 确保位置在有效范围内
  return Math.max(0, Math.min(100, newPosition))
}

/**
 * 检查小狗是否到达终点
 * @param position 小狗位置
 * @returns 是否到达终点
 */
export function checkFinishLine(position: number): boolean {
  return position >= 100
}

/**
 * 计算小狗之间的距离
 * @param puppy1 第一个小狗的位置
 * @param puppy2 第二个小狗的位置
 * @returns 距离（百分比）
 */
export function calculatePuppyDistance(
  puppy1: number,
  puppy2: number
): number {
  return Math.abs(puppy1 - puppy2)
}

/**
 * 检查小狗是否在安全距离内
 * @param distance 距离
 * @returns 是否安全
 */
export function isSafeDistance(distance: number): boolean {
  const puppyWidth = parseFloat(PUPPY_SIZE.WIDTH) / 100
  return distance >= puppyWidth * 1.5 // 1.5倍小狗宽度作为安全距离
}

/**
 * 获取小狗的碰撞边界
 * @param position 小狗位置
 * @returns 碰撞边界对象
 */
export function getPuppyBounds(position: number): {
  left: number
  right: number
} {
  const puppyWidth = parseFloat(PUPPY_SIZE.WIDTH) / 100
  return {
    left: position,
    right: position + puppyWidth
  }
}

/**
 * 检查小狗是否在赛道范围内
 * @param position 小狗位置
 * @returns 是否在范围内
 */
export function isInTrackBounds(position: number): boolean {
  return position >= 0 && position <= 100
}

/**
 * 获取小狗的移动方向
 * @param currentPosition 当前位置
 * @param previousPosition 之前的位置
 * @returns 移动方向（1表示向右，-1表示向左，0表示静止）
 */
export function getPuppyDirection(
  currentPosition: number,
  previousPosition: number
): number {
  if (currentPosition > previousPosition) return 1
  if (currentPosition < previousPosition) return -1
  return 0
}

/**
 * 预测小狗的下一个位置
 * @param currentPosition 当前位置
 * @param speed 速度
 * @param deltaTime 时间差
 * @returns 预测的下一个位置
 */
export function predictNextPosition(
  currentPosition: number,
  speed: number,
  deltaTime: number
): number {
  return currentPosition + speed * deltaTime
}

/**
 * 检查小狗是否会发生碰撞
 * @param currentPuppy 当前小狗
 * @param otherPuppies 其他小狗
 * @returns 是否会发生碰撞
 */
export function willCollide(
  currentPuppy: PuppyPosition,
  otherPuppies: PuppyPosition[]
): boolean {
  return otherPuppies.some(puppy => checkPuppyCollision(currentPuppy, puppy))
} 