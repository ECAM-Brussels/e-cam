---
title: Monorepo and API design
slideshow: true
lang: en
---

# Outline

- Set up monorepo

- Set up your database

- Work on your API

# Prerequisite: Node, pnpm {.grid .grid-cols-2 .gap-4}

<Iframe src="https://nodejs.org/en" class="rounded-xl border shadow-xl w-full h-full" />

::::: column
- Install a recent version of Node.js

  ::: info
  Node.js is a runtime that allows you to run JavaScript on your computer.
  :::

- Install `pnpm` globally

  ```bash
  npm install -g pnpm
  ```

  ::: info
  pnpm is a package manager that handles monorepos better.
  :::
:::::

# Prerequisites: tools {.w-1--2}

- Docker

- **VS Code** as the text editor.
  Install the following extensions:

  - **Prettier**: code formatter

    ::: remark
    Please enable "Format on Save" (Ctrl+,).
    :::

  - **Prisma**: syntax highlighting and intellisense for Prisma schemas

  - **Tailwind CSS IntelliSense**: helps you with Tailwind classes

# Set up monorepo {.grid .grid-cols-2 .gap-4}

<Iframe src="https://www.better-t-stack.dev/new?fe-w=tanstack-start&fe-n=native-uniwind&be=self-tanstack-start&rt=none&api=orpc&orm=prisma&db=postgres&dbs=docker&au=better-auth&pm=pnpm" class="rounded-xl border shadow-xl w-full h-full" />

::::: column
::: {.columns-2}
- Change the project name (it actually doesn't matter, only influences imports)
- **Web frontend**: TanStack Start
- **Native Frontend**: Expo + Uniwind
- **Backend**: FullStack TanStack Start
- **Runtime**: None
- **API**: oRPC
- **Database**: your choice
- **ORM**: Prisma
- **DB Setup**: Docker
- **Web Deploy**: None
- **Auth**: better-auth
- **Payments**: None
- **Package Manager**: pnpm
- **Addons**: Turborepo
:::

::: remark
Please only choose Next.js
if you are willing to learn how server components work (it won't help you for mobile though).
:::
:::::

# Upstream bug {.w-1--2}

Ensure that `apps/web/vite.config.ts` contains the CORS section
to allow API calls from the React Native app.

~~~ ts
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), tailwindcss(), tanstackStart(), viteReact()],
  server: {
    port: 3001,
    cors: {
      origin: [
        "http://localhost:19006",
        "http://localhost:8081",
      ],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
  },
});
~~~

# First steps {.w-1--2}

To start developing,
run the following command
from the root of the monorepo

```bash
# Start your database with Docker
pnpm run db:start

# Push the prisma schema to the database
pnpm run db:push

# Generate the prisma client
pnpm run db:generate

# Start the development servers
pnpm run dev
```

Useful addresses:

- <http://localhost:3001/>: Web App
- <http://localhost:8081/>: Mobile App
- <http://localhost:3001/api/rpc/api-reference>: OpenAPI reference

# (P)NPM basics {.w-1--2}

Every package (including the root one) has a file called **package.json**.

It lists the dependencies, and some scripts.

``` bash
# Install packageName in the current workspace
pnpm add packageName

# Install packageName in the current workspace
# as a 'dev dependency'
pnpm add -D packageName

# Run a script in the current workspace
pnpm run scriptName
```

# Prisma: overview {.w-1--2}

- `prisma.schema`: File that describes your tables and their relationships

- `pnpm db:push` to ensure your database matches `prisma.schema`.
  Will also trigger codegen to make sure you can query your new tables.

::: warning
In short, after changing `prisma.schema`,
always run `pnpm db:push`.
:::

# Prisma schema {.grid .grid-cols-2}

::::: col
![](/images/db_schema.png)

To take advantage of Prisma's feature,
specify all the **relationships** of your schema.
:::::

~~~ prisma {.text-sm}
model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  name    String?
  role    Role     @default(USER)
  posts   Post[]
  profile Profile?
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String
  user   User   @relation(fields: [userId], references: [id])
  userId Int    @unique
}

