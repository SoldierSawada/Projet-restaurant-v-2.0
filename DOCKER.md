# Docker — Restaurant

## Structure

```
Restaurant/
├── docker-compose.yml            # Configuration de base
├── docker-compose.override.yml   # Surcharges dev (chargé automatiquement)
├── docker-compose.prod.yml       # Surcharges prod (à appeler explicitement)
├── .env                          # Variables dev
├── .env.prod                     # Variables prod
├── backend/
│   ├── Dockerfile                # Backend multi-étapes
│   └── .dockerignore
└── frontend/
    ├── Dockerfile                # Frontend multi-étapes (dev, build, nginx)
    ├── nginx.conf                # Configuration Nginx pour SPA
    └── .dockerignore
```

## Prérequis

- Docker Desktop lancé
- WSL2 activé dans Docker Desktop (Settings → Resources → WSL Integration)

## Lancer en mode dev

Depuis le dossier `Restaurant` :

```bash
docker compose up -d --build
```

Le fichier `docker-compose.override.yml` est chargé automatiquement. Il ajoute le serveur Vite (hot reload), les ports de la base et Adminer.

## Lancer en mode prod

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

Avant la première mise en prod, modifiez `POSTGRES_PASSWORD` et `ADMIN_PASSWORD` dans `.env.prod`.

## Accéder aux services

| Service        | Dev                              | Prod                        |
|----------------|----------------------------------|-----------------------------|
| Frontend       | http://localhost:5173            | http://localhost            |
| Backend API    | http://localhost:3001/restaurant | http://localhost:3001/restaurant |
| Santé backend  | http://localhost:3001/status     | http://localhost:3001/status |
| Adminer (BDD)  | http://localhost:8080            | Non disponible              |
| PostgreSQL     | localhost:5432                   | Non exposé                  |

## Voir les logs

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
```

Pour l'état des conteneurs :

```bash
docker compose ps
```

## Réinitialiser la base de données

Cette commande supprime le volume `pgdata` et toutes les données :

```bash
docker compose down -v
docker compose up -d --build
```

## Variables d'environnement

| Variable           | Rôle                                                  |
|--------------------|-------------------------------------------------------|
| POSTGRES_USER      | Utilisateur PostgreSQL                                |
| POSTGRES_PASSWORD  | Mot de passe PostgreSQL                               |
| POSTGRES_DB        | Nom de la base                                        |
| ADMIN_EMAIL        | Email du compte responsable créé au démarrage         |
| ADMIN_PASSWORD     | Mot de passe du compte responsable                    |
| VITE_API_URL       | URL de l'API vue par le navigateur (utilisée au build) |

Les conteneurs backend et base lisent leurs variables depuis `.env` en dev, et depuis `.env.prod` en prod (via `env_file`). `VITE_API_URL` est lu pour le build du frontend : utilisez donc toujours `--env-file .env.prod` pour la commande prod.

## Notes

- En dev, le backend et le frontend se rechargent automatiquement quand vous modifiez le code (dossiers `backend/` et `frontend/` montés dans les conteneurs).
- Si vous changez les dépendances (`package.json`), relancez `docker compose up -d --build`.
- En prod, le code est copié dans l'image : après une modification, relancez la commande prod avec `--build`.
- Le projet n'utilise pas Redis : il n'y a donc pas de service Redis.
