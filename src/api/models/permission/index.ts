import { Table, AutoIncrement, PrimaryKey, Column, Model, AllowNull, CreatedAt, UpdatedAt, DataType } from 'sequelize-typescript';
import { PermissionInterface, PermissionCreationType } from './IPermission';

@Table({
  tableName: 'permission',
})
export class Permission extends Model<PermissionInterface, PermissionCreationType> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: PermissionInterface['id'];

  @Column(DataType.INTEGER)
  platformId: PermissionInterface['platformId'];

  @Column(DataType.STRING)
  title: PermissionInterface['title'];

  @AllowNull
  @Column(DataType.STRING)
  description: PermissionInterface['description'];

  @Column(DataType.BOOLEAN)
  isActive: PermissionInterface['isActive'];

  @CreatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  createdAt!: PermissionInterface['createdAt'];

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  updatedAt!: PermissionInterface['updatedAt'];
}