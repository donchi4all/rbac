import {
  Controller,
  Get,
  Route,
  SuccessResponse,
  Post,
  Body,
  Patch,
  Delete,
} from 'tsoa';

import httpStatuses from '../../httpStatuses';
import { LoggerDecorator, LoggerInterface } from '../../../modules/logger';
import businessService, {
  BusinessCreationType,
  BusinessInterface,
  PlatformInterface,
} from '../../services/business';

@Route('platform')
export class BusinessController extends Controller {
  //#region FIELDS
  @LoggerDecorator('Controller.platform')
  private log: LoggerInterface;
  //#endregion

  //#region "/" ENDPOINTS
  @Get('{platformSlug}/business')
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async listBusiness(
    platformSlug: PlatformInterface['slug']
  ): Promise<Array<BusinessInterface>> {
    try {
      this.log.info('Route /platform GET all platform');
      return businessService.listBusiness(platformSlug);
    } catch (err) {
      this.log.error(`Route /platform GET with err: ${err}`);
      throw err;
    }
  }

  @Get('{platformSlug}/business/{businessSlug}')
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async getPBusiness(
    platformSlug: PlatformInterface['slug'],
    businessSlug: BusinessInterface['slug']
  ): Promise<BusinessInterface> {
    try {
      this.log.info(
        `Route /business/${platformSlug}/${businessSlug} GET all business in a platform`
      );
      return businessService.getBusiness(businessSlug, platformSlug);
    } catch (err) {
      this.log.error(
        `Route /platform/${platformSlug}/${businessSlug}  GET with err: ${err}`
      );
      throw err;
    }
  }

  @Post('{platformSlug}/business')
  @SuccessResponse(httpStatuses.created.code, httpStatuses.created.message)
  public async createBusiness(
    platformSlug: PlatformInterface['slug'],
    @Body() data: BusinessCreationType | BusinessCreationType[]
  ): Promise<Array<BusinessInterface>> {
    try {
      this.log.info(
        `Route /business POST business data: ${JSON.stringify(data)}`
      );
      return businessService.createBusiness(data, platformSlug);
    } catch (err) {
      this.log.error(`Route /business POST business err: ${err}`);
      throw err;
    }
  }

  @Patch('{platformSlug}/business/{businessSlug}')
  @SuccessResponse(httpStatuses.created.code, httpStatuses.created.message)
  public async updateBusiness(
    platformSlug: PlatformInterface['slug'],
    businessSlug: BusinessInterface['slug'],
    @Body() data: BusinessCreationType
  ): Promise<BusinessInterface> {
    try {
      this.log.info(
        `Route /business Patch business with data: ${JSON.stringify(data)}`
      );
      return businessService.updateBusiness(data, businessSlug, platformSlug);
    } catch (err) {
      this.log.error(`Route /business Patch with err: ${err}`);
      throw err;
    }
  }

  @Delete('{platformSlug}/business/{businessSlug}')
  @SuccessResponse(httpStatuses.created.code, httpStatuses.created.message)
  public async deleteBusiness(
    platformSlug: PlatformInterface['slug'],
    businessSlug: BusinessInterface['slug']
  ): Promise<BusinessInterface> {
    try {
      this.log.info(
        `Route /business delete business with slug: ${JSON.stringify([
          businessSlug,
          platformSlug,
        ])}`
      );
      return businessService.deleteBusiness(businessSlug, platformSlug);
    } catch (err) {
      this.log.error(`Route /business delete with err: ${err}`);
      throw err;
    }
  }
}
