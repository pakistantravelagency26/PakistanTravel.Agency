#!/bin/bash
# ==============================================================================
# PakistanTravel.Agency - Automated Database & Environment Backup
# ==============================================================================
set -e

BACKUP_DIR="${HOME}/backups/pakistantravel-agency"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mkdir -p "$BACKUP_DIR"

echo "Creating database snapshot backup at $BACKUP_DIR/db_$TIMESTAMP.sql.gz..."

if [ -n "$DATABASE_URL" ]; then
    pg_dump "$DATABASE_URL" | gzip > "$BACKUP_DIR/db_$TIMESTAMP.sql.gz"
    echo "Database snapshot saved successfully."
else
    echo "DATABASE_URL not set in environment. Skipping pg_dump."
fi

# Retain last 30 daily backups
find "$BACKUP_DIR" -type f -name "db_*.sql.gz" -mtime +30 -delete
echo "Backup retention check completed."
