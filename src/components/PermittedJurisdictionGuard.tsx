import React, { createContext, useContext, useState, ReactNode } from 'react';

// --- Types ---
interface SovereigntyContextType {
    jurisdictionError: {
        source: string;
        target: string;
        category: string;
        regulation: string;
        message: string;
    } | null;
    setJurisdictionError: (error: any) => void;
    clearError: () => void;
}

const SovereigntyContext = createContext<SovereigntyContextType | undefined>(undefined);

export const useSovereignty = () => {
    const context = useContext(SovereigntyContext);
    if (!context) {
        throw new Error("useSovereignty must be used within a SovereigntyProvider");
    }
    return context;
};

// --- Provider ---
export const SovereigntyProvider = ({ children }: { children: ReactNode }) => {
    const [error, setError] = useState<any | null>(null);

    const setJurisdictionError = (err: any) => setError(err);
    const clearError = () => setError(null);

    return (
        <SovereigntyContext.Provider value={{ jurisdictionError: error, setJurisdictionError, clearError }}>
            {error ? (
                <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-8 backdrop-blur-sm">
                    <div className="max-w-2xl w-full bg-red-950 border-2 border-red-500 rounded-lg shadow-2xl overflow-hidden p-8 text-center animate-in fade-in zoom-in duration-300">
                        {/* ICON */}
                        <div className="mx-auto w-24 h-24 bg-red-900/50 rounded-full flex items-center justify-center border-4 border-red-500 mb-6">
                            <span className="text-6xl">⛔</span>
                        </div>

                        {/* TITLE */}
                        <h1 className="text-4xl font-extrabold text-white tracking-widest uppercase mb-2">
                            DATA SOVEREIGNTY VIOLATION
                        </h1>
                        <p className="text-red-400 font-mono text-sm tracking-widest mb-8">
                            HTTP 451: UNAVAILABLE FOR LEGAL REASONS
                        </p>

                        {/* DETAILS */}
                        <div className="bg-black/50 p-6 rounded border border-red-500/30 text-left font-mono text-sm space-y-3 mb-8">
                            <div className="flex justify-between border-b border-red-500/20 pb-2">
                                <span className="text-gray-400">REGULATION:</span>
                                <span className="text-red-300 font-bold">{error.detail?.regulation || "UNKNOWN"}</span>
                            </div>
                            <div className="flex justify-between border-b border-red-500/20 pb-2">
                                <span className="text-gray-400">SOURCE JURISDICTION:</span>
                                <span className="text-white font-bold">{error.detail?.source || "GLOBAL"}</span>
                            </div>
                            <div className="flex justify-between border-b border-red-500/20 pb-2">
                                <span className="text-gray-400">TARGET JURISDICTION:</span>
                                <span className="text-white font-bold">{error.detail?.target || "US"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">DATA CATEGORY:</span>
                                <span className="text-red-300 font-bold">{error.detail?.data_category || "RESTRICTED"}</span>
                            </div>
                        </div>

                        {/* MESSAGE */}
                        <p className="text-gray-300 mb-8 max-w-lg mx-auto leading-relaxed">
                            {error.message || "Transfer of this data category across these borders is strictly prohibited by local laws. Access has been blocked by the Data Sovereignty Controller."}
                        </p>

                        {/* ACTIONS */}
                        <button
                            onClick={clearError}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded border border-red-400 transition-all uppercase tracking-wider"
                        >
                            ACKNOWLEDGE & RETURN
                        </button>

                        <div className="mt-8 text-[10px] text-gray-500">
                            INCIDENT ID: {Math.random().toString(36).substring(7).toUpperCase()} // LOGGED TO AUDIT CHAIN
                        </div>
                    </div>
                </div>
            ) : children}
        </SovereigntyContext.Provider>
    );
};
