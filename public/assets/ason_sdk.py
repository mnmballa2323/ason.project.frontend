"""
Ason Verification SDK — Python Client Library
Liberty Center One — ZERO EXTERNAL APIs
Typed client for submitting, polling, batching, and exporting verifications.

Usage:
    from ason_sdk import AsonClient

    client = AsonClient("http://localhost:8000", api_key="your-key")
    result = client.verify("The Earth is 4.5 billion years old")
    print(result.verdict, result.confidence)
"""

import json
import time
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

import httpx


# ============================================================================
#  DATA MODELS
# ============================================================================

@dataclass
class VerificationResult:
    """Result of a single claim verification."""
    job_id: str
    claim: str
    verdict: str           # "Supported" | "Refuted" | "Insufficient Info"
    confidence: float      # 0.0 – 1.0
    evidence: List[Dict]
    reasoning: str
    sources: List[str]
    model_id: str
    duration_ms: float
    verified_at: str
    raw: Dict = field(default_factory=dict)

    @classmethod
    def from_dict(cls, data: dict) -> "VerificationResult":
        return cls(
            job_id=data.get("job_id", ""),
            claim=data.get("claim", ""),
            verdict=data.get("result", {}).get("verdict", "unknown"),
            confidence=data.get("result", {}).get("confidence", 0.0),
            evidence=data.get("result", {}).get("evidence", []),
            reasoning=data.get("result", {}).get("reasoning", ""),
            sources=data.get("result", {}).get("sources", []),
            model_id=data.get("model_id", ""),
            duration_ms=data.get("duration_ms", 0),
            verified_at=data.get("completed_at", ""),
            raw=data,
        )


@dataclass
class BatchResult:
    """Result of a batch verification."""
    batch_id: str
    total: int
    completed: int
    failed: int
    results: List[VerificationResult]
    duration_ms: float

    @classmethod
    def from_dict(cls, data: dict) -> "BatchResult":
        return cls(
            batch_id=data.get("batch_id", ""),
            total=data.get("total", 0),
            completed=data.get("completed", 0),
            failed=data.get("failed", 0),
            results=[VerificationResult.from_dict(r) for r in data.get("results", [])],
            duration_ms=data.get("duration_ms", 0),
        )


@dataclass
class AuditEntry:
    """Single audit chain entry."""
    block_id: int
    job_id: str
    claim_hash: str
    result_hash: str
    prev_hash: str
    block_hash: str
    timestamp: str


# ============================================================================
#  CLIENT
# ============================================================================

