import ac from 'accesscontrol';

import * as Models from '../../api/models';
import { LoggerDecorator, LoggerInterface } from '../logger';

export default class AccessControl {
  @LoggerDecorator('AccessControl')
  private log: LoggerInterface;
  private accessControl: ac.AccessControl;

  constructor () {
    try {
      const grantList = [
        { role: 'admin', resource: 'transaction', action: 'create:any', attributes: '*' },
        { role: 'admin', resource: 'transaction', action: 'read:any', attributes: '*' },
        { role: 'admin', resource: 'transaction', action: 'update:any', attributes: '*' },
        { role: 'admin', resource: 'transaction', action: 'delete:any', attributes: '*' },
        // { role: 'admin', resource: 'transaction', action: 'execute:any', attributes: '*' },
        // { role: 'admin', resource: 'transaction', action: 'approve:any', attributes: '*' },
      ];
      this.accessControl = new ac.AccessControl(grantList);
      this.log.info('Access Control has been initialized with grant list successfully');
    } catch (err) {
      this.log.error(`There is an error with Access Control initialization: ${err}`);
      throw err;
    }
  }

  public async permission (roleId: number): Promise<unknown> {
    try {
    const rolePrivilege = await Models.RolePrivilege.findOne({
      where: { idRole: roleId },
      include: [ Models.Grant, Models.GrantType, Models.Permission, Models.Role ],
    });
    // return this.accessControl.can(rolePrivilege);
    return rolePrivilege;
    } catch (err) {
      this.log.error(`There is an error with getting permission for role ID ${roleId}: ${err}`);
      throw err;
    }
  }
}
