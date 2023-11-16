import COMMET_TYPE, { CommentType } from '../../models/comment/CommentType';
import {orm} from '../../models/index';
import Repository from '../Repository';

export default class CommentTypeRepository extends Repository<CommentType>  {

    constructor() {
        orm.init();
        super(orm.getModel(COMMET_TYPE.name));
    }
}
