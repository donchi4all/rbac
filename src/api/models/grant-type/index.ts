import { Table, AutoIncrement, PrimaryKey, Column, Model, DataType } from 'sequelize-typescript';
import { GrantTypeInterface } from './IGrantType';

@Table({
  tableName: 'grantType',
  createdAt: false,
  updatedAt: false,
})
export class GrantType extends Model<GrantTypeInterface> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number

  @Column({
    type: DataType.STRING(48),
    defaultValue: 'own',
  })
  name: 'any' | 'own'
}