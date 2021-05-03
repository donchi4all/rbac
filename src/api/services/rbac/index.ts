import * as Models from '../../models';

import { RoleInterface, RoleCreationType } from '../../models/role/IRole';
import { GrantInterface } from '../../models/grant/IGrant';
import { GrantTypeInterface } from '../../models/grant-type/IGrantType';
import { PermissionInterface, PermissionCreationType } from '../../models/permission/IPermission';

import AccessControl from '../../../modules/access-control';

export type PermissionsAndGrantsSetParams = Array<{
  grant: Pick<GrantInterface, 'title'>,
  grantType: Pick<GrantTypeInterface, 'name'>,
  permission: PermissionCreationType,
}>;

export type PermissionsAndGrantsCreationParams = {
  role: RoleCreationType;
  privileges: PermissionsAndGrantsSetParams;
}

export type RolePrivilegeType = Promise<ReturnType<typeof AccessControl.checkAccess>>;

export { RoleInterface, GrantInterface, PermissionInterface };

type ModelNameType = 'Grant' | 'GrantType' | 'Permission' | 'Role';
type ModelType = Models.Grant | Models.GrantType | Models.Permission | Models.Role;

class RbacService {
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
        throw new Error(`The ${modelName.toLowerCase()} with ${property.key}=${property.value} has not been found.`);
      }

      return modelObject;
    } catch (err) {
      throw err;
    }
  }

  private async setPrivilegesToRoleId (roleId: number, privileges: PermissionsAndGrantsSetParams): Promise<void> {
    try {
      const uniquePermissions = privileges
        .map((privilege) => privilege.permission.title)
        .filter((permission, index, self) => self.indexOf(permission) === index);
      const existingPermissions = await Models.Permission.findAll({
        where: {
          title: uniquePermissions,
        }
      });
      const newPermissions = uniquePermissions
        .filter(permission => !existingPermissions.find((x) => x.title === permission));

      privileges.forEach(async (privilege) => {
        try {
          let permission: Models.Permission;
          if (newPermissions.includes(privilege.permission.title)) {
            permission = new Models.Permission(privilege.permission);
            await permission.save();
          } else {
            permission = existingPermissions.find((x) => x.title === privilege.permission.title);
          }

          const grant = await this.findModelByProperty(
            'Grant',
            { key: 'title', value: privilege.grant.title });
          const grantType = await this.findModelByProperty(
            'GrantType',
            { key: 'name', value: privilege.grantType.name });

          const rolePrivilege = new Models.RolePrivilege({
            idGrant: grant.id,
            idGrantType: grantType.id,
            idRole: roleId,
            idPermission: permission.id,
          });
          await rolePrivilege.save();
        } catch (err) {
          throw err;
        }
      });
    } catch (err) {
      throw err;
    }
  }

  public async getRoles (): Promise<Array<RoleInterface>> {
    try {
      const modelRoles = await Models.Role.findAll();
      return modelRoles.map((role) => role.get());
    } catch (err) {
      throw err;
    }
  }

  public async getGrants (): Promise<Array<GrantInterface>> {
    try {
      const modelGrants = await Models.Grant.findAll();
      return modelGrants.map((grant) => grant.get());
    } catch (err) {
      throw err;
    }
  }

  public async getPermissions (): Promise<Array<PermissionInterface>> {
    try {
      const modelPermissions = await Models.Permission.findAll();
      return modelPermissions.map((permission) => permission.get());
    } catch (err) {
      throw err;
    }
  }

  public async getPermissionsByRoleId (id: number): RolePrivilegeType {
    try {
      const role = await Models.Role.findByPk(id);

      if (!role) {
        throw new Error(`The role with id=${id} does not exist.`);
      }
      if (!role.active) {
        throw new Error(`The role "${role.title}" with id=${role.id} is inactive.`);
      }

      return AccessControl.checkAccess(role.title);
    } catch (err) {
      throw err;
    }
  }

  public async getPermissionsByRoleIdNew (id: number): Promise<unknown> {
    try {
      const role = await Models.Role.findByPk(id);

      if (!role) {
        throw new Error(`The role with id=${id} does not exist.`);
      }
      if (!role.active) {
        throw new Error(`The role "${role.title}" with id=${role.id} is inactive.`);
      }
      
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
        throw new Error(`The role "${existingRole.title}" already exists.`);
      }

      const role = new Models.Role(data.role);
      await role.save();

      this.setPrivilegesToRoleId(role.id, data.privileges);

      await AccessControl.init();
      return role.id;
    } catch (err) {
      throw err;
    }
  }

  public async setPrivilegesByRoleId (id: number, data: PermissionsAndGrantsSetParams): Promise<number> {
    try {
      const role = await Models.Role.findByPk(id);

      if (!role) {
        throw new Error(`The role with id=${id} does not exist.`);
      }
      if (!role.active) {
        throw new Error(`The role "${role.title}" with id=${role.id} is inactive.`);
      }

      this.setPrivilegesToRoleId(role.id, data);

      await AccessControl.init();
      return role.id;
    } catch (err) {
      throw err;
    }
  }

  public async deleteRoleAndPrivileges (id: number): Promise<void> {
    try {
      const role = await Models.Role.findByPk(id);

      if (!role) {
        throw new Error(`The role with id=${id} does not exist.`);
      }
      if (!role.active) {
        throw new Error(`The role "${role.title}" with id=${role.id} is inactive.`);
      }

      // ---
      // delete if needed
      // for now the route with this method is hidden
      // ---
    } catch (err) {
      throw err;
    }
  }
}

const rbacService = new RbacService();
export default rbacService;