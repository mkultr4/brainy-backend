import logger from '../logger';
import Repository from '../repositories/Repository';

export default class Service<T extends Repository<M>, M> {

  public MRepository: T;

  constructor(repository: T ) {
    this.MRepository = repository;
  }


  save(json: M, auth?: any): Promise<M> {
    logger.debug('save method repository:');
    return new Promise<M>((resolve, reject) => {
      if (json != null) {
        logger.debug('creating model from service to repository:');
        if (auth) {
          const user = auth.workspaceAccess.user;
          resolve(this.MRepository.save(json, user).then((obj: M) => {
            logger.debug('object created:', obj);
            return obj;
          }));
        } else {
          resolve(this.MRepository.save(json).then((obj: M) => {
            logger.debug('object created:', obj);
            return obj;
          }));
        }

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
        logger.debug('key update: ', keys);
        logger.debug('body update: ', params);
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
        resolve(this.MRepository.delete(keyDelete).then((): undefined => {
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
        logger.debug('begin get repository');
        await this.MRepository.get({uid: id}).then((obj: any) => {
          logger.debug(`object returned for model`, obj);
          if (obj === undefined) { throw new Error('object not found'); }

          resolve(obj as M);

        }).catch((err) => {
          logger.debug('error: ', err);
          reject(err);
        });
      } else {
        reject(new Error('Params for search is null or undefined'));
      }
    });
  }

  getById(id: String): Promise<M | undefined> {
    return this.get(id);
  }

  list(): Promise<M[]> {
    return new Promise(async (resolve, reject) => {
      logger.debug('getting list type cores avaibles');
      resolve(this.MRepository.list());
    });
  }

}
