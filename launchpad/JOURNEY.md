# Launchpad work — findings (branch `feature/launchpad-power-cpu`)

> **READ FIRST:** this file is a chronological log. The authoritative current state is the **CHECKPOINT section at the very end**.
> Sections marked [SUPERSEDED] / [RESOLVED] are history.
> First validation: 2026-11-12. Environment: TechZone "AI-Ready RHEL on IBM Power On-Premises",
> RHEL 10.2, **Power10**, 8 cores (SMT-8, 64 logical CPUs), 48 GiB RAM, 90 GB disk. No Spyre.
> No credentials are stored in this file or in the repo.

## What was set up on the VM (existing "Test GenAI for Lucas" reservation)

| Item | State |
|---|---|
| Podman 6.1.1 (rootless) | installed with `sudo dnf install podman`, linger enabled |
| `ollama-service` | `icr.io/ppc64le-oss/ollama-ppc64le:v0.17.6`, port 11434, volume `ollama-models`, `--restart=always`, model `granite4:latest` (2.1 GB) |
| `vllm-micro` | `icr.io/ppc64le-oss/vllm-ppc64le:0.31.0`, port 8000, `ibm-granite/granite-4.0-micro` (bf16, 6.4 GB in `~/vllm-models`). **Stopped** to free ~18 GB; restart with `podman start vllm-micro` (about 160 s to healthy) |
| `~/bin/ai-services` | Launchpad / AI Services CLI v0.4.0 (downloaded only, not bootstrapped) |
| Existing demos | untouched: `main` demo on :3000/:3001, LSEG demo on :3003, llama.cpp on :8080 |

## Benchmark — same Granite 4.0 Micro class, same prompts, run sequentially (3-run averages)

| Backend | Prompt | TTFT | Decode | Prefill |
|---|---|---|---|---|
| llama.cpp (Q4_K_M) | short, 27 tok | 0.19 s | 30.1 tok/s | 143 tok/s |
| llama.cpp | extract, 770 tok | 6.13 s | 22.3 tok/s | 126 tok/s |
| Ollama (`granite4`) | short, 26 tok | 0.20 s | 26.4 tok/s | 128 tok/s |
| Ollama | extract, 769 tok | 3.21 s | 20.6 tok/s | 239 tok/s |
| vLLM 0.31.0 (bf16) | short, 48 tok | 0.25 s | 9.0 tok/s | 192 tok/s |
| vLLM | extract, 791 tok | 0.89 s | 8.5 tok/s | 892 tok/s |

Reading it:
- **Decode:** llama.cpp ~ Ollama (22-30 tok/s) and vLLM is about 3x slower (~9 tok/s). So the earlier
  "vLLM is slower than Ollama" observation holds for generation speed.
- **Prefill / time to first token:** vLLM is far faster on long prompts (0.89 s vs 3.2 s Ollama vs 6.1 s llama.cpp
  for ~770 tokens). RAG and document prompts are long, so this matters.
- Rough end-to-end for a 770-token prompt and a 128-token answer: Ollama ~9.4 s, llama.cpp ~11.9 s, vLLM ~15.9 s.
  vLLM overtakes as the prompt grows (about 3-4k+ tokens of RAG context) or the answer is short.
- Caveats: n=3, output lengths differed between backends, vLLM is bf16 vs 4-bit for the others
  (a quantised vLLM model may close the decode gap — untested). Other demos were idle.
- Memory: vLLM ~18 GB (incl. 8 GB KV cache), Ollama ~2.7 GB, llama-server ~2.5 GB.

## Launchpad / AI Services on this platform — facts

**Product position (IBM Docs, Launchpad introduction):** Launchpad is "designed for Power10 and Power11 systems" and
integrates with *multiple* inferencing backends, of which Spyre is one. Spyre and Power11 are therefore **not**
product requirements. The v0.4.0 CLI's validators are stricter than the product (the `power` rule checks for the
string "power11" in cpuinfo — still true on current `main`). Worth raising upstream.

**Escape hatch (read from the source, not yet exercised):** `application create`, `catalog configure` and
`worker join` all run the bootstrap validation, and each accepts `--skip-validation <rule,rule>`.
Rule names: `numa`, `rhel`, `power`, `rhn`, `spyre`, `usergroup`, `ulimits`, `slicelimits`. A skipped rule logs a
warning ("may result in deployment failure"). So the expected command on this VM is
`--skip-validation power,spyre` (after `usergroup`/`ulimits` are fixed by `bootstrap configure`).
There is also a separate `rag-cpu` application template alongside `rag` and `rag-dev`.

- `ai-services bootstrap validate --runtime podman` **fails 4 checks** on this VM:
  1. `power`: CLI check wants **IBM Power11** — this platform only offers Power10 (skippable; see above).
  2. `spyre`: CLI check wants an attached Spyre card (skippable; see above).
  3. `usergroup`: `sentient` group missing (fixable by `bootstrap configure`).
  4. `ulimits`: `/etc/security/limits.d/memlock.conf` missing (fixable). Without it, rootless Podman cannot
     apply the `nofile=134217728` ulimit the Launchpad pod templates request
     (`crun: setrlimit RLIMIT_NOFILE: Operation not permitted`).
  Passed: NUMA = 1, RHEL >= 9.6, RHN registered, systemd slice limits.
- `application create` **is** gated by the same validation (confirmed in source), but the gate is skippable. The CLI
  documents a CPU mode: `ai-services application create rag --template rag --params reranker.vllm-cpu=true,llm.vllm-cpu=true`.
- The stock `rag-cpu` podman template requests **100 Gi** for the vLLM instruct container (+5 Gi embedding,
  +5 Gi reranker) and 8 Gi for OpenSearch. It cannot run unmodified in 48 GiB; it needs a reduced-scale values file
  (small Granite model, lower `VLLM_CPU_KVCACHE_SPACE`).
- Outbound access from the VM works to icr.io, GitHub, Hugging Face and registry.ollama.ai.

## Other observations

- `llama.cpp` on the VM was built with `GGML_BLAS=OFF`, but the recipe brief says "OpenBLAS". Reconcile the wording.
- `passporteye` is crash-looping under pm2 on this VM (not investigated).
- The failed reservation "Rework of GenAI to use Launchpad" asked for `ram_gb` = `"200"` (string) where the working one
  had `50` (number); cause not confirmed (capacity vs type).

## Next steps [SUPERSEDED - see CHECKPOINT at end]
1. Run `ai-services bootstrap configure` (needs sudo; creates the `sentient` group and ulimits), then
   `ai-services application create <name> --template rag-cpu --skip-validation power,spyre` with a reduced-scale
   values file (the stock template wants 100 Gi for the LLM). Fallback: run the same component images by hand.
2. Try a quantised Granite model under vLLM to see whether decode speed improves.
3. Add the Ollama / vLLM / llama.cpp backend toggle to the Carbon app (`/api/chat` route from the lab branch).
4. Try the Digitize service with an image/scanned PDF to see whether it replaces the PassportEye element.
5. Extend the reservation (ends 2026-11-15) and rotate the TechZone API token that was pasted into chat.

---

## Session 2 checkpoint (2026-11-12, late) — Launchpad catalog bring-up on the VM

**Status:** Launchpad catalog control plane is mostly deployed on the VM but its API backend is not yet running. Nothing
is committed on branch `feature/launchpad-power-cpu`; this file is the only new tracked-to-be file.

### Corrections / decisions
- Launchpad supports Power10 and Power11; Spyre is optional (IBM Docs intro). The v0.4.0 CLI `power`/`spyre` validators
  are overly strict and are bypassed with `--skip-validation power,spyre` (works on `bootstrap`, `catalog configure`,
  `application create`).
- **Do NOT run plain `ai-services bootstrap configure`** on this VM: it also sets SMT to 2 persistently (64 -> 16 logical
  CPUs, would hurt the running demos and invalidate benchmarks), changes SELinux policy and tries Spyre setup.
  Instead only the additive pieces were applied by hand (see below).
- v0.4.0 public images are `icr.io/ai-services/*` (anonymous pull works; `podman manifest inspect` gives false FAILs, use
  `podman pull`). `main` uses private `icr.io/ai-services-cicd/*` — do not use.
- Stock vllm-cpu component hard-codes `VLLM_CPU_KVCACHE_SPACE=32` and a 150Gi memory limit -> unusable in 48 GiB.
  A reduced build was made: `~/bin/ai-services-reduced` (v0.4.0 + 2-line template patch: KV 32->4, memory 150Gi->24Gi).
  Patch saved on VM at `~/src/vllm-cpu-reduced-scale.patch`; source at `~/src/project-ai-services` (tag v0.4.0).
  Build cmd: `CGO_ENABLED=0 go build -trimpath -tags 'exclude_graphdriver_btrfs containers_image_openpgp remote' -ldflags "-X ...version.Version=v0.4.0-reduced-scale ..." -o ~/bin/ai-services-reduced ./cmd/ai-services` (Go 1.27.3 from dnf).

