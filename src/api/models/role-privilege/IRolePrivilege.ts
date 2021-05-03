export interface RolePrivilegeInterface {
  id: number;
  idRole: number;
  idPermission: number;
  idGrant: number;
  idGrantType: number;
  createdAt: Date;
  updatedAt: Date;
}

export type RolePrivilegeCreationType =
  Pick<RolePrivilegeInterface, 'idRole' | 'idPermission' | 'idGrant' | 'idGrantType'>;
