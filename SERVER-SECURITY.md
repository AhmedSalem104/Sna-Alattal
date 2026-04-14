# Server Security & Hardening Log

## Server Details
| Item | Value |
|------|-------|
| **Hostname** | srv1290135 |
| **IP** | 72.60.132.3 |
| **OS** | Ubuntu 24.04 LTS |
| **Domain** | snalattal.me / www.snalattal.me |
| **Hosting** | Hostinger VPS |
| **RAM** | 7.8 GB |
| **Disk** | 96 GB |
| **Node.js** | 22.22.2 |
| **Nginx** | 1.24.0 |
| **PM2** | 6.0.14 |

---

## Incident History

### Incident #1 — Crypto Miner (xmrig)
- **Date Discovered:** 2026-04-01
- **Malware:** xmrig 6.24.0 (crypto miner)
- **Location:** `/var/tmp/.unix/javae` (renamed binary) + `/var/tmp/grep.tar.gz` (renamed archive)
- **User:** `ubuntu` (default cloud-init user)
- **Origin Date:** June 2025 (pre-existing before our setup)
- **Entry Point:** SSH brute-force via PasswordAuthentication on `ubuntu` user with NOPASSWD sudo
- **Impact:** Hostinger Monarx Agent detected xmrig → auto-stopped VPS multiple times
- **Persistence:** None found (no cron, systemd, rc.local, or profile persistence)
- **Resolution:** Full malware removal + user deletion + system hardening

---

## Security Hardening Steps Applied

### 1. SSH Hardening
```
File: /etc/ssh/sshd_config

PasswordAuthentication no          # No password login - key only
PermitRootLogin prohibit-password  # Root key-only access
PubkeyAuthentication yes           # Public key auth enabled
MaxAuthTries 3                     # Max 3 failed attempts
LoginGraceTime 30                  # 30 seconds to authenticate
MaxSessions 3                      # Max 3 concurrent sessions
MaxStartups 3:50:10                # Rate limit new connections
ClientAliveInterval 300            # Keep-alive every 5 min
ClientAliveCountMax 2              # Disconnect after 2 missed
AllowUsers root                    # Only root can SSH
X11Forwarding no                   # Disabled
AllowTcpForwarding no              # Disabled
AllowAgentForwarding no            # Disabled
PermitEmptyPasswords no            # Disabled
```

### 2. Firewall (UFW)
```
Status: active

Inbound ALLOW:
- 22/tcp   (SSH)
- 80/tcp   (HTTP)
- 443/tcp  (HTTPS)

Inbound DENY:
- 3000/tcp (Node.js direct - blocked externally)

Outbound DENY (mining ports):
- 3333, 4444, 5555, 7777, 8333, 9999, 14433, 14444, 25565, 45700

Default: deny incoming, allow outgoing
```

### 3. Fail2Ban
```
File: /etc/fail2ban/jail.local

[sshd]
enabled = true
maxretry = 3
bantime = 604800    # 7 days

[nginx-http-auth]
enabled = true
maxretry = 3
bantime = 86400     # 24 hours

[nginx-botsearch]
enabled = true
maxretry = 5
bantime = 86400

[nginx-badbots]
enabled = true
maxretry = 3
bantime = 86400

Ban action: ufw (persistent)
```

### 4. File System Hardening
```
/tmp      → mounted with noexec, nosuid, nodev (512MB tmpfs)
/dev/shm  → mounted with noexec, nosuid, nodev
/var/tmp  → permissions 1733

Entry in /etc/fstab:
tmpfs /tmp tmpfs defaults,noexec,nosuid,nodev,size=512M 0 0
tmpfs /dev/shm tmpfs defaults,noexec,nosuid,nodev 0 0
```

### 5. Kernel Hardening (sysctl)
```
File: /etc/sysctl.d/99-stable.conf

vm.swappiness = 10
vm.overcommit_memory = 1
net.core.somaxconn = 65535
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_fin_timeout = 15
net.ipv4.tcp_keepalive_time = 300
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0
```

### 6. User Security
```
- ubuntu user: DELETED (was compromised entry point)
- ubuntu home dir: DELETED (/home/ubuntu)
- ubuntu sudoers: DELETED (/etc/sudoers.d/90-cloud-init-users)
- Only user with shell: root
- Authorized SSH keys: 2 (my-laptop + claude@sna-alattal)
```

### 7. Malware Removal
```
Deleted:
- /var/tmp/.unix/javae         (xmrig binary renamed as javae)
- /var/tmp/.unix/config.json   (miner config)
- /var/tmp/.unix/SHA256SUMS    (hash file)
- /var/tmp/grep.tar.gz         (xmrig-6.24.0 archive renamed as grep)
- /root/quarantine/            (quarantined copies)

Purged:
- Netdata (caused Monarx detection issues + high RAM)
```

