import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import './App.css';

const App: React.FC = () => {
  const [clickCount, setClickCount] = useState(0);
  const [isConfused, setIsConfused] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [randomEmoji, setRandomEmoji] = useState('🤪');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const emojis = ['🤪', '🤡', '😵', '🤯', '🥴', '🤔', '🤷‍♂️', '💩', '🎭', '🤖'];

  // 弹簧动画效果
  const springProps = useSpring({
    to: { scale: isConfused ? 1.2 : 1 },
    config: { tension: 300, friction: 10 }
  });

  // 鼠标跟随效果
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleConfusedClick = () => {
    setClickCount(prev => prev + 1);
    setIsConfused(true);
    setRandomEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
    
    setTimeout(() => setIsConfused(false), 500);
    
    if (clickCount >= 9) {
      setShowEasterEgg(true);
      setTimeout(() => setShowEasterEgg(false), 3000);
    }
  };

  const handleButtonHover = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
    audio.play().catch(() => {}); // 忽略错误
  };

  return (
    <div className="App">
      {/* 背景装饰 */}
      <div className="background-decoration">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-emoji"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            {emojis[Math.floor(Math.random() * emojis.length)]}
          </motion.div>
        ))}
      </div>

      {/* 鼠标跟随的"笨蛋"指示器 */}
      <motion.div
        className="mouse-follower"
        animate={{
          x: mousePosition.x - 25,
          y: mousePosition.y - 25,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        🤪
      </motion.div>

      <header className="App-header">
        <motion.h1
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          DUMBFUN 🤪
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          欢迎来到最笨蛋的网页！准备好被逗笑了吗？
        </motion.p>
      </header>

      <main className="main-content">
        {/* 主要交互按钮 */}
        <section className="interaction-section">
          <animated.button
            style={springProps}
            className="confused-button"
            onClick={handleConfusedClick}
            onMouseEnter={handleButtonHover}
          >
            <span className="button-text">点击我！我是笨蛋按钮！</span>
            <span className="emoji-display">{randomEmoji}</span>
          </animated.button>
          
          <p className="click-counter">
            你已经点击了 {clickCount} 次！{clickCount > 5 && '你真的很无聊...'}
          </p>
        </section>

        {/* 随机颜色方块 */}
        <section className="color-blocks">
          <h3>点击这些方块，它们会变色！</h3>
          <div className="blocks-container">
            {[...Array(9)].map((_, i) => (
              <ColorBlock key={i} />
            ))}
          </div>
        </section>

        {/* 文字动画区域 */}
        <section className="text-animation">
          <TypingText text="这是一个超级笨蛋的网页，充满了无意义的交互！" />
        </section>

        {/* 倒计时器 */}
        <section className="countdown-section">
          <CountdownTimer />
        </section>
      </main>

      {/* 复活节彩蛋 */}
      <AnimatePresence>
        {showEasterEgg && (
          <motion.div
            className="easter-egg"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <h2>🎉 恭喜你！你找到了复活节彩蛋！</h2>
            <p>你点击了10次按钮，真是个有耐心的笨蛋！</p>
            <div className="celebration-emojis">
              🎊🎈🎉🎊🎈🎉🎊🎈🎉
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 颜色方块组件
const ColorBlock: React.FC = () => {
  const [color, setColor] = useState('#ff6b6b');
  
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3'];
  
  const handleClick = () => {
    setColor(colors[Math.floor(Math.random() * colors.length)]);
  };

  return (
    <motion.div
      className="color-block"
      style={{ backgroundColor: color }}
      onClick={handleClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={{
        rotate: [0, 360],
      }}
      transition={{
        duration: 0.5,
        type: "spring"
      }}
    />
  );
};

// 打字机效果组件
const TypingText: React.FC<{ text: string }> = ({ text }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <div className="typing-text">
      <h3>{displayText}</h3>
      <span className="cursor">|</span>
    </div>
  );
};

// 倒计时器组件
const CountdownTimer: React.FC = () => {
  const [time, setTime] = useState(60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const startTimer = () => {
    setIsRunning(true);
    setTime(60);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  return (
    <div className="countdown-timer">
      <h3>无意义倒计时器</h3>
      <div className="timer-display">
        <motion.div
          className="time-number"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5 }}
        >
          {time}
        </motion.div>
      </div>
      <div className="timer-controls">
        <button onClick={startTimer} disabled={isRunning}>
          开始倒计时
        </button>
        <button onClick={stopTimer} disabled={!isRunning}>
          停止
        </button>
      </div>
      {time === 0 && (
        <motion.div
          className="timer-complete"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          🎉 时间到！你浪费了60秒！🎉
        </motion.div>
      )}
    </div>
  );
};

export default App;
