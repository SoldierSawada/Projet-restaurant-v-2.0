#!/bin/bash
set -euo pipefail

env_file="${ENV_FILE:-/opt/restaurant/.env.deploy}"
secrets_dir="${SECRETS_DIR:-/opt/restaurant/secrets}"
backup_dir="${BACKUP_DIR:-/opt/backups/postgres}"
keep_days="${KEEP_DAYS:-14}"

mkdir -p "$backup_dir"
chmod 700 "$backup_dir"

file="$backup_dir/restaurant-$(date +%Y%m%d-%H%M%S)-$$.sql.gz"

if ! docker run --rm --network host \
  --env-file "$env_file" \
  -v "$secrets_dir/db_password.txt:/run/secrets/db_password:ro" \
  postgres:16-alpine \
  sh -c 'PGPASSWORD="$(cat /run/secrets/db_password)" pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" "$DB_NAME"' \
  | gzip > "$file"; then
  rm -f "$file"
  echo "Échec de la sauvegarde" >&2
  exit 1
fi

if [ ! -s "$file" ]; then
  rm -f "$file"
  echo "Sauvegarde vide : fichier supprimé" >&2
  exit 1
fi

find "$backup_dir" -name 'restaurant-*.sql.gz' -mtime +"$keep_days" -delete

echo "Sauvegarde créée : $file"