### 8. Nginx Configuration
```
File: /etc/nginx/sites-available/sna-alattal

- HTTP → HTTPS redirect (301)
- SSL via Let's Encrypt (expires 2026-06-29)
- server_tokens off (hide version)
- Security headers: X-Frame-Options, X-Content-Type-Options, HSTS
- Rate limiting: 10 req/sec with burst 20
- Gzip compression enabled
- Static asset caching (365d for _next/static, 30d for uploads/images)
- Reverse proxy to localhost:3000
```

### 9. SSL/TLS
```
Certificate: Let's Encrypt
Domains: snalattal.me, www.snalattal.me
Expires: June 29, 2026
Auto-renew: certbot timer (every 12 hours check)
HSTS: max-age=63072000; includeSubDomains; preload
```

### 10. Swap
```
/swapfile  2GB  (created manually)
Entry in /etc/fstab: /swapfile none swap sw 0 0
```

### 11. Disabled Services
```
- ModemManager    (not needed on VPS)
- fwupd           (firmware updates, not needed)
- udisks2         (disk manager, not needed)
- multipathd      (multipath, not needed)
- Netdata         (removed - caused issues with Monarx)
```

### 12. Auto Updates
```
File: /etc/apt/apt.conf.d/50unattended-upgrades

- Security updates: enabled (automatic)
- Auto-reboot: DISABLED (Automatic-Reboot "false")
```

---

## Monitoring & Recovery

### Health Check (every 5 minutes)
```
File: /usr/local/bin/health-check.sh
Cron: */5 * * * *

Checks:
- HTTP 200 from localhost:3000
- RAM usage > 85% → alert
- Disk usage > 90% → alert
- Auto-restart app if down
- Hourly status logging

Alerts: ntfy.sh/sna-alattal-alerts-2026
```

### Malware Scanner (every 10 minutes)
```
File: /usr/local/bin/malware-scan.sh
Cron: */10 * * * *

Scans for:
- xmrig, kinsing, kdevtmpfsi, javae, cryptonight processes
- Executable files in /tmp, /var/tmp, /dev/shm
- Auto-kill if found + alert
```

### Backup (daily at 3 AM)
```
File: /var/www/backup.sh
Cron: 0 3 * * *

Backs up:
- src/data/ (JSON data files)
- public/uploads/ (images, PDFs, videos)

Location: /var/backups/sna-alattal/
Retention: 7 days
```

### PM2 Process Manager
```
App: sna-alattal (Next.js)
Memory limit: 512MB (auto-restart if exceeded)
Auto-start on reboot: enabled (pm2-root.service)
Log rotation: pm2-logrotate (10MB max, 7 days retain, compressed)
```

---

## Deploy Process
```bash
# Manual deploy
ssh root@72.60.132.3 "/var/www/deploy.sh"

# deploy.sh contents:
cd /var/www/sna-alattal
git pull origin master
npm install
npm run build
pm2 restart sna-alattal
```

---

## File Locations
```
/var/www/sna-alattal/          → Project files
/var/www/deploy.sh             → Deploy script
/var/www/backup.sh             → Backup script
/var/backups/sna-alattal/      → Backups
/usr/local/bin/health-check.sh → Health monitor
/usr/local/bin/malware-scan.sh → Malware scanner
/etc/nginx/sites-available/    → Nginx config
/etc/letsencrypt/              → SSL certificates
/etc/fail2ban/jail.local       → Fail2Ban config
/etc/sysctl.d/99-stable.conf   → Kernel tuning
/var/log/health-check.log      → Health check log
/var/log/malware-scan.log      → Malware scan log
```

---

## Forensic Audit Result (2026-04-02)

**Conclusion: B — Clean but monitor closely**

| Area | Status |
|------|--------|
| Malware processes | CLEAN |
| Temp directories | CLEAN |
| Hidden files | CLEAN |
| Persistence mechanisms | CLEAN |
| SUID/SGID files | CLEAN (standard only) |
| World-writable files | CLEAN |
| Unauthorized users | CLEAN (ubuntu removed) |
| SSH authorized_keys | CLEAN (2 known keys) |
| Outbound connections | CLEAN |
| Listening ports | CLEAN (22, 80, 443, 3000 local) |

**Reason for "monitor closely":** Server was previously compromised. While fully cleaned, continued monitoring via automated scripts ensures early detection of any recurrence.

---

## Incident #2 — Recurring Malware & Auto-Shutdown (2026-04-04)

### Problem
Server kept stopping repeatedly. Investigation revealed:

