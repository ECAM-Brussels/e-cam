---
title: Routes and layout
lang: en
slideshow: true
---

# About the project {.grid .grid-cols-2 .gap-12}

::: col
### Instructions

- In pairs or by yourself

- Dynamic website with at least some interactivity

- Secure Authentication
:::

::: col
### Technical constraints

- Interactive but should have good SEO

- Written fully in JavaScript but should work without Javascript

- Responsive and accessible
:::

# Install Node.js {.grid .grid-cols-2 .gap-12}

<Iframe src="https://nodejs.org/en" class="w-full h-full border rounded-xl shadow-xl" />

::: col
### Instructions

- Go to <https://nodejs.org/>
- Download Node.js (LTS version)

:::: info
Node.js is a JavaScript interpreter.
It allows your computer to understand and run JavaScript (outside of the browser).
::::
:::

# Install Visual Studio Code and the Svelte extension {.flex .gap-12}

![](/images/svelte-vs-code-extension.png)

::::: col
### Instructions

- Go to <https://code.visualstudio.com/Download>
- Download the binary associated with your operating system
- Install VS Code
- Open VS Code
- Click on the icon with four squares on the left (see image)
- Search *Svelte for VS Code*
- Install the "Svelte for VS Code" extension coming from *svelte.dev*

::: info
Visual Studio Code is a popular open-source Integrade Development Environment (IDE).
We will use it to write JavaScript code.
:::
:::::

# Install SvelteKit {.flex .gap-12}

![Setting up dogder, a Tinder-like application that will allow Lily to find love](/images/sveltekit-install.png){.border .rounded-xl .shadow-lg}

::: column
- Open a terminal (e.g. Powershell or in VS Code)
- Have a look at the screenshot on the left and run the following commands
  (the lines starting with `#` are comments and need not be run)

```bash
# You can change that path
# to wherever you want
cd Documents/BA/Web_Architecture/Project

# Replace my-app by the name of your app
# Options: SvelteKit minimal, no type-checking
# Don't add anything to the project, npm as package manager
npx sv create my-app
```

:::: info
This installs SvelteKit,
a JavaScript framework that allows you to create websites.
It is a more beginner-friendly alternative to the more famous React/Next.js or Angular/Analog.
::::
:::

# Open your project {.w-1--2}

- Open VS Code
- `File` > `Open Folder` and select your app
- `Terminal` > `New Terminal`
- In the terminal that you've just opened, type `npm run dev -- --open`

# Home Page {.columns-2 .gap-8}

::::: column
::: exercise
Edit `src/routes/+page.svelte`,
which is your home page.

Create a `<style>` tag at the bottom of the file
to style your page.
:::

::: info
- The CSS you type here will only apply to that file,
  so you don't need to be too specific.
:::
:::::

::: col
```javascript {.run framework="svelte"}
<h1>Your first home page with SvelteKit</h1>
<p>Welcome</p>

<style>
  h1 {
    color: red;
  }
</style>
```
:::

# Static web page with File-based routing {.w-3--5}

::: info
A web page is associated with a specific file.
To serve `/blog/tinder-for-dogs`,
I need to create `src/routes/blog/tinder-for-dogs/+page.svelte`
:::

$$
\boxed{\mathtt{GET\, /blog/tinder-for-dogs}}\\
\updownarrow \text{associated file} \updownarrow\\
\boxed{
  \underbrace{\mathtt{src/routes}}_1
  \overbrace{\mathbf{\mathtt{/blog/tinder-for-dogs}}}^2
  \underbrace{\mathtt{/+page.svelte}}_3
}
$$

1. Specify that your file will be used to answer server requests.
   It has to be **exactly** `src/routes`.
2. The path of the request
3. Must be exactly `+page.svelte`.
   We specify that it's a standard page,
   so the file will be associated with a GET request.

::: exercise
Create other static pages, which should introduce your project.
Link your pages.
:::

# Layout {.w-1--2}

Web pages tend to share common elements (navigation bar, footer, etc.).
This is called a **layout**.
To create one, edit `src/routes/+layout.svelte`

```javascript {framework="svelte"}
<script>
  let { children } = $props();
</script>

<nav>
  <a href="/">home</a>
  <a href="/about">about</a>
</nav>

{@render children()}
```

::: info
- `{@render children()}` indicates where to put the page contents
- The first three lines are important to define `children`.
  More on what this means later.
:::

# Responsive design

<Iframe src="https://quentin.lurkin.xyz/courses/ergonomy/lab1/" class="w-[50%] h-full border rounded-xl shadow-xl" />