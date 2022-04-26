# Public Api Server

The Public Api Server provides a single endpoint with a list of publicly available APIs with some details. The
source of data is an API exposed by: https://github.com/davemachado/public-api.

The server exposes a GET endpoint /apis on the port defined in the environment variable PORT or, if not specified, on port 3000. For example,
http://localhost:3000/apis.

You can provide query parameters:
- title - will search for all the items which the api title (original API property) containing provided substring as `title=<searched title substring>`,
- cors - search for items with the given cors. Possible values are "true", "false" or "undefined".

## Installation

Please clone the repository and intall dependencies. For example, if you use `npm` please run in the project directory:
```
npm install
```

After installation of the dependencies you are ready to go.

## Development

To run the server in the development mode, hit in the project directory
```
npm run dev
```

You should be able to benefit from the ESLint configuration in the IDE. There are also separate linting commands available `npm run lint` and `npm run lint:fix`.

## Tests

Tests configured with Jest. You can run tests with
```
npm test
```

or, in the watch mode, by entering
```
npm run test:watch
```

For the coverage test use `npm run test:cov`.

## Build

The final version of the project can be built using `npm run build`. After the build, the server code can be find in the `/dist` directory.

## Deployment

For the CI/CD pipelines you may find useful the command `npm start` which automatically will build the package to the `/dist` directory and start the server.