1. `/var/tmp/.unix/javae` (xmrig) kept reappearing after every reboot
2. Hostinger's **Monarx Agent** security scanner detected it → auto-stopped VPS
3. This created an infinite loop: reboot → malware recreated → Monarx stops server

### Root Cause
**Cloud-init** was the culprit:
- Hostinger stores `user-data.txt` with initial server setup commands
- On every reboot, cloud-init re-executed and restored the old `ubuntu` user environment
- The malware files (owned by UID 1000 / ubuntu) were being recreated from cloud-init cached data
- Mining pool: `pool.supportxmr.com:443` (Monero XMR mining)
- Wallet: `4B7Zbk4jbWXTBTTirFrf4fhrxeKRNxfsKSobuZnQk1AfjXe7pWqP9p19qiMr1p1RvA4afAuHuCv6N1aZrKqyXVLfQ4rWULT`

### Timeline
| Date | Event |
|------|-------|
| Jun 2025 | Malware originally planted (pre-existing) |
| Mar 31 | We started working on server |
| Apr 1 | First VPS stop by Monarx |
| Apr 1 | Malware quarantined (not deleted) → Monarx still detected |
| Apr 2 | Malware deleted, but cloud-init recreated it at 22:41 UTC |
| Apr 4 | Server stopped again, malware found again |
| Apr 4 | **Root cause identified: cloud-init** → permanent fix applied |

### Permanent Fix Applied
```
1. Malware deleted permanently
   rm -rf /var/tmp/.unix

2. Immutable blocker file created
   touch /var/tmp/.unix
   chmod 000 /var/tmp/.unix
   chattr +i /var/tmp/.unix
   → Cannot be deleted, modified, or replaced with directory

3. Mining pools blocked in /etc/hosts
   127.0.0.1 pool.supportxmr.com
   127.0.0.1 xmr.pool.minergate.com
   127.0.0.1 xmrpool.eu
   127.0.0.1 pool.hashvault.pro

4. Cloud-init disabled permanently
   touch /etc/cloud/cloud-init.disabled
   rm /var/lib/cloud/instance/user-data.txt

5. Netdata fully purged
   apt remove --purge netdata* -y
```

### Why It Won't Recur
1. `/var/tmp/.unix` is an immutable file — no process can create a directory with same name
2. Cloud-init is permanently disabled — won't re-run old commands
3. Mining pools are blocked in hosts file — even if miner runs, it can't connect
4. Malware scanner runs every 10 minutes — auto-kills any miner process
5. Monarx won't find anything suspicious — won't stop the server

---

## Additional Security Measures (2026-04-02 to 2026-04-04)

### Netdata Removal
```
Netdata was causing issues:
- High RAM usage (~200MB)
- SUID plugins left behind after disabling
- Monarx flagging Netdata files
- Fully purged: apt remove --purge netdata*
- All directories removed: /usr/libexec/netdata, /etc/netdata, /var/lib/netdata
```

### Cloud-init Security
```
- Cloud-init disabled: /etc/cloud/cloud-init.disabled
- User-data removed: /var/lib/cloud/instance/user-data.txt
- Per-boot scripts: none
- Per-instance scripts: none
```

### Ubuntu User Complete Removal
```
- User deleted: userdel ubuntu
- Home directory deleted: rm -rf /home/ubuntu
- SSH keys deleted: /home/ubuntu/.ssh/authorized_keys
- Sudoers entry deleted: /etc/sudoers.d/90-cloud-init-users
```

### Mining Pool Blocking
```
File: /etc/hosts

127.0.0.1 pool.supportxmr.com
127.0.0.1 xmr.pool.minergate.com
127.0.0.1 xmrpool.eu
127.0.0.1 pool.hashvault.pro
```

### Immutable File Protection
```
/var/tmp/.unix → immutable file (chattr +i)
Cannot be:
- Deleted
- Modified
- Replaced with directory
- Overwritten
Only root with chattr -i can remove it
```

---

## Current Server Status (2026-04-04)

| Item | Status |
|------|--------|
| **Website** | https://snalattal.me — LIVE (HTTPS 200) |
| **SSL** | Let's Encrypt (expires 2026-06-29) |
| **SSH** | Key-only, MaxAuth 3, AllowUsers root |
| **Firewall** | 28 UFW rules, ports 22/80/443 only |
| **Fail2Ban** | 4 jails (SSH 7-day ban + 3 Nginx jails) |
| **PM2** | Online, auto-restart, 512MB memory limit |
| **Swap** | 2GB active |
| **RAM** | ~800MB / 7.8GB (10%) |
| **Malware** | CLEAN |
| **Cloud-init** | DISABLED |
| **Monarx** | No detections (nothing to find) |
| **Health Check** | Every 5 min + alerts |
| **Malware Scan** | Every 10 min + auto-kill |
| **Backup** | Daily 3 AM |
| **Auto-reboot** | DISABLED |

