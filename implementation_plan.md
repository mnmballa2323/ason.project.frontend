# Phase 9: Security Intelligence & Reporting

## Goal Description
Enhance the platform's intelligence capabilities by visualizing security threats and generating compliance outcomes.
We will also connect the "mock" resources to real verified assets.

## User Review Required
> [!NOTE]
> This phase connects the frontend to real "artifacts" (SDK, Guides).

## Proposed Changes

### Security Visualization

#### [NEW] [ThreatMap.tsx](file:///c:/Users/hyper/Desktop/workspace/ason.project/ason.project.frontend/src/components/ThreatMap.tsx)
-   **Visuals**: animated Dymaxion or Mercator projection.
-   **Data**: Simulates incoming threats (DDoS, SQLi) and their blocking by the "Sovereign Shield".
-   **Integration**: Add to `AdminPanel` or potentially `activeView === 'surveillance'`.

### Compliance Reporting

#### [MODIFY] [AuditDashboard.tsx](file:///c:/Users/hyper/Desktop/workspace/ason.project/ason.project.frontend/src/components/AuditDashboard.tsx)
-   **Action**: Add "Export Regulatory Package" button.
-   **Function**: Triggers `window.print()` with specific `@media print` styles to hide UI chrome and format as a formal report.
-   **Output**: Clean, black-and-white compliant audit log.

### Resource Integration

#### [MODIFY] [About.tsx](file:///c:/Users/hyper/Desktop/workspace/ason.project/ason.project.frontend/src/components/About.tsx)
-   **Links**: Update `DOWNLOADS` constant to point to `/assets/ason_sdk.py` and `/assets/deploy_guide.md`.
-   **Action**: Ensure files are downloadable.

#### [Script] Asset Migration
-   Copy `ason_sdk.py` -> `public/assets/ason_sdk.py`
-   Copy `DEPLOY_ANYWHERE.md` -> `public/assets/deploy_guide.md`

## Verification Plan

### Manual Verification
1.  **Threat Map**: Verify animations and "Blocked" counters increment.
2.  **Reporting**: Click "Export", verify Print Preview shows a clean document without navbars.
3.  **Downloads**: Click "Download SDK", verify the file is the actual Python SDK.
