import {Schema} from 'dynamoose';
import * as uuid from 'uuid/v4';

const name = 'core_access';
// Permisos de visivilidad
export const schema = new Schema({
  uid: { type: String, hashKey: true, default: uuid },
  workspaceAccessId: { type: String },
  coreId: { type: String },
  groupId: { type: String },
  status: { type: String },
  createdBy: { type: String },
  updateBy: { type: String },
  deleteBy: { type: String },
  deleted: { type: Boolean }
}, {  useDocumentTypes: true, useNativeBooleans: true, timestamps: true });

export interface CoreAccess {
  uid?: String;
  workspaceAccessId: String;
  coreId: String;
  groupId?: String;
  status?: String;
  createdBy?: String;
  updateBy?: String;
  deleteBy?: String;
  deleted?: Boolean;
}

export default {
  name: name,
  schema: schema
};
