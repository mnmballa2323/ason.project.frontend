import React from 'react';

interface SystemCrashProps {
    error: Error;
    resetErrorBoundary: () => void;
}

export const SystemCrash: React.FC<SystemCrashProps> = ({ error, resetErrorBoundary }) => {
    return (
        <div className="fixed inset-0 z-[9999] bg-[#0000AA] text-white font-mono p-8 flex flex-col items-center justify-center select-none">
            <div className="max-w-2xl w-full space-y-6">
                <div className="bg-white text-[#0000AA] inline-block px-2 font-bold mb-4">
                    FATAL_EXCEPTION
                </div>

                <h1 className="text-4xl mb-8">A conceptual problem has been detected and ASON has been shut down to prevent damage to your timeline.</h1>

                <div className="space-y-2 text-sm opacity-80">
                    <p>DRIVER_IRQL_NOT_LESS_OR_EQUAL</p>
                    <p>If this is the first time you've seen this error screen, restart your decision verification.</p>
                    <p>Check to be sure you have adequate "Sovereign Compute" available.</p>
                </div>

                <div className="mt-8 p-4 border border-white/30 bg-black/10 rounded font-bold text-xs break-all">
                    *** STOP: 0x000000D1 (0x0000000C, 0x00000002, 0x00000000, 0xF86B5A89)
                    <br /><br />
                    {error.message || "Unknown Exception"}
                    <br />
                    at {error.stack?.split('\n')[0] || "System.Core.Kernel_Panic"}
                </div>

                <div className="mt-12 animate-pulse">
                    Press any key to restart...
                </div>

                <button
                    onClick={resetErrorBoundary}
                    className="mt-8 px-6 py-2 border-2 border-white hover:bg-white hover:text-[#0000AA] transition-colors font-bold uppercase tracking-widest"
                >
                    System Reboot
                </button>
            </div>
        </div>
    );
};
