FROM node:slim
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

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

COPY . .

# set the entrypoint
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["dev", "--", "--host", "0.0.0.0"]
