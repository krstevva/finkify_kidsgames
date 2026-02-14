import React, { useState, useEffect } from 'react';

export default function BinarySequence({ onLevelUp, isPaused }) {
    const [level, setLevel] = useState(1);
    const [sequence, setSequence] = useState([]);
    const [userSequence, setUserSequence] = useState([]);
    const [isShowing, setIsShowing] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null);
    const [gameState, setGameState] = useState('START');
    const [hasFinalWon, setHasFinalWon] = useState(false);

    const sequenceLength = level;

    const startLevel = () => {
        const newSequence = [];
        for (let i = 0; i < sequenceLength; i++) {
            newSequence.push(Math.round(Math.random()));
        }
        setSequence(newSequence);
        setUserSequence([]);
        showSequence(newSequence);
    };

    const showSequence = (seq) => {
        setIsShowing(true);
        setGameState('PLAYING');

        seq.forEach((num, i) => {
            setTimeout(() => {
                setActiveIndex(i);
                setTimeout(() => setActiveIndex(null), 550);

                if (i === seq.length - 1) {
                    setTimeout(() => {
                        setIsShowing(false);
                    }, 600);
                }
            }, i * 800);
        });
    };

    const handleInput = (bit) => {
        if (isShowing || isPaused || gameState !== 'PLAYING') return;

        const nextUserSeq = [...userSequence, bit];
        setUserSequence(nextUserSeq);

        if (bit !== sequence[userSequence.length]) {
            setGameState('LOST');
            return;
        }

        if (nextUserSeq.length === sequence.length) {
            if (level >= 10) {
                setHasFinalWon(true);
            } else {
                setTimeout(() => {
                    onLevelUp();
                    setLevel(prev => prev + 1);
                    setGameState('START');
                }, 600);
            }
        }
    };

    return (
        <div className="relative flex flex-col items-center justify-center w-full h-full max-h-full">
            {(hasFinalWon || gameState === 'LOST') && (
                <div className="absolute inset-0 bg-[#003663]/95 z-[100] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-500 rounded-3xl text-center">
                    <div>
                        <div className="text-8xl mb-4 animate-bounce">{hasFinalWon ? '🎓' : '⚡'}</div>
                        <h2 className="text-5xl font-black text-white mb-2 tracking-tighter">
                            {hasFinalWon ? <>МИСИЈАТА Е <span className="text-[#faa61a]">УСПЕШНА!</span></> : <>СИСТЕМОТ <span className="text-[#d51920]">ПРЕГОРЕ!</span></>}
                        </h2>
                        <p className="text-xl text-slate-300 mb-8 max-w-md mx-auto font-mono">
                            {hasFinalWon ? "Ти си мајстор на бинарниот код!" : `Грешка во низата! Стигна до ниво ${level}.`}
                        </p>
                        <button onClick={() => { setLevel(1); setGameState('START'); setHasFinalWon(false); }} className="bg-[#0061a1] hover:bg-[#004e82] text-white font-black py-4 px-12 rounded-2xl text-2xl shadow-[0_8px_0_#003663] transition-transform hover:scale-105 uppercase">
                            ИГРАЈ ПОВТОРНО 🔄
                        </button>
                        <p className="text-[#faa61a] font-bold italic mt-6 opacity-80 uppercase tracking-widest text-xs">Иднината те чека на ФИНКИ! 🏛️</p>
                    </div>
                </div>
            )}

            <div className="mb-4">
                <span className="bg-[#003663] text-white px-6 py-1 rounded-full text-sm font-black tracking-widest shadow-md border-b-4 border-[#001d36]">
                    НИВО {level}
                </span>
            </div>

            <div className="flex flex-col items-center gap-6 p-8 bg-sky-50 rounded-3xl border-4 border-[#003663] shadow-inner w-full max-w-sm">
                <div className="flex flex-col items-center">
                    <h4 className="text-[#0061a1] font-black uppercase text-xs tracking-[0.2em]">Процесорски Блок</h4>
                    <p className="text-[9px] text-[#003663] font-bold uppercase mt-1 opacity-60">Должина на низа: {sequenceLength}</p>
                </div>

                <div className="w-full h-28 bg-white rounded-2xl border-4 border-[#003663] flex items-center justify-center shadow-sm">
                    {activeIndex !== null ? (
                        <div className="text-7xl font-black text-[#d51920] tabular-nums">
                            {sequence[activeIndex]}
                        </div>
                    ) : gameState === 'START' ? (
                        <button onClick={startLevel} className="bg-[#faa61a] hover:bg-[#e09516] text-[#003663] font-black px-6 py-3 rounded-xl transition-all shadow-md border-b-4 border-[#b37700] active:translate-y-1 active:border-b-0 uppercase text-xs tracking-widest">
                            Вчитај низа
                        </button>
                    ) : (
                        <div className="flex flex-wrap justify-center gap-1 px-4">
                            {userSequence.map((bit, i) => (
                                <span key={i} className="text-xl font-black text-[#008b44]">{bit}</span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="w-full space-y-4">
                    <p className="text-[10px] text-[#003663] font-black uppercase text-center tracking-tighter">
                        {isShowing ? "СЛЕДИ ГО ЕКРАНОТ..." : "ВНЕСИ ЈА ПРАВИЛНАТА НИЗА:"}
                    </p>

                    {/* BINARY INPUTS */}
                    <div className="flex gap-4">
                        {[0, 1].map(bit => (
                            <button
                                key={bit}
                                disabled={isShowing || gameState !== 'PLAYING'}
                                onClick={() => handleInput(bit)}
                                className={`flex-1 py-6 rounded-3xl text-5xl font-black transition-all transform
                                    ${isShowing || gameState !== 'PLAYING'
                                        ? 'bg-slate-200 text-slate-300 border-b-4 border-slate-300'
                                        : 'bg-[#0061a1] text-white shadow-[0_8px_0_#003663] hover:scale-105 active:translate-y-1 active:shadow-none border-b-0'}`}
                            >
                                {bit}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}