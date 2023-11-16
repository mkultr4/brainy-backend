import { Callback, Context, Handler, APIGatewayEvent } from 'aws-lambda';
import ResponseBuilder from '../../src/util/builders/ResponseBuilder';
import PinService from '../../src/services/pin/PinService';
import { Pin } from '../../src/models/pin/Pin';

import logger from '../../src/logger';
import { getCoreAccessAuth } from '../../src/util/lambdaUtils/lambdaUtil';


const pinService: PinService = new PinService();

/**
 *
 * @param event APIGatewayEvent in this contex send id that we want to know
 * @param context
 * @param callback
 */
export const getById: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    const auth = getCoreAccessAuth(<any>event);
    if (!auth) {
      return ResponseBuilder.accessDenied(callback);
    }

    const body = JSON.stringify(event.pathParameters);
    const json = JSON.parse(body);

    logger.info(json.id);
    if (!json || !json.id) {
        return ResponseBuilder.badRequest('Please specify the ID!', callback);
    }

    logger.info('Current get will be ' + json.id);

    const queryBody = JSON.stringify(event.queryStringParameters);
    const parameter = JSON.parse(queryBody);

    pinService.getAs(auth.coreAccess, json.id, parameter.workspace_id).then((pin) => {
        logger.info(`object returned ${pin}`);
        return ResponseBuilder.ok(pin, callback);
    }).catch((err) => {
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
    const auth = getCoreAccessAuth(<any>event);
    if (!auth) {
      return ResponseBuilder.accessDenied(callback);
    }

    const body = JSON.stringify(event);
    const json = JSON.parse(body);

    if (!json || !json.id) {
        return ResponseBuilder.badRequest('Please specify the ID!', callback);
    }

    const queryBody = JSON.stringify(event.queryStringParameters);
    const parameter = JSON.parse(queryBody);

    logger.info('Current delete will be ' + json.id);
    const pin = await pinService.logicalChangeDelete(json.id, true, parameter.workspace_id);
    logger.debug(pin);
    return ResponseBuilder.ok(pin, callback);
};

/**
 * Aour creation end point
 * @param workspaceHandler Core Model
 * @param context Whole context
 * @param callback  Our response in most cases success
 */
export const create: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    const auth = getCoreAccessAuth(<any>event);
    if (!auth) {
      return ResponseBuilder.accessDenied(callback);
    }

    try {
        const body = event.body ? event.body : '';
        const json = JSON.parse(body);
        const pin: any = await pinService.saveAs(auth.coreAccess, json).catch((err) => {
            logger.debug('catch promise error');
            logger.debug(err);
            return ResponseBuilder.badRequest(err, callback);
        });
        return ResponseBuilder.ok(pin, callback);
    } catch (error) {
        logger.error(error);
        return ResponseBuilder.internalServerError(error, callback);
    }
};

/**
 *
 * @param event APIGatewayEvent in this contex send id that we want to know
 * @param context
 * @param callback
//  */
export const update: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    const auth = getCoreAccessAuth(<any>event);
    if (!auth) {
      return ResponseBuilder.accessDenied(callback);
    }

    const pathParams = JSON.stringify(event.pathParameters);
    const params = JSON.parse(pathParams);

    const body = event.body ? event.body : '';
    const json = JSON.parse(body);

   pinService.updateAs(auth.coreAccess, params.id, json as Pin).then((item) => {
        return ResponseBuilder.ok(item, callback);
    }).catch((err) => {
        return ResponseBuilder.notFound(err, callback);
    });

};

/**
 *
 * @param event APIGatewayEvent in this contex send id that we want to know
 * @param context
 * @param callback
 */
export const findByReference: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    const auth = getCoreAccessAuth(<any>event);
    if (!auth) {
      return ResponseBuilder.accessDenied(callback);
    }

    const body = JSON.stringify(event.pathParameters);
    const json = JSON.parse(body);

    const queryBody = JSON.stringify(event.queryStringParameters);
    const parameter = JSON.parse(queryBody);

    logger.info(json.id);
    if (!json || !json.id) {
        return ResponseBuilder.badRequest('Please specify the ID!', callback);
    }

    logger.info('Current get will be ' + json.id);

    try {
      pinService.findByReference(auth.coreAccess, json.id, parameter.type, parameter.workspace_id).then((pins) => {
          logger.info(`object returned ${pins}`);
          return ResponseBuilder.ok(pins, callback);
      }).catch((err) => {
          logger.info(err);
          return ResponseBuilder.notFound(err, callback);
      });
    } catch (error) {
      logger.error(error);
      return ResponseBuilder.internalServerError(error, callback);
    }
};
