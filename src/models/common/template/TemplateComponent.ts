
import * as uuid from 'uuid/v4';


export default class TemplateComponent{

    uid: string = uuid();
    createdTimestamp: number;
    lastModifiedTimestamp: number;
    userCreatedId: string;
    userUpdatedId: string;
}

