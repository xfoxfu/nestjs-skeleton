# nestjs-skeleton

## Usage

| period      | command              | description                                           |
| ----------- | -------------------- | ----------------------------------------------------- |
| development | `yarn start:dev`     | start server with auto reloading                      |
| development | `yarn start`         | start server without auto reloading                   |
| development | `yarn start:debug`   | start server with auto reloading and debugging        |
| development | `yarn format`        | format source codes                                   |
| development | `yarn lint`          | run tslint                                            |
| development | `yarn test`          | run tests                                             |
| development | `yarn test:watch`    | run tests with auto reloading                         |
| deploy      | `yarn compile`       | compile executable source of plain node               |
| deploy      | `yarn clean-compile` | cleanup, then compile executable source of plain node |
| deploy      | `yarn clean`         | cleanup compiled dists                                |
| production  | `yarn start:prod`    | start server                                          |

Note the following points:

- The source codes are automatically formatted and linted before commit using [husky](https://github.com/typicode/husky).
- By default, development requires `yarn`.
- `yarn start:prod` will not automatically compile the sources.

## Development pipeline

### Service

- create/find relevant services in `/src/service`
- add service to `/src/app.module.ts`

### Controller

- create/modify relevant controller in `/src/controller`
- add controller to `src/app.module.ts`

### Error

- create exception in `/src/common/errors.ts`

### Entity

- create entity in `/src/entity`
- generate migration with `yarn db migration:generate --name <migration_name>`

### Config

- change `IEnvironment` in `/src/common/config.ts`
- define schema according to compile errors

## Default features

- [nest.js](https://nestjs.com)
- [TypeScript](https://www.typescriptlang.org)
- [TypeORM](https://typeorm.io) database ORM with PostgreSQL database
- [jsonwebtoken]() json web token
- [pino](https://github.com/pinojs/pino) logger
- [envalid](https://github.com/af/envalid) environment configuration loading
- [Visual Studio Code](https://code.visualstudio.com) integration
- [huksy](https://github.com/typicode/husky) git hooks

## To-Dos

- [ ] unit & integration tests
- [ ] Docker support
- [ ] controller & service generation
