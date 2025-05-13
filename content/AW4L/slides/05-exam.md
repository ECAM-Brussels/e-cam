---
title: Theory
slideshow: true
lang: en
---

# UI Framework {.w-1--2}

::: question
Why do we use UI frameworks?
:::

Because they allow a **Components** architecture,
which has the following advantages:

- **Declarative**:
  we describe the DOM instead of explicitely mutating it.
  For example in `<p>Hello {name()}</p>`,
  the framework ensures that `p` has the correct text.

- **Composition and reusability**:
  components can be reused as many times as necessary,
  including to create more complex components.

- **Encapsulation**:
  the DOM elements in components are isolated from each other
  and do not interfere with each other.

- **Testable**:
  Components can be unit-tested.

- **Isomorphic**:
  we can use one syntax to write code that runs on the client and on the server.
  On the server, the aim is to output HTML,
  while on the client we work on the DOM.

# A basic reactivity system {.grid .grid-cols-2 .gap-8}

::::: col
[More details](/AW4L/slides/01-reactivity#/19)

```typescript
const running = []

function createEffect(effect) {
  function wrappedEffect() {
    running.push(wrappedEffect)
    effect()
    running.pop()
  }
  wrappedEffect()
}
```
:::::

```typescript
function createSignal(value) {
  const subscribers = new Set()
  function getter() {
    if (running) {
      subscribers.add(running[running.length - 1])
    }
    return value
  }
  function setter(newValue) {
    value = newValue
    subscribers.map(effect => effect())
  }
  return [getter, setter]
}
```

# SPA {.w-1--2}

::: question
What is an SPA? What are the advantages and the drawbacks?
:::

An SPA has a single entry point and uses JavaScript
to fake navigation and form submissions.
The user stays on the same page,
which is constantly mutated.

- **Advantages**:

  - Great UX
  - Fast after the first render
    (the browser only fetches necessary data)
  - Easy with frameworks

- **Drawbacks**:

  - Bad SEO (what is a page? First render is often a shell page)
  - Accessibility is more difficult
  - Slow initial load
  - Waterfalls (each component triggers new requests as they are executed)
  - Data consistency (the page is only partially updated,
  the developer must ensure the data is coherent)

# SSR {.w-1--2}

::: question
What is SSR and what problem is it trying to solve?
:::

In the context of an SPA,
SSR is a technique which consists is
running your UI framework on the server
to get the HTML code of a page.

Traditional Single Page Applications often start as a blank page
which is bad for SEO.
SSR is used to get a contentful (but not interactive) paint from the server,
which is then transformed into an SPA via a process called **hydration**.

During **hydration**, some features don't work.

# Meta-frameworks {.w-1--2}

::: question
What are meta-frameworks?
:::

Meta-frameworks aim to provide full-stack development of a Single Page application with SSR via a single codebase.
The aim is to provide great UX, DX, while still having SEO and mitigating the downsides of hydration.

- SSR

- Client and Server-side routing:
  SPA-style navigation if supported, otherwise traditional navigation.

- Progressive enhancement of forms:
  Uses a request to submit form if possible,
  but fallbacks to traditional forms otherwise.

- Typesafe client/server communications

# Server State {.w-1--2}

::: question
What do we need to be careful of when managing server state?
:::

- Race conditions
- Network efficiency (e.g. caching)
- Shared ownership of data (can be changed by other people or other devices)
- Stale data (e.g. posts after a log out)
- Type safety

**Good practices**

- Use server functions (or your framework's mechanism) for type safety
- Cache/dedupe requests, and allow remote invalidation
- The server should be the **single source of truth**
- If a user changes the data (action or mutation)
  - send a request and update the UI optimistically
  - revalidate the data (reconcile client and server state),
    show errors depending on the outcome of the request

# Queries and actions {.w-1--2}

::: question
What are actions and queries?
What problems do they solve?
:::

Actions and queries are Solid Start's answer to server state management.

- **Queries**:
  ensure requests are deduped,
  and their results can be invalidated and refetched.

- **Actions**:
  allow to deal easily deal with form submissions isomorphically.
  By default, actions invalidate all queries.
  Action rely on form to provide instantaneously reactive applications,
  even during **hydration**.

# Server functions {.w-1--2}

::: question
What are server functions?
What are their advantages and drawbacks?
:::

```ts
function hello() {
  'use server'
  // Only run on the server
}
```

Server functions allow to create API endpoints
and to call them in a **type-safe** and **isomorphic** way.
Essentially, the developer pretends the client/server boundary does not exist
and calls the function locally.
The bundler ensures that this function call will be transformed to an API request
on the client side.

A drawback is the developer's tendency to forget this creates an API endpoint,
leading to security issues if the data isn't properly sanitized.

# Salting and hashing

::: question
Why do we need to salt and hash passwords?
:::

- **Hashing** ensures the users' passwords aren't compromised
  in case the database is stolen.

- **Salting** prevents rainbow tables attacks,
  by ensuring that two users with the same passwords
  won't have the same stored password in the database.

# Sessions

::: question
How do sessions work?
:::

HTTP is by default stateless.
Offering personalized pages must be done through cookies,
which are simply text key/value pairs stored on the client.
The cookies are created at the server's request,
and are presented by the client at each interaction with the server (like a student or ID card).

When the user logs in,
the cookie will typically contain information unique to that user.
This information is usually signed or encrypted,
to prevent clients from tampering with their own cookies.

# OAuth

Je fais grève