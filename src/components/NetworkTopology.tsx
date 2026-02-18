import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Server, Database, Cloud, Shield, Activity, Zap, XCircle } from 'lucide-react';

interface Node {
    id: string;
    x: number;
    y: number;
    type: 'server' | 'database' | 'gateway' | 'shield';
    status: 'active' | 'dead' | 'recovering';
    load: number;
}

interface Link {
    source: string;
    target: string;
    activity: number;
}

interface TopologyProps {
    theme: 'dark' | 'light';
    chaosMode: boolean;
    onNodeClick: (nodeId: string) => void;
}

export const NetworkTopology: React.FC<TopologyProps> = ({ theme, chaosMode, onNodeClick }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [links, setLinks] = useState<Link[]>([]);

    // Initialize Topology
    useEffect(() => {
        const initialNodes: Node[] = [
            { id: 'CORE-01', x: 400, y: 300, type: 'shield', status: 'active', load: 0 },
            { id: 'DB-PRIMARY', x: 400, y: 150, type: 'database', status: 'active', load: 0 },
            { id: 'APP-01', x: 250, y: 400, type: 'server', status: 'active', load: 0 },
            { id: 'APP-02', x: 550, y: 400, type: 'server', status: 'active', load: 0 },
            { id: 'APP-03', x: 400, y: 500, type: 'server', status: 'active', load: 0 },
            { id: 'GATE-01', x: 200, y: 250, type: 'gateway', status: 'active', load: 0 },
            { id: 'GATE-02', x: 600, y: 250, type: 'gateway', status: 'active', load: 0 },
        ];

        const initialLinks: Link[] = [
            { source: 'CORE-01', target: 'DB-PRIMARY', activity: 0 },
            { source: 'CORE-01', target: 'APP-01', activity: 0 },
            { source: 'CORE-01', target: 'APP-02', activity: 0 },
            { source: 'CORE-01', target: 'APP-03', activity: 0 },
            { source: 'APP-01', target: 'GATE-01', activity: 0 },
            { source: 'APP-02', target: 'GATE-02', activity: 0 },
            { source: 'APP-03', target: 'GATE-01', activity: 0 },
            { source: 'APP-03', target: 'GATE-02', activity: 0 },
        ];

        setNodes(initialNodes);
        setLinks(initialLinks);
    }, []);

    // Chaos Simulation Effect
    useEffect(() => {
        if (!chaosMode) return;

        const interval = setInterval(() => {
            const randomNodeIndex = Math.floor(Math.random() * nodes.length);
            if (nodes[randomNodeIndex].type === 'shield') return; // Core never dies

            setNodes(prev => prev.map((n, i) => {
                if (i === randomNodeIndex && n.status === 'active') {
                    return { ...n, status: 'dead' };
                }
                return n;
            }));

            // Auto-recover after 3s
            setTimeout(() => {
                setNodes(prev => prev.map((n, i) => {
                    if (i === randomNodeIndex && n.status === 'dead') {
                        return { ...n, status: 'recovering' };
                    }
                    return n;
                }));
                // Fully active after another 2s
                setTimeout(() => {
                    setNodes(prev => prev.map((n, i) => {
                        if (i === randomNodeIndex && n.status === 'recovering') {
                            return { ...n, status: 'active' };
                        }
                        return n;
                    }));
                }, 2000);
            }, 3000);

        }, 5000);

        return () => clearInterval(interval);
    }, [chaosMode, nodes]);

    // Animation Loop
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Links
        links.forEach(link => {
            const source = nodes.find(n => n.id === link.source);
            const target = nodes.find(n => n.id === link.target);
            if (!source || !target) return;

            ctx.beginPath();
            ctx.moveTo(source.x, source.y);
            ctx.lineTo(target.x, target.y);

            const isDead = source.status === 'dead' || target.status === 'dead';
            ctx.strokeStyle = isDead
                ? (theme === 'dark' ? '#374151' : '#e5e7eb')
                : (theme === 'dark' ? '#3b82f6' : '#60a5fa');
            ctx.lineWidth = 2;
            ctx.stroke();

            // Packet Animation
            if (!isDead) {
                const time = Date.now() / 1000;
                const distance = Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2));
                const packetPos = (time * 100) % distance;
                const ratio = packetPos / distance;
                const px = source.x + (target.x - source.x) * ratio;
                const py = source.y + (target.y - source.y) * ratio;

                ctx.beginPath();
                ctx.arc(px, py, 3, 0, Math.PI * 2);
                ctx.fillStyle = theme === 'dark' ? '#60a5fa' : '#2563eb';
                ctx.fill();
            }
        });

        // Draw Nodes
        nodes.forEach((node: Node) => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);

            if (node.status === 'dead') ctx.fillStyle = '#ef4444'; // Red
            else if (node.status === 'recovering') ctx.fillStyle = '#eab308'; // Yellow
            else if (node.type === 'shield') ctx.fillStyle = '#10b981'; // Green
            else ctx.fillStyle = theme === 'dark' ? '#1f2937' : '#ffffff';

            ctx.fill();
            ctx.strokeStyle = theme === 'dark' ? '#374151' : '#d1d5db';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Label
            ctx.fillStyle = theme === 'dark' ? '#9ca3af' : '#4b5563';
            ctx.font = '10px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(node.id, node.x, node.y + 35);
        });

        requestAnimationFrame(draw);
    }, [nodes, links, theme]);

    useEffect(() => {
        const animId = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(animId);
    }, [draw]);

    return (
        <div className="relative w-full h-[600px] border rounded-xl overflow-hidden bg-black/5">
            <canvas ref={canvasRef} width={800} height={600} className="w-full h-full" />

            {/* Legend / Overlay */}
            <div className="absolute top-4 left-4 p-4 rounded bg-white/10 backdrop-blur border border-white/20 text-xs font-mono">
                <div className="flex items-center space-x-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>ACTIVE</span>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span>RECOVERING</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span>OFFLINE</span>
                </div>
            </div>
        </div>
    );
};
