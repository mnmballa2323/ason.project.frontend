import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useSound } from './utils/SoundContext';
import { CommandPalette } from './components/CommandPalette';
import { SystemToast } from './components/SystemToast';
import { StatusBar } from './components/StatusBar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SovereigntyProvider } from './utils/SovereigntyContext';
import { DEPLOYMENT_CONFIG } from './constants';
import { CinematicBoot } from './components/CinematicBoot';
import { ParticleLogin } from './components/ParticleLogin';

// Lazy Load Route Components
const Industries = lazy(() => import('./components/Industries').then(module => ({ default: module.Industries })));
const AuditDashboard = lazy(() => import('./components/AuditDashboard').then(module => ({ default: module.AuditDashboard })));
const About = lazy(() => import('./components/About').then(module => ({ default: module.About })));
const VerificationCockpit = lazy(() => import('./components/VerificationCockpit').then(module => ({ default: module.VerificationCockpit })));
const OwnerDashboard = lazy(() => import('./components/OwnerDashboard').then(module => ({ default: module.OwnerDashboard })));
const AdminPanel = lazy(() => import('./components/AdminPanel').then(module => ({ default: module.AdminPanel })));
const TermsOfService = lazy(() => import('./components/TermsOfService').then(module => ({ default: module.TermsOfService })));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy').then(module => ({ default: module.PrivacyPolicy })));
const CookiePolicy = lazy(() => import('./components/CookiePolicy').then(module => ({ default: module.CookiePolicy })));

type AppView = 'dashboard' | 'industries' | 'audit' | 'governance' | 'about' | 'terms' | 'privacy' | 'cookies';
type UserRole = 'user' | 'admin' | 'owner';
type Theme = 'dark' | 'light';

function AppContent() {
    const ctx = DEPLOYMENT_CONFIG;
    const [currentRole, setCurrentRole] = useState<UserRole>('user');
    const [currentView, setCurrentView] = useState<AppView>('dashboard');
    const [theme, setTheme] = useState<Theme>('dark');
    const [showPalette, setShowPalette] = useState(false);

    // ... (rest of state items are unchanged)

    // ... (render logic)

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-blue-500/30">
            {/* MAIN CONTENT AREA */}
            <main className="h-[calc(100vh-80px)] relative"> {/* Adjusted height for StatusBar */}
                <div className="absolute inset-0 transition-opacity duration-300 animate-in fade-in">
                    <Suspense fallback={
                        <div className="w-full h-full flex items-center justify-center">
                            <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-lg shadow-lg
                        ${theme === 'dark' ? `bg-${ctx.color}-600 text-white` : `bg-${ctx.color}-500 text-white`}
                    `}>A</div>
                            <div className="text-xs font-mono animate-pulse text-blue-500 ml-2">
                                /// INITIALIZING MODULE ///
                            </div>
                        </div>
                    }>
                        {currentView === 'industries' ? (
                            <Industries theme={theme} />
                        ) : currentView === 'audit' ? (
                            <AuditDashboard theme={theme} />
                        ) : currentView === 'about' ? (
                            <About theme={theme} onNavigate={setCurrentView} />
                        ) : currentView === 'terms' ? (
                            <TermsOfService theme={theme} onClose={() => setCurrentView('about')} />
                        ) : currentView === 'privacy' ? (
                            <PrivacyPolicy theme={theme} onClose={() => setCurrentView('about')} />
                        ) : currentView === 'cookies' ? (
                            <CookiePolicy theme={theme} onClose={() => setCurrentView('about')} />
                        ) : (
                            <SovereigntyProvider>
                                {currentRole === 'user' && <VerificationCockpit theme={theme} />}
                                {currentRole === 'owner' && <OwnerDashboard theme={theme} />}
                                {currentRole === 'admin' && <AdminPanel theme={theme} isLockdown={isLockdown} onLockdown={() => setLockdown(true)} />}
                            </SovereigntyProvider>
                        )}
                    </Suspense>
                </div>
            </main>

            {/* GLOBAL STATUS BAR */}
            <StatusBar theme={theme} />
        </div >
    );
}

// ...

function App() {
    return (
        <SoundProvider>
            <ErrorBoundary fallbackTitle="System Critical Failure">
                <AppContent />
            </ErrorBoundary>
        </SoundProvider>
    );
}

export default App;
