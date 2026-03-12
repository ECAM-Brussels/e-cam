---
title: Deployment
slideshow: true
lang: en
---

# Deploy without Docker

In case Docker doesn't work,
use the following instructions.

# Install postgres {.w-1--2}

Install PostgreSQL

~~~ bash
sudo apt update && sudo apt upgrade -y
sudo apt install postgresql postgresql-contrib -y
~~~

Enter the PostgreSQL shell

~~~ bash
sudo -i -u postgres
psql
~~~

~~~ sql
CREATE DATABASE mydb OWNER postgres;
ALTER USER postgres WITH PASSWORD 'YourStrongPassword';
exit
~~~

Restart PostgreSQL

~~~ bash
sudo systemctl restart postgresql
~~~

# Install node.js {.w-2--3}

~~~ bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl gnupg
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs
~~~

# Set up {.w-2--3}

Create a .env file with the following content

~~~ env
DATABASE_URL=postgresql://postgres:StrongPass123!@localhost:5432/mydb
~~~

Every time you change your code, run:

~~~ bash
git pull
npm install
npx drizzle-kit push
npm run build
npm run start
~~~
