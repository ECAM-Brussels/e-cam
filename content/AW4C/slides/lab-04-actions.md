---
title: Fetching data from databases
lang: en
slideshow: true
---

# Introduction {.w-1--2}

The aim of the session is to produce a form
which **creates or updates a record in a database**.
You also need to show some basic **error management**.

We shall assume for this session
that you have already created your schema
and generated the client.

If not, please go back to the slides of the previous lab.

# HTML forms {.grid .grid-cols-2}

::::: col
First, start by creating your form.
Make sure you have specified the **name** attribute
for all relevant input fields.

Here is an example for a rudimentary todo list application.

```html
<script>
  import { enhance } from '$app/forms';
</script>

<form method="POST" use:enhance>
  <input name="task" />
  <input type="submit" />
</form>
```
:::::

::::: col
### Comments

- You need to specify `method="POST"` to your form,
  or your code won't work later.

- `use:enhance` (you need to import `enhance` as in the example),
  allows client-side JavaScript to take over for a smoother user experience.

  This is an example of **isomorphic behaviour**.
  Form handling either happens server-side (standard HTML default),
  on happens on the client (like in Single-Page apps.)

- As usual,
  the code needs to be placed on a page,
  e.g. `src/routes/<url>/+page.svelte`.

- At the moment,
  this doesn't really do anything interesting.
  We need to add code to process the form.
:::::

# Anatomy of a form action {.grid .grid-cols-2}

::::: col
src/routes/**your url**/+page.server.js

```js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const actions = {
  // Function that will handle the form submission
  default: async (event) => {
    // Get form data
    const formData = await event.request.formData()
    // Get the value of the 'task' field
    const task = formData.get('task')

    // Do whatever you want
    // e.g. adding it to the database
    await prisma.task.create({
      data: {
        task: task,
        completed: false,
        lastModified: new Date(),
      },
    })
  }
}
```
:::::

::::: col
- The function that will be called to process your form submission
  is `actions.default`,
  with the additional requirement that `actions` be importable
  (hence the `export` keyword)

- `formData.get('hello')` gets the value of the input field name `hello`.

- [Prisma documentation](https://www.prisma.io/docs/orm/prisma-client/queries/crud)
  on how to create records.

- [Form tutorial for SvelteKit](https://svelte.dev/tutorial/kit/the-form-element)

- [SvelteKit documentation for form actions](https://svelte.dev/docs/kit/form-actions)
:::::


# Error management {.grid .grid-cols-2}

::::: col
If your action returns something,
it can be accessible via the `form` prop.
Here is an example

```js
import { fail } from '@sveltejs/kit';

export const actions = {
  default: async(event) => {
    const formData = await event.request.formData()
    const task = formData.get('task')
    if (task === 'sleep') {
      return fail(406, { error: 'Sleeping is not a task' })
    }
    // Rest of your code...
  }
}
```
:::::

::::: col
```html
<script>
  let { form } = $props();
  import { enhance } from '$app/forms';
</script>

<form method="POST" use:enhance>
  <input name="task" />
  <input type="submit" />
  {#if form?.error}
    <p>Error: {form?.error}</p>
  {/if}
</form>
```
:::::