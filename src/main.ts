import { NestFactory } from "@nestjs/core";
import { AppModule } from "~/app.module";
import { ConfigService } from "~/common/config";
import { AppExceptionFilter, GeneralExceptionFilter } from "~/common/errors";
import { PinoLoggerService } from "~/common/logger.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(PinoLoggerService));

  app.useGlobalFilters(new GeneralExceptionFilter(), new AppExceptionFilter());

  await app.listen(app.get(ConfigService).get("PORT"));
}

bootstrap();
