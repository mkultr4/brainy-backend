import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import ResponseBuilder from '../../../src/util/builders/ResponseBuilder';
import logger from '../../../src/logger';
import { isValidAuthorizer, getWorkspaceAccesAuth, ResponseException } from '../../../src/util/lambdaUtils/lambdaUtil';
import WorkspaceAccessCategoryService from '../../../src/services/workspaces/access/WorkspaceAccessCategoryService';

const cms: WorkspaceAccessCategoryService = new WorkspaceAccessCategoryService();


export const listbyworkspace: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {

  const wsa = getWorkspaceAccesAuth(<any> event);
  console.log('wsa: ', wsa);
  if (!isValidAuthorizer(wsa)) {
    return ResponseBuilder.accessDenied(cb);
  }

  cms.listbyworkspace(wsa.workspaceAccess).then((categories) => {
    logger.info(`List returned count: ${categories.length}`);
    return ResponseBuilder.ok(categories, cb);
  }).catch((err) => {
    logger.error(err);
    return ResponseException(err, cb);
  });
};


export const createCategory: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {

  const wsa = getWorkspaceAccesAuth(<any> event);
  console.log('wsa: ', wsa);
  if (!isValidAuthorizer(wsa)) {
    return ResponseBuilder.accessDenied(cb);
  }

  const body: any = (event.body) ? JSON.parse(event.body) : {};

  cms.createCategory(wsa.workspaceAccess, body).then((object) => {
    logger.info(`category created : ${object}`);
    return ResponseBuilder.ok(object, cb);
  }).catch((err) => {
    logger.error(err);
    return ResponseException(err, cb);
  });
};
