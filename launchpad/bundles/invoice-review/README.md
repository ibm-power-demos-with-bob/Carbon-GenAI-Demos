# invoice-review bundle (v0.2.0: Carbon UI, mock extraction, simulated export)

Custom Launchpad service with its own Carbon UI: extraction queue, side-by-side PDF review with editable fields, and a
simulated export dialog (IBM i Db2 / AIX Oracle connections, "Inspect extracted data" JSON). Extraction is MOCK data
(`sample-data.js`), export is SIMULATED. It still proves the BYOS mechanism and the injected LLM component (our `llm--ollama` bundle). Design notes: `launchpad/JOURNEY.md` ("DECISION 2026-11-16").
Modelled on upstream `docs/dev-guides/byos/custom-chatbot`.

Layout: bundle = this directory; source + Containerfile = `launchpad/services/invoice-review/`.

## Deploy on the Power VM (IBM VPN; user/key/host from the reservation)

Always `export XDG_RUNTIME_DIR=/run/user/$(id -u)` first. Never run plain `bootstrap configure`.

```bash
cd ~/Carbon-GenAI-Demos            # this branch cloned on the VM: git clone --branch feature/launchpad-power-cpu ...
# 1. Build the image locally (ppc64le, base = ubi9/nodejs-22)
podman build -t localhost/invoice-review:0.2.0 launchpad/services/invoice-review
# 2. Package: ONE top-level directory in the archive
tar -czf /tmp/invoice-review.tar.gz -C launchpad/bundles invoice-review
# 3. Register (the CLI binary on the reference VM is ai-services-reduced; same flags as for llm--ollama)
ai-services-reduced catalog bundle create --file /tmp/invoice-review.tar.gz     # check `catalog bundle --help` for exact flags
ai-services-reduced catalog bundle list
```

Then in the catalog UI (https://catalog-ui.<ip>.nip.io:8443) deploy "Invoice Review (demo)" with the Ollama LLM
component and open its UI link. The queue should list 7 sample invoices. To prove the LLM wiring separately, open
`https://invoice-review-<slug>.<ip>.nip.io:8443/api/hello` (calls the injected LLM; expect a Granite reply).

## Checks to record in JOURNEY.md
- Bundle accepted (`201`) and listed; any `422` text.
- Deploy form shows only `Log level` (from `values.schema.json`).
- Deployments row shows a UI link; the queue page loads, a Review opens the PDF + fields, Export shows both connections.
- The image build (`npm ci` + `vite build`) works on ppc64le: the main unproven risk (native optional packages).
- `/api/hello` returns a Granite reply (proves `llm.host/port/model` injection and routing to LiteLLM).
- `podman inspect <ctr> --format '{{json .Config.Healthcheck.Test}}'`: if it shows bare `curl` or an empty command, apply the
  `podman update --health-cmd` fix noted for embedding/reranker (podman 6.1.1 probe translation bug). Our probes use
  `httpGet`, so expect to need it.
- `localhost/` image + `imagePullPolicy: Never` is accepted by the worker (else push to a local registry).


