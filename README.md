# Urlik Worker

Worker service processing events send through Redis by [Urlik server](https://github.com/prixladi/shamyr-urlik-server).

## Yarn

### `yarn start`

Runs the app in the development mode..

The app will restart if you make edits.<br />
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.<br />
App is ready to be deployed!

## Docker

### `docker build .`

Builds production-ready image.

### `docker-compose up`

Runs app container and other required/optional containers (**mongodb, redis**) and builds app image if does not exist.
