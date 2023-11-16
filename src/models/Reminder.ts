
import * as uuid from 'uuid/v4';

export default class Reminder{

    uid: string = uuid();

    floatingNoteId: string;

    date: number;

    hour: number;

    notificationType: string;

    notificationValue: number;
    
    deleted: boolean = false;

    createdTimestamp: number;

    updatedTimestamp: number;


}
