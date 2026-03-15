#!/bin/bash
set -e
npx tsoa spec-and-routes
npx @openapitools/openapi-generator-cli generate -i ./build/swagger.json -o ./client -g typescript-fetch
