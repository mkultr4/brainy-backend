import PARTICIPANT, { Participant } from '../../models/pin/Participant';
import Repository from '../Repository';
import {orm} from '../../models/index';

export default class ParticipantTypeRepository  extends Repository<Participant> {

    constructor() {
        orm.init();
        super(orm.getModel(PARTICIPANT.name));
    }

    findByPin(pinID: string): Promise<Participant | undefined> {
        return new Promise((resolve, reject) => {
            try {
                this.Model.scan()
                .where('pin_id').eq(pinID)
                .exec()
                .then((items: any) => {
                    if (items.length > 0) {
                        resolve(items[0]);
                    }
                    resolve(undefined);
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}
