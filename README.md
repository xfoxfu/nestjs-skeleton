# nestjs-skeleton

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fcoderfox%2Fnestjs-skeleton.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fcoderfox%2Fnestjs-skeleton?ref=badge_shield)

## Usage

| period      | command              | description                                           |
| ----------- | -------------------- | ----------------------------------------------------- |
| development | `pnpm start:dev`     | start server with auto reloading                      |
| development | `pnpm start`         | start server without auto reloading                   |
| development | `pnpm start:debug`   | start server with auto reloading and debugging        |
| development | `pnpm format`        | format source codes                                   |
| development | `pnpm lint`          | run eslint                                            |
| development | `pnpm test`          | run tests                                             |
| development | `pnpm test:watch`    | run tests with auto reloading                         |
| deploy      | `pnpm compile`       | compile executable source of plain node               |
| deploy      | `pnpm clean-compile` | cleanup, then compile executable source of plain node |
| deploy      | `pnpm clean`         | cleanup compiled dists                                |
| production  | `pnpm start:prod`    | start server                                          |

Note the following points:

- The source codes are automatically formatted and linted before commit using [husky](https://github.com/typicode/husky).
- By default, development requires `pnpm`.
- `pnpm start:prod` will not automatically compile the sources.
- Controllers in `/src/controller` and services in `/src/service` will be automatically loaded. As a consequence, those files cannot contain non-relevant function exports.

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
- generate migration with `pnpm db migration:generate --name <migration_name>`

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
- [husky](https://github.com/typicode/husky) git hooks

## To-Dos

- [ ] unit & integration tests
- [ ] Docker support
- [ ] controller & service generation

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fcoderfox%2Fnestjs-skeleton.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fcoderfox%2Fnestjs-skeleton?ref=badge_large)
