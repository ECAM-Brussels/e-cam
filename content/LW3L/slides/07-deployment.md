---
title: Déploiement
slideshow: true
---

# Modalités de l'examen {.grid .grid-cols-2 .gap-4}

::::: col
### Partie Web

Exercice `CRUD` employant React et une base de données

| Critère                                       | /10 |
| --------------------------------------------- | --: |
| Persistence des données (modèle SQL)          |   1 |
| Fonctionnalité (Create, Read, Update, Delete) |   4 |
| Qualité du code (Lint, Python, JavaScript)    |   3 |
| Interface (Apparence, Accessibilité)          |   2 |

BONUS:

- Emploi de React Router pour avoir une SPA
:::::

::::: col
### Partie Linux

- Déployer le site sur le port 80
- Script de back-up
- ...

::: warning
Si vous n'avez pas au moins un site servi sur le port 80,
vous serez plafonné à 9.5.
:::
:::::

# Déploiement {.w-1--2}

À effectuer la première fois

``` bash
sudo apt install python3-pip
pip install fastapi[standard] sqlmodel
```

À effectuer à chaque changement

``` bash
python3 -m fastapi run main.py
```

::: remark
Les processus lancés se terminent à la fin de votre session SSH.
Pensez à faire l'exécution définitive en arrière plan `nohup <votre_commande> &`
:::

# Déploiement automatisé avec git {.w-1--2}

::: hint
- Si vous créez un fichier executable (`chmod +x`) `.git/hooks/post-merge`,
  alors il sera exécuté après chaque pull.

- Si votre dossier est un remote, le hook `.git/hooks/post-receive` sera exécuté
  à chaque fois qu'un `push` aura été effectué.
:::

::: exercise
Avec l'aide de ChatGPT ou autrement,
préparez un hook `post-merge` (ou `post-receive`)
qui lance ou relance automatiquement
le serveur fastapi en cas de changement de fichier avec `nohup`.
:::

# Back up sqlite {.w-1--2}

À exécuter la première fois

``` bash
sudo apt install sqlite3
```

Ensuite:

``` bash
sqlite3 /path/to/your/database.db .dump > database_dump.sql
```