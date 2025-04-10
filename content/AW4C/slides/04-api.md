---
title: API design
lang: en
slideshow: true
---

# Front-end / backend {.w-1--2}

**Front-end**: code that runs in the browser

- Style
- UI

**Backend**: code that runs on the server

- Business Logic
- Databases
- Authentication

# Front-end or backend? {.w-1--2}

::: {.question title="Exam-type question"}
Depending on the architecture (MPA, SPA, Isomorphic),
which computer should take care of the following tasks?
:::

- Rendering the page

- Navigation

- Form validation

- Authentication

# Motivations: recall

- Rise of mobile phones

- Rise of AJAX/SPAs

We need **data/mark-up separation**.

# API definition {.w-1--2}

::: definition
A server-side web API consists of one or more publicly exposed endpoints
to a defined request–response message system, typically expressed in JSON or XML.
The web API is exposed most commonly by means of an HTTP-based web server.
:::

We'll often use API to mean server-side web API.

# REST {.w-1--2}

::: definition
REST is a set of principles that use standard HTTP methods
to enable communication between clients and servers in a stateless, scalable, and uniform way.

RESTful APIs use standard HTTP methods (like GET, POST, PUT, DELETE) to perform operations on resources, which are identified by URIs.
:::

- Client/Server architecture

- Stateless

- Cacheable

- Uniform interface

# REST API example in Python {.w-1--2}

```python
import pydantic

class User(pydantic.BaseModel):
    first_name: str
    last_name: str
    age: int | None = None

users: list[User] = [
    User(first_name="Martin", last_name="Fockedey"),
    User(first_name="Khoi", last_name="Nguyen"),
]

import fastapi
app = fastapi.FastAPI()

@app.get("/users")
def get_users() -> list[User]:
    return users

@app.post("/users")
def register(user: User) -> User:
    users.append(user)
    return user
```

# CRUD Example {.w-1--2}

`GET /users`
: Get the list of users

`GET /users/1`
: Get information on user 1

`POST /users`
: Create a user using the request body as information

`PATCH /users/2`
: Changes user 2 with the data supplied in the request body

`DELETE /users/3`
: Deletes user 3

# REST: Front-end integration {.w-1--2}

Accessing the API from the browser is usually done via the `fetch` command.

```js
// GET request
fetch(url).then(res => res.json())

// POST request
fetch(url, {
  method: 'POST',
  headers: ...,
  body: ...,
})
```

# Example: Astronomy Picture of the Day {.run}

```{.javascript .run .columns-2 .gap-12 framework="svelte"}
<script>
let data = $state({})
let date = $state('2025-04-10')

const dataPromise = $derived(
  fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=' + date)
    .then(res => res.json())
)
</script>

<input type="date" bind:value={date} />
{#await dataPromise}
  <p>Loading</p>
{:then data}
  <div>
    <img src={data.url} width="50%" />
  </div>
  <h1>{data.title}</h1>
  <p>{data.explanation}</p>
{/await}
```

# REST - questions

- Documentation

- Client-code

# OpenAPI standard (formerly Swagger) {.grid .grid-cols-2}

::: col

- Expose a YAML/JSON file which describes your API in a standard way

- Tools & ecosystem:
  - Generates documentation
  - Client generation
  - Validation and testing
:::

::: col
```yaml
openapi: 3.0.0
info:
  title: My API
  version: 1.0.0
paths:
  /users:
    get:
      summary: Get all users
      responses:
        '200':
          description: A list of users
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
```
:::

# Under-fetching {.w-1--2}

**Scenario**: showing a blog post

```
GET /posts/123
```

```json
{
  "id": 123,
  "title": "REST vs GraphQL",
  "content": "Let's compare REST and GraphQL...",
  "authorId": 7
}
```

::: question
If we wanted the author's name,
what should we do?
:::

::: definition
Underfetching happens when our requests don't return all the necessary data.
:::

# Overfetching {.w-1--2}

**Scenario**: showing a list of blog posts

```
GET /posts
```

```json
[
  {
    "id": 123,
    "title": "REST vs GraphQL",
    "content": "Let's compare REST and GraphQL...",
    "authorId": 7
  },
  {
    "id": 124,
    "title": "Introduction to APIs",
    "content": "APIs are how apps talk...",
    "authorId": 9
  }
]
```

This is **overfetching**,
because we don't need the `authorId` or `content`.

# GraphQL {.w-1--2}

**Over/under-fetching** can really be an issue for mobile devices

![](https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/GraphQL_logo_%28horizontal%29.svg/1920px-GraphQL_logo_%28horizontal%29.svg.png){.w-128}

- Original author: Meta platforms

- Initial release: 2015

- Query language to ask exactly what you want

# GraphQL queries examples

::: {.grid .grid-cols-2}
```graphql
{
  post(id: 123) {
    title
    content
    author {
      name
    }
  }
}
```

```json
{
  "data": {
    "post": {
      "title": "REST vs GraphQL",
      "content": "Let's compare REST and GraphQL...",
      "author": {
        "name": "Jane Doe"
      }
    }
  }
}
```
:::

::: {.grid .grid-cols-2}
```graphql
{
  posts {
    title
  }
}
```

```json
{
  "data": {
    "posts": [
      { "title": "REST vs GraphQL" },
      { "title": "Introduction to APIs" }
    ]
  }
}
```
:::

# GraphQL example

<Iframe src="https://learning.ecam.be/graphql" class="w-full h-full" />

# Data persistence {.w-1--2}

::: question
Why do we use databases and not just a file?
:::

Two types of databases

- Relational

- NoSQL

# Relational databases

- Each query is a security vulnerability

  ```{.javascript .run runImmediately=true hideEditor=true framework="svelte"}
  <script>
    let username = $state('')
    let password = $state('')
    const query = $derived("SELECT * FROM users WHERE username='" + username + "' AND password='" + password + "'")
  </script>
  
  <input bind:value={username} placeholder="Login" />
  <input bind:value={password} placeholder="Password" />
  <pre>{query}</pre>
  ```

- Code depends on database (MySQL, Postgres, ...)

  What if you want to migrate?

- Managing relationships is hard

  (If `JOIN` didn't traumatize you, you haven't done enough SQL)

# ORM Ideas {.w-1--2}

- Use Object-Oriented Programming to manipulate data

- Aim: simulate an object-oriented database

# Examples

::: {.grid .grid-cols-2}
```sql
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);
```

```prisma
model User {
  id Int @id @default(autoincrement())
  email String  @unique
  password String
}
```
:::

::: {.grid .grid-cols-2}
```sql
SELECT * FROM "User"
```

```js
const users = await prisma.user.findMany()
```
:::

::: {.grid .grid-cols-2}
```sql
DELETE FROM "User" WHERE "email" = 'example@example.com';
```

```js
const deletedUser = await prisma.user.delete({
  where: { email: 'example@example.com' }
});
```
:::

::: {.grid .grid-cols-2}
```sql
UPDATE "User" 
SET "password" = 'newpassword123'
WHERE "email" = 'example@example.com';
```

```js
const updatedUser = await prisma.user.update({
  where: { email: 'example@example.com' },
  data: { password: 'newpassword123' }
});
```
:::

# Relationships

::: {.grid .grid-cols-2}
```sql
SELECT 
  "User"."id", 
  "User"."name", 
  "Post"."id" AS "postId", 
  "Post"."title", 
  "Post"."content"
FROM "User"
LEFT JOIN "Post" ON "User"."id" = "Post"."userId"
WHERE "User"."id" = 1;
```

```js
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: { posts: true },
});
```
:::