### Changes made to the VM (all additive, none touch the existing demos)
1. `sudo dnf install podman golang`; linger enabled; `systemctl --user enable --now podman.socket`.
2. Manual equivalent of configure steps 2/4/5: group `sentient` (+ user added), `/etc/security/limits.d/memlock.conf`,
   `@sentient hard nofile 134217728` line in `/etc/security/limits.conf`,
   `/etc/systemd/system/user-1001.slice.d/limits.conf`. `bootstrap validate` now fails only `power` and `spyre` (skipped).
3. Ollama container `ollama-service` (:11434, granite4) left running. vLLM test container `vllm-micro` stopped.
4. `ai-services-reduced catalog configure --runtime podman --basedir /home/UKZ0WUS/ai-services --https-port 8443
   --skip-validation power,spyre` (run via `~/run_with_pw.py`, a pty wrapper; the generated admin password is in
   `~/.launchpad-admin-pw` on the VM, mode 600 — never print it or commit it).
   Result: pods `ai-services--caddy`, `--db` (postgres), `--catalog` deployed; `catalog-ui` healthy, **`catalog-backend`
   stuck in "Created"** (pod Degraded) so the API returns 502 and the automatic admin login failed.

### Root cause found, fix attempted [RESOLVED in Session 3: the policy also needed the udica base/net container templates]
- `podman start ai-services--catalog-backend` fails: `crun: /proc/self/attr/keycreate: unable to process security
  attribute`. The backend runs under SELinux type `ai_services_nonroot.process`, which only exists after configure
  step 7 (CIL module `ai_services_nonroot_policy`).
- Fix: install only that module: copy `ai_services_nonroot_policy.cil` (content = `RootlessPodmanSocketPolicyContent`
  in `ai-services/internal/pkg/utils/selinux/policies.go`; a copy was written to the local Bob temp dir) to the VM and
  run `sudo semodule -i /tmp/ai_services_nonroot_policy.cil`, then `podman start ai-services--catalog-backend`.
  **First thing next session: check `sudo semodule -l | grep ai_services` and the backend container state.**

