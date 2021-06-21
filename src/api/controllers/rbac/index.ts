import {
  Body,
  Controller,
  Query,
  Get,
  Post,
  Patch,
  Delete,
  Route,
  SuccessResponse,
  Hidden,
} from 'tsoa';

import httpStatuses from '../../httpStatuses';
import { LoggerDecorator, LoggerInterface } from '../../../modules/logger';

import
  rbacService,
  {
    RoleInterface,
    GrantInterface,
    PermissionInterface,
    PermissionsAndGrantsCreationParams,
    PermissionsAndGrantsSetParams,
    // RolePrivilegeType,
  }
from '../../services/rbac';


@Route('rbac')
export class RbacController extends Controller {
  //#region FIELDS
  @LoggerDecorator('Controller.Rbac')
  private log: LoggerInterface;
  //#endregion

  //#region "/" ENDPOINTS
  @Get()
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async readRolePrivileges (
    @Query() roleId: number
  ): Promise<unknown> {
    try {
      this.log.info(`Route /rbac GET role privileges with role ID: ${roleId}`);
      return await rbacService.getPermissionsByRoleId(roleId);
    } catch (err) {
      this.log.error(`Route /rbac GET with err: ${err}`);
      throw err;
    }
  }

  @Post()
  @SuccessResponse(httpStatuses.created.code, httpStatuses.created.message)
  public async addRoleAndPrivileges (
    @Body() data: PermissionsAndGrantsCreationParams,
  ): Promise<number> {
    try {
      this.log.info(`Route /rbac POST role privileges with data: ${JSON.stringify(data)}`);
      return await rbacService.addPermissionsGrantsToNewRole(data);
    } catch (err) {
      this.log.error(`Route /rbac PATCH with err: ${err}`);
      throw err;
    }
  }

  @Patch()
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async updateRolePrivileges (
    @Query() roleId: number,
    @Body() data: PermissionsAndGrantsSetParams,
  ): Promise<number> {
    try {
      this.log.info(`Route /rbac PATCH role privileges with role id=${roleId} and data: ${JSON.stringify(data)}`);
      return await rbacService.setPrivilegesByRoleId(roleId, data);
    } catch (err) {
      this.log.error(`Route /rbac PATCH with err: ${err}`);
      throw err;
    }
  }

  @Delete()
  @Hidden()
  @SuccessResponse(httpStatuses.deleted.code, httpStatuses.deleted.message)
  public async deleteRolePrivileges (
    @Query() roleId: number
  ): Promise<void> {
    try {
      this.log.info(`Route /rbac DELETE role privileges with role id=${roleId}`);
      return await rbacService.deleteRoleAndPrivileges(roleId);
    } catch (err) {
      this.log.error(`Route /rbac DELETE with err: ${err}`);
      throw err;
    }
  }
  //#endregion

  //#region "/role" ENDPOINTS
  @Get('/role')
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async getRoles (): Promise<Array<RoleInterface>> {
    try {
      return await rbacService.getRoles();
    } catch (err) {
      this.log.error(`Route /rbac/role GET with err: ${err}`);
      throw err;
    }
  }
  //#endregion

  //#region "/grant" ENDPOINTS
  @Get('/grant')
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async getGrants (): Promise<Array<GrantInterface>> {
    try {
      return await rbacService.getGrants();
    } catch (err) {
      this.log.error(`Route /rbac/grant GET with err: ${err}`);
      throw err;
    }
  }
  //#endregion

  //#region "/permission" ENDPOINTS
  @Get('/permission')
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async getPermissions (): Promise<Array<PermissionInterface>> {
    try {
      return await rbacService.getPermissions();
    } catch (err) {
      this.log.error(`Route /rbac/permission GET with err: ${err}`);
      throw err;
    }
  }
  //#endregion
}