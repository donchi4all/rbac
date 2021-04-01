import { Table, AutoIncrement, Default, PrimaryKey, Column, Model, DataType, AllowNull, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import { GrantInterface, GrantCreationType } from './IGrant';

@Table
export class Grant extends Model<GrantInterface, GrantCreationType> {
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
