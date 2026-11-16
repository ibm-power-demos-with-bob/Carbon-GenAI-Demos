---
name: launchpad-power-cpu
title: "IBM Launchpad (AI Services) on IBM Power, CPU only - Granite via Ollama"
description: >
  Build the official IBM Launchpad / AI Services stack (catalog UI, Extract, Summarize, Digitize,
  RAG chat) on a fresh IBM Power10 RHEL VM with no GPU and no Spyre card. Granite 4.0 Micro is served by
  Ollama through a custom `ollama` LLM bundle. Everything runs on the VM, no cloud APIs.
  STATUS: DRAFTED - scripts were written without a VM and have not yet passed a fresh-reservation run
  (see FRESH-INSTANCE-TEST.md).
author: EMEA AI on IBM Power Squad
version: 0.1.0-draft
repository: https://github.com/ibm-power-demos-with-bob/Carbon-GenAI-Demos
branch: feature/launchpad-power-cpu
tags:
  - ibm-power
  - launchpad
  - ai-services
  - granite
  - ollama
  - ppc64le
  - rhel
  - cpu-only
skills:
  - deploy-launchpad-power-cpu
techzone:
  platform_id: 6a7aba1916c56f06e4b1e910
  environment: AI-Ready RHEL on IBM Power On-Premises
  sizing: 8 vCPU / 50 GB RAM / >= 90 GB disk (RHEL 10.x)
  note: >
    Book the reservation MANUALLY (purpose Demo needs an ISC opportunity number: 4 days plus up to
    three 4-day extensions). The TechZone MCP is not relied on. Bob needs: FQDN, OS user, SSH key path.
---

# Launchpad on IBM Power (CPU only)

Plan and decisions: [RECIPE-PLAN.md](RECIPE-PLAN.md). Full history and findings: [JOURNEY.md](JOURNEY.md).
Known-good reference state to diff against: [reference/REFERENCE-STATE.md](reference/REFERENCE-STATE.md).
The Carbon + llama.cpp recipe on `main` ([../RECIPE.md](../RECIPE.md)) is separate and untouched.

## Quick start

1. **Reserve** (manual) the TechZone environment above. Note FQDN, OS user, key path. IBM VPN required.
2. **Launch** - tell Bob: *"Build Launchpad on IBM Power. Repo branch feature/launchpad-power-cpu, FQDN ..., user ..., key ..."*.
   Bob copies [remote-launch.sh](remote-launch.sh) to the VM and runs it; it clones the branch and starts
   `scripts/run-all.sh` under `nohup` (log: `~/launchpad-deploy.log`).
3. **Watch** the log; the run stops at the first failing step, fix the cause and resume with
   `bash ~/Carbon-GenAI-Demos/launchpad/scripts/run-all.sh <step>`.
4. **Use** `https://catalog-ui.<public-ip>.nip.io:8443` (user `admin`, password in `~/.launchpad-admin-pw` on the VM).

## Steps

| Script | What it does |
|---|---|
| `scripts/01-host-prep.sh` | packages, linger, user podman socket, `sentient` group + limits, SELinux module (+ udica templates) |
| `scripts/02-build-cli.sh` | build `ai-services` CLI from tag v0.4.0 (+ vLLM reduced-scale patch, `LP_APPLY_VLLM_PATCH=0` to skip) |
| `scripts/03-ollama.sh` | Ollama container, `granite4`, alias `ibm-granite/granite-4.0-micro` |
| `scripts/04-catalog.sh` | `catalog configure` (pty password wrapper), `catalog login`, register `ollama` bundle |
| `scripts/05-apps.sh` | create extract1 / summarize1 / rag1, start Stopped pods, healthcheck fix, wait healthy |
| `scripts/06-smoke-test.sh` | one call per service, PASS/FAIL table |
| `scripts/run-all.sh` | runs 01-06; 02-06 in a fresh `sudo -iu` session so new group/limits apply |

Optional (not written yet): 07 sample data (Kaggle + AIX PDFs), 08 Carbon front end; the `invoice-review` custom
service bundle is in `bundles/invoice-review/` (see its README).

## Rules that must never be broken

- Never run plain `ai-services bootstrap configure` (reduces SMT 64 to 16, SELinux and Spyre checks).
- Always `--runtime podman --skip-validation power,spyre`.
- No secrets in the repo; the admin password is generated on the VM (mode 600).
