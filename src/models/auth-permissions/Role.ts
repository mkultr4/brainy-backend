import * as dynamoose from 'dynamoose';
import * as uuid from 'uuid/v4';
import {Permission} from './Permission';

const Schema = dynamoose.Schema;

export const name = `role`;

export const schema = new Schema({

  uid:          { type: String, hashKey: true, default: uuid },
  name:         { type: String, required: true },
  key:          { type: String, required: true },
  description:  { type: String },
  // permissions:  { type: Array }

}, { useDocumentTypes: true, useNativeBooleans: true, timestamps: true });

export interface Role {
  uid?: String;
  name: String;
  key: String;
  description: String;
  permissions?: Permission[];
}

export interface RoleKeySchema {
  uid: String;
}

export default {
  name: name,
  schema: schema
};
