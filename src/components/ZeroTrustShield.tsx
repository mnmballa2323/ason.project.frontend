import React, { useState, useEffect } from 'react';
import { Lock, Fingerprint, Key, ShieldCheck } from 'lucide-react';
import { notify } from '../utils/notify';

interface ZeroTrustProps {
    theme: 'dark' | 'light';
    onVerified: () => void;
}

export const ZeroTrustShield: React.FC<ZeroTrustProps> = ({ theme, onVerified }) => {
    const isDark = theme === 'dark';
    const [step, setStep] = useState<'IDLE' | 'SCANNING' | 'TOKEN' | 'VERIFIED'>('IDLE');
    const [progress, setProgress] = useState(0);

    const startVerification = () => {
        setStep('SCANNING');
        setProgress(0);

        // Simulate Biometric Scan
        const scanInterval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    clearInterval(scanInterval);
                    setStep('TOKEN');
                    return 0;
                }
                return p + 5;
            });
        }, 100);
    };

    const verifyToken = () => {
        // Simulate Hardware Token (YubiKey) touch
        notify("HARDWARE TOKEN DETECTED", "Verifying FIDO2/WebAuthn signature...", "info");
        setTimeout(() => {
            setStep('VERIFIED');
            notify("ZERO TRUST VERIFIED", "Elevated privileges granted.", "success");
            setTimeout(onVerified, 1500);
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
            <div className={`w-full max-w-md p-8 rounded-2xl border-2 shadow-2xl relative overflow-hidden
                ${isDark ? 'bg-gray-900 border-red-500/50' : 'bg-white border-red-500'}
            `}>
                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="p-4 rounded-full bg-red-500/10 mb-4 animate-pulse">
                        <Lock className="w-12 h-12 text-red-500" />
                    </div>
                    <h2 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        RESTRICTED AREA
                    </h2>
                    <p className="text-red-500 font-mono text-sm mt-2 uppercase tracking-widest font-bold">
                        Zero Trust Enforcement Active
                    </p>
                </div>

                {/* Steps */}
                <div className="space-y-6">
                    {/* Step 1: Biometric */}
                    <div className={`p-4 rounded-xl border transition-all duration-500
                        ${step === 'SCANNING' ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 bg-gray-800/50'}
                        ${step === 'VERIFIED' || step === 'TOKEN' ? 'border-emerald-500 bg-emerald-500/10' : ''}
                    `}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold flex items-center text-gray-300">
                                <Fingerprint className="w-4 h-4 mr-2" />
                                BIOMETRIC VERIFICATION
                            </span>
                            {step === 'SCANNING' && <span className="text-xs text-blue-400">{progress}%</span>}
                        </div>
                        {step === 'IDLE' && (
                            <button
                                onClick={startVerification}
                                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold text-sm transition-colors"
                            >
                                INITIATE SCAN
                            </button>
                        )}
                        {step === 'SCANNING' && (
                            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 transition-all duration-100" style={{ width: `${progress}%` }}></div>
                            </div>
                        )}
                    </div>

                    {/* Step 2: Hardware Token */}
                    <div className={`p-4 rounded-xl border transition-all duration-500 relative
                        ${step === 'IDLE' || step === 'SCANNING' ? 'opacity-50 grayscale' : ''}
                        ${step === 'TOKEN' ? 'border-amber-500 bg-amber-500/10' : 'border-gray-700 bg-gray-800/50'}
                        ${step === 'VERIFIED' ? 'border-emerald-500 bg-emerald-500/10' : ''}
                    `}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold flex items-center text-gray-300">
                                <Key className="w-4 h-4 mr-2" />
                                HARDWARE TOKEN (FIDO2)
                            </span>
                        </div>
                        {step === 'TOKEN' && (
                            <button
                                onClick={verifyToken}
                                className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white rounded font-bold text-sm animate-pulse"
                            >
                                TAP YUBIKEY TO CONFIRM
                            </button>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <div className="flex items-center justify-center space-x-2 text-[10px] text-gray-500 font-mono">
                        <ShieldCheck className="w-3 h-3" />
                        <span>QUORUM AUTHORIZATION REQUIRED</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
