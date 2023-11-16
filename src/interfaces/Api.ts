import { APIGatewayEvent, Context, ProxyCallback, ProxyResult, Handler, Callback } from 'aws-lambda';
import { ErrorResult } from '../util/errors/Error';
/**
 * Type aliases to hide the 'aws-lambda' package and have consistent, short naming.
 * Use if you want
 */
export type Handler = (event: any, context: Context, callback?: Callback) => void;
export type ApiHandler = (event: APIGatewayEvent, context: Context, callback: ApiCallback) => void;
export type ApiContext = Context;
export type ApiEvent = APIGatewayEvent;
export type ApiCallback = ProxyCallback;
export type ApiResponse = ProxyResult;

export interface ErrorResponseBody {
    error: ErrorResult;
  }
