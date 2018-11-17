import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard, AuthMiddleware } from "~/common/authentication";
import { ConfigModule } from "~/common/config";
import { DbModule, DbService } from "~/common/db";
import { require_classes_sync } from "~/common/loader";
import { LoggerModule } from "~/common/logger.service";
import { TokenService } from "~/common/token.service";

@Module({
  imports: [ConfigModule, LoggerModule, DbModule],
  controllers: require_classes_sync(__dirname, "controller"),
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    DbService,
    TokenService,
    ...require_classes_sync(__dirname, "service"),
  ],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
