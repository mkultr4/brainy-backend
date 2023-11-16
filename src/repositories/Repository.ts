import { BaseCrud } from './Crud';
import * as dynamoose from 'dynamoose';
import Util from '../util/utils';
const beautify = require('json-beautify');
const colors = require('colors');

colors.setTheme(Util.Logger.theme);

export default class Repository<M> implements BaseCrud<M> {

  Model: dynamoose.ModelConstructor<M, {}>;

  constructor(Model: dynamoose.ModelConstructor<M, {}>) {
    this.Model = Model;
  }

  get(keys: any): Promise<dynamoose.ModelSchema<M> | undefined> {
    console.log(colors.info('Get base model: \n'), beautify(keys, null, 2, 80));
    return this.Model.get(keys);
  }

  save(model: M, user?: any): Promise<dynamoose.ModelSchema<M>> {
    return new Promise<dynamoose.ModelSchema<M>>(async (resolve, reject) => {
      console.log(colors.info('Save base model: \n'), beautify(model, null, 2, 80));
      if (user) {
        (<any>model).createdBy = user.uid;
        (<any>model).updatedBy = user.uid;
      }
      this.Model.create(model).then((o: any) => {
        resolve(o);
      }).catch( e => {
        reject(e);
      });
    });
  }

  saveIfNotExist(keys: any, model: M): Promise<dynamoose.ModelSchema<M>> {
    console.log(colors.info('Save base model: \n'), beautify(model, null, 2, 80));
    return new Promise<dynamoose.ModelSchema<M>>(async (resolve, reject) => {
      const exist = await this.scan(keys);
      console.log('count: ', exist.length , exist);
      if (exist.length > 0) {
        throw new Error('object in database');
      } else {
        resolve( await this.save(model) );
      }
    });
  }

  saveOrGetExist(keys: any, model: M): Promise<M> {
    console.log(colors.info('Save base model saveOrGetExist: \n'), beautify(model, null, 2, 80));
    return new Promise<M>(async (resolve, reject) => {
      const exist = await this.scan(keys);
      console.log('count: ', exist.length , exist);
      if (exist.length > 0) {
        resolve(exist[0]);
      } else {
        resolve( await this.save(model) );
      }
    });
  }

  delete(keys: any): Promise<undefined> {
    console.log(colors.info('Delete base model: \n'), beautify(keys, null, 2, 80));
    return this.Model.delete(keys) as Promise<undefined>;
  }

  update(keys: any, params: Partial<M>, user?: any): Promise<M> {
    const options: dynamoose.UpdateOption = { updateTimestamps: true , allowEmptyArray: true , createRequired: true};
    if (user) {
      (<any>params).updatedBy = user.uid;
    }
    return this.Model.update(keys, { $PUT: params }, options) as Promise<M>;
  }

  list(): Promise<Array<M>> {
    return new Promise<Array<M>>((resolve, reject) => {
      console.log(`List objects from : ${this.Model}`);
      this.Model.scan().exec((err: Error, items: Array<M>) => {
        console.log(`Items: \n ${items}, err: \n ${err}`);
        if (err) {
          reject(err);
        } else {
          resolve(items as Array<M>);
        }
      });
    });
  }

  scan(filter: any): Promise<Array<M>> {
    return new Promise<Array<M>>((resolve, reject) => {
      console.log(`scan method base repository `);
      console.log(`filter : \n `, beautify(filter, null, 2, 80));
      this.Model.scan(filter).exec((err: Error, items: Array<M>) => {
        console.log(`Items: \n ${items}, err: \n ${err}`);
        if (err) {
          reject(err);
        } else {
          resolve(items as Array<M>);
        }
      });
    });
  }

}


