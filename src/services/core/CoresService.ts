// import Service from '../Service';
// import logger from '../../logger';
// import CoreRepository from '../../repositories/core/CoreRepository';
// import { Core } from '../../models/core/Core';
// import { CoreAccess } from '../../models/core/core-access/CoreAccess';
// import { WorkspaceAccess } from '../../models/workspace/access/WorkspaceAccess';

// import CoreAccessService from './access/CoreAccessService';
// import BrandService from '../../services/brand/BrandService';
// import ProjectService from '../../services/project/ProjectService';
// import GroupService from '../auth-permissions/GroupService';



// export default class CoresService extends Service<CoreRepository, Core> {

//   private coreAccessService: CoreAccessService;
//   private groupService: GroupService;
//   private brandService: BrandService;
//   private projectService: ProjectService;

//    /**
//    * Creates an instance of CoresService
//    * @constructor
//    * @memberof CoresService
//    */
//   constructor() {
//     super(new CoreRepository());
//     this.coreAccessService = new CoreAccessService();
//     this.groupService = new GroupService();
//   }

//   public findCoresByWorkspaceAccess(idWorkspacesAcess: string): Promise<Core[]> {
//     return new Promise<Core[]> ((resolve, reject) => {
//       const cores: Promise<Core>[] = [];
//       this.coreAccessService.getAllPermissionByWA(idWorkspacesAcess).then(
//         _access => {
//           _access.forEach(it => {
//             cores.push(this.get(it.coreId));
//           });
//           Promise.all(cores).then(
//             _coresresult => resolve(_coresresult)
//           ).catch(
//             _error => {
//               logger.error('create findCoresByWorkspaceAccess', _error);
//               reject(new Error(_error));
//             }
//           );
//         },
//         _error => {
//           logger.error('create findCoresByWorkspaceAccess', _error);
//           reject(new Error(_error));
//         }
//       );
//     });
//   }

//   public createCore(core: any, workspaceAcess: WorkspaceAccess) {
//     return new Promise<Core>(async (resolve, reject) => {
//       try {
//         this.save(core).then(
//           _core => {
//             logger.info('save createCore', _core);
//             coreAccess = this.buildCoreAcces(_core, workspaceAcess);
//             this.coreAccessService.grantPermission(coreAccess).then(
//               _access => {
//                 logger.info('Create access', _access);
//                 resolve(_core);
//               },
//               error => {
//                 logger.error('Error Create access', error);
//                 reject(error);
//               }
//             );
//           },
//           _error => {
//             logger.error('create createCore', _error);
//             reject(_error);
//           }
//         );
//         this.coreAccessService.grantPermission();
//       } catch (error) {
//         logger.error('create findCoresByWorkspaceAccess', error);
//         reject(error);
//       }


//     });
//   }
//   private buildCoreAcces(core: Core, workspaceAcess: WorkspaceAccess): CoreAccess {
//     const coreAccess: CoreAccess = new CoreAccess();
//     coreAcces.workspaceAccessId = workspaceAcess.uid;
//     coreAcces.coreId = core.uid;
//     return coreAccess;
//   }
//   private validateBrandFields(brand: any) {
//     return (
//       brand.name !== undefined
//     );
//   }

//   private validateProjectFields(project: any) {
//     return (
//       project.name !== undefined
//     );
//   }
// }
