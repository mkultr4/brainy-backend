import Service from '../Service';
import BrandService from '../../services/brand/BrandService';
import ProjectService from '../../services/project/ProjectService';
import { Core } from '../../models/core/Core';
import { Brand } from '../../models/brand/Brand';
import { Project } from '../../models/project/Project';
import { CoreAccess } from '../../models/core/core-access/CoreAccess';
import logger from '../../logger';
import CoreAccessService from './access/CoreAccessService';

import { BadRequestResult,
  InternalServerErrorResult, WorkspaceAccessPermissionException, NotFoundResult } from '../../util/errors/Error';
import RoleService from '../auth-permissions/RoleService';
import CoreRepository from '../../repositories/core/CoreRepository';
import { WorkspaceAccess } from '../../models/workspace/access/WorkspaceAccess';

/**
 * Core class.
 * @author Fidel Saldivar
 * @created July 2018
 *
 * @export
 * @class CoreService
 * @extends {Service<CoreRepository, Core>}
 *
 */
export default class CoreService extends Service<CoreRepository, Core> {

  private brandService: BrandService;
  private projectService: ProjectService;
  // private feedbackPieceService: FeedbackPieceService;
  // private pinService: PinService;
  private coreAccessService: CoreAccessService;

  /**
   * Creates an instance of CoreService
   * @constructor
   * @memberof CoreService
   */
  constructor() {
    super(new CoreRepository());
    this.brandService = new BrandService();
    this.projectService = new ProjectService();
    // this.feedbackPieceService = new FeedbackPieceService();
    // this.pinService = new PinService();
    this.coreAccessService = new CoreAccessService();
  }

  public findCoresByWorkspaceAccess(idWorkspaceAccess: string): Promise<any> {
    return new Promise((resolve, reject) => {
    });
  }

