import { Module } from "@nestjs/common";
import envalid, { email, json, port, str, url } from "envalid";

interface IEnvironment {
  DB: string;
  PORT: number;
  JWT_TOKEN: string;
}
type IConfig = Readonly<IEnvironment> & envalid.CleanEnv;

export class ConfigService {
  private readonly envConfig: IConfig;

  constructor() {
    this.envConfig = envalid.cleanEnv<IEnvironment>(
      process.env,
      {
        DB: url({ default: "pg:///example" }),
        PORT: port({ default: 80, devDefault: 3000 }),
        JWT_TOKEN: str({ default: "94792d86" }),
      },
      { strict: true },
    );
  }

  public get<K extends keyof IConfig>(key: K): IConfig[K] {
    return this.envConfig[key];
  }
}

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
