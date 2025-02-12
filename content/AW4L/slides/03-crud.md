---
title: CRUD Example
slideshow: true
---

# Database

```prisma
model Task {
  id Int @id @default(autoincrement())
  desc String  @unique
  deadline DateTime @default(now())
}
```

# Server Function: Read

```typescript
const getTasks = query(async() => {
  'use server'
  const tasks = await prisma.task.findMany()
  return tasks
}, 'tasks')
```

# Server function: add

```typescript
const taskSchema = z.object({
  desc: z.string(),
})
```