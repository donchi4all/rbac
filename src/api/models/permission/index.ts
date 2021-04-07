import { Table, AutoIncrement, PrimaryKey, Default, Column, Model, AllowNull, CreatedAt, UpdatedAt, DataType } from 'sequelize-typescript';
import { PermissionInterface, PermissionCreationType } from './IPermission';

@Table({
  tableName: 'permission',
})
export class Permission extends Model<PermissionInterface, PermissionCreationType> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  title: string;

  @Default('')
  @Column(DataType.STRING(255))
  description: string;

  @Default(true)
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  active: boolean;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;
}