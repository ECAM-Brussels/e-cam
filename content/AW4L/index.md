---
title: Web Architecture
lang: en
---

# Web Architecture

![Web Architecture](/images/AW4L.webp){.w-full .lg:max-h-96 .max-h-84 .object-cover .rounded-xl .opacity-70}

:::::::::: {.bg-white .rounded-xl .p-4 .shadow}
## Slides

#. [Reactivity](/AW4L/slides/01-reactivity)

#. [Isomorphic Applications](/AW4L/slides/02-isomorphic-apps)

#. [CRUD example](/AW4L/slides/03-crud)
::::::::::

:::::::::: {.bg-white .rounded-xl .p-4 .shadow}
# Exam questions

- Why do we use UI frameworks?

- What is JSX?

- Explain how you could implement a basic reactivity system.

- What is an SPA? What are the advantages and the drawbacks of this type of architecture?

- What is SSR, and what problem is it trying to solve?

- What do we need to be careful of when fetching data?
::::::::::

:::::::::: {.bg-white .rounded-xl .p-4 .shadow .my-8}

::: {.w-4--5 .mx-auto}
| Criterion                                                            | Points |
| -------------------------------------------------------------------- | ------ |
| Appearance and responsive design                                     | 1      |
| Good user experience                                                 | 2      |
| The page loads without client-side JavaScript                        | 1      |
| Website fully works without client-side JavaScript                   | 1      |
| User-submitted data is properly validated                            | 1      |
| Data fetching is done correctly (suspense, error boundaries)         | 1      |
| Form actions trigger data revalidation                               | 1      |
| Network efficiency: caching, data preloading and avoiding waterfalls | 1      |
| Secure Authentication                                                | 1      |
| Client/Server communications are secure and fully typed              | 1      |
| Code is fully type-safe                                              | 1      |
| Database structure is appropriate                                    | 1      |
| Good use of the Component architecture                               | 1      |
| Code quality, including AI-generated code                            | 2      |
| Project complexity                                                   | 4      |

- Your total will be multiplied by a factor between $0$ and $2$,
  depending on your performance at the oral exam.

- Your final grade will be capped at 9/20 if:

  - Your app does not behave like a Single-Page application after the first render
  - Your app cannot produce an initial render on the server
  - Authentication is not implemented
:::

::::::::::