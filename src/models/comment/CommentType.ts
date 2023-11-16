import { Schema } from 'dynamoose';
import * as uuid from 'uuid/v4';

const name = 'comment_type';

export const schema = new Schema({
  uid: { type: String, hashKey: true, default: uuid, },
  name: { type: String }
}, { timestamps: true });

export interface CommentType {
  uid?: String;
  name?: String;
}

export default {
  name: name,
  schema: schema
};
