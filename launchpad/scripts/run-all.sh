#!/bin/bash
# Runs recipe steps 01-06 in order. Safe to re-run: every step is idempotent.
# usage: run-all.sh [first_step_number]   (e.g. `run-all.sh 4` resumes at step 04)
#
# Step 01 changes group membership and limits. Those only apply to NEW login sessions, so steps 02-06 are
# executed through `sudo -iu <user>` (fresh PAM session) instead of the current shell.
set -uo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
START="${1:-1}"
ME="$(id -un)"
T0=$(date +%s)

run_step() { # <script> <fresh-session 0|1>
  local s="$HERE/$1" rc
  if [ "$2" = 1 ]; then sudo -n -iu "$ME" bash "$s"; else bash "$s"; fi
  rc=$?
  if [ $rc -ne 0 ]; then echo "[run-all] FAILED: $1 (rc=$rc). Fix the cause and re-run: run-all.sh ${1:0:2}" >&2; exit $rc; fi
}

for f in 01-host-prep.sh 02-build-cli.sh 03-ollama.sh 04-catalog.sh 05-apps.sh 06-smoke-test.sh; do
  n=$((10#${f:0:2}))
  [ "$n" -ge "$START" ] || continue
  if [ "$n" -eq 1 ]; then run_step "$f" 0; else run_step "$f" 1; fi
done

echo "[run-all] ALL STEPS PASSED in $(( ($(date +%s) - T0) / 60 )) min"
