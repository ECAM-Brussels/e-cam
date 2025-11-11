ARG NODE_VERSION="25.1.0-alpine3.21"

FROM node:${NODE_VERSION} AS dev
WORKDIR /app
EXPOSE 3000

COPY --from=pandoc/minimal:3.8.2.1 /usr/local/bin/pandoc /usr/local/bin/
RUN apk add --no-cache python3 py3-pip
RUN pip3 install --no-cache-dir --break-system-packages sympy panflute
COPY package*.json ./
RUN npm install
COPY . .
RUN npx graphql-codegen
RUN npx prisma generate
CMD sh -c 'npx prisma migrate deploy && npx vinxi dev -- --host 0.0.0.0'
