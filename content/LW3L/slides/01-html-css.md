---
title: HTML and CSS
slideshow: true
---

# Table of contents

#. Requests and Responses

#. Struture of a web page (HTML)

#. Appearance of a web page (CSS)

# Requests and Responses {.w-1--2}

~~~ mermaid
sequenceDiagram
  participant client as Client
  participant server as Server
  client ->> server: Request
  server ->> server: Processing request
  server ->> client: Response
~~~

# Hello world {.w-1--2}

~~~ html
<!DOCTYPE html>
<html>
  <head>
    <!-- Page metadata -->
    <title>My WebSite</title>
  </head>
  <body>
    <!-- Page contents -->
    <h1>Hello World</h1>
  </body>
</html>
~~~

# Headings and paragraphs

~~~ html {.run .columns .columns-2}
<h1>Heading of level 1 (title)</h1>
<h2>Heading of level 2 (subtitle)</h2>
<h3>Heading of level 3</h3>
<h4>Heading of level 4</h4>
<h5>Heading of level 5</h5>
<h6>Heading of level 6</h6>
<p>This is a paragraph</p>
<p>This is another paragraph</p>
~~~

# Emphasis

~~~ html {.run .columns .columns-2}
<p>
  This may be <em>important</em>,
  but some things are
  <strong>even more important</strong>.
</p>
~~~

::::: w-1--2
::: {.remark}
- *em* is short for *emphasis*
:::
:::::

# Lists

~~~ html {.run .columns .columns-2}
<h1>Todo</h1>
<ul>
  <li>Wake up</li>
  <li>Feed the dog</li>
  <li>Walk the dog</li>
</ul>

<h1>Table of Contents</h1>
<ol>
  <li>Introduction</li>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ol>
~~~

::::: w-1--2
::: remark
- `ul`: unordered list
- `ol`: ordered list
- `li`: list item
:::
:::::

# Formulaire

~~~ html {.run}
<form method="POST" action="/url">
  <label>
    Name:
    <input name="name" />
  </label>
  <label>
    Email:
    <input type="email" name="email" />
  </label>
  <label>
    Password:
    <input type="password" name="password" />
  </label>
</form>
~~~
