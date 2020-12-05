FROM node:15.3.0-alpine3.10 as build

WORKDIR /app
COPY package*.json ./
COPY . .
RUN yarn install
RUN yarn build

FROM node:15.3.0-alpine3.10 as final

WORKDIR /app
COPY package*.json ./
RUN yarn install --only=production
COPY --from=build /app/dist ./dist

ENTRYPOINT [ "node", "/app/dist/index.js" ]