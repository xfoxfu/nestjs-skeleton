import { Inject, Injectable, LoggerService, Module } from "@nestjs/common";
import pino from "pino";
import { Logger, QueryRunner } from "typeorm";
import { ConfigModule, ConfigService } from "../common/config";

export const createPino = (config: ConfigService): ReturnType<typeof pino> =>
  pino({
    prettyPrint: config.get("isDev"),
    level: config.get("isDev")
      ? "trace"
      : config.get("isTest")
      ? "silent"
      : "info",
  });

@Injectable()
export class PinoLoggerService implements LoggerService {
  public logger: pino.Logger;

  constructor(@Inject(ConfigService) config: ConfigService) {
    this.logger = createPino(config);
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  public trace(message: string, ...args: any[]): void {
    this.logger.trace(message, ...args);
  }

  public debug(message: string, ...args: any[]): void {
    this.logger.debug(message, ...args);
  }

  public info(message: string, ...args: any[]): void {
    this.logger.info(message, ...args);
  }

  public warn(message: string, ...args: any[]): void {
    this.logger.warn(message, ...args);
  }

  public error(message: string, ...args: any[]): void {
    this.logger.error(message, ...args);
  }

  public log(message: string, ...args: any[]): void {
    this.logger.info(message, ...args);
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

@Injectable()
export class TypeOrmLoggerService implements Logger {
  constructor(
    @Inject(PinoLoggerService) private readonly logger: pino.Logger,
  ) {}

  /**
   * Logs query and parameters used in it.
   */
  public logQuery(
    query: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parameters?: any[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    queryRunner?: QueryRunner,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any {
    this.logger.trace(`typeorm:query ${query}`, parameters || []);
  }

  /**
   * Logs query that is failed.
   */
  public logQueryError(
    error: string,
    query: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parameters?: any[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    queryRunner?: QueryRunner,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any {
    this.logger.error(`typeorm:query ${error}`, {
      query,
      parameters: parameters || [],
    });
  }

  /**
   * Logs query that is slow.
   */
  public logQuerySlow(
    time: number,
    query: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parameters?: any[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    queryRunner?: QueryRunner,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any {
    this.logger.warn(`typeorm:query slow +${time}`, {
      query,
      parameters,
    });
  }

  /**
   * Logs events from the schema build process.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
  public logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
    this.logger.info(`typeorm:schema ${message}`);
  }

  /**
   * Logs events from the migrations run process.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
  public logMigration(message: string, queryRunner?: QueryRunner): any {
    this.logger.info(`typeorm:migration ${message}`);
  }

  /**
   * Perform logging using given logger, or by default to the console.
   * Log has its own level and message.
   */
  public log(
    level: "log" | "info" | "warn",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    message: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    queryRunner?: QueryRunner,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any {
    switch (level) {
      case "log":
        this.logger.debug(message);
        break;
      case "info":
        this.logger.info(message);
        break;
      case "warn":
        this.logger.warn(message);
        break;
    }
  }
}

@Module({
  imports: [ConfigModule],
  providers: [PinoLoggerService, TypeOrmLoggerService],
  exports: [PinoLoggerService, TypeOrmLoggerService],
})
export class LoggerModule {}
