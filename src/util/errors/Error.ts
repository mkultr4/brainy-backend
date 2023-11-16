import { HttpStatusCode } from '../http/HttpStatusCode';
export type ServerErrorCode = 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 | 599;
export type ClienErrorCode = 400 | 401 | 402 | 403 | 404 | 404 | 406 | 407 | 408 | 409
  | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 426
  | 428 | 429 | 431 | 444 | 499 | 451 | 499;
export type SuccessCode = 200 | 201 | 202 | 203 | 204 | 202 | 206 | 207 | 208 | 226;
export class ErrorResult extends Error {
    public statusCode: number;
    __proto__: Error;
    constructor(message?: string) {
        super(message);
        this.stack = (new Error()).stack;
        (<any>Object).setPrototypeOf(this, ErrorResult.prototype);
    }
}

//                    //
//  4×× Client Error  //
//                    //
export class ClientErrorResult extends ErrorResult {
  constructor(code: ClienErrorCode, message?: string) {
    super(message);
    this.statusCode = code;
  }
}
export class BadRequestResult extends ClientErrorResult {
    constructor(message?: string) {
      super(<ClienErrorCode> HttpStatusCode.BadRequest, message);
    }
}

export class ForbiddenResult extends ClientErrorResult {
    constructor(message?: string) {
      super(<ClienErrorCode>HttpStatusCode.Forbidden, message);
    }
}
export class NotFoundResult extends ClientErrorResult {
  constructor(message?: string) {
    super(<ClienErrorCode>HttpStatusCode.NotFound, message);
  }
}

export class UnauthorizedResult extends ClientErrorResult {
  constructor(message?: string) {
    super(<ClienErrorCode>HttpStatusCode.Unauthorized, message);
  }
}


//                    //
//  5×× Server Error  //
//                    //
export class ServerErrorResult extends ErrorResult {
  constructor(code: ServerErrorCode,  message?: string) {
    super(message);
    this.statusCode = code;
  }
}

export class InternalServerErrorResult extends ServerErrorResult {
    constructor(message?: string) {
      super(<ServerErrorCode> HttpStatusCode.InternalServerError, message);
    }
}

export class CustomServiceException extends Error {
  public keyCode: String;
  public keyMessage: String;
  public name: any;
  public stack: any;

  constructor(message: string, keyCode?: String, keyMessage?: String, ) {
    super(message);
    this.name = 'CustomServiceException';
    if (keyCode) {
      this.keyCode = keyCode;
    }

    if (keyMessage) {
      this.keyMessage = keyMessage;
    }
    Error.captureStackTrace(this, this.constructor);
    (<any>Object).setPrototypeOf(this, CustomServiceException.prototype);
  }
}

export class UserInDatabaseException extends CustomServiceException {

  constructor(message: string) {
    super(message);
    this.name = 'UserInDatabaseException';
    this.keyCode = 'registered-email';
    this.keyMessage = 'El email ya está registrado';
    (<any>Object).setPrototypeOf(this, new.target.prototype);
  }
}


export class EmailException extends CustomServiceException {

  constructor(message: string, keyCode: String = 'email-error', keyMessage: String = 'El email no valido') {
    super(message);
    this.name = 'EmailException';
    this.keyCode = keyCode;
    this.keyMessage = keyMessage;
    (<any>Object).setPrototypeOf(this, new.target.prototype);
  }
}

export class PasswordException extends CustomServiceException {

  constructor(message: string, keyCode: String = 'password-error', keyMessage: String = 'El password no valido') {
    super(message);
    this.name = 'PasswordException';
    this.keyCode = keyCode;
    this.keyMessage = keyMessage;
    (<any>Object).setPrototypeOf(this, new.target.prototype);
  }
}

export class SocialException extends CustomServiceException {

  constructor(message: string, keyCode: String = 'password-error', keyMessage: String = 'El password no valido') {
    super(message);
    this.name = 'PasswordException';
    this.keyCode = keyCode;
    this.keyMessage = keyMessage;
    (<any>Object).setPrototypeOf(this, new.target.prototype);
  }
}

