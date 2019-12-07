import { Injectable, Module } from "@nestjs/common";
import {
  InjectConnection,
  InjectRepository,
  TypeOrmModule,
} from "@nestjs/typeorm";
import { Connection, Repository } from "typeorm";
import { ConfigModule, ConfigService } from "../common/config";
import { LoggerModule, TypeOrmLoggerService } from "../common/logger.service";
import { User } from "../entity/user";
import { requireClassesSync } from "./loader";

@Injectable()
export class DbService {
  constructor(
    @InjectConnection() public readonly connection: Connection,
    @InjectRepository(User) public readonly users: Repository<User>,
  ) {}
}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, LoggerModule],
      inject: [ConfigService, TypeOrmLoggerService],
      useFactory: (config: ConfigService, logger: TypeOrmLoggerService) => ({
        type: "postgres",
        url: config.get("DB"),
        migrationsRun: !config.get("isProd"),
        synchronize: config.get("isDev"),
        logging: true,
        logger,
        entities: requireClassesSync(__dirname, "../entity"),
        migrations: requireClassesSync(__dirname, "../migration"),
        subscribers: requireClassesSync(__dirname, "../subscriber"),
      }),
    }),
    TypeOrmModule.forFeature(requireClassesSync(__dirname, "../entity")),
  ],
  providers: [DbService],
  exports: [DbService, TypeOrmModule],
})
export class DbModule {}
