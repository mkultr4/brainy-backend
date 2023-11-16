import PinRepository from '../../repositories/pin/PinRepository';
import PinTypeService from './PinTypeService';
import ParticipantService from './ParticipantService';
import CommentService from '../comment/CommentService';

import { Pin } from '../../models/pin/Pin';
import Service from '../Service';

// import MemberAccessService from '../member-access/MemberAccessService';

import logger from '../../logger';
import { Participant } from '../../models/pin/Participant';
import { CoreAccessPermissionException } from '../../util/errors/Error';

export default class PinService extends Service<PinRepository, Pin>  {

    private pinTypeService: PinTypeService;
    private participantService: ParticipantService;
    private commentService: CommentService;
    // private memberAccess: MemberAccessService;

    constructor() {
        super(new PinRepository());
        this.pinTypeService = new PinTypeService();
        this.participantService = new ParticipantService();
        this.commentService = new CommentService();
        // this.memberAccess = new MemberAccessService();
    }

    saveAs(auth: any, pin: any) {
        logger.debug('save method repository:');
        return new Promise<Pin>(async (resolve, reject) => {
            if (pin != null) {
                logger.debug('creating model from service to repository from pin:');
                try {

                    if (pin.origin_reference !== auth.core.uid) {
                        reject(new CoreAccessPermissionException('User permission not found'));
                    }

                    logger.debug('pint type: ', pin.type);
                    const type = await this.pinTypeService.getPinType(pin.type.toLowerCase());

                    if (type === undefined) {
                        logger.debug('pin type undefined throw exception');
                        reject(new Error(`PinType not found with key: ${pin.type}`));
                        return;
                    }

                    const valid = await this.validateCreateField(pin);
                    if (valid) {

                        let comment: any;
                        if (pin.data !== undefined && pin.data.comment !== undefined) {
                            comment = await this.commentService.saveAs(auth.user, pin.data.comment).catch((err) => {
                                reject(err);
                            });
                        }

                        if ((comment === undefined && pin.destination_reference === undefined) ||
                           (comment !== undefined && pin.destination_reference !== undefined)) {
                            reject(new Error('Comment or destination_reference are requerid in the request'));
                        }

                        const  referenceId = (comment !== undefined) ? comment.uid : pin.destination_reference;
                        const finalJSON = await this.buildJSONPin(auth.user, pin, type, referenceId);
                        let result;

                        await this.MRepository.save(finalJSON).then(async (p: Pin) => {
                            logger.debug('object Pin saved:', p);
                            const participant = await this.buildParticipan(pin.participant, p.uid as string);
                            const savedParticipantType = await this.saveParticipant(participant);

                            logger.debug('result saved: ', savedParticipantType);
                            if (!savedParticipantType === undefined) {
                                reject(new Error(`Error in save to participant type`));
                            }

                            result =  await this.buildCompletePin(p, savedParticipantType, type, comment);
                        });

                        logger.debug('result build pin', result);
                        resolve(result);
                    } else {
                        reject(new Error(`The filds origin_reference, type and config_setting are requerid`));
                    }
                } catch (err) {
                    logger.debug('catch error', err);
                    reject(new Error(err));
                }

            } else {
                reject(new Error('Error in function save object null or undefined'));
            }
        });
    }

    updateAs(auth: any, key: any, pin: any) {
        logger.debug('update method repository:');
        return new Promise<any>(async (resolve, reject) => {
            if (pin != null && key != null ) {

                logger.debug(`key: ${key}`);
                logger.debug('content from update:');
                logger.debug(pin);

                let exist;
                await this.MRepository.get(key).then((p: any) => {
                    logger.debug('object Pin get:', p);
                    if (p.origin_reference !== auth.core.uid) {
                        reject(new CoreAccessPermissionException('User permission not found'));
                    }
                    exist = (p === null || p === undefined ) ? false : true;
                });

                if (!exist) {
                    reject(new Error(`Update not found with key ${key}`));
                    return;
                }

                let result;
                if (pin.hasOwnProperty('status')) {
                    pin.status_change_by = auth.user.uid;
                }

                await this.MRepository.update(key, pin).then(async (p: Pin) => {
                    logger.debug('object Pin updated:', p);

                    logger.debug('participant json: ', pin.participant);
                    const updatedParticipantType = await this.updateParticipant(pin.participant, p)
                    .catch((err) => {
                        reject(new Error(err));
                    });
                    const type = await this.pinTypeService.getPinType(p.type_id as string);

                    logger.debug('result saved: ', updatedParticipantType);
                    if (!updatedParticipantType === undefined) {
                        reject(new Error(`Error in update to participant type`));
                    }

                    result =  await this.buildCompletePin(p, updatedParticipantType, type);
                }).catch((err) => {
                    reject(err);
                });

                resolve(result);

            } else {
                reject(new Error('Error in function update object null or undefined'));
            }
        });
    }

