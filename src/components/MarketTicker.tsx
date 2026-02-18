import React, { useEffect, useState, useRef } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface TickerItemProps {
    symbol: string;
    price: string;
    change: number;
}

const TickerItem: React.FC<TickerItemProps> = ({ symbol, price, change }) => (
    <div className="flex items-center space-x-3 px-6 border-r border-gray-700/50 min-w-[200px]">
        <span className="font-bold text-sm tracking-wider">{symbol}</span>
        <span className="font-mono text-xs text-gray-400">{price}</span>
        <div className={`flex items-center space-x-1 text-xs font-bold ${change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{Math.abs(change).toFixed(2)}%</span>
        </div>
    </div>
);

export const MarketTicker: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
    const [offset, setOffset] = useState(0);
    const requestRef = useRef<number>();

    // Mock Data mimicking S&P500 / NASDAQ-100 Components + Indices
    const TICKER_DATA = [
        { symbol: "S&P 500", price: "5,245.12", change: 0.45 },
        { symbol: "NASDAQ", price: "16,428.30", change: 0.82 },
        { symbol: "AAPL", price: "178.23", change: -0.12 },
        { symbol: "MSFT", price: "428.74", change: 1.23 },
        { symbol: "GOOGL", price: "172.55", change: 0.55 },
        { symbol: "AMZN", price: "185.10", change: 0.95 },
        { symbol: "TSLA", price: "178.90", change: -1.45 },
        { symbol: "NVDA", price: "950.02", change: 2.10 },
        { symbol: "VIX", price: "13.45", change: -2.30 },
        { symbol: "BRK.B", price: "412.50", change: 0.15 },
        { symbol: "JPM", price: "198.80", change: 0.65 },
        { symbol: "UNH", price: "485.20", change: -0.35 },
    ];

    // Animation Loop
    const animate = () => {
        setOffset(prev => {
            const newOffset = prev - 0.5; // Speed
            // Reset when first set of items is fully off-screen (approx width calculation)
            // Simplified: Reset at arbitrary large negative number for endless feel, better impl checks width
            return newOffset < -2000 ? 0 : newOffset;
        });
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current!);
    }, []);

    const isDark = theme === 'dark';

    return (
        <div className={`
            w-full h-10 overflow-hidden flex items-center border-b select-none relative z-50
            ${isDark ? 'bg-[#050505] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'}
        `}>
            {/* Static Label */}
            <div className={`
                absolute left-0 h-full px-4 flex items-center z-10 font-bold text-[10px] uppercase tracking-widest shadow-xl
                ${isDark ? 'bg-[#050505] text-blue-500' : 'bg-white text-blue-600'}
            `}>
                <Activity className="w-3 h-3 mr-2 animate-pulse" />
                Market Pulse
            </div>

            {/* Scrolling Content */}
            <div
                className="flex items-center whitespace-nowrap pl-32 will-change-transform"
                style={{ transform: `translateX(${offset}px)` }}
            >
                {[...TICKER_DATA, ...TICKER_DATA, ...TICKER_DATA].map((item, i) => (
                    <TickerItem key={i} {...item} />
                ))}
            </div>

            {/* Gradient Fade Right */}
            <div className={`
                absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none
                bg-gradient-to-l ${isDark ? 'from-[#050505] to-transparent' : 'from-white to-transparent'}
            `}></div>
        </div>
    );
};
