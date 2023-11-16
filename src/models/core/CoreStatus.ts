import {Schema} from 'dynamoose';
import * as uuid from 'uuid/v4';

const name = 'core_status';
export const schema = new Schema({
    uid: {
        type: String,
        hashKey: true,
        default: uuid(),
    },
    name: {
        type: String,
        requerid: true,
    },
    key: {
        type: String,
        requerid: true,
    },
    description: {
        type: String
    },
    icon: {
        type: String,
        requerid: true
    },
    coreTypeId: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export interface CoreStatus {
    uid?: String;
    name?: String;
    active?: Boolean;
    create_timestamp?: Number;
    last_modified_timestamp?: Number;
}

export default {
  name: name,
  schema: schema
};
