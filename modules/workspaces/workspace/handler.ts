import { Callback, Context, Handler, APIGatewayEvent } from 'aws-lambda';
import ResponseBuilder from '../../../src/util/builders/ResponseBuilder';
import WorkspaceService from '../../../src/services/WorkspaceService';
import { Workspace } from '../../../src/models/workspace/Workspace';
import logger from '../../../src/logger';
import { printEvent, getUserAuthorizer, isValidAuthorizer } from '../../../src/util/lambdaUtils/lambdaUtil';

const workspaceService: WorkspaceService = new WorkspaceService();

// /**
//  * This class represents endpoint for all email workspace in dynamo
//  * @param APIGatewayEvent Event in whole api-wateway
//  * @param context Contex it could be succes and done function
//  * @param callback Our response
//  */
// export const getAll: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
//     logger.info('Our operation getAll has event: ' + event);
//     const workspaces: Workspace[] = await workspaceService.getAll();
//     return ResponseBuilder.ok<Workspace[]>(workspaces, callback);
// };

/**
 *
 * @param event APIGatewayEvent in this contex send id that we want to know
 * @param context
 * @param callback
 */
export const get: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const params = (event.pathParameters) ? event.pathParameters : undefined;

  if (!params) {
    return ResponseBuilder.badRequest('parametros no validos', cb);
  }

  if (!params.id) {
    return ResponseBuilder.badRequest('Please specify the ID!', cb);
  }

  logger.info('Current get will be ' + params.id);
  workspaceService.get(params.id).then((workspace) => {
      logger.info(`object returned ${workspace}`);
      return ResponseBuilder.ok(workspace, cb);
  }).catch((err) => {
      logger.info(err);
      return ResponseBuilder.notFound(err, cb);
  });
};

/**
 *
 * @param event APIGatewayEvent in this contex send id that we want to know
 * @param context
 * @param callback
 */
export const getListByUser: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
  printEvent(true, <any> event, 'Create invitation: ', 'extra info');
  // Get auth user
  const user = getUserAuthorizer(<any>event);

  if (!isValidAuthorizer(user)) {
    return ResponseBuilder.accessDenied(callback);
  }

  try {
    const workspaces: Workspace[] = await workspaceService.getWorkspaceByUser(user);
    logger.debug(workspaces);
    return ResponseBuilder.ok(workspaces, callback);
  } catch (error) {
    return ResponseBuilder.internalServerError(error, callback);
  }
};

// /**
//  *
//  * @param event APIGatewayEvent in this contex send id that we want to know
//  * @param context
//  * @param callback
//  */
// export const eliminate: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
//     const body = JSON.stringify(event);
//     const json = JSON.parse(body);

//     if (!json || !json.id) {
//         return ResponseBuilder.badRequest('Please specify the ID!', callback);
//     }
//     logger.info('Current delete will be ' + json.id);
//     const workspace = await workspaceService.delete(json.id);
//     logger.debug(workspace);
//     return ResponseBuilder.ok(workspace, callback);
// };

/**
 * Aour creation end point
 * @param workspaceHandler Workspace Model
 * @param context Whole context
 * @param callback  Our response in most cases success
 */
export const create: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    try {
        const body = JSON.stringify(event);
        const json = JSON.parse(body);
        const workspace: any = await workspaceService.save(json as Workspace);
        return ResponseBuilder.ok(workspace, callback);
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
    const item = await workspaceService.update(json.id, json.body as Workspace);
    logger.debug(item);
    return ResponseBuilder.ok(item, callback);
};
