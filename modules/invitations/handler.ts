import { Callback, Context, Handler, APIGatewayEvent } from 'aws-lambda';
import ResponseBuilder from '../../src/util/builders/ResponseBuilder';
import logger from '../../src/logger';
import InvitationService from '../../src/services/invitations/InvitationService';
import { Invitation } from '../../src/models/invitations/Invitation';
import { printEvent, isValidAuthorizer, getWorkspaceAccesAuth, ResponseException } from '../../src/util/lambdaUtils/lambdaUtil';
import AuthService from '../../src/services/AuthService';
import config from '../../src/conf';

const invitationService: InvitationService = new InvitationService();
const userService: AuthService = new AuthService();

/**
 * Create a invitation and send email
 * @param event
 * @param context
 * @param cb
 */
export const create: Handler = async (event: APIGatewayEvent, context: Context, cb: Callback) => {
  printEvent(true, <any> event, 'Batch Create invitation: ');

  const wsa = getWorkspaceAccesAuth(<any> event);
  console.log('wsa: ', wsa);
  if (!isValidAuthorizer(wsa)) {
    return ResponseBuilder.accessDenied(cb);
  }

  const body: any = (event.body) ? JSON.parse(event.body) : {};

  try {
    logger.debug('Json Recibido: ', body);
    const invitation: any = await invitationService.create(<Invitation> body, wsa.user);
    return ResponseBuilder.ok(invitation, cb);
  } catch (err) {
    logger.error(err);
    return ResponseException(err, cb);
  }
};

/**
 * Batch create array of invitations
 * @param event from api gateway
 * @param context lambda context properties
 * @param cb callback function
 */
export const batchCreate: Handler =  async (event: APIGatewayEvent, context: Context, cb: Callback) => {
  printEvent(true, <any> event, 'Batch Create invitation: ');

  const wsa = getWorkspaceAccesAuth(<any> event);
  console.log('wsa: ', wsa);
  if (!isValidAuthorizer(wsa)) {
    return ResponseBuilder.accessDenied(cb);
  }

  const body: any = (event.body) ? JSON.parse(event.body) : [];

  try {
    const invitations = (body as Invitation[]);
    const invitationsResult = await invitationService.createBatch(invitations, wsa.workspaceAccess.user);
    return ResponseBuilder.ok({ batchResult: invitationsResult.saved, unprocess: invitationsResult.errors }, cb);
  } catch (err) {
    logger.error(err);
    return ResponseException(err, cb);
  }
};

/**
 * Batch create array of invitations
 * @param event from api gateway
 * @param context lambda context properties
 * @param cb callback function
 */
export const registerInvitation: Handler =  async (event: APIGatewayEvent, context: Context, cb: Callback) => {
  printEvent(true, <any> event, 'registerInvitation Create invitation: ');

  const params = (event.pathParameters) ? event.pathParameters : '';

  if (!params) {
    return ResponseBuilder.badRequest('parametros no validos', cb);
  }

  if (!params.id) {
    return ResponseBuilder.badRequest('Please specify invitation ID!', cb);
  }

  const body = event.body ? event.body : '';
  const json = JSON.parse(body);

  try {
    logger.debug('JSON: ', JSON.stringify(json));
    const { profile } = json;
    let currentInvitation = await invitationService.getById(params.id);

    if (currentInvitation === undefined) {
      return ResponseBuilder.badRequest('Invitacion no valida', cb);
    }

    if (!invitationService.validRegisterInvitation(currentInvitation, profile)) {
      return ResponseBuilder.badRequest('Usuario no es igual al de la invitacion', cb);
    }

    logger.debug('Registrando usuario');
    // validating User object not found in database
    const user = await userService.register(profile);
    currentInvitation = await invitationService.processRegister(currentInvitation, user);

    const token = InvitationService.createToken({ user: user });

    const urlToConfirm = config.APP_DOMAIN + '/#/public/confirm-invitation/' + currentInvitation.uid + '/' + token;

    userService.sendEmailValidateAccount(
      profile.email,
      urlToConfirm
    );

    return ResponseBuilder.ok({ success: 'User was created successfully'}, cb);

  } catch (e) {
    logger.debug('Error singUp.:', e);
    return ResponseException(e, cb);
  }
};

/**
 * Get by id a invitation
 * @param event
 * @param context
 * @param callback
 */
export const getById: Handler = (event: APIGatewayEvent, context: Context, callback: Callback) => {
  const wsa = getWorkspaceAccesAuth(<any> event);
  console.log('wsa: ', wsa);
  if (!isValidAuthorizer(wsa)) {
    return ResponseBuilder.accessDenied(callback);
  }

  const params = (event.pathParameters) ? event.pathParameters : '';

  if (!params) {
    return ResponseBuilder.badRequest('parametros no validos', callback);
  }

  if (!params.id) {
    return ResponseBuilder.badRequest('Please specify invitation ID!', callback);
  }

  logger.debug('Get invitation by id: ' + params.id);
  invitationService.getById(params.id).then((invitation) => {
    return ResponseBuilder.ok(invitation, callback);
  }).catch((err) => {
    logger.debug('Error getById.:', err);
    return ResponseException(err, callback);
  });

};

// /**
//  * Delete a invitation
//  * @param event APIGatewayEvent in this contex send id that we want to know
//  * @param context
//  * @param callback
//  */
// export const deleted: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
//   // Get auth user
//   const user = getUserAuthorizer(<any> event);

