
import * as uuid from 'uuid/v4';
import TemplateComponent from './TemplateComponent';

export default class TemplateCategory{

    uid: string = uuid();
    name: string;
    description: string;
    coreId: string;
}