export class WorkspaceAccessPermissionException extends CustomServiceException {

  constructor(
    message: string,
    keyCode: String = 'workspace-access-permission-error',
    keyMessage: String = 'Workspace access permission error'
  ) {
    super(message);
    this.name = 'WorkspaceAccessPermissionException';
    this.keyCode = keyCode;
    this.keyMessage = keyMessage;
    (<any>Object).setPrototypeOf(this, new.target.prototype);
  }
}


export class WorkspaceAccessException extends CustomServiceException {

  constructor(
    message: string,
    keyCode: String = 'workspace-access-error',
    keyMessage: String = 'Workspace access error'
  ) {
    super(message);
    this.name = 'WorkspaceAccessException';
    this.keyCode = keyCode;
    this.keyMessage = keyMessage;
    (<any>Object).setPrototypeOf(this, new.target.prototype);
  }
}

export class CoreAccessPermissionException extends CustomServiceException {

  constructor(
    message: string,
    keyCode: String = 'core-access-error',
    keyMessage: String = 'core access error'
  ) {
    super(message);
    this.name = 'CoreAccessPermissionException';
    this.keyCode = keyCode;
    this.keyMessage = keyMessage;
    (<any>Object).setPrototypeOf(this, new.target.prototype);
  }
}





// Exceptions
export class MemberAccessException extends CustomServiceException {
  constructor(message: string) {
    super(message);
  }
}

export class BadRequestError extends CustomServiceException {
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
    this.keyCode = 'bad-request';
    this.keyMessage = 'Bad Request error';
  }
}
export class UserNotValidException extends CustomServiceException {
  constructor(message: string) {
    super(message);
    this.name = 'UserNotValidException';
    this.keyCode = 'user-not-valid';
    this.keyMessage = 'Usuario no valido';
  }
}

export class UserNotFoundException extends CustomServiceException {
  constructor(message: string) {
    super(message);
    this.name = 'UserNotFoundException';
    this.keyCode = 'email-not-found';
    this.keyMessage = 'Usuario no encontrado en base de datos';
    (<any>Object).setPrototypeOf(this, new.target.prototype);
  }
}

export class RegisterException extends CustomServiceException {

  constructor(message: string, keyCode: String = 'register-error', keyMessage: String = 'Error en el registro') {
    super(message);
    this.name = 'RegisterException';
    this.keyCode = keyCode;
    this.keyMessage = keyMessage;
    (<any>Object).setPrototypeOf(this, new.target.prototype);
  }
}

export class PermissionException extends CustomServiceException {

  constructor(message: string, keyCode: String = 'permission-error', keyMessage: String = 'Error en permisos') {
    super(message);
    this.name = 'PermissionException';
    this.keyCode = keyCode;
    this.keyMessage = keyMessage;
    (<any>Object).setPrototypeOf(this, new.target.prototype);
  }
}


export class InvitationException extends CustomServiceException {

  constructor(message: string, keyCode: String = 'invitation-error', keyMessage: String = 'Error en invitacion') {
    super(message);
    this.name = 'InvitationException';
    this.keyCode = keyCode;
    this.keyMessage = keyMessage;
    (<any>Object).setPrototypeOf(this, new.target.prototype);
  }
}


export class JsonWebTokenException extends CustomServiceException {
  constructor(error: any) {
    super('Error decodificando token');
    this.name = 'JsonWebTokenException';
    this.keyCode = 'token-error';
    this.keyMessage = error.message;
    (<any>Object).setPrototypeOf(this, new.target.prototype);
  }
}

export class ExpirationTokenException extends CustomServiceException {
  constructor(error: any) {
    super('Token expirado at ' + error.expiredAt);
    this.name = 'ExpirationTokenException';
    this.keyCode = 'token-expired';
    this.keyMessage = error.message;
    (<any>Object).setPrototypeOf(this, new.target.prototype);
  }
}




