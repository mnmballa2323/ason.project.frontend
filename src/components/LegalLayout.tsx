import React, { ReactNode } from 'react';
import { Shield } from 'lucide-react';

interface LegalLayoutProps {
    children: ReactNode;
    title: string;
    lastUpdated: string;
    theme: 'dark' | 'light';
    onClose: () => void;
}

export const LegalLayout: React.FC<LegalLayoutProps> = ({ children, title, lastUpdated, theme, onClose }) => {
    const isDark = theme === 'dark';

    return (
        <div className={`min-h-screen font-sans ${isDark ? 'bg-[#050505] text-gray-300' : 'bg-gray-50 text-gray-800'}`}>
            {/* Minimal Header */}
            <header className={`h-16 border-b flex items-center justify-between px-8 sticky top-0 backdrop-blur-md z-50
                ${isDark ? 'bg-[#050505]/80 border-gray-800' : 'bg-white/80 border-gray-200'}
            `}>
                <div className="flex items-center gap-3">
                    <Shield className={`w-6 h-6 ${isDark ? 'text-white' : 'text-blue-900'}`} />
                    <span className={`font-bold tracking-widest uppercase text-sm ${isDark ? 'text-white' : 'text-blue-900'}`}>
                        Ason Legal
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded border transition-all
                        ${isDark
                            ? 'border-gray-700 hover:bg-white hover:text-black hover:border-white'
                            : 'border-gray-300 hover:bg-blue-900 hover:text-white hover:border-blue-900'}
                    `}
                >
                    Close
                </button>
            </header>

            {/* Content Container */}
            <div className="max-w-4xl mx-auto py-16 px-8">
                <div className="mb-12 border-l-2 border-blue-500 pl-6">
                    <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {title}
                    </h1>
                    <p className={`text-sm uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        Last Updated: {lastUpdated}
                    </p>
                </div>

                <div className={`prose prose-sm max-w-none ${isDark ? 'prose-invert' : ''}`}>
                    {children}
                </div>
            </div>

            {/* Footer */}
            <footer className={`py-12 border-t text-center text-xs uppercase tracking-widest
                ${isDark ? 'border-gray-800 text-gray-600' : 'border-gray-200 text-gray-400'}
            `}>
                © {new Date().getFullYear()} Ason Verification Platform. All Rights Reserved.
            </footer>
        </div>
    );
};
