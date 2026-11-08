# VPS Migration & Deployment Runbook: PakistanTravel.Agency

This document provides complete instructions to migrate **PakistanTravel.Agency** (`https://www.pakistantravel.agency`) from Vercel to a self-hosted Ubuntu 24.04 LTS VPS, with zero downtime and instant rollback capabilities.

---

## 1. Server Sizing & Specifications

| Resource | Minimum Requirement | Recommended Specification |
| :--- | :--- | :--- |
| **OS** | Ubuntu 22.04 / 24.04 LTS (x86_64) | Ubuntu 24.04 LTS |
| **CPU** | 2 vCPU | 4 vCPU |
| **RAM** | 2 GB (with 2 GB Swap) | 4 GB |
| **Disk** | 40 GB NVMe SSD | 80 GB NVMe SSD |
| **Network** | 1 Gbps port, static public IPv4 | Static IPv4 with Cloudflare Proxy |

---

## 2. Server Initial Hardening

### Step 2.1: Create Deploy User & Configure SSH
```bash
# Connect as root initially
ssh root@YOUR_SERVER_IP

# Update system packages
apt update && apt upgrade -y

# Create dedicated non-root deployment user
adduser --gecos "" deploy
usermod -aG sudo deploy

# Copy authorized SSH keys to deploy user
mkdir -p /home/deploy/.ssh
cp /root/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys
```

### Step 2.2: Hardened SSH Configuration (`/etc/ssh/sshd_config`)
Ensure password authentication and root login are disabled:
```text
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
X11Forwarding no
```
Reload SSH:
```bash
systemctl restart ssh
```

### Step 2.3: Configure UFW Firewall
```bash
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw --force enable
```

---

## 3. Install Docker Engine & Docker Compose

```bash
# Install prerequisites
apt install -y ca-certificates curl gnupg lsb-release

# Add Docker official GPG key
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

# Add Docker apt repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker CE and Compose plugin
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Grant deploy user permission to run docker without sudo
usermod -aG docker deploy
```

Log out and log back in as `deploy` user:
```bash
ssh deploy@YOUR_SERVER_IP
docker version
```

---

## 4. Clone Repository & Setup Environment

```bash
mkdir -p /home/deploy/apps
cd /home/deploy/apps
git clone https://github.com/pakistantravelagency26/PakistanTravel.Agency.git
cd PakistanTravel.Agency
```

Create production `.env` file (`/home/deploy/apps/PakistanTravel.Agency/.env`):
```bash
cat << 'EOF' > .env
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://www.pakistantravel.agency
NEXTAUTH_URL=https://www.pakistantravel.agency
NEXTAUTH_SECRET=YOUR_SECURE_RANDOM_SECRET_AT_LEAST_32_CHARACTERS

# Neon PostgreSQL Database Connection
DATABASE_URL=postgres://neondb_owner:YOUR_SECRET@ep-rapid-mud-a1v8sgvo-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=15

# Transactional Email (Resend or SMTP)
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASSWORD=re_YOUR_KEY
SMTP_FROM=PakistanTravel.Agency <no-reply@pakistantravel.agency>
ADMIN_ALERT_EMAIL=ops@pakistantravel.agency

# Site Configuration
NEXT_PUBLIC_COMMISSION_PERCENT=10
EOF

chmod 600 .env
```

---

## 5. Cloudflare DNS & SSL Configuration

### Step 5.1: Cloudflare SSL/TLS Mode
In Cloudflare Dashboard:
1. Navigate to **SSL/TLS** $\to$ **Overview**.
2. Select **Full (Strict)**.

### Step 5.2: Cloudflare Origin CA Certificate (Recommended for Zero-Maintenance 15-Year SSL)
1. Go to **SSL/TLS** $\to$ **Origin Server** $\to$ **Create Certificate**.
2. Hostnames: `pakistantravel.agency`, `*.pakistantravel.agency`.
3. Save the certificate file as `certs/origin.pem`.
4. Save the private key as `certs/origin.key`.
5. Secure permissions:
   ```bash
   mkdir -p certs
   chmod 600 certs/origin.key
   ```

---

## 6. Build & Launch Containers

Run the automated deployment script:
```bash
chmod +x scripts/*.sh
./scripts/deploy.sh
```

Inspect container status:
```bash
docker compose ps
curl http://127.0.0.1:3000/api/health
```
Expected output:
```json
{"status":"healthy","uptimeSeconds":15,"environment":"production"}
```

---

## 7. Systemd Service for Automatic Boot Recovery

Create `/etc/systemd/system/pakistantravel.service`:
```ini
[Unit]
Description=PakistanTravel.Agency Docker Compose Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/deploy/apps/PakistanTravel.Agency
User=deploy
Group=deploy
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable pakistantravel.service
```

---

## 8. Cutover & DNS Switch from Vercel to VPS

When ready to switch live traffic:
1. In Cloudflare DNS:
   - Edit the **A** record for `pakistantravel.agency`: Change target IP to **YOUR_VPS_PUBLIC_IP** (Proxy status: **Proxied**).
   - Verify CNAME record for `www` points to `pakistantravel.agency` (Proxy status: **Proxied**).
2. Monitor server logs in real time:
   ```bash
   docker compose logs -f web
   ```
3. Test from browser:
   - `https://www.pakistantravel.agency`
   - `https://www.pakistantravel.agency/tours`
   - `https://www.pakistantravel.agency/api/health`

---

## 9. Rollback Procedures

### Scenario A: Rollback Code / Container to Previous Version
If an update causes issues, execute the 1-command rollback:
```bash
./scripts/rollback.sh
```
This restores the previously archived container image (`pta-web:rollback-target`) in under 5 seconds without requiring a full rebuild.

### Scenario B: Emergency Rollback to Vercel
If the physical VPS hardware or datacenter experiences an outage, switch Cloudflare DNS back to Vercel immediately:
1. In Cloudflare DNS:
   - Edit **A** record for `pakistantravel.agency`: Change IP back to `76.76.21.21` (Vercel Anycast IP).
   - Set CNAME for `www` to `cname.vercel-dns.com`.
2. Cloudflare Anycast propagates the change worldwide within **30 seconds**.
