import CF, { CoreFunction } from '../../../models/core/core-access/CoreFunction';
import Repository from '../../Repository';
import {orm} from '../../../models';


/**
 * @author
 * @created at July 2018
 *
 * Access to DynamoDB or nother DB
 * @extends { Repository<CoreFunction>}
 */
export default class CoreFunctionRepository extends Repository<CoreFunction> {

  constructor() {
    orm.init();
    super(orm.getModel(CF.name));
  }

  getByGroupId(groupId: string) {
    return new Promise<any>(async (resolve, reject) => {
        this.Model.scan()
        .where('groupId').eq(groupId)
        .exec()
        .then(items => {
            if (items.length > 0) {
                resolve(items);
            }
            resolve(null);
        });
    });
  }

}
