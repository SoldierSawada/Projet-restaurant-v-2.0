# Sécurité : rapport et guide pas à pas

Ce document dit ce qui a été fait dans le projet, ce qui reste à faire sur le VPS, et les points à trancher.

## 1. Résumé

- **Dans le projet (code, Docker, scripts) :** fait et vérifié. Il reste à committer et pousser.
- **Sur le VPS (SSH, pare-feu, fail2ban, sauvegardes automatiques) :** à faire avec le guide de la section 4. Je n'ai pas accès au serveur, donc je n'ai rien lancé dessus.
- **Ordre important :** crée les fichiers de secrets sur le VPS (étape 6 du guide) **avant** de pousser sur `main`. Sinon le déploiement échoue, sans toucher aux conteneurs qui tournent.

## 2. Ce qui a été fait dans le projet

| Sujet | Avant | Après |
|---|---|---|
| Dépendances backend (production) | 12 failles : 1 critique, 3 hautes, 7 modérées, 1 faible | 4 failles modérées, aucune haute ni critique |
| Dépendances frontend (production) | 5 failles : 2 hautes, 3 modérées | 1 faille haute (zod, voir section 5) |
| Paquets inutiles | `morgan` installé sans être utilisé | Supprimé |
| Identifiants de requête | Paquet `uuid` | Fonction native de Node (`randomUUID`) |
| Mots de passe PostgreSQL et admin | Variables d'environnement, visibles avec `docker inspect` | Fichiers secrets (`DB_PASSWORD_FILE`, `ADMIN_PASSWORD_FILE`) |
| Conteneurs (déploiement) | Droits standards | Système de fichiers en lecture seule, `no-new-privileges`, capacités Linux retirées, limites de mémoire, CPU et processus |
| Frontend | Recevait toutes les variables de `.env.deploy` | Ne reçoit plus rien |
| Staging | Ports ouverts sur toutes les interfaces (contournent UFW) | Ports liés à `127.0.0.1`, comme la production |
| Serveur web du frontend | Version de nginx affichée | Version masquée, en-têtes de sécurité ajoutés |
| Mises à jour des dépendances | Manuelles | Dependabot, une fois par semaine |
| Sauvegarde PostgreSQL | Aucune | Script de sauvegarde, script de restauration, script d'audit |

Dépendances modifiées :

- Backend : routing-controllers passe en 0.11.3, ws en 8.23.0, et des versions corrigées de `body-parser`, `proxy-addr`, `qs` et `brace-expansion` sont forcées via `overrides`.
- Frontend : `follow-redirects` et `fast-uri` sont forcés en versions corrigées via `overrides`.

### Bugs trouvés pendant les tests, et corrigés

- **Restauration bloquée :** le mot de passe n'était pas transmis à `createdb`, qui attendait une saisie au clavier. Corrigé.
- **Deux sauvegardes dans la même seconde :** elles se partageaient le même nom de fichier, et un échec pouvait supprimer une bonne sauvegarde. Le nom contient maintenant le numéro du processus.
- **Secret vide :** un fichier de secret vide aurait donné un mot de passe vide sans erreur. Le backend refuse maintenant de démarrer dans ce cas.
- **Audit Docker trompeur :** si Docker était injoignable, l'audit affichait « OK ». Il affiche maintenant une alerte et renvoie un code d'erreur.

## 3. Vérifications faites, et ce qui n'a pas pu être testé

| Test | Résultat |
|---|---|
| Backend : typecheck, tests, build | OK, 137 tests (132 avant, 5 nouveaux sur les secrets) |
| Backend démarré pour de vrai (build compilé) | `/status` 200, `/metrics` 200, menu 200, route admin sans authentification 401, connexion admin avec le mot de passe lu dans le fichier 200, mauvais mot de passe 400 |
| Frontend : lint, tests, build | OK, 205 tests |
| Frontend dans un navigateur réel | 9 routes chargées, 0 erreur JavaScript |
| Sauvegarde PostgreSQL réelle (PostgreSQL 16 de test, mot de passe avec caractères spéciaux) | Fichier créé et contenant la table ; mauvais mot de passe : échec, fichier partiel supprimé ; mauvais port : échec |
| Restauration réelle dans une base de test | 3 lignes retrouvées à l'identique ; refus de restaurer sur la base de production ; refus d'un fichier absent |
| Compose de déploiement et de staging (CLI Docker Compose) | Valides ; ports staging liés à 127.0.0.1 |
| Script d'audit | Détecte les écarts et renvoie un code d'erreur |

Ce qui n'a **pas** pu être testé ici :

