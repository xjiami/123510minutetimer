// 动画调试脚本
// 在浏览器控制台中运行这个函数来检查和修复动画问题

function debugPuppyAnimations() {
  console.log('===== 小狗动画调试工具 =====');
  
  // 获取所有小狗元素
  const puppies = document.querySelectorAll('.puppy');
  console.log(`找到 ${puppies.length} 个小狗元素`);
  
  if (puppies.length === 0) {
    console.error('未找到小狗元素，请确保DOM已渲染');
    return '未找到小狗元素';
  }
  
  // 检查CSS动画是否已正确定义
  const styleSheets = document.styleSheets;
  let animationsFound = {};
  let requiredAnimations = ['puppy-run', 'leg-run', 'tail-wag', 'ear-flop', 'puppy-celebrate'];
  let missingAnimations = [...requiredAnimations];
  
  for (let i = 0; i < styleSheets.length; i++) {
    try {
      const rules = styleSheets[i].cssRules || styleSheets[i].rules;
      if (!rules) continue;
      
      for (let j = 0; j < rules.length; j++) {
        const rule = rules[j];
        if (rule.type === CSSRule.KEYFRAMES_RULE) {
          animationsFound[rule.name] = true;
          const index = missingAnimations.indexOf(rule.name);
          if (index > -1) {
            missingAnimations.splice(index, 1);
          }
        }
      }
    } catch (e) {
      console.log('无法访问样式表:', e);
    }
  }
  
  console.log('找到的动画:', Object.keys(animationsFound));
  
  if (missingAnimations.length > 0) {
    console.warn('缺少以下动画定义:', missingAnimations);
    
    // 创建缺失的动画
    const style = document.createElement('style');
    style.id = 'debug-puppy-animations';
    
    let css = '';
    if (missingAnimations.includes('puppy-run')) {
      css += `
        @keyframes puppy-run {
          0% { transform: translateY(0); }
          25% { transform: translateY(-5px); }
          50% { transform: translateY(0); }
          75% { transform: translateY(-5px); }
          100% { transform: translateY(0); }
        }
      `;
    }
    
    if (missingAnimations.includes('leg-run')) {
      css += `
        @keyframes leg-run {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(45deg); }
          100% { transform: rotate(0deg); }
        }
      `;
    }
    
    if (missingAnimations.includes('tail-wag')) {
      css += `
        @keyframes tail-wag {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(20deg); }
          100% { transform: rotate(0deg); }
        }
      `;
    }
    
    if (missingAnimations.includes('ear-flop')) {
      css += `
        @keyframes ear-flop {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(-15deg); }
          100% { transform: rotate(0deg); }
        }
      `;
    }
    
    if (missingAnimations.includes('puppy-celebrate')) {
      css += `
        @keyframes puppy-celebrate {
          0% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-15px) scale(1.1); }
          100% { transform: translateY(0) scale(1); }
        }
      `;
    }
    
    if (css) {
      // 删除旧的调试样式
      const oldStyle = document.getElementById('debug-puppy-animations');
      if (oldStyle) {
        oldStyle.remove();
      }
      
      style.textContent = css;
      document.head.appendChild(style);
      console.log('已添加缺失的动画定义');
    }
  }
  
  // 检查小狗元素的类名和样式
  puppies.forEach((puppy, index) => {
    const classList = Array.from(puppy.classList);
    const style = puppy.getAttribute('style') || '';
    const computedStyle = window.getComputedStyle(puppy);
    
    console.log(`小狗 #${index + 1}:`, {
      classList,
      style,
      animation: computedStyle.animation,
      position: computedStyle.position,
      left: computedStyle.left
    });
    
    // 检查子元素
    const legs = puppy.querySelectorAll('.puppy-leg');
    const ears = puppy.querySelectorAll('.puppy-ear');
    const tail = puppy.querySelector('.puppy-tail');
    
    console.log(`  - 腿部元素: ${legs.length}`);
    console.log(`  - 耳朵元素: ${ears.length}`);
    console.log(`  - 尾巴元素: ${tail ? '存在' : '不存在'}`);
    
    // 检测是否为'running'或'finished'状态但没有动画
    const hasRunningClass = classList.includes('running');
    const hasFinishedClass = classList.includes('finished');
    const hasAnimation = computedStyle.animation !== 'none';
    
    if ((hasRunningClass || hasFinishedClass) && !hasAnimation) {
      console.warn(`小狗 #${index + 1} 状态为 ${hasRunningClass ? 'running' : 'finished'} 但没有动画`);
    }
  });
  
  // 应用临时修复
  console.log('===== 应用临时修复 =====');
  
  // 强制重新加载样式
  const links = document.querySelectorAll('link[rel="stylesheet"]');
  links.forEach(link => {
    console.log(`尝试重加载样式: ${link.href}`);
    const href = link.href;
    link.href = '';
    setTimeout(() => { link.href = href; }, 10);
  });
  
  // 为所有小狗应用内联动画
  puppies.forEach((puppy, index) => {
    const el = puppy;
    const classList = Array.from(puppy.classList);
    
    // 获取小狗状态
    const isRunning = classList.includes('running') || 
                     classList.includes('brown') && el.getAttribute('style')?.includes('animation') === false;
    const isFinished = classList.includes('finished');
    
    console.log(`修复小狗 #${index + 1} - 运行: ${isRunning}, 完成: ${isFinished}`);
    
    if (isRunning) {
      // 添加运行动画
      el.style.animation = 'puppy-run 1s infinite';
      
      // 为腿部添加动画
      const legs = el.querySelectorAll('.puppy-leg');
      legs.forEach(leg => {
        leg.style.animation = 'leg-run 0.5s infinite';
      });
      
      // 为尾巴添加动画
      const tail = el.querySelector('.puppy-tail');
      if (tail) {
        tail.style.animation = 'tail-wag 0.8s infinite';
      }
      
      // 为耳朵添加动画
      const ears = el.querySelectorAll('.puppy-ear');
      ears.forEach(ear => {
        ear.style.animation = 'ear-flop 0.6s infinite alternate';
      });
    } else if (isFinished) {
      // 添加庆祝动画
      el.style.animation = 'puppy-celebrate 1.2s infinite';
    }
    
    console.log(`已为小狗 #${index + 1} 应用临时动画`);
  });
  
  // 添加CSS类触发动画
  puppies.forEach((puppy, index) => {
    const forceRun = puppy.classList.contains('brown') && !puppy.classList.contains('running');
    if (forceRun) {
      console.log(`为小狗 #${index + 1} 强制添加 running 类`);
      puppy.classList.add('force-running');
      
      // 添加触发运行状态的样式
      const style = document.createElement('style');
      style.id = 'debug-force-running';
      style.textContent = `
        .force-running {
          animation: puppy-run 1s infinite !important;
        }
        .force-running .puppy-leg {
          animation: leg-run 0.5s infinite !important;
        }
        .force-running .puppy-tail {
          animation: tail-wag 0.8s infinite !important;
        }
        .force-running .puppy-ear {
          animation: ear-flop 0.6s infinite alternate !important;
        }
      `;
      document.head.appendChild(style);
    }
  });
  
  // 修复建议
  console.log('===== 修复建议 =====');
  console.log('1. 确保CSS文件正确导入，检查网络请求是否成功');
  console.log('2. 检查小狗状态属性是否正确传递给组件');
  console.log('3. 确保响应式数据正确更新触发视图渲染');
  console.log('4. 考虑直接使用内联样式而非类名来应用动画');
  
  return '调试完成，已应用临时修复';
}

// 每秒监控小狗状态
function monitorPuppyAnimations() {
  console.log('开始监控小狗动画状态...');
  return setInterval(() => {
    const runningPuppies = document.querySelectorAll('.puppy.running, .puppy[style*="animation"]');
    if (runningPuppies.length > 0) {
      console.log(`发现 ${runningPuppies.length} 个运行中的小狗`);
      runningPuppies.forEach((puppy, index) => {
        const computedStyle = window.getComputedStyle(puppy);
        console.log(`小狗 #${index + 1} 动画: ${computedStyle.animation || 'none'}`);
      });
    }
  }, 1000);
}

// 导出函数以便可以在Vue组件中导入
export { debugPuppyAnimations, monitorPuppyAnimations };

// 添加到全局作用域，以便可以在控制台中使用
if (typeof window !== 'undefined') {
  window.debugPuppyAnimations = debugPuppyAnimations;
  window.monitorPuppyAnimations = monitorPuppyAnimations;
} 