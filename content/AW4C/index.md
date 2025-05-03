---
title: Web Architecture for Business Analysts
lang: en
---

# Web Architecture for Business Analysts

::::::::::::::: {.lg:grid .lg:grid-cols-2 .lg:gap-4}
:::::::::: {.bg-white .rounded-xl .p-4 .shadow}
## Slides

- [Introduction](/AW4C/slides/01-introduction)
- [MPA and AJAX](/AW4C/slides/02-mpa)
- [SPA](/AW4C/slides/03-spa)
- [API Design](/AW4C/slides/04-api)
- [Authentication](/AW4C/slides/05-auth)

# Labs

- [Routes and Layouts](/AW4C/slides/lab-01-routes)
- [Components](/AW4C/slides/lab-02-components)
- [Data fetching](/AW4C/slides/lab-03-databases)
- [Form actions](/AW4C/slides/lab-04-actions)

# Lab

- Layout + one element of responsive design

  *We will resize the browser and see how the page behaves*.

- Appropriate use of components with props and state

  *We will have a look inside your `components/` folder.

- Data fetching from the database

  *We will see that some data comes from the database by changing the data from Prisma Studio and check that your website will be in sync*

- Updating the database

  *We will submit a form and check that an entry has been created/updated in the database*.
::::::::::

:::::::::: {.bg-white .rounded-xl .p-4 .shadow}
## Exam

#. Introduction

   - Understand the difference between Web and Internet
   - Structure of an HTTP Request/Response
   - Understand the statelessness of HTTP and its consequences
   - Understand how cookies work and their use
   - Understand the consequences of cookie theft.c:w
   - Sequence diagrams:
     - Basic request/response between client and server for a static website
     - Implementing a basic preference with cookies
   - Role of HTML, CSS, JS and the DOM
   - Understand why JavaScript has become so important and popular
   - Understand why the Web is a platform of choice
   - Understand the difference between back-end and front-end.

#. MPA and AJAX

   - Know the characteristics, advantages and drawbacks of MPAs
   - Sequence diagram of an MPA
   - Understand what AJAX is and its consequences in web architecture (move towards APIs)
   - Understand the consequences of the rise of mobile phones
   - Understand the difficulty to write User Interfaces comes from developer facing mutations
   - Understand the difference between imperative and declarative programming
   - Understand the move to front-end JavaScript frameworks and the Components architecture

#. SPA

   - Understand why SPAs were introduced
   - Know the characteristics, advantages and drawbacks of SPAs
   - Understand the notions of client state, derived values, and effects
   - Understand what waterfalls are in the context of components architecture
   - Understand what Client-Side Routing is, the advantages and the drawbacks
   - Sequence diagrams:
     - Initial rendering
     - Navigation with CSR
   - Understand the WayBack Machine example
   - Understand the SEO issues with SPAs
   - Understanding the difficulty of managing server state
     (especially things like logging out)
   - Understand what SSR, hydration and Isomorphic applications are
   - Sequence diagrams for isomorphic apps, with navigation before/after hydration
   - Know the characteristics, advantages and drawbacks of isomorphic apps

#. API design

   - Roles of front-end/back-end depending on architecture style
   - Understand what a Server-Side web API is
   - REST architecture: what it is, advantages, drawbacks
   - CRUD with REST
   - Understand what underfetching and overfetching are
   - Know what the OpenAPI standard for REST API is, and what it allows to do (documentation, client generation)
   - GraphQL: what it is and how it solves under/overfetching
   - Understand what an ORM is and why it is used

#. Authentication

   - Difference between authorization and authentication
   - Role of HTTPS in authentication
   - Understand hashing and salting, and their role in authentication
   - Know what a rainbow table attack is
   - Sequence diagram: authentication
   - Know two approaches for the session cookie (session id and token)
     and understand the drawbacks and consequences to each
   - Sequence diagram for authentication with session ID and token
   - Sequence diagram for logging out with a session ID
   - Know what the JWT standard is
   - Sequence diagram for SSO
   - Understand why access/refresh tokens are, and why two tokens are used
   - Understand what OAuth is + Sequence diagram

The exam will also contain one easy question on the lab sessions.
::::::::::
:::::::::::::::