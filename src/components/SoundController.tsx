import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

interface SoundContextType {
    playClick: () => void;
    playHover: () => void;
    playSuccess: () => void;
    playAlert: () => void;
    playBoot: () => void;
    muted: boolean;
    toggleMute: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const useSound = () => {
    const context = useContext(SoundContext);
    if (!context) {
        throw new Error('useSound must be used within a SoundProvider');
    }
    return context;
};

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [muted, setMuted] = useState(false);
    const audioCtxRef = useRef<AudioContext | null>(null);

    const getContext = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return audioCtxRef.current;
    };

    const playTone = (freq: number, type: OscillatorType, duration: number, vol: number = 0.1) => {
        if (muted) return;
        const ctx = getContext();
        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
    };

    const playClick = useCallback(() => {
        // High-tech click: Short, high frequency sine
        playTone(2000, 'sine', 0.05, 0.05);
    }, [muted]);

    const playHover = useCallback(() => {
        // Very subtle chirp
        playTone(4000, 'sine', 0.01, 0.005);
    }, [muted]);

    const playSuccess = useCallback(() => {
        // Positive chord
        if (muted) return;
        const ctx = getContext();
        const now = ctx.currentTime;
        [440, 554, 659].forEach((f, i) => { // A Major
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.value = f;
            gain.gain.setValueAtTime(0.1, now + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.5);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.5);
        });
    }, [muted]);

    const playAlert = useCallback(() => {
        // Low error buzz
        playTone(150, 'sawtooth', 0.3, 0.1);
    }, [muted]);

    const playBoot = useCallback(() => {
        // THX-style swell (simplified)
        if (muted) return;
        const ctx = getContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.frequency.setValueAtTime(100, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 2);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 1);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 3);
    }, [muted]);

    const toggleMute = () => setMuted(!muted);

    return (
        <SoundContext.Provider value={{ playClick, playHover, playSuccess, playAlert, playBoot, muted, toggleMute }}>
            {children}
        </SoundContext.Provider>
    );
};
