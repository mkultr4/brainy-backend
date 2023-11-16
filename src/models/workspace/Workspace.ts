import * as dynamoose from 'dynamoose';
import * as uuid from 'uuid/v4';

const Schema = dynamoose.Schema;

export const name = `workspace`;

export const schema = new Schema({

    uid:      { type: String, hashKey: true, default: uuid },
    name:     { type: String, required: true },
    active:   { type: Boolean, default: true, },
    owner_id: { type: String },
    deleted:  { type: Boolean, default: false },
    config:   { type: Object }

}, { useDocumentTypes: true, useNativeBooleans: true, timestamps: true });

export interface Workspace {
  uid?: String;
  name?: String;
  active?: Boolean;
  deleted?: Boolean;
  owner_id?: String;
  create_timestamp?: Number;
  last_modified_timestamp?: Number;
  config: Object;
}
export interface WorkspaceKeySchema {
  uid: String;
}
export default {
  name: name,
  schema: schema
};

