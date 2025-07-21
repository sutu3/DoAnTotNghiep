@echo off
title Docker Clean Rebuild
echo =============================
echo [1] 🛑 Stopping containers...
docker compose down --remove-orphans

echo =============================
echo [2] 🧹 Pruning unused resources...
docker system prune -f

echo =============================
echo [3] 🔨 Building all services...
docker system prune -a -f
docker buildx bake --no-cache --pull

echo =============================
echo [4] 🚀 Starting containers...
docker compose up -d

echo =============================
echo [✔] Done! Clean rebuild completed.
pause
