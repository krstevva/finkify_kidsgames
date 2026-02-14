import React, { useState, useEffect } from 'react';

export default function PasswordDecryptor({ onLevelUp, isPaused }) {
    const [level, setLevel] = useState(1);
    const [targetCode, setTargetCode] = useState("");
    const [input, setInput] = useState("");
    const [history, setHistory] = useState([]);
    const [gameState, setGameState] = useState('PLAYING');
    const [hasFinalWon, setHasFinalWon] = useState(false);

    const getAvailableDigits = (lvl) => {
        if (lvl < 5) return [0, 1, 2, 3];
        if (lvl < 8) return [0, 1, 2, 3, 4, 5, 6];
        return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    };

    const availableDigits = getAvailableDigits(level);
    const maxAttempts = level < 8 ? 6 : 8;
    useEffect(() => {
        generateNewCode();
    }, [level]);

    const generateNewCode = () => {
        let code = "";
        const digits = getAvailableDigits(level);
        for (let i = 0; i < 3; i++) {
            const randomDigit = digits[Math.floor(Math.random() * digits.length)];
            code += randomDigit.toString();
        }
        setTargetCode(code);
        setHistory([]);
        setInput("");
        setGameState('PLAYING');
    };

    const handleInput = (num) => {
        if (input.length < 3 && gameState === 'PLAYING' && !isPaused && availableDigits.includes(parseInt(num))) {
            setInput(prev => prev + num);
        }
    };

    const checkCode = () => {
        if (input.length !== 3 || isPaused) return;

        let correctPos = 0;
        let correctNum = 0;
        const targetArr = targetCode.split("");
        const inputArr = input.split("");

        inputArr.forEach((num, i) => {
            if (num === targetArr[i]) {
                correctPos++;
                targetArr[i] = null;
                inputArr[i] = "checked";
            }
        });

        inputArr.forEach((num, i) => {
            if (num !== "checked") {
                const foundIndex = targetArr.indexOf(num);
                if (foundIndex !== -1) {
                    correctNum++;
                    targetArr[foundIndex] = null;
                }
            }
        });

        const result = { code: input, correctPos, correctNum };
        setHistory([result, ...history]);
        setInput("");

        if (correctPos === 3) {
            setGameState('WON');
            setTimeout(() => {
                if (level >= 10) {
                    setHasFinalWon(true);
                } else {
                    onLevelUp();
                    setLevel(prev => prev + 1);
                }
            }, 800);
        } else if (history.length + 1 >= maxAttempts) {
            setGameState('LOST');
        }
    };

    return (
        <div className="relative flex flex-col items-center font-mono text-white">
            {hasFinalWon && (
                <div className="absolute inset-0 bg-slate-900/95 z-[100] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-500 rounded-3xl">
                    <div className="text-center">
                        <div className="text-8xl mb-4 animate-bounce">🎓</div>
                        <h2 className="text-5xl font-black text-white mb-2 tracking-tighter">
                            МИСИЈАТА Е <span className="text-cyan-400">УСПЕШНА!</span>
                        </h2>
                        <p className="text-xl text-slate-300 mb-8 max-w-md mx-auto">
                            Ти ги проби сите лозинки и докажа дека си вистински ФИНКИнаут!
                        </p>

                        <div className="flex flex-col gap-4">
                            <button
                                onClick={() => {
                                    setHasFinalWon(false);
                                    setLevel(1);
                                    setSolved([]); // Доколку користиш ваква состојба
                                    generateNewCode();
                                }}
                                className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-black py-4 px-12 rounded-2xl text-2xl shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-transform hover:scale-105"
                            >
                                ИГРАЈ ПОВТОРНО 🔄
                            </button>
                            <p className="text-cyan-600 font-bold italic mt-4">Иднината те чека на ФИНКИ! 🏛️</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-2 text-center">
                <div className="text-[10px] text-emerald-500/50 tracking-widest uppercase">Слој: {level}/10</div>
                <h4 className="text-xl font-black italic tracking-tighter uppercase">Декриптор...</h4>
                {/* Текст за дозволени цифри */}
                <p className="text-[10px] text-yellow-500 font-bold mt-1 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">
                    Користи ги цифрите: {availableDigits.join(", ")}
                </p>
            </div>

            <div className="w-full max-w-[280px] bg-black/40 border-2 border-white/5 p-4 rounded-2xl mb-4 shadow-inner">
                <div className="flex justify-center gap-4 mb-4">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className={`w-12 h-16 border-b-2 flex items-center justify-center text-4xl font-black transition-all
                            ${input[i] ? 'border-emerald-400 text-emerald-400' : 'border-slate-800 text-slate-800'}`}>
                            {input[i] || "•"}
                        </div>
                    ))}
                </div>

                <div className="h-28 overflow-y-auto space-y-1 text-[10px] scrollbar-hide border-t border-white/5 pt-2">
                    {history.map((h, i) => (
                        <div key={i} className="flex justify-between items-center opacity-80">
                            <span className="text-slate-500 tracking-tighter">{history.length - i}. CODE: {h.code}</span>
                            <span className="flex gap-2 font-bold">
                                <span className="text-emerald-400">✓{h.correctPos}</span>
                                <span className="text-yellow-500">?{h.correctNum}</span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-5 gap-2 mb-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(num => {
                    const isAvailable = availableDigits.includes(num);
                    return (
                        <button
                            key={num}
                            disabled={!isAvailable}
                            onClick={() => handleInput(num.toString())}
                            className={`w-10 h-10 border rounded-lg transition-all font-bold 
                                ${isAvailable
                                    ? 'bg-slate-800/50 border-white/10 hover:bg-emerald-500 hover:text-slate-900 active:scale-90'
                                    : 'bg-black/20 border-white/5 text-white/10 cursor-not-allowed'}`}
                        >
                            {num}
                        </button>
                    );
                })}
            </div>

            <div className="flex gap-2 w-full max-w-[280px]">
                <button onClick={() => setInput("")} className="flex-1 py-3 text-slate-500 text-[10px] uppercase font-bold hover:text-red-400">Избриши се</button>
                <button onClick={checkCode} className="flex-[2] py-3 bg-white text-slate-900 font-black rounded-xl hover:bg-emerald-400 transition-all uppercase text-xs">Декриптирај</button>
            </div>

            {gameState === 'LOST' && (
                <div className="absolute inset-0 bg-red-950/90 z-50 flex flex-col items-center justify-center rounded-2xl border-2 border-red-500 animate-in fade-in">
                    <h2 className="text-2xl font-black text-white">НЕУСПЕШНО</h2>
                    <p className="text-red-200 text-xs mb-4">Кодот е: {targetCode}</p>
                    <button onClick={generateNewCode} className="bg-white text-red-900 font-black py-2 px-6 rounded-lg text-xs uppercase">Обиди се повторно</button>
                </div>
            )}
        </div>
    );
}