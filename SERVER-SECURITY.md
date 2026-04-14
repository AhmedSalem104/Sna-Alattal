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

## Incident #3 — Recurring Compromise (xmrig re-infection) + Full Rebuild (2026-04-14)

### What happened
- **Date:** 2026-04-14
- **Initial symptom:** Site down. Hostinger hPanel showed the VPS was **rate-limited** (not stopped) due to CPU abuse.
- **Root cause found in hPanel:** A process was running:
  ```
  ./https -a rx/0 -o pool.supportxmr.com:3333 -u 4AypWi9xNQvSy11FT5yr7Ajnyz2XuoUD7LGEJw4ZTRUHLrWjH1x5KoZUp9FTS4s9a5Y6Q7d4jSze4E6tq64aJTD2L7hnCrL -p ngintil -t 2
  ```
  — xmrig crypto miner, RandomX algorithm, Monero, pool `pool.supportxmr.com:3333`, worker name `ngintil` (disguised as nginx utility), binary renamed to `./https` to blend with HTTPS services. Using 250% CPU.
- **Attacker's second move:** When we tried to SSH in with our existing keys (`id_ed25519` and `hostinger_sna`), both were **rejected**. The attacker had replaced `/root/.ssh/authorized_keys` with their own key (labeled `root@puppetserver`), locking us out.
- **Implication:** The prior cleanups in Incidents #1 and #2 were not root-cause fixes. The attacker retained persistent access — likely via a second SSH key planted before or during our remediation — and reactivated the miner after the stakeout period.

### Resolution — Full rebuild, not cleanup
Since two in-place cleanups had failed, we chose a nuclear option: **reinstall the OS from scratch** via Hostinger hPanel with a fresh SSH key. A third in-place cleanup would have the same blind spots.

Steps taken (all completed 2026-04-14):

1. **Generated fresh ed25519 SSH key** (`~/.ssh/sna_alattal_new`) on the admin laptop.
2. **hPanel → Operating System → Reinstall OS** with clean Ubuntu 24.04 LTS. New public key pasted during reinstall. All prior filesystem state (including any rootkit, persistence, hidden accounts) was wiped.
3. **Verified clean state:** no xmrig, no suspicious files, no extra users, one known SSH key.
4. **System prep:** apt update/upgrade, essentials, **2GB swap** (prevents OOM kills), timezone Asia/Riyadh.
5. **Deleted `ubuntu` user** (UID 1000) — the entry point from Incident #1.
6. **Disabled cloud-init** (the persistence mechanism from Incident #2). All four cloud-init services masked to `/dev/null` and symlinked so they can't be re-enabled by a template reinstall.
7. **SSH hardening** (`/etc/ssh/sshd_config.d/99-hardening.conf`):
   - PasswordAuthentication no
   - PermitRootLogin prohibit-password
   - MaxAuthTries 3, LoginGraceTime 30
   - AllowUsers root (only)
   - Modern ciphers only (chacha20, aes256-gcm); curve25519 KEX; ETM MACs
8. **UFW firewall:** default deny inbound. Allow 80/443/9000. **Rate-limit 22/tcp** (UFW `limit` — auto-bans IPs with too many connection attempts).
9. **Fail2Ban (aggressive):** sshd maxretry=3 bantime=7d; `recidive` jail bantime=4w for repeat offenders; nginx-http-auth, nginx-badbots, nginx-noscript jails.
10. **Mining pool DNS blocks** in `/etc/hosts`: 15 pools including pool.supportxmr.com, minexmr, c3pool, moneroocean, hashvault, f2pool, nanopool. Even if malware lands, it can't reach its pool.
11. **Kernel hardening** (`/etc/sysctl.d/99-security.conf`): rp_filter, SYN cookies, ignore ICMP redirects, `kernel.kptr_restrict=2`, `kernel.dmesg_restrict=1`, `fs.protected_hardlinks=1`.
12. **`/tmp` mounted noexec,nosuid,nodev** via fstab.
13. **Unattended-upgrades** enabled for security patches.
14. **App stack:** Node.js 22 LTS, PM2 (fork mode, 768MB memory limit, 5 max restarts, 30s min uptime), Nginx 1.24 with rate limiting (30 r/s general, 10 r/s API, conn limit 20/IP) + strict security headers (HSTS preload, CSP, X-Frame-Options, Referrer-Policy).
15. **SSL:** Let's Encrypt cert for `snalattal.me` + `www.snalattal.me`, auto-renewal via `certbot.timer` (enabled). TLS 1.3 with AES-256-GCM.
16. **Auto-deploy webhook** (`/var/www/webhook/webhook.js`, systemd service `sna-webhook`) — HMAC-SHA256 verified, master-branch only. Secret stored in `/var/www/webhook/.secret` (chmod 600).
17. **Self-healing cron** `*/2 * * * * /usr/local/bin/sna-health.sh` — checks app, nginx, fail2ban, memory, and scans for xmrig/minerd/cryptonight/supportxmr/c3pool/moneroocean patterns every 2 minutes. Kills suspicious PIDs and auto-restarts services.
18. **PM2 logrotate** module installed; 50MB max per file, 7 retained, daily rotation.
19. **PM2 resurrection** via `pm2-root.service` — app state persisted, restarts on reboot.

### GitHub Webhook Secret (stored securely on server)
`/var/www/webhook/.secret` — must be set in GitHub repo Settings → Webhooks as the secret for `http://72.60.132.3:9000/deploy`.

### Prevention going forward
- **External uptime monitor:** UptimeRobot (free) on `https://snalattal.me` every 5 min — alerts by email/SMS the moment the site drops.
- **Monthly audit (1st of each month):** SSH in, run `/usr/local/bin/sna-health.sh`, check `/var/log/sna-health.log`, `/var/log/sna-deploy.log`, `fail2ban-client status`, `journalctl --since "30 days ago" | grep -i "fail\|error\|crit"`.
- **If Hostinger rate-limits again:** do NOT click "Remove limitations" before identifying the CPU hog. Check `htop`, `/var/log/sna-health.log` for miner alerts, and `ps auxf --sort=-pcpu | head`.
- **Quarterly SSH key rotation:** generate fresh ed25519, add to `authorized_keys`, remove old, verify login with new, remove old fully.
- **Never allow PasswordAuthentication to be re-enabled** — this is what gave the attacker their initial foothold in Incident #1.

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

*Last updated: 2026-04-14 — Incident #3: xmrig re-infection + full OS rebuild + complete rehardening*
*Maintained by: DevOps Team*
