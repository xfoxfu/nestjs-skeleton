import { Injectable, Module } from "@nestjs/common";
import {
  InjectConnection,
  InjectRepository,
  TypeOrmModule
} from "@nestjs/typeorm";
import { Connection, Repository } from "typeorm";
import { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";
import { ConfigModule, ConfigService } from "~/common/config";
import { LoggerModule, TypeOrmLoggerService } from "~/common/logger.service";
import { User } from "~/entity/user";

@Injectable()
export class DbService {
  constructor(
    @InjectConnection() public readonly connection: Connection,
    @InjectRepository(User) public readonly users: Repository<User>
  ) {}
}

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [LoggerModule],
      useFactory: async (logger: TypeOrmLoggerService, config: ConfigService) =>
        ({
          type: "sqlite",
          database: config.get("DB"),
          migrationsRun: !config.get("isProd"),
          synchronize: config.get("isDev"),
          logging: true,
          logger,
          entities: ["dist/entity/**/*.js", "src/entity/**/*.ts"],
          migrations: ["dist/migration/**/*.js", "src/migration/**/*.ts"],
          subscribers: ["dist/subscriber/**/*.js", "src/subscriber/**/*.ts"]
        } as SqliteConnectionOptions),
      inject: [TypeOrmLoggerService]
    }),
    TypeOrmModule.forFeature([User])
  ],
  providers: [DbService],
  exports: [DbService]
})
export class DbModule {}
