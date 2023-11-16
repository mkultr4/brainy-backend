import { Schema } from 'dynamoose';
import * as uuid from 'uuid/v4';

const name = 'participant';

export const schema = new Schema({
  uid: { type: String, hashKey: true, default: uuid },
  type: { type: String },
  pin_id: { type: String },
  users: { type: Object }
}, { timestamps: true });

export interface Participant {
  uid?: String;
  type?: String;
  pin_id: String;
  users?: Object;
}

export default {
  name: name,
  schema: schema
};
