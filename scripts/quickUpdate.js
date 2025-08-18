#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 快速更新配置 - 在这里修改需要更新的内容
const quickUpdateConfig = {
  // 应用名称更新
  appName: {
    old: 'Smart Terminal',
    new: 'LLMonLinux'
  },
  
  // 用户名更新
  userName: {
    old: 'linuxpump',
    new: 'LLMonLinux'
  },
  
  // 特殊命令输出更新
  specialCommands: {
    ca: '34RuW2ZdP2HmXezXn91Hh8fXFoTQEQudi2q4nitLpump',
    x: '@https://x.com/LLMonLinux',
    twitter: '@https://x.com/LLMonLinux'
  },
  
  // 常用文本更新
  commonTexts: [
    {
      old: 'Smart Terminal world',
      new: 'LLMonLinux world'
    },
    {
      old: 'Smart Terminal Linux',
      new: 'LLMonLinux Linux'
    },
    {
      old: 'Smart Terminal interface',
      new: 'LLMonLinux interface'
    },
    {
      old: 'Smart Terminal rules',
      new: 'LLMonLinux rules'
    }
  ]
};

// 更新App.tsx文件
function updateAppTsx() {
  const filePath = path.join(process.cwd(), 'src', 'App.tsx');
  
  if (!fs.existsSync(filePath)) {
    console.log('❌ 找不到 src/App.tsx 文件');
    return false;
  }
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    // 更新应用名称
    if (content.includes(quickUpdateConfig.appName.old)) {
      content = content.replace(new RegExp(quickUpdateConfig.appName.old, 'g'), quickUpdateConfig.appName.new);
      hasChanges = true;
    }
    
    // 更新用户名
    if (content.includes(quickUpdateConfig.userName.old)) {
      content = content.replace(new RegExp(quickUpdateConfig.userName.old, 'g'), quickUpdateConfig.userName.new);
      hasChanges = true;
    }
    
    // 更新常用文本
    quickUpdateConfig.commonTexts.forEach(text => {
      if (content.includes(text.old)) {
        content = content.replace(new RegExp(text.old, 'g'), text.new);
        hasChanges = true;
      }
    });
    
    // 更新特殊命令输出
    Object.entries(quickUpdateConfig.specialCommands).forEach(([command, output]) => {
      const pattern = `case '${command}':\\s*output = '[^']*';`;
      const replacement = `case '${command}':\n        output = '${output}';`;
      
      if (content.includes(`case '${command}':`)) {
        // 查找并替换命令输出
        const regex = new RegExp(`(case '${command}':\\s*)(output = '[^']*';)`, 'g');
        if (regex.test(content)) {
          content = content.replace(regex, `$1\n        output = '${output}';`);
          hasChanges = true;
        }
      }
    });
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('✅ 已更新 src/App.tsx');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ 更新 App.tsx 失败:', error.message);
    return false;
  }
}

// 更新index.html文件
function updateIndexHtml() {
  const filePath = path.join(process.cwd(), 'public', 'index.html');
  
  if (!fs.existsSync(filePath)) {
    console.log('❌ 找不到 public/index.html 文件');
    return false;
  }
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    // 更新标题
    if (content.includes('<title>Smart Terminal</title>')) {
      content = content.replace('<title>Smart Terminal</title>', '<title>LLMonLinux</title>');
      hasChanges = true;
    }
    
    // 更新图标路径（如果需要）
    if (content.includes('linuxpump.png')) {
      content = content.replace(/linuxpump\.png/g, 'linuxcul.png');
      hasChanges = true;
    }
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('✅ 已更新 public/index.html');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ 更新 index.html 失败:', error.message);
    return false;
  }
}

// 主函数
function main() {
  console.log('🚀 开始快速更新...');
  console.log('');
  
  let totalChanges = 0;
  
  // 更新App.tsx
  if (updateAppTsx()) {
    totalChanges++;
  }
  
  // 更新index.html
  if (updateIndexHtml()) {
    totalChanges++;
  }
  
  console.log('');
  if (totalChanges > 0) {
    console.log(`🎉 快速更新完成! 共更新了 ${totalChanges} 个文件`);
  } else {
    console.log('✨ 所有文件都是最新的，无需更新');
  }
}

// 运行脚本
if (require.main === module) {
  main();
}

module.exports = { quickUpdateConfig, updateAppTsx, updateIndexHtml };
