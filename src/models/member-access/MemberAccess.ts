import * as dynamoose from 'dynamoose';
import * as uuid from 'uuid/v4';
import dbconf from '../../dbconf';

const Schema = dynamoose.Schema;
dbconf.configTemp(dynamoose);

export const schema = new Schema({
  uid: {
    type: String,
    hashKey: true,
    default: uuid,
  },
  roleId: {
    type: String
  },
  userId: {
    type: String
  },
  referenceId: {
    type: String
  },
  levelAccess: {
    type: String
  },
  hasParent: {
    type: Boolean
  },
  parent: {
    type: String
  }
},
{
    timestamps: true
});

export interface MemberAccess {
  uid?: String;
  roleId?: String;
  userId: String;
  referenceId: String;
  levelAccess: String;
  hasParent: Boolean;
  parent?: String;
}

export interface MemberAccessKeySchema {
    uid: String;
}

const Model = dynamoose.model<MemberAccess, MemberAccessKeySchema>(`member_access`, schema);

export default Model;
