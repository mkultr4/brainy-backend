import PIN_TYPE, { PinType } from '../../models/pin/PinType';
import Repository from '../Repository';
import {orm} from '../../models/index';

export default class PinTypeRepository  extends Repository<PinType> {

    constructor() {
        orm.init();
        super(orm.getModel(PIN_TYPE.name));
    }
}
