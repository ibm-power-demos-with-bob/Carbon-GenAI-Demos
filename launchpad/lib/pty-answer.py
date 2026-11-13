#!/usr/bin/env python3
"""Run `ai-services catalog configure` under a pty and answer the admin-password prompt.

The password is generated here and stored in ~/.launchpad-admin-pw (mode 600).
It is never printed.
"""
import os, pty, secrets, string, sys, select, time

PW_FILE = os.path.expanduser("~/.launchpad-admin-pw")
if os.path.exists(PW_FILE):
    pw = open(PW_FILE).read().strip()
else:
    alphabet = string.ascii_letters + string.digits
    pw = (secrets.choice(string.ascii_uppercase) + secrets.choice(string.ascii_lowercase)
          + secrets.choice(string.digits) + secrets.choice("#%+=-_")
          + "".join(secrets.choice(alphabet) for _ in range(20)))
    fd = os.open(PW_FILE, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(fd, "w") as f:
        f.write(pw + "\n")

cmd = sys.argv[1:]
pid, master = pty.fork()
if pid == 0:
    os.execvp(cmd[0], cmd)

buf = b""
sent = 0
deadline = time.time() + 900
while time.time() < deadline:
    r, _, _ = select.select([master], [], [], 5)
    if master in r:
        try:
            data = os.read(master, 4096)
        except OSError:
            break
        if not data:
            break
        buf += data
        sys.stdout.write(data.decode(errors="replace").replace(pw, "********"))
        sys.stdout.flush()
        low = buf.lower()
        # answer each password / confirm prompt once as it appears
        prompts = low.count(b"password:") + low.count(b"authentication:")
        while sent < prompts:
            os.write(master, (pw + "\n").encode())
            sent += 1
try:
    _, status = os.waitpid(pid, 0)
    sys.exit(os.waitstatus_to_exitcode(status))
except ChildProcessError:
    pass
