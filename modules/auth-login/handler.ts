import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import logger from '../../src/logger';
const AWS = require('aws-sdk'),
  documentClient = new AWS.DynamoDB.DocumentClient();

export const login: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  logger.info('signIn Method handler v1.0.0 env: ' + process.env.NODE_ENV);
  const body = event.body ? JSON.parse(event.body) : {};
  // const envName = config.envName;
  // const bcrypt = require('bcryptjs');
  const { profile } = body;
  logger.info(profile);
  let params = {};
  // const table = documentClient.getTable('brainy-users');
  params = {
    TableName: 'br_user_test',
    FilterExpression: 'email = :email',

    ExpressionAttributeValues: {
      ':email': profile.email
    }
  };
  switch (profile.provider) {
    case 'FACEBOOK':
      params = {
        TableName: 'br_user_test',
        FilterExpression: 'email = :email and tokenId = :tokenId',
        ExpressionAttributeValues: {
          ':email': profile.email,
          ':tokenId': profile.id
        }
      };
      break;
    case 'GOOGLE':
      params = {
        TableName: 'br_user_test',
        FilterExpression: 'email = :email and tokenId = :tokenId',
        ExpressionAttributeValues: {
          ':email': profile.email,
          ':tokenId': profile.id
        }
      };
      break;
  }
  documentClient.scan(params, function (err, data) {
    if (err) {
      const response = {
        statusCode: 500,
        body: JSON.stringify({
          message: err.message,
          input: event,
          error: err
        }),
      };
      cb(null, response);
    } else {
      const items = data.items;
      if (items.length > 0) {
        const user = items[0];
        const response = {
          statusCode: 404,
          body: JSON.stringify({
            message: 'User not found!',
            input: event,
            user: user
          }),
        };
        cb(null, response);
      } else {
        // documentClient.
        const response = {
          statusCode: 404,
          body: JSON.stringify({
            message: 'User not found!',
            input: event,
          }),
        };
        cb(null, response);
      }
    }
  });


};
