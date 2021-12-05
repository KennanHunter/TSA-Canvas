FROM node:17-alpine3.14
WORKDIR /api
COPY . .
COPY ormconfig.docker.json ./ormconfig.json
RUN yarn install
CMD [ "yarn", "start" ]