#!/bin/sh
set -e 

if [ "$2" = "npm" ] || [ "$1" = "npx" ]; then
  npx prisma generate
  npx prisma migrate deploy
  npx graphql-codegen
fi

$@

rsync -a --delete node_modules /mnt/
