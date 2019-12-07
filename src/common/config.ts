import { Module } from "@nestjs/common";
import envalid, { port, str, url } from "envalid";

interface Environment extends envalid.CleanEnv {
  DB: string;
  PORT: number;
  JWT_TOKEN: string;
}

export class ConfigService {
  private readonly envConfig: Environment;

  constructor() {
    this.envConfig = envalid.cleanEnv<
      {
        [K in Exclude<
          keyof Environment,
          keyof envalid.CleanEnv
        >]: Environment[K];
      }
    >(
      process.env,
      {
        DB: url({ default: "pg:///example" }),
        PORT: port({ default: 80, devDefault: 3000 }),
        JWT_TOKEN: str({ default: "94792d86" }),
      },
      { strict: true },
    );
  }

  public get<K extends keyof Environment>(key: K): Environment[K] {
    return this.envConfig[key];
  }
}

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
