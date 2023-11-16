import logger from '../logger';
import BaseRepository from '../repositories/BaseRepository';

export default class BaseService<T extends BaseRepository<M, K>, M, K> {

  public MRepository: T;

  constructor(repository: T ) {
    this.MRepository = repository;
  }


  save(json: M): Promise<M> {
    logger.debug('save method repository:');
    return new Promise<M>((resolve, reject) => {
      if (json != null) {
        logger.debug('creating model from service to repository:');
        resolve(this.MRepository.save(json).then((obj: M) => {
          logger.debug('object created:', obj);
          return obj;
        }));
      } else {
        reject(new Error('Error in function save object null or undefined'));
      }
    });
  }

  update(keys: any, params: any): Promise<M> {
    logger.debug('save method repository:');
    return new Promise<M>((resolve, reject) => {
      if (keys != null) {
        logger.debug('creating model from service to repository:');
        resolve(this.MRepository.update(keys, params).then((obj: M) => {
          logger.debug('object updated:', obj);
          return obj;
        }));
      } else {
        reject(new Error('Error in function save object null or undefined'));
      }
    });
  }

  delete(key: any): Promise<undefined> {
    logger.debug('delete method service:');
    return new Promise<undefined>((resolve, reject) => {
      if (key != null) {
        const keyDelete: any = {
          uid: key
        };
        resolve(this.MRepository.delete(<K> keyDelete).then((): undefined => {
          return undefined;
        }));
      } else {
        reject(new Error('Error in function save object null or undefined'));
      }
    });
  }

  get(id: String): Promise<M> {
    return new Promise<M>(async (resolve, reject) => {
      logger.debug(`get item with id '${id}'`);
      if (id !== undefined && id !== '') {
        this.MRepository.get(id).then((obj: M) => {
          logger.debug(`object returned for model`, obj);
          resolve(obj);
        }).catch((err) => {
          reject(err);
        });
      } else {
        reject(new Error('Params for search is null or undefined'));
      }
    });
  }

  getById(id: String): Promise<M> {
    return this.get(id);
  }

  list(): Promise<M[]> {
    return new Promise(async (resolve, reject) => {
      logger.debug('getting list type cores avaibles');
      resolve(this.MRepository.list());
    });
  }

}
