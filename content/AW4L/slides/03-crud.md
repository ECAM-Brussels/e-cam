---
title: CRUD Example
slideshow: true
---

# Outline {.w-1--2}

We are going to create a simple Todo app,
with the following requirements:

- Entirely written in TypeScript

- Works without JavaScript

- No waterfalls

- Type safety everywhere,
  including in client-server communications.

- Validation of user input

- Optimistic updates

# Setting up {.grid .grid-cols-2}

```bash
npm install prisma --save-dev
npx prisma init --datasource-provider sqlite
npm install zod
```

::: col
- Prisma: ORM that behaves well with TypeScript

- Zod: TypeScript-first schema validation library
:::

# Database {.grid .grid-cols-2}

::::: col
`prisma/schema.prisma`:

```prisma
model Task {
  id Int @id @default(autoincrement())
  title String
  completed Boolean
}
```

```bash
npx prisma migrate dev --name init
```
:::::

::::: col
- Models are used to describe tables and their relationship

- Prisma uses this information to generate the tables,
  the migrations,
  and a type-safe client.

- [Documentation: Prisma schema](https://www.prisma.io/docs/orm/prisma-schema/overview)
:::::

# Set up prisma client {.grid .grid-cols-2}

::::: col
`src/lib/db.ts`

```typescript
import { PrismaClient } from '@prisma/client'

export const db = new PrismaClient()
```
:::::

::::: col
- Access to the database will be done through the `db` variable
:::::

# Server Function: Read {.grid .grid-cols-2}

::::: col
`src/lib/tasks.ts`

```typescript
import { db } from './db'

export const getTasks = query(async () => {
  'use server'
  return await db.task.findMany()
}, 'getTasks')
```
:::::

::::: col
- `query` creates a cached function.
  Calls are deduped to prevent multiple calls to the function.

- `use server` ensures the function runs on the server.
  If it is called on the client,
  it will be an HTTP request.

- [Documentation: query](https://docs.solidjs.com/solid-router/reference/data-apis/query)

- [Documentation: use server](https://docs.solidjs.com/solid-start/reference/server/use-server)
:::::

# Server function: add {.grid .grid-cols-2}

::::: col
`src/lib/tasks.ts`

```typescript
import { db } from './db'
import { z } from 'zod'

const taskSchema = z.object({
  title: z.string(),
  completed: z.boolean(),
})

export const addTask = action(async (form: FormData) => {
  'use server'
  const task = taskSchema.parse({
    title: form.get('title'),
    completed: false,
  })
  return await db.task.create({ data: task })
})

export const removeTask = action(async (id: number) => {
  'use server'
  return await db.task.delete({ where: { id } })
})
```
:::::

::::: col
- Create a **schema** that will be used for validation

- `action` creates a form action from a server function

- [Documentation: action](https://docs.solidjs.com/solid-router/reference/data-apis/action)
:::::

# API route {.grid .grid-cols-2}

::::: col
`src/routes/api/tasks.ts`

```typescript
import type { APIEvent } from '@solidjs/start/server'
import { addTask, getTasks } from '~/lib/task'

export async function GET(event: APIEvent) {
  return await getTasks()
}

export async function POST(event: APIEvent) {
  return await addTask(await event.request.formData())
}
```
:::::

::::: col
- Exported methods named after HTTP methods open associated API endpoints

- [Documentation: API routes](https://docs.solidjs.com/solid-start/building-your-application/api-routes)
:::::

# Page {.grid .grid-cols-2}

::::: col
```typescript
import {
  createAsyncStore,
  useSubmissions,
  type RouteDefinition,
} from "@solidjs/router";
import { For } from "solid-js";
import { addTask, getTasks, removeTask } from "~/lib/task";

export const route = {
  preload() {
    getTasks();
  },
} satisfies RouteDefinition;

export default function Todo() {
  const tasks = createAsyncStore(() => getTasks(), {
    initialValue: [],
  });
  const addingTask = useSubmissions(addTask);
  const removingTask = useSubmissions(removeTask);
  const filtered = () =>
    tasks().filter((task) => {
      return !removingTask.some((d) => d.input[0] === task.id);
    });
  return (
    <>
      <form action={addTask} method="post">
        <input name="title" />
      </form>
      <ul>
        <For each={filtered()}>
          {(task) => (
            <li>
              {task.title}
              <form method="post">
                <button formAction={removeTask.with(task.id)}>Delete</button>
              </form>
            </li>
          )}
        </For>
        <For each={addingTask}>
          {(sub) => (
            <li class="text-red-800">{String(sub.input[0].get("title"))}</li>
          )}
        </For>
      </ul>
    </>
  );
}
```
:::::

::::: col
- `preload` ensures `getTasks()` is not called after showing the page
  (this would have created a waterfall).

- `tasks` is a store containing the tasks from the database.
  The backend will be considered as the *source of truth*.

- `addingTask` is a list of tasks being submitted.
  We will optimistically show them on the UI as well.

- `removingTask` is a list of tasks being removed.
  We will optimistically filter them on the UI.

- `filtered` tasks list that does not contain
  the optimistically removed tasks.

- [Documentation: preload](https://docs.solidjs.com/solid-router/reference/preload-functions/preload)

- [Documentation: useSubmissions](https://docs.solidjs.com/solid-router/reference/data-apis/use-submissions)
:::::

# Examples {.w-1--2}

Use the [official examples](https://github.com/solidjs/solid-start/tree/main/examples)
to guide you.

::: warning
Solid-Start is probably too recent for your favourite AI.
Read the documentation instead.
:::