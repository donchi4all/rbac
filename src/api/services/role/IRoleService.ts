import { Role } from "../../models";
import { 
    RoleInterface,
    RoleCreationType,
    RoleEditRequestType,
    RoleCreationRequestType
} from "../../models/role/IRole";

export interface IRoleService {
    /**
     * Creates a new role
     * 
     * @param payload 
     * @returns 
     */
    createRole (
        payload: RoleCreationRequestType|RoleCreationRequestType[]
    ):  Promise<Array<Role>>

    /**
     * Sudo Implementation for model findOrCreate (WIP)
     * 
     * @param searchParams 
     * @param payload 
     * @returns 
     */
    findOrCreate? (
        searchParams: Array<string>, payload: RoleCreationType
    ):  Promise<Role>

    /**
     * Update an existing worklfow
     * 
     * @param roleId 
     * @param payload 
     * @returns 
     */
    updateRole (
        roleId: string, 
        payload: RoleEditRequestType
    ):  Promise<Role>

    /**
     * Fetch list of roles
     * 
     * @returns 
     */
    listRoles (businessId: RoleInterface['businessId']): Promise<Array<Role>>

    /**
     * Find an existing role
     * 
     * @param identifier 
     * @returns 
     */
    findRole (identifier: string): Promise<Role>

    /**
     * Delete an existing role
     * 
     * @param roleId 
     * @returns 
     */
    deleteRole (roleId: string): Promise<void>
}