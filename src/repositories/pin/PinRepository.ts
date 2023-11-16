import PIN, { Pin } from '../../models/pin/Pin';
import Repository from '../Repository';
import {orm} from '../../models/index';

export default class PinRepository  extends Repository<Pin> {

    constructor() {
        orm.init();
        super(orm.getModel(PIN.name));
    }

     findByOriginReference(referenceID: string, field: string): Promise<Array<Pin> | null> {
        return new Promise((resolve, reject) => {
            try {
                this.Model.scan()
                .where(`${field}_reference`).eq(referenceID)
                .exec()
                .then(items => {
                    if (items.length > 0) {
                        resolve(items);
                    }
                    resolve(null);
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}
