#!/bin/bash
# STEP 2 - build the ai-services CLI from upstream tag $LP_CLI_TAG (default v0.4.0). Idempotent.
# LP_APPLY_VLLM_PATCH=1 (default) applies launchpad/patches/vllm-cpu-reduced-scale.patch (KV cache 32->4, memory 150Gi->24Gi)
# so the embedding/reranker vLLM CPU pods fit in ~48 GiB. Open question (Phase B): is the patch still needed? Set 0 to test.
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"
STEP_TOTAL=6
step 2 "build ai-services CLI ${CLI_TAG}"

APPLY_PATCH="${LP_APPLY_VLLM_PATCH:-1}"
SRC="$HOME/src/project-ai-services"
BIN_NAME="ai-services"; [ "$APPLY_PATCH" = 1 ] && BIN_NAME="ai-services-reduced"
mkdir -p "$HOME/bin" "$HOME/src"

if [ -x "$HOME/bin/$BIN_NAME" ] && [ "${LP_REBUILD:-0}" != 1 ]; then
  log "$HOME/bin/$BIN_NAME already built (set LP_REBUILD=1 to rebuild)"
else
  [ -d "$SRC/.git" ] || git clone https://github.com/IBM/project-ai-services "$SRC"
  cd "$SRC"
  git fetch --tags --quiet
  git reset --hard --quiet
  git checkout --quiet "$CLI_TAG"
  if [ "$APPLY_PATCH" = 1 ]; then
    log "applying vllm-cpu reduced-scale patch"
    git apply "$LP_DIR/patches/vllm-cpu-reduced-scale.patch"
  fi
  cd "$SRC/ai-services"
  MOD="$(go list -m)"
  VERSION="$CLI_TAG"; [ "$APPLY_PATCH" = 1 ] && VERSION="${CLI_TAG}-reduced-scale"
  log "go build (several minutes on first run)"
  CGO_ENABLED=0 go build -trimpath \
    -tags 'exclude_graphdriver_btrfs containers_image_openpgp remote' \
    -ldflags "-X ${MOD}/internal/pkg/version.Version=${VERSION}" \
    -o "$HOME/bin/$BIN_NAME" ./cmd/ai-services
fi

ln -sf "$HOME/bin/$BIN_NAME" "$CLI"
"$CLI" version || "$CLI" --version || die "built CLI does not run"
log "CLI ready: $CLI -> $BIN_NAME"
