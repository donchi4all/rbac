import { Optional } from 'sequelize';

export interface RolePrivilegeInterface {
  id?: number;
  idRole: number;
  idPermission: number;
  idGrant: number;
  idGrantType: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type RolePrivilegeCreationType = Optional<RolePrivilegeInterface, 'id' | 'createdAt' | 'updatedAt'>;
