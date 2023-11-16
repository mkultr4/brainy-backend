import { Callback, Context, Handler, APIGatewayEvent } from 'aws-lambda';
import ResponseBuilder from '../../src/util/builders/ResponseBuilder';
import ProjectService from '../../src/services/project/ProjectService';

import logger from '../../src/logger';


const projectService: ProjectService = new ProjectService();

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
        return ResponseBuilder.badRequest('Please specify the ID!', callback);
    }

    logger.info('Current get will be ' + json.id);

    await projectService.get(json.id).then((project) => {
        logger.info(`object returned ${project}`);
        return ResponseBuilder.ok(project, callback);
    }).catch((err) => {
        logger.info(err);
        return ResponseBuilder.notFound(err, callback);
    });
};

export const findByWorkspace: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {

    const params = (event.pathParameters) ? event.pathParameters : '';

    if (!params) {
        return ResponseBuilder.badRequest('parametros no validos', callback);
    }

    if (!params.id) {
        return ResponseBuilder.badRequest('Please specify the ID!', callback);
    }


    logger.info('Current get will be ' + params.id);

    await projectService.findByWorkspace(params.id).then((brands) => {
        logger.info(`object found ${brands}`);
        return ResponseBuilder.ok(brands, callback);
    }).catch((err) => {
        logger.error(err);
        return ResponseBuilder.notFound(err, callback);
    });
};

export const findByBrand: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    const body = JSON.stringify(event.pathParameters);
    const json = JSON.parse(body);

    logger.info(json.id);
    if (!json || !json.id) {
        return ResponseBuilder.badRequest('Please specify the ID!', callback);
    }

    logger.info('Current get will be ' + json.id);

    await projectService.findByBrand(json.id).then((project) => {
        logger.info(`object returned ${project}`);
        return ResponseBuilder.ok(project, callback);
    }).catch((err) => {
        logger.info(err);
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
    const body = JSON.stringify(event.pathParameters);
    const json = JSON.parse(body);

    logger.info(json.id);
    if (!json || !json.id) {
        return ResponseBuilder.badRequest('Please specify the ID!', callback);
    }

    logger.info('Current delete will be ' + json.id);
    const project = await projectService.delete(json.id);
    logger.debug(project);
    return ResponseBuilder.ok(project, callback);
};

/**
 * Aour creation end point
 * @param workspaceHandler Project Model
 * @param context Whole context
 * @param callback  Our response in most cases success
 */
export const create: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    try {
        const body = JSON.stringify(event);
        const json = JSON.parse(body);
        logger.debug('json body: ', json.body);
        const project: any = await projectService.saveAs(json.body);
        return ResponseBuilder.ok(project, callback);
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
 */
export const update: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    const body = JSON.stringify(event);
    const json = JSON.parse(body);

    const bodyParams = JSON.stringify(event.pathParameters);
    const params = JSON.parse(bodyParams);

    logger.info(params.id);
    if (!params || !params.id) {
        return ResponseBuilder.badRequest('Please specify the ID!', callback);
    }

    const item = await projectService.updateAs(params.id, JSON.parse(json.body));
    logger.debug(item);
    return ResponseBuilder.ok(item, callback);
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
