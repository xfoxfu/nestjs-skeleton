import { Inject, Injectable } from "@nestjs/common";
import { sign, verify } from "jsonwebtoken";
import { ConfigService } from "../common/config";
import { InvalidTokenException } from "../common/errors";
import { User } from "../entity/user";

interface TokenData {
  username: string;
}

@Injectable()
export class TokenService {
  private jwtToken: string;

  constructor(@Inject(ConfigService) config: ConfigService) {
    this.jwtToken = config.get("JWT_TOKEN");
  }

  /**
   * issue new token with 7d expiration
   *
   * @param user
   */
  public sign(user: User): string {
    const data: TokenData = { username: user.username };
    return sign(data, this.jwtToken, {
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
      return (verify(token, this.jwtToken) as TokenData).username;
    } catch {
      throw new InvalidTokenException();
    }
  }
}
