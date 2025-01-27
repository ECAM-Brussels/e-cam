---
title: Routes and layout
lang: en
slideshow: true
---

# Aim of the project

- Interactive but should have good SEO

- Written fully in JavaScript but works without Javascript

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

# Routing

TODO

# Layout

TODO