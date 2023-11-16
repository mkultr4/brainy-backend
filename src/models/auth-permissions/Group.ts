import {Schema} from 'dynamoose';
import * as uuid from 'uuid/v4';

const name = 'group';

export const schema = new Schema({
  uid: { type: String, hashKey: true, default: uuid },
  key: { type: String },
  description: { type: String },
  status: { type: String }
}, {  useDocumentTypes: true, useNativeBooleans: true, timestamps: true });

export interface Group {
  uid?: String;
  key: String;
  description: String;
  status: string;
}

export default {
  name: name,
  schema: schema
};
