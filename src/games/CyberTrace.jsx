import React, { useState, useEffect, useCallback } from 'react';

export default function CyberTrace({ onLevelUp, isPaused }) {
  const [nodes, setNodes] = useState([]);
  const [targetLevel, setTargetLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0); // New state for High Score
  const [timeLeft, setTimeLeft] = useState(10);
  const [isGameOver, setIsGameOver] = useState(false);

  const ICONS = ['🔒', '🔑', '📡', '💻', '🛡️', '📱'];

  // Load high score on mount
  useEffect(() => {
    const saved = localStorage.getItem('cyberTraceHighScore') || 0;
    setHighScore(parseInt(saved));
  }, []);

  // Update high score when game ends
  useEffect(() => {
    if (isGameOver && score > highScore) {
      setHighScore(score);
      localStorage.setItem('cyberTraceHighScore', score.toString());
    }
  }, [isGameOver, score, highScore]);

  const spawnNode = useCallback(() => {
    const isVirus = Math.random() > 0.8;
    const newNode = {
      id: Date.now() + Math.random(),
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 15,
      type: isVirus ? 'virus' : 'secure',
      icon: isVirus ? '🦠' : ICONS[Math.floor(Math.random() * ICONS.length)],
      scale: 0,
    };
    setNodes(prev => [...prev.slice(-10), newNode]);
  }, []);

  useEffect(() => {
    if (isPaused || isGameOver) return;
    const interval = setInterval(() => {
      spawnNode();
    }, Math.max(400, 1000 - targetLevel * 100));
    return () => clearInterval(interval);
  }, [isPaused, isGameOver, targetLevel, spawnNode]);

  useEffect(() => {
    if (isPaused || isGameOver) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          setIsGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused, isGameOver]);

  const handleNodeClick = (node) => {
    if (isPaused || isGameOver) return;
    if (node.type === 'virus') {
      setTimeLeft(prev => Math.max(0, prev - 3));
      setNodes(prev => prev.filter(n => n.id !== node.id));
    } else {
      setScore(prev => {
        const newScore = prev + 10;
        if (newScore > 0 && newScore % 100 === 0) {
          setTargetLevel(l => l + 1);
          setTimeLeft(prevTime => prevTime + 5);
          onLevelUp();
        }
        return newScore;
      });
      setNodes(prev => prev.filter(n => n.id !== node.id));
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-[500px] relative select-none">
      {/* HUD */}
      <div className="w-full flex justify-between mb-4 px-6 z-10">
        <div className="flex flex-col gap-1">
            <div className="bg-blue-600 text-white px-4 py-1 rounded-xl font-black shadow-lg text-xs uppercase tracking-wider">
            НИВО: {targetLevel}
            </div>
            <div className="bg-yellow-500 text-white px-4 py-1 rounded-xl font-black shadow-lg text-[10px] uppercase tracking-wider">
            РЕКОРД: {highScore}
            </div>
        </div>

        <div className={`px-4 py-2 h-fit rounded-2xl font-black shadow-lg transition-colors ${timeLeft < 5 ? 'bg-red-500 animate-pulse' : 'bg-slate-800'} text-white`}>
          ВРЕМЕ: {timeLeft}s
        </div>

        <div className="bg-green-500 text-white px-4 py-2 h-fit rounded-2xl font-black shadow-lg">
          ПОЕНИ: {score}
        </div>
      </div>

      {/* Game Board */}
      <div className="relative w-full flex-1 bg-slate-100 rounded-3xl border-4 border-slate-200 overflow-hidden shadow-inner">
        {nodes.map(node => (
          <button
            key={node.id}
            onClick={() => handleNodeClick(node)}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            className={`
              absolute transform -translate-x-1/2 -translate-y-1/2 
              w-16 h-16 rounded-full flex items-center justify-center text-3xl
              transition-all duration-300 animate-in zoom-in
              ${node.type === 'virus' 
                ? 'bg-red-100 border-4 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
                : 'bg-white border-4 border-blue-500 shadow-xl hover:scale-110 active:scale-90'
              }
            `}
          >
            {node.icon}
          </button>
        ))}

        {isGameOver && (
          <div className="absolute inset-0 bg-slate-900/90 z-30 flex flex-col items-center justify-center text-center p-6 animate-in fade-in">
            <span className="text-7xl mb-4">⏱️</span>
            <h2 className="text-4xl font-black text-white mb-2">ВРЕМЕТО ИСТЕЧЕ!</h2>
            <p className="text-slate-400 mb-2 text-xl">Твојот резултат: {score}</p>
            {score >= highScore && score > 0 && (
                <p className="text-yellow-400 font-bold mb-6 animate-bounce">НОВ РЕКОРД! 🏆</p>
            )}
            <button 
              onClick={() => {
                setScore(0);
                setTargetLevel(1);
                setTimeLeft(20);
                setIsGameOver(false);
                setNodes([]);
              }}
              className="bg-blue-500 hover:bg-blue-400 text-white font-black py-4 px-10 rounded-2xl shadow-lg transition-transform hover:scale-105"
            >
              ОБИДИ СЕ ПОВТОРНО 🔄
            </button>
          </div>
        )}
      </div>

      <p className="mt-4 text-slate-500 font-bold">
        Кликни на сините штитови брзо, избегнувај ги вирусите! 🦠
      </p>
    </div>
  );
}