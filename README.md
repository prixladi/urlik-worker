# Urlik Worker

Worker service processing events sent through Redis by [Urlik Server](https://github.com/prixladi/shamyr-urlik-server).
Part of [Urlik](https://github.com/prixladi/shamyr-urlik) project.

## Yarn

When using **Yarn** keep in mind that you need to run additional services for the worker to function properly. You can use docker as described below. If you decide to use another method you will probably need to change the default configuration.

### `yarn start`

Runs the app in the development mode.

The app will restart if you make edits.<br />
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `dist` folder.<br />
the App is ready to be deployed!

## Docker

### `docker build .`

Builds a production-ready image.

### `docker-compose up`

Runs app container and other containers (**MongoDB, Redis, Authorization  Service, Urlik Server, etc...**) and builds app image if does not exist.
