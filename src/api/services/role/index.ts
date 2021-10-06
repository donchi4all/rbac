/* eslint-disable prefer-const */
import { Op, where } from 'sequelize';
import {
  Business,
  BusinessUserRole,
  Permission,
  Role,
  RolePermission,
} from '../../models';
import {
  RoleCreationRequestType,
  RoleCreationType,
  RoleEditRequestType,
  RoleInterface,
} from '../../models/role/IRole';
import { IRoleService } from './IRoleService';
import {
  BusinessErrorHandler,
  CommonErrorHandler,
  PermissionErrorHandler,
  RoleErrorHandler,
  RolePermissionErrorHandler,
} from '../../../modules/exceptions';
import {
  AddPermissionToRoleType,
  RolePermissionCreationType,
  RolePermissionInterface,
} from '../../models/role-permission/IRolePermission';
import businessService, { BusinessUserRoleCreationType } from '../business';
import permissionService from '../permission';
import platformService from '../platform';

export { RolePermissionInterface };

class RoleService implements IRoleService {
  /**
   * Creates a new role
   *
   * @param payload
   * @returns
   */
  public async createRole(
    platformSlug: string,
    businessValue: string,
    payload: RoleCreationRequestType | RoleCreationRequestType[]
  ): Promise<Array<RoleInterface>> {
    try {
      if (!Array.isArray(payload)) {
        payload = [payload];
      }
      const platform = await platformService.findPlatform(platformSlug);
      const business = await businessService.findBusiness(
        platform.id,
        businessValue,
        false
      );
      if (!business) {
        return Promise.reject(
          new BusinessErrorHandler(BusinessErrorHandler.DoesNotExist)
        );
      }

      const role = Promise.all(
        payload.map(async (payload) => {
          const [title, slug] = Array(2).fill(payload.title);
          return await Role.create({
            ...payload,
            businessId: business.id,
            title,
            slug,
          });
        })
      );

      return role as unknown as Array<RoleInterface>;
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
    business: string,
    roleId: RoleInterface['id'],
    payload: RoleEditRequestType
  ): Promise<Role> {
    try {
      const role = await Role.findOne({
        where: { id: roleId, businessId: business },
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
    platformSlug: string,
    businessId: RoleInterface['businessId']
  ): Promise<Array<Role>> {
    const platform = await platformService.findPlatform(platformSlug);
    const business = await businessService.findBusiness(
      platform.id,
      businessId,
      false
    );
    if (!business) {
      return Promise.reject(
        new BusinessErrorHandler(BusinessErrorHandler.DoesNotExist)
      );
    }

    try {
      return await Role.findAll({
        where: { businessId: business.id },
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
    identifier: string | number
  ): Promise<Role> {
    try {
      const role = await Role.findOne({
        where: {
          [Op.or]: [
            { id: identifier },
            { slug: identifier },
            { title: identifier },
          ],
          [Op.and]: [{ businessId }],
        },
        include: Business,
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
    platformId: string | number,
    businessId: RoleInterface['businessId'],
    options: AddPermissionToRoleType
  ): Promise<Array<RolePermissionInterface>> {
    try {
      let { role, permissions } = options;
      const business = await businessService.findBusiness(
        platformId,
        businessId
      );
      console.log(business);
      const getRole = await this.findRole(business.id, role);
      console.log(getRole);
      const roleId = getRole.id;
      if (!Array.isArray(permissions)) {
        permissions = [permissions];
      }

      const permissionIds = await Permission.findAll({
        where: {
          [Op.or]: [{ id: { [Op.in]: permissions } }],
          [Op.or]: [{ slug: { [Op.in]: permissions } }],
          [Op.or]: [{ title: { [Op.in]: permissions } }],
          [Op.and]: [{ platformId }],
        },
        attributes: ['id'],
      });

      const bulkInsert = permissionIds.reduce(
        (result: any, permission: Permission) => {
          result.push({ roleId, permissionId: permission.id });
          return result;
        },
        []
      );

      return await RolePermission.bulkCreate(bulkInsert);
    } catch (error) {
      throw error;
    }
  }

  public async syncRoleWithPermissions(
    platform: string | number,
    businessId: RoleInterface['businessId'],
    options: AddPermissionToRoleType
  ): Promise<Array<RolePermissionInterface>> {
    try {
      const getRole = await this.findRole(businessId, options['role']);
      const roleId = getRole.id;
      await RolePermission.destroy({ where: { roleId: roleId } });
      return await this.addRoleWithPermissions(platform, businessId, options);
    } catch (error) {
      throw error;
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
