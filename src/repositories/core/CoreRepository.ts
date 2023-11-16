import Model, { Core } from '../../models/core/Core';
import Repository from '../Repository';

import ProjectRepository from '../project/ProjectRepository';
import BrandRepository from '../brand/BrandRepository';
import {orm} from '../../models/index';
import logger from '../../logger';

export default class CoreRepository extends Repository<Core> {

    private brandRepository: BrandRepository;
    private projectRepository: ProjectRepository;

    constructor() {
      orm.init();
      super(orm.getModel(Model.name));
      this.brandRepository = new BrandRepository();
      this.projectRepository = new ProjectRepository();
    }

    findByWorkspace(workspaceId: string) {
      return new Promise<Core[]>((resolver, reject) => {
        const filter = {
          workspaceId: workspaceId
        };
        this.Model.scan(filter).exec().then(
          _cores => {
            resolver(_cores);
          },
          _error => {
            logger.error('error update: ', _error);
            reject(_error);
          }
        );
      });


    }


    // findByProject(projectID: string): Promise<Array<Core> | null> {
    //     return new Promise((resolve, reject) => {
    //         try {
    //             this.Model.scan()
    //             .where('project_id').eq(projectID)
    //             .exec()
    //             .then(items => {
    //                 if (items.length > 0) {
    //                     resolve(items);
    //                 }
    //                 resolve(null);
    //             });
    //         } catch (error) {
    //             reject(error);
    //         }
    //     });
    // }

    async getComplete(id: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            try {
                const core = await this.get({uid: id});
                if (core) {
                  const project = await this.projectRepository.get(core.project_id);
                  if (project) {
                    const brand = await this.brandRepository.get(project.brand_id);
                    if (brand) {
                      (<any>project).brand = brand;
                      (<any>core).project = project;
                      delete core.project_id;
                      // const _core = {
                      //   core: core,
                      //   brand: brand,
                      //   project: project
                      // };
                      resolve(core);
                    } else {
                      reject(new Error('No project found'));
                    }
                  } else {
                    reject(new Error('No project found'));
                  }
                } else {
                  reject(new Error('No project found'));
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}
