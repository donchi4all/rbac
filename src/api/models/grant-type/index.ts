import { Table, AutoIncrement, PrimaryKey, Default, Column, Model, AllowNull, DataType } from 'sequelize-typescript';
import { GrantTypeInterface, GrantTypeCreationType } from './IGrantType';

@Table
export class GrantType extends Model<GrantTypeInterface, GrantTypeCreationType> {
  @PrimaryKey
  @AutoIncrement
  @Default(0)
  @Column(DataType.INTEGER)
  id: number

  @AllowNull(false)
  @Default('own')
  @Column(DataType.STRING(48))
  name: 'any' | 'own'
}