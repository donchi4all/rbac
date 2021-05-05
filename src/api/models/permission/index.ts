import { Table, AutoIncrement, PrimaryKey, Column, Model, AllowNull, CreatedAt, UpdatedAt, DataType } from 'sequelize-typescript';
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

  @Column({
    type: DataType.STRING(255),
    defaultValue: '',
  })
  description: string;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  active: boolean;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  createdAt!: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  updatedAt!: Date;
}