export function extractFormData(formData: FormData) {
  return [...formData.entries()].reduce<Record<string, FormDataEntryValue | FormDataEntryValue[]>>(
    (data, [key, value]) => {
      let current: any = data
      key.split('.').forEach((k, index) => {
        if (index === key.split('.').length - 1) {
          current[k] =
            k in current
              ? Array.isArray(current[k])
                ? [...current[k], value]
                : [current[k], value]
              : value
        } else if (!(k in current)) {
          current[k] = {}
        }
        current = current[k]
      })
      return data
    },
    {},
  )
}
