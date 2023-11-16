import PROJECT, { Project } from '../../models/project/Project';
import Repository from '../Repository';
import BrandRepository from '../brand/BrandRepository';
import {orm} from '../../models/index';
import logger from '../../logger';

/**
 * Core class.
 * @author Fidel Saldivar
 * @created July 2018
 *
 * @export
 * @class CoreService
 * @extends {Repository<Project>}
 *
 */
export default class ProjectRepository extends Repository<Project> {

    private brandRepository: BrandRepository;

    /**
     * Creates an instance of CoreService
     * @constructor
     * @memberof ProjectRepository
     */
    constructor() {
      orm.init();
      super(orm.getModel(PROJECT.name));
      this.brandRepository = new BrandRepository();
    }

    findByWorkpsace(workspaceId: string) {
      return new Promise<Project[]>((resolve, reject) => {
        const projectPromises: Promise<Project[] | null>[] = [];
        this.brandRepository.findAllByWorkspace(workspaceId).then(
          (_brands: any) => {
            logger.info('brands', _brands);
            _brands.forEach((it: any) => {
              projectPromises.push(this.findByBrand(it.uid as string));
            });
            Promise.all(projectPromises).then(
              _projects => {
                const _project: Project[] = [];
                _projects.forEach(it => {
                  if (it) {
                    it.forEach(project => {
                      _project.push(project);
                    });
                  }
                });
                resolve(_project);
              }
            );
          },
          (_error: any) => {
            logger.error('project findByWorkpsace', _error);
            reject(_error);
          }
        );

      });
    }

    findByBrand(brandID: string): Promise<Array<Project> | null> {
        return new Promise((resolve, reject) => {
            try {
              this.Model.scan()
                .where('brand_id').eq(brandID)
                .exec()
                .then(items => {
                  resolve(items);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async getComplete(id: string): Promise<Project> {
        return new Promise<Project>(async (resolve, reject) => {
            try {
                const project = await this.get(id);
                if (project) {
                  this.brandRepository.get(project.brand_id).then(
                    _brand => {
                      (<any>project).brand = _brand;
                      delete project.brand_id;
                      resolve(project as Project);
                    },
                    _error =>  {
                      reject(_error);
                    }
                  );
                } else {
                  reject(new Error('No existe project'));
                }
            } catch (error) {
              reject(error);
            }
        });
    }

}
