
import Model, { WorkspaceAccessCategory } from '../../../models/workspace/access/WorkspaceAccessCategory';
import Repository from '../../Repository';
import {orm} from '../../../models/index';
import { Workspace } from '../../../models/workspace/Workspace';

/**
 * Category member Repository class to return all information about members categories
 *
 * @author Gibran Cordoba
 * @created 25/06/2018
 *
 * @export
 * @class WorkspaceAccessCategoryRepository
 * @extends {Repository<CategoryMember>}
 *
 */
export default class WorkspaceAccessCategoryRepository extends Repository<WorkspaceAccessCategory> {

  /**
   * Creates an instance of WorkspaceAccessCategoryRepository.
   * @constructor
   * @memberof WorkspaceAccessCategoryRepository
   */
  constructor() {
    orm.init();
    super(orm.getModel(Model.name));
  }

  listbyworkspace(ws: Workspace): Promise<any> {
    return this.Model.scan({ workspace: { eq: ws.uid }}).exec();
  }

}
