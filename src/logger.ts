import config from './conf';
const winston = require('winston');

const level = config.LOG_LEVEL || 'debug';

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: level,
      timestamp: function() {
        return new Date().toISOString();
      },
      json: false,
      stringify: (obj: any) => JSON.stringify(obj)
    })
  ]
});

export default logger;
