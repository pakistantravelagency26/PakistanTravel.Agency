#!/bin/bash
# ==============================================================================
# PakistanTravel.Agency - Emergency Rollback Script
# ==============================================================================
set -e

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$APP_DIR"

echo "========================================================"
echo " INITIATING EMERGENCY ROLLBACK: PakistanTravel.Agency"
echo " Time: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "========================================================"

if ! docker image inspect pta-web:rollback-target >/dev/null 2>&1; then
    echo "ERROR: No rollback target image (pta-web:rollback-target) found!"
    echo "Falling back to previous git commit checkout..."
    git checkout HEAD~1
    docker build -t pta-web:latest .
else
    echo "Promoting rollback-target image to pta-web:latest..."
    docker tag pta-web:rollback-target pta-web:latest
fi

echo "Restarting web service with prior working image..."
docker compose stop web
docker compose rm -f web
docker compose up -d web

echo "Verifying health of restored service..."
sleep 5
HEALTH_URL="http://127.0.0.1:3000/api/health"
if curl -s -f "$HEALTH_URL" | grep -q "healthy"; then
    echo "========================================================"
    echo " Rollback Successful: Service is restored and healthy!"
    echo "========================================================"
else
    echo "FATAL: Rollback failed health check! Check docker logs immediately with: docker compose logs web"
    exit 1
fi