  async saveAs(json: any, workspaceAcess:  any): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      logger.debug('save service:');
      try {
        if (json == null) {
          throw new InternalServerErrorResult('Error in function save object null or undefined');
        }
        if (!RoleService.canDoAnything(<any>workspaceAcess.role)) {
          throw new WorkspaceAccessPermissionException('Usuario no tiene permisos');
        }

        logger.debug('creating model from service to repository:');

        const project = json.project;
        const brand = project.brand;

        // await this.validateNames(json, workspaceAcess);
        logger.debug('json body', brand, project);
        const finalBrand = await this.proccessSendedBrand(brand, json,
            workspaceAcess.workspace.uid);
        logger.debug('finalBrand', finalBrand);
        const finalProject = await this.proccessSendedProject(project, json, finalBrand);
        logger.debug('finalProject', finalProject);
        const jsonCore = this.buildJSONCore(json, workspaceAcess);
        logger.debug('object jsonCore:', jsonCore);
        const _core = await this.MRepository.save(jsonCore);
        logger.debug('object created:', _core);
        const _coreAccess =  this.coreAccessService.grantPermission(this.buildCoreAccess(workspaceAcess, _core));
        logger.info('Acces created', _coreAccess);
        const __core = this.buildResponseCore(_core, finalBrand, finalProject);
        resolve (__core);
      } catch (error) {
        throw new BadRequestResult(error);
      }
      });
  }

  updateAs(id: any, params: any, workspaceAcess: any): Promise<Core> {
    logger.debug('save method repository:');
    return new Promise<Core>(async (resolve, reject) => {
      if (id == null || id === undefined) {
        reject(new InternalServerErrorResult('Params for search is null or undefined'));
      }
      if (!RoleService.canDoAnything(<any>workspaceAcess.role)) {
        reject(new InternalServerErrorResult('Params for search is null or undefined'));
      }
      this.MRepository.get(id).then(
        _core => {
          if (_core === undefined && _core == null) {
            reject(new NotFoundResult(`Core not found with key: ${id}`));
          }
          logger.debug('creating model from service to repository:');
          this.MRepository.update(id, params).then(
            _coreupdated => {
            logger.debug('object updated:', _coreupdated);
            resolve(_coreupdated);
          }).catch((err) => {
            logger.error(err);
            reject(new InternalServerErrorResult('Params for search is null or undefined'));
          });
        },
        error => {
          logger.error('object updated:', error);
          reject(new NotFoundResult(`Core not found with key: ${id}`));
        }
      );
    });
  }

  deleteAs(key: any): Promise<undefined> {
    logger.debug('save method repository:');
    return new Promise<undefined>(async (resolve, reject) => {
      if (key != null) {
        const core = await this.MRepository.get(key);
        if (core === undefined || core == null) {
          reject(new NotFoundResult(`Core not found with key: ${key}`));
        }

        logger.debug('creating model from service to repository:');
        resolve(this.MRepository.delete(key).then(() => {
          return undefined;
        }));
      } else {
        reject(new BadRequestResult('Error in function save object null or undefined'));
      }
    });
  }

  logicalChangeDelete(id: any,  workspaceAcess: any) {
    logger.debug('logic delete:');
    return new Promise<any>(async (resolve, reject) => {
      if (id == null || id === undefined) {
        reject(new InternalServerErrorResult('Params for search is null or undefined'));
      }
      if (!RoleService.canDoAnything(<any>workspaceAcess.role)) {
        reject(new InternalServerErrorResult('Params for search is null or undefined'));
      }
      logger.debug('get core object:');
      const params = { deleted: true };
      this.MRepository.get(id).then(
        _core => {
          if (_core === undefined || _core == null) {
            reject(new NotFoundResult(`Core not found with key: ${id}`));
          }
          this.MRepository.update(id, params).then(
            _coreupdated => {
              logger.debug('object updated:', _coreupdated);
              resolve(_coreupdated);
            }
          ).catch((err) => {
            logger.debug(err);
            reject(new Error(`Search not found. core with uid ${id} don't exist`));
        });

      }).catch((err) => {
          logger.debug(err);
          reject(new Error(`Search not found. core with uid ${id} don't exist`));
      });
      // TODO: Tested
      // resolve(await this.MRepository.update(key, params).then(async (core: Core) => {
      //   logger.debug('object updated:', core);
      //   // const pieces = await this.feedbackPieceService.findAllByCoreId(core.uid as string);

      //   // pieces.forEach( async (piece) => {
      //   //   await this.feedbackPieceService.deletePiece(piece.uid);

      //   //   const pins = await this.pinService.findByReference(null, piece.uid, 'origin', wsId).catch((err) => {
      //   //     logger.debug(err);
      //   //   });

      //   //   if (pins !== undefined) {
      //   //     pins.forEach(async (pin: any) => {
      //   //       this.pinService.logicalChangeDelete(pin.uid, true, wsId);
      //   //     });
      //   //   }
      //   // });

      //   // const pinsCore = await this.pinService.findByReference(null, core.uid as string, 'origin', wsId).catch((err) => {
      //   //   logger.debug(err);
      //   // });

      //   // if (pinsCore !== undefined) {
      //   //   pinsCore.forEach(async (pin: any) => {
      //   //     this.pinService.logicalChangeDelete(pin.uid, true, wsId);
      //   //   });
      //   // }

      //   return core;
      // }));

    });
  }

  getAs(id: string, workspaceAcess:  any): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      if (id == null || id === undefined) {
        reject(new InternalServerErrorResult('Params for search is null or undefined'));
      }
      if (!RoleService.canDoAnything(<any>workspaceAcess.role)) {
        reject(new InternalServerErrorResult('Params for search is null or undefined'));
      }// Obtener el acceso padre de workspace...
      logger.debug(`traying to get model with ID ${id}`);
      this.MRepository.get({uid: id}).then(async (core) => {
        logger.debug(`object returned for model ${core}`);
        if (core !== undefined && core.project_id !== undefined) {
          const project: Project = await this.projectService.get(core.project_id as string);
          const brand: Brand =  await this.brandService.get(project.brand_id as string);
          const response = this.buildResponseCore(core, brand, project);
          logger.debug(`Everithing it ok response ${response}`);
          resolve(response);
        } else {
          reject(new InternalServerErrorResult('Traying with data corrup'));
        }
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Remove
   * @deprecated
   */
  async findCoresByWorkspace(workspaceAcess:  any): Promise<Core[]> {
    return new Promise<Core[]>(async (resolver, reject) => {
      try {
        if (RoleService.canDoAnything(<any>workspaceAcess.role)) {
          logger.debug('getting findCoresByWorkspace idWSA', workspaceAcess.uid);
          const _coreAccess = await this.coreAccessService.getAllPermissionByWA(workspaceAcess.uid);
          logger.debug('response getAllPermissionByWA', _coreAccess);
              const cores: Promise<any>[] = [];
              const __corecomplets: any[] = [];
              if (_coreAccess && _coreAccess.length) {
                _coreAccess.forEach(element => {
                  cores.push(this.MRepository.getComplete(element.coreId as string));
                });
              }
              Promise.all(cores).then(
                _coresCompletes => {
                  logger.debug('response PromiseAll_coresCompletes', _coresCompletes);
                  if (_coresCompletes && _coresCompletes.length) {
                    _coresCompletes.forEach(it => {
                      __corecomplets.push(it);
                    });
                  }
                  resolver(__corecomplets);
                }
              ).catch(error => {
                logger.error('Error on promise All', error);
                reject(new NotFoundResult(`PromiseAll error: ${workspaceAcess.uid}`));
              });
        } else {
          reject (new WorkspaceAccessPermissionException('Usuario no tiene permisos'));
        }
      } catch (error) {
        logger.error('Error on findCoresByWorkspace', error);
        reject(error);
      }
    });
  }

  private buildCoreAccess(workspaceAcess: WorkspaceAccess, core: Core) {
    return {
      workspaceAccessId: workspaceAcess.uid,
      coreId: core.uid
    } as CoreAccess;

  }

  private buildJSONCore(json: any, wsa: any) {
    const now = new Date().getTime();
    return {
            project_id: json.project,
            title: json.title,
            owner_id: json.owner_id,
            core_type_id: json.core_type_id,
            thumbnail: json.thumbnail,
            reference_id:  json.reference_id,
            reference_name: json.reference_name,
            parent_id: json.parent_id,
            create_timestamp: now,
            last_modified_timestamp: now,
            active: true,
            deleted: false,
            status: {
                id: 'edit',
                text: 'En edición',
                ico: 'assets/app/commons/status/status_en_edicion.svg'
            },
            user_approved: json.user_approved,
            user_rejected: json.user_rejected,
            date_rejected_at: now,
            date_approved_at: now,
            workspaceId: wsa.workspace.uid
        }  as Core;
  }

  private buildJSONBrand(json: any, owner: string, workspaceID: string) {
    logger.debug('build json brand');
    logger.debug(json);
    const now = new Date().getTime();
      return {
        workspace_id: workspaceID,
        name: json.name,
        active: true,
        owner_id: owner,
        create_timestamp: now,
        deleted: false,
        last_modified_timestamp:  now
      } as Brand;
  }

  private buildJSONProject(json: any, brandID: string, owner: string) {
    const now = new Date().getTime();
    return {
        brand_id: brandID,
        name: json.name,
        active: true,
        owner_id: owner,
        create_timestamp: now,
        deleted: false,
        last_modified_timestamp:  now
    } as Project;
  }

  public buildResponseCore(core: any, brand: any, project: any) {
    return {
      core_id: core.uid,
      project: {
        project_id: project.uid,
        brand: {
          brand_id: brand.uid,
          workspace_id: brand.workspace_id,
          name: brand.name,
          active: brand.active,
          owner_id: brand.owner_id,
          create_timestamp: brand.create_timestamp,
          deleted: brand.deleted,
          last_modified_timestamp:  brand.last_modified_timestamp
        },
        name: project.name,
        active: project.active,
        owner_id: project.owner_id,
        create_timestamp: project.create_timestamp,
        deleted: project.deleted,
        last_modified_timestamp:  project.last_modified_timestamp
      },
      title: core.title,
      owner_id: core.owner_id,
      core_type_id: core.core_type_id,
      thumbnail: core.thumbnail,
      reference_id:  core.reference_id,
      reference_name: core.reference_name,
      parent_id: core.parent_id,
      create_timestamp: core.create_timestamp,
      last_modified_timestamp: core.create_timestamp,
      active: core.active,
      deleted: core.deleted,
      status: core.status,
      user_approved: core.user_approved,
      user_rejected: core.user_rejected,
      date_rejected_at: core.date_rejected_at,
      date_approved_at: core.date_approved_at
    };
  }

  private validateBrandFields(brand: any) {
    return (
      brand.name !== undefined
    );
  }

  private validateProjectFields(project: any) {
    return (
      project.name !== undefined
    );
  }

  // private validateCoreFields(core: any) {
  //   return (
  //     core.project_id !== undefined &&
  //     core.core_type_id !== undefined &&
  //     core.title !== undefined &&
  //     core.owner_id !== undefined
  //   );
  // }

  // private addPermission(type: string, user: string, permission: any, level: string, reference: string) {
  //   return this.memberAccess.grantPermissionParent({
  //     type: type,
  //     user: user,
  //     parent: permission,
  //     access: {
  //       level: level,
  //       reference: reference
  //     }
  //   });
  // }

  private async proccessSendedBrand(brand: any, json: any, wsId: any) {
    let finalBrand: any;
    logger.debug(brand.uid);
    if (brand.uid !== undefined && brand.uid != null) {
      await this.brandService.get(brand.uid).then((brandDB) => {
        finalBrand = brandDB;
        logger.debug(brandDB);
      });
    }

    if (finalBrand !== undefined && finalBrand != null) {
      json.brand = finalBrand.uid;
    } else {
      if (brand != null && this.validateBrandFields(brand)) {
        const jsonBrand = await this.buildJSONBrand(brand, json.owner_id, wsId);
        const newBrand = await this.brandService.save(jsonBrand);
        json.brand = newBrand.uid;
        finalBrand = newBrand;
      } else {
        throw new BadRequestResult('JSON format invalid. Brand is null, undefined or requerid field not send (name)');
      }
    }

    return finalBrand;
  }

  private async proccessSendedProject(project: any, json: any, finalBrand: any) {
    let finalProject: any;

    if (project.uid !== undefined && project.uid != null) {
      await this.projectService.get(project.uid).then((projectDB) => {
        finalProject = projectDB;
      });
    }

    if (finalProject !== undefined || finalProject != null) {
      json.project = project.uid;
    } else {
      if (project != null && (project.uid === undefined || project.uid == null) && this.validateProjectFields(project)) {
        const jsonProject = await this.buildJSONProject(project, finalBrand.uid, json.owner_id);
        const newProject = await this.projectService.save(jsonProject);
        json.project = newProject.uid;
        finalProject = newProject;
      } else {
        throw new BadRequestResult('JSON format invalid. Project is null, undefined or requerid field not send (name)');
      }
    }
    return finalProject;
  }

  // private async validateNames(json: any, workspaceAcess:  any) {
  //   try {
  //     logger.debug('validateNames', json, workspaceAcess);
  //     const cores = await this.findCoresByWorkspace(workspaceAcess);
  //     let brands: Brand[] = [];
  //     let projects: Project[] = [];
  //     if (!json.project.brand.uid) {
  //       brands = await this.brandService.findByWorkspace(workspaceAcess.workspace.uid)
  //     }
  //     if (json.project.uid) {
  //       projects = await this.projectService.findByWorkspace(workspaceAcess.workspace.uid);
  //     }
  //     logger.debug('validateNames Brand and project ', brands, projects);

  //     if (cores.filter(x => x.title === json.title).length) {
  //       throw new BadRequestResult(`The title for core ${json.title} is repeated for workspace`);
  //     }
  //     if (projects.filter(x => x.name ===  json.project.name).length) {
  //       throw new BadRequestResult(`The title for project ${json.project.name} is repeated for workspace`);
  //     }
  //     if (brands.filter(x => x.name === json.project.brand.name).length) {
  //       throw new BadRequestResult(`The title for brand ${json.project.brand.name} is repeated for workspace`);
  //     }
  //   } catch (error) {
  //     logger.error('Error on validateNames', error);
  //     throw new BadRequestResult(error);
  //   }
  // }

}
