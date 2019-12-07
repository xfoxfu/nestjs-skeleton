import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard, AuthMiddleware } from "./common/authentication";
import { ConfigModule } from "./common/config";
import { DbModule, DbService } from "./common/db";
import { requireClassesSync } from "./common/loader";
import { LoggerModule } from "./common/logger.service";
import { TokenService } from "./common/token.service";

@Module({
  imports: [ConfigModule, LoggerModule, DbModule],
  controllers: requireClassesSync(__dirname, "controller"),
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    DbService,
    TokenService,
    ...requireClassesSync(__dirname, "service"),
  ],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
