'strict'
import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';

export const save: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const response = {
    statusCode: 201,
    body: JSON.stringify({
      message: 'save brief',
      input: event,
    }),
  };

  cb(null, response);
}


export const update: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'update brief',
      input: event,
    }),
  };

  cb(null, response);
}

export const erase: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'delete brief',
      input: event,
    }),
  };

  cb(null, response);
}


export const get: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'get brief',
      input: event,
    }),
  };

  cb(null, response);
}

export const page: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'save brief',
      input: event,
    }),
  };

  cb(null, response);
}

export const list: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'list brief',
      input: event,
    }),
  };

  cb(null, response);
}

