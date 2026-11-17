#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage : bash rollback.sh SHA_DU_COMMIT"
  exit 1
fi

cd /opt/restaurant
git fetch origin
git checkout -f "$1"
export IMAGE_TAG="$1"
docker compose -f docker-compose.deploy.yml --env-file .env.deploy pull
docker compose -f docker-compose.deploy.yml --env-file .env.deploy up -d
sleep 15
docker compose -f docker-compose.deploy.yml --env-file .env.deploy ps
