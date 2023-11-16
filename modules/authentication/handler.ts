import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import * as _ from 'lodash';
import IAMPolicyAuth from './libs/policies/IAMPolicyAuth';
import { ResponseException } from '../../src/util/lambdaUtils/lambdaUtil';
import ResponseBuilder from '../../src/util/builders/ResponseBuilder';
import { User } from '../../src/models/auth-permissions/User';
import AuthService from '../../src/services/AuthService';
// import InvitationService from '../../src/services/invitations/InvitationService';
import config from '../../src/conf';
import logger from '../../src/logger';

const userService: AuthService = new AuthService();

/**
 * POST /signin
 */
export const signIn: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  logger.info('signIn Method handler v1.0.0 env: ' + process.env.NODE_ENV);
  const body = event.body ? JSON.parse(event.body) : {};
  console.log('body', body);


    const { profile } = body;
    logger.debug('Authenticating user info: ', profile);

    // Authenticate user
    userService.authenticate(profile).then((user: User) => {
      logger.debug('user found: ', user);
      logger.debug(user);
      logger.debug(_.isEmpty(user));
      if (user == null || _.isEmpty(user)) { throw new Error('Usuario no encontrado'); }

        const token = AuthService.createToken(user);

      logger.debug('token: ', token);
      ResponseBuilder.ok({ token }, cb);
    }).catch((err: Error) => {
      logger.error(JSON.stringify(err));
      return ResponseException(err, cb);
    });
};

/**
 * POST /singup account
 */
export const signUp: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const body = event.body ? event.body : '';
  const json = JSON.parse(body);

  try {
    logger.debug('JSON: ', JSON.stringify(json));
    const { profile } = json;

    logger.debug('Registrando usuario');
    // validating User object not found in database
    userService.register(profile).then((user: User) => {
      // user was registered in db and serve to de endpoint
      logger.debug('user register: ', user);
      const urlToConfirm = config.APP_DOMAIN + '/#/public/confirm-email/' + AuthService.createRegistrationToken(user);

      userService.sendEmailValidateAccount(
        profile.email,
        urlToConfirm
      );

      return ResponseBuilder.ok({ success: 'User was created successfully'}, cb);
    }).catch((err: Error) => {
      logger.error(JSON.stringify(err));
      return ResponseException(err, cb);
    });
  } catch (e) {
    logger.debug('Error singUp.:', e);
    return ResponseException(e, cb);
  }
};


/**
 * POST /confirm account
 */
export const confirm: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const body = event.body ? JSON.parse(event.body) : {};
  console.log('body', body);
  if (!body.token) {
    return ResponseBuilder.badRequest('token no valido', cb);
  }

  userService.confirm(body.token).then(user => {
    // user was registered in db and serve to de endpoint
    logger.debug('user confirmed: ', user);
    logger.debug('sendind activation email thanks');
    userService.sendEmailActivatedAccount(
      user.email as string,
      config.APP_DOMAIN + '/#/public/login/'
    );
    return ResponseBuilder.ok('User was confirmed successfully', cb);
  }).catch(err => {
    logger.error('error confirmation: ', err);
    return ResponseException(err, cb);
  });
};


/**
 * In order to avoid User is not authorized to access this resource
 * https://forums.aws.amazon.com/thread.jspa?threadID=225934&tstart=0
 * https://medium.com/asked-io/serverless-custom-authorizer-issues-on-aws-57a40176f63f
 * @param event any
 * @param context  Context
 * @param cb Callback
 */
export const authorizer: Handler = (event: any, context: Context, cb: Callback) => {
  logger.debug('event : ', event);
  const token = event.authorizationToken;

  // Verify JWT
  const decoded: any = AuthService.verify(token);
  logger.debug('Token User: ', decoded.user);
  // Checks if the user's scopes allow her to call the current function
  // const isAllowed = authorizeUser(user.scopes, event.methodArn);
  // const effect = true ? 'Allow' : 'Deny';
  const user = decoded.user;
  userService.userInDatabase(user).then(exits => {
    logger.debug('user exits: ', exits);
    const userId = decoded.user.email;
    const authorizerContext = { payload: JSON.stringify(decoded) };
    // Return an IAM policy document for the current endpoint
    // event.methodArn.split('/').slice(0, 2).join('/') + '/*'
    const arnDynamic = event.methodArn.split('/').slice(0, 2).join('/') + '/*';
    logger.debug('event.methodArn: ' + event.methodArn, 'arnDynamic: ' + arnDynamic);
    const policyDocument: object = new IAMPolicyAuth(userId, 'Allow', arnDynamic, authorizerContext).get();

    logger.debug('Token policyDocument: ', policyDocument);
    cb(null, policyDocument);
  }).catch(e => {
    logger.error('Error authorizer.:', e);
    cb(e); // Return a 401 Unauthorized response
  });
};

export const forgottenPassword: Handler = (event: any, context: Context, cb: Callback) => {
  try {
    const body = event.body ? JSON.parse(event.body) : {};

    if (!body.email) {
      return ResponseBuilder.badRequest('token no valido', cb);
    }
    userService.forgottenPassword(body.email).then(() => {
      return ResponseBuilder.ok({message: 'email send forgot password'}, cb);
    }).catch((err) => {
      logger.debug('error: ', err);
      return ResponseException(err, cb);
    });
  } catch (e) {
    logger.error('Error authorizer.:', e);
    cb(e);
  }
};

export const changePassword: Handler = (event: any, context: Context, cb: Callback) => {
  try {
    const body = event.body ? JSON.parse(event.body) : {};

    if (!body.token && body.profile) {
      return ResponseBuilder.badRequest('profile no valido', cb);
    }

    const decoded: any = AuthService.verify(body.token);
    logger.debug('Token User: ', decoded.user);

    userService.changePassword(decoded.user, body.profile).then((response) => {
      logger.debug('response: ', response);
      return ResponseBuilder.ok({ message: 'updated password' }, cb);
    }).catch((err) => {
      logger.debug('error: ', err);
      return ResponseException(err, cb);
    });
  } catch (err) {
    return ResponseException(err, cb);
  }
};
