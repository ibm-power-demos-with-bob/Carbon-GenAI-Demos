#!/bin/bash
# STEP 1 - host preparation (RHEL 10.x ppc64le). Idempotent.
# Does the manual equivalent of the useful parts of `bootstrap configure` WITHOUT running it
# (plain `bootstrap configure` reduces SMT 64->16 and trips on SELinux/Spyre checks).
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"
STEP_TOTAL=6
step 1 "host prep (packages, linger, limits, SELinux module)"

command -v sudo >/dev/null || die "sudo is required"
sudo -n true 2>/dev/null || die "passwordless sudo is required for the reservation user"

log "packages"
sudo dnf install -y podman golang git curl jq python3 udica make >/dev/null

log "linger + user podman socket (Linger=no was observed on the reference VM)"
sudo loginctl enable-linger "$OS_USER"
[ -d "$XDG_RUNTIME_DIR" ] || sudo systemctl start "user@${OS_UID}.service"
systemctl --user enable --now podman.socket

log "group sentient + limits (needed by rootless podman for vLLM memlock/nofile)"
getent group sentient >/dev/null || sudo groupadd sentient
id -nG "$OS_USER" | tr ' ' '\n' | grep -qx sentient || sudo usermod -aG sentient "$OS_USER"

echo '@sentient - memlock unlimited' | sudo tee /etc/security/limits.d/memlock.conf >/dev/null
grep -qxF '@sentient hard nofile 134217728' /etc/security/limits.conf \
  || echo '@sentient hard nofile 134217728' | sudo tee -a /etc/security/limits.conf >/dev/null

sudo mkdir -p "/etc/systemd/system/user-${OS_UID}.slice.d"
printf '[Slice]\nLimitNOFILE=134217728\nLimitMEMLOCK=infinity\n' \
  | sudo tee "/etc/systemd/system/user-${OS_UID}.slice.d/limits.conf" >/dev/null
sudo systemctl daemon-reload

log "subuid/subgid (image normally provides them)"
grep -q "^${OS_USER}:" /etc/subuid || sudo usermod --add-subuids 589824-655359 "$OS_USER"
grep -q "^${OS_USER}:" /etc/subgid || sudo usermod --add-subgids 589824-655359 "$OS_USER"

log "SELinux module ai_services_nonroot_policy (+ udica base/net container templates)"
if ! sudo semodule -l | grep -q '^ai_services_nonroot_policy'; then
  sudo cp "$LP_DIR/selinux/ai_services_nonroot_policy.cil" /tmp/ai_services_nonroot_policy.cil
  sudo semodule -i /tmp/ai_services_nonroot_policy.cil \
    /usr/share/udica/templates/base_container.cil \
    /usr/share/udica/templates/net_container.cil
fi
sudo semodule -l | grep -q '^ai_services_nonroot_policy' || die "SELinux module not loaded"

log "SMT must stay on (do NOT reduce it)"
cat /sys/devices/system/cpu/smt/control 2>/dev/null || true

log "host prep done. NOTE: new group/limits only apply to NEW login sessions (run-all.sh re-enters via sudo -i)."
