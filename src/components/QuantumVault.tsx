import React, { useEffect, useRef } from 'react';
import { Shield, Lock, RefreshCw, Cpu } from 'lucide-react';

interface QuantumProps {
    theme: 'dark' | 'light';
}

export const QuantumVault: React.FC<QuantumProps> = ({ theme }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDark = theme === 'dark';

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let time = 0;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            time += 0.01;

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            // Draw "Lattice" Structure (Simulating Kyber-1024)
            const layers = 5;
            const points = 8;

            for (let l = 0; l < layers; l++) {
                const radius = 30 + (l * 20) + (Math.sin(time + l) * 5);
                const rotation = time * (l % 2 === 0 ? 1 : -1) * 0.5;

                ctx.beginPath();
                for (let i = 0; i < points; i++) {
                    const angle = (Math.PI * 2 / points) * i + rotation;
                    const x = centerX + Math.cos(angle) * radius;
                    const y = centerY + Math.sin(angle) * radius;

                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);

                    // Draw connection to center for "Crystal" look
                    ctx.save();
                    ctx.strokeStyle = isDark ? `rgba(16, 185, 129, ${0.1 + (l * 0.05)})` : `rgba(5, 150, 105, ${0.1 + (l * 0.05)})`;
                    ctx.beginPath();
                    ctx.moveTo(centerX, centerY);
                    ctx.lineTo(x, y);
                    ctx.stroke();
                    ctx.restore();
                }
                ctx.closePath();
                ctx.strokeStyle = isDark ? '#10b981' : '#059669';
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            requestAnimationFrame(draw);
        };

        const animId = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(animId);
    }, [isDark]);

    return (
        <div className={`relative p-6 border rounded-xl overflow-hidden ${isDark ? 'bg-gray-900 border-emerald-900/50' : 'bg-emerald-50 border-emerald-200'}`}>
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                    <h3 className="text-lg font-bold flex items-center text-emerald-500">
                        <Cpu className="w-5 h-5 mr-2" />
                        QUANTUM VAULT
                    </h3>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Post-Quantum Cryptography (PQC) Layer
                    </p>
                </div>
                <div className="flex flex-col items-end">
                    <div className="flex items-center space-x-2 text-xs font-mono mb-1">
                        <span className="text-gray-500">ALGORITHM:</span>
                        <span className="text-emerald-500 font-bold">ML-KEM-1024 (Kyber)</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs font-mono">
                        <span className="text-gray-500">SIGNATURE:</span>
                        <span className="text-blue-500 font-bold">ML-DSA-87 (Dilithium)</span>
                    </div>
                </div>
            </div>

            <div className="relative h-64 flex items-center justify-center">
                <canvas ref={canvasRef} width={400} height={300} className="max-w-full" />

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className={`bg-black/80 backdrop-blur-sm px-4 py-2 rounded border border-emerald-500/30 text-center`}>
                        <div className="text-[10px] uppercase text-emerald-500 mb-1 tracking-widest">Encryption Status</div>
                        <div className="text-2xl font-bold text-white flex items-center justify-center">
                            <Shield className="w-6 h-6 mr-2 text-emerald-400" />
                            SECURE
                        </div>
                        <div className="text-[9px] text-gray-400 mt-1">
                            RESISTANT TO SHOR'S ALGORITHM
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 relative z-10">
                <div className={`p-3 rounded border ${isDark ? 'bg-black/40 border-gray-800' : 'bg-white border-gray-200'}`}>
                    <div className="text-[10px] text-gray-500 mb-1">ENTROPY POOL</div>
                    <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[98%] animate-pulse"></div>
                    </div>
                    <div className="text-right text-[10px] text-emerald-500 mt-1">99.9% (TRUE RANDOM)</div>
                </div>
                <div className={`p-3 rounded border ${isDark ? 'bg-black/40 border-gray-800' : 'bg-white border-gray-200'}`}>
                    <div className="text-[10px] text-gray-500 mb-1">KEY ROTATION</div>
                    <div className="flex items-center justify-between text-xs font-mono">
                        <span className={isDark ? 'text-white' : 'text-gray-800'}>T-MINUS 45s</span>
                        <RefreshCw className="w-3 h-3 text-blue-500 animate-spin" />
                    </div>
                </div>
            </div>
        </div>
    );
};
