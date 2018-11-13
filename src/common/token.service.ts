import { Inject, Injectable } from "@nestjs/common";
import { sign, verify } from "jsonwebtoken";
import { ConfigService } from "~/common/config";
import { InvalidTokenException } from "~/common/errors";
import { User } from "~/entity/user";

interface ITokenData {
  username: string;
}

@Injectable()
export class TokenService {
  private jwt_token: string;
  constructor(@Inject(ConfigService) config: ConfigService) {
    this.jwt_token = config.get("JWT_TOKEN");
  }

  /**
   * issue new token with 7d expiration
   *
   * @param user
   */
  public sign(user: User): string {
    const data: ITokenData = { username: user.username };
    return sign(data, this.jwt_token, {
      expiresIn: "7d",
    });
  }
  /**
   * get user name by token
   *
   * @param token
   * @returns user id
   */
  public verify(token: string): string {
    try {
      return (verify(token, this.jwt_token) as ITokenData).username;
    } catch {
      throw new InvalidTokenException();
    }
  }
}
