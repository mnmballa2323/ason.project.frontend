import React, { useState, useEffect } from 'react';
import { Wifi, Clock, Server, CheckCircle2, AlertCircle, Volume2, VolumeX } from 'lucide-react';
import { DEPLOYMENT_CONFIG } from '../constants';
import { useSound } from './SoundController';

interface StatusBarProps {
    theme: 'dark' | 'light';
}

export const StatusBar: React.FC<StatusBarProps> = ({ theme }) => {
    const isDark = theme === 'dark';
    const ctx = DEPLOYMENT_CONFIG;
    const { muted, toggleMute, playClick } = useSound();

    // State
    const [time, setTime] = useState<string>('');
    const [latency, setLatency] = useState<number>(42);
    const [online, setOnline] = useState<boolean>(true);

    useEffect(() => {
        // Clock Update
        const timer = setInterval(() => {
            const now = new Date();
            setTime(now.toISOString().replace('T', ' ').split('.')[0] + ' UTC');
        }, 1000);

        // Simulated Latency Jitter
        const pinger = setInterval(() => {
            const newLatency = Math.floor(Math.random() * (45 - 38 + 1) + 38);
            setLatency(newLatency);
            // Randomly drop connection briefly for effect? No, too annoying.
        }, 2000);

        return () => {
            clearInterval(timer);
            clearInterval(pinger);
        }
    }, []);

    // Reactive Title & Favicon
    useEffect(() => {
        const title = online ? "ASON | Decision Verification" : "⚠ OFFLINE | Ason";
        document.title = title;

        // Dynamic Favicon (Canvas)
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const context = canvas.getContext('2d');
        if (context) {
            context.fillStyle = online ? (isDark ? '#fff' : '#000') : '#ef4444';
            context.font = 'bold 24px monospace';
            context.fillText('Q', 8, 24);

            // Status Dot
            context.beginPath();
            context.arc(26, 6, 4, 0, 2 * Math.PI);
            context.fillStyle = online ? '#10b981' : '#ef4444';
            context.fill();

            const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link');
            link.type = 'image/x-icon';
            link.rel = 'shortcut icon';
            link.href = canvas.toDataURL();
            document.getElementsByTagName('head')[0].appendChild(link);
        }
    }, [online, isDark]);

    // Theme Styles
    const T = {
        bg: isDark ? "bg-[#111] border-gray-800" : "bg-white border-gray-200",
        text: isDark ? "text-gray-400" : "text-gray-600",
        divider: isDark ? "mx-3 text-gray-700" : "mx-3 text-gray-300",
    };

    return (
        <section className={`h-8 border-t flex items-center px-4 text-[10px] font-mono select-none fixed bottom-0 w-full z-40 transition-colors duration-500 ${T.bg}`}>
            {/* LEFT: CONNECTION */}
            <div className="flex items-center flex-grow">
                <div className={`flex items-center space-x-2 mr-4 ${online ? 'text-emerald-500' : 'text-red-500'}`}>
                    <Wifi className="w-3 h-3" />
                    <span className="font-bold">{online ? 'CONNECTED' : 'OFFLINE'}</span>
                </div>

                <span className={T.text}>LATENCY: {latency}ms</span>
                <span className={T.divider}>|</span>
                <span className={T.text}>REGION: {ctx.badge.split('::')[0] || 'GLOBAL'}</span>
            </div>

            {/* CENTER: WORKSPACE (Mobile Hidden) */}
            <div className={`hidden md:flex items-center ${T.text}`}>
                <Server className="w-3 h-3 mr-2 opacity-50" />
                <span>WORKSPACE: <strong className={isDark ? "text-gray-300" : "text-gray-800"}>{ctx.tenant}</strong></span>
            </div>

            {/* RIGHT: CLOCK & STATUS */}
            <div className="flex-grow flex justify-end items-center">
                {/* MUTE TOGGLE */}
                <button
                    onClick={() => { playClick(); toggleMute(); }}
                    className={`mr-4 p-1 rounded hover:bg-gray-500/10 ${T.text}`}
                    title={muted ? "Unmute Sfx" : "Mute Sfx"}
                >
                    {muted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                </button>

                <span className={T.divider}>|</span>

                <div className={`flex items-center mr-4 ${T.text}`}>
                    <Clock className="w-3 h-3 mr-1.5 opacity-50" />
                    <span>{time}</span>
                </div>

                <div className={`flex items-center space-x-1 px-2 py-0.5 rounded ${isDark ? 'bg-green-900/20 text-green-500' : 'bg-green-100 text-green-700'}`}>
                    <CheckCircle2 className="w-3 h-3" />
                    <span className="font-bold">SYSTEM HEALTHY</span>
                </div>
            </div>
        </section>
    );
};
