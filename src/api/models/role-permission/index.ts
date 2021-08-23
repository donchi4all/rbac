import { Table, AutoIncrement, PrimaryKey, Column, Model, DataType } from 'sequelize-typescript';
import { RolePermissionInterface } from './IRolePermission';

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

  @Column(DataType.INTEGER)
  roleId: RolePermissionInterface['roleId'];

  @Column(DataType.INTEGER)
  permissionId: RolePermissionInterface['permissionId'];
}
