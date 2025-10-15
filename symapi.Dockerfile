FROM python:3-slim AS base
WORKDIR /app
EXPOSE 8000

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    build-essential \
    && rm -rf /var/lib/apt/lists/*


COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY symapi symapi

FROM base AS dev
CMD ["python", "-m", "fastapi", "dev", "--host", "0.0.0.0", "symapi"]

FROM base AS prod
CMD ["python", "-m", "fastapi", "run", "--host", "0.0.0.0", "symapi", "--workers", "$(nproc)"]
