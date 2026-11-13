# Reference state of the validated VM (captured 2026-11-13)

Purpose: the "known good" end state a fresh build should reproduce. Captured read-only from the reference VM
(TechZone "AI-Ready RHEL on IBM Power On-Premises"). No secrets in this file.
Use it to diff a fresh reservation against the validated one (Phase D).

## Host
| Item | Value |
|---|---|
| OS | RHEL 10.2 (Coughlan), ppc64le |
| CPU | POWER10, 8 cores, SMT-8 (64 logical CPUs; `/sys/devices/system/cpu/smt/control` = `on`) - SMT must NOT be reduced |
| RAM / disk | 48 GiB / 90 GB root (`/dev/mapper/rhel-root`), ~49 GB used with everything deployed |
| SELinux | `SELINUX=permissive` in `/etc/selinux/config` (image default), module `ai_services_nonroot_policy` loaded |
| User | per-reservation OS user (here `UKZ0WUS`, uid 1001), groups `wheel`, `sentient` (gid 1003) |
| subuid/subgid | `<user>:589824:65536` (set up by the image; verify on a fresh VM) |
| Linger | **`Linger=no` was observed** although the notes said enabled; sessions stayed up because an SSH session was open. Recipe MUST run `sudo loginctl enable-linger <user>` |
| podman.socket (user) | enabled + active |
| RHN | validation says "System is registered with RHN" - the image is pre-registered; a fresh VM must pass this check |
| Packages added | `podman 6.1.1`, `golang 1.27.3`, `udica 0.2.8` (git/curl/jq/python3 3.12 were present) |
| Limits files | `/etc/security/limits.d/memlock.conf`: `@sentient - memlock unlimited`; `/etc/security/limits.conf`: `@sentient hard nofile 134217728`; `/etc/systemd/system/user-<uid>.slice.d/limits.conf`: `[Slice] LimitNOFILE=134217728 LimitMEMLOCK=infinity` |
| Public IP used for nip.io | `hostname -I` first address (here 129.40.98.74) -> `https://<service>.<ip>.nip.io:8443` |

## CLI
- `ai-services-reduced` = upstream tag **v0.4.0** + `launchpad/patches/vllm-cpu-reduced-scale.patch`, built with Go 1.27.3 (`Version: v0.4.0-reduced-scale`, ~148 MB binary in `~/bin`). Stock build (`~/bin/ai-services`, ~145 MB) also exists. Whether the patch is still needed is an OPEN QUESTION (Phase B).
- Public images only: `icr.io/ai-services/*` (anonymous pull). Versions in use: ai-services v0.0.418, catalog-ui v0.0.94, chatbot-service v0.0.36, chatbot-ui v0.0.55, digitize-service v0.0.74, digitize-ui v0.0.37, extract-service v0.0.17, similarity-service v0.0.21, summarize-service v0.0.26, litellm v1.101.2-0, opensearch 3.8.0-ppc64le, postgres 18-6, caddy v2.11.4-4, tools 0.13, ai-services-mcp v0.0.4, vllm-ppc64le 0.28.0 and 0.31.0 (embedding / reranker).
- Container storage after everything: ~16 GB under `~/.local/share/containers`, plus HF model weights under `<basedir>/models`.

## Ollama (host-level container, shared)
`podman run` equivalent (from `podman inspect ollama-service`): image `icr.io/ppc64le-oss/ollama-ppc64le:v0.17.6`, cmd `serve`, `-p 11434:11434`, named volume `ollama-models:/root/.ollama`, env `OLLAMA_HOST=0.0.0.0:11434`, `--restart always`.
Models: `granite4:latest` (2.1 GB, id 4235724a127c) and alias `ibm-granite/granite-4.0-micro:latest` (same id, created with `ollama cp`).
Reached from Launchpad containers via `http://host.containers.internal:11434` (NOT the public IP).

## Catalog / apps
- Catalog (caddy, postgres db, backend, UI, local worker) at `https://catalog-ui.<ip>.nip.io:8443`, `--basedir /home/<user>/ai-services --https-port 8443`, configured with `--runtime podman --skip-validation power,spyre`.
- Bundle `llm--ollama` ("Ollama on IBM Power (CPU)", v1.0.0, active). Repo copy `launchpad/bundles/ollama-llm/` is byte-identical (modulo CRLF) to the VM copy.
- Apps: `rag1` (template `rag`: chat + digitize + similarity, OpenSearch, embedding, reranker, LiteLLM->Ollama), `extract1` (`extract`), `summarize1` (`summarize`), all created with `--runtime podman --skip-validation power,spyre --params llm.ollama=true` (rag1 also `embedding.vllm-cpu=true,reranker.vllm-cpu=true`).
- Creation log for rag1 is ~13 polling lines, then "Application 'rag1' is ready!". A failed create is possible (extract1 first attempt timed out on readiness before the `/tokenize` shim existed).

## Healthcheck finding (corrected 2026-11-13, during harvest)
Symptom: embedding and reranker (vLLM on CPU) containers restart in a loop (`RestartCount` 36+), `rag1` shows Error in the catalog UI.
Facts established on podman 6.1.1:
- The template's healthcheck has a **start-period of 2 min and on-failure action `restart`** (12 retries x 30 s).
- `podman healthcheck run` on a container whose health config has a **non-zero start-period fails instantly (~10 ms, rc 1, even for the command `true`)**; with `--health-start-period 0s` the same command works (rc 0, status `healthy`). Other pods (summarize, litellm, catalog-ui) have working probes and are unaffected.
- `podman update --health-cmd ...` alone did not clear the start-period (inspect still showed 2m0s after the earlier "fix"), so the containers kept being killed. vLLM itself comes up in ~1m45s-7m (log: "Application startup complete").
- Working fix, applied to the reference VM and verified (`podman healthcheck run` rc 0, status healthy, `application ps` no unhealthy):
  `podman update --health-cmd 'curl -f http://localhost:8001/health || exit 1' --health-start-period 0s --health-retries 20 embedding-<id>-embedding`
  `podman update --health-cmd 'curl -f http://localhost:8002/health || exit 1' --health-start-period 0s --health-retries 20 reranker-<id>-reranker`
  (`podman update` takes ONE container per call; retries 20 x 30 s = 10 min tolerance for the slow CPU start; keep on-failure `restart` so real failures still recover). Setting start-period to a non-zero value (tried 15m) makes it WORSE.
- Recipe: apply to both containers right after every `application create`, then loop until `podman healthcheck run` returns 0 for both and `application ps` shows no `unhealthy`. The fix is lost if the CLI recreates the containers.
## Not found on the VM (so cannot be harvested)
- `~/.bash_history` does not exist (history is not kept), so the exact historic commands come from `launchpad/JOURNEY.md`, the `*-create.log` files and the CLI help; scripts must be validated on a fresh VM.
