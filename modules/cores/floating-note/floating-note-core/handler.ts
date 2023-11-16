import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
// import FloatingNote from '../../../../src/models/FloatingNote';
// import FloatingNoteService from '../../../../src/services/FloatingNoteService';

export const save: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {

  try {
    // const floatingNoteService = new FloatingNoteService();
    // const body = JSON.stringify(event);
    // const floatingNote =  Object.assign(new FloatingNote(),JSON.parse(body));

    // console.log(floatingNote);
    // floatingNoteService.create(floatingNote);

    const response = {
      statusCode: 200,
      body: {
        message: 'Floating note created',
        // content:floatingNote
      }
    };

    cb(null, response);
  } catch (e) {
    cb(new Error(e.message));
  }
};

export const update: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {

  try {
    // const floatingNoteService = new FloatingNoteService();
    // const body = JSON.stringify(event);
    // const floatingNote =  Object.assign(new FloatingNote(),JSON.parse(body));

    // floatingNoteService.update(floatingNote);

    const response = {
      statusCode: 200,
      body: {
        message: 'Floating note updated',
        // content:floatingNote
      }
    };

    cb(null, response);
  } catch (e) {
    cb(new Error(e.message));
  }
};

export const erase: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {

  try {
    // let floatingNoteService = new FloatingNoteService();
    const pathParameters = JSON.stringify(event.pathParameters);
    const uid =   pathParameters['uid'];

    // floatingNoteService.delete(uid);

    const response = {
      statusCode: 200,
      body: {
        message: 'Floating note deleted',
        content: uid
      }
    };

    cb(null, response);
  } catch (e) {
    cb(new Error(e.message));
  }
};


export const get: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {

  try {

    // let floatingNoteService = new FloatingNoteService();
    const body = JSON.stringify(event);
    // let uid =   pathParameters['uid'];

    // let floatingNote = floatingNoteService.get(uid);

    const response = {
      statusCode: 200,
      body: {
        message: 'Floating Note by id',
        content: body
      }
    };

    cb(null, response);
  } catch (e) {
    cb(new Error(e.message));
  }
};


export const list: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {

  try {
    // const floatingNoteService = new FloatingNoteService();
    // const body = JSON.stringify(event);
    // const limit =  JSON.parse(body);

    // const floatingNotes = floatingNoteService.list(limit);

    const response = {
      statusCode: 200,
      body: {
        message: 'Floating Notes',
        // content: floatingNotes
      }
    };

    cb(null, response);
  }  catch (e) {
    cb(new Error(e.message));
  }
};