- Démarrer réellement les conteneurs : le démon Docker n'est pas disponible dans cet environnement. La configuration est validée, pas l'exécution. C'est la première chose à vérifier après le déploiement.
- SSH, UFW, fail2ban et cron sur le VPS (accès impossible d'ici).
- Le pipeline GitHub Actions (à vérifier après le push).

## 4. Guide pas à pas sur le VPS

Connecte-toi au VPS avec ton utilisateur habituel (ex. `deploy`). Les commandes se lancent sur le VPS, pas sur ton PC.

### Étape 1 : garder une porte de secours

Ouvre un **deuxième terminal** connecté au VPS et laisse-le ouvert pendant toute la manipulation. Si un changement SSH te bloque, tu pourras corriger depuis ce terminal déjà connecté.

### Étape 2 : vérifier que la connexion par clé fonctionne

Depuis ton PC, dans un nouveau terminal :

```bash
ssh deploy@IP_DU_VPS
```

Si on te demande un mot de passe, **n'enchaîne pas** : ajoute d'abord ta clé publique (`ssh-copy-id deploy@IP_DU_VPS`, depuis ton PC).

### Étape 3 : durcir SSH

Crée le fichier de configuration. Le préfixe `00-` est important : les fichiers sont lus dans l'ordre alphabétique, le premier réglage trouvé gagne, donc celui-ci l'emporte sur les réglages par défaut de l'hébergeur.

```bash
sudo tee /etc/ssh/sshd_config.d/00-securite.conf > /dev/null <<'SSHCONF'
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
SSHCONF
```

Vérifie la syntaxe, puis recharge SSH :

```bash
sudo sshd -t && sudo systemctl reload ssh
```

Vérifie les réglages réellement appliqués :

```bash
sudo sshd -T | grep -E "^(permitrootlogin|passwordauthentication) "
```

Le résultat doit afficher `permitrootlogin no` et `passwordauthentication no`.

Puis, depuis ton PC, dans un **nouveau** terminal : `ssh deploy@IP_DU_VPS`. Si ça marche, tu peux fermer les anciens terminaux.

### Étape 4 : pare-feu UFW

Refuser tout ce qui entre par défaut, n'ouvrir que SSH, HTTP et HTTPS, et limiter les tentatives SSH :

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw limit 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status verbose
```

Le résultat doit montrer seulement 22 (limité), 80 et 443.

Attention : Docker contourne UFW pour les ports publiés sur toutes les interfaces. Le projet lie ses ports à `127.0.0.1`, donc c'est sûr. Ne publie jamais un port sans `127.0.0.1:` devant.

### Étape 5 : fail2ban et mises à jour automatiques

```bash
sudo apt update
sudo apt install -y fail2ban unattended-upgrades
```

Crée la configuration de fail2ban :

```bash
sudo tee /etc/fail2ban/jail.local > /dev/null <<'F2B'
[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 5

[sshd]
enabled = true
F2B
sudo systemctl restart fail2ban
sudo fail2ban-client status sshd
```

Pour les mises à jour de sécurité automatiques, lance `sudo dpkg-reconfigure -plow unattended-upgrades` et réponds **Oui**.

### Étape 6 : fichiers secrets (avant de pousser sur main)

Le déploiement lit maintenant les mots de passe depuis des fichiers, et non plus depuis `.env.deploy`. Les commandes ci-dessous copient les valeurs actuelles sans les afficher à l'écran.

```bash
cd /opt/restaurant
mkdir -p secrets && chmod 700 secrets
grep '^DB_PASSWORD=' .env.deploy | cut -d= -f2- > secrets/db_password.txt
grep '^ADMIN_PASSWORD=' .env.deploy | cut -d= -f2- > secrets/admin_password.txt
chmod 644 secrets/db_password.txt secrets/admin_password.txt
wc -c secrets/*.txt
```

Chaque fichier doit afficher un nombre supérieur à 0.

Si `admin_password.txt` affiche `0`, c'est que `ADMIN_PASSWORD` n'était pas défini dans `.env.deploy`. Le code utilisait alors un mot de passe par défaut connu de tous. Choisis un vrai mot de passe : la commande suivante le demande sans l'afficher.

```bash
read -rs -p "Mot de passe admin : " admin_pw; printf '%s' "$admin_pw" > secrets/admin_password.txt; unset admin_pw; echo
```

Pourquoi `644` dans un dossier `700` : le dossier empêche les autres utilisateurs du VPS de voir les fichiers. Le fichier doit rester lisible par le processus du conteneur, qui n'a pas le même identifiant que toi.

Ensuite, pousse sur `main`. Une fois le déploiement terminé, vérifie que le backend voit bien le secret :

```bash
cd /opt/restaurant
docker compose -f docker-compose.deploy.yml --env-file .env.deploy exec backend sh -c 'test -s /run/secrets/db_password && echo OK'
```

Quand c'est confirmé, retire les anciens mots de passe de `.env.deploy` :

```bash
sed -i '/^DB_PASSWORD=/d; /^ADMIN_PASSWORD=/d' .env.deploy
```

### Étape 7 : sauvegardes PostgreSQL

Les scripts sont dans le dépôt, dans `scripts/`. Après le déploiement, ils sont dans `/opt/restaurant/scripts/`.

Crée le dossier des sauvegardes et fais une première sauvegarde à la main :

```bash
sudo mkdir -p /opt/backups/postgres && sudo chown "$USER" /opt/backups/postgres
/opt/restaurant/scripts/backup-postgres.sh
ls -la /opt/backups/postgres
```

Test de restauration, dans une base de test (jamais dans la base de production) :

```bash
/opt/restaurant/scripts/restore-postgres.sh /opt/backups/postgres/NOM_DU_FICHIER.sql.gz restaurant_test
```

La restauration crée la base de test, ce qui demande que l'utilisateur de la base ait le droit de créer des bases. S'il ne l'a pas, le script s'arrête sans rien casser : dis-le-moi et on cherchera une autre solution.

Planification quotidienne à 3 h du matin :

```bash
crontab -e
```

Ajoute cette ligne, puis enregistre :

```
0 3 * * * /opt/restaurant/scripts/backup-postgres.sh >> $HOME/backup-postgres.log 2>&1
```

### Étape 8 : audit final

```bash
/opt/restaurant/scripts/audit-serveur.sh
```

Chaque ligne doit afficher `[OK]`. Le script renvoie un code d'erreur s'il reste un point à corriger.

## 5. Points repérés et non modifiés (à décider)

Ces points sont importants, mais changer leur comportement peut casser quelque chose. Je ne les ai donc pas touchés.

1. **CORS ouvert à tous** (`app.use(cors())` dans `SetUp.ts`) : n'importe quel site peut appeler l'API depuis un navigateur. Il faudrait limiter aux seuls domaines du site.
2. **`/metrics` public** : les métriques Prometheus sont accessibles sans authentification. Si le reverse proxy expose le backend, elles sont visibles de tous.
3. **Mot de passe admin par défaut** (`Responsable2026`, dans `SeedAdmin.ts`) : utilisé si `ADMIN_PASSWORD` est vide. Il devrait être obligatoire en production.
4. **`DB_SYNCHRONIZE=true`** dans l'exemple de production : TypeORM peut modifier les tables au démarrage, ce qui peut effacer des colonnes. En production, il faudrait le mettre à `false` et utiliser des migrations.
5. **Pas de limite de tentatives sur `/login`** : fail2ban ne protège que SSH et nginx.
6. **Versions majeures non appliquées :**
   - zod 3 vers 4 (faille haute dans le frontend) : 11 fichiers à adapter, et les messages d'erreur des formulaires changeraient. Un essai a donné 5 fichiers en erreur de compilation.
   - typeorm 0.3 vers 1.x (failles modérées dans le backend) : montée majeure, à tester sur la persistance.
7. **Failles dans les outils de développement** (nx, vite, vitest) : elles sont dans les dépendances de développement. Elles ne sont pas dans les images Docker de production, mais elles concernent ton poste et la CI.
8. **`docker-compose.prod.yml`** publie le port 80 sur toutes les interfaces et utilise `.env.prod`, qui n'existe pas dans la CI. Ce fichier ne doit pas être utilisé sur le VPS.
9. **`frontend/.github/workflows/ci.yml`** est ignoré par GitHub : seul le dossier `.github` à la racine compte.
10. **Pas de Helmet** (en-têtes HTTP de l'API) : les en-têtes de sécurité ne sont ajoutés que sur le frontend.

## 6. Ce qui reste à décider

1. Où est PostgreSQL ? Conteneur sur le VPS, base managée (AWS, Neon, etc.) ou autre ? Le script de sauvegarde se connecte à `DB_HOST` depuis le réseau de l'hôte : cette adresse doit être joignable depuis le VPS.
2. Quel serveur web gère HTTPS sur le VPS (nginx, Caddy, Traefik, autre) ? Cela détermine la jail fail2ban nginx et la configuration des ports 80 et 443.
3. Veux-tu que je traite les points 1 à 4 de la section 5 ?
4. Veux-tu tenter les montées majeures (zod 4, typeorm 1.x) dans une branche séparée ?
5. Gardes-tu le port SSH 22 ? Changer le port impose d'ajouter `port:` dans `.github/workflows/deploy.yml`.
