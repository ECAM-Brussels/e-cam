#!/bin/sh
set -e 

if [ "$1" = "npm" ] || [ "$1" = "npx" ]; then
  if [ "$2" != "vitest" ]; then
    npx prisma generate
    npx prisma migrate deploy
  fi
  npx graphql-codegen
fi

$@

rsync -a --delete node_modules /mnt/
