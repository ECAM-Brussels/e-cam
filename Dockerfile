FROM python:latest
WORKDIR /app
RUN pip install poetry
RUN apt-get update && apt-get install -y --no-install-recommends npm pandoc
COPY pyproject.toml poetry.lock package*.json .env ./
RUN npm install
RUN npm install node-env-run

COPY . .
RUN nohup bash -c "poetry run fastapi run symapi &" \
    && until curl -s http://localhost:8000/graphql; do sleep 1; done \
    && npx graphql-codegen
RUN npx prisma generate
RUN poetry run npm run build

EXPOSE 3000

CMD ["sh", "-c", "npx node-env-run .output/server/index.mjs & poetry run fastapi run symapi"]
