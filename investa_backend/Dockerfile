FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    APP_HOME=/app \
    APP_USER=appuser \
    APP_GROUP=appgroup \
    HOME=/app

# Set work directory
WORKDIR ${APP_HOME}

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt gunicorn

# Copy project
COPY . .

# Create non-root user, runtime directories, and collect static files
RUN addgroup --system --gid 1001 ${APP_GROUP} \
    && adduser --system --uid 1001 --ingroup ${APP_GROUP} ${APP_USER} \
    && mkdir -p ${APP_HOME}/media ${APP_HOME}/staticfiles \
    && chown -R ${APP_USER}:${APP_GROUP} ${APP_HOME} \
    && chmod +x ${APP_HOME}/entrypoint.sh \
    && INVESTA_SECRET_KEY=build-secret INVESTA_DEBUG=True \
       python manage.py collectstatic --noinput 2>/dev/null || true

# Switch to non-root user
USER ${APP_USER}

# Expose port
EXPOSE 8000

# Healthcheck (API ping endpoint)
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=15s \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/api/ping/', timeout=5)"

# Run migrations, collect static, then start gunicorn
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["gunicorn", "investa_backend.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "4", "--timeout", "120"]