import WorkspaceAccessRepository from '../../../repositories/worspaces/access/WorkspaceAccessCategoryRepository';
import { WorkspaceAccessCategory } from '../../../models/workspace/access/WorkspaceAccessCategory';
import Service from '../../Service';
import logger from '../../../logger';
import { WorkspaceAccess } from '../../../models/workspace/access/WorkspaceAccess';
import { Workspace } from '../../../models/workspace/Workspace';
import { User } from '../../../models/auth-permissions/User';
import RoleService from '../../auth-permissions/RoleService';
import { WorkspaceAccessPermissionException } from '../../../util/errors/Error';


/**
 * Category Member service class to get all information about Category Members.
 * @author Gibran Cordoba
 * @created 25/06/2018
 *
 * @export
 * @class WorkspaceAccessCategoryService
 * @extends {Service<WorkspaceAccessRepository, WorkspaceAccessCategory>}
 *
 */
export default class WorkspaceAccessCategoryService extends Service<WorkspaceAccessRepository, WorkspaceAccessCategory> {

  /**
   * Creates an instance of WorkspaceAccessCategoryService
   * @constructor
   * @memberof WorkspaceAccessCategoryService
   */
  constructor() {
    super(new WorkspaceAccessRepository());
  }

  createCategory(wsa: WorkspaceAccess, category: WorkspaceAccessCategory) {
    try {
      if (RoleService.isAdmin(<any>wsa.role) || RoleService.isCoAdmin(<any>wsa.role)) {
        return this.MRepository.save(category, (<any>wsa.user) as User);
      } else {
        throw new WorkspaceAccessPermissionException('Usuario no tiene permisos');
      }

    } catch (error) {
      return Promise.reject(error);
    }


  }

  categoryExists(category: WorkspaceAccessCategory): Promise<Boolean> {
    return new Promise<Boolean>(async (resolve, reject) => {
      this.MRepository.scan({ name: { eq: category.name }, workspace: { eq: category.workspace } })
        .then((objs: WorkspaceAccessCategory[]) => {
          logger.debug(`object returned for model ${objs}`);
          if (objs.length > 0) {
            resolve(true);
          }
          resolve(false);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  listbyworkspace(wsa: WorkspaceAccess): Promise<WorkspaceAccessCategory[]> {
    try {
      if (RoleService.isAdmin(<any>wsa.role) || RoleService.isCoAdmin(<any>wsa.role)) {
        return this.MRepository.listbyworkspace((<any> wsa.workspace) as Workspace);
      } else {
        throw new WorkspaceAccessPermissionException('Usuario no tiene permisos');
      }

    } catch (error) {
      return Promise.reject(error);
    }
  }

}
