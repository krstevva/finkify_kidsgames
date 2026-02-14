import React, { useState, useEffect } from 'react';

export default function CyberBridge({ onLevelUp, isPaused }) {
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [level, setLevel] = useState(1);
  const [activeNode, setActiveNode] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);

  useEffect(() => {
    generateLevel();
  }, [level]);

  const generateLevel = () => {
    const newNodes = [];
    const count = 4 + Math.min(level, 6);
    const minDistance = 10; 

    for (let i = 0; i < count; i++) {
      let newNode;
      let isTooClose;
      let attempts = 0;

      do {
        isTooClose = false;
        newNode = {
          id: i,
          x: 10 + Math.random() * 80,
          y: 20 + Math.random() * 60,
          type: i === 0 ? 'start' : i === count - 1 ? 'end' : 'data',
          order: i,
          status: i === 0 ? 'active' : 'idle'
        };

        for (const existingNode of newNodes) {
          const dx = newNode.x - existingNode.x;
          const dy = newNode.y - existingNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < minDistance) {
            isTooClose = true;
            break;
          }
        }
        
        attempts++;
      } while (isTooClose && attempts < 50);

      newNodes.push(newNode);
    }
    setNodes(newNodes);
    setConnections([]);
    setActiveNode(0);
  };

  const handleNodeClick = (clickedNode) => {
    if (isPaused || isGameOver || isGameFinished) return;

    if (clickedNode.order === activeNode + 1) {
      setConnections(prev => [...prev, { from: activeNode, to: clickedNode.id }]);
      setActiveNode(clickedNode.id);
      
      setNodes(prev => prev.map(n => 
        n.id === clickedNode.id ? { ...n, status: 'active' } : n
      ));

      if (clickedNode.type === 'end') {
        if (level >= 10) {
          setIsGameFinished(true);
        } else {
          setTimeout(() => {
            setLevel(prev => prev + 1);
            onLevelUp();
          }, 500);
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-[500px] select-none relative">
      <div className="w-full flex justify-between mb-4 px-6">
        <div className="bg-cyan-600 text-white px-4 py-2 rounded-2xl font-black shadow-lg">
          МИСИЈА: {level}/10
        </div>
        <div className="text-slate-500 font-bold animate-pulse">Поврзи ги сите точки! ⚡</div>
      </div>

      <div className="relative w-full flex-1 bg-slate-900 rounded-[2rem] border-4 border-slate-700 overflow-hidden shadow-2xl">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {connections.map((conn, idx) => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);
            return (
              <line
                key={idx}
                x1={`${fromNode.x}%`}
                y1={`${fromNode.y}%`}
                x2={`${toNode.x}%`}
                y2={`${toNode.y}%`}
                stroke="#22d3ee"
                strokeWidth="6"
                className="animate-pulse"
              />
            );
          })}
        </svg>

        {nodes.map(node => (
          <button
            key={node.id}
            onClick={() => handleNodeClick(node)}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            className={`
              absolute transform -translate-x-1/2 -translate-y-1/2
              w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold
              transition-all duration-300 z-10
              ${node.status === 'active' 
                ? 'bg-cyan-400 text-slate-900 shadow-[0_0_25px_#22d3ee] scale-110' 
                : 'bg-slate-800 text-slate-400 border-2 border-slate-600 hover:border-cyan-400'}
            `}
          >
            {node.type === 'start' ? '🚀' : node.type === 'end' ? '🏁' : node.order + 1}
          </button>
        ))}

        {isGameFinished && (
          <div className="absolute inset-0 bg-slate-900/95 z-[100] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-500">
            <div className="text-center">
              <div className="text-8xl mb-4 animate-bounce">🎓</div>
              <h2 className="text-5xl font-black text-white mb-2 tracking-tighter">
                МИСИЈАТА Е <span className="text-cyan-400">УСПЕШНА!</span>
              </h2>
              <p className="text-xl text-slate-300 mb-8 max-w-md mx-auto">
                Ти ги помина сите 10 нива на Сајбер Мост и докажа дека си вистински ФИНКИнаут!
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
    </div>
  );
}