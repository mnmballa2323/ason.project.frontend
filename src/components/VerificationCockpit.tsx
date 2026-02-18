import React, { useState } from 'react';
import { DecisionGraph } from './DecisionGraph';

interface VerificationCockpitProps {
    theme?: 'dark' | 'light';
}

export const VerificationCockpit: React.FC<VerificationCockpitProps> = ({ theme = 'dark' }) => {
    const [selectedNode, setSelectedNode] = useState<any>(null);
    const isDark = theme === 'dark';

    // Theme Config
    const T = {
        bg: isDark ? "bg-[#050505]" : "bg-gray-50",
        panelBg: isDark ? "bg-[#0a0a0a]" : "bg-white",
        panelBorder: isDark ? "border-gray-800" : "border-gray-200",
        headerBg: isDark ? "bg-[#111]" : "bg-gray-100",
        textMain: isDark ? "text-gray-100" : "text-gray-900",
        textMuted: isDark ? "text-gray-400" : "text-gray-500",
        accent: "text-blue-500",
        divider: isDark ? "border-gray-800" : "border-gray-200",
        codeBlock: isDark ? "bg-black/50 text-green-400 border-green-900/30" : "bg-gray-100/50 text-blue-700 border-blue-100",
        highlight: isDark ? "bg-yellow-900/30 text-yellow-200 border-yellow-700/50" : "bg-yellow-50 text-yellow-800 border-yellow-200",
    };

    return (
        <div className={`flex h-full w-full transition-colors duration-500 ${T.bg}`}>

            {/* LEFT PANEL: EVIDENCE */}
            <div className={`w-1/4 border-r flex flex-col shadow-xl z-20 transition-colors duration-500 ${T.panelBg} ${T.panelBorder}`}>
                <div className={`p-3 text-[10px] font-bold uppercase tracking-widest flex justify-between items-center ${T.headerBg} ${T.textMuted}`}>
                    <span>Source Intelligence</span>
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">2 ACTIVE</span>
                </div>

                <div className={`flex-1 overflow-auto p-4 text-xs font-mono leading-relaxed scrollbar-thin ${T.textMuted}`}>
                    {/* DOC 1 */}
                    <div className="mb-8">
                        <h3 className="text-blue-500 mb-3 flex items-center font-bold tracking-wider uppercase">
                            <span className="mr-2 opacity-50">📂</span> ISO-26262-Part6.pdf
                        </h3>
                        <div className={`pl-4 border-l-2 space-y-3 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                            <p className="opacity-40 hover:opacity-100 transition-opacity cursor-pointer">...section 4.2.1 General Requirements...</p>
                            <div
                                className={`p-3 rounded border-l-2 transition-all duration-300 cursor-pointer ${selectedNode?.type === 'evidence'
                                    ? T.highlight + " border-l-4"
                                    : "opacity-60 hover:opacity-100 hover:bg-gray-500/5"
                                    }`}
                            >
                                <div className="text-[9px] uppercase tracking-widest opacity-50 mb-1">REQ-2024-882</div>
                                "The battery interaction system must maintain galvanic isolation between high-voltage and low-voltage domains."
                            </div>
                            <p className="opacity-40">...section 4.2.2 Fault Tolerance...</p>
                        </div>
                    </div>

                    {/* DOC 2 */}
                    <div>
                        <h3 className="text-blue-500 mb-3 flex items-center font-bold tracking-wider uppercase">
                            <span className="mr-2 opacity-50">📂</span> HW_Spec_v2.docx
                        </h3>
                        <div className={`pl-4 border-l-2 space-y-3 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                            <p className="opacity-40">...Table 3.1 Operating Conditions...</p>
                            <div className="p-2 border border-dashed border-gray-500/30 rounded bg-gray-500/5 flex justify-between">
                                <span>Max Temp</span>
                                <span className="font-bold">82°C</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CENTER PANEL: GRAPH */}
            <div className={`w-1/2 flex flex-col relative transition-colors duration-500 ${isDark ? 'bg-[#050505]' : 'bg-gray-100'}`}>
                {/* TOOLBAR */}
                <div className="absolute top-4 left-4 z-10 flex items-center space-x-3">
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 text-[10px] rounded-sm uppercase tracking-widest font-bold shadow-lg shadow-blue-500/20 transition-all">
                        Run Verification
                    </button>
                    <div className={`px-3 py-1.5 rounded-sm border text-[10px] font-mono uppercase tracking-widest flex items-center space-x-2 backdrop-blur-sm ${isDark ? 'bg-black/50 border-gray-700 text-gray-400' : 'bg-white/50 border-gray-300 text-gray-600'
                        }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        <span>Model: Ason-72B-Instruct</span>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden">
                    <DecisionGraph onNodeSelect={setSelectedNode} theme={theme} />
                </div>
            </div>

            {/* RIGHT PANEL: INSPECTOR */}
            <div className={`w-1/4 border-l flex flex-col transition-colors duration-500 ${T.panelBg} ${T.panelBorder}`}>
                <div className={`p-3 text-[10px] font-bold uppercase tracking-widest ${T.headerBg} ${T.textMuted}`}>
                    Node Inspector
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                    {selectedNode ? (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            {/* HEADER */}
                            <div>
                                <div className={`text-[9px] uppercase tracking-[0.2em] mb-1 ${T.textMuted}`}>Entity Type</div>
                                <div className={`text-xl font-bold uppercase ${T.textMain}`}>{selectedNode.type}</div>
                            </div>

                            {/* CONTENT CARD */}
                            <div className={`p-4 rounded border ${T.codeBlock} ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                                <div className="text-[9px] uppercase tracking-widest mb-2 opacity-50">Content Payload</div>
                                <div className="font-mono text-xs leading-relaxed">
                                    {selectedNode.label}
                                </div>
                            </div>

                            {/* REASONING METRICS */}
                            {selectedNode.type === 'reasoning' && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className={`text-[10px] uppercase tracking-widest ${T.textMuted}`}>Confidence Score</span>
                                        <span className={`text-xl font-light ${T.textMain}`}>{(selectedNode.confidence * 100).toFixed(1)}%</span>
                                    </div>

                                    {/* COUNCIL VISUALIZATION */}
                                    <div className={`p-3 rounded border space-y-2 ${isDark ? 'bg-black/30 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                                        <div className={`text-[9px] uppercase tracking-widest flex justify-between ${T.textMuted}`}>
                                            <span>Consensus Mechanism</span>
                                            <span className={selectedNode.confidence > 0.66 ? "text-green-500" : "text-red-500"}>
                                                {selectedNode.confidence > 0.66 ? "VERIFIED" : "REJECTED"}
                                            </span>
                                        </div>
                                        <div className="flex gap-0.5 h-1.5">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className={`flex-1 rounded-sm transition-all duration-500 ${selectedNode.confidence > 0.66 ? "bg-green-500" :
                                                    (i === 3 ? "bg-red-500" : "bg-green-500")
                                                    } ${i === 3 && selectedNode.confidence <= 0.66 ? 'animate-pulse' : ''}`}></div>
                                            ))}
                                        </div>
                                        <div className="flex justify-between text-[8px] uppercase tracking-widest text-gray-500">
                                            <span>Safety</span>
                                            <span>QA</span>
                                            <span>Compliance</span>
                                        </div>
                                    </div>

                                    {selectedNode.evidence && (
                                        <div className="text-[10px]">
                                            <span className={`uppercase tracking-widest ${T.textMuted}`}>Linked Evidence: </span>
                                            <span className="text-blue-500 underline cursor-pointer">DOC-A-SEC-4</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={`flex flex-col items-center justify-center h-full text-center p-8 opacity-40 ${T.textMuted}`}>
                            <div className="text-4xl mb-4">🔭</div>
                            <div className="text-sm font-mono uppercase tracking-widest">Awaiting Selection</div>
                            <div className="text-[10px] mt-2 max-w-[150px]">Select a node from the decision graph to inspect logic.</div>
                        </div>
                    )}
                </div>

                {/* ACTION FOOTER */}
                <div className={`p-4 border-t flex space-x-3 ${T.panelBorder} ${T.panelBg}`}>
                    <button className="flex-1 py-3 bg-red-900/10 border border-red-900/30 text-red-500 hover:bg-red-900/20 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all">
                        Reject
                    </button>
                    <button className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm shadow-[0_0_10px_rgba(22,163,74,0.3)] transition-all">
                        Sign Off
                    </button>
                </div>
            </div>
        </div>
    );
};
