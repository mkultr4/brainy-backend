import THREAD_COMMENT, { ThreadComment } from '../../models/comment/ThreadComment';
import Repository from '../Repository';
import {orm} from '../../models/index';

export default class ThreadCommentRepository  extends Repository<ThreadComment> {

    constructor() {
        orm.init();
        super(orm.getModel(THREAD_COMMENT.name));
    }

    findByCommentID(comentID: string): Promise<Array<ThreadComment> | undefined> {
        return new Promise((resolve, reject) => {
            try {
                this.Model.scan()
                .where('comment_id').eq(comentID)
                .exec()
                .then(items => {
                    if (items.length > 0) {
                        resolve(items);
                    }
                    resolve(undefined);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    findByParentID(parentID: string): Promise<Array<ThreadComment> | undefined> {
        return new Promise((resolve, reject) => {
            try {
                this.Model.scan()
                .where('parent_id').eq(parentID)
                .exec()
                .then(items => {
                    if (items.length > 0) {
                        resolve(items);
                    }
                    resolve(undefined);
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}
