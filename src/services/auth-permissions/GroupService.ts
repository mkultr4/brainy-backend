import Service from '../Service';
import logger from '../../logger';
import GPO, { Group } from '../../models/auth-permissions/Group';
import GroupRepository from '../../repositories/auth-permissions/GroupRepository';

/**
 * Service
 * @author Fidel Saldivar
 */
export default class GroupService extends Service<GroupRepository, Group> {
    /**
   * Creates an instance of WorkspaceAccessService
   * @constructor
   * @memberof GroupService
   */
  constructor() {
    super(new GroupRepository());
  }

}
