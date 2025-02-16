---
title: CRUD Example
slideshow: true
---

# Setting up {.w-1--2}

```bash
npm install prisma --save-dev
npx prisma init --datasource-provider sqlite
npm install zod
```

# Database {.w-1--2}

```prisma
model Task {
  id Int @id @default(autoincrement())
  title String  @unique
  completed Boolean
}
```

```bash
npx prisma migrate dev --name init
```

# Set up prisma client {.w-1--2}

`src/lib/db.ts`

```typescript
'use server'

import { PrismaClient } from '@prisma/client'

export const db = new PrismaClient()
```

# Server Function: Read {.w-1--2}

`src/lib/tasks.ts`

```typescript
import { db } from './db'

const getTasks = query(async() => {
  'use server'
  return await db.task.findMany()
}, 'getTasks')
```

# Server function: add {.w-1--2}

`src/lib/tasks.ts`

```typescript
import { db } from './db'

const taskSchema = z.object({
  title: z.string(),
  completed: z.boolean(),
})

const addTask = action(async (form: FormData) => {
  'use server'
  const task = taskSchema.parse({
    title: form.get('title'),
    completed: false,
  })
  return await db.task.create({ data: task })
})
```

# API route {.w-1--2}

`src/routes/api/tasks.ts`

```typescript
import type { APIEvent } from "@solidjs/start/server";
import { addTask, getTasks } from "~/lib/task";

export async function GET(event: APIEvent) {
  return await getTasks();
}

export async function POST(event: APIEvent) {
  return await addTask(await event.request.formData())
}
```

# Page {.w-1--2}

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
    deferStream: true,
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