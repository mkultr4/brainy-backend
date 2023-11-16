import { BadRequestError, InvitationException } from './../../util/errors/Error';
import { EmailService } from '../EmailService';
import UserService from '../UserService';
import InvitationRepository from '../../repositories/invitations/InvitationRepository';
import Model, { Invitation } from '../../models/invitations/Invitation';
import { User } from '../../models/auth-permissions/User';
import { EmailKey } from '../../util/builders/EmailBuilder';
import logger from '../../../src/logger';
import RoleService from '../auth-permissions/RoleService';
import config from '../../conf';
import { JsonWebToken } from '../../util/services/services';
import { Role } from '../../models/auth-permissions/Role';
import Service from '../Service';
import WorkspaceAccessCategoryService from '../../services/workspaces/access/WorkspaceAccessCategoryService';
import WorkspaceAccessService from '../../services/workspaces/access/WorkspaceAccessService';
import CoreAccessService from '../../services/core/access/CoreAccessService';
import { Roles } from '../../statics';
import AuthService from '../AuthService';

export default class InvitationService  extends Service<InvitationRepository, Invitation> {

  private emailService: EmailService;
  private userService: UserService;
  private roleService: RoleService;
  private workspaceAccessCategoryService: WorkspaceAccessCategoryService;
  private workspaceAccessService: WorkspaceAccessService;
  private coreAccessService: CoreAccessService;
  private authService: AuthService;

  constructor() {
    super(new InvitationRepository());
    this.emailService = new EmailService();
    this.userService = new UserService();
    this.roleService = new RoleService();
    this.workspaceAccessService = new WorkspaceAccessService();
    this.coreAccessService = new CoreAccessService();
    this.workspaceAccessCategoryService = new WorkspaceAccessCategoryService();
    this.authService = new AuthService();
  }

  /**
   * Create token of invitation
   * @param invitation
   */
  static createToken(object: any) {
    return JsonWebToken.encode(object, config.JWT_INVITATION_EXPIRATION_TIME);
  }

  /**
   * Verify token
   * @param token
   */
  static verifyToken(token: string): any {
    return JsonWebToken.decode(token);
  }

  /**
   * Get invitation by id
   * @param {string} key
   */
  async getById(id: String): Promise<Invitation> {
    const invitation = await this.MRepository.getById(id);
    if (invitation !== undefined) {
      return invitation;
    } else {
      throw new InvitationException(`Invitation ID doesn't valid`);
    }
  }

  // /**
  //  * Update invitation
  //  * @param key
  //  * @param invitation
  //  */
  // update(key: any, invitation: any): Promise<Invitation> {
  //   logger.debug('update method repository:');
  //   return new Promise<Invitation>(async (resolve, reject) => {
  //     if (invitation != null && key != null) {
  //       logger.debug(`key: ${key}`);
  //       logger.debug('content from update:', invitation);

  //       const exist = await this.invitationRepository.getById(key);
  //       logger.debug('Exist', exist);
  //       if (!exist) {
  //         reject(new Error(`Update not found with key ${key}`));
  //         return;
  //       }

  //       resolve(this.invitationRepository.update({ uid: key }, invitation).then((i: Invitation) => {
  //         logger.debug('object Pin updated:', i);
  //         return i;
  //       }));
  //     } else {
  //       reject(new Error('Error in function update object null or undefined'));
  //     }
  //   });
  // }

