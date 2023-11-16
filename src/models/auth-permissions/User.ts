import * as uuid from 'uuid/v4';
import * as dynamoose from 'dynamoose';

const Schema = dynamoose.Schema;

export const name = `user`;

export const schema = new Schema({

  uid:                    { type: String, hashKey: true, default: uuid },
  email:                  { type: String },
  password:               { type: String },
  firstName:              { type: String },
  lastName:               { type: String },
  name:                   { type: String },
  photoUrl:               { type: String },
  tokenId:                { type: String },
  phoneNumber:            { type: Number },
  acronym:                { type: String },
  confirmed:              { type: Boolean },
  confirmationTimestamp:  { type: Number },
  firstLoginTimestamp:    { type: Number },
  lastLoginTimestamp:     { type: Number },
  active:                 { type: Boolean, default: false },
  provider:               { type: String },
  authToken:              { type: String }

}, { useDocumentTypes: true, useNativeBooleans: true, timestamps: true });

export interface User {
  uid?: String;
  email: String;
  password?: String;
  firstName?: String;
  lastName?: String;
  name?: String;
  photoUrl?: String;
  tokenId?: String;
  phoneNumber?: Number;
  acronym?: String;
  confirmed: Boolean;
  confirmationTimestamp?: Number;
  firstLoginTimestamp?: Number;
  lastLoginTimestamp?: Number;
  active: Boolean;
  authToken?: String;
  provider: String;
}

export interface UserKeySchema {
  uid: String;
}

export default {
  name: name,
  schema: schema
};
