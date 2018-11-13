// tslint:disable-next-line:no-var-requires
require("tsconfig-paths/register");

import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard, AuthMiddleware } from "~/common/authentication";
import { DbModule, DbService } from "~/common/db";
import { LoggerModule } from "~/common/logger.service";
import { TokenService } from "~/common/token.service";
import { UserController } from "./controller/user";
import { UserService } from "./service/user";

@Module({
  imports: [LoggerModule, DbModule],
  controllers: [UserController],
  providers: [
    DbService,
    TokenService,
    UserService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
