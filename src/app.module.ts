// tslint:disable-next-line:no-var-requires
require("tsconfig-paths/register");

import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard, AuthMiddleware } from "~/common/authentication";
import { ConfigModule } from "~/common/config";
import { DbModule, DbService } from "~/common/db";
import { LoggerModule } from "~/common/logger.service";
import { TokenService } from "~/common/token.service";
import { UserController } from "~/controller/user";
import { UserService } from "~/service/user";
import { SessionController } from "./controller/session";

@Module({
  imports: [ConfigModule, LoggerModule, DbModule],
  controllers: [
    UserController,
    SessionController,
    // add new controllers here
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    DbService,
    TokenService,
    UserService,
    // add new services here
  ],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
