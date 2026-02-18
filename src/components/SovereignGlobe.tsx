import React, { useEffect, useRef, useState } from 'react';
import { Globe, Satellite, Server, Shield, Wifi } from 'lucide-react';

interface GlobeProps {
    theme: 'dark' | 'light';
}

interface Point {
    lat: number;
    lng: number;
    label: string;
    type: 'dc' | 'sat';
    status: 'active' | 'warn' | 'connecting';
}

export const SovereignGlobe: React.FC<GlobeProps> = ({ theme }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [threats, setThreats] = useState<{ id: number; lat: number; lng: number; target: number; progress: number }[]>([]);
    const [blockedCount, setBlockedCount] = useState(14290);
    const threatsRef = useRef(threats);
    threatsRef.current = threats; // Keep ref sync for animation loop

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let rot = 0;

        // Threat Spawner
        const spawner = setInterval(() => {
            if (threatsRef.current.length < 5 && Math.random() > 0.3) {
                setThreats(prev => [
                    ...prev,
                    {
                        id: Date.now(),
                        lat: (Math.random() * 160) - 80, // Random lat
                        lng: (Math.random() * 360) - 180, // Random lng
                        target: Math.floor(Math.random() * 3), // Target one of the 3 main DCs
                        progress: 0
                    }
                ]);
            }
        }, 1200);

        const render = () => {
            rot += 0.005;
            setRotation(rot);

            // Resize
            const { width, height } = canvas.getBoundingClientRect();
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
            }

            const cx = width / 2;
            const cy = height / 2;
            const radius = Math.min(width, height) / 2.5;

            // Clear
            ctx.clearRect(0, 0, width, height);

            // Draw Globe Sphere
            const grad = ctx.createRadialGradient(cx, cy - radius * 0.5, radius * 0.2, cx, cy, radius);
            if (isDark) {
                grad.addColorStop(0, '#1e293b');
                grad.addColorStop(1, '#0f172a');
                ctx.fillStyle = grad;
            } else {
                grad.addColorStop(0, '#f8fafc');
                grad.addColorStop(1, '#e2e8f0');
                ctx.fillStyle = grad;
            }
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.fill();

            // Globe Border
            ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.3)' : 'rgba(59, 130, 246, 0.3)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw Grid (Lat/Lon lines)
            ctx.lineWidth = 1;
            ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.1)' : 'rgba(59, 130, 246, 0.1)';

            // Longitude lines (rotate)
            for (let i = 0; i < 12; i++) {
                const angle = (i * Math.PI / 6) + rot;
                ctx.beginPath();
                ctx.ellipse(cx, cy, radius * Math.cos(angle), radius, 0, 0, Math.PI * 2);
                ctx.stroke();
            }
            // Latitude lines
            for (let i = 1; i < 6; i++) {
                const y = cy - radius + (i * radius * 2 / 6);
                const w = Math.sqrt(Math.pow(radius, 2) - Math.pow(y - cy, 2)); // Circle eq
                ctx.beginPath();
                ctx.ellipse(cx, y, w, w * 0.2, 0, 0, Math.PI * 2);
                // Simple approx for latitude circles in perspective
                ctx.moveTo(cx - w, y);
                ctx.lineTo(cx + w, y);
                ctx.stroke();
            }

            // Project Helper
            const project = (lat: number, lng: number, rAdd: number = 0) => {
                const phi = (90 - lat) * (Math.PI / 180);
                const theta = (lng + 180) * (Math.PI / 180) + rot + rAdd;
                const x = radius * Math.sin(phi) * Math.cos(theta);
                const z = radius * Math.sin(phi) * Math.sin(theta);
                const y = radius * Math.cos(phi);
                return { x: cx + x, y: cy - y, z, scale: 1 + (z / radius) * 0.5 };
            };

            // Render Threats
            setThreats(prev => prev.map(t => ({ ...t, progress: t.progress + 0.015 })).filter(t => {
                if (t.progress >= 1) {
                    setBlockedCount(c => c + 1);
                    return false;
                }
                return true;
            }));

            threatsRef.current.forEach(t => {
                const start = project(t.lat, t.lng);
                const targetPoint = points[t.target];
                const end = project(targetPoint.lat, targetPoint.lng); // Target moves with rotation!

                // Draw Arc
                if (start.z > -50 || end.z > -50) { // Only draw if somewhat visible
                    ctx.beginPath();
                    ctx.moveTo(start.x, start.y);
                    // Simple linear interpolation for "missile"
                    const mx = start.x + (end.x - start.x) * t.progress;
                    const my = start.y + (end.y - start.y) * t.progress;

                    ctx.lineTo(mx, my);
                    ctx.strokeStyle = `rgba(239, 68, 68, ${1 - t.progress})`; // Red fading
                    ctx.lineWidth = 2;
                    ctx.stroke();

                    // Draw "Warhead"
                    ctx.beginPath();
                    ctx.arc(mx, my, 2, 0, Math.PI * 2);
                    ctx.fillStyle = '#ef4444';
                    ctx.fill();

                    // Impact Shield Effect
                    if (t.progress > 0.95 && end.z > 0) {
                        ctx.beginPath();
                        ctx.arc(end.x, end.y, 15 * end.scale * (t.progress - 0.95) * 20, 0, Math.PI * 2);
                        ctx.strokeStyle = `rgba(56, 189, 248, ${1 - (t.progress - 0.95) * 20})`; // Blue shield expansion
                        ctx.lineWidth = 2;
                        ctx.stroke();
                    }
                }
            });

            // Render Nodes
            points.forEach(p => {
                let rAdd = 0;
                if (p.type === 'sat') rAdd = rot * 2; // Independent sat rotation

                const pos = project(p.lat, p.lng, rAdd);

                if (pos.z > 0) {
                    // Node dot
                    ctx.beginPath();
                    ctx.arc(pos.x, pos.y, 4 * pos.scale, 0, Math.PI * 2);
                    ctx.fillStyle = p.status === 'active' ? '#10b981' : p.status === 'warn' ? '#f59e0b' : '#3b82f6';
                    ctx.fill();

                    // Pulse
                    if (p.status === 'active' || p.status === 'warn') {
                        ctx.beginPath();
                        ctx.arc(pos.x, pos.y, 12 * pos.scale, 0, Math.PI * 2);
                        ctx.strokeStyle = p.status === 'active' ? `rgba(16, 185, 129, ${0.5 + Math.sin(Date.now() / 200) * 0.3})` : `rgba(245, 158, 11, ${0.5 + Math.sin(Date.now() / 200) * 0.3})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }

                    // Label
                    ctx.font = `${10 * pos.scale}px monospace`;
                    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)';
                    ctx.fillText(p.label, pos.x + 10, pos.y);
                }
            });

            // Draw "Atmosphere" Glow
            const glow = ctx.createRadialGradient(cx, cy, radius, cx, cy, radius * 1.2);
            glow.addColorStop(0, isDark ? 'rgba(56, 189, 248, 0.2)' : 'rgba(59, 130, 246, 0.1)');
            glow.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = glow;
            ctx.fillRect(0, 0, width, height);

            animationFrameId = requestAnimationFrame(render);
        };
        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
            clearInterval(spawner);
        };
    }, [isDark]);

    return (
        <div className={`p-6 border rounded-xl overflow-hidden relative ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
            <div className="flex justify-between items-start mb-4 absolute top-6 left-6 right-6 z-10 pointer-events-none">
                <div>
                    <h3 className="text-lg font-bold flex items-center text-sky-500">
                        <Globe className="w-5 h-5 mr-2" />
                        GLOBAL SOVEREIGNTY MAP
                    </h3>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Real-time Asset Tracking & Satellite Uplink Status
                    </p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                    <div className="flex items-center text-xs font-mono text-red-500 animate-pulse">
                        <Shield className="w-3 h-3 mr-1" />
                        BLOCKED: {blockedCount.toLocaleString()}
                    </div>
                    <div className="flex items-center text-xs font-mono text-emerald-500">
                        <Wifi className="w-3 h-3 mr-1" />
                        UPLINK: SECURE (AES-256)
                    </div>
                    <div className="flex items-center text-xs font-mono text-sky-500">
                        <Satellite className="w-3 h-3 mr-1" />
                        SAT-LINK: ACTIVE (3/5)
                    </div>
                </div>
            </div>

            <canvas
                ref={canvasRef}
                className="w-full h-64 md:h-80 lg:h-96"
            />

            {/* Overlay Grid lines decoration */}
            <div className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}>
            </div>
        </div>
    );
};
