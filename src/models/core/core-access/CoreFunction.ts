import {Schema} from 'dynamoose';
import * as uuid from 'uuid/v4';

const name = 'core_function';

export const schema = new Schema({
  uid: { type: String, hashKey: true, default: uuid },
  description: { type: String },
  groupId: { type: String }
}, {  useDocumentTypes: true, timestamps: true });

export interface CoreFunction {
  uid?: String;
  description?: String;
  groupId?: String;
}

export default {
  name: name,
  schema: schema
};
