import CA, { CoreAccess } from '../../../models/core/core-access/CoreAccess';
import Repository from '../../Repository';
import {orm} from '../../../models/index';
import CoreRepository from '../CoreRepository';
import GroupRepository from '../../auth-permissions/GroupRepository';
import CoreFunctionRepository from './CoreFunctionRepository';
import { NotFoundResult } from '../../../util/errors/Error';
import logger from '../../../logger';
import WorkspaceAccessRepository from '../../worspaces/access/WorkspaceAccessRepository';
import UserRepository from '../../auth-permissions/UserRepository';
import RoleRepository from '../../auth-permissions/RoleRepository';

/**
 * @author Fidel Saldivar
 * @created at July 2018
 *
 * Access to DynamoDB or another DB
 * @extends { Repository<CoreAccess>}
 */
export default class CoreAccessRepository extends Repository<CoreAccess> {

  private coreRepository: CoreRepository;
  private groupRepository: GroupRepository;
  private coreFunctionRepository: CoreFunctionRepository;
  private workspaceAccessRepository: WorkspaceAccessRepository;
  private userRepository: UserRepository;
  private roleRepository: RoleRepository;

  constructor() {
    orm.init();
    super(orm.getModel(CA.name));
    this.coreRepository = new CoreRepository();
    this.groupRepository = new GroupRepository;
    this.coreFunctionRepository = new CoreFunctionRepository();
    this.workspaceAccessRepository = new WorkspaceAccessRepository();
    this.userRepository = new UserRepository();
    this.roleRepository = new RoleRepository();
  }

  listByWorkspaceAccess(swId: string): Promise<CoreAccess[]> {
    return this.Model.scan({workspaceAccessId: {eq: swId}}).exec();
  }

  getComplete(id: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {

      try {
        logger.debug('init get complete()');
        this.Model.get({uid: id}).then(async (coreAccess) => {
          logger.debug('Result coreAccess: ', coreAccess);

          if (coreAccess) {
            const core = await this.coreRepository.get(coreAccess.coreId);
            const group = await this.groupRepository.get(coreAccess.groupId);

            if (!group) {
              throw new NotFoundResult('group not found or null');
            }

            const functions = await this.coreFunctionRepository.getByGroupId(group.uid as string);
            const workspaceAccess = await this.workspaceAccessRepository.get(coreAccess.workspaceAccessId);

            if (!workspaceAccess) {
              throw new NotFoundResult('workspaceAccess not found or null');
            }

            const role = await this.roleRepository.get(workspaceAccess.role);
            const user = await this.userRepository.get(workspaceAccess.user);
            delete user.password;

            (<any>coreAccess).core = core;
            (<any>group).functions = functions;
            (<any>coreAccess).group = group;
            (<any>coreAccess).user = user;
            (<any>coreAccess).role = role;

            delete coreAccess.coreId;
            delete coreAccess.groupId;

            logger.debug('object returned complete', coreAccess);
            resolve(coreAccess);
          } else {
            reject(new NotFoundResult(`core access not found with key ${id}`));
          }
        });
      } catch (error) {
        logger.debug(error);
      }
    });
  }
}
