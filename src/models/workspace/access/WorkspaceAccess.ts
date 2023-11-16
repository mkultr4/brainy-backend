
import * as uuid from 'uuid/v4';
import { Schema } from 'dynamoose';

const name = 'workspace_access';

const schema = new Schema({

  uid:        { type: String, hashKey: true, default: uuid },
  role:       { type: String },
  user:       { type: String },
  workspace:  { type: String },
  category:   { type: String },
  createdBy:  { type: String },
  updatedBy:  { type: String },
  status:     { type: String, default: 'Active' }
}, { useDocumentTypes: true, useNativeBooleans: true, timestamps: true });

export interface WorkspaceAccess {
  uid?: String;
  role: String;
  user: String;
  category?: String;
  createdBy?: String;
  updatedBy?: String;
  status: String;
  workspace: String;
}

export default {
  name: name,
  schema: schema
};