### Next steps (in order) [SUPERSEDED - see CHECKPOINT at end]
1. Verify/apply the SELinux module; start `ai-services--catalog-backend`; confirm
   `https://catalog-api.129.40.98.74.nip.io:8443/` responds and the UI at `https://catalog.129.40.98.74.nip.io:8443/` loads
   (nip.io must resolve from the browser's network; accept the self-signed cert).
2. `ai-services-reduced catalog login --server https://catalog-api.129.40.98.74.nip.io:8443 --username admin --insecure`
   (password from `~/.launchpad-admin-pw`, pipe with `--password-stdin`).
3. Run `~/launchpad-create.sh` (already on the VM): `application create launchpad --template rag --runtime podman
   --skip-validation power,spyre --params llm.vllm-cpu=true,embedding.vllm-cpu=true,reranker.vllm-cpu=true,llm.vllm-cpu.model=ibm-granite/granite-4.1-3b`.
   Watch RAM (about 43 GiB available; `free -g`). Fallback model: `ibm-granite/granite-4.0-micro` (already downloaded
   at `~/vllm-models/granite-4.0-micro`, but the CLI downloads into its own `<basedir>/models`).
4. Try the Digitize UI with a scanned image/passport page (can it replace PassportEye?).
5. Add the Ollama / vLLM / llama.cpp backend toggle to the Carbon app (`/api/chat` route from
   `Carbon-GenAI-Demos-lab1127`), then commit this branch.
6. Housekeeping: extend the TechZone reservation (ends 2026-11-15 13:55), rotate the TechZone API token that was pasted in
   chat, fix the crash-looping `passporteye` pm2 process, and delete `$env:TEMP\bob\lucas_p1370.pem` when finished.

### Access (no secrets here)
- Reservation "Test GenAI for Lucas", id `6af473b4f471100e048f9e6a`; host `pvm1-im68e57k.p1370.pok-systems.techzone.ibm.com`
  (129.40.98.74), user `UKZ0WUS`. SSH key: `%TEMP%\bob\lucas_p1370.pem` (re-download from the reservation's
  "OS user SSH private key" if lost). Use `-o ControlMaster=no -o BatchMode=yes`; send multi-line shell via
  stdin (`... | ssh ... "bash -s"`) — nested quotes break in the PowerShell tool.
- Podman needs `export XDG_RUNTIME_DIR=/run/user/1001` in non-login ssh sessions.

### Starting a new task — paste this [SUPERSEDED - use the CHECKPOINT prompt at end]
> Continue the Launchpad work on branch `feature/launchpad-power-cpu` in `c:\BobWorkSpace\Carbon-GenAI-Demos`.
> Read `launchpad/JOURNEY.md` (especially "Session 2 checkpoint") first. The VM is the existing TechZone reservation
> "Test GenAI for Lucas" (SSH key in `%TEMP%\bob\lucas_p1370.pem`). Step 1: check whether the SELinux module
> `ai_services_nonroot_policy` is installed (`sudo semodule -l | grep ai_services`) and fix/start
> `ai-services--catalog-backend`; then log in to the catalog and run `~/launchpad-create.sh`. Do not run plain
> `bootstrap configure` (it changes SMT). Ask me for the TechZone token if you need the API again.

---

## Session 3 update (2026-11-12) — catalog backend fixed, logged in

**Status:** Launchpad catalog control plane is fully up. Catalog CLI is logged in as `admin`. The RAG application has **not** been created yet.

- Root cause of the failed SELinux install: the CIL policy does `blockinherit container` / `net_container`, which come from
  `/usr/share/udica/templates/base_container.cil` and `net_container.cil` (package `udica`), not from the `container-selinux` .pp module.
  Upstream installs all three files in one `semodule -i` call (`spyreconfig/spyre/repair.go`).
- Fix applied: `sudo dnf install udica`, then
  `sudo semodule -i /tmp/ai_services_nonroot_policy.cil /usr/share/udica/templates/base_container.cil /usr/share/udica/templates/net_container.cil`
  (additive, no SMT/SELinux-mode change; SELinux is **Permissive** on this VM).
- `podman start ai-services--catalog-backend` -> healthy; `/health` 200; `ai-services-reduced catalog login ... --insecure` succeeded.
- Not checked: UI reachability from the browser (nip.io + self-signed cert). `curl` from the VM to the nip.io hostnames returns 000 for the UI.
- Headroom before create: 43 GiB available, 62 GB disk free; all existing demos (pm2 `genai-*`, `nextjs-lseg`) online.

### Next steps (updated) [SUPERSEDED - see CHECKPOINT at end]
1. Run `~/launchpad-create.sh` on the VM (watch `free -g`; stop the app if available RAM drops below ~6 GiB).
2. Open the catalog UI in a browser, then try Digitize with a scanned page.
3. Remaining items from Session 2 steps 5 and 6 (backend toggle in the Carbon app, commit, housekeeping, extend reservation ending 2026-11-15).

### DECISION (2026-11-12, user) - direction for this branch
**Policy: Launchpad first.** Launchpad is the official version, so use its service wherever one exists for something the
demo already does. Fall back to our own demo code only when (a) Launchpad has no such service (example: PII detection), or
(b) there is a specific reason not to use it (record the reason in the mapping table below).
- **LLM host is Ollama, not llama.cpp and not vLLM.** vLLM on CPU measured ~3x slower on decode (benchmark above); Ollama
  suits demo-scale (short) prompts. The earlier checkpoint omitted this; do not re-open it.
- Launchpad's stock LLM component is vLLM-CPU (8B Granite only, ~100 Gi stock sizing) - too slow/large here. Because the policy
  is Launchpad-first, the open question is HOW to get Launchpad services talking to Ollama, not whether to use them. The
  bundle mechanism (custom `llm` component, `docs/dev-guides/byos/` in the source tree) is a candidate and is NOT ruled out.
- `launchpad-create.sh` (full `rag` app) failed with HTTP 400: model must be `granite-3.3-8b-instruct` or `granite-4.1-8b`.
  The check is server-side (embedded in the catalog-backend image), so the patched CLI cannot relax it. The CLI patch
  (KV 32->4, 150Gi->24Gi) may also not take effect on `application create`; verify before relying on it.
- State on VM: catalog + `Local` worker are up (`ready`). Reconfigure needs `~/run_with_pw2.py` (also answers the
  "authentication:" prompt). UI URL is `https://catalog-ui.129.40.98.74.nip.io:8443` (not `catalog.`).

### Finding: Digitize does NOT cover images / passports in v0.4.0
Read from the v0.4.0 source on the VM (`~/src/project-ai-services`):
- Accepts **PDF and DOCX only** (`allowed_extensions` validator supports only `.pdf`, `.docx`); Docling converter sets
  `pipeline_options.do_ocr = False`. No PNG/JPG input, no OCR, so it cannot read a passport photo or MRZ.
- Depends on `vector_store` + `embedding` + `llm`; backend container requests **50 Gi**. Languages EN/FR/DE/IT.
- So Digitize can replace our *document/PDF text extraction*, but **not PassportEye** as it stands. Not yet checked: upstream
  `main` (may add OCR/images; its images are private `icr.io/ai-services-cicd`).
- `extract` service (JSON-schema entity extraction from text) is tiny (1 CPU, 1 Gi), depends only on `llm`: a strong
  candidate to replace our own entity-extraction path, if it can be pointed at Ollama.

### Mapping table: demo capability -> Launchpad service (to be completed)
| Demo capability | Launchpad v0.4.0 service/component | Decision |
|---|---|---|
| Entity extraction (text -> JSON) | `extract` | Use Launchpad (needs LLM wiring to Ollama) |
| Document/PDF digitisation, RAG indexing | `digitize` + `vector_db` + `embedding` | Use Launchpad (PDF/DOCX only; 50 Gi backend; check RAM) |
| Summarisation | `summarize` | Use Launchpad (needs LLM wiring) |
| Translation | `translate` | **Keep our demo.** Reason (user, 2026-11-12): official service is English<->German only; our entity-extraction demo handles more languages |
| Chat / Q&A over documents | `chat` (+ `similarity`, `reranker`) | Use Launchpad (needs LLM wiring) |
| Passport / ID image reading (PassportEye) | none (Digitize has no OCR/images) | Keep PassportEye for now; revisit with upstream `main` |
| PII detection/redaction | none | Keep our demo implementation |
| Other demo use cases | not yet mapped | Map each of the 18 against the catalog |

### Finding: a route to Launchpad-on-Ollama (BUILT in Session 3 - see result below)
- Launchpad v0.4.0 LLM components: `vllm-cpu`, `vllm-spyre`, `watsonx`. The `watsonx` podman component is just the official
  image `icr.io/ai-services/litellm:v1.101.2-0` (a LiteLLM proxy) configured with `WATSONX_URL/PROJECT_ID/APIKEY` and
  `INSTRUCT_MODEL=watsonx/<model>`, exposing an OpenAI-compatible endpoint with the injected `.Values.llm.*` contract.
- LiteLLM natively supports Ollama (`ollama_chat/<model>` with api_base `http://<host>:11434`). So a **custom `llm` bundle**
  (component_type `llm`, id e.g. `ollama`) copied from `components/llm/watsonx/podman`, with the three watsonx env vars
  replaced by an Ollama api_base and model, would let every Launchpad service (`extract`, `summarize`, `translate`, `chat`,
  `digitize`) use our Ollama while staying on official images. Tiny RAM (no model in the pod). Bundle format:
  `docs/dev-guides/byos/02-bundle-structure.md` (top-level `metadata.yaml` + `podman/{metadata.yaml,values.yaml,
  values.schema.json,templates/*.tmpl}`, `podTemplateExecutions`, tar.gz, `catalog bundle create --file`).
- Open questions: does the server accept a custom `llm` component in place of the built-in ones for a service (docs say
  injection key is the component type, so likely yes); do services hard-code the model name (`granite-3.3-8b-instruct`)
  in prompts; embedding still needs a CPU option (`embedding/vllm-cpu` only) for `digitize`/`chat`.
- Suggested first target: `extract` (depends only on `llm`, 1 CPU / 1 Gi).

### Session 3 result: `ollama` LLM bundle built, validated and registered (2026-11-12)
- Standalone test: official `icr.io/ai-services/litellm:v1.101.2-0` with env `INSTRUCT_MODEL=ollama_chat/granite4:latest`,
  `WATSONX_URL=http://host.containers.internal:11434`, dummy `WATSONX_APIKEY`/`WATSONX_PROJECT_ID` -> OpenAI-compatible
  `/v1/chat/completions` answered correctly in ~1.3 s. **No code change needed** (the image config is fully env-driven).
  Note: `http://<host public IP>:11434` from inside the container does NOT work (connect fails); use `host.containers.internal`.
- Bundle source on VM: `~/bundles/ollama-llm/` (+ `ollama-llm.tar.gz`): top-level `metadata.yaml` (id `ollama`,
  component_type `llm`), `podman/{metadata.yaml,values.yaml,values.schema.json,templates/ollama-server.yaml.tmpl}`.
  Based on the `watsonx` component with the secret layer removed. Registered: bundle id `8a7239fc-02d3-483d-a336-12857481e9b6`,
  catalog id `llm--ollama`, status active. `application templates --runtime podman` now lists `ollama` as an LLM provider for
  `summarize`, `extract`, `translate`, `chat`, `digitize`. (Copy the bundle source into the repo next, e.g. `launchpad/bundles/ollama-llm/`.)
- Architecture `rag` = services chat + digitize + similarity. `summarize`, `extract`, `translate` are standalone services.
  `chat`, `digitize`, `similarity` also need `vector_store: opensearch` and `embedding: vllm-cpu` (embedding is only vllm-cpu,
  ~5 Gi) and `similarity` needs `reranker` (vllm-cpu).
- Caveat: LiteLLM image routes `/tokenize` to a watsonx-only path. Only the `chatbot` service calls it (token counting);
  extract/summarize/digitize do not appear to. Chat may need a small /tokenize shim for Ollama.
- Input data: Kaggle "Company Documents Dataset" (ayoubcherguelaine) proposed as Digitize input; page needs JS/login so
  file types are UNVERIFIED. Digitize accepts only PDF/DOCX (no OCR), so check the dataset's formats / convert to PDF.

### Next steps (replaces earlier lists) [SUPERSEDED - see CHECKPOINT at end]
1. Find how to deploy a standalone service (`extract`) with `llm=ollama` (try `application templates parameters --template extract
   --runtime podman`, or the catalog UI at https://catalog-ui.129.40.98.74.nip.io:8443). Then test it against a sample email/invoice.
2. Deploy `rag` architecture pieces for Digitize: opensearch (8 Gi) + embedding vllm-cpu (5 Gi) + digitize (50 Gi limit!) with
   llm=ollama. Check RAM first; the 50 Gi backend limit may need a reduced bundle copy of `digitize`.
3. Get the Kaggle dataset onto the VM (needs Kaggle credentials from the user) and try Digitize on a PDF/DOCX sample.
4. Wire the Carbon app to call Launchpad services (extract/digitize) with the demo code as fallback; keep PII and passport in-demo.
5. Housekeeping: copy bundle source into repo, commit branch, extend reservation (ends 2026-11-15), rotate TechZone token,
   delete `%TEMP%\bob\lucas_p1370.pem` when finished.

### Session 3 end state (2026-11-12) - first service deploy attempt: model-download blocker [RESOLVED - ollama alias, see CHECKPOINT]
- Deploy command that gets furthest (needs `--runtime podman`, otherwise the CLI panics with a nil pointer on `--skip-validation`):
  `~/bin/ai-services-reduced application create extract1 --template extract --runtime podman --skip-validation power,spyre --skip-model-download --params llm.ollama=true`
- It fails at `COMMAND_TYPE_DOWNLOAD_MODEL`: the worker treats the component's `model` value (`granite4:latest`) as a Hugging Face repo
  and tries to download it (exit 1). `--skip-model-download` does not stop this server-side step. The failed app was deleted
  (`application delete extract1 --runtime podman --yes`); re-check with `application ps` that nothing is left behind.
- Ideas, in order of preference (untested):
  1. In Ollama, create an alias with an HF-style name that really exists, e.g. `ollama cp granite4:latest ibm-granite/granite-4.0-micro`,
     and set the bundle `model` to that. The worker download then succeeds (6.4 GB into `<basedir>/models`, disk is fine: 62 GB free)
     and LiteLLM still calls Ollama. Slightly wasteful, but zero hacks in the platform.
  2. Rename the bundle's `model` value (e.g. `ollamaModel`) so no download is triggered. Risk: services read `.Values.llm.model`
     from the component's `model` key, so this may break the injection contract.
  3. Check the download code path (`COMMAND_TYPE_DOWNLOAD_MODEL`, worker side) in `~/src/project-ai-services` for a skip rule.
- After this works: use `extract1` against a sample email/invoice, then summarize/translate, then the Digitize path.
- Context-window note: this session ran long; start the next one from the paste prompt below.

### Starting a new task - paste this [SUPERSEDED - use the CHECKPOINT prompt at end]
> Continue the Launchpad work on branch `feature/launchpad-power-cpu` in `c:\BobWorkSpace\Carbon-GenAI-Demos`.
> Read the END of `launchpad/JOURNEY.md` first (sections "DECISION", "Finding: a route to Launchpad-on-Ollama",
> "Session 3 result", "Session 3 end state"). Policy: Launchpad first, own demo code only where Launchpad has no service (PII,
> passport) or there is a stated reason; LLM host is Ollama (not vLLM, not llama.cpp). The `ollama` LLM bundle is registered in
> the catalog on the VM ("Test GenAI for Lucas", SSH key `%TEMP%\bob\lucas_p1370.pem`). Next: fix the model-download blocker
> (try the `ollama cp` alias idea), get `extract` running, then Digitize. Do not run plain `bootstrap configure`.

### Finding (user, from the TechXchange lab guide): embeddings do NOT have to be vLLM [embedding--ollama bundle DEFERRED: start with stock embedding, see later section]
- Lab setup (screenshot): containers `ollama-granite` (:11434) + `opensearch-vectordb` (:9200/:9600). Embedding model
  `granite-embedding:latest` served by Ollama: BERT-family GGUF, F16, **30.15M params, 384-dim vectors, 512-token context,
  ~62 MB**. That worked in the lab, so Ollama + OpenSearch is a proven combination for this demo.
- Plan: add a second custom bundle, `embedding--ollama` (component_type `embedding`), same LiteLLM-fronts-Ollama pattern as
  the `llm--ollama` bundle (LiteLLM supports Ollama embeddings). Replaces Launchpad's `embedding/vllm-cpu` (~5 Gi) with ~62 MB
  of model plus a small proxy. Then `chat`, `digitize`, `similarity` need only `opensearch` from the stock catalog.
- Things to check when building it:
  - The embedding component contract: injected `.Values.embedding.{host,port,model,maxModelLen}`; built-in vllm-cpu serves on
    port 8001 (`components/embedding/vllm-cpu/podman`). Copy its metadata/values shape, swap the server for LiteLLM.
  - **Vector dimension must match the OpenSearch index.** Stock model `granite-embedding-278m-multilingual` is 768-dim; the lab
    model is 384-dim. A fresh index is fine, but do not mix. Digitize advertises EN/FR/DE/IT, so the multilingual
    `granite-embedding:278m` in Ollama (if available) may suit better than the 30M English-only model; 512-token context in both.
  - Same blocker as the LLM bundle: the worker tries to download the component's `model` value from Hugging Face. Solve once
    (e.g. the `ollama cp` alias idea) and reuse for both bundles.
  - Pull the embedding model into the running Ollama: `podman exec ollama-service ollama pull granite-embedding` (or `:278m`).

### Design direction (user + Bob, 2026-11-12): one Carbon UI, per-use-case backend [SUPERSEDED by v2 below]
- Keep (no Launchpad equivalent / stated reason): PII detection, Translate (official is EN<->DE only), PassportEye.
- All demo use cases are simple LLM calls, so keep one UI. Add a server-side adapter in the Carbon app (extend `llmClient.js` /
  Next API routes): each use case has `backend: launchpad | local`. `launchpad` calls the service REST API server-side (avoids
  self-signed cert + CORS in the browser); `local` sends our own prompt to Ollama. Config flag lets us fall back per use case.
- Fit: Extract (needs JSON schema + examples + custom prompt, so a thin prompt->schema translation) and Summarize map well.
  Digitize (upload -> job -> result) and Q&A (ingest first) are not single calls and need their own flow/screens.
- UNVERIFIED: service API auth and request/response shapes. Read `ai-services/docs/swagger.yaml` in
  `~/src/project-ai-services` and test against a running `extract` before building the adapter.

### Design direction v2 (user, 2026-11-12) - prefer the OFFICIAL Launchpad UI; supersedes "one Carbon UI" above
- Official UIs exist only for **Digitize** (`digitize-ui`, route port 4001) and **Q&A/chat** (`chatbot-ui`, port 3000). `extract`,
  `summarize`, `similarity`, `translate` are API-only (some expose an MCP route). Catalog UI = deploy/manage only.
- Plan: (1) replace the PassportEye page with the official Digitize UI using the Kaggle company-documents dataset (PDF, which
  Digitize accepts); (2) official chat UI for document Q&A if the demo has such a page; (3) keep our Carbon pages for Extract and
  Summarize but call the Launchpad API server-side (no official UI to use); (4) keep our pages as-is for PII and Translate;
  (5) later option: package the Carbon app as a custom Launchpad *service* bundle (BYOS supports services with a `ui` route) so it
  appears in the catalog alongside the official ones.
- Original demo = 6 pages, each with 3 tabs of variations. NOT yet inventoried: next session, list them from `carbon-ui/src/app`
  and map every page/tab to replace (Launchpad service) or keep (reason).
- Priority change: Digitize and chat need `opensearch` + `embedding`, so the Ollama **embedding bundle** is now on the critical
  path (with the Digitize 50 Gi memory limit reduced via a bundle copy). Extract/Summarize remain the quick first wins.

### Finding: Launchpad UIs are open source and customisable (2026-11-12)
- `~/src/project-ai-services/ui/{catalog,digitize,chatbot}`: all React + Vite + Carbon (`@carbon/react`; catalog/digitize also
  `@carbon/ibm-products`; chatbot uses `@carbon/ai-chat`). Same design system as the Carbon demo app. Each has a Containerfile
  (nginx) and Makefile, so custom images can be built on the VM.
- Options, least to most effort: (1) **package the Carbon demo app as a custom Launchpad service bundle** (image + `podman/`
  template with an `ai-services.io/routes` `...:ui` route; appears in the catalog/deployments with a UI link; custom bundles cannot
  claim `certified_by: IBM`) - RECOMMENDED for our pages; (2) rebuild the official digitize/chatbot UI images with small tweaks and
  reference them from a bundle copy (we already plan a reduced-memory Digitize bundle copy); (3) fork `ui/catalog` to add a Demos
  section - avoid unless needed (fork maintenance).
- UNVERIFIED: catalog UI in a browser (nip.io + self-signed cert from the user's network), how custom services render, and a
  ppc64le container build of the Carbon app.

### Decisions + findings (2026-11-12, later)
- **No upstream contribution intended, so no git fork needed.** Customisation = our own bundles (reduced-memory Digitize copy,
  `llm--ollama`, `embedding--ollama`, Carbon demo as a custom service) plus local image builds on the VM.
- **Why use the Launchpad UI:** built by a design team; aligns with the TechXchange Lab narrative (extend Launchpad with our own
  services; the Spyre story, here shown on Power10 CPU). Our demos become custom Launchpad services next to the official ones.
- **Digitize ships NO demo dataset.** Only test fixtures in `~/src/project-ai-services/ai-services/tests/e2e/ingestion/docs/`:
  `french.pdf`, `german.pdf`, `italian.pdf` (5-6 MB), `test_doc.pdf` (12 MB), `sample_png.pdf`, `sync_test.pdf`, `blank.pdf`; and Q&A golden
  CSVs in `test/golden/` (fr/de/it + golden1/2). Use the fr/de/it PDFs as smoke tests (also supports the multilingual story).
  Use the Kaggle "Company Documents Dataset" (PDF) for the demo itself. Need from user: the dataset zip/PDFs path (preferred over
  sharing Kaggle credentials).

### Verified by user (2026-11-12): catalog UI loads
- `https://catalog-ui.129.40.98.74.nip.io:8443` reaches the login screen from the user's network (self-signed cert accepted). Login: user
  `admin`, password in `~/.launchpad-admin-pw` on the VM (never print/commit). Maintenance flags on `catalog configure` (from docs):
  `--reset-password`, `--reset-certificate` (domain must not change), `--reset-podman-auth`. If the password is reset, re-run
  `catalog login` on the VM (`--password-stdin`, `--insecure`).

### Catalog UI seen by user (2026-11-12, screenshot)
- Header "IBM Power AI Launchpad". Page "Digital assistants" (= `rag` architecture; tabs Deployments / About). Toolbar: search, refresh,
  upload icon (probably bundle upload), column chooser, blue **Deploy**. Table columns: Name, Status, Uptime, Worker resource,
  Worker type, Messages. Empty state "Start by adding a digital assistant" (confirms no leftover deployments).
- To check next (user): hamburger menu sections (where are standalone Extract/Summarize? where do custom services show?),
  and whether the Deploy wizard offers **Ollama on IBM Power (CPU)** as an LLM option. Do NOT complete a Digital assistant
  deploy yet (heavy defaults; model-download blocker unresolved).

### Catalog UI details (screenshots, 2026-11-12)
- Hamburger menu: Digital assistants | Services | Connectors | Worker resources | (separator) Use case references.
- "Deploy digital assistant" wizard: steps 1 Provide assistant details -> 2 Configure services -> 3 Select data sources (deploy happens at the end).
  Step 1 fields: Name (default "Digital assistant (copy)"), version v1.0.0, Vector store = OpenSearch, Embedding model dropdown =
  granite-embedding-278m-multilingual (stock), Deployment type = Red Hat Enterprise Linux (RHAIIS) [selected] or Red Hat OpenShift (RHOAI),
  Deployment location > Worker resource = `Local` (+ refresh). Buttons Cancel / Back / Next.
- Implications: embedding provider/model is chosen on step 1 (our `embedding--ollama` bundle should appear there once registered);
  LLM is probably step 2 (check whether "Ollama on IBM Power (CPU)" is offered); Connectors = data sources for Digitize;
  `Local` worker is visible to the UI. Not yet seen: the Services page, Connectors page, wizard step 2.

### Catalog UI: Services page + embedding dropdown (user, 2026-11-12)
- Services page has tabs Deployments / Catalog. Six cards, all "IBM certified": **Digitize, Extract, Summarize, Translate** have a
  standalone **Deploy** button; **Find similar items** and **Question and answer** are "Part of digital assistants" (no standalone deploy).
  So Digitize CAN be deployed standalone from the UI (still needs OpenSearch + embedding + LLM).
- Wizard embedding dropdown lists ONLY `granite-embedding-278m-multilingual` (rigid, like Spyre: use what ships).
- **Revised decision: start with the STOCK embedding (vllm-cpu, 278m multilingual, 768-dim, ~5 Gi).** Official, multilingual (fits
  the fr/de/it test PDFs), embedding is prefill-bound where vLLM is strong (892 tok/s in benchmark). The `embedding--ollama` bundle
  is deferred; build it only if stock proves too slow/heavy here. The `llm--ollama` bundle is still needed (LLM decode is the slow part).
- User deleted the failed `extract1` from the UI; VM verified clean (`application ps`: none; only worker/catalog/db/caddy pods).
- Still unseen: wizard step 2 (does it offer "Ollama on IBM Power (CPU)"?), Connectors page.

### Standalone "Deploy service" wizard (user screenshots, 2026-11-12)
- Steps: Select service (Digitize / Extract / Summarize / Translate cards) -> Provide service details (Name "Service deployment", version
  v1.0.0, deployment type RHEL (RHAIIS) vs OpenShift (RHOAI), worker resource `Local`) -> Configure services.
- Configure services (Extract): Resource requirements Processors 9/63 vCPUs (ok), Memory 201/2 GB (amber), Accelerators 4/0 cards (amber),
  Disk 60 GB. Card "Extract information" with **Edit** link; shows LLM granite-3.3-8b-instruct and LLM inference backend
  "Red Hat AI Inference with Spyre" (the default). The big numbers come from the default Spyre LLM, not from Extract itself
  (Extract = 1 CPU/1 Gi). Amber = warning only; Deploy stays enabled. "/2 GB" is probably free (not available) RAM.
- The resource panel is computed from the `resources` block in each component/service `podman/metadata.yaml` (user's insight
  confirmed in source). Editable only in our own bundles. Custom bundles cannot reuse built-in IDs or claim IBM certification, so a
  reduced-memory Digitize needs its own id (e.g. `digitize-power-cpu`) and appears as a custom service.
- Pending: click **Edit** on the card and see which LLM backends are offered (is "Ollama on IBM Power (CPU)" listed?).

### Session 4 update (2026-11-13) — Extract and Summarize services live; PII mapped to Extract; demo flow refined

- **Container stability root cause & comparison with Henrik's setup:**
  - Henrik's screenshot showed a working `vllm-spyre-rhel9:3.5.0` container on `lab1127sp` (a dedicated Spyre accelerator node), where vLLM serves native `/v1/models`, `/v1/chat/completions`, `/health`, and `/tokenize`.
  - On our Power10 VM (without Spyre hardware), we skip validation with `--skip-validation power,spyre` and serve models via Ollama fronted by the official LiteLLM proxy (`llm--ollama` bundle).
  - The reason `extract-api` and other service containers were crash-looping during deployment was that Launchpad services (`extract`, `summarize`, `digitize`, `chatbot`) execute `POST <llm>/tokenize` during lifespan startup in `calculate_prompt_overhead_tokens()`. LiteLLM defaulted `/tokenize` to a watsonx pass-through route which returned 500 against Ollama, failing startup.
  - **Fix applied:** Updated `llm--ollama` bundle's pod template (`ollama-server.yaml.tmpl`) to route `/tokenize` in LiteLLM to an internal Python tokenization handler running inside the container on port 8001.
  - **Result for Extract:** Bundle updated in catalog; `extract1` deployed cleanly (`ai-services-reduced application create extract1 --template extract --runtime podman --skip-validation power,spyre --params llm.ollama=true`). All 3 pods (`extract-db`, `extract-api`, `llm-ollama`) reached `running (healthy)`. Tested sync extraction API on `https://extract-api-1b993f18e9.129.40.98.74.nip.io:8443/v1/extract` (6.0s response).
  - **Result for Summarize:** Deployed `summarize1` (`ai-services-reduced application create summarize1 --template summarize --runtime podman --skip-validation power,spyre --params llm.ollama=true`). All 3 pods (`summarize-db`, `summarize-api`, `llm-ollama`) reached `running (healthy)`. Tested sync summarisation API on `https://summarize-api-a55b5cd8c0.129.40.98.74.nip.io:8443/v1/summarize` (2.3s response).
  - **PII Extraction:** Verified against the official `extract` service endpoint using a structured PII JSON schema — successfully extracted names, accounts, emails, phones, and credit cards in 8.5s.
  - **Demo Experience Strategy:** Keep rich pre-loaded domain data (Hans Gies logistics quote, multilingual IT tickets, call center transcripts) in the Carbon UI with 1-click execution. UI routes requests to official Launchpad services (`/v1/extract`, `/v1/summarize`) with fallback to local Ollama.

### CHECKPOINT (2026-11-13, Session 4) [SUPERSEDED by Session 5b CHECKPOINT at the very end; policy/gotchas here still apply]
**One-line status:** Launchpad catalog + worker + both `extract1` and `summarize1` services are fully running and healthy on Power10 CPU; PII verified via Extract API; bundle sources tracked in `launchpad/bundles/ollama-llm/`. Next milestone: Digitize & OpenSearch vector database in fresh context.

#### Policy and decisions (all agreed with the user)
1. **Launchpad first.** Use the official Launchpad service/UI wherever one exists for something the demo does. Keep our own code only when
   Launchpad has no equivalent or there is a stated reason (record it in the mapping table).
2. **Keep our own:** PII detection (no Launchpad service), Translate (official is English<->German only; ours handles more languages).
   **Passport/PassportEye is dropped**: replaced by official Digitize (PDF/DOCX only, no OCR/images in v0.4.0) using the Kaggle
   "Company Documents Dataset" (PDF). Digitize ships NO demo data; fr/de/it/test PDFs in `~/src/project-ai-services/ai-services/tests/e2e/ingestion/docs/`
   are usable as smoke tests.
3. **LLM host = Ollama** (not vLLM-CPU: ~3x slower decode; not llama.cpp). Reached from Launchpad via our own bundle (LiteLLM proxy in front of Ollama).
4. **Embedding = stock Launchpad `granite-embedding-278m-multilingual` (vllm-cpu)** to start; the UI only offers that one (rigid, like Spyre). An
   `embedding--ollama` bundle (lab used `granite-embedding` 30M, 384-dim, via Ollama) is deferred unless stock proves too slow/heavy.
   Vector store = OpenSearch (stock).
5. **UI:** prefer the official Launchpad UIs. Official UIs exist only for Digitize and Q&A chat; Extract/Summarize/Similar/Translate are API-only.
   Keep our Carbon pages for use cases that are not replaced (and for Extract/Summarize front ends calling the Launchpad API server-side).
   Later: package the Carbon demo as a custom Launchpad *service* bundle (BYOS supports a `ui` route) so it appears in the catalog.
6. **No fork / no upstream contribution.** Customise via our own bundles (new IDs; cannot reuse built-in IDs or claim IBM certification) and local image builds.
7. Digitize backend reserves 50 Gi (own bundle copy with a new id, e.g. `digitize-power-cpu`, to reduce). Digitize CAN be deployed standalone from the UI.

#### Mapping table (demo capability -> decision)
| Capability | Decision |
|---|---|
| Entity extraction (text -> JSON) | Launchpad `extract` (first target; test multilingual samples) |
| Summarisation | Launchpad `summarize` |
| Document/PDF digitisation | Launchpad `digitize` (official UI) with Kaggle PDFs; replaces PassportEye |
| Document Q&A / RAG | Launchpad `chat` (official UI), part of the Digital assistant; needs OpenSearch + embedding |
| Similarity | Launchpad `similarity` (needs reranker; only vLLM options exist) - decide if the demo needs it |
| Translation | KEEP ours (reason above) |
| PII detection/redaction | KEEP ours (no Launchpad service) |
| Passport/PassportEye | DROPPED (replaced by Digitize) |
| The 6 original pages x 3 tabs | NOT YET INVENTORIED: list from `carbon-ui/src/app` and map each to replace/keep |

#### What is on the VM (reservation "Test GenAI for Lucas", host `pvm1-im68e57k.p1370.pok-systems.techzone.ibm.com`, user `UKZ0WUS`, ends 2026-11-15)
- CLI `~/bin/ai-services-reduced` (v0.4.0 + template patch KV 32->4, mem 150Gi->24Gi; the patch only affects built-in vllm-cpu templates rendered by the CLI, not server-side
  validation). Source `~/src/project-ai-services` (tag v0.4.0; read-only use, one local patch). Always pass **`--runtime podman`** with `--skip-validation power,spyre` (otherwise the CLI panics).
- Catalog: `https://catalog-ui.129.40.98.74.nip.io:8443` (login `admin`; password in `~/.launchpad-admin-pw`, mode 600; user has it). API `https://catalog-api.129.40.98.74.nip.io:8443`.
  CLI is logged in (`catalog login ... --insecure --password-stdin`). `Local` worker `ready` (created by re-running `catalog configure` with `~/run_with_pw2.py`, which
  answers both "password:" and "authentication:" prompts). SELinux (Permissive) module `ai_services_nonroot_policy` installed with the udica `base_container.cil`/`net_container.cil`.
- Bundle `llm--ollama` (id `8a7239fc-02d3-483d-a336-12857481e9b6`, source `~/bundles/ollama-llm/` + `ollama-llm.tar.gz`, NOT yet copied into the repo). Model value is
  `ibm-granite/granite-4.0-micro`, an **Ollama alias** (`ollama cp granite4:latest ibm-granite/granite-4.0-micro`) so the platform's Hugging Face model download succeeds while
  LiteLLM calls Ollama. UI shows it in the LLM dropdown as "granite4 (Granite 4.0 Micro)" (Edit on the service card). LiteLLM reaches Ollama at
  `http://host.containers.internal:11434` (the host's public IP does NOT work from containers). HF weights (6.4 GB) now sit in `<basedir>/models`; disk ~50 GB free, RAM ~36-40 GiB available.
- `~/launchpad-create.sh` (full `rag` app) is OBSOLETE: it fails server-side (LLM must be an 8B Granite). Do not use.
- Existing demos untouched (pm2 `genai-*`, `nextjs-lseg`, llama.cpp :8080, Ollama :11434 with `granite4`, `vllm-micro` stopped). `passporteye` pm2 process crash-loops (now irrelevant).

#### Current blocker: `/tokenize`
`extract-api` restarts every ~5 s (30+ restarts, exit 0, no OOM). `app.py` lifespan -> `calculate_prompt_overhead_tokens` -> `_tokenize` POSTs `{"prompt": ...}` to `<llm>/tokenize`.
The LiteLLM image's `/app/config.yaml` routes `/tokenize` (pass-through) to `http://localhost:8000/watsonx/ml/v1/text/tokenization`, which returns 500 against Ollama
(verified: `{"error": {"message": "Internal server error"}}`). Other services (digitize, summarize, chat) probably use `tokenize_with_llm` too (`services/common/llm_utils.py:603`).
Also confirm `initialize_models` / `/v1/models` works through LiteLLM.
**Fix plan:** in the bundle template, override LiteLLM config with an inline ConfigMap mounted at `/app/config.yaml` (keep the env-driven `model_list`; change the `/tokenize`
pass-through target to a sidecar on :8001) and add a tiny sidecar (same litellm image, small python script) answering `POST /tokenize {"prompt"}` in the shape `tokenize_with_llm` parses
(read the function to get the exact response shape; an approximate tokenizer is acceptable for a demo). Bump nothing else: `bundle update <id> --file` works when no instance is running.

#### Next steps, in order
1. [DONE] Implement the `/tokenize` shim in `llm--ollama`; update the bundle; deploy `extract1`:
   `~/bin/ai-services-reduced application create extract1 --template extract --runtime podman --skip-validation power,spyre --params llm.ollama=true`.
   All 3 pods healthy; tested sync extraction API on `https://extract-api-1b993f18e9.129.40.98.74.nip.io:8443/v1/extract`.
2. Deploy Summarize service (`summarize`) using `llm=ollama` and test summarisation API.
3. Digitize: deploy stock embedding (`granite-embedding-278m-multilingual`) + OpenSearch + reduced-memory bundle copy of Digitize; test with test PDFs in `tests/e2e/ingestion/docs/`, then Kaggle PDFs in official Digitize UI.
4. Inventory Carbon demo app's pages/tabs; wire Carbon pages to Launchpad API server-side where applicable.
5. Housekeeping: bundle sources committed to repo (`launchpad/bundles/ollama-llm/`), commit branch `feature/launchpad-power-cpu`.

#### Needed from the user
- The Kaggle "Company Documents Dataset" (zip or PDFs; path on this PC) - preferred over sharing credentials.
- Optional: the TechXchange lab guide link/details (embedding settings, chunking) if we build the Ollama embedding bundle.

#### Gotchas
- Do NOT run plain `ai-services bootstrap configure` (sets SMT=2 etc.). Podman over ssh needs `export XDG_RUNTIME_DIR=/run/user/1001`. Send multi-line shell via stdin (`... | ssh ... "bash -s"`);
  a trailing CR on the last line breaks commands, so end the script with an `echo END` line. `catalog configure` re-run is idempotent and is the only way to (re)join the local worker.
- Notes file encoding: edit with UTF-8 aware tools (a PowerShell `Get-Content` without `-Encoding UTF8` double-encoded the em dashes once; repaired).

#### Paste this to start a new task
> Continue the Launchpad work on branch `feature/launchpad-power-cpu` in `c:\BobWorkSpace\Carbon-GenAI-Demos`. Read the **CHECKPOINT at the very end of `launchpad/JOURNEY.md`** first.
> Status: Launchpad catalog + worker + `extract1` and `summarize1` services are fully live and healthy on Power10 CPU. PII verified via Extract API. Next step: Deploy and configure Digitize (PDF/DOCX ingestion) + OpenSearch vector store with sample PDFs, and wire the UI front-end adapter. Do not run plain `bootstrap configure`.

### CHECKPOINT (2026-11-13, Session 5b) - AUTHORITATIVE CURRENT STATE
**One-line status:** VALIDATION PASSED. The stock Launchpad `rag` (Digital assistant: Digitize + Q&A chat + Similarity, OpenSearch, embedding, reranker) plus `extract1` and `summarize1` all run healthy on a Power10 CPU-only TechZone VM (no Spyre; 8 cores = 64 SMT8 threads, 48 GiB RAM) with our `llm--ollama` bundle as the LLM. Slow-ish but workable. Next milestone: turn this into a recreatable recipe for a fresh reservation.

#### User direction (2026-11-13) - supersedes anything earlier
- Lucas's existing demo on this VM (pm2 `genai-*`, `nextjs-lseg`, llama.cpp :8080, Ollama :11434) is unrelated to this work. **Leave it alone**; outages are acceptable, so STOP it if we need resources. **Do not migrate it to Launchpad.** (Ollama :11434 is shared: our LLM bundle uses it, so do not stop `ollama-service`.)
- Goal 1: validate Launchpad works in TechZone without Spyre and with reduced CPUs; "not fast, just not unworkable". **Done, see results.**
- Goal 2: a recreatable recipe like the existing one (user gives Bob the GitHub link; Bob builds everything on a NEW TechZone reservation from scratch). Repo: https://github.com/ibm-power-demos-with-bob/Carbon-GenAI-Demos . Later pulled into the official Client Engineering repo once the recipe is tested.

#### Validation results (this VM, all via public nip.io HTTPS routes, Granite 4.0 Micro through Ollama)
| Capability | Result |
|---|---|
| Extract (`/v1/extract`, text -> JSON) | 4.5-6 s; PII schema 8.5 s |
| Summarize (`/v1/summarize`) | 2.3 s |
| Digitize ingest (stock, 4 PDFs, ~6 MB each, docling + embed + index) | 47 s total; backend peak 3.5 GB RSS (the 50 Gi limit is NOT a reservation: no custom Digitize bundle needed) |
| Similarity search (retrieve + rerank on CPU) | retrieve 0.04-0.2 s, rerank 1.3-1.5 s |
| Q&A chat (`/v1/chat/completions`, RAG) | ~20 s for a 250-token answer; "No documents found" when reranker score < 0.4 (default `score_threshold`) - reranker scores are low on heading-style chunks / cross-language queries, use real domain PDFs and on-topic questions |
| Memory with everything running | ~25 GiB used, ~25 GiB available; disk 49/90 GB |
Deployed with: `ai-services-reduced application create rag1 --template rag --runtime podman --skip-validation power,spyre --params llm.ollama=true,embedding.vllm-cpu=true,reranker.vllm-cpu=true` (accepted by the server: validation only rejects `llm.vllm-cpu` with non-8B models, `ollama` alias avoids that). The CLI-side catalog has NO memory/CPU capacity check, only Spyre-card checks.

#### Endpoints on the VM now (instance slug 8d0442a5da)
Chat UI `https://chat-bot-ui-8d0442a5da.129.40.98.74.nip.io:8443`; Chat API `https://chat-bot-backend-8d0442a5da...`; Digitize UI `https://digitize-ui-8d0442a5da...`; Digitize API `https://digitize-backend-8d0442a5da...`; Similarity API `https://similarity-api-8d0442a5da...`. Extract `extract-api-1b993f18e9`, Summarize `summarize-api-a55b5cd8c0` (unchanged). For the proxy adapter set `LAUNCHPAD_DIGITIZE_URL` to the new Digitize API (the old `f263c99684` instance is deleted).

#### Quirk to encode in the recipe
During `application create` the **embedding and reranker pods end up `Stopped`** (events: `pod create` then `pod stop` one second later; containers stay `Created`). The CLI then either errors (`... is in state: Stopped`, seen with digitize1) or finishes while they are stopped (rag1). Fix: `podman pod start <embedding-pod> <reranker-pod>` (export `XDG_RUNTIME_DIR=/run/user/1001` first); they need ~3-4 min until healthy (probe initial delay 120 s). [The later restart loop was the broken healthcheck, see "ROOT CAUSE found" below; the initial Stopped state itself is still unexplained.] Recipe step: after create, loop over `podman pod ps` for Stopped pods and start them, apply the healthcheck fix, then wait for `application ps` all healthy.

#### Cleanup done this session
- Deleted app `digitize1` and catalog bundle `digitize-power-cpu` (also removed from the repo; the stock Digitize works). `launchpad/bundles/` now only has `ollama-llm/`. Old `~/bundles/digitize-power-cpu*` removed from the VM.

#### Recipe work: what has to be scripted (inventory; details are in the earlier sections of this file, which should be split per the content-file-size rule when the recipe is written)
1. Reserve (TechZone MCP platform `6a7aba1916c56f06e4b1e910`, RHEL, Power10, 8 vCPU/50 GB as in the existing recipe; check that RHEL minor version and disk (>=90 GB) suit) and fetch FQDN/user/key.
2. Host prep: podman rootless + `XDG_RUNTIME_DIR`, SELinux Permissive module `ai_services_nonroot_policy` (udica `base_container.cil`/`net_container.cil`), SMT handling (do NOT run plain `bootstrap configure`), subuid/subgid, linger.
3. Build the `ai-services-reduced` CLI from tag v0.4.0 with the vllm-cpu template patch (KV 32->4, mem 150Gi->24Gi) - only matters for `llm.vllm-cpu`; with Ollama as LLM the stock CLI may be enough: VERIFY before keeping the patch.
4. `catalog configure` (use `~/run_with_pw2.py`-style prompt answering) -> catalog UI/API + local worker; `catalog login`.
5. Ollama + `granite4` pull + `ollama cp granite4:latest ibm-granite/granite-4.0-micro`; bundle `llm--ollama` from `launchpad/bundles/ollama-llm/` (with the `/tokenize` shim) via `catalog bundle create`.
6. Deploy `rag1` (+ `extract1`, `summarize1`); start Stopped pods; wait healthy; smoke tests (sample PDFs from `~/src/project-ai-services/ai-services/tests/e2e/ingestion/docs/`, one question per service).
7. Optional: Carbon UI + llama-proxy `/launchpad/*` adapter (needs the Carbon pages switched; see Session 5 notes) - decide whether the first recipe version includes it.
8. Recipe files in the repo style: `RECIPE.md` front matter (new recipe, e.g. `launchpad-power-cpu`), a Bob skill under `.bob/skills/`, `deployment/` scripts, a TechZone-reservation section, FRESH-INSTANCE test log. Then TEST on a brand-new reservation (that is the real acceptance test).

#### Decisions (user, 2026-11-13, answering the open questions)
- The new recipe is a **separate set of files** (e.g. `launchpad/RECIPE-LAUNCHPAD.md`); the existing `RECIPE.md` (Carbon UI + llama.cpp) is useful, working, and stays untouched.
- "v1" means v1 of THIS Launchpad variant. Direction: **move to the Launchpad UIs wherever that makes sense** (more official feel); keep Carbon UI/proxy only where Launchpad has no equivalent. v1 = stock Launchpad UIs (catalog, Chat, Digitize, Extract/Summarize) + smoke tests; the proxy adapter is optional for v1.
- Sample data (user-supplied):
  - **Digitize demo** (not ideal for Q&A): Kaggle `ayoubcherguelaine/company-documents-dataset` (Northwind-style, English), `jakubgal/generated-invoices` (multilingual European synthetic invoices + JSON ground truth), `jenswalter/receipts` (German scanned receipts: Digitize does not do images well, see earlier finding; test first), `heliosmg4/english-synthetic-invoice-dataset-20-free-samples` (20 English invoices, quickest live walkthrough). Kaggle needs login/token: user downloads (or provides a token). Do not commit the PDFs; the recipe documents how to fetch them.
  - **Q&A demo:** the AIX 7.3 PDFs linked from https://www.ibm.com/docs/en/aix/7.3.0?topic=aix-pdfs (dynamic page, loads after a moment: use the Chrome DevTools MCP or find direct PDF URLs). Suits "which command does X" questions. Time ingestion of 2-3 of the large PDFs on CPU first (the test PDFs ran ~12 s each at ~6 MB).

#### Proxy adapter (code is in the repo; recorded here because the earlier Session 5 notes were lost)
`carbon-ui/src/llama-proxy/server_final.js` mounts `/launchpad/extract|summarize|digitize/*` -> the Launchpad API (prefix stripped, `changeOrigin`, `secure:false`, body streamed so multipart works), each only if `LAUNCHPAD_EXTRACT_URL` / `LAUNCHPAD_SUMMARIZE_URL` / `LAUNCHPAD_DIGITIZE_URL` is set (full https nip.io API URLs). Tested locally from the PC (extract returned `{"name":"Hans Gies","pallets":4}`, multipart Digitize upload returned a job id). NOT deployed on the VM; Carbon pages still call llama.cpp via `llmClient.js`. API shapes: Extract `POST /v1/extract {text, json_schema|schema_id|schema_name}` -> `data.extraction`; Summarize `POST /v1/summarize`; Digitize `POST /v1/jobs?operation=ingestion|digitization&output_format=json|md|txt` (multipart field `files`), `GET /v1/jobs`, `/v1/documents`, `/v1/documents/{id}/content`; Chat `POST /v1/chat/completions`, `GET /db-status`; Similarity `POST /v1/similarity-search {query,mode,top_k,rerank}`. Nothing is committed yet (stage selectively; many unrelated `.ipynb_checkpoints` deletions in the tree).

#### Sample data downloaded + CPU ingestion finding (2026-11-13, later in Session 5b)
- Kaggle token works: `~/.kaggle/kaggle.json` on the PC, `pip` package `kaggle` 2.2.4 (no `kaggle` CLI on PATH; use `kaggle.api.authenticate()` + `kaggle.api.dataset_download_files(slug, path=..., unzip=True)` as `presales-demos/watsonx-data-power-demo/setup/6-load-ibmi-olist.py` does). Data is in `C:\BobWorkSpace\launchpad-sample-data\` (OUTSIDE the repo, not committed):
  - `company-documents-dataset`: 2,676 tiny text PDFs (invoices 830, PurchaseOrders 830, Shipping orders 809, inventory reports ~207; 2-8 KB each) + `company-document-text.csv`. Best Digitize demo set (use ~10-20 per type). 
  - `english-synthetic-invoice-dataset-20-free-samples`: 20 **PNG** images + JSON, NOT PDFs -> not usable with Digitize (no image/OCR support); drop it.
  - `generated-invoices`: 746 PDFs (90-350 KB) + JSON/txt ground truth.
  - `receipts`: 1,252 scanned PDFs (~470 KB each; de/hotel/restaurant/retail etc.); OCR behaviour untested.
- **Finding: Digitize on CPU is LLM-bound.** `services/common/llm_utils.py::summarize_and_classify_tables` sends EVERY table to the LLM (up to 32 parallel workers). With Ollama on all 64 threads this pegs the VM (load avg 55-65, Ollama at ~5800% CPU), starves the vLLM embedding pod (liveness failures: embedding restarted 4 times, `Up N minutes (starting)`) and slows ingestion to ~25-30 s per tiny invoice PDF (9 invoice/PO/shipping PDFs took ~5 min; the 4 marketing PDFs earlier took 47 s because they have few tables). Still completes, but marginal for live demo. Jobs `t-company` (done), `t-geninv` (3 PDFs, slow, may still be running); the `receipts` test was never submitted. Test files are in `/tmp/lp-sample/{company,geninv,receipts}` on the VM.
- **Mitigations to test next (recipe-relevant):** (1) cap Ollama CPU use: replace `ollama cp` with `ollama create ibm-granite/granite-4.0-micro -f Modelfile` (`FROM granite4:latest` + `PARAMETER num_thread 24`) and/or `OLLAMA_NUM_PARALLEL=2`, `OLLAMA_MAX_QUEUE`; (2) relax embedding/reranker liveness probes or give them CPU priority; (3) demo with small batches (5-10 docs) and pre-ingest before the audience arrives; (4) measure again with the cap: target <10 s per tiny PDF. Q&A demo set: AIX PDFs (not yet fetched).


#### Demo flow decided + validated (2026-11-13, user): Digitize -> Extract -> JSON
- User decisions: demo ONE invoice/receipt (not batch): Digitize it, Extract fields as JSON; JSON "could be loaded or sent" to a DB/system (talk about it; no real DB step needed). Q&A uses a document repository (AIX PDFs) whose ingest can run overnight. Login for catalog UI given to user (`admin`, password from `~/.launchpad-admin-pw`); setting a memorable password via `catalog configure --reset-password` NOT yet tried (risk to catalog pods/worker; recipe should let the user choose the password at build time, test on a spare reservation).
- Results (test script `/tmp/flow.py` on the VM: reads `GET /v1/documents/{id}/content` = DoclingDocument JSON from Digitize, flattens `texts` + `tables[].data.grid`, POSTs to `/v1/extract` with an invoice `json_schema`):
  - Generated English invoice PDF (`sample_001`): 1,043 chars -> Extract in 26 s -> correct vendor, number, date, USD total 6069.6 and 5 line items.
  - **Scanned German receipt** (`adidas_20220507_003.pdf`): Digitize OCRs it (output is noisy: "MASfERGARD", "Uatum") but Extract still returns vendor ADIDAS/ORIGINALS, date 22.04.2022, EUR, total 11.99 in 21 s. Good EMEA demo (EUR/VAT receipt). Document type came back wrong (item name) -> tighten the schema/descriptions.
  - Northwind invoice (`invoices_invoice_10248`): Extract returned HTTP 422 with the big invoice schema, but a simplified call on the same text worked (4 s). Likely schema/validation retry failure (no vendor/total in that doc): use schema fields marked optional / simpler schema for this set.
  - Digitize dedupes by file hash: re-uploading an already processed file returns 409 `RESOURCE_LOCKED`; delete the document first (`DELETE /v1/documents/{id}`) to re-run. `GET /v1/documents` max `limit=100`.
  - Full chain for one document is well under a minute of waiting when the VM is idle (digitize ~10-35 s + extract ~20-25 s).


#### ROOT CAUSE found: embedding/reranker restart loop = broken healthcheck (podman 6.1.1 kube translation) (2026-11-13, user saw `rag1` = Error in catalog UI)
- Catalog UI "Digital assistants" showed `rag1` Error: "embedding-... / reranker-... running but unhealthy" while chat/digitize/similarity were Running. Both vLLM containers had `RestartCount=19`.
- Cause: podman 6.1.1 translates the template's `livenessProbe.httpGet` into `Config.Healthcheck.Test = ["CMD-SHELL","curl","-f","http://localhost:8001/health","||","exit","1"]`, i.e. the shell only runs bare `curl` (rc 2), so the probe ALWAYS fails; after `Retries` 12 x 30 s the on-failure action `restart` kills the container (every ~6-8 min, 2 min startup each time). This also likely explains the earlier "pods Stopped after create" quirk and part of the ingestion stalls (my earlier "Ollama starvation" theory is real for load but NOT the only cause).
- Fix (applied, rag1 now all `running (healthy)`): `podman update --health-cmd 'curl -f http://localhost:8001/health || exit 1' embedding-<id>-embedding` and `... :8002/health ...` for `reranker-<id>-reranker`. Recipe step: after every `application create`, run these two `podman update` commands (check the other pods' probes for the same bug: `podman inspect <c> --format '{{json .Config.Healthcheck.Test}}'`, all others were healthy so they are fine). Note: the fix is lost if the CLI recreates the containers (stop/start of the app keeps it).
- Also unknown yet: how to open the Digital Assistant (Q&A) from the catalog UI: no link seen on the Deployments row; direct URL is `https://chat-bot-ui-8d0442a5da.129.40.98.74.nip.io:8443`. User asked whether the Carbon UI can still be used as front end to the Extract/Summarize endpoints: YES (decision below).
- **Decision proposal (agreed in chat 2026-11-13):** Launchpad UIs for Chat Q&A, Digitize and catalog; Carbon pages kept as the demo front end for Extract / Summarize / PII (pre-loaded Hans Gies quote, IT tickets, call transcripts) and an invoice/receipt page chaining Digitize -> Extract -> JSON, all via the `/launchpad/*` proxy adapter in `llama-proxy`.


#### Current VM state and ordered next steps (as of 2026-11-13 ~15:30 UTC)
- VM: apps `rag1` (chat/digitize/similarity + OpenSearch + embedding + reranker + LiteLLM->Ollama), `extract1`, `summarize1`, all `running (healthy)` after the healthcheck fix. `rag1` currently holds ~20 test documents (4 smoke PDFs + 9 company + 3 generated invoices + 3 receipts); no AIX PDFs yet. Nothing was changed on Lucas's demo.
- Not done yet: Ollama thread-cap test (`ollama create ... num_thread`), AIX PDF fetch + overnight ingest, deploying the proxy adapter / Carbon invoice page, changing the catalog admin password, committing (git: `launchpad/`, `launchpad/JOURNEY.md`, `carbon-ui/src/llama-proxy/server_final.js`, `carbon-ui/package.json` modified; stage selectively), splitting this file, the recipe itself.
- **UPDATE 2026-11-13 (user priority): the recipe so the environment can be rebuilt on any fresh reservation. Authoritative plan: `launchpad/RECIPE-PLAN.md`. New order: Phase A harvest VM-only artifacts into the repo (history, helper scripts, patch, SELinux .cil, limits files, Ollama run cmd, healthcheck fix) -> B settle open questions -> C write scripts/recipe/skill -> D acceptance test on a NEW reservation -> E optional Carbon layer. The older order below is superseded where it conflicts. User reserves MANUALLY (MCP unreliable), purpose Demo (ISC opp number), 4 days + up to 3 x 4-day extensions; recipe takes FQDN/user/key as user input. Repo home: working default = same repo/branch, `launchpad/` self-contained; nothing committed yet.**
- Order (older): (1) split this file (index + per-session files); (2) fetch AIX PDFs (Chrome DevTools MCP), start overnight ingest into `rag1`, test Q&A; (3) Ollama cap test; (4) write recipe files (`launchpad/RECIPE-LAUNCHPAD.md`, scripts under `launchpad/`, Bob skill) including the healthcheck `podman update` fix and the Kaggle data fetch; (5) Carbon invoice page via `/launchpad/*` proxy (Digitize -> Extract -> JSON) and Carbon Extract/Summarize/PII pages re-pointed; (6) test the whole recipe on a brand-new reservation; (7) commit + push to `ibm-power-demos-with-bob/Carbon-GenAI-Demos`.
- Secrets: SSH key `%TEMP%\bob\lucas_p1370.pem`, catalog admin password in `~/.launchpad-admin-pw` on the VM (given to the user in chat), Kaggle token `~/.kaggle/kaggle.json` on the PC. Sample data: `C:\BobWorkSpace\launchpad-sample-data\` (outside the repo). Reservation was due to end 2026-11-15; **user extended it on 2026-11-13** so it stays around next week (new end date not yet recorded).

#### Paste this to start a new task
> Continue the Launchpad work on branch `feature/launchpad-power-cpu` in `c:\BobWorkSpace\Carbon-GenAI-Demos`. Read the **end of `launchpad/JOURNEY.md` from "CHECKPOINT (2026-11-13, Session 5b)"** first (long file: step 1 is to split it per the content-file-size rule).
> Status: validation PASSED: stock `rag` + `extract1` + `summarize1` run healthy on Power10 CPU (no Spyre, Ollama LLM bundle); embedding/reranker restart loop was a podman 6.1.1 healthcheck bug, fixed with `podman update --health-cmd`. Demo = Launchpad UIs (Chat, Digitize, catalog) + Carbon pages for Extract/Summarize/PII via the `/launchpad/*` proxy + a Digitize->Extract->JSON invoice page. Lucas's existing demo on the VM is left alone. Next: follow "ordered next steps" (split file, AIX PDFs, recipe, test on a fresh reservation). Do not run plain `bootstrap configure`.


#### Session 6 (2026-11-13, evening) - Phase A harvest started
- Repo is now the source of truth: see launchpad/RECIPE-PLAN.md and launchpad/reference/REFERENCE-STATE.md. Harvested into the repo: lib/pty-answer.py (was ~/run_with_pw2.py), patches/vllm-cpu-reduced-scale.patch, selinux/ai_services_nonroot_policy.cil. Bundle copy in repo verified identical to the VM.
- CORRECTION to the 'ROOT CAUSE' note above: the real problem is a non-zero healthcheck start-period (podman 6.1.1: health run fails instantly during start-period) plus on-failure restart. Fix = podman update --health-cmd ... --health-start-period 0s --health-retries 20 (details in REFERENCE-STATE.md). Applied and verified on the VM; rag1 healthy again.
- Also found: Linger=no on the VM (recipe must enable-linger); no ~/.bash_history exists.
