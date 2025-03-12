---
title: Authentication
slideshow: true
lang: en
---

# Session and persistence {.grid .grid-cols-2}

```tsx
import { useSession } from 'vinxi/http'

type SessionData = {
  email?: string
}

export function getSession() {
  'use server'
  return useSession<SessionData>({
    password: import.meta.env.VITE_SESSION_SECRET,
  })
}
```

::: col
- Sessions are a mechanism to remember data across different requests.

- This is accomplished via **cookies**,
  text blocks stored on the client's browser
  that are presented at each request.

- Cookies can be falsified, so it's important to encrypt it.

- In this example,
  we determine if a user is connected by checking the email variable is the session data.

- `VITE_SESSION_SECRET` is a variable declared in `.env`

::::: warning
- Ensure `VITE_SESSION_SECRET` does not make it to the client bundle

- Remember that **server functions** create an API endpoint.
  If it mutates data, it **must** be validated.
  If it returns JSON serializable data,
:::::
:::

# Basic authentication {.w-1--2}

Users' passwords should not be stored in plain text.

```tsx {.run hideEditor=true tailwind=true framework=solid}
import bcrypt from 'bcryptjs'
import { createSignal, createResource } from 'solid-js'

function App() {
  const [salt, setSalt] = createSignal('')
  bcrypt.genSalt(10).then(setSalt)
  const [password, setPassword] = createSignal('hello')
  const [hashed] = createResource(() => [salt(), password()], async ([salt, password]) => {
    return await bcrypt.hash(password, salt);
  })
  return (
    <div class="font-xl">
      <input class="border p-2 mr-2" value={password()} onInput={e => setPassword(e.target.value)} />
      <button class="border p-2 bg-gray-200" onClick={(e) => bcrypt.genSalt(10).then(setSalt)}>
        Change salt
      </button>
      <pre>
        Password: {password()}{'\n'}
        Salt: {salt()}{'\n'}
        Hashed: {hashed()}
      </pre>
    </div>
  )
}
```

$$
\mathtt{storedPassword} = \mathtt{salt} + \mathtt{hash}(\mathtt{salt} + \mathtt{password})
$$

```ts
function compare(password: string, stored: string) {
  const salt = extractSalt(stored)
  return salt + hash(salt + password) === stored
}
```

::: question
Why hash? Why salt?
:::

# Registration {.grid .grid-cols-2}

```tsx
import bcrypt from 'bcryptjs'

export const userSchema = z.object({
  login: z.string(),
  password: z.string().min(8),
})

function register(form: formData) {
  'use server'
  const user = userSchema.parse({
    login: form.get('login'),
    password: form.get('password'),
  })
  user.password = await bcrypt.hash(user.password, 10)
  // Add 'user' to the database
  // ...
}
```

::: col
#. Alawys validate user input with a schema

#. Hash the password with a random salt

#. Store the new user with a hashed password
:::

# Login {.w-3--5}

```tsx
import bcrypt from 'bcryptjs'

function login(form: formData) {
  'use server'
  const { email, password } = userSchema.parse({
    email: form.get('email'),
    password: form.get('password'),
  })
  const record = await db.user.findUniqueOrThrow({ where: { email }})
  const loggedIn = await bcrypt.compare(password, record.password)
  if (loggedIn) {
    const session = await getSession()
    session.update({ email })
  }
}
```

# Check if the user is connected {.grid .grid-cols-2}

```tsx
export const getUser = query(async () => {
  'use server'
  try {
    const session = await getSession()
    if (!session.data.email) {
      return null
    }
    return await prisma.user.findUniqueOrThrow({
      where: { email: session.data.email },
    })
  } catch {
    return null
  }
}, 'getUser')
```

::: column
- Two possibilities

  - Not logged in: session email is empty, `getUser` should return `null`
  - Logged in: session email is not empty, we fetch the rest of the profile from the database.

:::: question
Why do we use `query`?
::::
:::

# OAuth {.grid .grid-cols-2 .gap-4}

::: column

The aim is to get a **token** from the provider,
which will give your app partial access to the user's account.
Your app and the auth provider talk via URL redirections,
and so their communications could be intercepted and faked.

1. User clicks on log in button

2. The app redirects the user to the auth provider

   `https://auth-provider.com/auth?<securityStuff>`

3. The user consents on the auth-provider's website,
   which redirects to a special page of your website (callback).

   `https://my-website.com/auth/callback?<moreSecurityStuff>`

4. Now, your website can ask for a token from the auth provider
   via a `POST` request.

:::

::: column
### Main steps

0. Setting up: sessions

1. Action to start the login

2. Get the **redirect URL**

3. Callback: get the token

::::: warning
- We need to ensure that the token is not communicated via the URL
  (network communications could be watched)

- We need to ensure that the user trully consented to sharing their data.
  The final POST request must only be doable by the app
  after a full authorization flow.
