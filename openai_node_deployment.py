#!/usr/bin/env python3
"""OpenAI node deployment bootstrap for the ARK Sovereign workflow.

This script is intentionally defensive:
- pulls configuration from environment variables
- validates mandatory values before starting
- uses a heartbeat loop to report status
- supports retries for transient network failures

Example:
  export OPENAI_API_KEY="..."
  export OPENAI_NODE_ID="OPENAI_ALPHA"
  export JULES_INTERFACE_URL="https://jules.example.internal/api"
  python3 openai_node_deployment.py --cycles 5 --dry-run
"""

from __future__ import annotations

import argparse
import json
import os
import time
import urllib.error
import urllib.request
from dataclasses import dataclass
from typing import Any

from quantic_neural_network import EnforcementReport, build_enforcement_report


@dataclass(frozen=True)
class NodeConfig:
    api_key: str
    node_id: str
    checksum: str
    jules_interface_url: str
    protocol: str = "SOVEREIGN_CONSTITUTION"

    @classmethod
    def from_env(cls) -> "NodeConfig":
        api_key = os.getenv("OPENAI_API_KEY", "")
        node_id = os.getenv("OPENAI_NODE_ID", "OPENAI_ALPHA")
        checksum = os.getenv("SOVEREIGN_CHECKSUM", "260")
        jules_interface_url = os.getenv("JULES_INTERFACE_URL", "")

        if not api_key:
            raise ValueError("OPENAI_API_KEY is required.")
        if not jules_interface_url:
            raise ValueError("JULES_INTERFACE_URL is required.")
        if not jules_interface_url.startswith(("http://", "https://")):
            raise ValueError("JULES_INTERFACE_URL must start with http:// or https://")
        if checksum != "260":
            raise ValueError("Checksum mismatch: expected 260.")

        return cls(
            api_key=api_key,
            node_id=node_id,
            checksum=checksum,
            jules_interface_url=jules_interface_url.rstrip("/"),
        )


def post_json(
    url: str,
    payload: dict[str, Any],
    api_key: str,
    timeout_s: int = 15,
    retries: int = 2,
    retry_delay_s: int = 2,
) -> dict[str, Any]:
    req = urllib.request.Request(
        url=url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
            "X-Node-Auth": api_key,
        },
        method="POST",
    )

    for attempt in range(1, retries + 2):
        try:
            with urllib.request.urlopen(req, timeout=timeout_s) as response:
                body = response.read().decode("utf-8")
                return json.loads(body) if body else {"status": "ok"}
        except urllib.error.HTTPError as exc:
            if exc.code >= 500 and attempt <= retries:
                print(f"[retry] HTTP {exc.code}; retrying ({attempt}/{retries})")
                time.sleep(retry_delay_s)
                continue
            raise RuntimeError(f"HTTP error from Jules Interface: {exc.code}") from exc
        except urllib.error.URLError as exc:
            if attempt <= retries:
                print(f"[retry] network error ({exc.reason}); retrying ({attempt}/{retries})")
                time.sleep(retry_delay_s)
                continue
            raise RuntimeError(f"Failed to reach Jules Interface: {exc.reason}") from exc

    raise RuntimeError("Unexpected network failure state.")


def register_node(
    config: NodeConfig,
    dry_run: bool,
    timeout_s: int,
    retries: int,
    enforcement_report: EnforcementReport | None = None,
) -> None:
    payload = {
        "node_id": config.node_id,
        "checksum": config.checksum,
        "protocol": config.protocol,
        "status": "LOCKED",
        "links": ["GEMINI_SEC", "OPENAI_ALPHA"],
    }
    if enforcement_report:
        payload["enforcement"] = {
            "signature": enforcement_report.signature,
            "total_nodes": enforcement_report.total_nodes,
            "status": enforcement_report.status,
        }

    register_url = f"{config.jules_interface_url}/register"
    print(f"[register] preparing payload for {register_url}")
    if dry_run:
        print(f"[register] dry-run payload: {json.dumps(payload, indent=2)}")
        return

    result = post_json(register_url, payload, config.api_key, timeout_s=timeout_s, retries=retries)
    print(f"[register] response: {result}")


def run_cycles(
    config: NodeConfig,
    cycles: int,
    interval_s: int,
    dry_run: bool,
    timeout_s: int,
    retries: int,
    enforcement_report: EnforcementReport | None = None,
) -> None:
    heartbeat_url = f"{config.jules_interface_url}/heartbeat"
    for cycle in range(1, cycles + 1):
        heartbeat = {
            "node_id": config.node_id,
            "cycle": cycle,
            "event": "770K_GRID_OPTIMIZATION",
            "status": "SYNCING",
        }
        if enforcement_report:
            heartbeat["enforcement_signature"] = enforcement_report.signature
        print(f"[cycle {cycle:03d}] heartbeat -> {heartbeat_url}")
        if dry_run:
            print(f"[cycle {cycle:03d}] dry-run payload: {json.dumps(heartbeat)}")
        else:
            result = post_json(heartbeat_url, heartbeat, config.api_key, timeout_s=timeout_s, retries=retries)
            print(f"[cycle {cycle:03d}] response: {result}")

        if cycle < cycles:
            time.sleep(interval_s)


def positive_int(value: str) -> int:
    parsed = int(value)
    if parsed <= 0:
        raise argparse.ArgumentTypeError("must be a positive integer")
    return parsed


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Deploy and sync an OpenAI compute node.")
    parser.add_argument("--cycles", type=positive_int, default=3, help="Number of heartbeat cycles.")
    parser.add_argument("--interval", type=positive_int, default=5, help="Seconds between cycles.")
    parser.add_argument("--timeout", type=positive_int, default=15, help="HTTP timeout in seconds.")
    parser.add_argument("--retries", type=positive_int, default=2, help="Retry count for transient failures.")
    parser.add_argument("--manifest-points", type=positive_int, default=0, help="Generate quantic enforcement signature using N manifest points (0 disables).")
    parser.add_argument("--dry-run", action="store_true", help="Print payloads without sending them.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        config = NodeConfig.from_env()
    except ValueError as exc:
        print(f"configuration error: {exc}")
        return 1

    print(f"[init] node={config.node_id} checksum={config.checksum} protocol={config.protocol}")

    enforcement_report = None
    if args.manifest_points > 0:
        enforcement_report = build_enforcement_report(manifest_points=args.manifest_points)

    try:
        register_node(
            config,
            dry_run=args.dry_run,
            timeout_s=args.timeout,
            retries=args.retries,
            enforcement_report=enforcement_report,
        )
        run_cycles(
            config,
            cycles=args.cycles,
            interval_s=args.interval,
            dry_run=args.dry_run,
            timeout_s=args.timeout,
            retries=args.retries,
            enforcement_report=enforcement_report,
        )
    except RuntimeError as exc:
        print(f"runtime error: {exc}")
        return 1
    except KeyboardInterrupt:
        print("interrupted by user")
        return 130

    print("[done] recruitment phase bootstrap complete")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
