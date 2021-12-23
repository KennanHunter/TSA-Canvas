FROM node:17-alpine3.14 as builder
WORKDIR /app
COPY *.json *.lock ./
RUN yarn install
COPY . .
RUN yarn build

FROM nginx:latest
WORKDIR /usr/share/nginx/html
RUN touch /etc/nginx/localhost.crt
RUN touch /etc/nginx/localhost.key
COPY --from=builder /app/public ./
