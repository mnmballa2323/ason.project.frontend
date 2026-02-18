import React from 'react';
import { LegalLayout } from './LegalLayout';

interface Props {
    theme: 'dark' | 'light';
    onClose: () => void;
}

export const TermsOfService: React.FC<Props> = ({ theme, onClose }) => {
    return (
        <LegalLayout title="Terms of Service" lastUpdated="February 18, 2026" theme={theme} onClose={onClose}>
            <section className="mb-8">
                <h3 className="text-lg font-bold mb-4 uppercase tracking-widest">1. Acceptance of Terms</h3>
                <p className="mb-4">
                    By accessing and using the Ason Verification Platform ("the Platform"), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. This Platform is intended solely for authorized enterprise use and requires strict adherence to security protocols.
                </p>
            </section>

            <section className="mb-8">
                <h3 className="text-lg font-bold mb-4 uppercase tracking-widest">2. Sovereignty & Data Residency</h3>
                <p className="mb-4">
                    The Platform is engineered for absolute data sovereignty. You acknowledge that:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Data processed within a specific jurisdiction (e.g., "Sovereign Enclave") will strictly remain within that physical boundary.</li>
                    <li>No telemetry, logs, or metadata will egress to external servers without explicit administrative override (Protocol Omega).</li>
                    <li>You are responsible for maintaining the physical security of the air-gapped infrastructure where the Platform is deployed.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h3 className="text-lg font-bold mb-4 uppercase tracking-widest">3. Acceptable Use</h3>
                <p className="mb-4">
                    You agree strictly NOT to:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Attempt to bypass the "Zero-Trust" authentication layer using synthetic biometrics.</li>
                    <li>Tamper with the Immutable Ledger or attempt to fork the audit chain.</li>
                    <li>Connect unauthorized satellite uplinks to the Sovereign Globe visualization module.</li>
                    <li>Reverse engineer the Quantum Vault encryption lattice.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h3 className="text-lg font-bold mb-4 uppercase tracking-widest">4. Protocol Omega (Emergency Lockdown)</h3>
                <p className="mb-4">
                    In the event of a detected physical breach or cyber-kinetic attack, the Platform may autonomously initiate "Protocol Omega." This state:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Severs all external network connections immediately.</li>
                    <li>Encrypts all data at rest with emergency 4096-bit keys.</li>
                    <li>Requires dual-custody physical authentication to restore.</li>
                </ul>
                <p>
                    Ason Inc. accepts no liability for operational downtime resulting from a legitimate or false-positive trigger of Protocol Omega.
                </p>
            </section>

            <section className="mb-8">
                <h3 className="text-lg font-bold mb-4 uppercase tracking-widest">5. Disclaimer of Warranties</h3>
                <p className="mb-4">
                    THE PLATFORM IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND. WHILE WE UTILIZE POST-QUANTUM CRYPTOGRAPHY, WE CANNOT GUARANTEE IMMUNITY AGAINST INFINITE COMPUTING POWER OR TIMELINE MODIFICATION ATTACKS.
                </p>
            </section>
        </LegalLayout>
    );
};
