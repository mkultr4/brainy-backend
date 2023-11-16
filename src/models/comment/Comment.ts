import { Schema } from 'dynamoose';
import * as uuid from 'uuid/v4';
const name = 'comment';

export const schema = new Schema({
  uid: { type: String, hashKey: true, default: uuid, },
  title: { type: String },
  value: { type: Object },
  comment_type_id: { type: String },
  owner_id: { type: String },
  deleted: { type: Boolean, default: false }
}, { timestamps: true });

export interface Comment {
    uid?: String;
    title?: String;
    value?: Object;
    comment_type_id?: Boolean;
    owner_id?: String;
    deleted?: Boolean;
  }

export default {
  name: name,
  schema: schema
};
