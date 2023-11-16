import Model, { User, UserKeySchema } from '../../models/auth-permissions/User';
import BaseRepository from '../BaseRepository';
import {orm} from '../../models';
export default class UserRepository extends BaseRepository<User, UserKeySchema> {

  constructor() {
    orm.init();
    console.log(orm.getModel(Model.name));
    super(orm.getModel(Model.name));
  }

  getByEmail(email: String): Promise<User | undefined> {
    return new Promise((resolve, reject) => {
      console.log('find user by email' + email);
      this.Model.scan({ email: {eq: email}}).exec().then(items => {
        console.log('items scan: ', items);
        if (items.length > 0) {
          resolve(items[0]);
        }
        resolve(undefined);
      }).catch(err => {
        console.error(err);
        throw err;
      });
    });
  }

  getById(uid: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      console.log('find user by uid');
      try {
        this.Model.scan('uid').eq(uid).exec().then(items => {
          console.log('items scan: ', items);
          if (items.length > 0) {
            resolve(items[0]);
          }
          resolve(null);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  findByToken(email: String, id: String): Promise<User | null> {
    return new Promise<User | null>((resolve, reject) => {
      const filter = {
        FilterExpression: 'tokenId = :token AND email = :email AND confirmed = :confirmed',
        ExpressionAttributeValues: {
          ':token': id,
          ':email': email,
          ':confirmed': true
        }
      };
      console.log('scan filter: ', filter);
      this.Model.scan(filter).exec((err: Error, items: Array<User>) => {
        console.log(`Items: \n ${items}, err: \n ${err}`);
        if (err) {
          reject(err);
        } else {
          if (items.length > 0) {
            resolve(items[0]);
          } else {
            resolve(null);
          }
        }
      });
    });
  }


  findByTokenWithoutConfirm(email: String, id: String): Promise<User | null> {
    return new Promise<User | null>((resolve, reject) => {
      const filter = {
        FilterExpression: 'tokenId = :token AND email = :email',
        ExpressionAttributeValues: {
          ':token': id,
          ':email': email
        }
      };
      console.log('scan filter: ', filter);
      this.Model.scan(filter).exec((err: Error, items: Array<User>) => {
        console.log(`Items: \n ${items}, err: \n ${err}`);
        if (err) {
          reject(err);
        } else {
          if (items.length > 0) {
            resolve(items[0]);
          } else {
            resolve(null);
          }
        }
      });
    });
  }

}
