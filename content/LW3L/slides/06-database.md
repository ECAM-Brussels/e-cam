---
title: Base de données
---

:::::::::: {.bg-white .rounded-xl .shadow .px-4 .py-8}

# ORM

L'idée centrale d'un ORM est l'utilisation d'une classe
pour représenter la structure d'une table SQL.
Les instances de cette classe représenteront des entrées dans la table.

Cette idée devrait déjà être familière,
puisque nous employons déjà une classe pour la validation (avec Pydantic).

# Installation

Nous emploierons `SQLModel`, qui intègre l'ORM `SQLAlchemy` avec FastApi et Pydantic.

```
pip install sqlmodel
```

# Exemple

::::: {.grid .grid-cols-2}
```python
import fastapi
import fastapi.staticfiles
import sqlmodel
import typing


class User(sqlmodel.SQLModel, table=True):
    id: int | None = sqlmodel.Field(primary_key=True)
    first_name: str
    last_name: str


engine = sqlmodel.create_engine("sqlite:///./test.db")
session = sqlmodel.Session(engine)
sqlmodel.SQLModel.metadata.create_all(engine)
app = fastapi.FastAPI()


@app.post("/users")
def add_user(user: User) -> User:
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@app.get("/users")
def get_users() -> typing.Sequence[User]:
    query = sqlmodel.select(User)
    return session.exec(query).all()


@app.get("/users/{user_id}")
def get_user(user_id: int) -> User:
    user = session.get(User, user_id)
    if not user:
        raise fastapi.HTTPException(status_code=404, detail="User not found")
    return user

@app.put("/users/{user_id}")
def update_user(user_id: int, modified_user: User) -> User:
    user = session.get(User, user_id)
    if not user:
        raise fastapi.HTTPException(status_code=404, detail="User not found")
    user.first_name = modified_user.first_name
    user.last_name = modified_user.last_name
    session.commit()
    session.refresh(user)
    return user


@app.delete("/users/{user_id}")
def delete_user(user_id: int) -> User:
    user = session.get(User, user_id)
    if not user:
        raise fastapi.HTTPException(status_code=404, detail="User not found")
    session.delete(user)
    session.commit()
    return user


app.mount("/", fastapi.staticfiles.StaticFiles(directory="static", html=True))
```

::: div
#### Explications

- Lignes 7-10: création d'un modèle **associé à une table SQL**.
  On spécifie que l'`id` est une **clé primaire**.
  Ce modèle s'occupera également de la validation.

- Lignes 13-14: création d'une session de connexion à la base de données SQLite
  associée au fichier `test.db`

- Ligne 15: Création/mise à jour des tables basée sur les modèles

- Lignes 20-24: Création d'un utilisateur.
  On l'ajoute (ligne 21), on confirme le changement (ligne 22), on actualise l'utilisateur
  avec les champs ajoutés par la base de données (ligne 23).
  Dans notre cas, cela rajoutera un `id` pour l'utilisateur.

- Lignes 27-30: requête pour voir tous les utilisateurs.
:::
:::::

::::::::::