  /**
   * Create a invitation method, it is used to create a new invitation to different levels
   *
   * @author Gibran Cordoba
   *
   * @param {Invitation} invitation Current invitation informaciton to proccess
   * @param {User} user current session user to proccess the invitation
   * @memberof InvitationService
   *
   * @returns {Promise<Invitation | null>} return new promise with and invitation or null
   *
   */
  save(invitation: Invitation, user: User): Promise<Invitation> {
    return new Promise<Invitation>(async (resolve, reject) => {
      logger.debug('Creating an invitation...', invitation);
      try {
        // Invitation created
        let invitationCreated: any;
        const role: Role = await this.roleService.getById(invitation.role as string);
        console.log('Role:', role);

        if (invitation.level === Model.config.statics.level.WORKSPACE) {
          delete invitation.group;
        }

        // Validar que el role exista
        if (role) {
          // Buscar email en la invitacion para procesar
          if (invitation.email) {
            // Crear invitacion para el email
            // Validar que email no exista en base de datos
            const userEmail = await this.userService.getByEmail(invitation.email);
            console.log('user in database email: ', userEmail);
            if (userEmail === undefined) {
              invitation.type = Model.config.statics.types.NEW_USER;
              // Es un email Valido y puede ser usado para crear una invitacion de un nuevo usuario para registrarlo
              if (!await this.invitationExists(invitation)) {
                // No cuenta con ninguna invitacion...
                console.log('invitacion no existe');
                if (RoleService.isGuest(role)) {
                  // Verificando la categoria exista...
                  console.log('invitacion es a un guest');
                  invitation = await this.processCategory(invitation, user);
                } else {
                  // Eliminando categorya para cualquier otro usuario que no sea Guest
                  console.log('invitacion no es a un guest');
                  delete invitation.category;
                }
                invitationCreated = await this.MRepository.createInvitation(invitation, user);
                resolve(invitationCreated);
              } else {
                // Ya cuenta con una invitacion ligada...
                throw new BadRequestError('La invitacion ya fue enviada');
              }
              // Invitation is creating...
            } else {
              // Email ya se encuentra registrado en base de datos...
              if (!await this.invitationExists(invitation)) {
                invitation.user = userEmail.uid;
                invitation.type = Model.config.statics.types.EXISTING_USER;
                if (RoleService.isGuest(role)) {
                  // Verificando la categoria exista...
                  console.log('invitacion es a un guest');
                  invitation = await this.processCategory(invitation, user);
                } else {
                  // Eliminando categorya para cualquier otro usuario que no sea Guest
                  console.log('invitacion no es a un guest');
                  delete invitation.category;
                }
                invitationCreated = await this.MRepository.createInvitation(invitation, user);
                resolve(invitationCreated);
              } else {
                // Ya cuenta con una invitacion ligada...
                throw new BadRequestError('La invitacion ya fue enviada');
              }
            }
          } else {
            throw new BadRequestError('La propiedad de email no es valida');
          }
        } else {
          throw new BadRequestError('invalid role');
        }
      } catch (error) {
        logger.error('Error create invitation Service, error information: ', error);
        reject(error);
      }
    });
  }

  async processCategory(invitation: Invitation, user: User) {
    try {
      if (!invitation.categoryName) {
        console.log('ligar categoria categoria');
        const currentCategory = await this.workspaceAccessCategoryService.getById(invitation.category as string);
        if (currentCategory === undefined) {
          throw new BadRequestError('La Categoria no existe');
        }
      } else {
        console.log('crear nueva categoria');
        const categoryToCreate: any = {name: invitation.categoryName, workspace: invitation.workspace};
        if (! await this.workspaceAccessCategoryService.categoryExists(categoryToCreate)) {
          const newCategory = await this.workspaceAccessCategoryService.save(categoryToCreate, user);
          console.log('nueva categoria', newCategory);
          invitation.category = newCategory.uid;
        } else {
          throw new BadRequestError('La Categoria ya existe');
        }
      }

    } catch (error) {
      console.error(error);
      throw error;
    }
    return invitation;
  }

  async create(invitation: Invitation, user: User): Promise<Invitation> {
    let invitationCreated: any;
    try {
      invitationCreated = await this.save(invitation, user);
      const token = AuthService.createToken(user);
      if (invitation.type === 'NEW_USER') {
        const urlConfirmInvitation = config.APP_DOMAIN + '/#/register/invitation?reference=' + invitationCreated.uid;
        this.sendEmailInvitationNewMember(invitationCreated, user, urlConfirmInvitation, invitationCreated.role);
      } else {
        const urlConfirmInvitation = config.APP_DOMAIN + '/#/confirm-invitation/' + invitationCreated.uid + '/' + token;
        this.sendEmailInvitationNewMember(invitationCreated, user, urlConfirmInvitation, invitationCreated.role);
      }

    } catch (error) {
      throw error;
    }
    return invitationCreated as Invitation;

  }


