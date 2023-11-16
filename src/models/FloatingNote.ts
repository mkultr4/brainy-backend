
import * as uuid from 'uuid/v4';

export default class FloatingNote{

    uid: string = uuid();
    title: string;
    content: string;
    deleted: boolean = false;
    createdTimestamp: number;
    updatedTimestamp: number;

}
