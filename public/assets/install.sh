#!/usr/bin/env bash
# ============================================================
# Ason Verification Platform — One-Command Installer
# "Deploy Anywhere" — Auto-detects environment and deploys
#
# Usage:
#   curl -fsSL https://qwen.libertycenter.one/install.sh | bash
#   OR
#   ./install.sh                    # Interactive mode
#   ./install.sh --mode docker      # Docker Compose
#   ./install.sh --mode k8s         # Kubernetes (Helm)
#   ./install.sh --mode bare-metal  # Direct systemd services
#
# License: Apache-2.0
# ZERO EXTERNAL APIS. Fully self-hosted.
# ============================================================

set -euo pipefail

# --- Colors ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# --- Banner ---
echo -e "${CYAN}"
echo "  ╔═══════════════════════════════════════════════════════════╗"
echo "  ║         Ason Verification Platform — Installer           ║"
echo "  ║         Deploy Anywhere • Zero Third-Party APIs          ║"
echo "  ║         Liberty Center One — Apache-2.0 Licensed         ║"
echo "  ╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# --- Globals ---
INSTALL_DIR="${ASON_INSTALL_DIR:-/opt/ason-verification}"
DATA_DIR="${ASON_DATA_DIR:-/var/lib/qwen}"
LOG_DIR="${ASON_LOG_DIR:-/var/log/qwen}"
MODE="${1:-auto}"
ASON_VERSION="2.0.0"

