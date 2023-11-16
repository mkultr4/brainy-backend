import { Schema } from 'dynamoose';
import * as uuid from 'uuid/v4';

const name = 'participant_type';

export const schema = new Schema({
  uid: { type: String, hashKey: true, default: uuid },
  key: { type: String },
  name: { type: String },
  ico: { type: String }
}, { timestamps: true });

export interface ParticipantType {
  uid?: String;
  key?: String;
  name?: String;
  ico?: String;
}

export default {
  name: name,
  schema: schema
};
