import { Op } from 'sequelize';
import { Permission } from '../../models';
import {
  PermissionCreationRequestType,
  PermissionEditRequestType,
  PermissionInterface,
} from '../../models/permission/IPermission';
import { IPermissionService } from './IPermissionService';
import {
  CommonErrorHandler,
  PermissionErrorHandler,
} from '../../../modules/exceptions';
export { PermissionCreationRequestType, PermissionEditRequestType, Permission };
class PermissionService implements IPermissionService {
  /**
   * Create a new permission for a platform
   *
   * @param payload
   * @returns
   */
  public async createPermission(
    payload: PermissionCreationRequestType | PermissionCreationRequestType[]
  ): Promise<Array<Permission>> {
    try {
      if (!Array.isArray(payload)) {
        payload = [payload];
      }

      const permissions = Promise.all(
        payload.map(async (payload) => {
          const [title, slug] = Array(2).fill(payload.title);
          return await Permission.create({ ...payload, title, slug });
        })
      );

      return permissions;
    } catch (err) {
      throw new PermissionErrorHandler(PermissionErrorHandler.FailedToCreate);
    }
  }

  /**
   * Update an existing permission
   *
   * @param permissionId
   * @param payload
   * @returns
   */
  public async updatePermission(
    permissionId: string,
    payload: PermissionEditRequestType
  ): Promise<Permission> {
    try {
      const beneficiary = await Permission.findOne({
        where: { id: permissionId },
      });

      if (!beneficiary) {
        return Promise.reject(
          new PermissionErrorHandler(PermissionErrorHandler.NotExist)
        );
      }

      const [title, slug] = Array(2).fill(payload.title);
      await beneficiary.update({ ...beneficiary, title, slug });

      return beneficiary;
    } catch (err) {
      throw err;
    }
  }

  /**
   * List all permissions tied to a business
   *
   * @returns
   */
  public async listPermissions(platformId: number): Promise<Array<Permission>> {
    try {
      return await Permission.findAll({
        // where: { platformId }
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   * Find an existing permission
   *
   * @param identifier
   * @returns
   */
  public async findPermission(identifier: string): Promise<Permission> {
    try {
      const beneficiary = await Permission.findOne({
        where: {
          [Op.or]: [{ slug: identifier }, { title: identifier }],
        },
      });

      if (!beneficiary) {
        return Promise.reject(
          new PermissionErrorHandler(PermissionErrorHandler.NotExist)
        );
      }

      return beneficiary;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Delete an existing permission
   *
   * @param identifier
   * @returns
   */
  public async deletePermission(identifier: string): Promise<void> {
    try {
      const permission = await this.findPermission(identifier);
      await permission.destroy();

      return;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Find Permission By ID
   *
   * @param platformId
   * @param permissionId
   * @param rejectIfNotFound
   */
  public async findPermissionById(
    platformId: PermissionInterface['platformId'],
    permissionId: PermissionInterface['id'],
    rejectIfNotFound: boolean = true
  ): Promise<Permission> {
    try {
      const permission = await Permission.findOne({
        where: {
          id: permissionId,
          platformId: platformId,
        },
      });
      if (!permission && rejectIfNotFound) {
        return Promise.reject(
          new PermissionErrorHandler(
            PermissionErrorHandler.PermissionDoNotExist
          )
        );
      }
      return permission;
    } catch (e) {
      throw new PermissionErrorHandler(CommonErrorHandler.Fatal);
    }
  }
}

const permissionService = new PermissionService();
export default permissionService;
