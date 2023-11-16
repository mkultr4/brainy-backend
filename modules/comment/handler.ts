import { Callback, Context, Handler, APIGatewayEvent } from 'aws-lambda';
import ResponseBuilder from '../../src/util/builders/ResponseBuilder';

import CommentService from '../../src/services/comment/CommentService';

import logger from '../../src/logger';

const commentService: CommentService = new CommentService();

/**
 *
 * @param event APIGatewayEvent in this contex send id that we want to know
 * @param context
 * @param callback
 */
export const getById: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    const user = getUserAuthorizer(event);
    const params = (event.pathParameters) ? event.pathParameters : '';

    logger.debug(event.pathParameters);
    logger.debug(user);

    if (user === undefined || user == null) {
        return ResponseBuilder.accessDenied(callback);
    }

    if (!params || !params.id) {
        return ResponseBuilder.badRequest('Please specify the ID!', callback);
    }

    const queryBody = JSON.stringify(event.queryStringParameters);
    const parameter = JSON.parse(queryBody);

    commentService.getAs(params.id, parameter.workspace_id).then((core) => {
        logger.info(`object returned ${core}`);
        return ResponseBuilder.ok(core, callback);
    }).catch((err) => {
        logger.info(err);
        return ResponseBuilder.error(err, callback);
    });
};

/**
 *
 * @param event APIGatewayEvent in this contex send id that we want to know
 * @param context
 * @param callback
 */
export const deletedComment: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    const params = (event.pathParameters) ? event.pathParameters : '';

    if (!params || !params.id) {
        return ResponseBuilder.badRequest('Please specify the ID!', callback);
    }

    logger.debug('undelete comment');
    const comment = await commentService.logicalChangeDelete(params.id, true);

    logger.debug(comment);
    return ResponseBuilder.ok(comment, callback);
};

export const deletedThread: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    const params = (event.pathParameters) ? event.pathParameters : '';

    if (!params || !params.id) {
        return ResponseBuilder.badRequest('Please specify the ID!', callback);
    }

    logger.debug('undelete thread comment');
    const comment = await commentService.logicalChangeDeleteThreadComment(params.id, true);

    logger.debug(comment);
    return ResponseBuilder.ok(comment, callback);
};

/**
 *
 * @param event APIGatewayEvent in this contex send id that we want to know
 * @param context
 * @param callback
 */
export const undeleteComment: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    const params = (event.pathParameters) ? event.pathParameters : '';

    if (!params || !params.id) {
        return ResponseBuilder.badRequest('Please specify the ID!', callback);
    }
    logger.info('Current delete will be ' + params.id);


    logger.debug('undelete comment');
    const comment = await commentService.logicalChangeDelete(params.id, false);

    return ResponseBuilder.ok(comment, callback);
};

export const undeleteThread: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    const params = (event.pathParameters) ? event.pathParameters : '';

    if (!params || !params.id) {
        return ResponseBuilder.badRequest('Please specify the ID!', callback);
    }

    logger.info('Current delete will be ' + params.id);

    logger.debug('undelete thread comment');
    const comment = await commentService.logicalChangeDeleteThreadComment(params.id, false);

    return ResponseBuilder.ok(comment, callback);
};

/**
 * Aour creation end point
 * @param workspaceHandler Core Model
 * @param context Whole context
 * @param callback  Our response in most cases success
 */
export const create: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    const user = getUserAuthorizer(event);
    console.log('user: ', user);
    if (user === undefined || user == null) {
        return ResponseBuilder.accessDenied(callback);
    }

    const params = (event.pathParameters) ? event.pathParameters : '';

    if (!params) {
        return ResponseBuilder.badRequest('parametros no validos' , callback);
    }

    try {
        const body = event.body ? event.body : '';
        const json = JSON.parse(body);
        logger.debug('json create core:');
        logger.debug(json);
        const comment: any = await commentService.saveAs(user, json);
        return ResponseBuilder.ok(comment, callback);
    } catch (error) {
        logger.error(error);
        return ResponseBuilder.error(error, callback);
    }
};

/**
 *
 * @param event APIGatewayEvent in this contex send id that we want to know
 * @param context
 * @param callback
//  */
export const updateComment: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    const body = JSON.stringify(event);
    const json = JSON.parse(body);

    const params = (event.pathParameters) ? event.pathParameters : '';

    const user = getUserAuthorizer(event);

    if (user === undefined || user == null) {
        return ResponseBuilder.accessDenied(callback);
    }

    if (!params || !params.id) {
        return ResponseBuilder.badRequest('Please specify the ID!', callback);
    }

    try {
        logger.debug('parameters to update', json.body);

        logger.debug('update comment');
        const item = await commentService.update(params.id, JSON.parse(json.body));

        logger.debug(item);
        return ResponseBuilder.ok(item, callback);
    } catch (error) {
        logger.error(error);
        return ResponseBuilder.error(error, callback);
    }
};

export const updateThread: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    const body = JSON.stringify(event);
    const json = JSON.parse(body);

    const params = (event.pathParameters) ? event.pathParameters : '';

    const user = getUserAuthorizer(event);

    if (user === undefined || user == null) {
        return ResponseBuilder.accessDenied(callback);
    }

    if (!params || !params.id) {
        return ResponseBuilder.badRequest('Please specify the ID!', callback);
    }

    try {
        logger.debug('parameters to update', json.body);


        logger.debug('update thread comment');
        const item = await commentService.updateThreadComment(params.id, JSON.parse(json.body));

        logger.debug(item);
        return ResponseBuilder.ok(item, callback);
    } catch (error) {
        logger.error(error);
        return ResponseBuilder.error(error, callback);
    }
};

export const createThreadComment: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    const user = getUserAuthorizer(event);
    console.log('user: ', user);
    if (user === undefined || user == null) {
        return ResponseBuilder.accessDenied(callback);
    }

    const params = (event.pathParameters) ? event.pathParameters : '';

    if (!params) {
        return ResponseBuilder.badRequest('parametros no validos' , callback);
    }

    try {
        const body = event.body ? event.body : '';
        const json = JSON.parse(body);
        logger.debug('json create core:');
        logger.debug(json);
        const comment: any = await commentService.createThreadComment(user, params.id, json);
        return ResponseBuilder.ok(comment, callback);
    } catch (error) {
        logger.error(error);
        return ResponseBuilder.error(error, callback);
    }
};

export const answer: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    const user = getUserAuthorizer(event);
    console.log('user: ', user);
    if (user === undefined || user == null) {
        return ResponseBuilder.accessDenied(callback);
    }

    const params = (event.pathParameters) ? event.pathParameters : '';

    if (!params) {
        return ResponseBuilder.badRequest('parametros no validos' , callback);
    }

    try {
        const body = event.body ? event.body : '';
        const json = JSON.parse(body);
        logger.debug('json create core:');
        logger.debug(json);
        const comment: any = await commentService.answer(user, json, params.id);
        return ResponseBuilder.ok(comment, callback);
    } catch (error) {
        logger.error(error);
        return ResponseBuilder.error(error, callback);
    }
};

function getUserAuthorizer(event: APIGatewayEvent) {
    const { requestContext } = event;
    const authorizer = (requestContext.authorizer) ? requestContext.authorizer : null;

    if (authorizer !== undefined && authorizer != null) {
        return JSON.parse(authorizer.payload as string).user;
    }
}
