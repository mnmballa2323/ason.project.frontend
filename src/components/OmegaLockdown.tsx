import React, { useState } from 'react';
import { ShieldAlert, Power } from 'lucide-react';

interface OmegaProps {
    onTrigger: () => void;
    isActive: boolean;
}

export const OmegaLockdown: React.FC<OmegaProps> = ({ onTrigger, isActive }) => {
    const [armed, setArmed] = useState(false);
    const [count, setCount] = useState(0);

    const handleClick = () => {
        if (!armed) {
            setArmed(true);
            return;
        }

        // Require 3 clicks to confirm catastrophe
        if (count < 2) {
            setCount(c => c + 1);
        } else {
            onTrigger(); // EXECUTE PROTOCOL
        }
    };

    if (isActive) {
        return (
            <div className="fixed inset-0 z-50 bg-red-950 flex flex-col items-center justify-center text-red-500 animate-pulse">
                <ShieldAlert className="w-32 h-32 mb-8" />
                <h1 className="text-6xl font-black tracking-tighter mb-4">PROTOCOL OMEGA ACTIVE</h1>
                <p className="text-xl font-mono mb-8">ALL EXTERNAL CONNECTIONS SEVERED</p>
                <div className="p-4 border border-red-500 rounded bg-black/50 font-mono text-sm max-w-lg text-center">
                    SYSTEM IS IN AIR-GAP ISOLATION MODE.<br />
                    PHYSICAL RESET REQUIRED TO RESTORE UPLINK.
                </div>
            </div>
        );
    }

    return (
        <div className="relative group">
            <button
                onClick={handleClick}
                className={`
                    relative w-full p-6 border-2 rounded-xl flex flex-col items-center gap-3 transition-all duration-300
                    ${armed
                        ? 'bg-red-900/20 border-red-500 text-red-500 hover:bg-red-900/40'
                        : 'bg-gray-900/50 border-gray-700 text-gray-500 hover:border-red-900 hover:text-red-900'}
                `}
            >
                <div className={`p-3 rounded-full border-2 transition-all ${armed ? 'border-red-500 bg-red-500/10' : 'border-gray-600'}`}>
                    <Power className={`w-6 h-6 ${armed ? 'animate-pulse' : ''}`} />
                </div>

                <div className="text-center">
                    <div className="text-sm font-bold tracking-widest uppercase">
                        {armed ? (count > 0 ? `CONFIRM (${3 - count})` : "ARMED") : "PROTOCOL OMEGA"}
                    </div>
                    <div className="text-[9px] opacity-60 mt-1 font-mono">
                        {armed ? "EMERGENCY LOCKDOWN" : "BREAK GLASS IN CASE OF BREACH"}
                    </div>
                </div>

                {/* Cover Animation */}
                {!armed && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-xl" />
                )}
            </button>
        </div>
    );
};
