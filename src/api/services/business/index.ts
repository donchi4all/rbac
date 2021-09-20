import { IBusinessService } from './IBusinessService';
import {
  BusinessCreationType,
  BusinessInterface,
} from '../../models/business/IBusiness';
import platformService, { PlatformInterface } from '../../services/platform';
import roleService from '../../services/Role';
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
  userId: BusinessUserRoleInterface['userId'];
  roles: Record<string, Record<string, any>>;
};

class BusinessService implements IBusinessService {
  /**
   * Find business
   * @param platformId
   * @param value
   * @param rejectIfNotFound
   */
  async findBusiness(
    platformId: PlatformInterface['id'],
    value: string,
    rejectIfNotFound: boolean = true
  ): Promise<Business> {
    try {
      const business = await Business.findOne({
        where: {
          [Op.or]: [{ slug: value }, { name: value }],
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
    businessData: BusinessCreationType | BusinessCreationType[],
    platformSlug: PlatformInterface['slug']
  ): Promise<Array<BusinessInterface>> {
    const platform = await platformService.findPlatform(platformSlug);

    if (!Array.isArray(businessData)) {
      businessData = [businessData];
    }
    return Promise.all(
      businessData.map(async (payload) => {
        const platformId = platform.id;
        const business = await this.findBusiness(
          platform.id,
          payload.name,
          false
        );
        if (business) {
          throw new BusinessErrorHandler(BusinessErrorHandler.AlreadyExists);
        }
        const [name, slug] = Array(2).fill(payload.name);
        return await Business.create({ ...payload, name, slug, platformId });
      })
    );
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
  ): Promise<Array<BusinessInterface>> {
    const platform = await platformService.findPlatform(platformSlug);
    const business = await this.findBusiness(platform.id, _slug);
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
    const { userId, roleId, businessId } = businessUserRoleData;
    const business = await this.findBusinessById(platform.id, businessId);

    //check if this role belong to this business
    await roleService.findRoleById(businessId, roleId);
    const businessUserRole = await this.findBusinessUserRole(
      business.id,
      userId,
      roleId,
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
        roleId,
        status,
        businessId,
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
   * Get business user role and permission
   * @param businessId
   * @param userId
   * @param rejectIfNotFound
   */
  public async getBusinessUserRole(
    businessId: BusinessUserRoleInterface['businessId'],
    userId: BusinessUserRoleInterface['userId'],
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

    if (!businessUserRole && rejectIfNotFound) {
      return Promise.reject(
        new BusinessUserRoleErrorHandler(
          BusinessUserRoleErrorHandler.DoesNotExist
        )
      );
    }

    const roles = businessUserRole.reduce(
      (
        result: Record<string, Record<string, any>>,
        privilege: BusinessUserRole
      ) => {
        privilege.roles.map((role) => {
          const _role = role.title;
          const permissions: unknown[] = [];
          role.rolePermissions.map((rolePermission) => {
            rolePermission.permissions.map((_permission) => {
              permissions.push(...[_permission]);
            });
          });

          if (!result[_role]) {
            result[_role] = { permissions };
          } else {
            result[_role] = {
              ...result[_role],
              permissions,
            };
          }
        });
        return result;
      },
      {}
    );
    return {
      userId: userId,
      roles,
    };
  }

  /**
   *  Get user with it's permissions
   * @param userId
   * @param permission
   */
  public async userPermissions(
    userId: BusinessUserRoleInterface['userId'],
    permission: string
  ): Promise<boolean> {
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
}

const businessService = new BusinessService();
export default businessService;
