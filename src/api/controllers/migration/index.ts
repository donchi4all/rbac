import {
  Body,
  Controller,
  Post,
  Route,
  Hidden,
  SuccessResponse,
} from 'tsoa';

import httpStatuses from '../../httpStatuses';
import { LoggerDecorator, LoggerInterface } from '../../../modules/logger';

import dbMigrationService from '../../services/db-migration';

@Route('migration')
@Hidden()
export class MigrationController extends Controller {
  //#region FIELDS
  @LoggerDecorator('Controller.Migration')
  private log: LoggerInterface;
  //#endregion

  //#region "/migration" ENDPOINT
  @Post('/migration')
  @SuccessResponse(httpStatuses.created.code, httpStatuses.created.message)
  public async createMigration(
    @Body() requestBody: { name: string }
  ): Promise<{ msg: string }> {
    try {
      return dbMigrationService.createNewMigration(requestBody.name);
    } catch (err) {
      this.log.error(`Route /migration POST with err: ${err}`);
      throw err;
    }
  }
  //#endregion
}