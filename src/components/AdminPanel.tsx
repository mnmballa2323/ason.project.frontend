import React, { useState, useEffect, useRef } from 'react';
import { notify } from '../utils/notify';
import { NetworkTopology } from './NetworkTopology';
import { ChaosControl } from './ChaosControl';
import { QuantumVault } from './QuantumVault';
import { ZeroTrustShield } from './ZeroTrustShield';
import { ImmutableLedger } from './ImmutableLedger';
import { OmegaLockdown } from './OmegaLockdown';
import { SovereignGlobe } from './SovereignGlobe';
import { RunbookPanel } from './RunbookPanel';
import { Shield, Lock } from 'lucide-react';

interface AdminPanelProps {
    theme?: 'dark' | 'light';
    onLockdown: () => void;
    isLockdown: boolean;
}

interface InfraService {
    name: string;
    status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
    uptime: string;
    load: string;
    version: string;
    color: string;
}

const INFRA_SERVICES: InfraService[] = [
    { name: "Inference Engine (vLLM)", status: "HEALTHY", uptime: "14d 2h", load: "42% (GPU)", version: "0.4.1", color: "blue" },
    { name: "Orchestrator (FastAPI)", status: "HEALTHY", uptime: "14d 2h", load: "12% (CPU)", version: "2.0.0", color: "purple" },
    { name: "Vector Store (Milvus)", status: "HEALTHY", uptime: "45d 1h", load: "8% (MEM)", version: "2.3.4", color: "yellow" },
    { name: "Octavia Load Balancer", status: "HEALTHY", uptime: "30d 0h", load: "3% (NET)", version: "1.0.0", color: "cyan" },
    { name: "Swift Object Storage", status: "HEALTHY", uptime: "30d 0h", load: "12TB Used", version: "2.32.0", color: "emerald" },
    { name: "Cinder Block Storage", status: "HEALTHY", uptime: "30d 0h", load: "100GB Alloc", version: "21.0.0", color: "orange" },
];

interface LogEntry {
    time: string;
    type: string;
    msg: string;
    severity: string;
}

const ACTIVE_SESSIONS = [
    { user: "jdoe@tesla.com", role: "Engineer", status: "Active", time: "2h 4m", color: "green" },
    { user: "admin@tesla.com", role: "Admin", status: "Active", time: "42m", color: "red" },
];

const INITIAL_LOGS: LogEntry[] = [
    { time: "14:02:11", type: "AUTH", msg: "User 'jdoe' login success (MFA)", severity: "info" },
    { time: "14:05:33", type: "DATA", msg: "Batch upload 'specs_v4.pdf' (24MB)", severity: "info" },
    { time: "14:11:09", type: "VERIFY", msg: "Job #88231 completed (SHA256: 9a8b...)", severity: "info" },
    { time: "14:15:00", type: "WARN", msg: "High latency detected on GPU-02", severity: "warning" },
    { time: "14:18:22", type: "AUTH", msg: "User 'msmith' login success (MFA)", severity: "info" },
    { time: "14:20:05", type: "DENY", msg: "Unauthorized access attempt from 192.168.1.104", severity: "critical" },
    { time: "14:22:00", type: "DR", msg: "Scheduled backup snapshot-ason-db-20261024 created", severity: "info" },
    { time: "14:21:45", type: "AUTH", msg: "User admin_01 verified via Biometric Handshake", severity: "success" },
];

