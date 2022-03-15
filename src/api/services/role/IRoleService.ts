import { Role } from '../../models';
import {
  RoleInterface,
  RoleCreationType,
  RoleEditRequestType,
  RoleCreationRequestType,
} from '../../models/role/IRole';
import { BusinessUserRoleCreationType } from '../../models/business-user-role/IBusinessUserRole';
import { RolePermissionCreationType } from '../../models/role-permission/IRolePermission';

export interface IRoleService {
  /**
   * Creates a new role
   *
   * @param payload
   * @returns
   */
  createRole(
    platformSlug: string,
    business: string,
    payload: RoleCreationRequestType | RoleCreationRequestType[]
  ): Promise<Array<RoleInterface>>;

  /**
   * Sudo Implementation for model findOrCreate (WIP)
   *
   * @param searchParams
   * @param payload
   * @returns
   */
  findOrCreate?(
    searchParams: Array<string>,
    payload: RoleCreationType
  ): Promise<Role>;

  /**
   * Update an existing worklfow
   *
   * @param roleId
   * @param payload
   * @returns
   */
  updateRole(
    business: string,
    roleId: RoleInterface['id'],
    payload: RoleEditRequestType
  ): Promise<Role>;

  /**
   * Fetch list of roles
   *
   * @returns
   */
  listRoles(
    platformSlug: string,
    businessId: RoleInterface['businessId']
  ): Promise<Array<Role>>;

  /**
   * Find an existing role
   *
   * @param identifier
   * @returns
   */
  findRole(
    businessId: RoleInterface['businessId'],
    identifier: string
  ): Promise<Role>;

  /**
   * Delete an existing role
   *
   * @param roleId
   * @returns
   */
  deleteRole(
    businessId: RoleInterface['businessId'],
    roleId: RoleInterface['id']
  ): Promise<void>;

  /**
   * Business User Role Checker
   * @param payload
   */
  businessUserHasRole(payload: BusinessUserRoleCreationType): Promise<boolean>;

  /**
   * Role has Permission Checker
   * @param payload
   */
  roleHasPermission(payload: RolePermissionCreationType): Promise<boolean>;
}
