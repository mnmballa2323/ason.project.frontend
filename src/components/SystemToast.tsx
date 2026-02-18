import React, { useState, useEffect } from 'react';
import { NotifyPayload } from '../utils/notify';

export const SystemToast: React.FC = () => {
    const [notifications, setNotifications] = useState<NotifyPayload[]>([]);

    useEffect(() => {
        const handler = (e: Event) => {
            const customEvent = e as CustomEvent<NotifyPayload>;
            const newNotif = customEvent.detail;
            setNotifications(prev => [...prev, newNotif]);

            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n !== newNotif));
            }, newNotif.duration || 3000);
        };

        window.addEventListener('sys-notification', handler);
        return () => window.removeEventListener('sys-notification', handler);
    }, []);

    if (notifications.length === 0) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
            {notifications.map((n, i) => (
                <div key={i} className={`
                    pointer-events-auto
                    min-w-[300px] p-4 rounded border-l-4 shadow-2xl backdrop-blur-md
                    animate-in slide-in-from-right fade-in duration-300
                    ${n.type === 'error' ? 'bg-red-950/90 border-red-500 text-red-100' :
                        n.type === 'success' ? 'bg-emerald-950/90 border-emerald-500 text-emerald-100' :
                            n.type === 'warning' ? 'bg-amber-950/90 border-amber-500 text-amber-100' :
                                'bg-slate-900/90 border-blue-500 text-blue-100'}
                `}>
                    <div className="flex justify-between items-start">
                        <div className="font-bold font-mono text-sm uppercase tracking-wider mb-1">
                            {n.type === 'error' ? '⚠️ SYSTEM ALERT' :
                                n.type === 'success' ? '✅ SUCCESS' :
                                    n.type === 'warning' ? '⚡ WARNING' :
                                        'ℹ️ SYSTEM INFO'}
                        </div>
                        <div className="text-[10px] opacity-50 font-mono">{new Date().toLocaleTimeString()}</div>
                    </div>
                    <div className="font-bold text-lg mb-1">{n.title}</div>
                    <div className="text-xs font-mono opacity-80">{n.message}</div>
                </div>
            ))}
        </div>
    );
};