  async createBatch(invitations: Invitation[], user: User) {
    const results = {
      saved: new Array<Invitation>(),
      errors: new Array<Invitation>()
    };

    if (!invitations || invitations.length === 0) {
      throw new BadRequestError('Invitations list empty');
    }

    // Init bactch create
    logger.debug('Init batch save');
    for (const invitation of invitations) {
      try {
        const invitationCreated: any =  await this.create(invitation, user);
        results.saved.push(invitationCreated);
        logger.debug('invitation created', invitationCreated);
      } catch (error) {
        logger.error('Error processing invitation email: ' + invitation.email + 'reason: ' + error.message);
        (<any>invitation).error = error.message;
        results.errors.push(invitation);
      }
    }
    logger.debug('Finish batch save');

    return results;
  }

  async processRegister(currentInvitation: Invitation, user: User) {
    try {
        currentInvitation.user = user.uid;
        delete (<any>currentInvitation).createdAt;
        return this.MRepository.update({ uid: currentInvitation.uid}, currentInvitation);
    } catch (error) {
      throw error;
    }
  }

  validRegisterInvitation(invitation: Invitation, user: User) {
    logger.debug('validar invitacion con usuario: ', (invitation.email === user.email ));
    return (invitation.email === user.email );
  }

  /**
   * Validation method to verify that invitation is already exists in database
   *
   * @author Gibran Cordoba
   *
   * @param {Invitation} invitation current invitation to process and verify
   *
   * @returns {Promise<Boolean>}
   * @memberof InvitationService
   */
  invitationExists(invitation: Invitation): Promise<Boolean> {
    return new Promise<Boolean>(async (resolve, reject) => {
      // Verifiy if exist
      try {
        console.log('Verificando invitacion en base de datos', invitation);
        const isInDatabase = await this.MRepository.getPendingByLevelReference(invitation);
        logger.debug('found in database', isInDatabase);
        if (isInDatabase !== undefined) {
          logger.debug('invitation is already in database');
          resolve(true);
        } else {
          logger.debug('invitation is not in database');
          resolve(false);
        }
      } catch (error) {
        reject(error);
      }
    });
  }


  async confirmInvitation(id: String, user: any) {
    try {
      let invitation = await this.MRepository.getById(id);
      if (invitation !== undefined) {
        console.log('current confirm invitation: ', invitation);
        if (invitation.status !== Model.config.statics.status.PENDING) {
          throw new InvitationException('Invitacion ya procesada y/o cancelada');
        }

        if (!invitation.user) {
          throw new InvitationException('Invitacion no tiene usuario relacionado');
        }

        if (invitation.type === Model.config.statics.types.EXISTING_USER || invitation.type === Model.config.statics.types.NEW_USER) {
          // Procesar permisos
          const role: Role = await this.roleService.getById(invitation.role as string);
          console.log('current role invitation: ', role);
          if (role) {
            const invitationUser = await this.userService.getById(user.uid);
            if (invitationUser === undefined || invitationUser === null) {
              throw new InvitationException('Usuario en la invitacion no encontrada');
            }

            if (invitation.type === Model.config.statics.types.NEW_USER) {
              await this.authService.processUserConfirmation(invitationUser);
            } else {
              if (!invitationUser.confirmed) {
                throw new InvitationException('Usuario existente aun no esta confirmado');
              }
            }

            const access: any = {
              workspace: invitation.workspace,
              user: invitation.user,
              role: invitation.role
            };

            if (role.key === Roles.Guest.toString()) {
              access.category = invitation.category;
            }

            const wsaInvitation = await this.workspaceAccessService.createAccess(access);

            if (invitation.level === Model.config.statics.level.CORE && invitation.reference && wsaInvitation.uid) {
              this.coreAccessService.grantPermission({
                workspaceAccessId: wsaInvitation.uid,
                coreId: invitation.reference,
              });
            }

            invitation = await this.MRepository.update({uid: invitation.uid}, {
              role: invitation.role,
              workspace: invitation.workspace,
              status: Model.config.statics.status.CONFIRMED,
              confirmationDate: new Date().getTime()
            });
            return invitation;
          } else {
            throw new InvitationException('Rol no valido');
          }
        } else {
          throw new InvitationException('Tipo de usuario no valido');
        }
      } else {
        throw new InvitationException('Invitation no encontrada');
      }

    } catch (error) {
      throw error;
    }
  }


