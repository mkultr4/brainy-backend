import { Callback, Context, Handler, APIGatewayEvent } from 'aws-lambda';
import ResponseBuilder from '../../src/util/builders/ResponseBuilder';
import BrandService from '../../src/services/brand/BrandService';
import { Brand } from '../../src/models/brand/Brand';
import logger from '../../src/logger';
import { getWorkspaceAccesAuth, isValidAuthorizer } from '../../src/util/lambdaUtils/lambdaUtil';


const brandService: BrandService = new BrandService();

/**
 *
 * @param event APIGatewayEvent in this contex send id that we want to know
 * @param context
 * @param callback
 */
export const getById: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    const body = JSON.stringify(event.pathParameters);
    const json = JSON.parse(body);

    logger.info(json.id);
    if (!json || !json.id) {
        return ResponseBuilder.badRequest( 'Please specify the ID!', callback);
    }

    logger.info('Current get will be ' + json.id);

    brandService.get(json.id).then((core) => {
        logger.info(`object returned ${core}`);
        return ResponseBuilder.ok(core, callback);
    }).catch((err) => {
        logger.info(err);
        return ResponseBuilder.notFound(err, callback);
    });
};

export const findByWorkspace: Handler = (event: APIGatewayEvent, context: Context, callback: Callback) => {

    const wsa = getWorkspaceAccesAuth(<any>event);
    logger.debug('getSession from user =>', wsa);
    if (!isValidAuthorizer(wsa)) {
      return ResponseBuilder.accessDenied(callback);
    }

    brandService.findAllByWorkspace(wsa.workspaceAccess.workspace.uid)
    .then((brands) => {
        logger.info(`object found ${brands}`);
        return ResponseBuilder.ok(brands, callback);
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
    const body = JSON.stringify(event);
    const json = JSON.parse(body);

    if (!json || !json.id) {
        return ResponseBuilder.badRequest('Please specify the ID!', callback);
    }
    logger.info('Current delete will be ' + json.id);
    const brand = await brandService.delete(json.id);
    logger.debug(brand);
    return ResponseBuilder.ok(brand, callback);
};

/**
 * Aour creation end point
 * @param workspaceHandler brand Model
 * @param context Whole context
 * @param callback  Our response in most cases success
 */
export const create: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    try {
        const body = JSON.stringify(event);
        const json = JSON.parse(body);
        const brand: any = await brandService.save(json as Brand);
        return ResponseBuilder.ok(brand, callback);
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
    const body = JSON.stringify(event);
    const json = JSON.parse(body);

    const item = await brandService.update(json.id, json.body as Brand);
    logger.debug(item);
    return ResponseBuilder.ok(item, callback);
};


export const getByUserId: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    const body = JSON.stringify(event.pathParameters);
    const json = JSON.parse(body);

    logger.info(json.id);
    if (!json || !json.id) {
        return ResponseBuilder.badRequest('Please specify the ID!', callback);
    }

    logger.info('Current get will be ' + json.id);

    brandService.findByUser(json.id).then((brands) => {
        logger.info(`object returned ${brands}`);
        return ResponseBuilder.ok(brands, callback);
    }).catch((err) => {
        logger.info(err);
        return ResponseBuilder.notFound(err, callback);
    });
};

export function getUser(event: APIGatewayEvent) {
    console.log(event);
    console.log(event.requestContext);
    console.log(event.requestContext.authorizer);
    const { requestContext } = event;
    const authorizer = (requestContext.authorizer) ? requestContext.authorizer : null;

    if (authorizer !== undefined && authorizer != null) {
        return JSON.parse(authorizer.payload as string).user;
    }
}

