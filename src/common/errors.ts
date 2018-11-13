import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from "@nestjs/common";
import { Response } from "express";

export class Exception extends HttpException {
  constructor(message: string, status = 500) {
    super(message, status);
  }
}
export class UserNotExistException extends Exception {
  constructor() {
    super("user not exists", HttpStatus.FORBIDDEN);
  }
}
export class PasswordMismatchException extends Exception {
  constructor() {
    super("password mismatch", HttpStatus.FORBIDDEN);
  }
}
export class InvalidTokenException extends Exception {
  constructor() {
    super("invalid token", HttpStatus.FORBIDDEN);
  }
}
export class DuplicatedUsernameException extends Exception {
  constructor() {
    super("duplicated email", HttpStatus.CONFLICT);
  }
}
export class ProfileTypeNotExistException extends Exception {
  constructor() {
    super("profile type not exists", HttpStatus.BAD_REQUEST);
  }
}

@Catch(HttpException)
export class GeneralExceptionFilter implements ExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost) {
    (host.switchToHttp().getResponse() as Response).json({
      message: exception.message,
      status: exception.getStatus()
    });
  }
}
@Catch(Exception)
export class AppExceptionFilter implements ExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost) {
    (host.switchToHttp().getResponse() as Response).json({
      message: exception.message,
      status: exception.getStatus()
    });
  }
}
