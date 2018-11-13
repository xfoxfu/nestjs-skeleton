import { Module } from "@nestjs/common";
import envalid, { email, json, port, str, url } from "envalid";

interface IEnvironment extends envalid.CleanEnv {
  DB: string;
  PORT: number;
  JWT_TOKEN: string;
}

export class ConfigService {
  private readonly envConfig: IEnvironment;

  constructor() {
    this.envConfig = envalid.cleanEnv<
      {
        [K in Exclude<
          keyof IEnvironment,
          keyof envalid.CleanEnv
        >]: IEnvironment[K]
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

  public get<K extends keyof IEnvironment>(key: K): IEnvironment[K] {
    return this.envConfig[key];
  }
}

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
