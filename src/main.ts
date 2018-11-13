import { NestFactory } from "@nestjs/core";
import { join } from "path";
import { AppModule } from "~/app.module";
import * as CONFIG from "~/common/config";
import { AppExceptionFilter, GeneralExceptionFilter } from "~/common/errors";
import { PinoLoggerService } from "~/common/logger.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(PinoLoggerService));

  app.useGlobalFilters(new GeneralExceptionFilter(), new AppExceptionFilter());

  await app.listen(CONFIG.PORT);
}

bootstrap();
