import React, { useState } from 'react';
import { Zap, Activity, RefreshCw, AlertTriangle, Play, Square } from 'lucide-react';
import { notify } from '../utils/notify';

interface ChaosProps {
    theme: 'dark' | 'light';
    active: boolean;
    onToggle: (active: boolean) => void;
}

export const ChaosControl: React.FC<ChaosProps> = ({ theme, active, onToggle }) => {
    const isDark = theme === 'dark';
    const [resilienceScore, setResilienceScore] = useState(99.9);

    const toggleChaos = () => {
        const newState = !active;
        onToggle(newState);
        if (newState) {
            notify("DRILL MODE ACTIVE", "Chaos Engineering protocols initiated.", "warning");
            // Simulate score drop
            const interval = setInterval(() => {
                setResilienceScore(prev => Math.max(85, prev - 0.5));
            }, 1000);
            setTimeout(() => clearInterval(interval), 10000);
        } else {
            notify("DRILL MODE ENDED", "System returning to normal operations.", "success");
            setResilienceScore(99.9);
        }
    };

    return (
        <div className={`p-6 border rounded-xl ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold flex items-center">
                        <Zap className="w-5 h-5 mr-2 text-amber-500" />
                        Chaos Engineering
                    </h3>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Simulate failures to test system auto-recovery capabilities.
                    </p>
                </div>

                <div className="text-right">
                    <div className="text-[10px] uppercase tracking-widest text-gray-500">Resilience Score</div>
                    <div className={`text-2xl font-mono font-bold ${resilienceScore > 90 ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {resilienceScore.toFixed(2)}%
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className={`p-4 rounded border ${active ? 'border-amber-500/50 bg-amber-500/10' : 'border-gray-700 bg-gray-800/50'}`}>
                    <div className="text-xs font-bold uppercase mb-2 text-gray-400">Status</div>
                    <div className="flex items-center space-x-2">
                        {active ? <Activity className="w-4 h-4 text-amber-500 animate-pulse" /> : <Square className="w-4 h-4 text-gray-500" />}
                        <span className={`font-mono font-bold ${active ? 'text-amber-500' : 'text-gray-500'}`}>
                            {active ? 'DRILL IN PROGRESS' : 'STANDBY'}
                        </span>
                    </div>
                </div>

                <div className="p-4 rounded border border-gray-700 bg-gray-800/50">
                    <div className="text-xs font-bold uppercase mb-2 text-gray-400">Recovery Time Objective</div>
                    <div className="flex items-center space-x-2">
                        <RefreshCw className="w-4 h-4 text-emerald-500" />
                        <span className="font-mono font-bold text-gray-200">
                            &lt; 3.0s (AUTO-HEAL)
                        </span>
                    </div>
                </div>
            </div>

            <button
                onClick={toggleChaos}
                className={`w-full py-3 rounded font-bold uppercase tracking-widest transition-all flex items-center justify-center space-x-2
                    ${active
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500 hover:bg-amber-500/20'
                        : 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-900/20'}
                `}
            >
                {active ? (
                    <>
                        <Square className="w-4 h-4" />
                        <span>Terminate Simulaton</span>
                    </>
                ) : (
                    <>
                        <Play className="w-4 h-4" />
                        <span>Initiate Drill Sequence</span>
                    </>
                )}
            </button>
        </div>
    );
};
