import React, { useRef, useEffect, useState } from 'react';

export default function CyberRunner({ onLevelUp, isPaused }) {
    const canvasRef = useRef(null);
    const [gameScore, setGameScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [isGameOver, setIsGameOver] = useState(false);

    const playerPos = useRef({ x: 150, y: 330 });
    const items = useRef([]);
    const frameId = useRef();
    const scoreRef = useRef(0);
    const speedMultiplier = useRef(1);

    const resetGame = () => {
        scoreRef.current = 0;
        setGameScore(0);
        setLives(3);
        setIsGameOver(false);
        items.current = [];
        speedMultiplier.current = 1;
    };

    useEffect(() => {
        if (isGameOver) return; 

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const spawnItem = () => {
            const isGood = Math.random() > 0.7;
            const itemConfig = isGood
                ? { char: '🛡️', type: 'good' }
                : { char: '🦠', type: 'bad' };

            items.current.push({
                x: Math.random() * (canvas.width - 40),
                y: -40,
                speed: (2 + Math.random() * 2) * speedMultiplier.current,
                ...itemConfig
            });
        };

        const update = () => {
            if (isPaused || isGameOver) {
                frameId.current = requestAnimationFrame(update);
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.font = '45px serif';
            ctx.fillText('🧑‍💻', playerPos.current.x, playerPos.current.y + 40);

            items.current.forEach((item, index) => {
                item.y += item.speed;
                ctx.font = '35px serif';
                ctx.fillText(item.char, item.x, item.y);

                const dist = Math.sqrt(
                    Math.pow(playerPos.current.x + 20 - (item.x + 15), 2) +
                    Math.pow(playerPos.current.y + 20 - (item.y - 15), 2)
                );

                if (dist < 35) {
                    items.current.splice(index, 1);
                    if (item.type === 'good') {
                        scoreRef.current += 10;
                        setGameScore(scoreRef.current);
                        if (scoreRef.current > 0 && scoreRef.current % 100 === 0) {
                            speedMultiplier.current += 0.15;

                            items.current = [];

                            onLevelUp();
                        }
                    } else {
                        setLives(prev => {
                            if (prev <= 1) {
                                setIsGameOver(true);
                                return 0;
                            }
                            return prev - 1;
                        });
                    }
                }

                if (item.y > canvas.height) items.current.splice(index, 1);
            });

            if (Math.random() < 0.03) spawnItem();
            frameId.current = requestAnimationFrame(update);
        };

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            if (mouseX > 0 && mouseX < canvas.width - 40) {
                playerPos.current.x = mouseX;
            }
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        frameId.current = requestAnimationFrame(update);

        return () => {
            cancelAnimationFrame(frameId.current);
            canvas.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isPaused, isGameOver, onLevelUp]);

    return (
        <div className="flex flex-col items-center">
            <div className="w-full flex justify-between mb-4 px-2">
                <div className="text-xl font-bold text-blue-600 font-mono">Ниво: {Math.floor(gameScore / 100) + 1}</div>
                <div className="text-xl font-bold text-green-600 font-mono">Score: {gameScore}</div>
                <div className="text-xl font-bold text-red-500">Lives: {'❤️'.repeat(lives)}</div>
            </div>

            <div className="relative">
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={400}
                    className="bg-slate-900 rounded-2xl cursor-none border-8 border-slate-800 shadow-2xl"
                />

                {isGameOver && (
                    <div className="absolute inset-0 bg-slate-900/90 rounded-xl flex flex-col items-center justify-center text-center p-6 animate-in fade-in zoom-in duration-300">
                        <span className="text-6xl mb-4">👾</span>
                        <h2 className="text-3xl font-black text-white mb-2">КРАЈ НА ИГРАТА!</h2>
                        <p className="text-slate-400 mb-6">Твојот систем беше заразен од вирус.</p>
                        <button
                            onClick={resetGame}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all"
                        >
                            ОБИДИ СЕ ПОВТОРНО 🔄
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-4 flex gap-6 text-sm bg-white/50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-slate-600"><span>🛡️</span> Собери</div>
                <div className="flex items-center gap-2 font-bold text-slate-600"><span>🦠</span> Избегнувај</div>
            </div>
        </div>
    );
}