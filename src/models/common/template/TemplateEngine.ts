
import * as uuid from 'uuid/v4';
import TemplateComponent from './TemplateComponent';

export default class TemplateEngine{

    uid: string = uuid();
    active: boolean = false;
    components: Array<TemplateComponent> = new Array<TemplateComponent>();
    createdTimestamp: number;
    lastModifiedTimestamp: number;
    userCreatedId: string;
    userUpdatedId: string;

}

