import React from 'react';
import { LegalLayout } from './LegalLayout';

interface Props {
    theme: 'dark' | 'light';
    onClose: () => void;
}

export const PrivacyPolicy: React.FC<Props> = ({ theme, onClose }) => {
    return (
        <LegalLayout title="Privacy Policy" lastUpdated="February 18, 2026" theme={theme} onClose={onClose}>
            <section className="mb-8">
                <h3 className="text-lg font-bold mb-4 uppercase tracking-widest">Zero-Data Retention Manifesto</h3>
                <p className="mb-4 font-bold">
                    We do not want your data. We do not need your data. We physically cannot access your data.
                </p>
                <p className="mb-4">
                    The Ason Verification Platform is architected on a "Sovereign-First" principle. Unlike traditional SaaS providers, we do not host a central control plane. Your instance is entirely yours.
                </p>
            </section>

            <section className="mb-8">
                <h3 className="text-lg font-bold mb-4 uppercase tracking-widest">1. Data Collection</h3>
                <p className="mb-4">
                    The Platform collects 0% of user data for external processing. All processing occurs locally on your infrastructure (On-Premise or Sovereign Cloud VPC).
                </p>
                <p className="mb-4">
                    Local logs are generated for audit purposes ("Immutable Ledger"), but these logs are cryptographically sealed and remain strictly within your environment.
                </p>
            </section>

            <section className="mb-8">
                <h3 className="text-lg font-bold mb-4 uppercase tracking-widest">2. Biometric Processing</h3>
                <p className="mb-4">
                    The "Particle Login" system uses behavioral entropy and simulated biometric handshakes. This data is:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Hashed immediately upon capture using SHA-3-512.</li>
                    <li>Compared against local stored hashes.</li>
                    <li>Discarded from memory immediately after verification.</li>
                    <li>Never transmitted over a network.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h3 className="text-lg font-bold mb-4 uppercase tracking-widest">3. Third-Party Subprocessors</h3>
                <p className="mb-4">
                    None. The Platform operates without external dependencies.
                </p>
            </section>

            <section className="mb-8">
                <h3 className="text-lg font-bold mb-4 uppercase tracking-widest">4. Government Requests</h3>
                <p className="mb-4">
                    Since Ason Inc. possesses no access keys, backdoors, or telemetry uplinks to your instance, we are technically unable to comply with subpoenas or warrants requesting your data. Any such requests must be directed to you, the Sovereign Operator.
                </p>
            </section>
        </LegalLayout>
    );
};
