import Service from '../Service';
import CoreStatusRepository from '../../repositories/core/CoreStatusRepository';
import { CoreStatus } from '../../models/core/CoreStatus';
import logger from '../../logger';

export default class CoreStatusService extends Service<CoreStatusRepository, CoreStatus> {

  private coreStatusRepository: CoreStatusRepository;

  constructor() {
    super(new CoreStatusRepository());
  }

  save(json: CoreStatus): Promise<CoreStatus> {
      logger.debug('save method repository:');
      return new Promise<CoreStatus>((resolve, reject) => {
          if (json != null) {
              logger.debug('creating model from service to repository:');
              resolve(this.coreStatusRepository.save(json).then((obj: CoreStatus) => {
                  logger.debug('object created:', obj);
                  return obj;
              }));
          } else {
              reject(new Error('Error in function save object null or undefined'));
          }
      });
  }

  update(keys: any, params: any): Promise<CoreStatus> {
      logger.debug('save method repository:');
      return new Promise<CoreStatus>((resolve, reject) => {
          if (keys != null) {
              logger.debug('creating model from service to repository:');
              resolve(this.coreStatusRepository.update(keys, params).then((obj: CoreStatus) => {
                  logger.debug('object updated:', obj);
                  return obj;
              }));
          } else {
              reject(new Error('Error in function save object null or undefined'));
          }
      });
  }

  delete(key: any): Promise<undefined> {
      logger.debug('save method repository:');
      return this.coreStatusRepository.delete(key);
  }

  public get(id: string) {
      return new Promise(async (resolve, reject) => {
          if (id != null) {
              this.coreStatusRepository.get(id).then((core) => {
                  logger.debug(`object returned for model ${core}`);
                  resolve(core);
              }).catch((err) => {
                  reject(err);
              });
          } else {
              reject(new Error('Params for search is null or undefined'));
          }
      });
  }

  list() {
    return this.coreStatusRepository.list();
    // return new Promise(async (resolve, reject) => {
    //     logger.debug('getting list type cores avaibles');
    //     resolve(this.coreStatusRepository.list());
    // });
  }

}
