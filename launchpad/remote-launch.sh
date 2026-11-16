#!/bin/bash
# Launched remotely by Bob: clone the repo (branch feature/launchpad-power-cpu) and start the Launchpad recipe in the background.
# Safe to run multiple times - kills any prior run first. Does NOT touch an existing catalog/apps (steps are idempotent).
# usage: bash remote-launch.sh [branch] [first_step]
BRANCH="${1:-feature/launchpad-power-cpu}"
FIRST="${2:-1}"

pkill -f 'scripts/run-all.sh' 2>/dev/null || true
sleep 1

sudo dnf install -y git >/dev/null 2>&1 || true

mkdir -p ~/launchpad-deploy
if [ -d ~/Carbon-GenAI-Demos/.git ]; then
  git -C ~/Carbon-GenAI-Demos fetch --quiet origin "$BRANCH" && git -C ~/Carbon-GenAI-Demos checkout --quiet "$BRANCH" \
    && git -C ~/Carbon-GenAI-Demos reset --hard --quiet "origin/$BRANCH"
else
  rm -rf ~/Carbon-GenAI-Demos
  git clone --branch "$BRANCH" https://github.com/ibm-power-demos-with-bob/Carbon-GenAI-Demos ~/Carbon-GenAI-Demos
fi

# Windows checkouts can leave CR characters in shell scripts; strip them defensively.
sed -i 's/\r$//' ~/Carbon-GenAI-Demos/launchpad/scripts/*.sh ~/Carbon-GenAI-Demos/launchpad/remote-launch.sh 2>/dev/null || true

nohup bash ~/Carbon-GenAI-Demos/launchpad/scripts/run-all.sh "$FIRST" > ~/launchpad-deploy.log 2>&1 &
echo "$!" > ~/launchpad-deploy/deploy.pid
echo "DEPLOY_STARTED PID:$!"
echo "Log: ~/launchpad-deploy.log"
echo END
