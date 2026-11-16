#!/bin/bash
# Shared helpers for the Launchpad-on-Power recipe scripts. Source this file, do not run it.
# Everything environment-specific is derived at run time (no hard-coded user, uid, IP).

set -euo pipefail

LP_SCRIPTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LP_DIR="$(cd "$LP_SCRIPTS_DIR/.." && pwd)"

OS_USER="$(id -un)"
OS_UID="$(id -u)"
export XDG_RUNTIME_DIR="/run/user/${OS_UID}"          # needed for rootless podman over ssh / nohup
export DBUS_SESSION_BUS_ADDRESS="unix:path=${XDG_RUNTIME_DIR}/bus"
export PATH="$HOME/bin:$PATH"

BASEDIR="${LP_BASEDIR:-$HOME/ai-services}"
HTTPS_PORT="${LP_HTTPS_PORT:-8443}"
PUBLIC_IP="${LP_PUBLIC_IP:-$(hostname -I | awk '{print $1}')}"
CLI_TAG="${LP_CLI_TAG:-v0.4.0}"
CLI="$HOME/bin/launchpad-cli"                          # symlink created by 02-build-cli.sh
APP_FLAGS=(--runtime podman --skip-validation power,spyre)   # ALWAYS pass these, never plain `bootstrap configure`
PW_FILE="$HOME/.launchpad-admin-pw"                    # catalog admin password, mode 600, never printed

LLM_MODEL_ALIAS="ibm-granite/granite-4.0-micro"        # Ollama alias so the platform's model-name check passes
OLLAMA_BASE_MODEL="granite4:latest"

STEP_TOTAL="${STEP_TOTAL:-6}"

log()  { printf '[%s] %s\n' "$(date +%H:%M:%S)" "$*"; }
step() { printf '\n[%s] ===== STEP %s/%s: %s =====\n' "$(date +%H:%M:%S)" "$1" "$STEP_TOTAL" "$2"; }
die()  { printf '[%s] ERROR: %s\n' "$(date +%H:%M:%S)" "$*" >&2; exit 1; }

need_cli() { [ -x "$CLI" ] || die "CLI not found at $CLI - run 02-build-cli.sh first"; }

# Poll a command until it succeeds. usage: wait_for <seconds> <description> <cmd...>
wait_for() {
  local secs="$1" what="$2"; shift 2
  local end=$(( $(date +%s) + secs ))
  until "$@" >/dev/null 2>&1; do
    [ "$(date +%s)" -lt "$end" ] || die "timed out after ${secs}s waiting for: $what"
    sleep 10
  done
  log "ok: $what"
}

# Print the (single) container/pod name matching a prefix, empty if none.
container_like() { podman ps -a --format '{{.Names}}' | grep -E "$1" | head -n1 || true; }

# Discover the public nip.io host of a deployed service, e.g. find_host 'extract-api'.
# UNVERIFIED on a fresh VM (host names carry a per-app slug). Tries: the CLI, the basedir, then container/pod metadata.
find_host() {
  local re="$1" out=""
  local pat="${re}-[a-z0-9]+\.${PUBLIC_IP//./\\.}\.nip\.io"
  out="$("$CLI" application list --runtime podman 2>/dev/null | grep -oE "$pat" | head -n1 || true)"
  [ -n "$out" ] || out="$(grep -rhoE "$pat" "$BASEDIR" 2>/dev/null | head -n1 || true)"
  [ -n "$out" ] || out="$( { podman pod inspect $(podman pod ps -q) 2>/dev/null; podman inspect $(podman ps -aq) 2>/dev/null; } | grep -oE "$pat" | head -n1 || true)"
  printf '%s' "$out"
}
