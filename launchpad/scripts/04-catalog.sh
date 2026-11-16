#!/bin/bash
# STEP 4 - Launchpad catalog (caddy + db + backend + UI + local worker), CLI login, register the `ollama` LLM bundle.
# Idempotent. The admin password is generated on the VM into ~/.launchpad-admin-pw (mode 600) and never printed.
# Never call plain `bootstrap configure`; this uses `catalog configure` with the skip flags.
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"
STEP_TOTAL=6
step 4 "catalog configure, login, ollama bundle"
need_cli

CATALOG_API="https://catalog-api.${PUBLIC_IP}.nip.io:${HTTPS_PORT}"
CATALOG_UI="https://catalog-ui.${PUBLIC_IP}.nip.io:${HTTPS_PORT}"

catalog_healthy() { curl -ksf "${CATALOG_API}/health" >/dev/null; }

if catalog_healthy && [ "${LP_FORCE_CONFIGURE:-0}" != 1 ]; then
  log "catalog already healthy at $CATALOG_API (set LP_FORCE_CONFIGURE=1 to re-run configure)"
else
  log "catalog configure (pty wrapper answers the password prompts)"
  python3 "$LP_DIR/lib/pty-answer.py" "$CLI" catalog configure \
    --runtime podman --basedir "$BASEDIR" --https-port "$HTTPS_PORT" --skip-validation power,spyre
fi

# The backend can stay in "Created" if the SELinux module was missing at first start.
BACKEND="$(container_like 'catalog-backend')"
if [ -n "$BACKEND" ] && [ "$(podman inspect -f '{{.State.Status}}' "$BACKEND")" != running ]; then
  log "starting $BACKEND"
  podman start "$BACKEND" >/dev/null
fi
wait_for 300 "catalog API health" curl -ksf "${CATALOG_API}/health"

[ -f "$PW_FILE" ] || die "$PW_FILE missing - catalog configure did not create the admin password"
log "catalog login"
"$CLI" catalog login --server "$CATALOG_API" --username admin --insecure --password-stdin < "$PW_FILE"

BUNDLE_TAR="/tmp/ollama-llm.tar.gz"
tar -czf "$BUNDLE_TAR" -C "$LP_DIR/bundles" ollama-llm
if "$CLI" catalog bundle list 2>/dev/null | grep -qi 'ollama'; then
  log "bundle exists -> update (only works while no app uses it)"
  "$CLI" catalog bundle update llm--ollama --file "$BUNDLE_TAR" \
    || log "WARN: bundle update failed (app running?) - keeping the existing bundle"
else
  "$CLI" catalog bundle create --file "$BUNDLE_TAR"
fi
"$CLI" catalog bundle list

log "catalog UI: ${CATALOG_UI}  (user admin, password in ~/.launchpad-admin-pw on the VM)"
