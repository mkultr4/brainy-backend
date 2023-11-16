import logger from '../../../logger';
import CoreAccessService from './CoreAccessService';

/**
 * Service
 * @author
 */
export default class SessionCoreService {

  private coreAccessService: CoreAccessService;

  constructor() {
   this.coreAccessService = new CoreAccessService();
  }

  getAs(coreAccessID: any) {
    return new Promise<any>(async (resolve, reject) => {
        try {
            logger.debug('init method get session core');
            const coreAccess = await this.coreAccessService.getComplete(coreAccessID);
            resolve(coreAccess);
        } catch (error) {
            logger.debug('Error: ', error);
            reject(error);
        }
    });
  }
}
