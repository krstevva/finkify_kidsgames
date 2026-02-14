import React, { useState, useEffect } from 'react';

const LEVELS = [
    {
        id: 1,
        name: "Basic Encryption",
        size: 3,
        pieces: [
            { id: "p1", color: "#0061a1", shape: [[0, 0], [0, 1], [0, 2]] },
            { id: "p2", color: "#d51920", shape: [[0, 0], [1, 0]] },
            { id: "p3", color: "#faa61a", shape: [[0, 0], [1, 0], [1, 1]] },
            { id: "p4", color: "#003663", shape: [[0, 0]] }
        ]
    },
    {
        id: 2,
        name: "Core Recovery",
        size: 4,
        pieces: [
            { id: "a1", color: "#003663", shape: [[0, 0], [0, 1], [1, 0], [1, 1]] },
            { id: "a2", color: "#0061a1", shape: [[0, 0], [0, 1], [0, 2]] },
            { id: "a3", color: "#faa61a", shape: [[0, 0], [1, 0], [2, 0]] },
            { id: "a4", color: "#d51920", shape: [[0, 0], [1, 0]] },
            { id: "a5", color: "#008b44", shape: [[0, 0], [0, 1]] },
            { id: "a6", color: "#0061a1", shape: [[0, 0], [1, 0]] }
        ]
    },
    {
        id: 3,
        name: "Access Matrix",
        size: 4,
        pieces: [
            { id: "b1", color: "#faa61a", shape: [[0, 0], [0, 1], [2, 1], [1, 1]] },
            { id: "b2", color: "#003663", shape: [[0, 0], [0, 1], [0, 2], [0, 3]] },
            { id: "b3", color: "#d51920", shape: [[0, 0], [1, 0], [2, 0], [2, 1]] },
            { id: "b4", color: "#0061a1", shape: [[0, 0], [1, 0], [1, 1], [2, 1]] }
        ]
    },
    {
        id: 4,
        name: "Key Exchange",
        size: 4,
        pieces: [
            { id: "c1", color: "#0061a1", shape: [[0, 0], [0, 1], [0, 2]] },
            { id: "c2", color: "#faa61a", shape: [[0, 0], [0, 1], [1, 0]] },
            { id: "c3", color: "#d51920", shape: [[0, 1], [1, 0], [1, 1], [1, 2]] },
            { id: "c4", color: "#003663", shape: [[0, 0], [1, 0], [1, 1], [2, 1]] },
            { id: "e3", color: "#008b44", shape: [[0, 0], [1, 0]] },
        ]
    },
    {
        id: 5,
        name: "Network Protocol",
        size: 4,
        pieces: [
            { id: "c1", color: "#d51920", shape: [[0, 0], [0, 1], [0, 2]] },
            { id: "c2", color: "#0061a1", shape: [[0, 0], [0, 1], [1, 0]] },
            { id: "c3", color: "#faa61a", shape: [[0, 1], [1, 0], [1, 1], [1, 2]] },
            { id: "c4", color: "#003663", shape: [[0, 0], [1, 0], [1, 1], [2, 1]] },
            { id: "e3", color: "#d51920", shape: [[0, 0], [1, 0]] },
        ]
    },
    {
        id: 6,
        name: "Packet Routing",
        size: 5,
        pieces: [
            { id: "d1", color: "#003663", shape: [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2]] },
            { id: "d2", color: "#d51920", shape: [[0, 0], [1, 0], [2, 0], [2, -1], [3, 0]] },
            { id: "d3", color: "#faa61a", shape: [[0, 0], [0, 1], [1, 1], [2, 1], [2, 2]] },
            { id: "d4", color: "#0061a1", shape: [[0, 0], [1, 0], [2, 0], [2, 1]] },
            { id: "d5", color: "#008b44", shape: [[0, 0], [0, 1], [1, 0], [2, 0]] },
            { id: "d6", color: "#d51920", shape: [[0, 0]] }
        ]
    },
    {
        id: 7,
        name: "Security Layer",
        size: 4,
        pieces: [
            { id: "b1", color: "#0061a1", shape: [[0, 0], [0, 1], [2, 1], [1, 1]] },
            { id: "b2", color: "#faa61a", shape: [[0, 0], [0, 1], [0, 2], [0, 3]] },
            { id: "b3", color: "#003663", shape: [[0, 0], [1, 0], [2, 0], [2, 1]] },
            { id: "b4", color: "#d51920", shape: [[0, 0], [1, 0], [1, 1], [2, 1]] }
        ]
    },
    {
        id: 8,
        name: "Threat Modeling",
        size: 5,
        pieces: [
            { id: "e1", color: "#008b44", shape: [[0, 0], [1, -1], [1, 0], [2, 0], [3, 0]] },
            { id: "e2", color: "#0061a1", shape: [[0, 0], [0, 1], [0, 2], [1, 1]] },
            { id: "e3", color: "#faa61a", shape: [[0, 0], [1, 0], [2, 0], [3, 0]] },
            { id: "e4", color: "#d51920", shape: [[0, 0], [1, 0], [1, 1], [2, 0], [2, 1]] },
            { id: "e5", color: "#003663", shape: [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]] },
            { id: "e6", color: "#faa61a", shape: [[0, 0], [0, 1]] },
        ]
    },
    {
        id: 9,
        name: "Zero Trust Grid",
        size: 6,
        pieces: [
            { id: "f1", color: "#0061a1", shape: [[0, 0], [0, 1], [1, 0], [1, 1], [1, 2], [1, 3], [2, 2], [2, 3]] },
            { id: "f2", color: "#d51920", shape: [[0, 0], [0, 1], [1, 0], [2, 0], [3, 0]] },
            { id: "f3", color: "#faa61a", shape: [[0, 0], [0, 1], [0, 2], [1, 1], [1, 2]] },
            { id: "f4", color: "#008b44", shape: [[0, 0], [1, 0], [1, 1]] },
            { id: "f5", color: "#003663", shape: [[0, 0], [0, 1], [0, 2]] },
            { id: "f6", color: "#0061a1", shape: [[0, 2], [1, 0], [1, 1], [1, 2], [1, 3], [1, 4]] },
            { id: "f7", color: "#faa61a", shape: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5]] }
        ]
    },
    {
        id: 10,
        name: "Final Integrity",
        size: 6,
        pieces: [
            { id: "g1", color: "#008b44", shape: [[0, 0], [1, 0], [1, 1], [2, 1]] },
            { id: "g2", color: "#0061a1", shape: [[0, 1], [0, 2], [1, 1], [2, 0], [2, 1], [3, 0], [4, 0], [4, 1]] },
            { id: "g3", color: "#faa61a", shape: [[0, 0], [0, 1], [0, 2], [1, 1], [1, 2], [2, 2]] },
            { id: "g4", color: "#d51920", shape: [[0, 1], [1, 1], [1, 2], [2, 0], [2, 1]] },
            { id: "g5", color: "#003663", shape: [[0, 0], [0, 1], [0, 2], [1, 0], [2, 0]] },
            { id: "g6", color: "#d51920", shape: [[0, 3], [1, 1], [1, 2], [1, 3], [2, 0], [2, 1], [2, 2], [2, 3]] }
        ]
    }
];

