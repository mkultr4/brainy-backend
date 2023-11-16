import CommentRepository from '../../repositories/comment/CommentRepository';
import CommentTypeService from './CommentTypeService';
import ThreadCommentService from './ThreadCommentService';

import {Comment} from '../../models/comment/Comment';

import logger from '../../logger';
import UserService from '../UserService';
// import MemberAccessService from '../member-access/MemberAccessService';
// import RoleService from '../auth-permissions/RoleService';
import Service from '../Service';

export default class CommentService extends Service<CommentRepository, Comment>  {

    private commentTypeService: CommentTypeService;
    private threadCommentService: ThreadCommentService;
    private userService: UserService;
    // private memberAccess: MemberAccessService;
    // private roleService: RoleService;

    constructor() {
        super(new CommentRepository());
        this.commentTypeService = new CommentTypeService();
        this.threadCommentService = new ThreadCommentService();
        this.userService = new UserService();
        // this.memberAccess = new MemberAccessService();
        // this.roleService = new RoleService();
    }

    getAs(key: string, workspaceID: string) {
        return new Promise(async (resolve, reject) => {
            if (key != null) {
                await this.MRepository.get(key).then(async (comment: any) => {

                    if (comment !== undefined) {
                        logger.debug(`object returned for model ${comment}`);
                        const threads = await this.threadCommentService.findByCommentID(comment.uid as string, workspaceID).catch((err) => {
                            logger.debug('Error in threads comments: ', err);
                        });

                        const results = await this.buildResponseComment(comment, threads, workspaceID);
                        resolve(results);
                    } else {
                        reject(new Error(`Comment not found with key ${key}`));
                    }

                }).catch((err) => {
                    reject(new Error(err));
                });
            } else {
                reject(new Error('Params for search is null or undefined'));
            }
        });
    }

    saveAs(user: any, json: any) {
      logger.debug('save method repository:');
      return new Promise<any>(async (resolve, reject) => {
        if (json != null) {
            logger.debug('creating model from service to repository:');

            const commetType = await this.commentTypeService.findCommentType(json.type);

            logger.debug(`comment type: ${commetType}`);

            const valid = await this.validateField(json);

            if (!valid) {
                reject(new Error('Invalidad body request. Field title and value are requerid'));
                return;
            }

            if (commetType === undefined) {
                reject(new Error(`Comment Type not found with key ${json.type}`));
                return;
            }

            const finalJson = await this.buildComment(user, json, commetType.uid as string);

            resolve(this.MRepository.save(finalJson).then((obj: Comment) => {
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

        resolve(await this.MRepository.update(keys, params).then(async (obj: Comment) => {
            logger.debug('object updated:', obj);
            const threads = await this.threadCommentService.findByCommentID(obj.uid as string, undefined).catch((err) => {
                logger.debug('Error in threads comments: ', err);
            });

            const results = await this.buildResponseComment(obj, threads);
            resolve(results);
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

        const comment: any = await this.MRepository.get(key);

        if (!comment) {
            reject(new Error(`Search not found. Comment with uid ${key} don't exist`));
        }

        const params = { deleted: deleted };

        resolve(await this.MRepository.update(key, params).then(async (obj: Comment) => {
          logger.debug('object updated:', obj);

          if (comment.threads) {
            for (const thread of comment.threads) {
                logger.debug('Delete thread comment: ', thread);
                await this.threadCommentService.logicalChangeDelete(thread.uid, deleted);
            }
          }

          resolve(await this.MRepository.get(key));
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

    createThreadComment(user: any, id: any, json: any) {
        return new Promise(async (resolve, reject) => {
            if (json !== undefined && id !== undefined) {

                const threadCommentJSON = await this.buildThreadComment(user, id, json);

                logger.debug('thread comment final json:', threadCommentJSON);

                await this.threadCommentService.save(threadCommentJSON).then(async (thread: any) => {
                    logger.debug('thread comment created', thread);
                    const response = await this.threadCommentService.buildThreadResponse(thread);
                    resolve(response);
                })
                .catch((err) => {
                    logger.debug(err);
                    reject(new Error(err));
                });
            } else {
                reject(new Error('Create thread not found with body request undefined'));
            }
        });
    }

    updateThreadComment(id: any, json: any) {
        return new Promise(async (resolve, reject) => {
            await this.threadCommentService.update(id, json).then(async (thread: any) => {
                logger.debug('thread comment created', thread);
                resolve(thread);
            });
        });
    }

    logicalChangeDeleteThreadComment(key: string, deleted: boolean) {
        return new Promise<any>(async (resolve, reject) => {
            await this.threadCommentService.logicalChangeDelete(key, deleted).then(async (thread: any) => {
                logger.debug('thread deleted: ', thread);
                resolve(thread);
            }).catch((err) => {
                reject(new Error(err));
            });
         });
    }

    answer(user: any, json: any, parentID: string) {
        return new Promise<any>(async (resolve, reject) => {
            if (parentID !== undefined) {

                const threadCommentJSON = await this.buildThreadCommentParent(user, json, parentID);

                logger.debug('thread comment final json:', threadCommentJSON);

                await this.threadCommentService.save(threadCommentJSON).then(async (thread: any) => {
                    logger.debug('thread comment created', thread);
                    const response = await this.threadCommentService.buildThreadResponse(thread);
                    resolve(response);
                })
                .catch((err) => {
                    logger.debug(err);
                    reject(new Error(err));
                });
            } else {
                reject(new Error('All answer should have a parent_id'));
            }
         });
    }


  private validateField(json: any) {
      return (
          json.title !== undefined &&
          json.value !== undefined
      );
  }

  private buildComment(user: any, json: any, type: string) {
      return {
          title: json.title,
          value: json.value,
          comment_type: type,
          owner_id: user.uid,
          delete: false
      };
  }

  private buildThreadCommentParent(user: any, json: any, parentID: string) {
        return {
            parent_id: parentID,
            value: json.value,
            type: json.type,
            owner_id: user.uid,
            deleted: false
        };
    }

  private buildThreadComment(user: any, commentID: string, json: any) {
      return {
            comment_id: commentID,
            parent_id: json.parent_id,
            value: json.value,
            type: json.type,
            owner_id: user.uid,
            deleted: false
      };
  }

  private async buildResponseComment(comment: any, threads: any, workspaceID?: string) {
      logger.debug(comment);
      logger.debug(threads);
      const thread = (threads !== undefined) ? threads : [];
      let userData;
      if (workspaceID !== undefined) {
        userData = await this.getDataUser(comment.owner_id, workspaceID);
      } else {
        userData = comment.owner_id;
      }

      return {
          uid: comment.uid,
          title: comment.title,
          value: comment.value,
          comment_type: comment.comment_type,
          deleted: comment.deleted,
          createdAt: comment.createdAt,
          owner: userData,
          threads: thread
      };
  }

  private async getDataUser(userID: any, workspaceID: string) {
    const userList = new Array();
    logger.debug('user get basic data: ', userID);
    if (userID !== undefined) {
        logger.debug('user: ', userID);
        if (userID !== undefined) {
            logger.debug(`user basic data ${userID}`);
            const user: any = await this.userService.getBasicDataUserById(userID as string)
            .catch((err) => {
                logger.debug('error: ', err);
            });
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

  private async exist(keys: any) {
    let exist = false;
    await this.MRepository.get(keys).then((comment: any) => {
        logger.debug(`Comment ${comment.uid} exist`);
        exist = true;
    }).catch((err) => {
        logger.debug(err);
        exist = false;
    });

    return exist;
  }
}
