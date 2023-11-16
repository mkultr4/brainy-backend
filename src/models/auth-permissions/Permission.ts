import * as dynamoose from 'dynamoose';
import * as uuid from 'uuid/v4';
// import db from '../../dbconf';

const Schema = dynamoose.Schema;
// db.config();
export const name = `permission`;

export const schema = new Schema({

  uid:        { type: String, hashKey: true, default: uuid },
  permission: { type: String, required: true }

}, { useDocumentTypes: true, useNativeBooleans: true, timestamps: true });

export interface Permission {
  uid?: String;
  permission: String;
}

export interface PermissionKeySchema {
  uid: String;
}

export default {
  name: name,
  schema: schema
};
