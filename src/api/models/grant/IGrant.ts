import { Optional } from 'sequelize';

export interface GrantInterface {
  id?: number;
  title: string;
  description?: string;
  active: boolean;
  createdAt?: Date,
  updatedAt?: Date;
}

export type GrantCreationType = Optional<GrantInterface, 'id' | 'description' | 'createdAt' | 'updatedAt'>;
