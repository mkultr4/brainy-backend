import Service from '../../Service';
import logger from '../../../logger';
import WorkspaceAccessRepository from '../../../repositories/worspaces/access/WorkspaceAccessRepository';
import { WorkspaceAccess } from '../../../models/workspace/access/WorkspaceAccess';
import { User } from '../../../models/auth-permissions/User';
import RoleService from '../../auth-permissions/RoleService';
import { WorkspaceAccessException, WorkspaceAccessPermissionException } from '../../../util/errors/Error';


/**
 * Category Member service class to get all information about Category Members.
 * @author Gibran Cordoba
 * @created 25/06/2018
 *
 * @export
 * @class WorkspaceAccessService
 * @extends {Service<WorkspaceAccessRepository, WorkspaceAccess>}
 *
 */
export default class WorkspaceAccessService extends Service<WorkspaceAccessRepository, WorkspaceAccess> {

  /**
   * Creates an instance of WorkspaceAccessService
   * @constructor
   * @memberof WorkspaceAccessService
   */
  constructor() {
    super(new WorkspaceAccessRepository());
  }

  private static isCurrentWsa(wsa: WorkspaceAccess, id: String) {
    return (wsa.uid === id);
  }

  private static currentWsaValidation(wsa: WorkspaceAccess, id: String) {
    if (this.isCurrentWsa(wsa, id)) {
      throw new WorkspaceAccessException('No se puede realizar esta accion a si mismo');
    }
  }

  getComplete(id: String): Promise<WorkspaceAccess> {
    return this.MRepository.getComplete(id);
  }

  createAccess(model: WorkspaceAccess ) {
    logger.debug('create WorkspaceAccess', model);
    return this.MRepository.saveOrGetExist({
      user: {eq: model.user as string},
      role: {eq: model.role as string},
      workspace: {eq: model.workspace as string}
    }, model);
  }

  deleteWsa(id: String, currentWsa: WorkspaceAccess) {
    // TODO: Validar que no puedan borrar al owner del workspace
    try {

        WorkspaceAccessService.currentWsaValidation(currentWsa, id);

        if (RoleService.isAdmin(<any>currentWsa.role) || RoleService.isCoAdmin(<any>currentWsa.role)) {
          return this.removeAccess(id);
        } else {
          throw new WorkspaceAccessPermissionException('Usuario no tiene permisos');
        }

    } catch (error) {
      return Promise.reject(error);
    }
  }

  removeAccess(id: String) {
    return this.MRepository.delete(id);
  }

  listByUser(user: User) {
    return this.MRepository.listByUserId(user.uid as string);
  }

  listByWorkspace(wsa: WorkspaceAccess) {
    try {
      if (RoleService.isAdmin(<any>wsa.role) || RoleService.isCoAdmin(<any>wsa.role)) {
        return this.MRepository.listByWorkspace((<any>wsa.workspace).uid as string);
      } else {
        throw new WorkspaceAccessPermissionException('Usuario no tiene permisos');
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  changeStatus(id: String, wsa: WorkspaceAccess, params: any) {
    logger.debug('changeStatus service: ', id, wsa, params);
    try {
      if (WorkspaceAccessService.isCurrentWsa(wsa, id) && params.status === 'suspended') {
        throw new WorkspaceAccessException('No Puede suspenderse a si mismo');
      }

      if (RoleService.isAdmin(<any>wsa.role) || RoleService.isCoAdmin(<any>wsa.role)) {
        return this.MRepository.changeStatus(id, params, (<any>wsa.user) as User);
      } else {
        throw new WorkspaceAccessPermissionException('Usuario no tiene permisos');
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  updateAccess(id: String, wsa: WorkspaceAccess, params: any) {
    this.MRepository.update({uid: id}, params, <any> wsa.user);
  }

}
