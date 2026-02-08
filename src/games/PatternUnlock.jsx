import React, { useState, useEffect, useRef } from 'react';

const PatternUnlock = ({ onLevelUp, isPaused }) => {
    const [level, setLevel] = useState(1);
    const [targetPattern, setTargetPattern] = useState([]);
    const [userPattern, setUserPattern] = useState([]);
    const [isShowingPattern, setIsShowingPattern] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isGameFinished, setIsGameFinished] = useState(false);
    const [feedback, setFeedback] = useState(''); // 'success' или 'error'

    const containerRef = useRef(null);

    // Генерирање на случајна шема базирана на нивото
    const generatePattern = (lvl) => {
        // Ниво 1-2: 3 точки
        // Ниво 3-5: 4 точки
        // Ниво 6-8: 5 точки
        // Ниво 9-10: 6 точки (ова е идеалниот баланс за 3x3 мрежа)
        let length;
        if (lvl <= 2) length = 3;
        else if (lvl <= 5) length = 4;
        else if (lvl <= 8) length = 5;
        else length = 6;

        const newPattern = [];
        const available = Array.from({ length: 9 }, (_, i) => i);

        let lastNode = -1;
        for (let i = 0; i < length; i++) {
            const remaining = available.filter(n => n !== lastNode && !newPattern.includes(n));
            if (remaining.length === 0) break;
            const nextNode = remaining[Math.floor(Math.random() * remaining.length)];
            newPattern.push(nextNode);
            lastNode = nextNode;
        }
        return newPattern;
    };

    // Стартување на ново ниво
    useEffect(() => {
        if (level <= 10) {
            const newPat = generatePattern(level);
            setTargetPattern(newPat);
            setUserPattern([]);
            // ТУКА НЕ ПОВИКУВАМЕ showPatternToUser
        } else {
            setIsGameFinished(true);
        }
    }, [level]);

    useEffect(() => {
        // Провери дали квизот е затворен И дали имаме подготвена шема што не е прикажана
        if (!isPaused && targetPattern.length > 0 && userPattern.length === 0 && !isGameFinished) {

            // Мала пауза за окото да се прилагоди по квизот
            const delayBeforeStart = setTimeout(() => {
                showPatternToUser(targetPattern);
            }, 500);

            return () => clearTimeout(delayBeforeStart);
        }
    }, [isPaused, targetPattern]);

    const showPatternToUser = (pattern) => {
        if (isPaused) return; // СТОП ако е паузирано

        setIsShowingPattern(true);
        let i = 0;
        const interval = setInterval(() => {
            // Ако во меѓувреме се паузира (не би требало, но за безбедност)
            setUserPattern(pattern.slice(0, i + 1));
            i++;

            if (i > pattern.length) {
                clearInterval(interval);
                setTimeout(() => {
                    setIsShowingPattern(false);
                    setUserPattern([]);
                }, 800);
            }
        }, 600);
    };

    const handleNodeAction = (index) => {
        if (isShowingPattern || isPaused || isGameFinished) return;

        if (!userPattern.includes(index)) {
            const newPattern = [...userPattern, index];
            setUserPattern(newPattern);

            // Проверка дали е грешка во сред влечење
            if (targetPattern[newPattern.length - 1] !== index) {
                handleFailure();
            } else if (newPattern.length === targetPattern.length) {
                handleSuccess();
            }
        }
    };

    const handleSuccess = () => {
        setFeedback('success');
        setTimeout(() => {
            setFeedback('');
            setUserPattern([]); // Ја чистиме старата шема
            if (level < 10) {
                setLevel(prev => prev + 1);
                onLevelUp(); // Ова го отвора квизот (isPaused станува true)
            } else {
                setIsGameFinished(true);
            }
        }, 1000);
    };

    const handleFailure = () => {
        setFeedback('error');
        setIsDrawing(false);
        setTimeout(() => {
            setFeedback('');
            setUserPattern([]);
            showPatternToUser(targetPattern); // Повтори ја анимацијата
        }, 1000);
    };

    // Пресметка на линии меѓу точките
    const renderLines = () => {
        return userPattern.map((nodeIndex, i) => {
            if (i === 0) return null;
            const prev = userPattern[i - 1];
            const x1 = (prev % 3) * 100 + 50;
            const y1 = Math.floor(prev / 3) * 100 + 50;
            const x2 = (nodeIndex % 3) * 100 + 50;
            const y2 = Math.floor(nodeIndex / 3) * 100 + 50;

            return (
                <line
                    key={`line-${i}`}
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={feedback === 'error' ? '#ef4444' : feedback === 'success' ? '#22c55e' : '#3b82f6'}
                    strokeWidth="8"
                    strokeLinecap="round"
                    className="animate-in fade-in duration-300"
                />
            );
        });
    };

    return (
        <div className="relative flex flex-col items-center select-none overflow-hidden pb-10">
            <div className="mb-6 text-center">
                <h4 className="text-xl font-bold text-slate-700">Ниво: {level}/10</h4>
                <p className="text-slate-500 font-medium">
                    {isShowingPattern ? "Запомни ја шемата..." : "Повтори го клучот за декрипција!"}
                </p>
            </div>

            <div
                className={`relative p-4 bg-slate-100 rounded-3xl border-4 transition-colors duration-300 ${feedback === 'error' ? 'border-red-400 bg-red-50' :
                    feedback === 'success' ? 'border-green-400 bg-green-50' : 'border-slate-200'
                    }`}
                onMouseLeave={() => setIsDrawing(false)}
                onMouseUp={() => setIsDrawing(false)}
            >
                <svg width="300" height="300" className="absolute top-4 left-4 pointer-events-none z-10">
                    {renderLines()}
                </svg>

                <div className="grid grid-cols-3 gap-10 relative z-20">
                    {[...Array(9)].map((_, i) => (
                        <div
                            key={i}
                            onMouseDown={() => { setIsDrawing(true); handleNodeAction(i); }}
                            onMouseEnter={() => { if (isDrawing) handleNodeAction(i); }}
                            className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all duration-200 
                ${userPattern.includes(i)
                                    ? (feedback === 'error' ? 'bg-red-500 border-red-600 scale-110' :
                                        feedback === 'success' ? 'bg-green-500 border-green-600 scale-110' :
                                            'bg-blue-500 border-blue-600 scale-110 shadow-[0_0_15px_rgba(59,130,246,0.5)]')
                                    : 'bg-white border-slate-300 hover:border-blue-400'}`}
                        >
                            <div className={`w-4 h-4 rounded-full ${userPattern.includes(i) ? 'bg-white' : 'bg-slate-300'}`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* THE FINAL PROMPT OVERLAY */}
            {isGameFinished && (
                <div className="absolute inset-0 bg-slate-900/95 z-[100] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-500 rounded-3xl">
                    <div className="text-center">
                        <div className="text-8xl mb-4 animate-bounce">🎓</div>
                        <h2 className="text-5xl font-black text-white mb-2 tracking-tighter">
                            МИСИЈАТА Е <span className="text-cyan-400">УСПЕШНА!</span>
                        </h2>
                        <p className="text-xl text-slate-300 mb-8 max-w-md mx-auto">
                            Ти ги помина сите 10 нива на Сајбер Шема и докажа дека си вистински ФИНКИнаут!
                        </p>

                        <div className="flex flex-col gap-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-black py-4 px-12 rounded-2xl text-2xl shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-transform hover:scale-105"
                            >
                                ИГРАЈ ПОВТОРНО 🔄
                            </button>
                            <p className="text-cyan-600 font-bold italic mt-4">Иднината те чека на ФИНКИ! 🏛️</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatternUnlock;