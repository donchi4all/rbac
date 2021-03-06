import { IBusinessService } from './IBusinessService';
import {
  BusinessCreationType,
  BusinessInterface,
} from '../../models/business/IBusiness';
import platformService, { PlatformInterface } from '../../services/platform';
import roleService from '../../services/role';
import {
  Business,
  BusinessUserRole,
  Permission,
  Platform,
  Role,
  RolePermission,
} from '../../models';
import { Op } from 'sequelize';
import {
  BusinessErrorHandler,
  BusinessUserRoleErrorHandler,
  CommonErrorHandler,
} from '../../../modules/exceptions';
import {
  BusinessUserRoleCreationType,
  BusinessUserRoleInterface,
  BusinessUserRoleStatus,
} from '../../models/business-user-role/IBusinessUserRole';
import { PermissionInterface } from '../../models/permission/IPermission';
import { title } from 'process';

export {
  BusinessInterface,
  PlatformInterface,
  BusinessCreationType,
  BusinessUserRoleCreationType,
};
export type UserHasPermissionRequest = {
  businessId: BusinessUserRoleInterface['businessId'];
  userId: BusinessUserRoleInterface['userId'];
  permissionId: PermissionInterface['id'] | PermissionInterface['id'][];
};

export type UserRoleResponse = {
  userId: string | number;
  roles: Array<Record<string, any>>;
};

export type UserPermissionResponse = {
  userId: string | number;
  permissions: Array<Record<string, any>>;
};

export type UserRoleSyncType = {
  businessId: BusinessInterface['id'];
  userId: BusinessUserRoleInterface['userId'];
  role: string | string[];
};

export type userHasPermission = {
  userId: BusinessUserRoleInterface['userId'];
  permission: PermissionInterface['title'];
};

class BusinessService implements IBusinessService {
  /**
   * Find business
   * @param platformId
   * @param value
   * @param rejectIfNotFound
   */
  public async findBusiness(
    platformId: PlatformInterface['id'] | string,
    value: string | number,
    rejectIfNotFound: boolean = true
  ): Promise<Business> {
    try {
      const business = await Business.findOne({
        where: {
          [Op.or]: [{ slug: value }, { name: value }, { id: value }],
          [Op.and]: [{ platformId }],
        },
      });

      if (!business && rejectIfNotFound) {
        return Promise.reject(
          new BusinessErrorHandler(BusinessErrorHandler.DoesNotExist)
        );
      }
      return business;
    } catch (err) {
      throw new BusinessErrorHandler(CommonErrorHandler.Fatal);
    }
  }

  /**
   * Find business by Id
   * @param platformId
   * @param businessId
   * @param rejectIfNotFound
   */
  async findBusinessById(
    platformId: PlatformInterface['id'],
    businessId: BusinessInterface['id'],
    rejectIfNotFound: boolean = true
  ): Promise<Business> {
    try {
      const business = await Business.findOne({
        where: {
          id: businessId,
          platformId,
        },
      });

      if (!business && rejectIfNotFound) {
        return Promise.reject(
          new BusinessErrorHandler(BusinessErrorHandler.DoesNotExist)
        );
      }
      return business;
    } catch (err) {
      throw new BusinessErrorHandler(CommonErrorHandler.Fatal);
    }
  }

  /**
   * Create Business in a platform
   * @param businessData
   * @param platformSlug
   */
  public async createBusiness(
    businessData: BusinessCreationType,
    platformSlug: PlatformInterface['slug']
  ): Promise<BusinessInterface> {
    try {
      const platform = await platformService.findPlatform(platformSlug);
      const platformId = platform.id;
      const existingPlatform = await this.findBusiness(
        platformId,
        businessData.name,
        false
      );
      if (existingPlatform) {
        throw new BusinessErrorHandler(BusinessErrorHandler.AlreadyExists);
      }
      const [name, slug] = Array(2).fill(businessData.name);

      const business = await Business.create({
        ...businessData,
        name,
        slug,
        platformId,
      });
      return business.get();
    } catch (err) {
      throw err;
    }

    // if (!Array.isArray(businessData)) {
    //   businessData = [businessData];
    // }
    // return Promise.all(
    //   businessData.map(async (payload) => {
    //     const platformId = platform.id;
    //     const business = await this.findBusiness(
    //       platform.id,
    //       payload.name,
    //       false
    //     );
    //     if (business) {
    //       throw new BusinessErrorHandler(BusinessErrorHandler.AlreadyExists);
    //     }
    //     const [name, slug] = Array(2).fill(payload.name);
    //     return await Business.create({ ...payload, name, slug, platformId });
    //   })
    // );
  }

  /**
   *
   * @param slug
   * @param platformSlug
   */
  public async deleteBusiness(
    slug: BusinessInterface['slug'],
    platformSlug: PlatformInterface['slug']
  ): Promise<BusinessInterface> {
    const platform = await platformService.findPlatform(platformSlug);
    const business = await this.findBusiness(platform.id, slug);
    if (!business.isActive) {
      throw new BusinessErrorHandler(BusinessErrorHandler.Forbidden);
    }
    await business.destroy();
    return business.get();
  }

  /**
   * Find Business in a platform
   * @param slug
   * @param platformSlug
   */
  public async getBusiness(
    slug: BusinessInterface['slug'],
    platformSlug: PlatformInterface['slug']
  ): Promise<BusinessInterface> {
    const platform = await platformService.findPlatform(platformSlug);
    return await this.findBusiness(platform.id, slug);
  }

  /**
   * List all the businesses in a platform
   * @param platformSlug
   */
  public async listBusiness(
    platformSlug: PlatformInterface['slug']
  ): Promise<Array<BusinessInterface>> {
    const platform = await platformService.findPlatform(platformSlug);
    const business = await Business.findAll({
      include: [
        {
          model: Platform,
          attributes: ['name', 'slug', 'description'],
          where: { id: platform.id },
        },
      ],
    });
    return business as Array<BusinessInterface>;
  }

  /**
   * update business data
   * @param businessData
   * @param _slug
   * @param platformSlug
   */
  public async updateBusiness(
    businessData: BusinessCreationType,
    _slug: BusinessInterface['slug'],
    platformSlug: PlatformInterface['slug']
  ): Promise<BusinessInterface> {
    const platform = await platformService.findPlatform(platformSlug);
    const business = await this.findBusiness(platform.id, _slug, false);
    if (!business) {
      throw new BusinessErrorHandler(BusinessErrorHandler.DoesNotExist);
    }

    const [name, slug] = Array(2).fill(businessData.name);
    await business.update({
      ...businessData,
      name,
      slug,
    });
    return business.get();
  }

