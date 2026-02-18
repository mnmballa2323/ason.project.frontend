import React, { useEffect, useState, useRef } from 'react';
import { Terminal, ShieldCheck, Wifi, Cpu, Lock } from 'lucide-react';

interface BootProps {
    onComplete: () => void;
}

export const CinematicBoot: React.FC<BootProps> = ({ onComplete }) => {
    const [lines, setLines] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    const bootSequence = [
        "Initializing ASON KERNEL v4.2.0-secure...",
        "Verifying CPU Microcode... [OK]",
        "Loading Quantum-Safe Algorithms (Kyber-1024)... [LOADED]",
        "Mounting Encrypted Zones...",
        "Establishing Neuro-Link...",
        "Scanning Memory Integrity (32GB verified)... [OK]",
        "Mounting Immutable Ledger (/dev/nvme0n1)... [MOUNTED]",
        "Establishing Satellite Uplink (Starlink LE0)... [CONNECTED]",
        "Syncing Global Node State (Detroit, Frankfurt, Singapore)... [SYNCED]",
        "Engaging Zero-Trust Enclave... [LOCKED]",
        "System Ready."
    ];

    useEffect(() => {
        let currentLine = 0;
        let charIndex = 0;
        let p = 0;

        const interval = setInterval(() => {
            // Update progress bar faster than text
            p = Math.min(100, p + (Math.random() * 5));
            setProgress(p);

            // Add lines
            if (currentLine < bootSequence.length) {
                if (Math.random() > 0.6) { // Random delay between lines
                    setLines(prev => [...prev, bootSequence[currentLine]]);
                    currentLine++;
                }
            } else {
                // Finish
                if (p >= 100) {
                    clearInterval(interval);
                    setTimeout(onComplete, 800); // Slight pause at 100%
                }
            }
        }, 150);

        return () => clearInterval(interval);
    }, []);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [lines]);

    return (
        <div className="fixed inset-0 bg-black text-green-500 font-mono flex flex-col items-center justify-center p-8 z-50">
            <div className="w-full max-w-2xl">
                <div className="flex items-center gap-4 mb-8 border-b border-green-900 pb-4">
                    <Terminal className="w-8 h-8 animate-pulse" />
                    <div className="text-center font-mono">
                        <h1 className="text-2xl font-bold tracking-widest">ASON SECURE BOOTLOADER</h1>
                        <div className="mt-4 w-64 h-2 bg-gray-800 rounded-full overflow-hidden mx-auto"></div>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="h-64 overflow-y-auto mb-8 space-y-2 text-sm md:text-base border border-green-900/50 p-4 bg-black/50 rounded"
                >
                    {lines.map((line, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <span className="opacity-50">[{new Date().toLocaleTimeString()}]</span>
                            <span>{line}</span>
                        </div>
                    ))}
                    <div className="animate-pulse">_</div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-green-900/30 rounded overflow-hidden">
                    <div
                        className="h-full bg-green-500 transition-all duration-100 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="flex justify-between mt-2 text-xs opacity-70">
                    <span>MEMORY: OK</span>
                    <span>ENCRYPTION: ENABLED</span>
                    <span>{Math.round(progress)}%</span>
                </div>

                {/* Icons Grid */}
                <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-8 opacity-30">
                    <Cpu className="w-6 h-6" />
                    <ShieldCheck className="w-6 h-6" />
                    <Wifi className="w-6 h-6" />
                    <Lock className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
};
