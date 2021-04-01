import { Table, AutoIncrement, PrimaryKey, Default, Column, Model, AllowNull, CreatedAt, UpdatedAt, DataType } from 'sequelize-typescript';
import { RoleInterface, RoleCreationType } from './IRole';

@Table
export class Role extends Model<RoleInterface, RoleCreationType> {
  @PrimaryKey
  @AutoIncrement
  @Default(0)
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  title: string;

  @Default('')
  @Column(DataType.STRING(255))
  description: string;

  @AllowNull(false)
  @Column(DataType.STRING(48))
  slug: string;

  @Default(true)
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  active: boolean;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;
}