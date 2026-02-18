---
title: Basic TanStack Query implementation
lang: en
---

TanStack Query accepts a key and a function.
The result of the query function is stored in a central cache,
and this is why we need a key.

```ts
type Query<T extends () => Promise<any>> = {
  queryKey: string[]
  queryFn: T
}
```

This is the implementation of the `useQuery` hook.

```ts
function useQuery<T extends () => Promise<any>>(query: Query<T>) {
  // We use a central cache, which has two methods:
  // - cache.get(key)
  // - cache.set(key, value)
  const cache = useCache()

  // queryKey is an array of strings
  // I want a string as a cache key
  const cacheKey = query.queryKey.join('-')

  // Specify if the query function is loading
  const [loading, setLoading] = useState(false)

  // State to hold the fetched data
  const [data, setData] = useState<Awaited<ReturnType<T>> | undefined>()

  // Only trigger a refetch if the cache key changes
  useEffect(() => {
    async function wrappedQuery(): Promise<Awaited<ReturnType<T>>> {
      // If we don't have a cache entry,
      // start queryFn() and set loading to true,
      // and cache the promise
      if (!cache.get(cacheKey)) {
        setLoading(true)
        cache.set(cacheKey, query.queryFn())
      }

      // Wait for the cached promise to finish loading
      const res = await cache.get(cacheKey)
      setLoading(false)

      return res
    }
    wrappedQuery().then(setData)
  }, [cacheKey])
  return { data, loading }
}
```
