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

@Route('test')
export class TestController extends Controller {
  @LoggerDecorator('Controller.Test')
  private log: LoggerInterface;

  @Get()
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async getTest(
    @Query() id: number
  ): Promise<unknown> {
    try {
      this.log.info(`Route /test GET with data: ${id}`);
      return { test: 'Test route', id };
    } catch (err) {
      console.log('Test route: ', err);
      this.log.error(`Route /test GET with err: ${err}`);
    }
  }

  @Post()
  @SuccessResponse(httpStatuses.created.code, httpStatuses.created.message)
  public async createTest(
    @Body() requestBody: unknown
  ): Promise<unknown> {
    try {
      this.setStatus(httpStatuses.created.code);

      // TEMPORARY
      const test = new Test();
      test.addTestValueToGrantTable();

      this.log.info(`Route /test POST with data: ${requestBody}`);
      return { body: requestBody };
    } catch (err) {
      console.log('Test route: ', err);
      this.log.error(`Route /test POST with err: ${err}`);
    }
  }
}