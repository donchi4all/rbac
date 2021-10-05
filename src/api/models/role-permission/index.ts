import {
  Table,
  AutoIncrement,
  PrimaryKey,
  Column,
  Model,
  DataType,
  HasMany,
  AllowNull,
  ForeignKey,
} from 'sequelize-typescript';
import { RolePermissionInterface } from './IRolePermission';
import { Permission, Role } from '../index';

@Table({
  tableName: 'rolePermission',
  createdAt: false,
  updatedAt: false,
})
export class RolePermission extends Model<RolePermissionInterface> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: RolePermissionInterface['id'];

  @HasMany(() => Permission, {
    sourceKey: 'id',
    foreignKey: 'permissionId',
  })
  permissions: Permission[];

  @AllowNull(false)
  @Column(DataType.INTEGER)
  @ForeignKey(() => Role)
  roleId: RolePermissionInterface['roleId'];

  @AllowNull(false)
  @Column(DataType.INTEGER)
  @ForeignKey(() => Permission)
  permissionId: RolePermissionInterface['permissionId'];
}