  /**
   * Cancel an invitation
   * @param key
   * @param invitation
   */
  cancel(id: String, currentUser: User): Promise<Invitation> {
    return new Promise<Invitation>(async (resolve, reject) => {
      logger.debug('cancel method repository:');
      if (id && id != null) {
        try {
          const exist = await this.MRepository.getById(id);
          if (!exist) {
            throw new InvitationException(`invitation with id "${id}" is not found `);
          } else {
            logger.debug('Exist', exist);
            if (exist.status === Model.config.statics.status.CONFIRMED.toString()) {
              throw new InvitationException(`invitation is already confirmed`);
            }

            logger.debug('cancel invitation:');

            const inv = this.MRepository.update({ uid: id }, {
              status: Model.config.statics.status.CANCELED,
              canceledBy: currentUser.uid,
              canceledDate: new Date().getTime(),
              role: exist.role,
              workspace: exist.workspace
            });

            resolve(inv);
          }
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new InvitationException('Error, identifier object is null or undefined'));
      }
    });
  }

  // /**
  //  * Confirm invitation
  //  * @param {invitation} invitation
  //  */
  // confirm(key: any, invitation: any) {
  //   return new Promise<Invitation>(async (resolve, reject) => {
  //     try {
  //       invitation.active = true;
  //       delete invitation.createdAt;
  //       delete invitation.updateAt;
  //       const confirm = <Invitation> await this.invitationRepository.update({ uid: key }, invitation);
  //       resolve(confirm);
  //     } catch (error) {
  //       console.log('Error send to resolver: ' + error.message);
  //       reject(error);
  //     }
  //   });
  // }

  // /**
  //  * Delete invitation
  //  * @param {uid} uid
  //  */
  // delete(uid: String) {
  //   return new Promise<any>(async (resolve, reject) => {
  //     try {
  //       const deleted = await this.invitationRepository.deleteById(uid);
  //       resolve(deleted);
  //     } catch (error) {
  //       logger.error('Error send to resolver: ' + error.message);
  //       reject(error);
  //     }
  //   });
  // }



  // findAll(): Promise<Array<Invitation>> {
  //   return this.invitationRepository.list();
  // }

  // findByLevelAndReference(levelId: string, referenceId: string): Promise<Array<Invitation>> {
  //   return this.invitationRepository.findByLevelAndReference(levelId, referenceId);
  // }

  /**
   * Sen invitation team member
   * @param emailTo
   * @param currentUser
   * @param urlConfirmInvitation
   */
  sendEmailInvitationTeamMember(invitation: Invitation, currentUser: User, urlConfirmInvitation: string, role: Role) {
    // Send the email
    logger.debug('user name: ', currentUser.name);
    return this.emailService.sendEmail(this.emailService.builder(
      <String> invitation.email,
      'Te han invitado a unirte al equipo de brainy',
      EmailKey.invitationTeamMember.toString(),
      { name: currentUser.name, urlAccept: urlConfirmInvitation, specialRoleName: role.name }
    ));
  }

  /**
   * Send invitation new member
   * @param emailTo
   * @param currentUser
   * @param urlConfirmInvitation
   */
  sendEmailInvitationNewMember(invitation: Invitation, currentUser: User, urlConfirmInvitation: string, role: Role) {
    // Send the email
    logger.debug('user name: ', currentUser.name);
    return this.emailService.sendEmail(this.emailService.builder(
      <String> invitation.email,
      'Te han invitado a unirte al equipo de brainy',
      EmailKey.invitationCore.toString(),
      { name: currentUser.name, urlAccept: urlConfirmInvitation, roleName: role.name}
    ));
  }

  /**
   * Sen invitation team member
   * @param emailTo
   * @param currentUser
   * @param urlConfirmInvitation
   */
  sendEmailInvitationConfirm(emailTo: string, role: Role) {
    // Send the email
    return this.emailService.sendEmail(this.emailService.builder(
      <String> emailTo,
      'Confirmacion de invitación aceptada',
      EmailKey.invitationAccepted.toString(),
      { role: role }
    ));
  }

}
