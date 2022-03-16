FROM node:17-alpine3.14 as builder
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

FROM nginx:latest
WORKDIR /usr/share/nginx/html
RUN touch /etc/nginx/localhost.crt
RUN touch /etc/nginx/localhost.key
COPY --from=builder /app/public/build ./