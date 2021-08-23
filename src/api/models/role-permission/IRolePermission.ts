export interface RolePermissionInterface {
  id: number;
  roleId: number;
  permissionId: number;
}

export type RolePermissionCreationType = Pick<RolePermissionInterface, 'roleId'|'permissionId' >