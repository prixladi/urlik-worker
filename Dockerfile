FROM node:12.17.0-alpine as build

WORKDIR /app
COPY package*.json ./
COPY . .
RUN yarn install
RUN yarn run build

FROM node:12.17.0-alpine as final

WORKDIR /app
COPY package*.json ./
RUN yarn install --only=production
COPY --from=build /app/build ./build

ENTRYPOINT [ "node", "/app/build/index.js" ]