import { Optional } from 'sequelize';

export interface GrantTypeInterface {
  id?: number;
  name: 'any' | 'own';
}

export type GrantTypeCreationType = Optional<GrantTypeInterface, 'id'>;
