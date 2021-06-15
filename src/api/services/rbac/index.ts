import * as Models from '../../models';

import { RoleInterface, RoleCreationType } from '../../models/role/IRole';
import { GrantInterface } from '../../models/grant/IGrant';
import { GrantTypeInterface } from '../../models/grant-type/IGrantType';
import { PermissionInterface, PermissionCreationType } from '../../models/permission/IPermission';

import AccessControl from '../../../modules/access-control';
import { RolePrivilegeErrorHandler } from '../../../modules/exceptions';

type ModelNameType = 'Grant' | 'GrantType' | 'Permission' | 'Role';
type ModelType = Models.Grant | Models.GrantType | Models.Permission | Models.Role;
type PermissionAndGrantParam = {
  grant: Pick<GrantInterface, 'title'>,
  grantType: Pick<GrantTypeInterface, 'name'>,
  permission: PermissionCreationType,
};

export type PermissionsAndGrantsSetParams = Array<PermissionAndGrantParam>;
export type PermissionsAndGrantsCreationParams = {
  role: RoleCreationType;
  privileges: PermissionsAndGrantsSetParams;
};
export type RolePrivilegeType = Promise<ReturnType<typeof AccessControl.checkAccess>>;
export { RoleInterface, GrantInterface, PermissionInterface };

class RbacService {
  //#region Private Methods
  /**
   * NOT IMPLEMENTED
   */
  private async findModelByProperty (
    modelName: ModelNameType,
    property: { key: string, value: string }
  ): Promise<ModelType> {
    try {
      const searchableObject = { where: { [property.key]: property.value } };
      const models = {
        'Grant': Models.Grant.findOne(searchableObject),
        'GrantType': Models.GrantType.findOne(searchableObject),
        'Permission': Models.Permission.findOne(searchableObject),
        'Role': Models.Role.findOne(searchableObject),
      };
      const modelObject = await models[modelName];

      if (!modelObject) {
        throw new RolePrivilegeErrorHandler({
          status: 500,
          code: 'FATAL',
          message: `The ${modelName.toLowerCase()} with ${property.key}=${property.value} has not been found.`,
        });
      }

      return modelObject;
    } catch (err) {
      console.log('QWE_123');
      throw err;
    }
  }

  private async getRoleByIdAndCheck (id: number): Promise<Models.Role> {
    try {
      const role = await Models.Role.findByPk(id);

      if (!role) {
        throw new RolePrivilegeErrorHandler(RolePrivilegeErrorHandler.RoleDoesNotExist);
      }
      if (!role.active) {
        throw new RolePrivilegeErrorHandler(RolePrivilegeErrorHandler.InactiveRole);
      }

      return role;
    } catch (err) {
      throw err;
    }
  }

  /**
   * NOT IMPLEMENTED
   */
  private async getExistingAndNewPermissions (privileges: PermissionsAndGrantsSetParams):
    Promise<{ existingPermissions: Array<Models.Permission>, newPermissions: Array<string> }> {
    try {
      const uniquePermissions = Array.from(new Set(
        privileges.map((privilege) => privilege.permission.title)
      ));

      const existingPermissions = await Models.Permission.findAll({
        where: {
          title: uniquePermissions,
        }
      });

      const newPermissions = uniquePermissions
        .filter(permission => !existingPermissions.find((x) => x.title === permission));

      return {
        existingPermissions,
        newPermissions,
      };
    } catch (err) {
      throw err;
    }
  }

