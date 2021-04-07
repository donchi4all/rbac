import { Optional } from 'sequelize';

export interface PermissionInterface {
  id?: number;
  title: string;
  description?: string;
  active: boolean;
  createdAt?: Date,
  updatedAt?: Date;
}

export type PermissionCreationType = Optional<PermissionInterface, 'id' | 'description' | 'createdAt' | 'updatedAt'>;
