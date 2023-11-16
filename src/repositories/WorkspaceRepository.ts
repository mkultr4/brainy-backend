
// import * as AWS from 'aws-sdk';
import * as dynamoose from 'dynamoose';
// import * as uuid from 'uuid';

import Model, { Workspace } from '../models/workspace/Workspace';
import logger from '../logger';
import {orm} from '../models';

export class WorkspaceRepository {
  private Model: dynamoose.ModelConstructor<Workspace, {}>;
  constructor() {
    orm.init();
    this.Model = orm.getModel(Model.name);
  }

  get(id: string): Promise<Workspace> {
    return this.Model.get({ uid: id }) as Promise<Workspace>;
  }

  save(json: Workspace): Promise<any> {
    logger.debug('save method repository');
    const options: dynamoose.PutOptions = {
      overwrite: false,
    };
    return this.Model.create(json, options);
  }

  async delete(id: string): Promise<undefined> {
    const model = await this.Model.get({ uid: id });
    if (!model) {  throw new Error('element not found'); }

    return model.delete();
  }

  public async update(keys: any, params: any): Promise<any> {
    return await this.Model.update(keys, params);
  }


  public getAll(): Promise<Array<Workspace>> {
    return new Promise((resolve: any, reject: any) => {
      this.Model.scan('deleted').contains(false).exec((err: any, obj: Array<Workspace>) => {
        if (err != null) {  reject(new Error('Internal error')); }

        resolve(obj);
      });
    });
  }

  public getWorkspaceByUserID(userID: any): Promise<Array<Workspace>>  {
    return new Promise((resolve: any, reject: any) => {
      this.Model.scan('owner_id').contains(userID).exec((err: any, obj: Array<Workspace>) => {
          if (err != null) { reject(new Error('Internal error')); }
          resolve(obj);
      });
    });
  }

  saveIfNotExist(keys: any, model: Workspace): Promise<Workspace> {
    return new Promise<Workspace>(async (resolve, reject) => {
      const exist: any = await this.Model.scan(keys).exec();
      console.log('count: ', exist.length , exist);
      if (exist.length > 0) {
        throw new Error('workspace in database');
      } else {
        resolve( await this.Model.create(model));
      }
    });
  }

  saveOrGetExist(keys: any, model: Workspace): Promise<Workspace> {
    return new Promise<Workspace>(async (resolve, reject) => {
      const exist: any = await this.Model.scan(keys).exec();
      console.log('count: ', exist.length , exist);
      if (exist.length > 0) {
        resolve(exist[0]);
      } else {
        resolve( await this.Model.create(model));
      }
    });
  }

}
