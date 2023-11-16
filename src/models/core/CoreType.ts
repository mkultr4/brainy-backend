import {Schema} from 'dynamoose';
import * as uuid from 'uuid/v4';
const name = 'core_type';
export const schema = new Schema({
    uid: {
      type: String,
      hashKey: true,
      default: uuid,
    },
    name: {
      type: String,
      requerid: true,
    },
    active: {
      type: Boolean,
      default: true
    }
}, { timestamps: true });

export interface CoreType {
    uid?: String;
    name?: String;
    active?: Boolean;
    create_timestamp?: Number;
    last_modified_timestamp?:  Number;
  }

  export default {
    name: name,
    schema: schema
  };
