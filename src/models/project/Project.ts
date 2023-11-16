import {Schema} from 'dynamoose';
import * as uuid from 'uuid/v4';

const name = 'project';

export const schema = new Schema({
    uid: {
      type: String,
      hashKey: true,
      default: uuid,
    },
    brand_id: {
      type: String
    },
    name: {
      type: String,
      requerid: true,
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

export interface Project {
    uid?: String;
    brand_id: String;
    name?: String;
    active?: Boolean;
    owner_id?: String;
    create_timestamp?: Number;
    deleted?: Boolean;
    last_modified_timestamp?: Number;
  }

  export default {
    name: name,
    schema: schema
  };
