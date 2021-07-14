import { Table, AutoIncrement, PrimaryKey, Column, Model, DataType, AllowNull, BelongsTo } from 'sequelize-typescript';

import { UserPlatformInterface } from './IUserPlatform';
import * as Models from '../index';

@Table({
  tableName: 'userPlatform',
  createdAt: false,
  updatedAt: false,
})
export class UserPlatform extends Model<UserPlatformInterface> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  userId: number;

  @BelongsTo(() => Models.Platform, {
    foreignKey: 'platformId',
    as: 'fkPlatformId',
    foreignKeyConstraint: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @AllowNull(false)
  @Column(DataType.INTEGER)
  platformId: number;
}
