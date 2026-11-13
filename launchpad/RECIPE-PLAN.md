# Launchpad on IBM Power (CPU-only) - recipe plan

> Purpose: turn the validated spike (`LAUNCHPAD-SPIKE.md`) into a recipe that Bob can run against ANY fresh
> TechZone reservation ("Here is the GitHub link, build it"), same pattern as the existing `RECIPE.md`
> (Carbon UI + llama.cpp), which stays untouched.
> Created 2026-11-13. Status: PLAN - nothing below is implemented yet.

## Guiding rules

1. **The VM is a snapshot, the repo is the source of truth.** Reservations expire, so nothing the recipe needs may exist only on a VM.
2. **Capture, do not re-type.** Scripts are derived from what actually worked on the spike VM (shell history, files, `podman inspect`), not rewritten from memory.
3. **Idempotent, re-runnable, logged.** Same shape as `deploy-carbon-genai.sh`: numbered steps, `nohup` launcher, live log, safe to re-run after a failure.
4. **No secrets in the repo.** Catalog admin password is chosen by the user at build time (or generated onto the VM, mode 600). Kaggle token stays on the user's PC.
5. **Acceptance test = a brand-new reservation**, timed, logged in `launchpad/FRESH-INSTANCE-TEST.md`. Until that passes the recipe is "drafted", not "done".
6. Separate files from the Carbon recipe; "stock Launchpad UIs first, Carbon pages only where Launchpad has no equivalent".

## Target file layout

```
launchpad/
  RECIPE-PLAN.md               <- this file
  RECIPE-LAUNCHPAD.md          <- recipe front matter + quick start (same style as RECIPE.md)
  FRESH-INSTANCE-TEST.md       <- timed log of each fresh-reservation run
  remote-launch.sh             <- clone repo on VM, run deploy under nohup, log to ~/launchpad-deploy.log
  scripts/
    01-host-prep.sh            <- podman, golang, linger, podman.socket, sentient group, limits, subuid/subgid, SELinux module
    02-build-cli.sh            <- ai-services CLI from tag v0.4.0 (+ patch ONLY if still needed, see Open question 1)
    03-ollama.sh               <- Ollama container, pull granite4, create alias ibm-granite/granite-4.0-micro (+ thread cap, see Open question 3)
    04-catalog.sh              <- catalog configure (pty password wrapper), catalog login, register llm--ollama bundle
    05-apps.sh                 <- create rag1 / extract1 / summarize1, start Stopped pods, apply healthcheck fix, wait until healthy
    06-smoke-test.sh           <- one call per service + one Q&A question; prints PASS/FAIL table
    07-sample-data.sh          <- OPTIONAL: Kaggle datasets + AIX 7.3 PDFs, then ingest
    08-carbon-front-end.sh     <- OPTIONAL v1.1: deploy Carbon UI + llama-proxy with LAUNCHPAD_*_URL set
  lib/
    pty-answer.py              <- replaces ~/run_with_pw2.py (answers "password:" / "authentication:" prompts)
  patches/vllm-cpu-reduced-scale.patch
  selinux/                     <- ai_services_nonroot_policy.cil + notes on the udica base/net container templates
  bundles/ollama-llm/          <- already in repo (verify it contains the /tokenize shim)
.bob/skills/deploy-launchpad-power-cpu.md   <- Bob skill: reserve -> ssh check -> launch -> monitor -> verify -> known failures
```

## Phases

### Phase A - Harvest from the spike VM (do FIRST, while the VM is alive; reservation was extended but still ends)
VM: `pvm1-im68e57k.p1370.pok-systems.techzone.ibm.com`, key `%TEMP%\bob\lucas_p1370.pem`, IBM VPN required.
Copy into the repo (never the password/token files):
- `~/.bash_history` and any `~/*.sh` / `~/*.py` helpers (`run_with_pw2.py`, `launchpad-create.sh` is obsolete) - source of truth for the exact commands.
- `~/src/vllm-cpu-reduced-scale.patch`; the SELinux `.cil` plus the udica-generated `base_container.cil` / `net_container.cil` and the exact `semodule` commands.
- `/etc/security/limits.d/memlock.conf`, `/etc/systemd/system/user-1001.slice.d/limits.conf`, the `limits.conf` line, group/`usermod` commands.
- The Ollama container run command: `podman inspect ollama-service` (image, ports, volumes, env).
- Final bundle: diff `~/bundles/ollama-llm/` against `launchpad/bundles/ollama-llm/` (confirm `/tokenize` shim is in the repo copy).
- `podman ps`, `application ps`, `catalog bundle list`, CLI version, OS release, `lscpu`, `free -g`, `df -h`: record as the "known-good reference state" for comparison with a fresh build.
- The healthcheck fix commands and the `podman inspect ... Healthcheck.Test` outputs for all containers.

