import { IBusinessService } from './IBusinessService';
import {
  BusinessCreationType,
  BusinessInterface,
} from '../../models/business/IBusiness';
import platformService, { PlatformInterface } from '../../services/platform';
import { Business, Platform } from '../../models';
import { Op } from 'sequelize';
import {
  BusinessErrorHandler,
  CommonErrorHandler,
} from '../../../modules/exceptions';

export { BusinessInterface, PlatformInterface, BusinessCreationType };

class BusinessService implements IBusinessService {
  /**
   * Find business
   * @param platformId
   * @param value
   * @param rejectIfNotFound
   */
  async findBusiness(
    platformId: PlatformInterface['id'],
    value: string,
    rejectIfNotFound: boolean = true
  ): Promise<Business> {
    try {
      const business = await Business.findOne({
        where: {
          [Op.or]: [{ slug: value }, { name: value }],
          [Op.and]: [{ platformId }],
        },
      });

      if (!business && rejectIfNotFound) {
        return Promise.reject(
          new BusinessErrorHandler(BusinessErrorHandler.DoesNotExist)
        );
      }
      return business;
    } catch (err) {
      throw new BusinessErrorHandler(CommonErrorHandler.Fatal);
    }
  }

  /**
   * Create Business in a platform
   * @param businessData
   * @param platformSlug
   */
  public async createBusiness(
    businessData: BusinessCreationType | BusinessCreationType[],
    platformSlug: PlatformInterface['slug']
  ): Promise<Array<BusinessInterface>> {
    const platform = await platformService.findPlatform(platformSlug);

    if (!Array.isArray(businessData)) {
      businessData = [businessData];
    }
    return Promise.all(
      businessData.map(async (payload) => {
        const platformId = platform.id;
        const business = await this.findBusiness(
          platform.id,
          payload.name,
          false
        );
        if (business) {
          throw new BusinessErrorHandler(BusinessErrorHandler.AlreadyExists);
        }
        const [name, slug] = Array(2).fill(payload.name);
        return await Business.create({ ...payload, name, slug, platformId });
      })
    );
  }

  /**
   *
   * @param slug
   * @param platformSlug
   */
  public async deleteBusiness(
    slug: BusinessInterface['slug'],
    platformSlug: PlatformInterface['slug']
  ): Promise<BusinessInterface> {
    const platform = await platformService.findPlatform(platformSlug);
    const business = await this.findBusiness(platform.id, slug);
    if (!business.isActive) {
      throw new BusinessErrorHandler(BusinessErrorHandler.Forbidden);
    }
    await business.destroy();
    return business.get();
  }

  /**
   * Find Business in a platform
   * @param slug
   * @param platformSlug
   */
  public async getBusiness(
    slug: BusinessInterface['slug'],
    platformSlug: PlatformInterface['slug']
  ): Promise<BusinessInterface> {
    const platform = await platformService.findPlatform(platformSlug);
    return await this.findBusiness(platform.id, slug);
  }

  /**
   * List all the businesses in a platform
   * @param platformSlug
   */
  public async listBusiness(
    platformSlug: PlatformInterface['slug']
  ): Promise<Array<BusinessInterface>> {
    try {
      const business = await Business.findAll({
        include: [
          {
            model: Platform,
            attributes: ['name', 'slug', 'description'],
            where: { isActive: true },
          },
        ],
      });
      return business as Array<BusinessInterface>;
    } catch (err) {
      throw err;
    }
  }

  /**
   * update business data
   * @param businessData
   * @param _slug
   * @param platformSlug
   */
  public async updateBusiness(
    businessData: BusinessCreationType,
    _slug: BusinessInterface['slug'],
    platformSlug: PlatformInterface['slug']
  ): Promise<BusinessInterface> {
    const platform = await platformService.findPlatform(platformSlug);
    const business = await this.findBusiness(platform.id, _slug, false);
    if (!business) {
      throw new BusinessErrorHandler(BusinessErrorHandler.DoesNotExist);
    }

    const [name, slug] = Array(2).fill(businessData.name);
    await business.update({
      ...businessData,
      name,
      slug,
    });
    return business.get();
  }
}

const businessService = new BusinessService();
export default businessService;
