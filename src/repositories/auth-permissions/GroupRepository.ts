import Repository from '../Repository';
import {orm} from '../../models';
import GPO, { Group } from '../../models/auth-permissions/Group';

/**
 * @author Fidel Saldivar
 * @created at July 2018
 *
 * Access to DynamoDB or another DB
 * @extends { Repository<Group>}
 */
export default class GroupRepository extends Repository<Group> {

  constructor() {
    orm.init();
    super(orm.getModel(GPO.name));
  }

}

