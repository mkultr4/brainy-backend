import {Schema} from 'dynamoose';
import * as uuid from 'uuid/v4';

const name = 'brand';
export const schema = new Schema({
    uid: {
      type: String,
      hashKey: true,
      default: uuid,
    },
    workspace_id: {
      type: String
    },
    name: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true
    },
    owner_id: {
      type: String
    },
    create_timestamp: {
      type: Number
    },
    deleted: {
      type: Boolean,
      default: false
    },
    last_modified_timestamp: {
      type: Number
    },
  }, { timestamps: true });

export interface Brand {
    uid?: String;
    workspace_id?: String;
    name?: String;
    active?: Boolean;
    owner_id?: String;
    create_timestamp?: Number;
    deleted?: Boolean;
    last_modified_timestamp?:  Number;
  }

  export default {
    name: name,
    schema: schema
  };
