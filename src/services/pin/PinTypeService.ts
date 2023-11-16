import PinTypeRepository from '../../repositories/pin/PinTypeRepository';

import { PinType } from '../../models/pin/PinType';

import logger from '../../logger';

export default class PinTypeService {

    private pinTypeRepository: PinTypeRepository;

    constructor() {
        this.pinTypeRepository = new PinTypeRepository();
    }

    get(key: any): Promise<PinType | undefined> {
        logger.debug('get method repository:');
        return new Promise<PinType | undefined>(async (resolve, reject) => {
            if (key != null) {
                let type;
                await this.pinTypeRepository.get(key).then((p: any) => {
                    logger.debug('object PinType get:', p);
                    if (p !== undefined) {
                        type =  p;
                    } else {
                        type = undefined;
                    }
                });

                resolve(type);

            } else {
                reject(new Error('Error in function key null or undefined'));
            }
        });
    }

    getPinType(id: string): Promise<PinType> {
        let type: any;
        switch (id) {
            case 'pin':
                type = 1;
                break;
            case 'circle':
                type = 2;
                break;
            case 'rectangle':
                type = 3;
                break;
            default:
                type = id;
                break;
        }

        return new Promise(async (resolve, reject) => {
        if (id != null) {
                logger.debug(`Search pin type: ${type}`);
                const pinType = await this.get(type);

                if (pinType !== undefined) {
                    resolve(pinType);
                    return;
                }
                reject(pinType);
        }
        });
  }
}
