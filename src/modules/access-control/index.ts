import ac from 'accesscontrol';

import * as Models from '../../api/models';
import { LoggerDecorator, LoggerInterface } from '../logger';

class AccessControl {
  @LoggerDecorator('AccessControl')
  private log: LoggerInterface;
  private accessControl: ac.AccessControl;

  public async init (): Promise<void> {
    try {
      const rolesPrivileges = await Models.RolePrivilege.findAll({
        include: [
          {
            model: Models.Role,
            attributes: ['title'],
            where: { active: true },
          },
          {
            model: Models.Grant,
            attributes: ['title'],
            where: { active: true },
          },
          {
            model: Models.GrantType,
            attributes: ['name'],
          },
          {
            model: Models.Permission,
            attributes: ['title'],
            where: { active: true },
          },
        ],
      });
      const grantsList = rolesPrivileges.map(record => ({
        role: record.fkIdRole.title,
        resource: record.fkIdPermission.title,
        action: `${record.fkIdGrant.title}:${record.fkIdGrantType.name}`,
        attributes: '*',
      }));
      
      this.accessControl = new ac.AccessControl(grantsList);
      this.log.info('Access Control has been initialized with grants list successfully.');
    } catch (err) {
      this.log.error(`There is an error with Access Control initialization: ${err}`);
      throw err;
    }
  }

  public checkAccess (role: string): ac.Query {
    return this.accessControl.can(role);
  }
}

export default new AccessControl;
