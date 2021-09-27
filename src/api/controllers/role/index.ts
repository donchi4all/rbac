import {
  Get,
  Put,
  Body,
  Post,
  Route,
  Delete,
  Controller,
  SuccessResponse,
  Tags,
} from 'tsoa';

import httpStatuses from '../../httpStatuses';
import roleService, { RolePermissionInterface } from '../../services/role';
import { Role } from '../../../api/models';
import {
  RoleCreationRequestType,
  RoleInterface,
} from '../../../api/models/role/IRole';
import { LoggerDecorator, LoggerInterface } from '../../../modules/logger';
import { BusinessUserRoleCreationType } from '../../models/business-user-role/IBusinessUserRole';
import { RolePermissionCreationType } from '../../models/role-permission/IRolePermission';

@Route('role')
@Tags('Role')
export class roleController extends Controller {
  /**
   * Initialize logger
   */
  @LoggerDecorator('Controller.Role')
  private log: LoggerInterface;

  /**
   * Role Creation endpoint
   *
   * @param requestBody
   * @returns
   */
  @Post('/')
  @SuccessResponse(httpStatuses.created.code, httpStatuses.created.message)
  public async createRole(
    @Body() requestBody: RoleCreationRequestType
  ): Promise<Role[]> {
    try {
      return await roleService.createRole(requestBody);
    } catch (err) {
      this.log.error(`Route /role POST with err: ${err}`);
      throw err;
    }
  }

  @Put('/{roleId}')
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async updateRole(
    roleId: RoleInterface['id'],
    @Body() requestBody: RoleCreationRequestType
  ): Promise<Role> {
    try {
      return await roleService.updateRole(roleId, requestBody);
    } catch (err) {
      this.log.error(`Route /role POST with err: ${err}`);
      throw err;
    }
  }

  @Get('/business/{business}')
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async listRoles(business: string): Promise<Role[]> {
    try {
      return await roleService.listRoles(business);
    } catch (err) {
      this.log.error(`Route /role POST with err: ${err}`);
      throw err;
    }
  }

  @Get('{roleIdentifier}/business/{businessId}')
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async findRole(
    businessId: RoleInterface['businessId'],
    roleIdentifier: string
  ): Promise<Role> {
    try {
      return await roleService.findRole(businessId, roleIdentifier);
    } catch (err) {
      this.log.error(`Failed to find role with id: ${roleIdentifier}`, err);
      throw err;
    }
  }

  @Delete('{roleId}/business/{businessId}')
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async deleteRole(
    businessId: RoleInterface['businessId'],
    roleId: RoleInterface['id']
  ): Promise<void> {
    try {
      return await roleService.deleteRole(businessId, roleId);
    } catch (err) {
      this.log.error(`Route /role DELETE with err: ${err}`);
      throw err;
    }
  }

  @Post('/business/{businessId}/add/permissions')
  @SuccessResponse(httpStatuses.created.code, httpStatuses.created.message)
  public async addRoleWithPermissions(
    businessId: RoleInterface['businessId'],
    @Body()
    options: {
      roleId: RolePermissionInterface['roleId'];
      permissions:
        | RolePermissionInterface['permissionId']
        | RolePermissionInterface['permissionId'][];
    }
  ): Promise<Array<RolePermissionInterface>> {
    try {
      return await roleService.addRoleWithPermissions(businessId, options);
    } catch (err) {
      this.log.error(`Route /role POST with err: ${err}`);
      throw err;
    }
  }



  @Post('/business/{businessId}/sync/permissions')
  @SuccessResponse(httpStatuses.created.code, httpStatuses.created.message)
  public async syncRoleWithPermissions(
    businessId: RoleInterface['businessId'],
    @Body()
    options: {
      roleId: RolePermissionInterface['roleId'];
      permissions:
        | RolePermissionInterface['permissionId']
        | RolePermissionInterface['permissionId'][];
    }
  ): Promise<Array<RolePermissionInterface>> {
    try {
      return await roleService.syncRoleWithPermissions(businessId, options);
    } catch (err) {
      this.log.error(`Route /role POST with err: ${err}`);
      throw err;
    }
  }

  @Post('/business/user-has-role')
  @SuccessResponse(httpStatuses.created.code, httpStatuses.created.message)
  public async businessUserHasRole(
    @Body() payload: BusinessUserRoleCreationType
  ): Promise<boolean> {
    try {
      return roleService.businessUserHasRole(payload);
    } catch (err) {
      this.log.error(`Route /role POST with err: ${err}`);
      throw err;
    }
  }

  @Post('/has-permission')
  @SuccessResponse(httpStatuses.created.code, httpStatuses.created.message)
  public async roleHasPermission(
    @Body() payload: RolePermissionCreationType
  ): Promise<boolean> {
    try {
      return roleService.roleHasPermission(payload);
    } catch (err) {
      this.log.error(`Route /role POST with err: ${err}`);
      throw err;
    }
  }
}
