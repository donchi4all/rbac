import { Table, AutoIncrement, PrimaryKey, Column, Model, DataType, AllowNull, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import { GrantInterface } from './IGrant';

@Table({
  tableName: 'grant',
})
export class Grant extends Model<GrantInterface> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  title: string;

  @Column({
    type: DataType.STRING(255),
    defaultValue: '',
  })
  description: string;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  active: boolean;

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
