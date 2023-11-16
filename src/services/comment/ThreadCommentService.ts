import ThreadCommentRepository from '../../repositories/comment/ThreadCommentRepository';
import CommentTypeService from './CommentTypeService';

import {ThreadComment} from '../../models/comment/ThreadComment';

import logger from '../../logger';
import UserService from '../UserService';
// import MemberAccessService from '../member-access/MemberAccessService';
// import RoleService from '../auth-permissions/RoleService';
import Service from '../Service';

export default class ThreadCommentService extends Service<ThreadCommentRepository, ThreadComment> {

    private commentTypeService: CommentTypeService;
    private userService: UserService;
    // private memberAccess: MemberAccessService;
    // private roleService: RoleService;

    constructor() {
        super(new ThreadCommentRepository());
        this.commentTypeService = new CommentTypeService();
        this.userService = new UserService();
        // this.memberAccess = new MemberAccessService();
        // this.roleService = new RoleService();
    }

    getAs(key: string) {
        return new Promise(async (resolve, reject) => {
            if (key != null) {
                this.MRepository.get(key).then((threadComment) => {
                    logger.debug(`object returned for model ${threadComment}`);
                    resolve(threadComment);
                }).catch((err) => {
                    reject(err);
                });
            } else {
                reject(new Error('Params for search is null or undefined'));
            }
        });
    }

   saveAs(json: any) {
      logger.debug('save method repository:');
      return new Promise<any>(async (resolve, reject) => {
        if (json != null) {
            logger.debug('creating model from service to repository:');

            const commetType = await this.commentTypeService.findCommentType(json.type);

            if (commetType === undefined) {
                reject(`Comment Type not found with key ${json.type}`);
                return;
            }

            const valid = await this.validateField(json);

            if (!valid) {
                reject(new Error('Invalidad body request. Field title, value and reference_id are requerid'));
            }

            const finalJson = this.buildComment(json, commetType.uid as string);

            logger.debug('final json to save thread comment: ', finalJson);

            resolve(await this.MRepository.save(finalJson).then((obj: ThreadComment) => {
                logger.debug('object created:', obj);
                return obj;
            }));
        } else {
          reject(new Error('Error in function save object null or undefined'));
        }
      });
  }

    updateAs(keys: any, params: any) {
        logger.debug('save method repository:');
        return new Promise<any>(async (resolve, reject) => {
        if (keys != null) {
            logger.debug('creating model from service to repository:');

            const exist = await this.exist(keys);

            if (!exist) {
                reject(new Error(`Search not found. Comment with uid ${keys} don't exist`));
            }

            const commetType = this.commentTypeService.findCommentType(params.type);

            if (commetType === undefined) {
                reject(`Comment Type not found with key ${params.type}`);
            }

            resolve(this.MRepository.update(keys, params).then((obj: ThreadComment) => {
                logger.debug('object updated:', obj);
                return obj;
            }));
        } else {
            reject(new Error('Error in function save object null or undefined'));
        }
        });
    }

    deleteAs(key: any): Promise<undefined> {
        logger.debug('save method repository:');
        return new Promise<undefined>(async (resolve, reject) => {
        if (key != null) {
            logger.debug('Delete model from service to repository:');

            const exist = await this.exist(key);

            if (!exist) {
                reject(new Error(`Search not found. Comment with uid ${key} not found`));
            }

            resolve(this.MRepository.delete(key).then(() => {
            return undefined;
            }));
        } else {
            reject(new Error('Error in function save object null or undefined'));
        }
        });
    }

    logicalChangeDelete(key: any, deleted: boolean) {
        logger.debug('save method repository:');
        return new Promise<any>(async (resolve, reject) => {
          if (key != null) {
            logger.debug('creating model from service to repository:');

            const exist = await this.exist(key);

            if (!exist) {
                reject(new Error(`Search not found. Comment with uid ${key} don't exist`));
            }

            const params = { deleted: deleted };

            resolve(await this.MRepository.update(key, params).then((obj: ThreadComment) => {
              logger.debug('object updated:', obj);
              return obj;
            }));
          } else {
            reject(new Error('Error in function save object null or undefined'));
          }
        });
      }

