import { MemberAccess } from '../../../models/member-access/MemberAccess';
import UserRepository from '../../auth-permissions/UserRepository';
import RoleRepository from '../../auth-permissions/RoleRepository';
// import { Member } from '../../../models/workspace/members/Member';

export default class MemberRepository {

    private roleRepository: RoleRepository;
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
        this.roleRepository = new RoleRepository();
    }

    async getComplete(parent: MemberAccess): Promise<MemberAccess> {
        return new Promise<MemberAccess>(async (resolve, reject) => {
            console.log('getComplete member...');
            try {
                const user = await this.userRepository.getById(parent.userId as string);
                const role = await this.roleRepository.get(parent.roleId);
                (<any>parent).rol = role;
                (<any>parent).user = user;

                resolve(parent);
            } catch (error) {
                console.error('getComplete Error: ', error);
                reject(error);
            }
        });
    }
}
