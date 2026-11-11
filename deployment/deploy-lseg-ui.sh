#!/bin/bash
# deploy-lseg-ui.sh
# Deploys the LSEG-tailored UI on port 3003, reusing the already-running
# llama-server (8080) and proxy (3001) from the base demo deploy.
# Run this AFTER deploy-carbon-genai.sh has completed successfully.
#
# Usage: bash ~/Carbon-GenAI-Demos/deployment/deploy-lseg-ui.sh <FQDN>
# e.g.:  bash ~/Carbon-GenAI-Demos/deployment/deploy-lseg-ui.sh pvm1-abc123.p1234.pok-systems.techzone.ibm.com
#
# The lseg-demo branch must be reachable by the clone URL below. It is local-only
# by default (see TAILORING.md). Either push it to a repo you control and set
# LSEG_REPO, or use the scp overlay described in DEMO_SCRIPT.md / TAILORING.md.

set -e

FQDN="${1:-localhost}"
LSEG_REPO="${LSEG_REPO:-https://github.com/ibm-power-demos-with-bob/Carbon-GenAI-Demos}"
LSEG_BRANCH="${LSEG_BRANCH:-lseg-demo}"
LSEG_DIR="$HOME/Carbon-GenAI-Demos-LSEG"
LOG="$HOME/deployment/deploy-lseg.log"

mkdir -p "$HOME/deployment"
echo "[$(date)] Starting LSEG UI deploy on port 3003" | tee -a "$LOG"

# --- Clone lseg-demo branch ---
echo "[$(date)] Cloning ${LSEG_BRANCH} branch from ${LSEG_REPO}..." | tee -a "$LOG"
rm -rf "$LSEG_DIR"
git clone --branch "$LSEG_BRANCH" "$LSEG_REPO" "$LSEG_DIR" >> "$LOG" 2>&1
echo "[$(date)] Clone complete." | tee -a "$LOG"

# --- Install Node dependencies ---
echo "[$(date)] Running yarn install..." | tee -a "$LOG"
cd "$LSEG_DIR/carbon-ui"
yarn install >> "$LOG" 2>&1
echo "[$(date)] yarn install complete." | tee -a "$LOG"

# --- Build ---
echo "[$(date)] Running yarn build..." | tee -a "$LOG"
yarn build >> "$LOG" 2>&1
echo "[$(date)] Build complete." | tee -a "$LOG"

# --- Stop any previous LSEG Next.js pm2 instance ---
pm2 delete nextjs-lseg 2>/dev/null || true
sleep 2

# --- Start Next.js on port 3003 via pm2 ---
echo "[$(date)] Starting Next.js (LSEG) on port 3003 via pm2..." | tee -a "$LOG"
PORT=3003 pm2 start yarn --name nextjs-lseg -- start
echo "[$(date)] pm2 start issued for nextjs-lseg" | tee -a "$LOG"

sleep 8

# --- Verify port 3003 is listening ---
if ss -tlnp | grep -q ':3003'; then
    echo "[$(date)] SUCCESS - LSEG demo running at http://${FQDN}:3003" | tee -a "$LOG"
else
    echo "[$(date)] WARNING - port 3003 not detected yet. Check: pm2 logs nextjs-lseg" | tee -a "$LOG"
fi

echo ""
echo "=========================================="
echo " LSEG demo:    http://${FQDN}:3003"
echo " Generic demo: http://${FQDN}:3000"
echo " Both use the same llama-server on :8080"
echo "=========================================="
