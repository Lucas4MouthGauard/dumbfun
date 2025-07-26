import React, { useState, useEffect, useRef } from 'react';
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
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // 像素艺术图案
  const pixelPatterns = [
    '█▀▀▀█\n█   █\n█▄▄▄█',
    '▄▄▄▄▄\n ▀▀▀ \n▄▄▄▄▄',
    '█▀▀▀█\n█▀▀▀█\n█▄▄▄█',
    '▀▀▀▀▀\n▄▄▄▄▄\n▀▀▀▀▀'
  ];

  // 矩阵雨效果字符
  const matrixChars = '｢｣ﾘｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789';

  // 初始化终端
  useEffect(() => {
    const initTerminal = async () => {
      await typeText('正在启动 DUMBFUN 终端系统...', 50);
      await typeText('正在加载笨蛋模块...', 30);
      await typeText('正在初始化像素艺术引擎...', 40);
      await typeText('正在连接矩阵网络...', 35);
      await typeText('系统启动完成！输入 "help" 查看可用命令', 20);
      setTerminalReady(true);
      inputRef.current?.focus();
    };

    initTerminal();
  }, []);

  // 矩阵雨效果
  useEffect(() => {
    const interval = setInterval(() => {
      const newRain = Array.from({ length: 20 }, () => 
        matrixChars[Math.floor(Math.random() * matrixChars.length)]
      );
      setMatrixRain(newRain);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // 像素艺术动画
  useEffect(() => {
    const interval = setInterval(() => {
      setPixelArt(prev => {
        const newArt = [...prev];
        if (newArt.length > 10) newArt.shift();
        newArt.push(pixelPatterns[Math.floor(Math.random() * pixelPatterns.length)]);
        return newArt;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const typeText = async (text: string, speed: number = 30) => {
    setIsTyping(true);
    let displayText = '';
    for (let i = 0; i < text.length; i++) {
      displayText += text[i];
      setCommands(prev => [...prev, {
        id: Date.now() + i,
        input: '',
        output: displayText,
        timestamp: new Date()
      }]);
      await new Promise(resolve => setTimeout(resolve, speed));
    }
    setIsTyping(false);
  };

  const executeCommand = async (input: string) => {
    const command = input.toLowerCase().trim();
    let output = '';

    // 添加命令到历史
    setCommands(prev => [...prev, {
      id: Date.now(),
      input: `> ${input}`,
      output: '',
      timestamp: new Date()
    }]);

    // 模拟命令执行延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    switch (command) {
      case 'help':
        output = `
可用命令列表：
- help: 显示此帮助信息
- clear: 清空终端
- matrix: 启动矩阵模式
- pixel: 显示像素艺术
- glitch: 触发故障效果
- dance: 让终端跳舞
- rainbow: 彩虹模式
- beep: 发出哔哔声
- random: 随机命令
- quit: 退出（但不会真的退出）
- ls: 列出文件（假的）
- cat: 显示文件内容（假的）
- sudo: 超级用户模式（假的）
- rm -rf: 删除所有（假的）
- ping: 网络测试（假的）
        `;
        break;

      case 'clear':
        setCommands([]);
        return;

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
        output = '💃 终端开始跳舞！🕺\n(╯°□°）╯︵ ┻━┻\n(ノಠ益ಠ)ノ彡┻━┻\n(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧';
        break;

      case 'rainbow':
        output = '🌈 彩虹模式启动！\n红橙黄绿蓝靛紫\n但这里只有文字...';
        break;

      case 'beep':
        output = '哔哔哔！\n哔！\n哔哔！\n（这只是文字，没有声音）';
        break;

      case 'random':
        const randomCommands = [
          '你输入了随机命令！',
          '这是一个随机的响应！',
          '随机性万岁！',
          '你永远不知道会发生什么！',
          '随机命令执行中...',
          '这是一个完全随机的消息！'
        ];
        output = randomCommands[Math.floor(Math.random() * randomCommands.length)];
        break;

      case 'quit':
        output = '你想退出？\n但是...\n你无法退出！\n这是一个网页！\n哈哈哈哈！';
        break;

      case 'ls':
        output = `
drwxr-xr-x  2 user  staff   68 Dec 25 12:00 .
drwxr-xr-x  3 user  staff  102 Dec 25 12:00 ..
-rw-r--r--  1 user  staff  123 Dec 25 12:00 fake_file.txt
-rw-r--r--  1 user  staff  456 Dec 25 12:00 another_fake.txt
drwxr-xr-x  2 user  staff   68 Dec 25 12:00 fake_directory
        `;
        break;

      case 'cat fake_file.txt':
        output = '这是一个假文件的内容。\n里面什么都没有，除了这些文字。\n你被骗了！';
        break;

      case 'sudo':
        output = '请输入密码：\n********\n密码错误！\n你永远无法获得超级用户权限！';
        break;

      case 'rm -rf':
        output = '你想删除所有文件？\n但是...\n这些都是假文件！\n删除失败！\n哈哈哈哈！';
        break;

      case 'ping':
        output = `
PING google.com (142.250.190.78): 56 data bytes
64 bytes from 142.250.190.78: icmp_seq=1 time=15.234 ms
64 bytes from 142.250.190.78: icmp_seq=2 time=14.567 ms
64 bytes from 142.250.190.78: icmp_seq=3 time=16.789 ms
--- google.com ping statistics ---
3 packets transmitted, 3 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 14.567/15.530/16.789/0.891 ms
        `;
        break;

      default:
        if (command.includes('sudo')) {
          output = '权限被拒绝！\n你无法执行此命令！\n哈哈哈哈！';
        } else if (command.includes('rm')) {
          output = '删除命令被阻止！\n这是为了保护你的假文件！';
        } else if (command.includes('cat')) {
          output = '文件不存在！\n或者你输入了错误的文件名！';
        } else {
          output = `命令未找到: ${input}\n输入 "help" 查看可用命令`;
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
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${1 + Math.random() * 2}s`
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
          <div className="terminal-title">DUMBFUN Terminal v1.0.0</div>
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
              <span className="prompt">dumbfun@terminal:~$ </span>
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
                  style={{ left: `${cursorPosition * 8 + 200}px` }}
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
