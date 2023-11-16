import BRAND, { Brand } from '../../models/brand/Brand';
import Repository from '../Repository';
import {orm} from '../../models/index';

/**
 * Creates an instance of BrandRepository
 * @constructor
 * @memberof BrandRepository(Repository<Brand>)
 */
export default class BrandRepository extends Repository<Brand> {

  /**
   * Creates an instance of CoreService
   * @constructor
   * @memberof ProjectRepository
   */
  constructor() {
    orm.init();
    super(orm.getModel(BRAND.name));
  }

  findAllByWorkspace(workspaceID: string): Promise<Brand[]> {
    return new Promise((resolve, reject) => {
        try {
            this.Model.scan()
            .where('workspace_id').eq(workspaceID)
            .exec()
            .then(items => {
              resolve(items);
            });
        } catch (error) {
            reject(error);
        }
    });
}

  findByWorkspace(workspaceID: string): Promise<Brand | null> {
      return new Promise((resolve, reject) => {
          try {
              this.Model.scan()
              .where('workspace_id').eq(workspaceID)
              .exec()
              .then(items => {
                  if (items.length > 0) {
                    resolve(items[0]);
                  } else {
                    resolve(null);
                  }
              });
          } catch (error) {
              reject(error);
          }
      });
  }

  findByUser(userID: string):  Promise<Array<Brand> | null> {
      return new Promise((resolve, reject) => {
          try {
            this.Model.scan()
              .where('owner_id').eq(userID)
              .exec()
              .then(items => {
                  if (items.length > 0) {
                    resolve (items);
                  } else {
                    resolve(null);
                  }
              });
          } catch (error) {
              reject(error);
          }
      });
  }

}
