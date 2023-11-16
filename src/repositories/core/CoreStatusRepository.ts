import CORESTATUS, { CoreStatus } from '../../models/core/CoreStatus';
import Repository from '../Repository';
import {orm} from '../../models/index';


/**
 * @author Fidel Saldivar
 * @created at July 2018
 *
 * Access to DynamoDB or another DB
 * @extends { Repository<CoreAccess>}
 */
export default class CoreStatusRepository extends Repository<CoreStatus> {

    constructor() {
      orm.init();
      super(orm.getModel(CORESTATUS.name));
    }

}
