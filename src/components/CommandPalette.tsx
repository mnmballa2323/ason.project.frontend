import React, { useState, useEffect, useRef } from 'react';
import { Search, Command, ArrowRight, Zap, Layout, Shield, Globe, Terminal } from 'lucide-react';
import { notify } from '../utils/notify';

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (view: any) => void;
    onToggleTheme: () => void;
    theme: 'dark' | 'light';
}

interface CommandAction {
    id: string;
    label: string;
    shortcut?: string;
    icon: React.ElementType;
    section: 'Navigation' | 'System' | 'Tools';
    action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate, onToggleTheme, theme }) => {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const isDark = theme === 'dark';

    const ACTIONS: CommandAction[] = [
        { id: 'nav-dash', label: 'Go to Dashboard', icon: Layout, section: 'Navigation', action: () => onNavigate('dashboard') },
        { id: 'nav-ind', label: 'Go to Industries', icon: Globe, section: 'Navigation', action: () => onNavigate('industries') },
        { id: 'nav-audit', label: 'Go to Audit Logs', icon: Shield, section: 'Navigation', action: () => onNavigate('audit') },
        { id: 'nav-about', label: 'Go to About / Landing', icon: Terminal, section: 'Navigation', action: () => onNavigate('about') },
        { id: 'sys-theme', label: 'Toggle Dark/Light Mode', icon: Zap, section: 'System', shortcut: '⌘T', action: onToggleTheme },
        { id: 'sys-sync', label: 'Force System Sync', icon: Zap, section: 'System', action: () => notify("SYNC INITIATED", "Synchronizing all nodes...", "info") },
        { id: 'sys-export', label: 'Export System Logs', icon: Terminal, section: 'Tools', action: () => notify("EXPORT", "Logs exported to local drive.", "success") },
    ];

    const filteredActions = ACTIONS.filter(a => a.label.toLowerCase().includes(query.toLowerCase()));

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % filteredActions.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + filteredActions.length) % filteredActions.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredActions[selectedIndex]) {
                    filteredActions[selectedIndex].action();
                    onClose();
                }
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, filteredActions, selectedIndex, onClose]);

    if (!isOpen) return null;

    // Theme Styles
    const T = {
        overlay: isDark ? "bg-black/60 backdrop-blur-sm" : "bg-white/60 backdrop-blur-sm",
        modalBg: isDark ? "bg-[#111] border-gray-800" : "bg-white border-gray-200",
        textMain: isDark ? "text-gray-100" : "text-gray-900",
        textMuted: isDark ? "text-gray-500" : "text-gray-500",
        border: isDark ? "border-gray-800" : "border-gray-200",
        highlight: isDark ? "bg-blue-600/20 text-blue-400 border-l-2 border-blue-500" : "bg-blue-50 text-blue-600 border-l-2 border-blue-500",
        iconDefault: isDark ? "text-gray-500" : "text-gray-400",
        iconDetail: isDark ? "bg-gray-800" : "bg-gray-100",
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-start justify-center pt-[15vh] ${T.overlay}`} onClick={onClose}>
            <div
                className={`w-[600px] max-w-[90vw] rounded-xl shadow-2xl border overflow-hidden flex flex-col transform transition-all animate-in fade-in zoom-in-95 duration-200 ${T.modalBg}`}
                onClick={e => e.stopPropagation()}
            >
                {/* Search Header */}
                <div className={`flex items-center px-4 py-3 border-b ${T.border}`}>
                    <Search className={`w-5 h-5 mr-3 ${T.textMuted}`} />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Type a command or search..."
                        className={`flex-grow bg-transparent outline-none text-lg font-light ${T.textMain} placeholder-gray-500`}
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    <div className={`text-xs font-mono px-2 py-1 rounded border ${isDark ? 'border-gray-700 bg-gray-900 text-gray-500' : 'border-gray-200 bg-gray-100 text-gray-400'}`}>
                        ESC
                    </div>
                </div>

                {/* Results List */}
                <div className="max-h-[60vh] overflow-y-auto py-2">
                    {filteredActions.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm">No commands found.</div>
                    ) : (
                        filteredActions.map((action, i) => (
                            <div
                                key={action.id}
                                onClick={() => { action.action(); onClose(); }}
                                className={`
                                    px-4 py-3 cursor-pointer flex items-center justify-between group transition-colors
                                    ${i === selectedIndex ? T.highlight : `text-gray-500 hover:${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
                                `}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className={`p-1.5 rounded ${i === selectedIndex ? 'bg-blue-500 text-white' : `${T.iconDetail} ${T.iconDefault}`}`}>
                                        <action.icon className="w-4 h-4" />
                                    </div>
                                    <span className={`font-medium ${i === selectedIndex ? (isDark ? 'text-blue-100' : 'text-blue-900') : T.textMain}`}>
                                        {action.label}
                                    </span>
                                </div>

                                {action.shortcut && (
                                    <span className={`text-xs font-mono opacity-50 ${T.textMuted}`}>
                                        {action.shortcut}
                                    </span>
                                )}
                                {!action.shortcut && i === selectedIndex && (
                                    <ArrowRight className="w-4 h-4 opacity-50" />
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className={`px-4 py-2 border-t text-[10px] flex justify-between ${T.border} ${isDark ? 'bg-gray-900/50 text-gray-600' : 'bg-gray-50 text-gray-400'}`}>
                    <span><strong className={T.textMuted}>↑↓</strong> to navigate</span>
                    <span><strong className={T.textMuted}>Enter</strong> to select</span>
                </div>
            </div>
        </div>
    );
};
