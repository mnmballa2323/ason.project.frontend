import React, { useState, useEffect, useRef } from 'react';
import { useSound } from './SoundController';

interface BootSequenceProps {
    onComplete: () => void;
}

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
    const [lines, setLines] = useState<string[]>([]);
    const [isComplete, setIsComplete] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const { playClick, playBoot } = useSound();

    const BOOT_LOGS = [
        "Initializing ASON-OS Kernel v47.0.1...",
        "Loading memory modules... OK",
        "Verifying localized jurisdiction compliance... CHECKED",
        "Mounting file system (Encrypted/Read-Only)... OK",
        " Establishing secure uplink to air-gapped nodes...",
        "   > Node Alpha: CONNECTED",
        "   > Node Beta: CONNECTED",
        "   > Node Gamma: CONNECTED",
        "Calibrating neural verify engines...",
        "   > Refactor Engine: READY",
        "   > Audit Ledger: SYNCED",
        "Applying sovereign policies...",
        "User credentials verified. Access granted.",
        "SYSTEM_READY"
    ];

    useEffect(() => {
        // Start boot sound
        playBoot();

        let delay = 0;
        BOOT_LOGS.forEach((line, index) => {
            const lineDelay = Math.random() * 300 + 100; // Random typing speed
            delay += lineDelay;

            setTimeout(() => {
                setLines(prev => [...prev, line]);
                playClick(); // Tiny click for each line
                if (index === BOOT_LOGS.length - 1) {
                    setTimeout(() => setIsComplete(true), 800);
                }
            }, delay);
        });

        // Auto-complete after full duration
        const totalDuration = delay + 1500;
        const timeout = setTimeout(() => {
            onComplete();
        }, totalDuration);

        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [lines]);

    // Skip handler
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onComplete();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onComplete]);

    return (
        <div className={`fixed inset-0 z-[100] bg-black text-green-500 font-mono text-sm p-8 overflow-hidden flex flex-col transition-opacity duration-1000 ${isComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="flex-grow overflow-y-auto space-y-1">
                {lines.map((line: string, i: number) => (
                    <div key={i} className="flex">
                        <span className="mr-2 opacity-50">[{new Date().toISOString().split('T')[1].split('.')[0]}]</span>
                        <span className="typing-effect">{line}</span>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            <div className="mt-8 pt-4 border-t border-green-900 flex justify-between items-center text-xs opacity-50">
                <span>MEM: 64TB OK</span>
                <span className="animate-pulse">_CURSOR_ACTIVE</span>
                <span>PRESS ESC TO SKIP</span>
            </div>
        </div>
    );
};
