FROM python:3.14.0-slim-trixie AS dev
WORKDIR /app
EXPOSE 8000

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY symapi symapi

CMD ["python", "-m", "fastapi", "dev", "--host", "0.0.0.0", "symapi"]


FROM python:3.14.0-slim-trixie AS builder
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --prefix=/install --no-cache-dir -r requirements.txt


FROM python:3.14.0-slim-trixie AS production
WORKDIR /app
EXPOSE 8000

COPY --from=builder /install /usr/local
COPY symapi symapi

CMD ["python", "-m", "fastapi", "run", "--workers", "8", "symapi"]
