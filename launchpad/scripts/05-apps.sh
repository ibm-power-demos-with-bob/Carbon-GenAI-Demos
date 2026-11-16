#!/bin/bash
# STEP 5 - create rag1 / extract1 / summarize1, start Stopped pods, fix the embedding/reranker healthcheck, wait until healthy.
# Idempotent: existing apps are skipped. Env: LP_APPS="extract1 summarize1 rag1" to choose a subset.
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"
STEP_TOTAL=6
step 5 "create Launchpad applications"
need_cli

APPS="${LP_APPS:-extract1 summarize1 rag1}"

app_exists() { "$CLI" application ps --runtime podman 2>/dev/null | grep -qw "$1"; }

start_stopped_pods() {
  # `application create` leaves embedding/reranker pods Stopped (pod create, pod stop 1 s later) - cause unknown.
  local p
  for p in $(podman pod ps --filter status=stopped --format '{{.Name}}' | grep -E 'embedding|reranker' || true); do
    log "starting stopped pod $p"; podman pod start "$p" >/dev/null
  done
}

apply_healthcheck_fix() {
  # Template healthcheck has a non-zero start-period + on-failure=restart: the probe fails instantly on podman 6.1.1
  # and the slow vLLM CPU start is killed in a loop. `podman update` takes ONE container per call.
  local c
  c="$(podman ps -a --format '{{.Names}}' | grep -E '^embedding-.*-embedding$' | head -n1 || true)"
  [ -z "$c" ] || { log "healthcheck fix: $c"; podman update --health-cmd 'curl -f http://localhost:8001/health || exit 1' --health-start-period 0s --health-retries 20 "$c"; }
  c="$(podman ps -a --format '{{.Names}}' | grep -E '^reranker-.*-reranker$' | head -n1 || true)"
  [ -z "$c" ] || { log "healthcheck fix: $c"; podman update --health-cmd 'curl -f http://localhost:8002/health || exit 1' --health-start-period 0s --health-retries 20 "$c"; }
}

for app in $APPS; do
  if app_exists "$app"; then log "$app already exists - skipping create"; continue; fi
  case "$app" in
    rag*)       tmpl=rag;       params='llm.ollama=true,embedding.vllm-cpu=true,reranker.vllm-cpu=true' ;;
    extract*)   tmpl=extract;   params='llm.ollama=true' ;;
    summarize*) tmpl=summarize; params='llm.ollama=true' ;;
    *) die "unknown app name '$app' (use rag*/extract*/summarize*)" ;;
  esac
  log "application create $app (template $tmpl)"
  if ! "$CLI" application create "$app" --template "$tmpl" "${APP_FLAGS[@]}" --params "$params"; then
    log "create returned an error - checking for the known Stopped-pods case"
    start_stopped_pods
    app_exists "$app" || die "application $app was not created"
  fi
  start_stopped_pods
  case "$app" in rag*) apply_healthcheck_fix ;; esac
done

if podman ps -a --format '{{.Names}}' | grep -qE '^(embedding|reranker)-'; then
  log "waiting (max 15 min) for embedding + reranker to be healthy"
  start_stopped_pods
  apply_healthcheck_fix
  E="$(podman ps -a --format '{{.Names}}' | grep -E '^embedding-.*-embedding$' | head -n1)"
  R="$(podman ps -a --format '{{.Names}}' | grep -E '^reranker-.*-reranker$' | head -n1)"
  wait_for 900 "embedding healthcheck" podman healthcheck run "$E"
  wait_for 900 "reranker healthcheck" podman healthcheck run "$R"
fi

"$CLI" application ps --runtime podman || true
if podman ps --format '{{.Names}} {{.Status}}' | grep -i unhealthy; then
  die "unhealthy containers listed above"
fi
log "applications ready"
