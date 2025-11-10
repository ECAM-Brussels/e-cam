ARG PYTHON_VERSION="3.14.0-slim-trixie"

FROM python:${PYTHON_VERSION} AS builder
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --prefix=/install --no-cache-dir -r requirements.txt

FROM python:${PYTHON_VERSION} AS dev
EXPOSE 8000

COPY symapi symapi

COPY --from=builder /install /usr/local
CMD ["python", "-m", "fastapi", "dev", "--host", "0.0.0.0", "symapi"]


FROM dev as prod
EXPOSE 8000
CMD ["python", "-m", "fastapi", "run", "--workers", "8", "symapi"]
