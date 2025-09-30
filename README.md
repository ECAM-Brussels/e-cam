- Main: [![Run Tests](https://github.com/ECAM-Brussels/e-cam/actions/workflows/pytest.yaml/badge.svg?branch=main)](https://github.com/ECAM-Brussels/e-cam/actions/workflows/pytest.yaml)
- Next: [![Run Tests](https://github.com/ECAM-Brussels/e-cam/actions/workflows/pytest.yaml/badge.svg)](https://github.com/ECAM-Brussels/e-cam/actions/workflows/pytest.yaml)

## Dependencies

- [Node.js](https://nodejs.org/en)
- [Python](https://www.python.org/)
- [Poetry](https://python-poetry.org/)
- MySQL or MariaDB
- [Pandoc](https://pandoc.org)

### Instructions for MacOS

~~~ bash
# Install homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install dependencies
brew install node python poetry mariadb pandoc

# Start MariaDB
brew services start mariadb
~~~

### Create a database

First, connect to the database server via the `mysql` command.

~~~ sql
CREATE DATABASE ecam;
~~~

Then connect to the server as root `sudo mysql` to set up a password for your user.

~~~ sql
ALTER USER '<username>'@'localhost' IDENTIFIED BY '<password>';
FLUSH PRIVILEGES;
~~~

## First run

### Env variables

Create a `.env` file which contains:

~~~ bash
VITE_AZURE_CLIENT_ID=
VITE_AZURE_TENANT_ID=
VITE_AZURE_CLIENT_SECRET=
VITE_AZURE_REDIRECT_URI=
VITE_PASSPHRASE=
VITE_SESSION_SECRET=
DATABASE_URL=mysql://<user>:<password>@localhost:3306/ecam
~~~

### Set up

Run the following commands

~~~ bash
npm install
npm run dev
~~~

### Structure

- `content`: static pages and assignments
- `prisma`: everything database-related (schema and migrations)
- `public`: files that should be served as is (e.g. images)
- `src`:
  - `components`: reusable UI pieces that are NOT exercises
  - `exercises`: mathematical exercises
  - `routes`: website pages (mostly automatically generated)
- `symapi`: Python API for symbolic calculations
