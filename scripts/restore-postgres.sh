#!/bin/bash
set -euo pipefail
umask 077

if [ "$#" -ne 2 ]; then
  echo "Usage : restore-postgres.sh <fichier.sql.gz> <nom_base_cible>" >&2
  exit 1
fi

backup_file="$1"
target_db="$2"
env_file="${ENV_FILE:-/opt/restaurant/.env.deploy}"
secrets_dir="${SECRETS_DIR:-/opt/restaurant/secrets}"

production_db="$(grep -E '^DB_NAME=' "$env_file" | cut -d= -f2- || true)"

if [ "$target_db" = "$production_db" ] || [ "$target_db" = "postgres" ]; then
  echo "Refus : la base cible ne doit pas être la base de production ($production_db)" >&2
  exit 1
fi

if [ ! -s "$backup_file" ]; then
  echo "Fichier de sauvegarde introuvable ou vide : $backup_file" >&2
  exit 1
fi

run_pg() {
  docker run --rm -i --network host \
    --env-file "$env_file" \
    -e "TARGET_DB=$target_db" \
    -v "$secrets_dir/db_password.txt:/run/secrets/db_password:ro" \
    postgres:18-alpine \
    sh -c "export PGPASSWORD=\"\$(cat /run/secrets/db_password)\"; $1"
}

run_pg 'dropdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" --if-exists "$TARGET_DB" && createdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" "$TARGET_DB"'

gunzip -c "$backup_file" | run_pg 'psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" -d "$TARGET_DB" -v ON_ERROR_STOP=1 -q'

tables="$(run_pg 'psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" -d "$TARGET_DB" -tAc "SELECT count(*) FROM information_schema.tables WHERE table_schema = '\''public'\''"')"

echo "Restauration terminée dans la base $target_db : $tables table(s) trouvée(s)"
