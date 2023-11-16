import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import ResponseBuilder from '../../../src/util/builders/ResponseBuilder';
import logger from '../../../src/logger';
import WorkspaceAccessService from '../../../src/services/workspaces/access/WorkspaceAccessService';
import IAMPolicyAuth from '../../authentication/libs/policies/IAMPolicyAuth';
import AuthService from '../../../src/services/AuthService';
import {
  printEvent, getUserAuthorizer, isValidAuthorizer, ResponseException, getWorkspaceAccesAuth
} from '../../../src/util/lambdaUtils/lambdaUtil';

const wsas: WorkspaceAccessService = new WorkspaceAccessService();

export const get: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const params = (event.pathParameters) ? event.pathParameters : '';

  if (!params) {
    return ResponseBuilder.badRequest('parametros no validos', cb);
  }

  if (!params.id) {
    return ResponseBuilder.badRequest('Please specify the ID!', cb);
  }

  logger.info('Current get will be ' + params.id);
  wsas.getComplete(params.id).then((wsa) => {
    logger.info(`Object: ${wsa}`);
    return ResponseBuilder.ok(wsa, cb);
  }).catch((err) => {
    logger.error(err);
    return ResponseBuilder.internalServerError(err, cb);
  });
};


export const getByUser: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  printEvent(true, <any> event, 'Verify if could generate session');
  const user = getUserAuthorizer(<any>event);
  logger.debug('getSession user', user);
  if (!isValidAuthorizer(user)) {
    return ResponseBuilder.accessDenied(cb);
  }

  wsas.listByUser(user).then(list => {
      logger.info(`WSA list: ${list}`);
      return ResponseBuilder.ok(list, cb);
  }).catch((err) => {
    logger.error(err);
    return ResponseException(err, cb);
  });
};

export const changeStatus: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  printEvent(true, <any> event, 'Verify if could generate session');
  const wsa = getWorkspaceAccesAuth(<any>event);
  logger.debug('getSession wsa', wsa);
  if (!isValidAuthorizer(wsa)) {
    return ResponseBuilder.accessDenied(cb);
  }

  const body: any = (event.body) ? JSON.parse(event.body) : {};
  console.log(body);

  if (!body.status || (body.status !== 'active' && body.status !== 'suspended')) {
    return ResponseBuilder.badRequest('body status no valido', cb);
  }

  const params = (event.pathParameters) ? event.pathParameters : '';
  if (!params) {
    return ResponseBuilder.badRequest('parametros no validos', cb);
  }

  logger.debug('params id', params.id);
  if (!params.id) {
    return ResponseBuilder.badRequest('Please specify the ID!', cb);
  }

  wsas.changeStatus(params.id, wsa.workspaceAccess, body).then(list => {
      logger.info(`WSA list: ${list}`);
      return ResponseBuilder.ok(list, cb);
  }).catch((err) => {
    logger.error(err);
    return ResponseException(err, cb);
  });
};

export const removeAccess: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  printEvent(true, <any> event, 'Verify if could generate session');
  const wsa = getWorkspaceAccesAuth(<any>event);
  logger.debug('getSession wsa', wsa);
  if (!isValidAuthorizer(wsa)) {
    return ResponseBuilder.accessDenied(cb);
  }

  const params = (event.pathParameters) ? event.pathParameters : '';
  if (!params) {
    return ResponseBuilder.badRequest('parametros no validos', cb);
  }

  logger.debug('params id', params.id);
  if (!params.id) {
    return ResponseBuilder.badRequest('Please specify the ID!', cb);
  }

  wsas.deleteWsa(params.id, wsa.workspaceAccess).then(object => {
    logger.info(`WSA deleted: ${object}`);
    return ResponseBuilder.ok(object, cb);
  }).catch((err) => {
    logger.error(err);
    return ResponseException(err, cb);
  });
};

export const getByWorkspace: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  printEvent(true, <any> event, 'Verify if could generate session');
  const wsa = getWorkspaceAccesAuth(<any>event);
  logger.debug('getSession wsa', wsa);
  if (!isValidAuthorizer(wsa)) {
    return ResponseBuilder.accessDenied(cb);
  }

  wsas.listByWorkspace(wsa.workspaceAccess).then(list => {
      logger.info(`WSA list: ${list}`);
      return ResponseBuilder.ok(list, cb);
  }).catch((err) => {
    logger.error(err);
    return ResponseException(err, cb);
  });
};

export const getSession: Handler = (event: APIGatewayEvent, context: Context, callback: Callback) => {
  printEvent(true, <any> event, 'Verify if could generate session');

  const user = getUserAuthorizer(<any>event);
  logger.info('getSession from user =>', user);
  if (!isValidAuthorizer(user)) {
    return ResponseBuilder.accessDenied(callback);
  }

  const params = (event.pathParameters) ? event.pathParameters : '';
  if (!params) {
    return ResponseBuilder.badRequest('parametros no validos', callback);
  }
  logger.debug('params id', params.id);
  if (!params.id) {
    return ResponseBuilder.badRequest('Please specify the ID!', callback);
  }

  wsas.getComplete(params.id).then(
    wsa => {
      logger.info(`Object: ${wsa}`);
      const token = AuthService.createWSToken(wsa);
      const authorizerContext = { tokenwsa: token };
      logger.info('authorizerContext: ', authorizerContext);
      return ResponseBuilder.ok(authorizerContext, callback);
  }).catch((err) => {
    logger.error(err);
    return ResponseBuilder.internalServerError(err, callback);
  });
};

/**
 *
 * In order to avoid User is not authorized to access this resource
 * https://forums.aws.amazon.com/thread.jspa?threadID=225934&tstart=0
 * https://medium.com/asked-io/serverless-custom-authorizer-issues-on-aws-57a40176f63f
 * @param event any
 * @param context  Context
 * @param cb Callback
 */
export const authorizerWS: Handler = (event: any, context: Context, cb: Callback) => {
  logger.debug('event : ', event);
  const token = event.authorizationToken;
  let effect = 'Deny';
  const arnDynamic = event.methodArn.split('/').slice(0, 2).join('/') + '/*';
  logger.debug('event.methodArn: ' + event.methodArn, 'arnDynamic: ' + arnDynamic);
  try {
    // Verify JWT
    const decoded: any = AuthService.verify(token);
    logger.debug('Token workspaceAccess: ', decoded.workspaceAccess);
    // Checks if the user's scopes allow her to call the current function
    // const isAllowed = authorizeUser(user.scopes, event.methodArn);
    // const effect = true ? 'Allow' : 'Deny';

    const id: string = decoded.workspaceAccess.uid;
    wsas.get(id)
      .then(
        workspaceAcces => {
          logger.debug('workspaceAcces exits: ', workspaceAcces);
          effect = 'Allow';
          const userId = decoded.workspaceAccess.user.email;
          const authorizerContext = { payload: JSON.stringify(decoded) };
          // Return an IAM policy document for the current endpoint
          // event.methodArn.split('/').slice(0, 2).join('/') + '/*'

          const policyDocument: object = new IAMPolicyAuth(userId, effect, arnDynamic, authorizerContext).get();

          logger.debug('Token policyDocument: ', policyDocument);
          cb(null, policyDocument);
      });
  } catch (e) {
    logger.error('Error authorizer.:', e);
    cb(e); // Return a 401 Unauthorized response
  }
};