  private async setPrivilegesToRoleId (roleId: number, privileges: PermissionsAndGrantsSetParams):
    Promise<void> {
    try {
      await Promise.all(privileges.map(async (privilege) => {
        try {
          const grant = await Models.Grant.findOne({ where: { title: privilege.grant.title }});
          if (!grant) {
            throw new RolePrivilegeErrorHandler(RolePrivilegeErrorHandler.GrantDoesNotExist);
          }
          const grantType = await Models.GrantType.findOne({ where: { name: privilege.grantType.name }});
          const [permission, created] = await Models.Permission.findOrCreate({
            where: { title: privilege.permission.title },
            defaults: {
              title: privilege.permission.title,
              active: privilege.permission.active,
            },
          });
          !created && await permission.update(privilege.permission);

          return Models.RolePrivilege.findOrCreate({
            where: {
              idGrant: grant.id,
              idGrantType: grantType.id,
              idRole: roleId,
              idPermission: permission.id,
            }
          });
        } catch (err) {
          console.log(err);
          throw err;
        }
      }));
    } catch (err) {
      throw err;
    }
  }
  //#endregion

  //#region Public Methods
  public async getRoles (): Promise<Array<RoleInterface>> {
    try {
      const modelRoles = await Models.Role.findAll();
      return modelRoles as Array<RoleInterface>;
    } catch (err) {
      throw err;
    }
  }

  public async getGrants (): Promise<Array<GrantInterface>> {
    try {
      const modelGrants = await Models.Grant.findAll();
      return modelGrants as Array<GrantInterface>;
    } catch (err) {
      throw err;
    }
  }

  public async getPermissions (): Promise<Array<PermissionInterface>> {
    try {
      const modelPermissions = await Models.Permission.findAll();
      return modelPermissions as Array<PermissionInterface>;
    } catch (err) {
      throw err;
    }
  }

  public async getPermissionsByRoleId_OLD (id: number): RolePrivilegeType {
    try {
      const role = await this.getRoleByIdAndCheck(id);
      return AccessControl.checkAccess(role.title);
    } catch (err) {
      throw err;
    }
  }

  public async getPermissionsByRoleId (id: number): Promise<unknown> {
    try {
      const role = await this.getRoleByIdAndCheck(id);
      
      const rolesPrivileges = await Models.RolePrivilege.findAll({
        where: { idRole: role.id },
        include: [
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
      if (!rolesPrivileges || !rolesPrivileges.length) {
        throw new RolePrivilegeErrorHandler(RolePrivilegeErrorHandler.RolePrivilegesDoNotExist);
      }

      return {
        role: role.title,
        privileges: rolesPrivileges.reduce((
            result: Record<string, Record<string, string>>,
            privilege: Models.RolePrivilege,
          ) => {
            const permission = privilege.fkIdPermission.title;
            const grant = privilege.fkIdGrant.title;
            const grantType = privilege.fkIdGrantType.name;
            if (!result[permission]) {
              result[permission] = { [grant]: grantType };
            } else {
              result[permission] = {
                ...result[permission],
                [grant]: grantType
              };
            }
            return result;
        }, {}),
      };
    } catch (err) {
      throw err;
    }
  }

  public async addPermissionsGrantsToNewRole (data: PermissionsAndGrantsCreationParams): Promise<number> {
    try {
      const existingRole = await Models.Role.findOne({
        where: {
          title: data.role.title
        }
      });

      if (existingRole) {
        throw new RolePrivilegeErrorHandler(RolePrivilegeErrorHandler.RoleAlreadyExists);
      }

      const role = new Models.Role(data.role);
      await role.save();

      try {
        await this.setPrivilegesToRoleId(role.id, data.privileges);
      } catch (err) {
        role.destroy();
        throw err;
      }

      await AccessControl.init();
      return role.id;
    } catch (err) {
      throw err;
    }
  }

  public async setPrivilegesByRoleId (id: number, data: PermissionsAndGrantsSetParams): Promise<number> {
    try {
      const role = await this.getRoleByIdAndCheck(id);

      await this.setPrivilegesToRoleId(role.id, data);
      await AccessControl.init();

      return role.id;
    } catch (err) {
      throw err;
    }
  }

  public async deleteRoleAndPrivileges (id: number): Promise<void> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const role = await this.getRoleByIdAndCheck(id);

      // ---
      // delete if needed
      // for now the route with this method is hidden
      // ---
    } catch (err) {
      throw err;
    }
  }
  //#endregion
}

const rbacService = new RbacService();
export default rbacService;