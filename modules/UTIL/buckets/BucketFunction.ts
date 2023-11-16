import { ApiEvent, ApiCallback, ApiContext, Handler } from '../../../src/interfaces/Api';
import ResponseBuilder from '../../../src/util/builders/ResponseBuilder';
import { S3FileStorageService, Operation, OperationBucketWait } from '../../../src/util/services/S3FileStorageService';
import logger from '../../../src/logger';

const s3FileStorageService: S3FileStorageService = new S3FileStorageService();

/**
 * Creates presigned url
 * @param event ApiEvent
 * @param context ApiContext
 * @param callback ApiCallback
 */
export const createSignedUrl: Handler = async (event: ApiEvent, context: ApiContext, callback: ApiCallback) => {
  try {
    logger.info('Our operation createSignedUrl has event: ' + event);
    const body = JSON.stringify(event);
    const _json = JSON.parse(body);
    let operation = Operation.putObject;
    logger.info('_json ', _json);
    if (event.queryStringParameters != null) {
      logger.info('queryStringParameters');
      logger.info(event.queryStringParameters.bucket);
      logger.info(event.queryStringParameters.path);
      logger.info(event.queryStringParameters.operation);

      if (event.queryStringParameters.operation && event.queryStringParameters.operation === 'getObject') {
        operation = Operation.getObject;
      }
      // if (_json.expiries && !isNaN(_json.expiries)) expiries = _json.expiries;

      const urlSigned: any = await s3FileStorageService
          .createUrlPreSigned(event.queryStringParameters.bucket,
             event.queryStringParameters.path, operation, null);
      if (urlSigned == null) {
        return ResponseBuilder.badRequest('invalid params!', callback);
      }

      return ResponseBuilder.ok(urlSigned, callback);
    } else {
      return ResponseBuilder.badRequest('Please specify params!', callback);
    }
  } catch (error) {
    logger.error(error);
    return ResponseBuilder.internalServerError(error, callback);
  }
};

  /**
 * Creates presigned url
 * @param event ApiEvent
 * @param context ApiContext
 * @param callback ApiCallback
 */
export const putObjectS3: Handler = async (event: ApiEvent, context: ApiContext, callback: ApiCallback) => {
  try {
    logger.info('Our operation putObjectS3 has event: ' + event);
    const body = JSON.stringify(event);
    const _json = JSON.parse(body);
    const _body = JSON.parse(_json.body);

    logger.debug('_json => parse ', _body);
    logger.debug('_json => bucketName ', _body.bucketName);
    logger.debug('_json => path ', _body.path);
    logger.debug('_json => contentType ', _body.contentType);
    logger.debug('_json => file ', _body.file);
    if (_body != null) {
      const _objectCreated: any = await s3FileStorageService.upload(
        _body.bucketName,
        _body.path,  _body.file,
        _body.contentType,
        'public-read'
      );

      if (_objectCreated == null) {
        return ResponseBuilder.badRequest('invalid params!', callback);
      }

      return ResponseBuilder.ok(_objectCreated, callback);
    } else {
      return ResponseBuilder.badRequest('Please specify params!', callback);
    }
  } catch (error) {
    logger.error(error);
    return ResponseBuilder.internalServerError(error, callback);
  }
};

export const objectExists: Handler = async (event: ApiEvent, context: ApiContext, callback: ApiCallback) => {
  try {
    logger.info('Our operation objectExists has event: ' + event);
    const body = JSON.stringify(event);
    const _json = JSON.parse(body);
    let operation = OperationBucketWait.objectExists;
    logger.info('_json ', _json);
    if (event.queryStringParameters != null) {
      logger.info('queryStringParameters');
      logger.info(event.queryStringParameters.bucket);
      logger.info(event.queryStringParameters.path);
      logger.info(event.queryStringParameters.operation);

      if (event.queryStringParameters.operation && event.queryStringParameters.operation === 'objectExists') {
        operation = OperationBucketWait.objectExists;
      }
      // if (_json.expiries && !isNaN(_json.expiries)) expiries = _json.expiries;

      const success: any = await s3FileStorageService
          .waitForObjectExits(event.queryStringParameters.bucket,
             event.queryStringParameters.path, operation);
      if (success == null) {
        return ResponseBuilder.badRequest('invalid params!', callback);
      }
      return ResponseBuilder.ok('OK', callback);
    } else {
      return ResponseBuilder.badRequest('Please specify params!', callback);
    }
  } catch (error) {
    logger.error(error);
    return ResponseBuilder.internalServerError(error, callback);
  }
};
