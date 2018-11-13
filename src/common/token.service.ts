import { Injectable } from "@nestjs/common";
import { sign, verify } from "jsonwebtoken";
import { User } from "~/entity/user";
import { JWT_TOKEN } from "./config";
import { InvalidTokenException } from "./errors";

interface ITokenData {
  username: string;
}

@Injectable()
export class TokenService {
  /**
   * issue new token with 7d expiration
   *
   * @param user
   */
  public sign(user: User): string {
    const data: ITokenData = { username: user.username };
    return sign(data, JWT_TOKEN, {
      expiresIn: "7d"
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
      return (verify(token, JWT_TOKEN) as ITokenData).username;
    } catch {
      throw new InvalidTokenException();
    }
  }
}
