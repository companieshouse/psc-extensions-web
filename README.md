
# psc-extensions-web

This is a web frontend for the PSC Extensions journey. It was created based on [Typescript Web Starter for Companies House](https://github.com/companieshouse/node-review-web-starter-ts).

## Frontend Technologies and Utils

- [NodeJS](https://nodejs.org/)
- [ExpressJS](https://expressjs.com/)
- [Typescript](https://www.typescriptlang.org/)
- [NunJucks](https://mozilla.github.io/nunjucks)
- [GOV.UK Design System](https://design-system.service.gov.uk/)
- [Jest](https://jestjs.io)
- [SuperTest](https://www.npmjs.com/package/supertest)
- [Sonarqube](https://www.sonarqube.org)
- [Docker](https://www.docker.com/)
- [Git](https://git-scm.com/downloads)

## Installing and Running

### Requirements

1. node v20 (engines block in package.json is used to enforce this)
2. npm v10 (engines block in package.json is used to enforce this)

Having cloned the project into your project root, run the following commands:

``` cd psc-extensions-web```

```npm install```

### SSL set-up

If you wish to work with ssl-enabled endpoints locally, ensure you turn the `NODE_SSL_ENABLED` property to `ON` in the config and also provide paths to your private key and certificate.

### Running Locally on Docker

1. Clone [Docker CHS Development](https://github.com/companieshouse/docker-chs-development) and follow the steps in the README

2. Enable the `psc-extensions` module

3. Run `chs-dev up` and wait for all services to start

### To make local changes

Development mode is available for this service in [Docker CHS Development](https://github.com/companieshouse/docker-chs-development).

    ./bin/chs-dev development enable psc-extensions-web

Environment variables used to configure this service in docker are located in the file `services/modules/psc-extensions/psc-extensions-web.docker-compose.yaml`

### Running the tests

To run the tests, type the following command:

``` npm test ```

To get a test coverage report, run:

```npm run coverage```
