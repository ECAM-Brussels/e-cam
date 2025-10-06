#!/bin/sh
set -e 

npm install
npx prisma migrate deploy
npx graphql-codegen
npx vinxi dev --host 0.0.0.0
