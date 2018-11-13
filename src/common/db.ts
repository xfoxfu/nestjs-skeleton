import { Injectable, Module } from "@nestjs/common";
import {
  InjectConnection,
  InjectRepository,
  TypeOrmModule,
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from "@nestjs/typeorm";
import { Connection, Repository } from "typeorm";
import { ConfigModule, ConfigService } from "~/common/config";
import { LoggerModule, TypeOrmLoggerService } from "~/common/logger.service";
import { User } from "~/entity/user";

const entities = [
  User, // add entities here
];

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
        entities: ["dist/entity/**/*.js", "src/entity/**/*.ts"],
        migrations: ["dist/migration/**/*.js", "src/migration/**/*.ts"],
        subscribers: ["dist/subscriber/**/*.js", "src/subscriber/**/*.ts"],
      }),
    }),
    TypeOrmModule.forFeature(entities),
  ],
  providers: [DbService],
  exports: [DbService],
})
export class DbModule {}
