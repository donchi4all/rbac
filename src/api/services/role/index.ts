import { Op, where } from 'sequelize';
import { Business, BusinessUserRole, Role, RolePermission } from '../../models';
import {
  RoleCreationRequestType,
  RoleCreationType,
  RoleEditRequestType,
  RoleInterface,
} from '../../models/role/IRole';
import { IRoleService } from './IRoleService';
import {
  CommonErrorHandler,
  PermissionErrorHandler,
  RoleErrorHandler,
  RolePermissionErrorHandler,
} from '../../../modules/exceptions';
import {
  RolePermissionCreationType,
  RolePermissionInterface,
} from '../../models/role-permission/IRolePermission';
import businessService, { BusinessUserRoleCreationType } from '../business';
import permissionService from '../permission';

export { RolePermissionInterface };

class RoleService implements IRoleService {
  /**
   * Creates a new role
   *
   * @param payload
   * @returns
   */
  public async createRole(
    payload: RoleCreationRequestType | RoleCreationRequestType[]
  ): Promise<Array<Role>> {
    try {
      if (!Array.isArray(payload)) {
        payload = [payload];
      }

      const role = Promise.all(
        payload.map(async (payload) => {
          const [title, slug] = Array(2).fill(payload.title);
          return await Role.create({ ...payload, title, slug });
        })
      );

      return role;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Sudo Implementation for model findOrCreate (WIP)
   *
   * @param searchParams
   * @param payload
   * @returns
   */
  public async findOrCreate(
    searchParams: Array<string>,
    payload: RoleCreationType
  ): Promise<Role> {
    const search = searchParams.reduce(
      (result: { [x: string]: string }, param) => {
        result[param] = param;

        return result;
      },
      {} as { [x: string]: string }
    );

    try {
      Role.findOne({
        where: {
          [Op.or]: search,
        },
      });
    } catch (err) {
      try {
        return await Role.create(payload);
      } catch (err) {
        throw err;
      }
    }
  }

  /**
   * Update an existing worklfow
   *
   * @param roleId
   * @param payload
   * @returns
   */
  public async updateRole(
    roleId: RoleInterface['id'],
    payload: RoleEditRequestType
  ): Promise<Role> {
    try {
      const role = await Role.findOne({
        where: { id: roleId },
      });

      if (!role) {
        return Promise.reject(new RoleErrorHandler(RoleErrorHandler.NotExist));
      }

      const [title, slug] = Array(2).fill(payload.title || role.title);
      await role.update({ ...role, ...payload, title, slug });

      return role;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Fetch list of roles
   *
   * @returns
   */
  public async listRoles(
    businessId: RoleInterface['businessId']
  ): Promise<Array<Role>> {
    try {
      return await Role.findAll({
        where: { businessId },
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   * Find an existing role
   *
   * @param identifier
   * @returns
   */
  public async findRole(
    businessId: RoleInterface['businessId'],
    identifier: string
  ): Promise<Role> {
    try {
      const role = await Role.findOne({
        where: {
          [Op.or]: [{ slug: identifier }, { title: identifier }],
          [Op.and]: [{ businessId }],
        },
      });

      if (!role) {
        return Promise.reject(new RoleErrorHandler(RoleErrorHandler.NotExist));
      }

      return role;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Delete an existing role
   *
   * @param roleId
   * @returns
   */
  public async deleteRole(
    businessId: RoleInterface['businessId'],
    roleId: RoleInterface['id']
  ): Promise<void> {
    try {
      const role = await this.findRoleById(businessId, roleId);
      await role.destroy();

      return;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Find Role By ID
   *
   * @param businessId
   * @param roleId
   * @param rejectIfNotFound
   */
  async findRoleById(
    businessId: RoleInterface['businessId'],
    roleId: RoleInterface['id'],
    rejectIfNotFound: boolean = true
  ): Promise<Role> {
    try {
      const role = await Role.findOne({
        where: {
          id: roleId,
          businessId: businessId,
        },
        include: [Business],
      });

      if (!role && rejectIfNotFound) {
        return Promise.reject(
          new RoleErrorHandler(RoleErrorHandler.RoleDoNotExist)
        );
      }
      return role;
    } catch (e) {
      throw new RoleErrorHandler(CommonErrorHandler.Fatal);
    }
  }

  /**
   * Sync Role with permission
   *
   * @param businessId
   * @param options
   */
  public async addRoleWithPermissions(
    businessId: RoleInterface['businessId'],
    options: {
      roleId: RolePermissionInterface['roleId'];
      permissions:
        | RolePermissionInterface['permissionId']
        | RolePermissionInterface['permissionId'][];
    }
  ): Promise<Array<RolePermissionInterface>> {
    // eslint-disable-next-line prefer-const
    let { roleId, permissions } = options;
    const role = await this.findRoleById(businessId, roleId);
    const { platformId } = await businessService.findBusinessById(
      role.business.platformId,
      businessId
    );

    if (!Array.isArray(permissions)) {
      permissions = [permissions];
    }

    return Promise.all(
      permissions.map(async (permissionId) => {
        //check if permission exist in the platform
        const permission = await permissionService.findPermissionById(
          platformId,
          permissionId,
          false
        );
        if (!permission)
          return Promise.reject(
            new PermissionErrorHandler(
              PermissionErrorHandler.PermissionDoNotExist
            )
          );
        //check if role & permission exist
        const rolePermission = await this.findRolePermission(
          roleId,
          permissionId,
          false
        );
        if (rolePermission) {
          return Promise.reject(
            new RolePermissionErrorHandler(
              RolePermissionErrorHandler.AlreadyExists
            )
          );
        }
        return await RolePermission.create({ roleId, permissionId });
      })
    );
  }

  public async syncRoleWithPermissions(
    businessId: RoleInterface['businessId'],
    options: {
      roleId: RolePermissionInterface['roleId'];
      permissions:
        | RolePermissionInterface['permissionId']
        | RolePermissionInterface['permissionId'][];
    }
  ): Promise<Array<RolePermissionInterface>> {
    try {
      await RolePermission.destroy({ where: { roleId: options['roleId'] } });
      return await this.addRoleWithPermissions(businessId, options);
    } catch (error) {
      throw new RoleErrorHandler(CommonErrorHandler.Fatal);
    }
  }

  /**
   * Find Role with Permission
   *
   * @param roleId
   * @param permissionId
   * @param rejectIfNotFound
   */
  async findRolePermission(
    roleId: RolePermissionInterface['roleId'],
    permissionId: RolePermissionInterface['permissionId'],
    rejectIfNotFound: boolean = true
  ): Promise<RolePermission> {
    const rolePermission = RolePermission.findOne({
      where: { roleId, permissionId },
    });

    if (!rolePermission && rejectIfNotFound) {
      return Promise.reject(
        new RolePermissionErrorHandler(RolePermissionErrorHandler.DoesNotExist)
      );
    }
    return rolePermission;
  }

  /**
   * Business User Role Checker
   * @param payload
   */
  public async businessUserHasRole(
    payload: BusinessUserRoleCreationType
  ): Promise<boolean> {
    const userRole = await BusinessUserRole.findOne({ where: payload });
    if (!userRole) return Promise.resolve(false);
    return Promise.resolve(true);
  }

  /**
   * Check if Role has  a particular Permission
   * @param payload
   */
  public async roleHasPermission(
    payload: RolePermissionCreationType
  ): Promise<boolean> {
    const rolePermission = await RolePermission.findOne({ where: payload });
    if (!rolePermission) return Promise.resolve(false);
    return Promise.resolve(true);
  }

  /**
   * Find Role By By Property name
   *
   * @param businessId
   * @param identifier
   * @param rejectIfNotFound
   */
  public async findRoleByName(
    businessId: RoleInterface['businessId'],
    identifier: string,
    rejectIfNotFound: boolean = true
  ): Promise<Role> {
    try {
      const role = await Role.findOne({
        where: {
          [Op.or]: [{ slug: identifier }, { title: identifier }],
          [Op.and]: [{ businessId }],
        },
      });

      if (!role && rejectIfNotFound) {
        return Promise.reject(
          new RoleErrorHandler(RoleErrorHandler.RoleDoNotExist)
        );
      }
      return role;
    } catch (e) {
      throw new RoleErrorHandler(CommonErrorHandler.Fatal);
    }
  }
}

const roleService = new RoleService();
export default roleService;
