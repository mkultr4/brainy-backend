import ParticipantTypeRepository from '../../repositories/pin/ParticipantTypeRepository';

import { ParticipantType } from '../../models/pin/ParticipantType';

import logger from '../../logger';
import Service from '../Service';

export default class ParticipantTypeService extends Service<ParticipantTypeRepository, ParticipantType> {

    constructor() {
        super(new ParticipantTypeRepository());
    }

    saveAs(participantType: any) {
        return new Promise<ParticipantType>(async (resolve, reject) => {
            if (participantType !== undefined && participantType != null) {
                resolve(await this.MRepository.save(participantType).then(async (p: ParticipantType) => {
                    logger.debug('object ParticipantType saved:', p);
                    return await p;
                }));
            }
        });
    }

    updateAs(key: any, participantType: any) {
        return new Promise<ParticipantType>(async (resolve, reject) => {
            if (participantType !== undefined && participantType != null) {
                resolve(this.MRepository.update(key, participantType).then((p: ParticipantType) => {
                    logger.debug('object ParticipantType update: ', p);
                    return p;
                }));
            }
        });
    }

    getAs(id: string) {
        return new Promise(async (resolve, reject) => {
            if (id !== undefined && id != null) {
                await this.MRepository.get(id).then(async (p: any) => {
                    logger.debug('get ParticipantType:', p);
                    resolve(p);
                });
            }
        });
    }

    findByKey(key: any) {
        return new Promise<any>(async (resolve, reject) => {
            if (key !== undefined && key != null) {
                logger.debug(`Search participant by pin with pin_id: ${key}`);
                const participant = await this.MRepository.findByKey(key).then(async (p: ParticipantType) => {
                    logger.debug('find ParticipantType by pin:', p);
                    if (p !== undefined) {
                        resolve(p);
                    } else {
                        logger.debug('returned undefined in participant type');
                        reject(new Error(`Search participant type not found with pint_id: ${key}`));
                    }
                });

                resolve(participant);
            }
        });
    }
}
