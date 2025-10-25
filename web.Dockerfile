FROM pandoc/minimal:3.8.2.1 AS pandoc

FROM node:slim AS base
WORKDIR /app
EXPOSE 3000

COPY --from=pandoc /usr/local/bin/pandoc /usr/local/bin/

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        locales \
        python3 \
        python3-pip \
        rsync && \
    echo "en_US.UTF-8 UTF-8" > /etc/locale.gen && \
    locale-gen en_US.UTF-8 && \
    update-locale LANG=en_US.UTF-8 && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

ENV LANG=en_US.UTF-8 \
    LANGUAGE=en_US:en \
    LC_ALL=en_US.UTF-8

COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt --break-system-packages

COPY entrypoint.sh .
ENTRYPOINT ["sh", "/app/entrypoint.sh"]

COPY package*.json ./
RUN npm install

COPY . .
