import RoleRepository from '../../repositories/auth-permissions/RoleRepository';
import { Role } from '../../models/auth-permissions/Role';
import logger from '../../logger';
import { Roles } from '../../statics';

export default class RoleService {

  private roleRepository: RoleRepository;

  /**
   * Constructor
   */
  constructor() {
    this.roleRepository = new RoleRepository();
  }
  static canDoAnything(role: Role) {
    return (this.isAdmin(role) || this.isCoAdmin(role) || this.isManager(role) );
  }
  static isAdmin(role: Role) {
    return (role.key === Roles.Admin.toString());
  }

  static isCoAdmin(role: Role) {
    return (role.key === Roles.CoAdmin.toString());
  }

  static isManager(role: Role) {
    return (role.key === Roles.Manager.toString());
  }

  static isTeam(role: Role) {
    return (role.key === Roles.Team.toString());
  }

  static isGuest(role: Role) {
    return (role.key === Roles.Team.toString());
  }

  async getByName(name: String): Promise<Role | undefined> {
    try {
      console.log('getting role by name: ' + name);
      const filter = {
        name: name
      };
      const rolesQuery: Array<Role> = await this.roleRepository.scan(filter);
      console.log('Roles found: ' + rolesQuery.length);
      let role: Role;
      if (rolesQuery.length > 0) {
        role = rolesQuery[0];
        console.log('Role found: ', role);
        return role;
      } else {
        throw new Error('Roles not found');
      }
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  async getByKey(key: String): Promise<Role | undefined> {
    try {
      logger.debug('getting role by key: ' + key);
      const filter = {
        key: {eq: key}
      };
      const roles: any = await this.roleRepository.Model.scan(filter).exec();
      logger.debug('Roles found: : ', roles.length);
      if (roles.length > 0) {
        return roles[0];
      } else {
        throw new Error('Role is not found');
      }
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  getById(id: string): Promise<Role> {
      return this.roleRepository.get({uid: id});
  }

  getAll(): Promise<Array<Role>> {
      return this.roleRepository.list();
  }

  save(json: Role): Promise<Role> {
      return this.roleRepository.save(json);
  }

  update(json: any): Promise<Role> {
      return this.roleRepository.update({uid: json.uid}, json);
  }

  delete(id: string): Promise<any> {
      return this.roleRepository.delete({ uid: id });
  }

}
