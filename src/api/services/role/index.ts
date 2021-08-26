import { Op } from 'sequelize';
import { Role } from '../../models';
import {
  RoleInterface,
  RoleCreationType, 
  RoleEditRequestType, 
  RoleCreationRequestType
} from '../../models/role/IRole';
import { IRoleService } from './IRoleService';
import { RoleErrorHandler } from '../../../modules/exceptions';

class RoleService implements IRoleService {
  /**
   * Creates a new role
   * 
   * @param payload 
   * @returns 
   */
  public async createRole (
    payload: RoleCreationRequestType|RoleCreationRequestType[]
  ): Promise<Array<Role>> {
    try {
      if( ! Array.isArray(payload) ){
        payload = [payload];
      }

      const role = Promise.all(
        payload.map( async (payload) => {
          const [title, slug] = Array(2).fill(payload.title);
          return await Role.create({ ...payload, title, slug });
        })
      )
      
      return role;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Sudo Implementation for model findOrCreate (WIP)
   * 
   * @param searchParams 
   * @param payload 
   * @returns 
   */
  public async findOrCreate(
    searchParams: Array<string>, payload: RoleCreationType
  ): Promise<Role> {
    const search = searchParams.reduce( (result: {[x: string]: string}, param)=>{
      result[param] = param;

      return result;
    }, {} as {[x: string]: string})

    try{
      Role.findOne({
        where: {
          [Op.or]: search
        }
      })
    }
    catch(err) {
      try{
        return await Role.create(payload);
      }
      catch(err) {
        throw err;
      }
    }
  }

  /**
   * Update an existing worklfow
   * 
   * @param roleId 
   * @param payload 
   * @returns 
   */
  public async updateRole (
    roleId: string, 
    payload: RoleEditRequestType
  ): Promise<Role> {
    try {
      const role = await Role.findOne({ 
        where: { id: roleId } 
      });

      if (!role) {
        return Promise.reject(new RoleErrorHandler(RoleErrorHandler.NotExist));
      }

      const [title, slug] = Array(2).fill(payload.title || role.title);
      await role.update({...role, ...payload, title, slug});

      return role;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Fetch list of roles
   * 
   * @returns 
   */
  public async listRoles (businessId: RoleInterface['businessId']): Promise<Array<Role>> {
    try {
      return await Role.findAll({
        where: { businessId }
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   * Find an existing role
   * 
   * @param identifier 
   * @returns 
   */
  public async findRole (identifier: string): Promise<Role> {
    try {
      const role = await Role.findOne({ 
        where: { 
          [Op.or]: [
            { slug: identifier }, 
            { title: identifier }
          ]
        }
      });

      if (!role) {
        return Promise.reject(new RoleErrorHandler(RoleErrorHandler.NotExist));
      }
      
      return role;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Delete an existing role
   * 
   * @param roleId 
   * @returns 
   */
  public async deleteRole (roleId: string): Promise<void> {
    try {
      const role = await this.findRole(roleId);
      await role.destroy();
      
      return;
    } catch (err) {
      throw err;
    }
  }
}

const roleService = new RoleService();
export default roleService;