const BlockPuzzle = ({ onLevelUp, isPaused, onGameFinish }) => {
    const [levelIdx, setLevelIdx] = useState(0);
    const [grid, setGrid] = useState([]);
    const [remainingPieces, setRemainingPieces] = useState([]);
    const [placedPieces, setPlacedPieces] = useState([]);
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [hoverPos, setHoverPos] = useState(null);
    const [isComplete, setIsComplete] = useState(false);

    const currentLevel = LEVELS[levelIdx];

    useEffect(() => {
        if (!currentLevel) return;
        setGrid(Array(currentLevel.size).fill(null).map(() => Array(currentLevel.size).fill(null)));
        setRemainingPieces(currentLevel.pieces);
        setPlacedPieces([]);
        setSelectedPiece(null);
        setIsComplete(false);
    }, [levelIdx, currentLevel]);

    useEffect(() => {
        if (isComplete) {
            const timer = setTimeout(() => {
                onLevelUp();
                if (levelIdx < LEVELS.length - 1) {
                    setLevelIdx(prev => prev + 1);
                } else {
                    if (onGameFinish) onGameFinish();
                }
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [isComplete, onLevelUp, levelIdx, onGameFinish]);

    const handleCellClick = (row, col) => {
        if (isPaused || isComplete) return;

        if (selectedPiece) {
            const newGrid = grid.map(r => [...r]);
            let canPlace = true;

            for (const [dr, dc] of selectedPiece.shape) {
                const nr = row + dr;
                const nc = col + dc;
                if (nr < 0 || nr >= currentLevel.size || nc < 0 || nc >= currentLevel.size || newGrid[nr][nc] !== null) {
                    canPlace = false;
                    break;
                }
            }

            if (canPlace) {
                const occupiedCells = [];
                selectedPiece.shape.forEach(([dr, dc]) => {
                    newGrid[row + dr][col + dc] = selectedPiece.color;
                    occupiedCells.push([row + dr, col + dc]);
                });

                setGrid(newGrid);
                setPlacedPieces([...placedPieces, { ...selectedPiece, placedAt: occupiedCells }]);
                setRemainingPieces(prev => prev.filter(p => p.id !== selectedPiece.id));
                setSelectedPiece(null);

                if (newGrid.every(r => r.every(cell => cell !== null))) setIsComplete(true);
            }
        }
        else if (grid[row][col] !== null) {
            const pieceToRemove = placedPieces.find(p =>
                p.placedAt.some(([r, c]) => r === row && c === col)
            );

            if (pieceToRemove) {
                const newGrid = grid.map(r => [...r]);
                pieceToRemove.placedAt.forEach(([r, c]) => {
                    newGrid[r][c] = null;
                });
                setGrid(newGrid);
                setPlacedPieces(prev => prev.filter(p => p.id !== pieceToRemove.id));
                const { placedAt, ...originalPiece } = pieceToRemove;
                setRemainingPieces([...remainingPieces, originalPiece]);
            }
        }
    };

    return (
        <div className="relative flex flex-col items-center justify-center w-full h-full animate-in fade-in duration-500">
            <div className="mb-4">
                <span className="bg-[#003663] text-white px-6 py-1 rounded-full text-sm font-black tracking-widest shadow-md uppercase">
                    НИВО {currentLevel.id} / {LEVELS.length}
                </span>
            </div>

            <div className="flex flex-col items-center gap-6 p-8 bg-slate-50 rounded-3xl border-4 border-[#003663] shadow-inner w-full max-w-md">
                
                <div
                    className="grid gap-2 bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-sm relative"
                    style={{ gridTemplateColumns: `repeat(${currentLevel.size}, 50px)` }}
                    onMouseLeave={() => setHoverPos(null)}
                >
                    {grid.map((row, r) =>
                        row.map((cell, c) => {
                            let isPreview = false;
                            if (selectedPiece && hoverPos) {
                                isPreview = selectedPiece.shape.some(([dr, dc]) =>
                                    hoverPos.r + dr === r && hoverPos.c + dc === c
                                );
                            }

                            return (
                                <div
                                    key={`${r}-${c}`}
                                    onMouseEnter={() => setHoverPos({ r, c })}
                                    onClick={() => handleCellClick(r, c)}
                                    className={`w-[50px] h-[50px] rounded-xl border-2 transition-all duration-150 flex items-center justify-center
                                        ${cell ? 'border-transparent shadow-md' : 'border-slate-100 hover:bg-sky-50 cursor-pointer active:scale-90'}`}
                                    style={{
                                        backgroundColor: cell || (isPreview ? `${selectedPiece.color}66` : '#f8fafc'),
                                        borderColor: isPreview ? selectedPiece.color : undefined
                                    }}
                                >
                                    {cell && <span className="text-white/50 text-[10px] font-black italic">ФИНКИ</span>}
                                </div>
                            );
                        })
                    )}

                    {isComplete && (
                        <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center z-10 rounded-2xl animate-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-[#faa61a]/20 text-[#faa61a] rounded-full flex items-center justify-center text-3xl mb-4 animate-bounce">
                                🎓
                            </div>
                            <p className="text-[#003663] font-black uppercase tracking-tight">КОДОТ Е СКЛОПЕН!</p>
                            <div className="mt-4 flex items-center gap-2">
                                <div className="w-2 h-2 bg-[#d51920] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-[#0061a1] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-[#faa61a] rounded-full animate-bounce"></div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="w-full">
                    <p className="text-[10px] text-[#003663] font-black uppercase text-center mb-4 tracking-tighter italic">
                        {selectedPiece ? "ПОСТАВИ ГО ДЕЛЧЕТО НА МРЕЖАТА" : "ИЗБЕРИ БЛОК ОД СИСТЕМОТ"}
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {remainingPieces.map(piece => (
                            <button
                                key={piece.id}
                                onClick={() => setSelectedPiece(selectedPiece?.id === piece.id ? null : piece)}
                                className={`p-3 rounded-2xl border-4 transition-all transform active:scale-95
                                    ${selectedPiece?.id === piece.id
                                        ? 'border-[#faa61a] bg-white shadow-xl scale-110'
                                        : 'border-slate-200 bg-white hover:border-[#0061a1]'}`}
                            >
                                <div className="relative w-10 h-10 mx-auto">
                                    {piece.shape.map(([r, c], i) => (
                                        <div
                                            key={i}
                                            className="absolute w-[10px] h-[10px] rounded-sm shadow-sm"
                                            style={{ backgroundColor: piece.color, top: `${r * 12}px`, left: `${c * 12}px` }}
                                        />
                                    ))}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="text-[10px] text-slate-400 font-bold uppercase text-center bg-white px-4 py-2 rounded-lg border border-slate-100">
                    💡Кликни на веќе поставен блок за да го отстраниш.
                </div>
            </div>
        </div>
    );
};

export default BlockPuzzle;