#!/bin/sh
set -e 

npm install

if ! [ "$1" = "test" ]; then
  npx prisma migrate deploy
fi

npx graphql-codegen
npm run $@