model Post {
  id         Int        @id @default(autoincrement())
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt
  title      String
  published  Boolean    @default(false)
  author     User       @relation(fields: [authorId], references: [id])
  authorId   Int
  categories Category[]
}

model Category {
  id    Int    @id @default(autoincrement())
  name  String
  posts Post[]
}

enum Role {
  USER
  ADMIN
}
~~~

# Create {.w-2--3}

~~~ ts
const user = await prisma.user.create({
  data: {
    email: 'elsa@prisma.io',
    name: 'Elsa Prisma',
  },
})
~~~

~~~ ts
const createMany = await prisma.user.createMany({
  data: [
    { name: 'Bob', email: 'bob@prisma.io' },
    { name: 'Bobo', email: 'bob@prisma.io' }, // Duplicate unique key!
    { name: 'Yewande', email: 'yewande@prisma.io' },
    { name: 'Angelique', email: 'angelique@prisma.io' },
  ],
  skipDuplicates: true, // Skip 'Bobo'
})
~~~

# Read {.w-1--2}

~~~ ts
const user = await prisma.user.findUnique({
  where: {
    email: 'elsa@prisma.io',
  },
})
~~~

~~~ ts
const users = await prisma.user.findMany({
  where: {
    email: {
      endsWith: 'prisma.io',
    },
  },
})
~~~

# Update {.w-1--2}

~~~ ts
const updateUser = await prisma.user.update({
  where: {
    email: 'viola@prisma.io',
  },
  data: {
    name: 'Viola the Magnificent',
  },
})
~~~

~~~ ts
const updateUsers = await prisma.user.updateMany({
  where: {
    email: {
      contains: 'prisma.io',
    },
  },
  data: {
    role: 'ADMIN',
  },
})
~~~

# Upsert {.w-1--2}

~~~ ts
const upsertUser = await prisma.user.upsert({
  where: {
    email: 'viola@prisma.io',
  },
  update: {
    name: 'Viola the Magnificent',
  },
  create: {
    email: 'viola@prisma.io',
    name: 'Viola the Magnificent',
  },
})
~~~

# Delete {.w-1--2}

~~~ ts
const deleteUser = await prisma.user.delete({
  where: {
    email: 'bert@prisma.io',
  },
})
~~~

~~~ ts
const deleteUsers = await prisma.user.deleteMany({
  where: {
    email: {
      contains: 'prisma.io',
    },
  },
})
~~~

# Zod {.grid .grid-cols-2}

::::: col
- TypeScript's type hints

- All client/server communications need to be **validated**.

- Zod is a validation library that integrates well with **TypeScript**.
:::::

::::: col
```typescript {.run}
import z from 'zod'

const userSchema = z.object({
  user: z.email(),
  password: z.string().min(5),
})

try {
  const user = userSchema.parse({
    user: 'ngy@ecam.be',
    extraField: 'hello',
    password: '12345',
  })
  console.log(JSON.stringify(user, null, 2))
} catch(error) {
  console.log('User not valid', error)
}
```
:::::

# oRPC {.w-1--2}

Example from yesterday (will only work if you have the tables):

~~~ ts
// packages/api/src/routers/tasks.ts
export default {
  list: publicProcedure.handler(async () => {
    return await prisma.task.findMany();
  }),
  create: publicProcedure.input(taskSchema).handler(async ({ input }) => {
    return await prisma.task.create({ data: input });
  }),
  delete: publicProcedure
    .input(z.number())
    .handler(async ({ input }) => {
      await prisma.task.delete({ where: { id: input } });
    }),
};
~~~

~~~ ts
// packages/api/src/routers/index.ts
import tasks from './tasks'

// ...
export const appRouter = {
  tasks, // shorthand for tasks: tasks
  // ...
}
// ...
~~~

# Testing your API {.w-1--2}

::: info
To test your API,
go to <http://localhost:3001/api/rpc/api-reference>
:::