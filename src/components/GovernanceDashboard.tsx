import React, { useState } from 'react';
import { Shield, FileText, PieChart, TrendingUp, Lock, Users, AlertCircle, CheckCircle, Printer, Download } from 'lucide-react';
import { notify } from '../utils/notify';
import { MarketTicker } from './MarketTicker';

interface GovernanceProps {
    theme: 'dark' | 'light';
}

export const GovernanceDashboard: React.FC<GovernanceProps> = ({ theme }) => {
    const isDark = theme === 'dark';
    const [reportStatus, setReportStatus] = useState<'IDLE' | 'GENERATING' | 'READY'>('IDLE');

    // Internal "Sovereign Oracle" Data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [complianceScore] = useState(98.4);
    const [controls] = useState([
        { id: 'SOX-404', name: 'IT General Controls', status: 'PASS', score: 100 },
        { id: 'SOC2-CC', name: 'Change Management', status: 'PASS', score: 98 },
        { id: 'ISO-27001', name: 'Access Control', status: 'WARN', score: 92 },
        { id: 'GDPR', name: 'Data Sovereignty', status: 'PASS', score: 100 },
    ]);

    // Theme Helpers
    const T = {
        bg: isDark ? "bg-[#0a0a0a]" : "bg-gray-50",
        panel: isDark ? "bg-[#111] border-gray-800" : "bg-white border-gray-200",
        text: isDark ? "text-gray-100" : "text-gray-900",
        muted: isDark ? "text-gray-500" : "text-gray-500",
        border: isDark ? "border-gray-800" : "border-gray-200",
    };

    const generateBoardPack = () => {
        setReportStatus('GENERATING');
        notify("COMPLIANCE ENGINE", "Compiling Q3 Board Review Package...", "info");

        setTimeout(() => {
            setReportStatus('READY');
            notify("REPORT READY", "10-Q Annex Generated Successfully", "success");
        }, 2500);
    };

    return (
        <div className={`h-full flex flex-col overflow-hidden font-sans ${T.bg} ${T.text}`}>
            {/* INTEGRATED TICKER (Internal Feed) */}
            <MarketTicker theme={theme} />

            <div className="flex-1 overflow-auto p-8">
                {/* HEADER */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <Shield className={`w-4 h-4 ${isDark ? 'text-blue-500' : 'text-blue-600'}`} />
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500">Public Company Governance</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight uppercase">
                            Executive Assurance
                        </h1>
                    </div>

                    <div className="flex space-x-4">
                        <div className={`text-right px-4 py-2 border-r ${T.border}`}>
                            <div className="text-[10px] uppercase tracking-widest text-gray-500">Data Sovereignty</div>
                            <div className="font-mono font-bold text-emerald-500 flex items-center justify-end">
                                <Shield className="w-3 h-3 mr-1" /> ACTIVE (OFFLINE)
                            </div>
                        </div>
                        <div className={`text-right px-4 py-2 border-r ${T.border}`}>
                            <div className="text-[10px] uppercase tracking-widest text-gray-500">Filing Status</div>
                            <div className="font-mono font-bold text-emerald-500">ON TRACK (10-K)</div>
                        </div>
                        <div className="text-right pl-4">
                            <div className="text-[10px] uppercase tracking-widest text-gray-500">Internal Controls</div>
                            <div className="font-mono font-bold text-blue-500">EFFECTIVE</div>
                        </div>
                    </div>
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                    {/* LEFT COLUMN: COMPLIANCE HEATMAP */}
                    <div className={`lg:col-span-2 p-6 rounded-xl border ${T.panel}`}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest flex items-center">
                                <Lock className="w-4 h-4 mr-2 opacity-50" />
                                Sarbanes-Oxley (SOX) Controls
                            </h3>
                            <span className="text-xs font-mono px-2 py-1 rounded bg-blue-500/10 text-blue-500">
                                AUDIT PERIOD: Q3 FY26
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {controls.map((ctrl, i) => (
                                <div key={i} className={`p-4 border rounded-lg ${T.border} ${isDark ? 'bg-black/20' : 'bg-gray-50'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="text-xs font-mono opacity-50">{ctrl.id}</div>
                                        {ctrl.status === 'PASS'
                                            ? <CheckCircle className="w-4 h-4 text-emerald-500" />
                                            : <AlertCircle className="w-4 h-4 text-amber-500" />
                                        }
                                    </div>
                                    <div className="font-bold text-lg mb-1">{ctrl.name}</div>
                                    <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${ctrl.score === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                            style={{ width: `${ctrl.score}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-right text-[10px] mt-1 font-mono">{ctrl.score}% EFFECTIVE</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: BOARD REPORTING */}
                    <div className={`p-6 rounded-xl border flex flex-col ${T.panel}`}>
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center">
                            <Users className="w-4 h-4 mr-2 opacity-50" />
                            Board Reporting
                        </h3>

                        <div className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl mb-6 ${T.border} ${reportStatus === 'GENERATING' ? 'animate-pulse' : ''}`}>
                            {reportStatus === 'IDLE' && (
                                <>
                                    <FileText className="w-12 h-12 mb-4 text-gray-600" />
                                    <div className="text-sm font-bold text-gray-500">NO REPORT GENERATED</div>
                                </>
                            )}
                            {reportStatus === 'GENERATING' && (
                                <>
                                    <PieChart className="w-12 h-12 mb-4 text-blue-500 animate-spin" />
                                    <div className="text-sm font-bold text-blue-500">COMPILING ARTIFACTS...</div>
                                </>
                            )}
                            {reportStatus === 'READY' && (
                                <>
                                    <CheckCircle className="w-12 h-12 mb-4 text-emerald-500" />
                                    <div className="text-sm font-bold text-emerald-500">PACKAGE READY</div>
                                    <div className="text-[10px] text-gray-500 mt-1">SHA-256: e3b0c442...</div>
                                </>
                            )}
                        </div>

                        <button
                            onClick={generateBoardPack}
                            disabled={reportStatus === 'GENERATING'}
                            className={`w-full py-4 text-sm font-bold uppercase tracking-widest rounded transition-all flex items-center justify-center space-x-2
                                ${reportStatus === 'READY'
                                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20'
                                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20'}
                                shadow-lg
                            `}
                        >
                            {reportStatus === 'READY' ? (
                                <>
                                    <Download className="w-4 h-4" />
                                    <span>Download PDF</span>
                                </>
                            ) : (
                                <>
                                    <Printer className="w-4 h-4" />
                                    <span>Generate Board Pack</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* BOTTOM: MARKET SENTIMENT CORRELATION */}
                <div className={`p-6 rounded-xl border ${T.panel}`}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2 opacity-50" />
                            Entity Sentiment Analysis (Internal AI)
                        </h3>
                        <div className="flex items-center space-x-2 text-[10px] font-mono text-gray-500">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span>POSITIVE CORRELATION</span>
                        </div>
                    </div>

                    <div className="h-32 flex items-end justify-between space-x-1">
                        {/* Mock Bar Chart */}
                        {Array.from({ length: 40 }).map((_, i) => {
                            const height = 40 + Math.random() * 50;
                            const isHigh = height > 70;
                            return (
                                <div
                                    key={i}
                                    className={`w-full rounded-t transition-all duration-500 ${isHigh ? 'bg-emerald-500/50 hover:bg-emerald-500' : 'bg-gray-700/30 hover:bg-gray-700'}`}
                                    style={{ height: `${height}%` }}
                                ></div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
};
