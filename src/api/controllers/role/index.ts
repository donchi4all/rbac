import {
  Get,
  Put,
  Body,
  Post,
  Route,
  Hidden,
  Delete,
  Controller,
  SuccessResponse,
} from 'tsoa';

import httpStatuses from '../../httpStatuses';
import roleService, {RolePermissionInterface} from '../../services/role';
import { Role } from '../../../api/models';
import {RoleCreationRequestType, RoleInterface} from '../../../api/models/role/IRole';
import { LoggerDecorator, LoggerInterface } from '../../../modules/logger';


@Route('{business}/role')
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

  @Put('/')
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async updateRole(
    @Body() requestBody: RoleCreationRequestType
  ): Promise<Role> {
    try {
      return await roleService.updateRole(requestBody.title, requestBody);
    } catch (err) {
      this.log.error(`Route /role POST with err: ${err}`);
      throw err;
    }
  }

  @Get('/')
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async listRoles(business: string): Promise<Role[]> {
    try {
      return await roleService.listRoles(business);
    } catch (err) {
      this.log.error(`Route /role POST with err: ${err}`);
      throw err;
    }
  }

  @Get('{roleIdentifier}')
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async findRole ( roleIdentifier: string ): Promise<Role> {
    try{
      return await roleService.findRole(roleIdentifier);
    } catch (err) {
      this.log.error(`Failed to find role with id: ${roleIdentifier}`, err);
      throw err;
    }
  }

  @Delete('{roleIdentifier}')
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async deleteRole(roleIdentifier: string): Promise<void> {
    try {
      return await roleService.deleteRole(roleIdentifier);
    } catch (err) {
      this.log.error(`Route /role DELETE with err: ${err}`);
      throw err;
    }
  }

  @Post('/{businessId}/sync/permissions')
  @SuccessResponse(httpStatuses.created.code, httpStatuses.created.message)
  public async syncRoleWithPermissions(
      businessId : RoleInterface['businessId'],
     @Body() options : {
        roleId: RolePermissionInterface['roleId'],
        permissions: RolePermissionInterface['permissionId'] | RolePermissionInterface['permissionId'][]
      }
  ): Promise<Array<RolePermissionInterface>> {
    try {
      return await roleService.syncRoleWithPermissions(businessId,options);
    } catch (err) {
      this.log.error(`Route /role POST with err: ${err}`);
      throw err;
    }
  }
}