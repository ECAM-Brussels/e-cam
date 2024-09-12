## Dependencies

- [Node.js](https://nodejs.org/en)
- [Python](https://www.python.org/)
- [Poetry](https://python-poetry.org/)
- MySQL or MariaDB
- [Pandoc](https://pandoc.org)

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
DATABASE_URL=
~~~

### Set up

Run the following commands

~~~ bash
npm install
npm run api
npx graphql-codegen
npx prisma migrate deploy
npx prisma generate
# After killing 'npm run api'
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