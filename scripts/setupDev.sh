!#/bin/bash
FULL_PATH_TO_SCRIPT="$(realpath "${BASH_SOURCE[-1]}")"
SCRIPT_DIRECTORY="$(dirname "$FULL_PATH_TO_SCRIPT")"

cd $SCRIPT_DIRECTORY/

cd ../api
yarn install
yarn generate

cd ../app
yarn install
yarn generate
yarn build

cd ../nginx
openssl req -x509 -sha256 -nodes -newkey rsa:2048 -days 365 -keyout localhost.key -out localhost.crt

cd ..
cp .env.example .env
docker-compose build
