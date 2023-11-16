import Service from '../../Service';
import logger from '../../../logger';
import { CoreFunction } from '../../../models/core/core-access/CoreFunction';
import CoreFunctionRepository from '../../../repositories/core/access/CoreFunctionRepository';


/**
 * Service
 * @author
 */
export default class CoreAccessService extends Service<CoreFunctionRepository, CoreFunction> {


  /**
   * Creates an instance of WorkspaceAccessService
   * @constructor
   * @memberof CoreFunctionRepository
   */
  constructor() {
    super(new CoreFunctionRepository());
  }

  getByGroupId(groupId: string) {
      return this.MRepository.getByGroupId(groupId);
  }

}
