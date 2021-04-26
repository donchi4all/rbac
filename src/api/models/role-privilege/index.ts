import { Table, AutoIncrement, PrimaryKey, Column, AllowNull, Default, CreatedAt, UpdatedAt, DataType, Model, BelongsTo } from 'sequelize-typescript';
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
    foreignKey: 'idRole',
    as: 'fkIdRole',
    foreignKeyConstraint: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @AllowNull(false)
  @Column(DataType.INTEGER)
  idRole: number;

  @BelongsTo(() => Models.Permission, {
    foreignKey: 'idPermission',
    as: 'fkIdPermission',
    foreignKeyConstraint: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @AllowNull(false)
  @Column(DataType.INTEGER)
  idPermission: number;

  @BelongsTo(() => Models.Grant, {
    foreignKey: 'idGrant',
    as: 'fkIdGrant',
    foreignKeyConstraint: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @AllowNull(false)
  @Column(DataType.INTEGER)
  idGrant: number;

  @BelongsTo(() => Models.GrantType, {
    foreignKey: 'idGrantType',
    as: 'fkIdGrantType',
    foreignKeyConstraint: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @AllowNull(false)
  @Column(DataType.INTEGER)
  idGrantType: number;

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