# --- Functions ---
log_info()  { echo -e "${GREEN}[INFO]${NC}  $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_step()  { echo -e "${BLUE}[STEP]${NC}  $1"; }

# ============================================================================
#  ENVIRONMENT DETECTION
# ============================================================================

detect_environment() {
    log_step "Detecting deployment environment..."

    # Check for Kubernetes
    if command -v kubectl &>/dev/null && kubectl cluster-info &>/dev/null 2>&1; then
        if command -v helm &>/dev/null; then
            echo "kubernetes"
            return
        fi
    fi

    # Check for Docker
    if command -v docker &>/dev/null && docker info &>/dev/null 2>&1; then
        if command -v docker-compose &>/dev/null || docker compose version &>/dev/null 2>&1; then
            echo "docker"
            return
        fi
    fi

    # Bare metal fallback
    echo "bare-metal"
}

# ============================================================================
#  PREREQUISITE CHECKS
# ============================================================================

check_prerequisites() {
    local mode=$1
    log_step "Checking prerequisites for ${mode} deployment..."

    local missing=()

    case $mode in
        kubernetes)
            command -v kubectl &>/dev/null || missing+=("kubectl")
            command -v helm &>/dev/null    || missing+=("helm")
            command -v tofu &>/dev/null || command -v terraform &>/dev/null || missing+=("opentofu or terraform")
            ;;
        docker)
            command -v docker &>/dev/null  || missing+=("docker")
            (command -v docker-compose &>/dev/null || docker compose version &>/dev/null 2>&1) || missing+=("docker-compose")
            ;;
        bare-metal)
            command -v python3 &>/dev/null || missing+=("python3")
            command -v pip3 &>/dev/null    || missing+=("pip3")
            command -v node &>/dev/null    || missing+=("nodejs (v18+)")
            command -v npm &>/dev/null     || missing+=("npm")
            ;;
    esac

    # Common requirements
    command -v git &>/dev/null  || missing+=("git")
    command -v curl &>/dev/null || missing+=("curl")

    if [ ${#missing[@]} -gt 0 ]; then
        log_error "Missing prerequisites: ${missing[*]}"
        log_info "Install them and re-run the installer."
        exit 1
    fi

    log_info "All prerequisites satisfied ✓"
}

# ============================================================================
#  SYSTEM RESOURCE VALIDATION
# ============================================================================

check_resources() {
    log_step "Checking system resources..."

    # Check RAM (minimum 16 GB)
    local total_ram_kb
    total_ram_kb=$(grep MemTotal /proc/meminfo 2>/dev/null | awk '{print $2}' || echo 0)
    local total_ram_gb=$((total_ram_kb / 1024 / 1024))

    if [ "$total_ram_gb" -lt 16 ]; then
        log_warn "System has ${total_ram_gb}GB RAM. Minimum recommended: 16GB."
        log_warn "Inference may be slow without sufficient RAM."
    else
        log_info "RAM: ${total_ram_gb}GB ✓"
    fi

    # Check disk (minimum 50 GB free)
    local free_disk_gb
    free_disk_gb=$(df -BG / 2>/dev/null | tail -1 | awk '{print $4}' | tr -d 'G' || echo 0)

    if [ "${free_disk_gb:-0}" -lt 50 ]; then
        log_warn "Only ${free_disk_gb}GB free disk space. Minimum recommended: 50GB."
    else
        log_info "Disk: ${free_disk_gb}GB free ✓"
    fi

    # Check for GPU (optional but recommended)
    if command -v nvidia-smi &>/dev/null; then
        local gpu_name
        gpu_name=$(nvidia-smi --query-gpu=name --format=csv,noheader 2>/dev/null | head -1)
        log_info "GPU detected: ${gpu_name} ✓"
    else
        log_warn "No NVIDIA GPU detected. Inference will run on CPU (slower)."
    fi

    # Check CPU cores (minimum 4)
    local cpu_cores
    cpu_cores=$(nproc 2>/dev/null || echo 1)
    if [ "$cpu_cores" -lt 4 ]; then
        log_warn "Only ${cpu_cores} CPU cores. Minimum recommended: 4."
    else
        log_info "CPU: ${cpu_cores} cores ✓"
    fi
}

# ============================================================================
#  DOCKER COMPOSE DEPLOYMENT
# ============================================================================

deploy_docker() {
    log_step "Deploying via Docker Compose..."

    # Create directories
    mkdir -p "$INSTALL_DIR" "$DATA_DIR"/{postgres,milvus,models,backups} "$LOG_DIR"

    # Generate .env if not exists
    if [ ! -f "$INSTALL_DIR/.env" ]; then
        log_step "Generating environment configuration..."
        cat > "$INSTALL_DIR/.env" << EOF
# Ason Verification Platform — Docker Deployment
ASON_ENV=production
ASON_VERSION=${ASON_VERSION}
POSTGRES_PASSWORD=$(openssl rand -base64 32 | tr -d '/+=' | head -c 32)
POSTGRES_URL=postgresql://ason_admin:\${POSTGRES_PASSWORD}@postgres:5432/ason_verification
INFERENCE_URL=http://ason-inference:8000/generate
ASON_MODEL_NAME=Qwen/Qwen2-72B-Instruct
ASON_LOG_LEVEL=INFO
ASON_TLS_ENABLED=false
ASON_LICENSE_SECRET=$(openssl rand -hex 32)
KEYCLOAK_URL=http://keycloak:8080
KEYCLOAK_REALM=ason-verification
KEYCLOAK_CLIENT_ID=ason-orchestrator
EOF
        log_info "Generated .env with random secrets"
    fi

    # Generate docker-compose.yml
    cat > "$INSTALL_DIR/docker-compose.yml" << 'COMPOSE'
version: "3.9"

services:
  # --- Core Platform ---
  orchestrator:
    image: ason-orchestrator:${ASON_VERSION:-latest}
    build: ./services/orchestrator
    ports: ["8000:8000"]
    env_file: .env
    depends_on: [postgres, milvus]
    restart: unless-stopped
    read_only: true
    tmpfs: ["/tmp"]
    deploy:
      resources:
        limits: { cpus: "4", memory: "8G" }

  frontend:
    image: ason-frontend:${ASON_VERSION:-latest}
    build: ./frontend
    ports: ["3001:80"]
    depends_on: [orchestrator]
    restart: unless-stopped

  # --- Data Layer ---
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: ason_verification
      POSTGRES_USER: ason_admin
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes: ["pg_data:/var/lib/postgresql/data"]
    restart: unless-stopped
    deploy:
      resources:
        limits: { cpus: "2", memory: "4G" }

  milvus:
    image: milvusdb/milvus:v2.3.4
    ports: ["19530:19530"]
    volumes: ["milvus_data:/var/lib/milvus"]
    environment:
      ETCD_ENDPOINTS: etcd:2379
    depends_on: [etcd, minio]
    restart: unless-stopped

  etcd:
    image: quay.io/coreos/etcd:v3.5.11
    environment:
      ETCD_AUTO_COMPACTION_MODE: revision
      ETCD_AUTO_COMPACTION_RETENTION: "1000"
    volumes: ["etcd_data:/etcd"]
    restart: unless-stopped

  minio:
    image: minio/minio:latest
    environment:
      MINIO_ACCESS_KEY: minioadmin
      MINIO_SECRET_KEY: minioadmin
    volumes: ["minio_data:/data"]
    command: server /data
    restart: unless-stopped

  # --- Auth ---
  keycloak:
    image: quay.io/keycloak/keycloak:23.0
    ports: ["8080:8080"]
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: ${KEYCLOAK_ADMIN_PASSWORD:-admin}
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://postgres:5432/keycloak
      KC_DB_USERNAME: ason_admin
      KC_DB_PASSWORD: ${POSTGRES_PASSWORD}
    command: start-dev
    depends_on: [postgres]
    restart: unless-stopped

  # --- Monitoring ---
  prometheus:
    image: prom/prometheus:v2.48.1
    ports: ["9090:9090"]
    volumes: ["./infra/prometheus:/etc/prometheus"]
    restart: unless-stopped

  jaeger:
    image: jaegertracing/all-in-one:1.52
    ports: ["16686:16686", "4317:4317"]
    restart: unless-stopped

volumes:
  pg_data:
  milvus_data:
  etcd_data:
  minio_data:
COMPOSE

    # Start services
    cd "$INSTALL_DIR"
    docker compose up -d

    log_info "Docker deployment complete!"
    log_info "  Orchestrator: http://localhost:8000"
    log_info "  Frontend:     http://localhost:3001"
    log_info "  Keycloak:     http://localhost:8080"
    log_info "  Prometheus:   http://localhost:9090"
    log_info "  Jaeger:       http://localhost:16686"
}

# ============================================================================
#  KUBERNETES (HELM) DEPLOYMENT
# ============================================================================

deploy_kubernetes() {
    log_step "Deploying via Helm to Kubernetes..."

    # Check cluster connectivity
    kubectl cluster-info || { log_error "Cannot connect to Kubernetes cluster"; exit 1; }

    # Create namespace
    kubectl create namespace ason-verification --dry-run=client -o yaml | kubectl apply -f -

    # Create secrets
    kubectl create secret generic ason-secrets \
        --namespace ason-verification \
        --from-literal=POSTGRES_PASSWORD="$(openssl rand -base64 32 | tr -d '/+=')" \
        --from-literal=ASON_LICENSE_SECRET="$(openssl rand -hex 32)" \
        --dry-run=client -o yaml | kubectl apply -f -

    # Deploy with Helm
    helm upgrade --install ason-platform ./helm/ason-platform \
        --namespace ason-verification \
        --values helm/ason-platform/canary-values.yaml \
        --set environment=production \
        --set replicaCount=3 \
        --wait --timeout 10m

    log_info "Kubernetes deployment complete!"
    log_info "  kubectl get pods -n ason-verification"
    log_info "  kubectl get svc -n ason-verification"
}

# ============================================================================
#  BARE METAL DEPLOYMENT
# ============================================================================

deploy_bare_metal() {
    log_step "Deploying to bare metal (systemd services)..."

    # Create directories
    mkdir -p "$INSTALL_DIR" "$DATA_DIR" "$LOG_DIR"

    # Install Python dependencies
    log_step "Installing Python dependencies..."
    cd "$INSTALL_DIR"
    pip3 install -r services/orchestrator/requirements.txt

    # Install frontend dependencies
    log_step "Building frontend..."
    cd "$INSTALL_DIR/frontend"
    npm install
    npm run build

    # Create systemd service
    cat > /etc/systemd/system/ason-orchestrator.service << EOF
[Unit]
Description=Ason Verification Orchestrator
After=network.target postgresql.service

[Service]
Type=simple
User=qwen
Group=qwen
WorkingDirectory=${INSTALL_DIR}/services/orchestrator
ExecStart=/usr/bin/python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
Restart=always
RestartSec=5
Environment=ASON_ENV=production
Environment=ASON_LOG_LEVEL=INFO
EnvironmentFile=${INSTALL_DIR}/.env

# Security hardening
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=${DATA_DIR} ${LOG_DIR}
PrivateTmp=true
ProtectKernelTunables=true
ProtectKernelModules=true
ProtectControlGroups=true

[Install]
WantedBy=multi-user.target
EOF

    systemctl daemon-reload
    systemctl enable ason-orchestrator
    systemctl start ason-orchestrator

    log_info "Bare metal deployment complete!"
    log_info "  systemctl status ason-orchestrator"
    log_info "  journalctl -u ason-orchestrator -f"
}

# ============================================================================
#  MAIN
# ============================================================================

main() {
    # Parse arguments
    local deploy_mode="auto"
    while [[ $# -gt 0 ]]; do
        case $1 in
            --mode) deploy_mode="$2"; shift 2 ;;
            --dir)  INSTALL_DIR="$2"; shift 2 ;;
            --help) echo "Usage: $0 [--mode docker|k8s|bare-metal] [--dir /path]"; exit 0 ;;
            *) shift ;;
        esac
    done

    # Auto-detect if needed
    if [ "$deploy_mode" = "auto" ]; then
        deploy_mode=$(detect_environment)
        log_info "Auto-detected environment: ${deploy_mode}"
    fi

    # Pre-flight checks
    check_prerequisites "$deploy_mode"
    check_resources

    # Deploy
    case $deploy_mode in
        kubernetes|k8s) deploy_kubernetes ;;
        docker)         deploy_docker ;;
        bare-metal)     deploy_bare_metal ;;
        *)
            log_error "Unknown mode: ${deploy_mode}"
            log_info "Valid modes: docker, kubernetes, bare-metal"
            exit 1
            ;;
    esac

    echo ""
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║          Installation Complete — v${ASON_VERSION}                ║${NC}"
    echo -e "${GREEN}║          Zero Third-Party APIs • Apache-2.0              ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
}

main "$@"
