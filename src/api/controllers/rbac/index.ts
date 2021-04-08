import {
  Body,
  Controller,
  Get,
  Query,
  Post,
  Route,
  SuccessResponse,
} from 'tsoa';

import httpStatuses from '../../httpStatuses';
import { LoggerDecorator, LoggerInterface } from '../../../modules/logger';
import Test from '../../services/test';

@Route('rbac')
export class TestController extends Controller {
  @LoggerDecorator('Controller.Rbac')
  private log: LoggerInterface;

  @Get()
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async getRolePrivileges(
    @Query() roleId: number
  ): Promise<unknown> {
    try {
      this.log.info(`Route /rbac GET role privileges with user ID: ${roleId}`);

      // TEMPORARY
      const test = new Test();
      const q = await test.getRoles(roleId);

      return q;
    } catch (err) {
      this.log.error(`Route /rbac GET with err: ${err}`);
      throw err;
    }
  }

  @Post('/migration')
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async createMigration(
    @Body() requestBody: { name: string }
  ): Promise<{ msg: string }> {
    try {

      // TEMPORARY
      const test = new Test();
      return test.createNewMigration(requestBody.name);
    } catch (err) {
      this.log.error(`Route /rbac/migration POST with err: ${err}`);
      throw err;
    }
  }

  @Post('/insert')
  @SuccessResponse(httpStatuses.created.code, httpStatuses.created.message)
  public async insertDataToTables(): Promise<{ success: string }> {
    try {
      this.setStatus(httpStatuses.created.code);

      // TEMPORARY
      const test = new Test();
      await test.addValuesToGrantTable();
      await test.addValuesToGrantTypeTable();
      await test.addValuesToPermissionTable();
      await test.addValuesToRoleTable();
      await test.addValuesToRolePrivilegeTable();

      return { success: 'SUCCESS' };
    } catch (err) {
      this.log.error(`Route /rbac/insert POST with err: ${err}`);
      throw err;
    }
  }
}