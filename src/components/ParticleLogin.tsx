import React, { useState, useEffect, useRef } from 'react';
import { Shield, Fingerprint, Lock, Key } from 'lucide-react';

interface LoginProps {
    onLogin: () => void;
}

export const ParticleLogin: React.FC<LoginProps> = ({ onLogin }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isScanning, setIsScanning] = useState(false);

    // Particle Effect
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // Create particles
            particles = [];
            for (let i = 0; i < 100; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 2
                });
            }
        };
        resize();
        window.addEventListener('resize', resize);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(16, 185, 129, 0.5)'; // Green

            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;

                // Bounce
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                // Mouse interaction connection
                // (Simplified for performance)

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                // Draw lines between close particles
                particles.forEach((p2, j) => {
                    if (i === j) return;
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(16, 185, 129, ${0.1 - dist / 1000})`;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                });
            });

            requestAnimationFrame(animate);
        };
        animate();

        return () => window.removeEventListener('resize', resize);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsScanning(true);
        // Simulate scan delay
        setTimeout(() => {
            onLogin();
        }, 2000);
    };

    return (
        <div className="fixed inset-0 bg-black text-white overflow-hidden flex items-center justify-center font-mono">
            <canvas ref={canvasRef} className="absolute inset-0 opacity-30 pointer-events-none" />

            <div className="z-10 bg-gray-900/80 backdrop-blur-md border border-gray-700 p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
                {/* Security Badge */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black border border-green-500 rounded-full p-3 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                    <Shield className="w-8 h-8 text-green-500" />
                </div>

                <div className="text-center mt-6 mb-8">
                    <h2 className="text-xl font-bold tracking-widest text-green-500">SECURE ACCESS</h2>
                    <p className="text-xs text-gray-500 mt-1">RESTRICTED AREA // AUTHORIZED PERSONNEL ONLY</p>
                </div>

                {isScanning ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-6 animate-pulse">
                        <Fingerprint className="w-24 h-24 text-green-500 animate-bounce" />
                        <div className="text-green-400 text-sm tracking-widest">VERIFYING BIOMETRICS...</div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs uppercase text-gray-400 mb-2 ml-1">Identity Token (Email)</label>
                            <div className="relative">
                                <Key className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full bg-black/50 border border-gray-700 rounded p-3 pl-10 text-sm focus:border-green-500 outline-none transition-colors"
                                    placeholder="Enter secure ID..."
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase text-gray-400 mb-2 ml-1">Access Phrase (Password)</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full bg-black/50 border border-gray-700 rounded p-3 pl-10 text-sm focus:border-green-500 outline-none transition-colors"
                                    placeholder="••••••••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-900/50 hover:bg-green-800/50 border border-green-700 text-green-400 p-4 rounded text-sm font-bold uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
                        >
                            <Fingerprint className="w-4 h-4" />
                            Initiate Handshake
                        </button>
                    </form>
                )}

                <div className="mt-6 pt-6 border-t border-gray-800 flex justify-between text-[10px] text-gray-500">
                    <span>ENCRYPTION: AES-256-GCM</span>
                    <span>SESSION: SECURE</span>
                </div>
            </div>
        </div>
    );
};
