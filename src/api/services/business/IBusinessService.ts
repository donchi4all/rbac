import {
  BusinessCreationType,
  BusinessInterface,
} from '../../models/business/IBusiness';
import { PlatformInterface } from '../../models/platform/IPlatform';
import {
  BusinessUserRoleCreationType,
  BusinessUserRoleInterface,
} from '../../models/business-user-role/IBusinessUserRole';
import { BusinessUserRole } from '../../models';
import { userHasPermission, UserRoleResponse } from './index';

export interface IBusinessService {
  /**
   * Create Business in a platform
   * @param businessData
   * @param platformSlug
   */
  createBusiness(
    businessData: BusinessCreationType | BusinessCreationType[],
    platformSlug: PlatformInterface['slug']
  ): Promise<BusinessInterface>;

  /**
   * Find Business in a platform
   * @param slug
   * @param platformSlug
   */
  getBusiness(
    slug: BusinessInterface['slug'],
    platformSlug: PlatformInterface['slug']
  ): Promise<BusinessInterface>;

  /**
   * List all the businesses in a platform
   * @param platformSlug
   */
  listBusiness(
    platformSlug: PlatformInterface['slug']
  ): Promise<Array<BusinessInterface>>;

  /**
   *
   * @param slug
   * @param platformSlug
   */
  deleteBusiness(
    slug: BusinessInterface['slug'],
    platformSlug: PlatformInterface['slug']
  ): Promise<BusinessInterface>;

  /**
   * update business data
   * @param businessData
   * @param slug
   * @param platformSlug
   */
  updateBusiness(
    businessData: BusinessInterface,
    slug: BusinessInterface['slug'],
    platformSlug: PlatformInterface['slug']
  ): Promise<BusinessInterface>;

  /**
   * Get Business Roles and Permission
   * @param platformSlug
   * @param _slug
   */
  getBusinessWithRoleAndPermissions(
    platformSlug: PlatformInterface['slug'],
    _slug: BusinessInterface['slug']
  ): Promise<unknown>;

  /**
   * Assign role with Business User
   *
   * @param platformSlug
   * @param _slug
   * @param businessUserRoleData
   */
  assignRoleToBusinessUser(
    platformSlug: PlatformInterface['slug'],
    businessUserRoleData: BusinessUserRoleCreationType
  ): Promise<BusinessUserRoleInterface>;

  /**
   * Finds an existing business user record
   *
   * @param businessId
   * @param userId
   * @param roleId
   */
  findBusinessUserRole(
    businessId: BusinessUserRoleInterface['businessId'],
    userId: BusinessUserRoleInterface['userId'],
    roleId: BusinessUserRoleInterface['roleId']
  ): Promise<BusinessUserRole>;

  /**
   * Get business user role and permission
   * @param businessId
   * @param userId
   * @param rejectIfNotFound
   */
  getBusinessUserRole(
    platformSlug: PlatformInterface['slug'],
    businessId: BusinessUserRoleInterface['businessId'],
    userId: BusinessUserRoleInterface['userId'],
    rejectIfNotFound: boolean
  ): Promise<UserRoleResponse>;

  /**
   * Get business user with it's permissions
   * @param userId
   * @param permission
   */
  userPermissions(payload: userHasPermission): Promise<boolean>;

  /**
   * Find businessUsers with Role
   * @param platformSlug
   * @param businessId
   * @param roleSlug
   */
  findBusinessUserByRole(
    platformSlug: PlatformInterface['slug'],
    businessId: BusinessUserRoleInterface['businessId'],
    roleSlug: string
  ): Promise<Array<BusinessUserRoleInterface>>;
}
