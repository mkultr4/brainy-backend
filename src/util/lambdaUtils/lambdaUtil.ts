import { APIGatewayEvent, Callback } from 'aws-lambda';
import { User } from '../../models/auth-permissions/User';
import { BadRequestError, CustomServiceException } from '../errors/Error';
import ResponseBuilder from '../builders/ResponseBuilder';
import logger from '../../logger';

/**
 * Get auth user
 * @param event
 */
export function getWorkspaceAccesAuth(event: APIGatewayEvent) {
  const { requestContext } = event;
  const authorizer = (requestContext.authorizer) ? requestContext.authorizer : null;

  // tslint:disable-next-line:triple-equals
  if (authorizer != undefined || authorizer != null) {
    return JSON.parse(authorizer.payload as string);
  }
}

export function getCoreAccessAuth(event: APIGatewayEvent) {
  const { requestContext } = event;
  const authorizer = (requestContext.authorizer) ? requestContext.authorizer : null;

  let payload;
  // tslint:disable-next-line:triple-equals
  if (authorizer != undefined || authorizer != null) {
    payload = JSON.parse(authorizer.payload as string);
  }

  let valid = false;
  if (payload !== undefined || payload != null) {
    valid = true;
  }

  return (valid) ? payload : undefined;
}

/**
 * Get auth user
 * @param event
 */
export function getUserAuthorizer(event: APIGatewayEvent) {
  const { requestContext } = event;
  const authorizer = (requestContext.authorizer) ? requestContext.authorizer : null;

  // tslint:disable-next-line:triple-equals
  if (authorizer != undefined || authorizer !== null) {
    return JSON.parse(authorizer.payload as string).user;
  }
}

export function isValidAuthorizer(user: User) {
  let valid = false;
  if (user !== undefined || user != null) {
    valid = true;
  }
  return valid;
}

export function printEvent(print: boolean, event: APIGatewayEvent, title?: String, ...args: any[]) {
  if (title) {
    logger.debug(title);
  }
  if (args.length > 0) {
    args.forEach(item => logger.debug(item));
  }
  if (print) {
    logger.debug(event);
    logger.debug(event.requestContext);
    logger.debug(event.requestContext.authorizer);
  }
}


export function ResponseException(e: Error | CustomServiceException, cb: Callback) {
  if (
    e instanceof CustomServiceException ||
    e instanceof BadRequestError
  ) {
    return ResponseBuilder.badRequest(e, cb);
  } else {
    return ResponseBuilder.internalServerError(e, cb);
  }
}
