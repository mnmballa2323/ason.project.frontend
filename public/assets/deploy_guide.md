# ASON PLATFORM - UNIVERSAL DEPLOYMENT GUIDE
## "Code Anywhere, Deploy Everywhere"

### 1. PREREQUISITES
- Docker Engine 24.0+
- Python 3.11+
- Node.js 20+ (for frontend build)
- 16GB RAM minimum (32GB recommended for full localized LLM inference)

### 2. QUICK START (LOCAL)
```bash
# 1. Clone the repository
git clone https://github.com/mnmballa2323/ason.project.git
cd ason.project

# 2. Run the universal installer
chmod +x install.sh
./install.sh --local
```

### 3. DEPLOY TO KUBERNETES (PRODUCTION)
The platform is Helm-ready.
```bash
# Deploy to current context
helm install qwen ./helm/ason-platform --namespace ason-prod --create-namespace
```

### 4. AIR-GAPPED DEPLOYMENT (OFFLINE)
For environments with NO internet access:
1. Transfer the `ason-offline-bundle.tar.gz` (contact support).
2. Load images: `docker load < ason-images.tar`
3. Run: `docker-compose -f docker-compose.offline.yml up -d`

### 5. VERIFICATION
Access the Verification Cockpit at `http://localhost:3000/verification` to validate system integrity.

### 6. ENTERPRISE SIZING & DEPLOYMENT (12k+ Users)
For large-scale deployments (e.g., Automotive, Financial Services) requiring high availability and zero-trust enforcement:

| Component | Sizing Recommendation | Rationale |
|---|---|---|
| **Compute Nodes** | 24x `m6i.8xlarge` (AWS) / `Standard_D32s_v5` (Azure) | 768 vCPUs total for concurrent verification. |
| **Inference Nodes** | 6x `p4d.24xlarge` (AWS) / `Standard_ND96asr_v4` (Azure) | Dedicated GPU pool for local LLM inference. |
| **Database** | `db.r6g.16xlarge` / `Standard_E64ds_v4` | 4TB+ Storage, 64 vCPU for massive write throughput. |

**Configuration:**
Use the provided "Golden Config" files in `infra/terraform/`:
- AWS: `tofu apply -var-file="aws/PROD_12K_USERS.tfvars"`
- Azure: `tofu apply -var-file="azure/PROD_12K_USERS.tfvars"`

**Security Requirement:**
Review `infra/security/mtls-config.md` to configure the mandatory Mutual TLS (mTLS) mesh.

---
**SUPPORT:** secure-support@liberty.one
**VERSION:** v47.0.1
