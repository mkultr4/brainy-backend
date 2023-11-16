// models
import { User } from '../models/auth-permissions/User';
import { Workspace } from '../models/workspace/Workspace';
import { WorkspaceAccess } from '../models/workspace/access/WorkspaceAccess';
import { Registration } from '../interfaces/app/auth-permission/Auth';
// Services
import UserService from './UserService';
import WorkspaceService from './WorkspaceService';
import WorkspaceAccessService from './workspaces/access/WorkspaceAccessService';
import RoleService from './auth-permissions/RoleService';
import { EmailService } from './EmailService';
// modules
import { JsonWebToken } from '../util/services/services';
import { EmailKey } from '../../src/util/builders/EmailBuilder';
import logger from '../logger';
import config from '../conf';
import { Validations } from '../util/utils';
const bcrypt = require('bcryptjs');
import { Roles } from '../statics';
import {
  UserNotValidException,
  BadRequestError, UserNotFoundException,
  UserInDatabaseException, EmailException,
  PasswordException,
  RegisterException,
  SocialException
} from '../util/errors/Error';

export default class AuthService {

  private workspaceService: WorkspaceService;
  private emailService: EmailService;
  private userService: UserService;
  private wsaService: WorkspaceAccessService;
  private roleService: RoleService;

  constructor() {
    this.userService = new UserService();
    this.emailService = new EmailService();
    this.workspaceService = new WorkspaceService();
    this.wsaService = new WorkspaceAccessService();
    this.roleService = new RoleService();
  }

  static createToken(user: User, remind: Boolean = false) {
    return JsonWebToken.encode(
      { 'user': user },
      (remind) ?  config.JWT_EXPIRATION_TIME : config.JWT_EXPIRATION_REMIENDER_TIME
    );
  }

  static createWSToken(workspaceAcess: WorkspaceAccess) {
    return JsonWebToken.encode(
      { 'workspaceAccess': workspaceAcess },
      config.JWT_EXPIRATION_TIME
    );
  }

  static createCoreToken(coreAccess: WorkspaceAccess) {
    return JsonWebToken.encode(
      { 'coreAccess': coreAccess },
      config.JWT_EXPIRATION_TIME
    );
  }

  static createRegistrationToken(user: User, params?: any) {
    const now = new Date().getTime();
    const transaction: Registration = {
      createdAt: now,
      userRegistered: user
    };
    if (params) {
      transaction.params = params;
    } else {
      transaction.params = { type: 'register' };
    }

    return JsonWebToken.encode(
      { 'registration': transaction },
      config.JWT_CONFIRMACION_EXPIRATION_TIME
    );
  }

  static verify(token: string): any {
    return JsonWebToken.decode(token);
  }

  authenticate(profile: any) {
    console.log('authenticate method: ');
    return new Promise<User>(async (resolve, reject) => {
      try {
        console.log('Provider: ', profile.provider);
        switch (profile.provider) {
          case 'BASIC':
            // Basic Authenticate
            // NTH: se puede hacer un provider de auth despues al final todos recuperan un user
            //    Se podria implementar en un futuro
            this.validateProfileInformacion(profile);

            const user = await this.userService.getByEmail(profile.email);
            console.log('user basic found: ', user);

            if (user == null) {
              throw new UserNotFoundException('Usuario y/o contraseña no valida, verificar nuevamente');
            }

            const matchPass = await bcrypt.compare(profile.password, user.password);

            if (matchPass) {
              if (user.confirmed) {
                resolve(user);
              } else {
                throw new UserNotValidException('User no esta confirmado');
              }
            } else {
              throw new PasswordException(
                `Oops! Esa combinación de correo electrónico / contraseña no es válida`,
                `password-confirmation-does-not-match`,
                `La confirmación de la contraseña no coincide`
              );
            }
            break;
          case 'FACEBOOK':
            console.log('authenticate facebook account');
            this.validateProfileInformacion(profile);
            const validUser = await this.authenticateSocial('facebook', profile);
            console.log('validUser', validUser);
            if (!validUser) {
              throw new UserNotValidException('Oops! Esa combinación de correo electrónico / contraseña no es válida. ');
            }

            console.log('user facebook found: ', validUser);
            const matchTokenFb = this.userService.validateToken(profile.id, validUser.tokenId);

            if (matchTokenFb) {
              if (validUser.confirmed) {
                resolve(validUser);
              } else {
                throw new UserNotValidException('User no esta confirmado');
              }
            } else {
              throw new SocialException(
                `Oops! Esa combinación de correo electrónico / contraseña no es válida`,
                `token-does-not-match`,
                `Token no Coincide`
              );
            }
            break;
          case 'GOOGLE':
            this.validateProfileInformacion(profile);
            const validGoogleUser = await this.authenticateSocial('google', profile);
            console.log('user google found: ', validGoogleUser);
            if (!validGoogleUser) {
              throw new UserNotValidException('Oops! Esa combinación de correo electrónico / contraseña no es válida. ');
            }

            const matchToken = this.userService.validateToken(profile.id, validGoogleUser.tokenId);

            if (matchToken) {
              if (validGoogleUser.confirmed) {
                resolve(validGoogleUser);
              } else {
                throw new UserNotValidException('User no esta confirmado');
              }
            } else {
              throw new SocialException(
                `Oops! Esa combinación de correo electrónico / contraseña no es válida`,
                `token-does-not-match`,
                `Token no Coincide`
              );
            }
            break;

          default:
            throw new BadRequestError('provider method is not allowed');
        }

        throw new BadRequestError('Usuario y/o contraseña no valida, verificar nuevamente');
      } catch (error) {
        reject(error);
      }


    });
  }

