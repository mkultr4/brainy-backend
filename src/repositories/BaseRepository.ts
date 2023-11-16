
import { Crud } from './Crud';
import * as dynamoose from 'dynamoose';
const beautify = require('json-beautify');
const colors = require('colors');

colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

export default class BaseRepository<U, K> implements Crud<U, K> {

  Model: dynamoose.ModelConstructor<U, K>;

  constructor(Model: dynamoose.ModelConstructor<U, K>) {
    this.Model = Model;
  }

  get(keys: any): Promise<U> {
    console.log(colors.info('Get base model: \n'), beautify(keys, null, 2, 80));
    return this.Model.get(keys) as Promise<U>;
  }

  save(json: U): Promise<U> {
    console.log(colors.info('Save base model: \n'), beautify(json, null, 2, 80));
    return new Promise<U>(async (resolve, reject) => {
      this.Model.create(json).then((o: any) => {
        delete o.$__;
        resolve(<U> o);
      }).catch( e => {
        reject(e);
      });
    });
  }

  saveIfNotExist(keys: any, json: U): Promise<U> {
    console.log(colors.info('Save base model: \n'), beautify(json, null, 2, 80));
    return new Promise<U>(async (resolve, reject) => {
      const exist = await this.scan(keys);

      if (exist.length === 0) {
        resolve( await this.save(json) );
      } else {
        reject(new Error('object is already exists'));
      }
    });
  }

  delete(keys: K): Promise<undefined> {
    console.log(colors.info('Delete base model: \n'), beautify(keys, null, 2, 80));
    return this.Model.delete(keys) as Promise<undefined>;
  }

  update(keys: K, params: any): Promise<U> {
    const options: dynamoose.UpdateOption = { updateTimestamps: true , allowEmptyArray: true , createRequired: true};
    return this.Model.update(keys, { $PUT: params }, options) as Promise<U>;
  }

  list(): Promise<Array<U>> {
    return new Promise<Array<U>>((resolve, reject) => {
      console.log(`List objects from : ${this.Model}`);
      this.Model.scan().exec((err: Error, items: Array<U>) => {
        console.log(`Items: \n ${items}, err: \n ${err}`);
        if (err) {
          reject(err);
        } else {
          resolve(items as Array<U>);
        }
      });
    });
  }

  scan(filter: any): Promise<Array<U>> {
    return new Promise<Array<U>>((resolve, reject) => {
      console.log(`scan method base repository `);
      console.log(`filter : \n `, beautify(filter, null, 2, 80));
      this.Model.scan(filter).exec((err: Error, items: Array<U>) => {
        console.log(`Items: \n ${items}, err: \n ${err}`);
        if (err) {
          reject(err);
        } else {
          resolve(items as Array<U>);
        }
      });
    });
  }

}


