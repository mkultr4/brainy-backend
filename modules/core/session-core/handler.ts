import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import ResponseBuilder from '../../../src/util/builders/ResponseBuilder';
import logger from '../../../src/logger';
import SessionCoreService from '../../../src/services/core/access/SessionCoreService';
import IAMPolicyAuth from '../../authentication/libs/policies/IAMPolicyAuth';
import AuthService from '../../../src/services/AuthService';
import { printEvent, isValidAuthorizer } from '../../../src/util/lambdaUtils/lambdaUtil';
import { UserNotValidException } from '../../../src/util/errors/Error';

const css: SessionCoreService = new SessionCoreService();

export const getSession: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
  printEvent(true, <any> event, 'Verify if could generate session');

  const { requestContext } = <any> event;
  const authorizer = (requestContext.authorizer) ? requestContext.authorizer : null;
  logger.debug('payload: ', authorizer.payload);
  const payload = authorizer.payload;

  logger.debug('workspaceAcces: ', payload);
  if (!isValidAuthorizer(payload)) {
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

  await css.getAs(params.id).then(
    wsa => {
      logger.info(`Object: ${wsa}`);
      const userCore = wsa.user;
      const userWorkspace = JSON.parse(payload).workspaceAccess.user;
      if (userCore.uid !== userWorkspace.uid) {
        throw new UserNotValidException('User id not valid. User workspaceAccess token isn\'t equals to user coreAccess');
      }

      const token = AuthService.createCoreToken(wsa);
      const authorizerContext = { tokencore: token };
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
export const authorizerCore: Handler = async (event: any, context: Context, cb: Callback) => {
  logger.debug('event : ', event);
  const token = event.authorizationToken;

  try {
    // Verify JWT
    const decoded: any = AuthService.verify(token);
    logger.debug('Token CoreAccess: ', decoded.workspaceAccess);
    // Checks if the user's scopes allow her to call the current function
    // const isAllowed = authorizeUser(user.scopes, event.methodArn);
    // const effect = true ? 'Allow' : 'Deny';
    let effect = 'Deny';
    const id: string = decoded.coreAccess.uid;
    await css.getAs(id)
      .then(
        coreAccess => {
          logger.debug('workspaceAcces exits: ', coreAccess);
          effect = 'Allow';
          const userId = decoded.coreAccess.user.email;
          const authorizerContext = { payload: JSON.stringify(decoded) };
          // Return an IAM policy document for the current endpoint
          // event.methodArn.split('/').slice(0, 2).join('/') + '/*'
          const arnDynamic = event.methodArn.split('/').slice(0, 2).join('/') + '/*';
          logger.debug('event.methodArn: ' + event.methodArn, 'arnDynamic: ' + arnDynamic);
          const policyDocument: object = new IAMPolicyAuth(userId, effect, arnDynamic, authorizerContext).get();

          logger.debug('Token policyDocument: ', policyDocument);
          cb(null, policyDocument);
      });
  } catch (e) {
    logger.error('Error authorizer.:', e);
    cb(e); // Return a 401 Unauthorized response
  }
};
