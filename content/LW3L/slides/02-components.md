---
title: Component-based architecture
slideshow: true
lang: en
---

# Component-based architecture {.grid .grid-cols-2}

::: col
So far,
we have encountered the following issues

- Repetition is unavoidable
- Code cannot be shared easily because of the CSS
:::

::: col
We will use a **framework** (React/Next.js)
to create our own **components** ($\approx$ tags).

~~~ tsx
<Slideshow>
  <Slide title="Component-based architecture">
    {/* Slide contents here */}
  </Slide>
  <Slide>{/* 2nd slide */}</Slide>
  <Slide>{/* 3nd slide */}</Slide>
</Slideshow>
~~~

Advantages of  **components**:

- Easy to test
- Repetition
- Encapsulation
- Declarative (later: easier for interactivity)
- Isomorphic (same code can run on the client or on the server)
:::

# Install Next and set up {.w-1--2}

Create your Next.js project:

~~~ bash
npx create-next-app@latest
~~~

To start the development server:

~~~ bash
npm run dev
~~~

Make sure the following VS Code extensions are installed:

- Prettier (with format-on-save!)
- Tailwind

# Your first page {.grid .grid-cols-2}

::: col
To create the page `/hello/world`,
create the file `app/hello/world/page.tsx`.

~~~ tsx
export default function Page() {
  return (
    <h1>Hello world!</h1>
  )
}
~~~
:::

::: col
- The file path determines the URL of the page:
  $$\texttt{/my/awesome/page} \quad \longrightarrow \quad \texttt{app/my/awesome/page/page.tsx}$$
- `export` means your function can be imported elsewhere
- The `Page` function returns **JSX**,
  an HTML-like syntax.

::::: info
For the moment,
we shall not focus on CSS.
:::::
:::

# JSX/TSX {.columns-2}

::::: break-inside-avoid
::: question
What is JSX/TSX?
:::

::: info
It is an XML-like extension to the JavaScript/TypeScript syntax,
allowing to write some function calls in an HTML-like syntax.
When we are writing
`<Component prop={value} />`,
this code will be transpiled into

~~~ tsx
React.createElement(Component, { prop: value })
~~~
:::
:::::

::::: break-inside-avoid
### Differences between JSX and HTML

- JavaScript expressions can be used inside curly braces `{}`.
  For example `<p>2 times 2 is {2 * 2}</p>`

- Only **one element** can be returned.
  If you need to return multiple elements,
  wrap them in a **fragment**:

  ~~~ tsx
  <>
    <h1>Element</h1>
    <h2>2nd element</h2>
  </>
  ~~~

- Unlike in HTML,
  all tags must be closed.
  Write `<img src="test.png" />` instead of `<img src="test.png">`

- Use `className` instead of `class`.
  Generally, camelCase is used in TypeScript/JavaScript.
:::::

# Tailwind {.grid .grid-cols-2}

::::: col
::: info
Tailwind is an open-source **utility-first** CSS framework.
:::

Class              CSS
------             ----
`m-4`              `margin: 1rem;`
`p-4`              `padding: 1rem;`
`text-white`       `color: white;`
`hover:text-white` `color:white;` on `hover`
`lg:columns-2`     `columns: 2` when screen in large

::: remark
Best-practice is to make your website **mobile-first**.
Use the `md:`, `lg:`, `xl:` prefixes to handle progressively larger screens.
:::
:::::

::::: col
- Quick introduction:
  <Youtube class="m-auto" src="https://www.youtube.com/watch?v=mr15Xzb1Ook" />

- More detailed tutorial:
  <Youtube class="m-auto" src="https://www.youtube.com/watch?v=6biMWgD6_JY" />

- [Documentation](https://tailwindcss.com/docs/styling-with-utility-classes)
:::::

# Layout {.grid .grid-cols-2}

::::: col
Often,
pages share some elements (e.g. a navbar, a footer, etc.)

~~~ tsx
import Link from 'next/link'

type LayoutProps = { children: ReactNode }

export default function Layout(props: LayoutProps) {
  return (
    <>
      <nav>
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/cv">CV</Link></li>
        </ul>
      </nav>
      <main>{props.children}</main>
      <footer>
        <p>All rights reserved.</p>
      </footer>
    </>
  )
}
~~~
:::::

::::: col
- `Link` from `next/link` replaces the usual `a` tag.
  This is because `a` causes a full page reload,
  which is bad for performance.
- `props.children` is a placeholder for the page itself.
:::::

# Components {.grid .grid-cols-2}

::::: col
With React/Next.js,
you can create your own tags (we call them **components**).
We'll put our components in the `components/` folder

~~~ tsx
// components/CVEntry.tsx
import { type ReactNode } from 'react'

type CVEntryProps = {
  title: string
  employer: string
  children?: ReactNode
}

export default function CVEntry(props: CVEntryProps) {
  return (
    <div>
      <h3>
        {props.title}, {props.employer}
        ({props.date})
      </h3>
      {props.children}
    </div>
  )
}
~~~
:::::

::::: col
- The aim is to create our own `<CVEntry />` tag.
- To create your own tag, or **component**,
  we only need to create a function that returns JSX.
- It has three attributes: title, employer and children.
- Children is a placeholder for whatever your place between `<CVEntry>` and `</CVEntry>`
  $$\texttt{<CVEntry>}\underbrace{\dots}_{\text{props.children}}\texttt{</CVEntry>}$$
:::::

# Extending an existing tag {.grid .grid-cols-2}

~~~ tsx
import { type InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  inputClassName?: string
}

function Field(props: InputProps) {
  const { className, label, inputClassName, ...inputProps } = props
  return (
    <label className={className}>
      {label}
      <input
        className={inputClassName}
        {...inputProps}
      />
    </label>
  )
}
~~~

::: col
- The aim of this component is
  to provide a uniform way to combine label and input.
- The type `InputProps` contains all of `input`'s attributes,
  and `label` and `inputClassName`.
- Line 9 is called **destructuring**.
  We extract a few properties of `props` (`className`, `label`, `inputClassName`),
  and then keep the remaining ones in `inputProps`.
:::

# Exercises {.columns-2}

::: exercise
Create the following components:

- `Navbar` (`components/Navbar.tsx`)
- `Footer` (`components/Footer.tsx`)

and use them to create your own layout for your personal website.
Your design should be responsive and **mobile-first**.
:::

::: exercise
Create a `CVEntry` component
and use it to write your own CV.

Create all the static pages for your website.
:::

::: exercise
Create a `Field` component (it should extend `<input />`)
and a `Button` component (which extends `<button />`)
and use it to create the login page
(only the UI).

Create the `blog/new` page,
which we will later use to add a blog post.
:::

::: exercise
Use the [Tailwind doc](https://tailwindcss.com/docs/dark-mode) to support a dark mode.
:::

::: remark
Use Git and commit often.
We will show how git deployment works next session.
:::

# Check list for next session

- Can I create a component?

- When should I create a component?

- Can I create **responsive**, **mobile-first** components?

- Do I understand **why** component-based architecture is used?

- Are you using git and do you commit regularly?

- Is Docker installed?

::: info
Next time,
we will use Docker and git to deploy your website.
:::
