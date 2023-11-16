import Service from '../Service';
import ProjectRepository from '../../repositories/project/ProjectRepository';
import {Project} from '../../models/project/Project';
import logger from '../../logger';

/**
 * Creates an instance of BrandRepository
 * @constructor
 * @memberof ProjectService(Service<ProjectRepository, Project>)
 */
export default class ProjectService extends Service<ProjectRepository, Project> {



  /**
   * Creates an instance of CoreService
   * @constructor
   * @memberof ProjectService
   */
  constructor() {
    super (new ProjectRepository());
  }

  saveAs(json: any) {
    const projectBuild = this.buildProject(json);
    return this.MRepository.save(projectBuild);
  }

  updateAs(key: string, params: any) {
    const keySearch = { uid: key };
    const objBuilded = this.buildProject(params);
    return this.MRepository.update(keySearch, objBuilded).then((obj: any) => {
      logger.debug('project updated', obj);
      return obj;
    });
  }

  findByWorkspace(workspaceID: string): Promise<any> {
    logger.info('findByWorkspace', workspaceID);
    return this.MRepository.findByWorkpsace(workspaceID);
  }

  public findByBrand(brandID: string): Promise<Array<Project> | null> {
    return this.MRepository.findByBrand(brandID);
  }

  private buildProject(json: any) {
    const now = new Date().getTime();
    return {
      deleted: false,
      create_timestamp: now,
      owner_id: json.owner_id,
      last_modified_timestamp: now,
      name: json.name,
      active: true,
      brand_id: json.brand_id
    };
  }

}
