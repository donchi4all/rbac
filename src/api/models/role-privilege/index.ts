import { Table, AutoIncrement, PrimaryKey, Default, Column, AllowNull, CreatedAt, UpdatedAt, DataType, Model, ForeignKey } from 'sequelize-typescript';
import { RolePrivilegeInterface, RolePrivilegeCreationType } from './IRolePrivilege';
import * as Models from '../index';

@Table
export class RolePrivilege extends Model<RolePrivilegeInterface, RolePrivilegeCreationType> {
  @PrimaryKey
  @AutoIncrement
  @Default(0)
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Models.Role)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  idRole: number;

  @ForeignKey(() => Models.Permission)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  idPermission: number;

  @ForeignKey(() => Models.Grant)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  idGrant: number;

  @ForeignKey(() => Models.GrantType)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  idGrantType: number;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;
}