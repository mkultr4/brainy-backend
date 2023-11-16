import ParticipantRepository from '../../repositories/pin/ParticipantRepository';

import UserSerivice from '../UserService';
// import MemberAccessService from '../member-access/MemberAccessService';
// import RoleService from '../auth-permissions/RoleService';

import { Participant } from '../../models/pin/Participant';

import logger from '../../logger';
import ParticipantTypeService from './ParticipantTypeService';
import Service from '../Service';

export default class ParticipantService extends Service<ParticipantRepository, Participant> {

    private participantTypeService: ParticipantTypeService;
    private userService: UserSerivice;
    // private memberAccess: MemberAccessService;
    // private roleService: RoleService;

    constructor() {
        super(new ParticipantRepository());
        this.participantTypeService = new ParticipantTypeService();
        this.userService = new UserSerivice();
        // this.memberAccess = new MemberAccessService();
        // this.roleService = new RoleService();
    }

    saveAs(participantType: any) {
        return new Promise<any>(async (resolve, reject) => {
            if (participantType !== undefined && participantType != null) {
                resolve(await this.MRepository.save(participantType).then(async (p: Participant) => {
                    logger.debug('object ParticipantType saved:', p);
                    const result = await this.buildResponseParticipant(p);
                    return result;
                }));
            }
        });
    }

    updateAs(key: any, participantType: any) {
        return new Promise<any>(async (resolve, reject) => {
            if (participantType !== undefined && participantType != null) {
                resolve(this.MRepository.update(key, participantType).then(async (p: Participant) => {
                    logger.debug('object ParticipantType update: ', p);
                    const result = await this.buildResponseParticipant(p);
                    return result;
                }));
            }
        });
    }

    getAs(id: string) {
        return new Promise(async (resolve, reject) => {
            logger.debug('id participant type:', id);
            if (id !== undefined && id != null) {
                await this.MRepository.get(id).then(async (p: any) => {
                    logger.debug('get ParticipantType:', p);
                    const result = await this.buildResponseParticipant(p);
                    resolve(result);
                });
            } else {
                reject(new Error(`Search not fount with key ${id}`));
            }
        });
    }

    findByPin(key: any, workspaceID?: string) {
        return new Promise<any>(async (resolve, reject) => {
            if (key !== undefined && key != null) {
                logger.debug('Search participant by pin with pin_id: ', key);
                const participant = await this.MRepository.findByPin(key);

                if (participant === undefined) {
                    logger.debug('participant undefined');
                    resolve(undefined);
                    return;
                }

                logger.debug('find ParticipantType by pin:', participant);
                logger.debug('participant found: ', typeof participant);
                logger.debug('participant found: ', participant.pin_id);
                logger.debug('participant found: ', participant.users);
                if (participant !== undefined) {
                    if (workspaceID !== undefined) {
                        const result = await this.buildResponseParticipant(participant, workspaceID);
                        resolve(result);
                    } else {
                        const result = await this.buildResponseParticipant(participant);
                        resolve(result);
                    }
                } else {
                    logger.debug('returned undefined in participant type');
                    reject(new Error(`Search participant type not found with pint_id: ${key}`));
                }
            }
        });
    }

    private async buildResponseParticipant(participant: Participant, workspaceID?: string) {
        logger.debug('participant found: ', participant.uid);
        logger.debug('participant found: ', participant.users);
        let usersData;

        if (workspaceID !== undefined) {
            usersData = await this.getDataUser(participant.users, workspaceID).catch((err) => {
                logger.debug(err);
            });
        } else {
            usersData = participant.users;
        }

        logger.debug('usersData: ', usersData);
        const type = await this.participantTypeService.findByKey(participant.type as string);
        logger.debug('participant type: ', type);

        return {
            uid: participant.uid,
            type: type,
            users: usersData
        };
    }

    private async getDataUser(participants: any, workspaceID: string) {
        const userList = new Array();
        logger.debug('participant get basic data: ', participants);
        if (participants !== undefined) {
            logger.debug('participants: ', participants);
            for (const participant of participants) {
                if (participant.uid !== undefined) {
                    logger.debug(`participants basic data ${participant.uid}`);
                    const user: any = await this.userService.getBasicDataUserById(participant.uid as string);
                    logger.debug('user response: ', user);

                    // const permission = await this.memberAccess.getPermission(user.uid, { level: 'WORKSPACE', reference: workspaceID });
                    // logger.debug('permission response:', permission);

                    // const role = await this.roleService.getById(permission.permissionUserRoleId as string);
                    // logger.debug('role response: ', role);

                    // user.role = role;
                    userList.push(user);
                }
            }
            logger.debug('user list: ', userList);
            return userList;
        }
        return [];
    }
}
