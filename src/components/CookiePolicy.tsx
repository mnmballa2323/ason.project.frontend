import React from 'react';
import { LegalLayout } from './LegalLayout';

interface Props {
    theme: 'dark' | 'light';
    onClose: () => void;
}

export const CookiePolicy: React.FC<Props> = ({ theme, onClose }) => {
    return (
        <LegalLayout title="Cookie Policy" lastUpdated="February 18, 2026" theme={theme} onClose={onClose}>
            <section className="mb-8">
                <h3 className="text-lg font-bold mb-4 uppercase tracking-widest">1. Strict Necessity Only</h3>
                <p className="mb-4">
                    The Ason Verification Platform uses a single category of cookies: <strong>Strictly Necessary</strong>.
                </p>
                <p className="mb-4">
                    We do not use tracking cookies, advertising pixels, or analytics scripts. The integrity of the decision-making environment requires total isolation from the "Ad Tech" ecosystem.
                </p>
            </section>

            <section className="mb-8">
                <h3 className="text-lg font-bold mb-4 uppercase tracking-widest">2. Cookies We Set</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-xs text-left">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="py-2 pr-4 font-bold">Name</th>
                                <th className="py-2 pr-4 font-bold">Purpose</th>
                                <th className="py-2 pr-4 font-bold">Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-800/20">
                                <td className="py-2 font-mono text-blue-500">ason_session</td>
                                <td className="py-2">Maintains cryptographic session state for your active login.</td>
                                <td className="py-2">Session (Cleared on close)</td>
                            </tr>
                            <tr className="border-b border-gray-800/20">
                                <td className="py-2 font-mono text-blue-500">ason_theme</td>
                                <td className="py-2">Stores your UI preference (Dark/Light).</td>
                                <td className="py-2">Persistent (1 year)</td>
                            </tr>
                            <tr className="border-b border-gray-800/20">
                                <td className="py-2 font-mono text-blue-500">ason_consent</td>
                                <td className="py-2">Records that you accepted this policy.</td>
                                <td className="py-2">Persistent (1 year)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="mb-8">
                <h3 className="text-lg font-bold mb-4 uppercase tracking-widest">3. Local Storage</h3>
                <p className="mb-4">
                    We utilize browser <code>localStorage</code> to cache non-sensitive interface states (e.g., "Mute Sound", "Last Viewed Dashboard") to improve performance. No PII (Personally Identifiable Information) is ever committed to Local Storage.
                </p>
            </section>
        </LegalLayout>
    );
};
