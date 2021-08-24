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
import permissionService from '../../services/permission';
import { LoggerDecorator, LoggerInterface } from '../../../modules/logger';
import { Permission } from 'accesscontrol';


@Route('permission')
@Hidden()
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
    @Body() requestBody: { title: string }
  ): Promise<{ msg: string }> {
    try {
      return permissionService.createPermission(requestBody.title);
    } catch (err) {
      this.log.error(`Route /permission POST with err: ${err}`);
      throw err;
    }
  }

  @Put('/')
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async updatePermission(
    @Body() requestBody: { title: string }
  ): Promise<{ msg: string }> {
    try {
      return permissionService.updatePermission(requestBody.title);
    } catch (err) {
      this.log.error(`Route /permission POST with err: ${err}`);
      throw err;
    }
  }

  @Get('/')
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async listPermissions(
    @Body() requestBody: { title: string }
  ): Promise<{ msg: string }> {
    try {
      return permissionService.listPermissions(requestBody.title);
    } catch (err) {
      this.log.error(`Route /permission POST with err: ${err}`);
      throw err;
    }
  }

  @Get('{id}')
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async findPermission ( id: string ): Promise<Permission> {
    try{
      return await permissionService.findPermission(id);
    } catch (err) {
      this.log.error(`Failed to find beneficiary with id: ${id}`, err);
      throw err;
    }
  }

  @Delete('/')
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async deletePermission(
    @Body() requestBody: { title: string }
  ): Promise<{ msg: string }> {
    try {
      return permissionService.deletePermission(requestBody.title);
    } catch (err) {
      this.log.error(`Route /permission DELETE with err: ${err}`);
      throw err;
    }
  }
}