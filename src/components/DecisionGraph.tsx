import React from 'react';

// Mock Data for the graph
const MOCK_NODES = [
    { id: '1', type: 'claim', label: 'Battery Isolation Meets Spec', x: 250, y: 50 },
    { id: '2', type: 'evidence', label: 'Doc A: "Galvanic isolation required"', x: 100, y: 200 },
    { id: '3', type: 'evidence', label: 'Doc B: "Design uses opticouplers"', x: 400, y: 200 },
    { id: '4', type: 'reasoning', label: 'Analysis: Opticouplers provide galvanic isolation.', x: 250, y: 350 },
    { id: '5', type: 'conclusion', label: 'SUPPORTED', x: 250, y: 500 },
];

const MOCK_EDGES = [
    { from: '2', to: '1' },
    { from: '3', to: '1' },
    { from: '4', to: '2' },
    { from: '4', to: '3' },
    { from: '4', to: '5' },
];

interface Props {
    onNodeSelect: (node: any) => void;
    theme: 'dark' | 'light';
}

export const DecisionGraph: React.FC<Props> = ({ onNodeSelect, theme = 'dark' }) => {
    const isDark = theme === 'dark';

    // Theme Configuration
    const T = {
        grid: isDark ? 'radial-gradient(circle, #374151 1px, transparent 1px)' : 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
        edge: isDark ? '#4B5563' : '#94a3b8',
        nodeText: isDark ? 'text-gray-100' : 'text-gray-800',
        nodeSub: isDark ? 'text-gray-400' : 'text-gray-500',
    };

    const getNodeStyle = (type: string) => {
        const base = isDark ? "bg-[#111] border shadow-lg shadow-black/50" : "bg-white border shadow-sm";

        switch (type) {
            case 'claim': return `${base} ${isDark ? 'border-blue-700/50 text-blue-100' : 'border-blue-400 text-blue-900'}`;
            case 'evidence': return `${base} ${isDark ? 'border-green-700/50 text-green-100' : 'border-green-400 text-green-900'}`;
            case 'reasoning': return `${base} ${isDark ? 'border-yellow-700/50 text-yellow-100' : 'border-yellow-400 text-yellow-900'}`;
            case 'conclusion': return `${base} ${isDark ? 'border-red-700/50 text-red-100' : 'border-red-400 text-red-900'}`;
            default: return `${base} border-gray-500`;
        }
    };

    return (
        <div className="w-full h-full relative overflow-auto transition-colors duration-500" style={{
            backgroundImage: T.grid,
            backgroundSize: '20px 20px',
        }}>
            <svg className="absolute inset-0 w-full h-full pointer-events-none text-gray-500">
                {MOCK_EDGES.map((edge, idx) => {
                    const from = MOCK_NODES.find(n => n.id === edge.from)!;
                    const to = MOCK_NODES.find(n => n.id === edge.to)!;
                    return (
                        <line
                            key={idx}
                            x1={from.x + 100} y1={from.y + 25}
                            x2={to.x + 100} y2={to.y + 25}
                            stroke={T.edge}
                            strokeWidth="1.5"
                            className="transition-colors duration-500"
                        />
                    );
                })}
            </svg>

            {MOCK_NODES.map(node => (
                <div
                    key={node.id}
                    onClick={() => onNodeSelect(node)}
                    className={`absolute w-[200px] p-4 rounded-lg cursor-pointer hover:scale-105 transition-all duration-200 group flex flex-col items-center text-center ${getNodeStyle(node.type)}`}
                    style={{ left: node.x, top: node.y }}
                >
                    <div className={`text-[9px] uppercase font-mono tracking-widest mb-2 opacity-70 ${T.nodeSub}`}>{node.type}</div>
                    <div className={`text-xs font-bold leading-tight ${T.nodeText}`}>{node.label}</div>

                    {/* Status Dot */}
                    <div className={`w-2 h-2 rounded-full mt-2 ${node.type === 'conclusion' ? 'bg-red-500 animate-pulse' : 'bg-gray-500/30'}`}></div>
                </div>
            ))}
        </div>
    );
};
