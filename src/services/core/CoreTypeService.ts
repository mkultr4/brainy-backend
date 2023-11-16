import Service from '../Service';
import CoreTypeRepository from '../../repositories/core/CoreTypeRepository';
import {CoreType} from '../../models/core/CoreType';
import logger from '../../logger';

export default class CoreTypeService extends Service<CoreTypeRepository, CoreType> {

  private coreTypeRepository: CoreTypeRepository;

  constructor() {
    super(new CoreTypeRepository());
  }

  save(json: CoreType): Promise<CoreType> {
      logger.debug('save method repository:');
      return new Promise<CoreType>((resolve, reject) => {
        if (json != null) {
          logger.debug('creating model from service to repository:');
          resolve(this.coreTypeRepository.save(json).then((obj: CoreType) => {
            logger.debug('object created:', obj);
            return obj;
          }));
        } else {
          reject(new Error('Error in function save object null or undefined'));
        }
      });
  }

  update(keys: any, params: any): Promise<CoreType> {
    logger.debug('save method repository:');
    return new Promise<CoreType>((resolve, reject) => {
      if (keys != null) {
        logger.debug('creating model from service to repository:');
        resolve(this.coreTypeRepository.update(keys, params).then((obj: CoreType) => {
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
    return this.coreTypeRepository.delete(key);
    // return new Promise<undefined>((resolve, reject) => {
    //   if (key != null) {
    //     logger.debug('creating model from service to repository:');
    //     const keyDelete: CoreTypeKeySchema = {
    //       uid: key
    //     };
    //     resolve(this.coreTypeRepository.delete(keyDelete).then((): undefined => {
    //       return undefined;
    //     }));
    //   } else {
    //     reject(new Error('Error in function save object null or undefined'));
    //   }
    // });
  }

  public get(id: string) {
    return new Promise(async (resolve, reject) => {
      if (id != null) {
        this.coreTypeRepository.get(id).then((core) => {
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
    return this.coreTypeRepository.list();
    // return new Promise(async (resolve, reject) => {
    //   console.log('getting list type cores avaibles');
    //   resolve(this.coreTypeRepository.list());
    // });
  }

}
