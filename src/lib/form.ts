export function extractFormData(formData: FormData) {
  return [...formData.entries()].reduce<Record<string, FormDataEntryValue | FormDataEntryValue[]>>(
    (data, [key, value]) => ({
      ...data,
      [key]:
        key in data
          ? Array.isArray(data[key])
            ? [...data[key], value]
            : [data[key], value]
          : value,
    }),
    {},
  )
}
