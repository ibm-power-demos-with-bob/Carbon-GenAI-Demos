#!/bin/bash
# STEP 3 - host-level Ollama container with granite4 and the model alias the platform expects. Idempotent.
# Containers reach it via http://host.containers.internal:11434 (NOT the public IP).
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"
STEP_TOTAL=6
step 3 "Ollama + ${OLLAMA_BASE_MODEL}"

OLLAMA_IMAGE="${LP_OLLAMA_IMAGE:-icr.io/ppc64le-oss/ollama-ppc64le:v0.17.6}"
NUM_THREAD="${LP_OLLAMA_NUM_THREAD:-0}"   # 0 = no cap. Phase B experiment: try 24 (see RECIPE-PLAN open question 3)

if ! podman container exists ollama-service; then
  podman run -d --name ollama-service --restart always \
    -p 11434:11434 -e OLLAMA_HOST=0.0.0.0:11434 \
    -v ollama-models:/root/.ollama "$OLLAMA_IMAGE" serve
else
  podman start ollama-service >/dev/null 2>&1 || true
fi
wait_for 120 "Ollama API" curl -fsS http://localhost:11434/api/version

if ! podman exec ollama-service ollama list | grep -q '^granite4:latest'; then
  log "pulling ${OLLAMA_BASE_MODEL}"
  podman exec ollama-service ollama pull "$OLLAMA_BASE_MODEL"
fi

if ! podman exec ollama-service ollama list | grep -q "^${LLM_MODEL_ALIAS}:"; then
  if [ "$NUM_THREAD" -gt 0 ]; then
    log "creating alias ${LLM_MODEL_ALIAS} with num_thread ${NUM_THREAD}"
    printf 'FROM %s\nPARAMETER num_thread %s\n' "$OLLAMA_BASE_MODEL" "$NUM_THREAD" \
      | podman exec -i ollama-service sh -c 'cat > /tmp/Modelfile'
    podman exec ollama-service ollama create "$LLM_MODEL_ALIAS" -f /tmp/Modelfile
  else
    log "creating alias ${LLM_MODEL_ALIAS} (ollama cp)"
    podman exec ollama-service ollama cp "$OLLAMA_BASE_MODEL" "$LLM_MODEL_ALIAS"
  fi
fi

log "quick generation test"
curl -fsS http://localhost:11434/api/generate \
  -d "{\"model\":\"${LLM_MODEL_ALIAS}\",\"prompt\":\"Say OK\",\"stream\":false}" | jq -r '.response' | head -c 200; echo
