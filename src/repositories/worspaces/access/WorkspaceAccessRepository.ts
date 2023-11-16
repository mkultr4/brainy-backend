
import WSA, { WorkspaceAccess } from '../../../models/workspace/access/WorkspaceAccess';
import Repository from '../../Repository';
import {orm} from '../../../models/index';
import { UserNotFoundException } from '../../../util/errors/Error';
import { ModelSchema } from 'dynamoose';
import { User } from '../../../models/auth-permissions/User';
import logger from '../../../logger';


/**
 * Category member Repository class to return all information about members categories
 *
 * @author Gibran Cordoba
 * @created 25/06/2018
 *
 * @export
 * @class CategoryMemberRepository
 * @extends {Repository<CategoryMember>}
 *
 */
export default class WorkspaceAccessRepository extends Repository<WorkspaceAccess> {
  /**
   * Creates an instance of CategoryMemberRepository.
   * @constructor
   * @memberof WorkspaceAccessRepository
   */
  constructor() {
    orm.init();
    super(orm.getModel(WSA.name));
  }

  getComplete(id: String, withGroup: boolean = true): Promise<WorkspaceAccess> {
    return this.get({uid: id}).then(model => {
      if (model !== undefined) {
        return <Promise<WorkspaceAccess>> model.populate({
          path: 'user',
          model: 'user'
        // tslint:disable-next-line:no-shadowed-variable
        }).then(model => {
          delete (<any>model).user.password;
          delete (<any>model).user.confirmed;
          return <Promise<WorkspaceAccess>> model.populate({
            path: 'role',
            model: 'role'
          // tslint:disable-next-line:no-shadowed-variable
          }).then(model => {
            return <Promise<WorkspaceAccess>> model.populate({
              path: 'workspace',
              model: 'workspace'
            });
          });
        });
      } else {
        throw new UserNotFoundException('User no encontrado');
      }
    });
  }

  listByUserId(id: String): any {
    return new Promise<WorkspaceAccess[]>((resolver, reject) => {
      const filter = {
        user: {eq: id}
      };
      this.Model.scan(filter).exec().then(models => {
          const CompleteModels = models.map(model => {
            return this.wsaConstructor(model);
          });

          Promise.all(CompleteModels).then((results: WorkspaceAccess[]) => resolver(results)).catch(err => reject(err));

      });
    });
  }

  listByWorkspace(wsId: String): any {
    return new Promise<WorkspaceAccess[]>((resolver, reject) => {
      const filter = {
        workspace: {eq: wsId}
      };
      this.Model.scan(filter).exec().then(models => {
          const CompleteModels = models.map(model => {
            return this.wsaConstructor(model);
          });

          Promise.all(CompleteModels).then((results: WorkspaceAccess[]) => resolver(results)).catch(err => reject(err));

      });
    });
  }

  changeStatus(id: String, params: WorkspaceAccess, user: User) {
    return new Promise<WorkspaceAccess>((resolver, reject) => {
      // logger.debug('changeStatus repository: ', id, user, params);
      params.updatedBy = user.uid;
      logger.debug('params to update: ', params);
      this.Model.update({uid: id}, {status: params.status}).then(
        model => {
          logger.debug('model updated: ', model);
          resolver(model);
        },
        error => {
          logger.error('error update: ', error);
          reject(error);
        }
      );
    });
  }




  wsaConstructor(model: ModelSchema<WorkspaceAccess>) {
    return <Promise<ModelSchema<WorkspaceAccess>>> model.populate({
      path: 'user',
      model: 'user'
    // tslint:disable-next-line:no-shadowed-variable
    }).then(model => {
      logger.debug('model with User: ', model);
      delete (<any>model).user.password;
      delete (<any>model).user.confirmed;
      return  <Promise<ModelSchema<WorkspaceAccess>>> model.populate({
        path: 'role',
        model: 'role'
      // tslint:disable-next-line:no-shadowed-variable
      }).then(model => {
        logger.debug('model with Role: ', model);
        return  <Promise<ModelSchema<WorkspaceAccess>>> model.populate({
          path: 'workspace',
          model: 'workspace'
        });
      });
    });
  }

}
