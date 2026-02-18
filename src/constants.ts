export type IndustryConfig = {
    title: string;
    description: string;
    image: string;
    color: string;
    badge: string;
    tenant: string;
    program: string;
    warning: string;
};

export const INDUSTRIES_DATA: Record<string, IndustryConfig> = {
    "defense": {
        title: "Defense & Intelligence",
        description: "Command & Control (C2), ISR, Secure Logistics.",
        image: "https://placehold.co/600x400?text=Defense+Intel",
        color: "blue",
        badge: "ISO-26262 MODE",
        tenant: "US DEPARTMENT OF DEFENSE",
        program: "JADC2 NETWORK",
        warning: "TOP SECRET // NOFORN"
    },
    "aerospace": {
        title: "Aerospace",
        description: "Avionics, Satellite Constellations, Air Traffic Management.",
        image: "https://placehold.co/600x400?text=Aerospace",
        color: "sky",
        badge: "DO-178C MODE",
        tenant: "BLUE ORIGIN",
        program: "NEW GLENN AVIONICS",
        warning: "ITAR RESTRICTED // US CITIZENS ONLY"
    },
    "automotive": {
        title: "Automotive",
        description: "Autonomous Driving (L4/L5), V2X Infrastructure, EV Battery Management.",
        image: "https://placehold.co/600x400?text=Automotive",
        color: "indigo",
        badge: "ISO-26262 MODE",
        tenant: "TESLA MOTORS",
        program: "MODEL 2 BATTERY",
        warning: "NO FOREIGN NATIONAL ACCESS"
    },
    "pharma": {
        title: "Healthcare & Pharma",
        description: "Genomic Sequencing, Robotic Surgery, Patient Data Sovereignty.",
        image: "https://placehold.co/600x400?text=Healthcare",
        color: "teal",
        badge: "FDA GxP MODE",
        tenant: "PFIZER",
        program: "mRNA VACCINE BATCH 42",
        warning: "CLINICAL TRIAL DATA // HIPAA"
    },
    "finance": {
        title: "Finance & Banking",
        description: "High-Frequency Trading (HFT), SWIFT/FedWire Integration, Transaction Verification.",
        image: "https://placehold.co/600x400?text=Finance",
        color: "emerald",
        badge: "SOX AUDIT MODE",
        tenant: "GOLDMAN SACHS",
        program: "ALGO TRADING RISK",
        warning: "SEC REGULATED // MATERIAL NON-PUBLIC"
    },
    "energy": {
        title: "Energy & Utilities",
        description: "Smart Grids, Nuclear Reactor Control, Offshore Wind Farms.",
        image: "https://placehold.co/600x400?text=Energy",
        color: "amber",
        badge: "NRC-10CFR50 MODE",
        tenant: "DOMINION ENERGY",
        program: "REACTOR 4 COOLING",
        warning: "SAFEGUARDS INFORMATION (SGI)"
    },
    "manufacturing": {
        title: "Manufacturing & Robotics",
        description: "Industrial IoT (IIoT), PLC/SCADA Security, Supply Chain Twins.",
        image: "https://placehold.co/600x400?text=Manufacturing",
        color: "orange",
        badge: "IEC 62443 MODE",
        tenant: "BMW GROUP",
        program: "PLANT MUNICH",
        warning: "PROPRIETARY PROCESS DATA"
    },
    "telecom": {
        title: "Telecommunications",
        description: "5G/6G Core Networks, Infrastructure Management, Edge Computing.",
        image: "https://placehold.co/600x400?text=Telecom",
        color: "violet",
        badge: "3GPP REL-18 MODE",
        tenant: "VERIZON WIRELESS",
        program: "C-BAND ROLLOUT",
        warning: "CRITICAL INFRASTRUCTURE"
    },
    "logistics": {
        title: "Logistics & Maritime",
        description: "Autonomous Shipping, Port Operations, Cold Chain Integrity.",
        image: "https://placehold.co/600x400?text=Logistics",
        color: "cyan",
        badge: "IMO MARPOL MODE",
        tenant: "MAERSK LINE",
        program: "TRIPLE-E ROUTING",
        warning: "CUSTOMS & BORDER DATA"
    },
    "agriculture": {
        title: "Agriculture & Mining",
        description: "Autonomous Tractors, Deep Sea Mining, Geospacial Analysis.",
        image: "https://placehold.co/600x400?text=Agriculture",
        color: "lime",
        badge: "USDA COMPLIANCE MODE",
        tenant: "JOHN DEERE",
        program: "AUTONOMOUS TILLAGE",
        warning: "GENETIC CROP DATA"
    },
    "public": {
        title: "Public Sector",
        description: "Smart Cities, Election Infrastructure, Emergency Response Systems.",
        image: "https://placehold.co/600x400?text=Public+Sector",
        color: "slate",
        badge: "FEDRAMP HIGH MODE",
        tenant: "NYC CYBER COMMAND",
        program: "PROJECT SENTINEL",
        warning: "OFFICIAL USE ONLY"
    },
    "legal": {
        title: "Legal & Compliance",
        description: "eDiscovery, Contract Analysis, Regulatory Reporting.",
        image: "https://placehold.co/600x400?text=Legal",
        color: "stone",
        badge: "ABA ETHICS MODE",
        tenant: "LATHAM & WATKINS",
        program: "MERGER DUE DILIGENCE",
        warning: "ATTORNEY-CLIENT PRIVILEGE"
    }
};

// Default configuration for the app
export const DEPLOYMENT_CONFIG = INDUSTRIES_DATA["automotive"];
