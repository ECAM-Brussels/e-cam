---
title: Routing with TanStack Router
slideshow: true
lang: en
---

# Overview

- File-based routing

# File-based routing {.w-1--2}

Routes are located in `apps/web/routes`.
Each page must be defined in that folder.
More info [here](https://tanstack.com/router/latest/docs/framework/react/routing/file-based-routing).

- `__root.tsx`: Root layout, applied to **all pages**

- In general, the associated URL can be obtained by removing `index.tsx`, `.tsx` to the file path.

  ```text {.text-sm}
  /routes/about.tsx -> /about
  /routes/settings/index.tsx -> /settings
  /routes/settings/profile.tsx -> /settings/profile
  ```

- **Layouts**: if a `*.tsx` file has the same name as a directory,
  it acts as a *layout*.

  ```text {.text-sm}
  /routes/blog.tsx -> will apply to all the routes in blog/
  /routes/blog/...
  ```

- Path parameters can be declared with `$`:

  ```text {.text-sm}
  /routes/posts/$postId.tsx -> /posts/{postId}
  ```

  You will be able to get the value of `postId`.
  More on that later.

- The directory delimiter can be also be a `.`:

  ```text {.text-sm}
  /routes/posts.$postId.tsx -> /posts/{postId}
  ```

# Anatomy of a simple route {.w-1--2}

```ts {.text-sm}
export const Route = createFileRoute("/path")({
  loader: async () => {
    // Performs data fetching for you
  },
  component: () => { // shown after loader finishes
    return <p>Hello world</p>
  },
})
```

::: remark
- `/path` will be set for you if the development server is running
- The `loader` is important for good SEO.

  ```tsx {.text-xs}
  <Root>
    <A>
      <B />
    </A>
  </Root>
  ```

  In the above code, `B` will load when `A` is ready, which in turns will load when Root is ready.
  In particular, this *waterfall* will cause the data-fetching to start late.

- The loader function is also called when you hover on a link.
:::

# Example: todo {.w-2--3}

```ts {.text-sm}
export const Route = createFileRoute("/")({
  loader: async ({ context: { queryClient }}) => {
    // Ensure TanStack Query cache contains the required data
    await queryClient.ensureQueryData(orpc.tasks.list.queryOptions())
  },
  component: () => {
    // Won't trigger a refetch, as the data is in the cache
    const tasks = useSuspenseQuery(orpc.tasks.list.queryOptions())
    return (
      <ul>
        {tasks.data?.map(task => <li>{task.title}</li>)}
      </ul>
    )
  },
})
```

::: remark
- `useSuspenseQuery` is better (more modern than) `useQuery`.
  We will talk about `Suspense` later.
- If the data we want to load is not SEO critical,
  you should use
  ```tsx
  queryClient.prefetchQuery(orpc.tasks.list)
  ```
  instead of `await queryClient.ensureQueryData(...)`.
  It starts the data fetching, but doesn't block the rendering of the page.
:::

# Path params {.w-1--2}

```tsx
export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params }) => {
    return fetchPost(params.postId)
  },
  component: () => {
    const { postId } = Route.useParams()
    return <div>Post {postId}</div>
  },
})
```