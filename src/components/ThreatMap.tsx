import React, { useEffect, useRef, useState } from 'react';
import { Shield, Globe, AlertTriangle } from 'lucide-react';

interface ThreatMapProps {
    theme: 'dark' | 'light';
}

interface Threat {
    id: number;
    x: number;
    y: number;
    type: 'DDoS' | 'SQLi' | 'XSS' | 'BruteForce';
    origin: string;
    timestamp: number;
}

export const ThreatMap: React.FC<ThreatMapProps> = ({ theme }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [threats, setThreats] = useState<Threat[]>([]);
    const [blockedCount, setBlockedCount] = useState(14029);

    // Simulate incoming threats
    useEffect(() => {
        const interval = setInterval(() => {
            const newThreat: Threat = {
                id: Date.now(),
                x: Math.random() * 800, // Canvas width
                y: Math.random() * 400, // Canvas height
                type: ['DDoS', 'SQLi', 'XSS', 'BruteForce'][Math.floor(Math.random() * 4)] as any,
                origin: ['CN', 'RU', 'NK', 'IR', 'Unknown'][Math.floor(Math.random() * 5)],
                timestamp: Date.now()
            };
            setThreats(prev => [...prev.slice(-20), newThreat]); // Keep last 20
            setBlockedCount(prev => prev + 1);
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    // Draw Map & Threats
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw "World Map" Grid
            ctx.strokeStyle = theme === 'dark' ? '#1f2937' : '#e5e7eb';
            ctx.lineWidth = 1;
            for (let i = 0; i < canvas.width; i += 40) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, canvas.height);
                ctx.stroke();
            }
            for (let i = 0; i < canvas.height; i += 40) {
                ctx.beginPath();
                ctx.moveTo(0, i);
                ctx.lineTo(canvas.width, i);
                ctx.stroke();
            }

            // Draw Threats
            threats.forEach(t => {
                const age = Date.now() - t.timestamp;
                if (age > 2000) return; // Fade out

                const alpha = 1 - age / 2000;
                const size = 20 * alpha; // Pulse out

                ctx.beginPath();
                ctx.arc(t.x, t.y, size, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(239, 68, 68, ${alpha})`; // Red
                ctx.lineWidth = 2;
                ctx.stroke();

                ctx.fillStyle = `rgba(239, 68, 68, ${alpha})`;
                ctx.font = '10px monospace';
                ctx.fillText(`${t.type} [${t.origin}]`, t.x + 10, t.y);
            });

            requestAnimationFrame(render);
        };
        const animId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animId);
    }, [threats, theme]);

    return (
        <div className={`p-6 border rounded-xl overflow-hidden relative ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                    <Globe className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                    <h3 className={`font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Global Threat Intel</h3>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-xs font-mono text-red-500 animate-pulse flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1" /> LIVE
                    </div>
                    <div className={`text-xs font-mono ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        BLOCKED: <span className="text-green-500 font-bold">{blockedCount.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="relative border border-gray-500/20 rounded bg-black/5">
                <canvas ref={canvasRef} width={800} height={400} className="w-full h-64 object-cover" />

                {/* Overlay UI */}
                <div className="absolute bottom-2 left-2 text-[10px] font-mono text-gray-500">
                    <div className="flex items-center space-x-2">
                        <Shield className="w-3 h-3" />
                        <span>ZERO-TRUST PERIMETER: ACTIVE</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
