import { Body, Controller, Put, Res } from "@nestjs/common";
import { Response } from "express";
import { Anonymous } from "~/common/authentication";
import { UserService } from "~/service/user";

@Controller("/session")
@Anonymous()
export class SessionController {
  constructor(private userService: UserService) {}

  @Put()
  public async login_post(
    @Body("username") username: string,
    @Body("password") password: string,
    @Res() res: Response
  ) {
    const token = await this.userService.login(username, password);
    res.cookie("token", token, { maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.redirect("/dashboard");
  }
}
