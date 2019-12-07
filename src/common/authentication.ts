/* eslint-disable max-classes-per-file */

import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  Inject,
  Injectable,
  NestMiddleware,
  SetMetadata,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserService } from "../service/user";

const AUTH_TYPE_ANONYMOUS = "anonymous";
const AUTH_TYPE_AUTHENTICATED = "authenticated";

export const Anonymous = (): ReturnType<typeof SetMetadata> =>
  SetMetadata("auth:type", AUTH_TYPE_ANONYMOUS);

export const Authenticated = (): ReturnType<typeof SetMetadata> =>
  SetMetadata("auth:type", AUTH_TYPE_AUTHENTICATED);

export const Permissions = (
  ...permissions: string[]
): ReturnType<typeof SetMetadata> => SetMetadata("auth:scope", permissions);

export class AuthMiddleware implements NestMiddleware {
  // eslint-disable-next-line no-useless-constructor
  constructor(@Inject(UserService) private userService: UserService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  use(req: any, res: any, next: Function): void {
    if (req && req.cookies && req.cookies.token) {
      this.userService.getTokenInfo(req.cookies.token).then(u => {
        req.user = u;
        if (next) {
          next();
        }
      });
    } else if (next) {
      next();
    }
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    // decorators on methods are prior to those on class
    const authType =
      this.reflector.get<string>("auth:type", context.getHandler()) ||
      this.reflector.get<string>("auth:type", context.getClass());
    if (!authType) {
      return true;
    }
    const req = context.switchToHttp().getRequest();

    const { user } = req;
    if (!user && authType === AUTH_TYPE_AUTHENTICATED) {
      throw new UnauthorizedException();
    }
    return true; // TODO: permission check
  }
}

export const ReqUser = createParamDecorator((data, req) => {
  return req.user;
});
