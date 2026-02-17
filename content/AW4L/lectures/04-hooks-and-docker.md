---
title: Hooks and dockerization
slideshow: true
lang: en
---

# Recall

- **oRPC**: for OpenAPI-compliant TypeSafe API

- **React**: library for building web/native user interfaces declaratively

- **TanStack Query**: React library for centrally cached, declarative data-fetching and invalidation.

- **Router**: SEO optimisation required for Web!
  - Expo Router (mobile)
  - TanStack Router: integrates with TanStack query
    to specify which queries must be preloaded at the same time as the route.

- **Isomorphic App (web)**:
  Single codebase that (mostly) runs on **both** client and server.
  - Server: Produce non-interactive HTML render for SEO (SSR)
  - Client
    - SSR: Start with non-interactive HTML coming from the server
    - Hydration: transfromation into an SPA
    - SPA: routing is faked

- **TanStack Start**: React framework for building isomorphic apps.
  Provides server capabilities for TanStack Router and TanStack Query.

# Motivations {.w-1--2}

- We cannot fully share code (HTML tags and Native components are different)

- Data-fetching (fetch, invalidation, optimistic updates) logic should be identical

- Form validation logic should be identical

- Our code lives in a monorepo and imports/exports should be possible

- How do we make sure we can share code with other developers?

::: question
How can we share logic between client/server in a monorepo?
:::

::: info
Technically, Expo also targets web clients, and could serve client/server/mobile with a single codebase.
However, it does **not** provide SSR.
:::

# Creating a package {.w-1--2}

- Create a directory in `packages/` (e.g. `hooks`)

  Directories that can contain packages are configured in `package.json` and `pnpm-workspaces.yml`.

- Run `pnpm init` in that folder

- The most important file is `package.json`.
  It contains:
  - **scripts** (e.g. what to do when we run `dev`)
  - **dependencies**:
    - _normal_ dependencies: used in production and dev
    - **dev dependencies**: used only in dev (e.g. tooling)
    - **peer dependencies**: dependency provided by the importing package

::: remark
Some libraries (e.g. react, tanstack-query) absolutely need to be **peer dependencies**.
In case of a version mismatch, you could have multiple versions of a library running simultaneously.
:::

# Example: Creating a react hook library {.grid .grid-cols-2}

::: column

```ts
// packages/hooks/package.json
{
  "name": "hooks",
  "main": "src/index.ts",
  "packageManager": "pnpm@10.28.0",
  "peerDependencies": {
    "react": "*",
    "react-native": "*",
    "@tanstack/react-query": "*"
  },
  "devDependencies": {
    "@types/react": "^19.2.14"
  }
}
```

- **name** will be used for importing your package

- All the exports from the **main** file will be importable

- We are ensuring that _react_, _react-native_ and _react-query_ are peer dependencies.

:::

::: column
Add the following to your `.json` file to make sure
you have one version of these libraries.

```json
  "pnpm": {
    "overrides": {
      "react": "19.1.0",
      "react-dom": "19.1.0",
      "react-native": "0.81.5",
      "@tanstack/react-query": "5.80.6"
    }
  }
```

:::

# React Hooks {.w-1--2}

::: definition
A **React hook** is a **function** that lets components store data and/or react to changes
:::

::: example

- **useState**: stores data and forces a rerender on change

```tsx {.text-sm}
// setName triggers a rerender
const [name, setName] = useState('NGY')
```

- **useEffect**: rerenders a function when dependencies change

```tsx {.text-sm}
// When the component rerenders,
// function is redefined but not run
function hello() {
  console.log(`Hello ${name}!`)
}

// During rerendering, has name changed?
// If so, run hello, otherwise do nothing
useEffect(hello, [name])
```

:::

# TanStack Query

- **useQuery**

```ts
const { data, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
})
```

On every render,

- check if the requested data is already in the cache.
  and is still valid.
  If not, fetch the data.

- when the data arrives (or the loading/error state changes),
  it updates its internal state and triggers a re-render of the component.

# Rules of hooks

- Only call hooks at the top level

- Only call Hooks from components or other hooks

- (Not official but enforced by tools): name should start with `use...`

# Hook example for data fetching {.flex}

::::: column

Let's write hooks that:

- Define relevant state

- Fetch data

- Expose the **optimistically** updated data instead

- Set up the relevant mutations correctly so that updates are optimistic,
  and it's using the right state.

The component will essentially just be a view.

:::::

```tsx {.grow}
function TaskList() {
  const tasks = useTasks()
  return (
    <>
      <ul>
        {tasks.data?.map((task) => (
          <li>{task.title}</li>
        ))}
      </ul>
      <input value={tasks.newTask} onChange={(e) => data.setNewTask(e.target.value)} />
      <button onClick={tasks.add}>Add task</button>
    </>
  )
}
```

# Hook definition

```tsx
function useTasks(orpc) {
  const [newTask, setNewTask] = useState('')
  const queryClient = useQueryClient()
  const tasks = useQuery(orpc.tasks.list.queryOptions())
  const add = useMutation(
    orpc.tasks.create.mutationOptions({
      onMutate: async () => {
        // Update the query cache optimistically
      },
      // Better: do it automatically!
      onSettled: () => {
        queryClient.invalidateQueries()
      },
    }),
  )
  return {
    newTask,
    setNewTasks,
    data: tasks.data,
    add: () => {
      add.mutate({ input: newTask })
      setNewTask('')
    },
  }
}
```

# Dockerisation

Monorepos are centalized,
and therefore packages cannot be dockerized separately,
as they often depend on each other.

#. Create a `Dockerfile` at the root.

#. Create a `docker-compose.yaml` at the root.

# Example {.grid .grid-cols-2}

```Dockerfile
FROM node:25-slim AS base
ENV PATH="/pnpm:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=web --prod /prod/web

FROM base AS web
COPY --from=build /prod/web /prod/web
WORKDIR /prod/web
EXPOSE 8000
CMD [ "pnpm", "start" ]
```

::: column

- In **base**,
  `corepack enable` ensures `pnpm` is available.

- In the **build** step,
  we build the **entire app** with a mounted cache.
  The parameter supplied to `--filter` is the name of your package,
  check your `package.json`.

- In the **web** step,
  we start from **base** so we don't have the cache, build tools, dev dependencies, etc.
  We call the "start" script (make sure it exists in your web `package.json`).

:::

# Docker-compose

```yaml
services:
  web:
    build:
      context: .
      target: web
    ports:
      - '3000:3000'
    restart: unless-stopped
networks:
  monorepo-network:
    driver: external
```

- Make sure `packages/db/docker-compose.yaml` uses the same network:

```yaml
networks:
  monorepo-network:
```

- Run `docker compose up`

- Add a script in the root package.json
