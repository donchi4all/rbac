export interface BusinessUserRoleInterface {
  id?: number;
  userId: string;
  businessId: string;
  roleId: number;
  status: `${BusinessUserRoleStatus}`;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum BusinessUserRoleStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
}

export type BusinessUserRoleCreationType = Pick<BusinessUserRoleInterface, 'userId'|'businessId'|'roleId'>