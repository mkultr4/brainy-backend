import CommentTypeRepository from '../../repositories/comment/CommentTypeRepository';
import {CommentType} from '../../models/comment/CommentType';
import logger from '../../logger';
import Service from '../Service';

export default class CommentTypeService extends Service<CommentTypeRepository, CommentType> {

    constructor() {
        super(new CommentTypeRepository());
    }

    getAs(key: string) {
        return new Promise(async (resolve, reject) => {
            if (key != null) {
                let commentType;
                await this.MRepository.get(key).then((ct: any) => {
                    logger.debug(`object returned for model ${ct}`);
                    commentType = ct;
                }).catch((err: any) => {
                    reject(err);
                });
                resolve(commentType);
            } else {
                reject(new Error('Params for search is null or undefined'));
            }
        });
    }

    async findCommentType(type: string): Promise<CommentType | undefined> {
        let uid;

        switch (type) {
            case 'message':
                uid = '1';
                break;
            case 'audio':
                uid = '2';
                break;
            case 'video':
                uid = '3';
                break;
            default:
                uid = type;
                break;
        }

        logger.debug('switch comment type:', uid);
        let commentType;

        await this.get(uid).then((ct: CommentType) => {
            commentType = ct;
        }).catch((err: any) => {
            logger.debug(err);
            commentType = undefined;
        });

        return commentType;
  }
}
