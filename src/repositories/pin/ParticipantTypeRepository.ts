import PARTICIPANT_TYPE, { ParticipantType } from '../../models/pin/ParticipantType';
import Repository from '../Repository';
import {orm} from '../../models/index';

export default class ParticipantTypeRepository  extends Repository<ParticipantType> {

    constructor() {
        orm.init();
        super(orm.getModel(PARTICIPANT_TYPE.name));
    }

    findByKey(pinID: string): Promise<ParticipantType | null> {
        return new Promise((resolve, reject) => {
            try {
                this.Model.scan()
                .where('key').eq(pinID)
                .exec()
                .then((items: any) => {
                    if (items.length > 0) {
                        resolve(items[0]);
                    }
                    resolve(null);
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}
