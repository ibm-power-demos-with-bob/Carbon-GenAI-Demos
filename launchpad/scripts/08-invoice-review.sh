#!/bin/bash
# STEP 8 (Optional) - Build, package, register, and deploy the custom `invoice-review` Carbon service bundle.
# Idempotent. Requires catalog to be up and logged in (step 4).
# Env knobs:
#   LP_BUILD_INVOICE_IMAGE=1 (default 1) - run `podman build` for the service image
#   LP_DEPLOY_INVOICE_APP=1   (default 1) - create application `invoice-review1`
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"
step 8 "invoice-review custom service (Carbon UI + API)"
need_cli

IMAGE_TAG="localhost/invoice-review:0.2.0"
BUNDLE_DIR="$LP_DIR/bundles"
BUNDLE_NAME="invoice-review"
BUNDLE_TAR="/tmp/invoice-review.tar.gz"
SERVICE_DIR="$LP_DIR/services/invoice-review"

# 1. Build image locally if requested
if [ "${LP_BUILD_INVOICE_IMAGE:-1}" = 1 ]; then
  if [ -d "$SERVICE_DIR" ]; then
    log "building $IMAGE_TAG on $(uname -m)..."
    podman build -t "$IMAGE_TAG" "$SERVICE_DIR" || die "failed to build $IMAGE_TAG"
    log "image $IMAGE_TAG built successfully"
  else
    die "service directory not found at $SERVICE_DIR"
  fi
fi

# 2. Package bundle
log "packaging bundle archive $BUNDLE_TAR"
tar -czf "$BUNDLE_TAR" -C "$BUNDLE_DIR" "$BUNDLE_NAME" || die "failed to tar bundle"

# 3. Register bundle in catalog
if "$CLI" catalog bundle list 2>/dev/null | grep -qi 'invoice-review'; then
  log "bundle invoice-review already registered -> updating"
  "$CLI" catalog bundle update service--invoice-review --file "$BUNDLE_TAR" \
    || "$CLI" catalog bundle update invoice-review --file "$BUNDLE_TAR" \
    || log "WARN: bundle update returned non-zero (keeping existing bundle)"
else
  log "creating catalog bundle invoice-review"
  "$CLI" catalog bundle create --file "$BUNDLE_TAR" || die "failed to create bundle in catalog"
fi

"$CLI" catalog bundle list

# 4. Deploy application if requested
APP_NAME="invoice-review1"
app_exists() { "$CLI" application ps --runtime podman 2>/dev/null | grep -qw "$1"; }

if [ "${LP_DEPLOY_INVOICE_APP:-1}" = 1 ]; then
  if app_exists "$APP_NAME"; then
    log "$APP_NAME already exists - skipping application create"
  else
    log "deploying application $APP_NAME with llm.ollama=true"
    "$CLI" application create "$APP_NAME" --template "$BUNDLE_NAME" "${APP_FLAGS[@]}" --params 'llm.ollama=true' \
      || die "failed to create application $APP_NAME"
  fi

  # Apply healthcheck fix if podman 6.1.1 probe translation bug affects this container
  CTR="$(podman ps -a --format '{{.Names}}' | grep -E "^${APP_NAME}-.*" | head -n1 || true)"
  if [ -n "$CTR" ]; then
    log "checking container $CTR"
    TEST_CMD="$(podman inspect "$CTR" --format '{{json .Config.Healthcheck.Test}}' 2>/dev/null || true)"
    if echo "$TEST_CMD" | grep -q 'CMD-SHELL","curl"'; then
      log "applying healthcheck fix to $CTR"
      podman update --health-cmd 'curl -f http://localhost:8080/health || exit 1' --health-start-period 0s --health-retries 20 "$CTR"
    fi
  fi

  # Report UI and API URLs
  UI_HOST="$(find_host "${APP_NAME}-ui" || find_host "${APP_NAME}")"
  if [ -n "$UI_HOST" ]; then
    log "Invoice Review UI: https://${UI_HOST}:${HTTPS_PORT}/"
    log "Invoice Review API info: https://${UI_HOST}:${HTTPS_PORT}/api/info"
  else
    log "Deployed $APP_NAME. Check catalog UI for route link."
  fi
fi

log "invoice-review step completed"