  private validateProfileInformacion(profile: any): void {
    if (!profile.email) {
      throw new EmailException(
        'Oops! Esa combinación de correo electrónico / contraseña no es válida',
        'blank-email',
        'El email está en blanco'
      );
    }

    if (!Validations.email(profile.email)) {
      throw new EmailException('Oops! correo electrónico inválido', 'invalid-email');
    }

    if (profile.provider === 'BASIC') {
      if (!profile.password) {
        throw new PasswordException(
          `Oops! Esa combinación de correo electrónico / contraseña no es válida.`,
          `blank-password`,
          `El password está en blanco`
        );
      }
    } else {
      if (!profile.id) {
        throw new SocialException(
          `Oops! Esa combinación de correo electrónico / contraseña no es válida.`,
          `social-blank-id`,
          `El token id está en blanco`
        );
      }
    }

  }

  private async authenticateSocial(type: string, profile: any) {
    let userFound: any;
    try {
      console.log('authenticateSocial');
      console.log('find user in database');
      userFound = await this.userService.findByTokenWithoutConfirm(profile.email, profile.id);
      console.log('userFound', userFound);
    } catch (error) {
      userFound = undefined;
      console.error('error authenticateSocial: ', error);
      throw error;
    }

    return (userFound) ? userFound : null;
  }

  register(profile: any) {
    return new Promise<User>(async (resolve, reject) => {
      try {
        let userCreated: User;
        let isInDatabase: Boolean = false;

        switch (profile.provider) {
          case 'BASIC':
            // Validando Usaurio y password para registrar

            this.validateProfileInformacion(profile);

            if (!Validations.password(profile.password)) {
              throw new PasswordException(
                `Su contraseña debe tener al menos 8 caracteres alfanuméricos.`,
                `invalid-password-format`,
                `La contraseña debe tener letras y números y mas de 8 caracteres`
              );
              // throw new Error('Su contraseña debe tener al menos 8 caracteres alfanuméricos.');
            }

            if (!this.userService.validatePassword(profile.password, profile.verifyPassword)) {
              throw new PasswordException(
                `Oops! Esa combinación de correo electrónico / contraseña no es válida`,
                `password-confirmation-does-not-match`,
                `El email está en blanco`
              );
            }

            isInDatabase = await this.userService.userIsRegister(profile);
            if (isInDatabase) {
              throw new UserInDatabaseException('Este correo electrónico ya está registrado.');
            }

            // Creando registro de nuevo usuario
            const basicUser = await this.createUserRegister('BASIC', profile);
            console.log('user model:', basicUser);
            userCreated = <User>await this.userService.save(basicUser);
            break;
          case 'FACEBOOK':
            // resolviendo informacion de facebook
            this.validateProfileInformacion(profile);
            isInDatabase = await this.userService.userIsRegister(profile);
            if (isInDatabase) {
              throw new UserInDatabaseException('Este correo electrónico ya está registrado.');
            }

            const socialFbUser = await this.createUserRegister('FACEBOOK', profile);
            console.log('user model:', socialFbUser);
            userCreated = <User>await this.userService.save(socialFbUser);
            break;

          case 'GOOGLE':
            this.validateProfileInformacion(profile);
            // resolviendo informacion de google para regisrto
            isInDatabase = await this.userService.userIsRegister(profile);
            if (isInDatabase) {
              throw new UserInDatabaseException('Este correo electrónico ya está registrado.');
            }

            const socialGoogleUser = await this.createUserRegister('GOOGLE', profile);
            console.log('User model:', socialGoogleUser);
            userCreated = <User>await this.userService.save(socialGoogleUser);
            break;
          default:
            throw new BadRequestError('register provider is not allowed');
        }
        console.log('userCreated:', userCreated);
        if (userCreated) {
          const created: User = userCreated as User;
          console.log(created);
          resolve(created);
        } else {
          throw new Error('Usuario y/o contraseña no valida, verificar nuevamente');
        }
      } catch (error) {
        logger.error('Error service.:', JSON.stringify(error));
        reject(error);
      }
    });
  }

