import CORETYPE, { CoreType } from '../../models/core/CoreType';
import Repository from '../Repository';
import {orm} from '../../models/index';

export default class CoreTypeRepository extends Repository<CoreType>{

  /**
 * @author Fidel Saldivar
 * @created at July 2018
 *
 * Access to DynamoDB or another DB
 * @extends { Repository<CoreType>}
 */
  constructor() {
    orm.init();
    super(orm.getModel(CORETYPE.name));
  }

}