### Phase B - Settle the open questions on the spike VM (cheap experiments)
1. Does stock CLI v0.4.0 work with `llm.ollama=true` (no vllm-cpu LLM)? Embedding/reranker are vllm-cpu: do THEY need the KV/memory patch? If the patch is unnecessary, drop step 02's patch and download a release binary if one exists for ppc64le (otherwise still build from source).
2. Is `application create` deterministic regarding the "Stopped pods" quirk after the healthcheck fix? (script must handle both cases anyway).
3. Ollama thread cap (`PARAMETER num_thread 24` / `OLLAMA_NUM_PARALLEL=2`) - measure Digitize time per tiny PDF; target < 10 s.
4. Catalog admin password: can the user choose it at build time (`catalog configure` prompt) rather than `--reset-password`? Test on the fresh reservation, not here.
5. How the Q&A UI is opened from the catalog UI (or simply document the direct URL pattern `https://chat-bot-ui-<slug>.<ip>.nip.io:8443`).

### Phase C - Write the recipe (repo only, no VM needed)
1. Scripts 01-06 from the harvested material; each prints `STEP n/N`, exits non-zero on failure, supports re-run.
2. Derive environment-specific values at run time (no hard-coding): public IP for the `nip.io` host names, OS user, uid (`/run/user/<uid>`), basedir `/home/<user>/ai-services`.
3. `RECIPE-LAUNCHPAD.md` (front matter: name `launchpad-power-cpu`, platform `6a7aba1916c56f06e4b1e910`, 8 vCPU / 50 GB / >=90 GB disk, `skills:` entry), `remote-launch.sh`, Bob skill with a "Known failure modes" section seeded from the spike gotchas:
   - never run plain `bootstrap configure` (SMT 64->16, SELinux, Spyre);
   - `--runtime podman --skip-validation power,spyre` always;
   - `XDG_RUNTIME_DIR=/run/user/<uid>` over ssh;
   - `host.containers.internal` for container -> Ollama;
   - `/tokenize` shim; healthcheck `podman update --health-cmd`; Stopped pods; 409 `RESOURCE_LOCKED` on re-ingest;
   - multi-line ssh scripts via stdin ending with `echo END`; `application create` accepts `ollama` only as LLM alias.
4. Optional steps 07/08 behind flags so v1 can ship without them.

### Phase D - Prove it on a fresh reservation (the acceptance test)
1. User books a NEW reservation MANUALLY (the TechZone MCP is unreliable: `userVariables` bug, different defaults), platform `6a7aba1916c56f06e4b1e910`, purpose **Demo** (needs an ISC opportunity number, which the user can get easily): 4 days initially, up to 3 extensions of 4 days each (16 days max). Time pressure is therefore low; still target a < 2 h build. The recipe/skill treats the reservation as a MANUAL, user-supplied input (FQDN, OS user, key path); the MCP is optional and not relied on.
2. Tell Bob only: GitHub link + FQDN + key + user. Do not hand-fix anything; every manual fix becomes a script/skill change and the run restarts from a clean state where practical.
3. Run `06-smoke-test.sh`; record timings and fixes in `FRESH-INSTANCE-TEST.md`.
4. Repeat until a run needs zero manual intervention. Then tag the repo, push to `ibm-power-demos-with-bob/Carbon-GenAI-Demos`, later PR into the Client Engineering repo.

### Phase E - Optional demo layer
Carbon pages (Extract / Summarize / PII, invoice page: Digitize -> Extract -> JSON) via the existing `/launchpad/*` proxy; AIX Q&A repository; Kaggle invoice/receipt set. Add to the recipe as v1.1 once A-D are solid.

## Open questions for the user
- Which RHEL minor version / image does the spike VM run, and should the recipe pin it (the existing recipe notes RHEL 10.2 default)? (Bob can read this from the VM in Phase A.)
- ANSWERED 2026-11-13: Demo reservation, booked manually (4 days + 3 x 4-day extensions); no 12 h constraint.
- Repo home (no answer yet; working default = same repo, branch `feature/launchpad-power-cpu`, `launchpad/` self-contained with no dependency on the rest of the repo, so it can be lifted into its own repo or the Client Engineering `Recipes/` folder later). The VM clones from GitHub, so the branch must be committed AND pushed to `origin` before the fresh-VM test.
- v1 scope: stop at stock Launchpad UIs + smoke tests (Phases A-D), with the Carbon layer as v1.1? (Current assumption: yes.)
