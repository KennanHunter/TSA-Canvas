!#/bin/bash

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
docker-compose build
