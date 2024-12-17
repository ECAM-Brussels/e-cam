---
title: Users
---

# Users

::::: columns-2

``` html {.run .break-inside-avoid}
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<div id="app"></div>
<script type="text/babel" data-presets="react" data-type="module">
  import React from "https://esm.sh/react@18";
  import ReactDOM from "https://esm.sh/react-dom@18";

  function App() {
    const [users, setUsers] = React.useState([]);
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");

    async function fetchUsers() {
      const res = await fetch("/users");
      const json = await res.json();
      setUsers(json);
    }

    async function addUser() {
      await fetch("/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
        })
      })
      fetchUsers()
    }

    React.useEffect(() => {
      fetchUsers();
    }, []);

    return (
      <>
        <input
          value={firstName}
          onInput={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
        />
        <input
          value={lastName}
          onInput={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
        />
        <button onClick={addUser}>Submit</button>
        <ul>
          {users.map((user) => (
            <li>
              {user.last_name}, {user.first_name}
            </li>
          ))}
        </ul>
      </>
    );
  }

  const appContainer = document.getElementById("app");
  ReactDOM.createRoot(appContainer).render(<App />);
</script>
```

``` python {.break-inside-avoid}
import fastapi
from fastapi.staticfiles import StaticFiles
import pydantic

app = fastapi.FastAPI()


class User(pydantic.BaseModel):
    first_name: str
    last_name: str
    age: int | None = None

users: list[User] = [
    User(first_name="Martin", last_name="Fockedey"),
    User(first_name="Khoi", last_name="Nguyen"),
]

@app.get("/users")
def get_users() -> list[User]:
    return users

@app.post("/users")
def register(user: User) -> User:
    users.append(user)
    return user

app.mount("/", StaticFiles(directory="static", html=True), name="static")
```

:::::