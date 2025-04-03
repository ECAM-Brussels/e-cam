---
title: Fetching data from databases
lang: en
slideshow: true
---

# Install prisma {.w-1--2}

```typescript
npm install prisma --save-dev
npx prisma init --datasource-provider sqlite
```

::: info
Prisma is an ORM.
It helps you by simplifying interactions with databases.
:::

### Today's steps

#. Creating a schema
#. Syncing the database and code generation
#. Manually adding records
#. Fetching data in your app

# Step 1: Schema {.grid .grid-cols-2 .gap-8}

::::: col
To create a `user` and a `post` table,
add blonde teenthe following in `prisma/schema.prisma`.
To have syntax highlighting, install the `Prisma` extension on Code.

```prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  published Boolean @default(false)
  author    User    @relation(fields: [authorId], references: [id])
  authorId  Int
}

```
:::::

::::: col
- Each table is associated with a **model**.

- Each model has different columns, that have a type.
  Some types, like `Post` and `User` in the example,
  actually reference another model.

- `@id` means that the column is a **primary key**,
  `?` means that it is **optional**,
  and `@default()` allows to provide a **default value**.

- Some models are **related**,
  and the relationship must be explicit **both ways**.
  In the example, a user is associated with many posts (*one-to-many*),
  and this is explicited by specifying that `posts` is a list of posts.
  On the other hand, all posts all have one author (*many-to-one*),
  and that's why it specifies that `author` is a user.
  The post/author relationship is inforced by the `authorId` **key**.
  The `@relationship` specifies the link between `post.authorId` and `user.id`.

::: exercise
Use the above example to create your own models.
:::
:::::

# Step 2. Code generation {.w-1--2}

::::: col
The first time,
run the following command.

```bash
npx prisma migrate dev --name init
```

- This creates/updates the tables to match the schema

- This generates code to help you work with your database

If you change your schema after running the above command,
you need to rerun the command (just change `init` by a short description of your change)
:::::

# Step 3. Prisma Studio {.w-1--2}

- Run `npx prisma studio` to start Prisma Studio

- Go to `http://localhost:5555/`

- Add records to the tables

# Step 4. In Svelte {.grid .grid-cols-2 .gap-8}

::::: col
### Backend

src/routes/**url**/+page.**server.js**

```js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function load() {
  return {
    posts: await prisma.post.findMany({
      include: {
        author: true,
      },
    })
  }
}
```
:::::

::::: col
### Frontend

src/routes/**url**/+page.**svelte**

```html
<script>
  let { data } = $props();
</script>

{#each data.posts as post}
  <div>
    <h3>{post.title}</h3>
    {post.author.name}
  </div>
{/each}
```
:::::