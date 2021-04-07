import { Optional } from 'sequelize';

export interface RoleInterface {
  id?: number;
  title: string;
  description?: string;
  active: boolean;
  createdAt?: Date,
  updatedAt?: Date;
}

export type RoleCreationType = Optional<RoleInterface, 'id' | 'description' | 'createdAt' | 'updatedAt'>;
