import { Schema } from 'dynamoose';
import * as uuid from 'uuid/v4';

const name = 'pin';

export const schema = new Schema({
  uid: { type: String, hashKey: true, default: uuid, },
  origin_reference: { type: String },
  type_id: { type: String },
  status: { type: Object },
  config_setting: { type: Object },
  destination_reference: { type: String },
  creation_date: { type: Number },
  order: { type: String },
  status_change_by: { type: String },
  owner_id: { type: String },
  deleted: { type: Boolean, default: false }
}, { timestamps: true });

export interface Pin {
  uid?: String;
  origin_reference?: String;
  type_id?: String;
  status?: Object;
  config_setting: Object;
  destination_reference?: String;
  creation_date?: Number;
  order?: String;
  owner_id?: String;
  deleted?: Boolean;
}

export default {
  name: name,
  schema: schema
};
