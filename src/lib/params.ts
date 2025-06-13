import { useSearchParams } from '@solidjs/router'
import { z } from 'zod'

export function createSearchParam(
  name: string,
  schema: z.ZodTypeAny = z.coerce.string().default(''),
) {
  const defaultVal = schema.parse(undefined)
  const [searchParams, setSearchParams] = useSearchParams()
  return [
    () => schema.parse(searchParams[name]),
    (newValue: z.infer<typeof schema>) => {
      setSearchParams({ [name]: newValue === defaultVal ? undefined : newValue })
    },
  ] as const
}
