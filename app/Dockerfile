FROM "node"
WORKDIR /app
COPY *.json *.lock ./
RUN npm install
COPY . .
RUN npm run build
CMD [ "node", "./build" ]