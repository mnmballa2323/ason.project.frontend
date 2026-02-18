import React, { useState, useEffect, useRef } from 'react';
import { notify } from '../utils/notify';
import { Globe, Server, Cloud, Shield, Cpu, Code, Database, Lock, Zap, ArrowRight, CheckCircle, Terminal, FileText, Anchor, Activity, Briefcase, ChevronRight, Download } from 'lucide-react';

interface AboutProps {
    theme: 'dark' | 'light';
    onNavigate?: (view: 'dashboard' | 'industries' | 'audit' | 'governance' | 'about' | 'terms' | 'privacy' | 'cookies') => void;
}

export function About({ theme, onNavigate }: AboutProps) {
    const isDark = theme === 'dark';
    const [mounted, setMounted] = useState(false);
    const downloadsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const T = {
        bg: isDark ? "bg-[#050505]" : "bg-gray-50",
        textMain: isDark ? "text-gray-100" : "text-gray-900",
        textMuted: isDark ? "text-gray-400" : "text-gray-600",
        border: isDark ? "border-gray-800" : "border-gray-200",
        cardBg: isDark ? "bg-[#0a0a0a]/80 backdrop-blur-md" : "bg-white/80 backdrop-blur-md",
        cardBorder: isDark ? "border-gray-800" : "border-gray-200",
        accent: "text-blue-500",
        grid: isDark ? "opacity-[0.05]" : "opacity-[0.03]",
        aurora: isDark ? "opacity-30" : "opacity-40 mix-blend-multiply",
    };

    const INDUSTRIES_DATA = [
        {
            title: "Defense & Intelligence",
            desc: "Mission-critical decision support for kinetic environments. Real-time threat analysis with zero-latency edge compute.",
            icon: Shield,
            stats: ["IL6 Ready", "Air-Gapped", "FIPS 140-3"]
        },
        {
            title: "Energy & Utilities",
            desc: "Predictive maintenance for national grid infrastructure. optimizing output while ensuring resilience against cyber-physical attacks.",
            icon: Zap,
            stats: ["SCADA Secure", "99.999% SLA", "Predictive AI"]
        },
        {
            title: "Global Finance",
            desc: "High-frequency audit trails for capital markets. Immutable ledgers ensuring SOC2 and SEC compliance at millisecond resolution.",
            icon: Briefcase, // Fallback icon if Briefcase doesn't exist, check imports
            stats: ["Basel III", "SOX Compliant", "Zero-Trust"]
        }
    ];

    const PHILOSOPHY = [
        {
            title: "Zero External Dependencies",
            subtitle: "Sovereign Infrastructure",
            desc: "The system operates independently of public AI services, generating all logic and verification locally. Egress filtering prevents unauthorized data leaks.",
            icon: Shield
        },
        {
            title: "Recursive Optimization",
            subtitle: "The Refactor Engine",
            desc: "Continuously analyzes codebase for optimization opportunities. Automated patching identifies bug patterns and suggests fixes in real-time.",
            icon: Cpu
        },
        {
            title: "Role-Based Access Control",
            subtitle: "Enterprise RBAC",
            desc: "Strictly enforced roles for Analysts (Explainable AI), Administrators (Config), and Compliance Officers (Audit Ledgers).",
            icon: Lock
        }
    ];

    const PROVIDERS = [
        { name: "AWS", region: "us-east-1", status: "READY", latency: "12ms" },
        { name: "Azure", region: "eastus2", status: "READY", latency: "14ms" },
        { name: "Google Cloud", region: "us-central1", status: "READY", latency: "10ms" },
        { name: "Oracle Cloud", region: "us-ashburn-1", status: "READY", latency: "18ms" },
        { name: "IBM Cloud", region: "us-south", status: "READY", latency: "22ms" },
        { name: "Alibaba Cloud", region: "us-west-1", status: "READY", latency: "155ms" },
        { name: "Tencent Cloud", region: "na-siliconvalley", status: "READY", latency: "160ms" },
        { name: "DigitalOcean", region: "nyc3", status: "READY", latency: "8ms" },
        { name: "Linode", region: "newark", status: "READY", latency: "9ms" },
        { name: "Vultr", region: "nj", status: "READY", latency: "11ms" },
        { name: "Hetzner", region: "ash", status: "READY", latency: "88ms" },
        { name: "OVHcloud", region: "bhs", status: "READY", latency: "35ms" },
        { name: "Salesforce", region: "na1", status: "READY", latency: "45ms" },
        { name: "SAP BTP", region: "us10", status: "READY", latency: "50ms" },
        { name: "VMware", region: "on-prem", status: "READY", latency: "<1ms" },
        { name: "Nutanix", region: "hybrid", status: "READY", latency: "<1ms" },
        { name: "OpenStack", region: "private-cloud", status: "READY", latency: "<1ms" },
        { name: "Rackspace", region: "iad", status: "READY", latency: "25ms" }
    ];

    const DOWNLOADS = [
        { title: "Product Spec", type: "MD", size: "9.8 KB", version: "v47.0", icon: FileText, id: "spec" },
        { title: "Deploy Guide", type: "MD", size: "2.1 KB", version: "v2.1", icon: Cloud, id: "deploy" },
        { title: "Install Script", type: "SH", size: "16.5 KB", version: "v1.0", icon: Terminal, id: "install" },
        { title: "Sovereign Guide", type: "MD", size: "1.7 KB", version: "v2.0", icon: Shield, id: "sovereign" },
    ];

    const handleDownload = (docTitle: string, docId: string) => {
        notify("SECURE TRANSFER", `Downloading: ${docTitle}`, "success");

        const assets: Record<string, string> = {
            'spec': '/assets/product_specs.md',
            'deploy': '/assets/deploy_guide.md',
            'install': '/assets/install.sh',
            'sovereign': '/assets/sovereign_guide.md',
        };

        if (assets[docId]) {
            const link = document.createElement('a');
            link.href = assets[docId];
            link.download = assets[docId].split('/').pop() || 'download';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleDeploy = (provider: string) => {
        notify("DEPLOYMENT INITIATED", `Provisioning resources on ${provider}...`, "info");
    };

    const scrollToDocs = () => {
        downloadsRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className={`relative h-full overflow-y-auto ${T.bg} ${T.textMain} font-sans selection:bg-blue-500/30 transition-colors duration-500`}>

            {/* AURORA BACKGROUND ANIMATION */}
            <div className={`fixed inset-0 pointer-events-none overflow-hidden transition-opacity duration-1000 ${T.aurora}`}>
                <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[80%] rounded-full bg-blue-600 blur-[120px] animate-pulse opacity-40"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-500 blur-[100px] animate-pulse opacity-30" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-[20%] right-[20%] w-[40%] h-[40%] rounded-full bg-purple-600 blur-[80px] animate-pulse opacity-20" style={{ animationDelay: '4s' }}></div>
            </div>

            {/* TECHNICAL GRID OVERLAY */}
            <div className={`fixed inset-0 pointer-events-none ${T.grid}`}
                style={{
                    backgroundImage: `
                        linear-gradient(to right, #888 1px, transparent 1px), 
                        linear-gradient(to bottom, #888 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px',
                    maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 100%)'
                }}>
            </div>

            <div className="relative max-w-[1600px] mx-auto p-8 md:p-12 lg:p-20 z-10">

                {/* HERO SECTION */}
                <header className="mb-32 flex flex-col items-center text-center relative">
                    <div className={`
                        inline-flex items-center space-x-2 mb-8 px-4 py-1.5 rounded-full border backdrop-blur-sm
                        ${isDark ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' : 'border-blue-400 bg-blue-50 text-blue-600'}
                    `}>
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        <span className="text-[10px] font-mono tracking-[0.2em] uppercase font-bold">System Online // v47.0.1</span>
                    </div>

                    <h1 className={`text-7xl md:text-9xl font-bold tracking-tighter uppercase leading-[0.9] mb-8 bg-clip-text text-transparent bg-gradient-to-b ${isDark ? 'from-white via-white to-gray-500' : 'from-gray-900 via-gray-800 to-gray-500'}`}>
                        Sovereign<br />Intelligence
                    </h1>

                    <p className={`text-xl md:text-2xl max-w-3xl mx-auto font-light leading-relaxed mb-8 ${T.textMuted}`}>
                        The definitive solution for autonomous enterprise verification.
                        Achieving zero-defect code deployment and total data sovereignty without reliance on public APIs.
                    </p>

                    {/* TRUST BADGES */}
                    <div className="flex justify-center gap-6 mb-12 opacity-80 scale-90">
                        {['SOC2 TYPE II', 'ISO 27001', 'FEDRAMP HIGH', 'GDPR READY'].map((badge) => (
                            <div key={badge} className={`
                                px-3 py-1 text-[10px] font-bold tracking-widest border rounded
                                ${isDark ? 'border-gray-700 text-gray-500' : 'border-gray-300 text-gray-400'}
                            `}>
                                {badge}
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                        <button className="px-8 py-4 bg-blue-600 text-white font-bold tracking-widest uppercase text-sm rounded hover:bg-blue-500 transition-all shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:shadow-[0_0_60px_rgba(37,99,235,0.6)] flex items-center group">
                            Start Verification
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={scrollToDocs}
                            className={`px-8 py-4 border font-bold tracking-widest uppercase text-sm rounded transition-all backdrop-blur-sm ${isDark ? 'border-gray-700 hover:bg-white/5 text-gray-300' : 'border-gray-300 hover:bg-black/5 text-gray-700'}`}
                        >
                            View Documentation
                        </button>
                    </div>
                </header>

                {/* INDUSTRIES SECTION (NEW) */}
                <section className="mb-40">
                    <div className="flex items-center space-x-4 mb-12">
                        <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-gray-500">Target Verticals</h2>
                        <div className="h-px flex-grow bg-gray-500/20"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {INDUSTRIES_DATA.map((ind, i) => (
                            <div key={i} className={`group relative p-8 border rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 ${T.cardBg} ${T.cardBorder} hover:border-blue-500/30`}>
                                <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                                <div className="relative z-10">
                                    <div className={`p-3 rounded-lg inline-block mb-6 ${isDark ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                                        <ind.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className={`text-2xl font-bold mb-3 ${T.textMain}`}>{ind.title}</h3>
                                    <p className={`mb-6 leading-relaxed ${T.textMuted}`}>{ind.desc}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {ind.stats.map((stat, j) => (
                                            <span key={j} className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'}`}>
                                                {stat}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* "DEPLOY ANYWHERE" SECTION */}
                <section className="mb-40">
                    <div className="flex flex-col items-center mb-16">
                        <h2 className={`text-4xl font-bold uppercase tracking-tight mb-4 ${T.textMain}`}>Deploy Anywhere</h2>
                        <div className="h-1 w-24 bg-blue-500 mb-6"></div>
                        <p className={`text-center max-w-2xl ${T.textMuted}`}>
                            Our infrastructure-agnostic architecture allows for seamless deployment across 18+ major cloud providers and on-premise environments. Total air-gap compatibility guaranteed.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {PROVIDERS.map((provider, i) => (
                            <div
                                key={i}
                                onClick={() => handleDeploy(provider.name)}
                                className={`
                                    group relative p-6 border rounded-xl cursor-pointer transition-all duration-300 overflow-hidden
                                    ${T.cardBg} ${T.cardBorder} hover:border-blue-500/50 hover:-translate-y-1 hover:shadow-xl
                                `}
                            >
                                <div className="absolute top-3 right-3">
                                    <div className={`w-1.5 h-1.5 rounded-full ${provider.latency.includes('<') ? 'bg-emerald-500' : 'bg-blue-500'} group-hover:animate-ping`}></div>
                                </div>

                                <div className="mb-4 space-y-1">
                                    <h3 className={`font-bold text-lg ${T.textMain}`}>{provider.name}</h3>
                                    <div className={`text-[10px] font-mono ${T.textMuted} uppercase`}>{provider.region}</div>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div className={`text-[10px] font-mono ${T.accent}`}>
                                        PING: {provider.latency}
                                    </div>
                                    <Cloud className={`w-4 h-4 text-gray-500 group-hover:text-blue-500 transition-colors`} />
                                </div>

                                {/* Hover Reveal */}
                                <div className={`absolute inset-0 flex items-center justify-center bg-blue-600/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                                    <span className="text-white font-bold tracking-widest uppercase text-xs flex items-center">
                                        <Zap className="w-4 h-4 mr-2" /> Deploy
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ARCHITECTURE BLUEPRINT (NEW) */}
                <section className="mb-40">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className={`text-4xl font-bold uppercase tracking-tight mb-6 ${T.textMain}`}>The Architecture</h2>
                            <p className={`text-lg mb-8 leading-relaxed ${T.textMuted}`}>
                                Built on a foundation of cryptographic proof and zero-trust verification.
                                The Ason Platform replaces trust with mathematical certainty.
                            </p>

                            <ul className="space-y-6">
                                {[
                                    { title: "Consensus Engine", desc: "Raft/Paxos distributed state machine ensuring 100% data consistency." },
                                    { title: "Immutable Ledger", desc: "Merkle-tree backed audit trail for every system action." },
                                    { title: "Isolation Layer", desc: "Hardware-level separation of concern for secure multi-tenancy." }
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-start">
                                        <div className={`mt-1 mr-4 p-1 rounded-full ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                                            <CheckCircle className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className={`font-bold uppercase text-sm ${T.textMain}`}>{feature.title}</h4>
                                            <p className={`text-sm ${T.textMuted}`}>{feature.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* BLUEPRINT VISUAL */}
                        <div className={`relative aspect-square border rounded-2xl overflow-hidden ${T.cardBorder} p-8 group`}>
                            <div className={`absolute inset-0 pattern-grid-lg opacity-10 ${isDark ? 'text-white' : 'text-black'}`}></div>
                            <div className="relative h-full flex flex-col justify-between">
                                {/* Nodes */}
                                <div className="flex justify-between">
                                    <div className={`w-16 h-16 border rounded flex items-center justify-center ${T.cardBg} ${T.cardBorder}`}>
                                        <Database className="w-6 h-6 text-emerald-500" />
                                    </div>
                                    <div className={`w-16 h-16 border rounded flex items-center justify-center ${T.cardBg} ${T.cardBorder}`}>
                                        <Server className="w-6 h-6 text-purple-500" />
                                    </div>
                                </div>

                                {/* Central Hub */}
                                <div className="self-center relative">
                                    <div className="w-32 h-32 rounded-full border-2 border-dashed border-blue-500/30 flex items-center justify-center animate-spin-slow"></div>
                                    <div className={`absolute inset-0 m-auto w-24 h-24 rounded-full border flex items-center justify-center ${T.cardBg} ${T.cardBorder}`}>
                                        <Shield className="w-8 h-8 text-blue-500" />
                                    </div>
                                </div>

                                {/* Bottom Nodes */}
                                <div className="flex justify-center space-x-12">
                                    <div className={`w-16 h-16 border rounded flex items-center justify-center ${T.cardBg} ${T.cardBorder}`}>
                                        <Terminal className="w-6 h-6 text-amber-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Connecting Lines (Simulated with absolute divs) */}
                            <div className="absolute inset-0 pointer-events-none opacity-20">
                                <svg className="w-full h-full">
                                    <line x1="20%" y1="20%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="2" />
                                    <line x1="80%" y1="20%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="2" />
                                    <line x1="50%" y1="80%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PHILOSOPHY GRID */}
                <section className="mb-32">
                    <div className="flex items-center space-x-4 mb-12">
                        <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-gray-500">Core Philosophy</h2>
                        <div className="h-px flex-grow bg-gray-500/20"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {PHILOSOPHY.map((item, i) => (
                            <div key={i} className={`p-8 border rounded-2xl hover:border-blue-500/30 transition-all duration-500 group ${T.cardBg} ${T.cardBorder}`}>
                                <div className={`p-3 rounded-xl inline-block mb-6 ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                                    <item.icon className="w-8 h-8 text-blue-500" />
                                </div>
                                <h3 className={`text-xl font-bold uppercase tracking-tight mb-2 ${T.textMain}`}>{item.title}</h3>
                                <div className="text-xs font-mono text-blue-500 mb-4 uppercase tracking-wider">{item.subtitle}</div>
                                <p className={`text-sm leading-relaxed ${T.textMuted}`}>
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* TECH SPECS & DOWNLOADS */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* SPECS */}
                    <div>
                        <h3 className={`text-sm font-bold uppercase tracking-widest mb-8 ${T.textMain}`}>System Specifications</h3>
                        <div className={`border rounded-xl overflow-hidden ${T.cardBorder}`}>
                            {[
                                { label: "Architecture", value: "Microservices (Go/Rust)" },
                                { label: "Consensus", value: "Raft / Paxos" },
                                { label: "Encryption", value: "AES-256-GCM + PQ" },
                                { label: "Compliance", value: "FIPS 140-3 / SOC2" },
                                { label: "Uptime SLA", value: "99.9999%" },
                            ].map((stat, i) => (
                                <div key={i} className={`flex justify-between items-center p-4 border-b last:border-0 ${T.cardBorder} ${T.cardBg}`}>
                                    <span className={`text-xs font-mono uppercase ${T.textMuted}`}>{stat.label}</span>
                                    <span className={`font-mono text-sm ${T.textMain}`}>{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* DOWNLOADS */}
                    <div ref={downloadsRef}>
                        <h3 className={`text-sm font-bold uppercase tracking-widest mb-8 ${T.textMain}`}>Technical Resources</h3>
                        <div className="space-y-4">
                            {DOWNLOADS.map((doc, i) => (
                                <div
                                    key={i}
                                    onClick={() => handleDownload(doc.title, doc.id)}
                                    className={`
                                        flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all hover:translate-x-2
                                        ${T.cardBg} ${T.cardBorder} hover:border-blue-500/50 group
                                    `}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className={`p-2 rounded-lg ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                                            <doc.icon className="w-5 h-5 text-gray-500 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                        <div>
                                            <div className={`font-bold text-sm ${T.textMain}`}>{doc.title}</div>
                                            <div className={`text-[10px] font-mono ${T.textMuted}`}>{doc.version} • {doc.type}</div>
                                        </div>
                                    </div>
                                    <Download className={`w-4 h-4 ${T.textMuted} group-hover:text-blue-500 transition-colors`} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CORPORATE FOOTER (NEW) */}
                <footer className={`mt-40 pt-16 pb-8 border-t ${T.border}`}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="md:col-span-1">
                            <div className="flex items-center gap-2 mb-6">
                                <Globe className={`w-6 h-6 ${T.textMuted}`} />
                                <span className={`font-bold tracking-widest ${T.textMain}`}>ASON</span>
                            </div>
                            <p className={`text-xs leading-relaxed ${T.textMuted}`}>
                                The operating system for sovereign data. Built for environments where failure is not an option.
                            </p>
                        </div>

                        <div>
                            <h4 className={`text-xs font-bold uppercase tracking-widest mb-6 ${T.textMain}`}>Platform</h4>
                            <ul className="space-y-4 text-xs">
                                <li><button className={`${T.textMuted} hover:${T.accent} transition-colors uppercase tracking-wide`}>Intelligence</button></li>
                                <li><button className={`${T.textMuted} hover:${T.accent} transition-colors uppercase tracking-wide`}>Foundry</button></li>
                                <li><button className={`${T.textMuted} hover:${T.accent} transition-colors uppercase tracking-wide`}>Apollo</button></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className={`text-xs font-bold uppercase tracking-widest mb-6 ${T.textMain}`}>Legal</h4>
                            <ul className="space-y-4 text-xs">
                                <li><button onClick={() => onNavigate?.('terms')} className={`${T.textMuted} hover:${T.accent} transition-colors uppercase tracking-wide`}>Terms of Service</button></li>
                                <li><button onClick={() => onNavigate?.('privacy')} className={`${T.textMuted} hover:${T.accent} transition-colors uppercase tracking-wide`}>Privacy Policy</button></li>
                                <li><button onClick={() => onNavigate?.('cookies')} className={`${T.textMuted} hover:${T.accent} transition-colors uppercase tracking-wide`}>Cookie Policy</button></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className={`text-xs font-bold uppercase tracking-widest mb-6 ${T.textMain}`}>Contact</h4>
                            <ul className="space-y-4 text-xs">
                                <li className={T.textMuted}>sales@ason.ai</li>
                                <li className={T.textMuted}>press@ason.ai</li>
                                <li className={T.textMuted}>1-888-555-ASON</li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800/50">
                        <p className={`text-[10px] font-mono uppercase tracking-widest ${T.textMuted}`}>
                            © 2026 Ason Project. All Rights Reserved.
                        </p>
                        <div className={`text-[10px] font-mono uppercase tracking-widest ${T.textMuted} mt-4 md:mt-0`}>
                            GENERATED BY ASON PLATFORM // STATUS: GREEN
                        </div>
                    </div>
                </footer>

            </div>
        </div>
    );
}


// Helper icon component for correct lucide import usage in map
import { Download } from 'lucide-react';
