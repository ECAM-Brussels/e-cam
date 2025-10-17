FROM node:slim AS base
WORKDIR /app
EXPOSE 3000

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        locales \
        python3 \
        python3-pip \
        rsync \
        wget && \
    echo "en_US.UTF-8 UTF-8" > /etc/locale.gen && \
    locale-gen en_US.UTF-8 && \
    update-locale LANG=en_US.UTF-8 && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

ENV LANG=en_US.UTF-8 \
    LANGUAGE=en_US:en \
    LC_ALL=en_US.UTF-8

RUN wget https://github.com/jgm/pandoc/releases/download/3.8.2/pandoc-3.8.2-1-amd64.deb && \
    apt-get install -y ./pandoc-3.8.2-1-amd64.deb && \
    rm pandoc-3.8.2-1-amd64.deb

COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt --break-system-packages

COPY entrypoint.sh .
ENTRYPOINT ["sh", "/app/entrypoint.sh"]

FROM base AS dev

COPY . .
CMD ["dev", "--", "--host", "0.0.0.0"]

FROM base AS prod

COPY package*.json ./
RUN npm install

COPY . .

CMD ["build"]
