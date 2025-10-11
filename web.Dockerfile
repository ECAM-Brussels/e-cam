FROM node:slim AS base
WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        python3 \
        python3-pip \
        pandoc && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt --break-system-packages

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
ENTRYPOINT ["sh", "/app/entrypoint.sh"]

FROM base AS dev
CMD ["dev", "--", "--host", "0.0.0.0"]

FROM base AS prod
CMD ["build"]
