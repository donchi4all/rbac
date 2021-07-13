import { Table, AutoIncrement, PrimaryKey, Column, AllowNull, CreatedAt, UpdatedAt, DataType, Model, BelongsTo } from 'sequelize-typescript';
import { RolePrivilegeInterface, RolePrivilegeCreationType } from './IRolePrivilege';
import * as Models from '../index';

@Table({
  tableName: 'rolePrivilege',
})
export class RolePrivilege extends Model<RolePrivilegeInterface, RolePrivilegeCreationType> {
  [x: string]: any;
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @BelongsTo(() => Models.Role, {
    foreignKey: 'roleId',
    as: 'fkRoleId',
    foreignKeyConstraint: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @AllowNull(false)
  @Column(DataType.INTEGER)
  roleId: number;

  @BelongsTo(() => Models.Permission, {
    foreignKey: 'permissionId',
    as: 'fkPermissionId',
    foreignKeyConstraint: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @AllowNull(false)
  @Column(DataType.INTEGER)
  permissionId: number;

  @BelongsTo(() => Models.Grant, {
    foreignKey: 'grantId',
    as: 'fkGrantId',
    foreignKeyConstraint: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @AllowNull(false)
  @Column(DataType.INTEGER)
  grantId: number;

  @BelongsTo(() => Models.GrantType, {
    foreignKey: 'grantTypeId',
    as: 'fkGrantTypeId',
    foreignKeyConstraint: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @AllowNull(false)
  @Column(DataType.INTEGER)
  grantTypeId: number;

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
