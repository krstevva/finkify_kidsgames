import React, { useState, useEffect, useCallback } from "react";

const COLORS = [
    { id: 1, stroke: "#ef4444", bg: "bg-red-500" },
    { id: 2, stroke: "#3b82f6", bg: "bg-blue-500" },
    { id: 3, stroke: "#22c55e", bg: "bg-green-500" },
    { id: 4, stroke: "#eab308", bg: "bg-yellow-500" },
    { id: 5, stroke: "#a855f7", bg: "bg-purple-500" },
];

const NodeLinker = ({ onLevelUp, isPaused }) => {
    const [gridSize, setGridSize] = useState(5);
    const [level, setLevel] = useState(1);
    const [nodes, setNodes] = useState([]);
    const [paths, setPaths] = useState({});
    const [activeColor, setActiveColor] = useState(null);
    const [isGameFinished, setIsGameFinished] = useState(false); // Сменето име за конзистентност

    const loadLevel = useCallback((lvl) => {
        const configs = [
            { size: 5, nodes: [{ x: 0, y: 0, c: 1 }, { x: 4, y: 0, c: 1 }, { x: 0, y: 4, c: 2 }, { x: 4, y: 4, c: 2 }] },
            { size: 5, nodes: [{ x: 1, y: 1, c: 1 }, { x: 3, y: 4, c: 1 }, { x: 0, y: 0, c: 3 }, { x: 4, y: 0, c: 3 }, { x: 0, y: 4, c: 2 }, { x: 2, y: 2, c: 2 }] },
            { size: 5, nodes: [{ x: 0, y: 0, c: 1 }, { x: 2, y: 2, c: 1 }, { x: 4, y: 0, c: 2 }, { x: 4, y: 4, c: 2 }, { x: 0, y: 2, c: 3 }, { x: 3, y: 3, c: 3 }] },
        ];

        const config = configs[(lvl - 1) % configs.length];
        setGridSize(config.size);
        setNodes(config.nodes.map((n) => ({ x: n.x, y: n.y, colorId: n.c })));
        setPaths({});
        setActiveColor(null);
    }, []);

    useEffect(() => {
        if (level <= 10) loadLevel(level);
        else setIsGameFinished(true);
    }, [level, loadLevel]);

    const getPos = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const x = Math.floor((clientX - rect.left) / (rect.width / gridSize));
        const y = Math.floor((clientY - rect.top) / (rect.height / gridSize));
        return { x, y };
    };

    const startPath = (e) => {
        if (isPaused || isGameFinished) return;
        const { x, y } = getPos(e);
        const node = nodes.find((n) => n.x === x && n.y === y);
        if (!node) return;

        setActiveColor(node.colorId);
        setPaths((prev) => ({ ...prev, [node.colorId]: [{ x, y }] }));
    };

    const movePath = (e) => {
        if (isPaused || !activeColor || isGameFinished) return;

        const { x, y } = getPos(e);
        if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) return;

        setPaths((prev) => {
            const currentPath = prev[activeColor] || [];
            if (currentPath.length === 0) return prev;

            const last = currentPath[currentPath.length - 1];
            if (last.x === x && last.y === y) return prev;

            const dist = Math.abs(x - last.x) + Math.abs(y - last.y);
            if (dist !== 1) return prev;

            // Backtracking
            if (currentPath.length >= 2) {
                const beforeLast = currentPath[currentPath.length - 2];
                if (beforeLast.x === x && beforeLast.y === y) {
                    return { ...prev, [activeColor]: currentPath.slice(0, -1) };
                }
            }

            // Logic for nodes and occupied paths
            const isTarget = nodes.some((n) => n.x === x && n.y === y && n.colorId === activeColor);
            const otherNodeHere = nodes.some((n) => n.x === x && n.y === y && n.colorId !== activeColor);
            if (otherNodeHere) return prev;

            const occupiedByOtherPath = Object.entries(prev).some(([cid, pts]) => {
                return Number(cid) !== activeColor && pts.some((p) => p.x === x && p.y === y);
            });
            if (occupiedByOtherPath) return prev;

            const alreadyInOwnPath = currentPath.some((p) => p.x === x && p.y === y);
            if (alreadyInOwnPath) return prev;

            return { ...prev, [activeColor]: [...currentPath, { x, y }] };
        });
    };

    const endPath = () => {
        if (!activeColor) return;

        const currentPath = paths[activeColor];
        const colorNodes = nodes.filter((n) => n.colorId === activeColor);

        const startOk = currentPath && colorNodes.some(n => n.x === currentPath[0].x && n.y === currentPath[0].y);
        const endOk = currentPath && colorNodes.some(n => n.x === currentPath[currentPath.length - 1].x && n.y === currentPath[currentPath.length - 1].y);

        if (!(startOk && endOk && currentPath.length > 1)) {
            setPaths((prev) => {
                const next = { ...prev };
                delete next[activeColor];
                return next;
            });
        } else {
            // ПРОВЕРКА ЗА ПОБЕДА - само кога успешно ќе се поврзе линија
            const totalColors = new Set(nodes.map((n) => n.colorId)).size;
            // Внимавај: користиме paths бидејќи setActiveColor(null) е подоцна
            if (Object.keys(paths).length === totalColors) {
                setTimeout(() => {
                    if (level < 10) {
                        setLevel((l) => l + 1);
                        onLevelUp?.();
                    } else {
                        setIsGameFinished(true);
                    }
                }, 600);
            }
        }
        setActiveColor(null);
    };

    return (
        <div className="flex flex-col items-center p-4 select-none">
            <div className="text-center mb-4">
                <h3 className="text-3xl font-black text-slate-700 tracking-tighter">САЈБЕР ВРСКИ 🌐</h3>
                <p className="text-slate-500 font-medium">Ниво {level}/10: Поврзи ги серверите!</p>
            </div>

            <div
                className={`relative bg-slate-900 p-2 rounded-2xl shadow-2xl touch-none border-4 transition-colors ${activeColor ? 'border-indigo-500' : 'border-slate-700'}`}
                onMouseDown={startPath}
                onMouseMove={movePath}
                onMouseUp={endPath}
                onMouseLeave={endPath}
                onTouchStart={startPath}
                onTouchMove={movePath}
                onTouchEnd={endPath}
                style={{ width: "350px", height: "350px" }}
            >
                {/* Grid */}
                <div className="absolute inset-0 grid p-2" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
                    {[...Array(gridSize * gridSize)].map((_, i) => (
                        <div key={i} className="border border-white/5" />
                    ))}
                </div>

                {/* Lines */}
                <svg className="absolute inset-0 pointer-events-none" width="350" height="350">
                    {Object.entries(paths).map(([colorId, points]) => {
                        const color = COLORS.find((c) => c.id === Number(colorId));
                        return (
                            <polyline
                                key={colorId}
                                points={points.map(p => `${p.x * (340 / gridSize) + (340 / gridSize / 2) + 5},${p.y * (340 / gridSize) + (340 / gridSize / 2) + 5}`).join(" ")}
                                fill="none"
                                stroke={color.stroke}
                                strokeWidth="12"
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                className="transition-all duration-200"
                            />
                        );
                    })}
                </svg>

                {/* Nodes */}
                <div className="absolute inset-0 grid p-2 pointer-events-none" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
                    {nodes.map((node, i) => {
                        const color = COLORS.find((c) => c.id === node.colorId);
                        const isConnected = paths[node.colorId]?.length > 1;
                        return (
                            <div key={i} className="flex items-center justify-center" style={{ gridColumnStart: node.x + 1, gridRowStart: node.y + 1 }}>
                                <div className={`w-10 h-10 rounded-full border-4 border-slate-900 shadow-xl transition-transform ${isConnected ? 'scale-110' : 'scale-100'} ${color?.bg}`} />
                            </div>
                        );
                    })}
                </div>

                {/* FINAL OVERLAY */}
                {isGameFinished && (
                    <div className="absolute inset-0 bg-slate-900/95 z-[100] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-500 rounded-xl">
                        <div className="text-center">
                            <div className="text-7xl mb-4 animate-bounce">🎓</div>
                            <h2 className="text-4xl font-black text-white mb-2 tracking-tighter">МРЕЖАТА Е <span className="text-emerald-400">ОСИГУРАНА!</span></h2>
                            <p className="text-slate-300 mb-6 text-sm">Ти си вистински експерт за мрежна инфраструктура!</p>
                            <button onClick={() => window.location.reload()} className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black py-3 px-8 rounded-xl transition-transform hover:scale-105">ИГРАЈ ПОВТОРНО 🔄</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NodeLinker;