#!/bin/bash
# ==============================================================================
# PakistanTravel.Agency - Zero-Downtime Deployment Script
# ==============================================================================
set -e

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$APP_DIR"

echo "========================================================"
echo " Starting Zero-Downtime Deployment: PakistanTravel.Agency"
echo " Time: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "========================================================"

# 1. Fetch latest changes from GitHub main branch
echo "[1/6] Fetching latest commits from git origin main..."
git fetch origin main
CURRENT_COMMIT=$(git rev-parse HEAD)
TARGET_COMMIT=$(git rev-parse origin/main)

echo "Current Commit: $CURRENT_COMMIT"
echo "Target Commit:  $TARGET_COMMIT"

# Tag current running container as rollback target before making changes
if docker image inspect pta-web:latest >/dev/null 2>&1; then
    echo "[2/6] Archiving current image as rollback target (pta-web:rollback-target)..."
    docker tag pta-web:latest pta-web:rollback-target
fi

git checkout main
git pull origin main

# 2. Build New Standalone Container Image
echo "[3/6] Building production Docker image (pta-web:$TARGET_COMMIT)..."
docker build -t pta-web:"$TARGET_COMMIT" -t pta-web:latest .

# 3. Push Additive Database Migrations (Neon PostgreSQL)
echo "[4/6] Synchronizing database schema with Neon PostgreSQL..."
docker run --rm --env-file .env pta-web:latest npx prisma db push --skip-generate

# 4. Graceful Container Restart & Rolling Health Check
echo "[5/6] Starting container and performing health check..."
docker compose up -d --no-deps --build web

HEALTH_CHECK_ATTEMPTS=0
MAX_ATTEMPTS=15
HEALTH_URL="http://127.0.0.1:3000/api/health"

until curl -s -f "$HEALTH_URL" | grep -q "healthy" || [ $HEALTH_CHECK_ATTEMPTS -eq $MAX_ATTEMPTS ]; do
    echo "Waiting for Next.js standalone health probe... (attempt $((HEALTH_CHECK_ATTEMPTS+1))/$MAX_ATTEMPTS)"
    sleep 3
    HEALTH_CHECK_ATTEMPTS=$((HEALTH_CHECK_ATTEMPTS+1))
done

if [ $HEALTH_CHECK_ATTEMPTS -eq $MAX_ATTEMPTS ]; then
    echo "ERROR: Health check failed! Initiating automatic emergency rollback..."
    bash "$APP_DIR/scripts/rollback.sh"
    exit 1
fi

# 5. Ensure Caddy Reverse Proxy is Reloaded and Healthy
echo "[6/6] Reloading reverse proxy configuration..."
docker compose up -d caddy

# 6. Clean up dangling images older than 24 hours
docker image prune -f --filter "until=24h" || true

echo "========================================================"
echo " Deployment Successfully Completed! Live at https://www.pakistantravel.agency"
echo " Commit: $TARGET_COMMIT"
echo "========================================================"
