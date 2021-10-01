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
import platformService from '../../../api/services/platform';
import { LoggerDecorator, LoggerInterface } from '../../../modules/logger';
import { BusinessUserRoleCreationType } from '../../models/business-user-role/IBusinessUserRole';
import { AddPermissionToRoleType, RolePermissionCreationType } from '../../models/role-permission/IRolePermission';

@Route('platform/{platformSlug}/business/{business}/roles')
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
    platformSlug: string,
    business: string,
    @Body() requestBody: RoleCreationRequestType
  ): Promise<Role[]> {
    try {
      return await roleService.createRole(business, requestBody);
    } catch (err) {
      this.log.error(`Route /role POST with err: ${err}`);
      throw err;
    }
  }

  @Put('/{roleId}')
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async updateRole(
    platformSlug: string,
    business: string,
    roleId: RoleInterface['id'],
    @Body() requestBody: RoleCreationRequestType
  ): Promise<Role> {
    try {
      return await roleService.updateRole(business, roleId, requestBody);
    } catch (err) {
      this.log.error(`Route /role POST with err: ${err}`);
      throw err;
    }
  }

  @Get('/')
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async listRoles(
    platformSlug: string,
    business: string
  ): Promise<Role[]> {
    try {
      return await roleService.listRoles(business);
    } catch (err) {
      this.log.error(`Route /role POST with err: ${err}`);
      throw err;
    }
  }

  @Get('{roleIdentifier}')
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async findRole(
    business: RoleInterface['businessId'],
    roleIdentifier: string
  ): Promise<Role> {
    try {
      return await roleService.findRole(business, roleIdentifier);
    } catch (err) {
      this.log.error(`Failed to find role with id: ${roleIdentifier}`, err);
      throw err;
    }
  }

  @Delete('{roleId}')
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async deleteRole(
    business: RoleInterface['businessId'],
    roleId: RoleInterface['id']
  ): Promise<void> {
    try {
      return await roleService.deleteRole(business, roleId);
    } catch (err) {
      this.log.error(`Route /role DELETE with err: ${err}`);
      throw err;
    }
  }

  @Post('add-permissions')
  @SuccessResponse(httpStatuses.created.code, httpStatuses.created.message)
  public async addRoleWithPermissions(
    platformSlug: string,
    business: RoleInterface['businessId'],
    @Body() options: AddPermissionToRoleType
  ): Promise<Array<RolePermissionInterface>> {
    try {
      const platform = await platformService.findPlatform(platformSlug)
      return await roleService.addRoleWithPermissions(platform.id, business, options);
    } catch (err) {
      this.log.error(`Route /role POST with err: ${err}`);
      throw err;
    }
  }

  @Post('sync-permissions')
  @SuccessResponse(httpStatuses.created.code, httpStatuses.created.message)
  public async syncRoleWithPermissions(
    platformSlug: string,
    business: RoleInterface['businessId'],
    @Body()
    options: AddPermissionToRoleType
  ): Promise<Array<RolePermissionInterface>> {
    try {
      const platform = await platformService.findPlatform(platformSlug);
      return await roleService.syncRoleWithPermissions(platform.id, business, options);
    } catch (err) {
      console.log(err)
      this.log.error(`Route /role POST with err: ${err}`);
      throw err;
    }
  }

  @Post('user-has-role')
  @SuccessResponse(httpStatuses.created.code, httpStatuses.created.message)
  public async businessUserHasRole(
    platformSlug: string,
    @Body() payload: BusinessUserRoleCreationType
  ): Promise<boolean> {
    try {
      return roleService.businessUserHasRole(payload);
    } catch (err) {
      this.log.error(`Route /role POST with err: ${err}`);
      throw err;
    }
  }

  @Post('/role-has-permission')
  @SuccessResponse(httpStatuses.created.code, httpStatuses.created.message)
  public async roleHasPermission(
    platformSlug: string,
    business: RoleInterface['businessId'],
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
