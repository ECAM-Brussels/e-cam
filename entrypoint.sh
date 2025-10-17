#!/bin/sh
set -e 

if [ "$1" = "bash" ] || [ "$1" = "sh" ] || [ "$1" = "npm" ] || [ "$1" = "npx" ]; then
  exec "$@"
fi

npm install
if ! [ "$1" = "test" ]; then
  npx prisma generate
  npx prisma migrate deploy
fi
npx graphql-codegen
rsync -a --delete node_modules /mnt/

if ! [ "$1" = "build" ]; then
  exec npm run $@
fi

npm run build
npm run start -- --host 0.0.0.0