  confirm(token: String): Promise<User> {
    return new Promise<User>(async (resolve, reject) => {
      try {
        const registerInformation = AuthService.verify(token as string);
        console.log('Registration information: ', registerInformation);
        const registration = registerInformation.registration;
        const user: User = registration.userRegistered;
        resolve(await this.processUserConfirmation(user));
      } catch (error) {
        reject(error);
      }
    });
  }

  async processUserConfirmation(user: User) {
    const userDatabase = await this.userService.getByEmail(user.email);
    if (userDatabase !== undefined) {
      if (userDatabase.uid === user.uid) {
        if (!userDatabase.confirmed) {
          const workspace: any = await this.workspaceService.saveOrGetExist({
            name: 'My Workspace',
            owner_id: user.uid,
            config: {
              thumbnail: 'https://s3.amazonaws.com/brainy-img/img/home/logo_brainy.png',
              backgroundColor: '#18191A'
            }
          } as Workspace);

          if (!workspace) { throw new Error('Error creando workspace'); }
          const Role = await this.roleService.getByKey(Roles.Admin);

          if (Role === undefined) { throw new Error('Role no encontrado'); }

          this.wsaService.createAccess({
            workspace: workspace.uid,
            user: user.uid,
            role: Role.uid,
          } as WorkspaceAccess);

          return await this.confirmUser(user);

          // user = await this.confirmUser(user);
        } else {
          throw new RegisterException('Usuario ya se encuentra registrado', 'user-is-confirmed');
        }
      } else {
        throw new RegisterException('Usuario y registro no son iguales', 'registration-key-doesnt-match');
      }
    } else {
      throw new UserNotFoundException('Usuario no encontrado en base de datos');
    }
  }

  async confirmationProcedure(token: String) {
    try {
      const user = await this.confirm(token);
      this.sendEmailActivatedAccount(
        user.email as string,
        config.APP_DOMAIN + '/#/public/login/'
      );
    } catch (error) {
      console.error(error);
    }
  }

  private async confirmUser(user: User): Promise<User> {
    console.log('updating... user confirm');
    user.confirmed = true;
    user = await this.userService.update({
      uid: <any> user.uid
    }, {
      confirmed: true,
      confirmationTimestamp: new Date().getTime()
    });
    console.log('new User:', user);
    return user;
  }

  private async createUserRegister(type: string, profile: any) {
    const newUser: User = {
      email: profile.email,
      confirmed: false,
      active: true,
      provider: profile.provider
    };

    switch (profile.provider) {
      case 'BASIC':
        newUser.password = await bcrypt.hash(profile.password, config.SALT_ROUNDS);
        break;

      case 'FACEBOOK':
        newUser.firstName = (profile.firstName) ? profile.firstName : '';
        newUser.lastName = (profile.lastName) ? profile.lastName : '';
        newUser.name = (profile.name) ? profile.name : '';
        newUser.photoUrl = (profile.photoUrl) ? profile.photoUrl : '';
        newUser.tokenId = profile.id;
        newUser.authToken = profile.authToken;
        break;

      case 'GOOGLE':
        newUser.name = (profile.name) ? profile.name : '';
        newUser.photoUrl = (profile.photoUrl) ? profile.photoUrl : '';
        newUser.tokenId = profile.id;
        newUser.authToken = profile.authToken;
        break;
    }
    newUser.acronym = (newUser.name) ? newUser.name[0] : newUser.email[0];
    console.log('user created object:', newUser);

    return this.userService.createModel(newUser);
  }

