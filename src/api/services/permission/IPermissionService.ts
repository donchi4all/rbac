import { Permission } from "../../../api/models";
import { 
    PermissionInterface,
    PermissionEditRequestType,
    PermissionCreationRequestType 
} from "../../../api/models/permission/IPermission";

export interface IPermissionService {
    /**
     * Create a new permission for a platform
     * 
     * @param payload 
     * @returns 
     */
    createPermission (
        payload: PermissionCreationRequestType|PermissionCreationRequestType[]
    ):  Promise<Array<Permission>>

    /**
     * Update an existing permission
     * 
     * @param permissionId 
     * @param payload 
     * @returns 
     */
    updatePermission (
        permissionId: string, 
        payload: PermissionEditRequestType
    ):  Promise<Permission>

    /**
     * List all permissions tied to a business
     * 
     * @returns 
     */
    listPermissions (
        platformId: PermissionInterface['platformId']
    ):  Promise<Array<Permission>>

    /**
     * Find an existing permission
     * 
     * @param identifier 
     * @returns 
     */
     findPermission(platformId: number, identifier: string): Promise<Permission>

    /**
     * Delete an existing permission
     * 
     * @param identifier 
     * @returns 
     */
    deletePermission (platformId:number,identifier: string): Promise<void>
}