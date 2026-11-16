---
name: deploy-launchpad-power-cpu
description: >
  Deploy and troubleshoot IBM Launchpad (AI Services: catalog, Extract, Summarize, Digitize, RAG) on a fresh
  CPU-only IBM Power VM using the scripts in launchpad/scripts. Covers the manual reservation input, launching,
  monitoring, verification and the known failure modes found while validating the stack.
  DRAFT: not yet proven on a fresh reservation.
version: 0.1.0-draft
author: EMEA AI on IBM Power Squad
---

# Skill: Deploy Launchpad on IBM Power (CPU only)

## Inputs from the user (reservation is MANUAL)
FQDN `pvm1-<key>.p<NNNN>.pok-systems.techzone.ibm.com`, OS user, SSH key path. IBM VPN must be on. Do not retry an old
reservation first; ask. Do not rely on the TechZone MCP for booking.

## Procedure
1. `ssh -i <key> -o ConnectTimeout=15 <user>@<fqdn> "echo ok"` (timeout = VPN off / reservation gone / TechZone outage).
2. Copy and run the launcher. Multi-line ssh scripts go in via stdin and MUST end with `echo END` (a trailing CR breaks the last command):
   `ssh ... "bash -s" < launchpad/remote-launch.sh`
3. Monitor `~/launchpad-deploy.log` (`tail -n 40`). Steps print `STEP n/6`. First failure stops the run; fix the cause in the
   REPO (script change), commit, push, re-run `remote-launch.sh <branch> <step>`. Do not hand-fix the VM and move on.
4. Success = `run-all.sh` prints `ALL STEPS PASSED` and `06-smoke-test.sh` shows all PASS. Record timings and every fix in
   `launchpad/FRESH-INSTANCE-TEST.md`.

## Known failure modes
- Never run plain `bootstrap configure` (SMT 64->16, SELinux, Spyre). Always `--runtime podman --skip-validation power,spyre`.
- Over ssh/nohup set `XDG_RUNTIME_DIR=/run/user/<uid>` (common.sh does) or rootless podman fails.
- `Linger=no` by default: without `loginctl enable-linger` the user's containers die when the last session closes.
- `catalog-backend` stuck in "Created" with `crun ... keycreate`: SELinux module missing; needs `ai_services_nonroot_policy.cil` AND the udica `base_container.cil` + `net_container.cil` in one `semodule -i`.
- Containers reach Ollama at `http://host.containers.internal:11434`, not the public IP.
- `application create` accepts `ollama` only as LLM alias; the model alias `ibm-granite/granite-4.0-micro` must exist in Ollama.
- `/tokenize`: services call `POST <llm>/tokenize` at startup; LiteLLM routes it to watsonx and returns 500. The `ollama` bundle ships a shim; if extract-api restarts every ~5 s, check the bundle copy.
- embedding/reranker (vLLM CPU) pods end up `Stopped` after create: `podman pod start`. Their healthcheck kills them in a loop on podman 6.1.1: `podman update --health-cmd ... --health-start-period 0s --health-retries 20` per container (step 05 does this; lost if the CLI recreates containers).
- Stock vllm-cpu template wants 150Gi memory and KV 32: the reduced-scale patch (24Gi / 4) is needed for 48 GiB VMs (still an open question whether it is needed for llm.ollama-only apps).
- 409 `RESOURCE_LOCKED` when re-ingesting a document into Digitize: wait for the job to finish or delete first.
- `catalog bundle update` only works while no app uses the bundle.
- `catalog configure` re-run is idempotent and the only way to (re)join the local worker; pass the same admin password (pty-answer.py reuses `~/.launchpad-admin-pw`).
- Inference is slow on CPU (Extract 4-9 s, Q&A ~20 s, Digitize is LLM-bound); pre-ingest documents before an audience arrives.
- Never print or commit `~/.launchpad-admin-pw`.
