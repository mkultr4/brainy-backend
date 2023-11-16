import { Schema } from 'dynamoose';
import * as uuid from 'uuid/v4';

const name = 'thread_comment';

export const schema = new Schema({
  uid: { type: String, hashKey: true, default: uuid },
  comment_id: { type: String },
  parent_id: { type: String },
  value: { type: String },
  comment_type_id: { type: String },
  owner_id: { type: String },
  deleted: { type: Boolean, default: true }
}, { timestamps: true });

export interface ThreadComment {
  uid?: String;
  comment_id?: String;
  parent_id?: String;
  value?: String;
  comment_type_id?: String;
  owner_id?: String;
  deleted?: Boolean;
}

export default {
  name: name,
  schema: schema
};
