import Service from '../../Service';
import logger from '../../../logger';
import { CoreAccess } from '../../../models/core/core-access/CoreAccess';
import CoreAccessRepository from '../../../repositories/core/access/CoreAccessRepository';


/**
 * Service
 * @author Fidel Saldivar
 */
export default class CoreAccessService extends Service<CoreAccessRepository, CoreAccess> {


  /**
   * Creates an instance of WorkspaceAccessService
   * @constructor
   * @memberof CoreAccessService
   */
  constructor() {
    super(new CoreAccessRepository());
  }

  grantPermission(model: CoreAccess): Promise<CoreAccess> {
    logger.info('start grantPermission');
    return this.MRepository.saveOrGetExist({
      workspaceAccessId: {eq: model.workspaceAccessId as string},
      coreId: {eq: model.coreId as string}
    }, model);
      // return new Promise<CoreAccess> ((resolve, reject) => {
      //   logger.debug('create grantPermission');
      //   this.MRepository.saveIfNotExist({
      //     workspaceAccessId: {eq: model.workspaceAccessId as string},
      //     coreId: {eq: model.coreId as string}
      //   }).then(
      //     _access => {
      //       const allRoles = this.getLevelAccess(_access[0].levelAccess,
      //       model.levelAccess);
      //       model.levelAccess = allRoles;
      //       return this.MRepository.save(model);
      //     }
      //   ).catch(
      //     _error => {
      //       logger.error('create grantPermission', _error);
      //       reject(_error);
      //     }
      //   );
      // });
  }

  hasPermission(model: CoreAccess) {
    logger.info('start hasPermission');
    return this.MRepository.scan({
      workspaceAccessId: {eq: model.workspaceAccessId as string},
      coreId: {eq: model.coreId as string}
    });
  }

  getAllPermissionByWA(workspaceAccessId: string): Promise<CoreAccess[]> {
    return this.MRepository.listByWorkspaceAccess(workspaceAccessId);
  }

  /**
   *
   * @param currentPermisions Array of permission in DB
   * @param newPermisions Array of Permisions selected
   */
  // private getLevelAccess(currentPermisions: Array<any>, newPermisions: Array<any>): Array<any> {
  //   try {
  //     const _allPermision = currentPermisions.concat(newPermisions);
  //     return _allPermision.filter((el, i, a) => i === a.indexOf(el));
  //   } catch (error) {
  //     logger.error('error updateLevelAccess : ', error);
  //     return newPermisions;
  //   }
  // }

  async getComplete(id: string): Promise<any> {
    return this.MRepository.getComplete(id);
  }
}
