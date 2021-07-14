import { Table, AutoIncrement, PrimaryKey, Column, Model, DataType, AllowNull } from 'sequelize-typescript';
import { EntityInterface } from './IEntity';

@Table({
  tableName: 'entity',
  createdAt: false,
  updatedAt: false,
})
export class Entity extends Model<EntityInterface> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  entityId: number;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  entityType: string;
}
