import { ApiCallback, ApiResponse } from '../../interfaces/Api';
import {
  BadRequestResult, ErrorResult, ForbiddenResult, InternalServerErrorResult, NotFoundResult,
  ServerErrorCode, ClienErrorCode, SuccessCode, ServerErrorResult, CustomServiceException
} from '../errors/Error';
import { HttpStatusCode } from '../http/HttpStatusCode';

/**
 * Contains helper methods to generate a HTTP response.
 */
export default class ResponseBuilder {

  public static error(error: ErrorResult, callback: ApiCallback) {
    ResponseBuilder._returnAs<ErrorResult>(error, error.statusCode, callback);
  }

  //                //
  //   2×× Success  //
  //                //
  public static success<T>(code: SuccessCode, result: T, cb: ApiCallback): void {
    ResponseBuilder._returnAs<T>(result, code, cb);
  }

  public static ok<T>(result: T, cb: ApiCallback): void {
    ResponseBuilder._returnAs<T>(result, HttpStatusCode.Ok, cb);
  }

  public static created<T>(result: T, cb: ApiCallback): void {
    ResponseBuilder._returnAs<T>(result, HttpStatusCode.Created, cb);
  }

  //                    //
  //  4×× Client Error  //
  //                    //
  public static clientError(code: ClienErrorCode, error: Error, callback: ApiCallback): void {
    ResponseBuilder._returnAs<InternalServerErrorResult>(
      new InternalServerErrorResult(error.message), code, callback
    );
  }

  public static badRequest(message: string | CustomServiceException, callback: ApiCallback): void {
    if (!(message instanceof CustomServiceException)) {
      console.log('bad string');
      ResponseBuilder._returnAs<BadRequestResult>(new BadRequestResult(message as string), HttpStatusCode.BadRequest, callback);
    } else {
      ResponseBuilder._returnAs<CustomServiceException>(message as CustomServiceException, HttpStatusCode.BadRequest, callback);
    }
  }

  public static accessDenied(cb: ApiCallback): void {
    ResponseBuilder._returnAs<NotFoundResult>(new ForbiddenResult('Access Denied'), HttpStatusCode.Forbidden, cb);
  }

  public static forbidden(message: string, callback: ApiCallback): void {
    ResponseBuilder._returnAs<ForbiddenResult>(new ForbiddenResult(message), HttpStatusCode.Forbidden, callback);
  }

  public static notFound(message: string, callback: ApiCallback): void {
    ResponseBuilder._returnAs<NotFoundResult>(new NotFoundResult(message), HttpStatusCode.NotFound, callback);
  }

  //                    //
  //  5×× Server Error  //
  //                    //
  public static serverError(code: ServerErrorCode, error: Error, callback: ApiCallback): void {
    ResponseBuilder._returnAs<InternalServerErrorResult>(
      new InternalServerErrorResult(error.message), code, callback
    );
  }

  public static internalServerError(error: Error, callback: ApiCallback): void {
    ResponseBuilder._returnAs<InternalServerErrorResult>(
      new InternalServerErrorResult(error.message), HttpStatusCode.InternalServerError, callback
    );
  }

  private static _returnAs<T>(result: T, statusCode: number, cb: ApiCallback): void {
    if (result instanceof CustomServiceException) {
      const body = {
        statusCode: statusCode,
        error: {
          message: result.message,
          name: result.name,
          // stack: result.stack,
          keyCode: result.keyCode,
          keyMessage: result.keyMessage
        }
      };

      const error = ResponseBuilder.builder(body, statusCode);
      cb(null, error);
    }

    if (result instanceof ErrorResult) {
      const body = {
        message: result.message,
        statusCode: result.statusCode
      };

      if (result instanceof ServerErrorResult) {
        console.log('internal error server:');
        cb(result);
      } else {
        const error = ResponseBuilder.builder(body, statusCode);
        console.log('Error tu return to lambda proxy:', error);
        cb(null, error);
      }
    } else {
      console.log('response result:', result);
      const response: ApiResponse = ResponseBuilder.builder(result, statusCode);
      console.log('response tu return to lambda proxy:', response);
      cb(null, response);
    }
  }

  private static builder(body: any, statusCode: number) {
    return {
      body: JSON.stringify(body),
      headers: {
        'Access-Control-Allow-Origin': '*'  // This is required to make CORS work with AWS API Gateway Proxy Integration.
      },
      isBase64Encoded: false,
      statusCode: statusCode
    };
  }

}
