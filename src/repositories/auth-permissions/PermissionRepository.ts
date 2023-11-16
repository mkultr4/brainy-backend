import Model, { Permission, PermissionKeySchema } from '../../models/auth-permissions/Permission';
import BaseRepository from '../BaseRepository';

export default class PermissionRepository extends BaseRepository<Permission, PermissionKeySchema> {

    constructor() {
        super(Model);
    }

}
