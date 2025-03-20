/**
 * 调试小狗动画
 * 检查DOM中的小狗元素，并输出它们的状态和动画信息
 */
export function debugPuppyAnimations() {
  console.log('开始调试小狗动画...')
  
  // 获取所有小狗元素
  const puppies = document.querySelectorAll('.puppy')
  console.log(`找到 ${puppies.length} 个小狗元素`)
  
  // 检查每只小狗的状态
  puppies.forEach((puppy, index) => {
    const isRunning = puppy.classList.contains('running')
    const color = puppy.classList.contains('brown') ? 'brown' :
                  puppy.classList.contains('white') ? 'white' :
                  puppy.classList.contains('black') ? 'black' : 'spotted'
    
    console.log(`小狗 ${index + 1} (${color}):`)
    console.log(`- 正在运行: ${isRunning}`)
    
    // 获取位置信息
    const position = (puppy as HTMLElement).style.left
    console.log(`- 位置: ${position}`)
    
    // 检查动画应用情况
    const computedStyle = window.getComputedStyle(puppy)
    const animation = computedStyle.animation || computedStyle.webkitAnimation
    console.log(`- 动画: ${animation}`)
    
    // 检查子元素
    const legs = puppy.querySelectorAll('.puppy-leg')
    const ears = puppy.querySelectorAll('.puppy-ear')
    const tail = puppy.querySelector('.puppy-tail')
    
    console.log(`- 腿部元素: ${legs.length}`)
    console.log(`- 耳朵元素: ${ears.length}`)
    console.log(`- 尾巴元素: ${tail ? '存在' : '不存在'}`)
    
    // 检查腿部动画
    if (legs.length > 0) {
      const legComputedStyle = window.getComputedStyle(legs[0])
      const legAnimation = legComputedStyle.animation || legComputedStyle.webkitAnimation
      console.log(`- 腿部动画: ${legAnimation}`)
    }
    
    // 检查尾巴动画
    if (tail) {
      const tailComputedStyle = window.getComputedStyle(tail)
      const tailAnimation = tailComputedStyle.animation || tailComputedStyle.webkitAnimation
      console.log(`- 尾巴动画: ${tailAnimation}`)
    }
    
    console.log('---')
  })
  
  // 如果找不到小狗或小狗数量不正确
  if (puppies.length === 0) {
    console.error('未找到小狗元素')
  } else if (puppies.length !== 4) {
    console.warn(`预期找到4只小狗，但实际找到${puppies.length}只`)
  }
  
  console.log('小狗动画调试完成')
} 