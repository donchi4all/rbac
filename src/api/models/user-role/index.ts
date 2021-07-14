import { Table, AutoIncrement, PrimaryKey, Column, Model, DataType, AllowNull, BelongsTo } from 'sequelize-typescript';

import { UserRoleInterface } from './IUserRole';
import * as Models from '../index';

@Table({
  tableName: 'userRole',
  createdAt: false,
  updatedAt: false,
})
export class UserRole extends Model<UserRoleInterface> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  userId: number;

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
}
