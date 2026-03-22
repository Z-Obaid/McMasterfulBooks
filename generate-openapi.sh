#!/bin/bash
set -e

ROOT_DIR=$(cd "$(dirname "$0")" && pwd)

for service in listings-api warehouse-api orders-api; do
  echo "Generating OpenAPI for $service"
  (
    cd "$ROOT_DIR/services/$service"
    npm install
    npm run tsoa
  )
done

node "$ROOT_DIR/scripts/merge-openapi.mjs" \
  "$ROOT_DIR/services/listings-api/build/swagger.json" \
  "$ROOT_DIR/services/warehouse-api/build/swagger.json" \
  "$ROOT_DIR/services/orders-api/build/swagger.json" \
  "$ROOT_DIR/build/swagger.json"

mkdir -p "$ROOT_DIR/services/docs-server/public"
cp "$ROOT_DIR/build/swagger.json" "$ROOT_DIR/services/docs-server/public/swagger.json"

npx @openapitools/openapi-generator-cli generate \
  -i "$ROOT_DIR/build/swagger.json" \
  -o "$ROOT_DIR/client" \
  -g typescript-fetch
