import { Body, Controller, Post } from "@nestjs/common";
import { Anonymous } from "~/common/authentication";
import { UserService } from "~/service/user";

@Controller("/users")
@Anonymous()
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  public async signup_post(
    @Body("username") username: string,
    @Body("password") password: string,
  ) {
    const token = await this.userService.register(username, password);
    return token;
  }
}
