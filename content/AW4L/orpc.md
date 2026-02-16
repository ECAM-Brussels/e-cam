---
title: ORPC
lang: en
---

We start from a simple router such as

```ts
export const router = {
  test: (input: string) => {
    return 3
  },
  hello: (name: string) => {
    return `hello ${name}`
  },
}
```

The first thing we need to do is infer the type of our ORPC object:

```ts
type API = {
  [K in keyof typeof router]: (
    input: Parameters<(typeof router)[K]>[0],
  ) => Promise<ReturnType<(typeof router)[K]>>
}
```

We then use a Proxy to intercept property reads and replace them by `fetch` calls:

```ts
export const orpc = new Proxy(
  {},
  {
    get<N extends keyof typeof router>(_: unknown, name: N) {
      return async function (input: unknown) {
        const res = await fetch(`/orpc`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fn: name,
            input,
          }),
        })
        return await res.json()
      }
    },
  },
) as API
```

At the last line,
we ensure that our proxied object has the required type.
