export interface RolePrivilegeInterface {
  id: number;
  roleId: number;
  permissionId: number;
  grantId: number;
  grantTypeId: number;
  createdAt: Date;
  updatedAt: Date;
}

export type RolePrivilegeCreationType =
  Pick<RolePrivilegeInterface, 'roleId' | 'permissionId' | 'grantId' | 'grantTypeId'>;
