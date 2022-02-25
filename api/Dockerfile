FROM node:17-alpine3.14

WORKDIR /api
COPY *.json *.lock ./
RUN yarn install
COPY . .
CMD [ "yarn", "migrate:start" ]