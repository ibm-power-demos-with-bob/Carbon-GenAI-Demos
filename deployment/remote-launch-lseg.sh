#!/bin/bash
# remote-launch-lseg.sh
# Launched remotely by Bob to deploy the LSEG UI on port 3003.
# Run AFTER the base demo (remote-launch.sh) has fully completed.
# Accepts FQDN as first argument - passed through to deploy-lseg-ui.sh.

FQDN="${1:-localhost}"

mkdir -p ~/deployment

# Kill any previous LSEG UI instance
pkill -f "lseg.*next" 2>/dev/null || true
pkill -f "next-server.*3003" 2>/dev/null || true
sleep 1

nohup bash ~/Carbon-GenAI-Demos/deployment/deploy-lseg-ui.sh "$FQDN" \
    > ~/deployment/deploy-lseg.log 2>&1 &

DEPLOY_PID=$!
echo "$DEPLOY_PID" > ~/deployment/deploy-lseg.pid
echo "LSEG_DEPLOY_STARTED PID:$DEPLOY_PID"
echo "Log: ~/deployment/deploy-lseg.log"
