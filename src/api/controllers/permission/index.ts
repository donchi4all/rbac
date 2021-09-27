import {
  Get,
  Put,
  Body,
  Post,
  Route,
  Hidden,
  Delete,
  Controller,
  SuccessResponse, Tags,
} from 'tsoa';

import httpStatuses from '../../httpStatuses';
import permissionService, {
  Permission,
  PermissionCreationRequestType,
  PermissionEditRequestType,
} from '../../services/permission';
import { LoggerDecorator, LoggerInterface } from '../../../modules/logger';

@Route('permission')
@Tags('Permission')
export class permissionController extends Controller {
  /**
   * Initialize logger
   */
  @LoggerDecorator('Controller.Permission')
  private log: LoggerInterface;

  /**
   * Permission Creation endpoint
   *
   * @param requestBody
   * @returns
   */
  @Post('/')
  @SuccessResponse(httpStatuses.created.code, httpStatuses.created.message)
  public async createPermission(
    @Body()
    requestBody: PermissionCreationRequestType | PermissionCreationRequestType[]
  ): Promise<Permission[]> {
    try {
      return permissionService.createPermission(requestBody);
    } catch (err) {
      this.log.error(`Route /permission POST with err: ${err}`);
      throw err;
    }
  }

  @Put('/{permission}')
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async updatePermission(
    permission: string,
    @Body() requestBody: PermissionEditRequestType
  ): Promise<Permission> {
    try {
      return permissionService.updatePermission(permission, requestBody);
    } catch (err) {
      this.log.error(`Route /permission POST with err: ${err}`);
      throw err;
    }
  }

  @Get('/platform/{platform}')
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async listPermissions(platform: number): Promise<Array<Permission>> {
    try {
      return permissionService.listPermissions(platform);
    } catch (err) {
      this.log.error(`Route /permission POST with err: ${err}`);
      throw err;
    }
  }

  @Get('/{permissionIdentifier}/platform/{platformId}')
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async findPermission(
   platformId: number, permissionIdentifier: string
  ): Promise<Permission> {
    try {
      return await permissionService.findPermission(platformId,permissionIdentifier);
    } catch (err) {
      this.log.error(
        `Failed to find beneficiary with permissionIdentifier: ${permissionIdentifier}`,
        err
      );
      throw err;
    }
  }

  @Delete('/{permission}/platform/{platformId}')
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async deletePermission(platformId: number,permission: string): Promise<void> {
    try {
      return permissionService.deletePermission(platformId,permission);
    } catch (err) {
      this.log.error(`Route /permission DELETE with err: ${err}`);
      throw err;
    }
  }
}
