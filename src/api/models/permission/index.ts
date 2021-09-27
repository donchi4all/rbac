import { Table, AutoIncrement, PrimaryKey, Column, Model, AllowNull, CreatedAt, UpdatedAt, DataType, BelongsToMany } from 'sequelize-typescript';

import { Role, RolePermission } from '..';
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

  @BelongsToMany(() => Role, () => RolePermission)
  roles: Role[]

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