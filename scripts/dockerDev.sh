#!/bin/bash

FULL_PATH_TO_SCRIPT="$(realpath "${BASH_SOURCE[-1]}")"
SCRIPT_DIRECTORY="$(dirname "$FULL_PATH_TO_SCRIPT")"

docker-compose --file $SCRIPT_DIRECTORY/../docker-compose.dev.yml build
docker-compose --file $SCRIPT_DIRECTORY/../docker-compose.dev.yml up
