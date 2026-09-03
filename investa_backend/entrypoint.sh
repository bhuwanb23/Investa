#!/bin/sh
set -e

echo "[entrypoint] Running database migrations..."
python manage.py migrate --noinput

echo "[entrypoint] Collecting static files..."
python manage.py collectstatic --noinput 2>/dev/null || true

echo "[entrypoint] Starting $@"
exec "$@"