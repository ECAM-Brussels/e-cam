#!/bin/sh
set -e 

if [ "$1" = "bash" ] || [ "$1" = "sh" ] || [ "$1" = "npm" ] || [ "$1" = "npx" ]; then
  exec "$@"
fi

npm install

if ! [ "$1" = "test" ]; then
  npx prisma migrate deploy
fi

npx graphql-codegen
exec npm run $@