    deleteAs(auth: any, key: any, workspaceID: string): Promise<undefined> {
        logger.debug('delete method repository:');
        return new Promise<undefined>(async (resolve, reject) => {
            if (key != null) {
                const pin = await this.getAs(auth, key, workspaceID);

                if (pin.origin_reference !== auth.core.uid) {
                    reject(new CoreAccessPermissionException('User permission not found'));
                }

                if (pin === undefined) {
                    reject(new Error(`Pin not found with key: ${key}`));
                }

                // const permission = await this.memberAccess.getPermission(user.uid, { level: 'CORE', reference: pin.origin_reference });
                // logger.debug('permission', permission);

                // if (!permission) {
                //     throw new Error('user core permission is not allowed');
                // }

                logger.debug('deleted object');
                resolve(this.MRepository.delete(key).then(() => {
                    return undefined;
                }));
            } else {
                reject(new Error('Error in function deleted object null or undefined'));
            }
        });
    }

    logicalChangeDelete(key: any, deleted: boolean, workspaceID: string) {
        logger.debug('save method repository:');
        return new Promise<any>(async (resolve, reject) => {
          if (key != null) {
            logger.debug('creating model from service to repository:');

            const comment: any = await this.MRepository.get(key);

            if (!comment) {
                reject(new Error(`Search not found. Comment with uid ${key} don't exist`));
            }

            const params = { deleted: deleted };

            resolve(await this.MRepository.update(key, params).then(async (pin: Pin) => {
              logger.debug('object updated:', pin);

              if (pin.destination_reference) {
                await this.commentService.logicalChangeDelete(pin.destination_reference, true);
              }
              const participant = await this.participantService.findByPin(pin, workspaceID);
              const type = await this.pinTypeService.getPinType(pin.type_id as string);

              const result =  await this.buildCompletePin(pin, participant, type);

              return result;
            }));
          } else {
            reject(new Error('Error in function save object null or undefined'));
          }
        });
      }

    getAs(auth: any, key: any, workspaceID: string) {
        logger.debug('get method repository:');
        return new Promise<any>( async(resolve, reject) => {
            if (key != null) {
                let result;
                logger.debug('repository content:', this.MRepository);
                await this.MRepository.get(key).then(async (p: any) => {

                    if (p.origin_reference !== auth.core.uid) {
                        reject(new CoreAccessPermissionException('User permission not found'));
                    }

                    logger.debug('object Pin get:', p);
                    if (p !== undefined) {

                        logger.debug('workspace_id: ', workspaceID);
                        const participant = await this.participantService.findByPin(p.uid, workspaceID);
                        logger.debug('participan: ', participant);
                        logger.debug('type_id', p.type_id);
                        const type = await this.pinTypeService.getPinType(p.type_id as string);
                        logger.debug('type: ', p.type_id);

                        if (participant !== undefined) {
                            result = await this.buildCompletePin(p, participant, type);
                        } else {
                            result = await this.buildCompletePin(p, participant, type);
                        }
                    } else {
                        reject(new Error(`Search not found with key: ${key}`));
                    }
                }).catch((err) => {
                    reject(err);
                });

                resolve(result);
            } else {
                reject(new Error('Error in function key null or undefined'));
            }
        });
    }

    listAs(auth: any, key: any, pin: any): Promise<Array<Pin>> {
        logger.debug('get method repository:');
        return new Promise<Array<Pin>>((resolve, reject) => {
            if (key != null) {
                resolve(this.MRepository.list().then((p: Array<Pin>) => {
                    logger.debug('object Pin get:', p);
                    return p.filter(element => element.origin_reference === auth.core.uid);
                }));
            } else {
                reject(new Error('Error in function get object null or undefined'));
            }
        });
    }

