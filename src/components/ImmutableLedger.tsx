import React, { useEffect, useState, useRef } from 'react';
import { Database, Link as LinkIcon, ShieldCheck, FileText, CheckCircle } from 'lucide-react';

interface Block {
    id: number;
    hash: string;
    prevHash: string;
    timestamp: string;
    transactions: number;
    verified: boolean;
}

interface LedgerProps {
    theme: 'dark' | 'light';
}

export const ImmutableLedger: React.FC<LedgerProps> = ({ theme }) => {
    const isDark = theme === 'dark';
    const [blocks, setBlocks] = useState<Block[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    const generateHash = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // Initial Blocks
    useEffect(() => {
        const initialBlocks: Block[] = [
            { id: 1001, hash: '0x' + generateHash(), prevHash: '0x0000000000000000', timestamp: new Date(Date.now() - 10000).toISOString(), transactions: 45, verified: true },
            { id: 1002, hash: '0x' + generateHash(), prevHash: '...', timestamp: new Date(Date.now() - 8000).toISOString(), transactions: 12, verified: true },
            { id: 1003, hash: '0x' + generateHash(), prevHash: '...', timestamp: new Date(Date.now() - 5000).toISOString(), transactions: 8, verified: true },
        ];
        setBlocks(initialBlocks);
    }, []);

    // Simulate New Blocks
    useEffect(() => {
        const interval = setInterval(() => {
            setBlocks(prev => {
                const lastBlock = prev[prev.length - 1];
                const newBlock: Block = {
                    id: lastBlock.id + 1,
                    hash: '0x' + generateHash(),
                    prevHash: lastBlock.hash.substring(0, 10) + '...',
                    timestamp: new Date().toISOString(),
                    transactions: Math.floor(Math.random() * 50) + 1,
                    verified: false
                };

                // Simulate verification delay
                setTimeout(() => {
                    setBlocks(current => current.map(b => b.id === newBlock.id ? { ...b, verified: true } : b));
                }, 1500);

                const updated = [...prev, newBlock];
                if (updated.length > 5) updated.shift(); // Keep list short for visuals
                return updated;
            });
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [blocks]);

    return (
        <div className={`p-6 border rounded-xl overflow-hidden ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold flex items-center text-blue-500">
                        <Database className="w-5 h-5 mr-2" />
                        IMMUTABLE LEDGER
                    </h3>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Cryptographically Verifyable Audit Logs (Merkle Tree)
                    </p>
                </div>
                <div className="flex items-center space-x-2 text-xs font-mono">
                    <span className="text-gray-500">CONSENSUS:</span>
                    <span className="text-emerald-500 font-bold flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        RAFT-LOCKED
                    </span>
                </div>
            </div>

            <div className="space-y-4">
                {blocks.map((block, i) => (
                    <div key={block.id} className="relative">
                        {/* Connecting Line */}
                        {i > 0 && (
                            <div className={`absolute left-6 -top-4 h-4 w-0.5 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                        )}

                        <div className={`p-3 rounded-lg border flex items-center justify-between transition-all duration-500
                            ${block.verified
                                ? (isDark ? 'bg-black/40 border-gray-700' : 'bg-gray-50 border-gray-200')
                                : 'bg-blue-500/10 border-blue-500/50 animate-pulse'}
                        `}>
                            <div className="flex items-center space-x-4">
                                <div className={`p-2 rounded ${block.verified ? 'bg-gray-800 text-gray-400' : 'bg-blue-500 text-white'}`}>
                                    <LinkIcon className="w-4 h-4" />
                                </div>
                                <div className="font-mono text-xs">
                                    <div className="flex items-center space-x-2">
                                        <span className={`font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                                            BLOCK #{block.id}
                                        </span>
                                        <span className="text-gray-500 text-[10px]">{block.timestamp.split('T')[1].substring(0, 8)}</span>
                                    </div>
                                    <div className="text-[10px] text-gray-500 mt-1 flex items-center space-x-2">
                                        <span>HASH: {block.hash.substring(0, 16)}...</span>
                                        <span className="text-gray-600">PREV: {block.prevHash}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="flex items-center justify-end space-x-1 mb-1">
                                    <FileText className="w-3 h-3 text-gray-500" />
                                    <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{block.transactions}</span>
                                </div>
                                {block.verified ? (
                                    <div className="text-[10px] text-emerald-500 font-bold flex items-center justify-end">
                                        <ShieldCheck className="w-3 h-3 mr-1" /> VERIFIED
                                    </div>
                                ) : (
                                    <div className="text-[10px] text-blue-400 font-bold flex items-center justify-end">
                                        SIGNING...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
