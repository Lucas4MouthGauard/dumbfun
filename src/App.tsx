import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

interface Command {
  id: number;
  input: string;
  output: string;
  timestamp: Date;
}

const App: React.FC = () => {
  const [commands, setCommands] = useState<Command[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [terminalReady, setTerminalReady] = useState(false);
  const [pixelArt, setPixelArt] = useState<string[]>([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [matrixRain, setMatrixRain] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState('dumbfun');
  const [currentHost, setCurrentHost] = useState('terminal');
  const [currentPath, setCurrentPath] = useState('~');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // 像素艺术图案 - 使用useMemo优化
  const pixelPatterns = useMemo(() => [
    '█▀▀▀█\n█   █\n█▄▄▄█',
    '▄▄▄▄▄\n ▀▀▀ \n▄▄▄▄▄',
    '█▀▀▀█\n█▀▀▀█\n█▄▄▄█',
    '▀▀▀▀▀\n▄▄▄▄▄\n▀▀▀▀▀'
  ], []);

  // 矩阵雨效果字符
  const matrixChars = '｢｣ﾘｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789';

  // 启动消息
  const startupMessages = [
    '正在启动 DUMBFUN Linux 终端系统...',
    '正在加载内核模块...',
    '系统启动完成！输入 "help" 查看可用命令'
  ];

  // 初始化终端
  useEffect(() => {
    const initTerminal = async () => {
      for (const message of startupMessages) {
        await typeText(message, 50);
      }
      setTerminalReady(true);
      inputRef.current?.focus();
    };

    initTerminal();
  }, [startupMessages]);

  // 矩阵雨效果 - 降低速度
  useEffect(() => {
    const interval = setInterval(() => {
      const newRain = Array.from({ length: 15 }, () => 
        matrixChars[Math.floor(Math.random() * matrixChars.length)]
      );
      setMatrixRain(newRain);
    }, 200);

    return () => clearInterval(interval);
  }, []);

  // 像素艺术动画 - 降低速度
  useEffect(() => {
    const interval = setInterval(() => {
      setPixelArt(prev => {
        const newArt = [...prev];
        if (newArt.length > 8) newArt.shift();
        newArt.push(pixelPatterns[Math.floor(Math.random() * pixelPatterns.length)]);
        return newArt;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [pixelPatterns]);

  const typeText = useCallback(async (text: string, speed: number = 30) => {
    setIsTyping(true);
    setCommands(prev => [...prev, {
      id: Date.now(),
      input: '',
      output: text,
      timestamp: new Date()
    }]);
    await new Promise(resolve => setTimeout(resolve, speed));
    setIsTyping(false);
  }, []);

  const executeCommand = async (input: string) => {
    const command = input.toLowerCase().trim();
    let output = '';

    // 添加到命令历史
    if (command) {
      setCommandHistory(prev => [...prev, command]);
      setHistoryIndex(-1);
    }

    // 添加命令到历史
    setCommands(prev => [...prev, {
      id: Date.now(),
      input: `[${new Date().toLocaleTimeString()}] ${currentUser}@${currentHost}:${currentPath}$ ${input}`,
      output: '',
      timestamp: new Date()
    }]);

    // 模拟命令执行延迟
    await new Promise(resolve => setTimeout(resolve, 200));

    // 常见命令处理
    switch (command) {
      case 'help':
        output = `
DUMBFUN Linux Terminal v1.0.0
可用命令列表：

基础命令：
- help: 显示此帮助信息
- clear: 清空终端
- whoami: 显示当前用户
- pwd: 显示当前路径
- ls: 列出文件
- date: 显示日期时间

娱乐命令：
- matrix: 启动矩阵模式
- pixel: 显示像素艺术
- glitch: 触发故障效果
- dance: 让终端跳舞
- fortune: 显示随机名言

其他命令：
- echo: 回显文本
- cat: 显示文件内容
- cd: 切换目录
- sudo: 超级用户模式（假的）
- quit: 退出（假的）

输入任何命令试试看！`;
        break;

      case 'clear':
        setCommands([]);
        return;

      case 'whoami':
        output = currentUser;
        break;

      case 'pwd':
        output = currentPath;
        break;

      case 'ls':
        output = `
total 8
drwxr-xr-x  2 ${currentUser}  staff   68 Dec 25 12:00 .
drwxr-xr-x  3 ${currentUser}  staff  102 Dec 25 12:00 ..
-rw-r--r--  1 ${currentUser}  staff  123 Dec 25 12:00 fake_file.txt
-rw-r--r--  1 ${currentUser}  staff  456 Dec 25 12:00 README.md
drwxr-xr-x  2 ${currentUser}  staff   68 Dec 25 12:00 fake_directory`;
        break;

      case 'ls -la':
        output = `
total 16
drwxr-xr-x  4 ${currentUser}  staff  136 Dec 25 12:00 .
drwxr-xr-x  3 ${currentUser}  staff  102 Dec 25 12:00 ..
-rw-r--r--  1 ${currentUser}  staff  123 Dec 25 12:00 fake_file.txt
-rw-r--r--  1 ${currentUser}  staff  456 Dec 25 12:00 README.md
drwxr-xr-x  2 ${currentUser}  staff   68 Dec 25 12:00 fake_directory`;
        break;

      case 'cd fake_directory':
        setCurrentPath('~/fake_directory');
        output = '';
        break;

      case 'cd ..':
        setCurrentPath('~');
        output = '';
        break;

      case 'cd':
        setCurrentPath('~');
        output = '';
        break;

      case 'cat fake_file.txt':
        output = `这是一个假文件的内容。
里面什么都没有，除了这些文字。
你被骗了！

文件大小: 123 bytes
最后修改: Dec 25 12:00:00 2024`;
        break;

      case 'cat readme.md':
      case 'cat README.md':
        output = `# DUMBFUN Terminal

这是一个假的README文件。
实际上这个终端里所有的文件都是假的！
哈哈哈哈！

## 特性
- 完全模拟Linux终端
- 支持基本文件操作命令
- 包含娱乐命令
- 所有系统命令都是假的

## 作者
DUMBFUN Team`;
        break;

      case 'date':
        output = new Date().toString();
        break;

      case 'matrix':
        output = '进入矩阵模式...';
        setGlitchEffect(true);
        setTimeout(() => setGlitchEffect(false), 3000);
        break;

      case 'pixel':
        output = '生成像素艺术...\n' + pixelPatterns[Math.floor(Math.random() * pixelPatterns.length)];
        break;

      case 'glitch':
        output = '触发故障效果...';
        setGlitchEffect(true);
        setTimeout(() => setGlitchEffect(false), 2000);
        break;

      case 'dance':
        output = `💃 终端开始跳舞！🕺
(╯°□°）╯︵ ┻━┻
(ノಠ益ಠ)ノ彡┻━┻
(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧
┻━┻ ︵ヽ(\`Д´)ﾉ︵﻿ ┻━┻`;
        break;

      case 'fortune':
        const fortunes = [
          '今天是个好日子！',
          '代码写得好，bug少不了！',
          '程序员最讨厌的事情：写文档！',
          '最好的代码是没有代码！',
          '调试比写代码难两倍！',
          '时间就是金钱，我的朋友！',
          '保持简单，保持愚蠢！',
          '如果它没坏，就不要修它！'
        ];
        output = fortunes[Math.floor(Math.random() * fortunes.length)];
        break;

      case 'quit':
      case 'exit':
        output = `你想退出？
但是...
你无法退出！
这是一个网页！
哈哈哈哈！
按 Ctrl+C 试试看！`;
        break;

      case 'sudo':
        output = `请输入密码：
********
密码错误！
你永远无法获得超级用户权限！
哈哈哈哈！`;
        break;

      case 'rm -rf':
      case 'rm -rf /':
        output = `你想删除所有文件？
但是...
这些都是假文件！
删除失败！
哈哈哈哈！
系统保护机制启动！`;
        break;

      case 'ping':
      case 'ping google.com':
        output = `
PING google.com (142.250.190.78): 56 data bytes
64 bytes from 142.250.190.78: icmp_seq=1 time=15.234 ms
64 bytes from 142.250.190.78: icmp_seq=2 time=14.567 ms
64 bytes from 142.250.190.78: icmp_seq=3 time=16.789 ms
--- google.com ping statistics ---
3 packets transmitted, 3 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 14.567/15.530/16.789/0.891 ms`;
        break;

      case 'top':
        output = `top - 12:34:56 up 2:34, 1 user, load average: 0.15, 0.12, 0.08
Tasks: 45 total, 1 running, 44 sleeping, 0 stopped, 0 zombie
%Cpu(s): 2.3 us, 1.2 sy, 0.0 ni, 96.5 id, 0.0 wa, 0.0 hi, 0.0 si, 0.0 st
MiB Mem : 8192.0 total, 2048.0 free, 3072.0 used, 3072.0 buff/cache
MiB Swap: 0.0 total, 0.0 free, 0.0 used. 4096.0 avail Mem

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
 1234 ${currentUser}  20   0  1234567  123456  12345 S   2.3   1.5   0:12.34 dumbfun-terminal
 5678 ${currentUser}  20   0   987654   98765   9876 S   1.2   1.2   0:05.67 matrix-rain
 9012 ${currentUser}  20   0   654321   65432   6543 S   0.8   0.8   0:03.45 pixel-art`;
        break;

      case 'ps':
      case 'ps aux':
        output = `USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
${currentUser}     1234  2.3  1.5 1234567 123456 ?        S    10:00   0:12 dumbfun-terminal
${currentUser}     5678  1.2  1.2  987654  98765 ?        S    10:01   0:05 matrix-rain
${currentUser}     9012  0.8  0.8  654321  65432 ?        S    10:02   0:03 pixel-art
${currentUser}     3456  0.5  0.5  432109  43210 ?        S    10:03   0:01 glitch-effect`;
        break;

      case 'kill':
      case 'kill 1234':
        output = `kill: cannot kill process 1234: Operation not permitted
这是一个假进程，你无法终止它！`;
        break;

      case 'chmod':
      case 'chmod 777':
      case 'chmod 777 fake_file.txt':
        output = `chmod: changing permissions of 'fake_file.txt': Operation not permitted
这是一个假文件，你无法修改权限！`;
        break;

      case 'tar':
      case 'tar -czf':
      case 'tar -czf backup.tar.gz':
        output = `tar: Cannot stat: No such file or directory
tar: Error exit delayed from previous errors.
这些假文件无法压缩！`;
        break;

      case 'reboot':
        output = `reboot: Need to be root
你需要超级用户权限来重启系统！
但是...这是一个网页！`;
        break;

      case 'shutdown':
        output = `shutdown: Need to be root
你需要超级用户权限来关机！
但是...这是一个网页！`;
        break;

      case 'vim':
      case 'nano':
      case 'emacs':
        output = `Sorry，这是DumbFun，无法解析你的命令。
我们只支持简单的文本查看，不支持复杂的编辑器！`;
        break;

      case 'git':
      case 'git status':
      case 'git commit':
        output = `Sorry，这是DumbFun，无法解析你的命令。
这里没有Git，只有假文件！`;
        break;

      case 'docker':
      case 'docker ps':
      case 'docker run':
        output = `Sorry，这是DumbFun，无法解析你的命令。
这里没有Docker，只有假进程！`;
        break;

      case 'npm':
      case 'npm install':
      case 'npm start':
        output = `Sorry，这是DumbFun，无法解析你的命令。
这里没有Node.js，只有假系统！`;
        break;

      case 'python':
      case 'python3':
      case 'python script.py':
        output = `Sorry，这是DumbFun，无法解析你的命令。
这里没有Python，只有假终端！`;
        break;

      case 'node':
      case 'node app.js':
        output = `Sorry，这是DumbFun，无法解析你的命令。
这里没有Node.js，只有假环境！`;
        break;

      case 'ssh':
      case 'ssh user@host':
        output = `Sorry，这是DumbFun，无法解析你的命令。
这里没有网络连接，只有假终端！`;
        break;

      case 'wget':
      case 'curl':
        output = `Sorry，这是DumbFun，无法解析你的命令。
这里没有网络功能，只有假文件！`;
        break;

      case 'apt':
      case 'apt install':
      case 'yum':
      case 'yum install':
        output = `Sorry，这是DumbFun，无法解析你的命令。
这里没有包管理器，只有假系统！`;
        break;

      case 'systemctl':
      case 'service':
        output = `Sorry，这是DumbFun，无法解析你的命令。
这里没有系统服务，只有假进程！`;
        break;

      case 'crontab':
      case 'at':
        output = `Sorry，这是DumbFun，无法解析你的命令。
这里没有定时任务，只有假时间！`;
        break;

      default:
        if (command.startsWith('echo ')) {
          output = command.substring(5);
        } else if (command.startsWith('cd ')) {
          output = `bash: cd: ${command.substring(3)}: No such file or directory`;
        } else if (command.startsWith('cat ')) {
          output = `cat: ${command.substring(4)}: No such file or directory`;
        } else if (command.startsWith('sudo ')) {
          output = '权限被拒绝！\n你无法执行此命令！\n哈哈哈哈！';
        } else if (command.includes('rm')) {
          output = '删除命令被阻止！\n这是为了保护你的假文件！';
        } else if (command.startsWith('ping ')) {
          output = `ping: cannot resolve ${command.substring(5)}: Unknown host`;
        } else if (command.startsWith('kill ')) {
          output = `kill: cannot kill process ${command.substring(5)}: No such process`;
        } else if (command.startsWith('chmod ')) {
          output = `chmod: changing permissions of '${command.substring(6)}': Operation not permitted`;
        } else if (command.startsWith('tar ')) {
          output = 'tar: Cannot stat: No such file or directory';
        } else if (command) {
          output = `Sorry，这是DumbFun，无法解析你的命令 "${command}"。
输入 "help" 查看可用命令。`;
        }
    }

    // 添加输出到命令历史
    setCommands(prev => [...prev, {
      id: Date.now() + 1,
      input: '',
      output,
      timestamp: new Date()
    }]);

    // 滚动到底部
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentInput.trim()) {
      executeCommand(currentInput);
      setCurrentInput('');
      setCursorPosition(0);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
        setCursorPosition(commandHistory[commandHistory.length - 1 - newIndex].length);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
        setCursorPosition(commandHistory[commandHistory.length - 1 - newIndex].length);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
        setCursorPosition(0);
      }
    } else if (e.key === 'ArrowLeft') {
      setCursorPosition(prev => Math.max(0, prev - 1));
    } else if (e.key === 'ArrowRight') {
      setCursorPosition(prev => Math.min(currentInput.length, prev + 1));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value);
    setCursorPosition(e.target.value.length);
  };

  return (
    <div className={`App ${glitchEffect ? 'glitch' : ''}`}>
      {/* 矩阵雨背景 */}
      <div className="matrix-rain">
        {matrixRain.map((char, index) => (
          <span key={index} style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}>
            {char}
          </span>
        ))}
      </div>

      {/* 像素艺术装饰 */}
      <div className="pixel-art-container">
        {pixelArt.map((art, index) => (
          <motion.pre
            key={index}
            className="pixel-art"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.5 }}
          >
            {art}
          </motion.pre>
        ))}
      </div>

      <div className="terminal-container">
        <div className="terminal-header">
          <div className="terminal-buttons">
            <span className="terminal-button close"></span>
            <span className="terminal-button minimize"></span>
            <span className="terminal-button maximize"></span>
          </div>
          <div className="terminal-title">DUMBFUN Linux Terminal v1.0.0</div>
        </div>

        <div className="terminal-body" ref={terminalRef}>
          <div className="terminal-content">
            {commands.map((cmd) => (
              <div key={cmd.id} className="command-line">
                {cmd.input && <div className="command-input">{cmd.input}</div>}
                {cmd.output && <pre className="command-output">{cmd.output}</pre>}
              </div>
            ))}
            
            {isTyping && (
              <div className="typing-indicator">
                <span className="typing-dots">正在输入</span>
                <span className="dot">.</span>
                <span className="dot">.</span>
                <span className="dot">.</span>
              </div>
            )}

            <div className="current-line">
              <span className="prompt">[{new Date().toLocaleTimeString()}] {currentUser}@{currentHost}:{currentPath}$ </span>
              <div className="input-container">
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className="command-input-field"
                  disabled={!terminalReady || isTyping}
                  autoFocus
                />
                <span 
                  className="cursor"
                  style={{ left: `${cursorPosition * 8 + 350}px` }}
                ></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 故障效果覆盖层 */}
      <AnimatePresence>
        {glitchEffect && (
          <motion.div
            className="glitch-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <div className="glitch-line"></div>
            <div className="glitch-line"></div>
            <div className="glitch-line"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
