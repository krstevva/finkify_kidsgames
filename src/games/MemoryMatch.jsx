import React, { useState, useEffect } from 'react';

const ALL_ICONS = ['🛡️', '🔑', '💻', '🦠', '🕵️', '🔒', '📱', '📡', '👾', '🚀', '🤖', '💾', '🔌', '⚡', '🧤', '🔥', '🌈', '💎', '🚀', '🛸', '🛰️', '🔦'];

export default function MemoryMatch({ onLevelUp, isPaused }) {
    const [numCards, setNumCards] = useState(4);
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [solved, setSolved] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [hasWon, setHasWon] = useState(false);

    const getLayout = (total) => {
        const layouts = {
            4: { cols: 2, rows: 2 },
            6: { cols: 3, rows: 2 },
            8: { cols: 4, rows: 2 },
            10: { cols: 5, rows: 2 },
            12: { cols: 4, rows: 3 },
            14: { cols: 7, rows: 2 },
            16: { cols: 4, rows: 4 },
            18: { cols: 6, rows: 3 },
            20: { cols: 5, rows: 4 },
            24: { cols: 6, rows: 4 },
        };
        return layouts[total] || { cols: 4, rows: Math.ceil(total / 4) };
    };

    const { cols } = getLayout(numCards);

    useEffect(() => {
        generateBoard();
    }, [numCards]);

    const generateBoard = () => {
        const numberOfPairs = numCards / 2;
        const selectedIcons = ALL_ICONS.slice(0, numberOfPairs);
        const pairIcons = [...selectedIcons, ...selectedIcons];
        const shuffled = pairIcons
            .sort(() => Math.random() - 0.5)
            .map((icon, index) => ({ id: index, icon }));

        setCards(shuffled);
        setSolved([]);
        setFlipped([]);
    };

    const handleClick = (id) => {
        if (disabled || isPaused || solved.includes(id) || flipped.includes(id)) return;
        if (flipped.length === 0) {
            setFlipped([id]);
        } else if (flipped.length === 1) {
            setDisabled(true);
            setFlipped([flipped[0], id]);
            if (cards[flipped[0]].icon === cards[id].icon) {
                setSolved(prev => [...prev, flipped[0], id]);
                setFlipped([]);
                setDisabled(false);
            } else {
                setTimeout(() => {
                    setFlipped([]);
                    setDisabled(false);
                }, 800);
            }
        }
    };

    useEffect(() => {
        if (cards.length > 0 && solved.length === cards.length) {
            setTimeout(() => {
                if (numCards >= 24) {
                    setHasWon(true);
                    setNumCards(4);
                } else {
                    onLevelUp();
                    setNumCards(prev => {
                        if (prev === 20) return 24;
                        return prev + 2;
                    });
                }
            }, 600);
        }
    }, [solved]);

    return (
        <div className="relative flex flex-col items-center justify-center w-full h-full max-h-full">
            {hasWon && (
                <div className="absolute inset-0 bg-slate-900/95 z-[100] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-500 rounded-3xl">
                    <div className="text-center">
                        <div className="text-8xl mb-4 animate-bounce">🎓</div>
                        <h2 className="text-5xl font-black text-white mb-2 tracking-tighter">
                            МИСИЈАТА Е <span className="text-cyan-400">УСПЕШНА!</span>
                        </h2>
                        <p className="text-xl text-slate-300 mb-8 max-w-md mx-auto">
                            Ти ги помина сите нивоа на мемориja и докажа дека си вистински ФИНКИнаут!
                        </p>

                        <div className="flex flex-col gap-4">
                            <button
                                onClick={() => {
                                    setHasWon(false);
                                    setSolved([]);
                                    setFlipped([]);
                                    setNumCards(4);
                                    generateBoard();
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
            <div className="mb-4">
                <span className="bg-[#d51920] text-white px-6 py-2 rounded-full text-sm font-black tracking-[0.2em] uppercase border-b-4 border-[#003663] shadow-lg">                    НИВО {numCards === 24 ? 10 : (numCards / 2) - 1}
                </span>
            </div>

            <div
                className="grid gap-2 p-4 bg-slate-50 rounded-3xl border-2 border-slate-200 shadow-inner"
                style={{
                    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                    width: 'fit-content'
                }}
            >
                {cards.map((card) => {
                    const isFlipped = flipped.includes(card.id) || solved.includes(card.id);
                    return (
                        <button
                            key={card.id}
                            onClick={() => handleClick(card.id)}
                            className={`
                                flex items-center justify-center rounded-2xl transition-all duration-300 transform aspect-square
                                w-20 h-20 sm:w-24 sm:h-24 text-4xl sm:text-5xl
                                ${isFlipped
                                    ? 'bg-white rotate-0 shadow-sm border-2 border-purple-100'
                                    : 'bg-[#faa61a] rotate-180 shadow-[0_4px_0_#003663] hover:scale-105 active:translate-y-1 active:shadow-none'}
                            `}
                        >
                            {isFlipped ? (
                                <span>{card.icon}</span>
                            ) : (
                                <span className="transform rotate-180 inline-block">❓</span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}