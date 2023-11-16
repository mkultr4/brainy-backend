import Model, { Invitation } from '../../models/invitations/Invitation';
import Repository from '../Repository';
import logger from '../../logger';
import { orm } from '../../models';
import { User } from '../../models/auth-permissions/User';

export default class InvitationRepository extends Repository<Invitation> {

  constructor() {
    orm.init();
    super(orm.getModel(Model.name));
  }

  /**
   * Save all invitations
   * @param {Invitation}invitations
   */
  savelAll(invitations: Array<Invitation>): Promise<any> {
    return this.Model.batchPut(invitations);
  }

  getById(uid: String): Promise<Invitation | undefined> {
    logger.debug('getById id repository');
    return this.get({ uid: uid });
  }

  getByLevelAndReferenceId(invitation: Invitation, active: boolean = true): Promise<Invitation | null> {
    return new Promise((resolve, reject) => {
      logger.debug('Find invitation by level and reference id');
      try {
        const scan = {
          email: { eq: invitation.email },
          level: { eq: invitation.level },
          reference: { eq: invitation.reference }
        };

        this.Model.scan(scan).exec().then(items => {
          logger.debug('items scan: ', items);
          if (items.length > 0) { resolve(items[0]); }
          resolve(null);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  getPendingByLevelReference(invitation: Invitation, active: boolean = true): Promise<Invitation | undefined> {
    return new Promise<Invitation | undefined>((resolve, reject) => {
      logger.debug('Find invitation by level and reference id');
      try {
        const scan = {
          email: { eq: invitation.email },
          level: { eq: invitation.level },
          reference: { eq: invitation.reference },
          status: {eq: Model.config.statics.status.PENDING},
          active: {eq: active}
        };

        this.Model.scan(scan).exec().then(items => {
          logger.debug('items scan: ', items);
          logger.debug('items scan count: ' + items.length);
          if (items.length > 0) { resolve(items[0]); }
          resolve(undefined);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  findByLevelAndReference(level: string, reference: string): Promise<Array<Invitation>> {
    return new Promise((resolve, reject) => {
      logger.debug('Find invitations by level and reference');
      try {
        let scan = {};

        scan = {
          'level': { eq: level },
          'reference': { eq: reference },
        };

        this.Model.scan(scan).exec().then(items => {
          // logger.debug('items scan: ', items)
           resolve(items);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  createInvitation(invitation: Invitation, user:  User) {
    invitation.createdBy = user.uid;
    invitation.updatedBy = user.uid;
    return this.save(invitation).then(model => {
      return model.populate({
        path: 'role',
        model: 'role'
      });
    });
  }

  deleteById(uid: String) {
    return this.delete({ uid: uid });
  }

}
