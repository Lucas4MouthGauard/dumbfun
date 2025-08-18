# 文本快速更新指南

这个项目现在包含了快速更新文本的工具，让您可以在几秒钟内完成文本更新，而不需要手动搜索和替换。

## 🚀 快速开始

### 方法1: 使用快速更新脚本（推荐）
```bash
npm run quick-update
```

这个脚本会快速更新最常用的文本，包括：
- 应用名称
- 用户名
- 特殊命令输出
- 常用文本

### 方法2: 使用完整批量更新脚本
```bash
npm run update-texts
```

这个脚本会扫描整个项目并替换所有匹配的文本。

## 📝 如何修改配置

### 修改快速更新配置
编辑 `scripts/quickUpdate.js` 文件中的 `quickUpdateConfig` 对象：

```javascript
const quickUpdateConfig = {
  // 应用名称更新
  appName: {
    old: 'Smart Terminal',        // 旧名称
    new: 'LLMonLinux'            // 新名称
  },
  
  // 用户名更新
  userName: {
    old: 'linuxpump',            // 旧用户名
    new: 'LLMonLinux'            // 新用户名
  },
  
  // 特殊命令输出更新
  specialCommands: {
    ca: '34RuW2ZdP2HmXezXn91Hh8fXFoTQEQudi2q4nitLpump',
    x: '@https://x.com/LLMonLinux',
    twitter: '@https://x.com/LLMonLinux'
  }
};
```

### 修改完整更新配置
编辑 `scripts/updateTexts.js` 文件中的 `config` 对象：

```javascript
const config = {
  oldName: 'Smart Terminal',      // 旧名称
  newName: 'LLMonLinux',         // 新名称
  oldUserName: 'linuxpump',      // 旧用户名
  newUserName: 'LLMonLinux'      // 新用户名
};
```

## 🔧 使用场景

### 场景1: 更改应用名称
1. 修改配置文件中的 `oldName` 和 `newName`
2. 运行 `npm run quick-update`
3. 完成！

### 场景2: 更改用户名
1. 修改配置文件中的 `oldUserName` 和 `newUserName`
2. 运行 `npm run quick-update`
3. 完成！

### 场景3: 更改特殊命令输出
1. 修改配置文件中的 `specialCommands` 对象
2. 运行 `npm run quick-update`
3. 完成！

### 场景4: 批量更改所有文本
1. 修改配置文件
2. 运行 `npm run update-texts`
3. 完成！

## 📁 文件结构

```
scripts/
├── updateTexts.js      # 完整批量更新脚本
├── quickUpdate.js      # 快速更新脚本
└── ...

src/
├── config/
│   └── textConfig.ts   # 文本配置文件
└── App.tsx             # 主应用文件

public/
└── index.html          # HTML文件
```

## ⚡ 性能对比

| 方法 | 耗时 | 适用场景 |
|------|------|----------|
| 手动搜索替换 | 10-30分钟 | 偶尔更新 |
| 快速更新脚本 | 5-10秒 | 常用更新 |
| 完整批量更新 | 10-30秒 | 全面更新 |

## 🎯 最佳实践

1. **日常更新**: 使用 `npm run quick-update`
2. **重大更改**: 使用 `npm run update-texts`
3. **配置管理**: 将常用配置保存在配置文件中
4. **版本控制**: 更新后及时提交到Git

## 🚨 注意事项

1. 运行脚本前请确保已保存所有更改
2. 建议在运行脚本前先提交当前更改到Git
3. 脚本会自动备份和替换文件内容
4. 如果遇到错误，检查文件路径和权限

## 🔍 故障排除

### 问题1: 脚本无法运行
```bash
# 确保脚本有执行权限
chmod +x scripts/*.js

# 或者使用node直接运行
node scripts/quickUpdate.js
```

### 问题2: 找不到文件
- 确保在项目根目录运行脚本
- 检查文件路径是否正确

### 问题3: 权限错误
```bash
# 使用sudo运行（如果需要）
sudo npm run quick-update
```

## 📞 支持

如果您在使用过程中遇到问题，可以：
1. 检查控制台错误信息
2. 查看脚本的日志输出
3. 确认配置文件格式正确

---

**现在您可以在几秒钟内完成文本更新，而不是花费几十分钟！** 🎉
