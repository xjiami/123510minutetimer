import { ref } from 'vue'

// 小狗状态类型
type PuppyState = 'idle' | 'running' | 'finished'

// 小狗数据接口
interface Puppy {
  color: 'brown' | 'white' | 'black' | 'spotted'
  position: number
  state: PuppyState
  speed: number
}

// 赛跑状态接口
interface RaceState {
  isRunning: boolean
  isFinished: boolean
  winner: string | null
}

/**
 * 小狗赛跑逻辑组合式函数
 */
export function usePuppies() {
  // 小狗数据
  const puppies = ref<Puppy[]>([
    { color: 'brown', position: 5, state: 'idle', speed: 0 },
    { color: 'white', position: 5, state: 'idle', speed: 0 },
    { color: 'black', position: 5, state: 'idle', speed: 0 },
    { color: 'spotted', position: 5, state: 'idle', speed: 0 }
  ])
  
  // 赛跑状态
  const raceState = ref<RaceState>({
    isRunning: false,
    isFinished: false,
    winner: null
  })
  
  /**
   * 重置小狗位置和状态
   */
  const resetPuppies = () => {
    puppies.value.forEach(puppy => {
      puppy.position = 5
      puppy.state = 'idle'
      // 生成随机速度 (0.8-1.2)，确保公平竞争
      puppy.speed = 0.8 + Math.random() * 0.4
    })
  }
  
  /**
   * 更新小狗位置
   * @param progress 当前总体进度 (0-100)，如果提供则直接使用该进度值
   */
  const updatePuppyPositions = (progress?: number) => {
    if (!raceState.value.isRunning || raceState.value.isFinished) return
    
    // 如果提供了进度值，直接使用
    if (progress !== undefined) {
      puppies.value.forEach(puppy => {
        // 根据小狗的速度和总体进度计算位置
        // 添加一些随机性，让小狗的移动更有变化
        const randomFactor = 0.9 + Math.random() * 0.2
        const calculatedPosition = Math.min(90, 5 + (progress * puppy.speed * randomFactor))
        
        // 平滑过渡到新位置
        puppy.position = puppy.position * 0.8 + calculatedPosition * 0.2
      })
    } else {
      // 原有逻辑：小狗以自己的速度前进
      puppies.value.forEach(puppy => {
        if (puppy.state === 'running') {
          // 增加位置
          const step = 0.2 + (Math.random() * 0.3 * puppy.speed)
          puppy.position = Math.min(90, puppy.position + step)
        }
      })
    }
  }
  
  // 初始化
  resetPuppies()
  
  return {
    puppies,
    raceState,
    updatePuppyPositions,
    resetPuppies
  }
} 