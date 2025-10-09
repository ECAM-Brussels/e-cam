- Main: [![Python Tests](https://github.com/ECAM-Brussels/e-cam/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/ECAM-Brussels/e-cam/actions/workflows/tests.yaml)
- Next: [![Python Tests](https://github.com/ECAM-Brussels/e-cam/actions/workflows/tests.yaml/badge.svg)](https://github.com/ECAM-Brussels/e-cam/actions/workflows/tests.yaml)

## Installation instructions

- Install [Docker](https://www.docker.com/)
- Clone this repository
- Run `docker compose up --build`

### Structure

- `content`: static pages and assignments
- `prisma`: everything database-related (schema and migrations)
- `public`: files that should be served as is (e.g. images)
- `src`:
  - `components`: reusable UI pieces that are NOT exercises
  - `exercises`: mathematical exercises
  - `routes`: website pages (mostly automatically generated)
- `symapi`: Python API for symbolic calculations
