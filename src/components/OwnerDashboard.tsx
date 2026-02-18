import React from 'react';
import { notify } from '../utils/notify';

interface OwnerDashboardProps {
    theme?: 'dark' | 'light';
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ theme = 'dark' }) => {
    const isDark = theme === 'dark';

    // Theme Configuration
    const T = {
        bg: isDark ? "bg-[#080808]" : "bg-gray-50",
        cardBg: isDark ? "bg-[#111] border-gray-800" : "bg-white border-gray-200",
        textMain: isDark ? "text-gray-100" : "text-gray-900",
        textMuted: isDark ? "text-gray-400" : "text-gray-500",
        header: isDark ? "border-gray-800 bg-[#050505]" : "border-gray-200 bg-white",
        accent: "text-amber-500",
        grid: isDark ? "opacity-10" : "opacity-5",
    };

    return (
        <div className={`p-8 h-full overflow-auto transition-colors duration-500 ${T.bg}`}>

            {/* HERMITAGE HEADER */}
            <div className={`flex justify-between items-center mb-10 pb-4 border-b ${T.header}`}>
                <div>
                    <h2 className={`text-2xl font-bold flex items-center tracking-tight ${T.textMain}`}>
                        <span className="text-amber-500 mr-3 text-3xl">♛</span>
                        EXECUTIVE OVERSIGHT
                    </h2>
                    <div className={`text-xs ml-10 uppercase tracking-[0.2em] ${T.textMuted}`}>
                        Shareholder Value & Compliance Interface
                    </div>
                </div>
                <div className="flex space-x-6 text-right">
                    <div>
                        <div className={`text-[10px] uppercase tracking-widest ${T.textMuted}`}>Stock Price (Simulated)</div>
                        <div className={`font-mono font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>$248.42 <span className="text-green-500 text-sm">(+1.2%)</span></div>
                    </div>
                    <div>
                        <div className={`text-[10px] uppercase tracking-widest ${T.textMuted}`}>Next Board Meeting</div>
                        <div className={`font-mono font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>14d : 02h</div>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-6 mb-12">
                {[
                    { label: "Cycle Time Reduction", val: "-85%", sub: "vs Manual Engineering Review", color: "text-green-500", border: "hover:border-green-500/30" },
                    { label: "Compliance Score", val: "99.99%", sub: "Audit Ready (ISO-26262)", color: "text-blue-500", border: "hover:border-blue-500/30" },
                    { label: "Decisions Verified", val: "14,203", sub: "Q3 2026 To-Date", color: "text-purple-500", border: "hover:border-purple-500/30" },
                    { label: "Est. Cost Savings", val: "$4.2M", sub: "Engineering Hours Saved", color: T.textMain, border: "hover:border-amber-500/30" },
                ].map((kpi, idx) => (
                    <div key={idx} className={`p-6 rounded-sm border shadow-sm transition-all duration-300 ${T.cardBg} ${kpi.border} group`}>
                        <div className={`text-[10px] uppercase tracking-[0.2em] mb-3 ${T.textMuted}`}>{kpi.label}</div>
                        <div className={`text-4xl font-light tracking-tighter mb-2 ${kpi.color} group-hover:scale-105 transition-transform origin-left`}>{kpi.val}</div>
                        <div className={`text-[10px] font-mono ${T.textMuted}`}>{kpi.sub}</div>
                    </div>
                ))}
            </div>

            {/* COMPLIANCE & READINESS — Q3 2026 AUDIT */}
            <div className={`mb-12 p-6 rounded-sm border ${T.cardBg}`}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className={`text-xs font-bold uppercase tracking-widest ${T.textMuted}`}>Enterprise Readiness Scorecard</h3>
                    <div className="text-[10px] font-mono text-green-500 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        CONTINUOUS MONITORING ACTIVE
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-6 text-center">
                    {[
                        { std: "SOC 2 Type II", status: "COMPLIANT", date: "Verified: 2h ago", color: "text-green-500" },
                        { std: "FedRAMP High", status: "READY", date: "Package Built", color: "text-blue-500" },
                        { std: "ISO 26262 (Auto)", status: "CERTIFIED", date: "ASIL-D Compliant", color: "text-purple-500" },
                        { std: "GDPR / CCPA", status: "ENFORCED", date: "Zero Egress Mode", color: "text-amber-500" },
                    ].map((c, i) => (
                        <div key={i} className={`p-4 border rounded ${isDark ? 'border-gray-800 bg-black/20' : 'border-gray-200 bg-white'}`}>
                            <div className={`text-xs font-bold mb-2 ${T.textMain}`}>{c.std}</div>
                            <div className={`text-lg font-bold tracking-tight mb-1 ${c.color}`}>{c.status}</div>
                            <div className={`text-[10px] opacity-60 font-mono ${T.textMuted}`}>{c.date}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Infrastructure & Assurance ROI */}
            <div className="grid grid-cols-3 gap-8 mb-12">
                {/* GLOBAL MAP (ABSTRACT) */}
                <div className={`col-span-2 p-6 rounded-sm border relative overflow-hidden ${T.cardBg}`}>
                    <h3 className={`text-xs font-bold uppercase tracking-widest mb-6 ${T.textMuted}`}>Global Deployment Status</h3>

                    {/* Simulated Map Nodes */}
                    <div className="h-64 relative bg-blue-500/5 rounded border border-blue-500/10">
                        <div className="absolute top-1/4 left-1/4">
                            <span className="flex h-3 w-3 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                            </span>
                            <div className={`mt-2 text-[10px] font-bold ${T.textMain}`}>US_WEST (Primary)</div>
                        </div>
                        <div className="absolute top-1/3 right-1/4">
                            <span className="flex h-2 w-2 relative">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-50"></span>
                            </span>
                            <div className={`mt-2 text-[10px] ${T.textMuted}`}>EU_CENTRAL (Replica)</div>
                        </div>
                        <div className="absolute bottom-1/4 right-1/3">
                            <span className="flex h-2 w-2 relative">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-50"></span>
                            </span>
                            <div className={`mt-2 text-[10px] ${T.textMuted}`}>APAC_SOUTH (Planned)</div>
                        </div>

                        {/* Connection Lines (CSS) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                            <path d="M200 80 Q 400 50 600 120" stroke="currentColor" fill="none" className={isDark ? 'text-blue-500' : 'text-blue-900'} strokeDasharray="5,5" />
                        </svg>
                    </div>
                </div>

                {/* ROI METRICS */}
                <div className={`p-6 rounded-sm border flex flex-col justify-between ${T.cardBg}`}>
                    <div>
                        <h3 className={`text-xs font-bold uppercase tracking-widest mb-6 ${T.textMuted}`}>Infrastructure ROI</h3>
                        <ul className="space-y-6">
                            {[
                                { label: "Cloud Spend", val: "$12.4k/mo", trend: "-12%", color: "text-green-500" },
                                { label: "Human Verification", val: "$0/mo", trend: "-100%", color: "text-green-500" },
                                { label: "Risk Exposure", val: "LOW", trend: "STABLE", color: "text-blue-500" },
                            ].map((item, i) => (
                                <li key={i} className="flex justify-between items-end border-b pb-2 border-gray-700/20">
                                    <span className={`text-[10px] uppercase ${T.textMuted}`}>{item.label}</span>
                                    <div className="text-right">
                                        <div className={`font-mono text-lg font-bold ${T.textMain}`}>{item.val}</div>
                                        <div className={`text-[10px] ${item.color}`}>{item.trend}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button
                        onClick={() => notify("FINANCIAL REPORT", "Downloading Q3 2026 Quarterly Report...", "success")}
                        className="w-full py-2 mt-4 bg-gray-900 text-gray-400 text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                        Download Quarterly Report
                    </button>
                </div>
            </div>

            {/* Risk Mitigation Table */}
            <div className={`p-6 rounded-sm border ${T.cardBg}`}>
                <h3 className={`text-xs font-bold uppercase tracking-widest mb-6 ${T.textMuted}`}>Risk Mitigation Strategy (Live)</h3>
                <div className="grid grid-cols-4 gap-4">
                    {[
                        { title: "Critical Safety", count: 12, desc: "Potential Recall Events Prevented", color: "border-red-500 bg-red-500/5 text-red-500" },
                        { title: "Doc Gaps", count: 482, desc: "Missing Evidence Links Fixed", color: "border-yellow-500 bg-yellow-500/5 text-yellow-500" },
                        { title: "Compliant", count: 13709, desc: "Fully Traceable Assertions", color: "border-green-500 bg-green-500/5 text-green-500" },
                        { title: "Kill Switch", count: 3, desc: "FATAL/DANGER Keywords Caught", color: "border-blue-500 bg-blue-500/5 text-blue-500" },
                    ].map((risk, i) => (
                        <div key={i} className={`p-4 border-l-4 rounded-r flex justify-between items-center ${risk.color} ${isDark ? '' : 'bg-opacity-10'}`}>
                            <div>
                                <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{risk.title}</div>
                                <div className="text-[10px] opacity-70">{risk.desc}</div>
                            </div>
                            <div className="text-2xl font-mono font-bold">{risk.count}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
