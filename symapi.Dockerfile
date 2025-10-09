FROM python:3-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY symapi symapi

CMD ["fastapi", "run", "--host", "0.0.0.0", "symapi"]
