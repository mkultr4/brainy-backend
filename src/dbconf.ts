import config from './conf';
import logger from './logger';
import * as dynamoose from 'dynamoose';

export default {
    config: (model?: string) => {
      dynamoose.setDefaults({
        suffix: config.DB_SUBFIX,
        prefix: config.DB_PREFIX,
        create: config.DB_CREATE_GENERATE,
        update: config.DB_UPDATE_GENERATE
      });

      const region = config.DB_REGION;

      dynamoose.AWS.config.update({
        region: region
      });

      if (config.DB_LOCAL) {
        logger.debug(`Loading data to local dynamodb`);
        logger.debug(`region: ${config.DB_REGION} host ${config.DB_HOST} port: ${config.DB_PORT}`);
        dynamoose.local(config.DB_HOST + ':' + config.DB_PORT);
      }
    },
    configTemp: (orm: any) => {
      orm.setDefaults({
        suffix: config.DB_SUBFIX,
        prefix: config.DB_PREFIX,
        create: config.DB_CREATE_GENERATE,
        update: config.DB_UPDATE_GENERATE
      });

      const region = config.DB_REGION;

      orm.AWS.config.update({
        region: region
      });

      if (config.DB_LOCAL) {
        logger.debug(`Loading data to local dynamodb`);
        logger.debug(`region: ${config.DB_REGION} host ${config.DB_HOST} port: ${config.DB_PORT}`);
        orm.local(config.DB_HOST + ':' + config.DB_PORT);
      }
    }
};


