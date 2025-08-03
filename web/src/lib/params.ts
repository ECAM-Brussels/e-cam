import { useSearchParams } from '@solidjs/router'
import { z } from 'zod'

export function createSearchParam<S extends z.ZodTypeAny>(name: string, schema: S) {
  const defaultVal = schema.parse(undefined)
  const [searchParams, setSearchParams] = useSearchParams()
  return [
    () => schema.parse(searchParams[name]) as z.infer<S>,
    (newValue: z.infer<typeof schema>) => {
      setSearchParams({ [name]: newValue === defaultVal ? undefined : newValue })
    },
  ] as const
}
