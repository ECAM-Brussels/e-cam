ARG PYTHON_VERSION="3.14.0-alpine3.22"

FROM python:${PYTHON_VERSION} AS builder
WORKDIR /app
RUN apk add --no-cache gcc musl-dev python3-dev linux-headers
COPY requirements.txt .
RUN pip install --prefix=/install --no-cache-dir -r requirements.txt

FROM python:${PYTHON_VERSION} AS base
WORKDIR /app
COPY --from=builder /install /usr/local
COPY symapi symapi
EXPOSE 8000

FROM base AS dev
CMD ["python", "-m", "fastapi", "dev", "--host", "0.0.0.0", "symapi"]

FROM base AS prod
CMD ["python", "-m", "fastapi", "run", "--workers", "8", "symapi"]
