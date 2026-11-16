#!/bin/bash
# STEP 6 - smoke test: one call per service, PASS/FAIL table. Exit code 1 if anything fails.
# Host discovery is UNVERIFIED on a fresh VM; override with LP_EXTRACT_URL / LP_SUMMARIZE_URL / LP_DIGITIZE_URL / LP_CHAT_URL
# (full https URLs without trailing slash).
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"
STEP_TOTAL=6
set +e
step 6 "smoke test"
need_cli

RESULTS=(); FAILS=0
record() { RESULTS+=("$(printf '%-28s %-5s %s' "$1" "$2" "$3")"); [ "$2" = PASS ] || FAILS=$((FAILS+1)); }

url_for() { # <override> <host-regex>
  if [ -n "$1" ]; then printf '%s' "$1"; return; fi
  local h; h="$(find_host "$2")"; [ -n "$h" ] && printf 'https://%s:%s' "$h" "$HTTPS_PORT"
}
timed_post() { # <url> <json> -> sets BODY, SECS
  local t0; t0=$(date +%s)
  BODY="$(curl -ksS --max-time 180 -H 'Content-Type: application/json' -d "$2" "$1" 2>&1)"
  SECS=$(( $(date +%s) - t0 ))
}

# Ollama itself
if curl -fsS --max-time 120 http://localhost:11434/api/generate \
     -d "{\"model\":\"${LLM_MODEL_ALIAS}\",\"prompt\":\"Say OK\",\"stream\":false}" | grep -q '"response"'; then
  record "ollama generate" PASS ""; else record "ollama generate" FAIL ""; fi

# Catalog
if curl -ksf "https://catalog-api.${PUBLIC_IP}.nip.io:${HTTPS_PORT}/health" >/dev/null; then
  record "catalog api" PASS ""; else record "catalog api" FAIL ""; fi

# Extract
U="$(url_for "${LP_EXTRACT_URL:-}" 'extract-api')"
if [ -z "$U" ]; then record "extract /v1/extract" FAIL "host not found"; else
  timed_post "$U/v1/extract" '{"text":"Hans Gies ordered 4 pallets of bolts.","json_schema":{"type":"object","properties":{"name":{"type":"string"},"pallets":{"type":"integer"}}}}'
  if echo "$BODY" | grep -q 'Gies'; then record "extract /v1/extract" PASS "${SECS}s"; else record "extract /v1/extract" FAIL "$(echo "$BODY" | head -c 120)"; fi
fi

# Summarize (request shape guessed: {"text": ...}; check the API if this fails with 422)
U="$(url_for "${LP_SUMMARIZE_URL:-}" 'summarize-api')"
if [ -z "$U" ]; then record "summarize /v1/summarize" FAIL "host not found"; else
  timed_post "$U/v1/summarize" '{"text":"IBM Power systems run AI inference close to enterprise data. Granite models run on the CPU using the Matrix Math Accelerator, so no GPU is required for small models."}'
  if echo "$BODY" | grep -qiE 'summary|power'; then record "summarize /v1/summarize" PASS "${SECS}s"; else record "summarize /v1/summarize" FAIL "$(echo "$BODY" | head -c 120)"; fi
fi

# Digitize (reachability of the job list)
U="$(url_for "${LP_DIGITIZE_URL:-}" 'digitize-api')"
if [ -z "$U" ]; then record "digitize GET /v1/jobs" FAIL "host not found"; else
  if [ "$(curl -ks -o /dev/null -w '%{http_code}' "$U/v1/jobs")" = 200 ]; then record "digitize GET /v1/jobs" PASS ""; else record "digitize GET /v1/jobs" FAIL ""; fi
fi

# Chat / RAG backend
U="$(url_for "${LP_CHAT_URL:-}" 'chat-bot-api|chat-api|chatbot-api')"
if [ -z "$U" ]; then record "chat GET /db-status" FAIL "host not found"; else
  if [ "$(curl -ks -o /dev/null -w '%{http_code}' "$U/db-status")" = 200 ]; then record "chat GET /db-status" PASS ""; else record "chat GET /db-status" FAIL ""; fi
fi

printf '\n%-28s %-5s %s\n' CHECK RESULT DETAIL
printf '%s\n' "${RESULTS[@]}"
printf '\n%s check(s) failed\n' "$FAILS"
[ "$FAILS" -eq 0 ]
