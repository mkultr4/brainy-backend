import UserRepository from '../repositories/auth-permissions/UserRepository';
import {User} from '../models/auth-permissions/User';

export default class UserService {

  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Email Validation, this method was created to check email in database.
   * @author Gibran Cordoba
   * @param {String} email email to validate
   * @returns {(Promise<Boolean>)}
   * @memberof UserService
   */
  emailExists(email: String): Promise<Boolean> {
    return new Promise<Boolean>(async (resolve, reject) => {
      console.log('Verificando usuario en base de datos');
      try {
        console.log('Buscando usuario en base de datos por email...');
        const user = await this.userRepository.getByEmail(email as string);
        if (user != null) {
          console.log('user encontrado: ', user);
          return resolve(true);
        } else {
          console.log('usuario no encontrado');
          return resolve(false);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  getByEmail(email: String): Promise<User | undefined> {
    return new Promise<User | undefined>(async (resolve, reject) => {
      console.log('Verificando usuario en base de datos');
      try {
        console.log('Buscando usuario en base de datos por email...');
        resolve(await this.userRepository.getByEmail(email));
      } catch (error) {
        reject(error);
      }
    });
  }

  getById(userId: String): Promise<User | null> {
    return new Promise<User | null>(async (resolve, reject) => {
      console.log('Verificando usuario en base de datos');
      try {
        console.log('Buscando usuario en base de datos por email...');
        const user = await this.userRepository.getById(userId as string);
        if (user != null) {
          console.log('user encontrado: ', user);
          return resolve(user);
        } else {
          console.log('usuario no encontrado');
          return resolve(null);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  async confirmUser(user: User): Promise<User> {
    console.log('updating... user confirm');
    user.confirmed = true;
    user = await this.userRepository.update({
      uid: <any>user.uid
    }, { confirmed: true });
    console.log('new User:', user);
    return user;
  }

  userIsRegister(profile: any): Promise<Boolean> {
    return new Promise<Boolean>(async (resolve, reject) => {
      console.log('Verificando usuario en base de datos', profile);
      try {
        console.log('Buscando usuario en base de datos por email...');
        const user = await this.userRepository.getByEmail(profile.email);
        console.log('user encontrado: ', user);
        if (user != null) {
          resolve(true);
        }
        resolve(false);
      } catch (error) {
        reject(error);
      }
    });
  }

  validatePassword(pass: string, verifypass: string) {
    return (pass === verifypass);
  }

  validateToken(token: string, tokenId: string) {
    return (token === tokenId);
  }

  /**
   * findByToken
   */
  findByToken(email: String, token: String): Promise<User | null> {
    console.log('findByToken', email, token);
    return this.userRepository.findByToken(email, token);
  }

  /**
   * findByToken
   */
  findByTokenWithoutConfirm(email: String, token: String): Promise<User | null> {
    console.log('findByToken', email, token);
    return this.userRepository.findByTokenWithoutConfirm(email, token);
  }

  save(user: User) {
    return this.userRepository.save(user);
  }

  update(keys: any, params: any) {
    return this.userRepository.update(keys, params);
  }

  async getBasicDataUserById(key: string) {
    const user = await this.userRepository.getById(key).catch((err) => {
      return undefined;
    });

    if (user === undefined || user === null ) {
      throw new Error(`User not found with key ${key}`);
    }

    return  {
      uid: user.uid,
      name: user.name,
      email: user.email
    };
  }

  createModel(user: User) {
    const userModel = new this.userRepository.Model(user);
    return userModel;
  }
}
