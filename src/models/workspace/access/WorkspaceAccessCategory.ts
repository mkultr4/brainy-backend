import { Schema } from 'dynamoose';
import * as uuid from 'uuid/v4';

const name = `workspace_access_category`;

const schema = new Schema({

  uid: { type: String, hashKey: true, default: uuid },
  name: { type: String, required: true },
  workspace: { type: String, required: true },
  createdBy: { type: String },
  updatedBy: { type: String },
  active: { type: Boolean, default: true }

}, { useDocumentTypes: true, useNativeBooleans: true, timestamps: true });

export interface WorkspaceAccessCategory {
  uid?: String;
  name: String;
  workspace: String;
  createdBy?: String;
  updatedBy?: String;
  active: boolean;
}

export default {
  name: name,
  schema: schema
};

