import React, { useState, useEffect, useRef } from 'react';
import { INDUSTRIES_DATA, IndustryConfig } from '../constants';

// --- SUB-COMPONENTS ---

// 1. DYNAMIC SPARKLINE WITH THEME
const Sparkline = ({ color, theme }: { color: string, theme: 'dark' | 'light' }) => {
    const [path, setPath] = useState('');

    useEffect(() => {
        const generatePath = () => {
            let d = 'M 0 20';
            for (let i = 0; i <= 20; i++) {
                d += ` L ${i * 5} ${10 + Math.random() * 20}`;
            }
            setPath(d);
        };
        generatePath();
        const interval = setInterval(generatePath, 2000);
        return () => clearInterval(interval);
    }, []);

    const strokeColor = theme === 'dark' ? color : '#3b82f6'; // Always blue-ish in light mode for clinical look

    return (
        <svg width="100" height="40" className={theme === 'dark' ? "opacity-70" : "opacity-100"}>
            <path d={path} fill="none" stroke={strokeColor} strokeWidth="1.5" className="transition-all duration-500 ease-in-out" />
        </svg>
    );
};

// 2. LIVE EVENT LOG (Simulated)
const EventLog = ({ theme }: { theme: 'dark' | 'light' }) => {
    const [logs, setLogs] = useState<string[]>([]);
    const messages = [
        "INITIATING HANDSHAKE...",
        "VERIFYING CERTIFICATE CHAIN...",
        "NODE [44-X] QUARANTINED.",
        "TRAFFIC SPIKE DETECTED (PORT 8080).",
        "SYNC COMPLETE. DATABASE UPDATED.",
        "ENCRYPTING PAYLOAD...",
        "ACCESS GRANTED: USER_ADMIN_01",
        "PROTOCOL OFFSET ADJUSTED."
    ];

    useEffect(() => {
        const addLog = () => {
            const msg = messages[Math.floor(Math.random() * messages.length)];
            const time = new Date().toISOString().split('T')[1].split('.')[0];
            setLogs(prev => [`[${time}] ${msg}`, ...prev].slice(0, 6));
        };
        addLog();
        const interval = setInterval(addLog, 1500);
        return () => clearInterval(interval);
    }, []);

    const styles = theme === 'dark'
        ? "text-green-500/80 bg-black/50 border-green-900/30"
        : "text-blue-700 bg-blue-50/50 border-blue-200";

    return (
        <div className={`font-mono text-[10px] p-4 border rounded h-32 overflow-hidden flex flex-col font-light tracking-wide shadow-inner transition-colors duration-500 ${styles}`}>
            {logs.map((log, i) => (
                <div key={i} className={`mb-1 ${i === 0 ? 'font-bold' : 'opacity-60'}`}>
                    {i === 0 ? '> ' : '  '} {log}
                </div>
            ))}
        </div>
    );
};

// 3. GLOBAL TICKER
const StatusTicker = ({ theme }: { theme: 'dark' | 'light' }) => {
    const styles = theme === 'dark'
        ? "bg-[#050505] border-gray-800 text-gray-500"
        : "bg-white border-gray-200 text-gray-600";

    return (
        <div className={`fixed bottom-0 left-0 right-0 border-t py-1 overflow-hidden z-50 flex items-center h-8 transition-colors duration-500 ${styles}`}>
            <div className="flex animate-marquee whitespace-nowrap space-x-12 px-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex space-x-12 text-[10px] font-mono uppercase tracking-widest">
                        <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span> GLOBAL SYSTEM STATUS: NOMINAL</span>
                        <span>ACTIVE NODES: 8,492</span>
                        <span className="text-red-500">THREAT LEVEL: LOW-ELEVATED</span>
                        <span>LAST SYNC: {(new Date()).toUTCString()}</span>
                        <span>ZERO-TRUST ENFORCEMENT: 100%</span>
                    </div>
                ))}
            </div>
            <style>{`
                .animate-marquee { animation: marquee 30s linear infinite; }
                @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
            `}</style>
        </div>
    );
};


interface IndustriesProps {
    theme?: 'dark' | 'light';
}

