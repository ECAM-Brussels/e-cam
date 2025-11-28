---
title: Database
slideshow: true
lang: en
---

# Docker for development {.grid .grid-cols-2}

::::: col
`Dockerfile`

~~~ docker
FROM node:lts AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

FROM base AS dev
EXPOSE 3000
CMD sh -c '[ -f "./db/schema.ts" ] && npx drizzle-kit push; npm run dev'

FROM base AS prod
RUN npm run build
EXPOSE 3000
CMD sh -c '[ -f "./db/schema.ts" ] && npx drizzle-kit push; npm run start'
~~~
:::::

::::: col
Conceptually, the docker image is the same as last time,
except for the following things:

- **Multiple stages**: we define two targets

  - `dev`: for development on your own machine
  - `prod`: for your Linux VM

  The difference between the two is mainly that we try to provide **hot-reloading**.
  When you save a file,
  the **dev server** will reload the page automatically for you.

- **Database support**:
  we'll run `npx drizzle-kit push` to synchronise our code with the database
  (e.g. creating the tables automatically)
:::::

# Docker compose for development {.grid .grid-cols-2}

::::: col
~~~ yaml
services:
  db:
    image: postgres:16
    restart: always
    environment:
      POSTGRES_USER: root
      POSTGRES_PASSWORD: hello
      POSTGRES_DB: mydb
    volumes:
      - db_data:/var/lib/postgresql/data
  pgadmin:
    image: dpage/pgadmin4:9
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@example.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "8080:80"
    depends_on:
      - db
  app:
    depends_on:
      - db
    build:
      context: .
      target: dev
    restart: always
    develop:
      watch:
        - path: ./drizzle.config.ts
          target: /app/drizzle.config.ts
          action: sync
        - path: ./package.json
          action: rebuild
        - path: ./app
          target: /app/app
          action: sync
        - path: ./db
          target: /app/db
          action: sync+restart
        - path: ./components
          target: /app/components
          action: sync
        - path: ./lib
          target: /app/lib
          action: sync
        - path: ./public
          target: /app/public
          action: sync
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://root:hello@db:5432/mydb
    volumes:
      - node_modules:/app/node_modules
volumes:
  db_data:
  node_modules:
~~~
:::::

::::: col
- We define a **Postgres** service with specific credentials.
  The volume is to make sure the database data is stored on disk,
  ensuring persistence across rebuilds and restarts.

- The *app* service is our Next.js application.
  We ensure it starts after the database (`depends_on`).
  The `develop` config is new here.
  Its aim is to ensure that when we edit a file,
  it gets immediately copied to the container.
  For some critical files,
  we even trigger a rebuild or a restart.

- In *app*, we supply the url to the postgres database.

- We now use `docker compose watch` to start developing.
:::::

# Developing with Docker {.w-1--2}

Some useful commands:

~~~ bash
# Start development
docker compose watch

# Services logs
docker compose logs -f

# Start a shell in your node container
docker compose exec app bash
~~~

# Install drizzle {.grid .grid-cols-2}

::::: column
Drizzle is going to help us query our database easily.
Let's install it.

~~~ bash
npm install drizzle-orm pg dotenv
npm install -D drizzle-kit @types/pg
~~~

Let's now create `db/index.ts`.
Its aim is to provide a connection to our database.

~~~ ts
import { drizzle } from 'drizzle-orm/node-postgres'

export const db = drizzle(process.env.DATABASE_URL!)
~~~

If we want to use our database in another module,
we'll need to import `db`.
:::::

::::: column
In `drizzle.config.ts`,
put the following:

~~~ ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  schema: './db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
~~~
:::::

# Schema {.w-1--2}

Let's describe our table structure in `db/schema.ts`.

~~~ ts
import { boolean, pgTable, text, uuid } from 'drizzle-orm/pg-core'

export const tasksTable = pgTable('tasks', {
  id: uuid().defaultRandom().primaryKey(),
  title: text().notNull(),
  done: boolean().default(false).notNull(),
})
~~~

::: info
We've configured **Docker compose** to immediately run `npx drizzle-kit push` when `db/` changes.
In particular,
our database will always match the schema.
:::

::: info
- [Drizzle Schema documentation](https://orm.drizzle.team/docs/sql-schema-declaration#shape-your-data-schema)
:::

# Todo App {.grid .grid-cols-2}

::::: col
`lib/tasks.ts`

~~~ ts
'use server'

import { db } from '@/db'
import { tasksTable } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getTasks() {
  return await db.select().from(tasksTable)
}

export async function addTask(form: FormData) {
  await db.insert(tasksTable).values({
    title: String(form.get('title')),
    done: false,
  })
  redirect((await headers()).get('referer') ?? '/')
}

export async function editTask(form: FormData) {
  await db
    .update(tasksTable)
    .set({
      title: String(form.get('title')),
      done: form.get('done') === 'on',
    })
    .where(eq(tasksTable.id, String(form.get('id'))))
  redirect((await headers()).get('referer') ?? '/')
}

export async function removeTask(id: string) {
  await db.delete(tasksTable).where(eq(tasksTable.id, id))
  redirect((await headers()).get('referer') ?? '/')
}
~~~
:::::

::::: col
Drizzle's syntax is very close to raw SQL.

Here is the Todo app from last time,
but modified so that it gets the data from a database.
:::::

# Exercise

- Adapt the blog so that is uses a database.

- Create a registration form to create new users.

- Add a portfolio (with a form to add projects).

- Create an interface to edit your CV.

# Check list for next session

- Can I create a simple CRUD (Create, Read, Update, Delete) app?

- Can I deploy my website automatically with git and Docker?
