---
title: Database
slideshow: true
lang: en
---

# Docker {.w-1--2}

::: definition
Docker is a tool that lets you package an application and its dependencies into a container
so that it **runs the same way everywhere**.
:::

Term            Explanation
-----           ------------
Image           Blueprint for a container
Container       Running instance of an image
Dockerfile      Recipe for building your own image
Docker Hub      Public library of images

[Install Docker Desktop](https://www.docker.com/products/docker-desktop/)

# Docker Compose {.columns-2}

::: definition
Docker Compose is a tool that lets you define and run multi-container Docker applications.
:::

We are going to use it to run our **database server**.

docker-compose.yaml:

~~~ yaml
services:
  db:
    image: postgres:latest
    ports:
      - 5432:5432
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
  adminer:
    image: adminer
    ports:
      - 8080:8080
~~~

::: info
- `docker compose up` to start the services
- `docker compose down` to stop them
:::

# Enviroment variables {.w-1--2}

`.env` files are used for storing secrets or sensitive information.

~~~
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=database

DATABASE_URL=postgres://user:password@localhost:5432/database
~~~

::: info
Do NOT commit this file to git.
:::

# Set up drizzle {.grid .grid-cols-2}

::::: column
Drizzle is going to help us query our database easily.
Let's install it.

~~~ bash
npm install drizzle-orm@rc pg dotenv
npm install -D drizzle-kit@rc @types/pg
~~~

Let's now create `db/index.ts`.
Its aim is to provide a connection to our database.

~~~ ts
import { drizzle } from 'drizzle-orm/node-postgres'

export const db = drizzle(process.env.DATABASE_URL!)
~~~
:::::

::::: column
In `drizzle.config.ts`,
put the following:

~~~ ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  schema: './db/schema.ts',
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
After each change in the schema, run `npx drizzle-kit push`.

- [Drizzle Schema documentation](https://orm.drizzle.team/docs/sql-schema-declaration#shape-your-data-schema)
:::

# Adminer {.w-1--2}

Basic interface to check the contents of your database.

- URL: `http://localhost:8080`

- System: `PostgreSQL`

- Server: `db`

- Credentials: see `.env`

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
