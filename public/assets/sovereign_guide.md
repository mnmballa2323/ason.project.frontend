# SOVEREIGN CLOUD DEPLOYMENT GUIDE
## "World Best" Infrastructure & Air-Gap Operations

### 1. PHILOSOPHY
The Ason Platform is designed for **Zero-Trust, Zero-Egress** environments.
- **No Telemetry**: We do not phone home.
- **No External Dependencies**: All assets are bundled.
- **Infrastructure as Code**: Full Terraform support for AWS, Azure, GCP, and On-Prem.

### 2. AIR-GAP DEPLOYMENT (OFFLINE)

#### Step A: Bundle (On Connected Machine)
Run the bundler to grab all Docker images and code:
```bash
python3 scripts/bundle_airgap.py --output ason-offline-bundle.tar.gz
```
*Result: A single `.tar.gz` and a `.sha256` checksum file.*

#### Step B: Transfer
Copy `ason-offline-bundle.tar.gz` and `install.sh` to your secure environment via USB or Secure File Transfer.

#### Step C: Install (On Air-Gapped Machine)
```bash
chmod +x install.sh
./install.sh --offline --bundle ason-offline-bundle.tar.gz
```
The installer will:
1.  Verify the SHA-256 checksum.
2.  Extract the codebase.
3.  Load all Docker images into the local daemon.
4.  Launch the stack via Docker Compose.

### 3. SOVEREIGN CLOUD (TERRAFORM)
For connected but private cloud deployments, use our verified modules.

**Example: AWS GovCloud**
```hcl
module "ason_govcloud" {
  source = "./infra/terraform/aws"
  
  region     = "us-gov-west-1"
  vpc_cidr   = "10.0.0.0/16"
  enable_fips = true
}
```

### 4. COMPLIANCE & AUDIT
- **System Logs**: Stored locally in `/var/log/qwen`.
- **Audit Trails**: Immutable ledger in Postgres/Milvus.
- **Validation**: Use the *Governance Dashboard* to export SOX/SOC2 artifacts.

---
**SUPPORT**: secure-support@liberty.one
**VERSION**: v2.0.0 (Sovereign Edition)
