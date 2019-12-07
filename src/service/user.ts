import { Inject, Injectable } from "@nestjs/common";
import { DbService } from "../common/db";
import {
  DuplicatedUsernameException,
  InvalidTokenException,
  PasswordMismatchException,
  UserNotExistException,
} from "../common/errors";
import { PinoLoggerService } from "../common/logger.service";
import { TokenService } from "../common/token.service";
import { User } from "../entity/user";

@Injectable()
export class UserService {
  constructor(
    @Inject(TokenService) private readonly tokenService: TokenService,
    @Inject(DbService) private readonly dbService: DbService,
    @Inject(PinoLoggerService) private readonly logger: PinoLoggerService,
  ) {}

  /**
   * register a new user
   *
   * @param username string
   * @param password string
   * @returns token
   */
  public async register(username: string, password: string): Promise<string> {
    if (await this.dbService.users.findOne(username)) {
      throw new DuplicatedUsernameException();
    }
    const user = new User(username);
    await user.setPassword(password);
    await this.dbService.users.save(user);
    return this.tokenService.sign(user);
  }

  /**
   * login
   * if the password hash is in old format, the hash will be upgraded
   *
   * @param username string
   * @param password string
   * @returns token
   */
  public async login(username: string, password: string): Promise<string> {
    const user = await this.dbService.users.findOne(username);
    if (!user) {
      throw new UserNotExistException();
    }
    if (!(await user.checkPassword(password))) {
      throw new PasswordMismatchException();
    }
    return this.tokenService.sign(user);
  }

  /**
   * acquire token information
   *
   * @param token string
   * @return User
   */
  public async getTokenInfo(token: string): Promise<User> {
    const username = this.tokenService.verify(token);
    const user = await this.dbService.users.findOne(username);
    if (!user) {
      throw new InvalidTokenException();
    }
    return user;
  }
}
