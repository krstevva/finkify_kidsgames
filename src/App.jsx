import React, { useState } from 'react';
import { questions } from './data/questions';
import QuizModal from './components/QuizModal';
import CyberRunner from './games/CyberRunner';
import MemoryMatch from './games/MemoryMatch';
import CyberTrace from './games/CyberTrace';
import CyberBridge from './games/CyberBridge';
import PatternUnlock from './games/PatternUnlock';
import NodeLinker from './games/NodeLinker';

function App() {
  const [gameState, setGameState] = useState('HOME');
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [score, setScore] = useState(0);
  const [usedQuestionIds, setUsedQuestionIds] = useState([]);

  const handleQuizCorrect = (id) => {
    if (id) {
      setUsedQuestionIds([...usedQuestionIds, id]);
      setScore((prev) => prev + 50);
    }
    setIsQuizOpen(false);
  };

  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  };

  return (
    <div className="min-h-screen bg-sky-100 font-sans text-slate-800">
      {/* Header / HUD */}
      <header className="p-4 flex justify-between items-center bg-white shadow-md">
        <h1 className="text-2xl font-bold text-blue-600">FINKIfy 🛡️</h1>
        <div className="flex gap-4 items-center">
          <span className="font-bold text-orange-500">Поени: {score}</span>
          <button
            onClick={() => setGameState('HOME')}
            className="bg-slate-200 px-3 py-1 rounded-lg text-sm hover:bg-slate-300 transition-colors"
          >
            Дома
          </button>
        </div>
      </header>

      <main className="container mx-auto p-8 flex flex-col items-center">
        {gameState === 'HOME' && (
          <div className="text-center animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl md:text-4xl font-extrabold mb-8 text-slate-800">
              Подготвен за авантура? 🚀
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">

              {/* Runner */}
              <button
                onClick={() => { setGameState('PLAYING_RUNNER'); enterFullscreen(); }}
                className="group relative p-1 text-white transition-transform active:scale-95"
              >
                <div className="absolute inset-0 bg-blue-600 rounded-3xl translate-y-2 shadow-lg"></div>
                <div className="relative bg-blue-500 p-8 rounded-3xl border-2 border-blue-400 group-hover:-translate-y-1 transition-transform">
                  <span className="text-6xl block mb-4">🏃‍♂️</span>
                  <span className="text-2xl font-black">Сајбер Тркач</span>
                </div>
              </button>

              {/* Trace */}
              <button
                onClick={() => { setGameState('PLAYING_TRACE'); enterFullscreen(); }}
                className="group relative p-1 text-white transition-transform active:scale-95"
              >
                <div className="absolute inset-0 bg-blue-700 rounded-3xl translate-y-2"></div>
                <div className="relative bg-blue-600 p-8 rounded-3xl border-2 border-blue-400 group-hover:-translate-y-1 transition-transform">
                  <span className="text-6xl block mb-4">⚡</span>
                  <span className="text-2xl font-black">Брзи Прсти</span>
                </div>
              </button>

              {/* Memory */}
              <button
                onClick={() => { setGameState('PLAYING_MATCH'); enterFullscreen(); }}
                className="group relative p-1 text-white transition-transform active:scale-95"
              >
                <div className="absolute inset-0 bg-purple-600 rounded-3xl translate-y-2 shadow-lg"></div>
                <div className="relative bg-purple-500 p-8 rounded-3xl border-2 border-purple-400 group-hover:-translate-y-1 transition-transform">
                  <span className="text-6xl block mb-4">🧩</span>
                  <span className="text-2xl font-black">Меморија</span>
                </div>
              </button>

              {/* Bridge */}
              <button
                onClick={() => { setGameState('PLAYING_BRIDGE'); enterFullscreen(); }}
                className="group relative p-1 text-white transition-transform active:scale-95"
              >
                <div className="absolute inset-0 bg-cyan-700 rounded-3xl translate-y-2"></div>
                <div className="relative bg-cyan-600 p-8 rounded-3xl border-2 border-cyan-400 group-hover:-translate-y-1 transition-transform">
                  <span className="text-6xl block mb-4">🌉</span>
                  <span className="text-2xl font-black">Сајбер Мост</span>
                </div>
              </button>

              {/* Decrypt the Key */}
              <button
                onClick={() => {
                  setGameState('PLAYING_PATTERN');
                  enterFullscreen();
                }}
                className="group relative p-1 text-white transition-transform active:scale-95"
              >
                <div className="absolute inset-0 bg-indigo-700 rounded-3xl translate-y-2 shadow-lg"></div>
                <div className="relative bg-indigo-600 p-8 rounded-3xl border-2 border-indigo-400 group-hover:-translate-y-1 transition-transform">
                  <span className="text-6xl block mb-4">🔐</span>
                  <span className="text-2xl font-black">Декриптор</span>
                </div>
              </button>

              {/* Node Linker*/}
              <button
                onClick={() => { setGameState('PLAYING_LINKER'); enterFullscreen(); }}
                className="group relative p-1 text-white transition-transform active:scale-95"
              >
                <div className="absolute inset-0 bg-emerald-700 rounded-3xl translate-y-2 shadow-lg"></div>
                <div className="relative bg-emerald-600 p-8 rounded-3xl border-2 border-emerald-400 group-hover:-translate-y-1 transition-transform">
                  <span className="text-6xl block mb-4">🌐</span>
                  <span className="text-2xl font-black">Сајбер Врски</span>
                </div>
              </button>

            </div>
          </div>
        )}

        {/* Game Views */}
        {gameState === 'PLAYING_RUNNER' && (
          <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-black text-blue-600 uppercase">Сајбер Тркач 🏃‍♂️</h3>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">
                Квизови: {usedQuestionIds.length}
              </span>
            </div>
            <CyberRunner isPaused={isQuizOpen} onLevelUp={() => setIsQuizOpen(true)} />
            <button onClick={() => setGameState('HOME')} className="mt-6 text-slate-400 block mx-auto hover:text-red-500 font-bold">← Назад</button>
          </div>
        )}

        {gameState === 'PLAYING_MATCH' && (
          <div className="w-fit max-w-[95%] mx-auto bg-white p-6 md:p-10 rounded-3xl shadow-2xl flex flex-col max-h-[90%] overflow-auto">
            <MemoryMatch isPaused={isQuizOpen} onLevelUp={() => setIsQuizOpen(true)} />
            <button onClick={() => setGameState('HOME')} className="mt-8 text-slate-400 hover:text-red-500 transition-colors font-bold self-center">← Назад</button>
          </div>
        )}

        {gameState === 'PLAYING_TRACE' && (
          <div className="w-fit max-w-[95%] mx-auto bg-white p-6 md:p-10 rounded-3xl shadow-2xl flex flex-col max-h-[90%]">
            <CyberTrace isPaused={isQuizOpen} onLevelUp={() => setIsQuizOpen(true)} />
            <button onClick={() => setGameState('HOME')} className="mt-6 text-slate-400 hover:text-red-500 font-bold self-center">← Назад</button>
          </div>
        )}

        {gameState === 'PLAYING_BRIDGE' && (
          <div className="w-full max-w-4xl bg-white p-8 rounded-3xl shadow-2xl">
            <CyberBridge onLevelUp={() => setIsQuizOpen(true)} isPaused={isQuizOpen} />
            <button onClick={() => setGameState('HOME')} className="mt-6 text-slate-400 block mx-auto hover:text-red-500 font-bold">← Назад</button>
          </div>
        )}

        {gameState === 'PLAYING_PATTERN' && (
          <div className="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-2xl">
            <h3 className="text-3xl font-black text-blue-600 text-center mb-6">DECRYPT THE KEY 🔐</h3>
            <PatternUnlock onLevelUp={() => setIsQuizOpen(true)} isPaused={isQuizOpen} />
            <button onClick={() => setGameState('HOME')} className="mt-6 text-slate-400 block mx-auto hover:text-red-500 font-bold">← Назад</button>
          </div>
        )}

        {gameState === 'PLAYING_LINKER' && (
          <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-2xl">
            <NodeLinker onLevelUp={() => setIsQuizOpen(true)} isPaused={isQuizOpen} />
            <button onClick={() => setGameState('HOME')} className="mt-6 text-slate-400 block mx-auto hover:text-red-500 font-bold">← Назад</button>
          </div>
        )}
      </main>

      <QuizModal
        isOpen={isQuizOpen}
        questions={questions}
        usedQuestionIds={usedQuestionIds}
        onCorrect={handleQuizCorrect}
      />
    </div>
  );
}

export default App;