  async changePassword(user: any, profile: any) {
    logger.debug('prifile change password: ', profile);
    const password = profile.password;
    const verifyPassword = profile.verifyPassword;

    if (!password) {
      throw new PasswordException(
        `Oops! Esa combinación de correo electrónico / contraseña no es válida.`,
        `blank-password`,
        `El password está en blanco`
      );
    }

    logger.debug('password pofile: ', password);

    if (!Validations.password(password)) {
      throw new PasswordException(
        `Su contraseña debe tener al menos 8 caracteres alfanuméricos.`,
        `invalid-password-format`,
        `La contraseña debe tener letras y números y mas de 8 caracteres`
      );
    }

    if (!this.userService.validatePassword(password, verifyPassword)) {
      throw new PasswordException(
        `Oops! Esa combinación de correo electrónico / contraseña no es válida`,
        `password-confirmation-does-not-match`,
        `El email está en blanco`
      );
    }

    const passwordEncript = await bcrypt.hash(password, config.SALT_ROUNDS);
    logger.debug('password encript: ', passwordEncript);

    if (user == null) {
      throw new UserNotFoundException('Usuario no valido, verificar nuevamente');
    }

    const updateUser = await this.userService.update(user.uid as string, {password: passwordEncript});

    return updateUser;

  }

  public async userInDatabase(profile: any) {
    console.log('userInDatabase profile: ', profile);
    try {
      const isInDatabase = await this.userService.userIsRegister(profile);
      console.log(isInDatabase);
      if (isInDatabase) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // logout() {

  // }

  async forgottenPassword(email: string) {
    const user = await this.userService.getByEmail(email);
    if (user == null) {
      throw new UserNotFoundException('Usuario no valido, verificar nuevamente');
    }
    const token = AuthService.createToken(user);
    const urlToConfirm = config.APP_DOMAIN + '/#/public/recover-password-confirm/' + token;
    return this.sendEmailforgottenPassword(urlToConfirm, user);
  }

  /**
  * Send email validate account
  * @param {string} emailTo
  * @param {string} urlWithToken - Url application with http://my-app/public/confirm-email/:token
  */
  sendEmailValidateAccount(emailTo: string, urlWithToken: string) {
    // Send the email
    return this.emailService.sendEmail(this.emailService.builder(
      <String>emailTo,
      'Activar cuenta',
      EmailKey.accounValidation.toString(),
      { urlConfirm: urlWithToken }
    ));
  }

  /**
   * Send email when the account is activate
   * @param {string} emailTo
   * @param {string} urlLogin  - Url login of app http://my-app/public/login
   */
  sendEmailActivatedAccount(emailTo: string, urlLogin: string) {
    // Send the email
    return this.emailService.sendEmail(this.emailService.builder(
      <String>emailTo,
      'Su cuenta ha sido activada',
      EmailKey.accounActivate.toString(),
      { urlLogin: urlLogin }
    ));
  }

  /**
   * Send email welcome and thanks
   * @param emailTo
   * @param profile
   */
  sendEmailWelcomeThanks(emailTo: string, profile: any) {
    // Send the email
    return this.emailService.sendEmail(this.emailService.builder(
      <String> emailTo,
      'Bienvenido a Brainy',
      EmailKey.welcomeThanks.toString(),
      { name: profile.name }
    ));
  }

  /**
   * Send email welcome
   * @param emailTo
   * @param profile
   */
  sendEmailWelcome(emailTo: string, profile: any) {
    // Send the email
    return this.emailService.sendEmail(this.emailService.builder(
      <String> emailTo,
      'Bienvenido a Brainy',
      EmailKey.welcome.toString(),
      { name: profile.name }
    ));
  }

  sendEmailforgottenPassword(urlToConfirm: string, user: User) {
    return this.emailService.sendEmail(this.emailService.builder(
      <String> user.email,
      'Restaurar contraseña',
      EmailKey.restorePassword.toString(),
      { name: user.name, urlRestore: urlToConfirm }
    ));
  }

}