//   if (!isValidAuthorizer(user)) {
//     return ResponseBuilder.accessDenied(callback);
//   }

//   const params = (event.pathParameters) ? event.pathParameters : '';

//   if (!params) {
//     return ResponseBuilder.badRequest('400', 'Parmams not valid', callback);
//   }

//   if (!params.id) {
//     return ResponseBuilder.badRequest(ErrorCode.GeneralError, 'Please specify the ID!', callback);
//   }

//   logger.info('Current delete will be ' + params.id);
//   const invitation = await invitationService.delete(params.id);
//   logger.debug(invitation);
//   return ResponseBuilder.ok(invitation, callback);
// };

// /**
//  * Update a invitation
//  * @param event APIGatewayEvent in this contex send id that we want to know
//  * @param context
//  * @param callback
//  */
// export const update: Handler = (event: APIGatewayEvent, context: Context, callback: Callback) => {
//   // Get auth user
//   const user = getUserAuthorizer(<any> event);

//   if (!isValidAuthorizer(user)) {
//     return ResponseBuilder.accessDenied(callback);
//   }

//   const pathParams = JSON.stringify(event.pathParameters);
//   const params = JSON.parse(pathParams);

//   logger.debug(params);
//   if (!params) {
//     return ResponseBuilder.badRequest('400', 'Parmams not valid', callback);
//   }

//   if (!params.id) {
//     return ResponseBuilder.badRequest(ErrorCode.GeneralError, 'Please specify the ID!', callback);
//   }

//   logger.debug('Update invitation', params.id);
//   const body = event.body ? event.body : '';
//   const json = JSON.parse(body);

//   invitationService.update(params.id, json as Invitation).then((item) => {
//     return ResponseBuilder.ok(item, callback);
//   }).catch((err) => {
//     return ResponseBuilder.notFound('404', err, callback);
//   });

// };

/**
 * Cancel an invitation
 * @param event APIGatewayEvent in this contex send id that we want to know
 * @param context
 * @param callback
 */
export const canceled: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
  const wsa = getWorkspaceAccesAuth(<any> event);
  console.log('wsa: ', wsa);
  if (!isValidAuthorizer(wsa)) {
    return ResponseBuilder.accessDenied(callback);
  }

  const params = (event.pathParameters) ? event.pathParameters : '';

  if (!params) {
    return ResponseBuilder.badRequest('parametros no validos', callback);
  }

  if (!params.id) {
    return ResponseBuilder.badRequest('Please specify invitation ID!', callback);
  }

  try {
    logger.info('Current invitation will be ' + params.id);
    const invitation = await invitationService.cancel(params.id, wsa.workspaceAccess.user);
    logger.debug('invitation canceled: ', invitation);
    return ResponseBuilder.ok(invitation, callback);
  } catch (error) {
    logger.debug('Error getById.:', error);
    return ResponseException(error, callback);
  }
};

// /**
//  * Update a invitation
//  * @param event APIGatewayEvent in this contex send id that we want to know
//  * @param context
//  * @param callback
//  */
// export const update: Handler = (event: APIGatewayEvent, context: Context, callback: Callback) => {
//   // Get auth user
//   const user = getUserAuthorizer(<any> event);

//   if (!isValidAuthorizer(user)) {
//     return ResponseBuilder.accessDenied(callback);
//   }

//   const pathParams = JSON.stringify(event.pathParameters);
//   const params = JSON.parse(pathParams);

//   logger.debug(params);
//   if (!params) {
//     return ResponseBuilder.badRequest('400', 'Parmams not valid', callback);
//   }

//   if (!params.id) {
//     return ResponseBuilder.badRequest(ErrorCode.GeneralError, 'Please specify the ID!', callback);
//   }

//   logger.debug('Update invitation', params.id);
//   const body = event.body ? event.body : '';
//   const json = JSON.parse(body);

//   invitationService.update(params.id, json as Invitation).then((item) => {
//     return ResponseBuilder.ok(item, callback);
//   }).catch((err) => {
//     return ResponseBuilder.notFound('404', err, callback);
//   });
// };


/**
 * Confirm invitation
 * @param event
 * @param context
 * @param callback
 */
export const confirmInvitation: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
  printEvent(true, <any>  event, 'Confirm invitation: ');

  const body = event.body ? event.body : '';
  const json = JSON.parse(body);

  try {
    const params = (event.pathParameters) ? event.pathParameters : '';

    if (!params) {
      return ResponseBuilder.badRequest('parametros no validos', callback);
    }

    if (!params.id) {
      return ResponseBuilder.badRequest('Please specify invitation ID!', callback);
    }

    const decoded: any = AuthService.verify(json.token);
    logger.debug('Token User: ', decoded.user);
    const invitation = await invitationService.confirmInvitation(params.id, decoded.user);

    return ResponseBuilder.ok(invitation, callback);
  } catch (error) {
    logger.debug('Error confirmInvitation:', error);
    return ResponseException(error, callback);
  }
};

// export const findAll: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
//   printEvent(false, <any>  event, 'Find all invitations: ');

//   // Get auth user
//   const user = getUserAuthorizer(<any> event);

//   if (!isValidAuthorizer(user)) {
//     return ResponseBuilder.accessDenied(callback);
//   }

//   try {
//     const invitations: any = await invitationService.findAll();
//     return ResponseBuilder.ok(invitations, callback);
//   } catch (error) {
//     logger.error(error);
//     return ResponseBuilder.internalServerError(error, callback);
//   }

// };

