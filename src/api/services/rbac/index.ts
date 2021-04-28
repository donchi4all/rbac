import * as Models from '../../models';
import AccessControl from '../../../modules/access-control';

class RbacService {
  public async getPermissionsByRoleId (id: number): Promise<unknown> {
    try {
      const role = await Models.Role.findByPk(id);

      if (!role.active) {
        throw new Error(`The role "${role.title}" with id=${role.id} is inactive.`);
      }

      return AccessControl.checkAccess(role.title);
    } catch (err) {
      throw err;
    }
  }
}

const rbacService = new RbacService();
export default rbacService;