class AsonClient:
    """
    Synchronous Python client for the Ason Verification Platform API.
    All calls go to your self-hosted instance — zero external APIs.
    """

    def __init__(
        self,
        base_url: str = "http://localhost:8000",
        api_key: str = "",
        tenant_id: str = "",
        timeout: float = 120.0,
        verify_ssl: bool = True,
    ):
        self.base_url = base_url.rstrip("/")
        self._headers = {
            "Content-Type": "application/json",
            "User-Agent": "AsonSDK/2.0",
        }
        if api_key:
            self._headers["Authorization"] = f"Bearer {api_key}"
        if tenant_id:
            self._headers["X-Tenant-ID"] = tenant_id

        self._client = httpx.Client(
            base_url=self.base_url,
            headers=self._headers,
            timeout=timeout,
            verify=verify_ssl,
        )

    def close(self):
        self._client.close()

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.close()

    # --- Verification ---

    def verify(
        self, claim: str,
        model_id: str = None,
        context: str = "",
        domain: str = "general",
        priority: str = "normal",
        poll_interval: float = 1.0,
        max_wait: float = 120.0,
    ) -> VerificationResult:
        """
        Submit a claim for verification and wait for the result.

        Args:
            claim: The claim text to verify
            model_id: Optional model ID override
            context: Optional context/source text
            domain: Verification domain (general, medical, legal, financial)
            priority: Job priority (low, normal, high, critical)
            poll_interval: Seconds between status polls
            max_wait: Maximum seconds to wait

        Returns:
            VerificationResult with verdict, confidence, evidence, and reasoning
        """
        payload = {
            "claim": claim,
            "domain": domain,
            "priority": priority,
        }
        if model_id:
            payload["model_id"] = model_id
        if context:
            payload["context"] = context

        resp = self._client.post("/verify/run", json=payload)
        resp.raise_for_status()
        job = resp.json()
        job_id = job.get("job_id", "")

        return self._poll_job(job_id, poll_interval, max_wait)

    def verify_async(self, claim: str, **kwargs) -> str:
        """Submit a claim without waiting. Returns job_id for later polling."""
        payload = {"claim": claim, **kwargs}
        resp = self._client.post("/verify/run", json=payload)
        resp.raise_for_status()
        return resp.json().get("job_id", "")

    def get_job(self, job_id: str) -> Dict:
        """Get the current status of a verification job."""
        resp = self._client.get(f"/verify/status/{job_id}")
        resp.raise_for_status()
        return resp.json()

    def cancel_job(self, job_id: str) -> Dict:
        """Cancel a running verification job."""
        resp = self._client.post(f"/verify/cancel/{job_id}")
        resp.raise_for_status()
        return resp.json()

    def _poll_job(self, job_id: str, interval: float, max_wait: float) -> VerificationResult:
        start = time.time()
        while time.time() - start < max_wait:
            data = self.get_job(job_id)
            status = data.get("status", "")
            if status in ("completed", "failed", "cancelled"):
                return VerificationResult.from_dict(data)
            time.sleep(interval)
        raise TimeoutError(f"Job {job_id} did not complete within {max_wait}s")

    # --- Batch ---

    def verify_batch(
        self, claims: List[str],
        model_id: str = None,
        domain: str = "general",
        poll_interval: float = 2.0,
        max_wait: float = 600.0,
    ) -> BatchResult:
        """Submit multiple claims for batch verification."""
        payload = {
            "claims": [{"claim": c, "domain": domain} for c in claims],
        }
        if model_id:
            payload["model_id"] = model_id

        resp = self._client.post("/verify/batch", json=payload)
        resp.raise_for_status()
        batch = resp.json()
        batch_id = batch.get("batch_id", "")

        start = time.time()
        while time.time() - start < max_wait:
            resp = self._client.get(f"/verify/batch/{batch_id}")
            resp.raise_for_status()
            data = resp.json()
            if data.get("status") in ("completed", "failed"):
                return BatchResult.from_dict(data)
            time.sleep(poll_interval)
        raise TimeoutError(f"Batch {batch_id} did not complete within {max_wait}s")

    # --- Audit ---

    def get_audit_chain(self, limit: int = 100) -> List[Dict]:
        """Get audit chain entries."""
        resp = self._client.get(f"/audit/chain?limit={limit}")
        resp.raise_for_status()
        return resp.json().get("chain", [])

    def verify_audit_integrity(self) -> Dict:
        """Verify the integrity of the audit chain."""
        resp = self._client.get("/audit/verify")
        resp.raise_for_status()
        return resp.json()

    def export_audit(self, format: str = "json", days: int = 30) -> bytes:
        """Export audit data."""
        resp = self._client.get(f"/audit/export?format={format}&days={days}")
        resp.raise_for_status()
        return resp.content

    # --- Health ---

    def health(self) -> Dict:
        """Get platform health status."""
        resp = self._client.get("/health/deep")
        resp.raise_for_status()
        return resp.json()

    def ready(self) -> bool:
        """Check if the platform is ready."""
        try:
            resp = self._client.get("/health/ready")
            return resp.status_code == 200
        except Exception:
            return False

    # --- License ---

    def check_license(self) -> Dict:
        """Check current license status."""
        resp = self._client.get("/admin/license")
        resp.raise_for_status()
        return resp.json()


# ============================================================================
#  ASYNC CLIENT
# ============================================================================

class AsyncAsonClient:
    """Async version of AsonClient for use with asyncio."""

    def __init__(self, base_url: str = "http://localhost:8000", api_key: str = "", tenant_id: str = "", **kwargs):
        headers = {"Content-Type": "application/json", "User-Agent": "AsonSDK/2.0"}
        if api_key:
            headers["Authorization"] = f"Bearer {api_key}"
        if tenant_id:
            headers["X-Tenant-ID"] = tenant_id
        self._client = httpx.AsyncClient(base_url=base_url, headers=headers, timeout=kwargs.get("timeout", 120.0))

    async def close(self):
        await self._client.aclose()

    async def __aenter__(self):
        return self

    async def __aexit__(self, *args):
        await self.close()

    async def verify(self, claim: str, **kwargs) -> VerificationResult:
        resp = await self._client.post("/verify/run", json={"claim": claim, **kwargs})
        resp.raise_for_status()
        job_id = resp.json().get("job_id", "")

        import asyncio
        max_wait = kwargs.get("max_wait", 120.0)
        interval = kwargs.get("poll_interval", 1.0)
        start = time.time()
        while time.time() - start < max_wait:
            r = await self._client.get(f"/verify/status/{job_id}")
            data = r.json()
            if data.get("status") in ("completed", "failed", "cancelled"):
                return VerificationResult.from_dict(data)
            await asyncio.sleep(interval)
        raise TimeoutError(f"Job {job_id} timed out")

    async def health(self) -> Dict:
        resp = await self._client.get("/health/deep")
        resp.raise_for_status()
        return resp.json()
