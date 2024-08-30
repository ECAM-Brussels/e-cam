FROM python:latest
WORKDIR /app
RUN pip install poetry
RUN apt-get update && apt-get install -y --no-install-recommends npm pandoc
COPY pyproject.toml poetry.lock package*.json ./
RUN npm install

COPY . .
RUN nohup bash -c "poetry run fastapi run symapi &" \
    && until curl -s http://localhost:8000/graphql; do sleep 1; done \
    && npx graphql-codegen
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npm run start & poetry run fastapi run symapi"]
