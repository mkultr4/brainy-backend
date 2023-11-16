import COMMENT, { Comment } from '../../models/comment/Comment';
import Repository from '../Repository';
import {orm} from '../../models/index';

export default class CommentRepository  extends Repository<Comment> {

    constructor() {
      orm.init();
      super(orm.getModel(COMMENT.name));
    }

    findByReferenceID(referenceID: string): Promise<Array<Comment> | null> {
        return new Promise((resolve, reject) => {
            try {
                this.Model.scan()
                .where('reference_id').eq(referenceID)
                .exec()
                .then(items => {
                    if (items.length > 0) {
                        resolve(items);
                    }

                    resolve(null);
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}
