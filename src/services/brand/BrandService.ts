import Service from '../Service';
import {Brand} from '../../models/brand/Brand';
import logger from '../../logger';
import BrandRepository from '../../repositories/brand/BrandRepository';

/**
 * Core class.
 * @author Fidel Saldivar
 * @created July 2018
 *
 * @export
 * @class CoreService
 * @extends {Service<BrandRepository, Brand>}
 *
 */
export default class BrandService extends Service<BrandRepository, Brand> {




  /**
   * Creates an instance of CoreService
   * @constructor
   * @memberof BrandService
   */
  constructor() {
    super(new BrandRepository());
  }
  findAllByWorkspace(workspaceId: string): Promise<any> {
    logger.debug(' method findByWorkspace [workspaceId]', workspaceId);
    return this.MRepository.findAllByWorkspace(workspaceId);
  }

  /**
   * @deprecated make no sence
   * @param workspaceId Id
   */
  findByWorkspace(workspaceId: string): Promise<any> {
    logger.debug('save method findByWorkspace:');
    return this.MRepository.findByWorkspace(workspaceId);
  }

  public findByUser(userID: string): Promise<Array<Brand> | null>  {
    logger.debug('save method findByUser:');
    return this.MRepository.findByUser(userID);
  }

}
