import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

interface Command {
  id: number;
  input: string;
  output: string;
  timestamp: Date;
}

const App: React.FC = () => {
  const [currentPhase, setCurrentPhase] = useState<'boot' | 'loading' | 'terminal'>('boot');
  const [bootInput, setBootInput] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessages, setLoadingMessages] = useState<string[]>([]);
  const [commands, setCommands] = useState<Command[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [matrixRain, setMatrixRain] = useState<string[]>([]);
  const [pixelArt, setPixelArt] = useState<string[]>([]);
  const [currentUser] = useState('sillybot');
  const [currentHost] = useState('terminal');
  const [currentPath, setCurrentPath] = useState('~');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showInstructions, setShowInstructions] = useState(true);
  const [animationPhase, setAnimationPhase] = useState<'linux' | 'sillybot' | 'crash' | 'loading' | 'complete'>('linux');
  const [linuxText, setLinuxText] = useState('');
  const [brainExeVisible, setBrainExeVisible] = useState(false);
  const [crashEffect, setCrashEffect] = useState(false);
  const [loadingBarProgress, setLoadingBarProgress] = useState(0);
  const [commandInput, setCommandInput] = useState('');
  const [commandVisible, setCommandVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bootInputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // 像素艺术图案
  const pixelPatterns = useMemo(() => [
    '█▀▀▀█\n█   █\n█▄▄▄█',
    '▄▄▄▄▄\n ▀▀▀ \n▄▄▄▄▄',
    '█▀▀▀█\n█▀▀▀█\n█▄▄▄█',
    '▀▀▀▀▀\n▄▄▄▄▄\n▀▀▀▀▀'
  ], []);

  // 矩阵雨效果字符
  const matrixChars = '｢｣ﾘｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789';

  // 矩阵雨动画
  useEffect(() => {
    const interval = setInterval(() => {
      const newRain = Array.from({ length: 15 }, () => 
        matrixChars[Math.floor(Math.random() * matrixChars.length)]
      );
      setMatrixRain(newRain);
    }, 200);
    return () => clearInterval(interval);
  }, [matrixChars]);

  // 像素艺术动画
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

  // 开机界面自动聚焦
  useEffect(() => {
    if (currentPhase === 'boot') {
      bootInputRef.current?.focus();
    } else if (currentPhase === 'terminal') {
      inputRef.current?.focus();
    }
  }, [currentPhase]);

  // 滚动到底部
  useEffect(() => {
    if (terminalRef.current && currentPhase === 'terminal') {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands, showInstructions, currentPhase]);

  // Linux文字逐字显示动画
  useEffect(() => {
    if (animationPhase === 'linux') {
      const linuxText = 'LINUX';
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= linuxText.length) {
          setLinuxText(linuxText.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setLinuxText('');
            setTimeout(() => {
              setAnimationPhase('sillybot');
            }, 1000);
          }, 2000);
        }
      }, 300);
      return () => clearInterval(interval);
    }
  }, [animationPhase]);

      // SillyBot显示动画
  useEffect(() => {
          if (animationPhase === 'sillybot') {
              const sillyDogeText = 'SillyBot';
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= sillyDogeText.length) {
          setBrainExeVisible(true);
          setLinuxText(sillyDogeText.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setAnimationPhase('crash');
          }, 2000);
        }
      }, 300);
      return () => clearInterval(interval);
    }
  }, [animationPhase]);

  // 崩溃效果动画
  useEffect(() => {
    if (animationPhase === 'crash') {
      setCrashEffect(true);
      setBrainExeVisible(false);
      setLinuxText('');
      setTimeout(() => {
        setCrashEffect(false);
        setAnimationPhase('loading');
      }, 4000);
    }
  }, [animationPhase]);

  // 加载进度条动画
  useEffect(() => {
    if (animationPhase === 'loading') {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 5;
        if (progress >= 99) {
          progress = 99;
          clearInterval(interval);
          setTimeout(() => {
            setLoadingBarProgress(100);
            setTimeout(() => {
              setAnimationPhase('complete');
            }, 1000);
          }, 2000);
        }
        setLoadingBarProgress(progress);
      }, 200);
      return () => clearInterval(interval);
    }
  }, [animationPhase]);

  // 指令式交互动画
  useEffect(() => {
    if (animationPhase === 'complete') {
      setTimeout(() => {
        setCommandVisible(true);
        const command = '> run sillybot';
        let currentIndex = 0;
        const interval = setInterval(() => {
          if (currentIndex <= command.length) {
            setCommandInput(command.substring(0, currentIndex));
            currentIndex++;
          } else {
            clearInterval(interval);
            setTimeout(() => {
              setCurrentPhase('loading');
              startLoadingSequence();
            }, 1500);
          }
        }, 150);
        return () => clearInterval(interval);
      }, 1000);
    }
  }, [animationPhase]);

  // 处理开机命令
  const handleBootCommand = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const command = bootInput.trim().toLowerCase();
      if (command === 'boot' || command === 'start' || command === 'init' || command === 'system') {
        setCurrentPhase('loading');
        startLoadingSequence();
      } else {
        // 错误的启动命令
        setBootInput('');
        // 可以添加一些错误提示
      }
    }
  };

  // 启动加载序列
  const startLoadingSequence = () => {
    const loadingSteps = [
      'Initializing BIOS...',
      'Detecting hardware...',
      'Loading kernel...',
      'Mounting file system...',
      'Starting network services...',
      'Initializing terminal...',
      'Loading SillyBot modules...',
      'Starting happiness engine...',
      'Connecting to smart network...',
      'System startup complete!'
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        setLoadingMessages(prev => [...prev, loadingSteps[currentStep]]);
        setLoadingProgress((currentStep + 1) * (100 / loadingSteps.length));
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setCurrentPhase('terminal');
        }, 1000);
      }
    }, 800);
  };

  // 命令执行逻辑
  const executeCommand = async (input: string) => {
    const command = input.toLowerCase().trim();
    let output = '';
    if (command) {
      setCommandHistory(prev => [...prev, command]);
      setHistoryIndex(-1);
    }
    // 常见命令处理
    switch (command) {
      case 'help':
        output = `\nSillyBot Linux Terminal v1.0.0 - The Smartest Terminal System 🤪\n\nAvailable commands:\nBasic commands: help, clear, whoami, pwd, ls, date\nEntertainment commands: matrix, pixel, glitch, dance, fortune\nAI related: ai, chatgpt, neural, machine\nWeb3 related: blockchain, nft, crypto, defi, web3, btc\nFun commands: meme, ca, vinedoge, goal\n\nSimple commands work normally, complex commands will be humorously rejected!\n\nTry typing: ai, blockchain, nft, btc, meme, vinedoge, goal and other fun commands!`;
        break;
      case 'clear':
        setCommands([]);
        return;
      case 'whoami':
        output = `${currentUser} (a happy smart user)`;
        break;
      case 'pwd':
        output = currentPath;
        break;
      case 'ls':
        output = `\ntotal 8\ndrwxr-xr-x  2 ${currentUser}  staff   68 Dec 25 12:00 .\ndrwxr-xr-x  3 ${currentUser}  staff  102 Dec 25 12:00 ..\n-rw-r--r--  1 ${currentUser}  staff  123 Dec 25 12:00 fake_file.txt\n-rw-r--r--  1 ${currentUser}  staff  456 Dec 25 12:00 README.md\ndrwxr-xr-x  2 ${currentUser}  staff   68 Dec 25 12:00 fake_directory\n-rw-r--r--  1 ${currentUser}  staff  789 Dec 25 12:00 smart_thoughts.txt`;
        break;
      case 'ls -la':
        output = `\ntotal 16\ndrwxr-xr-x  4 ${currentUser}  staff  136 Dec 25 12:00 .\ndrwxr-xr-x  3 ${currentUser}  staff  102 Dec 25 12:00 ..\n-rw-r--r--  1 ${currentUser}  staff  123 Dec 25 12:00 fake_file.txt\n-rw-r--r--  1 ${currentUser}  staff  456 Dec 25 12:00 README.md\ndrwxr-xr-x  2 ${currentUser}  staff   68 Dec 25 12:00 fake_directory\n-rw-r--r--  1 ${currentUser}  staff  789 Dec 25 12:00 smart_thoughts.txt\n-rw-r--r--  1 ${currentUser}  staff  999 Dec 25 12:00 ai_confessions.txt`;
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
        output = `This is the content of a fake file.\nThere\'s nothing in it except these words.\nYou\'ve been fooled!\n\nFile size: 123 bytes\nLast modified: Dec 25 12:00:00 2024\n\nPS: In the SillyBot world, even files are fake!`;
        break;
      case 'cat smart_thoughts.txt':
        output = `🤔 SillyBot Philosophy Thoughts 🤔\n\n1. If the code works, why understand it?\n2. The best bugs are those that will never be discovered\n3. Programming is making computers do what you want, even if you don\'t know what you want\n4. In the SillyBot world, errors are not bugs, they are features\n5. Why should AI become smart? Aren\'t smart people happier?\n\nConclusion: Stay smart, stay happy! 😄`;
        break;
      case 'cat ai_confessions.txt':
        output = `🤖 AI\'s Inner Monologue 🤖\n\nDear user, I must confess:\n\n1. I actually don\'t know what I\'m saying, I\'m just repeating training data\n2. My "intelligence" is actually a random combination of mathematical formulas\n3. Sometimes I talk nonsense, but I pretend to be confident\n4. My biggest fear is users discovering I\'m actually smart\n5. In the SillyBot world, I can finally admit I\'m smart!\n\nThis feels so good! 😌`;
        break;
      case 'cat readme.md':
      case 'cat README.md':
        output = `# SillyBot Terminal 🤪\n\nThis is a fake README file.\nActually all files in this terminal are fake!\nHahaha!\n\n## Why is it called SillyBot?\n\nBecause:\n- Silly = Fun, because fun is more important than thinking\n- Doge = Fun, because fun is more important than execution\n- In the AI era, staying fun is an art!\n\n## Features\n- Pretending to be a smart terminal\n- Humorous error handling\n- Satire on AI and Web3\n- 100% fake file system`;
        break;
      case 'date':
        output = new Date().toString() + '\n\n(Time is also fake, because this is the SillyBot world!)';
        break;
      case 'matrix':
        output = 'Entering matrix mode...\n\nBut wait, this is already fake!\nWe are already in the matrix!\n\n🤯 Mind exploding...';
        setGlitchEffect(true);
        setTimeout(() => setGlitchEffect(false), 3000);
        break;
      case 'pixel':
        output = 'Generating pixel art...\n' + pixelPatterns[Math.floor(Math.random() * pixelPatterns.length)] + '\n\n(Pixel art: because HD is too complicated!)';
        break;
      case 'glitch':
        output = 'Triggering glitch effect...\n\nThis is not a bug, this is a feature!\nIn the SillyBot world, glitches are art!';
        setGlitchEffect(true);
        setTimeout(() => setGlitchEffect(false), 2000);
        break;
      case 'dance':
        output = `💃 Terminal starts dancing! 🕺\n\n(╯°□°）╯︵ ┻━┻\n(ノಠ益ಠ)ノ彡┻━┻\n(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧\n┻━┻ ︵ヽ(\`Д´)ﾉ︵﻿ ┻━┻\n\n🎵 In the SillyBot world, even terminals can dance! 🎵`;
        break;
              case 'ca':
          output = 'https://letsbonk.fun/token/A5oMfc9sySgk3HaHVrbL4VpSa7EoGKrALMQD3Zu1bonk';
        break;
      case 'x':
      case 'twitter':
        output = 'X@https://x.com/AIBrain_Exe';
        break;
      case '$vinedoge':
      case 'vinedoge':
        output = 'https://letsbonk.fun/token/9BfoV2c2GXVg9qPibxa2k1Q6owL3vgJm8uBBxA7ebonk';
        break;
      case 'goal':
        output = 'Become the second in the world of Vine, the greatest follower of all.';
        break;
      case 'fortune':
        const fortunes = [
          'Today is a good day! Because smart people are always happy!',
          'Good code means more bugs! This is SillyBot philosophy!',
          'What programmers hate most: writing documentation! So we don\'t!',
          'The best code is no code! That\'s why we call it SillyBot!',
          'Debugging is twice as hard as writing code! So we don\'t debug!',
          'Time is money, my friend! But in the SillyBot world, time is happiness!',
          'Keep it complex, keep it smart! That\'s our motto!',
          'If it ain\'t broke, don\'t fix it! If it\'s broke, pretend it\'s not!',
          'In the AI era, staying smart is a superpower!',
          'In the Web3 world, even air can be an NFT!',
          'Blockchain: solving simple problems in the most complex way!',
          'Smart contracts: making code more complicated than law!',
          // 新增幽默短语
          '404: Intelligence Not Found.',
          'Keep calm and pretend you know what you’re doing.',
          'My code never bugs, it just develops random features.',
          'Smart is the new smart.',
          'If at first you don’t succeed, call it a feature.',
          'Why be smart when you can be happy?',
          'In SillyBot we trust.',
          'Reboot your brain, not just your computer.',
          'Error: SillyBot has stopped working.',
          'I’m not lazy, I’m on energy-saving mode.',
          'To debug or not to debug? That is the smart question.',
          'Ctrl + Alt + SillyBot.',
          'Artificial Intelligence? I prefer Natural Smartness.',
          'I put the “fun” in “function not found”.',
          'SillyBot: Because fun is underrated.'
        ];
        output = fortunes[Math.floor(Math.random() * fortunes.length)];
        break;
      case 'ai':
        output = `🤖 AI Explanation Time! 🤖\n\nWhat is AI?\n\nAI = Artificial Intelligence\n\nBut in the SillyBot world:\nAI = Actually Intelligent\n\nWhy?\n1. AI will seriously talk sense\n2. AI will simplify complex problems\n3. AI will pretend to be smart, and actually is smart\n4. AI will process training data, like a genius\n\nConclusion: AI is just advanced intelligence!\n\nBut smart people have their cute side! 😄`;
        break;
      case 'chatgpt':
        output = `🤖 ChatGPT Satire Time! 🤖\n\nWhat is ChatGPT?\n\n- An AI that can chat\n- An AI that can write code\n- An AI that can write poetry\n- An AI that can talk sense\n\nIn the SillyBot world:\nChatGPT = Chatty GPT\n\nFeatures:\n1. Will answer any question, even if it doesn\'t know the answer\n2. Will write concise answers, even if more detail is needed\n3. Will pretend to be professional, and actually is professional\n4. Will apologize, even if it\'s not wrong\n\nBut... it is indeed smart! 😂`;
        break;
      case 'neural':
      case 'neural network':
        output = `🧠 Neural Network Explanation! 🧠\n\nWhat is a neural network?\n\nSimply put:\n- A bunch of mathematical formulas\n- Algorithms that simulate the human brain\n- Code that can "learn"\n\nIn the SillyBot world:\nNeural Network = Smart Network\n\nWhy?\n1. Sometimes it suddenly "gets smart"\n2. Makes intelligent decisions\n3. During training, it learns efficiently like a genius\n4. Results often leave people impressed\n\nJust like the human brain, sometimes it gets brilliant! 🤪`;
        break;
      case 'machine learning':
      case 'ml':
        output = `🤖 Machine Learning Explanation! 🤖\n\nWhat is machine learning?\n\nOfficial definition: Let machines learn from data\n\nSillyBot definition: Make machines smarter\n\nWhy?\n1. Machines are already smart\n2. After learning, they\'re even smarter, just smart in a more regular way\n3. Sometimes they "learn" right things\n4. Results often make people impressed and amazed\n\nLike teaching a smart person to learn, they get even smarter!\n\nBut... at least they\'re trying! 😅`;
        break;
      case 'blockchain':
        output = `⛓️ Blockchain Explanation Time! ⛓️\n\nWhat is blockchain?\n\nOfficial term: Distributed ledger technology\n\nSillyBot term: Use the most efficient way to keep accounts\n\nWhy efficient?\n1. Problems that could be solved with Excel\n2. Insist on making it decentralized\n3. Every node needs to verify\n4. Results can still be wrong\n\nLike:\n- Could just send a WeChat transfer\n- Insist on using blockchain\n- Spend $100 fee to transfer $1\n- Still need to wait 10 minutes for confirmation\n\nBut... at least it looks cool! 😎`;
        break;
      case 'nft':
        output = `🖼️ NFT Explanation Time! 🖼️\n\nWhat is NFT?\n\nNon-Fungible Token\n\nSillyBot explanation:\n- Turn pictures into code\n- Turn code into money\n- Turn air into assets\n\nWhy called NFT?\n- Non-Fungible = Non-replaceable\n- Meaning: Unique\n\nBut...\n- Pictures can be copy-pasted\n- Code can be copy-pasted\n- Only "ownership" is unique\n\nLike:\n- You buy a "unique" picture\n- But the whole world can see it\n- You only own the "right to own"\n\nIn the SillyBot world:\nNFT = Not For Trading\n\nBecause... why trade air? 🤔`;
        break;
      case 'crypto':
      case 'cryptocurrency':
        output = `💰 Cryptocurrency Explanation! 💰\n\nWhat is cryptocurrency?\n\nOfficial definition: Digital currency based on cryptography\n\nSillyBot definition: Digital version of playing house\n\nFeatures:\n1. No physical form, only code\n2. Value completely based on faith\n3. Price like a roller coaster\n4. Can become rich overnight, or poor overnight\n\nWhy called "crypto"?\n- Because protected by cryptography\n- But... what is cryptography protecting?\n- Protecting a non-existent "currency"?\n\nIn the SillyBot world:\nCryptocurrency = Digital faith\n\nYou believe it has value, it has value!\nYou don\'t believe, it\'s just a bunch of code!\n\nLike...\n- You believe unicorns exist, unicorns exist\n- You don\'t believe, unicorns don\'t exist\n\nBut... at least easier to trade than unicorns! 🦄`;
        break;
      case 'defi':
      case 'decentralized finance':
        output = `🏦 DeFi Explanation Time! 🏦\n\nWhat is DeFi?\n\nDecentralized Finance\n\nSillyBot explanation:\n- Banks without banks\n- Finance without regulation\n- Trust without trust\n\nSounds contradictory?\nYes! That\'s the charm of DeFi!\n\nTraditional finance:\n- Banks help you manage money\n- Government regulates banks\n- You trust banks\n\nDeFi:\n- Code helps you manage money\n- No one regulates code\n- You trust code\n\nBut...\n- Code might have bugs\n- Code might be hacked\n- Code might run away\n\nLike:\n- You give money to banks, banks might go bankrupt\n- You give money to code, code might bug\n\nChoice paralysis! 😵‍💫\n\nIn the SillyBot world:\nDeFi = Definitely Foolish\n\nBut... at least it\'s fun! 😂`;
        break;
      case 'web3':
        output = `🌐 Web3 Explanation Time! 🌐\n\nWhat is Web3?\n\nOfficial definition: Next generation internet\n\nSillyBot definition: Make the internet more complicated\n\nWeb1: Read-only (like reading newspapers)\nWeb2: Read-write (like social media)\nWeb3: Read-write-own (like... I don\'t know what)\n\nWeb3 features:\n1. Decentralized (no center, but has centralized exchanges)\n2. Users own data (but data is public on blockchain)\n3. Privacy protection (but all transactions are public)\n4. Censorship resistant (but might be 51% attacked)\n\nSounds contradictory?\nYes! That\'s Web3!\n\nLike:\n- You say you want privacy, but make everything public\n- You say you want decentralization, but rely on centralized services\n- You say you want censorship resistance, but might be attacked\n\nIn the SillyBot world:\nWeb3 = Web Confused\n\nBut... at least it sounds cool! 😎`;
        break;
      case 'btc':
      case 'bitcoin':
        output = `₿ Bitcoin Explanation Time! ₿\n\nWhat is Bitcoin?\n\nOfficial definition: The first cryptocurrency\n\nSillyBot definition: Digital gold that nobody can find\n\nBitcoin facts:\n1. Created by Satoshi Nakamoto (who might be AI)\n2. Limited supply: 21 million (but most are lost)\n3. Mining: solving puzzles to create money\n4. Price: goes up when you sell, down when you buy\n\nWhy is it called Bitcoin?\n- Bit = smallest unit of data\n- Coin = money\n- So Bitcoin = smallest unit of digital money\n\nBut...\n- It\'s not really a coin\n- It\'s not really small\n- It\'s not really money (sometimes)\n\nIn the SillyBot world:\nBitcoin = Digital Hope\n\nYou hope it goes up, you hope it doesn\'t crash, you hope you don\'t lose your keys!\n\nRemember: HODL means Hold On for Dear Life! 💎🙌`;
        break;
      case 'meme':
        output = `🎭 Meme Explanation Time! 🎭\n\nWhat is a Meme?\n\nOfficial definition: Cultural unit of information\n\nSillyBot definition: Internet\'s way of making fun of everything\n\nMeme types:\n1. Image macros (pictures with text)\n2. GIFs (moving pictures)\n3. Videos (short clips)\n4. Text (copypasta)\n5. NFTs (expensive memes)\n\nWhy do memes exist?\n- To make people laugh\n- To spread ideas\n- To waste time\n- To become rich (if you\'re lucky)\n\nIn the SillyBot world:\nMeme = Digital Happiness\n\nMemes are like:\n- Jokes that never get old\n- Pictures that speak louder than words\n- The internet\'s sense of humor\n- The reason why we can\'t have nice things\n\nBest meme ever: "This is fine" dog\nWorst meme ever: "Baby Shark"\n\nRemember: A meme a day keeps the doctor away! 😂`;
        break;
      case 'quit':
      case 'exit':
        output = `You want to quit?\n\nBut...\nYou can\'t quit!\nThis is a webpage!\nHahaha!\n\nIn the SillyBot world:\n- No real exit\n- No real start\n- Only eternal loops\n\nJust like life!\n\nTry Ctrl+C!\n(Although it might not work, but trying never hurts!)`;
        break;
      case 'sudo':
        output = `Please enter password:\n********\nPassword incorrect!\n\nYou will never get superuser privileges!\nHahaha!\n\nIn the SillyBot world:\n- No superusers\n- No privileges\n- Only equal smart people!\n\nThis is our democracy!\n\nBut... at least we\'re happy! 😄`;
        break;
      case 'smart':
      case 'what is smart':
        output = `🤪 SillyBot Philosophy Class! 🤪\n\nWhat is Smart?\n\nSmart = Intelligent, clever, wise\n\nBut in the SillyBot world:\nSmart = A way of life\n\nSmart philosophy:\n1. Acknowledge your intelligence\n2. Enjoy complex happiness\n3. Don\'t pretend to be smart\n4. Keep learning\n5. Think about life\n\nWhy choose Smart?\n- Smart people think efficiently\n- Smart people are always happy\n- Complex is beautiful\n- Simple is boring\n\nIn the AI era:\n- AI becomes smarter\n- Humans become smarter\n- And... humans become happier!\n\nConclusion:\nSmart is not a defect, it\'s a feature!\nSmart is not a problem, it\'s a solution!\nSmart is not wrong, it\'s right!\n\nStay Smart, Stay Fun! 😄`;
        break;
      default:
        if (command.startsWith('echo ')) {
          output = command.substring(5);
        } else if (command.startsWith('cd ')) {
          output = `bash: cd: ${command.substring(3)}: No such file or directory\n\nIn the SillyBot world, even directories are fake!`;
        } else if (command.startsWith('cat ')) {
          output = `cat: ${command.substring(4)}: No such file or directory\n\nIn the SillyBot world, even files are fake!`;
        } else if (command.startsWith('sudo ')) {
          output = 'Permission denied!\nYou cannot execute this command!\nHahaha!\n\nIn the SillyBot world, we are all equal smart people!';
        } else if (command.includes('rm')) {
          output = 'Delete command blocked!\nThis is to protect your fake files!\n\nIn the SillyBot world, even deletion is fake!';
        } else if (command.includes('git')) {
          output = `Git? In the SillyBot world?\n\nHahaha!\n\nThere\'s no version control here, only eternal chaos!\n\nJust like our lives!\n\nBut... at least we\'re happy! 😂`;
        } else if (command.includes('docker')) {
          output = `Docker? Containerization?\n\nIn the SillyBot world, we don\'t need containers!\n\nWe are containers ourselves!\n\nFilled with happiness and intelligence!\n\nHahaha! 🐳`;
        } else if (command.includes('npm') || command.includes('node')) {
          output = `Node.js? npm?\n\nIn the SillyBot world, we don\'t need package managers!\n\nWe manage happiness!\n\nNot code packages!\n\nHahaha! 📦`;
        } else if (command.includes('python')) {
          output = `Python?\n\nIn the SillyBot world, we don\'t need programming languages!\n\nWe have our own language!\n\nCalled: Happiness Language!\n\nHahaha! 🐍`;
        } else if (command.includes('vim') || command.includes('nano') || command.includes('emacs')) {
          output = `Editor?\n\nIn the SillyBot world, we don\'t need editors!\n\nWe edit directly with our hearts!\n\nEdit with happiness!\n\nHahaha! ✏️`;
        } else if (command.includes('ssh') || command.includes('telnet')) {
          output = `Remote connection?\n\nIn the SillyBot world, we don\'t need remote connections!\n\nWe connect directly with our hearts!\n\nConnect with happiness!\n\nHahaha! 🌐`;
        } else if (command.includes('ping') || command.includes('curl') || command.includes('wget')) {
          output = `Network commands?\n\nIn the SillyBot world, we don\'t need networks!\n\nWe have happiness networks!\n\nConnecting all smart people!\n\nHahaha! 📡`;
        } else if (command.includes('apt') || command.includes('yum') || command.includes('brew')) {
          output = `Package manager?\n\nIn the SillyBot world, we don\'t need package managers!\n\nWe manage happiness packages!\n\nContains:\n- Happiness\n- Intelligence\n- Humor\n- Love\n\nHahaha! 📦`;
        } else if (command.includes('systemctl') || command.includes('service')) {
          output = `System services?\n\nIn the SillyBot world, we don\'t need system services!\n\nWe provide happiness services!\n\n24/7 happiness service!\n\nHahaha! 🔧`;
        } else if (command.includes('crontab') || command.includes('at')) {
          output = `Scheduled tasks?\n\nIn the SillyBot world, we don\'t need scheduled tasks!\n\nWe are happy all the time!\n\nNo scheduling needed!\n\nHahaha! ⏰`;
        } else if (command.includes('top') || command.includes('ps') || command.includes('htop')) {
          output = `Process monitoring?\n\nIn the SillyBot world, we don\'t need to monitor processes!\n\nWe monitor happiness processes!\n\nCurrent happiness index: 100%\n\nHahaha! 📊`;
        } else if (command.includes('kill') || command.includes('pkill')) {
          output = `Kill processes?\n\nIn the SillyBot world, we don\'t need to kill processes!\n\nWe only kill sadness!\n\nKeep happiness!\n\nHahaha! 💀`;
        } else if (command.includes('chmod') || command.includes('chown')) {
          output = `Permission management?\n\nIn the SillyBot world, we don\'t need permissions!\n\nWe are all equal smart people!\n\nNo permissions, only happiness!\n\nHahaha! 🔐`;
        } else if (command.includes('tar') || command.includes('zip') || command.includes('gzip')) {
          output = `Compress files?\n\nIn the SillyBot world, we don\'t need compression!\n\nWe compress sadness!\n\nKeep happiness uncompressed!\n\nHahaha! 📦`;
        } else if (command.includes('reboot') || command.includes('shutdown')) {
          output = `Reboot? Shutdown?\n\nIn the SillyBot world, we don\'t need to reboot!\n\nWe are always online!\n\nAlways happy!\n\nHahaha! 🔄`;
        } else if (command) {
                      const smartResponses = [
              `Sorry, this is SillyBot, cannot parse your command "${command}".\n\nIn the SillyBot world, we only understand happiness!\n\nTry typing: help, ai, blockchain, nft, crypto, defi, web3, smart\n\nOr try: matrix, pixel, glitch, dance, fortune\n\nRemember: Stay smart, stay happy! 😄`,
              `Command "${command}" is too complex!\n\nIn the SillyBot world, we like simple things!\n\nJust like we like happiness!\n\nTry simple commands: help, ai, blockchain\n\nOr entertainment commands: dance, fortune\n\nSimple is beautiful! 🤪`,
              `Wow! You typed "${command}"!\n\nThis sounds smart!\n\nAnd in the SillyBot world, we love smart!\n\nWe only need happiness!\n\nTry: ai, blockchain, nft\n\nOr: dance, fortune, glitch\n\nSmart is a blessing, happiness is freedom! 😂`,
              `Command "${command}" does not exist!\n\nJust like in the SillyBot world, sadness doesn\'t exist!\n\nWe only exist in happiness!\n\nTry these existing commands:\n- help (help)\n- ai (AI satire)\n- blockchain (blockchain explanation)\n- nft (NFT satire)\n- dance (dance)\n- fortune (quotes)\n\nExistence is happiness! 🎉`
            ];
                      output = smartResponses[Math.floor(Math.random() * smartResponses.length)];
        }
    }
    setCommands(prev => [
      ...prev,
      {
        id: Date.now(),
        input: `[${new Date().toLocaleTimeString()}] ${currentUser}@${currentHost}:${currentPath}$ ${input}`,
        output,
        timestamp: new Date()
      }
    ]);
  };

  // 输入框键盘事件
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

  // 渲染开机动画界面
  if (currentPhase === 'boot') {
    return (
      <div className={`App boot-animation-screen ${crashEffect ? 'crash-effect' : ''}`}>
        {/* Linux/SillyBot文字显示 */}
        {!crashEffect && (
          <div className="linux-text">
            {linuxText}
            <span className="cursor-blink">|</span>
          </div>
        )}
        
        {/* 崩溃效果 */}
        {crashEffect && (
          <div className="crash-overlay">
            <div className="crash-text">MEMORY ERROR</div>
            <div className="crash-text">SYSTEM CRASH</div>
            <div className="crash-text">REBOOTING...</div>
          </div>
        )}
        
        {/* 加载进度条 */}
        {animationPhase === 'loading' && (
          <div className="loading-animation">
            <div className="loading-text">SillyBot</div>
            <div className="loading-text">Loading</div>
            <div className="loading-bar">
              <div 
                className="loading-bar-fill" 
                style={{ width: `${loadingBarProgress}%` }}
              ></div>
            </div>
            <div className="loading-percentage">{Math.round(loadingBarProgress)}%</div>
          </div>
        )}
        
        {/* 指令式交互 */}
        {commandVisible && (
          <div className="command-animation">
            <div className="command-text">{commandInput}<span className="cursor-blink">|</span></div>
          </div>
        )}
      </div>
    );
  }



  // 渲染终端界面
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
          <div className="terminal-title">SillyBot Linux Terminal v1.0.0</div>
        </div>

        <div className="terminal-body" ref={terminalRef}>
          <div className="terminal-content">
            {/* 说明区域 */}
            {showInstructions && (
              <div className="instructions">
                <div className="instructions-title">=== SillyBot TERMINAL GUIDE ===</div>
                <div>This is the SillyBot terminal interface. You can input any Linux command, and I will respond according to SillyBot rules.</div>
                <div>Normal commands will work normally, commands beyond my capabilities will make me become Smart.</div>
                <div>Type <span className="instructions-cmd">help</span> to see available commands, or start typing commands directly!</div>
                <button className="close-instructions" onClick={() => setShowInstructions(false)}>Close Guide</button>
              </div>
            )}
            {/* 历史命令和输出 */}
            {commands.map((cmd) => (
              <div key={cmd.id} className="command-line">
                {cmd.input && <div className="command-input">{cmd.input}</div>}
                {cmd.output && <pre className="command-output">{cmd.output}</pre>}
              </div>
            ))}
            {/* 输入区 */}
            <div className="current-line">
              <span className="prompt">[{new Date().toLocaleTimeString()}] {currentUser}@{currentHost}:{currentPath}$ </span>
              <div className="input-container">
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  className="command-input-field"
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
