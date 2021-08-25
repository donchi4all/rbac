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
import roleService from '../../services/role';
import { Role } from '../../../api/models';
import { RoleCreationRequestType } from '../../../api/models/role/IRole';
import { LoggerDecorator, LoggerInterface } from '../../../modules/logger';


@Route('role')
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
  public async listRoles(
    @Body() requestBody: { title: string }
  ): Promise<Role[]> {
    try {
      return await roleService.listRoles(requestBody.title);
    } catch (err) {
      this.log.error(`Route /role POST with err: ${err}`);
      throw err;
    }
  }

  @Get('{id}')
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async findRole ( id: string ): Promise<Role> {
    try{
      return await roleService.findRole(id);
    } catch (err) {
      this.log.error(`Failed to find beneficiary with id: ${id}`, err);
      throw err;
    }
  }

  @Delete('/')
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async deleteRole(
    @Body() requestBody: { title: string }
  ): Promise<void> {
    try {
      return await roleService.deleteRole(requestBody.title);
    } catch (err) {
      this.log.error(`Route /role DELETE with err: ${err}`);
      throw err;
    }
  }
}