export const AdminPanel: React.FC<AdminPanelProps> = ({ theme = 'dark', onLockdown, isLockdown }) => {
    const isDark = theme === 'dark';
    const [drStatus, setDrStatus] = useState<string>('IDLE');
    const [integrityStatus, setIntegrityStatus] = useState<string>('NOT RUN');
    const [showZeroTrust, setShowZeroTrust] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [chaosActive, setChaosActive] = useState(false);
    // Local lockdown state removed
    const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
    const logEndRef = useRef<HTMLDivElement>(null);

    const ACTION_CARDS = [
        { label: "Audit Chain", val: "VALID", sub: "SHA-256 Chain Intact", color: "green", border: "border-green-500/30" },
        { label: "Kill Switch", val: isLockdown ? "ACTIVE" : "ARMED", sub: isLockdown ? "NETWORK SEVERED" : "6 Critical Keywords Active", color: isLockdown ? "red" : "blue", border: isLockdown ? "border-red-500" : "border-blue-500/30" },
        { label: "Consensus", val: "3-WAY", sub: "2/3 Majority Required", color: "amber", border: "border-amber-500/30" },
        { label: "Determinism", val: "LOCKED", sub: "T=0.0 / Seed=42", color: "purple", border: "border-purple-500/30" },
    ];

    // Theme Configuration
    const T = {
        bg: isDark ? "bg-[#0a0a0a]" : "bg-gray-50",
        panelBg: isDark ? "bg-[#111] border-gray-800" : "bg-white border-gray-200",
        terminalBg: isDark ? "bg-black border-gray-800" : "bg-[#1e1e1e] border-gray-700", // Terminal always dark-ish for contrast
        textMain: isDark ? "text-gray-100" : "text-gray-900",
        textMuted: isDark ? "text-gray-500" : "text-gray-500",
        tableHeader: isDark ? "bg-gray-900 text-gray-500" : "bg-gray-100 text-gray-600",
        tableRow: isDark ? "border-gray-800 hover:bg-gray-800/50" : "border-gray-200 hover:bg-gray-50",
    };

    // Auto-scroll logs
    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    // Simulated Log Stream
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.7) {
                const newLog = {
                    time: new Date().toLocaleTimeString('en-US', { hour12: false }),
                    type: ['INFO', 'WARN', 'AUTH', 'SYS'].sort(() => 0.5 - Math.random())[0],
                    msg: `System heartbeat tick: ${Math.random().toString(36).substring(7)}`,
                    severity: Math.random() > 0.9 ? 'warning' : 'info'
                };
                setLogs((prev: LogEntry[]) => [...prev.slice(-19), newLog]);
            }
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const triggerDR = () => {
        setDrStatus('RUNNING...');
        setLogs((prev: LogEntry[]) => [...prev, { time: new Date().toLocaleTimeString(), type: 'DR', msg: 'Manual DR Snapshot initiated', severity: 'warning' }]);
        setTimeout(() => setDrStatus('✅ SNAPSHOT CREATED'), 2000);
    };

    const addLog = (msg: string, type: string, severity: 'info' | 'warning' | 'critical' | 'success') => {
        setLogs((prev: LogEntry[]) => [...prev, {
            time: new Date().toLocaleTimeString('en-US', { hour12: false }),
            type,
            msg,
            severity
        }]);
    };

    const triggerIntegrityCheck = () => {
        setIntegrityStatus('SCANNING...');
        setLogs((prev: LogEntry[]) => [...prev, { time: new Date().toLocaleTimeString(), type: 'SEC', msg: 'Starting full integrity sweep...', severity: 'info' }]);
        setTimeout(() => setIntegrityStatus('✅ VERIFIED'), 2500);
    };

    const handleProtectedAction = () => {
        if (isVerified) {
            notify("ACCESS GRANTED", "User already verified.", "success");
        } else {
            setShowZeroTrust(true);
        }
    };

    const handleExportLogs = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `ason_audit_log_${new Date().toISOString()}.json`);
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        notify("EXPORT SUCCESS", "Audit Log (JSON) downloaded successfully.", "success");
    };

    return (
        <div className={`p-6 h-full font-mono overflow-auto transition-colors duration-500 ${T.bg}`}>
            {showZeroTrust && (
                <ZeroTrustShield
                    theme={theme}
                    onVerified={() => {
                        setIsVerified(true);
                        setShowZeroTrust(false);
                    }}
                />
            )}

            <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-red-500' : 'text-red-600'}`}>
                <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                SYSTEM CONSOLE [ADMIN] — LIBERTY CENTER ONE
            </h2>

            {/* LIVE GLOBAL OVERWATCH */}
            <div className="mb-8 h-96 rounded-xl overflow-hidden border border-gray-700 relative">
                <SovereignGlobe theme={theme} />
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur px-2 py-1 rounded text-[10px] text-cyan-400 border border-cyan-900/50">
                    LIVE SATELLITE UPLINK: ACTIVE
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* LIVE THREAT INTEL */}
                <div className="lg:col-span-2">
                    <QuantumVault theme={theme} />
                </div>

                {/* IMMUTABLE AUDIT LOG */}
                <div className="mb-8">
                    <ImmutableLedger theme={theme} />
                </div>

                {/* CHAOS CONTROL */}
                <div>
                    <ChaosControl theme={theme} active={chaosActive} onToggle={setChaosActive} />
                </div>
            </div>

            {/* NETWORK TOPOLOGY */}
            <div className={`p-6 border rounded-xl mb-8 ${T.panelBg}`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`font-bold uppercase tracking-wider ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                        Resilience Topology (Live)
                    </h3>
                </div>
                <NetworkTopology theme={theme} chaosMode={chaosActive} onNodeClick={() => { }} />
            </div>

            {/* Top Action Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                {ACTION_CARDS.map((card, i) => (
                    <div key={i} className={`p-4 rounded text-center border shadow-sm transition-all ${T.panelBg} ${isDark ? card.border : 'border-gray-300'}`}>
                        <div className="text-[10px] uppercase mb-1 opacity-60 tracking-widest">{card.label}</div>
                        <div className={`text-2xl font-bold text-${card.color}-500`}>{card.val}</div>
                        <div className={`text-[10px] opacity-80 text-${card.color}-600 mt-1`}>{card.sub}</div>
                    </div>
                ))}
            </div>

            {/* Admin Actions */}
            <div className="grid grid-cols-3 gap-4 mb-8 print:hidden">
                <button
                    onClick={() => window.print()}
                    className={`px-4 py-4 rounded text-sm font-bold border flex items-center justify-center gap-2 transition-all shadow-sm
                        ${isDark ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'}
                    `}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                    PRINT OFFICIAL REPORT
                </button>

                <button
                    onClick={handleExportLogs}
                    className={`px-4 py-4 rounded text-sm font-bold border flex items-center justify-center gap-2 transition-all shadow-sm
                        ${isDark ? 'bg-blue-900/20 border-blue-800 text-blue-400 hover:bg-blue-900/40' : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'}
                    `}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    EXPORT JSON PACKAGE
                </button>

                <button
                    onClick={triggerIntegrityCheck}
                    className={`px-4 py-4 rounded text-sm font-bold border flex items-center justify-center gap-2 transition-all shadow-sm
                        ${isDark ? 'bg-purple-900/20 border-purple-800 text-purple-400 hover:bg-purple-900/40' : 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'}
                    `}
                >
                    <Shield className="w-4 h-4" />
                    {integrityStatus === 'NOT RUN' ? 'VERIFY INTEGRITY' : integrityStatus}
                </button>
            </div>

            <style>{`
                @media print {
                    @page { margin: 2cm; }
                    body { background: white !important; color: black !important; }
                    .print\\:hidden, button, .lucide, canvas { display: none !important; }
                    .print\\:show { display: block !important; }
                    /* Hide heavy visuals */
                    .rounded-xl, .border, .shadow-sm, .shadow-inner { border: none !important; box-shadow: none !important; border-radius: 0 !important; }
                    /* Typography */
                    h2 { color: black !important; font-size: 18pt !important; border-bottom: 2px solid black; padding-bottom: 10px; }
                    /* Log Table */
                    .overflow-y-auto { overflow: visible !important; height: auto !important; }
                    .text-gray-500, .text-gray-300, .text-blue-400, .text-yellow-500, .text-red-500 { color: black !important; }
                    /* Header */
                    .print-header { 
                        display: block !important; 
                        text-align: center; 
                        margin-bottom: 20px; 
                        font-weight: bold; 
                        font-family: monospace;
                        border-bottom: 1px solid #000;
                        padding-bottom: 10px;
                    }
                    .print-footer {
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        font-size: 8pt;
                        text-align: center;
                        border-top: 1px solid #ccc;
                        padding-top: 5px;
                    }
                }
            `}</style>

            {/* Print Footer */}
            <div className="text-center mt-12 pt-8 border-t border-gray-800 text-[10px] font-mono text-gray-500 uppercase tracking-widest hidden print:block">
                GENERATED BY: ASON VERIFICATION PLATFORM v47.0.1
                <br />
                CONFIDENTIAL // DO NOT DISTRIBUTE // INTERNAL USE ONLY
                <br />
                <br />
                Ason Platform • Sovereign Infrastructure • Zero-Egress Guarantee
            </div>

            {/* OMEGA LOCKDOWN (Separate Row for Drama) */}
            <div className="mb-8">
                <OmegaLockdown isActive={isLockdown} onTrigger={onLockdown} />
            </div>

            {/* Infrastructure Status Table */}
            <div className={`mb-8 rounded overflow-hidden border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                <div className={`px-4 py-2 text-xs font-bold uppercase tracking-widest ${T.tableHeader}`}>
                    Infrastructure Status (Live)
                </div>
                <table className="w-full text-xs text-left">
                    <tbody className={`divide-y ${isDark ? 'divide-gray-800' : 'divide-gray-200'}`}>
                        {INFRA_SERVICES.map((svc) => (
                            <tr key={svc.name} className={`${T.tableRow} transition-colors`}>
                                <td className={`p-3 font-bold ${isDark ? `text-${svc.color}-400` : `text-${svc.color}-600`}`}>{svc.name}</td>
                                <td className="p-3">
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${svc.status === 'HEALTHY'
                                        ? (isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700')
                                        : (isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700')
                                        }`}>
                                        {svc.status}
                                    </span>
                                </td>
                                <td className={`p-3 ${T.textMain}`}>{svc.uptime}</td>
                                <td className={`p-3 ${T.textMuted}`}>{svc.load}</td>
                                <td className={`p-3 font-mono ${T.textMuted}`}>{svc.version}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Security Audit Log */}
                <div className={`p-1 rounded border shadow-inner ${T.terminalBg}`}>
                    <div className="bg-gray-800/50 p-1 text-[10px] text-gray-400 uppercase tracking-widest text-center border-b border-gray-700 mb-1">
                        /var/log/security_audit.log
                    </div>
                    <div className="h-64 overflow-y-auto p-2 space-y-1 font-mono text-[10px]">
                        {logs.map((evt, i) => (
                            <div key={i} className="flex gap-2">
                                <span className="text-gray-500 select-none">[{evt.time}]</span>
                                <span className={
                                    evt.severity === 'critical' ? 'text-red-500 font-bold bg-red-900/20 px-1' :
                                        evt.severity === 'warning' ? 'text-yellow-500' :
                                            'text-blue-400'
                                }>{evt.type}</span>
                                <span className="text-gray-300">{evt.msg}</span>
                            </div>
                        ))}
                        <div ref={logEndRef} />
                    </div>
                </div>

                {/* Active Sessions */}
                <div className={`p-4 rounded border ${T.panelBg}`}>
                    <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 ${T.textMuted}`}>Active Sessions (IAM)</h3>
                    <ul className="space-y-3 text-xs mb-6">
                        {ACTIVE_SESSIONS.map((sess, i) => (
                            <li key={i} className={`flex justify-between items-center border-b pb-2 ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                                <div>
                                    <div className={`font-bold ${T.textMain}`}>{sess.user}</div>
                                    <div className="text-[10px] text-gray-500">{sess.role} • {sess.time}</div>
                                </div>
                                <div className={`w-2 h-2 rounded-full bg-${sess.color}-500 animate-pulse`}></div>
                            </li>
                        ))}
                    </ul>

                    {/* RUNBOOKS */}
                    <RunbookPanel theme={theme} onLog={addLog} />
                </div>
            </div>
        </div>
    );
};
