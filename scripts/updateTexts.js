#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 配置对象 - 在这里修改需要替换的文本
const config = {
  // 旧名称和新名称
  oldName: 'Smart Terminal',
  newName: 'LLMonLinux',
  
  // 旧用户名和新用户名
  oldUserName: 'linuxpump',
  newUserName: 'LLMonLinux',
  
  // 需要处理的文件类型
  fileTypes: ['.tsx', '.ts', '.js', '.jsx', '.html'],
  
  // 需要排除的目录
  excludeDirs: ['node_modules', '.git', 'build', 'dist', 'coverage'],
  
  // 需要排除的文件
  excludeFiles: ['package-lock.json', 'yarn.lock']
};

// 递归查找文件
function findFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (!config.excludeDirs.includes(item)) {
        findFiles(fullPath, files);
      }
    } else if (stat.isFile()) {
      if (config.fileTypes.some(type => item.endsWith(type)) && 
          !config.excludeFiles.includes(item)) {
        files.push(fullPath);
      }
    }
  }
  
  return files;
}

// 替换文件内容
function replaceInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    // 替换各种模式
    const patterns = [
      // 基本替换
      { old: config.oldName, new: config.newName },
      { old: config.oldUserName, new: config.newUserName },
      
      // 带空格的替换
      { old: `${config.oldName} `, new: `${config.newName} ` },
      { old: ` ${config.oldName}`, new: ` ${config.newName}` },
      
      // 带标点符号的替换
      { old: `${config.oldName}.`, new: `${config.newName}.` },
      { old: `${config.oldName},`, new: `${config.newName},` },
      { old: `${config.oldName}!`, new: `${config.newName}!` },
      { old: `${config.oldName}?`, new: `${config.newName}?` },
      { old: `${config.oldName}:`, new: `${config.newName}:` },
      { old: `${config.oldName};`, new: `${config.newName};` },
      
      // 带换行的替换
      { old: `${config.oldName}\n`, new: `${config.newName}\n` },
      { old: `${config.oldName}\r\n`, new: `${config.newName}\r\n` },
      
      // 带引号的替换
      { old: `"${config.oldName}"`, new: `"${config.newName}"` },
      { old: `'${config.oldName}'`, new: `'${config.newName}'` },
      { old: `\`${config.oldName}\``, new: `\`${config.newName}\`` },
      
      // 带括号的替换
      { old: `(${config.oldName})`, new: `(${config.newName})` },
      { old: `[${config.oldName}]`, new: `[${config.newName}]` },
      { old: `{${config.oldName}}`, new: `{${config.newName}}` },
      
      // 特殊模式替换
      { old: `${config.oldName} world`, new: `${config.newName} world` },
      { old: `${config.oldName} Linux`, new: `${config.newName} Linux` },
      { old: `${config.oldName} Terminal`, new: `${config.newName} Terminal` },
      
      // 用户名相关替换
      { old: `${config.oldUserName}@`, new: `${config.newUserName}@` },
      { old: `@${config.oldUserName}`, new: `@${config.newUserName}` },
      { old: `${config.oldUserName} `, new: `${config.newUserName} ` },
      { old: ` ${config.oldUserName}`, new: ` ${config.newUserName}` }
    ];
    
    patterns.forEach(pattern => {
      if (content.includes(pattern.old)) {
        content = content.replace(new RegExp(pattern.old, 'g'), pattern.new);
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ 已更新: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ 处理文件失败 ${filePath}:`, error.message);
    return false;
  }
}

// 主函数
function main() {
  console.log('🚀 开始批量更新文本...');
  console.log(`📝 将 "${config.oldName}" 替换为 "${config.newName}"`);
  console.log(`👤 将 "${config.oldUserName}" 替换为 "${config.newUserName}"`);
  console.log('');
  
  const projectRoot = process.cwd();
  const files = findFiles(projectRoot);
  
  console.log(`📁 找到 ${files.length} 个文件需要处理`);
  console.log('');
  
  let updatedCount = 0;
  let totalCount = 0;
  
  for (const file of files) {
    totalCount++;
    if (replaceInFile(file)) {
      updatedCount++;
    }
  }
  
  console.log('');
  console.log('🎉 批量更新完成!');
  console.log(`📊 总计: ${totalCount} 个文件`);
  console.log(`✅ 已更新: ${updatedCount} 个文件`);
  console.log(`⏭️  无需更新: ${totalCount - updatedCount} 个文件`);
}

// 运行脚本
if (require.main === module) {
  main();
}

module.exports = { config, findFiles, replaceInFile };
