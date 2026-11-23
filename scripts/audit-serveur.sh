#!/bin/bash
set -uo pipefail

env_file="${ENV_FILE:-/opt/restaurant/.env.deploy}"
secrets_dir="${SECRETS_DIR:-/opt/restaurant/secrets}"
backup_dir="${BACKUP_DIR:-/opt/backups/postgres}"
alerts=0

ok() {
  echo "[OK]         $1"
}

alerte() {
  echo "[ATTENTION]  $1"
  alerts=$((alerts + 1))
}

sshd_settings="$(sudo sshd -T 2>/dev/null || true)"

if echo "$sshd_settings" | grep -qx "permitrootlogin no"; then ok "SSH : connexion root désactivée"; else alerte "SSH : connexion root encore autorisée"; fi
if echo "$sshd_settings" | grep -qx "passwordauthentication no"; then ok "SSH : mot de passe désactivé"; else alerte "SSH : connexion par mot de passe encore autorisée"; fi

if sudo ufw status | grep -q "Status: active"; then ok "Pare-feu UFW actif"; else alerte "Pare-feu UFW inactif"; fi
if sudo ufw status verbose | grep -q "deny (incoming)"; then ok "UFW : entrées refusées par défaut"; else alerte "UFW : entrées non refusées par défaut"; fi

if sudo fail2ban-client status sshd >/dev/null 2>&1; then ok "Fail2ban : protection SSH active"; else alerte "Fail2ban : protection SSH inactive"; fi

if containers="$(docker ps --format '{{.Names}} {{.Ports}}' 2>/dev/null)"; then
  if echo "$containers" | grep -E '(0\.0\.0\.0|\[::\]):' >/dev/null; then
    alerte "Docker : un port est ouvert sur toutes les interfaces"
    echo "$containers" | grep -E '(0\.0\.0\.0|\[::\]):' | sed 's/^/  /'
  else
    ok "Docker : aucun port publié sur toutes les interfaces"
  fi
else
  alerte "Docker : impossible de lister les conteneurs"
fi

if [ -f "$env_file" ]; then
  mode="$(stat -c '%a' "$env_file")"
  if [ "$mode" = "600" ]; then ok "$env_file : droits 600"; else alerte "$env_file : droits $mode (attendu 600)"; fi
  if grep -qE '^(DB_PASSWORD|ADMIN_PASSWORD)=.+' "$env_file"; then
    alerte "$env_file contient encore un mot de passe en clair"
  else
    ok "$env_file : aucun mot de passe en clair"
  fi
else
  alerte "Fichier $env_file introuvable"
fi

if [ -d "$secrets_dir" ]; then
  dir_mode="$(stat -c '%a' "$secrets_dir")"
  if [ "$dir_mode" = "700" ]; then ok "$secrets_dir : droits 700"; else alerte "$secrets_dir : droits $dir_mode (attendu 700)"; fi
  for name in db_password admin_password; do
    if [ -s "$secrets_dir/$name.txt" ]; then ok "Secret $name.txt présent et non vide"; else alerte "Secret $name.txt manquant ou vide"; fi
  done
else
  alerte "Dossier $secrets_dir introuvable"
fi

if find "$backup_dir" -name 'restaurant-*.sql.gz' -mtime -1 2>/dev/null | grep -q .; then
  ok "Sauvegarde PostgreSQL de moins de 24 h présente"
else
  alerte "Aucune sauvegarde PostgreSQL de moins de 24 h dans $backup_dir"
fi

if crontab -l 2>/dev/null | grep -q 'backup-postgres.sh'; then ok "Cron : sauvegarde planifiée"; else alerte "Cron : sauvegarde non planifiée"; fi

if dpkg -s unattended-upgrades >/dev/null 2>&1; then ok "Mises à jour de sécurité automatiques installées"; else alerte "unattended-upgrades non installé"; fi

echo
if [ "$alerts" -eq 0 ]; then
  echo "Résultat : aucun point bloquant."
  exit 0
fi
echo "Résultat : $alerts point(s) à corriger."
exit 1
