import { ApiEvent, ApiCallback, ApiContext, Handler } from '../../src/interfaces/Api';
import ResponseBuilder from '../../src/util/builders/ResponseBuilder';
import { FeedbackPieceService } from '../../src/services/feedback-piece/FeedbackPieceService';
import logger from '../../src/logger';
import { Piece } from '../../src/models/feedback-piece/Piece';
import { getCoreAccessAuth } from '../../src/util/lambdaUtils/lambdaUtil';

const feedbackPieceService: FeedbackPieceService = new FeedbackPieceService();

/**
 * Save Piece into databa
 * @param event ApiEvent
 * @param context ApiContext
 * @param callback ApiCallback
 */
export const create: Handler = async (event: ApiEvent, context: ApiContext, callback: ApiCallback) => {
  try {
    const auth = getCoreAccessAuth(<any>event);
    if (!auth) {
      return ResponseBuilder.accessDenied(callback);
    }

    logger.info('Our operation create has event: ' + event);
    const body = JSON.stringify(event);
    const json = JSON.parse(body);
    const pieces_saved: any = await feedbackPieceService.saveAs(JSON.parse(json.body), auth.coreAccess);
    logger.info('Resolving pieces ', pieces_saved);
    return ResponseBuilder.ok(pieces_saved, callback);
  } catch (error) {
    logger.error(error);
    return ResponseBuilder.internalServerError(error, callback);
  }
};
/**
 * Save Piece into databa
 * @param event ApiEvent
 * @param context ApiContext
 * @param callback ApiCallback
 */
export const createVersion: Handler = async (event: ApiEvent, context: ApiContext, callback: ApiCallback) => {
  try {
    const auth = getCoreAccessAuth(<any>event);
    if (!auth) {
      return ResponseBuilder.accessDenied(callback);
    }

    logger.info('Our operation createNewVersion has event: ' + event);
    const body = JSON.stringify(event);
    logger.info('Our operation createNewVersion has body: ', body);
    const json = JSON.parse(body);
    logger.info('Our operation createNewVersion has jsonPiece: ', json);
    const _piece = JSON.parse(json.body);
    logger.info('Our operation createNewVersion has _piece: ', _piece);
    const pieces_saved: any = await feedbackPieceService.createNewVersion(_piece, _piece.keepPins, auth.coreAccess);
    logger.info('Resolving pieces ', pieces_saved);
    return ResponseBuilder.ok(pieces_saved, callback);
  } catch (error) {
    logger.error(error);
    return ResponseBuilder.internalServerError(error, callback);
  }
};

/**
 *
 * @param event
 * @param context
 * @param callback
 */
export const deletePiece: Handler = async (event: ApiEvent, context: ApiContext, callback: ApiCallback) => {
  try {
    const auth = getCoreAccessAuth(<any>event);
    if (!auth) {
      return ResponseBuilder.accessDenied(callback);
    }

    logger.info('Our operation getAll has event: ', event);
    const body = JSON.stringify(event);
    const json = JSON.parse(body);
    logger.info('Event parse: ', json);
    if (event.pathParameters != null) {
      logger.info('Event pathParameters.id: ', event.pathParameters.id);
      const pieces: Piece[] = await feedbackPieceService.deletePiece(event.pathParameters.id, auth.coreAccess);
      return ResponseBuilder.ok<Piece[]>(pieces, callback);
    } else {
      return ResponseBuilder.badRequest('Please specify param id!', callback);

   }
  } catch (error) {
    logger.error(error);
    return ResponseBuilder.internalServerError(error, callback);
  }
};

/**
 *
 * @param event
 * @param context
 * @param callback
 */
export const getByCore: Handler = async (event: ApiEvent, context: ApiContext, callback: ApiCallback) => {
  try {
    const auth = getCoreAccessAuth(<any>event);
    if (!auth) {
      return ResponseBuilder.accessDenied(callback);
    }

    logger.info('Our operation getAll has event: ', event);
    const body = JSON.stringify(event);
    const json = JSON.parse(body);
    logger.info('Event parse: ', json);
    if (event.pathParameters != null) {
      logger.info('Event pathParameters.id: ', event.pathParameters.id);
      logger.debug('auth: ', JSON.stringify(auth));
      const pieces = await feedbackPieceService.findAllByCoreId(event.pathParameters.id, auth.coreAccess);
      return ResponseBuilder.ok(pieces, callback);
    } else {
      return ResponseBuilder.badRequest(
         'Please specify param id!', callback);

   }
  } catch (error) {
    logger.error(error);
    return ResponseBuilder.error(error, callback);
  }
};
