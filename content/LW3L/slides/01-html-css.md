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

# Text and content

From now on,
we shall assume the code fragments
to be placed within the page's `<body>`.

~~~ html {.run .columns .columns-2}
<h1>Heading of level 1 (title)</h1>
<h2>Heading of level 2 (subtitle)</h2>
<h6>Heading of level 6</h6>
<p>This is a paragraph</p>
<p>This is another paragraph</p>
<p>
  This may be <em>important</em>,
  but some things are
  <strong>even more important</strong>.
</p>
<p>
  This is a link to
  <a href="https://google.com">Google</a>,
  but within the same website,
  we tend to use <a href="/">relative links</a>.
</p>
~~~

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

# Table

~~~ html {.run .columns-2}
<table>
  <thead>
    <tr>
      <th>Header cell 1</th>
      <th>Header cell 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>A</td>
      <td>B</td>
    </tr>
    <tr>
      <td>C</td>
      <td>D</td>
    </tr>
  </body>
</table>
~~~

# Forms and inputs

~~~ html {.run .columns .columns-2}
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
  <label>
    Bored:
    <select name="bored">
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </select>
  </label>
  <label>
    Biography: <textarea name="biography" />
  </label>
  <button>Submit</button>
</form>
~~~

# Semantic and layout

- `<header>` – Page or section header.
- `<footer>` – Page or section footer.
- `<nav>` – Navigation section.
- `<main>` – Main content of the page.
- `<section>` – Thematic grouping of content.
- `<article>` – Self-contained content.
- `<aside>` – Sidebar content.
- `<figure>` – Media with caption.
- `<figcaption>` – Caption for figure.
