import {Schema} from 'dynamoose';
import * as uuid from 'uuid/v4';

const name = 'core';
/**
 * workspaceId To know all our cores
 */
const schema = new Schema({
    uid: {
      type: String,
      hashKey: true,
      default: uuid,
    },
    project_id: {
      type: String
    },
    title: {
      type: String,
      requerid: true,
    },
    owner_id: {
      type: String
    },
    core_type_id: {
      type: Object
    },
    thumbnail: {
      type: String
    },
    workspaceId: {
      type: String
    },
    reference_id: {
      type: String
    },
    reference_name: {
      type: String
    },
    parent_id: {
        type: String
    },
    create_timestamp: {
        type: Number
    },
    last_modified_timestamp: {
        type: Number
    },
    active: {
        type: Boolean,
        default: true
    },
    deleted: {
        type: Boolean,
        default: false
    },
    status: {
        type: Object
    },
    user_approved: {
        type: String
    },
    user_rejected: {
        type: String
    },
    date_rejected_at: {
        type: Number
    },
    date_approved_at: {
        type: Number
    }
  }, {  useDocumentTypes: true, useNativeBooleans: true, timestamps: true  });

export interface Core {
    uid?: String;
    project_id: String;
    title?: String;
    owner_id?: String;
    core_type_id?: Object;
    thumbnail?: String;
    reference_id?:  String;
    reference_name: String;
    parent_id: String;
    create_timestamp: Number;
    last_modified_timestamp: Number;
    active: Boolean;
    deleted?: Boolean;
    status: Object;
    user_approved: String;
    user_rejected: String;
    date_rejected_at: Number;
    date_approved_at: Number;
    workspaceId: String;
  }

  export default {
    name: name,
    schema: schema
  };
