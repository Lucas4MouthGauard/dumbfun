// LLMonLinux 文本配置
export const textConfig = {
  // 应用名称
  appName: 'LLMonLinux',
  appNameOld: 'Smart Terminal',
  
  // 用户名称
  userName: 'LLMonLinux',
  userNameOld: 'linuxpump',
  
  // 终端标题
  terminalTitle: 'LLMonLinux v1.0.0',
  terminalTitleOld: 'Smart Terminal Linux v1.0.0',
  
  // 指南标题
  guideTitle: '=== LLMONLINUX GUIDE ===',
  guideTitleOld: '=== SMART TERMINAL GUIDE ===',
  
  // 说明文本
  instructions: 'This is the LLMonLinux interface. You can input any Linux command, and I will respond according to LLMonLinux rules.',
  instructionsOld: 'This is the Smart Terminal interface. You can input any Linux command, and I will respond according to Smart Terminal rules.',
  
  // 命令输出中的文本
  commandOutputs: {
    help: {
      new: 'LLMonLinux v1.0.0 - The Smartest Terminal System 🤪',
      old: 'Smart Terminal Linux v1.0.0 - The Smartest Terminal System 🤪'
    },
    whoami: {
      new: 'LLMonLinux (a happy smart user)',
      old: 'linuxpump (a happy smart user)'
    },
    ls: {
      new: 'LLMonLinux',
      old: '${currentUser}'
    },
    readme: {
      new: '# LLMonLinux 🤪',
      old: '# Smart Terminal 🤪'
    },
    smartThoughts: {
      new: '🤔 LLMonLinux Philosophy Thoughts 🤔',
      old: '🤔 Smart Terminal Philosophy Thoughts 🤔'
    },
    aiConfessions: {
      new: 'In the LLMonLinux world, I can finally admit I\'m smart!',
      old: 'In the Smart Terminal world, I can finally admit I\'m smart!'
    },
    fakeFile: {
      new: 'In the LLMonLinux world, even files are fake!',
      old: 'In the Smart Terminal world, even files are fake!'
    },
    date: {
      new: 'In the LLMonLinux world, time is happiness!',
      old: 'In the Smart Terminal world, time is happiness!'
    },
    glitch: {
      new: 'In the LLMonLinux world, glitches are art!',
      old: 'In the Smart Terminal world, glitches are art!'
    },
    dance: {
      new: 'In the LLMonLinux world, even terminals can dance!',
      old: 'In the Smart Terminal world, even terminals can dance!'
    },
    philosophy: {
      new: '🤪 LLMonLinux Philosophy Class! 🤪',
      old: '🤪 Smart Terminal Philosophy Class! 🤪'
    }
  },
  
  // 特殊命令输出
  specialCommands: {
    ca: '34RuW2ZdP2HmXezXn91Hh8fXFoTQEQudi2q4nitLpump',
    x: '@https://x.com/LLMonLinux',
    twitter: '@https://x.com/LLMonLinux'
  },
  
  // 批量替换的文本模式
  replacePatterns: [
    {
      old: 'Smart Terminal',
      new: 'LLMonLinux'
    },
    {
      old: 'Smart Terminal world',
      new: 'LLMonLinux world'
    },
    {
      old: 'Smart Terminal world,',
      new: 'LLMonLinux world,'
    },
    {
      old: 'Smart Terminal world.',
      new: 'LLMonLinux world.'
    },
    {
      old: 'Smart Terminal world!',
      new: 'LLMonLinux world!'
    },
    {
      old: 'Smart Terminal world?',
      new: 'LLMonLinux world?'
    },
    {
      old: 'Smart Terminal world:',
      new: 'LLMonLinux world:'
    },
    {
      old: 'Smart Terminal world;',
      new: 'LLMonLinux world;'
    },
    {
      old: 'Smart Terminal world\n',
      new: 'LLMonLinux world\n'
    },
    {
      old: 'Smart Terminal world\n\n',
      new: 'LLMonLinux world\n\n'
    }
  ]
};

// 批量替换函数
export const batchReplaceText = (text: string): string => {
  let result = text;
  
  // 应用所有替换模式
  textConfig.replacePatterns.forEach(pattern => {
    result = result.replace(new RegExp(pattern.old, 'g'), pattern.new);
  });
  
  return result;
};

// 更新命令输出的辅助函数
export const updateCommandOutput = (output: string, commandType: keyof typeof textConfig.commandOutputs): string => {
  const config = textConfig.commandOutputs[commandType];
  if (config) {
    return output.replace(config.old, config.new);
  }
  return output;
};