    findByCommentID(commentID: string, workspaceID: string | undefined) {
        return new Promise(async (resolve, reject) => {
            if (commentID != null) {
                await this.MRepository.findByCommentID(commentID).then(async (threads: Array<ThreadComment> | undefined) => {
                       logger.debug(`result search: ${threads}`);
                       if (threads !== undefined) {
                        let response;

                        if (workspaceID === undefined) {
                            response =  await this.buildThreadsResponse(threads);
                        } else {
                            response =  await this.buildThreadsResponse(threads, workspaceID);
                        }
                        logger.debug('response thread with type: ', response);
                        resolve(response);
                       } else {
                           resolve(undefined);
                       }
                }).catch((err) => {
                    reject(err);
                });
            } else {
                reject(new Error('Params for search is null or undefined'));
            }
        });
    }

    async findThreadByParent(parentID: string, listAnswer: Array<any>, workspaceID: string) {
        const threads = await this.MRepository.findByParentID(parentID);

        if (threads !== undefined) {
            threads.forEach(async (thread) => {
                let threadsList = new Array();
                if (thread.parent_id !== undefined) {
                    logger.debug('thread with answer: ', thread.parent_id);
                    threadsList = await this.findThreadByParent(thread.uid as string, new Array(), workspaceID);
                }
                logger.debug('thread returned: ', thread.uid);
                const userData = await this.getDataUser(thread.owner_id, workspaceID);
                listAnswer.push({
                    uid: thread.uid,
                    comment_id: thread.comment_id,
                    parent_id: thread.parent_id,
                    value: thread.value,
                    owner: userData,
                    answers: threadsList,
                    deleted: thread.deleted
                });
            });
        }

        return listAnswer;
    }

    private validateField(json: any) {
        return (
            (json.comment_id !== undefined || json.parent_id !== undefined) &&
            json.value !== undefined
        );
    }

    private buildComment(json: any, type: string) {
        return {
            comment_id: json.comment_id,
            parent_id: json.parent_id,
            value: json.value,
            comment_type_id: type,
            owner_id: json.owner_id,
            deleted: false
        };
    }

    private async buildThreadsResponse(threads: any, workspaceID?: string) {
        const finalThread = new Array();

        for (const thread of threads) {
            let userData;

            if (workspaceID !== undefined) {
                userData = await this.getDataUser(thread.owner_id, workspaceID);
            } else {
                userData = thread.owner_id;
            }

            let answers;
            if (thread.uid !== undefined && workspaceID !== undefined) {
                answers = await this.findThreadByParent(thread.uid, new Array(), workspaceID);
            }

            const type = await this.commentTypeService.findCommentType(thread.comment_type_id);
            logger.debug('comment type: ', type);
            const row =  {
                uid: thread.uid,
                comment_id: thread.comment_id,
                parent_id: thread.parent_id,
                value: thread.value,
                comment_type: type,
                createdAt: thread.createdAt,
                owner: userData,
                answer: answers,
                deleted: thread.deleted
            };

            finalThread.push(row);
        }

        return finalThread;

    }

    private async getDataUser(userID: any, workspaceID: string) {
        const userList = new Array();
        logger.debug('user get basic data: ', userID);
        if (userID !== undefined) {
            logger.debug('user: ', userID);
            if (userID !== undefined) {
                logger.debug(`user basic data ${userID}`);
                const user: any = await this.userService.getBasicDataUserById(userID as string);
                logger.debug('user response: ', user);

                // const permission = await this.memberAccess.getPermission(user.uid, { level: 'WORKSPACE', reference: workspaceID });
                // logger.debug('permission response:', permission);

                // const role = await this.roleService.getById(permission.permissionUserRoleId as string);
                // logger.debug('role response: ', role);

                // user.role = role;
                userList.push(user);
            }

            logger.debug('user list: ', userList);
            return userList;
        }
        return [];
    }

    public async buildThreadResponse(thread: any) {
        const type = await this.commentTypeService.findCommentType(thread.comment_type_id);

        return {
            uid: thread.uid,
            comment_id: thread.comment_id,
            parent_id: thread.parent_id,
            value: thread.value,
            comment_type: type,
            createdAt: thread.createdAt,
            owner_id: thread.owner_id,
            deleted: thread.deleted
        };
    }

    private async exist(keys: any) {
        let exist = false;
        await this.get(keys).then((comment: ThreadComment) => {
            logger.debug(`Comment ${comment.uid} exist`);
            exist = true;
        }).catch((err) => {
            logger.debug(err);
            exist = false;
        });

        return exist;
    }
}