---

## Incident #3 — VPS Offline / Not Responding (2026-04-14)

- **Date:** 2026-04-14
- **Symptom:** Site `https://snalattal.me` not loading; both ICMP ping and HTTPS connections to `72.60.132.3` timed out (100% packet loss).
- **Diagnosis:** VPS instance itself is stopped at the Hostinger hypervisor level — not a Nginx/PM2/app issue. When the VPS process is stopped from outside the OS, the server cannot be reached at all (kernel is not running).
- **Most likely cause:** Hostinger Monarx or their abuse team auto-stopped the VPS. Historically this has happened after Monarx detected suspicious activity (see Incident #1 and #2). Since malware was fully removed and cloud-init disabled, the trigger could also be: resource abuse detection, reboot policy, payment/plan issue, or a manual Hostinger intervention.
- **Resolution Steps:**
  1. Log in to Hostinger hPanel → VPS → `srv1290135`
  2. Click **Start** (or **Restart** if state is "Stopped")
  3. Check Monarx alerts page in hPanel — read the exact reason
  4. SSH in: `ssh root@72.60.132.3` and run:
     - `systemctl status nginx` — confirm Nginx is running
     - `pm2 list` — confirm app (`sna-alattal`) is online
     - `journalctl -xe --since "2 hours ago"` — look for shutdown reason
     - `last -x | head -20` — check recent reboots/shutdowns
     - `dmesg | tail -50` — kernel-level events before the stop
  5. If Monarx flagged a file: do NOT quarantine — delete immediately
  6. Update this incident entry with the confirmed root cause
- **Prevention Going Forward:**
  - **Uptime monitoring:** Set up external uptime check (UptimeRobot free tier) that pings `snalattal.me` every 5 minutes and emails/SMS on downtime → we learn about outages immediately, not from users
  - **Hostinger alerts:** Enable email notifications for VPS state changes in hPanel
  - **Monthly audit:** On the 1st of each month, SSH in and run `/usr/local/bin/health-check.sh` manually + review `/var/log/monarx/` for recent alerts
  - **Document ANY Hostinger support ticket** in this file — their reasons for stopping the VPS are the strongest signal for what to harden next
  - **Keep `SERVER-SECURITY.md` up to date** after every incident — future-me needs to know what was tried

---

## Outage Response Runbook (Quick Reference)

When the site is reported down, run these checks **in order**:

```bash
# 1. Is the VPS itself alive?
ping -c 3 72.60.132.3          # If timeout → VPS is stopped at hypervisor (check hPanel)

# 2. Is HTTPS reachable?
curl -I https://snalattal.me   # If timeout → same as above OR firewall/DNS issue

# 3. Only after SSH works — is Nginx up?
ssh root@72.60.132.3 "systemctl status nginx"

# 4. Is the Node app up?
ssh root@72.60.132.3 "pm2 list && pm2 logs sna-alattal --lines 50 --nostream"

# 5. What stopped the server?
ssh root@72.60.132.3 "last -x | head && journalctl --since '2 hours ago' | tail -100"
```

Decision tree:
- **Ping fails** → VPS stopped externally → hPanel Start + check Monarx
- **Ping OK, HTTPS fails** → Nginx down OR UFW issue → `systemctl restart nginx`
- **HTTPS OK, but 502** → Node app crashed → `pm2 restart sna-alattal`
- **HTTPS OK, but 500** → App-level error → read PM2 logs, redeploy

---

## Lessons Learned

1. **Never quarantine malware on production servers** — delete immediately or Monarx will detect it
2. **Cloud-init can be a persistence mechanism** — disable it after initial setup
3. **UID 1000 (ubuntu) is a default attack target** — always delete default users
4. **Immutable files (`chattr +i`) are the best way** to prevent directory recreation
5. **Block mining pools in /etc/hosts** as defense-in-depth
6. **Avoid heavy monitoring tools** (Netdata) on production — use lightweight scripts instead
7. **External uptime monitoring is mandatory** — we should never find out the site is down from a user. UptimeRobot or similar must be configured.
8. **Ping-fails-first diagnosis** — if ICMP to the VPS times out, the OS is not running; no amount of nginx/pm2 work will help. Go to hPanel first.

---

## Recommendations (Future)
1. Consider creating a non-root deploy user with limited sudo
2. Rotate SSH keys periodically
3. Consider changing SSH port (optional, adds obscurity)
4. Set up off-site backup (cloud storage)
5. Consider Docker-based deployment for better isolation
6. Review and update this document after any server changes

---

*Last updated: 2026-04-14 — added Incident #3 (VPS offline) + Outage Response Runbook*
*Maintained by: DevOps Team*
