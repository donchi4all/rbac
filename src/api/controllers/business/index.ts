import {
  Controller,
  Get,
  Route,
  SuccessResponse,
  Post,
  Body,
  Patch,
  Delete,
  Tags,
} from 'tsoa';

import httpStatuses from '../../httpStatuses';
import { LoggerDecorator, LoggerInterface } from '../../../modules/logger';
import businessService, {
  BusinessCreationType,
  BusinessInterface,
  BusinessUserRoleCreationType,
  PlatformInterface,
  userHasPermission,
  UserRoleResponse,
  UserRoleSyncType,
} from '../../services/business';
import { BusinessUserRoleInterface } from '../../models/business-user-role/IBusinessUserRole';

@Route('platform')
@Tags('Business')
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

  @Post('{platformSlug}/business/add/user-role')
  @SuccessResponse(httpStatuses.created.code, httpStatuses.created.message)
  public async assignRoleToBusinessUser(
    platformSlug: PlatformInterface['slug'],
    @Body() businessUserRoleData: BusinessUserRoleCreationType
  ): Promise<BusinessUserRoleInterface> {
    try {
      this.log.info(
        `Route /${platformSlug}/business/sync-user-role Post business with data: ${JSON.stringify(
          businessUserRoleData
        )}`
      );
      return businessService.assignRoleToBusinessUser(
        platformSlug,
        businessUserRoleData
      );
    } catch (err) {
      this.log.error(
        `Route /${platformSlug}/business/sync-user-roles Post with err: ${err}`
      );
      throw err;
    }
  }

  @Get('{platformSlug}/business/{businessSlug}/users')
  @SuccessResponse(httpStatuses.created.code, httpStatuses.created.message)
  public async getBusinessWithRoleAndPermissions(
    platformSlug: PlatformInterface['slug'],
    businessSlug: BusinessInterface['slug']
  ): Promise<unknown> {
    try {
      this.log.info(
        `Route /${platformSlug}/business/${businessSlug}/users Get business users and it's role`
      );
      return businessService.getBusinessWithRoleAndPermissions(
        platformSlug,
        businessSlug
      );
    } catch (err) {
      this.log.error(
        `Route /${platformSlug}/business/${businessSlug}/users Get with err: ${err}`
      );
      throw err;
    }
  }

  @Get('business/{businessId}/users/{userId}')
  @SuccessResponse(httpStatuses.created.code, httpStatuses.created.message)
  public async getBusinessUserRole(
    businessId: BusinessUserRoleInterface['businessId'],
    userId: BusinessUserRoleInterface['userId']
  ): Promise<UserRoleResponse> {
    try {
      this.log.info(
        `Route business/${businessId}/users/${userId} Get business users and it's role`
      );
      return businessService.getBusinessUserRole(businessId, userId);
    } catch (err) {
      this.log.error(
        `Route business/${businessId}/users/${userId} Get with err: ${err}`
      );
      throw err;
    }
  }

  @Post('business/users/has-permission')
  @SuccessResponse(httpStatuses.created.code, httpStatuses.created.message)
  public async userHasPermissions(
    @Body() payload : userHasPermission
  ): Promise<boolean> {
    try {
      this.log.info(
        'Route business/users/has-permission Get business users and its role'
      );
      return businessService.userPermissions(payload);
    } catch (err) {
      this.log.error(
        `Route business/users/has-permission Get with err: ${err}`
      );
    }
  }

  @Post('{platformSlug}/business/sync/user-role')
  @SuccessResponse(httpStatuses.created.code, httpStatuses.created.message)
  public async syncUserWithRole(
    platformSlug: PlatformInterface['slug'],
    @Body() payload: UserRoleSyncType
  ): Promise<unknown> {
    try {
      this.log.info(
        `Route /business/sync/user-role Post business with data: ${JSON.stringify(
          payload
        )}`
      );
      return businessService.syncUserWithRole(platformSlug,payload);
    } catch (err) {
      this.log.error(`Route /business/sync/user-role Post with err: ${err}`);
      throw err;
    }
  }
}