:::::
:::

# Sessions {.grid .grid-cols-2}

```tsx
import { useSession } from 'vinxi/http'

type SessionData = {
  email?: string
  state?: string
  codeVerifier?: string
}

export function getSession() {
  'use server'
  return useSession<SessionData>({
    password: import.meta.env.VITE_SESSION_SECRET,
  })
}

export const saveAuthState = async (state: string, codeVerifier: string) => {
  'use server'
  const session = await getSession()
  await session.update({ state, codeVerifier })
}
```

::: col
- Sessions are used for persisting data across requests via encrypted cookies.

- You need to define `VITE_SESSION_SECRET` in `.env`.
  Generate a password via `openssl rand -base64 32`.

- `email` will contain the email of the connected user,
  `state` and `codeVerifier` are used to temporarily remember information
  used during authentication.

- Why is the following function dangerous?

  ```tsx
  function updateSession(data: Partial<SessionData>) {
    'use server'
    const session = await getSession()
    await session.update(data)
  }
  ```
:::

# Login button {.w-1--2}

```tsx
const login = action(async () => {
  // getLoginUrl will be implemented later
  throw redirect(await getLoginUrl())
}, 'startLogin')

function LoginButton() {
  return (
    <form method="post" action={login}>
      <button type="submit">Log in</button>
    </form>
  )
}
```

# Log in URL {.grid .grid-cols-2}

```ts
import { generateCodeVerifier, generateState, MicrosoftEntraId } from "arctic"
import { saveAuthState } from "./session"

// Replace by your provider
export const entra = new MicrosoftEntraId(
  import.meta.env.VITE_AZURE_TENANT_ID,
  import.meta.env.VITE_AZURE_CLIENT_ID,
  null,
  import.meta.env.VITE_AZURE_REDIRECT_URI,
)

export const getLoginUrl = async () => {
  'use server'
  const state = generateState()
  const codeVerifier = generateCodeVerifier()
  const url = entra.createAuthorizationURL(state, codeVerifier, ['openid', 'profile', 'email'])
  await saveAuthState(state, codeVerifier)
  return url.toString()
}
```

::: col
- Install `arctic` via `npm install arctic`

- The `VITE_AZURE_TENANT_ID`, `VITE_AZURE_CLIENT_ID` and `VITE_AZURE_REDIRECT_URI`
  need to be specified in the `.env` file.
  They are given by the OAuth provider after your register your app.

- [Arctic documentation](https://arcticjs.dev/):
  contains info on different providers.

- [Lucia](https://lucia-auth.com/)

- [This website](https://github.com/ECAM-Brussels/e-cam/tree/next/src):
  `src/lib/auth`, `src/routes/auth`
:::

# Callback {.w-1--2}

```tsx
import { type APIEvent } from '@solidjs/start/server'
import { decodeIdToken } from 'arctic'
import { z } from 'zod'
import { entra } from '~/lib/auth/azure'
import { getSession } from '~/lib/auth/session'
import { db } from '~/lib/db'

const profileSchema = z.object({
  email: z.string().email(),
  given_name: z.string(),
  family_name: z.string(),
})

export async function GET(event: APIEvent) {
  // Return 400 error if it fails the security tests
  const session = await getSession()
  const url = new URL(event.request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const { state: storedState, codeVerifier } = session.data
  if (!code || !state || !storedState || !codeVerifier || state !== storedState) {
    return new Response(null, { status: 400 })
  }

  // Get token and use it to get the user's info
  const tokens = await entra.validateAuthorizationCode(code, codeVerifier)
  const userInfo = profileSchema.parse({
    ...decodeIdToken(tokens.idToken()),
    ...decodeIdToken(tokens.accessToken()),
  })
  if (!userInfo) {
    return new Response(null, { status: 400 })
  }

  // Upsert the user to the database
  await db.user.upsert({
    where: { email: userInfo.email },
    update: {},
    create: {
      admin: /^[a-zA-Z][a-zA-Z0-9]{2}@/.test(userInfo.email),
      email: userInfo.email,
      firstName: userInfo.given_name,
      lastName: userInfo.family_name,
    },
  })
  // Update the session
  await session.update({
    codeVerifier: undefined,
    state: undefined,
    email: userInfo.email,
  })
  return new Response(null, {
    status: 302,
    headers: { Location: '/' },
  })
}
```

# Get user info {.w-1--2}

```tsx
export const getUser = query(async () => {
  'use server'
  try {
    const session = await getSession()
    if (!session.data.email) {
      return null
    }
    return await prisma.user.findUniqueOrThrow({
      where: { email: session.data.email },
    })
  } catch {
    return null
  }
}, 'getUser')
```

# Logging out {.w-1--2}

```tsx
export const logout = action(async () => {
  'use server'
  const session = await getSession()
  await session.clear()
})
```