  /**
   * Get Business User With Role
   *
   * @param platformSlug
   * @param _slug
   */
  public async getBusinessWithRoleAndPermissions(
    platformSlug: PlatformInterface['slug'],
    _slug: BusinessInterface['slug']
  ): Promise<unknown> {
    const platform = await platformService.findPlatform(platformSlug);
    const business = await this.findBusiness(platform.id, _slug);

    const businessUserRole = await BusinessUserRole.findAll({
      where: { businessId: business.id },
      include: [
        {
          model: Role,
          include: [
            {
              model: RolePermission,
              attributes: ['id'],
              include: [
                {
                  model: Permission,
                  attributes: ['title', 'isActive', 'description', 'createdAt'],
                },
              ],
            },
          ],
        },
      ],
    });

    const userRole = businessUserRole.reduce(
      (
        result: Record<string, Record<string, any>>,
        userRole: BusinessUserRole
      ) => {
        const role = userRole.role;
        const permissions = role.rolePermissions.map((rolePermission) =>
          rolePermission.permissions.map((_permission) => _permission)
        );

        if (!result[userRole.userId]) {
          result[userRole.userId] = {
            userId: userRole.userId,
            [role.title]: permissions,
          };
        } else {
          result[userRole.userId] = {
            ...result[userRole.userId],
            [role.title]: permissions,
          };
        }

        return result;
      },
      {}
    );

    return { platform: platformSlug, business: _slug, userRole };
    return await Business.findAll({
      where: { id: business.id },
      include: [
        {
          model: BusinessUserRole,
          attributes: ['id', 'userId', 'status', 'createdAt'],
          include: [
            {
              model: Role,
              attributes: ['title', 'slug', 'isActive', 'description'],
              include: [
                {
                  model: RolePermission,
                  attributes: ['id'],
                  include: [
                    {
                      model: Permission,
                      attributes: [
                        'title',
                        'isActive',
                        'description',
                        'createdAt',
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  }

  /**
   * Assign role to Business User
   *
   * @param platformSlug
   * @param businessUserRoleData
   */
  public async assignRoleToBusinessUser(
    platformSlug: PlatformInterface['slug'],
    businessUserRoleData: BusinessUserRoleCreationType
  ): Promise<BusinessUserRoleInterface> {
    const platform = await platformService.findPlatform(platformSlug);
    const { userId, role, businessId } = businessUserRoleData;
    const business = await this.findBusiness(platform.id, businessId);

    //check if this role belong to this business
    const foundRole = await roleService.findRole(business.id, role);
    const businessUserRole = await this.findBusinessUserRole(
      business.id,
      userId,
      foundRole.id,
      false
    );

    if (businessUserRole) {
      return Promise.reject(
        new BusinessUserRoleErrorHandler(
          BusinessUserRoleErrorHandler.AlreadyExists
        )
      );
    }

    try {
      const status = BusinessUserRoleStatus.ACTIVE;
      return await BusinessUserRole.create({
        userId,
        roleId: foundRole.id,
        status,
        businessId: business.id,
      });
    } catch (err) {
      throw new BusinessUserRoleErrorHandler(CommonErrorHandler.Fatal);
    }
  }

  /**
   * Finds an existing business user record
   *
   * @param businessId
   * @param userId
   * @param roleId
   * @param rejectIfNotFound
   */
  async findBusinessUserRole(
    businessId: BusinessInterface['id'],
    userId: BusinessUserRoleInterface['userId'],
    roleId: BusinessUserRoleInterface['roleId'],
    rejectIfNotFound: boolean = true
  ): Promise<BusinessUserRole> {
    const businessUserRole = await BusinessUserRole.findOne({
      where: { businessId, userId, roleId },
      include: [
        {
          model: Business,
          attributes: ['name', 'slug', 'description'],
        },
      ],
    });

    if (!businessUserRole && rejectIfNotFound) {
      return Promise.reject(
        new BusinessUserRoleErrorHandler(
          BusinessUserRoleErrorHandler.DoesNotExist
        )
      );
    }
    return businessUserRole;
  }

  /**
   * Get business user roles
   * @param businessId
   * @param userId
   * @param rejectIfNotFound
   */
  public async getBusinessUserRole(
    platformSlug: PlatformInterface['slug'],
    businessId: BusinessUserRoleInterface['businessId'],
    userId: BusinessUserRoleInterface['userId'],
    rejectIfNotFound: boolean = true
  ): Promise<UserRoleResponse> {
    const platform = await platformService.findPlatform(platformSlug);
    const business = await this.findBusiness(platform.id, businessId);
    const businessUserRole = await BusinessUserRole.findAll({
      where: { businessId: business.id, userId },
      include: [
        {
          model: Role,
          attributes: ['id', 'title', 'slug', 'isActive', 'description'],
        },
      ],
    });

    if (!businessUserRole && rejectIfNotFound) {
      return Promise.reject(
        new BusinessUserRoleErrorHandler(
          BusinessUserRoleErrorHandler.DoesNotExist
        )
      );
    }

    const roles = businessUserRole.reduce(
      (result: Array<Record<string, any>>, privilege: BusinessUserRole) => {
        if (privilege.role) {
          result.push({
            id: privilege?.role?.id,
            title: privilege?.role?.title,
            slug: privilege?.role?.slug,
            description: privilege?.role?.description,
          });
        }

        return result;
      },
      []
    );

    return {
      userId: userId,
      roles,
    };
  }

  /**
   * Get business user permission
   * @param businessId
   * @param userId
   * @param rejectIfNotFound
   */
  public async getBusinessUserPermissions(
    platformId: string,
    businessId: string | number,
    userId: string | number,
    rejectIfNotFound: boolean = true
  ): Promise<UserPermissionResponse> {
    const platform = await platformService.findPlatform(platformId);
    const business = await this.findBusiness(platform.id, businessId);
    const businessUserRole = await BusinessUserRole.findAll({
      where: { businessId: business.id, userId },
      include: [
        {
          model: Permission,
          attributes: ['id', 'title', 'slug', 'description'],
        },
      ],
    });
    if (!businessUserRole && rejectIfNotFound) {
      return Promise.reject(
        new BusinessUserRoleErrorHandler(
          BusinessUserRoleErrorHandler.DoesNotExist
        )
      );
    }
    const permissions = businessUserRole.reduce((result: any, role: any) => {
      role.permissions.forEach(
        (permission: any) => delete permission.dataValues.RolePermission
      );

      result = [...result, ...role.permissions];

      return result;
    }, []);

    const uniquePermissions = [
      ...new Map(
        permissions.map((item: { [x: string]: any }) => [item['title'], item])
      ).values(),
    ];

    return {
      userId: userId,
      permissions: uniquePermissions,
    };
  }

  /**
   * Get business user role and permission
   * @param businessId
   * @param userId
   * @param rejectIfNotFound
   */
  public async getBusinessUserRolesAndPermissions(
    businessId: string | number,
    userId: string | number,
    rejectIfNotFound: boolean = true
  ): Promise<UserRoleResponse> {
    const businessUserRole = await BusinessUserRole.findAll({
      where: { businessId, userId },
      include: [
        {
          model: Role,
          attributes: ['title', 'slug', 'isActive', 'description'],
          include: [
            {
              model: Permission,
              attributes: ['title', 'slug', 'description'],
            },
          ],
        },
      ],
    });

    if (!businessUserRole && rejectIfNotFound) {
      return Promise.reject(
        new BusinessUserRoleErrorHandler(
          BusinessUserRoleErrorHandler.DoesNotExist
        )
      );
    }

    const roleAndPermissions = businessUserRole.map(
      (rolePermission: BusinessUserRole) => {
        rolePermission.role?.permission?.forEach(
          (permission: any) => delete permission.dataValues.RolePermission
        );

        return {
          title: rolePermission.role.title,
          slug: rolePermission.role.slug,
          description: rolePermission.role.description,
          permissions: rolePermission.role.permission,
        };
      }
    );

    return {
      userId: userId,
      roles: roleAndPermissions,
    };
  }

  /**
   *  Get user with it's permissions
   * @param userId
   * @param permission
   */
  public async userPermissions(payload: userHasPermission): Promise<boolean> {
    const { userId, permission } = payload;
    const userPermissions = await BusinessUserRole.findOne({
      where: { userId: userId },
      include: [
        {
          model: Permission,
          where: { title: permission },
        },
      ],
    });
    return (userPermissions && true) || false;
  }

  public async syncUserWithRole(
    platformSlug: PlatformInterface['slug'],
    payload: UserRoleSyncType
  ): Promise<unknown> {
    const platform = await platformService.findPlatform(platformSlug);

    if (!Array.isArray(payload['role'])) {
      payload['role'] = [payload['role']];
    }
    const { businessId, userId, role } = payload;

    try {
      const business = await this.findBusiness(platform.id, businessId);
      //remove all the current role a user has
      await BusinessUserRole.destroy({
        where: { businessId: business.id, userId },
      });

      const roles = await roleService.findRoles(business.id, role);

      const records: any[] = roles.map((role) => {
        return {
          userId,
          roleId: role.id,
          status: 'active',
          businessId: business.id,
        };
      });

      return await BusinessUserRole.bulkCreate([...records]);
    } catch (e) {
      throw e;
    }
  }

  public async findBusinessUserByRole(
    platformSlug: PlatformInterface['slug'],
    businessId: BusinessUserRoleInterface['businessId'],
    roleSlug: string
  ): Promise<Array<BusinessUserRoleInterface>> {
    const platform = await platformService.findPlatform(platformSlug);
    const business = await this.findBusiness(platform.id, businessId);
    const role = await roleService.findRoleByName(business.id, roleSlug);
    const users = await BusinessUserRole.findAll({
      where: { businessId: business.id, roleId: role.id, status: 'active' },
    });
    return users;
  }
}

const businessService = new BusinessService();
export default businessService;
