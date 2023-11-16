import {Schema} from 'dynamoose';
import * as uuid from 'uuid/v4';
const name = 'piece';
export const schema = new Schema({
  uid: {
    type: String,
    hashKey: true,
    default: uuid,
  },
  version: {
    type: String,
    rangeKey: true,
    index: {
      name: 'uid-version-index',
      project: true,
      global: true,
    },
  },

  coreId: { type: String },
  createdAt: { type: Number },
  lastModifiedAt: { type: Number },
  deletedAt: { type: Number },
  deleted: { type: Boolean },
  userCreated: { type: String },
  status: { type: String },
  order: { type: Number },
  type_store: { type: String },
  properties: { type: Array },
  bucketInfo: { type: Array }
}, { timestamps: true });

export interface Piece {
  uid: String;
  version: String;
  coreId: String;
  createdAt: Number;
  lastModifiedAt: Number;
  deletedAt: Number;
  deleted: Boolean;
  userCreated: Number;
  status: String;
  order: Number;
  type_store: String;
  properties: String[];
  bucketInfo: String[];
}

  export default {
    name: name,
    schema: schema
  };
