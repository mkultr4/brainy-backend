
import { WorkspaceRepository } from '../repositories/WorkspaceRepository';
import { Workspace } from '../models/workspace/Workspace';
import logger from '../../src/logger';
import WorkspaceAccessService from '../services/workspaces/access/WorkspaceAccessService';
import { User } from '../models/auth-permissions/User';
// import RoleService from '../services/auth-permissions/RoleService';

export default class WorkspaceService {

  // private roleService: RoleService;
  private workspaceRepository: WorkspaceRepository;
  private wsaService: WorkspaceAccessService;

  constructor() {
    this.workspaceRepository = new WorkspaceRepository();
    this.wsaService = new WorkspaceAccessService();
    // this.roleService = new RoleService();
  }

  save(json: Workspace): Promise<Workspace> {
      logger.debug('save method repository:');
      return new Promise<Workspace>((resolve, reject) => {
        if (json != null) {
          logger.debug('creating model from service to repository:');
          resolve(this.workspaceRepository.save(json).then((obj: Workspace) => {
            logger.debug('object created:', obj);
            return obj;
          }));
        } else {
          reject(new Error('Error in function save object null or undefined'));
        }
      });
  }

  saveIfNotExist(json: Workspace): Promise<Workspace> {
    logger.debug('save method repository:');
    return new Promise<Workspace>((resolve, reject) => {
      if (json != null) {
        logger.debug('creating model from service to repository:');
        const filter = {
          owner_id: { eq: json.owner_id },
          name: { eq: json.name }
        };
        logger.debug('filter: ', filter);
        resolve(this.workspaceRepository.saveIfNotExist(filter, json).then((obj: Workspace) => {
          logger.debug('object created:', obj);
          return obj;
        }));
      } else {
        reject(new Error('Error in function save object null or undefined'));
      }
    });
  }

  saveOrGetExist(json: Workspace): Promise<Workspace> {
    logger.debug('save method repository:');
    return new Promise<Workspace>((resolve, reject) => {
      if (json != null) {
        logger.debug('creating model from service to repository:');
        const filter = {
          owner_id: { eq: json.owner_id },
          name: { eq: json.name }
        };
        logger.debug('filter: ', filter);
        resolve(this.workspaceRepository.saveOrGetExist(filter, json).then((obj: Workspace) => {
          logger.debug('object created:', obj);
          return obj;
        }));
      } else {
        reject(new Error('Error in function save object null or undefined'));
      }
    });
  }

  update(keys: any, params: any): Promise<Workspace> {
    logger.debug('save method repository:');
    return new Promise<Workspace>((resolve, reject) => {
      if (keys != null) {
        logger.debug('creating model from service to repository:');
        resolve(this.workspaceRepository.update(keys, params).then((obj: Workspace) => {
          logger.debug('object updated:', obj);
          return obj;
        }));
      } else {
        reject(new Error('Error in function save object null or undefined'));
      }
    });
  }

  delete(key: string): Promise<undefined> {
    logger.debug('save method repository:');
    return new Promise<undefined>((resolve, reject) => {
      if (key != null) {
        logger.debug('creating model from service to repository:');
        resolve(this.workspaceRepository.delete(key).then(() => {
          return undefined;
        }));
      } else {
        reject(new Error('Error in function save object null or undefined'));
      }
    });
  }

  public get(id: String) {
    return new Promise(async (resolve, reject) => {
      if (id != null) {
        this.workspaceRepository.get(id as string).then((workspace) => {
          logger.debug(`object returned for model ${workspace}`);
          resolve(workspace);
        }).catch((err) => {
          reject(err);
        });
      } else {
        reject(new Error('Params for search is null or undefined'));
      }
    });
  }

  public getAll() {
    return this.workspaceRepository.getAll();
  }

  public getWorkspaceByUser(user: User): Promise<Workspace[]> {
    return new Promise<Workspace[]>(async (resolve, reject) => {
      let workspaces: Workspace[];
      try {
        const permissions = await this.wsaService.listByUser(user);
        if (permissions.length > 0) {
          // get workspace information
          const promisesAccess: Array<any> = permissions.map( (p: any) => {
            console.log('member access object ', p);
            console.log('member access object ', p.roleId);
            // const ws = this.workspaceRepository.get(p.referenceId as string);
            // const role = this.roleService.getById(p.roleId as string);
          });

          workspaces = await Promise.all(promisesAccess.map( async pa => {
            console.log('pa', pa);
            const ws = await pa.ws;
            try {

            const role = await pa.role;
            console.log('ws', ws);
            console.log('role', role);
            ws.role = role;
            return <Workspace> ws;
            } catch (error) {
              console.log(error);
              return <Workspace> ws;
            }
          })).then( results => {
            return results;
          });
          resolve(workspaces);
        } else {
          resolve([]);
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}