    public findByReference(auth: any, referenceId: string, field: string, workspaceID: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            if (referenceId != null) {

                logger.debug(`${field}_reference: ${referenceId}`);
                const pins = await this.MRepository.findByOriginReference(referenceId, field);

                const finalList = new Array();
                if (pins != null && pins !== undefined) {
                    for (const pin of pins ) {
                        if (pin.origin_reference === auth.core.uid) {
                            logger.debug('pin data: ', pin);
                            const participant = await this.participantService.findByPin(pin.uid, workspaceID).catch((err) => {
                                logger.debug(err);
                            });
                            const type = await this.pinTypeService.getPinType(pin.type_id as string);

                            logger.debug('pin content: ', pin);

                            logger.debug(`pin ${field} reference: ${pin.destination_reference}`);
                            let comment;

                            if (pin.destination_reference !== undefined) {
                                comment = await this.commentService.getAs(pin.destination_reference as string, workspaceID).catch((err) => {
                                    logger.debug('error in comment service: ', err);
                                });
                            }

                            logger.debug('comment pin: ', comment);
                            const row = await this.buildCompletePin(pin, participant, type, comment);
                            finalList.push(row);
                        }
                    }

                    if (finalList != null) {
                        resolve(finalList);
                    } else {
                        reject(new Error(`Search not found with ${field}_reference: ${referenceId}`));
                    }
                } else {
                    reject(new Error(`Search not found with ${field}_reference: ${referenceId}`));
                }

            } else {
                reject(new Error('Params for search is null or undefined'));
            }
        });
  }

  logicalDelete(key: any) {
    logger.debug('save method repository:');
    return new Promise<any>(async (resolve, reject) => {
      if (key != null) {
        logger.debug('creating model from service to repository:');

        const comment: any = await this.MRepository.get(key);

        if (!comment) {
            reject(new Error(`Search not found. Comment with uid ${key} don't exist`));
        }

        const params = { deleted: true };

        resolve(await this.MRepository.update(key, params).then(async (pin: Pin) => {
          logger.debug('object updated:', pin);

          if (pin.destination_reference) {
            await this.commentService.logicalChangeDelete(pin.destination_reference, true);
          }
          return pin;
        }));
      } else {
        reject(new Error('Error in function save object null or undefined'));
      }
    });
  }

  public findByOriginReference(referenceId: string, auth: any): Promise<Pin[]> {
    return new Promise(async (resolve, reject) => {
        if (referenceId != null) {

            logger.debug(`_reference: ${referenceId}`);
            const pins = await this.MRepository.findByOriginReference(referenceId, 'origin');
            if (pins != null && pins !== undefined) {
                resolve(pins.filter(element => element.origin_reference === auth.core.uid));
            } else {
                reject(new Error(`Search not found with origin_reference: ${referenceId}`));
            }
        } else {
            reject(new Error('Params for search is null or undefined'));
        }
    });
  }

  private async saveParticipant(participant: any) {
    let result;
    logger.debug('saved participant type', participant);
    await this.participantService.save(participant).then((p: Participant ) => {
        logger.debug('saved participant type', p);
        result = p;
    }).catch((err) => {
        logger.debug(err);
        result = undefined;
    });

    return result;
  }

    private async updateParticipant(participant: any, pin: any) {
        if (participant === undefined) {
            return undefined;
        }
        logger.debug('participants: ', participant);

        let part: any;
        await this.participantService.findByPin(pin.uid).then((p: Pin) => {
            logger.debug('object Pin get:', p);
            part = p;
        }).catch((err) => {
            logger.debug(err);
        });

        if (!part) {
            throw new Error(`Search not found. Participant type not exist with key: ${participant.type}`);
        }

        let result;
        const participantBuild = await this.buildParticipan(participant, pin.uid as string);

        await this.participantService.update(part.uid, participantBuild).then((p) => {
            logger.debug('saved participant type', p);
            result = p;
        }).catch((err) => {
            logger.debug(err);
            result = undefined;
        });

        return result;

    }

  private async validateCreateField(json: any) {
    return ( json.type !== undefined &&
             json.origin_reference !== undefined &&
             json.config_setting !== undefined);
  }

    private async buildJSONPin(user: any, json: any, type: any, referenceId: string) {
        logger.debug('content json transform');
        logger.debug(json);
        const now = new Date().getTime();
        return {
            origin_reference: json.origin_reference,
            type_id: type.uid,
            status: {
                id: 'in-process',
                text: 'Pendiente',
                ico: 'assets/img/icons/comments/ico_status_in_process.svg'
            },
            config_setting: json.config_setting,
            destination_reference: referenceId,
            creation_date: now,
            order: json.order,
            owner_id: user.uid,
            deleted: false,
        } as Pin;
    }

    private buildParticipan(participantType: any, pinID: string) {
        logger.debug('participant type:', participantType.participants);
        return {
            pin_id: pinID,
            type: participantType.type,
            users: participantType.users
        };
    }

    private async buildCompletePin(pin: any, participant: any, type: any, comment?: any) {
        logger.debug('pin:', pin);
        logger.debug('participant; ', participant);
        logger.debug('type complete pin: ', type);

        if (comment !== undefined) {
            return {
                uid: pin.uid,
                origin_reference: pin.origin_reference,
                destination_reference: pin.destination_reference,
                type: type,
                status: pin.status,
                config_setting: pin.config_setting,
                participant: participant,
                data: {
                    comment: comment
                },
                status_change_by: pin.status_change_by,
                owner_id: pin.owner_id,
                order: pin.order
            };
        }
        return {
            uid: pin.uid,
            origin_reference: pin.origin_reference,
            destination_reference: pin.destination_reference,
            type: type,
            status: pin.status,
            config_setting: pin.config_setting,
            participant: participant,
            status_change_by: pin.status_change_by,
            owner_id: pin.owner_id,
            order: pin.order
        };
    }
}
