import Model, { Role } from '../../models/auth-permissions/Role';
import BaseRepository from '../BaseRepository';
import {orm} from '../../models/index';

export default class RoleRepository extends BaseRepository<Role, {uid: String}> {

    constructor() {
      orm.init();
      super(orm.getModel(Model.name));
    }
}
