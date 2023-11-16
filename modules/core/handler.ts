import { Callback, Context, Handler, APIGatewayEvent } from 'aws-lambda';
import ResponseBuilder from '../../src/util/builders/ResponseBuilder';
import CoreService from '../../src/services/core/CoreService';
// import CoreTypeService from '../../src/services/core/CoreTypeService';
// import CoreStatusService from '../../src/services/core/CoreStatusService';
import { getWorkspaceAccesAuth, isValidAuthorizer } from '../../src/util/lambdaUtils/lambdaUtil';

import logger from '../../src/logger';


const coreService: CoreService  = new CoreService();
// const coreTypeService: CoreTypeService = new CoreTypeService();
// const coreStatusService: CoreStatusService = new CoreStatusService();

/**
 *
 * @param event APIGatewayEvent in this contex send id that we want to know
 * @param context
 * @param callback
 */
export const getById: Handler = (event: APIGatewayEvent, context: Context, callback: Callback) => {
    const wsa = getWorkspaceAccesAuth(<any>event);
    logger.debug('getSession from user =>', wsa);
    if (!isValidAuthorizer(wsa)) {
      return ResponseBuilder.accessDenied(callback);
    }

    const params = (event.pathParameters) ? event.pathParameters : '';

    if (!params || !params.id) {
      return ResponseBuilder.badRequest('parametros no validos', callback);
    }

    logger.info('Current get will be ' + params.id);

    coreService.getAs(params.id, wsa.workspaceAccess).then((core) => {
        logger.info(`object returned ${core}`);
        return ResponseBuilder.ok(core, callback);
    }).catch((err) => {
        logger.info(err);
        return ResponseBuilder.error(err, callback);
    });
};

export const findCoresByWorkspace: Handler = (event: APIGatewayEvent, context: Context, callback: Callback) => {

    const wsa = getWorkspaceAccesAuth(<any>event);
    logger.info('getSession from user =>', wsa);
    if (!isValidAuthorizer(wsa)) {
      return ResponseBuilder.accessDenied(callback);
    }

    coreService.findCoresByWorkspace(wsa.workspaceAccess).then(
      core => {
        logger.info(`object returned ${core}`);
        return ResponseBuilder.ok(core, callback);
    }).catch((err) => {
        logger.error(err);
        return ResponseBuilder.notFound(err, callback);
    });
};

/**
 *
 * @param event APIGatewayEvent in this contex send id that we want to know
 * @param context
 * @param callback
 */
export const deleted: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    const wsa = getWorkspaceAccesAuth(<any>event);
    logger.info('getSession from user =>', wsa);
    if (!isValidAuthorizer(wsa)) {
      return ResponseBuilder.accessDenied(callback);
    }
    const params = (event.pathParameters) ? event.pathParameters : '';

    if (!params) {
        return ResponseBuilder.badRequest('parametros no validos' , callback);
    }

    logger.info('Current delete will be ' + params.id);
    const core = await coreService.logicalChangeDelete(params.id, wsa.workspaceAccess);
    logger.debug(core);
    return ResponseBuilder.ok(core, callback);
};

/**
 * Aour creation end point
 * @param workspaceHandler Core Model
 * @param context Whole context
 * @param callback  Our response in most cases success
 */
export const create: Handler = (event: APIGatewayEvent, context: Context, callback: Callback) => {
  logger.info('create getSession from event', event);
  const wsa = getWorkspaceAccesAuth(<any>event);
  if (!isValidAuthorizer(wsa)) {
    return ResponseBuilder.accessDenied(callback);
  }
  logger.info('create getSession from wsa', wsa);

  const body = event.body ? event.body : '';
  const json = JSON.parse(body);
  logger.debug('json create core:', json);
  coreService.saveAs(json, wsa.workspaceAccess).then(
    _core => {
      logger.debug('Core was v=created:', _core);
      return ResponseBuilder.ok(_core, callback);
    }
  ).catch((err) => {
    logger.error(err);
    return ResponseBuilder.internalServerError(err, callback);
  });
};

/**
 *
 * @param event APIGatewayEvent in this contex send id that we want to know
 * @param context
 * @param callback
 */
export const update: Handler = (event: APIGatewayEvent, context: Context, callback: Callback) => {
    const body = JSON.stringify(event);
    const json = JSON.parse(body);

    const wsa = getWorkspaceAccesAuth(<any>event);
    logger.info('getSession from user =>', wsa);
    if (!isValidAuthorizer(wsa)) {
      return ResponseBuilder.accessDenied(callback);
    }
    const params = (event.pathParameters) ? event.pathParameters : '';

    if (!params || !params.id) {
      return ResponseBuilder.badRequest('parametros no validos', callback);
    }

    coreService.updateAs(params.id, JSON.parse(json.body), wsa.workspaceAccess).then(
      _core => {
        logger.debug(_core);
        return ResponseBuilder.ok(_core, callback);
      }
    ).catch((err) => {
      logger.error(err);
      return ResponseBuilder.internalServerError(err, callback);
    });
};



/**
 *
 * @param event APIGatewayEvent in this contex send id that we want to know
 * @param context
 * @param callback
//  */
// export const listTypes: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {

//     const items = await coreTypeService.list();
//     logger.debug(items);
//     return ResponseBuilder.ok(items, callback);
// };

/**
 *
 * @param event APIGatewayEvent in this contex send id that we want to know
 * @param context
 * @param callback
//  */
// export const listStatus: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
//     console.log('listStatus type cores');
//     try {
//         const items = await coreStatusService.list();
//         console.log(items);
//         return ResponseBuilder.ok(items, callback);
//     } catch (error) {
//         return ResponseBuilder.internalServerError(error, callback);
//     }
// };

