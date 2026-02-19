---
title: Web Architecture
lang: en
---

# Web and Mobile Architecture

![Web Architecture](/images/AW4L.webp){.w-full .lg:max-h-96 .max-h-84 .object-cover .rounded-xl .opacity-70}

::: {.lg:grid .lg:grid-cols-3 .gap-4}
::::: {.bg-white .rounded-xl .border .px-4 .py-2}

### Theory

- [API](/AW4L/lectures/01-api)
- [Components](/AW4L/lectures/02-components)
- [Data fetching and routing](/AW4L/lectures/03-data-fetching)
- [Hooks and Docker](/AW4L/lectures/04-hooks-and-docker)
- [Authentication and security](/AW4L/lectures/05-auth)

:::::

::::: {.bg-white .rounded-xl .border .px-4 .py-2}

### Web Architecture Labs

- [API](/AW4L/web/01-api)
- [Routing](/AW4L/web/02-routing)

:::::

::::: {.bg-white .rounded-xl .border .px-4 .py-2}

### Mobile

- [Expo](/AW4L/mobile/01-expo)

:::::
:::

::::: {.bg-white .rounded-xl .border .px-4 .py-2 .my-4}

:::::::::: {.grid .grid-cols-2}


::::::: column

### Assessment (Web)

- User Experience /2
  - Appearance
  - Mobile-first, responsive design*
  - Reloading keeps the state as much as possible
  - Interactive*
- Project scope and complexity /4
- Data fetching /4
  - Race conditions
  - Loading state and errors boundaries
  - Caching, deduping, and invalidation
  - Optimistic updates when appropriate
- Code quality and DX /4
  - Client/server communications are typesafe*
  - Queries to the DB should be typesafe
  - Codebase is type safe
  - Use consistent conventions
  - Good use of the Component architecture
  - Good use of React hooks
- Deployment /2
  - The database can run via Docker or equivalent
  - Web server runs via Docker or equivalent*
  - Basic orchestration (e.g. via docker-compose)
  - Serves a production bundle
- Security /2
  - Authentication
  - Client/Server communications are validated*
  - Authenticated routes and API are protected*
  - Secrets are not exposed
- SEO /2
  - Crucial pages can be rendered on the server*
  - Crucial data present on first render
  - Less crucial data is deferred
  - Waterfalls are avoided

:::::::

::::::: column

### Assessment (Mobile)

- User Experience /2
  - Appearance
  - Mobile-first, responsive design*
  - Interactive*
- Project scope and complexity /4
- Data fetching /4
  - Race conditions
  - Loading state and errors boundaries
  - Caching, deduping, and invalidation
  - Optimistic updates when appropriate
- Code quality and DX /4
  - Client/server communications are typesafe*
  - Codebase is type safe
  - Use consistent conventions
  - Good use of the Component architecture
  - Good use of React hooks
- Security /2
  - Authentication
  - Client/Server communications are validated*
  - Authenticated routes and API are protected*
  - Secrets are not exposed
- Mobile feature /4

:::::::

::::::::::

:::::

## Extra

- [How does oRPC work?](/AW4L/orpc)
- [Basic TanStack Query implementation](/AW4L/query)
