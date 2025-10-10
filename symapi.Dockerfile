FROM python:3-slim AS base

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY symapi symapi

EXPOSE 8000
ENTRYPOINT ["python", "-m"]

FROM base AS dev
CMD ["fastapi", "dev", "--host", "0.0.0.0", "symapi"]

FROM base AS prod
CMD ["fastapi", "run", "--host", "0.0.0.0", "symapi", "--workers", "$(nproc)"]