export function Industries({ theme = 'dark' }: IndustriesProps) {
    const [activeFilter, setActiveFilter] = useState<'ALL' | 'CRITICAL' | 'RESTRICTED'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState<IndustryConfig | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const filteredIndustries = Object.values(INDUSTRIES_DATA).filter(industry => {
        const matchesSearch = industry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            industry.description.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (activeFilter === 'ALL') return true;
        if (activeFilter === 'CRITICAL') return industry.warning.includes('SECRET') || industry.warning.includes('CRITICAL') || industry.warning.includes('SGI');
        if (activeFilter === 'RESTRICTED') return industry.warning.includes('RESTRICTED') || industry.warning.includes('NOFORN') || industry.warning.includes('HIPAA');
        return true;
    });

    // Theme Config Helpers
    const isDark = theme === 'dark';

    // Theme Classes
    const T = {
        bg: isDark ? "bg-[#050505]" : "bg-gray-50",
        textMain: isDark ? "text-gray-100" : "text-gray-900",
        textMuted: isDark ? "text-gray-400" : "text-gray-500",
        selection: isDark ? "selection:bg-blue-500/30" : "selection:bg-blue-200/50",
        grid: isDark ? "opacity-[0.03]" : "opacity-[0.05] grayscale inverted", // Stronger grid in light mode
        headerBorder: isDark ? "border-gray-800/50" : "border-gray-200",
        cardBg: isDark ? "bg-[#0e0e0e]" : "bg-white",
        cardBorder: isDark ? "border-gray-800" : "border-gray-200",
        cardHoverBorder: isDark ? "hover:border-blue-500/50" : "hover:border-blue-400",
        inputBg: isDark ? "bg-[#0a0a0a]" : "bg-white",
        inputBorder: isDark ? "border-gray-800" : "border-gray-300",
        inputText: isDark ? "text-blue-100" : "text-gray-800",
        filterActive: isDark ? "bg-blue-600 text-white" : "bg-blue-600 text-white",
        filterInactive: isDark ? "text-gray-500 hover:bg-gray-900" : "text-gray-500 hover:bg-gray-100",
        modalOverlay: isDark ? "bg-black/80" : "bg-white/60",
        modalBg: isDark ? "bg-[#0a0a0a]" : "bg-white",
        modalBorder: isDark ? "border-gray-700" : "border-gray-100",
    };

    return (
        <div className={`relative h-full overflow-hidden flex flex-col transition-colors duration-500 ${T.bg} ${T.textMain} ${T.selection}`}>
            {/* TECHNICAL BACKGROUND GRID */}
            <div className={`fixed inset-0 pointer-events-none transition-opacity duration-500 ${T.grid}`}
                style={{
                    backgroundImage: `
                        linear-gradient(to right, #444 1px, transparent 1px), 
                        linear-gradient(to bottom, #444 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 100%)'
                }}>
            </div>

            {/* MAIN SCROLL AREA */}
            <div className="flex-grow overflow-y-auto pb-12">
                <div className="relative max-w-[1800px] mx-auto p-8 md:p-12">
                    {/* HERO HEADER */}
                    <header className={`mb-16 border-b pb-8 relative transition-colors duration-500 ${T.headerBorder}`}>
                        <div className="flex flex-col xl:flex-row justify-between items-end gap-12">
                            <div className="relative z-10">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="h-px w-12 bg-blue-500"></div>
                                    <div className="text-[10px] font-mono text-blue-500 mb-2 tracking-[0.3em] uppercase">Global Infrastructure // Sector Oversight</div>
                                </div>
                                <h1 className={`text-6xl md:text-8xl font-bold tracking-tighter uppercase leading-none transition-colors duration-500 ${isDark ? 'text-white mix-blend-screen' : 'text-gray-900'}`}>
                                    Industries
                                    <span className="text-blue-600 animate-pulse">.</span>
                                </h1>
                            </div>

                            {/* ABSTRACT MAP VISUALIZATION */}
                            <div className="hidden xl:block absolute right-0 top-0 w-[600px] h-[200px] opacity-20 pointer-events-none">
                                <div className="w-full h-full" style={{
                                    backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)',
                                    backgroundSize: '20px 20px',
                                    maskImage: 'linear-gradient(to right, transparent, black, transparent)'
                                }}></div>
                            </div>

                            {/* CONTROLS */}
                            <div className="w-full xl:w-auto flex flex-col items-end gap-6 z-10">
                                {/* SEARCH */}
                                <div className="relative group w-full xl:w-96">
                                    <input
                                        type="text"
                                        placeholder="SEARCH SECTOR DATABASE..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className={`w-full border text-sm font-mono px-4 py-3 focus:outline-none focus:border-blue-500/50 transition-all placeholder-gray-400 uppercase tracking-widest ${T.inputBg} ${T.inputBorder} ${T.inputText}`}
                                    />
                                    <div className="absolute right-3 top-3.5 w-2 h-2 bg-blue-500/50 rounded-full animate-pulse"></div>
                                </div>

                                {/* FILTER TABS */}
                                <div className={`flex space-x-1 p-1 border transition-colors duration-500 ${T.inputBg} ${T.inputBorder}`}>
                                    {(['ALL', 'CRITICAL', 'RESTRICTED'] as const).map(filter => (
                                        <button
                                            key={filter}
                                            onClick={() => setActiveFilter(filter)}
                                            className={`px-6 py-2 text-[10px] uppercase font-bold tracking-widest transition-all ${activeFilter === filter
                                                    ? `${T.filterActive} shadow-lg`
                                                    : T.filterInactive
                                                }`}
                                        >
                                            [{filter}]
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                        {filteredIndustries.map((industry, index) => (
                            <div key={index}
                                onClick={() => setSelectedIndustry(industry)}
                                className={`
                                    group relative border transition-all duration-300 flex flex-col h-full overflow-hidden cursor-pointer shadow-sm hover:shadow-xl
                                    ${T.cardBg} ${T.cardBorder} ${T.cardHoverBorder}
                                    ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                                `}
                                style={{ transitionDelay: `${index * 50}ms` }}
                            >
                                {/* SCANNING LINE ANIMATION */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/50 shadow-[0_0_10px_#3b82f6] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none"
                                    style={{ animation: 'scan 2s linear infinite', animationPlayState: 'paused' }}>
                                    <style>{`
                                        .group:hover .scan-line { animation-play-state: running; }
                                        @keyframes scan { 0% { top: -10%; } 100% { top: 110%; } }
                                    `}</style>
                                </div>

                                {/* IMAGE */}
                                <div className={`h-40 relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 border-b ${T.cardBorder} group-hover:border-blue-500/30`}>
                                    <img
                                        src={industry.image}
                                        alt={industry.title}
                                        className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-1000 ease-out opacity-60 group-hover:opacity-100"
                                    />
                                    <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent ${isDark ? 'from-[#0e0e0e]' : 'from-white'}`}></div>

                                    {/* BADGE */}
                                    <div className="absolute top-3 right-3">
                                        <div className={`text-[9px] font-mono backdrop-blur px-2 py-1 border uppercase tracking-widest shadow-lg ${isDark
                                                ? `text-${industry.color}-300 bg-black/80 border-${industry.color}-500/30`
                                                : `text-${industry.color}-700 bg-white/90 border-${industry.color}-200`
                                            }`}>
                                            {industry.badge.split(' ')[0]}
                                        </div>
                                    </div>
                                </div>

                                {/* BODY */}
                                <div className="p-5 flex-grow flex flex-col relative">
                                    <div className="flex items-center justify-between text-[9px] font-mono mb-3 uppercase tracking-wider">
                                        <div className="flex items-center space-x-2">
                                            <span className={`w-1.5 h-1.5 rounded-full bg-${industry.color}-500 animate-pulse`}></span>
                                            <span className={T.textMuted}>ID: {String(index + 1).padStart(3, '0')}</span>
                                        </div>
                                        <Sparkline color={industry.color === 'red' ? '#ef4444' : '#3b82f6'} theme={theme} />
                                    </div>

                                    <h3 className={`text-xl font-bold uppercase tracking-tight mb-2 transition-colors ${isDark ? 'text-gray-200 group-hover:text-white' : 'text-gray-800 group-hover:text-blue-600'}`}>
                                        {industry.title}
                                    </h3>

                                    <p className={`text-[11px] leading-relaxed mb-6 flex-grow border-l pl-3 py-1 transition-colors uppercase tracking-wide ${T.textMuted} ${isDark ? 'border-gray-800' : 'border-gray-200'} group-hover:border-blue-500/50`}>
                                        {industry.description}
                                    </p>

                                    {/* METRICS */}
                                    <div className={`space-y-3 border-t pt-4 mt-auto ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                                        <div className={`flex justify-between items-center text-[9px] font-mono ${T.textMuted}`}>
                                            <span>LOAD</span>
                                            <div className="flex space-x-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <div key={i} className={`w-3 h-1 ${i < 3 ? `bg-${industry.color}-500/50` : (isDark ? 'bg-gray-800' : 'bg-gray-200')}`}></div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center text-[9px] font-mono">
                                            <span className={T.textMuted}>TENANT</span>
                                            <span className={`truncate max-w-[100px] ${isDark ? 'text-gray-300' : 'text-gray-600'}`} title={industry.tenant}>{industry.tenant}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* STATUS TICKER */}
            <StatusTicker theme={theme} />

            {/* TACTICAL MODAL */}
            {selectedIndustry && (
                <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 backdrop-blur-sm animate-in fade-in duration-200 ${T.modalOverlay}`}>
                    <div className={`border w-full max-w-5xl h-[80vh] flex flex-col md:flex-row shadow-2xl overflow-hidden relative ${T.modalBg} ${T.modalBorder}`}
                        onClick={(e) => e.stopPropagation()}>

                        {/* CLOSE BUTTON */}
                        <button
                            onClick={() => setSelectedIndustry(null)}
                            className="absolute top-0 right-0 p-4 text-gray-500 hover:text-red-500 z-50 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        {/* LEFT COLUMN: VISUALS */}
                        <div className={`w-full md:w-1/3 border-r relative ${isDark ? 'bg-[#050505] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="h-64 md:h-full relative overflow-hidden">
                                <img src={selectedIndustry.image} className="w-full h-full object-cover opacity-50 grayscale" />
                                <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-[#0a0a0a]' : 'from-white'} via-transparent to-transparent`}></div>
                                <div className="absolute bottom-8 left-8">
                                    <div className="text-[10px] font-mono text-blue-500 mb-2 tracking-[0.3em] uppercase">Tactical View</div>
                                    <h2 className={`text-4xl font-bold uppercase leading-none tracking-tighter mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedIndustry.title}</h2>
                                    <div className={`inline-block px-3 py-1 border text-[10px] font-mono uppercase tracking-widest ${isDark
                                            ? `border-${selectedIndustry.color}-500/50 text-${selectedIndustry.color}-400 bg-${selectedIndustry.color}-900/10`
                                            : `border-${selectedIndustry.color}-300 text-${selectedIndustry.color}-700 bg-${selectedIndustry.color}-50`
                                        }`}>
                                        {selectedIndustry.warning}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: DATA */}
                        <div className={`w-full md:w-2/3 p-8 md:p-12 overflow-y-auto ${T.modalBg}`}>

                            {/* TOP STATS */}
                            <div className={`grid grid-cols-3 gap-4 mb-12 border-b pb-12 ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                                <div>
                                    <div className="text-[10px] text-gray-500 font-mono mb-1">AVAILABILITY</div>
                                    <div className={`text-3xl font-light ${T.textMain}`}>99.99<span className="text-sm text-gray-500">%</span></div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-gray-500 font-mono mb-1">LATENCY</div>
                                    <div className={`text-3xl font-light ${T.textMain}`}>12<span className="text-sm text-gray-500">ms</span></div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-gray-500 font-mono mb-1">ACTIVE USERS</div>
                                    <div className={`text-3xl font-light ${T.textMain}`}>8.2<span className="text-sm text-gray-500">k</span></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                {/* EVENT LOG */}
                                <div>
                                    <h3 className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                                        Live Event Stream
                                    </h3>
                                    <EventLog theme={theme} />
                                </div>

                                {/* TECH SPECS */}
                                <div>
                                    <h3 className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-4">
                                        Compliance & Standards
                                    </h3>
                                    <ul className="space-y-2">
                                        {['ISO 27001 Certified', 'SOC 2 Type II Compliant', 'Zero-Trust Architecture', '24/7 Threat Monitoring'].map((item, i) => (
                                            <li key={i} className={`flex items-center text-sm border-b pb-2 ${isDark ? 'text-gray-300 border-gray-800' : 'text-gray-600 border-gray-100'}`}>
                                                <svg className="w-4 h-4 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* ACTIONS */}
                            <div className={`mt-12 pt-8 border-t flex justify-end space-x-4 ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                                <button className={`px-6 py-3 border font-mono text-xs uppercase tracking-widest transition-colors ${isDark
                                        ? "border-gray-700 text-gray-400 hover:bg-gray-800"
                                        : "border-gray-300 text-gray-600 hover:bg-gray-100"
                                    }`}>
                                    View Documentation
                                </button>
                                <button className="px-8 py-3 bg-blue-600 text-white font-mono text-xs uppercase tracking-widest hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all">
                                    Initiate Deployment
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
