import {Permission} from '../permission';

export interface BusinessUserRoleInterface {
  id?: number;
  userId: string;
  businessId: string;
  roleId: number;
  status: `${BusinessUserRoleStatus}`;
  createdAt?: Date;
  updatedAt?: Date;
  permissions?:Permission[]
}

export enum BusinessUserRoleStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
}

export type BusinessUserRoleCreationType = Pick<BusinessUserRoleInterface, 'userId'|'businessId'> & {role: string}