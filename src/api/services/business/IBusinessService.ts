import {
  BusinessCreationType,
  BusinessInterface,
} from '../../models/business/IBusiness';
import { PlatformInterface } from '../../models/platform/IPlatform';

export interface IBusinessService {
  /**
   * Create Business in a platform
   * @param businessData
   * @param platformSlug
   */
  createBusiness(
    businessData: BusinessCreationType | BusinessCreationType[],
    platformSlug: PlatformInterface['slug']
  ): Promise<Array<BusinessInterface>>;

  /**
   * Find Business in a platform
   * @param slug
   * @param platformSlug
   */
  getBusiness(
    slug: BusinessInterface['slug'],
    platformSlug: PlatformInterface['slug']
  ): Promise<BusinessInterface>;

  /**
   * List all the businesses in a platform
   * @param platformSlug
   */
  listBusiness(
    platformSlug: PlatformInterface['slug']
  ): Promise<Array<BusinessInterface>>;

  /**
   *
   * @param slug
   * @param platformSlug
   */
  deleteBusiness(
    slug: BusinessInterface['slug'],
    platformSlug: PlatformInterface['slug']
  ): Promise<BusinessInterface>;

  /**
   * update business data
   * @param businessData
   * @param slug
   * @param platformSlug
   */
  updateBusiness(
    businessData: BusinessInterface,
    slug: BusinessInterface['slug'],
    platformSlug: PlatformInterface['slug']
  ): Promise<BusinessInterface>;
}
