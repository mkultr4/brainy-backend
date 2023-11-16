import { Schema } from 'dynamoose';
import * as uuid from 'uuid/v4';

export const name = `invitation`;

export enum INVITATION_LEVEL {
  WORKSPACE = 'WORKSPACE',
  CORE = 'CORE'
}

export enum INVITATION_STATUS {
  PENDING = 'PENDING',
  CANCELED = 'CANCELED',
  CONFIRMED = 'CONFIRMED'
}

export enum INVITATION_TYPES {
  WORKSPACE_USER = 'WORKSPACE_USER',
  EXISTING_USER = 'EXISTING_USER',
  NEW_USER = 'NEW_USER'
}

export const schema = new Schema({

  uid:              { type: String, hashKey: true, default: uuid },
  email:            { type: String },
  user:             { type: String },
  role:             { type: String, required: true },
  type:             { type: String },
  level:            { type: String },
  reference:        { type: String },
  workspace:        { type: String, required: true },
  group:            { type: String },
  category:         { type: String },
  createdBy:        { type: String },
  updatedBy:        { type: String },
  active:           { type: Boolean, default: true },
  status:           { type: String, default: INVITATION_STATUS.PENDING },
  canceledDate:     { type: Number },
  canceledBy:       { type: String },
  confirmationDate: { type: Number }

}, { useDocumentTypes: true, useNativeBooleans: true, timestamps: true });

export interface Invitation {
  uid?: String;
  email?: String;
  user?: String;
  role: String;
  type: String;
  level: String;
  reference: String;
  workspace: String;
  group?: String;
  category?: String;
  categoryName?: String;
  createdBy?: String;
  updatedBy?: String;
  active?: Boolean;
  status: String;
  canceledDate: Number;
  canceledBy: String;
  confirmationDate: Number;
}

export default {
  name: name,
  schema: schema,
  config : {
    statics: {
      status : INVITATION_STATUS,
      level:  INVITATION_LEVEL,
      types: INVITATION_TYPES
    }
  }
};
