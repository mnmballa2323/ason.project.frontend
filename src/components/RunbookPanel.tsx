import React, { useState } from 'react';
import { BookOpen, CheckCircle, AlertTriangle, Play, ChevronRight, ChevronDown, Terminal, Loader2 } from 'lucide-react';

interface RunbookStep {
    id: string;
    text: string;
    command?: string;
    completed: boolean;
}

interface Runbook {
    id: string;
    title: string;
    severity: 'high' | 'medium' | 'low';
    steps: RunbookStep[];
    status: 'idle' | 'running' | 'completed';
}

interface RunbookPanelProps {
    theme: 'dark' | 'light';
    onLog: (msg: string, type: string, severity: 'info' | 'warning' | 'critical' | 'success') => void;
}

export const RunbookPanel: React.FC<RunbookPanelProps> = ({ theme, onLog }) => {
    const isDark = theme === 'dark';
    const [expanded, setExpanded] = useState<string | null>(null);
    const [activeStepId, setActiveStepId] = useState<string | null>(null);
    const [runbooks, setRunbooks] = useState<Runbook[]>([
        {
            id: 'rb-001',
            title: 'ISOLATION PROTOCOL (NODE COMPROMISE)',
            severity: 'high',
            status: 'idle',
            steps: [
                { id: 's1', text: 'Identify compromised node ID via ThreatMap', completed: false },
                { id: 's2', text: 'Sever external uplinks (Kill Switch)', command: 'net isolate --force --target=auto', completed: false },
                { id: 's3', text: 'Snapshot memory for forensics', command: 'mem dump --target=node-X --format=raw', completed: false },
                { id: 's4', text: 'Redeploy clean image from Immutable Ledger', command: 'k8s apply -f /ledger/clean-state.yaml', completed: false },
            ]
        },
        {
            id: 'rb-002',
            title: 'SATELLITE LINK FAILOVER',
            severity: 'medium',
            status: 'idle',
            steps: [
                { id: 's1', text: 'Verify primary fiber loss (Ping Check)', command: 'ping -c 5 gateway.int', completed: false },
                { id: 's2', text: 'Activate Starlink Mesh API', command: 'sat link --enable --constellation=starlink', completed: false },
                { id: 's3', text: 'Re-route encrypted VPN tunnel', command: 'vpn route add --interface=sat0', completed: false },
            ]
        }
    ]);

    const toggleRunbook = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setExpanded(expanded === id ? null : id);
    };

    const runStep = async (rbId: string, stepId: string, command?: string) => {
        if (activeStepId) return; // Prevent concurrent steps

        setActiveStepId(stepId);

        // Find the step text
        const rb = runbooks.find(r => r.id === rbId);
        const step = rb?.steps.find(s => s.id === stepId);

        if (command) {
            onLog(`EXEC: ${command}`, 'CMD', 'info');

            // Simulate execution time
            const delay = 1000 + Math.random() * 2000;
            await new Promise(resolve => setTimeout(resolve, delay));

            if (Math.random() > 0.1) {
                onLog(`SUCCESS: ${step?.text} completed.`, 'SYS', 'success');
            } else {
                onLog(`WARN: Command retried (latency spike)...`, 'WARN', 'warning');
                await new Promise(resolve => setTimeout(resolve, 1000));
                onLog(`SUCCESS: ${step?.text} completed on retry.`, 'SYS', 'success');
            }
        } else {
            onLog(`MANUAL CHECK: ${step?.text} confirmed by operator.`, 'USER', 'info');
        }

        setRunbooks(prev => prev.map(rb => {
            if (rb.id !== rbId) return rb;
            const newSteps = rb.steps.map(s => s.id === stepId ? { ...s, completed: true } : s);
            const allComplete = newSteps.every(s => s.completed);
            return {
                ...rb,
                status: allComplete ? 'completed' : 'running',
                steps: newSteps
            };
        }));

        setActiveStepId(null);
    };

    return (
        <div className={`h-full flex flex-col ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center justify-between">
                <span className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Active Runbooks
                </span>
                {activeStepId && <span className="text-[10px] text-blue-500 animate-pulse">EXECUTING...</span>}
            </h3>

            <div className="space-y-3 overflow-y-auto pr-2">
                {runbooks.map(rb => (
                    <div key={rb.id} className={`border rounded-sm overflow-hidden transition-all ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
                        {/* Header */}
                        <div
                            className={`p-3 flex items-center justify-between cursor-pointer hover:bg-opacity-50 ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                            onClick={(e) => toggleRunbook(rb.id, e)}
                        >
                            <div className="flex items-center space-x-3">
                                {rb.severity === 'high' ? <AlertTriangle className="w-4 h-4 text-red-500" /> : <Terminal className="w-4 h-4 text-blue-500" />}
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold font-mono tracking-tight">{rb.title}</span>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <div className={`h-1 w-12 rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-300'}`}>
                                            <div
                                                className={`h-full transition-all duration-500 ${rb.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                                style={{ width: `${(rb.steps.filter(s => s.completed).length / rb.steps.length) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-[9px] opacity-70 font-mono">
                                            {rb.steps.filter(s => s.completed).length}/{rb.steps.length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {expanded === rb.id ? <ChevronDown className="w-4 h-4 opacity-50" /> : <ChevronRight className="w-4 h-4 opacity-50" />}
                        </div>

                        {/* Expanded Content */}
                        {expanded === rb.id && (
                            <div className={`p-3 border-t text-xs space-y-3 ${isDark ? 'border-gray-800 bg-black/20' : 'border-gray-200 bg-white'}`}>
                                {rb.steps.map((step, i) => (
                                    <div key={step.id} className="flex items-center justify-between group">
                                        <div className={`flex items-center space-x-2 ${step.completed ? 'opacity-50 line-through' : ''}`}>
                                            <span className="font-mono text-gray-500 text-[10px]">{i + 1}</span>
                                            <span>{step.text}</span>
                                        </div>

                                        {!step.completed && (
                                            <button
                                                onClick={() => { void runStep(rb.id, step.id, step.command); }}
                                                disabled={!!activeStepId}
                                                className={`p-1.5 rounded transition-all flex items-center space-x-1
                                                    ${activeStepId === step.id
                                                        ? 'bg-blue-500/20 text-blue-400'
                                                        : step.command
                                                            ? 'hover:bg-blue-500 hover:text-white text-blue-400'
                                                            : 'hover:bg-gray-500 hover:text-white text-gray-400'
                                                    }
                                                    ${(activeStepId && activeStepId !== step.id) ? 'opacity-30 cursor-not-allowed' : ''}
                                                `}
                                                title={step.command ? `Execute: ${step.command}` : 'Mark Done'}
                                            >
                                                {activeStepId === step.id ? (
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                ) : step.command ? (
                                                    <>
                                                        <Terminal className="w-3 h-3 mr-1" />
                                                        <span className="text-[9px] font-mono">RUN</span>
                                                    </>
                                                ) : (
                                                    <CheckCircle className="w-3 h-3" />
                                                )}
                                            </button>
                                        )}
                                        {step.completed && <CheckCircle className="w-3 h-3 text-emerald-500" />}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
