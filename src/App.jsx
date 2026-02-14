import React, { useState } from 'react';
import { questions } from './data/questions';
import QuizModal from './components/QuizModal';
import CyberRunner from './games/CyberRunner';
import MemoryMatch from './games/MemoryMatch';
import CyberTrace from './games/CyberTrace';
import CyberBridge from './games/CyberBridge';
import PatternUnlock from './games/PatternUnlock';
import NodeLinker from './games/NodeLinker';
import BlockPuzzle from './games/BlockPuzzle';
import PasswordDecryptor from './games/PasswordDecryptor';
import BinarySequence from './games/BinarySequence';



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
      <header className="p-4 flex justify-between items-center bg-white shadow-md">
        <img
          src="src\assets\Logo-Horizontal-Color-01-1.svg"
          alt="MKSafeNet Logo"
          className="h-10 w-auto"
          onClick={() => window.open("https://mksafenet.mk/", "_blank", "noopener,noreferrer")}
        />
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
          <div className="text-center animate-in fade-in zoom-in duration-500 max-w-6xl w-full">
            <div className="mb-12 text-center">
              <h2 className="text-5xl md:text-7xl font-black mb-4 text-[#003663] tracking-tighter uppercase">
                САЈБЕР <span className="text-[#0061a1]">ШТИТ</span> 🛡️
              </h2>

              <div className="flex flex-col items-center gap-6">
                <div className="bg-sky-100/50 p-6 rounded-3xl border-2 border-sky-200 max-w-3xl shadow-sm">
                  <h4 className="text-lg md:text-xl text-slate-700 font-bold leading-tight uppercase tracking-tight">
                    Научи како безбедно да навигираш низ дигиталниот свет и стани следната генерација на <span className="text-[#faa61a]">ФИНКИ</span> експерти.
                  </h4>
                  <div className="h-1 w-24 bg-[#faa61a] mx-auto my-3 rounded-full"></div>
                  <p className="text-sm text-slate-500 font-medium lowercase italic">
                    Совладај ги сајбер-предизвиците на <span className="text-[#faa61a] not-italic font-black uppercase tracking-widest">MKSafe.net</span> и заштити ја својата иднина.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-[11px] font-black text-white bg-[#003663] px-6 py-2 rounded-2xl uppercase tracking-[0.2em] shadow-lg border-b-4 border-[#faa61a]">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#faa61a] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#faa61a]"></span>
                  </span>
                  System Status: <span className="text-sky-300 ml-1">Secure</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
              {/* 1. Cyber Escape - BLUE (#0061a1) */}
              <button onClick={() => { setGameState('PLAYING_RUNNER'); enterFullscreen(); }} className="group relative p-1 transition-transform active:scale-95">
                <div className="absolute inset-0 bg-[#003663] rounded-3xl translate-y-2"></div>
                <div className="relative bg-[#0061a1] p-8 rounded-3xl border-[3px] border-[#003663] group-hover:-translate-y-1 transition-transform text-white">
                  <span className="text-6xl block mb-4 group-hover:scale-110 transition-transform">🏃‍♂️</span>
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Cyber Escape</h3>
                  <p className="text-blue-200 text-xs mt-2 font-mono opacity-70">Protocol: Runner_v1.0</p>
                </div>
              </button>

              {/* 2. Rapid Response - RED (#d51920) */}
              <button onClick={() => { setGameState('PLAYING_TRACE'); enterFullscreen(); }} className="group relative p-1 transition-transform active:scale-95">
                <div className="absolute inset-0 bg-[#003663] rounded-3xl translate-y-2"></div>
                <div className="relative bg-[#d51920] p-8 rounded-3xl border-[3px] border-[#003663] group-hover:-translate-y-1 transition-transform text-white">
                  <span className="text-6xl block mb-4 group-hover:rotate-12 transition-transform">⚡</span>
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Rapid Response</h3>
                  <p className="text-red-200 text-xs mt-2 font-mono opacity-70">Protocol: Reflex_Check</p>
                </div>
              </button>

              {/* 3. Neural Link - GREEN (#008b44) */}
              <button onClick={() => { setGameState('PLAYING_MATCH'); enterFullscreen(); }} className="group relative p-1 transition-transform active:scale-95">
                <div className="absolute inset-0 bg-[#003663] rounded-3xl translate-y-2"></div>
                <div className="relative bg-[#008b44] p-8 rounded-3xl border-[3px] border-[#003663] group-hover:-translate-y-1 transition-transform text-white">
                  <span className="text-6xl block mb-4 group-hover:scale-110 transition-transform">🧩</span>
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Neural Link</h3>
                  <p className="text-emerald-100 text-xs mt-2 font-mono opacity-70">Protocol: Memory_Node</p>
                </div>
              </button>

              {/* 4. Security Bridge - YELLOW/ORANGE (#faa61a) */}
              <button onClick={() => { setGameState('PLAYING_BRIDGE'); enterFullscreen(); }} className="group relative p-1 transition-transform active:scale-95">
                <div className="absolute inset-0 bg-[#003663] rounded-3xl translate-y-2"></div>
                <div className="relative bg-[#faa61a] p-8 rounded-3xl border-[3px] border-[#003663] group-hover:-translate-y-1 transition-transform text-white">
                  <span className="text-6xl block mb-4 group-hover:scale-110 transition-transform">🌉</span>
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-[#003663]">Security Bridge</h3>
                  <p className="text-[#003663]/70 text-xs mt-2 font-mono">Protocol: Safe_Pass</p>
                </div>
              </button>

              {/* 5. Biometric Pattern - BLUE (#0061a1) */}
              <button onClick={() => { setGameState('PLAYING_PATTERN'); enterFullscreen(); }} className="group relative p-1 transition-transform active:scale-95">
                <div className="absolute inset-0 bg-[#003663] rounded-3xl translate-y-2"></div>
                <div className="relative bg-[#0061a1] p-8 rounded-3xl border-[3px] border-[#003663] group-hover:-translate-y-1 transition-transform text-white">
                  <span className="text-6xl block mb-4 group-hover:rotate-[-10deg] transition-transform">🔐</span>
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Biometric Pattern</h3>
                  <p className="text-blue-200 text-xs mt-2 font-mono opacity-70">Protocol: Pattern_Key</p>
                </div>
              </button>

              {/* 6. Node Connector - GREEN (#008b44) */}
              <button onClick={() => { setGameState('PLAYING_LINKER'); enterFullscreen(); }} className="group relative p-1 transition-transform active:scale-95">
                <div className="absolute inset-0 bg-[#003663] rounded-3xl translate-y-2"></div>
                <div className="relative bg-[#faa61a] p-8 rounded-3xl border-[3px] border-[#003663] group-hover:-translate-y-1 transition-transform text-white">
                  <span className="text-6xl block mb-4 group-hover:scale-110 transition-transform">🌐</span>
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-[#003663]">Node Connector</h3>
                  <p className="text-[#003663]/70 text-xs mt-2 font-mono opacity-70">Protocol: Network_Link</p>
                </div>
              </button>

              {/* 7. Brute Force - RED (#d51920) */}
              <button onClick={() => { setGameState('PLAYING_DECRYPTOR'); enterFullscreen(); }} className="group relative p-1 transition-transform active:scale-95">
                <div className="absolute inset-0 bg-[#003663] rounded-3xl translate-y-2"></div>
                <div className="relative bg-[#d51920] p-8 rounded-3xl border-[3px] border-[#003663] group-hover:-translate-y-1 transition-transform text-white">
                  <span className="text-6xl block mb-4 group-hover:animate-pulse">⌨️</span>
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Brute Force</h3>
                  <p className="text-red-200 text-xs mt-2 font-mono opacity-70">Protocol: PWD_Decrypt</p>
                </div>
              </button>

              {/* 8. Mainframe Sync - YELLOW/ORANGE (#faa61a) */}
              <button onClick={() => { setGameState('PLAYING_SEQUENCE'); enterFullscreen(); }} className="group relative p-1 transition-transform active:scale-95">
                <div className="absolute inset-0 bg-[#003663] rounded-3xl translate-y-2"></div>
                <div className="relative bg-[#faa61a] p-8 rounded-3xl border-[3px] border-[#003663] group-hover:-translate-y-1 transition-transform text-white">
                  <span className="text-6xl block mb-4 font-mono font-black group-hover:scale-110 transition-transform text-[#003663]">0101</span>
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-[#003663]">Mainframe Sync</h3>
                  <p className="text-[#003663]/70 text-xs mt-2 font-mono">Protocol: Binary_Stream</p>
                </div>
              </button>

              {/* 9. Data Recovery - GREEN (#008b44) */}
              <button onClick={() => { setGameState('PLAYING_BLOCKS'); enterFullscreen(); }} className="group relative p-1 transition-transform active:scale-95">
                <div className="absolute inset-0 bg-[#003663] rounded-3xl translate-y-2"></div>
                <div className="relative bg-[#008b44] p-8 rounded-3xl border-[3px] border-[#003663] group-hover:-translate-y-1 transition-transform text-white">
                  <span className="text-6xl block mb-4 group-hover:rotate-12 transition-transform">🛠️</span>
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Data Recovery</h3>
                  <p className="text-emerald-100 text-xs mt-2 font-mono opacity-70">Protocol: Frag_Repair</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Game Views */}
        {gameState === 'PLAYING_RUNNER' && (
          <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-4">
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
            <h3 className="text-3xl font-black text-[#008b44] text-center mb-6">DECRYPT THE KEY 🔐</h3>
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

        {gameState === 'PLAYING_DECRYPTOR' && (
          <div className="w-full max-w-md bg-slate-900 p-8 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.2)] border border-cyan-500/30">
            <PasswordDecryptor
              onLevelUp={() => setIsQuizOpen(true)}
              isPaused={isQuizOpen}
            />
            <button onClick={() => setGameState('HOME')} className="mt-6 text-slate-400 block mx-auto hover:text-red-500 font-bold">← Назад</button>
          </div>
        )}

        {gameState === 'PLAYING_SEQUENCE' && (
          <div className="w-full max-w-4xl bg-white p-8 rounded-3xl shadow-2xl">
            <BinarySequence onLevelUp={() => setIsQuizOpen(true)} isPaused={isQuizOpen} />
            <button onClick={() => setGameState('HOME')} className="mt-6 text-slate-400 block mx-auto hover:text-red-500 font-bold">← Назад</button>
          </div>
        )}

        {gameState === 'PLAYING_BLOCKS' && (
          <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-black text-[#003663] tracking-tight">
                РЕКОНСТРУКТОР НА СИСТЕМ
              </h3>
              <p className="text-[#0061a1] text-xs font-bold uppercase tracking-widest mt-1">
                ПОПРАВКА НА КОРУМПИРАНИ ПОДАТОЧНИ БЛОКОВИ
              </p>
            </div>

            <BlockPuzzle
              onLevelUp={() => setIsQuizOpen(true)}
              isPaused={isQuizOpen}
            />
            <button
              onClick={() => setGameState('HOME')}
              className="mt-6 text-slate-400 block mx-auto hover:text-red-500 font-bold transition-colors"
            >
              ← Назад
            </button>
          </div>
        )}
      </main>
      <footer className="p-6 mt-auto bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-2">
          <p className="text-slate-600 text-sm text-center">
            Оваа платформа е направена во склоп на
            <span className="font-semibold text-[#0054A6] ml-1">MkSafeNet</span> проектот.
          </p>
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()}  - Сите права се задржани.
          </p>
        </div>
      </footer>

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